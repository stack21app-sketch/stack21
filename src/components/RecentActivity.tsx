'use client';

import React from 'react';
import { Activity, User, Workflow, CheckCircle, AlertCircle, Clock, ArrowRight } from 'lucide-react';

interface ActivityItem {
  id: string;
  type: 'workflow' | 'user' | 'system';
  action: string;
  description: string;
  time: string;
  status: 'success' | 'warning' | 'info';
  user?: string;
}

export function RecentActivity() {
  const activities: ActivityItem[] = [
    {
      id: '1',
      type: 'workflow',
      action: 'Workflow ejecutado',
      description: 'Automatización de leads completada exitosamente',
      time: 'Hace 5 minutos',
      status: 'success',
      user: 'Sistema'
    },
    {
      id: '2',
      type: 'user',
      action: 'Usuario agregado',
      description: 'María García se unió al workspace',
      time: 'Hace 15 minutos',
      status: 'info',
      user: 'Admin'
    },
    {
      id: '3',
      type: 'workflow',
      action: 'Workflow pausado',
      description: 'Procesamiento de facturas pausado por error',
      time: 'Hace 1 hora',
      status: 'warning',
      user: 'Sistema'
    },
    {
      id: '4',
      type: 'system',
      action: 'Backup completado',
      description: 'Respaldo automático de datos realizado',
      time: 'Hace 2 horas',
      status: 'success',
      user: 'Sistema'
    },
    {
      id: '5',
      type: 'user',
      action: 'Configuración actualizada',
      description: 'Preferencias de notificaciones modificadas',
      time: 'Hace 3 horas',
      status: 'info',
      user: 'Tú'
    }
  ];

  const getIcon = (type: string, status: string) => {
    if (type === 'workflow') {
      return status === 'success' ? 
        <CheckCircle className="w-4 h-4 text-green-500" /> :
        <AlertCircle className="w-4 h-4 text-yellow-500" />;
    }
    if (type === 'user') {
      return <User className="w-4 h-4 text-blue-500" />;
    }
    return <Activity className="w-4 h-4 text-[var(--brand)]" />;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'info': return 'text-blue-600';
      default: return 'text-[var(--muted)]';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-[var(--border)] p-6 shadow-soft">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[var(--pastel-green)] rounded-lg">
            <Activity className="w-5 h-5 text-[var(--brand)]" />
          </div>
          <div>
            <h3 className="font-semibold text-[var(--text)]">Actividad Reciente</h3>
            <p className="text-sm text-[var(--muted)]">Últimas acciones en tu workspace</p>
          </div>
        </div>
        <button className="text-sm text-[var(--brand)] hover:text-[var(--brand-hover)] transition-colors">
          Ver todo
        </button>
      </div>

      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div
            key={activity.id}
            className="flex items-start gap-3 p-3 rounded-lg hover:bg-[var(--pastel-blue)] transition-colors group"
          >
            <div className="flex-shrink-0 mt-1">
              {getIcon(activity.type, activity.status)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-[var(--text)] text-sm">
                  {activity.action}
                </span>
                <span className={`text-xs ${getStatusColor(activity.status)}`}>
                  {activity.status}
                </span>
              </div>
              <p className="text-sm text-[var(--muted)] mb-1">
                {activity.description}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-[var(--muted)] flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {activity.time}
                </span>
                {activity.user && (
                  <span className="text-xs text-[var(--muted)]">
                    {activity.user}
                  </span>
                )}
              </div>
            </div>
            <button className="opacity-0 group-hover:opacity-100 transition-opacity">
              <ArrowRight className="w-4 h-4 text-[var(--muted)]" />
            </button>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-[var(--border)]">
        <button className="w-full flex items-center justify-center gap-2 py-2 text-sm text-[var(--brand)] hover:text-[var(--brand-hover)] transition-colors">
          <Activity className="w-4 h-4" />
          Ver historial completo
        </button>
      </div>
    </div>
  );
}
