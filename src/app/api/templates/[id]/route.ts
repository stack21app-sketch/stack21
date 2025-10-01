import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
// import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const ApplyTemplateSchema = z.object({
  projectId: z.string().cuid(),
  name: z.string().min(1).max(100),
  description: z.string().optional(),
});

// GET /api/templates/[id] - Obtener template específico
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = await getToken({ req: request });
    if (!token || !token.sub) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const template = await prisma.template.findUnique({
      where: { id: params.id },
    });

    if (!template) {
      return NextResponse.json({ error: 'Template no encontrado' }, { status: 404 });
    }

    return NextResponse.json({
      id: template.id,
      title: template.title,
      summary: template.summary,
      description: template.description,
      category: template.category,
      featured: template.featured,
      downloads: template.downloads,
      rating: template.rating,
      tags: template.tags,
      definitionJson: template.definitionJson,
      createdAt: template.createdAt,
      updatedAt: template.updatedAt,
    });
  } catch (error) {
    console.error('Error obteniendo template:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// POST /api/templates/[id]/apply - Aplicar template
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
    const { projectId, name, description } = ApplyTemplateSchema.parse(body);

    // Verificar que el template existe
    const template = await prisma.template.findUnique({
      where: { id: params.id },
    });

    if (!template) {
      return NextResponse.json({ error: 'Template no encontrado' }, { status: 404 });
    }

    // Verificar que el proyecto pertenece al usuario
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
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

    // Crear workflow desde template
    const workflow = await prisma.workflow.create({
      data: {
        name: name,
        description: description || template.summary,
        projectId: projectId,
        definitionJson: template.definitionJson as any,
        status: 'DRAFT',
        isActive: false,
        version: 1,
      },
    });

    // Incrementar contador de descargas
    await prisma.template.update({
      where: { id: params.id },
      data: {
        downloads: {
          increment: 1,
        },
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

    console.error('Error aplicando template:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
