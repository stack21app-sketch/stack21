'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Activity, 
  DollarSign, 
  Clock,
  Download,
  RefreshCw,
  Settings,
  Filter,
  Zap,
  AlertCircle,
  CheckCircle,
  Info,
  Play,
  Pause,
  Calendar,
  Target,
  Award,
  Globe,
  Smartphone,
  Monitor
} from 'lucide-react'
import AnalyticsChart from '@/components/analytics/analytics-chart'

export default function AnalyticsPage() {
  const [isLive, setIsLive] = useState(true)
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d')
  const [selectedMetric, setSelectedMetric] = useState('all')
  const [showFilters, setShowFilters] = useState(false)
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  const timeRanges = [
    { value: '1h', label: 'Última hora' },
    { value: '24h', label: 'Últimas 24h' },
    { value: '7d', label: 'Últimos 7 días' },
    { value: '30d', label: 'Últimos 30 días' },
    { value: '90d', label: 'Últimos 90 días' },
    { value: '1y', label: 'Último año' }
  ]

  const metrics = [
    { value: 'all', label: 'Todas las métricas' },
    { value: 'users', label: 'Usuarios' },
    { value: 'revenue', label: 'Ingresos' },
    { value: 'workflows', label: 'Workflows' },
    { value: 'performance', label: 'Rendimiento' }
  ]

  const tabs = [
    { id: 'overview', label: 'Resumen', icon: BarChart3 },
    { id: 'workflows', label: 'Workflows', icon: Zap },
    { id: 'users', label: 'Usuarios', icon: Users },
    { id: 'revenue', label: 'Ingresos', icon: DollarSign },
    { id: 'performance', label: 'Rendimiento', icon: Activity }
  ]

  const mockChartData = {
    users: [
      { time: '00:00', value: 1200, label: '1,200' },
      { time: '04:00', value: 1150, label: '1,150' },
      { time: '08:00', value: 1300, label: '1,300' },
      { time: '12:00', value: 1450, label: '1,450' },
      { time: '16:00', value: 1600, label: '1,600' },
      { time: '20:00', value: 1400, label: '1,400' }
    ],
    revenue: [
      { time: 'Ene', value: 8500, label: '$8,500' },
      { time: 'Feb', value: 9200, label: '$9,200' },
      { time: 'Mar', value: 10800, label: '$10,800' },
      { time: 'Abr', value: 11200, label: '$11,200' },
      { time: 'May', value: 12340, label: '$12,340' }
    ],
    workflows: [
      { time: '00:00', value: 45, label: '45' },
      { time: '04:00', value: 38, label: '38' },
      { time: '08:00', value: 52, label: '52' },
      { time: '12:00', value: 67, label: '67' },
      { time: '16:00', value: 73, label: '73' },
      { time: '20:00', value: 58, label: '58' }
    ],
    performance: [
      { time: '00:00', value: 1.2, label: '1.2s' },
      { time: '04:00', value: 1.1, label: '1.1s' },
      { time: '08:00', value: 1.3, label: '1.3s' },
      { time: '12:00', value: 1.5, label: '1.5s' },
      { time: '16:00', value: 1.4, label: '1.4s' },
      { time: '20:00', value: 1.2, label: '1.2s' }
    ]
  }

  const kpiData = [
    {
      title: 'Usuarios Activos',
      value: '2,341',
      change: '+12.5%',
      trend: 'up',
      icon: Users,
      color: 'blue'
    },
    {
      title: 'Ingresos Mensuales',
      value: '$45,230',
      change: '+8.3%',
      trend: 'up',
      icon: DollarSign,
      color: 'green'
    },
    {
      title: 'Workflows Ejecutados',
      value: '12,847',
      change: '+23.1%',
      trend: 'up',
      icon: Zap,
      color: 'purple'
    },
    {
      title: 'Tiempo Promedio',
      value: '1.3s',
      change: '-5.2%',
      trend: 'down',
      icon: Clock,
      color: 'orange'
    }
  ]

  const topWorkflows = [
    { name: 'Email Marketing Automation', executions: 2341, successRate: 98.5, avgTime: '1.2s' },
    { name: 'Data Sync Process', executions: 1892, successRate: 99.1, avgTime: '0.8s' },
    { name: 'User Onboarding', executions: 1456, successRate: 97.8, avgTime: '2.1s' },
    { name: 'Report Generation', executions: 1234, successRate: 96.2, avgTime: '3.4s' },
    { name: 'Notification System', executions: 987, successRate: 99.5, avgTime: '0.5s' }
  ]

  const realTimeEvents = [
    { id: 1, type: 'workflow', message: 'Workflow "Email Marketing" ejecutado exitosamente', time: '2 min ago', status: 'success' },
    { id: 2, type: 'user', message: 'Nuevo usuario registrado: john@example.com', time: '5 min ago', status: 'info' },
    { id: 3, type: 'error', message: 'Error en workflow "Data Sync" - conexión perdida', time: '8 min ago', status: 'error' },
    { id: 4, type: 'integration', message: 'Slack integración actualizada', time: '12 min ago', status: 'success' },
    { id: 5, type: 'workflow', message: 'Workflow "Report Gen" completado en 2.3s', time: '15 min ago', status: 'success' }
  ]

  const userSegments = [
    { name: 'Nuevos usuarios', count: 234, percentage: 12.5, color: 'blue' },
    { name: 'Usuarios activos', count: 1456, percentage: 78.2, color: 'green' },
    { name: 'Usuarios inactivos', count: 187, percentage: 9.3, color: 'gray' }
  ]

  const deviceStats = [
    { device: 'Desktop', count: 1234, percentage: 52.7, icon: Monitor },
    { device: 'Mobile', count: 987, percentage: 42.1, icon: Smartphone },
    { device: 'Tablet', count: 120, percentage: 5.2, icon: Globe }
  ]

  const handleRefresh = () => {
    console.log('Refreshing analytics data...')
  }

  const handleExport = () => {
    console.log('Exporting analytics data...')
  }

  const handleConfigure = () => {
    console.log('Configuring analytics...')
  }

  const handleTimeRangeChange = (range: string) => {
    setSelectedTimeRange(range)
    console.log('Time range changed to:', range)
  }

  const handleMetricChange = (metric: string) => {
    setSelectedMetric(metric)
    console.log('Metric changed to:', metric)
  }

  const renderOverview = () => (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiData.map((kpi, index) => (
          <Card key={index} className="bg-white shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{kpi.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
                  <div className="flex items-center mt-1">
                    <span className={`text-sm font-medium ${
                      kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {kpi.change}
                    </span>
                    <span className="text-sm text-gray-500 ml-1">vs mes anterior</span>
                  </div>
                </div>
                <div className={`p-3 rounded-full bg-${kpi.color}-100`}>
                  <kpi.icon className={`h-6 w-6 text-${kpi.color}-600`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Usuarios Activos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <AnalyticsChart data={mockChartData.users} type="line" title="Usuarios Activos" />
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center">
              <DollarSign className="h-5 w-5 mr-2" />
              Ingresos Mensuales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <AnalyticsChart data={mockChartData.revenue} type="bar" title="Ingresos" />
          </CardContent>
        </Card>
      </div>

      {/* Real-time Events */}
      <Card className="bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Activity className="h-5 w-5 mr-2" />
            Eventos en Tiempo Real
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {realTimeEvents.map((event) => (
              <div key={event.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className={`w-2 h-2 rounded-full ${
                  event.status === 'success' ? 'bg-green-500' :
                  event.status === 'error' ? 'bg-red-500' : 'bg-blue-500'
                }`} />
                <div className="flex-1">
                  <p className="text-sm text-gray-900">{event.message}</p>
                  <p className="text-xs text-gray-500">{event.time}</p>
                </div>
                <Badge variant="outline" className="text-xs">
                  {event.type}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderWorkflows = () => (
    <div className="space-y-6">
      <Card className="bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Zap className="h-5 w-5 mr-2" />
            Ejecuciones de Workflows
          </CardTitle>
        </CardHeader>
        <CardContent>
          <AnalyticsChart data={mockChartData.workflows} type="area" title="Workflows" />
        </CardContent>
      </Card>

      <Card className="bg-white shadow-sm">
        <CardHeader>
          <CardTitle>Top Workflows</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topWorkflows.map((workflow, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-blue-600">{index + 1}</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{workflow.name}</h3>
                    <p className="text-sm text-gray-500">{workflow.executions} ejecuciones</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">{workflow.successRate}% éxito</div>
                  <div className="text-sm text-gray-500">{workflow.avgTime} promedio</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderUsers = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-white shadow-sm">
          <CardHeader>
            <CardTitle>Segmentos de Usuario</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {userSegments.map((segment, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full bg-${segment.color}-500`} />
                    <span className="text-sm font-medium text-gray-900">{segment.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-gray-900">{segment.count}</div>
                    <div className="text-xs text-gray-500">{segment.percentage}%</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm">
          <CardHeader>
            <CardTitle>Dispositivos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {deviceStats.map((device, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <device.icon className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-900">{device.device}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-gray-900">{device.count}</div>
                    <div className="text-xs text-gray-500">{device.percentage}%</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white shadow-sm">
        <CardHeader>
          <CardTitle>Usuarios Activos en Tiempo Real</CardTitle>
        </CardHeader>
        <CardContent>
          <AnalyticsChart data={mockChartData.users} type="line" title="Usuarios" />
        </CardContent>
      </Card>
    </div>
  )

  const renderRevenue = () => (
    <div className="space-y-6">
      <Card className="bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center">
            <DollarSign className="h-5 w-5 mr-2" />
            Ingresos Mensuales
          </CardTitle>
        </CardHeader>
        <CardContent>
          <AnalyticsChart data={mockChartData.revenue} type="bar" title="Ingresos" />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white shadow-sm">
          <CardContent className="p-6 text-center">
            <DollarSign className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">$45,230</div>
            <div className="text-sm text-gray-500">Ingresos este mes</div>
          </CardContent>
        </Card>
        <Card className="bg-white shadow-sm">
          <CardContent className="p-6 text-center">
            <TrendingUp className="h-8 w-8 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">+8.3%</div>
            <div className="text-sm text-gray-500">Crecimiento mensual</div>
          </CardContent>
        </Card>
        <Card className="bg-white shadow-sm">
          <CardContent className="p-6 text-center">
            <Target className="h-8 w-8 text-purple-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">$52,000</div>
            <div className="text-sm text-gray-500">Meta mensual</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  const renderPerformance = () => (
    <div className="space-y-6">
      <Card className="bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Activity className="h-5 w-5 mr-2" />
            Tiempo de Respuesta
          </CardTitle>
        </CardHeader>
        <CardContent>
          <AnalyticsChart data={mockChartData.performance} type="line" title="Rendimiento" />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-white shadow-sm">
          <CardHeader>
            <CardTitle>Métricas de Rendimiento</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Tiempo promedio</span>
              <span className="text-sm font-bold text-gray-900">1.3s</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Uptime</span>
              <span className="text-sm font-bold text-green-600">99.9%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Errores</span>
              <span className="text-sm font-bold text-red-600">0.1%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Throughput</span>
              <span className="text-sm font-bold text-gray-900">1,234 req/s</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm">
          <CardHeader>
            <CardTitle>Alertas de Rendimiento</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
              <AlertCircle className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-sm font-medium text-gray-900">Alto uso de CPU</p>
                <p className="text-xs text-gray-500">Hace 5 minutos</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm font-medium text-gray-900">Sistema estable</p>
                <p className="text-xs text-gray-500">Hace 1 hora</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl">
                <BarChart3 className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
                <p className="text-gray-600">Métricas y análisis en tiempo real</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant={isLive ? 'default' : 'outline'}
                onClick={() => setIsLive(!isLive)}
                className="flex items-center"
              >
                {isLive ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                {isLive ? 'En Vivo' : 'Pausado'}
              </Button>
              <Button variant="outline" size="sm" onClick={handleRefresh}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Actualizar
              </Button>
              <Button variant="outline" size="sm" onClick={handleExport}>
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
              <Button variant="outline" size="sm" onClick={handleConfigure}>
                <Settings className="h-4 w-4 mr-2" />
                Configurar
              </Button>
            </div>
          </div>

          {/* Filters */}
          <Card className="p-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-700">Período:</span>
                <select
                  value={selectedTimeRange}
                  onChange={(e) => handleTimeRangeChange(e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm"
                >
                  {timeRanges.map(range => (
                    <option key={range.value} value={range.value}>
                      {range.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-700">Métrica:</span>
                <select
                  value={selectedMetric}
                  onChange={(e) => handleMetricChange(e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm"
                >
                  {metrics.map(metric => (
                    <option key={metric.value} value={metric.value}>
                      {metric.label}
                    </option>
                  ))}
                </select>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-4 w-4 mr-2" />
                Filtros
              </Button>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="autoRefresh"
                  checked={autoRefresh}
                  onChange={(e) => setAutoRefresh(e.target.checked)}
                  className="rounded"
                />
                <label htmlFor="autoRefresh" className="text-sm text-gray-700">
                  Auto-actualizar
                </label>
              </div>
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'workflows' && renderWorkflows()}
        {activeTab === 'users' && renderUsers()}
        {activeTab === 'revenue' && renderRevenue()}
        {activeTab === 'performance' && renderPerformance()}
      </div>
    </div>
  )
}