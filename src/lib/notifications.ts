// Sistema de Notificaciones para Stack21
export interface Notification {
  id: string
  userId: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error' | 'workflow' | 'integration' | 'team' | 'system'
  category: 'workflow' | 'integration' | 'team' | 'system' | 'billing' | 'security' | 'achievement'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  isRead: boolean
  isArchived: boolean
  createdAt: Date
  readAt?: Date
  archivedAt?: Date
  expiresAt?: Date
  actionUrl?: string
  actionText?: string
  metadata?: Record<string, any>
  icon?: string
  color?: string
}

export interface NotificationSettings {
  userId: string
  email: boolean
  push: boolean
  inApp: boolean
  categories: {
    workflow: boolean
    integration: boolean
    team: boolean
    system: boolean
    billing: boolean
    security: boolean
    achievement: boolean
  }
  frequency: 'instant' | 'hourly' | 'daily' | 'weekly'
  quietHours: {
    enabled: boolean
    start: string // HH:MM format
    end: string // HH:MM format
    timezone: string
  }
  digest: {
    enabled: boolean
    frequency: 'daily' | 'weekly'
    time: string // HH:MM format
  }
}

export interface NotificationTemplate {
  id: string
  name: string
  type: Notification['type']
  category: Notification['category']
  title: string
  message: string
  icon?: string
  color?: string
  actionText?: string
  variables: string[] // Variables que se pueden reemplazar en el template
}

// Templates de notificaciones
export const NOTIFICATION_TEMPLATES: NotificationTemplate[] = [
  {
    id: 'workflow-completed',
    name: 'Workflow Completado',
    type: 'success',
    category: 'workflow',
    title: 'Workflow "{workflowName}" completado exitosamente',
    message: 'Tu workflow se ejecutó correctamente y procesó {recordsCount} registros en {duration}.',
    icon: '✅',
    color: 'text-green-500',
    actionText: 'Ver detalles',
    variables: ['workflowName', 'recordsCount', 'duration']
  },
  {
    id: 'workflow-failed',
    name: 'Workflow Falló',
    type: 'error',
    category: 'workflow',
    title: 'Workflow "{workflowName}" falló',
    message: 'Hubo un error en tu workflow: {errorMessage}. Revisa la configuración.',
    icon: '❌',
    color: 'text-red-500',
    actionText: 'Reintentar',
    variables: ['workflowName', 'errorMessage']
  },
  {
    id: 'integration-connected',
    name: 'Integración Conectada',
    type: 'success',
    category: 'integration',
    title: 'Integración "{integrationName}" conectada',
    message: 'La integración se configuró correctamente y está lista para usar.',
    icon: '🔗',
    color: 'text-blue-500',
    actionText: 'Configurar',
    variables: ['integrationName']
  },
  {
    id: 'integration-disconnected',
    name: 'Integración Desconectada',
    type: 'warning',
    category: 'integration',
    title: 'Integración "{integrationName}" desconectada',
    message: 'La conexión se perdió. Verifica las credenciales.',
    icon: '⚠️',
    color: 'text-yellow-500',
    actionText: 'Reconectar',
    variables: ['integrationName']
  },
  {
    id: 'team-invitation',
    name: 'Invitación de Equipo',
    type: 'info',
    category: 'team',
    title: 'Invitación a "{workspaceName}"',
    message: '{inviterName} te invitó a unirte al workspace "{workspaceName}".',
    icon: '👥',
    color: 'text-purple-500',
    actionText: 'Aceptar',
    variables: ['workspaceName', 'inviterName']
  },
  {
    id: 'achievement-unlocked',
    name: 'Logro Desbloqueado',
    type: 'success',
    category: 'achievement',
    title: '¡Nuevo logro desbloqueado!',
    message: 'Has desbloqueado "{achievementName}" y ganado {points} puntos.',
    icon: '🏆',
    color: 'text-yellow-500',
    actionText: 'Ver logros',
    variables: ['achievementName', 'points']
  },
  {
    id: 'billing-payment-success',
    name: 'Pago Exitoso',
    type: 'success',
    category: 'billing',
    title: 'Pago procesado correctamente',
    message: 'Tu pago de ${amount} se procesó exitosamente. Gracias por tu suscripción.',
    icon: '💳',
    color: 'text-green-500',
    actionText: 'Ver factura',
    variables: ['amount']
  },
  {
    id: 'billing-payment-failed',
    name: 'Pago Falló',
    type: 'error',
    category: 'billing',
    title: 'Error en el pago',
    message: 'No pudimos procesar tu pago de ${amount}. Actualiza tu método de pago.',
    icon: '💳',
    color: 'text-red-500',
    actionText: 'Actualizar pago',
    variables: ['amount']
  },
  {
    id: 'security-login',
    name: 'Inicio de Sesión',
    type: 'info',
    category: 'security',
    title: 'Nuevo inicio de sesión',
    message: 'Se detectó un inicio de sesión desde {location} a las {time}.',
    icon: '🔐',
    color: 'text-blue-500',
    actionText: 'Ver actividad',
    variables: ['location', 'time']
  },
  {
    id: 'system-maintenance',
    name: 'Mantenimiento del Sistema',
    type: 'warning',
    category: 'system',
    title: 'Mantenimiento programado',
    message: 'El sistema estará en mantenimiento el {date} de {startTime} a {endTime}.',
    icon: '🔧',
    color: 'text-orange-500',
    actionText: 'Ver detalles',
    variables: ['date', 'startTime', 'endTime']
  }
]

