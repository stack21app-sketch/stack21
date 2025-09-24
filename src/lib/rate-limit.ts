// Sistema de rate limiting para producción
import { NextRequest } from 'next/server'
import { config } from './config'
import { logger } from './logger'

interface RateLimitEntry {
  count: number
  resetTime: number
}

// Cache en memoria (en producción usar Redis)
const rateLimitCache = new Map<string, RateLimitEntry>()

export class RateLimiter {
  private maxRequests: number
  private windowMs: number

  constructor(maxRequests?: number, windowMs?: number) {
    this.maxRequests = maxRequests || config.rateLimit.max
    this.windowMs = windowMs || config.rateLimit.window
  }

  private getKey(identifier: string): string {
    return `rate_limit:${identifier}`
  }

  private cleanup() {
    const now = Date.now()
    for (const [key, entry] of Array.from(rateLimitCache.entries())) {
      if (now > entry.resetTime) {
        rateLimitCache.delete(key)
      }
    }
  }

  async checkLimit(identifier: string): Promise<{
    allowed: boolean
    remaining: number
    resetTime: number
  }> {
    this.cleanup()
    
    const key = this.getKey(identifier)
    const now = Date.now()
    const entry = rateLimitCache.get(key)

    if (!entry || now > entry.resetTime) {
      // Nueva ventana de tiempo
      const newEntry: RateLimitEntry = {
        count: 1,
        resetTime: now + this.windowMs,
      }
      rateLimitCache.set(key, newEntry)
      
      logger.debug({ identifier, remaining: this.maxRequests - 1 }, 'Rate limit: Nueva ventana creada')
      
      return {
        allowed: true,
        remaining: this.maxRequests - 1,
        resetTime: newEntry.resetTime,
      }
    }

    if (entry.count >= this.maxRequests) {
      logger.warn({ 
        identifier, 
        count: entry.count, 
        maxRequests: this.maxRequests,
        resetTime: entry.resetTime 
      }, 'Rate limit excedido')
      
      return {
        allowed: false,
        remaining: 0,
        resetTime: entry.resetTime,
      }
    }

    // Incrementar contador
    entry.count++
    rateLimitCache.set(key, entry)
    
    logger.debug({ 
      identifier, 
      count: entry.count, 
      remaining: this.maxRequests - entry.count 
    }, 'Rate limit: Solicitud permitida')
    
    return {
      allowed: true,
      remaining: this.maxRequests - entry.count,
      resetTime: entry.resetTime,
    }
  }

  async resetLimit(identifier: string): Promise<void> {
    const key = this.getKey(identifier)
    rateLimitCache.delete(key)
    logger.info({ identifier }, 'Rate limit reseteado')
  }
}

// Instancias predefinidas
export const waitlistRateLimiter = new RateLimiter(10, 15 * 60 * 1000) // 10 requests por 15 minutos
export const apiRateLimiter = new RateLimiter(100, 15 * 60 * 1000) // 100 requests por 15 minutos
export const authRateLimiter = new RateLimiter(5, 15 * 60 * 1000) // 5 requests por 15 minutos

// Middleware para rate limiting
export async function withRateLimit(
  request: NextRequest,
  rateLimiter: RateLimiter,
  getIdentifier: (request: NextRequest) => string
) {
  const identifier = getIdentifier(request)
  const result = await rateLimiter.checkLimit(identifier)

  if (!result.allowed) {
    return new Response(
      JSON.stringify({
        error: 'Rate limit exceeded',
        message: 'Demasiadas solicitudes. Intenta de nuevo más tarde.',
        retryAfter: Math.ceil((result.resetTime - Date.now()) / 1000),
      }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': Math.ceil((result.resetTime - Date.now()) / 1000).toString(),
          'X-RateLimit-Limit': rateLimiter['maxRequests'].toString(),
          'X-RateLimit-Remaining': result.remaining.toString(),
          'X-RateLimit-Reset': result.resetTime.toString(),
        },
      }
    )
  }

  return null
}

// Funciones helper para obtener identificadores
export function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const realIP = request.headers.get('x-real-ip')
  
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  
  if (realIP) {
    return realIP
  }
  
  return 'unknown'
}

export function getUserIdentifier(request: NextRequest): string {
  const ip = getClientIP(request)
  const userAgent = request.headers.get('user-agent') || 'unknown'
  
  // Crear un hash simple del user agent para identificar usuarios únicos
  const userAgentHash = userAgent.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0)
    return a & a
  }, 0)
  
  return `${ip}:${userAgentHash}`
}
