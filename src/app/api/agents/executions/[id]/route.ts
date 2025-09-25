import { NextRequest, NextResponse } from 'next/server'

// Force dynamic rendering
export const dynamic = 'force-dynamic'
export const revalidate = 0
export const fetchCache = 'force-no-store'
export const preferredRegion = 'iad1'
export const runtime = 'nodejs'

// Prevent static generation
export async function generateStaticParams() {
  return []
}

import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { aiAgentManager } from '@/lib/ai-agents'

// ===== ENDPOINTS =====

// GET /api/agents/executions/[id] - Obtener ejecución específica
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    const { id } = params

    // Obtener la ejecución
    const execution = aiAgentManager.getExecution(id)
    
    if (!execution) {
      return NextResponse.json(
        { error: 'Ejecución no encontrada' },
        { status: 404 }
      )
    }

    // Verificar que la ejecución pertenece al usuario
    if (execution.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'No tienes permisos para ver esta ejecución' },
        { status: 403 }
      )
    }

    // Obtener información del agente
    const agent = aiAgentManager.getAgent(execution.agentId)

    return NextResponse.json({
      success: true,
      data: {
        execution,
        agent: agent ? {
          id: agent.id,
          name: agent.name,
          description: agent.description,
          icon: agent.icon,
          category: agent.category,
          capabilities: agent.capabilities
        } : null
      }
    })

  } catch (error) {
    console.error('Error obteniendo ejecución:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
