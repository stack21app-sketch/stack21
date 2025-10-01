'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  Bell, 
  X, 
  Search, 
  Filter, 
  CheckCircle, 
  AlertCircle, 
  Info, 
  XCircle,
  Clock,
  User,
  Workflow,
  Brain,
  Database,
  Zap,
  Check,
  Trash2,
  Settings
} from 'lucide-react'

interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  timestamp: Date
  isRead: boolean
  category: 'workflow' | 'ai' | 'system' | 'team' | 'integration'
  user?: string
  action?: {
    label: string
    onClick: () => void
  }
}

interface NotificationCenterProps {
  isOpen: boolean
  onClose: () => void
  notifications: Notification[]
  onMarkAsRead: (id: string) => void
  onMarkAllAsRead: () => void
  onDelete: (id: string) => void
  onDeleteAll: () => void
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'success',
    title: 'Workflow ejecutado exitosamente',
    message: 'El workflow "Email Marketing" se ejecutó correctamente y envió 1,250 emails',
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    isRead: false,
    category: 'workflow',
    user: 'María García',
    action: {
      label: 'Ver detalles',
      onClick: () => console.log('Ver detalles del workflow')
    }
  },
  {
    id: '2',
    type: 'info',
    title: 'Nueva integración disponible',
    message: 'Se ha añadido soporte para Slack. Configúrala ahora para recibir notificaciones automáticas',
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
    isRead: false,
    category: 'integration',
    action: {
      label: 'Configurar',
      onClick: () => console.log('Configurar Slack')
    }
  },
  {
    id: '3',
    type: 'warning',
    title: 'Límite de API alcanzado',
    message: 'Has alcanzado el 85% de tu límite mensual de OpenAI. Considera actualizar tu plan',
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    isRead: true,
    category: 'system',
    action: {
      label: 'Actualizar plan',
      onClick: () => console.log('Actualizar plan')
    }
  },
  {
    id: '4',
    type: 'success',
    title: 'Análisis de datos completado',
    message: 'El agente IA completó el análisis de 5,000 registros en 2.3 segundos',
    timestamp: new Date(Date.now() - 45 * 60 * 1000),
    isRead: true,
    category: 'ai',
    user: 'Ana Martín'
  },
  {
    id: '5',
    type: 'info',
    title: 'Backup de datos completado',
    message: 'El respaldo automático de 2.4GB se guardó exitosamente en la nube',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    isRead: true,
    category: 'system'
  },
  {
    id: '6',
    type: 'error',
    title: 'Error en workflow',
    message: 'El workflow "Lead Scoring" falló debido a un error de conexión con la API externa',
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
    isRead: false,
    category: 'workflow',
    user: 'Carlos López',
    action: {
      label: 'Reintentar',
      onClick: () => console.log('Reintentar workflow')
    }
  }
]

const getIcon = (type: Notification['type']) => {
  switch (type) {
    case 'success': return CheckCircle
    case 'error': return XCircle
    case 'warning': return AlertCircle
    case 'info': return Info
    default: return Bell
  }
}

const getTypeColor = (type: Notification['type']) => {
  switch (type) {
    case 'success': return 'text-green-600 bg-green-50 border-green-200'
    case 'error': return 'text-red-600 bg-red-50 border-red-200'
    case 'warning': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
    case 'info': return 'text-blue-600 bg-blue-50 border-blue-200'
    default: return 'text-gray-600 bg-gray-50 border-gray-200'
  }
}

const getCategoryIcon = (category: Notification['category']) => {
  switch (category) {
    case 'workflow': return Workflow
    case 'ai': return Brain
    case 'system': return Database
    case 'team': return User
    case 'integration': return Zap
    default: return Bell
  }
}

const getCategoryColor = (category: Notification['category']) => {
  switch (category) {
    case 'workflow': return 'bg-purple-100 text-purple-700'
    case 'ai': return 'bg-pink-100 text-pink-700'
    case 'system': return 'bg-blue-100 text-blue-700'
    case 'team': return 'bg-green-100 text-green-700'
    case 'integration': return 'bg-orange-100 text-orange-700'
    default: return 'bg-gray-100 text-gray-700'
  }
}

