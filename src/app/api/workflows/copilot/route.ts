import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { workflowCopilot, GeneratedWorkflow } from '@/lib/workflow-copilot'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const token = await getToken({ req: request })
    
    if (!token || !token.sub) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { action, description, industry, context, workflowId } = await request.json()

    switch (action) {
      case 'generate':
        return await generateWorkflow(description, industry, context, token.sub)
      
      case 'suggest_improvements':
        return await suggestImprovements(workflowId, token.sub)
      
      case 'get_templates':
        return await getIndustryTemplates(industry)
      
      case 'validate':
        return await validateWorkflow(workflowId, token.sub)
      
      default:
        return NextResponse.json({ error: 'Acción no válida' }, { status: 400 })
    }
  } catch (error) {
    console.error('Error en Workflow Copilot API:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

async function generateWorkflow(
  description: string,
  industry: string,
  context: any,
  userId: string
) {
  try {
    if (!description || description.trim().length === 0) {
      return NextResponse.json(
        { error: 'La descripción es requerida' },
        { status: 400 }
      )
    }

    // Generar workflow con IA
    const generatedWorkflow = await workflowCopilot.generateFromDescription(
      description,
      industry,
      context
    )

    // Validar workflow generado
    const validation = workflowCopilot.validateWorkflow(generatedWorkflow)
    if (!validation.valid) {
      return NextResponse.json(
        { error: 'Workflow inválido', details: validation.errors },
        { status: 400 }
      )
    }

    // Obtener workspace del usuario
    const userWorkspace = await prisma.workspaceMember.findFirst({
      where: { userId },
      include: { workspace: true }
    })

    if (!userWorkspace) {
      return NextResponse.json(
        { error: 'Usuario no tiene workspace' },
        { status: 400 }
      )
    }

    // Guardar workflow en la base de datos
    const workflow = await prisma.workflow.create({
      data: {
        name: generatedWorkflow.name,
        description: generatedWorkflow.description,
        definitionJson: {
          triggerType: generatedWorkflow.triggerType,
          triggerConfig: generatedWorkflow.triggerConfig,
          nodes: generatedWorkflow.nodes as any,
          connections: generatedWorkflow.connections as any,
          variables: generatedWorkflow.variables as any,
          industry: generatedWorkflow.industry,
          tags: generatedWorkflow.tags,
        } as any,
        userId,
        projectId: userWorkspace.workspace.id, // Usar workspaceId como projectId temporalmente
        status: 'DRAFT'
      }
    })

    // Registrar en analytics
    await prisma.analytics.create({
      data: {
        userId,
        workspaceId: userWorkspace.workspace.id,
        event: 'workflow_generated',
        data: {
          workflowId: workflow.id,
          industry,
          descriptionLength: description.length,
          nodesCount: generatedWorkflow.nodes.length
        },
        timestamp: new Date()
      }
    })

    const definition = workflow.definitionJson as any;
    
    return NextResponse.json({
      success: true,
      workflow: {
        id: workflow.id,
        name: workflow.name,
        description: workflow.description,
        triggerType: definition?.triggerType,
        nodes: definition?.nodes,
        connections: definition?.connections,
        industry: definition?.industry,
        tags: definition?.tags
      }
    })
  } catch (error) {
    console.error('Error generando workflow:', error)
    return NextResponse.json(
      { error: 'Error al generar workflow' },
      { status: 500 }
    )
  }
}

async function suggestImprovements(workflowId: string, userId: string) {
  try {
    const workflow = await prisma.workflow.findFirst({
      where: {
        id: workflowId,
        userId
      }
    })

    if (!workflow) {
      return NextResponse.json(
        { error: 'Workflow no encontrado' },
        { status: 404 }
      )
    }

    // Obtener métricas del workflow
    const runs = await prisma.runLog.findMany({
      where: { workflowId },
      orderBy: { startedAt: 'desc' },
      take: 10
    })

    const metrics = {
      totalRuns: runs.length,
      successRate: runs.filter(r => r.status === 'COMPLETED').length / runs.length,
      averageDuration: runs.reduce((acc, r) => acc + (r.duration || 0), 0) / runs.length
    }

    const definition = workflow.definitionJson as any;
    
    // Generar sugerencias con IA
    const suggestions = await workflowCopilot.suggestImprovements(
      {
        name: workflow.name,
        description: workflow.description || '',
        triggerType: definition?.triggerType,
        triggerConfig: definition?.triggerConfig,
        nodes: definition?.nodes,
        connections: definition?.connections,
        variables: definition?.variables,
        industry: definition?.industry || undefined,
        tags: definition?.tags
      },
      metrics
    )

    return NextResponse.json({
      success: true,
      suggestions
    })
  } catch (error) {
    console.error('Error generando sugerencias:', error)
    return NextResponse.json(
      { error: 'Error al generar sugerencias' },
      { status: 500 }
    )
  }
}

async function getIndustryTemplates(industry: string) {
  try {
    if (!industry) {
      return NextResponse.json(
        { error: 'Industria requerida' },
        { status: 400 }
      )
    }

    // Generar templates para la industria
    const templates = await workflowCopilot.generateIndustryTemplates(industry)

    return NextResponse.json({
      success: true,
      templates
    })
  } catch (error) {
    console.error('Error obteniendo templates:', error)
    return NextResponse.json(
      { error: 'Error al obtener templates' },
      { status: 500 }
    )
  }
}

async function validateWorkflow(workflowId: string, userId: string) {
  try {
    const workflow = await prisma.workflow.findFirst({
      where: {
        id: workflowId,
        userId
      }
    })

    if (!workflow) {
      return NextResponse.json(
        { error: 'Workflow no encontrado' },
        { status: 404 }
      )
    }

    const definition = workflow.definitionJson as any;
    
    const validation = workflowCopilot.validateWorkflow({
      name: workflow.name,
      description: workflow.description || '',
      triggerType: definition?.triggerType,
      triggerConfig: definition?.triggerConfig,
      nodes: definition?.nodes,
      connections: definition?.connections,
      variables: definition?.variables,
      industry: definition?.industry || undefined,
      tags: definition?.tags
    })

    return NextResponse.json({
      success: true,
      validation
    })
  } catch (error) {
    console.error('Error validando workflow:', error)
    return NextResponse.json(
      { error: 'Error al validar workflow' },
      { status: 500 }
    )
  }
}
