import { NextRequest, NextResponse } from 'next/server'

// Configuración de precios transparente
const PRICING_CONFIG = {
  // Precios por ejecución de workflow
  workflowExecution: {
    free: 100, // 100 ejecuciones gratis por mes
    price: 0.01, // $0.01 por ejecución adicional
  },
  
  // Precios por nodo de IA
  aiNode: {
    free: 50, // 50 nodos de IA gratis por mes
    price: 0.02, // $0.02 por nodo de IA adicional
  },
  
  // Precios por nodo de email
  emailNode: {
    free: 25, // 25 emails gratis por mes
    price: 0.005, // $0.005 por email adicional
  },
  
  // Precios por integración
  integration: {
    free: 5, // 5 integraciones gratis
    price: 2.00, // $2.00 por integración adicional por mes
  },
  
  // Precios por workspace
  workspace: {
    free: 1, // 1 workspace gratis
    price: 5.00, // $5.00 por workspace adicional por mes
  },
  
  // Precios por usuario
  user: {
    free: 3, // 3 usuarios gratis
    price: 10.00, // $10.00 por usuario adicional por mes
  }
}

// Calculadora de costos en tiempo real
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const workflowExecutions = parseInt(searchParams.get('workflowExecutions') || '0')
    const aiNodes = parseInt(searchParams.get('aiNodes') || '0')
    const emailNodes = parseInt(searchParams.get('emailNodes') || '0')
    const integrations = parseInt(searchParams.get('integrations') || '0')
    const workspaces = parseInt(searchParams.get('workspaces') || '0')
    const users = parseInt(searchParams.get('users') || '0')

    // Calcular costos
    const costs = {
      workflowExecutions: Math.max(0, workflowExecutions - PRICING_CONFIG.workflowExecution.free) * PRICING_CONFIG.workflowExecution.price,
      aiNodes: Math.max(0, aiNodes - PRICING_CONFIG.aiNode.free) * PRICING_CONFIG.aiNode.price,
      emailNodes: Math.max(0, emailNodes - PRICING_CONFIG.emailNode.free) * PRICING_CONFIG.emailNode.price,
      integrations: Math.max(0, integrations - PRICING_CONFIG.integration.free) * PRICING_CONFIG.integration.price,
      workspaces: Math.max(0, workspaces - PRICING_CONFIG.workspace.free) * PRICING_CONFIG.workspace.price,
      users: Math.max(0, users - PRICING_CONFIG.user.free) * PRICING_CONFIG.user.price
    }

    const totalCost = Object.values(costs).reduce((sum, cost) => sum + cost, 0)

    return NextResponse.json({
      pricing: PRICING_CONFIG,
      usage: {
        workflowExecutions,
        aiNodes,
        emailNodes,
        integrations,
        workspaces,
        users
      },
      costs,
      totalCost: Math.round(totalCost * 100) / 100, // Redondear a 2 decimales
      breakdown: Object.entries(costs).map(([key, value]) => ({
        type: key,
        cost: Math.round(value * 100) / 100,
        description: getDescription(key)
      }))
    })

  } catch (error) {
    console.error('Error calculating pricing:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

function getDescription(type: string): string {
  const descriptions: Record<string, string> = {
    workflowExecutions: 'Ejecuciones de workflow',
    aiNodes: 'Nodos de IA procesados',
    emailNodes: 'Emails enviados',
    integrations: 'Integraciones activas',
    workspaces: 'Workspaces adicionales',
    users: 'Usuarios adicionales'
  }
  return descriptions[type] || type
}
