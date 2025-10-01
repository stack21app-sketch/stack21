import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
// import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import fs from 'fs';
import path from 'path';

// GET /api/apps/[slug] - Obtener app específica
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const token = await getToken({ req: request });
    const isProd = process.env.NODE_ENV === 'production';
    if (isProd && (!token || !token.sub)) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const dataDir = path.join(process.cwd(), 'src', 'data');
    const appsPath = path.join(dataDir, 'apps.json');
    const appsAll = fs.existsSync(appsPath)
      ? (JSON.parse(fs.readFileSync(appsPath, 'utf8')) as any[])
      : [];

    const app = appsAll.find((a) => a.slug === params.slug) || null;

    if (!app) {
      return NextResponse.json({ error: 'App no encontrada' }, { status: 404 });
    }

    return NextResponse.json({
      id: app.id,
      slug: app.slug,
      name: app.name,
      description: app.description,
      category: app.category,
      logoUrl: app.logoUrl,
      docsUrl: app.docsUrl,
      oauthType: app.oauthType || 'api_key',
      connectionCount: Number(app.connectionCount || app.popularity || 0),
      features: app.features || [],
      pricing: app.pricing || null,
      createdAt: app.createdAt,
      updatedAt: app.updatedAt,
    });
  } catch (error) {
    console.error('Error obteniendo app:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
