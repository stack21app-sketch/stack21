import { NextRequest, NextResponse } from 'next/server'
import { workflowEngine } from '@/lib/workflow-engine'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const workflowId = params.id;
    const body = await request.json();
    const triggerData = body.data || {};

    // Verificar que el workflow existe
    const workflow = workflowEngine.getWorkflow(workflowId);
    if (!workflow) {
      return NextResponse.json(
        { error: 'Workflow not found' },
        { status: 404 }
      );
    }

    if (workflow.status !== 'active') {
      return NextResponse.json(
        { error: 'Workflow is not active' },
        { status: 400 }
      );
    }

    // Ejecutar el workflow
    const execution = await workflowEngine.executeWorkflow(workflowId, triggerData);

    return NextResponse.json({
      execution,
      workflow: {
        id: workflow.id,
        name: workflow.name,
        status: workflow.status
      }
    });

  } catch (error) {
    console.error('Error executing workflow:', error);
    return NextResponse.json(
      { error: 'Failed to execute workflow' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const workflowId = params.id;
    const executions = workflowEngine.getWorkflowExecutions(workflowId);

    return NextResponse.json({ executions });

  } catch (error) {
    console.error('Error fetching workflow executions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch executions' },
      { status: 500 }
    );
  }
}