import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
// import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import fs from 'fs';
import path from 'path';

// GET /api/apps - Listar apps disponibles
export async function GET(request: NextRequest) {
  try {
    const token = await getToken({ req: request });
    const isProd = process.env.NODE_ENV === 'production';
    if (isProd && (!token || !token.sub)) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    // Leer datos desde archivos generados
    const dataDir = path.join(process.cwd(), 'src', 'data');
    const appsPath = path.join(dataDir, 'apps.json');
    const categoriesPath = path.join(dataDir, 'categories.json');

    const appsAll = fs.existsSync(appsPath)
      ? (JSON.parse(fs.readFileSync(appsPath, 'utf8')) as any[])
      : [];
    const categoriesData = fs.existsSync(categoriesPath)
      ? (JSON.parse(fs.readFileSync(categoriesPath, 'utf8')) as Record<string, any>)
      : {};

    // Fallback en memoria (desarrollo) si no hay archivo de datos
    const fallbackApps: any[] = [
      { id: 'app_github', slug: 'github', name: 'GitHub', description: 'Repos, Issues y PRs', category: 'Development & IT', logoUrl: 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png', docsUrl: 'https://docs.github.com', oauthType: 'oauth2', featured: true, popularity: 420 },
      { id: 'app_slack', slug: 'slack', name: 'Slack', description: 'Mensajería para equipos', category: 'Communication', logoUrl: 'https://a.slack-edge.com/80588/marketing/img/meta/slack_hash_256.png', docsUrl: 'https://api.slack.com', oauthType: 'oauth2', popularity: 380 },
      { id: 'app_notion', slug: 'notion', name: 'Notion', description: 'Docs y bases de conocimiento', category: 'Productivity', logoUrl: 'https://www.notion.so/front-static/logo-ios.png', docsUrl: 'https://developers.notion.com', oauthType: 'oauth2', popularity: 300 },
      { id: 'app_gmail', slug: 'gmail', name: 'Gmail', description: 'Correo de Google', category: 'Communication', logoUrl: 'https://ssl.gstatic.com/ui/v1/icons/mail/rfr/gmail.ico', docsUrl: 'https://developers.google.com/gmail/api', oauthType: 'oauth2', popularity: 500 },
      { id: 'app_http', slug: 'http', name: 'HTTP', description: 'Conector HTTP genérico', category: 'Development & IT', logoUrl: undefined, docsUrl: 'https://developer.mozilla.org/docs/Web/HTTP', oauthType: 'none', featured: true, popularity: 999 },
    ];
    const useFallback = appsAll.length === 0;
    const appsSource = useFallback ? fallbackApps : appsAll;

    // Filtrar
    const normalizedSearch = (search || '').trim().toLowerCase();
    const filtered = appsSource.filter((app) => {
      if (category && category !== 'all' && app.category !== category) return false;
      if (normalizedSearch) {
        const haystack = `${app.name} ${app.description} ${app.category}`.toLowerCase();
        if (!haystack.includes(normalizedSearch)) return false;
      }
      return app.isActive !== false;
    });

    const total = filtered.length;
    const start = (page - 1) * limit;
    const pageItems = filtered
      .sort((a, b) => String(a.name).localeCompare(String(b.name)))
      .slice(start, start + limit);

    return NextResponse.json({
      apps: pageItems.map((app) => ({
        id: app.id,
        slug: app.slug,
        name: app.name,
        description: app.description,
        category: app.category,
        logoUrl: app.logoUrl,
        docsUrl: app.docsUrl,
        oauthType: app.oauthType || 'api_key',
        connectionCount: Number(app.connectionCount || app.popularity || 0),
        createdAt: app.createdAt,
        updatedAt: app.updatedAt,
        featured: Boolean(app.featured),
      })),
      categories: useFallback
        ? Array.from(new Set(fallbackApps.map((a) => a.category))).sort()
        : Object.keys(categoriesData).sort(),
      pagination: {
        page,
        limit,
        total: total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error obteniendo apps:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
