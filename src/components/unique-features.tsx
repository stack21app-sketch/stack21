'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Brain, 
  Zap, 
  Users, 
  Target, 
  BarChart3, 
  Sparkles,
  Shield,
  Globe,
  Rocket,
  Star,
  CheckCircle
} from 'lucide-react'

export function UniqueFeatures() {
  const features = [
    {
      category: "Inteligencia Artificial",
      items: [
        { feature: "Asistente IA por industria", description: "Especializado en tu sector específico", exclusive: true },
        { feature: "Generación automática de workflows", description: "Crea automatizaciones con lenguaje natural", exclusive: true },
        { feature: "Predicciones inteligentes", description: "Anticipa tendencias y optimiza campañas", exclusive: true },
        { feature: "Optimización automática", description: "Mejora continuamente tus procesos", exclusive: true },
        { feature: "Análisis de sentimientos", description: "Comprende emociones en tiempo real", exclusive: true },
      ]
    },
    {
      category: "Experiencia de Usuario",
      items: [
        { feature: "Setup en 45 minutos", description: "Configuración completa en menos de una hora", exclusive: true },
        { feature: "Interfaz drag & drop visual", description: "Constructor intuitivo sin código", exclusive: false },
        { feature: "Onboarding guiado por IA", description: "Aprendizaje personalizado y adaptativo", exclusive: true },
        { feature: "Curva de aprendizaje de 1 día", description: "Dominio completo en 24 horas", exclusive: true },
        { feature: "Soporte 24/7 con IA", description: "Asistencia inteligente siempre disponible", exclusive: true },
      ]
    },
    {
      category: "Precios y Valor",
      items: [
        { feature: "Planes desde $47/mes", description: "Acceso completo sin restricciones", exclusive: true },
        { feature: "Sin contratos anuales", description: "Flexibilidad total de pago", exclusive: true },
        { feature: "Precios transparentes", description: "Sin costos ocultos ni sorpresas", exclusive: true },
        { feature: "Escalabilidad ilimitada", description: "Crece sin límites ni penalizaciones", exclusive: true },
        { feature: "Garantía de satisfacción", description: "30 días de prueba sin compromiso", exclusive: true },
      ]
    },
    {
      category: "Características Exclusivas",
      items: [
        { feature: "Marketplace de módulos", description: "Ecosistema de integraciones personalizadas", exclusive: true },
        { feature: "Gamificación para equipos", description: "Motivación y engagement con recompensas", exclusive: true },
        { feature: "Analytics predictivos", description: "Inteligencia de negocio con IA", exclusive: true },
        { feature: "300+ integraciones nativas", description: "Conecta con todas tus herramientas", exclusive: true },
        { feature: "White-label completo", description: "Personaliza completamente la marca", exclusive: false },
      ]
    }
  ]

  return (
    <div className="py-20 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Características que nos hacen únicos
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Descubre las características exclusivas que hacen de Stack21 la plataforma 
            de automatización más avanzada y completa del mercado.
          </p>
        </div>

        <div className="space-y-8">
          {features.map((category, categoryIndex) => (
            <Card key={categoryIndex} className="bg-white/5 backdrop-blur-xl border-white/10">
              <CardHeader>
                <CardTitle className="text-white text-2xl flex items-center">
                  <Sparkles className="h-6 w-6 mr-3 text-purple-400" />
                  {category.category}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {category.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex items-start space-x-4 p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-all duration-300">
                      <div className="flex-shrink-0">
                        {item.exclusive ? (
                          <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
                            <Star className="h-3 w-3 mr-1" />
                            Exclusivo
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-gray-400 border-gray-400">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Estándar
                          </Badge>
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-white font-semibold mb-1">{item.feature}</h4>
                        <p className="text-gray-300 text-sm">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <h3 className="text-3xl font-bold text-white mb-6">
            ¿Listo para experimentar la diferencia?
          </h3>
          <p className="text-xl text-gray-300 mb-8">
            Únete a miles de empresas que ya eligieron la plataforma más avanzada
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold rounded-xl shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105">
              <Rocket className="h-5 w-5 mr-2 inline" />
              Empezar gratis
            </button>
            <button className="px-8 py-4 border border-white/30 text-white hover:bg-white/10 rounded-xl transition-all duration-300 hover:scale-105">
              Ver demo
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
