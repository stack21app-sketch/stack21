'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Plus, 
  Zap, 
  Brain, 
  Workflow, 
  BarChart3, 
  Users, 
  Settings, 
  ExternalLink,
  Sparkles,
  Target,
  Database,
  Webhook,
  BookOpen,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react'

interface QuickAction {
  id: string
  title: string
  description: string
  icon: React.ComponentType<any>
  color: string
  category: 'workflow' | 'ai' | 'analytics' | 'team' | 'system'
  isNew?: boolean
  isPopular?: boolean
  onClick: () => void
}

const quickActions: QuickAction[] = [
  {
    id: 'create-workflow',
    title: 'Crear Workflow',
    description: 'Construye un nuevo flujo de automatización',
    icon: Workflow,
    color: 'blue',
    category: 'workflow',
    isPopular: true,
    onClick: () => console.log('Crear workflow')
  },
  {
    id: 'ai-assistant',
    title: 'Asistente IA',
    description: 'Chatea con nuestro asistente inteligente',
    icon: Brain,
    color: 'purple',
    category: 'ai',
    isNew: true,
    onClick: () => console.log('Abrir asistente IA')
  },
  {
    id: 'run-analysis',
    title: 'Análisis Rápido',
    description: 'Ejecuta análisis de datos instantáneo',
    icon: BarChart3,
    color: 'green',
    category: 'analytics',
    onClick: () => console.log('Ejecutar análisis')
  },
  {
    id: 'invite-team',
    title: 'Invitar Equipo',
    description: 'Añade nuevos miembros a tu workspace',
    icon: Users,
    color: 'orange',
    category: 'team',
    onClick: () => console.log('Invitar equipo')
  },
  {
    id: 'backup-data',
    title: 'Respaldo de Datos',
    description: 'Crea un respaldo de seguridad',
    icon: Database,
    color: 'red',
    category: 'system',
    onClick: () => console.log('Crear respaldo')
  },
  {
    id: 'api-docs',
    title: 'Documentación API',
    description: 'Explora nuestra documentación completa',
    icon: BookOpen,
    color: 'indigo',
    category: 'system',
    onClick: () => console.log('Ver documentación')
  },
  {
    id: 'webhook-setup',
    title: 'Configurar Webhook',
    description: 'Configura notificaciones en tiempo real',
    icon: Webhook,
    color: 'pink',
    category: 'system',
    onClick: () => console.log('Configurar webhook')
  },
  {
    id: 'ai-optimization',
    title: 'Optimización IA',
    description: 'Optimiza tus workflows con IA',
    icon: Sparkles,
    color: 'yellow',
    category: 'ai',
    isNew: true,
    onClick: () => console.log('Optimizar con IA')
  }
]

const getColorClasses = (color: string) => {
  const colors = {
    blue: 'bg-blue-500 hover:bg-blue-600 text-white',
    purple: 'bg-purple-500 hover:bg-purple-600 text-white',
    green: 'bg-green-500 hover:bg-green-600 text-white',
    orange: 'bg-orange-500 hover:bg-orange-600 text-white',
    red: 'bg-red-500 hover:bg-red-600 text-white',
    indigo: 'bg-indigo-500 hover:bg-indigo-600 text-white',
    pink: 'bg-pink-500 hover:bg-pink-600 text-white',
    yellow: 'bg-yellow-500 hover:bg-yellow-600 text-white'
  }
  return colors[color as keyof typeof colors] || colors.blue
}

const getCategoryIcon = (category: QuickAction['category']) => {
  switch (category) {
    case 'workflow': return Workflow
    case 'ai': return Brain
    case 'analytics': return BarChart3
    case 'team': return Users
    case 'system': return Settings
    default: return Zap
  }
}

export default function QuickActionsPanel() {
  const [selectedCategory, setSelectedCategory] = useState<'all' | QuickAction['category']>('all')
  const [recentActions, setRecentActions] = useState<string[]>([])

  const filteredActions = selectedCategory === 'all' 
    ? quickActions 
    : quickActions.filter(action => action.category === selectedCategory)

  const handleActionClick = (action: QuickAction) => {
    action.onClick()
    setRecentActions(prev => [action.id, ...prev.filter(id => id !== action.id)].slice(0, 3))
  }

  const categories = [
    { id: 'all', label: 'Todas', icon: Zap },
    { id: 'workflow', label: 'Workflows', icon: Workflow },
    { id: 'ai', label: 'IA', icon: Brain },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'team', label: 'Equipo', icon: Users },
    { id: 'system', label: 'Sistema', icon: Settings }
  ]

  return (
    <div className="space-y-6">
      {/* Panel principal */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Zap className="h-5 w-5 mr-2 text-yellow-500" />
            Acciones Rápidas
          </CardTitle>
          <p className="text-sm text-gray-600">
            Accede a las funciones más utilizadas de la plataforma
          </p>
        </CardHeader>
        <CardContent>
          {/* Filtros de categoría */}
          <div className="flex flex-wrap gap-2 mb-6">
            {categories.map((category) => {
              const Icon = category.icon
              return (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id as any)}
                  className="flex items-center"
                >
                  <Icon className="h-3 w-3 mr-1" />
                  {category.label}
                </Button>
              )
              })}
          </div>

          {/* Grid de acciones */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredActions.map((action) => {
              const Icon = action.icon
              return (
                <div
                  key={action.id}
                  className="group relative p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all cursor-pointer"
                  onClick={() => handleActionClick(action)}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-lg ${getColorClasses(action.color)}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="text-sm font-medium text-gray-900 group-hover:text-blue-600">
                          {action.title}
                        </h4>
                        {action.isNew && (
                          <Badge className="bg-green-100 text-green-700 text-xs">Nuevo</Badge>
                        )}
                        {action.isPopular && (
                          <Badge className="bg-blue-100 text-blue-700 text-xs">Popular</Badge>
                        )}
                      </div>
                      <p className="text-xs text-gray-600">{action.description}</p>
                    </div>
                  </div>
                  
                  {/* Efecto hover */}
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Acciones recientes */}
      {recentActions.length > 0 && (
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center text-sm">
              <Target className="h-4 w-4 mr-2 text-blue-600" />
              Acciones Recientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {recentActions.map((actionId) => {
                const action = quickActions.find(a => a.id === actionId)
                if (!action) return null
                
                const Icon = action.icon
                return (
                  <div
                    key={actionId}
                    className="flex items-center space-x-3 p-2 rounded-lg bg-white/50 hover:bg-white/80 transition-colors cursor-pointer"
                    onClick={() => handleActionClick(action)}
                  >
                    <div className={`p-1 rounded ${getColorClasses(action.color)}`}>
                      <Icon className="h-3 w-3" />
                    </div>
                    <span className="text-sm text-gray-700">{action.title}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="ml-auto h-6 w-6 p-0"
                    >
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Acciones del sistema */}
      <Card className="bg-gradient-to-r from-gray-50 to-slate-50 border border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center text-sm">
            <Settings className="h-4 w-4 mr-2 text-gray-600" />
            Acciones del Sistema
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Button
              variant="outline"
              size="sm"
              className="justify-start"
              onClick={() => console.log('Pausar todos los workflows')}
            >
              <Pause className="h-3 w-3 mr-2" />
              Pausar Workflows
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="justify-start"
              onClick={() => console.log('Reiniciar servicios')}
            >
              <RotateCcw className="h-3 w-3 mr-2" />
              Reiniciar Servicios
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="justify-start"
              onClick={() => console.log('Ejecutar mantenimiento')}
            >
              <Settings className="h-3 w-3 mr-2" />
              Mantenimiento
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
