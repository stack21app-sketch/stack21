'use client';

import { WebhooksManager } from '@/components/webhooks-manager';

export default function WebhooksPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Sistema de Webhooks
          </h1>
          <p className="text-xl text-gray-600">
            Gestiona eventos en tiempo real para integraciones externas
          </p>
        </div>
        
        <WebhooksManager />
      </div>
    </div>
  );
}