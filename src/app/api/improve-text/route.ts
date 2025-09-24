import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { text, tone, textType } = await request.json()

    if (!text) {
      return NextResponse.json(
        { error: 'Texto es requerido' },
        { status: 400 }
      )
    }

    // Simulación de mejora de texto (reemplazar con OpenAI GPT)
    const improvements = {
      professional: 'El texto ha sido optimizado para un tono profesional, mejorando la claridad y estructura.',
      casual: 'El texto ha sido adaptado a un tono más casual y conversacional.',
      formal: 'El texto ha sido formalizado con un lenguaje más estructurado y oficial.',
      friendly: 'El texto ha sido mejorado para ser más cálido y amigable.',
      persuasive: 'El texto ha sido optimizado para ser más convincente y motivador.',
      creative: 'El texto ha sido enriquecido con elementos creativos y originales.'
    }

    // Simulación de texto mejorado
    const improvedText = `[MEJORADO - Tono ${tone}]\n\n${text}\n\n---\n\nMejoras aplicadas:\n- Optimización del tono para ${tone}\n- Mejora de la estructura y fluidez\n- Corrección de errores gramaticales\n- Ajuste del estilo para ${textType}`
    
    // En producción, aquí harías la llamada real a OpenAI GPT:
    /*
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `Eres un editor profesional. Mejora el siguiente texto para que tenga un tono ${tone} y sea apropiado para ${textType}. Mantén el contenido original pero mejora la gramática, estructura y fluidez.`
          },
          {
            role: 'user',
            content: text
          }
        ],
        max_tokens: Math.min(text.length * 2, 4000),
        temperature: 0.3
      }),
    })

    const data = await response.json()
    const improvedText = data.choices[0].message.content
    */

    return NextResponse.json({ 
      improvedText,
      improvements: improvements[tone as keyof typeof improvements] || improvements.professional,
      originalLength: text.length,
      improvedLength: improvedText.length,
      improvedAt: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error al mejorar texto:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
