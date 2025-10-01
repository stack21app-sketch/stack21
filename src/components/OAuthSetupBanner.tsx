'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Settings, ExternalLink, CheckCircle, AlertTriangle } from 'lucide-react';

export function OAuthSetupBanner() {
  const [isDismissed, setIsDismissed] = React.useState(false);

  // Verificar si OAuth está configurado
  const isOAuthConfigured = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID && 
                           process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID !== 'placeholder';

  if (isOAuthConfigured || isDismissed) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 mb-6"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Settings className="w-5 h-5 text-blue-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-blue-900 mb-1">
              Configuración de OAuth Recomendada
            </h3>
            <p className="text-sm text-blue-700 mb-3">
              Para una mejor experiencia de usuario, configura Google OAuth para permitir inicio de sesión con Google.
            </p>
            <div className="flex items-center space-x-4">
              <a
                href="/docs/oauth-setup"
                className="inline-flex items-center space-x-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Ver Guía de Configuración</span>
              </a>
              <button
                onClick={() => setIsDismissed(true)}
                className="text-sm text-blue-500 hover:text-blue-600 transition-colors"
              >
                Omitir por ahora
              </button>
            </div>
          </div>
        </div>
        <button
          onClick={() => setIsDismissed(true)}
          className="p-1 text-blue-400 hover:text-blue-600 transition-colors"
        >
          <AlertTriangle className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}