import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// GET /api/workflows/[id] - Obtener workflow específico
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = await getToken({ req: request });
    if (!token || !token.sub) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const workflow = await prisma.workflow.findFirst({
      where: {
        id: params.id,
        project: {
          workspace: {
            members: {
              some: { userId: token.sub },
            },
          },
        },
      },
      include: {
        project: {
          include: {
            workspace: true,
          },
        },
        triggers: {
          include: {
            app: true,
          },
        },
        steps: {
          include: {
            app: true,
          },
          orderBy: { order: 'asc' },
        },
        runs: {
          take: 10,
          orderBy: { startedAt: 'desc' },
          include: {
            runSteps: {
              orderBy: { startedAt: 'asc' },
            },
          },
        },
        _count: {
          select: {
            runs: true,
          },
        },
      },
    });

    if (!workflow) {
      return NextResponse.json({ error: 'Workflow no encontrado' }, { status: 404 });
    }

    return NextResponse.json({
      id: workflow.id,
      name: workflow.name,
      description: workflow.description,
      status: workflow.status.toLowerCase(),
      isActive: workflow.isActive,
      version: workflow.version,
      projectId: workflow.projectId,
      projectName: workflow.project.name,
      workspaceName: workflow.project.workspace.name,
      definitionJson: workflow.definitionJson,
      triggers: workflow.triggers.map(trigger => ({
        id: trigger.id,
        type: trigger.type,
        config: trigger.config,
        isActive: trigger.isActive,
        app: trigger.app ? {
          id: trigger.app.id,
          name: trigger.app.name,
          slug: trigger.app.slug,
        } : null,
        createdAt: trigger.createdAt,
        updatedAt: trigger.updatedAt,
      })),
      steps: workflow.steps.map(step => ({
        id: step.id,
        order: step.order,
        type: step.type,
        appId: step.appId,
        actionKey: step.actionKey,
        codeLang: step.codeLang,
        code: step.code,
        config: step.config,
        app: step.app ? {
          id: step.app.id,
          name: step.app.name,
          slug: step.app.slug,
        } : null,
        createdAt: step.createdAt,
        updatedAt: step.updatedAt,
      })),
      recentRuns: workflow.runs.map(run => ({
        id: run.id,
        status: run.status.toLowerCase(),
        input: run.input,
        output: run.output,
        error: run.error,
        costCents: run.costCents,
        logsUrl: run.logsUrl,
        startedAt: run.startedAt,
        finishedAt: run.finishedAt,
        runSteps: run.runSteps.map(step => ({
          id: step.id,
          name: step.name,
          status: step.status.toLowerCase(),
          input: step.input,
          output: step.output,
          error: step.error,
          startedAt: step.startedAt,
          finishedAt: step.finishedAt,
        })),
      })),
      runCount: workflow._count.runs,
      createdAt: workflow.createdAt,
      updatedAt: workflow.updatedAt,
    });
  } catch (error) {
    console.error('Error obteniendo workflow:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// PUT /api/workflows/[id] - Actualizar workflow
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = await getToken({ req: request });
    if (!token || !token.sub) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await request.json();
    // const validatedData = UpdateWorkflowSchema.parse(body);
    const validatedData = body;

    // Verificar que el workflow pertenece al usuario
    const existingWorkflow = await prisma.workflow.findFirst({
      where: {
        id: params.id,
        project: {
          workspace: {
            members: {
              some: { userId: token.sub },
            },
          },
        },
      },
    });

    if (!existingWorkflow) {
      return NextResponse.json({ error: 'Workflow no encontrado' }, { status: 404 });
    }

    // Actualizar workflow
    const workflow = await prisma.workflow.update({
      where: { id: params.id },
      data: {
        ...validatedData,
        version: existingWorkflow.version + 1,
      },
      include: {
        project: true,
        triggers: true,
        steps: true,
      },
    });

    return NextResponse.json({
      id: workflow.id,
      name: workflow.name,
      description: workflow.description,
      status: workflow.status.toLowerCase(),
      isActive: workflow.isActive,
      version: workflow.version,
      projectId: workflow.projectId,
      projectName: workflow.project.name,
      triggerCount: workflow.triggers.length,
      stepCount: workflow.steps.length,
      createdAt: workflow.createdAt,
      updatedAt: workflow.updatedAt,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error actualizando workflow:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// DELETE /api/workflows/[id] - Eliminar workflow
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = await getToken({ req: request });
    if (!token || !token.sub) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // Verificar que el workflow pertenece al usuario
    const workflow = await prisma.workflow.findFirst({
      where: {
        id: params.id,
        project: {
          workspace: {
            members: {
              some: { userId: token.sub },
            },
          },
        },
      },
    });

    if (!workflow) {
      return NextResponse.json({ error: 'Workflow no encontrado' }, { status: 404 });
    }

    // Eliminar workflow (cascade eliminará triggers, steps, runs, etc.)
    await prisma.workflow.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error eliminando workflow:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}