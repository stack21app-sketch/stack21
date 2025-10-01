'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Clock, 
  Zap, 
  Shield, 
  Cpu, 
  Mail, 
  CheckCircle,
  Star,
  Rocket,
  Users,
  Globe,
  TrendingUp,
  Award,
  Heart,
  ArrowRight,
  Play,
  Twitter,
  Linkedin,
  Github
} from 'lucide-react'
import { GoogleAnalytics } from '@/components/analytics/GoogleAnalytics'
import { Hotjar } from '@/components/analytics/Hotjar'
import { useAnalytics } from '@/lib/analytics'

export default function ComingSoonPage() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })

  const { trackEmailSignup, trackSocialClick } = useAnalytics()

  // Countdown timer - fecha objetivo: 30 días desde ahora
  useEffect(() => {
    const targetDate = new Date()
    targetDate.setDate(targetDate.getDate() + 30) // 30 días desde ahora

    const timer = setInterval(() => {
      const now = new Date().getTime()
      const distance = targetDate.getTime() - now

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        })
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      try {
        const response = await fetch('/api/capture-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            source: 'coming_soon'
          })
        })

        const result = await response.json()
        
        if (result.success) {
          setSubmitted(true)
          // Track analytics
          trackEmailSignup(email)
          console.log('✅ Email registrado exitosamente:', email)
        } else {
          alert(result.message || 'Error al registrar email')
        }
      } catch (error) {
        console.error('Error:', error)
        alert('Error al registrar email. Intenta de nuevo.')
      }
    }
  }

  const handleSocialClick = (platform: string) => {
    trackSocialClick(platform)
  }

  const features = [
    { icon: Zap, title: 'Automatización Inteligente', desc: 'Workflows que se adaptan a tu negocio' },
    { icon: Cpu, title: 'IA Integrada', desc: 'Chatbots y asistentes virtuales potentes' },
    { icon: Shield, title: 'Seguridad Enterprise', desc: 'Protección de datos de nivel empresarial' },
    { icon: Globe, title: 'Integraciones Globales', desc: 'Conecta con 100+ herramientas populares' },
    { icon: Users, title: 'Colaboración en Equipo', desc: 'Trabaja junto a tu equipo en tiempo real' },
    { icon: Rocket, title: 'Escalabilidad Infinita', desc: 'Crece sin límites con nuestra infraestructura' }
  ]

  const stats = [
    { number: '10,000+', label: 'Usuarios en lista de espera', icon: Users },
    { number: '99.9%', label: 'Uptime garantizado', icon: Shield },
    { number: '50+', label: 'Integraciones disponibles', icon: Globe },
    { number: '24/7', label: 'Soporte premium', icon: Heart }
  ]

  const testimonials = [
    {
      name: 'María González',
      role: 'CEO, TechStart',
      content: 'Stack21 va a revolucionar la forma en que manejamos la automatización. ¡No puedo esperar!',
      avatar: '👩‍💼'
    },
    {
      name: 'Carlos Rodríguez',
      role: 'CTO, InnovateLab',
      content: 'La integración de IA es impresionante. Esto cambiará todo el panorama del SaaS.',
      avatar: '👨‍💻'
    },
    {
      name: 'Ana Martínez',
      role: 'Fundadora, GrowthCo',
      content: 'Finalmente una plataforma que entiende las necesidades reales de las empresas.',
      avatar: '👩‍🚀'
    }
  ]

  return (
    <>
      <GoogleAnalytics measurementId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-XXXXXXXXXX'} />
      <Hotjar id={process.env.NEXT_PUBLIC_HOTJAR_ID || '1234567'} />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">S21</span>
            </div>
            <span className="text-xl font-bold text-gray-900">Stack21</span>
          </div>
          <Badge variant="outline" className="flex items-center space-x-1">
            <Clock className="w-3 h-3" />
            <span>Próximamente</span>
          </Badge>
        </div>
      </div>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <Badge className="mb-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <Star className="w-3 h-3 mr-1" />
            La revolución del SaaS está llegando
          </Badge>
          
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
            Stack21
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            La plataforma SaaS más avanzada para automatizar tu negocio. 
            <span className="font-semibold text-gray-900"> IA, workflows inteligentes y herramientas empresariales</span> en un solo lugar.
          </p>

          {/* Countdown Timer */}
          <div className="mb-12">
            <h3 className="text-lg font-semibold text-gray-700 mb-6">Lanzamiento en:</h3>
            <div className="grid grid-cols-4 gap-4 max-w-md mx-auto">
              <div className="text-center">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-4 mb-2">
                  <div className="text-2xl font-bold">{timeLeft.days}</div>
                  <div className="text-xs opacity-90">Días</div>
                </div>
              </div>
              <div className="text-center">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-4 mb-2">
                  <div className="text-2xl font-bold">{timeLeft.hours}</div>
                  <div className="text-xs opacity-90">Horas</div>
                </div>
              </div>
              <div className="text-center">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-4 mb-2">
                  <div className="text-2xl font-bold">{timeLeft.minutes}</div>
                  <div className="text-xs opacity-90">Min</div>
                </div>
              </div>
              <div className="text-center">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-4 mb-2">
                  <div className="text-2xl font-bold">{timeLeft.seconds}</div>
                  <div className="text-xs opacity-90">Seg</div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-2">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                    <stat.icon className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{stat.number}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Email Signup */}
          <Card className="max-w-md mx-auto mb-12">
            <CardContent className="p-6">
              {!submitted ? (
                <>
                  <h3 className="text-lg font-semibold mb-4">Sé el primero en saberlo</h3>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                      type="email"
                      placeholder="tu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="text-center"
                      required
                    />
                    <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                      <Mail className="w-4 h-4 mr-2" />
                      Notificarme cuando lance
                    </Button>
                  </form>
                </>
              ) : (
                <div className="text-center">
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-green-700 mb-2">¡Perfecto!</h3>
                  <p className="text-gray-600">Te notificaremos cuando esté listo</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Testimonials Section */}
          <div className="mb-16">
            <h3 className="text-2xl font-bold text-center mb-8 text-gray-900">Lo que dicen nuestros usuarios</h3>
            <div className="grid md:grid-cols-3 gap-6">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                  <CardContent className="p-0">
                    <div className="flex items-center mb-4">
                      <div className="text-3xl mr-3">{testimonial.avatar}</div>
                      <div>
                        <div className="font-semibold text-gray-900">{testimonial.name}</div>
                        <div className="text-sm text-gray-600">{testimonial.role}</div>
                      </div>
                    </div>
                    <p className="text-gray-700 italic">"{testimonial.content}"</p>
                    <div className="flex mt-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Features Preview */}
          <div className="mb-16">
            <h3 className="text-2xl font-bold text-center mb-8 text-gray-900">Características principales</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                  <CardContent className="p-0">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                        <feature.icon className="w-5 h-5 text-blue-600" />
                      </div>
                      <h3 className="font-semibold text-gray-900">{feature.title}</h3>
                    </div>
                    <p className="text-gray-600 text-sm">{feature.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Demo Video Section */}
          <div className="mb-16 text-center">
            <h3 className="text-2xl font-bold mb-4 text-gray-900">Vista previa del producto</h3>
            <p className="text-gray-600 mb-8">Descubre lo que estamos construyendo</p>
            <div className="max-w-2xl mx-auto">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-white">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Play className="w-8 h-8" />
                </div>
                <h4 className="text-xl font-semibold mb-2">Demo en vivo</h4>
                <p className="text-blue-100 mb-4">Próximamente disponible</p>
                <Button variant="outline" className="bg-white text-blue-600 hover:bg-blue-50">
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Ver preview
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="container mx-auto px-4 py-12 border-t border-gray-200">
        <div className="max-w-4xl mx-auto">
          {/* Social Links */}
          <div className="flex justify-center space-x-6 mb-8">
            <a 
              href="#" 
              onClick={() => handleSocialClick('twitter')}
              className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-blue-100 transition-colors"
            >
              <Twitter className="w-5 h-5 text-gray-600" />
            </a>
            <a 
              href="#" 
              onClick={() => handleSocialClick('linkedin')}
              className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-blue-100 transition-colors"
            >
              <Linkedin className="w-5 h-5 text-gray-600" />
            </a>
            <a 
              href="#" 
              onClick={() => handleSocialClick('github')}
              className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-blue-100 transition-colors"
            >
              <Github className="w-5 h-5 text-gray-600" />
            </a>
          </div>

          {/* Newsletter Signup */}
          <div className="text-center mb-8">
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Mantente actualizado</h4>
            <p className="text-gray-600 mb-4">Recibe noticias sobre el desarrollo y lanzamiento</p>
            <div className="flex justify-center space-x-2 max-w-md mx-auto">
              <Input 
                placeholder="tu@email.com" 
                className="flex-1"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button 
                onClick={handleSubmit}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Mail className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Footer Links */}
          <div className="grid md:grid-cols-4 gap-6 mb-8 text-center">
            <div>
              <h5 className="font-semibold text-gray-900 mb-2">Producto</h5>
              <ul className="space-y-1 text-sm text-gray-600">
                <li><a href="#" className="hover:text-blue-600">Características</a></li>
                <li><a href="#" className="hover:text-blue-600">Precios</a></li>
                <li><a href="#" className="hover:text-blue-600">Integraciones</a></li>
                <li><a href="#" className="hover:text-blue-600">API</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold text-gray-900 mb-2">Empresa</h5>
              <ul className="space-y-1 text-sm text-gray-600">
                <li><a href="#" className="hover:text-blue-600">Acerca de</a></li>
                <li><a href="#" className="hover:text-blue-600">Blog</a></li>
                <li><a href="#" className="hover:text-blue-600">Carreras</a></li>
                <li><a href="#" className="hover:text-blue-600">Prensa</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold text-gray-900 mb-2">Soporte</h5>
              <ul className="space-y-1 text-sm text-gray-600">
                <li><a href="#" className="hover:text-blue-600">Centro de ayuda</a></li>
                <li><a href="#" className="hover:text-blue-600">Comunidad</a></li>
                <li><a href="#" className="hover:text-blue-600">Contacto</a></li>
                <li><a href="#" className="hover:text-blue-600">Estado</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold text-gray-900 mb-2">Legal</h5>
              <ul className="space-y-1 text-sm text-gray-600">
                <li><a href="#" className="hover:text-blue-600">Privacidad</a></li>
                <li><a href="#" className="hover:text-blue-600">Términos</a></li>
                <li><a href="#" className="hover:text-blue-600">Cookies</a></li>
                <li><a href="#" className="hover:text-blue-600">Seguridad</a></li>
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div className="text-center text-gray-500 border-t border-gray-200 pt-6">
            <p className="mb-2">© 2024 Stack21. Todos los derechos reservados.</p>
            <p className="text-sm">Construyendo el futuro del SaaS empresarial</p>
          </div>
        </div>
      </div>
      </div>
    </>
  )
}
