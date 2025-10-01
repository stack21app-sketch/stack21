import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  timestamp: Date;
  read: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [permission, setPermission] = useState<NotificationPermission>('default');

  // Solicitar permisos de notificaciones
  const requestPermission = useCallback(async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      setPermission(permission);
      return permission;
    }
    return 'denied';
  }, []);

  // Crear notificación
  const createNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      read: false,
    };

    setNotifications(prev => [newNotification, ...prev]);

    // Mostrar toast
    switch (notification.type) {
      case 'success':
        toast.success(notification.message, { duration: 4000 });
        break;
      case 'error':
        toast.error(notification.message, { duration: 6000 });
        break;
      case 'warning':
        toast(notification.message, { 
          icon: '⚠️',
          duration: 5000,
          style: {
            background: '#fbbf24',
            color: '#1f2937',
          }
        });
        break;
      case 'info':
        toast(notification.message, { 
          icon: 'ℹ️',
          duration: 4000,
        });
        break;
    }

    // Mostrar notificación del navegador si está permitido
    if (permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/favicon.ico',
        tag: newNotification.id,
      });
    }

    return newNotification.id;
  }, [permission]);

  // Marcar como leída
  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true }
          : notification
      )
    );
  }, []);

  // Marcar todas como leídas
  const markAllAsRead = useCallback(() => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  }, []);

  // Eliminar notificación
  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  // Limpiar notificaciones leídas
  const clearRead = useCallback(() => {
    setNotifications(prev => prev.filter(notification => !notification.read));
  }, []);

  // Notificaciones no leídas
  const unreadCount = notifications.filter(n => !n.read).length;

  // Efectos
  useEffect(() => {
    requestPermission();
  }, [requestPermission]);

  // Notificaciones de ejemplo para desarrollo
  useEffect(() => {
    if (notifications.length === 0) {
      createNotification({
        title: '¡Bienvenido a Stack21!',
        message: 'Tu plataforma de automatización está lista para usar.',
        type: 'success',
      });
    }
  }, [notifications.length, createNotification]);

  return {
    notifications,
    unreadCount,
    permission,
    createNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearRead,
    requestPermission,
  };
}