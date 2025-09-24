import { NextRequest, NextResponse } from 'next/server'
import { aiLearning } from '@/lib/ai-learning'

export async function POST(request: NextRequest) {
  try {
    const { userId, context } = await request.json()

    if (!userId || !context) {
      return NextResponse.json(
        { error: 'userId y context son requeridos' },
        { status: 400 }
      )
    }

    const suggestions = await aiLearning.generatePersonalizedSuggestions(userId, context)

    return NextResponse.json({
      suggestions,
      personalized: true,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Error generando sugerencias:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const context = searchParams.get('context') || 'workflow_optimization'

    if (!userId) {
      return NextResponse.json(
        { error: 'userId es requerido' },
        { status: 400 }
      )
    }

    const suggestions = await aiLearning.generatePersonalizedSuggestions(userId, context)

    return NextResponse.json({
      suggestions,
      personalized: true,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Error generando sugerencias:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
