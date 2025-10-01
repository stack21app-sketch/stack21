'use client';

import React, { useEffect, useState } from 'react';

interface Connection {
  id: string;
  userId: string;
  name: string;
  appSlug: string;
  authType: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function ConnectionsPage() {
  const [items, setItems] = useState<Connection[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ page: String(page), limit: '20' });
      const res = await fetch(`/api/connections?${params}`);
      if (!res.ok) throw new Error('No se pudo obtener conexiones');
      const data = await res.json();
      setItems(data?.connections || []);
      setPages(data?.pagination?.pages || 1);
    } catch (e: any) {
      setError(e?.message || 'Error inesperado');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [page]);

  const handleDelete = async (id: string) => {
    if (!confirm('¿Desconectar esta conexión?')) return;
    try {
      const res = await fetch(`/api/connections?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('No se pudo eliminar');
      await load();
    } catch (e) {
      alert('Error al eliminar');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Mis Conexiones</h1>
        {error && <div className="mb-4 text-red-700 bg-red-50 border border-red-200 rounded p-3">{error}</div>}

        {loading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-16 bg-white border rounded animate-pulse" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="text-gray-600">No tienes conexiones aún.</div>
        ) : (
          <div className="bg-white border rounded">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b">
                  <th className="p-3">Nombre</th>
                  <th className="p-3">Aplicación</th>
                  <th className="p-3">Auth</th>
                  <th className="p-3">Estado</th>
                  <th className="p-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {items.map((c) => (
                  <tr key={c.id} className="border-b last:border-0">
                    <td className="p-3">{c.name}</td>
                    <td className="p-3">{c.appSlug}</td>
                    <td className="p-3">{c.authType.toUpperCase()}</td>
                    <td className="p-3">{c.isActive ? 'Activa' : 'Inactiva'}</td>
                    <td className="p-3 text-right">
                      <button
                        className="px-3 py-1 border rounded text-red-600 hover:bg-red-50"
                        onClick={() => handleDelete(c.id)}
                      >
                        Desconectar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!loading && items.length > 0 && (
          <div className="flex items-center justify-center gap-4 mt-6">
            <button
              className="px-4 py-2 border rounded disabled:opacity-50"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
            >
              Anterior
            </button>
            <span className="text-sm text-gray-600">Página {page} de {pages}</span>
            <button
              className="px-4 py-2 border rounded disabled:opacity-50"
              onClick={() => setPage((p) => Math.min(pages, p + 1))}
              disabled={page >= pages}
            >
              Siguiente
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
