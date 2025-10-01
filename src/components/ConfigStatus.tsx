'use client';

import React from 'react';
import { CheckCircle, XCircle, AlertCircle, ExternalLink } from 'lucide-react';
import { isSupabaseConfigured } from '@/lib/supabase-config';
import { isOAuthConfigured, oauthSetupUrls } from '@/lib/oauth-config';
import { isOpenAIConfigured } from '@/lib/openai-config';
import { isStripeConfigured } from '@/lib/stripe-config';

interface ConfigItemProps {
  title: string;
  description: string;
  isConfigured: boolean;
  setupUrl?: string;
  priority: 'high' | 'medium' | 'low';
}

const ConfigItem: React.FC<ConfigItemProps> = ({ title, description, isConfigured, setupUrl, priority }) => {
  const getIcon = () => {
    if (isConfigured) return <CheckCircle className="w-5 h-5 text-green-500" />;
    if (priority === 'high') return <XCircle className="w-5 h-5 text-red-500" />;
    return <AlertCircle className="w-5 h-5 text-yellow-500" />;
  };

  const getBgColor = () => {
    if (isConfigured) return 'bg-green-50 border-green-200';
    if (priority === 'high') return 'bg-red-50 border-red-200';
    return 'bg-yellow-50 border-yellow-200';
  };

  return (
    <div className={`p-4 rounded-lg border ${getBgColor()}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          {getIcon()}
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-600 mt-1">{description}</p>
            {setupUrl && !isConfigured && (
              <a
                href={setupUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-700 mt-2"
              >
                <span>Configurar</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>
        <div className="text-xs text-gray-500">
          {isConfigured ? 'Configurado' : 'Pendiente'}
        </div>
      </div>
    </div>
  );
};

export const ConfigStatus: React.FC = () => {
  const configItems = [
    {
      title: 'Base de Datos (Supabase)',
      description: 'Almacenamiento de datos, usuarios y workflows',
      isConfigured: isSupabaseConfigured(),
      setupUrl: 'https://supabase.com',
      priority: 'high' as const,
    },
    {
      title: 'Autenticación OAuth',
      description: 'Login con Google y GitHub para mejor UX',
      isConfigured: isOAuthConfigured(),
      setupUrl: oauthSetupUrls.google,
      priority: 'medium' as const,
    },
    {
      title: 'OpenAI',
      description: 'Funcionalidades de IA para chatbots y workflows',
      isConfigured: isOpenAIConfigured(),
      setupUrl: 'https://platform.openai.com/api-keys',
      priority: 'medium' as const,
    },
    {
      title: 'Stripe',
      description: 'Procesamiento de pagos y suscripciones',
      isConfigured: isStripeConfigured(),
      setupUrl: 'https://dashboard.stripe.com/apikeys',
      priority: 'low' as const,
    },
  ];

  const configuredCount = configItems.filter(item => item.isConfigured).length;
  const totalCount = configItems.length;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Estado de Configuración</h2>
          <p className="text-sm text-gray-600 mt-1">
            {configuredCount} de {totalCount} servicios configurados
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-900">
            {Math.round((configuredCount / totalCount) * 100)}%
          </div>
          <div className="text-xs text-gray-500">Completado</div>
        </div>
      </div>

      <div className="space-y-4">
        {configItems.map((item, index) => (
          <ConfigItem key={index} {...item} />
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            {configuredCount === totalCount 
              ? '🎉 ¡Todas las configuraciones están completas!' 
              : `Faltan ${totalCount - configuredCount} configuraciones para funcionalidad completa`
            }
          </div>
          <div className="w-32 bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(configuredCount / totalCount) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
