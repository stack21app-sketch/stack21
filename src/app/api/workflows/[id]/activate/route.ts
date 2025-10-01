import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
// import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const ActivateWorkflowSchema = z.object({
  isActive: z.boolean(),
});

// PUT /api/workflows/[id]/activate - Activar/desactivar workflow
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
    const { isActive } = ActivateWorkflowSchema.parse(body);

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
      include: {
        triggers: true,
        steps: true,
      },
    });

    if (!workflow) {
      return NextResponse.json({ error: 'Workflow no encontrado' }, { status: 404 });
    }

    // Validaciones para activar
    if (isActive) {
      if (workflow.triggers.length === 0) {
        return NextResponse.json(
          { error: 'El workflow debe tener al menos un trigger para activarse' },
          { status: 400 }
        );
      }

      if (workflow.steps.length === 0) {
        return NextResponse.json(
          { error: 'El workflow debe tener al menos un paso para activarse' },
          { status: 400 }
        );
      }

      // Verificar que todos los triggers estén activos
      const inactiveTriggers = workflow.triggers.filter(t => !t.isActive);
      if (inactiveTriggers.length > 0) {
        return NextResponse.json(
          { error: 'Todos los triggers deben estar activos para activar el workflow' },
          { status: 400 }
        );
      }
    }

    // Actualizar estado del workflow
    const updatedWorkflow = await prisma.workflow.update({
      where: { id: params.id },
      data: {
        isActive,
        status: isActive ? 'ACTIVE' : 'DRAFT',
      },
      include: {
        project: true,
        triggers: true,
        steps: true,
      },
    });

    // Si se está activando, crear webhooks para triggers HTTP
    if (isActive) {
      for (const trigger of workflow.triggers) {
        if (trigger.type === 'http_webhook' && trigger.config && typeof trigger.config === 'object' && trigger.config !== null && 'path' in trigger.config) {
          const config = trigger.config as { path: string };
          // Crear o actualizar webhook
          await prisma.webhook.upsert({
            where: { path: config.path },
            create: {
              projectId: workflow.projectId,
              path: config.path,
              secretHash: 'temp_hash', // TODO: Generar hash real
              isActive: true,
            },
            update: {
              isActive: true,
            },
          });
        }
      }
    } else {
      // Si se está desactivando, desactivar webhooks relacionados
      const webhookPaths = workflow.triggers
        .filter(t => t.type === 'http_webhook' && t.config && typeof t.config === 'object' && t.config !== null && 'path' in t.config)
        .map(t => (t.config as { path: string }).path);

      if (webhookPaths.length > 0) {
        await prisma.webhook.updateMany({
          where: {
            path: { in: webhookPaths },
            projectId: workflow.projectId,
          },
          data: { isActive: false },
        });
      }
    }

    return NextResponse.json({
      id: updatedWorkflow.id,
      name: updatedWorkflow.name,
      status: updatedWorkflow.status.toLowerCase(),
      isActive: updatedWorkflow.isActive,
      version: updatedWorkflow.version,
      projectId: updatedWorkflow.projectId,
      projectName: updatedWorkflow.project.name,
      triggerCount: updatedWorkflow.triggers.length,
      stepCount: updatedWorkflow.steps.length,
      updatedAt: updatedWorkflow.updatedAt,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error activando/desactivando workflow:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
