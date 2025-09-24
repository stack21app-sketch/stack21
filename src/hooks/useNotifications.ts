'use client'

import { useState, useEffect, useCallback } from 'react'
import { 
  getNotificationsByUser,
  getUnreadCount,
  getNotificationStats,
  getNotificationSettings,
  updateNotificationSettings,
  markNotificationAsRead,
  markNotificationAsArchived,
  markAllAsRead as markAllAsReadAPI,
  createNotification,
  type Notification,
  type NotificationSettings
} from '@/lib/notifications'

interface UseNotificationsOptions {
  userId: string
  autoRefresh?: boolean
  refreshInterval?: number
}

export function useNotifications({ 
  userId, 
  autoRefresh = true, 
  refreshInterval = 30000 
}: UseNotificationsOptions) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [stats, setStats] = useState<any>(null)
  const [settings, setSettings] = useState<NotificationSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadNotifications = useCallback(async (filters?: {
    isRead?: boolean
    isArchived?: boolean
    category?: string
    type?: string
    priority?: string
    limit?: number
    offset?: number
  }) => {
    try {
      setLoading(true)
      setError(null)
      
      const userNotifications = getNotificationsByUser(userId, filters)
      setNotifications(userNotifications)
      
      const count = getUnreadCount(userId)
      setUnreadCount(count)
      
      const userStats = getNotificationStats(userId)
      setStats(userStats)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading notifications')
    } finally {
      setLoading(false)
    }
  }, [userId])

  const loadSettings = useCallback(async () => {
    try {
      const userSettings = getNotificationSettings(userId)
      setSettings(userSettings)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading settings')
    }
  }, [userId])

  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      const success = markNotificationAsRead(notificationId)
      if (success) {
        setNotifications(prev => 
          prev.map(n => n.id === notificationId ? { ...n, isRead: true, readAt: new Date() } : n)
        )
        setUnreadCount(prev => Math.max(0, prev - 1))
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error marking notification as read')
    }
  }, [])

  const markAsArchived = useCallback(async (notificationId: string) => {
    try {
      const success = markNotificationAsArchived(notificationId)
      if (success) {
        setNotifications(prev => prev.filter(n => n.id !== notificationId))
        // Recalcular estadísticas
        const userStats = getNotificationStats(userId)
        setStats(userStats)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error archiving notification')
    }
  }, [userId])

  const markAllAsRead = useCallback(async () => {
    try {
      const count = await markAllAsReadAPI(userId)
      if (count > 0) {
        setNotifications(prev => 
          prev.map(n => ({ ...n, isRead: true, readAt: new Date() }))
        )
        setUnreadCount(0)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error marking all as read')
    }
  }, [userId])

  const updateSettings = useCallback(async (newSettings: Partial<NotificationSettings>) => {
    try {
      const updatedSettings = updateNotificationSettings(userId, newSettings)
      setSettings(updatedSettings)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error updating settings')
    }
  }, [userId])

  const createNewNotification = useCallback(async (
    templateId: string,
    variables: Record<string, any> = {},
    overrides: Partial<Notification> = {}
  ) => {
    try {
      const notification = createNotification(userId, templateId, variables, overrides)
      setNotifications(prev => [notification, ...prev])
      setUnreadCount(prev => prev + 1)
      
      // Actualizar estadísticas
      const userStats = getNotificationStats(userId)
      setStats(userStats)
      
      return notification
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error creating notification')
      throw err
    }
  }, [userId])

  const refresh = useCallback(() => {
    loadNotifications()
  }, [loadNotifications])

  // Auto-refresh
  useEffect(() => {
    if (autoRefresh && refreshInterval > 0) {
      const interval = setInterval(refresh, refreshInterval)
      return () => clearInterval(interval)
    }
  }, [autoRefresh, refreshInterval, refresh])

  // Cargar datos iniciales
  useEffect(() => {
    loadNotifications()
    loadSettings()
  }, [loadNotifications, loadSettings])

  return {
    // Data
    notifications,
    unreadCount,
    stats,
    settings,
    loading,
    error,
    
    // Actions
    loadNotifications,
    markAsRead,
    markAsArchived,
    markAllAsRead,
    updateSettings,
    createNewNotification,
    refresh,
    
    // Utils
    clearError: () => setError(null)
  }
}

// Hook para notificaciones en tiempo real (simulado)
export function useRealtimeNotifications(userId: string) {
  const [isConnected, setIsConnected] = useState(false)
  const [lastNotification, setLastNotification] = useState<Notification | null>(null)

  useEffect(() => {
    // Simular conexión WebSocket
    const connect = () => {
      setIsConnected(true)
      
      // Simular notificaciones en tiempo real cada 30 segundos
      const interval = setInterval(() => {
        // Solo para demostración - en producción esto vendría del WebSocket
        if (Math.random() > 0.7) { // 30% de probabilidad
          const templates = [
            'workflow-completed',
            'integration-connected',
            'achievement-unlocked',
            'team-invitation'
          ]
          const randomTemplate = templates[Math.floor(Math.random() * templates.length)]
          
          try {
            const notification = createNotification(userId, randomTemplate, {
              workflowName: 'Mi Workflow',
              integrationName: 'Mailchimp',
              achievementName: 'Nuevo Logro',
              workspaceName: 'Mi Equipo'
            })
            setLastNotification(notification)
          } catch (error) {
            console.error('Error creating realtime notification:', error)
          }
        }
      }, 30000)

      return () => {
        clearInterval(interval)
        setIsConnected(false)
      }
    }

    const cleanup = connect()
    return cleanup
  }, [userId])

  return {
    isConnected,
    lastNotification
  }
}

// Hook para notificaciones toast
export function useNotificationToasts() {
  const [toasts, setToasts] = useState<Notification[]>([])

  const addToast = useCallback((notification: Notification) => {
    setToasts(prev => [...prev, notification])
    
    // Auto-remove después de 5 segundos
    setTimeout(() => {
      setToasts(prev => prev.filter(n => n.id !== notification.id))
    }, 5000)
  }, [])

  const removeToast = useCallback((notificationId: string) => {
    setToasts(prev => prev.filter(n => n.id !== notificationId))
  }, [])

  const clearAllToasts = useCallback(() => {
    setToasts([])
  }, [])

  return {
    toasts,
    addToast,
    removeToast,
    clearAllToasts
  }
}
