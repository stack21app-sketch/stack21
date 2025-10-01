// Configuración de Analytics
export const analyticsConfig = {
  googleAnalytics: {
    measurementId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-XXXXXXXXXX'
  },
  hotjar: {
    id: process.env.NEXT_PUBLIC_HOTJAR_ID || '1234567'
  }
}

// Eventos personalizados
export const analyticsEvents = {
  emailSignup: 'email_signup',
  pageView: 'page_view',
  buttonClick: 'button_click',
  scrollDepth: 'scroll_depth',
  videoPlay: 'video_play',
  socialClick: 'social_click'
} as const

// Hook para usar analytics
export function useAnalytics() {
  const trackEvent = (eventName: string, parameters?: Record<string, any>) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', eventName, {
        event_category: 'engagement',
        ...parameters
      })
    }
  }

  const trackPageView = (url: string, title?: string) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', analyticsConfig.googleAnalytics.measurementId, {
        page_title: title || document.title,
        page_location: url,
      })
    }
  }

  const trackEmailSignup = (email: string) => {
    trackEvent(analyticsEvents.emailSignup, {
      event_label: 'coming_soon_page',
      email_domain: email.split('@')[1]
    })
  }

  const trackSocialClick = (platform: string) => {
    trackEvent(analyticsEvents.socialClick, {
      event_label: platform,
      platform: platform
    })
  }

  return { 
    trackEvent, 
    trackPageView, 
    trackEmailSignup, 
    trackSocialClick 
  }
}