// Notificaciones de ejemplo
export const SAMPLE_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif-1',
    userId: 'user-1',
    title: 'Workflow "Procesamiento de Leads" completado exitosamente',
    message: 'Tu workflow se ejecutó correctamente y procesó 45 registros en 2.3 minutos.',
    type: 'success',
    category: 'workflow',
    priority: 'medium',
    isRead: false,
    isArchived: false,
    createdAt: new Date('2024-01-20T14:30:00Z'),
    actionUrl: '/workflows/123',
    actionText: 'Ver detalles',
    icon: '✅',
    color: 'text-green-500',
    metadata: {
      workflowId: '123',
      recordsCount: 45,
      duration: '2.3 minutos'
    }
  },
  {
    id: 'notif-2',
    userId: 'user-1',
    title: 'Integración "Mailchimp" conectada',
    message: 'La integración se configuró correctamente y está lista para usar.',
    type: 'success',
    category: 'integration',
    priority: 'low',
    isRead: true,
    isArchived: false,
    createdAt: new Date('2024-01-20T12:15:00Z'),
    readAt: new Date('2024-01-20T12:20:00Z'),
    actionUrl: '/integrations/mailchimp',
    actionText: 'Configurar',
    icon: '🔗',
    color: 'text-blue-500',
    metadata: {
      integrationId: 'mailchimp',
      integrationName: 'Mailchimp'
    }
  },
  {
    id: 'notif-3',
    userId: 'user-1',
    title: '¡Nuevo logro desbloqueado!',
    message: 'Has desbloqueado "Maestro de Workflows" y ganado 200 puntos.',
    type: 'success',
    category: 'achievement',
    priority: 'high',
    isRead: false,
    isArchived: false,
    createdAt: new Date('2024-01-20T10:45:00Z'),
    actionUrl: '/gamification',
    actionText: 'Ver logros',
    icon: '🏆',
    color: 'text-yellow-500',
    metadata: {
      achievementId: 'workflow-master',
      achievementName: 'Maestro de Workflows',
      points: 200
    }
  },
  {
    id: 'notif-4',
    userId: 'user-1',
    title: 'Invitación a "Equipo Marketing"',
    message: 'María González te invitó a unirte al workspace "Equipo Marketing".',
    type: 'info',
    category: 'team',
    priority: 'medium',
    isRead: false,
    isArchived: false,
    createdAt: new Date('2024-01-20T09:30:00Z'),
    actionUrl: '/team/invitations',
    actionText: 'Aceptar',
    icon: '👥',
    color: 'text-purple-500',
    metadata: {
      workspaceId: 'workspace-123',
      workspaceName: 'Equipo Marketing',
      inviterName: 'María González',
      inviterId: 'user-2'
    }
  },
  {
    id: 'notif-5',
    userId: 'user-1',
    title: 'Pago procesado correctamente',
    message: 'Tu pago de $99.00 se procesó exitosamente. Gracias por tu suscripción.',
    type: 'success',
    category: 'billing',
    priority: 'low',
    isRead: true,
    isArchived: false,
    createdAt: new Date('2024-01-19T15:00:00Z'),
    readAt: new Date('2024-01-19T15:05:00Z'),
    actionUrl: '/billing/invoices',
    actionText: 'Ver factura',
    icon: '💳',
    color: 'text-green-500',
    metadata: {
      amount: 99.00,
      invoiceId: 'inv-123',
      planName: 'Pro Plan'
    }
  },
  {
    id: 'notif-6',
    userId: 'user-1',
    title: 'Nuevo inicio de sesión',
    message: 'Se detectó un inicio de sesión desde Madrid, España a las 14:30.',
    type: 'info',
    category: 'security',
    priority: 'low',
    isRead: true,
    isArchived: false,
    createdAt: new Date('2024-01-19T14:30:00Z'),
    readAt: new Date('2024-01-19T14:35:00Z'),
    actionUrl: '/security/activity',
    actionText: 'Ver actividad',
    icon: '🔐',
    color: 'text-blue-500',
    metadata: {
      location: 'Madrid, España',
      time: '14:30',
      ipAddress: '192.168.1.100',
      userAgent: 'Chrome 120.0.0.0'
    }
  },
  {
    id: 'notif-7',
    userId: 'user-1',
    title: 'Mantenimiento programado',
    message: 'El sistema estará en mantenimiento el 22 de enero de 02:00 a 04:00 UTC.',
    type: 'warning',
    category: 'system',
    priority: 'high',
    isRead: false,
    isArchived: false,
    createdAt: new Date('2024-01-18T16:00:00Z'),
    expiresAt: new Date('2024-01-22T04:00:00Z'),
    actionUrl: '/status',
    actionText: 'Ver detalles',
    icon: '🔧',
    color: 'text-orange-500',
    metadata: {
      date: '22 de enero',
      startTime: '02:00',
      endTime: '04:00',
      timezone: 'UTC'
    }
  }
]

