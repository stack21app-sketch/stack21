'use client'

import { useState, useEffect } from 'react'
import { useTranslation } from '@/hooks/useTranslation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function DebugTranslations() {
  const { t, changeLanguage, getCurrentLanguage, isReady } = useTranslation('landing')
  const [currentLang, setCurrentLang] = useState('es')
  const [debugInfo, setDebugInfo] = useState<any>({})

  useEffect(() => {
    const lang = getCurrentLanguage()
    setCurrentLang(lang)
    
    // Debug info
    setDebugInfo({
      currentLang: lang,
      isReady,
      hasT: !!t,
      localStorage: typeof window !== 'undefined' ? localStorage.getItem('preferred-language') : 'N/A'
    })
  }, [getCurrentLanguage, isReady, t])

  const handleLanguageChange = (lang: string) => {
    console.log('Changing language to:', lang)
    changeLanguage(lang)
    
    // Force re-render after a short delay
    setTimeout(() => {
      const newLang = getCurrentLanguage()
      setCurrentLang(newLang)
      setDebugInfo((prev: any) => ({
        ...prev,
        currentLang: newLang,
        localStorage: typeof window !== 'undefined' ? localStorage.getItem('preferred-language') : 'N/A'
      }))
    }, 100)
  }

  const testKeys = [
    'hero.title',
    'hero.subtitle', 
    'hero.badge',
    'hero.description',
    'hero.ctaPrimary',
    'hero.ctaSecondary'
  ]

  return (
    <Card className="w-full max-w-4xl mx-auto mb-8">
      <CardHeader>
        <CardTitle>Debug de Traducciones - Idioma: {currentLang.toUpperCase()}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Botones de idioma */}
        <div className="flex gap-2 flex-wrap">
          {['es', 'en', 'de', 'fr', 'pt'].map((lang) => (
            <Button
              key={lang}
              variant={currentLang === lang ? "default" : "outline"}
              size="sm"
              onClick={() => handleLanguageChange(lang)}
            >
              {lang.toUpperCase()}
            </Button>
          ))}
        </div>

        {/* Información de debug */}
        <div className="p-4 bg-gray-100 rounded-lg">
          <h3 className="font-bold mb-2">Debug Info:</h3>
          <pre className="text-xs">{JSON.stringify(debugInfo, null, 2)}</pre>
        </div>

        {/* Traducciones de prueba */}
        <div className="space-y-2">
          <h3 className="font-bold">Traducciones:</h3>
          {testKeys.map((key) => {
            const translation = t(key, `[${key}]`)
            return (
              <div key={key} className="flex justify-between items-center p-2 border rounded">
                <span className="font-mono text-sm">{key}:</span>
                <span className="text-sm">{translation}</span>
              </div>
            )
          })}
        </div>

        {/* Traducciones directas para alemán */}
        <div className="space-y-2">
          <h3 className="font-bold">Traducciones directas (DE):</h3>
          <div className="p-2 border rounded">
            <div>hero.title: {t('hero.title', 'Automatisieren')}</div>
            <div>hero.subtitle: {t('hero.subtitle', 'schneller als je zuvor')}</div>
            <div>hero.badge: {t('hero.badge', 'Die Premium-Alternative zu anderen Plattformen')}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
