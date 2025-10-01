'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Bot, 
  Brain, 
  Zap, 
  Activity, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Play, 
  Pause, 
  Settings,
  TrendingUp,
  Users,
  Mail,
  MessageSquare,
  DollarSign,
  FileText,
  Shield,
  Target
} from 'lucide-react'

interface Agent {
  id: string
  name: string
  description: string
  type: 'customer-care' | 'marketing' | 'sales' | 'finance' | 'operations' | 'security'
  status: 'active' | 'paused' | 'learning' | 'error'
  tasksCompleted: number
  successRate: number
  lastActivity: string
  icon: any
  capabilities: string[]
  currentTask?: string
  performance: {
    tasksToday: number
    avgResponseTime: string
    customerSatisfaction: number
    costSaved: string
  }
}

export default function AutonomousAgents() {
  const [agents, setAgents] = useState<Agent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simular carga de agentes
    const loadAgents = async () => {
      setLoading(true)
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const mockAgents: Agent[] = [
        {
          id: '1',
          name: 'Asistente de Soporte Clara',
          description: 'Agente IA especializado en atención al cliente que responde consultas, resuelve problemas comunes y escala casos complejos automáticamente.',
          type: 'customer-care',
          status: 'active',
          tasksCompleted: 1247,
          successRate: 94,
          lastActivity: 'Hace 2 minutos',
          icon: MessageSquare,
          capabilities: ['Respuesta automática', 'Escalamiento inteligente', 'Análisis de sentimientos', 'Base de conocimiento'],
          currentTask: 'Procesando 3 tickets de soporte',
          performance: {
            tasksToday: 47,
            avgResponseTime: '12 segundos',
            customerSatisfaction: 4.8,
            costSaved: '$2,340'
          }
        },
        {
          id: '2',
          name: 'Generador de Contenido IA',
          description: 'Crea automáticamente contenido para marketing: emails, posts de redes sociales, descripciones de productos y campañas personalizadas.',
          type: 'marketing',
          status: 'active',
          tasksCompleted: 892,
          successRate: 91,
          lastActivity: 'Hace 5 minutos',
          icon: Mail,
          capabilities: ['Generación de emails', 'Posts de redes sociales', 'Personalización', 'Optimización SEO'],
          currentTask: 'Creando campaña de email para Black Friday',
          performance: {
            tasksToday: 23,
            avgResponseTime: '8 segundos',
            customerSatisfaction: 4.6,
            costSaved: '$1,890'
          }
        },
        {
          id: '3',
          name: 'Analista de Ventas Predictivo',
          description: 'Analiza patrones de comportamiento, identifica leads calientes y sugiere estrategias de ventas basadas en datos históricos.',
          type: 'sales',
          status: 'learning',
          tasksCompleted: 634,
          successRate: 87,
          lastActivity: 'Hace 1 hora',
          icon: TrendingUp,
          capabilities: ['Análisis predictivo', 'Scoring de leads', 'Recomendaciones', 'Forecasting'],
          currentTask: 'Analizando patrones de compra Q4',
          performance: {
            tasksToday: 15,
            avgResponseTime: '45 segundos',
            customerSatisfaction: 4.7,
            costSaved: '$3,120'
          }
        },
        {
          id: '4',
          name: 'Auditor de Seguridad Digital',
          description: 'Monitorea constantemente la seguridad, detecta amenazas, revisa permisos y genera reportes de cumplimiento automáticamente.',
          type: 'security',
          status: 'active',
          tasksCompleted: 2156,
          successRate: 98,
          lastActivity: 'Hace 30 segundos',
          icon: Shield,
          capabilities: ['Detección de amenazas', 'Auditoría de permisos', 'Reportes de cumplimiento', 'Monitoreo 24/7'],
          currentTask: 'Escaneando sistema por vulnerabilidades',
          performance: {
            tasksToday: 89,
            avgResponseTime: '3 segundos',
            customerSatisfaction: 4.9,
            costSaved: '$4,500'
          }
        },
        {
          id: '5',
          name: 'Optimizador de Procesos',
          description: 'Identifica ineficiencias en workflows, sugiere mejoras y optimiza automáticamente procesos para mayor eficiencia.',
          type: 'operations',
          status: 'active',
          tasksCompleted: 445,
          successRate: 89,
          lastActivity: 'Hace 10 minutos',
          icon: Target,
          capabilities: ['Análisis de procesos', 'Optimización automática', 'Recomendaciones', 'A/B testing'],
          currentTask: 'Optimizando workflow de onboarding',
          performance: {
            tasksToday: 12,
            avgResponseTime: '2 minutos',
            customerSatisfaction: 4.5,
            costSaved: '$1,670'
          }
        },
        {
          id: '6',
          name: 'Asistente Financiero IA',
          description: 'Automatiza la gestión de facturas, conciliación bancaria, análisis de gastos y generación de reportes financieros.',
          type: 'finance',
          status: 'paused',
          tasksCompleted: 723,
          successRate: 92,
          lastActivity: 'Hace 2 horas',
          icon: DollarSign,
          capabilities: ['Procesamiento de facturas', 'Conciliación bancaria', 'Análisis de gastos', 'Reportes automáticos'],
          currentTask: 'En pausa - Esperando configuración',
          performance: {
            tasksToday: 8,
            avgResponseTime: '1 minuto',
            customerSatisfaction: 4.8,
            costSaved: '$2,890'
          }
        }
      ]
      
      setAgents(mockAgents)
      setLoading(false)
    }

    loadAgents()
  }, [])

  const getStatusColor = (status: string) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      paused: 'bg-yellow-100 text-yellow-800',
      learning: 'bg-blue-100 text-blue-800',
      error: 'bg-red-100 text-red-800'
    }
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Play className="h-4 w-4" />
      case 'paused': return <Pause className="h-4 w-4" />
      case 'learning': return <Brain className="h-4 w-4" />
      case 'error': return <AlertCircle className="h-4 w-4" />
      default: return <Bot className="h-4 w-4" />
    }
  }

  const getTypeColor = (type: string) => {
    const colors = {
      'customer-care': 'bg-pink-100 text-pink-800',
      'marketing': 'bg-purple-100 text-purple-800',
      'sales': 'bg-blue-100 text-blue-800',
      'finance': 'bg-green-100 text-green-800',
      'operations': 'bg-orange-100 text-orange-800',
      'security': 'bg-red-100 text-red-800'
    }
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const handleToggleAgent = (agentId: string) => {
    setAgents(prev => prev.map(agent => {
      if (agent.id === agentId) {
        const newStatus = agent.status === 'active' ? 'paused' : 'active'
        return { ...agent, status: newStatus }
      }
      return agent
    }))
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-blue-600">
            <Bot className="h-6 w-6 mr-2 animate-pulse" />
            Cargando Agentes Autónomos...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200"></div>
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent absolute"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const totalTasksToday = agents.reduce((sum, agent) => sum + agent.performance.tasksToday, 0)
  const totalCostSaved = agents.reduce((sum, agent) => sum + parseInt(agent.performance.costSaved.replace('$', '').replace(',', '')), 0)
  const avgSuccessRate = agents.reduce((sum, agent) => sum + agent.successRate, 0) / agents.length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center justify-center">
          <Bot className="h-8 w-8 mr-3 text-blue-600" />
          Agentes Autónomos IA
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Tus empleados digitales trabajan 24/7 para automatizar tareas, optimizar procesos y mejorar resultados sin intervención humana.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-blue-500/10 to-blue-600/10">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{totalTasksToday}</div>
            <div className="text-sm text-gray-600">Tareas Completadas Hoy</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-green-500/10 to-green-600/10">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">${totalCostSaved.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Ahorro Total Hoy</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-purple-500/10 to-purple-600/10">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{avgSuccessRate.toFixed(1)}%</div>
            <div className="text-sm text-gray-600">Tasa de Éxito Promedio</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-orange-500/10 to-orange-600/10">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">{agents.length}</div>
            <div className="text-sm text-gray-600">Agentes Activos</div>
          </CardContent>
        </Card>
      </div>

      {/* Agents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {agents.map((agent) => {
          const Icon = agent.icon
          return (
            <Card key={agent.id} className="hover:shadow-lg transition-all duration-300">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${
                      agent.status === 'active' ? 'bg-green-100' : 
                      agent.status === 'paused' ? 'bg-yellow-100' :
                      agent.status === 'learning' ? 'bg-blue-100' : 'bg-red-100'
                    }`}>
                      <Icon className={`h-6 w-6 ${
                        agent.status === 'active' ? 'text-green-600' : 
                        agent.status === 'paused' ? 'text-yellow-600' :
                        agent.status === 'learning' ? 'text-blue-600' : 'text-red-600'
                      }`} />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{agent.name}</CardTitle>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge className={getStatusColor(agent.status)}>
                          {getStatusIcon(agent.status)}
                          <span className="ml-1">{agent.status}</span>
                        </Badge>
                        <Badge className={getTypeColor(agent.type)}>
                          {agent.type.replace('-', ' ')}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleToggleAgent(agent.id)}
                    className="ml-2"
                  >
                    {agent.status === 'active' ? (
                      <Pause className="h-4 w-4" />
                    ) : (
                      <Play className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                
                <CardDescription className="text-sm leading-relaxed">
                  {agent.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Current Task */}
                {agent.currentTask && (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center space-x-2 mb-1">
                      <Activity className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-semibold text-gray-900">Tarea Actual:</span>
                    </div>
                    <p className="text-sm text-gray-700">{agent.currentTask}</p>
                  </div>
                )}

                {/* Performance Stats */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-2 bg-blue-50 rounded">
                    <div className="text-lg font-bold text-blue-600">{agent.performance.tasksToday}</div>
                    <div className="text-xs text-gray-600">Tareas Hoy</div>
                  </div>
                  <div className="text-center p-2 bg-green-50 rounded">
                    <div className="text-lg font-bold text-green-600">{agent.successRate}%</div>
                    <div className="text-xs text-gray-600">Éxito</div>
                  </div>
                  <div className="text-center p-2 bg-purple-50 rounded">
                    <div className="text-lg font-bold text-purple-600">{agent.performance.avgResponseTime}</div>
                    <div className="text-xs text-gray-600">Tiempo Promedio</div>
                  </div>
                  <div className="text-center p-2 bg-orange-50 rounded">
                    <div className="text-lg font-bold text-orange-600">{agent.performance.customerSatisfaction}</div>
                    <div className="text-xs text-gray-600">Satisfacción</div>
                  </div>
                </div>

                {/* Capabilities */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Capacidades:</h4>
                  <div className="flex flex-wrap gap-1">
                    {agent.capabilities.map((capability, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {capability}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-2 pt-2">
                  <Button size="sm" className="flex-1">
                    <Settings className="h-4 w-4 mr-2" />
                    Configurar
                  </Button>
                  <Button variant="outline" size="sm">
                    Ver Logs
                  </Button>
                </div>

                {/* Last Activity */}
                <div className="text-xs text-gray-500 text-center pt-2 border-t">
                  Última actividad: {agent.lastActivity}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Call to Action */}
      <Card className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/20">
        <CardContent className="p-6 text-center">
          <h3 className="text-xl font-bold text-gray-900 mb-2">¿Necesitas un agente personalizado?</h3>
          <p className="text-gray-600 mb-4">
            Crea agentes IA específicos para tus necesidades únicas de negocio
          </p>
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
            <Bot className="h-4 w-4 mr-2" />
            Crear Agente Personalizado
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
