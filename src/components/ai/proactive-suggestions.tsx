'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Brain, Zap, TrendingUp, Users, Mail, Calendar, DollarSign, CheckCircle, ArrowRight, Lightbulb } from 'lucide-react'

interface WorkflowSuggestion {
  id: string
  title: string
  description: string
  category: 'marketing' | 'sales' | 'operations' | 'finance' | 'customer-care'
  confidence: number
  estimatedSavings: string
  timeToImplement: string
  triggers: string[]
  actions: string[]
  icon: any
  priority: 'high' | 'medium' | 'low'
}

export default function ProactiveSuggestions() {
  const [suggestions, setSuggestions] = useState<WorkflowSuggestion[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simular análisis de IA proactivo
    const analyzeAndSuggest = async () => {
      setLoading(true)
      
      // Simular delay de análisis
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Sugerencias basadas en "análisis" de actividad
      const mockSuggestions: WorkflowSuggestion[] = [
        {
          id: '1',
          title: 'Automatización de Seguimiento de Leads',
          description: 'Detecté que recibes leads desde Facebook Ads pero no se sincronizan automáticamente con tu CRM. Puedo crear un flujo que los capture y envíe un email de bienvenida personalizado.',
          category: 'sales',
          confidence: 94,
          estimatedSavings: '15 horas/semana',
          timeToImplement: '2 minutos',
          triggers: ['Nuevo lead en Facebook Ads', 'Formulario completado'],
          actions: ['Sincronizar con CRM', 'Enviar email personalizado', 'Crear tarea de seguimiento'],
          icon: Users,
          priority: 'high'
        },
        {
          id: '2',
          title: 'Gestión Automática de Facturas',
          description: 'Veo que manejas muchas facturas PDF manualmente. Puedo automatizar la extracción de datos, creación de asientos contables y envío de recordatorios de pago.',
          category: 'finance',
          confidence: 87,
          estimatedSavings: '8 horas/semana',
          timeToImplement: '5 minutos',
          triggers: ['Email con factura PDF', 'Factura vencida'],
          actions: ['Extraer datos con IA', 'Crear asiento contable', 'Enviar recordatorio'],
          icon: DollarSign,
          priority: 'high'
        },
        {
          id: '3',
          title: 'Asistente de Atención al Cliente 24/7',
          description: 'Analicé tus tickets de soporte y puedo crear un agente IA que responda el 70% de consultas comunes automáticamente, escalando solo los casos complejos.',
          category: 'customer-care',
          confidence: 91,
          estimatedSavings: '20 horas/semana',
          timeToImplement: '3 minutos',
          triggers: ['Nuevo ticket de soporte', 'Consulta en chat'],
          actions: ['Analizar consulta con IA', 'Buscar en base de conocimiento', 'Responder o escalar'],
          icon: Brain,
          priority: 'medium'
        },
        {
          id: '4',
          title: 'Campañas de Email Inteligentes',
          description: 'Basándome en el comportamiento de tus usuarios, puedo crear campañas de email que se adapten automáticamente según el engagement y optimicen los horarios de envío.',
          category: 'marketing',
          confidence: 82,
          estimatedSavings: '12 horas/semana',
          timeToImplement: '4 minutos',
          triggers: ['Nuevo usuario registrado', 'Baja engagement', 'Comportamiento específico'],
          actions: ['Segmentar automáticamente', 'Optimizar horario de envío', 'Personalizar contenido'],
          icon: Mail,
          priority: 'medium'
        }
      ]
      
      setSuggestions(mockSuggestions)
      setLoading(false)
    }

    analyzeAndSuggest()
  }, [])

  const getCategoryColor = (category: string) => {
    const colors = {
      marketing: 'bg-purple-100 text-purple-800',
      sales: 'bg-blue-100 text-blue-800',
      operations: 'bg-green-100 text-green-800',
      finance: 'bg-yellow-100 text-yellow-800',
      'customer-care': 'bg-pink-100 text-pink-800'
    }
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const getPriorityColor = (priority: string) => {
    const colors = {
      high: 'bg-red-500',
      medium: 'bg-yellow-500',
      low: 'bg-green-500'
    }
    return colors[priority as keyof typeof colors] || 'bg-gray-500'
  }

  if (loading) {
    return (
      <Card className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/20">
        <CardHeader>
          <CardTitle className="flex items-center text-blue-600">
            <Brain className="h-6 w-6 mr-2 animate-pulse" />
            IA Analizando tu Actividad...
          </CardTitle>
          <CardDescription>
            Nuestro asistente IA está revisando tus datos para sugerir automatizaciones personalizadas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200"></div>
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent absolute"></div>
          </div>
          <p className="text-center text-gray-600">
            Analizando patrones de uso, integraciones y oportunidades de optimización...
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/20">
      <CardHeader>
        <CardTitle className="flex items-center text-blue-600">
          <Lightbulb className="h-6 w-6 mr-2" />
          Sugerencias Proactivas de IA
        </CardTitle>
        <CardDescription>
          Basándome en tu actividad, he identificado {suggestions.length} oportunidades de automatización que pueden ahorrarte tiempo y dinero
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {suggestions.map((suggestion) => {
            const Icon = suggestion.icon
            return (
              <div
                key={suggestion.id}
                className="bg-white/50 backdrop-blur-sm rounded-lg p-4 border border-white/20 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <Icon className="h-8 w-8 text-blue-600" />
                      <div 
                        className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${getPriorityColor(suggestion.priority)}`}
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{suggestion.title}</h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge className={getCategoryColor(suggestion.category)}>
                          {suggestion.category.replace('-', ' ')}
                        </Badge>
                        <Badge variant="outline" className="text-green-600 border-green-600">
                          {suggestion.confidence}% confianza
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-green-600 font-semibold">
                      Ahorro: {suggestion.estimatedSavings}
                    </div>
                    <div className="text-xs text-gray-500">
                      Setup: {suggestion.timeToImplement}
                    </div>
                  </div>
                </div>

                <p className="text-gray-700 mb-4 text-sm leading-relaxed">
                  {suggestion.description}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center">
                      <Zap className="h-4 w-4 mr-1 text-yellow-500" />
                      Triggers Detectados:
                    </h4>
                    <ul className="text-xs text-gray-600 space-y-1">
                      {suggestion.triggers.map((trigger, index) => (
                        <li key={index} className="flex items-center">
                          <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
                          {trigger}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center">
                      <TrendingUp className="h-4 w-4 mr-1 text-blue-500" />
                      Acciones Automatizadas:
                    </h4>
                    <ul className="text-xs text-gray-600 space-y-1">
                      {suggestion.actions.map((action, index) => (
                        <li key={index} className="flex items-center">
                          <ArrowRight className="h-3 w-3 mr-1 text-blue-500" />
                          {action}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                      <Zap className="h-4 w-4 mr-2" />
                      Implementar Ahora
                    </Button>
                    <Button size="sm" variant="outline">
                      Ver Detalles
                    </Button>
                  </div>
                  <div className="text-xs text-gray-500">
                    Basado en análisis de tus últimos 30 días
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-gray-900">💡 ¿Quieres más sugerencias?</h4>
              <p className="text-sm text-gray-600">
                Conecta más herramientas para obtener análisis más precisos
              </p>
            </div>
            <Button variant="outline" size="sm">
              Conectar Herramientas
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
