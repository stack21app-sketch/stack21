'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Brain, 
  Zap, 
  DollarSign, 
  Clock, 
  Users, 
  Target, 
  BarChart3, 
  Sparkles,
  ArrowRight,
  CheckCircle,
  Star,
  Rocket,
  Shield,
  Globe
} from 'lucide-react'

export function Stack21Advantages() {
  const advantages = [
    {
      icon: Brain,
      title: "IA Avanzada por Industria",
      description: "Asistente IA especializado que entiende tu sector específico y automatiza tareas complejas",
      benefit: "3x más efectivo",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Zap,
      title: "Setup en 45 Minutos",
      description: "Configuración completa de tu plataforma en menos de una hora",
      benefit: "10x más rápido",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: DollarSign,
      title: "Precios Transparentes",
      description: "Planes claros desde $47/mes sin costos ocultos ni contratos anuales",
      benefit: "Ahorra $600/año",
      color: "from-yellow-500 to-orange-500"
    },
    {
      icon: Users,
      title: "Gamificación para Equipos",
      description: "Motiva a tu equipo con puntos, niveles y recompensas por productividad",
      benefit: "40% más productividad",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: Target,
      title: "Workflows Visuales Intuitivos",
      description: "Constructor drag & drop con IA integrada para crear automatizaciones complejas",
      benefit: "5x más fácil",
      color: "from-indigo-500 to-blue-500"
    },
    {
      icon: BarChart3,
      title: "Analytics Predictivos",
      description: "Predicciones de conversión y optimización automática con inteligencia artificial",
      benefit: "2x más conversiones",
      color: "from-teal-500 to-green-500"
    }
  ]

  const stats = [
    { label: "Tiempo de Setup", value: "45 min", description: "Configuración completa" },
    { label: "Precio Mensual", value: "$47", description: "Plan más accesible" },
    { label: "Integraciones", value: "300+", description: "Herramientas conectadas" },
    { label: "Curva de Aprendizaje", value: "1 día", description: "Dominio completo" },
    { label: "Soporte IA", value: "24/7", description: "Asistencia avanzada" },
    { label: "Personalización", value: "Ilimitada", description: "Sin restricciones" }
  ]

  return (
    <div className="py-20 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white">
            <Sparkles className="h-4 w-4 mr-2" />
            Ventajas Únicas
          </Badge>
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            ¿Por qué elegir Stack21?
          </h2>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto">
            La plataforma de automatización más avanzada del mercado con IA de última generación, 
            precios justos y características únicas que no encontrarás en ningún otro lugar.
          </p>
        </div>

        {/* Advantages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {advantages.map((advantage, index) => (
            <Card key={index} className="bg-white/5 backdrop-blur-xl border-white/10 hover:bg-white/10 transition-all duration-300 group">
              <CardHeader>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${advantage.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <advantage.icon className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-white text-xl">{advantage.title}</CardTitle>
                <p className="text-gray-300 text-sm">{advantage.description}</p>
              </CardHeader>
              <CardContent>
                <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
                  {advantage.benefit}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats */}
        <Card className="bg-white/5 backdrop-blur-xl border-white/10 mb-16">
          <CardHeader>
            <CardTitle className="text-white text-2xl text-center">Números que Hablan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="text-center p-6 bg-white/5 rounded-xl">
                  <div className="text-sm text-gray-400 mb-2">{stat.label}</div>
                  <div className="text-green-400 font-bold text-2xl mb-1">{stat.value}</div>
                  <div className="text-gray-300 text-sm">{stat.description}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <Card className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 border-blue-500/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Star className="h-5 w-5 mr-2 text-yellow-400" />
                Testimonio de Cliente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <blockquote className="text-white text-lg mb-4">
                "Stack21 revolucionó mi negocio. En 2 semanas ya tenía mejores resultados que con 
                cualquier otra plataforma. La IA me ayudó a optimizar todo automáticamente."
              </blockquote>
              <div className="text-gray-300">
                <div className="font-semibold">María González</div>
                <div className="text-sm">CEO, TechStart - +300% conversiones</div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-green-500/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <CheckCircle className="h-5 w-5 mr-2 text-green-400" />
                Caso de Éxito
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-white">Tiempo de setup:</span>
                  <span className="text-green-400 font-bold">45 minutos</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white">Costo mensual:</span>
                  <span className="text-green-400 font-bold">$47</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white">Conversiones:</span>
                  <span className="text-green-400 font-bold">+250%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white">Satisfacción:</span>
                  <span className="text-green-400 font-bold">9.5/10</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">
            ¿Listo para revolucionar tu negocio?
          </h3>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Únete a miles de empresas que ya eligieron la plataforma más avanzada del mercado
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="group text-lg px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold rounded-xl shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105">
              <Rocket className="h-5 w-5 mr-2 group-hover:rotate-12 transition-transform duration-300" />
              Empezar gratis ahora
              <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
            </Button>
            <Button variant="outline" size="lg" className="group text-lg px-8 py-4 border-white/30 text-white hover:bg-white/10 rounded-xl transition-all duration-300 hover:scale-105">
              Ver demo en vivo
            </Button>
          </div>
          <p className="text-sm text-gray-400 mt-4">
            Sin tarjeta de crédito • Setup en 45 minutos • Soporte 24/7
          </p>
        </div>
      </div>
    </div>
  )
}
