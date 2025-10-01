'use client';

import { useState, useEffect } from 'react';
import { AlertTriangle, X, ExternalLink } from 'lucide-react';

export function ConfigBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Mostrar banner si no hay configuración de Supabase
    const hasSupabaseConfig = process.env.NEXT_PUBLIC_SUPABASE_URL && 
      process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://placeholder.supabase.co';
    
    if (!hasSupabaseConfig) {
      setShow(true);
    }
  }, []);

  if (!show) return null;

  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <AlertTriangle className="h-5 w-5 text-yellow-400" />
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-yellow-800">
            Configuración Requerida
          </h3>
          <div className="mt-2 text-sm text-yellow-700">
            <p>
              Para usar todas las funcionalidades de Stack21, necesitas configurar Supabase.
              Actualmente estás usando datos de demostración.
            </p>
            <div className="mt-3">
              <a
                href="https://supabase.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium text-yellow-800 hover:text-yellow-900"
              >
                Configurar Supabase
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
        <div className="ml-auto pl-3">
          <button
            onClick={() => setShow(false)}
            className="inline-flex text-yellow-400 hover:text-yellow-500"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
