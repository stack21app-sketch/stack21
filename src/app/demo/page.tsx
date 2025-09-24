'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Brain, 
  Workflow, 
  BarChart3, 
  Zap, 
  Target, 
  Users, 
  Shield, 
  Clock,
  CheckCircle,
  ArrowRight,
  Play,
  Sparkles,
  TrendingUp,
  Lightbulb,
  Settings,
  Database,
  Webhook,
  Mail,
  FileText,
  Building,
  Eye,
  Star
} from 'lucide-react'

const features = [
  {
    id: 'ai-assistant',
    title: 'Asistente de IA por Industria',
    description: 'IA especializada que se adapta a tu sector específico para darte respuestas más precisas y relevantes.',
    icon: Brain,
    color: 'bg-blue-500',
    badge: 'Exclusivo',
    benefits: [
      '6 industrias especializadas',
      'Prompts predefinidos por sector',
      'Respuestas contextualizadas',
      'Historial inteligente'
    ],
    demo: 'Selecciona tu industria y prueba prompts específicos',
    href: '/dashboard/ai-assistant'
  },
  {
    id: 'workflow-builder',
    title: 'Constructor de Workflows Visual',
    description: 'Crea automatizaciones complejas arrastrando y soltando nodos. Sin código requerido.',
    icon: Workflow,
    color: 'bg-green-500',
    badge: 'Visual',
    benefits: [
      'Interfaz drag & drop',
      '8 tipos de nodos diferentes',
      'Ejecución en tiempo real',
      'Exportación/importación'
    ],
    demo: 'Arrastra nodos para crear tu primera automatización',
    href: '/dashboard/workflow-builder'
  },
  {
    id: 'business-intelligence',
    title: 'Inteligencia de Negocio',
    description: 'Insights automáticos y análisis predictivo para optimizar tu negocio con IA.',
    icon: BarChart3,
    color: 'bg-purple-500',
    badge: 'IA',
    benefits: [
      'Insights automáticos',
      'Análisis predictivo',
      'Recomendaciones estratégicas',
      'Métricas en tiempo real'
    ],
    demo: 'Ve insights automáticos y predicciones de crecimiento',
    href: '/dashboard/business-intelligence'
  }
]

const industries = [
  { name: 'E-commerce', icon: '🛒', color: 'bg-blue-100 text-blue-800' },
  { name: 'SaaS', icon: '💻', color: 'bg-green-100 text-green-800' },
  { name: 'Consultoría', icon: '📊', color: 'bg-purple-100 text-purple-800' },
  { name: 'Inmobiliaria', icon: '🏠', color: 'bg-orange-100 text-orange-800' },
  { name: 'Salud', icon: '🏥', color: 'bg-red-100 text-red-800' },
  { name: 'Educación', icon: '🎓', color: 'bg-indigo-100 text-indigo-800' }
]

const workflowNodes = [
  { name: 'Trigger', icon: '⚡', color: 'bg-green-500' },
  { name: 'Email', icon: '📧', color: 'bg-blue-500' },
  { name: 'Webhook', icon: '🔗', color: 'bg-purple-500' },
  { name: 'IA', icon: '🤖', color: 'bg-pink-500' },
  { name: 'Database', icon: '🗄️', color: 'bg-orange-500' },
  { name: 'Delay', icon: '⏱️', color: 'bg-gray-500' }
]

const insights = [
  {
    type: 'opportunity',
    title: 'Oportunidad de Crecimiento',
    description: 'Tus usuarios más activos están en el segmento de 25-35 años.',
    impact: 'high',
    confidence: 87
  },
  {
    type: 'warning',
    title: 'Tasa de Abandono Aumentando',
    description: 'La tasa de abandono en el checkout ha aumentado un 15%.',
    impact: 'high',
    confidence: 92
  },
  {
    type: 'success',
    title: 'Conversión Mejorada',
    description: 'La nueva página de landing ha aumentado las conversiones en un 34%.',
    impact: 'high',
    confidence: 95
  }
]

