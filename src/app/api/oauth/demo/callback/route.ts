import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const appSlug = searchParams.get('app_slug');

    if (!code || !appSlug) {
      return NextResponse.json({ error: 'Missing code or app_slug' }, { status: 400 });
    }

    // Simular intercambio de tokens
    const accessToken = `mock_access_${Date.now()}`;
    const refreshToken = `mock_refresh_${Date.now()}`;

    // Obtener info de la app
    const appRes = await fetch(`${request.nextUrl.origin}/api/apps/${appSlug}`);
    if (!appRes.ok) {
      throw new Error('App no encontrada');
    }
    const app = await appRes.json();

    // Crear conexión directamente
    const connRes = await fetch(`${request.nextUrl.origin}/api/connections`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: `${app.name} OAuth Connection`,
        appSlug: app.slug,
        authType: 'oauth2',
        credentials: { accessToken, refreshToken, expiresIn: 3600 }
      })
    });

    if (!connRes.ok) {
      const errData = await connRes.json();
      console.error('Error creando conexión:', errData);
      throw new Error(errData.error || 'Error creando conexión');
    }

    const conn = await connRes.json();
    console.log('✅ OAuth callback: conexión creada', conn.id);

    // Redirigir al detalle de la app con éxito
    return NextResponse.redirect(
      `${request.nextUrl.origin}/apps/${appSlug}?status=success&connectionId=${conn.id}`
    );
  } catch (error) {
    console.error('Error en callback OAuth:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
