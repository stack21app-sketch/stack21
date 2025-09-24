'use client'

import { useEffect } from 'react'

interface AnalyticsEvent {
  event: string
  properties?: Record<string, any>
  timestamp?: number
}

interface AnalyticsTrackerProps {
  event: string
  properties?: Record<string, any>
  children: React.ReactNode
}

export function AnalyticsTracker({ event, properties, children }: AnalyticsTrackerProps) {
  const trackEvent = (eventData: AnalyticsEvent) => {
    // En un entorno de producción, aquí enviarías los datos a tu servicio de analytics
    console.log('Analytics Event:', eventData)
    
    // Ejemplo de envío a un endpoint de analytics
    if (typeof window !== 'undefined') {
      fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventData)
      }).catch(error => {
        console.error('Error tracking analytics:', error)
      })
    }
  }

  const handleClick = () => {
    trackEvent({
      event,
      properties: {
        ...properties,
        timestamp: Date.now(),
        url: window.location.href,
        userAgent: navigator.userAgent
      }
    })
  }

  return (
    <div onClick={handleClick}>
      {children}
    </div>
  )
}

// Hook para tracking de eventos
export function useAnalytics() {
  const track = (event: string, properties?: Record<string, any>) => {
    if (typeof window !== 'undefined') {
      const eventData: AnalyticsEvent = {
        event,
        properties: {
          ...properties,
          timestamp: Date.now(),
          url: window.location.href,
          userAgent: navigator.userAgent
        }
      }

      console.log('Analytics Event:', eventData)
      
      fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventData)
      }).catch(error => {
        console.error('Error tracking analytics:', error)
      })
    }
  }

  const trackPageView = (page: string) => {
    track('page_view', { page })
  }

  const trackWaitlistSignup = (tier: string, source: string) => {
    track('waitlist_signup', { tier, source })
  }

  const trackReferralCode = (code: string, isValid: boolean) => {
    track('referral_code_used', { code, isValid })
  }

  const trackFormSubmission = (formType: string, success: boolean) => {
    track('form_submission', { formType, success })
  }

  return {
    track,
    trackPageView,
    trackWaitlistSignup,
    trackReferralCode,
    trackFormSubmission
  }
}

// Componente para tracking automático de páginas
export function PageTracker({ page }: { page: string }) {
  const { trackPageView } = useAnalytics()

  useEffect(() => {
    trackPageView(page)
  }, [page, trackPageView])

  return null
}
