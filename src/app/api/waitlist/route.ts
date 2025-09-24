import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { validateReferralCode, getReferralBenefits } from '@/lib/referral-codes'
import { sendVerificationEmail } from '@/lib/email'
import { config, validateConfig } from '@/lib/config'
import { logger } from '@/lib/logger'
import { withRateLimit, waitlistRateLimiter, getUserIdentifier } from '@/lib/rate-limit'

// Validar configuración al inicio
try {
  validateConfig()
} catch (error) {
  logger.error({ err: error as Error, message: 'Configuración inválida' })
}

// Importar Prisma real o mock según disponibilidad
let prisma: any
try {
  prisma = require('@/lib/prisma').prisma
  logger.info('Prisma Client inicializado correctamente')
} catch (error) {
  logger.warn('Usando mock de Prisma (base de datos no disponible)')
  prisma = require('@/lib/prisma-mock').prisma
}

// Schema de validación para el waitlist
const waitlistSchema = z.object({
  email: z.string().email('Email inválido'),
  name: z.string().min(2, 'Nombre debe tener al menos 2 caracteres').optional(),
  company: z.string().optional(),
  referralCode: z.string().optional(),
  source: z.string().optional(),
  interests: z.array(z.string()).optional()
})

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  
  try {
    // Rate limiting
    const rateLimitResponse = await withRateLimit(
      request,
      waitlistRateLimiter,
      getUserIdentifier
    )
    
    if (rateLimitResponse) {
      return rateLimitResponse
    }

    const body = await request.json()
    
    // Validar los datos
    const validatedData = waitlistSchema.parse(body)
    
    logger.info({
      email: validatedData.email,
      hasName: !!validatedData.name,
      hasCompany: !!validatedData.company,
      hasReferralCode: !!validatedData.referralCode
    }, 'Solicitud de registro en waitlist')
    
    // Verificar si el email ya existe
    const existingUser = await prisma.waitlistUser.findUnique({
      where: { email: validatedData.email }
    })
    
    if (existingUser) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Este email ya está registrado en nuestra lista de espera' 
        },
        { status: 400 }
      )
    }
    
    // Generar token de verificación
    const verificationToken = Math.random().toString(36).substring(2, 15) + 
                            Math.random().toString(36).substring(2, 15)
    
    // Determinar tier basado en referral code
    let tier = 'BASIC'
    if (validatedData.referralCode) {
      const validation = validateReferralCode(validatedData.referralCode)
      if (validation.isValid && validation.tier) {
        tier = validation.tier
      }
    }
    
    // Crear usuario en waitlist
    const waitlistUser = await prisma.waitlistUser.create({
      data: {
        email: validatedData.email,
        name: validatedData.name,
        company: validatedData.company,
        referredBy: validatedData.referralCode,
        source: validatedData.source || 'prelaunch-page',
        interests: validatedData.interests || [],
        tier: tier as any,
        verificationToken,
        isVerified: false
      }
    })
    
    // Enviar email de verificación
    try {
      await sendVerificationEmail(waitlistUser.email, verificationToken, waitlistUser.name || undefined)
      logger.info({ email: waitlistUser.email }, 'Email de verificación enviado')
    } catch (emailError) {
      logger.warn({ email: waitlistUser.email, err: emailError }, 'Fallo enviando email de verificación')
      // No fallar la suscripción si el email falla
    }
    
    // Log para analytics
    logger.info({ email: waitlistUser.email, tier }, 'Usuario registrado en waitlist')
    
    const duration = Date.now() - startTime
    logger.info({ method: 'POST', path: '/api/waitlist', status: 200, durationMs: duration }, 'api_request')
    
    return NextResponse.json({
      success: true,
      message: 'Te has unido exitosamente a la lista de espera',
      data: {
        id: waitlistUser.id,
        email: waitlistUser.email,
        tier: waitlistUser.tier
      }
    })
    
  } catch (error: unknown) {
    const duration = Date.now() - startTime
    
    if (error instanceof z.ZodError) {
      logger.warn({ errors: error.errors }, 'Error de validación en waitlist')
      logger.info({ method: 'POST', path: '/api/waitlist', status: 400, durationMs: duration }, 'api_request')
      
      return NextResponse.json(
        {
          success: false,
          message: 'Datos inválidos',
          errors: error.errors
        },
        { status: 400 }
      )
    }

    logger.error({ err: error as Error, message: 'Error en waitlist API' })
    logger.info({ method: 'POST', path: '/api/waitlist', status: 500, durationMs: duration }, 'api_request')
    
    return NextResponse.json(
      {
        success: false,
        message: 'Error interno del servidor'
      },
      { status: 500 }
    )
  }
}

// GET para obtener estadísticas de waitlist (solo para admin)
export async function GET(request: NextRequest) {
  try {
    // Aquí podrías agregar autenticación de admin
    const { searchParams } = new URL(request.url)
    const adminKey = searchParams.get('admin_key')
    
    if (adminKey !== process.env.ADMIN_KEY) {
      return NextResponse.json(
        { success: false, message: 'No autorizado' },
        { status: 401 }
      )
    }
    
    // Obtener estadísticas
    const totalUsers = await prisma.waitlistUser.count()
    const verifiedUsers = await prisma.waitlistUser.count({
      where: { isVerified: true }
    })
    
    const usersByTier = await prisma.waitlistUser.groupBy({
      by: ['tier'],
      _count: { tier: true }
    })
    
    const recentUsers = await prisma.waitlistUser.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      select: {
        email: true,
        name: true,
        company: true,
        tier: true,
        createdAt: true,
        source: true
      }
    })
    
    return NextResponse.json({
      success: true,
      data: {
        totalUsers,
        verifiedUsers,
        usersByTier,
        recentUsers
      }
    })
    
  } catch (error) {
    console.error('Error obteniendo estadísticas de waitlist:', error)
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