// Configuraciones de notificaciones por defecto
export const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettings = {
  userId: '',
  email: true,
  push: true,
  inApp: true,
  categories: {
    workflow: true,
    integration: true,
    team: true,
    system: true,
    billing: true,
    security: true,
    achievement: true
  },
  frequency: 'instant',
  quietHours: {
    enabled: false,
    start: '22:00',
    end: '08:00',
    timezone: 'UTC'
  },
  digest: {
    enabled: false,
    frequency: 'daily',
    time: '09:00'
  }
}

// Funciones de utilidad
export function createNotification(
  userId: string,
  templateId: string,
  variables: Record<string, any> = {},
  overrides: Partial<Notification> = {}
): Notification {
  const template = NOTIFICATION_TEMPLATES.find(t => t.id === templateId)
  if (!template) {
    throw new Error(`Template ${templateId} not found`)
  }

  // Reemplazar variables en el título y mensaje
  let title = template.title
  let message = template.message
  
  template.variables.forEach(variable => {
    const value = variables[variable] || `{${variable}}`
    title = title.replace(`{${variable}}`, value)
    message = message.replace(`{${variable}}`, value)
  })

  return {
    id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    userId,
    title,
    message,
    type: template.type,
    category: template.category,
    priority: 'medium',
    isRead: false,
    isArchived: false,
    createdAt: new Date(),
    actionText: template.actionText,
    icon: template.icon,
    color: template.color,
    metadata: variables,
    ...overrides
  }
}

export function getNotificationsByUser(userId: string, filters?: {
  isRead?: boolean
  isArchived?: boolean
  category?: string
  type?: string
  priority?: string
  limit?: number
  offset?: number
}): Notification[] {
  let notifications = SAMPLE_NOTIFICATIONS.filter(n => n.userId === userId)

  if (filters?.isRead !== undefined) {
    notifications = notifications.filter(n => n.isRead === filters.isRead)
  }
  if (filters?.isArchived !== undefined) {
    notifications = notifications.filter(n => n.isArchived === filters.isArchived)
  }
  if (filters?.category) {
    notifications = notifications.filter(n => n.category === filters.category)
  }
  if (filters?.type) {
    notifications = notifications.filter(n => n.type === filters.type)
  }
  if (filters?.priority) {
    notifications = notifications.filter(n => n.priority === filters.priority)
  }

  // Ordenar por fecha de creación (más recientes primero)
  notifications.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

  // Aplicar paginación
  const offset = filters?.offset || 0
  const limit = filters?.limit || 50
  return notifications.slice(offset, offset + limit)
}

export function markNotificationAsRead(notificationId: string): boolean {
  const notification = SAMPLE_NOTIFICATIONS.find(n => n.id === notificationId)
  if (notification && !notification.isRead) {
    notification.isRead = true
    notification.readAt = new Date()
    return true
  }
  return false
}

