import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

interface PrivacySettings {
  id: string
  user_id: string
  data_processing: {
    analytics: boolean
    marketing: boolean
    profiling: boolean
    automated_decision_making: boolean
  }
  communications: {
    email_notifications: boolean
    marketing_emails: boolean
    sms_notifications: boolean
    push_notifications: boolean
  }
  data_sharing: {
    third_parties: boolean
    affiliates: boolean
    research: boolean
    government_requests: boolean
  }
  retention: {
    profile_data: number // días
    usage_data: number
    technical_data: number
    billing_data: number
  }
  created_at: string
  updated_at: string
}

// Simulación de base de datos (en producción usar Prisma)
const privacySettings: PrivacySettings[] = []

export async function GET(request: NextRequest) {
  try {
    const token = await getToken({ req: request })
    
    if (!token || !token.sub) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    // Buscar configuración del usuario (DB)
    const userSettings = await prisma.privacySettings.findUnique({
      where: { userId: token.sub },
    })

    if (!userSettings) {
      // Retornar configuración por defecto
      return NextResponse.json({
        settings: {
          data_processing: {
            analytics: false,
            marketing: false,
            profiling: false,
            automated_decision_making: false
          },
          communications: {
            email_notifications: true,
            marketing_emails: false,
            sms_notifications: false,
            push_notifications: true
          },
          data_sharing: {
            third_parties: false,
            affiliates: false,
            research: false,
            government_requests: true // Obligatorio por ley
          },
          retention: {
            profile_data: 730, // 2 años
            usage_data: 365, // 1 año
            technical_data: 90, // 3 meses
            billing_data: 2555 // 7 años (obligatorio fiscal)
          }
        },
        is_default: true
      })
    }

    return NextResponse.json({
      settings: {
        data_processing: userSettings.dataProcessing as any,
        communications: userSettings.communications as any,
        data_sharing: userSettings.dataSharing as any,
        retention: userSettings.retention as any,
      },
      is_default: false,
      last_updated: userSettings.updatedAt
    })

  } catch (error) {
    console.error('Error obteniendo configuración de privacidad:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const token = await getToken({ req: request })
    
    if (!token || !token.sub) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { settings } = body

    // Validar estructura de configuración
    if (!settings || typeof settings !== 'object') {
      return NextResponse.json(
        { error: 'Configuración de privacidad requerida' },
        { status: 400 }
      )
    }

    // Validar secciones requeridas
    const requiredSections = ['data_processing', 'communications', 'data_sharing', 'retention']
    for (const section of requiredSections) {
      if (!settings[section] || typeof settings[section] !== 'object') {
        return NextResponse.json(
          { error: `Sección ${section} requerida` },
          { status: 400 }
        )
      }
    }

    // Validar valores específicos
    const validationErrors = validatePrivacySettings(settings)
    if (validationErrors.length > 0) {
      return NextResponse.json(
        { error: 'Configuración inválida', details: validationErrors },
        { status: 400 }
      )
    }

    // Buscar configuración existente
    const privacySettingsData = await prisma.privacySettings.upsert({
      where: { userId: token.sub },
      update: {
        dataProcessing: settings.data_processing as any,
        communications: settings.communications as any,
        dataSharing: settings.data_sharing as any,
        retention: settings.retention as any,
      },
      create: {
        userId: token.sub,
        dataProcessing: settings.data_processing as any,
        communications: settings.communications as any,
        dataSharing: settings.data_sharing as any,
        retention: settings.retention as any,
      },
    })

    // Aplicar cambios de configuración
    await applyPrivacySettings({
      id: privacySettingsData.id,
      user_id: privacySettingsData.userId as any,
      data_processing: privacySettingsData.dataProcessing as any,
      communications: privacySettingsData.communications as any,
      data_sharing: privacySettingsData.dataSharing as any,
      retention: privacySettingsData.retention as any,
      created_at: (privacySettingsData as any).createdAt || new Date(),
      updated_at: (privacySettingsData as any).updatedAt || new Date(),
    } as any)

    // Log de auditoría
    console.log(`Configuración de privacidad actualizada para usuario ${token.sub}:`, {
      settings: privacySettingsData,
      timestamp: new Date().toISOString(),
      ip_address: request.headers.get('x-forwarded-for') || 'unknown'
    })

    return NextResponse.json({
      success: true,
      settings: {
        data_processing: privacySettingsData.dataProcessing as any,
        communications: privacySettingsData.communications as any,
        data_sharing: privacySettingsData.dataSharing as any,
        retention: privacySettingsData.retention as any,
      },
      message: 'Configuración de privacidad actualizada correctamente'
    })

  } catch (error) {
    console.error('Error actualizando configuración de privacidad:', error)
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

    // Eliminar configuración del usuario en DB
    await prisma.privacySettings.delete({ where: { userId: token.sub } }).catch(() => null)

    // Aplicar configuración por defecto (más restrictiva)
    await applyDefaultPrivacySettings(token.sub)

    // Log de auditoría
    console.log(`Configuración de privacidad eliminada para usuario ${token.sub}:`, {
      timestamp: new Date().toISOString()
    })

    return NextResponse.json({
      success: true,
      message: 'Configuración de privacidad eliminada. Se aplicará la configuración por defecto.'
    })

  } catch (error) {
    console.error('Error eliminando configuración de privacidad:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// Función para validar configuración de privacidad
function validatePrivacySettings(settings: any): string[] {
  const errors: string[] = []

  // Validar data_processing
  if (settings.data_processing) {
    const dp = settings.data_processing
    if (typeof dp.analytics !== 'boolean') errors.push('data_processing.analytics debe ser booleano')
    if (typeof dp.marketing !== 'boolean') errors.push('data_processing.marketing debe ser booleano')
    if (typeof dp.profiling !== 'boolean') errors.push('data_processing.profiling debe ser booleano')
    if (typeof dp.automated_decision_making !== 'boolean') errors.push('data_processing.automated_decision_making debe ser booleano')
  }

  // Validar communications
  if (settings.communications) {
    const comm = settings.communications
    if (typeof comm.email_notifications !== 'boolean') errors.push('communications.email_notifications debe ser booleano')
    if (typeof comm.marketing_emails !== 'boolean') errors.push('communications.marketing_emails debe ser booleano')
    if (typeof comm.sms_notifications !== 'boolean') errors.push('communications.sms_notifications debe ser booleano')
    if (typeof comm.push_notifications !== 'boolean') errors.push('communications.push_notifications debe ser booleano')
  }

  // Validar data_sharing
  if (settings.data_sharing) {
    const ds = settings.data_sharing
    if (typeof ds.third_parties !== 'boolean') errors.push('data_sharing.third_parties debe ser booleano')
    if (typeof ds.affiliates !== 'boolean') errors.push('data_sharing.affiliates debe ser booleano')
    if (typeof ds.research !== 'boolean') errors.push('data_sharing.research debe ser booleano')
    if (typeof ds.government_requests !== 'boolean') errors.push('data_sharing.government_requests debe ser booleano')
  }

  // Validar retention
  if (settings.retention) {
    const ret = settings.retention
    if (typeof ret.profile_data !== 'number' || ret.profile_data < 0) errors.push('retention.profile_data debe ser un número positivo')
    if (typeof ret.usage_data !== 'number' || ret.usage_data < 0) errors.push('retention.usage_data debe ser un número positivo')
    if (typeof ret.technical_data !== 'number' || ret.technical_data < 0) errors.push('retention.technical_data debe ser un número positivo')
    if (typeof ret.billing_data !== 'number' || ret.billing_data < 0) errors.push('retention.billing_data debe ser un número positivo')
  }

  return errors
}

// Función para aplicar configuración de privacidad
async function applyPrivacySettings(settings: PrivacySettings) {
  try {
    console.log(`Aplicando configuración de privacidad para usuario ${settings.user_id}:`, settings)

    // Aplicar configuración de procesamiento de datos
    if (!settings.data_processing.analytics) {
      // Deshabilitar analytics
      console.log('Analytics deshabilitado')
    }

    if (!settings.data_processing.marketing) {
      // Deshabilitar marketing
      console.log('Marketing deshabilitado')
    }

    if (!settings.data_processing.profiling) {
      // Deshabilitar perfilado
      console.log('Perfilado deshabilitado')
    }

    if (!settings.data_processing.automated_decision_making) {
      // Deshabilitar decisiones automatizadas
      console.log('Decisiones automatizadas deshabilitadas')
    }

    // Aplicar configuración de comunicaciones
    if (!settings.communications.email_notifications) {
      // Deshabilitar notificaciones por email
      console.log('Notificaciones por email deshabilitadas')
    }

    if (!settings.communications.marketing_emails) {
      // Deshabilitar emails de marketing
      console.log('Emails de marketing deshabilitados')
    }

    // Aplicar configuración de retención
    console.log(`Períodos de retención actualizados:`, settings.retention)

    // En producción, aquí se aplicarían los cambios reales en la base de datos
    // y se configurarían los sistemas según las preferencias del usuario

  } catch (error) {
    console.error('Error aplicando configuración de privacidad:', error)
    throw error
  }
}

// Función para aplicar configuración por defecto
async function applyDefaultPrivacySettings(userId: string) {
  try {
    console.log(`Aplicando configuración por defecto para usuario ${userId}`)

    // Configuración más restrictiva por defecto
    const defaultSettings = {
      data_processing: {
        analytics: false,
        marketing: false,
        profiling: false,
        automated_decision_making: false
      },
      communications: {
        email_notifications: true,
        marketing_emails: false,
        sms_notifications: false,
        push_notifications: true
      },
      data_sharing: {
        third_parties: false,
        affiliates: false,
        research: false,
        government_requests: true
      },
      retention: {
        profile_data: 730,
        usage_data: 365,
        technical_data: 90,
        billing_data: 2555
      }
    }

    // Aplicar configuración por defecto
    await applyPrivacySettings({
      id: `privacy_default_${Date.now()}`,
      user_id: userId,
      ...defaultSettings,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })

  } catch (error) {
    console.error('Error aplicando configuración por defecto:', error)
    throw error
  }
}
