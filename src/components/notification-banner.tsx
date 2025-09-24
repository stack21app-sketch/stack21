'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  X, 
  Bell, 
  Sparkles, 
  TrendingUp,
  Users,
  Star
} from 'lucide-react'

interface NotificationBannerProps {
  type?: 'success' | 'info' | 'warning' | 'promo'
  title: string
  message: string
  actionText?: string
  onAction?: () => void
  dismissible?: boolean
  className?: string
}

export function NotificationBanner({
  type = 'info',
  title,
  message,
  actionText,
  onAction,
  dismissible = true,
  className = ''
}: NotificationBannerProps) {
  const [isVisible, setIsVisible] = useState(true)
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    // Verificar si ya fue descartada en localStorage
    const dismissed = localStorage.getItem(`notification-${title}`)
    if (dismissed === 'true') {
      setIsDismissed(true)
      setIsVisible(false)
    }
  }, [title])

  const handleDismiss = () => {
    setIsVisible(false)
    localStorage.setItem(`notification-${title}`, 'true')
  }

  const handleAction = () => {
    onAction?.()
  }

  if (!isVisible || isDismissed) {
    return null
  }

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-900/20 border-green-500/20 text-green-100'
      case 'warning':
        return 'bg-yellow-900/20 border-yellow-500/20 text-yellow-100'
      case 'promo':
        return 'bg-gradient-to-r from-purple-900/20 to-pink-900/20 border-purple-500/20 text-purple-100'
      default:
        return 'bg-blue-900/20 border-blue-500/20 text-blue-100'
    }
  }

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <Sparkles className="h-5 w-5 text-green-400" />
      case 'warning':
        return <TrendingUp className="h-5 w-5 text-yellow-400" />
      case 'promo':
        return <Star className="h-5 w-5 text-purple-400" />
      default:
        return <Bell className="h-5 w-5 text-blue-400" />
    }
  }

  return (
    <Card className={`${getTypeStyles()} backdrop-blur-sm ${className}`}>
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            {getIcon()}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-white">{title}</h4>
            <p className="text-sm opacity-90 mt-1">{message}</p>
            {actionText && onAction && (
              <Button
                size="sm"
                className="mt-3 bg-white/20 hover:bg-white/30 text-white border-white/30"
                onClick={handleAction}
              >
                {actionText}
              </Button>
            )}
          </div>
          {dismissible && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDismiss}
              className="text-white/70 hover:text-white hover:bg-white/10"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// Componente para notificaciones de waitlist
export function WaitlistNotification() {
  return (
    <NotificationBanner
      type="promo"
      title="🚀 ¡Únete a la Lista de Espera!"
      message="Sé el primero en conocer cuando Stack21 esté listo. Ofertas especiales solo para la lista de espera."
      actionText="Unirse Ahora"
      onAction={() => {
        document.getElementById('waitlist-form')?.scrollIntoView({ behavior: 'smooth' })
      }}
    />
  )
}

// Componente para notificaciones de referidos
export function ReferralNotification() {
  return (
    <NotificationBanner
      type="info"
      title="🎁 ¿Tienes un Código de Referido?"
      message="Usa un código de referido para obtener descuentos exclusivos y beneficios especiales."
      actionText="Ver Códigos"
      onAction={() => {
        // Scroll to referral section
        document.getElementById('referral-section')?.scrollIntoView({ behavior: 'smooth' })
      }}
    />
  )
}

// Componente para notificaciones de éxito
export function SuccessNotification({ message }: { message: string }) {
  return (
    <NotificationBanner
      type="success"
      title="¡Excelente!"
      message={message}
      dismissible={true}
    />
  )
}
