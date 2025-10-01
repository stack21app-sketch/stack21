import { NextRequest, NextResponse } from 'next/server';
import { executeWorkflow } from '@/lib/execution-engine';
import fs from 'fs';
import path from 'path';

// GET/POST /api/webhooks/[path] - Endpoint para webhooks
export async function GET(request: NextRequest, { params }: { params: { path: string } }) {
  return handleWebhook(request, params.path);
}

export async function POST(request: NextRequest, { params }: { params: { path: string } }) {
  return handleWebhook(request, params.path);
}

async function handleWebhook(request: NextRequest, webhookPath: string) {
  try {
    // Obtener workflows que usan este webhook
    const workflows = getWorkflowsByWebhook(webhookPath);
    
    if (workflows.length === 0) {
      return NextResponse.json({ 
        error: 'No hay workflows configurados para este webhook' 
      }, { status: 404 });
    }

    // Obtener datos del webhook
    const body = await request.json().catch(() => ({}));
    const headers = Object.fromEntries(request.headers.entries());
    const query = Object.fromEntries(new URL(request.url).searchParams.entries());

    const webhookData = {
      body,
      headers,
      query,
      method: request.method,
      timestamp: new Date().toISOString(),
      path: webhookPath
    };

    // Ejecutar workflows
    const results = [];
    for (const workflow of workflows) {
      try {
        const run = await executeWorkflow(workflow.id, webhookData);
        results.push({
          workflowId: workflow.id,
          workflowName: workflow.name,
          runId: run.id,
          status: run.status
        });
      } catch (error: any) {
        results.push({
          workflowId: workflow.id,
          workflowName: workflow.name,
          error: error.message
        });
      }
    }

    return NextResponse.json({
      message: 'Webhook procesado correctamente',
      workflows: results,
      received: webhookData
    });

  } catch (error: any) {
    console.error('Error procesando webhook:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

function getWorkflowsByWebhook(webhookPath: string) {
  const workflowsPath = path.join(process.cwd(), 'src', 'data', 'workflows.json');
  
  if (!fs.existsSync(workflowsPath)) {
    return [];
  }

  try {
    const workflows = JSON.parse(fs.readFileSync(workflowsPath, 'utf8'));
    return workflows.filter((workflow: any) => 
      workflow.trigger?.type === 'webhook' && 
      workflow.trigger?.config?.path === `/${webhookPath}`
    );
  } catch {
    return [];
  }
}