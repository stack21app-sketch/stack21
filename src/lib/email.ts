// Sistema de email para verificación de waitlist

interface EmailData {
  to: string
  subject: string
  html: string
  text?: string
}

export async function sendVerificationEmail(email: string, token: string, name?: string) {
  const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${token}`
  
  const emailData: EmailData = {
    to: email,
    subject: '¡Bienvenido a Stack21! Verifica tu email',
    html: generateVerificationEmailHTML(name || 'Usuario', verificationUrl),
    text: generateVerificationEmailText(name || 'Usuario', verificationUrl)
  }
  
  // Si hay configuración SMTP, enviar email real
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    return await sendEmailViaSMTP(emailData)
  }
  
  // Si no, solo log para desarrollo
  console.log('📧 Email de verificación (desarrollo):')
  console.log('To:', email)
  console.log('Subject:', emailData.subject)
  console.log('URL:', verificationUrl)
  console.log('---')
  
  return { success: true, message: 'Email logueado (modo desarrollo)' }
}

export async function sendWelcomeEmail(email: string, name?: string, tier?: string) {
  const emailData: EmailData = {
    to: email,
    subject: '¡Bienvenido a la revolución de Stack21!',
    html: generateWelcomeEmailHTML(name || 'Usuario', tier || 'BASIC'),
    text: generateWelcomeEmailText(name || 'Usuario', tier || 'BASIC')
  }
  
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    return await sendEmailViaSMTP(emailData)
  }
  
  console.log('📧 Email de bienvenida (desarrollo):')
  console.log('To:', email)
  console.log('Subject:', emailData.subject)
  console.log('---')
  
  return { success: true, message: 'Email logueado (modo desarrollo)' }
}

// Envío genérico: útil para nodos de workflow
export async function sendCustomEmail(to: string, subject: string, html: string, text?: string) {
  const emailData: EmailData = { to, subject, html, text }

  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    return await sendEmailViaSMTP(emailData)
  }

  console.log('📧 Email (desarrollo):')
  console.log('To:', to)
  console.log('Subject:', subject)
  console.log('HTML:', html.slice(0, 200) + '...')
  return { success: true, message: 'Email logueado (modo desarrollo)' }
}

async function sendEmailViaSMTP(emailData: EmailData) {
  try {
    const nodemailer = require('nodemailer')
    
    // Configuración de transporte SMTP
    const transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_PORT === '465', // true para 465, false para otros puertos
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      },
      tls: {
        rejectUnauthorized: false // Para desarrollo, en producción usar certificados válidos
      }
    })
    
    // Verificar conexión
    await transporter.verify()
    console.log('✅ Servidor SMTP verificado correctamente')
    
    // Enviar email
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || 'Stack21 <noreply@stack21.com>',
      to: emailData.to,
      subject: emailData.subject,
      html: emailData.html,
      text: emailData.text,
      headers: {
        'X-Mailer': 'Stack21 Waitlist System',
        'X-Priority': '3'
      }
    })
    
    console.log('✅ Email enviado exitosamente:', info.messageId)
    return { success: true, message: 'Email enviado exitosamente', messageId: info.messageId }
  } catch (error) {
    console.error('❌ Error enviando email:', error)
    return { success: false, message: `Error enviando email: ${error instanceof Error ? error.message : String(error)}` }
  }
}

function generateVerificationEmailHTML(name: string, verificationUrl: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verifica tu email - Stack21</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 28px;">Stack21</h1>
          <p style="color: #ffffff; margin: 10px 0 0 0; opacity: 0.9;">Automatización Inteligente</p>
        </div>
        
        <!-- Content -->
        <div style="padding: 40px 20px;">
          <h2 style="color: #333333; margin: 0 0 20px 0;">¡Hola ${name}!</h2>
          <p style="color: #666666; line-height: 1.6; margin: 0 0 20px 0;">
            Gracias por unirte a la lista de espera de Stack21. Para completar tu suscripción, 
            por favor verifica tu dirección de email haciendo clic en el botón de abajo.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" 
               style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                      color: #ffffff; text-decoration: none; padding: 15px 30px; 
                      border-radius: 8px; font-weight: bold; font-size: 16px;">
              Verificar Email
            </a>
          </div>
          
          <p style="color: #666666; line-height: 1.6; margin: 20px 0 0 0; font-size: 14px;">
            Si el botón no funciona, copia y pega este enlace en tu navegador:<br>
            <a href="${verificationUrl}" style="color: #667eea;">${verificationUrl}</a>
          </p>
        </div>
        
        <!-- Footer -->
        <div style="background-color: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #e9ecef;">
          <p style="color: #666666; margin: 0; font-size: 12px;">
            © 2024 Stack21. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </body>
    </html>
  `
}

