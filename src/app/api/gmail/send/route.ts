import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { to, subject, body, from } = await request.json()

    // Simular envío de email (en producción usar Gmail API real)
    const messageId = `gmail_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    // Log del email enviado
    console.log('Email enviado:', {
      to,
      subject,
      from: from || 'noreply@stack21.com',
      messageId,
      timestamp: new Date().toISOString()
    })

    return NextResponse.json({
      success: true,
      messageId,
      to,
      subject,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error enviando email:', error)
    return NextResponse.json(
      { success: false, error: 'Error enviando email' },
      { status: 500 }
    )
  }
}
