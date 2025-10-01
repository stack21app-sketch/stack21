import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

// POST /api/templates/[id]/apply - Aplicar plantilla creando un nuevo workflow
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = await getToken({ req: request });
    if (!token || !token.sub) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const { name } = body;

    // En un futuro: obtener plantilla de BD y crear workflow
    const workflowId = `wf_${Math.random().toString(36).slice(2, 10)}`;
    
    return NextResponse.json({
      workflowId,
      name: name || `Workflow from template ${params.id}`,
      message: 'Plantilla aplicada correctamente'
    });
  } catch (error) {
    console.error('Error aplicando plantilla:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