function generateVerificationEmailText(name: string, verificationUrl: string): string {
  return `
¡Hola ${name}!

Gracias por unirte a la lista de espera de Stack21.

Para completar tu suscripción, por favor verifica tu dirección de email visitando este enlace:

${verificationUrl}

Si tienes alguna pregunta, no dudes en contactarnos.

¡Bienvenido a la revolución de la automatización!

El equipo de Stack21
  `
}

function generateWelcomeEmailHTML(name: string, tier: string): string {
  const tierInfo = getTierInfo(tier)
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>¡Bienvenido a Stack21!</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 28px;">¡Bienvenido a Stack21!</h1>
          <p style="color: #ffffff; margin: 10px 0 0 0; opacity: 0.9;">Tu email ha sido verificado</p>
        </div>
        
        <!-- Content -->
        <div style="padding: 40px 20px;">
          <h2 style="color: #333333; margin: 0 0 20px 0;">¡Hola ${name}!</h2>
          <p style="color: #666666; line-height: 1.6; margin: 0 0 20px 0;">
            Tu email ha sido verificado exitosamente. Ahora eres parte de la lista de espera 
            de Stack21 con acceso <strong>${tierInfo.name}</strong>.
          </p>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #333333; margin: 0 0 15px 0;">Tu Tier: ${tierInfo.name}</h3>
            <p style="color: #666666; margin: 0 0 10px 0;">Descuento: <strong>${tierInfo.discount}</strong></p>
            <ul style="color: #666666; margin: 0; padding-left: 20px;">
              ${tierInfo.benefits.map(benefit => `<li>${benefit}</li>`).join('')}
            </ul>
          </div>
          
          <p style="color: #666666; line-height: 1.6; margin: 20px 0;">
            Te mantendremos informado sobre el progreso de Stack21 y te notificaremos 
            cuando esté listo para el lanzamiento.
          </p>
        </div>
        
        <!-- Footer -->
        <div style="background-color: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #e9ecef;">
          <p style="color: #666666; margin: 0; font-size: 12px;">
            © 2024 Stack21. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </body>
    </html>
  `
}

function generateWelcomeEmailText(name: string, tier: string): string {
  const tierInfo = getTierInfo(tier)
  
  return `
¡Hola ${name}!

¡Bienvenido a Stack21! Tu email ha sido verificado exitosamente.

Tu Tier: ${tierInfo.name}
Descuento: ${tierInfo.discount}

Beneficios:
${tierInfo.benefits.map(benefit => `• ${benefit}`).join('\n')}

Te mantendremos informado sobre el progreso de Stack21 y te notificaremos 
cuando esté listo para el lanzamiento.

¡Gracias por unirte a la revolución de la automatización!

El equipo de Stack21
  `
}

function getTierInfo(tier: string) {
  switch (tier) {
    case 'VIP':
      return {
        name: 'VIP',
        discount: '50%',
        benefits: [
          'Acceso beta gratuito',
          '6 meses gratis',
          'Consultoría personalizada',
          'Módulos premium incluidos'
        ]
      }
    case 'PREMIUM':
      return {
        name: 'Premium',
        discount: '40%',
        benefits: [
          'Acceso beta gratuito',
          '3 meses gratis',
          'Módulos premium incluidos'
        ]
      }
    case 'ENTERPRISE':
      return {
        name: 'Enterprise',
        discount: '30%',
        benefits: [
          'Acceso beta gratuito',
          '2 meses gratis',
          'Soporte prioritario'
        ]
      }
    default:
      return {
        name: 'Basic',
        discount: '20%',
        benefits: [
          'Acceso beta gratuito',
          '1 mes gratis'
        ]
      }
  }
}
