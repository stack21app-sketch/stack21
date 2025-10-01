'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  ChevronRight, 
  MoreVertical, 
  Star, 
  Clock, 
  Users, 
  TrendingUp,
  Activity,
  Zap
} from 'lucide-react'

interface MobileOptimizedCardProps {
  title: string
  subtitle?: string
  value?: string | number
  change?: {
    value: number
    type: 'increase' | 'decrease' | 'neutral'
  }
  icon?: React.ComponentType<any>
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red'
  onClick?: () => void
  actions?: Array<{
    label: string
    onClick: () => void
    variant?: 'default' | 'outline' | 'ghost'
  }>
  badges?: Array<{
    text: string
    color: 'blue' | 'green' | 'yellow' | 'red' | 'gray'
  }>
  isCompact?: boolean
  showChevron?: boolean
}

export default function MobileOptimizedCard({
  title,
  subtitle,
  value,
  change,
  icon: Icon,
  color = 'blue',
  onClick,
  actions = [],
  badges = [],
  isCompact = false,
  showChevron = true
}: MobileOptimizedCardProps) {
  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-100 text-blue-600',
      green: 'bg-green-100 text-green-600',
      purple: 'bg-purple-100 text-purple-600',
      orange: 'bg-orange-100 text-orange-600',
      red: 'bg-red-100 text-red-600'
    }
    return colors[color as keyof typeof colors] || colors.blue
  }

  const getBadgeColor = (color: string) => {
    const colors = {
      blue: 'bg-blue-100 text-blue-800',
      green: 'bg-green-100 text-green-800',
      yellow: 'bg-yellow-100 text-yellow-800',
      red: 'bg-red-100 text-red-800',
      gray: 'bg-gray-100 text-gray-800'
    }
    return colors[color as keyof typeof colors] || colors.gray
  }

  const getChangeIcon = (type: string) => {
    switch (type) {
      case 'increase': return TrendingUp
      case 'decrease': return TrendingUp
      default: return Activity
    }
  }

  const getChangeColor = (type: string) => {
    switch (type) {
      case 'increase': return 'text-green-600'
      case 'decrease': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const ChangeIcon = change ? getChangeIcon(change.type) : null

  return (
    <Card 
      className={`bg-white/80 backdrop-blur-sm border-0 shadow-lg transition-all duration-200 ${
        onClick ? 'cursor-pointer hover:shadow-xl active:scale-[0.98]' : ''
      } ${isCompact ? 'p-3' : ''}`}
      onClick={onClick}
    >
      <CardContent className={isCompact ? 'p-3' : 'p-4'}>
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-center space-x-3 mb-2">
              {Icon && (
                <div className={`p-2 rounded-lg ${getColorClasses(color)} flex-shrink-0`}>
                  <Icon className="h-4 w-4" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h3 className={`font-semibold text-gray-900 truncate ${
                  isCompact ? 'text-sm' : 'text-base'
                }`}>
                  {title}
                </h3>
                {subtitle && (
                  <p className={`text-gray-600 truncate ${
                    isCompact ? 'text-xs' : 'text-sm'
                  }`}>
                    {subtitle}
                  </p>
                )}
              </div>
            </div>

            {/* Value and Change */}
            {value && (
              <div className="flex items-center space-x-2 mb-3">
                <span className={`font-bold text-gray-900 ${
                  isCompact ? 'text-lg' : 'text-xl'
                }`}>
                  {typeof value === 'number' ? value.toLocaleString() : value}
                </span>
                {change && ChangeIcon && (
                  <div className={`flex items-center space-x-1 ${
                    getChangeColor(change.type)
                  }`}>
                    <ChangeIcon className="h-3 w-3" />
                    <span className={`font-medium ${
                      isCompact ? 'text-xs' : 'text-sm'
                    }`}>
                      {change.value > 0 ? '+' : ''}{change.value}%
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Badges */}
            {badges.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {badges.map((badge, index) => (
                  <Badge
                    key={index}
                    className={`text-xs ${getBadgeColor(badge.color)}`}
                  >
                    {badge.text}
                  </Badge>
                ))}
              </div>
            )}

            {/* Actions */}
            {actions.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {actions.map((action, index) => (
                  <Button
                    key={index}
                    variant={action.variant || 'outline'}
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      action.onClick()
                    }}
                    className="text-xs"
                  >
                    {action.label}
                  </Button>
                ))}
              </div>
            )}
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-2 ml-3">
            {showChevron && onClick && (
              <ChevronRight className="h-4 w-4 text-gray-400 flex-shrink-0" />
            )}
            {actions.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  // Handle more actions
                }}
                className="p-1 h-6 w-6"
              >
                <MoreVertical className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Componente específico para métricas
export function MetricCard({
  title,
  value,
  change,
  icon: Icon,
  color = 'blue',
  onClick
}: {
  title: string
  value: string | number
  change?: {
    value: number
    type: 'increase' | 'decrease' | 'neutral'
  }
  icon?: React.ComponentType<any>
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red'
  onClick?: () => void
}) {
  return (
    <MobileOptimizedCard
      title={title}
      value={value}
      change={change}
      icon={Icon}
      color={color}
      onClick={onClick}
      isCompact={true}
      showChevron={false}
    />
  )
}

// Componente específico para listas
export function ListCard({
  title,
  subtitle,
  icon: Icon,
  color = 'blue',
  badges = [],
  onClick,
  showChevron = true
}: {
  title: string
  subtitle?: string
  icon?: React.ComponentType<any>
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red'
  badges?: Array<{
    text: string
    color: 'blue' | 'green' | 'yellow' | 'red' | 'gray'
  }>
  onClick?: () => void
  showChevron?: boolean
}) {
  return (
    <MobileOptimizedCard
      title={title}
      subtitle={subtitle}
      icon={Icon}
      color={color}
      badges={badges}
      onClick={onClick}
      showChevron={showChevron}
    />
  )
}
