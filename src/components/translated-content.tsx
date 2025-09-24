'use client'

import { useTranslation } from '@/contexts/translation-context'
import { Sparkles, Rocket, ArrowRight, Play } from 'lucide-react'

export function TranslatedContent() {
  const { t, getCurrentLanguage } = useTranslation()

  // Si no está en el cliente, mostrar contenido por defecto
  if (typeof window === 'undefined') {
    return (
      <div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
          <span className="bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">Automatiza</span> más rápido que nunca
        </h1>
        <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-xl">
          Crea workflows visuales con IA, integra tus herramientas y despliega en minutos. Diseño moderno, feedback inmediato y una experiencia superior a otras plataformas.
        </p>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
        <span className="bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
          {t('landing.hero.title', 'Automatiza')}
        </span> {t('landing.hero.subtitle', 'más rápido que nunca')}
      </h1>
      <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-xl">
        {t('landing.hero.description', 'Crea workflows visuales con IA, integra tus herramientas y despliega en minutos. Diseño moderno, feedback inmediato y una experiencia superior a otras plataformas.')}
      </p>
    </div>
  )
}

export function TranslatedBadge() {
  const { t } = useTranslation()

  if (typeof window === 'undefined') {
    return (
      <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 text-purple-300 text-sm font-medium mb-6">
        <Sparkles className="w-4 h-4 mr-2" />
        La alternativa premium a otras plataformas
      </div>
    )
  }

  return (
    <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 text-purple-300 text-sm font-medium mb-6">
      <Sparkles className="w-4 h-4 mr-2" />
      {t('landing.hero.badge', 'La alternativa premium a otras plataformas')}
    </div>
  )
}

export function TranslatedButtons() {
  const { t } = useTranslation()

  if (typeof window === 'undefined') {
    return (
      <div className="flex flex-col sm:flex-row gap-4">
        <button className="group text-lg px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold rounded-xl shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105">
          <Rocket className="h-5 w-5 mr-2 group-hover:rotate-12 transition-transform duration-300" />
          Empezar gratis
          <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
        </button>
        <button className="group text-lg px-8 py-4 border-white/30 text-white hover:bg-white/10 rounded-xl transition-all duration-300 hover:scale-105">
          <Play className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
          Ver comparativa
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <button className="group text-lg px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold rounded-xl shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105">
        <Rocket className="h-5 w-5 mr-2 group-hover:rotate-12 transition-transform duration-300" />
        {t('landing.hero.ctaPrimary', 'Empezar gratis')}
        <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
      </button>
      <button className="group text-lg px-8 py-4 border-white/30 text-white hover:bg-white/10 rounded-xl transition-all duration-300 hover:scale-105">
        <Play className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
        {t('landing.hero.ctaSecondary', 'Ver comparativa')}
      </button>
    </div>
  )
}

export function TranslatedStats() {
  const { t } = useTranslation()

  if (typeof window === 'undefined') {
    return (
      <div className="grid grid-cols-3 gap-6 mt-8">
        <div className="text-center">
          <div className="text-2xl font-bold text-white mb-1">45 min</div>
          <div className="text-sm text-gray-400">Setup</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-white mb-1">300+</div>
          <div className="text-sm text-gray-400">Integraciones</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-white mb-1">∞</div>
          <div className="text-sm text-gray-400">Escala</div>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-3 gap-6 mt-8">
      <div className="text-center">
        <div className="text-2xl font-bold text-white mb-1">{t('landing.hero.statsSetup', '45 min')}</div>
        <div className="text-sm text-gray-400">{t('landing.hero.statsSetupLabel', 'Setup')}</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-white mb-1">{t('landing.hero.statsIntegrations', '300+')}</div>
        <div className="text-sm text-gray-400">{t('landing.hero.statsIntegrationsLabel', 'Integraciones')}</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-white mb-1">{t('landing.hero.statsScale', '∞')}</div>
        <div className="text-sm text-gray-400">{t('landing.hero.statsScaleLabel', 'Escala')}</div>
      </div>
    </div>
  )
}
