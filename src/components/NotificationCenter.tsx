'use client';

import React, { useState } from 'react';
import { Bell, Check, X, AlertCircle, CheckCircle, Info, Zap, Clock } from 'lucide-react';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'warning' | 'error' | 'info';
  time: string;
  read: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'Workflow Completado',
      message: 'La automatización de leads se ejecutó exitosamente',
      type: 'success',
      time: 'Hace 5 minutos',
      read: false,
      action: {
        label: 'Ver detalles',
        onClick: () => console.log('Ver detalles')
      }
    },
    {
      id: '2',
      title: 'Nuevo Lead',
      message: 'Se recibió un nuevo lead desde Facebook Ads',
      type: 'info',
      time: 'Hace 15 minutos',
      read: false
    },
    {
      id: '3',
      title: 'Error en Workflow',
      message: 'El workflow de facturas falló en el paso 3',
      type: 'error',
      time: 'Hace 1 hora',
      read: true,
      action: {
        label: 'Reintentar',
        onClick: () => console.log('Reintentar')
      }
    },
    {
      id: '4',
      title: 'Mantenimiento Programado',
      message: 'El sistema estará en mantenimiento mañana de 2-4 AM',
      type: 'warning',
      time: 'Hace 2 horas',
      read: true
    }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning': return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'error': return <X className="w-5 h-5 text-red-500" />;
      case 'info': return <Info className="w-5 h-5 text-blue-500" />;
      default: return <Bell className="w-5 h-5 text-[var(--muted)]" />;
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, read: true }))
    );
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-[var(--muted)] hover:text-[var(--text)] hover:bg-gray-100 rounded-lg transition-all duration-200"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-2xl border border-[var(--border)] z-50">
          <div className="p-4 border-b border-[var(--border)]">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-[var(--text)]">Notificaciones</h3>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-sm text-[var(--brand)] hover:text-[var(--brand-hover)] transition-colors"
                >
                  Marcar todas como leídas
                </button>
              )}
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length > 0 ? (
              <div className="py-2">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 border-b border-[var(--border)] last:border-b-0 hover:bg-[var(--pastel-blue)] transition-colors cursor-pointer ${
                      !notification.read ? 'bg-blue-50/50' : ''
                    }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex items-start gap-3">
                      {getIcon(notification.type)}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-[var(--text)] text-sm">
                            {notification.title}
                          </h4>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-[var(--brand)] rounded-full"></div>
                          )}
                        </div>
                        <p className="text-sm text-[var(--muted)] mt-1">
                          {notification.message}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-[var(--muted)] flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {notification.time}
                          </span>
                          {notification.action && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                notification.action?.onClick();
                              }}
                              className="text-xs text-[var(--brand)] hover:text-[var(--brand-hover)] transition-colors"
                            >
                              {notification.action.label}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-[var(--muted)]">
                <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No hay notificaciones</p>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-[var(--border)]">
            <button className="w-full text-sm text-[var(--brand)] hover:text-[var(--brand-hover)] transition-colors">
              Ver todas las notificaciones
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