export function markNotificationAsArchived(notificationId: string): boolean {
  const notification = SAMPLE_NOTIFICATIONS.find(n => n.id === notificationId)
  if (notification && !notification.isArchived) {
    notification.isArchived = true
    notification.archivedAt = new Date()
    return true
  }
  return false
}

export function markAllAsRead(userId: string): number {
  const userNotifications = SAMPLE_NOTIFICATIONS.filter(n => n.userId === userId && !n.isRead)
  userNotifications.forEach(notification => {
    notification.isRead = true
    notification.readAt = new Date()
  })
  return userNotifications.length
}

export function getUnreadCount(userId: string): number {
  return SAMPLE_NOTIFICATIONS.filter(n => n.userId === userId && !n.isRead).length
}

export function getNotificationStats(userId: string): {
  total: number
  unread: number
  archived: number
  byCategory: Record<string, number>
  byType: Record<string, number>
  byPriority: Record<string, number>
} {
  const userNotifications = SAMPLE_NOTIFICATIONS.filter(n => n.userId === userId)
  
  const stats = {
    total: userNotifications.length,
    unread: userNotifications.filter(n => !n.isRead).length,
    archived: userNotifications.filter(n => n.isArchived).length,
    byCategory: {} as Record<string, number>,
    byType: {} as Record<string, number>,
    byPriority: {} as Record<string, number>
  }

  userNotifications.forEach(notification => {
    // Contar por categoría
    stats.byCategory[notification.category] = (stats.byCategory[notification.category] || 0) + 1
    
    // Contar por tipo
    stats.byType[notification.type] = (stats.byType[notification.type] || 0) + 1
    
    // Contar por prioridad
    stats.byPriority[notification.priority] = (stats.byPriority[notification.priority] || 0) + 1
  })

  return stats
}

export function getNotificationSettings(userId: string): NotificationSettings {
  // En una implementación real, esto vendría de la base de datos
  return {
    ...DEFAULT_NOTIFICATION_SETTINGS,
    userId
  }
}

export function updateNotificationSettings(userId: string, settings: Partial<NotificationSettings>): NotificationSettings {
  // En una implementación real, esto se guardaría en la base de datos
  const currentSettings = getNotificationSettings(userId)
  return {
    ...currentSettings,
    ...settings
  }
}

export function shouldSendNotification(userId: string, notification: Notification): boolean {
  const settings = getNotificationSettings(userId)
  
  // Verificar si la categoría está habilitada
  if (!settings.categories[notification.category]) {
    return false
  }

  // Verificar horas silenciosas
  if (settings.quietHours.enabled) {
    const now = new Date()
    const currentHour = now.getHours()
    const currentMinute = now.getMinutes()
    const currentTime = currentHour * 60 + currentMinute
    
    const [startHour, startMinute] = settings.quietHours.start.split(':').map(Number)
    const [endHour, endMinute] = settings.quietHours.end.split(':').map(Number)
    const startTime = startHour * 60 + startMinute
    const endTime = endHour * 60 + endMinute
    
    if (startTime <= endTime) {
      // Horas silenciosas en el mismo día
      if (currentTime >= startTime && currentTime <= endTime) {
        return false
      }
    } else {
      // Horas silenciosas cruzan medianoche
      if (currentTime >= startTime || currentTime <= endTime) {
        return false
      }
    }
  }

  return true
}

export function getPriorityColor(priority: Notification['priority']): string {
  switch (priority) {
    case 'urgent': return 'text-red-500'
    case 'high': return 'text-orange-500'
    case 'medium': return 'text-yellow-500'
    case 'low': return 'text-blue-500'
    default: return 'text-gray-500'
  }
}

export function getTypeIcon(type: Notification['type']): string {
  switch (type) {
    case 'success': return '✅'
    case 'error': return '❌'
    case 'warning': return '⚠️'
    case 'info': return 'ℹ️'
    case 'workflow': return '⚡'
    case 'integration': return '🔗'
    case 'team': return '👥'
    case 'system': return '🔧'
    default: return '📢'
  }
}

export function formatNotificationTime(date: Date): string {
  const now = new Date()
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
  
  if (diffInMinutes < 1) return 'Ahora mismo'
  if (diffInMinutes < 60) return `Hace ${diffInMinutes} min`
  
  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) return `Hace ${diffInHours}h`
  
  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) return `Hace ${diffInDays}d`
  
  return date.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}
