// Security utilities and validations
import { z } from 'zod'

// Rate limiting configuration
export const RATE_LIMITS = {
  API_CALLS: 100, // per hour
  LOGIN_ATTEMPTS: 5, // per 15 minutes
  PASSWORD_RESET: 3, // per hour
  EMAIL_VERIFICATION: 5, // per hour
} as const

// Input validation schemas
export const userInputSchema = z.object({
  email: z.string().email('Email inválido').max(255),
  name: z.string().min(2, 'Nombre muy corto').max(100).regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'Nombre contiene caracteres inválidos'),
  password: z.string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'La contraseña debe contener al menos una mayúscula, una minúscula y un número'),
})

export const workspaceInputSchema = z.object({
  name: z.string().min(2, 'Nombre muy corto').max(100),
  slug: z.string().min(2, 'Slug muy corto').max(50).regex(/^[a-z0-9-]+$/, 'Slug solo puede contener letras minúsculas, números y guiones'),
  description: z.string().max(500).optional(),
})

export const aiPromptSchema = z.object({
  prompt: z.string().min(1, 'Prompt requerido').max(4000, 'Prompt muy largo'),
  action: z.enum(['generate_code', 'explain_concept', 'suggest_improvements', 'debug_error', 'create_documentation', 'industry_assistant']),
  context: z.record(z.any()).optional(),
})

// XSS Protection
export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remove < and >
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim()
}

// SQL Injection Protection
export function escapeSqlString(input: string): string {
  return input
    .replace(/'/g, "''") // Escape single quotes
    .replace(/--/g, '') // Remove SQL comments
    .replace(/;/g, '') // Remove semicolons
}

// CSRF Protection
export function generateCSRFToken(): string {
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
}

export function validateCSRFToken(token: string, sessionToken: string): boolean {
  return token === sessionToken && token.length === 64
}

// Rate limiting
class RateLimiter {
  private attempts: Map<string, { count: number; resetTime: number }> = new Map()

  isAllowed(key: string, limit: number, windowMs: number): boolean {
    const now = Date.now()
    const record = this.attempts.get(key)

    if (!record || now > record.resetTime) {
      this.attempts.set(key, { count: 1, resetTime: now + windowMs })
      return true
    }

    if (record.count >= limit) {
      return false
    }

    record.count++
    return true
  }

  getRemainingTime(key: string): number {
    const record = this.attempts.get(key)
    if (!record) return 0
    return Math.max(0, record.resetTime - Date.now())
  }
}

export const rateLimiter = new RateLimiter()

// Security headers
export const securityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
}

// Input validation helper
export function validateInput<T>(schema: z.ZodSchema<T>, data: unknown): { success: boolean; data?: T; error?: string } {
  try {
    const result = schema.parse(data)
    return { success: true, data: result }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { 
        success: false, 
        error: error.errors.map(e => e.message).join(', ') 
      }
    }
    return { success: false, error: 'Error de validación' }
  }
}

// Password strength checker
export function checkPasswordStrength(password: string): {
  score: number
  feedback: string[]
  isStrong: boolean
} {
  const feedback: string[] = []
  let score = 0

  if (password.length >= 8) score++
  else feedback.push('Usa al menos 8 caracteres')

  if (/[a-z]/.test(password)) score++
  else feedback.push('Incluye letras minúsculas')

  if (/[A-Z]/.test(password)) score++
  else feedback.push('Incluye letras mayúsculas')

  if (/\d/.test(password)) score++
  else feedback.push('Incluye números')

  if (/[^a-zA-Z0-9]/.test(password)) score++
  else feedback.push('Incluye símbolos especiales')

  if (password.length >= 12) score++
  else if (password.length >= 8) feedback.push('Considera usar 12+ caracteres para mayor seguridad')

  return {
    score,
    feedback,
    isStrong: score >= 4
  }
}

// Email validation
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email) && email.length <= 255
}

// URL validation
export function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

// File upload validation
export function validateFileUpload(file: File, options: {
  maxSize: number
  allowedTypes: string[]
  allowedExtensions: string[]
}): { valid: boolean; error?: string } {
  if (file.size > options.maxSize) {
    return { valid: false, error: `El archivo es muy grande. Máximo ${options.maxSize / 1024 / 1024}MB` }
  }

  if (!options.allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Tipo de archivo no permitido' }
  }

  const extension = file.name.split('.').pop()?.toLowerCase()
  if (!extension || !options.allowedExtensions.includes(extension)) {
    return { valid: false, error: 'Extensión de archivo no permitida' }
  }

  return { valid: true }
}
