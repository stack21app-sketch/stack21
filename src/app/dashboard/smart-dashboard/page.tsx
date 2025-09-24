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
  AlertTriangle, 
  CheckCircle, 
  Lightbulb, 
  Target, 
  BarChart3, 
  Users, 
  DollarSign, 
  Zap, 
  Eye, 
  ArrowUp, 
  ArrowDown, 
  Minus,
  Loader2,
  RefreshCw,
  Settings,
  Bell
} from 'lucide-react'
import { useWorkspace } from '@/hooks/use-workspace'

interface KPI {
  name: string
  value: number
  unit: string
  change: number
  trend: 'up' | 'down' | 'stable'
  icon: any
  color: string
}

interface Insight {
  id: string
  insight_type: string
  title: string
  description: string
  confidence_score: number
  impact_level: string
  category: string
  is_actionable: boolean
  suggested_actions?: any[]
}

interface Alert {
  id: string
  title: string
  message: string
  severity: string
  created_at: string
}

export default function SmartDashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { currentWorkspace } = useWorkspace()
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [kpis, setKpis] = useState<KPI[]>([])
  const [insights, setInsights] = useState<Insight[]>([])
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [predictions, setPredictions] = useState<any[]>([])

  if (status === 'unauthenticated') {
    router.push('/auth/signin')
    return null
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

  useEffect(() => {
    if (currentWorkspace) {
      fetchDashboardData()
    }
  }, [currentWorkspace])

  const fetchDashboardData = async () => {
    if (!currentWorkspace) return

    setLoading(true)
    try {
      const [overviewRes, insightsRes, predictionsRes, alertsRes] = await Promise.all([
        fetch(`/api/smart-dashboard?workspaceId=${currentWorkspace.id}&type=overview`),
        fetch(`/api/smart-dashboard?workspaceId=${currentWorkspace.id}&type=insights`),
        fetch(`/api/smart-dashboard?workspaceId=${currentWorkspace.id}&type=predictions`),
        fetch(`/api/smart-dashboard?workspaceId=${currentWorkspace.id}&type=alerts`)
      ])

      const [overview, insightsData, predictionsData, alertsData] = await Promise.all([
        overviewRes.json(),
        insightsRes.json(),
        predictionsRes.json(),
        alertsRes.json()
      ])

      if (overview.success) {
        setKpis(transformKPIs(overview.data.kpis))
        setInsights(overview.data.insights || [])
        setAlerts(overview.data.alerts || [])
      }

      if (insightsData.success) {
        setInsights(insightsData.insights || [])
      }

      if (predictionsData.success) {
        setPredictions(predictionsData.predictions || [])
      }

      if (alertsData.success) {
        setAlerts(alertsData.alerts || [])
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const refreshData = async () => {
    setRefreshing(true)
    await fetchDashboardData()
    setRefreshing(false)
  }

  const generateInsights = async () => {
    if (!currentWorkspace) return

    try {
      const response = await fetch('/api/smart-dashboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate_insights',
          workspaceId: currentWorkspace.id
        })
      })

      const data = await response.json()
      if (data.success) {
        await fetchDashboardData() // Refrescar datos
        alert(`Se generaron ${data.insights_generated} nuevos insights`)
      }
    } catch (error) {
      console.error('Error generating insights:', error)
    }
  }

  const transformKPIs = (data: any): KPI[] => {
    return [
      {
        name: 'Usuarios Totales',
        value: data.total_users || 0,
        unit: 'usuarios',
        change: 15.2,
        trend: 'up',
        icon: Users,
        color: 'blue'
      },
      {
        name: 'Ingresos Totales',
        value: data.total_revenue || 0,
        unit: 'USD',
        change: 8.5,
        trend: 'up',
        icon: DollarSign,
        color: 'green'
      },
      {
        name: 'Tasa de Conversión',
        value: data.conversion_rate || 0,
        unit: '%',
        change: -2.1,
        trend: 'down',
        icon: Target,
        color: 'orange'
      },
      {
        name: 'Puntuación de Engagement',
        value: data.engagement_score || 0,
        unit: '/10',
        change: 3.2,
        trend: 'up',
        icon: BarChart3,
        color: 'purple'
      }
    ]
  }

  const getImpactColor = (level: string) => {
    switch (level) {
      case 'critical': return 'text-red-600 bg-red-100'
      case 'high': return 'text-orange-600 bg-orange-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'low': return 'text-green-600 bg-green-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-100 border-red-200'
      case 'error': return 'text-red-600 bg-red-100 border-red-200'
      case 'warning': return 'text-yellow-600 bg-yellow-100 border-yellow-200'
      case 'info': return 'text-blue-600 bg-blue-100 border-blue-200'
      default: return 'text-gray-600 bg-gray-100 border-gray-200'
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <ArrowUp className="h-4 w-4 text-green-600" />
      case 'down': return <ArrowDown className="h-4 w-4 text-red-600" />
      default: return <Minus className="h-4 w-4 text-gray-600" />
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="h-96 bg-gray-200 rounded"></div>
              <div className="h-96 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Brain className="mr-3 h-8 w-8 text-purple-600" />
              Dashboard Inteligente
            </h1>
            <p className="text-gray-600 mt-2">
              IA que analiza tus datos y sugiere acciones automáticamente
            </p>
          </div>
          <div className="flex space-x-2">
            <Button
              onClick={generateInsights}
              variant="outline"
              size="sm"
            >
              <Lightbulb className="w-4 h-4 mr-2" />
              Generar Insights
            </Button>
            <Button
              onClick={refreshData}
              variant="outline"
              size="sm"
              disabled={refreshing}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Actualizar
            </Button>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpis.map((kpi, index) => {
            const Icon = kpi.icon
            return (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{kpi.name}</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {kpi.value.toLocaleString()}
                        <span className="text-sm font-normal text-gray-500 ml-1">
                          {kpi.unit}
                        </span>
                      </p>
                    </div>
                    <div className={`p-3 rounded-full bg-${kpi.color}-100`}>
                      <Icon className={`h-6 w-6 text-${kpi.color}-600`} />
                    </div>
                  </div>
                  <div className="flex items-center mt-4">
                    {getTrendIcon(kpi.trend)}
                    <span className={`text-sm font-medium ml-2 ${
                      kpi.trend === 'up' ? 'text-green-600' : 
                      kpi.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                    }`}>
                      {kpi.change > 0 ? '+' : ''}{kpi.change}%
                    </span>
                    <span className="text-sm text-gray-500 ml-1">vs mes anterior</span>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Insights de IA */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Brain className="mr-2 h-5 w-5 text-purple-600" />
                Insights de IA
              </CardTitle>
              <CardDescription>
                Análisis inteligente de tus datos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {insights.length > 0 ? (
                  insights.map((insight) => (
                    <div key={insight.id} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{insight.title}</h4>
                        <Badge className={getImpactColor(insight.impact_level)}>
                          {insight.impact_level}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{insight.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-500">
                            Confianza: {Math.round(insight.confidence_score * 100)}%
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {insight.category}
                          </Badge>
                        </div>
                        {insight.is_actionable && (
                          <Button size="sm" variant="outline">
                            <Zap className="w-3 h-3 mr-1" />
                            Acción
                          </Button>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Brain className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                    <p>No hay insights disponibles</p>
                    <Button onClick={generateInsights} size="sm" className="mt-2">
                      Generar Insights
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Alertas Inteligentes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="mr-2 h-5 w-5 text-red-600" />
                Alertas Inteligentes
              </CardTitle>
              <CardDescription>
                Notificaciones automáticas importantes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {alerts.length > 0 ? (
                  alerts.map((alert) => (
                    <Alert key={alert.id} className={getSeverityColor(alert.severity)}>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        <div className="font-medium">{alert.title}</div>
                        <div className="text-sm mt-1">{alert.message}</div>
                        <div className="text-xs mt-2 opacity-75">
                          {new Date(alert.created_at).toLocaleString()}
                        </div>
                      </AlertDescription>
                    </Alert>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <CheckCircle className="mx-auto h-12 w-12 text-green-300 mb-4" />
                    <p>No hay alertas activas</p>
                    <p className="text-sm">Todo está funcionando correctamente</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Predicciones */}
        {predictions.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="mr-2 h-5 w-5 text-blue-600" />
                Predicciones de IA
              </CardTitle>
              <CardDescription>
                Proyecciones basadas en tus datos históricos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {predictions.map((prediction, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <h4 className="font-medium text-gray-900 capitalize">
                      {prediction.prediction_type.replace('_', ' ')}
                    </h4>
                    <p className="text-2xl font-bold text-blue-600 mt-2">
                      {prediction.predicted_value?.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {new Date(prediction.prediction_date).toLocaleDateString()}
                    </p>
                    {prediction.confidence_interval_lower && (
                      <p className="text-xs text-gray-400 mt-2">
                        Rango: {prediction.confidence_interval_lower} - {prediction.confidence_interval_upper}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
