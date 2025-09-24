'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Clock, Shield, Zap, ArrowRight, Brain, Target, Users, Sparkles, Play, CheckCircle, Star, TrendingUp, Globe, Rocket } from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'
import { LanguageSelector } from '@/components/ui/language-selector'
import { SimpleTranslation } from '@/components/simple-translation'
import { TranslatedContent, TranslatedBadge, TranslatedButtons, TranslatedStats } from '@/components/translated-content'

export default function LandingPage() {
  const { t } = useTranslation('landing')
  const [showWaitlist, setShowWaitlist] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const [mouse, setMouse] = useState({ x: 50, y: 50 })
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setMouse({ x, y })
    e.currentTarget.style.setProperty('--x', `${x}%`)
    e.currentTarget.style.setProperty('--y', `${y}%`)
  }

  return (
    <div ref={containerRef} onMouseMove={handleMouseMove} className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden relative">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse delay-1000"></div>
        <div className="absolute top-40 left-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse delay-2000"></div>
        {/* Spotlight cursor */}
        <div className="pointer-events-none absolute inset-0 [mask-image:radial-gradient(200px_200px_at_var(--x,50%)_var(--y,50%),white,transparent)] bg-white/10 transition-[--x,--y]"></div>
        {/* Noise overlay */}
        <div className="absolute inset-0 opacity-[0.06] mix-blend-overlay" style={{ backgroundImage: "url('data:image/svg+xml;utf8,\
          <svg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'100\\' height=\\'100\\' viewBox=\\'0 0 100 100\\'>\
            <filter id=\\'n\\'>\
              <feTurbulence type=\\'fractalNoise\\' baseFrequency=\\'.8\\' numOctaves=\\'4\\' stitchTiles=\\'stitch\\'/>\
            </filter>\
            <rect width=\\'100%\\' height=\\'100%\\' filter=\\'url(%23n)\\' opacity=\\'.35\\'/>\
          </svg>')" }}></div>
      </div>

      {/* Header */}
      <header className="relative border-b border-white/10 bg-black/20 backdrop-blur-sm transition-all duration-1000">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 group">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Zap className="h-7 w-7 text-white" />
              </div>
              <span className="text-3xl font-bold text-white bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Stack21
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <LanguageSelector />
              <Button
                variant="ghost"
                className="text-white hover:bg-white/10 transition-all duration-300"
              >
                {t('navigation.documentation', 'Documentación')}
              </Button>
              <Button
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10 transition-all duration-300 hover:scale-105"
                onClick={() => setShowWaitlist(true)}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                {t('buttons.joinWaitlist', 'Join Waitlist')}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section (Rediseño split) */}
      <section className="relative py-20 transition-all duration-1000 delay-300">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Copy + CTAs */}
            <div>
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 text-purple-300 text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4 mr-2" />
                {t('hero.badge', 'La alternativa premium a otras plataformas')}
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                <span className="bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">{t('hero.title', 'Automatiza')}</span> {t('hero.subtitle', 'más rápido que nunca')}
              </h1>
              <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-xl">
                {t('hero.description', 'Crea workflows visuales con IA, integra tus herramientas y despliega en minutos. Diseño moderno, feedback inmediato y una experiencia superior a otras plataformas.')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="group text-lg px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold rounded-xl shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105"
                  onClick={() => setShowWaitlist(true)}
                >
                  <Rocket className="h-5 w-5 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                  {t('hero.ctaPrimary', 'Empezar gratis')}
                  <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="group text-lg px-8 py-4 border-white/30 text-white hover:bg-white/10 rounded-xl transition-all duration-300 hover:scale-105"
                  onClick={() => document.getElementById('compare-n8n')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  <Play className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
                  {t('hero.ctaSecondary', 'Ver comparativa')}
                </Button>
              </div>
              {/* Key stats */}
              <div className="mt-10 grid grid-cols-3 gap-4 max-w-md">
                {[{k:'45 min', v:'Setup'}, {k:'300+', v:'Integraciones'}, {k:'∞', v:'Escala'}].map((s, i) => (
                  <div key={i} className="text-center p-4 bg-white/5 border border-white/10 rounded-xl">
                    <div className="text-2xl font-bold text-white">{s.k}</div>
                    <div className="text-xs text-gray-400">{s.v}</div>
                  </div>
                ))}
              </div>
            </div>
            {/* Right: Visual mock + parallax layers */}
            <div className="relative">
              <div className="relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-4 shadow-2xl overflow-hidden">
                <div className="absolute -top-24 -right-24 w-72 h-72 bg-purple-500/30 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-blue-500/30 rounded-full blur-3xl"></div>
                <div className="relative z-10 grid grid-cols-3 gap-3 opacity-100">
                  <div className="h-24 rounded-xl bg-gradient-to-br from-purple-500/30 to-pink-500/30 border border-white/10 flex flex-col items-center justify-center hover:scale-105 transition-transform duration-300 group">
                    <Brain className="h-6 w-6 text-white/80 mb-1 group-hover:scale-110 transition-transform duration-300" />
                    <span className="text-xs text-white/70 font-medium">IA</span>
                  </div>
                  <div className="h-24 rounded-xl bg-gradient-to-br from-blue-500/30 to-cyan-500/30 border border-white/10 flex flex-col items-center justify-center hover:scale-105 transition-transform duration-300 group">
                    <Zap className="h-6 w-6 text-white/80 mb-1 group-hover:scale-110 transition-transform duration-300" />
                    <span className="text-xs text-white/70 font-medium">Auto</span>
                  </div>
                  <div className="h-24 rounded-xl bg-gradient-to-br from-green-500/30 to-emerald-500/30 border border-white/10 flex flex-col items-center justify-center hover:scale-105 transition-transform duration-300 group">
                    <Users className="h-6 w-6 text-white/80 mb-1 group-hover:scale-110 transition-transform duration-300" />
                    <span className="text-xs text-white/70 font-medium">Team</span>
                  </div>
                  <div className="h-24 rounded-xl bg-gradient-to-br from-orange-500/30 to-red-500/30 border border-white/10 flex flex-col items-center justify-center hover:scale-105 transition-transform duration-300 group">
                    <Target className="h-6 w-6 text-white/80 mb-1 group-hover:scale-110 transition-transform duration-300" />
                    <span className="text-xs text-white/70 font-medium">Goal</span>
                  </div>
                  <div className="h-24 rounded-xl bg-gradient-to-br from-indigo-500/30 to-purple-500/30 border border-white/10 flex flex-col items-center justify-center hover:scale-105 transition-transform duration-300 group">
                    <Globe className="h-6 w-6 text-white/80 mb-1 group-hover:scale-110 transition-transform duration-300" />
                    <span className="text-xs text-white/70 font-medium">API</span>
                  </div>
                  <div className="h-24 rounded-xl bg-gradient-to-br from-teal-500/30 to-blue-500/30 border border-white/10 flex flex-col items-center justify-center hover:scale-105 transition-transform duration-300 group">
                    <Shield className="h-6 w-6 text-white/80 mb-1 group-hover:scale-110 transition-transform duration-300" />
                    <span className="text-xs text-white/70 font-medium">Secure</span>
                  </div>
                  <div className="h-24 rounded-xl bg-gradient-to-br from-pink-500/30 to-rose-500/30 border border-white/10 flex flex-col items-center justify-center hover:scale-105 transition-transform duration-300 group">
                    <TrendingUp className="h-6 w-6 text-white/80 mb-1 group-hover:scale-110 transition-transform duration-300" />
                    <span className="text-xs text-white/70 font-medium">Scale</span>
                  </div>
                  <div className="h-24 rounded-xl bg-gradient-to-br from-yellow-500/30 to-orange-500/30 border border-white/10 flex flex-col items-center justify-center hover:scale-105 transition-transform duration-300 group">
                    <Clock className="h-6 w-6 text-white/80 mb-1 group-hover:scale-110 transition-transform duration-300" />
                    <span className="text-xs text-white/70 font-medium">Real-time</span>
                  </div>
                  <div className="h-24 rounded-xl bg-gradient-to-br from-violet-500/30 to-purple-500/30 border border-white/10 flex flex-col items-center justify-center hover:scale-105 transition-transform duration-300 group">
                    <Sparkles className="h-6 w-6 text-white/80 mb-1 group-hover:scale-110 transition-transform duration-300" />
                    <span className="text-xs text-white/70 font-medium">Magic</span>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 p-3 rounded-xl bg-white/10 border border-white/20 backdrop-blur-md">
                <div className="flex items-center space-x-2">
                  <Sparkles className="h-4 w-4 text-purple-300" />
                  <span className="text-sm text-white">IA asistiendo tu flujo</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonios + métricas */}
      <section className="relative py-20 transition-all duration-1000 delay-900">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto items-center">
            <div className="lg:col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { name:'María González', role:'CTO, TechStart', quote:'“Stack21 superó a otras plataformas en velocidad y UX. Lanzamos 3x más rápido.”' },
                  { name:'Carlos Ruiz', role:'Founder, DataFlow', quote:'“La IA integrada nos ahorró semanas. La diferencia es abismal.”' },
                  { name:'Ana Martínez', role:'DevOps Lead, CloudCorp', quote:'“Setup en 45 minutos. La mejor experiencia visual.”' },
                  { name:'Luis Pérez', role:'Head of Growth, Nova', quote:'“Conversión +22% tras migrar workflows a Stack21.”' },
                ].map((t, i) => (
                  <div key={i} className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:border-white/20 transition-all">
                    <p className="text-gray-200 italic">{t.quote}</p>
                    <div className="mt-4 text-sm text-gray-400">{t.name} • {t.role}</div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="grid grid-cols-2 gap-4">
                {[{k:'3x',v:'Time-to-Launch'},{k:'+22%',v:'Conversion'},{k:'<2s',v:'LCP'},{k:'99.9%',v:'Uptime'}].map((m,i)=>(
                  <div key={i} className="text-center p-6 rounded-2xl bg-white/5 border border-white/10">
                    <div className="text-3xl font-bold text-white">{m.k}</div>
                    <div className="text-xs text-gray-300">{m.v}</div>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-4 mt-6 opacity-80">
                {['Acme','Globex','Initech','Umbrella'].map((b) => (
                  <div key={b} className="text-xs tracking-widest uppercase text-gray-300">{b}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Video demo */}
      <section className="relative py-20 bg-black/20 transition-all duration-1000 delay-1000">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5">
              <div className="aspect-video">
                <iframe 
                  className="w-full h-full"
                  src="https://www.youtube.com/embed/dQw4w9WgXcQ" 
                  title="Demo Stack21"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
            <div className="text-center mt-6">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
                onClick={() => (window.location.href = '/auth/signin')}
              >
                Probar en 1 clic
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Logos Marquee */}
      <section className="relative py-8 transition-all duration-1000 delay-400">
        <div className="container mx-auto px-4">
          <div className="overflow-hidden [mask-image:linear-gradient(to_right,transparent,black,transparent)]">
            <div className="flex items-center gap-12 animate-[marquee_30s_linear_infinite] text-gray-300/80">
              {['Acme','Globex','Initech','Umbrella','Wayne','Stark','Wonka','Hooli'].map((brand) => (
                <div key={brand} className="text-sm tracking-widest uppercase">
                  {brand}
                </div>
              ))}
              {['Acme','Globex','Initech','Umbrella','Wayne','Stark','Wonka','Hooli'].map((brand) => (
                <div key={`${brand}-2`} className="text-sm tracking-widest uppercase">
                  {brand}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Comparativa (sin mencionar marcas) */}
      <section id="compare-n8n" className="relative py-20 bg-black/20 transition-all duration-1000 delay-500">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Stack21 vs otras plataformas</span>
            </h2>
            <p className="text-gray-300 mt-4">Diseño moderno, IA integrada y experiencia de usuario superior.</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
            {[{name:'Stack21', accent:'from-purple-500 to-pink-500', pros:['UI moderna con glass/gradientes','Transiciones y micro-interacciones','Nodos de IA exclusivos','Temas personalizables','Toasts avanzados','Spotlight + noise premium']},{name:'Otras plataformas', accent:'from-gray-500 to-slate-500', pros:['UI funcional','Sin IA nativa','Temas limitados','Animaciones mínimas','Feedback básico','Estilo clásico']}].map((p, idx) => (
              <div key={p.name} className={`p-6 rounded-2xl border ${idx===0? 'border-purple-400/30 bg-gradient-to-br from-white/10 to-white/[0.02]' : 'border-white/10 bg-white/5'} backdrop-blur-sm`}>
                <div className={`inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r ${p.accent} text-white text-xs font-semibold mb-4`}>{p.name}</div>
                <ul className="space-y-3">
                  {p.pros.map((item, i) => (
                    <li key={i} className="flex items-start space-x-2 text-gray-200">
                      <CheckCircle className={`h-4 w-4 mt-0.5 ${idx===0? 'text-purple-400' : 'text-gray-400'}`} />
                      <span className={idx===0? 'text-white' : 'text-gray-300'}>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-20 bg-black/20 transition-all duration-1000 delay-500">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Características
              </span>
              <br />
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Revolucionarias
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto">
              La primera plataforma SaaS con IA integrada de nivel empresarial.
              <br />
              <span className="text-purple-400 font-semibold">Automatización inteligente, escalabilidad ilimitada, pricing justo.</span>
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {[
              {
                icon: Brain,
                title: "IA Integrada",
                description: "GPT-4 y modelos personalizados que aprenden de tus workflows y se optimizan automáticamente.",
                gradient: "from-purple-500 to-pink-500",
                delay: "delay-100"
              },
              {
                icon: Users,
                title: "Multi-tenant",
                description: "Cada cliente tiene su workspace aislado con IA personalizada y configuración independiente.",
                gradient: "from-blue-500 to-cyan-500",
                delay: "delay-200"
              },
              {
                icon: Zap,
                title: "Ultra Rápido",
                description: "Ejecución en 1-2 segundos con optimización automática y escalabilidad horizontal.",
                gradient: "from-green-500 to-emerald-500",
                delay: "delay-300"
              },
              {
                icon: Target,
                title: "Fácil de Usar",
                description: "Interfaz intuitiva con drag-and-drop inteligente. Crea workflows en 15 minutos.",
                gradient: "from-orange-500 to-red-500",
                delay: "delay-400"
              },
              {
                icon: TrendingUp,
                title: "Pricing Justo",
                description: "Pay-per-use desde $0.01/ejecución. Sin costos fijos, solo pagas por lo que usas.",
                gradient: "from-yellow-500 to-orange-500",
                delay: "delay-500"
              },
              {
                icon: Shield,
                title: "Enterprise Security",
                description: "Seguridad de nivel empresarial con encriptación end-to-end y cumplimiento SOC2.",
                gradient: "from-indigo-500 to-purple-500",
                delay: "delay-600"
              }
            ].map((feature, index) => (
              <div 
                key={index}
                className={`group text-center p-8 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl hover:border-white/20 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/10 ${feature.delay}`}
              >
                <div className={`w-20 h-20 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:rotate-12 transition-transform duration-300 shadow-lg`}>
                  <feature.icon className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-purple-300 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center mt-16">
            <Button
              onClick={() => setShowWaitlist(true)}
              className="group bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-lg px-8 py-4 rounded-xl shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105"
            >
              <Brain className="h-5 w-5 mr-2 group-hover:rotate-12 transition-transform duration-300" />
              Probar Ahora
              <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
            </Button>
          </div>
        </div>
      </section>

      {/* Cómo funciona (3 pasos) */}
      <section id="como-funciona" className="relative py-20 transition-all duration-1000 delay-500">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Cómo funciona</span>
            </h2>
            <p className="text-gray-300 mt-4">De cero a automatizado en minutos.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              { title: '1. Elige un trigger', desc: 'Webhook, schedule o eventos externos.' },
              { title: '2. Arrastra acciones', desc: 'Email, HTTP, DB y nodos de IA.' },
              { title: '3. Ejecuta y mide', desc: 'Corre, analiza y mejora con un clic.' },
            ].map((s, i) => (
              <div key={i} className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:border-white/20 transition-all">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold mb-4">{i+1}</div>
                <h3 className="text-white font-semibold mb-2">{s.title}</h3>
                <p className="text-gray-300 text-sm">{s.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Button
              size="lg"
              className="bg-gradient-to-r from-green-400 to-emerald-400 hover:from-green-500 hover:to-emerald-500 text-black font-bold px-8 py-4 rounded-xl shadow-2xl hover:shadow-emerald-500/25"
              onClick={() => (window.location.href = '/auth/signin')}
            >
              Empieza gratis en 30 segundos
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Casos de uso */}
      <section id="casos-uso" className="relative py-20 bg-black/20 transition-all duration-1000 delay-600">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white">Casos de uso</h2>
            <p className="text-gray-300 mt-2">Listos para copiar y lanzar.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              { t:'Lead Nurturing con IA', d:'Califica leads, responde con IA y envía follow-ups automáticos.' },
              { t:'Scraping + Análisis', d:'Extrae datos, analiza sentimientos y guarda en tu base.' },
              { t:'Soporte con Chatbot', d:'Responde FAQs y deriva tickets automáticamente.' },
              { t:'Alertas en Tiempo Real', d:'Monitorea eventos y notifica en Slack/Email.' },
              { t:'ETL Ligero', d:'Transforma y mueve datos entre servicios.' },
              { t:'Traducción y Resumen', d:'Traduce y resume documentos a escala.' },
            ].map((c, i) => (
              <div key={i} className="group p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 backdrop-blur-sm transition-all">
                <h3 className="text-white font-semibold mb-2">{c.t}</h3>
                <p className="text-gray-300 text-sm mb-4">{c.d}</p>
                <Button
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10"
                  onClick={() => (window.location.href = '/auth/signin')}
                >
                  Usar plantilla
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Integraciones */}
      <section id="integraciones" className="relative py-20 transition-all duration-1000 delay-700">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white">Integraciones</h2>
            <p className="text-gray-300 mt-2">Conecta tus herramientas favoritas.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 max-w-6xl mx-auto">
            {['Slack','Gmail','Stripe','Notion','Postgres','Webhook','OpenAI','Discord','Hubspot','Sheets','S3','Twilio'].map((name) => (
              <div key={name} className="p-4 rounded-xl bg-white/5 border border-white/10 text-center text-gray-200 hover:border-white/20">{name}</div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Button
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10"
              onClick={() => (window.location.href = '/auth/signin')}
            >
              Ver todas las integraciones
            </Button>
          </div>
        </div>
      </section>

      {/* Franja CTA */}
      <section className="relative py-14 transition-all duration-1000 delay-800">
        <div className="container mx-auto px-4">
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-r from-indigo-600/30 to-purple-600/30 p-8 text-center">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_var(--x,50%)_var(--y,50%),rgba(255,255,255,.15),transparent_60%)]"></div>
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">Listo para automatizar como un pro</h3>
            <p className="text-gray-200 mb-6">Crea tu cuenta gratis y lanza tu primer workflow hoy.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button
                size="lg"
                className="bg-white text-black font-bold hover:bg-gray-100"
                onClick={() => (window.location.href = '/auth/signin')}
              >
                Iniciar sesión
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10"
                onClick={() => (window.location.href = '/auth/signup')}
              >
                Crear cuenta
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="relative py-20 bg-black/20 transition-all duration-1000 delay-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white">Preguntas frecuentes</h2>
            <p className="text-gray-300 mt-2">Todo lo que necesitas saber.</p>
          </div>
          <div className="max-w-3xl mx-auto space-y-4">
            {[
              { q:'¿Necesito saber programar?', a:'No. Puedes crear workflows arrastrando nodos. La IA te asiste.'},
              { q:'¿Es mejor que otras plataformas?', a:'Sí. Mejor UI/UX, nodos de IA exclusivos, temas y feedback avanzado.'},
              { q:'¿Puedo usar mi propio modelo de IA?', a:'Sí. Integra OpenAI y otros proveedores fácilmente.'},
              { q:'¿Tiene plan gratuito?', a:'Sí. Puedes empezar gratis y escalar cuando lo necesites.'},
            ].map((f, i) => (
              <details key={i} className="group rounded-xl border border-white/10 bg-white/5 p-4 open:bg-white/10">
                <summary className="cursor-pointer list-none text-white font-medium">
                  {f.q}
                </summary>
                <p className="mt-2 text-gray-300 text-sm">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="relative py-20 transition-all duration-1000 delay-700">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-12">
            <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Confiado por desarrolladores
            </span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-16">
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">1,247</div>
              <div className="text-gray-400">Desarrolladores</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">89</div>
              <div className="text-gray-400">Países</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">$50K</div>
              <div className="text-gray-400">Pre-ventas</div>
            </div>
          </div>

          {/* Testimonials */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              {
                name: "María González",
                role: "CTO, TechStart",
                content: "Stack21 nos ahorró 3 meses de desarrollo. La IA integrada es increíble.",
                rating: 5
              },
              {
                name: "Carlos Ruiz",
                role: "Founder, DataFlow",
                content: "La mejor plataforma de automatización que he usado. Supera a otras plataformas en todos los aspectos.",
                rating: 5
              },
              {
                name: "Ana Martínez",
                role: "DevOps Lead, CloudCorp",
                content: "Implementación en 45 minutos. La documentación es perfecta y la UI es espectacular.",
                rating: 5
              }
            ].map((testimonial, index) => (
              <div 
                key={index}
                className="p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl hover:border-white/20 transition-all duration-300 hover:scale-105"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-300 mb-4 italic">"{testimonial.content}"</p>
                <div>
                  <div className="font-semibold text-white">{testimonial.name}</div>
                  <div className="text-sm text-gray-400">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Waitlist Section */}
      <section className="relative py-20 transition-all duration-1000 delay-900">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                ¿Listo para
              </span>
              <br />
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                comenzar?
              </span>
            </h2>
            <p className="text-xl text-gray-300 mb-12">
              Únete a la lista de espera y sé el primero en conocer las últimas actualizaciones.
              <br />
              <span className="text-purple-400 font-semibold">Acceso temprano gratuito para los primeros 1000 usuarios.</span>
            </p>
            
            <div className="max-w-2xl mx-auto">
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Tu nombre"
                    className="flex h-12 w-full rounded-xl border px-4 py-3 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 bg-white/10 border-white/20 text-white placeholder-gray-300 backdrop-blur-sm transition-all duration-300 focus:bg-white/20"
                    required
                  />
                  <input
                    type="email"
                    placeholder="tu@email.com"
                    className="flex h-12 w-full rounded-xl border px-4 py-3 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 bg-white/10 border-white/20 text-white placeholder-gray-300 backdrop-blur-sm transition-all duration-300 focus:bg-white/20"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Empresa (opcional)"
                    className="flex h-12 w-full rounded-xl border px-4 py-3 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 bg-white/10 border-white/20 text-white placeholder-gray-300 backdrop-blur-sm transition-all duration-300 focus:bg-white/20"
                  />
                  <input
                    type="text"
                    placeholder="Código de referido (opcional)"
                    className="flex h-12 w-full rounded-xl border px-4 py-3 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 bg-white/10 border-white/20 text-white placeholder-gray-300 backdrop-blur-sm transition-all duration-300 focus:bg-white/20"
                  />
                </div>
                <Button
                  type="submit"
                  className="group w-full bg-gradient-to-r from-yellow-400 to-pink-400 hover:from-yellow-500 hover:to-pink-500 text-black font-bold py-4 text-lg rounded-xl shadow-2xl hover:shadow-yellow-500/25 transition-all duration-300 transform hover:scale-105"
                >
                  <div className="flex items-center justify-center">
                    <Zap className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
                    Unirse a la Lista de Espera
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-12 border-t border-white/10 bg-black/20 transition-all duration-1000 delay-1000">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-3 mb-6 md:mb-0 group">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Stack21
              </span>
            </div>
            <div className="text-center md:text-right">
              <p className="text-gray-400 mb-2">
                © 2024 Stack21. Todos los derechos reservados.
              </p>
              <p className="text-sm text-gray-500">
                Construido con ❤️ para desarrolladores
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* Waitlist Modal */}
      {showWaitlist && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
          <div className="bg-gradient-to-br from-gray-900 to-black border border-white/10 rounded-3xl max-w-md w-full max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-300">
            <div className="p-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-3xl font-bold text-white">Únete a la Lista de Espera</h3>
                  <p className="text-gray-400 text-sm">Sé el primero en acceder a Stack21</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowWaitlist(false)}
                  className="text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-300"
                >
                  ✕
                </Button>
              </div>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Tu nombre"
                    className="flex h-12 w-full rounded-xl border px-4 py-3 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 bg-white/10 border-white/20 text-white placeholder-gray-300 backdrop-blur-sm transition-all duration-300 focus:bg-white/20"
                    required
                  />
                  <input
                    type="email"
                    placeholder="tu@email.com"
                    className="flex h-12 w-full rounded-xl border px-4 py-3 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 bg-white/10 border-white/20 text-white placeholder-gray-300 backdrop-blur-sm transition-all duration-300 focus:bg-white/20"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Empresa (opcional)"
                    className="flex h-12 w-full rounded-xl border px-4 py-3 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 bg-white/10 border-white/20 text-white placeholder-gray-300 backdrop-blur-sm transition-all duration-300 focus:bg-white/20"
                  />
                  <input
                    type="text"
                    placeholder="Código de referido (opcional)"
                    className="flex h-12 w-full rounded-xl border px-4 py-3 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 bg-white/10 border-white/20 text-white placeholder-gray-300 backdrop-blur-sm transition-all duration-300 focus:bg-white/20"
                  />
                </div>
                <Button
                  type="submit"
                  className="group w-full bg-gradient-to-r from-yellow-400 to-pink-400 hover:from-yellow-500 hover:to-pink-500 text-black font-bold py-4 text-lg rounded-xl shadow-2xl hover:shadow-yellow-500/25 transition-all duration-300 transform hover:scale-105"
                >
                  <div className="flex items-center justify-center">
                    <Zap className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
                    Unirse a la Lista de Espera
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Componente de traducciones simples */}
      <div className="relative py-20">
        <div className="container mx-auto px-4">
          <SimpleTranslation />
        </div>
      </div>
    </div>
  )
}