export default function NotificationCenter({
  isOpen,
  onClose,
  notifications = mockNotifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onDelete,
  onDeleteAll
}: NotificationCenterProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<'all' | Notification['type']>('all')
  const [filterCategory, setFilterCategory] = useState<'all' | Notification['category']>('all')
  const [filterRead, setFilterRead] = useState<'all' | 'read' | 'unread'>('all')

  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === 'all' || notification.type === filterType
    const matchesCategory = filterCategory === 'all' || notification.category === filterCategory
    const matchesRead = filterRead === 'all' || 
                       (filterRead === 'read' && notification.isRead) ||
                       (filterRead === 'unread' && !notification.isRead)
    
    return matchesSearch && matchesType && matchesCategory && matchesRead
  })

  const unreadCount = notifications.filter(n => !n.isRead).length

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Ahora mismo'
    if (diffInMinutes < 60) return `Hace ${diffInMinutes} min`
    if (diffInMinutes < 1440) return `Hace ${Math.floor(diffInMinutes / 60)} h`
    return `Hace ${Math.floor(diffInMinutes / 1440)} días`
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl transform transition-transform duration-300 ease-in-out">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Bell className="w-6 h-6 text-gray-700" />
                {unreadCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs">
                    {unreadCount}
                  </Badge>
                )}
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Notificaciones</h2>
                <p className="text-sm text-gray-500">
                  {unreadCount} no leídas de {notifications.length} total
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={onMarkAllAsRead}
                disabled={unreadCount === 0}
              >
                <Check className="w-4 h-4 mr-1" />
                Marcar todas
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          {/* Filtros */}
          <div className="p-4 border-b border-gray-200 bg-white">
            <div className="space-y-3">
              {/* Búsqueda */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar notificaciones..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              {/* Filtros */}
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={filterType === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterType('all')}
                >
                  Todas
                </Button>
                {['success', 'error', 'warning', 'info'].map((type) => (
                  <Button
                    key={type}
                    variant={filterType === type ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilterType(type as Notification['type'])}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </Button>
                ))}
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={filterCategory === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterCategory('all')}
                >
                  Todas las categorías
                </Button>
                {['workflow', 'ai', 'system', 'team', 'integration'].map((category) => {
                  const Icon = getCategoryIcon(category as Notification['category'])
                  return (
                    <Button
                      key={category}
                      variant={filterCategory === category ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setFilterCategory(category as Notification['category'])}
                      className="flex items-center"
                    >
                      <Icon className="h-3 w-3 mr-1" />
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </Button>
                  )
                })}
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant={filterRead === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterRead('all')}
                >
                  Todas
                </Button>
                <Button
                  variant={filterRead === 'unread' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterRead('unread')}
                >
                  No leídas ({unreadCount})
                </Button>
                <Button
                  variant={filterRead === 'read' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterRead('read')}
                >
                  Leídas
                </Button>
              </div>
            </div>
          </div>
          
          {/* Lista de notificaciones */}
          <div className="flex-1 overflow-y-auto">
            {filteredNotifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <Bell className="w-12 h-12 mb-4 opacity-50" />
                <p className="text-lg font-medium">No hay notificaciones</p>
                <p className="text-sm">Las notificaciones aparecerán aquí</p>
              </div>
            ) : (
              <div className="p-4 space-y-3">
                {filteredNotifications.map((notification) => {
                  const Icon = getIcon(notification.type)
                  const CategoryIcon = getCategoryIcon(notification.category)
                  
                  return (
                    <div
                      key={notification.id}
                      className={`p-4 rounded-lg border transition-all hover:shadow-md ${
                        notification.isRead ? 'opacity-75' : 'opacity-100'
                      } ${getTypeColor(notification.type)}`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          <Icon className="h-5 w-5" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center space-x-2">
                              <h4 className="text-sm font-medium text-gray-900 truncate">
                                {notification.title}
                              </h4>
                              {!notification.isRead && (
                                <Badge className="bg-blue-500 text-white text-xs">
                                  Nuevo
                                </Badge>
                              )}
                              <Badge className={`text-xs ${getCategoryColor(notification.category)}`}>
                                <CategoryIcon className="h-3 w-3 mr-1" />
                                {notification.category}
                              </Badge>
                            </div>
                            
                            <div className="flex items-center space-x-1">
                              {!notification.isRead && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => onMarkAsRead(notification.id)}
                                  className="h-6 w-6 p-0"
                                >
                                  <CheckCircle className="h-3 w-3" />
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onDelete(notification.id)}
                                className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                          
                          <p className="text-sm text-gray-600 mb-2">
                            {notification.message}
                          </p>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center text-xs text-gray-500">
                              <Clock className="h-3 w-3 mr-1" />
                              {formatTimeAgo(notification.timestamp)}
                              {notification.user && (
                                <>
                                  <span className="mx-2">•</span>
                                  <User className="h-3 w-3 mr-1" />
                                  {notification.user}
                                </>
                              )}
                            </div>
                            
                            {notification.action && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={notification.action.onClick}
                                className="h-6 px-2 text-xs"
                              >
                                {notification.action.label}
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
          
          {/* Footer */}
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={onDeleteAll}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Eliminar todas
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => console.log('Configurar notificaciones')}
              >
                <Settings className="w-4 h-4 mr-1" />
                Configurar
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
