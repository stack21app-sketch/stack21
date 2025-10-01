import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const redirectUri = searchParams.get('redirect_uri');
  const clientId = searchParams.get('client_id');
  const state = searchParams.get('state') || undefined;
  const appSlug = searchParams.get('app_slug') || searchParams.get('app') || undefined;

  if (!redirectUri || !clientId || !appSlug) {
    return NextResponse.json({ error: 'Faltan parámetros' }, { status: 400 });
  }

  // Simula consentimiento exitoso y genera código
  const code = `demo_code_${Math.random().toString(36).slice(2, 8)}`;

  const url = new URL(redirectUri);
  url.searchParams.set('code', code);
  if (state) url.searchParams.set('state', state);
  url.searchParams.set('app_slug', appSlug);

  return NextResponse.redirect(url.toString());
}


