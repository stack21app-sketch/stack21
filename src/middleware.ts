import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import logger from '@/lib/logger'

// Rate limiting store (en producción usar Redis)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

// Rate limiting configuration
const RATE_LIMITS = {
  '/api/auth': { requests: 5, window: 60 * 1000 }, // 5 requests per minute
  '/api/billing': { requests: 10, window: 60 * 1000 }, // 10 requests per minute
  '/api/legal': { requests: 20, window: 60 * 1000 }, // 20 requests per minute
  '/api/workspaces': { requests: 30, window: 60 * 1000 }, // 30 requests per minute
}

function getRateLimitKey(request: NextRequest): string {
  const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown'
  const path = new URL(request.url).pathname
  return `${ip}:${path}`
}

function checkRateLimit(key: string, limit: { requests: number; window: number }): boolean {
  const now = Date.now()
  const record = rateLimitStore.get(key)

  if (!record || now > record.resetTime) {
    rateLimitStore.set(key, { count: 1, resetTime: now + limit.window })
    return true
  }

  if (record.count >= limit.requests) {
    return false
  }

  record.count++
  return true
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const requestId = uuidv4()
  const start = Date.now()

  // Log request start
  logger.info({
    msg: 'incoming_request',
    requestId,
    method: request.method,
    url: request.url,
    ip: request.ip,
    userAgent: request.headers.get('user-agent'),
  })

  // Rate limiting
  for (const [path, limit] of Object.entries(RATE_LIMITS)) {
    if (pathname.startsWith(path)) {
      const key = getRateLimitKey(request)
      if (!checkRateLimit(key, limit)) {
        return new NextResponse(
          JSON.stringify({ 
            error: 'Rate limit exceeded',
            retryAfter: Math.ceil(limit.window / 1000)
          }),
          { 
            status: 429,
            headers: {
              'Content-Type': 'application/json',
              'Retry-After': Math.ceil(limit.window / 1000).toString(),
            }
          }
        )
      }
      break
    }
  }

  // Simple admin protection using ADMIN_KEY (cookie or query param)
  if (pathname.startsWith('/admin')) {
    const expectedKey = process.env.ADMIN_KEY
    const url = request.nextUrl
    const keyFromQuery = url.searchParams.get('key')
    const cookieKey = request.cookies.get('admin_key')?.value

    // If key is provided via query and matches, set cookie and redirect to clean URL
    if (keyFromQuery && expectedKey && keyFromQuery === expectedKey) {
      const redirectUrl = new URL('/admin', request.url)
      const resp = NextResponse.redirect(redirectUrl)
      resp.cookies.set('admin_key', expectedKey, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 días
      })
      return resp
    }

    // If no valid cookie, block
    if (!cookieKey || !expectedKey || cookieKey !== expectedKey) {
      return new NextResponse('Unauthorized', { status: 401 })
    }
  }

  // Security headers
  const response = NextResponse.next()
  response.headers.set('x-request-id', requestId)

  // Content Security Policy
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://js.stripe.com https://www.googletagmanager.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "img-src 'self' data: https: blob:",
    "font-src 'self' https://fonts.gstatic.com",
    "connect-src 'self' https://api.stripe.com https://www.google-analytics.com",
    "frame-src 'self' https://js.stripe.com https://hooks.stripe.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests"
  ].join('; ')

  response.headers.set('Content-Security-Policy', csp)
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload')

  // CORS headers for API routes
  if (pathname.startsWith('/api/')) {
    response.headers.set('Access-Control-Allow-Origin', process.env.NODE_ENV === 'production' 
      ? 'https://yourdomain.com' 
      : 'http://localhost:3000'
    )
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    response.headers.set('Access-Control-Max-Age', '86400')
  }

  // Log request end on finish (best-effort; in middleware we log immediately)
  const durationMs = Date.now() - start
  logger.info({
    msg: 'request_handled',
    requestId,
    method: request.method,
    url: request.url,
    status: response.status,
    durationMs,
  })

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)',
  ],
}