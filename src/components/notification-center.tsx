'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  Bell, 
  X, 
  Check, 
  Archive, 
  Filter, 
  Search, 
  Settings, 
  MoreVertical,
  ExternalLink,
  Clock,
  AlertCircle,
  CheckCircle,
  Info,
  Zap,
  Link,
  Users,
  Shield,
  CreditCard,
  Trophy,
  Wrench
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  getNotificationsByUser,
  markNotificationAsRead,
  markNotificationAsArchived,
  markAllAsRead,
  getUnreadCount,
  getNotificationStats,
  getNotificationSettings,
  updateNotificationSettings,
  formatNotificationTime,
  getPriorityColor,
  getTypeIcon,
  type Notification,
  type NotificationSettings
} from '@/lib/notifications'

interface NotificationCenterProps {
  userId: string
  isOpen: boolean
  onClose: () => void
}

export function NotificationCenter({ userId, isOpen, onClose }: NotificationCenterProps) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [filteredNotifications, setFilteredNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [filterType, setFilterType] = useState<string>('all')
  const [filterPriority, setFilterPriority] = useState<string>('all')
  const [showUnreadOnly, setShowUnreadOnly] = useState(false)
  const [settings, setSettings] = useState<NotificationSettings | null>(null)
  const [showSettings, setShowSettings] = useState(false)
  const [stats, setStats] = useState<any>(null)
  
  const notificationRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})

  useEffect(() => {
    if (isOpen) {
      loadNotifications()
      loadSettings()
      loadStats()
    }
  }, [isOpen, userId])

  useEffect(() => {
    filterNotifications()
  }, [notifications, searchTerm, filterCategory, filterType, filterPriority, showUnreadOnly])

  const loadNotifications = async () => {
    setLoading(true)
    try {
      const userNotifications = getNotificationsByUser(userId, {
        isArchived: false,
        limit: 50
      })
      setNotifications(userNotifications)
    } catch (error) {
      console.error('Error loading notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadSettings = async () => {
    try {
      const userSettings = getNotificationSettings(userId)
      setSettings(userSettings)
    } catch (error) {
      console.error('Error loading settings:', error)
    }
  }

  const loadStats = async () => {
    try {
      const userStats = getNotificationStats(userId)
      setStats(userStats)
    } catch (error) {
      console.error('Error loading stats:', error)
    }
  }

  const filterNotifications = () => {
    let filtered = [...notifications]

    // Filtrar por término de búsqueda
    if (searchTerm) {
      filtered = filtered.filter(notification =>
        notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        notification.message.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filtrar por categoría
    if (filterCategory !== 'all') {
      filtered = filtered.filter(notification => notification.category === filterCategory)
    }

    // Filtrar por tipo
    if (filterType !== 'all') {
      filtered = filtered.filter(notification => notification.type === filterType)
    }

    // Filtrar por prioridad
    if (filterPriority !== 'all') {
      filtered = filtered.filter(notification => notification.priority === filterPriority)
    }

    // Filtrar solo no leídas
    if (showUnreadOnly) {
      filtered = filtered.filter(notification => !notification.isRead)
    }

    setFilteredNotifications(filtered)
  }

  const handleMarkAsRead = async (notificationId: string) => {
    const success = markNotificationAsRead(notificationId)
    if (success) {
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, isRead: true, readAt: new Date() } : n)
      )
    }
  }

  const handleMarkAsArchived = async (notificationId: string) => {
    const success = markNotificationAsArchived(notificationId)
    if (success) {
      setNotifications(prev => prev.filter(n => n.id !== notificationId))
    }
  }

  const handleMarkAllAsRead = async () => {
    const count = markAllAsRead(userId)
    if (count > 0) {
      setNotifications(prev => 
        prev.map(n => ({ ...n, isRead: true, readAt: new Date() }))
      )
    }
  }

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.isRead) {
      handleMarkAsRead(notification.id)
    }
    
    if (notification.actionUrl) {
      window.open(notification.actionUrl, '_blank')
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'workflow': return <Zap className="w-4 h-4" />
      case 'integration': return <Link className="w-4 h-4" />
      case 'team': return <Users className="w-4 h-4" />
      case 'system': return <Wrench className="w-4 h-4" />
      case 'billing': return <CreditCard className="w-4 h-4" />
      case 'security': return <Shield className="w-4 h-4" />
      case 'achievement': return <Trophy className="w-4 h-4" />
      default: return <Bell className="w-4 h-4" />
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'error': return <AlertCircle className="w-4 h-4 text-red-500" />
      case 'warning': return <AlertCircle className="w-4 h-4 text-yellow-500" />
      case 'info': return <Info className="w-4 h-4 text-blue-500" />
      default: return <Bell className="w-4 h-4 text-gray-500" />
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Notification Center */}
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl transform transition-transform duration-300 ease-in-out">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Bell className="w-6 h-6 text-gray-700" />
                {stats && stats.unread > 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs">
                    {stats.unread}
                  </Badge>
                )}
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Notificaciones</h2>
                <p className="text-sm text-gray-500">
                  {stats ? `${stats.total} notificaciones` : 'Cargando...'}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSettings(!showSettings)}
              >
                <Settings className="w-4 h-4" />
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

          {/* Filters */}
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <div className="space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Buscar notificaciones..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="flex space-x-2">
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Todas las categorías</option>
                  <option value="workflow">Workflows</option>
                  <option value="integration">Integraciones</option>
                  <option value="team">Equipo</option>
                  <option value="system">Sistema</option>
                  <option value="billing">Facturación</option>
                  <option value="security">Seguridad</option>
                  <option value="achievement">Logros</option>
                </select>
                
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Todos los tipos</option>
                  <option value="success">Éxito</option>
                  <option value="error">Error</option>
                  <option value="warning">Advertencia</option>
                  <option value="info">Información</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={showUnreadOnly}
                    onChange={(e) => setShowUnreadOnly(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Solo no leídas</span>
                </label>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleMarkAllAsRead}
                  disabled={!stats || stats.unread === 0}
                >
                  <Check className="w-4 h-4 mr-1" />
                  Marcar todas como leídas
                </Button>
              </div>
            </div>
          </div>

          {/* Notifications List */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : filteredNotifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-32 text-gray-500">
                <Bell className="w-12 h-12 mb-2" />
                <p className="text-sm">No hay notificaciones</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {filteredNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    ref={el => { notificationRefs.current[notification.id] = el }}
                    className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                      !notification.isRead ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                    }`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        {getTypeIcon(notification.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className={`text-sm font-medium ${
                              !notification.isRead ? 'text-gray-900' : 'text-gray-700'
                            }`}>
                              {notification.title}
                            </h4>
                            <p className="text-sm text-gray-600 mt-1">
                              {notification.message}
                            </p>
                          </div>
                          
                          <div className="flex items-center space-x-1 ml-2">
                            <Badge 
                              variant="outline" 
                              className={`text-xs ${getPriorityColor(notification.priority)}`}
                            >
                              {notification.priority}
                            </Badge>
                            
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                  <MoreVertical className="w-3 h-3" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleMarkAsRead(notification.id)
                                  }}
                                  disabled={notification.isRead}
                                >
                                  <Check className="w-4 h-4 mr-2" />
                                  Marcar como leída
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleMarkAsArchived(notification.id)
                                  }}
                                >
                                  <Archive className="w-4 h-4 mr-2" />
                                  Archivar
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center space-x-2">
                            {getCategoryIcon(notification.category)}
                            <span className="text-xs text-gray-500 capitalize">
                              {notification.category}
                            </span>
                            <span className="text-xs text-gray-400">•</span>
                            <span className="text-xs text-gray-500">
                              {formatNotificationTime(notification.createdAt)}
                            </span>
                          </div>
                          
                          {notification.actionText && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-xs text-blue-600 hover:text-blue-800"
                              onClick={(e) => {
                                e.stopPropagation()
                                if (notification.actionUrl) {
                                  window.open(notification.actionUrl, '_blank')
                                }
                              }}
                            >
                              {notification.actionText}
                              <ExternalLink className="w-3 h-3 ml-1" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>
                {filteredNotifications.length} de {notifications.length} notificaciones
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.open('/notifications', '_blank')}
              >
                Ver todas
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
