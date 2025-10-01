import { NextRequest, NextResponse } from 'next/server'

interface NotificationData {
  type: 'welcome' | 'launch' | 'feature_update' | 'payment_success' | 'payment_failed'
  email: string
  name?: string
  data?: any
}

export async function POST(request: NextRequest) {
  try {
    const { type, email, name, data }: NotificationData = await request.json()

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: 'Email inválido' },
        { status: 400 }
      )
    }

    // Enviar email según el tipo
    let result
    switch (type) {
      case 'welcome':
        result = await sendWelcomeEmail(email, name)
        break
      case 'launch':
        result = await sendLaunchEmail(email, name)
        break
      case 'feature_update':
        result = await sendFeatureUpdateEmail(email, name, data)
        break
      case 'payment_success':
        result = await sendPaymentSuccessEmail(email, name, data)
        break
      case 'payment_failed':
        result = await sendPaymentFailedEmail(email, name, data)
        break
      default:
        return NextResponse.json(
          { success: false, message: 'Tipo de notificación no válido' },
          { status: 400 }
        )
    }

    return NextResponse.json(result)

  } catch (error) {
    console.error('Error sending notification:', error)
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

async function sendWelcomeEmail(email: string, name?: string) {
  // Mock - en producción usarías SendGrid, Resend, etc.
  console.log(`📧 Enviando email de bienvenida a: ${email}`)
  
  const emailData = {
    to: email,
    subject: '¡Bienvenido a Stack21! 🚀',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #2563eb; font-size: 28px; margin-bottom: 10px;">¡Hola ${name || 'Usuario'}!</h1>
          <p style="color: #6b7280; font-size: 16px;">Gracias por unirte a Stack21</p>
        </div>
        
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="color: #1f2937; margin-bottom: 15px;">¿Qué puedes esperar?</h2>
          <ul style="color: #4b5563; line-height: 1.6;">
            <li>🚀 Automatización inteligente de procesos</li>
            <li>🤖 IA integrada para workflows</li>
            <li>🔗 100+ integraciones disponibles</li>
            <li>📊 Analytics en tiempo real</li>
          </ul>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <p style="color: #6b7280; margin-bottom: 20px;">
            Estamos trabajando duro para traerte la mejor experiencia.
          </p>
          <p style="color: #6b7280;">
            Te notificaremos tan pronto como esté listo.
          </p>
        </div>
        
        <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; text-align: center;">
          <p style="color: #9ca3af; font-size: 14px;">
            Saludos,<br>El equipo de Stack21
          </p>
        </div>
      </div>
    `
  }

  // Simular delay de envío
  await new Promise(resolve => setTimeout(resolve, 1000))

  return { success: true, message: 'Email de bienvenida enviado' }
}

async function sendLaunchEmail(email: string, name?: string) {
  console.log(`🎉 Enviando email de lanzamiento a: ${email}`)
  
  const emailData = {
    to: email,
    subject: '🎉 ¡Stack21 ya está disponible!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #2563eb; font-size: 32px; margin-bottom: 10px;">¡Es oficial!</h1>
          <p style="color: #6b7280; font-size: 18px;">Stack21 ya está disponible</p>
        </div>
        
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 12px; text-align: center; margin-bottom: 20px;">
          <h2 style="color: white; margin-bottom: 15px; font-size: 24px;">¡Tu acceso está listo!</h2>
          <p style="color: rgba(255,255,255,0.9); margin-bottom: 25px;">
            Accede a tu cuenta y comienza a automatizar tu negocio hoy mismo.
          </p>
          <a href="${process.env.NEXTAUTH_URL}/dashboard" style="background: white; color: #667eea; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
            Acceder a Stack21
          </a>
        </div>
        
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h3 style="color: #1f2937; margin-bottom: 15px;">¿Qué puedes hacer ahora?</h3>
          <ul style="color: #4b5563; line-height: 1.6;">
            <li>✅ Crear tu primer workflow</li>
            <li>✅ Conectar tus herramientas favoritas</li>
            <li>✅ Configurar automatizaciones</li>
            <li>✅ Invitar a tu equipo</li>
          </ul>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <p style="color: #6b7280;">
            Si tienes alguna pregunta, no dudes en contactarnos.
          </p>
        </div>
        
        <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; text-align: center;">
          <p style="color: #9ca3af; font-size: 14px;">
            ¡Gracias por ser parte de nuestra comunidad!<br>El equipo de Stack21
          </p>
        </div>
      </div>
    `
  }

  await new Promise(resolve => setTimeout(resolve, 1000))

  return { success: true, message: 'Email de lanzamiento enviado' }
}

async function sendFeatureUpdateEmail(email: string, name?: string, data?: any) {
  console.log(`🆕 Enviando email de nueva característica a: ${email}`)
  
  return { success: true, message: 'Email de actualización enviado' }
}

async function sendPaymentSuccessEmail(email: string, name?: string, data?: any) {
  console.log(`💰 Enviando email de pago exitoso a: ${email}`)
  
  return { success: true, message: 'Email de pago exitoso enviado' }
}

async function sendPaymentFailedEmail(email: string, name?: string, data?: any) {
  console.log(`❌ Enviando email de pago fallido a: ${email}`)
  
  return { success: true, message: 'Email de pago fallido enviado' }
}
