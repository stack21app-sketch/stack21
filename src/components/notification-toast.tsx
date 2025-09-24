'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  X, 
  CheckCircle, 
  AlertCircle, 
  Info, 
  Zap, 
  Link, 
  Users, 
  Shield, 
  CreditCard, 
  Trophy, 
  Wrench,
  ExternalLink,
  Clock
} from 'lucide-react'
import { 
  getPriorityColor, 
  formatNotificationTime, 
  type Notification 
} from '@/lib/notifications'

interface NotificationToastProps {
  notification: Notification
  onClose: () => void
  onAction?: () => void
  autoClose?: boolean
  duration?: number
}

export function NotificationToast({ 
  notification, 
  onClose, 
  onAction,
  autoClose = true,
  duration = 5000
}: NotificationToastProps) {
  const [isVisible, setIsVisible] = useState(true)
  const [isClosing, setIsClosing] = useState(false)

  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        handleClose()
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [autoClose, duration])

  const handleClose = () => {
    setIsClosing(true)
    setTimeout(() => {
      setIsVisible(false)
      onClose()
    }, 300)
  }

  const handleAction = () => {
    if (onAction) {
      onAction()
    }
    handleClose()
  }

  const getTypeIcon = () => {
    switch (notification.type) {
      case 'success': return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'error': return <AlertCircle className="w-5 h-5 text-red-500" />
      case 'warning': return <AlertCircle className="w-5 h-5 text-yellow-500" />
      case 'info': return <Info className="w-5 h-5 text-blue-500" />
      case 'workflow': return <Zap className="w-5 h-5 text-purple-500" />
      case 'integration': return <Link className="w-5 h-5 text-cyan-500" />
      case 'team': return <Users className="w-5 h-5 text-indigo-500" />
      case 'system': return <Wrench className="w-5 h-5 text-orange-500" />
      default: return <Info className="w-5 h-5 text-gray-500" />
    }
  }

  const getCategoryIcon = () => {
    switch (notification.category) {
      case 'workflow': return <Zap className="w-4 h-4" />
      case 'integration': return <Link className="w-4 h-4" />
      case 'team': return <Users className="w-4 h-4" />
      case 'system': return <Wrench className="w-4 h-4" />
      case 'billing': return <CreditCard className="w-4 h-4" />
      case 'security': return <Shield className="w-4 h-4" />
      case 'achievement': return <Trophy className="w-4 h-4" />
      default: return <Info className="w-4 h-4" />
    }
  }

  const getPriorityStyles = () => {
    switch (notification.priority) {
      case 'urgent':
        return 'border-l-red-500 bg-red-50 shadow-red-200'
      case 'high':
        return 'border-l-orange-500 bg-orange-50 shadow-orange-200'
      case 'medium':
        return 'border-l-yellow-500 bg-yellow-50 shadow-yellow-200'
      case 'low':
        return 'border-l-blue-500 bg-blue-50 shadow-blue-200'
      default:
        return 'border-l-gray-500 bg-gray-50 shadow-gray-200'
    }
  }

  if (!isVisible) return null

  return (
    <div
      className={`fixed top-4 right-4 z-50 transform transition-all duration-300 ease-in-out ${
        isClosing 
          ? 'translate-x-full opacity-0' 
          : 'translate-x-0 opacity-100'
      }`}
    >
      <Card className={`w-80 shadow-lg border-l-4 ${getPriorityStyles()}`}>
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            {/* Icon */}
            <div className="flex-shrink-0">
              {getTypeIcon()}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-gray-900 mb-1">
                    {notification.title}
                  </h4>
                  <p className="text-sm text-gray-600 mb-2">
                    {notification.message}
                  </p>
                  
                  {/* Metadata */}
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <div className="flex items-center space-x-1">
                      {getCategoryIcon()}
                      <span className="capitalize">{notification.category}</span>
                    </div>
                    <span>•</span>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{formatNotificationTime(notification.createdAt)}</span>
                    </div>
                    <span>•</span>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${getPriorityColor(notification.priority)}`}
                    >
                      {notification.priority}
                    </Badge>
                  </div>
                </div>

                {/* Close button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClose}
                  className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Action button */}
              {notification.actionText && (
                <div className="mt-3 flex justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleAction}
                    className="text-xs"
                  >
                    {notification.actionText}
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Hook para manejar notificaciones toast
export function useNotificationToast() {
  const [toasts, setToasts] = useState<Notification[]>([])

  const addToast = (notification: Notification) => {
    setToasts(prev => [...prev, notification])
  }

  const removeToast = (notificationId: string) => {
    setToasts(prev => prev.filter(n => n.id !== notificationId))
  }

  const clearAllToasts = () => {
    setToasts([])
  }

  return {
    toasts,
    addToast,
    removeToast,
    clearAllToasts
  }
}

// Componente para mostrar múltiples toasts
export function NotificationToastContainer() {
  const { toasts, removeToast } = useNotificationToast()

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((notification) => (
        <NotificationToast
          key={notification.id}
          notification={notification}
          onClose={() => removeToast(notification.id)}
          onAction={() => {
            if (notification.actionUrl) {
              window.open(notification.actionUrl, '_blank')
            }
          }}
        />
      ))}
    </div>
  )
}
