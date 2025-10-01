/**
 * 🔌 OpenAI Connector API
 * Conecta con OpenAI para funcionalidades de IA
 */

import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, config } = body

    const apiKey = config.apiKey || process.env.OPENAI_API_KEY
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API Key de OpenAI requerida' },
        { status: 400 }
      )
    }

    const openai = new OpenAI({ apiKey })

    switch (action) {
      case 'generate_content':
        return await generateContent(config, openai)
      
      case 'analyze_sentiment':
        return await analyzeSentiment(config, openai)
      
      case 'extract_data':
        return await extractData(config, openai)
      
      case 'classify_text':
        return await classifyText(config, openai)
      
      case 'score_lead':
        return await scoreLead(config, openai)
      
      default:
        return NextResponse.json(
          { error: `Acción no soportada: ${action}` },
          { status: 400 }
        )
    }
  } catch (error: any) {
    console.error('Error OpenAI:', error)
    return NextResponse.json(
      { error: error.message || 'Error interno' },
      { status: 500 }
    )
  }
}

async function generateContent(config: any, openai: OpenAI) {
  const { prompt, model = 'gpt-4o-mini', max_tokens = 1000, temperature = 0.7 } = config
  
  if (!prompt) {
    throw new Error('prompt es requerido')
  }

  const completion = await openai.chat.completions.create({
    model,
    messages: [
      { role: 'user', content: prompt }
    ],
    max_tokens,
    temperature
  })

  const text = completion.choices[0].message.content || ''
  
  return NextResponse.json({
    success: true,
    data: {
      text,
      tokens: completion.usage?.total_tokens || 0,
      model: completion.model
    }
  })
}

async function analyzeSentiment(config: any, openai: OpenAI) {
  const { text } = config
  
  if (!text) {
    throw new Error('text es requerido')
  }

  const prompt = `Analiza el sentimiento del siguiente texto y responde SOLO con un JSON en este formato:
{
  "sentiment": "positive|negative|neutral",
  "score": <número entre -1 y 1>,
  "explanation": "<breve explicación>"
}

Texto: "${text}"`

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: 'Eres un experto en análisis de sentimientos. Responde solo con JSON válido.' },
      { role: 'user', content: prompt }
    ],
    temperature: 0.3,
    response_format: { type: 'json_object' }
  })

  const result = JSON.parse(completion.choices[0].message.content || '{}')
  
  return NextResponse.json({
    success: true,
    data: {
      sentiment: result.sentiment,
      score: result.score,
      explanation: result.explanation
    }
  })
}

async function extractData(config: any, openai: OpenAI) {
  const { text, schema } = config
  
  if (!text || !schema) {
    throw new Error('text y schema son requeridos')
  }

  const prompt = `Extrae información del siguiente texto según este schema JSON:
${JSON.stringify(schema, null, 2)}

Texto: "${text}"

Responde SOLO con un JSON que siga el schema proporcionado.`

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: 'Eres un experto en extracción de datos. Responde solo con JSON válido que siga el schema proporcionado.' },
      { role: 'user', content: prompt }
    ],
    temperature: 0.2,
    response_format: { type: 'json_object' }
  })

  const extracted_data = JSON.parse(completion.choices[0].message.content || '{}')
  
  return NextResponse.json({
    success: true,
    data: {
      extracted_data,
      confidence: 0.9 // Simplificado, en producción calcular confianza real
    }
  })
}

async function classifyText(config: any, openai: OpenAI) {
  const { text, categories } = config
  
  if (!text || !categories || !Array.isArray(categories)) {
    throw new Error('text y categories (array) son requeridos')
  }

  const prompt = `Clasifica el siguiente texto en UNA de estas categorías:
${categories.map((cat: string, i: number) => `${i + 1}. ${cat}`).join('\n')}

Texto: "${text}"

Responde SOLO con un JSON en este formato:
{
  "category": "<nombre de la categoría>",
  "confidence": <número entre 0 y 1>,
  "reasoning": "<breve explicación>"
}`

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: 'Eres un experto en clasificación de texto. Responde solo con JSON válido.' },
      { role: 'user', content: prompt }
    ],
    temperature: 0.3,
    response_format: { type: 'json_object' }
  })

  const result = JSON.parse(completion.choices[0].message.content || '{}')
  
  return NextResponse.json({
    success: true,
    data: {
      category: result.category,
      confidence: result.confidence,
      reasoning: result.reasoning
    }
  })
}

async function scoreLead(config: any, openai: OpenAI) {
  const { lead_data } = config
  
  if (!lead_data) {
    throw new Error('lead_data es requerido')
  }

  const prompt = `Analiza este lead y asígnale un score de calidad del 0-100:

Datos del lead:
${JSON.stringify(lead_data, null, 2)}

Considera factores como:
- Email corporativo vs personal
- Tamaño/tipo de empresa
- Cargo del contacto
- Industria relevante
- Datos completos vs incompletos

Responde SOLO con un JSON en este formato:
{
  "score": <número entre 0 y 100>,
  "reasons": ["<razón 1>", "<razón 2>", "<razón 3>"],
  "recommendation": "<acción recomendada>",
  "priority": "high|medium|low"
}`

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: 'Eres un experto en calificación de leads. Analiza objetivamente y responde con JSON válido.' },
      { role: 'user', content: prompt }
    ],
    temperature: 0.4,
    response_format: { type: 'json_object' }
  })

  const result = JSON.parse(completion.choices[0].message.content || '{}')
  
  return NextResponse.json({
    success: true,
    data: {
      score: result.score,
      reasons: result.reasons,
      recommendation: result.recommendation,
      priority: result.priority
    }
  })
}

