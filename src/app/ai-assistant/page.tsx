'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Brain, 
  MessageSquare, 
  Zap, 
  Star, 
  Users, 
  TrendingUp,
  ArrowLeft,
  Settings,
  History,
  BookOpen
} from 'lucide-react'
import AgentSelector from '@/components/ai/agent-selector'
import AIChatInterface from '@/components/ai/ai-chat-interface'

interface Agent {
  id: string
  name: string
  description: string
  icon: React.ComponentType<any>
  color: string
  category: 'productivity' | 'marketing' | 'development' | 'analytics' | 'creative'
  isNew?: boolean
  isPopular?: boolean
  capabilities: string[]
  examples: string[]
  rating: number
  usage: number
}

export default function AIAssistantPage() {
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null)
  const [showAgentSelector, setShowAgentSelector] = useState(true)
  const [conversationHistory, setConversationHistory] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState('chat')
  const [showTemplates, setShowTemplates] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const handleSelectAgent = (agent: Agent) => {
    setSelectedAgent(agent)
    setShowAgentSelector(false)
  }

  const handleBackToSelector = () => {
    setShowAgentSelector(true)
    setSelectedAgent(null)
  }

  const aiTemplates = [
    {
      id: 'email-campaign',
      title: 'Campaña de Email Marketing',
      description: 'Crea una campaña completa de email marketing',
      category: 'marketing',
      prompt: 'Ayúdame a crear una campaña de email marketing para mi producto SaaS. Incluye subject lines, contenido del email y estrategia de segmentación.'
    },
    {
      id: 'workflow-optimization',
      title: 'Optimización de Workflow',
      description: 'Analiza y optimiza un workflow existente',
      category: 'productivity',
      prompt: 'Analiza mi workflow actual y sugiere mejoras para aumentar la eficiencia y reducir errores.'
    },
    {
      id: 'code-review',
      title: 'Revisión de Código',
      description: 'Revisa y mejora código JavaScript/TypeScript',
      category: 'development',
      prompt: 'Revisa este código y sugiere mejoras en términos de rendimiento, legibilidad y mejores prácticas.'
    },
    {
      id: 'data-analysis',
      title: 'Análisis de Datos',
      description: 'Analiza datos y genera insights',
      category: 'analytics',
      prompt: 'Analiza estos datos de usuario y proporciona insights sobre patrones, tendencias y recomendaciones.'
    },
    {
      id: 'content-creation',
      title: 'Creación de Contenido',
      description: 'Genera contenido para redes sociales',
      category: 'creative',
      prompt: 'Crea contenido atractivo para redes sociales sobre automatización y productividad.'
    },
    {
      id: 'business-strategy',
      title: 'Estrategia de Negocio',
      description: 'Desarrolla estrategias de crecimiento',
      category: 'productivity',
      prompt: 'Ayúdame a desarrollar una estrategia de crecimiento para mi startup SaaS.'
    }
  ]

  const recentConversations = [
    { id: 1, title: 'Optimización de Workflow', agent: 'Productivity Pro', time: '2 min ago', messages: 8 },
    { id: 2, title: 'Campaña de Email', agent: 'Marketing Master', time: '1 hora ago', messages: 12 },
    { id: 3, title: 'Análisis de Datos', agent: 'Data Analyst', time: '3 horas ago', messages: 6 },
    { id: 4, title: 'Revisión de Código', agent: 'Code Expert', time: '1 día ago', messages: 15 }
  ]

  const tabs = [
    { id: 'chat', label: 'Chat', icon: MessageSquare },
    { id: 'templates', label: 'Templates', icon: BookOpen },
    { id: 'history', label: 'Historial', icon: History },
    { id: 'settings', label: 'Config', icon: Settings }
  ]

  const handleNewConversation = () => {
    setConversationHistory([])
    setShowAgentSelector(true)
    setSelectedAgent(null)
  }

  const stats = {
    totalConversations: 47,
    totalMessages: 1234,
    averageRating: 4.7,
    timeSaved: '12.5 horas'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => window.history.back()}
                className="flex items-center"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver
              </Button>
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl">
                  <Brain className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Asistente IA</h1>
                  <p className="text-gray-600">Agentes especializados para automatizar tus tareas</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <History className="h-4 w-4 mr-2" />
                Historial
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Configuración
              </Button>
              <Button variant="outline" size="sm">
                <BookOpen className="h-4 w-4 mr-2" />
                Ayuda
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Conversaciones</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalConversations}</p>
                  </div>
                  <MessageSquare className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Mensajes</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalMessages.toLocaleString()}</p>
                  </div>
                  <Zap className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Calificación</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.averageRating}</p>
                  </div>
                  <Star className="h-8 w-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Tiempo Ahorrado</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.timeSaved}</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Agentes Disponibles</h3>
                
                <div className="space-y-3">
                  <div className="text-center">
                    <Badge className="bg-green-100 text-green-700 mb-2">10 Agentes Activos</Badge>
                    <p className="text-sm text-gray-600">
                      Selecciona un agente especializado para comenzar
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Button
                      variant={showAgentSelector ? 'default' : 'outline'}
                      className="w-full justify-start"
                      onClick={() => setShowAgentSelector(true)}
                    >
                      <Brain className="h-4 w-4 mr-2" />
                      Ver Todos los Agentes
                    </Button>
                    
                    {selectedAgent && (
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                        onClick={handleNewConversation}
                      >
                        <Zap className="h-4 w-4 mr-2" />
                        Nueva Conversación
                      </Button>
                    )}
                  </div>

                  {/* Quick Stats */}
                  <div className="pt-4 border-t border-gray-200">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Estadísticas Rápidas</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Agentes más usados:</span>
                        <span className="font-medium">Marketing</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tiempo promedio:</span>
                        <span className="font-medium">2.3 min</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Satisfacción:</span>
                        <span className="font-medium text-green-600">94%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Chat Area */}
          <div className="lg:col-span-3">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg h-[600px]">
              {showAgentSelector ? (
                <CardContent className="p-6 h-full overflow-y-auto">
                  <AgentSelector onSelectAgent={handleSelectAgent} selectedAgent={selectedAgent} />
                </CardContent>
              ) : (
                <AIChatInterface
                  selectedAgent={selectedAgent}
                  onAgentChange={handleBackToSelector}
                />
              )}
            </Card>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            ¿Por qué elegir nuestros Agentes IA?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Brain className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Especialización</h3>
                <p className="text-gray-600">
                  Cada agente está entrenado específicamente para su dominio, 
                  proporcionando respuestas más precisas y relevantes.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Velocidad</h3>
                <p className="text-gray-600">
                  Respuestas instantáneas y procesamiento en tiempo real 
                  para maximizar tu productividad.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Colaboración</h3>
                <p className="text-gray-600">
                  Trabaja en equipo con múltiples agentes especializados 
                  para proyectos complejos.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}