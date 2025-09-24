'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Brain, 
  Zap, 
  Target, 
  BarChart3, 
  Clock, 
  CheckCircle, 
  ArrowRight,
  Play,
  Pause,
  Settings,
  Users,
  Shield,
  DollarSign,
  TrendingUp,
  Lightbulb,
  Workflow,
  MessageSquare,
  Database,
  Mail,
  Calendar,
  FileText,
  Image,
  Music,
  Video,
  Globe,
  Smartphone,
  CreditCard,
  Lock,
  Eye,
  Star,
  Award,
  Rocket
} from 'lucide-react'

export default function DemoN8nPage() {
  const [activeTab, setActiveTab] = useState('comparison')
  const [isRunning, setIsRunning] = useState(false)

  const features = [
    {
      icon: Brain,
      title: 'IA Integrada',
      description: 'GPT-4 + modelos personalizados',
      n8n: '❌ No',
      stack21: '✅ Sí',
      advantage: 'Revolucionario'
    },
    {
      icon: Users,
      title: 'Multi-tenant',
      description: 'Workspaces aislados con IA personalizada',
      n8n: '❌ Instancia única',
      stack21: '✅ Multi-tenant',
      advantage: '10x mejor'
    },
    {
      icon: Zap,
      title: 'Performance',
      description: 'Ejecución optimizada con IA',
      n8n: '5-10 segundos',
      stack21: '1-2 segundos',
      advantage: '5x más rápido'
    },
    {
      icon: Target,
      title: 'Facilidad de Uso',
      description: 'Interfaz intuitiva con drag-and-drop',
      n8n: 'Compleja',
      stack21: 'Intuitiva',
      advantage: '5x más fácil'
    },
    {
      icon: DollarSign,
      title: 'Pricing',
      description: 'Modelo de pago por uso',
      n8n: '$20-50/mes fijo',
      stack21: '$0.01/ejecución',
      advantage: '70% más barato'
    },
    {
      icon: Shield,
      title: 'Seguridad',
      description: 'Enterprise-grade security',
      n8n: 'Básica',
      stack21: 'Avanzada',
      advantage: '10x más seguro'
    }
  ]

  const workflows = [
    {
      title: 'Procesamiento de Leads',
      description: 'Automatiza el procesamiento de leads con IA',
      n8n: {
        steps: 8,
        time: '2-3 horas',
        complexity: 'Alta',
        errors: '15-20%'
      },
      stack21: {
        steps: 3,
        time: '15 minutos',
        complexity: 'Baja',
        errors: '2-3%'
      }
    },
    {
      title: 'Respuestas de Soporte',
      description: 'IA que responde automáticamente al soporte',
      n8n: {
        steps: 12,
        time: '4-6 horas',
        complexity: 'Muy Alta',
        errors: '25-30%'
      },
      stack21: {
        steps: 2,
        time: '5 minutos',
        complexity: 'Muy Baja',
        errors: '1-2%'
      }
    },
    {
      title: 'Generación de Reportes',
      description: 'Reportes automáticos con análisis de IA',
      n8n: {
        steps: 15,
        time: '6-8 horas',
        complexity: 'Extrema',
        errors: '30-40%'
      },
      stack21: {
        steps: 1,
        time: '2 minutos',
        complexity: 'Ninguna',
        errors: '0%'
      }
    }
  ]

  const runDemo = async () => {
    setIsRunning(true)
    // Simular ejecución del demo
    await new Promise(resolve => setTimeout(resolve, 3000))
    setIsRunning(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className="text-2xl font-bold text-white">Stack21</span>
                <div className="text-xs text-gray-400">vs N8n Demo</div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-300 border-green-500/30">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse" />
                Demo Activo
              </Badge>
              <Button
                onClick={runDemo}
                disabled={isRunning}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                {isRunning ? (
                  <>
                    <Pause className="h-4 w-4 mr-2" />
                    Ejecutando...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Ejecutar Demo
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-6xl md:text-7xl font-bold text-white mb-8 leading-tight">
            Stack21 vs
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              {' '}N8n
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
            La próxima generación de automatización de workflows con IA integrada.
            <br />
            <span className="text-purple-400 font-semibold">5x más rápido, 10x más inteligente, 70% más barato.</span>
          </p>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-4xl mx-auto mb-16">
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">5x</div>
              <p className="text-gray-400">Más rápido</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">10x</div>
              <p className="text-gray-400">Más inteligente</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">70%</div>
              <p className="text-gray-400">Más barato</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">∞</div>
              <p className="text-gray-400">Posibilidades</p>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <section className="py-8 bg-black/20">
        <div className="container mx-auto px-4">
          <div className="flex justify-center space-x-4">
            {[
              { id: 'comparison', label: 'Comparación', icon: BarChart3 },
              { id: 'workflows', label: 'Workflows', icon: Workflow },
              { id: 'demo', label: 'Demo en Vivo', icon: Play }
            ].map((tab) => (
              <Button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                variant={activeTab === tab.id ? 'default' : 'outline'}
                className={activeTab === tab.id 
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600' 
                  : 'border-white/30 text-white hover:bg-white/10'
                }
              >
                <tab.icon className="h-4 w-4 mr-2" />
                {tab.label}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          {activeTab === 'comparison' && (
            <div className="max-w-6xl mx-auto">
              <h2 className="text-4xl font-bold text-white text-center mb-12">
                Comparación de Características
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {features.map((feature, index) => (
                  <Card key={index} className="bg-white/5 backdrop-blur-sm border-white/10 hover:border-white/20 transition-all">
                    <CardHeader>
                      <div className="flex items-center space-x-3">
                        <div className={`w-12 h-12 ${feature.icon === Brain ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-blue-500'} rounded-lg flex items-center justify-center`}>
                          <feature.icon className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-white text-lg">{feature.title}</CardTitle>
                          <p className="text-gray-400 text-sm">{feature.description}</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-300">N8n:</span>
                          <span className="text-red-400">{feature.n8n}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-300">Stack21:</span>
                          <span className="text-green-400">{feature.stack21}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-300">Ventaja:</span>
                          <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                            {feature.advantage}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'workflows' && (
            <div className="max-w-6xl mx-auto">
              <h2 className="text-4xl font-bold text-white text-center mb-12">
                Comparación de Workflows
              </h2>
              
              <div className="space-y-8">
                {workflows.map((workflow, index) => (
                  <Card key={index} className="bg-white/5 backdrop-blur-sm border-white/10">
                    <CardHeader>
                      <CardTitle className="text-white text-2xl">{workflow.title}</CardTitle>
                      <p className="text-gray-400">{workflow.description}</p>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* N8n */}
                        <div className="space-y-4">
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
                              <span className="text-white font-bold">N</span>
                            </div>
                            <h3 className="text-xl font-semibold text-white">N8n</h3>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-gray-400">Pasos:</span>
                              <span className="text-red-400">{workflow.n8n.steps}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Tiempo:</span>
                              <span className="text-red-400">{workflow.n8n.time}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Complejidad:</span>
                              <span className="text-red-400">{workflow.n8n.complexity}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Errores:</span>
                              <span className="text-red-400">{workflow.n8n.errors}</span>
                            </div>
                          </div>
                        </div>

                        {/* Stack21 */}
                        <div className="space-y-4">
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                              <Zap className="h-4 w-4 text-white" />
                            </div>
                            <h3 className="text-xl font-semibold text-white">Stack21</h3>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-gray-400">Pasos:</span>
                              <span className="text-green-400">{workflow.stack21.steps}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Tiempo:</span>
                              <span className="text-green-400">{workflow.stack21.time}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Complejidad:</span>
                              <span className="text-green-400">{workflow.stack21.complexity}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Errores:</span>
                              <span className="text-green-400">{workflow.stack21.errors}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'demo' && (
            <div className="max-w-6xl mx-auto">
              <h2 className="text-4xl font-bold text-white text-center mb-12">
                Demo en Vivo
              </h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* N8n Demo */}
                <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                  <CardHeader>
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold">N</span>
                      </div>
                      <CardTitle className="text-white">N8n - Procesamiento Manual</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center">
                          <span className="text-xs text-white">1</span>
                        </div>
                        <span className="text-gray-300">Configurar webhook manualmente</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center">
                          <span className="text-xs text-white">2</span>
                        </div>
                        <span className="text-gray-300">Crear lógica de validación</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center">
                          <span className="text-xs text-white">3</span>
                        </div>
                        <span className="text-gray-300">Configurar transformación de datos</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center">
                          <span className="text-xs text-white">4</span>
                        </div>
                        <span className="text-gray-300">Conectar con CRM</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center">
                          <span className="text-xs text-white">5</span>
                        </div>
                        <span className="text-gray-300">Configurar notificaciones</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center">
                          <span className="text-xs text-white">6</span>
                        </div>
                        <span className="text-gray-300">Manejar errores manualmente</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center">
                          <span className="text-xs text-white">7</span>
                        </div>
                        <span className="text-gray-300">Testing y debugging</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center">
                          <span className="text-xs text-white">8</span>
                        </div>
                        <span className="text-gray-300">Deploy y monitoreo</span>
                      </div>
                    </div>
                    <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                      <p className="text-red-300 text-sm">
                        ⏱️ Tiempo estimado: 2-3 horas<br/>
                        🐛 Errores típicos: 15-20%<br/>
                        🔧 Complejidad: Alta
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Stack21 Demo */}
                <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                  <CardHeader>
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                        <Brain className="h-4 w-4 text-white" />
                      </div>
                      <CardTitle className="text-white">Stack21 - IA Automática</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                          <CheckCircle className="h-4 w-4 text-white" />
                        </div>
                        <span className="text-gray-300">"Procesa leads de LinkedIn automáticamente"</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                          <CheckCircle className="h-4 w-4 text-white" />
                        </div>
                        <span className="text-gray-300">IA genera workflow completo</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                          <CheckCircle className="h-4 w-4 text-white" />
                        </div>
                        <span className="text-gray-300">Auto-optimización en tiempo real</span>
                      </div>
                    </div>
                    <div className="mt-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                      <p className="text-green-300 text-sm">
                        ⏱️ Tiempo estimado: 15 minutos<br/>
                        🐛 Errores típicos: 2-3%<br/>
                        🔧 Complejidad: Baja
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* CTA */}
              <div className="text-center mt-12">
                <h3 className="text-2xl font-bold text-white mb-4">
                  ¿Listo para experimentar la diferencia?
                </h3>
                <p className="text-gray-300 mb-8">
                  Únete a la lista de espera y sé el primero en probar Stack21
                </p>
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-lg px-8 py-4"
                >
                  <Rocket className="h-5 w-5 mr-2" />
                  Unirse a la Lista de Espera
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
