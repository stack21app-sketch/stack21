import { NextRequest, NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'
export const revalidate = 0
export const fetchCache = 'force-no-store'
export const preferredRegion = 'iad1'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { aiAgentManager } from '@/lib/ai-agents'
import { z } from 'zod'

// ===== ESQUEMAS DE VALIDACIÓN =====

const GetExecutionsSchema = z.object({
  limit: z.string().optional().transform(val => val ? parseInt(val) : 50),
  status: z.enum(['pending', 'running', 'completed', 'failed']).optional()
})

// ===== ENDPOINTS =====

// GET /api/agents/executions - Obtener ejecuciones del usuario
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const validatedParams = GetExecutionsSchema.parse({
      limit: searchParams.get('limit'),
      status: searchParams.get('status')
    })

    const { limit, status } = validatedParams

    // Obtener ejecuciones del usuario
    let executions = aiAgentManager.getUserExecutions(session.user.id, limit)
    
    // Filtrar por estado si se especifica
    if (status) {
      executions = executions.filter(exec => exec.status === status)
    }

    // Obtener información del agente para cada ejecución
    const executionsWithAgentInfo = executions.map(execution => {
      const agent = aiAgentManager.getAgent(execution.agentId)
      return {
        ...execution,
        agent: agent ? {
          id: agent.id,
          name: agent.name,
          description: agent.description,
          icon: agent.icon,
          category: agent.category
        } : null
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        executions: executionsWithAgentInfo,
        total: executionsWithAgentInfo.length,
        filters: {
          limit,
          status
        }
      }
    })

  } catch (error) {
    console.error('Error obteniendo ejecuciones:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Parámetros inválidos',
          details: error.errors 
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
