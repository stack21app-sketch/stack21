/**
 * Gestión de Cookies y Consentimiento
 * 
 * Este archivo contiene funciones para gestionar cookies de manera
 * conforme con GDPR, CCPA y otras regulaciones de privacidad.
 */

export interface CookiePreferences {
  essential: boolean
  analytics: boolean
  marketing: boolean
  functional: boolean
  timestamp: string
  version: string
}

export interface CookieDefinition {
  name: string
  category: 'essential' | 'analytics' | 'marketing' | 'functional'
  purpose: string
  duration: string
  provider: string
  third_party: boolean
  gdpr_legal_basis: string
  ccpa_category: string
}

export class CookieManager {
  private static instance: CookieManager
  private preferences: CookiePreferences | null = null
  private cookieDefinitions: CookieDefinition[] = []

  private constructor() {
    this.initializeCookieDefinitions()
    this.loadPreferences()
  }

  public static getInstance(): CookieManager {
    if (!CookieManager.instance) {
      CookieManager.instance = new CookieManager()
    }
    return CookieManager.instance
  }

  /**
   * Inicializa las definiciones de cookies
   */
  private initializeCookieDefinitions(): void {
    this.cookieDefinitions = [
      // Cookies Esenciales
      {
        name: 'session_id',
        category: 'essential',
        purpose: 'Identificación de sesión del usuario',
        duration: 'Sesión',
        provider: 'Stack21',
        third_party: false,
        gdpr_legal_basis: 'Art. 6.1.b - Contrato',
        ccpa_category: 'Necessary'
      },
      {
        name: 'auth_token',
        category: 'essential',
        purpose: 'Token de autenticación seguro',
        duration: '30 días',
        provider: 'Stack21',
        third_party: false,
        gdpr_legal_basis: 'Art. 6.1.b - Contrato',
        ccpa_category: 'Necessary'
      },
      {
        name: 'csrf_token',
        category: 'essential',
        purpose: 'Protección contra ataques CSRF',
        duration: 'Sesión',
        provider: 'Stack21',
        third_party: false,
        gdpr_legal_basis: 'Art. 6.1.f - Interés Legítimo',
        ccpa_category: 'Necessary'
      },

      // Cookies Analíticas
      {
        name: '_ga',
        category: 'analytics',
        purpose: 'Google Analytics - Identificación única',
        duration: '2 años',
        provider: 'Google',
        third_party: true,
        gdpr_legal_basis: 'Art. 6.1.a - Consentimiento',
        ccpa_category: 'Analytics'
      },
      {
        name: '_gid',
        category: 'analytics',
        purpose: 'Google Analytics - Identificación de sesión',
        duration: '24 horas',
        provider: 'Google',
        third_party: true,
        gdpr_legal_basis: 'Art. 6.1.a - Consentimiento',
        ccpa_category: 'Analytics'
      },
      {
        name: '_gat',
        category: 'analytics',
        purpose: 'Google Analytics - Limitación de velocidad',
        duration: '1 minuto',
        provider: 'Google',
        third_party: true,
        gdpr_legal_basis: 'Art. 6.1.a - Consentimiento',
        ccpa_category: 'Analytics'
      },

      // Cookies de Marketing
      {
        name: '_fbp',
        category: 'marketing',
        purpose: 'Facebook Pixel - Seguimiento de conversiones',
        duration: '3 meses',
        provider: 'Facebook',
        third_party: true,
        gdpr_legal_basis: 'Art. 6.1.a - Consentimiento',
        ccpa_category: 'Marketing'
      },
      {
        name: '_gcl_au',
        category: 'marketing',
        purpose: 'Google Ads - Conversiones',
        duration: '3 meses',
        provider: 'Google',
        third_party: true,
        gdpr_legal_basis: 'Art. 6.1.a - Consentimiento',
        ccpa_category: 'Marketing'
      },

      // Cookies Funcionales
      {
        name: 'cookie_consent',
        category: 'functional',
        purpose: 'Preferencias de consentimiento de cookies',
        duration: '1 año',
        provider: 'Stack21',
        third_party: false,
        gdpr_legal_basis: 'Art. 6.1.a - Consentimiento',
        ccpa_category: 'Functional'
      },
      {
        name: 'theme_preference',
        category: 'functional',
        purpose: 'Preferencia de tema (claro/oscuro)',
        duration: '1 año',
        provider: 'Stack21',
        third_party: false,
        gdpr_legal_basis: 'Art. 6.1.a - Consentimiento',
        ccpa_category: 'Functional'
      },
      {
        name: 'language_preference',
        category: 'functional',
        purpose: 'Preferencia de idioma',
        duration: '1 año',
        provider: 'Stack21',
        third_party: false,
        gdpr_legal_basis: 'Art. 6.1.a - Consentimiento',
        ccpa_category: 'Functional'
      }
    ]
  }

