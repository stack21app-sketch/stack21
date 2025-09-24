import { NextRequest, NextResponse } from 'next/server'
import { testIntegration } from '@/lib/integrations'

// POST /api/integrations/test - Probar conexión de integración
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { integrationId } = body

    if (!integrationId) {
      return NextResponse.json(
        { success: false, message: 'ID de integración requerido' },
        { status: 400 }
      )
    }

    const result = await testIntegration(integrationId)

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error testing integration:', error)
    return NextResponse.json(
      { success: false, message: 'Error al probar conexión' },
      { status: 500 }
    )
  }
}
