import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
// import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

// GET /api/templates - Listar templates disponibles
export async function GET(request: NextRequest) {
  try {
    const token = await getToken({ req: request });
    if (!token || !token.sub) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const featured = searchParams.get('featured') === 'true';
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    // Construir filtros
    const where: any = {};

    if (category) {
      where.category = category;
    }

    if (featured) {
      where.featured = true;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { summary: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { tags: { has: search } },
      ];
    }

    // Obtener templates con paginación
    const [templates, total] = await Promise.all([
      prisma.template.findMany({
        where,
        orderBy: [
          { featured: 'desc' },
          { downloads: 'desc' },
          { rating: 'desc' },
          { createdAt: 'desc' },
        ],
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.template.count({ where }),
    ]);

    // Obtener categorías disponibles
    const categories = await prisma.template.findMany({
      select: { category: true },
      distinct: ['category'],
    });

    return NextResponse.json({
      templates: templates.map(template => ({
        id: template.id,
        title: template.title,
        summary: template.summary,
        description: template.description,
        category: template.category,
        featured: template.featured,
        downloads: template.downloads,
        rating: template.rating,
        tags: template.tags,
        createdAt: template.createdAt,
        updatedAt: template.updatedAt,
      })),
      categories: categories
        .map(c => c.category)
        .filter(Boolean)
        .sort(),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error obteniendo templates:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}