'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import MobileNavigation from '@/components/mobile/mobile-navigation'
import { MetricCard, ListCard } from '@/components/mobile/mobile-optimized-card'
import { 
  Users, 
  Zap, 
  DollarSign, 
  Activity, 
  TrendingUp, 
  Clock, 
  Star,
  Workflow,
  Brain,
  BarChart3,
  Bell,
  Settings,
  Plus,
  Search,
  Filter,
  Play,
  Pause,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  X,
  Menu,
  Home,
  Calendar,
  Mail,
  MessageSquare,
  Cloud,
  Shield,
  Target,
  Sparkles
} from 'lucide-react'

export default function MobileDashboardPage() {
  const [currentPath, setCurrentPath] = useState('/dashboard')
  const [showNotifications, setShowNotifications] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const [searchQuery, setSearchQuery] = useState('')
  const [showQuickActions, setShowQuickActions] = useState(false)
  const [showMenu, setShowMenu] = useState(false)

  const handleNavigate = (path: string) => {
    setCurrentPath(path)
    console.log('Navigate to:', path)
  }

  const quickActions = [
    { id: 'create-workflow', label: 'Nuevo Workflow', icon: Plus, color: 'blue' },
    { id: 'ai-chat', label: 'Chat IA', icon: Brain, color: 'purple' },
    { id: 'analytics', label: 'Ver Analytics', icon: BarChart3, color: 'green' },
    { id: 'notifications', label: 'Notificaciones', icon: Bell, color: 'orange' },
    { id: 'settings', label: 'Configuración', icon: Settings, color: 'gray' },
    { id: 'search', label: 'Buscar', icon: Search, color: 'indigo' }
  ]

  const recentActivities = [
    { id: 1, type: 'workflow', title: 'Workflow "Email Marketing" ejecutado', time: '2 min ago', status: 'success' },
    { id: 2, type: 'ai', title: 'IA generó 3 variaciones de contenido', time: '15 min ago', status: 'success' },
    { id: 3, type: 'integration', title: 'Slack conectado exitosamente', time: '1 hora ago', status: 'success' },
    { id: 4, type: 'alert', title: 'Límite de API alcanzado', time: '2 horas ago', status: 'warning' },
    { id: 5, type: 'workflow', title: 'Workflow "Data Sync" falló', time: '3 horas ago', status: 'error' }
  ]

  const tabs = [
    { id: 'overview', label: 'Resumen', icon: BarChart3 },
    { id: 'workflows', label: 'Workflows', icon: Workflow },
    { id: 'ai', label: 'IA', icon: Brain },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'settings', label: 'Config', icon: Settings }
  ]

  const metrics = [
    {
      title: 'Usuarios Activos',
      value: '1,247',
      change: { value: 12.5, type: 'increase' as const },
      icon: Users,
      color: 'blue' as const
    },
    {
      title: 'Workflows',
      value: '45',
      change: { value: 8.3, type: 'increase' as const },
      icon: Workflow,
      color: 'blue' as const
    },
    {
      title: 'Ejecuciones Hoy',
      value: '2,341',
      change: { value: 15.2, type: 'increase' as const },
      icon: Zap,
      color: 'green' as const
    },
    {
      title: 'Ingresos',
      value: '$12,450',
      change: { value: 5.7, type: 'increase' as const },
      icon: DollarSign,
      color: 'green' as const
    }
  ]

  const notifications = [
    { id: 1, title: 'Nuevo workflow creado', message: 'El workflow "Email Marketing" se ejecutó exitosamente', time: '2 min ago', unread: true },
    { id: 2, title: 'Integración actualizada', message: 'Slack se conectó correctamente', time: '1 hora ago', unread: true },
    { id: 3, title: 'Límite de API', message: 'Te acercas al límite de requests mensuales', time: '3 horas ago', unread: false }
  ]

  const workflows = [
    { id: 1, name: 'Email Marketing', status: 'running', executions: 45, lastRun: '2 min ago' },
    { id: 2, name: 'Data Sync', status: 'paused', executions: 23, lastRun: '1 hora ago' },
    { id: 3, name: 'User Onboarding', status: 'running', executions: 67, lastRun: '5 min ago' },
    { id: 4, name: 'Report Generation', status: 'error', executions: 12, lastRun: '2 horas ago' }
  ]

  const aiInsights = [
    { id: 1, title: 'Optimización sugerida', description: 'Tu workflow de email puede ser 23% más eficiente', type: 'optimization' },
    { id: 2, title: 'Nueva integración', description: 'Considera conectar con HubSpot para mejor ROI', type: 'suggestion' },
    { id: 3, title: 'Anomalía detectada', description: 'Patrón inusual en las ejecuciones de ayer', type: 'alert' }
  ]

  const renderOverview = () => (
    <div className="space-y-6 p-4">
      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-4">
        {metrics.map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </div>

      {/* Quick Stats */}
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-white text-lg">Resumen Rápido</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-300">Workflows activos</span>
            <span className="text-white font-semibold">12</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-300">Integraciones</span>
            <span className="text-white font-semibold">8</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-300">Uptime</span>
            <span className="text-green-400 font-semibold">99.9%</span>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activities */}
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-white text-lg flex items-center">
            <Activity className="h-5 w-5 mr-2" />
            Actividad Reciente
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {recentActivities.slice(0, 4).map((activity) => (
            <div key={activity.id} className="flex items-center space-x-3">
              <div className={`w-2 h-2 rounded-full ${
                activity.status === 'success' ? 'bg-green-500' :
                activity.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
              }`} />
              <div className="flex-1">
                <p className="text-white text-sm">{activity.title}</p>
                <p className="text-gray-400 text-xs">{activity.time}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )

  const renderWorkflows = () => (
    <div className="space-y-4 p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Workflows</h2>
        <Button size="sm" className="bg-purple-500 hover:bg-purple-600">
          <Plus className="h-4 w-4 mr-2" />
          Nuevo
        </Button>
      </div>
      
      {workflows.map((workflow) => (
        <Card key={workflow.id} className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-white font-semibold">{workflow.name}</h3>
              <div className="flex items-center space-x-2">
                {workflow.status === 'running' && (
                  <Badge className="bg-green-500 text-white">
                    <Play className="h-3 w-3 mr-1" />
                    Activo
                  </Badge>
                )}
                {workflow.status === 'paused' && (
                  <Badge className="bg-yellow-500 text-white">
                    <Pause className="h-3 w-3 mr-1" />
                    Pausado
                  </Badge>
                )}
                {workflow.status === 'error' && (
                  <Badge className="bg-red-500 text-white">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    Error
                  </Badge>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-400">Ejecuciones:</span>
                <span className="text-white ml-2">{workflow.executions}</span>
              </div>
              <div>
                <span className="text-gray-400">Última ejecución:</span>
                <span className="text-white ml-2">{workflow.lastRun}</span>
              </div>
            </div>
            
            <div className="flex space-x-2 mt-3">
              <Button size="sm" variant="outline" className="flex-1">
                <Settings className="h-4 w-4 mr-2" />
                Configurar
              </Button>
              <Button size="sm" variant="outline">
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )

  const renderAI = () => (
    <div className="space-y-4 p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Asistente IA</h2>
        <Button size="sm" className="bg-purple-500 hover:bg-purple-600">
          <Brain className="h-4 w-4 mr-2" />
          Nuevo Chat
        </Button>
      </div>

      {/* AI Insights */}
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-white text-lg flex items-center">
            <Sparkles className="h-5 w-5 mr-2" />
            Insights de IA
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {aiInsights.map((insight) => (
            <div key={insight.id} className="p-3 bg-white/5 rounded-lg">
              <div className="flex items-start space-x-3">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  insight.type === 'optimization' ? 'bg-blue-500' :
                  insight.type === 'suggestion' ? 'bg-green-500' : 'bg-yellow-500'
                }`} />
                <div>
                  <h4 className="text-white font-medium text-sm">{insight.title}</h4>
                  <p className="text-gray-300 text-xs mt-1">{insight.description}</p>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Quick AI Actions */}
      <div className="grid grid-cols-2 gap-4">
        <Button className="h-20 flex flex-col items-center justify-center space-y-2 bg-gradient-to-r from-purple-500 to-pink-500">
          <Brain className="h-6 w-6" />
          <span className="text-sm">Generar Contenido</span>
        </Button>
        <Button className="h-20 flex flex-col items-center justify-center space-y-2 bg-gradient-to-r from-blue-500 to-cyan-500">
          <Target className="h-6 w-6" />
          <span className="text-sm">Optimizar Workflow</span>
        </Button>
      </div>
    </div>
  )

  const renderAnalytics = () => (
    <div className="space-y-4 p-4">
      <h2 className="text-xl font-bold text-white">Analytics</h2>
      
      {/* Performance Chart Placeholder */}
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-white text-lg">Rendimiento</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-32 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg flex items-center justify-center">
            <BarChart3 className="h-12 w-12 text-gray-400" />
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardContent className="p-4 text-center">
            <TrendingUp className="h-8 w-8 text-green-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">+23%</div>
            <div className="text-gray-300 text-sm">Crecimiento</div>
          </CardContent>
        </Card>
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardContent className="p-4 text-center">
            <Zap className="h-8 w-8 text-blue-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">2.3s</div>
            <div className="text-gray-300 text-sm">Tiempo promedio</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  const renderSettings = () => (
    <div className="space-y-4 p-4">
      <h2 className="text-xl font-bold text-white">Configuración</h2>
      
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardContent className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-white">Notificaciones Push</span>
            <Button size="sm" variant="outline">Activar</Button>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-white">Modo Oscuro</span>
            <Button size="sm" className="bg-purple-500">Activo</Button>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-white">Sincronización Automática</span>
            <Button size="sm" variant="outline">Activar</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowMenu(!showMenu)}
                className="text-white hover:bg-white/10"
              >
                <Menu className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-xl font-bold text-white">Stack21</h1>
                <p className="text-sm text-gray-300">Dashboard Móvil</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowQuickActions(!showQuickActions)}
                className="text-white hover:bg-white/10"
              >
                <Plus className="h-5 w-5" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowNotifications(!showNotifications)}
                className="text-white hover:bg-white/10 relative"
              >
                <Bell className="h-5 w-5" />
                {notifications.filter(n => n.unread).length > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-red-500">
                    {notifications.filter(n => n.unread).length}
                  </Badge>
                )}
              </Button>
            </div>
          </div>
          
          {/* Search Bar */}
          <div className="mt-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Buscar workflows, IA, analytics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="sticky top-20 z-40 bg-black/10 backdrop-blur-sm border-b border-white/10">
        <div className="flex overflow-x-auto px-4 py-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg whitespace-nowrap mr-2 ${
                activeTab === tab.id
                  ? 'bg-purple-500 text-white'
                  : 'text-gray-300 hover:bg-white/10'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span className="text-sm font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Quick Actions Modal */}
      {showQuickActions && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end">
          <div className="w-full bg-slate-800 rounded-t-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">Acciones Rápidas</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowQuickActions(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {quickActions.map((action) => (
                <Button
                  key={action.id}
                  variant="outline"
                  className="h-20 flex flex-col items-center justify-center space-y-2 bg-white/10 border-white/20 hover:bg-white/20"
                  onClick={() => {
                    setShowQuickActions(false)
                    handleNavigate(`/${action.id}`)
                  }}
                >
                  <action.icon className={`h-6 w-6 text-${action.color}-400`} />
                  <span className="text-sm text-white">{action.label}</span>
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Notifications Modal */}
      {showNotifications && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end">
          <div className="w-full bg-slate-800 rounded-t-2xl p-6 max-h-96 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">Notificaciones</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowNotifications(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="space-y-3">
              {notifications.map((notification) => (
                <div key={notification.id} className={`p-3 rounded-lg ${notification.unread ? 'bg-white/10' : 'bg-white/5'}`}>
                  <div className="flex items-start space-x-3">
                    {notification.unread && <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />}
                    <div className="flex-1">
                      <h4 className="text-white font-medium text-sm">{notification.title}</h4>
                      <p className="text-gray-300 text-xs mt-1">{notification.message}</p>
                      <p className="text-gray-400 text-xs mt-1">{notification.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      {activeTab === 'overview' && renderOverview()}
      {activeTab === 'workflows' && renderWorkflows()}
      {activeTab === 'ai' && renderAI()}
      {activeTab === 'analytics' && renderAnalytics()}
      {activeTab === 'settings' && renderSettings()}

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-black/20 backdrop-blur-md border-t border-white/10">
        <MobileNavigation currentPath={currentPath} onNavigate={handleNavigate} />
      </div>
    </div>
  )
}