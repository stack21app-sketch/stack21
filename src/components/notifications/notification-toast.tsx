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
  XCircle, 
  Bell,
  ExternalLink,
  Clock
} from 'lucide-react'
import { TimeDisplay } from '../TimeDisplay'

interface NotificationToastProps {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  timestamp: Date
  isRead?: boolean
  action?: {
    label: string
    onClick: () => void
  }
  onClose: (id: string) => void
  onMarkAsRead: (id: string) => void
  autoClose?: boolean
  duration?: number
}

const getIcon = (type: NotificationToastProps['type']) => {
  switch (type) {
    case 'success': return CheckCircle
    case 'error': return XCircle
    case 'warning': return AlertCircle
    case 'info': return Info
    default: return Bell
  }
}

const getTypeColor = (type: NotificationToastProps['type']) => {
  switch (type) {
    case 'success': return 'border-green-200 bg-green-50'
    case 'error': return 'border-red-200 bg-red-50'
    case 'warning': return 'border-yellow-200 bg-yellow-50'
    case 'info': return 'border-blue-200 bg-blue-50'
    default: return 'border-gray-200 bg-gray-50'
  }
}

const getIconColor = (type: NotificationToastProps['type']) => {
  switch (type) {
    case 'success': return 'text-green-600'
    case 'error': return 'text-red-600'
    case 'warning': return 'text-yellow-600'
    case 'info': return 'text-blue-600'
    default: return 'text-gray-600'
  }
}

export default function NotificationToast({
  id,
  type,
  title,
  message,
  timestamp,
  isRead = false,
  action,
  onClose,
  onMarkAsRead,
  autoClose = true,
  duration = 5000
}: NotificationToastProps) {
  const [isVisible, setIsVisible] = useState(true)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        handleClose()
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [autoClose, duration])

  const handleClose = () => {
    setIsAnimating(true)
    setTimeout(() => {
      setIsVisible(false)
      onClose(id)
    }, 300)
  }

  const handleMarkAsRead = () => {
    if (!isRead) {
      onMarkAsRead(id)
    }
  }

  // Removed formatTimeAgo function - using TimeDisplay component instead

  if (!isVisible) return null

  const Icon = getIcon(type)

  return (
    <div
      className={`fixed top-4 right-4 z-50 max-w-sm w-full transform transition-all duration-300 ease-in-out ${
        isAnimating ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'
      }`}
    >
      <Card className={`shadow-lg border-l-4 ${getTypeColor(type)} ${
        isRead ? 'opacity-75' : 'opacity-100'
      }`}>
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <Icon className={`h-5 w-5 ${getIconColor(type)}`} />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h4 className="text-sm font-medium text-gray-900 truncate">
                  {title}
                </h4>
                <div className="flex items-center space-x-2">
                  {!isRead && (
                    <Badge className="bg-blue-500 text-white text-xs">
                      Nuevo
                    </Badge>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClose}
                    className="h-6 w-6 p-0 hover:bg-gray-200"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              
              <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                {message}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center text-xs text-gray-500">
                  <Clock className="h-3 w-3 mr-1" />
                  <TimeDisplay timestamp={timestamp} format="relative" />
                </div>
                
                <div className="flex items-center space-x-2">
                  {action && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={action.onClick}
                      className="h-6 px-2 text-xs"
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      {action.label}
                    </Button>
                  )}
                  
                  {!isRead && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleMarkAsRead}
                      className="h-6 px-2 text-xs text-blue-600 hover:text-blue-700"
                    >
                      Marcar como leído
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
