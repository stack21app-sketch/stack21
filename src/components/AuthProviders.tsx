'use client';

import { useState, useEffect } from 'react';
import { signIn } from 'next-auth/react';
import { motion } from 'framer-motion';
import { Github, Chrome, AlertCircle } from 'lucide-react';

interface Provider {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  available: boolean;
}

export function AuthProviders() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Obtener providers disponibles desde la API de NextAuth
    const fetchProviders = async () => {
      try {
        const response = await fetch('/api/auth/providers');
        const data = await response.json();
        
        const availableProviders: Provider[] = [
          {
            id: 'google',
            name: 'Google',
            icon: <Chrome className="w-5 h-5" />,
            color: 'text-red-500',
            available: !!data.google
          },
          {
            id: 'github',
            name: 'GitHub',
            icon: <Github className="w-5 h-5" />,
            color: 'text-[var(--text)]',
            available: !!data.github
          }
        ];

        setProviders(availableProviders);
      } catch (error) {
        console.error('Error al obtener providers:', error);
        // Fallback a providers no disponibles
        setProviders([
          {
            id: 'google',
            name: 'Google',
            icon: <Chrome className="w-5 h-5" />,
            color: 'text-red-500',
            available: false
          },
          {
            id: 'github',
            name: 'GitHub',
            icon: <Github className="w-5 h-5" />,
            color: 'text-[var(--text)]',
            available: false
          }
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProviders();
  }, []);

  const handleSocialSignIn = async (providerId: string) => {
    setIsLoading(true);
    try {
      await signIn(providerId, { callbackUrl: '/dashboard' });
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        <div className="w-full py-3 border border-[var(--border)] rounded-lg animate-pulse bg-gray-100"></div>
        <div className="w-full py-3 border border-[var(--border)] rounded-lg animate-pulse bg-gray-100"></div>
      </div>
    );
  }

  console.log('AuthProviders - providers:', providers);
  console.log('AuthProviders - availableProviders:', providers.filter(p => p.available));

  const availableProviders = providers.filter(p => p.available);
  const unavailableProviders = providers.filter(p => !p.available);

  return (
    <div className="space-y-3">
      {/* Providers disponibles */}
      {availableProviders.map((provider) => (
        <motion.button
          key={provider.id}
          onClick={() => handleSocialSignIn(provider.id)}
          disabled={isLoading}
          className="w-full py-3 border border-[var(--border)] rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-3"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <span className={provider.color}>{provider.icon}</span>
          <span className="font-medium text-[var(--text)]">{provider.name}</span>
        </motion.button>
      ))}

      {/* Providers no disponibles */}
      {unavailableProviders.map((provider) => (
        <motion.div
          key={provider.id}
          className="w-full py-3 border border-gray-200 rounded-lg bg-gray-50 flex items-center justify-center gap-3 opacity-60"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
        >
          <span className={provider.color}>{provider.icon}</span>
          <span className="font-medium text-gray-500">{provider.name}</span>
          <AlertCircle className="w-4 h-4 text-gray-400" />
        </motion.div>
      ))}

      {/* Mensaje informativo si no hay providers disponibles */}
      {availableProviders.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-600 text-sm"
        >
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">OAuth no configurado</p>
              <p className="text-xs mt-1">
                Google y GitHub OAuth no están configurados. Usa las credenciales demo o configura OAuth en las variables de entorno.
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
