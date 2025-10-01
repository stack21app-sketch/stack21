import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { generateText } from '@/lib/openai'

export async function POST(request: NextRequest) {
  try {
    const token = await getToken({ req: request })

    if (!token || !token.sub) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { text, action, language, style, length } = await request.json()

    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: 'Texto es requerido y debe ser un string' },
        { status: 400 }
      )
    }

    if (text.length > 5000) {
      return NextResponse.json(
        { error: 'El texto no puede exceder 5000 caracteres' },
        { status: 400 }
      )
    }

    // Validar acción
    const validActions = ['improve', 'summarize', 'expand', 'translate', 'fix-grammar', 'change-tone']
    if (!action || !validActions.includes(action)) {
      return NextResponse.json(
        { error: 'Acción no válida. Acciones disponibles: improve, summarize, expand, translate, fix-grammar, change-tone' },
        { status: 400 }
      )
    }

    console.log(`📝 Procesando texto para usuario: acción "${action}"`)

    // Crear prompt basado en la acción
    let systemPrompt = ''
    let userPrompt = ''

    switch (action) {
      case 'improve':
        systemPrompt = 'Eres un editor de texto experto. Mejora el texto proporcionado manteniendo su significado original pero haciéndolo más claro, conciso y profesional.'
        userPrompt = `Mejora este texto:\n\n${text}`
        break
      
      case 'summarize':
        systemPrompt = 'Eres un experto en resúmenes. Crea un resumen conciso y claro del texto proporcionado, destacando los puntos principales.'
        userPrompt = `Resume este texto:\n\n${text}`
        break
      
      case 'expand':
        systemPrompt = 'Eres un escritor experto. Expande el texto proporcionado añadiendo detalles, ejemplos y explicaciones relevantes.'
        userPrompt = `Expande este texto:\n\n${text}`
        break
      
      case 'translate':
        systemPrompt = `Eres un traductor experto. Traduce el texto al ${language || 'inglés'} manteniendo el tono y estilo original.`
        userPrompt = `Traduce este texto al ${language || 'inglés'}:\n\n${text}`
        break
      
      case 'fix-grammar':
        systemPrompt = 'Eres un corrector gramatical experto. Corrige los errores gramaticales, ortográficos y de puntuación del texto proporcionado.'
        userPrompt = `Corrige la gramática de este texto:\n\n${text}`
        break
      
      case 'change-tone':
        systemPrompt = `Eres un escritor experto. Cambia el tono del texto a ${style || 'profesional'} manteniendo el contenido original.`
        userPrompt = `Cambia el tono de este texto a ${style || 'profesional'}:\n\n${text}`
        break
    }

    // Generar texto procesado usando OpenAI
    const processedText = await generateText(userPrompt, 'gpt-3.5-turbo')

    if (!processedText) {
      throw new Error('No se pudo procesar el texto')
    }

    console.log(`✅ Texto procesado exitosamente`)

    return NextResponse.json({
      success: true,
      originalText: text,
      processedText,
      action,
      language: language || 'inglés',
      style: style || 'profesional',
      length: length || 'medio',
      timestamp: new Date().toISOString(),
    })

  } catch (error: any) {
    console.error('Error en editor de texto:', error)
    
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
      { error: error.message || 'Error interno del servidor al procesar el texto' },
      { status: 500 }
    )
  }
}
