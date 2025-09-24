'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  BarChart3, 
  PieChart, 
  LineChart,
  Target,
  AlertTriangle,
  CheckCircle,
  Info,
  Lightbulb,
  Download,
  RefreshCw,
  Eye,
  Filter
} from 'lucide-react'
import { 
  MAIN_METRICS, 
  CONVERSION_CHART_DATA, 
  REVENUE_CHART_DATA, 
  PREDICTIONS, 
  INSIGHTS,
  getMetricsByCategory,
  getHighImpactInsights,
  getPredictionsByConfidence,
  calculateROI,
  generateInsight,
  getTrendAnalysis,
  getRecommendation
} from '@/lib/analytics'

export function AnalyticsDashboard() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>('30d')
  const [isRefreshing, setIsRefreshing] = useState(false)

  const filteredMetrics = selectedCategory === 'all' 
    ? MAIN_METRICS 
    : getMetricsByCategory(selectedCategory)

  const highImpactInsights = getHighImpactInsights()
  const highConfidencePredictions = getPredictionsByConfidence(0.8)

  const handleRefresh = async () => {
    setIsRefreshing(true)
    // Simular actualización de datos
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsRefreshing(false)
  }

  const getChangeIcon = (changeType: string) => {
    switch (changeType) {
      case 'increase':
        return <TrendingUp className="w-4 h-4 text-green-500" />
      case 'decrease':
        return <TrendingDown className="w-4 h-4 text-red-500" />
      default:
        return <Minus className="w-4 h-4 text-gray-500" />
    }
  }

  const getChangeColor = (changeType: string) => {
    switch (changeType) {
      case 'increase':
        return 'text-green-500'
      case 'decrease':
        return 'text-red-500'
      default:
        return 'text-gray-500'
    }
  }

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'opportunity':
        return <Lightbulb className="w-5 h-5 text-yellow-500" />
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-orange-500" />
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'info':
        return <Info className="w-5 h-5 text-blue-500" />
      default:
        return <Info className="w-5 h-5 text-gray-500" />
    }
  }

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'opportunity':
        return 'border-yellow-500/20 bg-yellow-500/10'
      case 'warning':
        return 'border-orange-500/20 bg-orange-500/10'
      case 'success':
        return 'border-green-500/20 bg-green-500/10'
      case 'info':
        return 'border-blue-500/20 bg-blue-500/10'
      default:
        return 'border-gray-500/20 bg-gray-500/10'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white flex items-center">
            <BarChart3 className="w-8 h-8 mr-3 text-blue-400" />
            Analytics Predictivos
          </h2>
          <p className="text-gray-400">Insights inteligentes y predicciones para tu negocio</p>
        </div>
        <div className="flex items-center space-x-4">
          <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
            <SelectTrigger className="w-32 bg-gray-800 border-gray-600 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-600">
              <SelectItem value="7d" className="text-white">7 días</SelectItem>
              <SelectItem value="30d" className="text-white">30 días</SelectItem>
              <SelectItem value="90d" className="text-white">90 días</SelectItem>
              <SelectItem value="1y" className="text-white">1 año</SelectItem>
            </SelectContent>
          </Select>
          <Button
            onClick={handleRefresh}
            disabled={isRefreshing}
            variant="outline"
            className="text-white border-white/20 hover:bg-white/10"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={selectedCategory === 'all' ? 'default' : 'outline'}
          onClick={() => setSelectedCategory('all')}
          className="text-white"
        >
          Todas ({MAIN_METRICS.length})
        </Button>
        {['conversion', 'engagement', 'revenue', 'performance'].map((category) => {
          const count = getMetricsByCategory(category).length
          return (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(category)}
              className="text-white capitalize"
            >
              {category} ({count})
            </Button>
          )
        })}
      </div>

      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMetrics.map((metric) => (
          <Card key={metric.id} className="bg-white/5 backdrop-blur-xl border-white/10 hover:bg-white/10 transition-all duration-300">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white text-lg">{metric.name}</CardTitle>
                <Badge className={`${getChangeColor(metric.changeType)} bg-transparent border`}>
                  {getChangeIcon(metric.changeType)}
                  <span className="ml-1">{Math.abs(metric.change)}%</span>
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-baseline space-x-2">
                  <span className="text-3xl font-bold text-white">
                    {metric.value.toLocaleString()}
                  </span>
                  <span className="text-gray-400">{metric.unit}</span>
                </div>
                
                {metric.prediction && (
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-400">Predicción:</span>
                    <span className="text-lg font-semibold text-green-400">
                      {metric.prediction.toLocaleString()}{metric.unit}
                    </span>
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                      {metric.confidence * 100}% confianza
                    </Badge>
                  </div>
                )}

                <div className="text-sm text-gray-300">
                  <div className="flex items-center space-x-2">
                    <Target className="w-4 h-4" />
                    <span>{getTrendAnalysis(metric)}</span>
                  </div>
                </div>

                <div className="text-xs text-gray-400 bg-gray-800/50 p-2 rounded">
                  <strong>Recomendación:</strong> {getRecommendation(metric)}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Insights de IA */}
      <Card className="bg-white/5 backdrop-blur-xl border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Lightbulb className="w-5 h-5 mr-2 text-yellow-400" />
            Insights de IA
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {INSIGHTS.map((insight) => (
              <div
                key={insight.id}
                className={`p-4 rounded-lg border ${getInsightColor(insight.type)}`}
              >
                <div className="flex items-start space-x-3">
                  {getInsightIcon(insight.type)}
                  <div className="flex-1">
                    <h4 className="text-white font-semibold mb-2">{insight.title}</h4>
                    <p className="text-gray-300 text-sm mb-3">{insight.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                          {insight.impact} impacto
                        </Badge>
                        {insight.value && (
                          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                            {insight.value > 0 ? '+' : ''}{insight.value}%
                          </Badge>
                        )}
                      </div>
                      <Button size="sm" variant="outline" className="text-white border-white/20 hover:bg-white/10">
                        {insight.action}
                      </Button>
                    </div>
                    {insight.timeframe && (
                      <div className="mt-2 text-xs text-gray-400">
                        Tiempo estimado: {insight.timeframe}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Predicciones */}
      <Card className="bg-white/5 backdrop-blur-xl border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-green-400" />
            Predicciones de IA
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {PREDICTIONS.map((prediction, index) => (
              <div key={index} className="p-4 bg-gray-800/50 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-white font-semibold text-lg">{prediction.metric}</h4>
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                    {prediction.confidence * 100}% confianza
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">
                      {prediction.currentValue.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-400">Valor Actual</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">
                      {prediction.predictedValue.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-400">Predicción</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-400">
                      {prediction.timeframe}
                    </div>
                    <div className="text-sm text-gray-400">Tiempo</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <h5 className="text-white font-medium mb-2">Factores Clave:</h5>
                    <div className="flex flex-wrap gap-2">
                      {prediction.factors.map((factor, factorIndex) => (
                        <Badge key={factorIndex} className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                          {factor}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h5 className="text-white font-medium mb-2">Recomendaciones:</h5>
                    <ul className="space-y-1">
                      {prediction.recommendations.map((recommendation, recIndex) => (
                        <li key={recIndex} className="text-gray-300 text-sm flex items-start">
                          <CheckCircle className="w-4 h-4 mr-2 text-green-400 mt-0.5 flex-shrink-0" />
                          {recommendation}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Acciones rápidas */}
      <Card className="bg-white/5 backdrop-blur-xl border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Acciones Rápidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button className="bg-blue-500 hover:bg-blue-600 text-white h-12">
              <Download className="w-4 h-4 mr-2" />
              Exportar Reporte
            </Button>
            <Button variant="outline" className="text-white border-white/20 hover:bg-white/10 h-12">
              <Eye className="w-4 h-4 mr-2" />
              Ver Detalles
            </Button>
            <Button variant="outline" className="text-white border-white/20 hover:bg-white/10 h-12">
              <Filter className="w-4 h-4 mr-2" />
              Filtros Avanzados
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