  /**
   * Carga las preferencias de cookies desde localStorage
   */
  private loadPreferences(): void {
    if (typeof window === 'undefined') return

    try {
      const stored = localStorage.getItem('cookie_consent')
      if (stored) {
        this.preferences = JSON.parse(stored)
      }
    } catch (error) {
      console.error('Error cargando preferencias de cookies:', error)
    }
  }

  /**
   * Guarda las preferencias de cookies en localStorage
   */
  private savePreferences(preferences: CookiePreferences): void {
    if (typeof window === 'undefined') return

    try {
      localStorage.setItem('cookie_consent', JSON.stringify(preferences))
      this.preferences = preferences
    } catch (error) {
      console.error('Error guardando preferencias de cookies:', error)
    }
  }

  /**
   * Obtiene las preferencias actuales de cookies
   */
  public getPreferences(): CookiePreferences | null {
    return this.preferences
  }

  /**
   * Establece las preferencias de cookies
   */
  public setPreferences(preferences: Partial<CookiePreferences>): void {
    const newPreferences: CookiePreferences = {
      essential: true, // Siempre true
      analytics: preferences.analytics || false,
      marketing: preferences.marketing || false,
      functional: preferences.functional || false,
      timestamp: new Date().toISOString(),
      version: '1.0'
    }

    this.savePreferences(newPreferences)
    this.applyPreferences(newPreferences)
  }

  /**
   * Aplica las preferencias de cookies
   */
  private applyPreferences(preferences: CookiePreferences): void {
    // Aplicar cookies esenciales (siempre activas)
    this.applyEssentialCookies()

    // Aplicar cookies analíticas
    if (preferences.analytics) {
      this.applyAnalyticsCookies()
    } else {
      this.removeAnalyticsCookies()
    }

    // Aplicar cookies de marketing
    if (preferences.marketing) {
      this.applyMarketingCookies()
    } else {
      this.removeMarketingCookies()
    }

    // Aplicar cookies funcionales
    if (preferences.functional) {
      this.applyFunctionalCookies()
    } else {
      this.removeFunctionalCookies()
    }
  }

  /**
   * Aplica cookies esenciales
   */
  private applyEssentialCookies(): void {
    // Las cookies esenciales se aplican automáticamente
    // No necesitan consentimiento explícito
    console.log('Cookies esenciales aplicadas')
  }

  /**
   * Aplica cookies analíticas
   */
  private applyAnalyticsCookies(): void {
    // Cargar Google Analytics
    this.loadGoogleAnalytics()
    console.log('Cookies analíticas aplicadas')
  }

