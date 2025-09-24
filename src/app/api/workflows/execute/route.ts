import { NextRequest, NextResponse } from 'next/server'
import { executeWorkflow, validateWorkflow } from '@/lib/workflow-builder'

// Simular base de datos en memoria
let workflows: any[] = []

// POST /api/workflows/execute - Ejecutar workflow
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { workflowId, data } = body

    if (!workflowId) {
      return NextResponse.json(
        { success: false, message: 'ID de workflow requerido' },
        { status: 400 }
      )
    }

    // Buscar workflow (en una implementación real, esto vendría de la base de datos)
    const workflow = workflows.find(w => w.id === workflowId)
    if (!workflow) {
      return NextResponse.json(
        { success: false, message: 'Workflow no encontrado' },
        { status: 404 }
      )
    }

    // Validar workflow antes de ejecutar
    const validation = validateWorkflow(workflow)
    if (!validation.valid) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Workflow inválido', 
          errors: validation.errors 
        },
        { status: 400 }
      )
    }

    // Ejecutar workflow
    const result = await executeWorkflow(workflow, data || {})

    // Actualizar estadísticas del workflow
    workflow.runs += 1
    workflow.lastRun = new Date()
    if (result.success) {
      workflow.successRate = ((workflow.successRate * (workflow.runs - 1)) + 100) / workflow.runs
    } else {
      workflow.successRate = ((workflow.successRate * (workflow.runs - 1)) + 0) / workflow.runs
    }

    return NextResponse.json({
      success: true,
      data: result,
      message: 'Workflow ejecutado exitosamente'
    })
  } catch (error) {
    console.error('Error executing workflow:', error)
    return NextResponse.json(
      { success: false, message: 'Error al ejecutar workflow' },
      { status: 500 }
    )
  }
}
