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
import { z } from 'zod'

// Función para verificar límites de ejecuciones de agentes
async function checkAgentExecutionLimits(userId: string): Promise<{ allowed: boolean; limit: number; used: number; plan: string }> {
  try {
    // Obtener información del plan del usuario
    const billingResponse = await fetch(`${process.env.NEXTAUTH_URL}/api/billing?type=subscription`, {
      headers: {
        'Cookie': `next-auth.session-token=${userId}` // Esto es una simplificación
      }
    })
    
    if (billingResponse.ok) {
      const billingData = await billingResponse.json()
      const plan = billingData.plan || { limits: { agentExecutions: 10 } }
      
      // Obtener ejecuciones del mes actual
      const currentMonth = new Date().toISOString().slice(0, 7) // YYYY-MM
      const executions = aiAgentManager.getUserExecutions(userId, 1000)
      const monthlyExecutions = executions.filter(exec => 
        exec.createdAt.toISOString().slice(0, 7) === currentMonth
      )
      
      const limit = plan.limits?.agentExecutions || 10
      const used = monthlyExecutions.length
      
      return {
        allowed: limit === -1 || used < limit, // -1 significa ilimitado
        limit,
        used,
        plan: plan.id || 'free'
      }
    }
  } catch (error) {
    console.error('Error verificando límites:', error)
  }
  
  // Fallback: permitir con límite básico
  return {
    allowed: true,
    limit: 10,
    used: 0,
    plan: 'free'
  }
}

// ===== ESQUEMAS DE VALIDACIÓN =====

const ExecuteAgentSchema = z.object({
  agentId: z.string().min(1, 'ID del agente es requerido'),
  input: z.string().min(1, 'Input es requerido'),
  context: z.object({}).optional()
})

const GetExecutionsSchema = z.object({
  limit: z.string().optional().transform(val => val ? parseInt(val) : 50),
  status: z.enum(['pending', 'running', 'completed', 'failed']).optional()
})

// ===== ENDPOINTS =====

// GET /api/agents - Obtener agentes disponibles
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
    const category = searchParams.get('category')
    
    let agents
    if (category) {
      agents = aiAgentManager.getAgentsByCategory(category as any)
    } else {
      agents = aiAgentManager.getAvailableAgents()
    }

    return NextResponse.json({
      success: true,
      data: {
        agents,
        total: agents.length
      }
    })

  } catch (error) {
    console.error('Error obteniendo agentes:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// POST /api/agents - Ejecutar un agente
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validatedData = ExecuteAgentSchema.parse(body)
    
    const { agentId, input, context } = validatedData
    
    // Verificar que el agente existe
    const agent = aiAgentManager.getAgent(agentId)
    if (!agent) {
      return NextResponse.json(
        { error: 'Agente no encontrado' },
        { status: 404 }
      )
    }

    // Verificar límites de ejecuciones
    const limitsCheck = await checkAgentExecutionLimits(session.user.id)
    if (!limitsCheck.allowed) {
      return NextResponse.json(
        { 
          error: 'Has alcanzado el límite de ejecuciones de agentes para tu plan',
          details: {
            limit: limitsCheck.limit,
            used: limitsCheck.used,
            plan: limitsCheck.plan
          }
        },
        { status: 403 }
      )
    }

    // Ejecutar el agente
    const execution = await aiAgentManager.executeAgent(
      agentId,
      input,
      session.user.id,
      'default',
      context
    )

    return NextResponse.json({
      success: true,
      data: {
        execution,
        agent: {
          id: agent.id,
          name: agent.name,
          description: agent.description,
          icon: agent.icon
        }
      }
    })

  } catch (error) {
    console.error('Error ejecutando agente:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Datos inválidos',
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
