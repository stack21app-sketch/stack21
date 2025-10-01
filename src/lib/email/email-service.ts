
import sgMail from '@sendgrid/mail'

sgMail.setApiKey(process.env.SENDGRID_API_KEY!)

export interface EmailTemplate {
  to: string
  subject: string
  html: string
  text?: string
}

export async function sendEmail(template: EmailTemplate) {
  try {
    const msg = {
      to: template.to,
      from: process.env.FROM_EMAIL!,
      subject: template.subject,
      html: template.html,
      text: template.text,
    }

    await sgMail.send(msg)
    return { success: true }
  } catch (error) {
    console.error('Error sending email:', error)
    return { success: false, error: error.message }
  }
}

export const EMAIL_TEMPLATES = {
  welcome: (email: string, name?: string) => ({
    to: email,
    subject: '¡Bienvenido a Stack21! 🚀',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2563eb;">¡Hola ${name || 'Usuario'}!</h1>
        <p>Gracias por unirte a Stack21. Estamos trabajando duro para traerte la mejor plataforma de automatización.</p>
        <p>Te notificaremos tan pronto como esté listo.</p>
        <p>Saludos,<br>El equipo de Stack21</p>
      </div>
    `
  }),
  
  launch: (email: string, name?: string) => ({
    to: email,
    subject: '🎉 ¡Stack21 ya está disponible!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2563eb;">¡Es oficial!</h1>
        <p>Stack21 ya está disponible. Accede a tu cuenta y comienza a automatizar tu negocio.</p>
        <a href="${process.env.NEXTAUTH_URL}/dashboard" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Acceder ahora</a>
      </div>
    `
  })
}
