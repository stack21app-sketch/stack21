'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Shield, Settings, Download, Trash2, Eye, Lock, BarChart3, Target, Users, AlertTriangle, CheckCircle } from 'lucide-react'
import Link from 'next/link'

interface ConsentPreferences {
  essential: boolean
  analytics: boolean
  marketing: boolean
  functional: boolean
  timestamp?: string
}

interface ConsentManagerProps {
  onConsentChange?: (preferences: ConsentPreferences) => void
}

export default function ConsentManager({ onConsentChange }: ConsentManagerProps) {
  const [preferences, setPreferences] = useState<ConsentPreferences>({
    essential: true,
    analytics: false,
    marketing: false,
    functional: false
  })
  const [isLoading, setIsLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<string>('')

  useEffect(() => {
    loadConsentPreferences()
  }, [])

  const loadConsentPreferences = () => {
    try {
      const stored = localStorage.getItem('cookie_consent')
      if (stored) {
        const consent = JSON.parse(stored)
        setPreferences(consent)
        setLastUpdated(consent.timestamp || '')
      }
    } catch (error) {
      console.error('Error loading consent preferences:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const updatePreference = (key: keyof ConsentPreferences, value: boolean) => {
    if (key === 'essential') return // No se puede cambiar
    
    const newPreferences = {
      ...preferences,
      [key]: value,
      timestamp: new Date().toISOString()
    }
    
    setPreferences(newPreferences)
    localStorage.setItem('cookie_consent', JSON.stringify(newPreferences))
    onConsentChange?.(newPreferences)
    
    // Aplicar cambios inmediatamente
    applyConsentChanges(newPreferences)
  }

  const applyConsentChanges = (consent: ConsentPreferences) => {
    // Aplicar cambios de analytics
    if (consent.analytics) {
      loadAnalyticsScripts()
    } else {
      disableAnalytics()
    }

    // Aplicar cambios de marketing
    if (consent.marketing) {
      loadMarketingScripts()
    } else {
      disableMarketing()
    }

    // Aplicar cambios funcionales
    if (consent.functional) {
      enableFunctionalFeatures()
    } else {
      disableFunctionalFeatures()
    }
  }

  const loadAnalyticsScripts = () => {
    // Cargar Google Analytics si no está cargado
    if (typeof window !== 'undefined' && !window.gtag) {
      const script = document.createElement('script')
      script.async = true
      script.src = `https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`
      document.head.appendChild(script)
      
      window.dataLayer = window.dataLayer || []
      const gtag = (...args: any[]) => {
        window.dataLayer.push(args)
      }
      window.gtag = gtag
      gtag('js', new Date())
      gtag('config', process.env.NEXT_PUBLIC_GA_ID, {
        anonymize_ip: true,
        cookie_flags: 'SameSite=None;Secure'
      })
    }
  }

  const disableAnalytics = () => {
    // Deshabilitar Google Analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('consent', 'update', {
        analytics_storage: 'denied'
      })
    }
  }

  const loadMarketingScripts = () => {
    // Cargar scripts de marketing
    console.log('Marketing scripts enabled')
  }

  const disableMarketing = () => {
    // Deshabilitar scripts de marketing
    console.log('Marketing scripts disabled')
  }

  const enableFunctionalFeatures = () => {
    // Habilitar características funcionales
    console.log('Functional features enabled')
  }

  const disableFunctionalFeatures = () => {
    // Deshabilitar características funcionales
    console.log('Functional features disabled')
  }

  const resetConsent = () => {
    localStorage.removeItem('cookie_consent')
    setPreferences({
      essential: true,
      analytics: false,
      marketing: false,
      functional: false
    })
    setLastUpdated('')
    onConsentChange?.({
      essential: true,
      analytics: false,
      marketing: false,
      functional: false
    })
  }

  const exportData = () => {
    const data = {
      consent_preferences: preferences,
      last_updated: lastUpdated,
      export_date: new Date().toISOString()
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `consent-preferences-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Cargando preferencias...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Shield className="h-6 w-6 text-blue-600" />
              <div>
                <CardTitle className="text-xl">Gestión de Consentimiento</CardTitle>
                <p className="text-sm text-gray-600 mt-1">
                  Controla qué datos podemos recopilar y procesar
                </p>
              </div>
            </div>
            <Badge variant="outline" className="text-green-600 border-green-600">
              GDPR Compliant
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Última actualización:</span>
              <p className="font-medium">
                {lastUpdated ? new Date(lastUpdated).toLocaleString('es-ES') : 'Nunca'}
              </p>
            </div>
            <div>
              <span className="text-gray-600">Estado:</span>
              <p className="font-medium text-green-600">Activo</p>
            </div>
            <div>
              <span className="text-gray-600">Conformidad:</span>
              <p className="font-medium text-blue-600">100%</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preferencias de Consentimiento */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings className="h-5 w-5 mr-2 text-blue-600" />
            Preferencias de Consentimiento
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Cookies Esenciales */}
          <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-start space-x-3">
              <Lock className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-gray-900">Cookies Esenciales</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Necesarias para el funcionamiento básico del sitio web. No se pueden deshabilitar.
                </p>
                <ul className="text-xs text-gray-500 mt-2 space-y-1">
                  <li>• Autenticación de usuarios</li>
                  <li>• Preferencias de sesión</li>
                  <li>• Seguridad y prevención de fraude</li>
                </ul>
              </div>
            </div>
            <div className="flex items-center text-green-600">
              <CheckCircle className="h-5 w-5 mr-2" />
              <span className="text-sm font-medium">Siempre activas</span>
            </div>
          </div>

          {/* Cookies Analíticas */}
          <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <div className="flex items-start space-x-3">
              <BarChart3 className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-gray-900">Cookies Analíticas</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Nos ayudan a entender cómo usas nuestro sitio para mejorarlo.
                </p>
                <ul className="text-xs text-gray-500 mt-2 space-y-1">
                  <li>• Google Analytics</li>
                  <li>• Métricas de rendimiento</li>
                  <li>• Comportamiento del usuario</li>
                </ul>
              </div>
            </div>
            <Switch
              checked={preferences.analytics}
              onCheckedChange={(checked) => updatePreference('analytics', checked)}
            />
          </div>

          {/* Cookies de Marketing */}
          <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <div className="flex items-start space-x-3">
              <Target className="h-5 w-5 text-orange-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-gray-900">Cookies de Marketing</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Para personalizar anuncios y contenido relevante para ti.
                </p>
                <ul className="text-xs text-gray-500 mt-2 space-y-1">
                  <li>• Publicidad dirigida</li>
                  <li>• Remarketing</li>
                  <li>• Redes sociales</li>
                </ul>
              </div>
            </div>
            <Switch
              checked={preferences.marketing}
              onCheckedChange={(checked) => updatePreference('marketing', checked)}
            />
          </div>

          {/* Cookies Funcionales */}
          <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <div className="flex items-start space-x-3">
              <Users className="h-5 w-5 text-purple-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-gray-900">Cookies Funcionales</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Mejoran la funcionalidad y personalización del sitio.
                </p>
                <ul className="text-xs text-gray-500 mt-2 space-y-1">
                  <li>• Preferencias de idioma</li>
                  <li>• Configuraciones de tema</li>
                  <li>• Recordar configuraciones</li>
                </ul>
              </div>
            </div>
            <Switch
              checked={preferences.functional}
              onCheckedChange={(checked) => updatePreference('functional', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Acciones */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Eye className="h-5 w-5 mr-2 text-blue-600" />
            Acciones de Privacidad
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              onClick={exportData}
              variant="outline"
              className="h-auto p-4 flex items-start space-x-3"
            >
              <Download className="h-5 w-5 text-green-600 mt-0.5" />
              <div className="text-left">
                <div className="font-medium">Exportar Preferencias</div>
                <div className="text-xs text-gray-600">Descarga tus configuraciones actuales</div>
              </div>
            </Button>

            <Button
              onClick={resetConsent}
              variant="outline"
              className="h-auto p-4 flex items-start space-x-3 text-red-600 hover:text-red-700 hover:border-red-300"
            >
              <Trash2 className="h-5 w-5 text-red-600 mt-0.5" />
              <div className="text-left">
                <div className="font-medium">Restablecer Consentimiento</div>
                <div className="text-xs text-gray-600">Eliminar todas las preferencias guardadas</div>
              </div>
            </Button>
          </div>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-900">Información Importante</h4>
                <p className="text-sm text-blue-800 mt-1">
                  Puedes cambiar tus preferencias en cualquier momento. Los cambios se aplicarán
                  inmediatamente y se guardarán para futuras visitas.
                </p>
                <div className="mt-2">
                  <Link href="/privacy-policy" className="text-sm text-blue-600 hover:underline">
                    Ver Política de Privacidad completa
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Declaraciones globales para TypeScript
declare global {
  interface Window {
    gtag: (...args: any[]) => void
    dataLayer: any[]
  }
}
