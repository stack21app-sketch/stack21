'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Brain, 
  TrendingUp, 
  TrendingDown,
  Users, 
  DollarSign,
  Target,
  AlertTriangle,
  CheckCircle,
  Lightbulb,
  BarChart3,
  PieChart,
  Activity,
  Zap,
  Clock,
  RefreshCw,
  Download,
  Share,
  Settings,
  Eye,
  MessageSquare,
  Calendar,
  Star
} from 'lucide-react'
import { useWorkspace } from '@/hooks/use-workspace'

interface Insight {
  id: string
  type: 'opportunity' | 'warning' | 'success' | 'info'
  title: string
  description: string
  impact: 'high' | 'medium' | 'low'
  confidence: number
  action: string
  value?: number
  trend?: 'up' | 'down' | 'stable'
}

interface Metric {
  id: string
  name: string
  value: number
  change: number
  trend: 'up' | 'down' | 'stable'
  target?: number
  unit: string
}

const mockInsights: Insight[] = [
  {
    id: '1',
    type: 'opportunity',
    title: 'Oportunidad de Crecimiento',
    description: 'Tus usuarios más activos están en el segmento de 25-35 años. Considera crear contenido específico para este grupo.',
    impact: 'high',
    confidence: 87,
    action: 'Crear campaña dirigida a usuarios de 25-35 años',
    value: 23,
    trend: 'up'
  },
  {
    id: '2',
    type: 'warning',
    title: 'Tasa de Abandono Aumentando',
    description: 'La tasa de abandono en el checkout ha aumentado un 15% en la última semana.',
    impact: 'high',
    confidence: 92,
    action: 'Revisar y optimizar el proceso de checkout',
    value: -15,
    trend: 'down'
  },
  {
    id: '3',
    type: 'success',
    title: 'Conversión Mejorada',
    description: 'La nueva página de landing ha aumentado las conversiones en un 34%.',
    impact: 'high',
    confidence: 95,
    action: 'Aplicar el mismo diseño a otras páginas',
    value: 34,
    trend: 'up'
  },
  {
    id: '4',
    type: 'info',
    title: 'Patrón de Uso Detectado',
    description: 'Los usuarios tienden a usar más la plataforma los martes y jueves entre 2-4 PM.',
    impact: 'medium',
    confidence: 78,
    action: 'Programar notificaciones para estos horarios',
    trend: 'stable'
  }
]

const mockMetrics: Metric[] = [
  {
    id: '1',
    name: 'Usuarios Activos',
    value: 1247,
    change: 12.5,
    trend: 'up',
    target: 1500,
    unit: 'usuarios'
  },
  {
    id: '2',
    name: 'Ingresos Mensuales',
    value: 45680,
    change: 8.3,
    trend: 'up',
    target: 50000,
    unit: 'USD'
  },
  {
    id: '3',
    name: 'Tasa de Conversión',
    value: 3.2,
    change: -2.1,
    trend: 'down',
    target: 4.0,
    unit: '%'
  },
  {
    id: '4',
    name: 'Satisfacción del Cliente',
    value: 4.7,
    change: 0.3,
    trend: 'up',
    target: 4.5,
    unit: '/5'
  }
]

