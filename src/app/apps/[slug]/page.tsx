'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ExternalLink, Download, ArrowLeft, CheckCircle2 } from 'lucide-react';

interface AppDetail {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  logoUrl?: string;
  docsUrl?: string;
  oauthType?: string;
  connectionCount?: number;
  features?: string[];
  pricing?: any;
}

export default function AppDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = String(params?.slug || '');
  const [loading, setLoading] = useState(true);
  const [app, setApp] = useState<AppDetail | null>(null);
  const [connLoading, setConnLoading] = useState(false);
  const [connections, setConnections] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/apps/${slug}`);
        if (!res.ok) throw new Error('Error');
        const data = await res.json();
        setApp(data);
      } catch (e) {
        setApp(null);
      } finally {
        setLoading(false);
      }
    };
    if (slug) load();
  }, [slug]);

  useEffect(() => {
    const loadConnections = async () => {
      if (!slug) return;
      setConnLoading(true);
      try {
        const res = await fetch(`/api/connections?appSlug=${encodeURIComponent(slug)}&page=1&limit=5`);
        if (!res.ok) throw new Error('Error');
        const data = await res.json();
        setConnections(Array.isArray(data?.connections) ? data.connections : []);
      } catch {
        setConnections([]);
      } finally {
        setConnLoading(false);
      }
    };
    loadConnections();
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="h-8 w-40 bg-gray-200 rounded mb-6"></div>
        <div className="h-6 w-80 bg-gray-200 rounded mb-3"></div>
        <div className="h-6 w-64 bg-gray-200 rounded"></div>
      </div>
    );
  }

  if (!app) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-center">
        <p className="text-gray-600 mb-6">La aplicación no fue encontrada.</p>
        <Link href="/apps" className="text-blue-600 hover:underline">Volver al directorio</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6">
          <ArrowLeft className="w-4 h-4" /> Volver
        </button>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              {app.logoUrl ? (
                <img src={app.logoUrl} alt={app.name} className="w-16 h-16 rounded-lg object-contain" />
              ) : (
                <div className="w-16 h-16 bg-gray-100 rounded-lg" />
              )}
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{app.name}</h1>
                <p className="text-gray-600">{app.category}</p>
              </div>
            </div>
            <Link
              href={`/apps/${app.slug}/connect`}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
            >
              Conectar
            </Link>
          </div>

          <p className="text-gray-700 mt-6">{app.description}</p>

          {Array.isArray(app.features) && app.features.length > 0 && (
            <div className="mt-8">
              <h2 className="font-semibold text-gray-900 mb-3">Características</h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {app.features.map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-gray-700">
                    <CheckCircle2 className="w-4 h-4 text-green-600" /> {f}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-8">
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-semibold text-gray-900">Tus conexiones</h2>
              <Link href="/connections" className="text-blue-600 hover:underline text-sm">Ir a Conexiones</Link>
            </div>
            {connLoading ? (
              <div className="text-gray-500 text-sm">Cargando conexiones…</div>
            ) : connections.length === 0 ? (
              <div className="text-gray-600 text-sm">No tienes conexiones para esta app.</div>
            ) : (
              <ul className="divide-y border rounded">
                {connections.map((c) => (
                  <li key={c.id} className="p-3 flex items-center justify-between text-sm">
                    <div>
                      <div className="font-medium text-gray-900">{c.name}</div>
                      <div className="text-gray-500">{c.authType?.toUpperCase?.() || 'AUTH'}</div>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded ${c.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                      {c.isActive ? 'Activa' : 'Inactiva'}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {app.docsUrl && (
            <div className="mt-8">
              <a href={app.docsUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-blue-600 hover:underline">
                <ExternalLink className="w-4 h-4" /> Ver documentación
              </a>
            </div>
          )}

          <div className="mt-8 text-sm text-gray-500 flex items-center gap-4">
            <span className="flex items-center gap-1"><Download className="w-4 h-4" /> {app.connectionCount || 0} conexiones</span>
            <span>Auth: {(app.oauthType || 'api_key').toUpperCase()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
