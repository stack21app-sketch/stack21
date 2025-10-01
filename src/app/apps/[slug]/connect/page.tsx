'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ConnectAppPage() {
  const params = useParams();
  const router = useRouter();
  const slug = String(params?.slug || '');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);

  const handleConnect = async () => {
    setStatus('loading');
    setError(null);
    try {
      const res = await fetch('/api/connections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `${slug} connection`,
          appSlug: slug,
          authType: 'oauth2',
          credentials: { access_token: 'demo' },
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({} as any));
        throw new Error((data as any)?.error || 'No se pudo crear la conexión');
      }
      await res.json();
      setStatus('success');
    } catch (e: any) {
      setStatus('error');
      setError(e?.message || 'Error inesperado');
    }
  };

  const handleOAuthDemoConnect = () => {
    // Redirect to the demo OAuth authorize endpoint
    const redirectUri = `${window.location.origin}/api/oauth/demo/callback`;
    const state = `state_${Date.now()}`; // Unique state for CSRF protection
    const authorizeUrl = `/api/oauth/demo/authorize?client_id=mock-client-id&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}&app_slug=${slug}`;
    router.push(authorizeUrl);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Conectar {slug}</h1>
        <p className="text-gray-600 mb-6">Inicia el flujo para conectar tu cuenta de {slug}.</p>

        <button
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
          onClick={handleConnect}
          disabled={status === 'loading' || status === 'success'}
        >
          {status === 'loading' ? 'Conectando…' : status === 'success' ? 'Conectado' : 'Conectar'}
        </button>

        <div className="mt-4">
          <button
            className="w-full px-4 py-2 border border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50"
            onClick={handleOAuthDemoConnect}
          >
            Conectar con OAuth demo
          </button>
        </div>

        {status === 'success' && (
          <div className="mt-6 text-green-700 bg-green-50 border border-green-200 rounded p-3">
            ¡Conexión completada! Ya puedes usar esta app en tus workflows.
          </div>
        )}

        {status === 'error' && (
          <div className="mt-6 text-red-700 bg-red-50 border border-red-200 rounded p-3">
            Ocurrió un error al conectar. {error || 'Inténtalo nuevamente.'}
          </div>
        )}

        <div className="mt-8 text-sm">
          <Link href={`/apps/${slug}`} className="text-blue-600 hover:underline">Volver al detalle</Link>
        </div>
      </div>
    </div>
  );
}


