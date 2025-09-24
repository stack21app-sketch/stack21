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
  Star,
  Rocket,
  Globe,
  Lock,
  Code,
  Palette,
  BarChart,
  PieChart,
  Activity
} from 'lucide-react'

const coreFeatures = [
  {
    id: 'multi-tenant',
    name: 'Automatización Multi-tenant',
    description: 'Gestiona múltiples organizaciones con IA personalizada para cada workspace.',
    icon: Building,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    features: ['IA personalizada por workspace', 'Datos completamente aislados', 'Configuraciones independientes', 'Escalabilidad ilimitada']
  },
  {
    id: 'auth',
    name: 'Autenticación Segura',
    description: 'Google y GitHub OAuth integrados con NextAuth.js para máxima seguridad.',
    icon: Shield,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    features: ['OAuth 2.0 completo', 'Sesiones seguras', 'Múltiples proveedores', 'Cumplimiento GDPR']
  },
  {
    id: 'billing',
    name: 'Facturación Inteligente',
    description: 'Sistema de facturación robusto con Stripe para suscripciones y pagos.',
    icon: Target,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
    features: ['Integración Stripe completa', 'Suscripciones automáticas', 'Gestión de clientes', 'Reportes financieros']
  },
  {
    id: 'ai',
    name: 'IA Avanzada',
    description: 'GPT-4 y DALL-E integrados para automatización y generación de contenido.',
    icon: Brain,
    color: 'text-pink-600',
    bgColor: 'bg-pink-100',
    features: ['GPT-4 y DALL-E', 'Generación de código', 'Creación de imágenes', 'Análisis de texto']
  },
  {
    id: 'workflows',
    name: 'Workflows Automatizados',
    description: 'Crea y ejecuta workflows complejos con módulos personalizables.',
    icon: Workflow,
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
    features: ['Constructor visual', 'Triggers automáticos', 'Módulos personalizables', 'Ejecución en tiempo real']
  },
  {
    id: 'scalable',
    name: 'Escalabilidad Total',
    description: 'Next.js 14, Prisma, PostgreSQL y TypeScript para máximo rendimiento.',
    icon: Rocket,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-100',
    features: ['Next.js 14', 'Prisma ORM', 'PostgreSQL', 'TypeScript']
  }
]

const uniqueFeatures = [
  {
    id: 'ai-assistant',
    name: 'Asistente de IA por Industria',
    description: 'IA especializada que se adapta a tu sector específico para darte respuestas más precisas y relevantes.',
    icon: Brain,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    badge: 'Exclusivo',
    industries: ['E-commerce', 'SaaS', 'Consultoría', 'Inmobiliaria', 'Salud', 'Educación'],
    benefits: [
      '6 industrias especializadas',
      'Prompts predefinidos por sector',
      'Respuestas contextualizadas',
      'Historial inteligente de conversaciones'
    ]
  },
  {
    id: 'workflow-builder',
    name: 'Constructor de Workflows Visual',
    description: 'Crea automatizaciones complejas arrastrando y soltando nodos. Sin código requerido.',
    icon: Workflow,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    badge: 'Visual',
    nodeTypes: ['Triggers', 'Actions', 'Logic', 'AI', 'Database', 'Webhooks'],
    benefits: [
      'Interfaz drag & drop intuitiva',
      '8 tipos de nodos diferentes',
      'Configuración visual de nodos',
      'Ejecución en tiempo real'
    ]
  },
  {
    id: 'business-intelligence',
    name: 'Inteligencia de Negocio',
    description: 'Insights automáticos y análisis predictivo para optimizar tu negocio con IA.',
    icon: BarChart3,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
    badge: 'IA',
    insights: ['Oportunidades de crecimiento', 'Alertas de riesgo', 'Predicciones de mercado', 'Recomendaciones estratégicas'],
    benefits: [
      'Insights automáticos con IA',
      'Análisis predictivo avanzado',
      'Recomendaciones estratégicas',
      'Métricas en tiempo real'
    ]
  }
]

const additionalFeatures = [
  {
    name: 'Seguridad Enterprise',
    description: 'Encriptación de extremo a extremo y cumplimiento GDPR',
    icon: Lock,
    color: 'text-red-600'
  },
  {
    name: 'Multi-región',
    description: 'Despliegue global con CDN y bases de datos distribuidas',
    icon: Globe,
    color: 'text-blue-600'
  },
  {
    name: 'Base de Datos',
    description: 'PostgreSQL con Prisma ORM para consultas optimizadas',
    icon: Database,
    color: 'text-green-600'
  },
  {
    name: 'API REST',
    description: 'API completa con documentación automática y rate limiting',
    icon: Code,
    color: 'text-purple-600'
  },
  {
    name: 'Temas Personalizables',
    description: 'Sistema de temas completo con modo oscuro y personalización',
    icon: Palette,
    color: 'text-pink-600'
  },
  {
    name: 'Analytics Avanzados',
    description: 'Dashboard completo con métricas y reportes detallados',
    icon: BarChart,
    color: 'text-orange-600'
  }
]

