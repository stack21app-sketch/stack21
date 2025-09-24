import { NextRequest, NextResponse } from 'next/server'
import { 
  createWorkflow, 
  addNodeToWorkflow, 
  connectNodes, 
  validateWorkflow, 
  executeWorkflow,
  WORKFLOW_TEMPLATES,
  type Workflow 
} from '@/lib/workflow-builder'

// Simular base de datos en memoria
let workflows: Workflow[] = []

// GET /api/workflows - Obtener workflows
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const industry = searchParams.get('industry')
    const status = searchParams.get('status')

    let filteredWorkflows = workflows

    if (industry) {
      filteredWorkflows = filteredWorkflows.filter(workflow => workflow.industry === industry)
    }

    if (status) {
      filteredWorkflows = filteredWorkflows.filter(workflow => workflow.status === status)
    }

    return NextResponse.json({
      success: true,
      data: filteredWorkflows,
      total: filteredWorkflows.length
    })
  } catch (error) {
    console.error('Error fetching workflows:', error)
    return NextResponse.json(
      { success: false, message: 'Error al obtener workflows' },
      { status: 500 }
    )
  }
}

// POST /api/workflows - Crear nuevo workflow
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, industry, description } = body

    if (!name || !industry) {
      return NextResponse.json(
        { success: false, message: 'Nombre e industria requeridos' },
        { status: 400 }
      )
    }

    const newWorkflow = createWorkflow(name, industry)
    if (description) {
      newWorkflow.description = description
    }

    workflows.push(newWorkflow)

    return NextResponse.json({
      success: true,
      data: newWorkflow,
      message: 'Workflow creado exitosamente'
    })
  } catch (error) {
    console.error('Error creating workflow:', error)
    return NextResponse.json(
      { success: false, message: 'Error al crear workflow' },
      { status: 500 }
    )
  }
}

// PUT /api/workflows - Actualizar workflow
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, name, description, nodes, connections, status } = body

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'ID de workflow requerido' },
        { status: 400 }
      )
    }

    const workflowIndex = workflows.findIndex(w => w.id === id)
    if (workflowIndex === -1) {
      return NextResponse.json(
        { success: false, message: 'Workflow no encontrado' },
        { status: 404 }
      )
    }

    const updatedWorkflow = {
      ...workflows[workflowIndex],
      name: name || workflows[workflowIndex].name,
      description: description || workflows[workflowIndex].description,
      nodes: nodes || workflows[workflowIndex].nodes,
      connections: connections || workflows[workflowIndex].connections,
      status: status || workflows[workflowIndex].status,
      updatedAt: new Date()
    }

    // Validar workflow si tiene nodos y conexiones
    if (updatedWorkflow.nodes.length > 0) {
      const validation = validateWorkflow(updatedWorkflow)
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
    }

    workflows[workflowIndex] = updatedWorkflow

    return NextResponse.json({
      success: true,
      data: updatedWorkflow,
      message: 'Workflow actualizado exitosamente'
    })
  } catch (error) {
    console.error('Error updating workflow:', error)
    return NextResponse.json(
      { success: false, message: 'Error al actualizar workflow' },
      { status: 500 }
    )
  }
}

// DELETE /api/workflows - Eliminar workflow
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'ID de workflow requerido' },
        { status: 400 }
      )
    }

    const workflowIndex = workflows.findIndex(w => w.id === id)
    if (workflowIndex === -1) {
      return NextResponse.json(
        { success: false, message: 'Workflow no encontrado' },
        { status: 404 }
      )
    }

    const deletedWorkflow = workflows.splice(workflowIndex, 1)[0]

    return NextResponse.json({
      success: true,
      data: deletedWorkflow,
      message: 'Workflow eliminado exitosamente'
    })
  } catch (error) {
    console.error('Error deleting workflow:', error)
    return NextResponse.json(
      { success: false, message: 'Error al eliminar workflow' },
      { status: 500 }
    )
  }
}