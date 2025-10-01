import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { executeWorkflow } from '@/lib/execution-engine';

// POST /api/workflows/[id]/run - Ejecutar un workflow
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = await getToken({ req: request });
    if (!token || !token.sub) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const workflowId = params.id;
    const body = await request.json().catch(() => ({}));
    const triggerData = body.triggerData || {};

    // Ejecutar el workflow
    const run = await executeWorkflow(workflowId, triggerData);

    return NextResponse.json({
      runId: run.id,
      status: run.status,
      message: 'Workflow ejecutado correctamente'
    });
  } catch (error: any) {
    console.error('Error ejecutando workflow:', error);
    return NextResponse.json(
      { error: error.message || 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