export default function FeaturesPage() {
  const [activeFeature, setActiveFeature] = useState('ai-assistant')

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <Badge variant="secondary" className="mb-4 text-sm bg-white/20 text-white border-white/30">
            <Sparkles className="w-4 h-4 mr-2" />
            Funcionalidades Únicas
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Todo lo que necesitas para
            <span className="block bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              automatizar tu negocio
            </span>
          </h1>
          <p className="text-xl opacity-90 max-w-3xl mx-auto mb-8">
            Stack21 combina las mejores tecnologías con funcionalidades exclusivas que la competencia no tiene.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signin">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
                Comenzar Gratis
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/demo">
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 bg-transparent border-white text-white hover:bg-white hover:text-blue-600">
                <Play className="mr-2 h-5 w-5" />
                Ver Demo
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Core Features */}
      <div className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Características Principales
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Todo lo que necesitas para construir y escalar tu SaaS
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {coreFeatures.map((feature) => (
              <Card key={feature.id} className="h-full hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-3 mb-4">
                    <div className={`w-12 h-12 rounded-lg ${feature.bgColor} flex items-center justify-center`}>
                      <feature.icon className={`h-6 w-6 ${feature.color}`} />
                    </div>
                    <CardTitle className="text-xl">{feature.name}</CardTitle>
                  </div>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {feature.features.map((item, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm text-gray-600">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Unique Features */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Funcionalidades Exclusivas de Stack21
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Características únicas que la competencia no tiene
            </p>
          </div>

          {/* Feature Tabs */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {uniqueFeatures.map((feature) => (
              <Button
                key={feature.id}
                variant={activeFeature === feature.id ? 'default' : 'outline'}
                onClick={() => setActiveFeature(feature.id)}
                className="flex items-center space-x-2"
              >
                <feature.icon className="h-5 w-5" />
                <span>{feature.name}</span>
                <Badge variant="secondary" className="ml-2">
                  {feature.badge}
                </Badge>
              </Button>
            ))}
          </div>

          {/* Feature Details */}
          {uniqueFeatures.map((feature) => (
            activeFeature === feature.id && (
              <div key={feature.id} className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <div className="flex items-center space-x-3 mb-6">
                    <div className={`w-12 h-12 rounded-lg ${feature.bgColor} flex items-center justify-center`}>
                      <feature.icon className={`h-6 w-6 ${feature.color}`} />
                    </div>
                    <div>
                      <h3 className="text-3xl font-bold text-gray-900">{feature.name}</h3>
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
                      <span className="font-semibold text-blue-800">Ventaja Competitiva</span>
                    </div>
                    <p className="text-blue-700 text-sm">
                      {feature.id === 'ai-assistant' && 'Ninguna plataforma ofrece IA especializada por industria'}
                      {feature.id === 'workflow-builder' && 'Constructor visual único sin código requerido'}
                      {feature.id === 'business-intelligence' && 'Análisis predictivo automático con IA'}
                    </p>
                  </div>

                  <Link href={`/dashboard/${feature.id}`}>
                    <Button size="lg" className="w-full sm:w-auto">
                      Probar {feature.name}
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
                              Industrias disponibles:
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                              {feature.industries?.map((industry, index) => (
                                <div
                                  key={index}
                                  className="p-3 rounded-lg border-2 border-blue-200 bg-blue-50 cursor-pointer hover:bg-blue-100 transition-colors"
                                >
                                  <div className="flex items-center space-x-2">
                                    <span className="text-lg">
                                      {industry === 'E-commerce' && '🛒'}
                                      {industry === 'SaaS' && '💻'}
                                      {industry === 'Consultoría' && '📊'}
                                      {industry === 'Inmobiliaria' && '🏠'}
                                      {industry === 'Salud' && '🏥'}
                                      {industry === 'Educación' && '🎓'}
                                    </span>
                                    <span className="text-sm font-medium">{industry}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
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
                              Tipos de nodos:
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                              {feature.nodeTypes?.map((node, index) => (
                                <div
                                  key={index}
                                  className="p-3 rounded-lg border-2 border-green-200 bg-green-50 cursor-pointer hover:bg-green-100 transition-colors"
                                >
                                  <div className="flex items-center space-x-2">
                                    <span className="text-lg">
                                      {node === 'Triggers' && '⚡'}
                                      {node === 'Actions' && '🎬'}
                                      {node === 'Logic' && '🧠'}
                                      {node === 'AI' && '🤖'}
                                      {node === 'Database' && '🗄️'}
                                      {node === 'Webhooks' && '🔗'}
                                    </span>
                                    <span className="text-sm font-medium">{node}</span>
                                  </div>
                                </div>
                              ))}
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
                              Tipos de insights:
                            </label>
                            <div className="space-y-2">
                              {feature.insights?.map((insight, index) => (
                                <div
                                  key={index}
                                  className="p-3 rounded-lg border border-purple-200 bg-purple-50"
                                >
                                  <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">{insight}</span>
                                    <Badge variant="outline" className="text-xs">
                                      {85 + index * 3}%
                                    </Badge>
                                  </div>
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
        </div>
      </div>

      {/* Additional Features */}
      <div className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Características Adicionales
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Todo lo que necesitas para un SaaS completo y profesional
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {additionalFeatures.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className={`w-16 h-16 rounded-full ${feature.color.replace('text-', 'bg-').replace('-600', '-100')} flex items-center justify-center mx-auto mb-4`}>
                    <feature.icon className={`h-8 w-8 ${feature.color}`} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.name}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            ¿Listo para automatizar tu negocio?
          </h2>
          <p className="text-xl opacity-90 mb-8 max-w-3xl mx-auto">
            Únete a los primeros usuarios de Stack21 y descubre funcionalidades que la competencia no tiene.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signin">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
                Comenzar Gratis
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/demo">
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 bg-transparent border-white text-white hover:bg-white hover:text-blue-600">
                <Play className="mr-2 h-5 w-5" />
                Ver Demo Completo
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
