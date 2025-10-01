'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, TrendingDown, Activity } from 'lucide-react'

interface ChartData {
  time: string
  value: number
  label: string
}

interface RealTimeChartProps {
  title: string
  data: ChartData[]
  color?: string
  icon?: React.ComponentType<any>
}

export default function RealTimeChart({ title, data, color = 'blue', icon: Icon }: RealTimeChartProps) {
  const [currentData, setCurrentData] = useState(data)
  const [isLive, setIsLive] = useState(true)

  // Simular datos en tiempo real
  useEffect(() => {
    if (!isLive) return

    const interval = setInterval(() => {
      setCurrentData(prev => {
        const newData = [...prev]
        const lastValue = newData[newData.length - 1]?.value || 0
        const variation = (Math.random() - 0.5) * 10
        const newValue = Math.max(0, lastValue + variation)
        
        newData.push({
          time: new Date().toLocaleTimeString(),
          value: Math.round(newValue),
          label: `${Math.round(newValue)}`
        })
        
        // Mantener solo los últimos 20 puntos
        return newData.slice(-20)
      })
    }, 2000)

    return () => clearInterval(interval)
  }, [isLive])

  const currentValue = currentData[currentData.length - 1]?.value || 0
  const previousValue = currentData[currentData.length - 2]?.value || 0
  const trend = currentValue > previousValue ? 'up' : 'down'
  const change = Math.abs(currentValue - previousValue)

  const colorClasses = {
    blue: 'text-blue-600 bg-blue-50',
    green: 'text-green-600 bg-green-50',
    purple: 'text-purple-600 bg-purple-50',
    orange: 'text-orange-600 bg-orange-50',
    red: 'text-red-600 bg-red-50'
  }

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center text-sm font-medium text-gray-700">
            {Icon && <Icon className="h-4 w-4 mr-2" />}
            {title}
          </CardTitle>
          <div className="flex items-center space-x-2">
            <div className={`flex items-center px-2 py-1 rounded-full text-xs ${colorClasses[color as keyof typeof colorClasses]}`}>
              <Activity className="h-3 w-3 mr-1" />
              {isLive ? 'LIVE' : 'PAUSED'}
            </div>
            <button
              onClick={() => setIsLive(!isLive)}
              className="text-xs text-gray-500 hover:text-gray-700"
            >
              {isLive ? 'Pausar' : 'Reanudar'}
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-end justify-between">
            <div>
              <div className="text-2xl font-bold text-gray-900">{currentValue.toLocaleString()}</div>
              <div className="flex items-center text-sm">
                {trend === 'up' ? (
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                )}
                <span className={trend === 'up' ? 'text-green-600' : 'text-red-600'}>
                  {change.toFixed(1)} desde la última actualización
                </span>
              </div>
            </div>
          </div>
          
          {/* Mini gráfico simplificado */}
          <div className="h-16 flex items-end space-x-1">
            {currentData.slice(-10).map((point, index) => {
              const height = (point.value / Math.max(...currentData.map(d => d.value))) * 100
              return (
                <div
                  key={index}
                  className={`flex-1 rounded-t ${
                    color === 'blue' ? 'bg-blue-500' :
                    color === 'green' ? 'bg-green-500' :
                    color === 'purple' ? 'bg-purple-500' :
                    color === 'orange' ? 'bg-orange-500' :
                    'bg-red-500'
                  } opacity-70 hover:opacity-100 transition-opacity`}
                  style={{ height: `${Math.max(height, 5)}%` }}
                  title={`${point.time}: ${point.value}`}
                />
              )
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
