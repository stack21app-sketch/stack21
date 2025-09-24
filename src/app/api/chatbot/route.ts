import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { generateText } from '@/lib/openai'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { message, model, temperature, maxTokens } = await request.json()

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Mensaje es requerido y debe ser un string' },
        { status: 400 }
      )
    }

    if (message.length > 2000) {
      return NextResponse.json(
        { error: 'El mensaje no puede exceder 2000 caracteres' },
        { status: 400 }
      )
    }

    // Validar modelo
    const validModels = ['gpt-3.5-turbo', 'gpt-4']
    const selectedModel = model && validModels.includes(model) ? model : 'gpt-3.5-turbo'

    // Validar temperatura
    const validTemperature = temperature && temperature >= 0 && temperature <= 2 ? temperature : 0.7

    // Validar maxTokens
    const validMaxTokens = maxTokens && maxTokens >= 1 && maxTokens <= 4000 ? maxTokens : 1000

    console.log(`🤖 Procesando mensaje del chatbot para usuario ${session.user.email}: "${message.substring(0, 50)}..."`)

    // Generar respuesta usando OpenAI
    const response = await generateText(message, selectedModel)

    if (!response) {
      throw new Error('No se pudo generar la respuesta')
    }

    console.log(`✅ Respuesta generada exitosamente`)

    return NextResponse.json({
      success: true,
      response,
      model: selectedModel,
      temperature: validTemperature,
      maxTokens: validMaxTokens,
      timestamp: new Date().toISOString(),
    })

  } catch (error: any) {
    console.error('Error en chatbot:', error)
    
    // Manejar errores específicos de OpenAI
    if (error.message?.includes('billing')) {
      return NextResponse.json(
        { error: 'Error de facturación de OpenAI. Verifica tu cuenta.' },
        { status: 402 }
      )
    }
    
    if (error.message?.includes('rate_limit')) {
      return NextResponse.json(
        { error: 'Límite de velocidad excedido. Intenta de nuevo en unos minutos.' },
        { status: 429 }
      )
    }

    return NextResponse.json(
      { error: error.message || 'Error interno del servidor al procesar el mensaje' },
      { status: 500 }
    )
  }
}