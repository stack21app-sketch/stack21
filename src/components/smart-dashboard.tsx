'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  AlertTriangle, 
  CheckCircle, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Brain,
  Zap,
  Target,
  Users,
  Activity,
  AlertCircle,
  Lightbulb,
  X,
  ArrowRight,
  ExternalLink,
  Clock,
  DollarSign,
  BarChart3,
  Settings,
  Play,
  Pause,
  RefreshCw,
  Eye,
  Filter,
  MoreHorizontal
} from 'lucide-react'
import {
  SMART_METRICS,
  SMART_INSIGHTS,
  WORKFLOW_RECOMMENDATIONS,
  USER_BEHAVIORS,
  SYSTEM_HEALTH,
  getDashboardSummary,
  getCriticalInsights,
  getActionableInsights,
  getTopPerformingMetrics,
  getHighImpactRecommendations,
  type DashboardInsight,
  type SmartMetric,
  type WorkflowRecommendation,
  type UserBehavior
} from '@/lib/smart-dashboard'

export function SmartDashboard() {
  const [selectedTab, setSelectedTab] = useState<'overview' | 'insights' | 'recommendations' | 'users' | 'system'>('overview')
  const [selectedInsight, setSelectedInsight] = useState<DashboardInsight | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const summary = getDashboardSummary()
  const criticalInsights = getCriticalInsights()
  const actionableInsights = getActionableInsights()
  const topMetrics = getTopPerformingMetrics()
  const highImpactRecommendations = getHighImpactRecommendations()

  const handleRefresh = async () => {
    setIsRefreshing(true)
    // Simular actualización de datos
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsRefreshing(false)
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-500'
      case 'high':
        return 'bg-orange-500'
      case 'medium':
        return 'bg-yellow-500'
      case 'low':
        return 'bg-green-500'
      default:
        return 'bg-gray-500'
    }
  }

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'Crítico'
      case 'high':
        return 'Alto'
      case 'medium':
        return 'Medio'
      case 'low':
        return 'Bajo'
      default:
        return 'Desconocido'
    }
  }

  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case 'positive':
        return <TrendingUp className="w-4 h-4 text-green-400" />
      case 'negative':
        return <TrendingDown className="w-4 h-4 text-red-400" />
      case 'neutral':
        return <Minus className="w-4 h-4 text-gray-400" />
      default:
        return <Minus className="w-4 h-4 text-gray-400" />
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-400" />
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-400" />
      case 'stable':
        return <Minus className="w-4 h-4 text-gray-400" />
      default:
        return <Minus className="w-4 h-4 text-gray-400" />
    }
  }

  const getSystemStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'text-green-400'
      case 'warning':
        return 'text-yellow-400'
      case 'critical':
        return 'text-red-400'
      default:
        return 'text-gray-400'
    }
  }

  const getSystemStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="w-5 h-5 text-green-400" />
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-400" />
      case 'critical':
        return <AlertCircle className="w-5 h-5 text-red-400" />
      default:
        return <Activity className="w-5 h-5 text-gray-400" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white flex items-center">
            <Brain className="w-8 h-8 mr-3 text-purple-400" />
            Smart Dashboard
          </h2>
          <p className="text-gray-400">Insights inteligentes y recomendaciones impulsadas por IA</p>
        </div>
        <div className="flex items-center space-x-4">
          <Button
            onClick={handleRefresh}
            disabled={isRefreshing}
            variant="outline"
            className="text-white border-white/20 hover:bg-white/10"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Actualizando...' : 'Actualizar'}
          </Button>
          <Badge className="bg-green-500 text-white">
            <Activity className="w-3 h-3 mr-1" />
            Sistema Activo
          </Badge>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-800/50 p-1 rounded-lg">
        {[
          { id: 'overview', label: 'Resumen', icon: BarChart3 },
          { id: 'insights', label: 'Insights', icon: Lightbulb },
          { id: 'recommendations', label: 'Recomendaciones', icon: Target },
          { id: 'users', label: 'Usuarios', icon: Users },
          { id: 'system', label: 'Sistema', icon: Settings }
        ].map((tab) => (
          <Button
            key={tab.id}
            variant={selectedTab === tab.id ? 'default' : 'ghost'}
            onClick={() => setSelectedTab(tab.id as any)}
            className={`flex-1 ${
              selectedTab === tab.id 
                ? 'bg-blue-500 text-white' 
                : 'text-gray-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <tab.icon className="w-4 h-4 mr-2" />
            {tab.label}
          </Button>
        ))}
      </div>

      {/* Overview Tab */}
      {selectedTab === 'overview' && (
        <div className="space-y-6">
          {/* Métricas principales */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SMART_METRICS.map((metric) => (
              <Card key={metric.id} className="bg-white/5 backdrop-blur-xl border-white/10">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-400">
                    {metric.name}
                  </CardTitle>
                  <div className="flex items-center space-x-1">
                    <span className="text-2xl">{metric.icon}</span>
                    {getTrendIcon(metric.trend)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{metric.value}{metric.unit}</div>
                  <div className="flex items-center space-x-2 mt-2">
                    <span className={`text-sm ${metric.color}`}>
                      {metric.change > 0 ? '+' : ''}{metric.changePercent}%
                    </span>
                    <span className="text-xs text-gray-400">
                      vs período anterior
                    </span>
                  </div>
                  {metric.prediction && (
                    <div className="mt-2 p-2 bg-blue-500/10 rounded-lg">
                      <div className="text-xs text-blue-300">
                        Predicción: {metric.prediction.value}{metric.unit} 
                        <span className="text-gray-400 ml-1">
                          ({metric.prediction.timeframe})
                        </span>
                      </div>
                      <div className="text-xs text-gray-400">
                        Confianza: {metric.prediction.confidence}%
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Resumen de insights */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-white/5 backdrop-blur-xl border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Lightbulb className="w-5 h-5 mr-2 text-yellow-400" />
                  Insights Críticos
                </CardTitle>
                <CardDescription className="text-gray-400">
                  {criticalInsights.length} insights requieren atención inmediata
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {criticalInsights.slice(0, 3).map((insight) => (
                    <div key={insight.id} className="flex items-start space-x-3 p-3 bg-red-500/10 rounded-lg border border-red-500/20">
                      <AlertCircle className="w-5 h-5 text-red-400 mt-0.5" />
                      <div className="flex-1">
                        <div className="text-white font-medium text-sm">{insight.title}</div>
                        <div className="text-gray-300 text-xs mt-1">{insight.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/5 backdrop-blur-xl border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Target className="w-5 h-5 mr-2 text-green-400" />
                  Recomendaciones de Alto Impacto
                </CardTitle>
                <CardDescription className="text-gray-400">
                  {highImpactRecommendations.length} recomendaciones con gran potencial
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {highImpactRecommendations.slice(0, 3).map((rec) => (
                    <div key={rec.id} className="p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                      <div className="text-white font-medium text-sm">{rec.title}</div>
                      <div className="text-gray-300 text-xs mt-1">{rec.description}</div>
                      <div className="flex items-center justify-between mt-2">
                        <Badge className="bg-green-500 text-white text-xs">
                          Ahorro: {rec.estimatedSavings.time}h, ${rec.estimatedSavings.cost}
                        </Badge>
                        <Button size="sm" variant="outline" className="text-xs text-white border-white/20 hover:bg-white/10">
                          Ver detalles
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Insights Tab */}
      {selectedTab === 'insights' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-white">Todos los Insights</h3>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" className="text-white border-white/20 hover:bg-white/10">
                <Filter className="w-4 h-4 mr-2" />
                Filtrar
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {SMART_INSIGHTS.map((insight) => (
              <Card key={insight.id} className="bg-white/5 backdrop-blur-xl border-white/10 hover:bg-white/10 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="flex items-center space-x-2">
                        {getImpactIcon(insight.impact)}
                        <Badge className={`${getPriorityColor(insight.priority)} text-white`}>
                          {getPriorityLabel(insight.priority)}
                        </Badge>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-white font-semibold">{insight.title}</h4>
                        <p className="text-gray-300 text-sm mt-1">{insight.description}</p>
                        <div className="flex items-center space-x-4 mt-3 text-xs text-gray-400">
                          <span>Confianza: {insight.confidence}%</span>
                          <span>•</span>
                          <span>{insight.category}</span>
                          <span>•</span>
                          <span>{new Date(insight.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {insight.actionable && insight.action && (
                        <Button
                          size="sm"
                          onClick={() => setSelectedInsight(insight)}
                          className="bg-blue-500 hover:bg-blue-600 text-white"
                        >
                          {insight.action.title}
                        </Button>
                      )}
                      <Button variant="outline" size="sm" className="text-white border-white/20 hover:bg-white/10">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Recommendations Tab */}
      {selectedTab === 'recommendations' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-white">Recomendaciones de Workflows</h3>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" className="text-white border-white/20 hover:bg-white/10">
                <Filter className="w-4 h-4 mr-2" />
                Filtrar
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {WORKFLOW_RECOMMENDATIONS.map((rec) => (
              <Card key={rec.id} className="bg-white/5 backdrop-blur-xl border-white/10 hover:bg-white/10 transition-all duration-300">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-white text-lg">{rec.title}</CardTitle>
                      <CardDescription className="text-gray-400 mt-2">
                        {rec.description}
                      </CardDescription>
                    </div>
                    <div className="flex flex-col space-y-1">
                      <Badge className={`${
                        rec.priority === 'high' ? 'bg-red-500' :
                        rec.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                      } text-white`}>
                        {rec.priority === 'high' ? 'Alta' : rec.priority === 'medium' ? 'Media' : 'Baja'} Prioridad
                      </Badge>
                      <Badge variant="outline" className="text-gray-400 border-gray-600">
                        {rec.effort === 'high' ? 'Alto' : rec.effort === 'medium' ? 'Medio' : 'Bajo'} Esfuerzo
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-blue-500/10 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="text-center">
                          <div className="text-lg font-bold text-blue-400">{rec.estimatedSavings.time}h</div>
                          <div className="text-xs text-gray-400">Tiempo ahorrado</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-green-400">${rec.estimatedSavings.cost}</div>
                          <div className="text-xs text-gray-400">Costo ahorrado</div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h5 className="text-white font-medium mb-2">Pasos:</h5>
                      <ul className="space-y-1">
                        {rec.steps.map((step, index) => (
                          <li key={index} className="text-gray-300 text-sm flex items-center">
                            <span className="w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center text-xs text-blue-400 mr-2">
                              {index + 1}
                            </span>
                            {step}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {rec.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs text-gray-400 border-gray-600">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex space-x-2">
                      <Button className="bg-green-500 hover:bg-green-600 text-white flex-1">
                        <Play className="w-4 h-4 mr-2" />
                        Implementar
                      </Button>
                      <Button variant="outline" className="text-white border-white/20 hover:bg-white/10">
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Users Tab */}
      {selectedTab === 'users' && (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-white">Análisis de Usuarios</h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {USER_BEHAVIORS.map((user) => (
              <Card key={user.userId} className="bg-white/5 backdrop-blur-xl border-white/10">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white">{user.userName}</CardTitle>
                    <div className="flex items-center space-x-2">
                      <Badge className="bg-blue-500 text-white">
                        {user.performance.efficiency}% Eficiencia
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-gray-800/50 rounded-lg">
                        <div className="text-2xl font-bold text-white">{user.activity.workflowsCreated}</div>
                        <div className="text-xs text-gray-400">Workflows Creados</div>
                      </div>
                      <div className="text-center p-3 bg-gray-800/50 rounded-lg">
                        <div className="text-2xl font-bold text-white">{user.activity.workflowsExecuted}</div>
                        <div className="text-xs text-gray-400">Ejecutados</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Productividad</span>
                        <span className="text-white">{user.performance.productivity}%</span>
                      </div>
                      <Progress value={user.performance.productivity} className="h-2" />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Colaboración</span>
                        <span className="text-white">{user.performance.collaboration}%</span>
                      </div>
                      <Progress value={user.performance.collaboration} className="h-2" />
                    </div>

                    <div className="space-y-2">
                      <h5 className="text-white font-medium text-sm">Insights:</h5>
                      <ul className="space-y-1">
                        {user.insights.map((insight, index) => (
                          <li key={index} className="text-gray-300 text-xs flex items-center">
                            <CheckCircle className="w-3 h-3 text-green-400 mr-2" />
                            {insight}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* System Tab */}
      {selectedTab === 'system' && (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-white">Salud del Sistema</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-white/5 backdrop-blur-xl border-white/10">
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center mb-2">
                  {getSystemStatusIcon(SYSTEM_HEALTH.status)}
                </div>
                <div className="text-2xl font-bold text-white mb-1">
                  {SYSTEM_HEALTH.status === 'healthy' ? 'Saludable' : 
                   SYSTEM_HEALTH.status === 'warning' ? 'Advertencia' : 'Crítico'}
                </div>
                <div className="text-sm text-gray-400">Estado General</div>
              </CardContent>
            </Card>

            <Card className="bg-white/5 backdrop-blur-xl border-white/10">
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-white mb-1">{SYSTEM_HEALTH.uptime}%</div>
                <div className="text-sm text-gray-400">Uptime</div>
              </CardContent>
            </Card>

            <Card className="bg-white/5 backdrop-blur-xl border-white/10">
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-white mb-1">{SYSTEM_HEALTH.performance}%</div>
                <div className="text-sm text-gray-400">Rendimiento</div>
              </CardContent>
            </Card>

            <Card className="bg-white/5 backdrop-blur-xl border-white/10">
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-red-400 mb-1">{SYSTEM_HEALTH.errors}</div>
                <div className="text-sm text-gray-400">Errores</div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-white/5 backdrop-blur-xl border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Componentes del Sistema</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {Object.entries(SYSTEM_HEALTH.components).map(([component, status]) => (
                  <div key={component} className="p-4 bg-gray-800/50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-medium capitalize">{component}</span>
                      <div className={`flex items-center ${getSystemStatusColor(status)}`}>
                        {getSystemStatusIcon(status)}
                      </div>
                    </div>
                    <div className={`text-sm ${
                      status === 'healthy' ? 'text-green-400' :
                      status === 'warning' ? 'text-yellow-400' : 'text-red-400'
                    }`}>
                      {status === 'healthy' ? 'Operativo' :
                       status === 'warning' ? 'Advertencia' : 'Crítico'}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Modal de Insight Detallado */}
      {selectedInsight && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="bg-gray-900 border-gray-700 max-w-2xl w-full">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-white">{selectedInsight.title}</CardTitle>
                  <CardDescription className="text-gray-400 mt-2">
                    {selectedInsight.description}
                  </CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedInsight(null)}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-400">Prioridad</div>
                    <Badge className={`${getPriorityColor(selectedInsight.priority)} text-white`}>
                      {getPriorityLabel(selectedInsight.priority)}
                    </Badge>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Confianza</div>
                    <div className="text-white">{selectedInsight.confidence}%</div>
                  </div>
                </div>

                {selectedInsight.metrics && (
                  <div className="p-4 bg-gray-800/50 rounded-lg">
                    <div className="text-sm text-gray-400 mb-2">Métricas</div>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-lg font-bold text-white">{selectedInsight.metrics.current}</div>
                        <div className="text-xs text-gray-400">Actual</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-white">{selectedInsight.metrics.previous}</div>
                        <div className="text-xs text-gray-400">Anterior</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-white">{selectedInsight.metrics.target}</div>
                        <div className="text-xs text-gray-400">Objetivo</div>
                      </div>
                    </div>
                  </div>
                )}

                {selectedInsight.action && (
                  <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                    <div className="text-sm text-blue-300 font-medium mb-2">Acción Recomendada</div>
                    <div className="text-white mb-3">{selectedInsight.action.description}</div>
                    <Button className="bg-blue-500 hover:bg-blue-600 text-white">
                      {selectedInsight.action.title}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