export default function BusinessIntelligencePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { currentWorkspace } = useWorkspace()

  const [insights, setInsights] = useState<Insight[]>([])
  const [metrics, setMetrics] = useState<Metric[]>([])
  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [selectedTimeframe, setSelectedTimeframe] = useState('7d')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  useEffect(() => {
    loadData()
  }, [selectedTimeframe])

  const loadData = async () => {
    setLoading(true)
    try {
      // Simular carga de datos
      await new Promise(resolve => setTimeout(resolve, 1000))
      setInsights(mockInsights)
      setMetrics(mockMetrics)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const refreshData = async () => {
    setRefreshing(true)
    try {
      await loadData()
    } finally {
      setRefreshing(false)
    }
  }

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'opportunity': return <Lightbulb className="h-5 w-5 text-yellow-500" />
      case 'warning': return <AlertTriangle className="h-5 w-5 text-red-500" />
      case 'success': return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'info': return <MessageSquare className="h-5 w-5 text-blue-500" />
      default: return <Brain className="h-5 w-5 text-gray-500" />
    }
  }

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'opportunity': return 'border-yellow-200 bg-yellow-50'
      case 'warning': return 'border-red-200 bg-red-50'
      case 'success': return 'border-green-200 bg-green-50'
      case 'info': return 'border-blue-200 bg-blue-50'
      default: return 'border-gray-200 bg-gray-50'
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-500" />
      case 'down': return <TrendingDown className="h-4 w-4 text-red-500" />
      case 'stable': return <Activity className="h-4 w-4 text-gray-500" />
      default: return <Activity className="h-4 w-4 text-gray-500" />
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center">
              <Brain className="mr-3 h-8 w-8 text-blue-600" />
              Inteligencia de Negocio
            </h1>
            <p className="text-muted-foreground mt-2">
              Insights automáticos y análisis predictivo para optimizar tu negocio.
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Badge variant="secondary" className="text-sm">
              🧠 Exclusivo de Stack21
            </Badge>
            <Button onClick={refreshData} disabled={refreshing} variant="outline">
              <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              Actualizar
            </Button>
          </div>
        </div>

        {/* Selector de Tiempo */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium">Período de análisis:</span>
              <div className="flex space-x-2">
                {['24h', '7d', '30d', '90d'].map(period => (
                  <Button
                    key={period}
                    variant={selectedTimeframe === period ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedTimeframe(period)}
                  >
                    {period}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Métricas Principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map(metric => (
            <Card key={metric.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {metric.name}
                </CardTitle>
                {getTrendIcon(metric.trend)}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metric.value.toLocaleString()}{metric.unit}</div>
                <div className="flex items-center space-x-2 mt-1">
                  <span className={`text-sm ${metric.change > 0 ? 'text-green-600' : metric.change < 0 ? 'text-red-600' : 'text-gray-600'}`}>
                    {metric.change > 0 ? '+' : ''}{metric.change}%
                  </span>
                  <span className="text-sm text-gray-500">vs período anterior</span>
                </div>
                {metric.target && (
                  <div className="mt-2">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Progreso hacia meta</span>
                      <span>{Math.round((metric.value / metric.target) * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${Math.min((metric.value / metric.target) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Insights Inteligentes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Lightbulb className="mr-2 h-5 w-5" />
              Insights Inteligentes
            </CardTitle>
            <CardDescription>
              Análisis automático de tus datos con recomendaciones accionables
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {insights.map(insight => (
                <div key={insight.id} className={`p-4 rounded-lg border ${getInsightColor(insight.type)}`}>
                  <div className="flex items-start space-x-3">
                    {getInsightIcon(insight.type)}
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">{insight.title}</h4>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="text-xs">
                            {insight.confidence}% confianza
                          </Badge>
                          <Badge 
                            variant={insight.impact === 'high' ? 'default' : insight.impact === 'medium' ? 'secondary' : 'outline'}
                            className="text-xs"
                          >
                            {insight.impact === 'high' ? 'Alto Impacto' : insight.impact === 'medium' ? 'Medio Impacto' : 'Bajo Impacto'}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 mb-3">{insight.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <span className="text-sm font-medium text-gray-600">
                            Acción recomendada:
                          </span>
                          <span className="text-sm text-gray-800">{insight.action}</span>
                        </div>
                        {insight.value && (
                          <div className="flex items-center space-x-1">
                            {getTrendIcon(insight.trend || 'stable')}
                            <span className={`text-sm font-medium ${insight.value > 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {insight.value > 0 ? '+' : ''}{insight.value}%
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Análisis Predictivo */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="mr-2 h-5 w-5" />
                Predicciones de Crecimiento
              </CardTitle>
              <CardDescription>
                Proyecciones basadas en datos históricos y tendencias actuales
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div>
                    <p className="font-medium text-green-800">Usuarios en 30 días</p>
                    <p className="text-sm text-green-600">Proyección: 1,450 usuarios</p>
                  </div>
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div>
                    <p className="font-medium text-blue-800">Ingresos en 30 días</p>
                    <p className="text-sm text-blue-600">Proyección: $52,300</p>
                  </div>
                  <TrendingUp className="h-6 w-6 text-blue-600" />
                </div>
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <div>
                    <p className="font-medium text-yellow-800">Riesgo de abandono</p>
                    <p className="text-sm text-yellow-600">23 usuarios en riesgo</p>
                  </div>
                  <AlertTriangle className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="mr-2 h-5 w-5" />
                Recomendaciones Estratégicas
              </CardTitle>
              <CardDescription>
                Acciones sugeridas para optimizar el rendimiento
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 border rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className="font-medium text-sm">Prioridad Alta</span>
                  </div>
                  <p className="text-sm text-gray-700">Optimizar el proceso de onboarding para reducir la tasa de abandono</p>
                </div>
                <div className="p-3 border rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Clock className="h-4 w-4 text-blue-500" />
                    <span className="font-medium text-sm">Prioridad Media</span>
                  </div>
                  <p className="text-sm text-gray-700">Implementar notificaciones push para aumentar la retención</p>
                </div>
                <div className="p-3 border rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Zap className="h-4 w-4 text-green-500" />
                    <span className="font-medium text-sm">Oportunidad</span>
                  </div>
                  <p className="text-sm text-gray-700">Expandir a nuevos mercados basado en el análisis de usuarios</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
