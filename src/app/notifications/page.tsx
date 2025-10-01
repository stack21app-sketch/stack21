'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  Bell, 
  Filter, 
  Search, 
  Settings, 
  Check, 
  Archive, 
  MoreVertical,
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
  Wrench,
  RefreshCw,
  Trash2
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useNotifications, type Notification } from '@/hooks/useNotifications'
import { formatNotificationTime, getPriorityColor } from '@/lib/notifications'

export default function NotificationsPage() {
  const [userId] = useState('user-1') // En producción esto vendría del contexto de autenticación
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [showUnreadOnly, setShowUnreadOnly] = useState(false)
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([])
  const [showSettings, setShowSettings] = useState(false)

  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearRead,
  } = useNotifications()

  const [filteredNotifications, setFilteredNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState({ total: 0, unread: 0 })

  const filterNotifications = useCallback(() => {
    let filtered = [...notifications]

    // Filtrar por término de búsqueda
    if (searchTerm) {
      filtered = filtered.filter(notification =>
        notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        notification.message.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filtrar por tipo
    if (filterType !== 'all') {
      filtered = filtered.filter(notification => notification.type === filterType)
    }

    // Filtrar solo no leídas
    if (showUnreadOnly) {
      filtered = filtered.filter(notification => !notification.read)
    }

    setFilteredNotifications(filtered)
  }, [notifications, searchTerm, filterType, showUnreadOnly])

  useEffect(() => {
    filterNotifications()
  }, [filterNotifications])

  useEffect(() => {
    // Actualizar estadísticas
    setStats({ total: notifications.length, unread: unreadCount })
  }, [notifications, unreadCount])

  const handleSelectNotification = (notificationId: string) => {
    setSelectedNotifications(prev => 
      prev.includes(notificationId) 
        ? prev.filter(id => id !== notificationId)
        : [...prev, notificationId]
    )
  }

  const handleSelectAll = () => {
    if (selectedNotifications.length === filteredNotifications.length) {
      setSelectedNotifications([])
    } else {
      setSelectedNotifications(filteredNotifications.map(n => n.id))
    }
  }

  const handleBulkAction = async (action: 'mark-read' | 'mark-archived') => {
    for (const notificationId of selectedNotifications) {
      if (action === 'mark-read') {
        await markAsRead(notificationId)
      } else if (action === 'mark-archived') {
        // Función no disponible en el hook actual
        console.log('Mark as archived not implemented')
      }
    }
    setSelectedNotifications([])
  }

  const handleTestNotification = async () => {
    try {
      // Función no disponible en el hook actual
      console.log('Create test notification not implemented')
    } catch (error) {
      console.error('Error creating test notification:', error)
    }
  }

  const refresh = () => {
    setLoading(true)
    // Simular carga
    setTimeout(() => {
      setLoading(false)
    }, 1000)
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando notificaciones...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <Bell className="w-8 h-8 mr-3 text-blue-600" />
                Notificaciones
              </h1>
              <p className="text-gray-600 mt-2">
                Gestiona tus notificaciones y configuraciones
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                onClick={refresh}
                variant="outline"
                className="flex items-center"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Actualizar
              </Button>
              <Button
                onClick={handleTestNotification}
                variant="outline"
                className="flex items-center"
              >
                <Bell className="w-4 h-4 mr-2" />
                Crear Prueba
              </Button>
              <Button
                onClick={() => setShowSettings(!showSettings)}
                variant="outline"
                className="flex items-center"
              >
                <Settings className="w-4 h-4 mr-2" />
                Configuración
              </Button>
            </div>
          </div>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Bell className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Total</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <AlertCircle className="h-8 w-8 text-orange-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">No leídas</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats.unread}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Archive className="h-8 w-8 text-gray-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Archivadas</p>
                    <p className="text-2xl font-semibold text-gray-900">0</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Leídas</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats.total - stats.unread}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Buscar notificaciones..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Todos los tipos</option>
                  <option value="success">Éxito</option>
                  <option value="error">Error</option>
                  <option value="warning">Advertencia</option>
                  <option value="info">Información</option>
                </select>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={showUnreadOnly}
                      onChange={(e) => setShowUnreadOnly(e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Solo no leídas</span>
                  </label>
                  
                  {selectedNotifications.length > 0 && (
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">
                        {selectedNotifications.length} seleccionadas
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleBulkAction('mark-read')}
                      >
                        <Check className="w-4 h-4 mr-1" />
                        Marcar como leídas
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleBulkAction('mark-archived')}
                      >
                        <Archive className="w-4 h-4 mr-1" />
                        Archivar
                      </Button>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSelectAll}
                  >
                    {selectedNotifications.length === filteredNotifications.length ? 'Deseleccionar todo' : 'Seleccionar todo'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={markAllAsRead}
                    disabled={notifications.filter(n => !n.read).length === 0}
                  >
                    <Check className="w-4 h-4 mr-1" />
                    Marcar todas como leídas
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notifications List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Notificaciones ({filteredNotifications.length})</span>
              {notifications.filter(n => !n.read).length > 0 && (
                <Badge className="bg-red-500 text-white">
                  {notifications.filter(n => !n.read).length} no leídas
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {filteredNotifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                <Bell className="w-12 h-12 mb-4" />
                <p className="text-lg font-medium">No hay notificaciones</p>
                <p className="text-sm">No se encontraron notificaciones que coincidan con los filtros</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {filteredNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-6 hover:bg-gray-50 transition-colors ${
                      !notification.read ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                    }`}
                  >
                    <div className="flex items-start space-x-4">
                      <input
                        type="checkbox"
                        checked={selectedNotifications.includes(notification.id)}
                        onChange={() => handleSelectNotification(notification.id)}
                        className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      
                      <div className="flex-shrink-0">
                        {getTypeIcon(notification.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className={`text-lg font-medium ${
                              !notification.read ? 'text-gray-900' : 'text-gray-700'
                            }`}>
                              {notification.title}
                            </h4>
                            <p className="text-gray-600 mt-1">
                              {notification.message}
                            </p>
                          </div>
                          
                          <div className="flex items-center space-x-2 ml-4">
                            <Badge 
                              variant="outline" 
                              className={`text-xs ${
                                notification.type === 'error' ? 'text-red-600 border-red-200' :
                                notification.type === 'warning' ? 'text-yellow-600 border-yellow-200' :
                                notification.type === 'success' ? 'text-green-600 border-green-200' :
                                'text-blue-600 border-blue-200'
                              }`}
                            >
                              {notification.type}
                            </Badge>
                            
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <MoreVertical className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => markAsRead(notification.id)}
                                  disabled={notification.read}
                                >
                                  <Check className="w-4 h-4 mr-2" />
                                  Marcar como leída
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => console.log('Archive not implemented')}
                                >
                                  <Archive className="w-4 h-4 mr-2" />
                                  Archivar
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <div className="flex items-center space-x-1">
                              {getTypeIcon(notification.type)}
                              <span className="capitalize">{notification.type}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="w-4 h-4" />
                              <span>{formatNotificationTime(notification.timestamp)}</span>
                            </div>
                          </div>
                          
                          {notification.action?.label && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                notification.action?.onClick?.()
                              }}
                            >
                              {notification.action.label}
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
