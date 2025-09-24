import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { PrismaClient, ExportStatus } from '@prisma/client'

const prisma = new PrismaClient()

interface UserData {
  profile: {
    id: string
    email: string
    name: string
    image?: string
    created_at: string
    updated_at: string
  }
  preferences: {
    language: string
    theme: string
    notifications: boolean
    created_at: string
    updated_at: string
  }
  usage: {
    login_count: number
    last_login: string
    features_used: string[]
    created_at: string
  }
  billing: {
    subscription_status: string
    plan: string
    payment_method: string
    invoices: any[]
    created_at: string
    updated_at: string
  }
  consent: {
    preferences: any
    created_at: string
    updated_at: string
  }
  technical: {
    ip_addresses: string[]
    user_agents: string[]
    sessions: any[]
    created_at: string
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    // Simular recopilación de datos del usuario
    // En producción, esto vendría de la base de datos real
    const userData: UserData = {
      profile: {
        id: session.user.id,
        email: session.user.email || '',
        name: session.user.name || '',
        image: session.user.image || undefined,
        created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 días atrás
        updated_at: new Date().toISOString()
      },
      preferences: {
        language: 'es',
        theme: 'dark',
        notifications: true,
        created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date().toISOString()
      },
      usage: {
        login_count: 45,
        last_login: new Date().toISOString(),
        features_used: ['dashboard', 'ai-assistant', 'workflow-builder', 'analytics'],
        created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
      },
      billing: {
        subscription_status: 'active',
        plan: 'pro',
        payment_method: 'stripe_card_****1234',
        invoices: [
          {
            id: 'inv_001',
            amount: 29.00,
            currency: 'EUR',
            status: 'paid',
            created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
          }
        ],
        created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date().toISOString()
      },
      consent: {
        preferences: {
          essential: true,
          analytics: true,
          marketing: false,
          functional: true,
          timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
        },
        created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date().toISOString()
      },
      technical: {
        ip_addresses: ['192.168.1.1', '10.0.0.1'],
        user_agents: [
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
          'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15'
        ],
        sessions: [
          {
            id: 'sess_001',
            created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
            last_activity: new Date().toISOString(),
            ip_address: '192.168.1.1',
            user_agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
          }
        ],
        created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
      }
    }

    // Crear metadatos de exportación
    const exportMetadata = {
      export_id: `export_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      user_id: session.user.id,
      export_date: new Date().toISOString(),
      format_version: '1.0',
      gdpr_compliant: true,
      data_categories: [
        'profile_data',
        'preference_data', 
        'usage_data',
        'billing_data',
        'consent_data',
        'technical_data'
      ],
      retention_period: '2 years',
      data_controller: 'Stack21 S.L.',
      dpo_contact: 'privacy@stack21.com'
    }

    // Crear el objeto de exportación completo
    const exportData = {
      metadata: exportMetadata,
      user_data: userData,
      legal_notice: {
        title: 'Exportación de Datos Personales - Stack21',
        description: 'Esta exportación contiene todos los datos personales que tenemos sobre ti, en cumplimiento con el GDPR y otras regulaciones de privacidad.',
        rights: [
          'Tienes derecho a acceder a tus datos personales',
          'Tienes derecho a rectificar datos incorrectos',
          'Tienes derecho a eliminar tus datos (derecho al olvido)',
          'Tienes derecho a la portabilidad de datos',
          'Tienes derecho a oponerte al procesamiento',
          'Tienes derecho a restringir el procesamiento'
        ],
        contact: {
          dpo: 'privacy@stack21.com',
          support: 'support@stack21.com',
          address: 'Madrid, España'
        }
      }
    }

    // Log de auditoría
    console.log(`Exportación de datos solicitada por usuario ${session.user.id}:`, {
      export_id: exportMetadata.export_id,
      timestamp: new Date().toISOString(),
      ip_address: request.headers.get('x-forwarded-for') || 'unknown'
    })

    // Retornar los datos en formato JSON
    return new NextResponse(JSON.stringify(exportData, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="stack21-data-export-${exportMetadata.export_id}.json"`,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })

  } catch (error) {
    console.error('Error exportando datos:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { format = 'json', include_technical = false } = body

    // Validar formato
    if (!['json', 'csv', 'xml'].includes(format)) {
      return NextResponse.json(
        { error: 'Formato no soportado. Use: json, csv, xml' },
        { status: 400 }
      )
    }

    // Simular procesamiento de exportación
    const exportJob = await prisma.dataExportJob.create({
      data: {
        userId: session.user.id,
        format,
        includeTechnical: include_technical,
        status: ExportStatus.PROCESSING,
        estimatedCompletion: new Date(Date.now() + 5 * 60 * 1000),
      },
    })

    // En producción, esto sería una cola de trabajos real
    console.log(`Trabajo de exportación creado:`, exportJob)

    return NextResponse.json({
      success: true,
      job: {
        id: exportJob.id,
        user_id: exportJob.userId,
        format: exportJob.format,
        include_technical: exportJob.includeTechnical,
        status: exportJob.status.toLowerCase(),
        created_at: exportJob.createdAt.toISOString(),
        estimated_completion: exportJob.estimatedCompletion?.toISOString(),
      },
      message: 'Trabajo de exportación iniciado. Recibirás un email cuando esté listo.'
    })

  } catch (error) {
    console.error('Error creando trabajo de exportación:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
