'use client';

import { BackupManager } from '@/components/backup-manager';

export default function BackupsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Sistema de Respaldo y Restauración
          </h1>
          <p className="text-xl text-gray-600">
            Gestiona respaldos automáticos y restauraciones de datos
          </p>
        </div>
        
        <BackupManager />
      </div>
    </div>
  );
}
