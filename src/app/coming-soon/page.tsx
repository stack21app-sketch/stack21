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
  Github,
  ChevronDown,
  ChevronUp,
  Check,
  X,
  Building2,
  ShoppingCart,
  Briefcase,
  GraduationCap,
  Copy,
  Gift,
  Bell,
  Sparkles,
  Target,
  Layers,
  DollarSign
} from 'lucide-react'
import { GoogleAnalytics } from '@/components/analytics/GoogleAnalytics'
import { Hotjar } from '@/components/analytics/Hotjar'
import { useAnalytics } from '@/lib/analytics'
import confetti from 'canvas-confetti'

export default function ComingSoonPage() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [referralCode, setReferralCode] = useState('')
  const [copiedCode, setCopiedCode] = useState(false)
  const [recentSignups, setRecentSignups] = useState<Array<{name: string, time: string}>>([])
  const [showNotification, setShowNotification] = useState(false)

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

  // Generar código de referido único
  useEffect(() => {
    const code = Math.random().toString(36).substring(2, 10).toUpperCase()
    setReferralCode(code)
  }, [])

  // Simular notificaciones de registros en tiempo real
  useEffect(() => {
    const names = ['Ana García', 'Carlos López', 'María Rodríguez', 'Juan Martínez', 'Laura Sánchez', 'Pedro González', 'Sofia Torres', 'Diego Ramírez']
    
    const showRandomSignup = () => {
      const randomName = names[Math.floor(Math.random() * names.length)]
      const minutesAgo = Math.floor(Math.random() * 30) + 1
      
      setRecentSignups(prev => [{
        name: randomName,
        time: `hace ${minutesAgo} min`
      }, ...prev.slice(0, 4)])
      
      setShowNotification(true)
      setTimeout(() => setShowNotification(false), 4000)
    }

    // Mostrar primera notificación después de 3 segundos
    const firstTimeout = setTimeout(showRandomSignup, 3000)
    
    // Luego cada 15-30 segundos
    const interval = setInterval(() => {
      showRandomSignup()
    }, Math.random() * 15000 + 15000)

    return () => {
      clearTimeout(firstTimeout)
      clearInterval(interval)
    }
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
          
          // 🎉 Lanzar confetti!
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
          })
          
          // Segundo confetti más sutil
          setTimeout(() => {
            confetti({
              particleCount: 50,
              angle: 60,
              spread: 55,
              origin: { x: 0 }
            })
            confetti({
              particleCount: 50,
              angle: 120,
              spread: 55,
              origin: { x: 1 }
            })
          }, 250)
        } else {
          alert(result.message || 'Error al registrar email')
        }
      } catch (error) {
        console.error('Error:', error)
        alert('Error al registrar email. Intenta de nuevo.')
      }
    }
  }

  const copyReferralCode = () => {
    navigator.clipboard.writeText(`${referralCode}`)
    setCopiedCode(true)
    setTimeout(() => setCopiedCode(false), 2000)
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

  // FAQ Data
  const faqs = [
    {
      question: '¿Cuándo estará disponible Stack21?',
      answer: 'Estamos planeando el lanzamiento oficial en 30 días. Los usuarios en la lista de espera tendrán acceso anticipado 1 semana antes del lanzamiento público.'
    },
    {
      question: '¿Qué planes de precios estarán disponibles?',
      answer: 'Ofreceremos 3 planes: Starter ($29/mes), Professional ($99/mes) y Enterprise (precio personalizado). Los primeros 1000 usuarios obtendrán un 50% de descuento de por vida.'
    },
    {
      question: '¿Necesito conocimientos técnicos para usar Stack21?',
      answer: 'No necesitas ser programador. Stack21 está diseñado con una interfaz visual intuitiva que cualquiera puede usar. También ofrecemos plantillas pre-construidas para comenzar rápidamente.'
    },
    {
      question: '¿Qué integraciones estarán disponibles?',
      answer: 'Al lanzamiento tendremos más de 50 integraciones incluyendo: Stripe, PayPal, Gmail, Slack, Shopify, WordPress, Zapier, y muchas más. Agregamos nuevas integraciones cada semana.'
    },
    {
      question: '¿Ofrecen garantía de devolución?',
      answer: 'Sí, ofrecemos una garantía de devolución de 30 días sin preguntas. Si no estás completamente satisfecho, te devolvemos tu dinero.'
    },
    {
      question: '¿Mis datos estarán seguros?',
      answer: 'Absolutamente. Utilizamos encriptación de grado militar (AES-256), cumplimos con GDPR y SOC 2, y tus datos se almacenan en servidores redundantes con backups diarios automáticos.'
    }
  ]

  // Roadmap Data
  const roadmap = [
    { phase: 'Fase 1', title: 'Beta Cerrada', status: 'completed', date: 'Completado' },
    { phase: 'Fase 2', title: 'Testing Interno', status: 'completed', date: 'Completado' },
    { phase: 'Fase 3', title: 'Beta Pública', status: 'in-progress', date: 'En curso' },
    { phase: 'Fase 4', title: 'Lanzamiento Oficial', status: 'upcoming', date: '30 días' },
    { phase: 'Fase 5', title: 'Móvil Apps', status: 'upcoming', date: '60 días' }
  ]

  // Pricing Plans
  const pricingPlans = [
    {
      name: 'Starter',
      price: '$29',
      originalPrice: '$58',
      period: '/mes',
      description: 'Perfect para emprendedores individuales',
      features: [
        '10 proyectos activos',
        '1,000 tareas/mes',
        'Integraciones básicas',
        'Soporte email',
        '5GB almacenamiento'
      ],
      popular: false
    },
    {
      name: 'Professional',
      price: '$99',
      originalPrice: '$198',
      period: '/mes',
      description: 'Ideal para equipos en crecimiento',
      features: [
        'Proyectos ilimitados',
        '10,000 tareas/mes',
        'Todas las integraciones',
        'Soporte prioritario 24/7',
        '50GB almacenamiento',
        'Colaboración en equipo',
        'API access',
        'Reportes avanzados'
      ],
      popular: true
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      originalPrice: null,
      period: '',
      description: 'Para grandes organizaciones',
      features: [
        'Todo en Professional',
        'Tareas ilimitadas',
        'Almacenamiento ilimitado',
        'Gestor de cuenta dedicado',
        'SLA garantizado 99.9%',
        'Implementación personalizada',
        'Capacitación en sitio',
        'Seguridad enterprise'
      ],
      popular: false
    }
  ]

  // Use Cases
  const useCases = [
    {
      icon: ShoppingCart,
      title: 'E-commerce',
      description: 'Automatiza inventario, pedidos y atención al cliente',
      examples: ['Sincronización de stock', 'Email de carritos abandonados', 'Chatbot de ventas']
    },
    {
      icon: Building2,
      title: 'Empresas',
      description: 'Optimiza procesos internos y comunicación',
      examples: ['Onboarding automatizado', 'Aprobaciones de documentos', 'Reportes automáticos']
    },
    {
      icon: Briefcase,
      title: 'Agencias',
      description: 'Gestiona múltiples clientes eficientemente',
      examples: ['Gestión de proyectos', 'Reportes de clientes', 'Facturación automática']
    },
    {
      icon: GraduationCap,
      title: 'Educación',
      description: 'Administra cursos y estudiantes fácilmente',
      examples: ['Inscripciones automáticas', 'Envío de materiales', 'Seguimiento de progreso']
    }
  ]

  // Comparación con competidores
  const comparison = {
    features: [
      'Precio mensual',
      'IA integrada',
      'Integraciones',
      'Soporte 24/7',
      'API completa',
      'Sin código requerido',
      'Uptime garantizado',
      'Almacenamiento'
    ],
    competitors: [
      {
        name: 'Stack21',
        values: ['$29-99', true, '50+', true, true, true, '99.9%', '50GB'],
        isUs: true
      },
      {
        name: 'Competidor A',
        values: ['$49-199', false, '30+', false, true, false, '99%', '10GB'],
        isUs: false
      },
      {
        name: 'Competidor B',
        values: ['$39-149', true, '25+', true, false, true, '98%', '20GB'],
        isUs: false
      },
      {
        name: 'Competidor C',
        values: ['$59-299', false, '40+', false, true, false, '99.5%', '30GB'],
        isUs: false
      }
    ]
  }

  // Mockups/Screenshots
  const mockups = [
    { title: 'Dashboard Principal', description: 'Vista general de todos tus proyectos', image: '🖥️' },
    { title: 'Editor Visual', description: 'Crea workflows sin código', image: '⚡' },
    { title: 'Integraciones', description: 'Conecta todas tus herramientas', image: '🔌' },
    { title: 'Analytics', description: 'Métricas en tiempo real', image: '📊' }
  ]

  return (
    <>
      <GoogleAnalytics measurementId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-XXXXXXXXXX'} />
      <Hotjar id={process.env.NEXT_PUBLIC_HOTJAR_ID || '1234567'} />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 relative">
      
      {/* Social Proof Notification */}
      {showNotification && recentSignups.length > 0 && (
        <div className="fixed bottom-8 left-8 z-50 animate-in slide-in-from-left">
          <Card className="shadow-lg border-l-4 border-green-500">
            <CardContent className="p-4 flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Bell className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="font-semibold text-sm">{recentSignups[0].name}</p>
                <p className="text-xs text-gray-600">Se unió a la lista • {recentSignups[0].time}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Progress Bar */}
      <div className="w-full bg-gradient-to-r from-blue-600 to-purple-600 py-2">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between text-white text-sm">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4" />
              <span className="font-semibold">Desarrollo: 85% completado</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="hidden md:inline">🔥 10,247 en lista de espera</span>
              <Badge variant="outline" className="bg-white/20 text-white border-white/30">
                50% OFF Early Birds
              </Badge>
            </div>
          </div>
        </div>
      </div>
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

          {/* Mockups Section */}
          <div className="mb-16">
            <h3 className="text-2xl font-bold text-center mb-4 text-gray-900">Vista previa del producto</h3>
            <p className="text-center text-gray-600 mb-8">Echa un vistazo a lo que estamos construyendo</p>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {mockups.map((mockup, index) => (
                <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow group">
                  <div className="bg-gradient-to-br from-blue-500 to-purple-600 h-48 flex items-center justify-center text-6xl group-hover:scale-105 transition-transform">
                    {mockup.image}
                  </div>
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-gray-900 mb-1">{mockup.title}</h4>
                    <p className="text-sm text-gray-600">{mockup.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Roadmap Section */}
          <div className="mb-16">
            <h3 className="text-2xl font-bold text-center mb-8 text-gray-900">Roadmap de desarrollo</h3>
            <div className="max-w-3xl mx-auto">
              <div className="relative">
                {/* Línea vertical */}
                <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-600 via-purple-600 to-gray-300"></div>
                
                <div className="space-y-8">
                  {roadmap.map((item, index) => (
                    <div key={index} className="relative flex items-start space-x-6">
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${
                        item.status === 'completed' ? 'bg-green-500' :
                        item.status === 'in-progress' ? 'bg-blue-500 animate-pulse' :
                        'bg-gray-300'
                      }`}>
                        {item.status === 'completed' ? (
                          <Check className="w-8 h-8 text-white" />
                        ) : item.status === 'in-progress' ? (
                          <Target className="w-8 h-8 text-white" />
                        ) : (
                          <Clock className="w-8 h-8 text-white" />
                        )}
                      </div>
                      <Card className="flex-1">
                        <CardContent className="p-4">
                          <Badge className="mb-2">{item.phase}</Badge>
                          <h4 className="font-bold text-lg text-gray-900 mb-1">{item.title}</h4>
                          <p className="text-sm text-gray-600">{item.date}</p>
                        </CardContent>
                      </Card>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Pricing Section */}
          <div className="mb-16">
            <div className="text-center mb-8">
              <Badge className="mb-4 bg-gradient-to-r from-orange-500 to-red-500 text-white">
                🔥 50% OFF - Solo primeros 1000 usuarios
              </Badge>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Precios especiales de lanzamiento</h3>
              <p className="text-gray-600">Asegura tu descuento de por vida hoy</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {pricingPlans.map((plan, index) => (
                <Card key={index} className={`relative overflow-hidden ${plan.popular ? 'border-2 border-blue-500 shadow-xl' : ''}`}>
                  {plan.popular && (
                    <div className="absolute top-0 right-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1 text-sm font-semibold rounded-bl-lg">
                      MÁS POPULAR
                    </div>
                  )}
                  <CardContent className="p-6">
                    <h4 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h4>
                    <p className="text-sm text-gray-600 mb-4">{plan.description}</p>
                    <div className="mb-6">
                      <div className="flex items-baseline">
                        <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                        <span className="text-gray-600 ml-1">{plan.period}</span>
                      </div>
                      {plan.originalPrice && (
                        <div className="flex items-center mt-1">
                          <span className="text-gray-400 line-through text-sm">{plan.originalPrice}/mes</span>
                          <Badge variant="outline" className="ml-2 text-green-600 border-green-600">Ahorra 50%</Badge>
                        </div>
                      )}
                    </div>
                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature, fIndex) => (
                        <li key={fIndex} className="flex items-start">
                          <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button className={`w-full ${plan.popular ? 'bg-gradient-to-r from-blue-600 to-purple-600' : ''}`}>
                      Reservar ahora
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Use Cases Section */}
          <div className="mb-16">
            <h3 className="text-2xl font-bold text-center mb-8 text-gray-900">Casos de uso</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {useCases.map((useCase, index) => (
                <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                  <CardContent className="p-0">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg flex items-center justify-center mb-4">
                      <useCase.icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <h4 className="font-bold text-gray-900 mb-2">{useCase.title}</h4>
                    <p className="text-sm text-gray-600 mb-4">{useCase.description}</p>
                    <ul className="space-y-1">
                      {useCase.examples.map((example, eIndex) => (
                        <li key={eIndex} className="text-xs text-gray-500 flex items-center">
                          <span className="w-1 h-1 bg-blue-600 rounded-full mr-2"></span>
                          {example}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Comparison Table */}
          <div className="mb-16">
            <h3 className="text-2xl font-bold text-center mb-8 text-gray-900">¿Por qué Stack21?</h3>
            <Card className="overflow-hidden max-w-4xl mx-auto">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                    <tr>
                      <th className="p-4 text-left font-semibold">Características</th>
                      {comparison.competitors.map((comp, index) => (
                        <th key={index} className={`p-4 text-center font-semibold ${comp.isUs ? 'bg-blue-700' : ''}`}>
                          {comp.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {comparison.features.map((feature, fIndex) => (
                      <tr key={fIndex} className={fIndex % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                        <td className="p-4 font-medium text-gray-900">{feature}</td>
                        {comparison.competitors.map((comp, cIndex) => (
                          <td key={cIndex} className={`p-4 text-center ${comp.isUs ? 'bg-blue-50' : ''}`}>
                            {typeof comp.values[fIndex] === 'boolean' ? (
                              comp.values[fIndex] ? (
                                <Check className="w-5 h-5 text-green-500 mx-auto" />
                              ) : (
                                <X className="w-5 h-5 text-red-500 mx-auto" />
                              )
                            ) : (
                              <span className={comp.isUs ? 'font-semibold text-blue-600' : 'text-gray-600'}>
                                {comp.values[fIndex]}
                              </span>
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>

          {/* FAQ Section */}
          <div className="mb-16">
            <h3 className="text-2xl font-bold text-center mb-8 text-gray-900">Preguntas frecuentes</h3>
            <div className="max-w-3xl mx-auto space-y-4">
              {faqs.map((faq, index) => (
                <Card key={index} className="overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="w-full text-left p-6 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-gray-900 pr-8">{faq.question}</h4>
                      {openFaq === index ? (
                        <ChevronUp className="w-5 h-5 text-gray-600 flex-shrink-0" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-600 flex-shrink-0" />
                      )}
                    </div>
                  </button>
                  {openFaq === index && (
                    <div className="px-6 pb-6">
                      <p className="text-gray-600">{faq.answer}</p>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </div>

          {/* Referral Program */}
          <div className="mb-16">
            <Card className="bg-gradient-to-r from-purple-600 to-pink-600 text-white overflow-hidden">
              <CardContent className="p-8 relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>
                <div className="relative z-10 text-center">
                  <Gift className="w-12 h-12 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold mb-2">Programa de referidos</h3>
                  <p className="mb-6 text-purple-100">Invita a tus amigos y gana 3 meses gratis por cada referido</p>
                  <div className="max-w-md mx-auto">
                    <p className="text-sm mb-3 text-purple-100">Tu código único:</p>
                    <div className="flex space-x-2">
                      <Input 
                        value={referralCode}
                        readOnly
                        className="bg-white/20 border-white/30 text-white text-center font-mono text-lg"
                      />
                      <Button 
                        onClick={copyReferralCode}
                        variant="outline" 
                        className="bg-white text-purple-600 hover:bg-purple-50"
                      >
                        {copiedCode ? <CheckCircle className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                      </Button>
                    </div>
                    {copiedCode && (
                      <p className="text-sm mt-2 text-purple-100">✓ Código copiado!</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
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
