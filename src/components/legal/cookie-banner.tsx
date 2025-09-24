'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Cookie, Settings, X, CheckCircle, AlertTriangle } from 'lucide-react'
import Link from 'next/link'

interface CookieBannerProps {
  onAccept?: () => void
  onReject?: () => void
  onCustomize?: () => void
}

export default function CookieBanner({ onAccept, onReject, onCustomize }: CookieBannerProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isCustomizing, setIsCustomizing] = useState(false)
  const [preferences, setPreferences] = useState({
    essential: true, // Siempre true, no se puede deshabilitar
    analytics: false,
    marketing: false,
    functional: false
  })

  useEffect(() => {
    // Verificar si ya se ha dado consentimiento
    const consent = localStorage.getItem('cookie_consent')
    if (!consent) {
      setIsVisible(true)
    }
  }, [])

  const handleAcceptAll = () => {
    const allConsent = {
      essential: true,
      analytics: true,
      marketing: true,
      functional: true,
      timestamp: new Date().toISOString()
    }
    
    localStorage.setItem('cookie_consent', JSON.stringify(allConsent))
    setIsVisible(false)
    onAccept?.()
    
    // Cargar scripts de terceros
    loadThirdPartyScripts()
  }

  const handleRejectAll = () => {
    const minimalConsent = {
      essential: true,
      analytics: false,
      marketing: false,
      functional: false,
      timestamp: new Date().toISOString()
    }
    
    localStorage.setItem('cookie_consent', JSON.stringify(minimalConsent))
    setIsVisible(false)
    onReject?.()
  }

  const handleCustomize = () => {
    setIsCustomizing(true)
  }

  const handleSavePreferences = () => {
    const customConsent = {
      ...preferences,
      timestamp: new Date().toISOString()
    }
    
    localStorage.setItem('cookie_consent', JSON.stringify(customConsent))
    setIsVisible(false)
    setIsCustomizing(false)
    onCustomize?.()
    
    // Cargar scripts según preferencias
    if (preferences.analytics) {
      loadAnalyticsScripts()
    }
    if (preferences.marketing) {
      loadMarketingScripts()
    }
  }

  const loadThirdPartyScripts = () => {
    // Cargar Google Analytics
    loadAnalyticsScripts()
    // Cargar scripts de marketing
    loadMarketingScripts()
  }

  const loadAnalyticsScripts = () => {
    // Google Analytics
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

  const loadMarketingScripts = () => {
    // Scripts de marketing (ejemplo: Facebook Pixel, etc.)
    console.log('Marketing scripts loaded')
  }

  if (!isVisible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
      <Card className="bg-white/95 backdrop-blur-sm border border-gray-200 shadow-2xl max-w-4xl mx-auto">
        <CardContent className="p-6">
          {!isCustomizing ? (
            // Vista principal del banner
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <Cookie className="h-6 w-6 text-orange-500 mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      🍪 Usamos cookies para mejorar tu experiencia
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      Utilizamos cookies esenciales para el funcionamiento del sitio y cookies opcionales 
                      para analytics y personalización. Puedes elegir qué cookies aceptar.
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsVisible(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={handleRejectAll}
                  variant="outline"
                  className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Solo Esenciales
                </Button>
                <Button
                  onClick={handleCustomize}
                  variant="outline"
                  className="flex-1 border-blue-300 text-blue-700 hover:bg-blue-50"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Personalizar
                </Button>
                <Button
                  onClick={handleAcceptAll}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Aceptar Todas
                </Button>
              </div>

              <div className="text-xs text-gray-500 text-center">
                Al continuar navegando, aceptas nuestro uso de cookies. 
                <Link href="/cookie-policy" className="text-blue-600 hover:underline ml-1">
                  Más información
                </Link>
              </div>
            </div>
          ) : (
            // Vista de personalización
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Personalizar Cookies
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsCustomizing(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-4">
                {/* Cookies Esenciales */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">Cookies Esenciales</h4>
                    <p className="text-sm text-gray-600">
                      Necesarias para el funcionamiento básico del sitio
                    </p>
                  </div>
                  <div className="flex items-center text-green-600">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    <span className="text-sm font-medium">Siempre activas</span>
                  </div>
                </div>

                {/* Cookies Analíticas */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">Cookies Analíticas</h4>
                    <p className="text-sm text-gray-600">
                      Nos ayudan a entender cómo usas nuestro sitio
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={preferences.analytics}
                      onChange={(e) => setPreferences(prev => ({ ...prev, analytics: e.target.checked }))}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                {/* Cookies de Marketing */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">Cookies de Marketing</h4>
                    <p className="text-sm text-gray-600">
                      Para personalizar anuncios y contenido
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={preferences.marketing}
                      onChange={(e) => setPreferences(prev => ({ ...prev, marketing: e.target.checked }))}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                {/* Cookies Funcionales */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">Cookies Funcionales</h4>
                    <p className="text-sm text-gray-600">
                      Mejoran la funcionalidad del sitio
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={preferences.functional}
                      onChange={(e) => setPreferences(prev => ({ ...prev, functional: e.target.checked }))}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={() => setIsCustomizing(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleSavePreferences}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Guardar Preferencias
                </Button>
              </div>
            </div>
          )}
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
