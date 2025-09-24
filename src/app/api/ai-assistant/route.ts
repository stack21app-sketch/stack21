import { NextRequest, NextResponse } from 'next/server'
import { generateAIResponse, INDUSTRIES } from '@/lib/ai-assistant'

// POST /api/ai-assistant - Generar respuesta del asistente IA
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message, industryId, context } = body

    if (!message || !industryId) {
      return NextResponse.json(
        { success: false, message: 'Mensaje e ID de industria requeridos' },
        { status: 400 }
      )
    }

    // Verificar que la industria existe
    const industry = INDUSTRIES.find(i => i.id === industryId)
    if (!industry) {
      return NextResponse.json(
        { success: false, message: 'Industria no encontrada' },
        { status: 404 }
      )
    }

    const response = await generateAIResponse(message, industryId, context)

    return NextResponse.json({
      success: true,
      data: response
    })
  } catch (error) {
    console.error('Error generating AI response:', error)
    return NextResponse.json(
      { success: false, message: 'Error al generar respuesta de IA' },
      { status: 500 }
    )
  }
}

// GET /api/ai-assistant - Obtener industrias disponibles
export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({
      success: true,
      data: INDUSTRIES
    })
  } catch (error) {
    console.error('Error fetching industries:', error)
    return NextResponse.json(
      { success: false, message: 'Error al obtener industrias' },
      { status: 500 }
    )
  }
}