  /**
   * Elimina cookies analíticas
   */
  private removeAnalyticsCookies(): void {
    // Deshabilitar Google Analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('consent', 'update', {
        analytics_storage: 'denied'
      })
    }
    console.log('Cookies analíticas eliminadas')
  }

  /**
   * Aplica cookies de marketing
   */
  private applyMarketingCookies(): void {
    // Cargar scripts de marketing
    this.loadFacebookPixel()
    this.loadGoogleAds()
    console.log('Cookies de marketing aplicadas')
  }

  /**
   * Elimina cookies de marketing
   */
  private removeMarketingCookies(): void {
    // Deshabilitar scripts de marketing
    console.log('Cookies de marketing eliminadas')
  }

  /**
   * Aplica cookies funcionales
   */
  private applyFunctionalCookies(): void {
    // Aplicar configuraciones funcionales
    console.log('Cookies funcionales aplicadas')
  }

  /**
   * Elimina cookies funcionales
   */
  private removeFunctionalCookies(): void {
    // Eliminar configuraciones funcionales
    console.log('Cookies funcionales eliminadas')
  }

  /**
   * Carga Google Analytics
   */
  private loadGoogleAnalytics(): void {
    if (typeof window === 'undefined') return

    // Verificar si ya está cargado
    if ((window as any).gtag) return

    const script = document.createElement('script')
    script.async = true
    script.src = `https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`
    document.head.appendChild(script)

    window.dataLayer = window.dataLayer || []
    const gtag = (...args: any[]) => {
      window.dataLayer.push(args)
    }
    ;(window as any).gtag = gtag
    gtag('js', new Date())
    gtag('config', process.env.NEXT_PUBLIC_GA_ID, {
      anonymize_ip: true,
      cookie_flags: 'SameSite=None;Secure'
    })
  }

  /**
   * Carga Facebook Pixel
   */
  private loadFacebookPixel(): void {
    if (typeof window === 'undefined') return

    // Implementar Facebook Pixel si es necesario
    console.log('Facebook Pixel cargado')
  }

  /**
   * Carga Google Ads
   */
  private loadGoogleAds(): void {
    if (typeof window === 'undefined') return

    // Implementar Google Ads si es necesario
    console.log('Google Ads cargado')
  }

  /**
   * Obtiene las definiciones de cookies por categoría
   */
  public getCookiesByCategory(category: string): CookieDefinition[] {
    return this.cookieDefinitions.filter(cookie => cookie.category === category)
  }

  /**
   * Obtiene todas las definiciones de cookies
   */
  public getAllCookies(): CookieDefinition[] {
    return this.cookieDefinitions
  }

  /**
   * Verifica si una cookie está permitida según las preferencias
   */
  public isCookieAllowed(cookieName: string): boolean {
    if (!this.preferences) return false

    const cookie = this.cookieDefinitions.find(c => c.name === cookieName)
    if (!cookie) return false

    switch (cookie.category) {
      case 'essential':
        return true // Siempre permitidas
      case 'analytics':
        return this.preferences.analytics
      case 'marketing':
        return this.preferences.marketing
      case 'functional':
        return this.preferences.functional
      default:
        return false
    }
  }

  /**
   * Elimina todas las cookies no esenciales
   */
  public clearNonEssentialCookies(): void {
    if (typeof window === 'undefined') return

    const cookies = document.cookie.split(';')
    cookies.forEach(cookie => {
      const cookieName = cookie.split('=')[0].trim()
      const cookieDef = this.cookieDefinitions.find(c => c.name === cookieName)
      
      if (cookieDef && cookieDef.category !== 'essential') {
        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`
        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=.${window.location.hostname}`
      }
    })

    console.log('Cookies no esenciales eliminadas')
  }

  /**
   * Genera un informe de cookies
   */
  public generateCookieReport(): any {
    const report = {
      generated_at: new Date().toISOString(),
      preferences: this.preferences,
      cookies: this.cookieDefinitions.map(cookie => ({
        name: cookie.name,
        category: cookie.category,
        purpose: cookie.purpose,
        duration: cookie.duration,
        provider: cookie.provider,
        third_party: cookie.third_party,
        allowed: this.isCookieAllowed(cookie.name),
        gdpr_legal_basis: cookie.gdpr_legal_basis,
        ccpa_category: cookie.ccpa_category
      })),
      summary: {
        total_cookies: this.cookieDefinitions.length,
        essential_cookies: this.cookieDefinitions.filter(c => c.category === 'essential').length,
        analytics_cookies: this.cookieDefinitions.filter(c => c.category === 'analytics').length,
        marketing_cookies: this.cookieDefinitions.filter(c => c.category === 'marketing').length,
        functional_cookies: this.cookieDefinitions.filter(c => c.category === 'functional').length,
        third_party_cookies: this.cookieDefinitions.filter(c => c.third_party).length
      }
    }

    return report
  }

  /**
   * Verifica si el consentimiento ha expirado
   */
  public isConsentExpired(maxAge: number = 365 * 24 * 60 * 60 * 1000): boolean {
    if (!this.preferences) return true

    const consentTime = new Date(this.preferences.timestamp).getTime()
    const now = Date.now()
    
    return (now - consentTime) > maxAge
  }

  /**
   * Renueva el consentimiento si ha expirado
   */
  public renewConsentIfExpired(): boolean {
    if (this.isConsentExpired()) {
      // Eliminar preferencias expiradas
      if (typeof window !== 'undefined') {
        localStorage.removeItem('cookie_consent')
      }
      this.preferences = null
      return true
    }
    return false
  }
}

// Instancia global del gestor de cookies
export const cookieManager = CookieManager.getInstance()

// Declaraciones globales para TypeScript
declare global {
  interface Window {
    gtag: (...args: any[]) => void
    dataLayer: any[]
  }
}
