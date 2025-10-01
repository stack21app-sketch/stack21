'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  BarChart3, 
  PieChart, 
  LineChart,
  Download,
  RefreshCw,
  Settings,
  Eye,
  EyeOff,
  Maximize,
  Minimize
} from 'lucide-react'

interface ChartData {
  time: string
  value: number
  label?: string
}

interface AnalyticsChartProps {
  title: string
  data: ChartData[]
  type: 'line' | 'bar' | 'pie' | 'area'
  color?: string
  icon?: React.ComponentType<any>
  description?: string
  isLive?: boolean
  onRefresh?: () => void
  onExport?: () => void
  onConfigure?: () => void
  className?: string
}

export default function AnalyticsChart({
  title,
  data,
  type,
  color = 'blue',
  icon: Icon,
  description,
  isLive = true,
  onRefresh,
  onExport,
  onConfigure,
  className = ''
}: AnalyticsChartProps) {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [currentData, setCurrentData] = useState(data)

  // Simular datos en tiempo real
  useEffect(() => {
    if (!isLive) return

    const interval = setInterval(() => {
      setCurrentData(prev => {
        const newData = [...prev]
        const lastValue = newData[newData.length - 1]?.value || 0
        const variation = (Math.random() - 0.5) * 20
        const newValue = Math.max(0, lastValue + variation)
        
        newData.push({
          time: new Date().toLocaleTimeString(),
          value: Math.round(newValue),
          label: `${Math.round(newValue)}`
        })
        
        // Mantener solo los últimos 30 puntos
        return newData.slice(-30)
      })
    }, 3000)

    return () => clearInterval(interval)
  }, [isLive])

  const currentValue = currentData[currentData.length - 1]?.value || 0
  const previousValue = currentData[currentData.length - 2]?.value || 0
  const trend = currentValue > previousValue ? 'up' : 'down'
  const change = Math.abs(currentValue - previousValue)
  const changePercent = previousValue > 0 ? ((change / previousValue) * 100) : 0

  const colorClasses = {
    blue: 'text-blue-600 bg-blue-50 border-blue-200',
    green: 'text-green-600 bg-green-50 border-green-200',
    purple: 'text-purple-600 bg-purple-50 border-purple-200',
    orange: 'text-orange-600 bg-orange-50 border-orange-200',
    red: 'text-red-600 bg-red-50 border-red-200',
    indigo: 'text-indigo-600 bg-indigo-50 border-indigo-200'
  }

  const getChartIcon = () => {
    switch (type) {
      case 'line': return LineChart
      case 'bar': return BarChart3
      case 'pie': return PieChart
      case 'area': return Activity
      default: return BarChart3
    }
  }

  const ChartIcon = getChartIcon()

  const renderChart = () => {
    if (!isVisible) {
      return (
        <div className="flex items-center justify-center h-48 text-gray-400">
          <EyeOff className="h-8 w-8" />
        </div>
      )
    }

    const maxValue = Math.max(...currentData.map(d => d.value))
    const minValue = Math.min(...currentData.map(d => d.value))
    const range = maxValue - minValue

    switch (type) {
      case 'line':
        return (
          <div className="h-48 relative">
            <svg className="w-full h-full" viewBox="0 0 400 200">
              <polyline
                fill="none"
                stroke={color === 'blue' ? '#3B82F6' : color === 'green' ? '#10B981' : '#8B5CF6'}
                strokeWidth="2"
                points={currentData.map((point, index) => {
                  const x = (index / (currentData.length - 1)) * 400
                  const y = 200 - ((point.value - minValue) / range) * 180
                  return `${x},${y}`
                }).join(' ')}
              />
              {currentData.map((point, index) => {
                const x = (index / (currentData.length - 1)) * 400
                const y = 200 - ((point.value - minValue) / range) * 180
                return (
                  <circle
                    key={index}
                    cx={x}
                    cy={y}
                    r="3"
                    fill={color === 'blue' ? '#3B82F6' : color === 'green' ? '#10B981' : '#8B5CF6'}
                    className="hover:r-4 transition-all"
                  />
                )
              })}
            </svg>
          </div>
        )

      case 'bar':
        return (
          <div className="h-48 flex items-end justify-between space-x-1">
            {currentData.slice(-10).map((point, index) => {
              const height = ((point.value - minValue) / range) * 100
              return (
                <div
                  key={index}
                  className={`flex-1 rounded-t transition-all hover:opacity-80 ${
                    color === 'blue' ? 'bg-blue-500' :
                    color === 'green' ? 'bg-green-500' :
                    color === 'purple' ? 'bg-purple-500' :
                    'bg-orange-500'
                  }`}
                  style={{ height: `${Math.max(height, 5)}%` }}
                  title={`${point.time}: ${point.value}`}
                />
              )
            })}
          </div>
        )

      case 'pie':
        const total = currentData.reduce((sum, point) => sum + point.value, 0)
        let cumulativePercentage = 0
        
        return (
          <div className="h-48 flex items-center justify-center">
            <svg className="w-32 h-32" viewBox="0 0 100 100">
              {currentData.slice(0, 5).map((point, index) => {
                const percentage = (point.value / total) * 100
                const startAngle = cumulativePercentage * 3.6
                const endAngle = (cumulativePercentage + percentage) * 3.6
                cumulativePercentage += percentage
                
                const x1 = 50 + 40 * Math.cos((startAngle - 90) * Math.PI / 180)
                const y1 = 50 + 40 * Math.sin((startAngle - 90) * Math.PI / 180)
                const x2 = 50 + 40 * Math.cos((endAngle - 90) * Math.PI / 180)
                const y2 = 50 + 40 * Math.sin((endAngle - 90) * Math.PI / 180)
                const largeArcFlag = percentage > 50 ? 1 : 0
                
                const pathData = [
                  `M 50 50`,
                  `L ${x1} ${y1}`,
                  `A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                  `Z`
                ].join(' ')
                
                return (
                  <path
                    key={index}
                    d={pathData}
                    fill={index === 0 ? '#3B82F6' : index === 1 ? '#10B981' : index === 2 ? '#F59E0B' : '#EF4444'}
                    className="hover:opacity-80 transition-opacity"
                  />
                )
              })}
            </svg>
          </div>
        )

      case 'area':
        return (
          <div className="h-48 relative">
            <svg className="w-full h-full" viewBox="0 0 400 200">
              <defs>
                <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor={color === 'blue' ? '#3B82F6' : '#8B5CF6'} stopOpacity="0.3"/>
                  <stop offset="100%" stopColor={color === 'blue' ? '#3B82F6' : '#8B5CF6'} stopOpacity="0"/>
                </linearGradient>
              </defs>
              <path
                d={`M 0,200 ${currentData.map((point, index) => {
                  const x = (index / (currentData.length - 1)) * 400
                  const y = 200 - ((point.value - minValue) / range) * 180
                  return `L ${x},${y}`
                }).join(' ')} L 400,200 Z`}
                fill="url(#areaGradient)"
              />
              <polyline
                fill="none"
                stroke={color === 'blue' ? '#3B82F6' : '#8B5CF6'}
                strokeWidth="2"
                points={currentData.map((point, index) => {
                  const x = (index / (currentData.length - 1)) * 400
                  const y = 200 - ((point.value - minValue) / range) * 180
                  return `${x},${y}`
                }).join(' ')}
              />
            </svg>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <Card className={`bg-white/80 backdrop-blur-sm border-0 shadow-lg ${className} ${
      isFullscreen ? 'fixed inset-4 z-50' : ''
    }`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {Icon && (
              <div className={`p-2 rounded-lg ${colorClasses[color as keyof typeof colorClasses]}`}>
                <Icon className="h-5 w-5" />
              </div>
            )}
            <div>
              <CardTitle className="text-lg">{title}</CardTitle>
              {description && (
                <p className="text-sm text-gray-600">{description}</p>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {isLive && (
              <Badge className="bg-green-100 text-green-800 text-xs flex items-center">
                <Activity className="h-3 w-3 mr-1" />
                LIVE
              </Badge>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsVisible(!isVisible)}
            >
              {isVisible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsFullscreen(!isFullscreen)}
            >
              {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={onRefresh}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={onExport}
            >
              <Download className="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={onConfigure}
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {/* Stats */}
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-gray-900">
                {currentValue.toLocaleString()}
              </div>
              <div className="flex items-center text-sm">
                {trend === 'up' ? (
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                )}
                <span className={trend === 'up' ? 'text-green-600' : 'text-red-600'}>
                  {change.toFixed(1)} ({changePercent.toFixed(1)}%)
                </span>
                <span className="text-gray-500 ml-1">vs anterior</span>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-sm text-gray-600">Tipo</div>
              <div className="flex items-center text-sm font-medium">
                <ChartIcon className="h-4 w-4 mr-1" />
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </div>
            </div>
          </div>
          
          {/* Chart */}
          <div className="relative">
            {renderChart()}
          </div>
          
          {/* Data Points */}
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>
              {currentData.length} puntos de datos
            </span>
            <span>
              Última actualización: {new Date().toLocaleTimeString()}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
