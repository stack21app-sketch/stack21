import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json()

    // Análisis de sentimientos simple (en producción usar modelo ML real)
    const sentiment = analyzeSentiment(text)
    
    return NextResponse.json({
      success: true,
      sentiment,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error en análisis de sentimientos:', error)
    return NextResponse.json(
      { success: false, error: 'Error analizando sentimientos' },
      { status: 500 }
    )
  }
}

function analyzeSentiment(text: string) {
  const positiveWords = ['excelente', 'genial', 'perfecto', 'bueno', 'me gusta', 'increíble', 'fantástico', 'maravilloso', 'súper', 'genial']
  const negativeWords = ['malo', 'terrible', 'horrible', 'pésimo', 'odio', 'no me gusta', 'problema', 'error', 'falla', 'defecto']
  const neutralWords = ['ok', 'bien', 'normal', 'regular', 'aceptable', 'correcto']

  const lowerText = text.toLowerCase()
  
  let positiveScore = 0
  let negativeScore = 0
  let neutralScore = 0

  // Contar palabras positivas
  positiveWords.forEach(word => {
    if (lowerText.includes(word)) positiveScore++
  })

  // Contar palabras negativas
  negativeWords.forEach(word => {
    if (lowerText.includes(word)) negativeScore++
  })

  // Contar palabras neutrales
  neutralWords.forEach(word => {
    if (lowerText.includes(word)) neutralScore++
  })

  // Determinar sentimiento
  let sentiment = 'neutral'
  let confidence = 0.5

  if (positiveScore > negativeScore && positiveScore > neutralScore) {
    sentiment = 'positive'
    confidence = Math.min(0.9, 0.5 + (positiveScore * 0.1))
  } else if (negativeScore > positiveScore && negativeScore > neutralScore) {
    sentiment = 'negative'
    confidence = Math.min(0.9, 0.5 + (negativeScore * 0.1))
  } else if (neutralScore > 0) {
    sentiment = 'neutral'
    confidence = Math.min(0.8, 0.5 + (neutralScore * 0.1))
  }

  // Análisis adicional basado en puntuación y exclamaciones
  const exclamationCount = (text.match(/!/g) || []).length
  const questionCount = (text.match(/\?/g) || []).length

  if (exclamationCount > 2) {
    if (sentiment === 'positive') confidence = Math.min(0.95, confidence + 0.1)
    else if (sentiment === 'negative') confidence = Math.min(0.95, confidence + 0.1)
  }

  if (questionCount > 2) {
    sentiment = 'questioning'
    confidence = 0.7
  }

  return {
    sentiment,
    confidence,
    scores: {
      positive: positiveScore,
      negative: negativeScore,
      neutral: neutralScore
    },
    indicators: {
      exclamations: exclamationCount,
      questions: questionCount,
      length: text.length
    }
  }
}
