'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TimeDisplay } from '@/components/TimeDisplay'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Bell, 
  X, 
  CheckCircle, 
  AlertCircle, 
  Info, 
  Zap,
  MessageCircle,
  Mail,
  Activity
} from 'lucide-react'

interface Notification {
  id: string
  type: 'success' | 'error' | 'info' | 'warning'
  title: string
  message: string
  timestamp: Date
  read: boolean
  category: 'workflow' | 'chatbot' | 'email' | 'system'
}

export function RealTimeNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isOpen, setIsOpen] = useState(false)

  // Simular notificaciones en tiempo real
  useEffect(() => {
    const interval = setInterval(() => {
      const newNotification: Notification = {
        id: Date.now().toString(),
        type: ['success', 'error', 'info', 'warning'][Math.floor(Math.random() * 4)] as any,
        title: getRandomTitle(),
        message: getRandomMessage(),
        timestamp: new Date(),
        read: false,
        category: ['workflow', 'chatbot', 'email', 'system'][Math.floor(Math.random() * 4)] as any
      }
      
      setNotifications(prev => [newNotification, ...prev.slice(0, 9)])
    }, 10000) // Nueva notificación cada 10 segundos

    return () => clearInterval(interval)
  }, [])

  const getRandomTitle = () => {
    const titles = [
      'Workflow Completado',
      'Nuevo Mensaje del Chatbot',
      'Email Enviado',
      'Sistema Actualizado',
      'Error en Workflow',
      'Chatbot Configurado',
      'Campaña de Email Iniciada',
      'Backup Completado'
    ]
    return titles[Math.floor(Math.random() * titles.length)]
  }

  const getRandomMessage = () => {
    const messages = [
      'Tu workflow se ejecutó exitosamente',
      'El chatbot respondió a un usuario',
      'Se enviaron 150 emails',
      'Nueva versión disponible',
      'Revisa la configuración del workflow',
      'El chatbot está listo para usar',
      'La campaña de email está en progreso',
      'Respaldo de datos completado'
    ]
    return messages[Math.floor(Math.random() * messages.length)]
  }

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true }
          : notification
      )
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    )
  }

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id))
  }

  const getIcon = (type: string, category: string) => {
    if (category === 'workflow') return <Zap className="w-4 h-4" />
    if (category === 'chatbot') return <MessageCircle className="w-4 h-4" />
    if (category === 'email') return <Mail className="w-4 h-4" />
    if (category === 'system') return <Activity className="w-4 h-4" />
    
    switch (type) {
      case 'success': return <CheckCircle className="w-4 h-4" />
      case 'error': return <AlertCircle className="w-4 h-4" />
      case 'warning': return <AlertCircle className="w-4 h-4" />
      default: return <Info className="w-4 h-4" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'success': return 'text-green-600 bg-green-100'
      case 'error': return 'text-red-600 bg-red-100'
      case 'warning': return 'text-yellow-600 bg-yellow-100'
      default: return 'text-blue-600 bg-blue-100'
    }
  }

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <div className="relative">
      {/* Notification Bell */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="relative"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <Badge 
            variant="destructive" 
            className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 text-xs"
          >
            {unreadCount}
          </Badge>
        )}
      </Button>

      {/* Notifications Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 top-12 w-80 z-50"
            >
              <Card className="shadow-xl border-0">
                <CardContent className="p-0">
                  {/* Header */}
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900">Notificaciones</h3>
                      <div className="flex items-center gap-2">
                        {unreadCount > 0 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={markAllAsRead}
                            className="text-xs"
                          >
                            Marcar todas como leídas
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setIsOpen(false)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Notifications List */}
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center text-gray-500">
                        <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p>No hay notificaciones</p>
                      </div>
                    ) : (
                      <div className="divide-y divide-gray-100">
                        {notifications.map((notification) => (
                          <motion.div
                            key={notification.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className={`p-4 hover:bg-gray-50 transition-colors ${
                              !notification.read ? 'bg-blue-50/50' : ''
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <div className={`p-2 rounded-full ${getTypeColor(notification.type)}`}>
                                {getIcon(notification.type, notification.category)}
                              </div>
                              
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <h4 className="text-sm font-medium text-gray-900">
                                      {notification.title}
                                    </h4>
                                    <p className="text-sm text-gray-600 mt-1">
                                      {notification.message}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-2">
                                      <TimeDisplay timestamp={notification.timestamp} format="time" />
                                    </p>
                                  </div>
                                  
                                  <div className="flex items-center gap-1 ml-2">
                                    {!notification.read && (
                                      <div className="w-2 h-2 bg-blue-500 rounded-full" />
                                    )}
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => removeNotification(notification.id)}
                                      className="w-6 h-6"
                                    >
                                      <X className="w-3 h-3" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  {notifications.length > 0 && (
                    <div className="p-4 border-t border-gray-200">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => setIsOpen(false)}
                      >
                        Ver todas las notificaciones
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
