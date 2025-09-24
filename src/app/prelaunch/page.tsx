'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Sparkles, 
  Zap, 
  Shield, 
  Users, 
  CheckCircle, 
  ArrowRight,
  Brain,
  Workflow,
  CreditCard,
  Globe,
  Star,
  TrendingUp
} from 'lucide-react'

export default function PrelaunchPage() {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [company, setCompany] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [referralCode, setReferralCode] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email, 
          name, 
          company,
          referralCode: referralCode || undefined
        })
      })
      
      if (response.ok) {
        setIsSubmitted(true)
      } else {
        throw new Error('Error al suscribirse')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Hubo un error. Por favor, inténtalo de nuevo.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <Card className="max-w-md mx-auto bg-green-900/20 border-green-500/20 backdrop-blur-sm">
          <CardContent className="p-8 text-center">
            <div className="text-green-400 text-6xl mb-6">✅</div>
            <h1 className="text-3xl font-bold text-white mb-4">
              ¡Te has unido a la revolución!
            </h1>
            <p className="text-gray-300 mb-6">
              Te notificaremos cuando Stack21 esté listo. Mientras tanto, 
              te enviaremos actualizaciones exclusivas y contenido valioso.
            </p>
            <div className="bg-white/10 rounded-lg p-4 mb-6">
              <h3 className="text-white font-semibold mb-2">¿Quieres acceso prioritario?</h3>
              <p className="text-sm text-gray-300 mb-4">
                Invita a 5 amigos y obtén acceso beta gratuito
              </p>
              <Button className="w-full bg-gradient-to-r from-yellow-400 to-pink-400 hover:from-yellow-500 hover:to-pink-500 text-black font-bold">
                Compartir con Amigos
              </Button>
            </div>
            <p className="text-xs text-gray-400">
              Sin spam. Solo actualizaciones importantes sobre Stack21.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <header className="relative z-10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-pink-400 rounded-lg flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-black" />
              </div>
              <span className="text-2xl font-bold text-white">Stack21</span>
            </div>
            <Badge variant="secondary" className="bg-yellow-400/20 text-yellow-300 border-yellow-400/30">
              Próximamente
            </Badge>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-16">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" />
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <Badge className="mb-6 bg-gradient-to-r from-yellow-400/20 to-pink-400/20 text-yellow-300 border-yellow-400/30">
            <Sparkles className="w-4 h-4 mr-2" />
            Automatización Inteligente
          </Badge>

          <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
            El Futuro de la
            <span className="bg-gradient-to-r from-yellow-400 to-pink-400 bg-clip-text text-transparent">
              {' '}Automatización
            </span>
            {' '}Está Aquí
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
            Stack21 combina <strong className="text-yellow-400">inteligencia artificial</strong>, 
            <strong className="text-pink-400"> facturación automática</strong> y 
            <strong className="text-blue-400"> gestión multi-tenant</strong> para 
            revolucionar tu negocio.
          </p>

          {/* Waitlist Form */}
          <Card className="max-w-lg mx-auto bg-white/10 backdrop-blur-sm border-white/20 mb-12">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-white mb-6">
                Únete a la Lista de Espera
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    type="text"
                    placeholder="Tu nombre"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-white/20 border-white/30 text-white placeholder-gray-300"
                    required
                  />
                  <Input
                    type="email"
                    placeholder="tu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-white/20 border-white/30 text-white placeholder-gray-300"
                    required
                  />
                </div>
                <Input
                  type="text"
                  placeholder="Empresa (opcional)"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="bg-white/20 border-white/30 text-white placeholder-gray-300"
                />
                <Input
                  type="text"
                  placeholder="Código de referido (opcional)"
                  value={referralCode}
                  onChange={(e) => setReferralCode(e.target.value)}
                  className="bg-white/20 border-white/30 text-white placeholder-gray-300"
                />
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-yellow-400 to-pink-400 hover:from-yellow-500 hover:to-pink-500 text-black font-bold py-3"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>
                      Uniéndose...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      Unirse a la Lista de Espera
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </div>
                  )}
                </Button>
              </form>
              <p className="text-xs text-gray-400 mt-4 text-center">
                Sin spam. Solo actualizaciones importantes sobre Stack21.
              </p>
            </CardContent>
          </Card>

          {/* Social Proof */}
          <div className="mb-16">
            <p className="text-gray-400 mb-6">Ya se han unido a la revolución:</p>
            <div className="flex justify-center items-center space-x-8 flex-wrap gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-white">1,247</div>
                <div className="text-sm text-gray-400">Emails</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">89</div>
                <div className="text-sm text-gray-400">Países</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">$50K</div>
                <div className="text-sm text-gray-400">Pre-ventas</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white/5 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Todo lo que necesitas para tu
              <span className="bg-gradient-to-r from-yellow-400 to-pink-400 bg-clip-text text-transparent">
                {' '}SaaS
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Una plataforma completa con todas las herramientas necesarias para 
              construir, lanzar y escalar tu aplicación SaaS.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Brain,
                title: 'IA Integrada',
                description: 'OpenAI API para funcionalidades inteligentes',
                color: 'from-purple-500 to-pink-500'
              },
              {
                icon: Workflow,
                title: 'Workflows',
                description: 'Automatización de procesos de negocio',
                color: 'from-blue-500 to-cyan-500'
              },
              {
                icon: CreditCard,
                title: 'Facturación',
                description: 'Integración completa con Stripe',
                color: 'from-green-500 to-emerald-500'
              },
              {
                icon: Users,
                title: 'Multi-tenant',
                description: 'Arquitectura para múltiples organizaciones',
                color: 'from-orange-500 to-red-500'
              },
              {
                icon: Shield,
                title: 'Seguridad',
                description: 'Encriptación de extremo a extremo',
                color: 'from-indigo-500 to-purple-500'
              },
              {
                icon: Globe,
                title: 'Escalable',
                description: 'Construido con las mejores tecnologías',
                color: 'from-teal-500 to-blue-500'
              }
            ].map((feature, index) => (
              <Card key={index} className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-300">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Precios de Lanzamiento
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Ofertas especiales para los primeros usuarios. 
              <strong className="text-yellow-400"> Solo por tiempo limitado.</strong>
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                name: 'Early Bird',
                price: '$29',
                originalPrice: '$99',
                description: 'Perfecto para empezar',
                features: [
                  '5 usuarios por workspace',
                  '3 proyectos',
                  '1,000 requests IA/mes',
                  'Soporte por email',
                  'Acceso beta gratuito'
                ],
                popular: false,
                color: 'from-gray-500 to-gray-600'
              },
              {
                name: 'Premium',
                price: '$99',
                originalPrice: '$199',
                description: 'Para equipos en crecimiento',
                features: [
                  '25 usuarios por workspace',
                  'Proyectos ilimitados',
                  '10,000 requests IA/mes',
                  'Soporte prioritario',
                  'Módulos premium incluidos',
                  'Consultoría de setup'
                ],
                popular: true,
                color: 'from-yellow-500 to-orange-500'
              },
              {
                name: 'Lifetime',
                price: '$499',
                originalPrice: '$2,400',
                description: 'Una sola vez, para siempre',
                features: [
                  'Usuarios ilimitados',
                  'Todas las features',
                  'Sin límites de uso',
                  'Soporte prioritario',
                  'Solo primeros 100 usuarios'
                ],
                popular: false,
                color: 'from-purple-500 to-pink-500'
              }
            ].map((plan, index) => (
              <Card key={index} className={`relative bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all duration-300 ${plan.popular ? 'ring-2 ring-yellow-400/50' : ''}`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black font-bold px-4 py-1">
                      <Star className="w-4 h-4 mr-1" />
                      Más Popular
                    </Badge>
                  </div>
                )}
                <CardContent className="p-8">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                    <p className="text-gray-300 mb-4">{plan.description}</p>
                    <div className="flex items-center justify-center space-x-2 mb-4">
                      <span className="text-4xl font-bold text-white">{plan.price}</span>
                      <span className="text-gray-400 line-through">/mes</span>
                      {plan.originalPrice && (
                        <span className="text-sm text-gray-400 line-through">
                          ${plan.originalPrice}/mes
                        </span>
                      )}
                    </div>
                    {plan.name === 'Lifetime' && (
                      <p className="text-sm text-green-400 font-semibold">
                        Ahorra ${parseInt(plan.originalPrice) - parseInt(plan.price)}/año
                      </p>
                    )}
                  </div>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-gray-300">
                        <CheckCircle className="h-5 w-5 text-green-400 mr-3 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className={`w-full bg-gradient-to-r ${plan.color} hover:opacity-90 text-white font-bold py-3`}
                    disabled
                  >
                    Próximamente
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-yellow-400/10 to-pink-400/10 backdrop-blur-sm">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            ¿Listo para la Revolución?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Únete a miles de empresarios que ya están preparando sus negocios 
            para el futuro de la automatización.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg"
              className="bg-gradient-to-r from-yellow-400 to-pink-400 hover:from-yellow-500 hover:to-pink-500 text-black font-bold px-8 py-4 text-lg"
              onClick={() => document.getElementById('waitlist-form')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <TrendingUp className="mr-2 h-5 w-5" />
              Únete Ahora
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-white/30 text-white hover:bg-white/10 px-8 py-4 text-lg"
            >
              Ver Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-pink-400 rounded-lg flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-black" />
              </div>
              <span className="text-2xl font-bold text-white">Stack21</span>
            </div>
            <div className="text-center md:text-right">
              <p className="text-gray-400 mb-2">
                © 2024 Stack21. Todos los derechos reservados.
              </p>
              <p className="text-sm text-gray-500">
                Construido con ❤️ para revolucionar tu negocio
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
