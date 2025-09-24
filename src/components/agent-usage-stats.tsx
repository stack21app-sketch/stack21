'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Zap, TrendingUp, Clock, AlertTriangle } from 'lucide-react'
import { toast } from '@/hooks/use-toast'

interface UsageStats {
  limit: number
  used: number
  plan: string
  percentage: number
  remaining: number
}

export function AgentUsageStats() {
  const { data: session } = useSession()
  const [stats, setStats] = useState<UsageStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadUsageStats()
  }, [])

  const loadUsageStats = async () => {
    try {
      setIsLoading(true)
      
      // Simular obtención de estadísticas de uso
      // En producción, esto vendría de una API real
      const mockStats: UsageStats = {
        limit: 10, // Este valor vendría del plan del usuario
        used: 7,   // Este valor se calcularía basado en las ejecuciones del mes
        plan: 'free',
        percentage: 70,
        remaining: 3
      }
      
      setStats(mockStats)
    } catch (error) {
      console.error('Error cargando estadísticas:', error)
      toast({
        title: "Error",
        description: "No se pudieron cargar las estadísticas de uso",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const upgradePlan = () => {
    // Redirigir a la página de pricing
    window.location.href = '/pricing'
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Uso de Agentes IA
          </CardTitle>
          <CardDescription>Cargando estadísticas...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-2 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!stats) {
    return null
  }

  const getStatusColor = (percentage: number) => {
    if (percentage >= 90) return 'text-red-500'
    if (percentage >= 75) return 'text-yellow-500'
    return 'text-green-500'
  }

  const getProgressColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-red-500'
    if (percentage >= 75) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  const getPlanBadgeColor = (plan: string) => {
    switch (plan) {
      case 'enterprise': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
      case 'pro': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Uso de Agentes IA
          </div>
          <Badge className={getPlanBadgeColor(stats.plan)}>
            Plan {stats.plan.charAt(0).toUpperCase() + stats.plan.slice(1)}
          </Badge>
        </CardTitle>
        <CardDescription>
          Ejecuciones de agentes este mes
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Barra de progreso */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Usado: {stats.used}</span>
            <span className={getStatusColor(stats.percentage)}>
              {stats.percentage}%
            </span>
          </div>
          <Progress 
            value={stats.percentage} 
            className="h-2"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>Restante: {stats.remaining}</span>
            <span>Límite: {stats.limit === -1 ? 'Ilimitado' : stats.limit}</span>
          </div>
        </div>

        {/* Estadísticas adicionales */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-green-600">
              <TrendingUp className="h-4 w-4" />
              <span className="text-sm font-medium">+23%</span>
            </div>
            <p className="text-xs text-gray-500">vs mes anterior</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-blue-600">
              <Clock className="h-4 w-4" />
              <span className="text-sm font-medium">2.3s</span>
            </div>
            <p className="text-xs text-gray-500">Tiempo promedio</p>
          </div>
        </div>

        {/* Advertencia si está cerca del límite */}
        {stats.percentage >= 75 && (
          <div className="p-3 bg-yellow-50 dark:bg-yellow-950 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <div className="flex items-center gap-2 text-yellow-800 dark:text-yellow-200">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm font-medium">
                {stats.percentage >= 90 ? '¡Límite casi alcanzado!' : 'Acercándose al límite'}
              </span>
            </div>
            <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
              {stats.remaining} ejecuciones restantes este mes
            </p>
            {stats.plan === 'free' && (
              <Button 
                size="sm" 
                className="mt-2 w-full"
                onClick={upgradePlan}
              >
                Actualizar Plan
              </Button>
            )}
          </div>
        )}

        {/* Información del plan */}
        <div className="text-center pt-2 border-t">
          <p className="text-xs text-gray-500">
            {stats.plan === 'free' && 'Actualiza para más ejecuciones y agentes avanzados'}
            {stats.plan === 'pro' && 'Plan Pro incluye 100 ejecuciones/mes'}
            {stats.plan === 'enterprise' && 'Plan Enterprise con ejecuciones ilimitadas'}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
