'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

// Traducciones completas
const translations = {
  es: {
    common: {
      app: {
        name: 'Stack21',
        slogan: 'Automatiza tu negocio con IA'
      },
      navigation: {
        dashboard: 'Dashboard',
        workspaces: 'Workspaces',
        projects: 'Proyectos',
        workflows: 'Workflows',
        aiAssistant: 'Asistente IA',
        analytics: 'Analytics',
        billing: 'Facturación',
        settings: 'Configuración',
        support: 'Soporte',
        logout: 'Cerrar Sesión',
        members: 'Miembros',
        aiAssistantByIndustry: 'Asistente IA por Industria',
        workflowBuilder: 'Constructor Workflows',
        workflowCopilot: 'Copilot de Workflows',
        marketplace: 'Marketplace',
        smartDashboard: 'Dashboard Inteligente',
        gamification: 'Gamificación',
        businessIntelligence: 'Inteligencia de Negocio',
        integrations: 'Integraciones',
        documentation: 'Documentación',
        audit: 'Auditoría',
        webhooks: 'Webhooks',
        pricing: 'Precios',
        whiteLabel: 'White-Label'
      },
      buttons: {
        save: 'Guardar',
        cancel: 'Cancelar',
        delete: 'Eliminar',
        confirm: 'Confirmar',
        back: 'Volver',
        next: 'Siguiente',
        getStarted: 'Empezar',
        learnMore: 'Saber más',
        joinWaitlist: 'Unirse a la lista de espera'
      },
      messages: {
        success: 'Éxito',
        error: 'Error',
        loading: 'Cargando...',
        noData: 'No hay datos disponibles',
        confirmDelete: '¿Estás seguro de que quieres eliminar esto?'
      }
    },
    landing: {
      hero: {
        badge: 'La alternativa premium a otras plataformas',
        title: 'Automatiza',
        subtitle: 'más rápido que nunca',
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
    dashboard: {
      welcome: '¡Bienvenido a Stack21!',
      welcomeMessage: 'Tu plataforma de automatización está lista para usar',
      overview: 'Resumen',
      recentActivity: 'Actividad Reciente',
      quickActions: 'Acciones Rápidas',
      actionExecuted: 'Acción ejecutada',
      actionCompleted: 'se ha completado exitosamente',
      workflowStarted: 'Workflow iniciado',
      workflowRunning: 'Tu automatización está ejecutándose en segundo plano',
      viewProgress: 'Ver progreso'
    },
    auth: {
      signin: {
        title: 'Iniciar Sesión',
        subtitle: 'Accede a tu cuenta de Stack21',
        welcome: 'Bienvenido',
        description: 'Ingresa cualquier email y contraseña para acceder',
        email: 'Correo electrónico',
        emailPlaceholder: 'tu@email.com',
        password: 'Contraseña',
        passwordPlaceholder: 'Cualquier contraseña',
        signInButton: 'Acceder al Dashboard',
        signingIn: 'Iniciando sesión...',
        devMode: 'Modo desarrollo - No se valida la autenticación',
        trouble: '¿Problemas?',
        backToHome: 'Volver al inicio'
      }
    }
  },
  en: {
    common: {
      app: {
        name: 'Stack21',
        slogan: 'Automate your business with AI'
      },
      navigation: {
        dashboard: 'Dashboard',
        workspaces: 'Workspaces',
        projects: 'Projects',
        workflows: 'Workflows',
        aiAssistant: 'AI Assistant',
        analytics: 'Analytics',
        billing: 'Billing',
        settings: 'Settings',
        support: 'Support',
        logout: 'Sign Out',
        members: 'Members',
        aiAssistantByIndustry: 'Industry AI Assistant',
        workflowBuilder: 'Workflow Builder',
        workflowCopilot: 'Workflow Copilot',
        marketplace: 'Marketplace',
        smartDashboard: 'Smart Dashboard',
        gamification: 'Gamification',
        businessIntelligence: 'Business Intelligence',
        integrations: 'Integrations',
        documentation: 'Documentation',
        audit: 'Audit',
        webhooks: 'Webhooks',
        pricing: 'Pricing',
        whiteLabel: 'White-Label'
      },
      buttons: {
        save: 'Save',
        cancel: 'Cancel',
        delete: 'Delete',
        confirm: 'Confirm',
        back: 'Back',
        next: 'Next',
        getStarted: 'Get Started',
        learnMore: 'Learn More',
        joinWaitlist: 'Join Waitlist'
      },
      messages: {
        success: 'Success',
        error: 'Error',
        loading: 'Loading...',
        noData: 'No data available',
        confirmDelete: 'Are you sure you want to delete this?'
      }
    },
    landing: {
      hero: {
        badge: 'The premium alternative to other platforms',
        title: 'Automate',
        subtitle: 'faster than ever',
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
    dashboard: {
      welcome: 'Welcome to Stack21!',
      welcomeMessage: 'Your automation platform is ready to use',
      overview: 'Overview',
      recentActivity: 'Recent Activity',
      quickActions: 'Quick Actions',
      actionExecuted: 'Action executed',
      actionCompleted: 'has been completed successfully',
      workflowStarted: 'Workflow started',
      workflowRunning: 'Your automation is running in the background',
      viewProgress: 'View progress'
    },
    auth: {
      signin: {
        title: 'Sign In',
        subtitle: 'Access your Stack21 account',
        welcome: 'Welcome',
        description: 'Enter any email and password to access',
        email: 'Email',
        emailPlaceholder: 'your@email.com',
        password: 'Password',
        passwordPlaceholder: 'Any password',
        signInButton: 'Access Dashboard',
        signingIn: 'Signing in...',
        devMode: 'Development mode - No authentication validation',
        trouble: 'Trouble?',
        backToHome: 'Back to home'
      }
    }
  },
  de: {
    common: {
      app: {
        name: 'Stack21',
        slogan: 'Automatisieren Sie Ihr Geschäft mit KI'
      },
      navigation: {
        dashboard: 'Dashboard',
        workspaces: 'Arbeitsbereiche',
        projects: 'Projekte',
        workflows: 'Arbeitsabläufe',
        aiAssistant: 'KI-Assistent',
        analytics: 'Analytics',
        billing: 'Abrechnung',
        settings: 'Einstellungen',
        support: 'Support',
        logout: 'Abmelden',
        members: 'Mitglieder',
        aiAssistantByIndustry: 'Branchen-KI-Assistent',
        workflowBuilder: 'Workflow-Builder',
        workflowCopilot: 'Workflow-Copilot',
        marketplace: 'Marktplatz',
        smartDashboard: 'Intelligentes Dashboard',
        gamification: 'Gamifizierung',
        businessIntelligence: 'Business Intelligence',
        integrations: 'Integrationen',
        documentation: 'Dokumentation',
        audit: 'Audit',
        webhooks: 'Webhooks',
        pricing: 'Preise',
        whiteLabel: 'White-Label'
      },
      buttons: {
        save: 'Speichern',
        cancel: 'Abbrechen',
        delete: 'Löschen',
        confirm: 'Bestätigen',
        back: 'Zurück',
        next: 'Weiter',
        getStarted: 'Loslegen',
        learnMore: 'Mehr erfahren',
        joinWaitlist: 'Warteliste beitreten'
      },
      messages: {
        success: 'Erfolg',
        error: 'Fehler',
        loading: 'Wird geladen...',
        noData: 'Keine Daten verfügbar',
        confirmDelete: 'Sind Sie sicher, dass Sie dies löschen möchten?'
      }
    },
    landing: {
      hero: {
        badge: 'Die Premium-Alternative zu anderen Plattformen',
        title: 'Automatisieren',
        subtitle: 'schneller als je zuvor',
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
    dashboard: {
      welcome: 'Willkommen bei Stack21!',
      welcomeMessage: 'Ihre Automatisierungsplattform ist bereit zur Nutzung',
      overview: 'Übersicht',
      recentActivity: 'Letzte Aktivität',
      quickActions: 'Schnellaktionen',
      actionExecuted: 'Aktion ausgeführt',
      actionCompleted: 'wurde erfolgreich abgeschlossen',
      workflowStarted: 'Workflow gestartet',
      workflowRunning: 'Ihre Automatisierung läuft im Hintergrund',
      viewProgress: 'Fortschritt anzeigen'
    },
    auth: {
      signin: {
        title: 'Anmelden',
        subtitle: 'Greifen Sie auf Ihr Stack21-Konto zu',
        welcome: 'Willkommen',
        description: 'Geben Sie eine beliebige E-Mail und ein Passwort ein, um zuzugreifen',
        email: 'E-Mail',
        emailPlaceholder: 'ihre@email.com',
        password: 'Passwort',
        passwordPlaceholder: 'Beliebiges Passwort',
        signInButton: 'Zum Dashboard zugreifen',
        signingIn: 'Anmelden...',
        devMode: 'Entwicklungsmodus - Keine Authentifizierung validiert',
        trouble: 'Probleme?',
        backToHome: 'Zurück zur Startseite'
      }
    }
  }
}

interface TranslationContextType {
  currentLanguage: string
  changeLanguage: (lang: string) => void
  t: (key: string, fallback?: string) => string
  getAvailableLanguages: () => Array<{ code: string; name: string; flag: string }>
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined)

export function TranslationProvider({ children }: { children: React.ReactNode }) {
  const [currentLanguage, setCurrentLanguage] = useState('es')
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    // Cargar idioma desde localStorage solo en el cliente
    const savedLang = localStorage.getItem('preferred-language')
    if (savedLang && translations[savedLang as keyof typeof translations]) {
      setCurrentLanguage(savedLang)
    }
  }, [])

  const changeLanguage = (lang: string) => {
    setCurrentLanguage(lang)
    if (typeof window !== 'undefined') {
      localStorage.setItem('preferred-language', lang)
    }
  }

  const t = (key: string, fallback?: string) => {
    const keys = key.split('.')
    let value: any = translations[currentLanguage as keyof typeof translations]
    
    for (const k of keys) {
      value = value?.[k]
    }
    
    return value || fallback || key
  }

  const getAvailableLanguages = () => [
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'pt', name: 'Português', flag: '🇧🇷' },
  ]

  return (
    <TranslationContext.Provider value={{
      currentLanguage,
      changeLanguage,
      t,
      getAvailableLanguages
    }}>
      {children}
    </TranslationContext.Provider>
  )
}

export function useTranslation(namespace?: string) {
  const context = useContext(TranslationContext)
  if (context === undefined) {
    throw new Error('useTranslation must be used within a TranslationProvider')
  }
  
  return {
    t: context.t,
    changeLanguage: context.changeLanguage,
    getCurrentLanguage: () => context.currentLanguage,
    getAvailableLanguages: context.getAvailableLanguages,
    isReady: true
  }
}
