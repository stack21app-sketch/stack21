import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { PrismaClient } from '@prisma/client'

interface ConsentPreferences {
  essential: boolean
  analytics: boolean
  marketing: boolean
  functional: boolean
  timestamp: string
  ip_address?: string
  user_agent?: string
}

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const token = await getToken({ req: request })
    
    if (!token || !token.sub) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    // Buscar consentimiento del usuario (DB)
    const userConsent = await prisma.userConsent.findUnique({
      where: { userId: token.sub },
    })

    if (!userConsent) {
      return NextResponse.json({
        consent: null,
        message: 'No se encontró consentimiento previo'
      })
    }

    return NextResponse.json({
      consent: {
        id: userConsent.id,
        preferences: userConsent.preferences as any,
        created_at: userConsent.createdAt,
        updated_at: userConsent.updatedAt,
        version: userConsent.version
      }
    })

  } catch (error) {
    console.error('Error obteniendo consentimiento:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = await getToken({ req: request })
    
    if (!token || !token.sub) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { preferences } = body

    // Validar preferencias
    if (!preferences || typeof preferences !== 'object') {
      return NextResponse.json(
        { error: 'Preferencias de consentimiento requeridas' },
        { status: 400 }
      )
    }

    // Validar estructura de preferencias
    const requiredFields = ['essential', 'analytics', 'marketing', 'functional']
    for (const field of requiredFields) {
      if (typeof preferences[field] !== 'boolean') {
        return NextResponse.json(
          { error: `Campo ${field} debe ser un booleano` },
          { status: 400 }
        )
      }
    }

    // Las cookies esenciales siempre deben ser true
    if (!preferences.essential) {
      return NextResponse.json(
        { error: 'Las cookies esenciales no pueden ser deshabilitadas' },
        { status: 400 }
      )
    }

    const ip_address = request.headers.get('x-forwarded-for') || 
                      request.headers.get('x-real-ip') || 
                      'unknown'
    const user_agent = request.headers.get('user-agent') || 'unknown'

    const consentData: ConsentPreferences = {
      ...preferences,
      timestamp: new Date().toISOString(),
      ip_address,
      user_agent
    }

    // Upsert en DB
    const consentRecord = await prisma.userConsent.upsert({
      where: { userId: token.sub },
      update: {
        preferences: consentData as any,
        ipAddress: ip_address,
        userAgent: user_agent,
        version: '1.0',
      },
      create: {
        userId: token.sub,
        preferences: consentData as any,
        ipAddress: ip_address,
        userAgent: user_agent,
        version: '1.0',
      },
    })

    // Aplicar cambios de consentimiento
    await applyConsentChanges(consentData)

    // Log de auditoría
    console.log(`Consentimiento actualizado para usuario ${token.sub}:`, {
      preferences: consentData,
      ip_address,
      user_agent,
      timestamp: new Date().toISOString()
    })

    return NextResponse.json({
      success: true,
      consent: {
        id: consentRecord.id,
        preferences: consentData,
        created_at: consentRecord.createdAt,
        updated_at: consentRecord.updatedAt,
        version: consentRecord.version
      },
      message: 'Consentimiento actualizado correctamente'
    })

  } catch (error) {
    console.error('Error actualizando consentimiento:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const token = await getToken({ req: request })
    
    if (!token || !token.sub) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    // Eliminar consentimiento del usuario en DB
    await prisma.userConsent.delete({
      where: { userId: token.sub },
    }).catch(() => null)

    // Aplicar consentimiento mínimo (solo esenciales)
    await applyConsentChanges({
      essential: true,
      analytics: false,
      marketing: false,
      functional: false,
      timestamp: new Date().toISOString()
    })

    // Log de auditoría
    console.log(`Consentimiento eliminado para usuario ${token.sub}:`, {
      timestamp: new Date().toISOString()
    })

    return NextResponse.json({
      success: true,
      message: 'Consentimiento eliminado correctamente'
    })

  } catch (error) {
    console.error('Error eliminando consentimiento:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// Función para aplicar cambios de consentimiento
async function applyConsentChanges(preferences: ConsentPreferences) {
  try {
    // Aquí se aplicarían los cambios reales según las preferencias
    // Por ejemplo:
    
    if (preferences.analytics) {
      // Habilitar Google Analytics
      console.log('Analytics habilitado')
    } else {
      // Deshabilitar Google Analytics
      console.log('Analytics deshabilitado')
    }

    if (preferences.marketing) {
      // Habilitar scripts de marketing
      console.log('Marketing habilitado')
    } else {
      // Deshabilitar scripts de marketing
      console.log('Marketing deshabilitado')
    }

    if (preferences.functional) {
      // Habilitar características funcionales
      console.log('Características funcionales habilitadas')
    } else {
      // Deshabilitar características funcionales
      console.log('Características funcionales deshabilitadas')
    }

    // En producción, aquí se actualizarían las configuraciones reales
    // de cookies, scripts de terceros, etc.

  } catch (error) {
    console.error('Error aplicando cambios de consentimiento:', error)
    throw error
  }
}
