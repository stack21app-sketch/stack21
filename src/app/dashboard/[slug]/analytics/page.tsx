'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Activity,
  Clock,
  Zap,
  Brain,
  Image,
  Music,
  MessageSquare,
  FileText,
  Download,
  RefreshCw
} from 'lucide-react'

interface AnalyticsData {
  totalRequests: number
  requestsToday: number
  requestsThisWeek: number
  requestsThisMonth: number
  averageResponseTime: number
  successRate: number
  topFeatures: Array<{ name: string; count: number; percentage: number }>
  hourlyUsage: Array<{ hour: number; requests: number }>
  dailyUsage: Array<{ date: string; requests: number }>
  userActivity: Array<{ time: string; action: string; feature: string }>
}

export default function AnalyticsPage() {
  const params = useParams()
  const { data: session } = useSession()
  const slug = params.slug as string

  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('7d')

  const timeRanges = [
    { id: '24h', name: 'Últimas 24h' },
    { id: '7d', name: 'Últimos 7 días' },
    { id: '30d', name: 'Últimos 30 días' },
    { id: '90d', name: 'Últimos 90 días' }
  ]

  useEffect(() => {
    fetchAnalytics()
  }, [timeRange])

  const fetchAnalytics = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/analytics?timeRange=${timeRange}`)
      if (response.ok) {
        const data = await response.json()
        setAnalytics(data)
      }
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  const mockAnalytics: AnalyticsData = {
    totalRequests: 1247,
    requestsToday: 89,
    requestsThisWeek: 456,
    requestsThisMonth: 1247,
    averageResponseTime: 1.2,
    successRate: 98.7,
    topFeatures: [
      { name: 'Generación de Imágenes', count: 456, percentage: 36.6 },
      { name: 'Chatbot', count: 234, percentage: 18.8 },
      { name: 'Editor de Texto', count: 198, percentage: 15.9 },
      { name: 'Generación de Música', count: 156, percentage: 12.5 },
      { name: 'Análisis de Código', count: 123, percentage: 9.9 },
      { name: 'Procesamiento de Datos', count: 80, percentage: 6.4 }
    ],
    hourlyUsage: [
      { hour: 0, requests: 12 },
      { hour: 1, requests: 8 },
      { hour: 2, requests: 5 },
      { hour: 3, requests: 3 },
      { hour: 4, requests: 2 },
      { hour: 5, requests: 4 },
      { hour: 6, requests: 8 },
      { hour: 7, requests: 15 },
      { hour: 8, requests: 28 },
      { hour: 9, requests: 45 },
      { hour: 10, requests: 52 },
      { hour: 11, requests: 48 },
      { hour: 12, requests: 38 },
      { hour: 13, requests: 42 },
      { hour: 14, requests: 55 },
      { hour: 15, requests: 61 },
      { hour: 16, requests: 58 },
      { hour: 17, requests: 49 },
      { hour: 18, requests: 35 },
      { hour: 19, requests: 28 },
      { hour: 20, requests: 22 },
      { hour: 21, requests: 18 },
      { hour: 22, requests: 15 },
      { hour: 23, requests: 13 }
    ],
    dailyUsage: [
      { date: '2024-01-01', requests: 45 },
      { date: '2024-01-02', requests: 52 },
      { date: '2024-01-03', requests: 38 },
      { date: '2024-01-04', requests: 61 },
      { date: '2024-01-05', requests: 49 },
      { date: '2024-01-06', requests: 35 },
      { date: '2024-01-07', requests: 42 }
    ],
    userActivity: [
      { time: '14:30', action: 'Generó imagen', feature: 'Generación de Imágenes' },
      { time: '14:25', action: 'Mejoró texto', feature: 'Editor de Texto' },
      { time: '14:20', action: 'Conversó con bot', feature: 'Chatbot' },
      { time: '14:15', action: 'Creó música', feature: 'Generación de Música' },
      { time: '14:10', action: 'Analizó código', feature: 'Análisis de Código' }
    ]
  }

  const data = analytics || mockAnalytics

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white">No autorizado</h2>
          <p className="text-gray-300">Debes iniciar sesión para ver analytics</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <BarChart3 className="h-8 w-8 text-cyan-400 mr-3" />
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  Analytics & Métricas
                </h1>
                <p className="text-sm text-gray-300">Monitorea el rendimiento de tu workspace</p>
              </div>
            </div>
            <div className="flex gap-2">
              <div className="flex gap-1">
                {timeRanges.map((range) => (
                  <Button
                    key={range.id}
                    size="sm"
                    variant={timeRange === range.id ? "default" : "outline"}
                    onClick={() => setTimeRange(range.id)}
                    className={timeRange === range.id ? 'bg-purple-600 hover:bg-purple-700' : 'border-white/20 text-white hover:bg-white/10'}
                  >
                    {range.name}
                  </Button>
                ))}
              </div>
              <Button 
                variant="outline" 
                onClick={fetchAnalytics}
                disabled={loading}
                className="border-white/20 text-white hover:bg-white/10"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Actualizar
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-black/20 backdrop-blur-lg border-white/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Total Requests</CardTitle>
              <Activity className="h-5 w-5 text-cyan-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{data.totalRequests.toLocaleString()}</div>
              <p className="text-xs text-gray-400 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1 text-green-400" />
                +12% vs mes anterior
              </p>
            </CardContent>
          </Card>

          <Card className="bg-black/20 backdrop-blur-lg border-white/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Requests Hoy</CardTitle>
              <Clock className="h-5 w-5 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{data.requestsToday}</div>
              <p className="text-xs text-gray-400 flex items-center">
                <Zap className="h-3 w-3 mr-1 text-yellow-400" />
                Actividad alta
              </p>
            </CardContent>
          </Card>

          <Card className="bg-black/20 backdrop-blur-lg border-white/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Tiempo Respuesta</CardTitle>
              <Zap className="h-5 w-5 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{data.averageResponseTime}s</div>
              <p className="text-xs text-gray-400 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1 text-green-400" />
                Excelente rendimiento
              </p>
            </CardContent>
          </Card>

          <Card className="bg-black/20 backdrop-blur-lg border-white/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Tasa de Éxito</CardTitle>
              <Brain className="h-5 w-5 text-pink-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{data.successRate}%</div>
              <p className="text-xs text-gray-400 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1 text-green-400" />
                Muy estable
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Top Features */}
          <Card className="bg-black/20 backdrop-blur-lg border-white/10">
            <CardHeader>
              <CardTitle className="text-lg text-white flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-purple-400" />
                Funciones Más Usadas
              </CardTitle>
              <CardDescription className="text-gray-400">
                Distribución de uso por funcionalidad
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.topFeatures.map((feature, index) => (
                  <div key={feature.name} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center justify-center w-8 h-8 bg-purple-600 rounded-full text-white text-sm font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <p className="text-white font-medium">{feature.name}</p>
                        <p className="text-sm text-gray-400">{feature.count} requests</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-bold">{feature.percentage}%</p>
                      <div className="w-20 bg-gray-700 rounded-full h-2 mt-1">
                        <div 
                          className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full" 
                          style={{ width: `${feature.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="bg-black/20 backdrop-blur-lg border-white/10">
            <CardHeader>
              <CardTitle className="text-lg text-white flex items-center">
                <Activity className="h-5 w-5 mr-2 text-green-400" />
                Actividad Reciente
              </CardTitle>
              <CardDescription className="text-gray-400">
                Últimas acciones en tu workspace
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.userActivity.map((activity, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <div className="flex-1">
                      <p className="text-white text-sm">{activity.action}</p>
                      <p className="text-xs text-gray-400">{activity.feature}</p>
                    </div>
                    <span className="text-xs text-gray-500">{activity.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Usage Chart */}
        <Card className="bg-black/20 backdrop-blur-lg border-white/10">
          <CardHeader>
            <CardTitle className="text-lg text-white flex items-center">
              <BarChart3 className="h-5 w-5 mr-2 text-blue-400" />
              Uso por Hora
            </CardTitle>
            <CardDescription className="text-gray-400">
              Patrón de uso durante el día
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-end space-x-1">
              {data.hourlyUsage.map((hour) => (
                <div key={hour.hour} className="flex-1 flex flex-col items-center">
                  <div 
                    className="w-full bg-gradient-to-t from-blue-500 to-purple-500 rounded-t"
                    style={{ height: `${(hour.requests / 61) * 200}px` }}
                  ></div>
                  <span className="text-xs text-gray-400 mt-2">{hour.hour}:00</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
