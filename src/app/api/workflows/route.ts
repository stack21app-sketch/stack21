import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
// import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { WorkflowDefinition } from '@/types/automation';
import { z } from 'zod';

// Schema de validación para crear/actualizar workflows
const CreateWorkflowSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  projectId: z.string().cuid(),
  definitionJson: z.object({
    triggers: z.array(z.any()),
    steps: z.array(z.any()),
    variables: z.record(z.any()).optional(),
    tags: z.array(z.string()).optional(),
  }),
});

const UpdateWorkflowSchema = CreateWorkflowSchema.partial().omit({ projectId: true });

// GET /api/workflows - Listar workflows del usuario
export async function GET(request: NextRequest) {
  try {
    const token = await getToken({ req: request });
    if (!token || !token.sub) {
      // Modo demo: devolver datos mock si no hay token
      const mockWorkflows = [
        {
          id: 'wf_mock_1',
          name: 'Demo: Bienvenida de usuarios',
          description: 'Envía email de bienvenida y crea tarjeta en CRM',
          status: 'draft',
          isActive: false,
          version: 1,
          projectId: 'project_demo',
          projectName: 'Demo Project',
          triggerCount: 1,
          stepCount: 3,
          runCount: 0,
          lastRun: null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'wf_mock_2',
          name: 'Demo: Alerta de uso alto',
          description: 'Notifica por Slack cuando se supera el umbral',
          status: 'active',
          isActive: true,
          version: 2,
          projectId: 'project_demo',
          projectName: 'Demo Project',
          triggerCount: 2,
          stepCount: 4,
          runCount: 12,
          lastRun: null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
      return NextResponse.json({
        workflows: mockWorkflows,
        pagination: { page: 1, limit: 20, total: mockWorkflows.length, pages: 1 },
      });
    }

    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');
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
      project: {
        workspaceId: userWorkspace.workspaceId,
      },
    };

    if (projectId) {
      where.projectId = projectId;
    }

    if (status) {
      where.status = status.toUpperCase();
    }

    // Obtener workflows con paginación
    const [workflows, total] = await Promise.all([
      prisma.workflow.findMany({
        where,
        include: {
          project: true,
          triggers: true,
          steps: true,
          runs: {
            take: 1,
            orderBy: { startedAt: 'desc' },
          },
          _count: {
            select: {
              runs: true,
            },
          },
        },
        orderBy: { updatedAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.workflow.count({ where }),
    ]);

    return NextResponse.json({
      workflows: workflows.map(workflow => ({
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
        runCount: workflow._count.runs,
        lastRun: workflow.runs[0] ? {
          id: workflow.runs[0].id,
          status: workflow.runs[0].status.toLowerCase(),
          startedAt: workflow.runs[0].startedAt,
        } : null,
        createdAt: workflow.createdAt,
        updatedAt: workflow.updatedAt,
      })),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error obteniendo workflows:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// POST /api/workflows - Crear nuevo workflow
export async function POST(request: NextRequest) {
  try {
    const token = await getToken({ req: request });
    if (!token || !token.sub) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = CreateWorkflowSchema.parse(body);

    // Verificar que el proyecto pertenece al usuario
    const project = await prisma.project.findFirst({
      where: {
        id: validatedData.projectId,
        workspace: {
          members: {
            some: { userId: token.sub },
          },
        },
      },
    });

    if (!project) {
      return NextResponse.json({ error: 'Proyecto no encontrado' }, { status: 404 });
    }

    // Crear workflow
    const workflow = await prisma.workflow.create({
      data: {
        name: validatedData.name,
        description: validatedData.description,
        projectId: validatedData.projectId,
        definitionJson: validatedData.definitionJson,
        status: 'DRAFT',
        isActive: false,
        version: 1,
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

    console.error('Error creando workflow:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}