// Sistema de captura de emails para Coming Soon
export interface EmailSubmission {
  email: string
  timestamp: Date
  source: 'coming_soon' | 'footer' | 'popup'
  userAgent?: string
  ip?: string
}

// Mock storage - en producción usarías una base de datos
let emailList: EmailSubmission[] = []

export async function captureEmail(email: string, source: 'coming_soon' | 'footer' | 'popup' = 'coming_soon'): Promise<{ success: boolean; message: string }> {
  try {
    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return { success: false, message: 'Email inválido' }
    }

    // Verificar si ya existe
    const exists = emailList.some(submission => submission.email === email)
    if (exists) {
      return { success: false, message: 'Este email ya está registrado' }
    }

    // Agregar a la lista
    const submission: EmailSubmission = {
      email,
      timestamp: new Date(),
      source,
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : undefined
    }

    emailList.push(submission)

    // En producción, aquí enviarías a tu base de datos
    console.log('Email capturado:', submission)

    // Enviar email de bienvenida (mock)
    await sendWelcomeEmail(email)

    return { success: true, message: '¡Gracias! Te notificaremos cuando esté listo.' }
  } catch (error) {
    console.error('Error capturando email:', error)
    return { success: false, message: 'Error interno. Intenta de nuevo.' }
  }
}

async function sendWelcomeEmail(email: string): Promise<void> {
  // Mock - en producción usarías SendGrid, Resend, etc.
  console.log(`Enviando email de bienvenida a: ${email}`)
  
  // Simular delay
  await new Promise(resolve => setTimeout(resolve, 1000))
}

export function getEmailCount(): number {
  return emailList.length
}

export function getEmailList(): EmailSubmission[] {
  return [...emailList]
}

// API endpoint para capturar emails
export async function POST(request: Request) {
  try {
    const { email, source } = await request.json()
    const result = await captureEmail(email, source)
    
    return Response.json(result)
  } catch (error) {
    return Response.json(
      { success: false, message: 'Error del servidor' },
      { status: 500 }
    )
  }
}
