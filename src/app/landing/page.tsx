'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Clock, Shield, Zap, ArrowRight, Brain, Target, Users, Sparkles, Play, CheckCircle, Star, TrendingUp, Globe, Rocket } from 'lucide-react'
import { useContext } from 'react'
import { I18nContext } from '@/lib/i18n'
import { Stack21Advantages } from '@/components/stack21-advantages'
import { UniqueFeatures } from '@/components/unique-features'

export default function LandingPage() {
  const { t } = useContext(I18nContext)
  const [showWaitlist, setShowWaitlist] = useState(false)

  return (
    <div className="min-h-screen overflow-hidden relative bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900" role="main">
      {/* Enhanced Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating orbs with enhanced animations */}
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-pulse delay-1000"></div>
        <div className="absolute top-40 left-1/2 w-96 h-96 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-pulse delay-2000"></div>
        <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full mix-blend-multiply filter blur-2xl opacity-40 animate-pulse delay-3000"></div>
        
        {/* Animated grid pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)`,
            backgroundSize: '50px 50px',
            animation: 'grid-move 20s linear infinite'
          }}></div>
        </div>
        
        {/* Floating particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full opacity-30"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 2}s`
              }}
            ></div>
          ))}
        </div>
      </div>

      {/* Header */}
      <header className="relative border-b border-white/5 bg-black/30 backdrop-blur-md">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 group">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg border-gradient">
                <Zap className="h-7 w-7 text-white" />
              </div>
              <span className="text-3xl font-bold text-white bg-gradient-to-r from-violet-200 to-amber-200 bg-clip-text text-transparent tracking-tight">{t('app_title')}</span>
            </div>
            <div className="flex items-center space-x-4">
                {/* <SimpleLanguageSelector /> */}
              <Button
                variant="ghost"
                className="text-white hover:bg-white/10 transition-all duration-300"
              >
                {t('documentation')}
              </Button>
              <Button
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10 transition-all duration-300 hover:scale-105"
                onClick={() => setShowWaitlist(true)}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                {t('join_waitlist')}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Enhanced Hero Section */}
      <section className="relative py-28">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left: Copy + CTAs */}
            <div className="relative z-10">
                <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 text-purple-300 text-sm font-medium mb-8 backdrop-blur-sm hover:scale-105 transition-transform duration-300">
                  <Sparkles className="w-5 h-5 mr-3 animate-pulse" />
                  <span className="bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent font-semibold">
                    {t('premium_badge')}
                  </span>
                </div>
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-8 leading-tight tracking-tight">
                <span className="bg-gradient-to-r from-violet-200 to-amber-200 bg-clip-text text-transparent">
                  {t('automate')}
                </span>
                <br />
                <span className="bg-gradient-to-r from-slate-100 to-slate-300 bg-clip-text text-transparent">
                  {t('faster')}
                </span>
                <br />
                <span className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl bg-gradient-to-r from-violet-200 to-amber-200 bg-clip-text text-transparent">
                  {t('than_ever')}
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-2xl leading-relaxed">{t('hero_subtitle')}</p>
              <div className="flex flex-col sm:flex-row gap-6">
              <Button
                size="lg"
                className="group relative text-xl px-12 py-6 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white font-bold rounded-2xl shadow-2xl hover:shadow-purple-500/50 transition-all duration-500 transform hover:scale-110 overflow-hidden"
                onClick={() => setShowWaitlist(true)}
                aria-label="Empezar gratis con Stack21"
              >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <Rocket className="h-6 w-6 mr-3 group-hover:rotate-12 transition-transform duration-300" />
                  <span className="relative z-10">Empezar gratis</span>
                  <ArrowRight className="h-6 w-6 ml-3 group-hover:translate-x-2 transition-transform duration-300" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="group text-xl px-12 py-6 border-2 border-white/40 text-white hover:bg-white/20 hover:border-white/60 rounded-2xl transition-all duration-500 hover:scale-105 backdrop-blur-sm"
                  onClick={() => setShowWaitlist(true)}
                >
                  <Play className="h-6 w-6 mr-3 group-hover:scale-125 transition-transform duration-300" />
                  <span className="font-semibold">Ver comparativa</span>
                </Button>
              </div>
              <div className="grid grid-cols-3 gap-8 mt-12">
                <div className="text-center group">
                  <div className="relative">
                    <div className="text-4xl font-bold text-white mb-2 group-hover:scale-110 transition-transform duration-300">
                      <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">45</span>
                      <span className="text-2xl text-gray-300">min</span>
                    </div>
                    <div className="absolute -top-2 -right-2 w-3 h-3 bg-green-400 rounded-full animate-ping"></div>
                  </div>
                  <div className="text-sm text-gray-400 font-medium">Setup</div>
                </div>
                <div className="text-center group">
                  <div className="relative">
                    <div className="text-4xl font-bold text-white mb-2 group-hover:scale-110 transition-transform duration-300">
                      <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">300+</span>
                    </div>
                    <div className="absolute -top-2 -right-2 w-3 h-3 bg-blue-400 rounded-full animate-ping delay-1000"></div>
                  </div>
                  <div className="text-sm text-gray-400 font-medium">Integraciones</div>
                </div>
                <div className="text-center group">
                  <div className="relative">
                    <div className="text-4xl font-bold text-white mb-2 group-hover:scale-110 transition-transform duration-300">
                      <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">∞</span>
                    </div>
                    <div className="absolute -top-2 -right-2 w-3 h-3 bg-purple-400 rounded-full animate-ping delay-2000"></div>
                  </div>
                  <div className="text-sm text-gray-400 font-medium">Escala</div>
                </div>
              </div>
            </div>

            {/* Right: Enhanced Feature Grid */}
            <div className="relative">
              <div className="relative glass-surface border-gradient rounded-3xl p-10 shadow-2xl overflow-hidden">
                {/* Animated background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-pink-500/10 animate-pulse"></div>
                
                <div className="relative z-10 grid grid-cols-3 gap-6">
                  {[
                    { icon: Brain, label: "IA", gradient: "from-blue-500/30 to-purple-500/30", iconColor: "text-blue-400", glow: "shadow-blue-500/20" },
                    { icon: Zap, label: "Auto", gradient: "from-green-500/30 to-blue-500/30", iconColor: "text-green-400", glow: "shadow-green-500/20" },
                    { icon: Users, label: "Team", gradient: "from-purple-500/30 to-pink-500/30", iconColor: "text-purple-400", glow: "shadow-purple-500/20" },
                    { icon: Target, label: "Goal", gradient: "from-orange-500/30 to-red-500/30", iconColor: "text-orange-400", glow: "shadow-orange-500/20" },
                    { icon: Globe, label: "API", gradient: "from-cyan-500/30 to-blue-500/30", iconColor: "text-cyan-400", glow: "shadow-cyan-500/20" },
                    { icon: Shield, label: "Secure", gradient: "from-emerald-500/30 to-green-500/30", iconColor: "text-emerald-400", glow: "shadow-emerald-500/20" },
                    { icon: TrendingUp, label: "Scale", gradient: "from-indigo-500/30 to-purple-500/30", iconColor: "text-indigo-400", glow: "shadow-indigo-500/20" },
                    { icon: Clock, label: "Real-time", gradient: "from-pink-500/30 to-rose-500/30", iconColor: "text-pink-400", glow: "shadow-pink-500/20" },
                    { icon: Sparkles, label: "Magic", gradient: "from-yellow-500/30 to-orange-500/30", iconColor: "text-yellow-400", glow: "shadow-yellow-500/20" }
                  ].map((item, index) => (
                    <div
                      key={index}
                      className={`group relative bg-gradient-to-br ${item.gradient} rounded-2xl p-6 text-center hover:scale-110 hover:rotate-2 transition-all duration-500 cursor-pointer border border-white/10 hover:border-white/30 ${item.glow} hover:shadow-2xl`}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <item.icon className={`h-10 w-10 ${item.iconColor} mx-auto mb-3 group-hover:scale-125 transition-transform duration-300`} />
                      <div className="text-white font-bold text-sm group-hover:text-yellow-300 transition-colors duration-300">{item.label}</div>
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-white/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                  ))}
                </div>
                
                <div className="relative z-10 mt-8 text-center">
                  <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-purple-500/30 to-pink-500/30 text-purple-200 text-sm font-semibold border border-purple-400/30 backdrop-blur-sm hover:scale-105 transition-transform duration-300">
                    <Sparkles className="h-4 w-4 mr-2 animate-pulse" />
                    IA asistiendo tu flujo
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem/Solution Section */}
      <section className="relative py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              ¿Cansado de <span className="bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">automatizaciones complejas</span>?
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              La mayoría de las plataformas de automatización son lentas, difíciles de usar y requieren conocimientos técnicos avanzados.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Problems */}
            <div className="space-y-8">
              <h3 className="text-2xl font-bold text-red-400 mb-6">❌ Problemas comunes:</h3>
              <div className="space-y-4">
                {[
                  { icon: "⏰", text: "Configuración que toma días o semanas", color: "text-red-300" },
                  { icon: "🔧", text: "Interfaz compleja y difícil de usar", color: "text-red-300" },
                  { icon: "💰", text: "Precios ocultos y facturación confusa", color: "text-red-300" },
                  { icon: "🔒", text: "Limitaciones de escalabilidad", color: "text-red-300" },
                  { icon: "🤖", text: "IA limitada o inexistente", color: "text-red-300" },
                  { icon: "📞", text: "Soporte lento o inexistente", color: "text-red-300" }
                ].map((problem, index) => (
                  <div key={index} className="flex items-center space-x-4 p-4 bg-red-500/10 rounded-xl border border-red-500/20">
                    <span className="text-2xl">{problem.icon}</span>
                    <span className={`${problem.color} font-medium`}>{problem.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Solutions */}
            <div className="space-y-8">
              <h3 className="text-2xl font-bold text-green-400 mb-6">✅ Solución Stack21:</h3>
              <div className="space-y-4">
                {[
                  { icon: "⚡", text: "Setup en 45 minutos, no días", color: "text-green-300" },
                  { icon: "🎨", text: "Interfaz intuitiva y moderna", color: "text-green-300" },
                  { icon: "💎", text: "Precios transparentes y claros", color: "text-green-300" },
                  { icon: "🚀", text: "Escalabilidad infinita", color: "text-green-300" },
                  { icon: "🧠", text: "IA avanzada integrada", color: "text-green-300" },
                  { icon: "🎯", text: "Soporte 24/7 premium", color: "text-green-300" }
                ].map((solution, index) => (
                  <div key={index} className="flex items-center space-x-4 p-4 bg-green-500/10 rounded-xl border border-green-500/20">
                    <span className="text-2xl">{solution.icon}</span>
                    <span className={`${solution.color} font-medium`}>{solution.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="text-center mt-16">
                <div className="inline-flex items-center px-8 py-4 glass-surface border-gradient rounded-2xl">
              <span className="text-2xl mr-3">🎯</span>
              <span className="text-white font-semibold text-lg">
                Stack21 resuelve todos estos problemas con una solución elegante y potente
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section className="relative py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ve <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Stack21 en acción</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Crea workflows complejos en minutos, no horas. Mira cómo nuestra IA te ayuda en cada paso.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Demo Video/Image */}
            <div className="relative">
              <div className="relative glass-surface border-gradient rounded-3xl p-8 shadow-2xl">
                <div className="aspect-video bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl flex items-center justify-center border border-white/10">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                      <Play className="w-8 h-8 text-white ml-1" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">Demo Interactivo</h3>
                    <p className="text-gray-400">Haz clic para ver Stack21 en acción</p>
                  </div>
                </div>
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">▶</span>
                </div>
              </div>
            </div>

            {/* Features Highlight */}
            <div className="space-y-8">
              <h3 className="text-3xl font-bold text-white mb-6">¿Qué verás en el demo?</h3>
              <div className="space-y-6">
                {[
                  { 
                    icon: "🎨", 
                    title: "Builder Visual Intuitivo", 
                    description: "Arrastra y suelta nodos para crear workflows complejos en segundos",
                    color: "from-blue-500/20 to-cyan-500/20"
                  },
                  { 
                    icon: "🤖", 
                    title: "IA Asistente Inteligente", 
                    description: "Nuestra IA sugiere conexiones y optimiza automáticamente tu workflow",
                    color: "from-purple-500/20 to-pink-500/20"
                  },
                  { 
                    icon: "⚡", 
                    title: "Ejecución en Tiempo Real", 
                    description: "Ve los resultados instantáneamente con logs detallados y métricas",
                    color: "from-green-500/20 to-emerald-500/20"
                  },
                  { 
                    icon: "🔗", 
                    title: "300+ Integraciones", 
                    description: "Conecta con todas tus herramientas favoritas sin código",
                    color: "from-orange-500/20 to-red-500/20"
                  }
                ].map((feature, index) => (
                  <div key={index} className={`p-6 glass-surface border-gradient rounded-2xl hover:scale-105 transition-transform duration-300`}>
                    <div className="flex items-start space-x-4">
                      <span className="text-3xl">{feature.icon}</span>
                      <div>
                        <h4 className="text-xl font-bold text-white mb-2">{feature.title}</h4>
                        <p className="text-gray-300">{feature.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="text-center mt-16">
            <Button
              size="lg"
              className="group text-xl px-12 py-6 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white font-bold rounded-2xl shadow-2xl hover:shadow-purple-500/50 transition-all duration-500 transform hover:scale-110"
              onClick={() => setShowWaitlist(true)}
            >
              <Play className="h-6 w-6 mr-3 group-hover:scale-125 transition-transform duration-300" />
              Ver Demo Completo
              <ArrowRight className="h-6 w-6 ml-3 group-hover:translate-x-2 transition-transform duration-300" />
            </Button>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="relative py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Precios <span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">transparentes</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Sin sorpresas, sin costos ocultos. Elige el plan que mejor se adapte a tu negocio.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Freemium Plan */}
            <div className="glass-surface border-gradient rounded-3xl p-8 hover:scale-105 transition-transform duration-300">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">Freemium</h3>
                <p className="text-gray-400 mb-4">Perfecto para empezar</p>
                <div className="text-4xl font-bold text-white mb-2">$0</div>
                <p className="text-gray-400">/mes</p>
              </div>
              <ul className="space-y-4 mb-8">
                {[
                  "5 workflows activos",
                  "100 ejecuciones/mes",
                  "Integraciones básicas",
                  "Soporte por email",
                  "Templates gratuitos"
                ].map((feature, index) => (
                  <li key={index} className="flex items-center space-x-3">
                    <span className="text-green-400">✓</span>
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button 
                className="w-full bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-semibold py-3 rounded-xl"
                onClick={() => setShowWaitlist(true)}
              >
                Empezar gratis
              </Button>
            </div>

            {/* Growth Plan - Featured */}
            <div className="glass-surface border-gradient rounded-3xl p-8 hover:scale-105 transition-transform duration-300 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 rounded-full text-sm font-semibold">
                  Más Popular
                </div>
              </div>
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">Growth</h3>
                <p className="text-gray-400 mb-4">Para equipos en crecimiento</p>
                <div className="text-4xl font-bold text-white mb-2">$29</div>
                <p className="text-gray-400">/mes</p>
              </div>
              <ul className="space-y-4 mb-8">
                {[
                  "Workflows ilimitados",
                  "1,000 ejecuciones/mes",
                  "Todas las integraciones",
                  "IA avanzada incluida",
                  "Soporte prioritario 24/7",
                  "Analytics avanzados",
                  "White-label básico"
                ].map((feature, index) => (
                  <li key={index} className="flex items-center space-x-3">
                    <span className="text-blue-400">✓</span>
                    <span className="text-white font-medium">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button 
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold py-3 rounded-xl"
                onClick={() => setShowWaitlist(true)}
              >
                Empezar ahora
              </Button>
            </div>

            {/* Enterprise Plan */}
            <div className="glass-surface border-gradient rounded-3xl p-8 hover:scale-105 transition-transform duration-300">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">Enterprise</h3>
                <p className="text-gray-400 mb-4">Para grandes organizaciones</p>
                <div className="text-4xl font-bold text-white mb-2">$99</div>
                <p className="text-gray-400">/mes</p>
              </div>
              <ul className="space-y-4 mb-8">
                {[
                  "Todo de Growth",
                  "Ejecuciones ilimitadas",
                  "White-label completo",
                  "API personalizada",
                  "Soporte dedicado",
                  "SLA garantizado",
                  "On-premise disponible"
                ].map((feature, index) => (
                  <li key={index} className="flex items-center space-x-3">
                    <span className="text-purple-400">✓</span>
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button 
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 rounded-xl"
                onClick={() => setShowWaitlist(true)}
              >
                Contactar ventas
              </Button>
            </div>
          </div>

          <div className="text-center mt-16">
            <div className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-2xl border border-green-500/30">
              <span className="text-2xl mr-3">💎</span>
              <span className="text-white font-semibold text-lg">
                Todos los planes incluyen 14 días de prueba gratuita
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Testimonials */}
      <section className="relative py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Lo que dicen nuestros <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">clientes</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Miles de empresas confían en Stack21 para automatizar sus procesos más críticos.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "María González",
                role: "CEO",
                company: "TechStart",
                avatar: "M",
                gradient: "from-blue-500 to-purple-500",
                text: "Stack21 ha revolucionado nuestra automatización. Lo que antes tomaba días, ahora lo hacemos en minutos. La IA integrada es increíble.",
                rating: 5,
                metric: "85% menos tiempo"
              },
              {
                name: "Carlos Ruiz",
                role: "CTO",
                company: "InnovateLab",
                avatar: "C",
                gradient: "from-green-500 to-blue-500",
                text: "La IA integrada es increíble. Sugiere optimizaciones que nunca habríamos pensado. Nuestro equipo es 3x más productivo.",
                rating: 5,
                metric: "300% más productivo"
              },
              {
                name: "Ana Martínez",
                role: "Head of Ops",
                company: "ScaleUp",
                avatar: "A",
                gradient: "from-pink-500 to-rose-500",
                text: "El builder visual es tan intuitivo que cualquier miembro del equipo puede crear workflows complejos. Game changer total.",
                rating: 5,
                metric: "100% adopción"
              },
              {
                name: "David Chen",
                role: "VP Engineering",
                company: "DataFlow",
                avatar: "D",
                gradient: "from-orange-500 to-red-500",
                text: "Las integraciones son perfectas. Conectamos 15 herramientas en un solo workflow. El ROI fue inmediato.",
                rating: 5,
                metric: "15 integraciones"
              },
              {
                name: "Laura Silva",
                role: "Operations Director",
                company: "GrowthCo",
                avatar: "L",
                gradient: "from-purple-500 to-indigo-500",
                text: "El soporte 24/7 es excepcional. Siempre están disponibles cuando los necesitamos. Muy recomendado.",
                rating: 5,
                metric: "24/7 soporte"
              },
              {
                name: "Roberto Vega",
                role: "Founder",
                company: "StartupX",
                avatar: "R",
                gradient: "from-cyan-500 to-teal-500",
                text: "Stack21 nos ayudó a escalar sin contratar más desarrolladores. La automatización es el futuro y ya estamos aquí.",
                rating: 5,
                metric: "0 desarrolladores extra"
              }
            ].map((testimonial, index) => (
              <div key={index} className="glass-surface border-gradient rounded-3xl p-8 hover:scale-105 transition-transform duration-300 group">
                <div className="flex items-center mb-6">
                  <div className={`w-16 h-16 bg-gradient-to-r ${testimonial.gradient} rounded-full flex items-center justify-center text-white font-bold text-xl group-hover:scale-110 transition-transform duration-300`}>
                    {testimonial.avatar}
                  </div>
                  <div className="ml-4">
                    <div className="text-white font-bold text-lg">{testimonial.name}</div>
                    <div className="text-gray-400">{testimonial.role}, {testimonial.company}</div>
                    <div className="flex items-center mt-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <span key={i} className="text-yellow-400 text-lg">★</span>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-300 italic text-lg leading-relaxed mb-4">
                  "{testimonial.text}"
                </p>
                <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-full border border-green-500/30">
                  <span className="text-green-400 font-semibold text-sm">{testimonial.metric}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-16">
            <div className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-2xl border border-yellow-500/30">
              <span className="text-2xl mr-3">⭐</span>
              <span className="text-white font-semibold text-lg">
                4.9/5 estrellas en promedio • 10,000+ empresas confían en nosotros
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="relative py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-xl rounded-2xl p-8 border border-blue-500/30 text-center">
              <div className="text-4xl font-bold text-white mb-2">3x</div>
              <div className="text-blue-300">Time-to-Launch</div>
            </div>
            <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 backdrop-blur-xl rounded-2xl p-8 border border-green-500/30 text-center">
              <div className="text-4xl font-bold text-white mb-2">+22%</div>
              <div className="text-green-300">Conversion</div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="relative py-24 bg-gradient-to-b from-slate-900 to-slate-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Preguntas <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">frecuentes</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Resolvemos las dudas más comunes sobre Stack21.
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
            {[
              {
                question: "¿Cuánto tiempo toma configurar Stack21?",
                answer: "La configuración básica toma solo 45 minutos. Nuestro asistente de IA te guía paso a paso, y puedes tener tu primer workflow funcionando en menos de una hora."
              },
              {
                question: "¿Necesito conocimientos técnicos para usar Stack21?",
                answer: "No, Stack21 está diseñado para ser intuitivo. Nuestra interfaz visual de arrastrar y soltar hace que cualquier persona pueda crear workflows complejos sin código."
              },
              {
                question: "¿Cómo funciona la IA integrada?",
                answer: "Nuestra IA analiza tus workflows y sugiere optimizaciones automáticamente. También puede generar código personalizado, conectar APIs y predecir errores antes de que ocurran."
              },
              {
                question: "¿Stack21 es seguro para datos sensibles?",
                answer: "Absolutamente. Usamos encriptación de extremo a extremo, cumplimos con GDPR y SOC2, y ofrecemos opciones de despliegue on-premise para máxima seguridad."
              },
              {
                question: "¿Puedo integrar Stack21 con mis herramientas actuales?",
                answer: "Sí, Stack21 se integra con más de 300 herramientas populares incluyendo Salesforce, HubSpot, Slack, Google Workspace, Microsoft 365 y muchas más."
              },
              {
                question: "¿Qué pasa si necesito soporte?",
                answer: "Ofrecemos soporte 24/7 por chat, email y teléfono. Nuestro equipo de expertos está disponible para ayudarte en cualquier momento."
              },
              {
                question: "¿Puedo cancelar mi suscripción en cualquier momento?",
                answer: "Sí, puedes cancelar tu suscripción en cualquier momento sin penalizaciones. Tus datos permanecen accesibles durante 30 días después de la cancelación."
              },
              {
                question: "¿Stack21 escala con mi negocio?",
                answer: "Definitivamente. Stack21 está diseñado para escalar desde startups hasta empresas Fortune 500. Nuestros planes Enterprise incluyen capacidades ilimitadas y soporte dedicado."
              }
            ].map((faq, index) => (
              <div key={index} className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 hover:bg-white/10 transition-colors duration-300">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                  <span className="text-blue-400 mr-3">❓</span>
                  {faq.question}
                </h3>
                <p className="text-gray-300 text-lg leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center mt-16">
            <div className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl border border-blue-500/30">
              <span className="text-2xl mr-3">💬</span>
              <span className="text-white font-semibold text-lg">
                ¿Tienes más preguntas? Contáctanos y te ayudamos personalmente
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Ventajas de Stack21 */}
      <Stack21Advantages />
      
      {/* Características Únicas */}
      <UniqueFeatures />

      {/* CTA Final */}
      <section className="relative py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            ¿Listo para revolucionar tu negocio?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Únete a miles de empresas que ya eligieron la plataforma más avanzada del mercado.
          </p>
          <Button
            size="lg"
            className="text-xl px-12 py-4 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold rounded-xl shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105"
            onClick={() => setShowWaitlist(true)}
          >
            <Rocket className="h-6 w-6 mr-3" />
            Empezar ahora
            <ArrowRight className="h-6 w-6 ml-3" />
          </Button>
        </div>
      </section>


      {/* Waitlist Modal */}
      {showWaitlist && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowWaitlist(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="waitlist-title"
        >
          <div 
            className="bg-white rounded-2xl p-8 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 id="waitlist-title" className="text-2xl font-bold text-gray-900 mb-4">Únete a la lista de espera</h3>
            <p className="text-gray-600 mb-6">
              Sé el primero en conocer las nuevas características y obtener acceso prioritario.
            </p>
            <div className="space-y-4">
              <input
                type="email"
                placeholder="Tu email"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                aria-label="Dirección de correo electrónico"
                required
              />
              <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold py-3 rounded-xl">
                Unirse a la lista
              </Button>
            </div>
            <Button
              variant="ghost"
              className="w-full mt-4"
              onClick={() => setShowWaitlist(false)}
            >
              Cancelar
            </Button>
          </div>
        </div>
      )}

      {/* Custom CSS Animations */}
      <style jsx>{`
        @keyframes grid-move {
          0% { transform: translate(0, 0); }
          100% { transform: translate(-50%, -50%); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes blob {
          0% { transform: scale(1) translate(0, 0); }
          33% { transform: scale(1.1) translate(30px, -20px); }
          66% { transform: scale(0.9) translate(-20px, 40px); }
          100% { transform: scale(1) translate(0, 0); }
        }
        .animate-blob {
          animation: blob 10s infinite ease-in-out;
        }
        .grid-background {
          background-size: 100px 100px;
          background-image: linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px);
          animation: grid-move 60s linear infinite;
        }
      `}</style>
    </div>
  )
}