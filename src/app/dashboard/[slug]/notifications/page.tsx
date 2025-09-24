'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Bell, 
  Check, 
  X, 
  Settings,
  Filter,
  Search,
  MoreVertical,
  Trash2,
  Archive,
  Star,
  AlertCircle,
  CheckCircle,
  Info,
  Zap
} from 'lucide-react'

interface Notification {
  id: string
  title: string
  message: string
  type: 'success' | 'warning' | 'error' | 'info'
  read: boolean
  starred: boolean
  archived: boolean
  createdAt: Date
  category: 'system' | 'ai' | 'workspace' | 'billing'
}

export default function NotificationsPage() {
  const params = useParams()
  const { data: session } = useSession()
  const slug = params.slug as string

  const [notifications, setNotifications] = useState<Notification[]>([])
  const [filter, setFilter] = useState<'all' | 'unread' | 'starred' | 'archived'>('all')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchNotifications()
  }, [])

  const fetchNotifications = async () => {
    // Simulación de notificaciones
    const mockNotifications: Notification[] = [
      {
        id: '1',
        title: 'Imagen generada exitosamente',
        message: 'Tu imagen "Gato astronauta en el espacio" ha sido generada y está lista para descargar.',
        type: 'success',
        read: false,
        starred: false,
        archived: false,
        createdAt: new Date(Date.now() - 5 * 60 * 1000), // 5 minutos atrás
        category: 'ai'
      },
      {
        id: '2',
        title: 'Límite de requests alcanzado',
        message: 'Has alcanzado el 80% de tu límite mensual de requests. Considera actualizar tu plan.',
        type: 'warning',
        read: false,
        starred: true,
        archived: false,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 horas atrás
        category: 'billing'
      },
      {
        id: '3',
        title: 'Nuevo miembro en el workspace',
        message: 'Juan Pérez se ha unido a tu workspace "Mi Empresa".',
        type: 'info',
        read: true,
        starred: false,
        archived: false,
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 horas atrás
        category: 'workspace'
      },
      {
        id: '4',
        title: 'Error en generación de música',
        message: 'Hubo un problema al generar tu composición musical. Por favor, inténtalo de nuevo.',
        type: 'error',
        read: true,
        starred: false,
        archived: false,
        createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 horas atrás
        category: 'ai'
      },
      {
        id: '5',
        title: 'Sistema actualizado',
        message: 'Hemos actualizado el sistema con nuevas funcionalidades de IA. ¡Explóralas!',
        type: 'info',
        read: true,
        starred: false,
        archived: false,
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 día atrás
        category: 'system'
      }
    ]
    setNotifications(mockNotifications)
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="h-5 w-5 text-green-400" />
      case 'warning': return <AlertCircle className="h-5 w-5 text-yellow-400" />
      case 'error': return <X className="h-5 w-5 text-red-400" />
      case 'info': return <Info className="h-5 w-5 text-blue-400" />
      default: return <Bell className="h-5 w-5 text-gray-400" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'success': return 'border-green-500/30 bg-green-500/10'
      case 'warning': return 'border-yellow-500/30 bg-yellow-500/10'
      case 'error': return 'border-red-500/30 bg-red-500/10'
      case 'info': return 'border-blue-500/30 bg-blue-500/10'
      default: return 'border-gray-500/30 bg-gray-500/10'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'ai': return <Zap className="h-4 w-4" />
      case 'workspace': return <Settings className="h-4 w-4" />
      case 'billing': return <Bell className="h-4 w-4" />
      case 'system': return <Info className="h-4 w-4" />
      default: return <Bell className="h-4 w-4" />
    }
  }

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    )
  }

  const toggleStar = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, starred: !notif.starred } : notif
      )
    )
  }

  const archiveNotification = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, archived: true } : notif
      )
    )
  }

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id))
  }

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    )
  }

  const filteredNotifications = notifications.filter(notif => {
    const matchesFilter = 
      filter === 'all' ? true :
      filter === 'unread' ? !notif.read :
      filter === 'starred' ? notif.starred :
      filter === 'archived' ? notif.archived : true

    const matchesSearch = 
      notif.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notif.message.toLowerCase().includes(searchTerm.toLowerCase())

    return matchesFilter && matchesSearch
  })

  const unreadCount = notifications.filter(n => !n.read).length

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white">No autorizado</h2>
          <p className="text-gray-300">Debes iniciar sesión para ver notificaciones</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Bell className="h-8 w-8 text-cyan-400 mr-3" />
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  Notificaciones
                </h1>
                <p className="text-sm text-gray-300">
                  {unreadCount > 0 ? `${unreadCount} notificaciones sin leer` : 'Todas las notificaciones leídas'}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={markAllAsRead}
                disabled={unreadCount === 0}
                className="border-white/20 text-white hover:bg-white/10"
              >
                <Check className="h-4 w-4 mr-2" />
                Marcar todas como leídas
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <Card className="bg-black/20 backdrop-blur-lg border-white/10 mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex gap-2">
                {[
                  { id: 'all', name: 'Todas', count: notifications.length },
                  { id: 'unread', name: 'Sin leer', count: unreadCount },
                  { id: 'starred', name: 'Destacadas', count: notifications.filter(n => n.starred).length },
                  { id: 'archived', name: 'Archivadas', count: notifications.filter(n => n.archived).length }
                ].map((filterOption) => (
                  <Button
                    key={filterOption.id}
                    size="sm"
                    variant={filter === filterOption.id ? "default" : "outline"}
                    onClick={() => setFilter(filterOption.id as any)}
                    className={filter === filterOption.id ? 'bg-purple-600 hover:bg-purple-700' : 'border-white/20 text-white hover:bg-white/10'}
                  >
                    {filterOption.name}
                    {filterOption.count > 0 && (
                      <Badge variant="outline" className="ml-2 text-xs">
                        {filterOption.count}
                      </Badge>
                    )}
                  </Button>
                ))}
              </div>
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar notificaciones..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-black/20 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notifications List */}
        <div className="space-y-4">
          {filteredNotifications.length === 0 ? (
            <Card className="bg-black/20 backdrop-blur-lg border-white/10">
              <CardContent className="p-12 text-center">
                <Bell className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No hay notificaciones</h3>
                <p className="text-gray-400">
                  {filter === 'all' 
                    ? 'No tienes notificaciones aún' 
                    : `No hay notificaciones ${filter === 'unread' ? 'sin leer' : filter === 'starred' ? 'destacadas' : 'archivadas'}`
                  }
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredNotifications.map((notification) => (
              <Card 
                key={notification.id} 
                className={`bg-black/20 backdrop-blur-lg border-white/10 transition-all duration-200 ${
                  !notification.read ? 'ring-2 ring-purple-500/50' : ''
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      {getTypeIcon(notification.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <h3 className={`text-sm font-medium ${notification.read ? 'text-gray-300' : 'text-white'}`}>
                            {notification.title}
                          </h3>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                          )}
                        </div>
                        <div className="flex items-center space-x-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => toggleStar(notification.id)}
                            className={`h-6 w-6 p-0 ${
                              notification.starred ? 'text-yellow-400' : 'text-gray-400 hover:text-yellow-400'
                            }`}
                          >
                            <Star className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => archiveNotification(notification.id)}
                            className="h-6 w-6 p-0 text-gray-400 hover:text-blue-400"
                          >
                            <Archive className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => deleteNotification(notification.id)}
                            className="h-6 w-6 p-0 text-gray-400 hover:text-red-400"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <p className={`text-sm mt-1 ${notification.read ? 'text-gray-400' : 'text-gray-300'}`}>
                        {notification.message}
                      </p>
                      
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center space-x-2">
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${getTypeColor(notification.type)}`}
                          >
                            {getCategoryIcon(notification.category)}
                            <span className="ml-1 capitalize">{notification.category}</span>
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {notification.createdAt.toLocaleString()}
                          </span>
                        </div>
                        
                        {!notification.read && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => markAsRead(notification.id)}
                            className="border-white/20 text-white hover:bg-white/10"
                          >
                            <Check className="h-3 w-3 mr-1" />
                            Marcar como leída
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