export default function DemoPage() {
  const [activeFeature, setActiveFeature] = useState('ai-assistant')

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100">
      {/* Header */}
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4 text-sm">
            <Sparkles className="w-4 h-4 mr-2" />
            Funcionalidades Exclusivas
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Descubre las
            <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              {' '}Funcionalidades Únicas{' '}
            </span>
            de Stack21
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Funcionalidades que la competencia no tiene. Diseñadas para darte una ventaja competitiva real.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signin">
              <Button size="lg" className="text-lg px-8 py-6">
                Probar Ahora
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="text-lg px-8 py-6">
              <Play className="mr-2 h-5 w-5" />
              Ver Demo
            </Button>
          </div>
        </div>

        {/* Feature Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {features.map((feature) => (
            <Button
              key={feature.id}
              variant={activeFeature === feature.id ? 'default' : 'outline'}
              onClick={() => setActiveFeature(feature.id)}
              className="flex items-center space-x-2"
            >
              <feature.icon className="h-5 w-5" />
              <span>{feature.title}</span>
              <Badge variant="secondary" className="ml-2">
                {feature.badge}
              </Badge>
            </Button>
          ))}
        </div>

        {/* Feature Details */}
        {features.map((feature) => (
          activeFeature === feature.id && (
            <div key={feature.id} className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="flex items-center space-x-3 mb-6">
                  <div className={`w-12 h-12 rounded-lg ${feature.color} flex items-center justify-center text-white`}>
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900">{feature.title}</h2>
                    <Badge variant="secondary" className="mt-1">
                      ✨ Exclusivo de Stack21
                    </Badge>
                  </div>
                </div>
                
                <p className="text-lg text-gray-600 mb-6">{feature.description}</p>
                
                <div className="space-y-3 mb-8">
                  {feature.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span className="text-gray-700">{benefit}</span>
                    </div>
                  ))}
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center space-x-2 mb-2">
                    <Lightbulb className="h-5 w-5 text-blue-600" />
                    <span className="font-semibold text-blue-800">Demo Interactivo</span>
                  </div>
                  <p className="text-blue-700 text-sm">{feature.demo}</p>
                </div>

                <Link href={feature.href}>
                  <Button size="lg" className="w-full sm:w-auto">
                    Probar {feature.title}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>

              <div className="relative">
                {feature.id === 'ai-assistant' && (
                  <Card className="overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                      <CardTitle className="flex items-center">
                        <Brain className="mr-2 h-5 w-5" />
                        Asistente IA por Industria
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-2 block">
                            Selecciona tu industria:
                          </label>
                          <div className="grid grid-cols-2 gap-2">
                            {industries.map((industry, index) => (
                              <div
                                key={index}
                                className={`p-3 rounded-lg border-2 border-blue-200 bg-blue-50 cursor-pointer hover:bg-blue-100 transition-colors`}
                              >
                                <div className="flex items-center space-x-2">
                                  <span className="text-lg">{industry.icon}</span>
                                  <span className="text-sm font-medium">{industry.name}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <p className="text-sm text-gray-600 mb-2">Prompt sugerido:</p>
                          <p className="text-sm font-medium">"Optimiza mi estrategia de SEO para productos"</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {feature.id === 'workflow-builder' && (
                  <Card className="overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-green-500 to-blue-500 text-white">
                      <CardTitle className="flex items-center">
                        <Workflow className="mr-2 h-5 w-5" />
                        Constructor Visual
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-2 block">
                            Nodos disponibles:
                          </label>
                          <div className="grid grid-cols-3 gap-2">
                            {workflowNodes.map((node, index) => (
                              <div
                                key={index}
                                className="p-3 rounded-lg border-2 border-green-200 bg-green-50 cursor-pointer hover:bg-green-100 transition-colors"
                              >
                                <div className="flex items-center space-x-2">
                                  <div className={`w-6 h-6 rounded ${node.color} flex items-center justify-center text-white text-sm`}>
                                    {node.icon}
                                  </div>
                                  <span className="text-sm font-medium">{node.name}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <p className="text-sm text-gray-600 mb-2">Canvas del workflow:</p>
                          <div className="h-32 bg-white border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                            <span className="text-gray-500 text-sm">Arrastra nodos aquí</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {feature.id === 'business-intelligence' && (
                  <Card className="overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                      <CardTitle className="flex items-center">
                        <BarChart3 className="mr-2 h-5 w-5" />
                        Inteligencia de Negocio
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-2 block">
                            Insights automáticos:
                          </label>
                          <div className="space-y-2">
                            {insights.map((insight, index) => (
                              <div
                                key={index}
                                className={`p-3 rounded-lg border ${
                                  insight.type === 'opportunity' ? 'border-yellow-200 bg-yellow-50' :
                                  insight.type === 'warning' ? 'border-red-200 bg-red-50' :
                                  'border-green-200 bg-green-50'
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <span className="text-sm font-medium">{insight.title}</span>
                                  <Badge variant="outline" className="text-xs">
                                    {insight.confidence}%
                                  </Badge>
                                </div>
                                <p className="text-xs text-gray-600 mt-1">{insight.description}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          )
        ))}

        {/* Comparison Section */}
        <div className="mt-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              ¿Por qué elegir Stack21?
            </h2>
            <p className="text-lg text-gray-600">
              Compara Stack21 con otras plataformas del mercado
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-2 border-gray-200">
              <CardHeader>
                <CardTitle className="text-center">Otras Plataformas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-sm">IA básica</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-sm">Workflows simples</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-sm">Analytics básicos</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-sm">Integraciones limitadas</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-blue-500 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-blue-500 text-white">Recomendado</Badge>
              </div>
              <CardHeader>
                <CardTitle className="text-center text-blue-600">Stack21</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  <span className="text-sm font-medium">IA especializada por industria</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  <span className="text-sm font-medium">Constructor visual de workflows</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  <span className="text-sm font-medium">Inteligencia de negocio con IA</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  <span className="text-sm font-medium">Integraciones ilimitadas</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  <span className="text-sm font-medium">Análisis predictivo</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  <span className="text-sm font-medium">Recomendaciones automáticas</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-gray-200">
              <CardHeader>
                <CardTitle className="text-center">Enterprise</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-sm">IA avanzada</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-sm">Workflows complejos</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-sm">Analytics avanzados</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-sm">Soporte 24/7</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-gray-400" />
                  <span className="text-sm text-gray-500">Configuración compleja</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-gray-400" />
                  <span className="text-sm text-gray-500">Costo elevado</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-24 text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-white">
            <h2 className="text-3xl font-bold mb-4">
              ¿Listo para tener la ventaja competitiva?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Únete a los primeros usuarios de Stack21 y descubre funcionalidades que la competencia no tiene.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/signin">
                <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
                  Comenzar Gratis
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 bg-transparent border-white text-white hover:bg-white hover:text-blue-600">
                <Play className="mr-2 h-5 w-5" />
                Ver Demo Completo
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
