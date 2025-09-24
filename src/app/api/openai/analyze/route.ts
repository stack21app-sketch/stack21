import { NextRequest, NextResponse } from 'next/server'
import { OpenAI } from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const { prompt, data, model = 'gpt-4' } = await request.json()

    const completion = await openai.chat.completions.create({
      model: model,
      messages: [
        {
          role: 'system',
          content: 'Eres un analista de datos experto. Analiza los datos proporcionados y proporciona insights valiosos en español.'
        },
        {
          role: 'user',
          content: `${prompt}\n\nDatos: ${JSON.stringify(data, null, 2)}`
        }
      ],
      max_tokens: 1000,
      temperature: 0.7
    })

    const analysis = completion.choices[0]?.message?.content || 'No se pudo analizar los datos'

    return NextResponse.json({
      success: true,
      analysis,
      model,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error analizando con OpenAI:', error)
    return NextResponse.json(
      { success: false, error: 'Error analizando datos' },
      { status: 500 }
    )
  }
}
