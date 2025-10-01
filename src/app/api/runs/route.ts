import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
// import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

// GET /api/runs - Listar ejecuciones del usuario
export async function GET(request: NextRequest) {
  try {
    const token = await getToken({ req: request });
    if (!token || !token.sub) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const workflowId = searchParams.get('workflowId');
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    // Obtener workspace del usuario
    const userWorkspace = await prisma.workspaceMember.findFirst({
      where: { userId: token.sub },
      include: { workspace: true },
    });

    if (!userWorkspace) {
      return NextResponse.json({ error: 'Workspace no encontrado' }, { status: 404 });
    }

    // Construir filtros
    const where: any = {
      workflow: {
        project: {
          workspaceId: userWorkspace.workspaceId,
        },
      },
    };

    if (workflowId) {
      where.workflowId = workflowId;
    }

    if (status) {
      where.status = status.toUpperCase();
    }

    // Obtener runs con paginación
    const [runs, total] = await Promise.all([
      prisma.run.findMany({
        where,
        include: {
          workflow: {
            include: {
              project: true,
            },
          },
          runSteps: {
            orderBy: { startedAt: 'asc' },
          },
        },
        orderBy: { startedAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.run.count({ where }),
    ]);

    return NextResponse.json({
      runs: runs.map(run => ({
        id: run.id,
        workflowId: run.workflowId,
        workflowName: run.workflow.name,
        projectName: run.workflow.project.name,
        status: run.status.toLowerCase(),
        input: run.input,
        output: run.output,
        error: run.error,
        costCents: run.costCents,
        logsUrl: run.logsUrl,
        startedAt: run.startedAt,
        finishedAt: run.finishedAt,
        duration: run.finishedAt 
          ? new Date(run.finishedAt).getTime() - new Date(run.startedAt).getTime()
          : null,
        stepCount: run.runSteps.length,
        completedSteps: run.runSteps.filter(step => step.status === 'COMPLETED').length,
        failedSteps: run.runSteps.filter(step => step.status === 'FAILED').length,
        runSteps: run.runSteps.map(step => ({
          id: step.id,
          name: step.name,
          status: step.status.toLowerCase(),
          startedAt: step.startedAt,
          finishedAt: step.finishedAt,
          duration: step.finishedAt 
            ? new Date(step.finishedAt).getTime() - new Date(step.startedAt).getTime()
            : null,
        })),
      })),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error obteniendo runs:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
