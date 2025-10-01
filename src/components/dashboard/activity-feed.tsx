'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Activity, 
  CheckCircle, 
  AlertCircle, 
  Info, 
  XCircle, 
  Clock,
  User,
  Workflow,
  Brain,
  Database,
  Zap
} from 'lucide-react'
import { TimeDisplay } from '../TimeDisplay'

interface ActivityItem {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  description: string
  timestamp: Date
  user?: string
  category: 'workflow' | 'ai' | 'system' | 'team' | 'integration'
  action?: {
    label: string
    onClick: () => void
  }
}

const mockActivities: ActivityItem[] = [
  {
    id: '1',
    type: 'success',
    title: 'Workflow "Email Marketing" ejecutado exitosamente',
    description: 'Se enviaron 1,250 emails a la lista de suscriptores',
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    user: 'María García',
    category: 'workflow',
    action: {
      label: 'Ver detalles',
      onClick: () => console.log('Ver detalles del workflow')
    }
  },
  {
    id: '2',
    type: 'info',
    title: 'Nueva integración con Slack configurada',
    description: 'Canal #marketing conectado para notificaciones automáticas',
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
    user: 'Carlos López',
    category: 'integration'
  },
  {
    id: '3',
    type: 'warning',
    title: 'Límite de API alcanzado',
    description: 'Se ha alcanzado el 85% del límite mensual de OpenAI',
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    category: 'system',
    action: {
      label: 'Actualizar plan',
      onClick: () => console.log('Actualizar plan')
    }
  },
  {
    id: '4',
    type: 'success',
    title: 'Agente IA completó análisis de datos',
    description: 'Análisis de 5,000 registros completado en 2.3 segundos',
    timestamp: new Date(Date.now() - 45 * 60 * 1000),
    user: 'Ana Martín',
    category: 'ai'
  },
  {
    id: '5',
    type: 'info',
    title: 'Backup de datos completado',
    description: 'Respaldo automático de 2.4GB guardado exitosamente',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    category: 'system'
  }
]

const getIcon = (type: ActivityItem['type']) => {
  switch (type) {
    case 'success': return CheckCircle
    case 'error': return XCircle
    case 'warning': return AlertCircle
    case 'info': return Info
    default: return Activity
  }
}

const getCategoryIcon = (category: ActivityItem['category']) => {
  switch (category) {
    case 'workflow': return Workflow
    case 'ai': return Brain
    case 'system': return Database
    case 'team': return User
    case 'integration': return Zap
    default: return Activity
  }
}

const getTypeColor = (type: ActivityItem['type']) => {
  switch (type) {
    case 'success': return 'text-green-600 bg-green-50 border-green-200'
    case 'error': return 'text-red-600 bg-red-50 border-red-200'
    case 'warning': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
    case 'info': return 'text-blue-600 bg-blue-50 border-blue-200'
    default: return 'text-gray-600 bg-gray-50 border-gray-200'
  }
}

const getCategoryColor = (category: ActivityItem['category']) => {
  switch (category) {
    case 'workflow': return 'bg-purple-100 text-purple-700'
    case 'ai': return 'bg-pink-100 text-pink-700'
    case 'system': return 'bg-blue-100 text-blue-700'
    case 'team': return 'bg-green-100 text-green-700'
    case 'integration': return 'bg-orange-100 text-orange-700'
    default: return 'bg-gray-100 text-gray-700'
  }
}

export default function ActivityFeed() {
  const [activities, setActivities] = useState<ActivityItem[]>(mockActivities)
  const [filter, setFilter] = useState<'all' | ActivityItem['category']>('all')
  const [isLive, setIsLive] = useState(true)

  // Simular nuevas actividades en tiempo real
  useEffect(() => {
    if (!isLive) return

    const interval = setInterval(() => {
      const newActivity: ActivityItem = {
        id: Date.now().toString(),
        type: ['success', 'info', 'warning'][Math.floor(Math.random() * 3)] as ActivityItem['type'],
        title: [
          'Nuevo workflow ejecutado',
          'Integración actualizada',
          'Datos sincronizados',
          'Reporte generado',
          'Usuario agregado al equipo'
        ][Math.floor(Math.random() * 5)],
        description: 'Actividad en tiempo real simulada',
        timestamp: new Date(),
        user: ['María García', 'Carlos López', 'Ana Martín'][Math.floor(Math.random() * 3)],
        category: ['workflow', 'ai', 'system', 'team', 'integration'][Math.floor(Math.random() * 5)] as ActivityItem['category']
      }

      setActivities(prev => [newActivity, ...prev.slice(0, 9)])
    }, 10000) // Cada 10 segundos

    return () => clearInterval(interval)
  }, [isLive])

  const filteredActivities = filter === 'all' 
    ? activities 
    : activities.filter(activity => activity.category === filter)

  // Removed formatTimeAgo function - using TimeDisplay component instead

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <Activity className="h-5 w-5 mr-2 text-blue-500" />
            Actividad en Tiempo Real
          </CardTitle>
          <div className="flex items-center space-x-2">
            <div className={`flex items-center px-2 py-1 rounded-full text-xs ${
              isLive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
            }`}>
              <div className={`w-2 h-2 rounded-full mr-1 ${
                isLive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
              }`} />
              {isLive ? 'LIVE' : 'PAUSED'}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsLive(!isLive)}
            >
              {isLive ? 'Pausar' : 'Reanudar'}
            </Button>
          </div>
        </div>
        
        {/* Filtros */}
        <div className="flex flex-wrap gap-2 mt-4">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('all')}
          >
            Todas
          </Button>
          {['workflow', 'ai', 'system', 'team', 'integration'].map((category) => {
            const CategoryIcon = getCategoryIcon(category as ActivityItem['category'])
            return (
              <Button
                key={category}
                variant={filter === category ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter(category as ActivityItem['category'])}
                className="flex items-center"
              >
                <CategoryIcon className="h-3 w-3 mr-1" />
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </Button>
            )
          })}
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {filteredActivities.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No hay actividades para mostrar</p>
            </div>
          ) : (
            filteredActivities.map((activity) => {
              const Icon = getIcon(activity.type)
              const CategoryIcon = getCategoryIcon(activity.category)
              
              return (
                <div
                  key={activity.id}
                  className={`p-4 rounded-lg border transition-all hover:shadow-md ${getTypeColor(activity.type)}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="text-sm font-medium truncate">{activity.title}</h4>
                          <Badge className={`text-xs ${getCategoryColor(activity.category)}`}>
                            <CategoryIcon className="h-3 w-3 mr-1" />
                            {activity.category}
                          </Badge>
                        </div>
                        <p className="text-sm opacity-80 mb-2">{activity.description}</p>
                        <div className="flex items-center space-x-4 text-xs opacity-70">
                          <div className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            <TimeDisplay timestamp={activity.timestamp} format="relative" />
                          </div>
                          {activity.user && (
                            <div className="flex items-center">
                              <User className="h-3 w-3 mr-1" />
                              {activity.user}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    {activity.action && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={activity.action.onClick}
                        className="flex-shrink-0"
                      >
                        {activity.action.label}
                      </Button>
                    )}
                  </div>
                </div>
              )
            })
          )}
        </div>
      </CardContent>
    </Card>
  )
}
