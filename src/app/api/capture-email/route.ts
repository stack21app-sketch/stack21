import { NextRequest, NextResponse } from 'next/server'

// Sistema simple de captura de emails
interface EmailSubmission {
  email: string
  timestamp: Date
  source: string
  ip?: string
  userAgent?: string
}

// Mock storage - en producción usarías una base de datos real
let emailList: EmailSubmission[] = []

export async function POST(request: NextRequest) {
  try {
    const { email, source = 'coming_soon' } = await request.json()

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: 'Email inválido' },
        { status: 400 }
      )
    }

    // Verificar si ya existe
    const exists = emailList.some(submission => submission.email === email)
    if (exists) {
      return NextResponse.json(
        { success: false, message: 'Este email ya está registrado' },
        { status: 400 }
      )
    }

    // Obtener IP y User Agent
    const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown'
    const userAgent = request.headers.get('user-agent') || 'unknown'

    // Agregar a la lista
    const submission: EmailSubmission = {
      email,
      timestamp: new Date(),
      source,
      ip,
      userAgent
    }

    emailList.push(submission)

    console.log('📧 Email capturado:', {
      email,
      source,
      timestamp: submission.timestamp,
      total: emailList.length
    })

    // En producción, aquí enviarías:
    // 1. A tu base de datos (Supabase, MongoDB, etc.)
    // 2. Email de bienvenida (SendGrid, Resend, etc.)
    // 3. A tu CRM (HubSpot, Mailchimp, etc.)

    return NextResponse.json({
      success: true,
      message: '¡Gracias! Te notificaremos cuando esté listo.',
      count: emailList.length
    })

  } catch (error) {
    console.error('Error en capture-email:', error)
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function GET() {
  // Endpoint para obtener estadísticas (solo en desarrollo)
  if (process.env.NODE_ENV === 'development') {
    return NextResponse.json({
      total: emailList.length,
      emails: emailList.slice(-10) // Últimos 10
    })
  }
  
  return NextResponse.json({ error: 'Not found' }, { status: 404 })
}
