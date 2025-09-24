'use client'

import { useState, useEffect } from 'react'

// Traducciones directas
const translations = {
  es: {
    hero: {
      title: 'Automatiza',
      subtitle: 'más rápido que nunca',
      badge: 'La alternativa premium a otras plataformas',
      description: 'Crea workflows visuales con IA, integra tus herramientas y despliega en minutos. Diseño moderno, feedback inmediato y una experiencia superior a otras plataformas.',
      ctaPrimary: 'Empezar gratis',
      ctaSecondary: 'Ver comparativa',
      statsSetup: '45 min',
      statsIntegrations: '300+',
      statsScale: '∞',
      statsSetupLabel: 'Setup',
      statsIntegrationsLabel: 'Integraciones',
      statsScaleLabel: 'Escala'
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
      ctaSecondary: 'View comparison',
      statsSetup: '45 min',
      statsIntegrations: '300+',
      statsScale: '∞',
      statsSetupLabel: 'Setup',
      statsIntegrationsLabel: 'Integrations',
      statsScaleLabel: 'Scale'
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
      ctaSecondary: 'Vergleich anzeigen',
      statsSetup: '45 min',
      statsIntegrations: '300+',
      statsScale: '∞',
      statsSetupLabel: 'Einrichtung',
      statsIntegrationsLabel: 'Integrationen',
      statsScaleLabel: 'Skalierung'
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
      ctaSecondary: 'Voir la comparaison',
      statsSetup: '45 min',
      statsIntegrations: '300+',
      statsScale: '∞',
      statsSetupLabel: 'Configuration',
      statsIntegrationsLabel: 'Intégrations',
      statsScaleLabel: 'Échelle'
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
      ctaSecondary: 'Ver comparação',
      statsSetup: '45 min',
      statsIntegrations: '300+',
      statsScale: '∞',
      statsSetupLabel: 'Configuração',
      statsIntegrationsLabel: 'Integrações',
      statsScaleLabel: 'Escala'
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

export function useSimpleTranslation() {
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
    localStorage.setItem('preferred-language', lang)
  }

  const t = (key: string, fallback?: string) => {
    const keys = key.split('.')
    let value: any = translations[currentLang as keyof typeof translations]
    
    for (const k of keys) {
      value = value?.[k]
    }
    
    return value || fallback || key
  }

  const getCurrentLanguage = () => currentLang

  const getAvailableLanguages = () => [
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'pt', name: 'Português', flag: '🇧🇷' },
  ]

  return {
    t,
    changeLanguage,
    getCurrentLanguage,
    getAvailableLanguages,
    isReady: true
  }
}
