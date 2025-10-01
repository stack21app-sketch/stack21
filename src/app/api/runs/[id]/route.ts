import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
// import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

// GET /api/runs/[id] - Obtener ejecución específica
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = await getToken({ req: request });
    if (!token || !token.sub) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const run = await prisma.run.findFirst({
      where: {
        id: params.id,
        workflow: {
          project: {
            workspace: {
              members: {
                some: { userId: token.sub },
              },
            },
          },
        },
      },
      include: {
        workflow: {
          include: {
            project: {
              include: {
                workspace: true,
              },
            },
          },
        },
        runSteps: {
          orderBy: { startedAt: 'asc' },
        },
      },
    });

    if (!run) {
      return NextResponse.json({ error: 'Ejecución no encontrada' }, { status: 404 });
    }

    return NextResponse.json({
      id: run.id,
      workflowId: run.workflowId,
      workflowName: run.workflow.name,
      projectName: run.workflow.project.name,
      workspaceName: run.workflow.project.workspace.name,
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
      runSteps: run.runSteps.map(step => ({
        id: step.id,
        stepId: step.stepId,
        name: step.name,
        status: step.status.toLowerCase(),
        input: step.input,
        output: step.output,
        error: step.error,
        startedAt: step.startedAt,
        finishedAt: step.finishedAt,
        duration: step.finishedAt 
          ? new Date(step.finishedAt).getTime() - new Date(step.startedAt).getTime()
          : null,
      })),
      summary: {
        totalSteps: run.runSteps.length,
        completedSteps: run.runSteps.filter(step => step.status === 'COMPLETED').length,
        failedSteps: run.runSteps.filter(step => step.status === 'FAILED').length,
        pendingSteps: run.runSteps.filter(step => step.status === 'PENDING').length,
        runningSteps: run.runSteps.filter(step => step.status === 'RUNNING').length,
        totalDuration: run.finishedAt 
          ? new Date(run.finishedAt).getTime() - new Date(run.startedAt).getTime()
          : null,
        averageStepDuration: run.runSteps.length > 0 
          ? run.runSteps
              .filter(step => step.finishedAt)
              .reduce((acc, step) => {
                const duration = new Date(step.finishedAt!).getTime() - new Date(step.startedAt).getTime();
                return acc + duration;
              }, 0) / run.runSteps.filter(step => step.finishedAt).length
          : null,
      },
    });
  } catch (error) {
    console.error('Error obteniendo run:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// DELETE /api/runs/[id] - Eliminar ejecución
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = await getToken({ req: request });
    if (!token || !token.sub) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // Verificar que el run pertenece al usuario
    const run = await prisma.run.findFirst({
      where: {
        id: params.id,
        workflow: {
          project: {
            workspace: {
              members: {
                some: { userId: token.sub },
              },
            },
          },
        },
      },
    });

    if (!run) {
      return NextResponse.json({ error: 'Ejecución no encontrada' }, { status: 404 });
    }

    // Eliminar run (cascade eliminará runSteps)
    await prisma.run.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error eliminando run:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
