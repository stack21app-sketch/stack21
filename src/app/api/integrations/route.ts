import { NextRequest, NextResponse } from 'next/server'
import { AVAILABLE_INTEGRATIONS, configureIntegration, testIntegration } from '@/lib/integrations'

// GET /api/integrations - Obtener todas las integraciones
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const status = searchParams.get('status')

    let filteredIntegrations = AVAILABLE_INTEGRATIONS

    if (category) {
      filteredIntegrations = filteredIntegrations.filter(integration => integration.category === category)
    }

    // if (status) {
    //   filteredIntegrations = filteredIntegrations.filter(integration => integration.status === status)
    // }

    return NextResponse.json({
      success: true,
      data: filteredIntegrations,
      total: filteredIntegrations.length
    })
  } catch (error) {
    console.error('Error fetching integrations:', error)
    return NextResponse.json(
      { success: false, message: 'Error al obtener integraciones' },
      { status: 500 }
    )
  }
}

// POST /api/integrations - Configurar una integración
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { integrationId, config } = body

    if (!integrationId || !config) {
      return NextResponse.json(
        { success: false, message: 'ID de integración y configuración requeridos' },
        { status: 400 }
      )
    }

    const result = await configureIntegration(integrationId, config)

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error configuring integration:', error)
    return NextResponse.json(
      { success: false, message: 'Error al configurar integración' },
      { status: 500 }
    )
  }
}

// PUT /api/integrations - Actualizar estado de integración
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { integrationId, status } = body

    if (!integrationId || !status) {
      return NextResponse.json(
        { success: false, message: 'ID de integración y estado requeridos' },
        { status: 400 }
      )
    }

    // Aquí actualizarías el estado en la base de datos
    // Por ahora simulamos la actualización
    const integration = AVAILABLE_INTEGRATIONS.find(i => i.id === integrationId)
    if (!integration) {
      return NextResponse.json(
        { success: false, message: 'Integración no encontrada' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: `Integración ${integration.name} actualizada a ${status}`,
      data: { ...integration, status }
    })
  } catch (error) {
    console.error('Error updating integration:', error)
    return NextResponse.json(
      { success: false, message: 'Error al actualizar integración' },
      { status: 500 }
    )
  }
}

// DELETE /api/integrations - Desactivar integración
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const integrationId = searchParams.get('id')

    if (!integrationId) {
      return NextResponse.json(
        { success: false, message: 'ID de integración requerido' },
        { status: 400 }
      )
    }

    const integration = AVAILABLE_INTEGRATIONS.find(i => i.id === integrationId)
    if (!integration) {
      return NextResponse.json(
        { success: false, message: 'Integración no encontrada' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: `Integración ${integration.name} desactivada`,
      data: { ...integration, status: 'inactive' }
    })
  } catch (error) {
    console.error('Error deactivating integration:', error)
    return NextResponse.json(
      { success: false, message: 'Error al desactivar integración' },
      { status: 500 }
    )
  }
}