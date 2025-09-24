'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

// Traducciones directas
const translations = {
  es: {
    hero: {
      title: 'Automatiza',
      subtitle: 'más rápido que nunca',
      badge: 'La alternativa premium a otras plataformas',
      description: 'Crea workflows visuales con IA, integra tus herramientas y despliega en minutos. Diseño moderno, feedback inmediato y una experiencia superior a otras plataformas.',
      ctaPrimary: 'Empezar gratis',
      ctaSecondary: 'Ver comparativa'
    },
    navigation: {
      documentation: 'Documentación',
      features: 'Características',
      pricing: 'Precios',
      contact: 'Contacto'
    },
    buttons: {
      joinWaitlist: 'Unirse a la lista de espera'
    }
  },
  en: {
    hero: {
      title: 'Automate',
      subtitle: 'faster than ever',
      badge: 'The premium alternative to other platforms',
      description: 'Create visual workflows with AI, integrate your tools, and deploy in minutes. Modern design, instant feedback, and a superior experience to other platforms.',
      ctaPrimary: 'Start for free',
      ctaSecondary: 'View comparison'
    },
    navigation: {
      documentation: 'Documentation',
      features: 'Features',
      pricing: 'Pricing',
      contact: 'Contact'
    },
    buttons: {
      joinWaitlist: 'Join Waitlist'
    }
  },
  de: {
    hero: {
      title: 'Automatisieren',
      subtitle: 'schneller als je zuvor',
      badge: 'Die Premium-Alternative zu anderen Plattformen',
      description: 'Erstellen Sie visuelle Workflows mit KI, integrieren Sie Ihre Tools und stellen Sie sie in wenigen Minuten bereit. Modernes Design, sofortiges Feedback und ein überlegenes Erlebnis gegenüber anderen Plattformen.',
      ctaPrimary: 'Kostenlos starten',
      ctaSecondary: 'Vergleich anzeigen'
    },
    navigation: {
      documentation: 'Dokumentation',
      features: 'Funktionen',
      pricing: 'Preise',
      contact: 'Kontakt'
    },
    buttons: {
      joinWaitlist: 'Warteliste beitreten'
    }
  },
  fr: {
    hero: {
      title: 'Automatisez',
      subtitle: 'plus vite que jamais',
      badge: 'L\'alternative premium aux autres plateformes',
      description: 'Créez des workflows visuels avec l\'IA, intégrez vos outils et déployez en quelques minutes. Design moderne, feedback immédiat et une expérience supérieure aux autres plateformes.',
      ctaPrimary: 'Commencer gratuitement',
      ctaSecondary: 'Voir la comparaison'
    },
    navigation: {
      documentation: 'Documentation',
      features: 'Fonctionnalités',
      pricing: 'Tarifs',
      contact: 'Contact'
    },
    buttons: {
      joinWaitlist: 'Rejoindre la liste d\'attente'
    }
  },
  pt: {
    hero: {
      title: 'Automatize',
      subtitle: 'mais rápido do que nunca',
      badge: 'A alternativa premium a outras plataformas',
      description: 'Crie workflows visuais com IA, integre suas ferramentas e implante em minutos. Design moderno, feedback instantâneo e uma experiência superior a outras plataformas.',
      ctaPrimary: 'Comece grátis',
      ctaSecondary: 'Ver comparação'
    },
    navigation: {
      documentation: 'Documentação',
      features: 'Recursos',
      pricing: 'Preços',
      contact: 'Contato'
    },
    buttons: {
      joinWaitlist: 'Entrar na lista de espera'
    }
  }
}

export function SimpleTranslation() {
  const [currentLang, setCurrentLang] = useState('es')
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    // Cargar idioma desde localStorage solo en el cliente
    const savedLang = localStorage.getItem('preferred-language')
    if (savedLang && translations[savedLang as keyof typeof translations]) {
      setCurrentLang(savedLang)
    }
  }, [])

  const changeLanguage = (lang: string) => {
    setCurrentLang(lang)
    if (typeof window !== 'undefined') {
      localStorage.setItem('preferred-language', lang)
    }
  }

  const t = (key: string, fallback?: string) => {
    const keys = key.split('.')
    let value: any = translations[currentLang as keyof typeof translations]
    
    for (const k of keys) {
      value = value?.[k]
    }
    
    return value || fallback || key
  }

  const languages = [
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'pt', name: 'Português', flag: '🇧🇷' },
  ]

  return (
    <Card className="w-full max-w-4xl mx-auto mb-8">
      <CardHeader>
        <CardTitle>Traducciones Simples - Idioma: {currentLang.toUpperCase()}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Botones de idioma */}
        <div className="flex gap-2 flex-wrap">
          {languages.map((lang) => (
            <Button
              key={lang.code}
              variant={currentLang === lang.code ? "default" : "outline"}
              size="sm"
              onClick={() => changeLanguage(lang.code)}
            >
              {lang.flag} {lang.name}
            </Button>
          ))}
        </div>

        {/* Traducciones de prueba */}
        <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-bold">Traducciones del Hero:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="font-medium">Título:</div>
              <div className="text-lg font-bold">{t('hero.title')}</div>
            </div>
            <div>
              <div className="font-medium">Subtítulo:</div>
              <div className="text-lg">{t('hero.subtitle')}</div>
            </div>
            <div>
              <div className="font-medium">Badge:</div>
              <div className="text-sm text-gray-600">{t('hero.badge')}</div>
            </div>
            <div>
              <div className="font-medium">CTA Primario:</div>
              <div className="text-sm">{t('hero.ctaPrimary')}</div>
            </div>
          </div>
          <div>
            <div className="font-medium">Descripción:</div>
            <div className="text-sm text-gray-700">{t('hero.description')}</div>
          </div>
        </div>

        {/* Información de debug */}
        <div className="text-xs text-gray-500 p-2 bg-blue-50 rounded">
          <div>Idioma actual: {currentLang}</div>
          <div>localStorage: {isClient ? localStorage.getItem('preferred-language') || 'N/A' : 'N/A'}</div>
        </div>
      </CardContent>
    </Card>
  )
}
