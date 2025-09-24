'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Clock, 
  Zap, 
  Brain, 
  MessageSquare,
  Activity,
  Target,
  RefreshCw
} from 'lucide-react'

interface AIMetrics {
  totalCommands: number
  successfulCommands: number
  failedCommands: number
  averageResponseTime: number
  mostUsedCommands: Array<{ command: string; count: number }>
  userSatisfaction: number
  mlPredictions: number
  integrationsUsed: Array<{ service: string; count: number }>
  dailyUsage: Array<{ date: string; commands: number }>
}

export function AIAgentMetrics() {
  const [metrics, setMetrics] = useState<AIMetrics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simular carga de métricas
    const loadMetrics = async () => {
      setLoading(true)
      
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setMetrics({
        totalCommands: 1247,
        successfulCommands: 1189,
        failedCommands: 58,
        averageResponseTime: 1.2,
        mostUsedCommands: [
          { command: 'Crear workflow', count: 234 },
          { command: 'Analizar datos', count: 189 },
          { command: 'Enviar email', count: 156 },
          { command: 'Mostrar analytics', count: 134 },
          { command: 'Predecir rendimiento', count: 98 }
        ],
        userSatisfaction: 94.5,
        mlPredictions: 456,
        integrationsUsed: [
          { service: 'Slack', count: 89 },
          { service: 'Gmail', count: 67 },
          { service: 'OpenAI', count: 234 },
          { service: 'ML Models', count: 156 }
        ],
        dailyUsage: [
          { date: '2024-01-01', commands: 45 },
          { date: '2024-01-02', commands: 52 },
          { date: '2024-01-03', commands: 38 },
          { date: '2024-01-04', commands: 61 },
          { date: '2024-01-05', commands: 73 },
          { date: '2024-01-06', commands: 48 },
          { date: '2024-01-07', commands: 55 }
        ]
      })
      
      setLoading(false)
    }

    loadMetrics()
  }, [])

  const refreshMetrics = () => {
    setLoading(true)
    // Simular refresh
    setTimeout(() => setLoading(false), 1000)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Métricas del Agente IA</h2>
          <Button disabled>
            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            Cargando...
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (!metrics) return null

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Métricas del Agente IA</h2>
          <p className="text-gray-600">Rendimiento y uso del asistente inteligente</p>
        </div>
        <Button onClick={refreshMetrics} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Actualizar
        </Button>
      </div>

      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <MessageSquare className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium text-gray-600">Comandos Totales</p>
                <p className="text-2xl font-bold">{metrics.totalCommands.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm font-medium text-gray-600">Tasa de Éxito</p>
                <p className="text-2xl font-bold">
                  {((metrics.successfulCommands / metrics.totalCommands) * 100).toFixed(1)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm font-medium text-gray-600">Tiempo Promedio</p>
                <p className="text-2xl font-bold">{metrics.averageResponseTime}s</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Brain className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-sm font-medium text-gray-600">Predicciones ML</p>
                <p className="text-2xl font-bold">{metrics.mlPredictions}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Comandos más usados */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <span>Comandos Más Utilizados</span>
          </CardTitle>
          <CardDescription>Top 5 comandos más ejecutados</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {metrics.mostUsedCommands.map((command, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Badge variant="outline" className="w-8 h-8 rounded-full flex items-center justify-center">
                    {index + 1}
                  </Badge>
                  <span className="font-medium">{command.command}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ 
                        width: `${(command.count / metrics.mostUsedCommands[0].count) * 100}%` 
                      }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 w-12 text-right">{command.count}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Integraciones utilizadas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="h-5 w-5" />
            <span>Integraciones Utilizadas</span>
          </CardTitle>
          <CardDescription>Servicios externos más usados</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {metrics.integrationsUsed.map((integration, index) => (
              <div key={index} className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{integration.count}</div>
                <div className="text-sm text-gray-600">{integration.service}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Uso diario */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="h-5 w-5" />
            <span>Uso Diario (Últimos 7 días)</span>
          </CardTitle>
          <CardDescription>Comandos ejecutados por día</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-end space-x-2 h-32">
            {metrics.dailyUsage.map((day, index) => {
              const maxCommands = Math.max(...metrics.dailyUsage.map(d => d.commands))
              const height = (day.commands / maxCommands) * 100
              
              return (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div 
                    className="w-full bg-gradient-to-t from-blue-500 to-blue-300 rounded-t"
                    style={{ height: `${height}%` }}
                  ></div>
                  <div className="text-xs text-gray-600 mt-2">
                    {new Date(day.date).toLocaleDateString('es-ES', { weekday: 'short' })}
                  </div>
                  <div className="text-xs font-medium">{day.commands}</div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Satisfacción del usuario */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>Satisfacción del Usuario</span>
          </CardTitle>
          <CardDescription>Basado en feedback y uso del agente</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className="text-4xl font-bold text-green-600">{metrics.userSatisfaction}%</div>
            <div className="flex-1">
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full" 
                  style={{ width: `${metrics.userSatisfaction}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Excelente rendimiento del agente de IA
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
