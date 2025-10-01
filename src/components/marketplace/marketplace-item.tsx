'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  Star, 
  Download, 
  Heart, 
  Share2, 
  Eye, 
  Code, 
  Palette, 
  Zap, 
  Database,
  Globe,
  Shield,
  Clock,
  User,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  MoreVertical,
  Play,
  Pause,
  Settings
} from 'lucide-react'

interface MarketplaceItem {
  id: string
  name: string
  description: string
  type: 'plugin' | 'template' | 'integration' | 'workflow'
  category: 'productivity' | 'marketing' | 'development' | 'analytics' | 'design'
  price: number
  currency: 'USD' | 'EUR'
  isFree: boolean
  isPremium: boolean
  isFeatured: boolean
  isNew: boolean
  rating: number
  reviewCount: number
  downloadCount: number
  author: {
    name: string
    avatar?: string
    verified: boolean
  }
  tags: string[]
  screenshots: string[]
  features: string[]
  requirements: string[]
  compatibility: string[]
  lastUpdated: Date
  version: string
  size: string
  status: 'active' | 'pending' | 'deprecated'
  license: 'MIT' | 'GPL' | 'Commercial' | 'Free'
  documentation?: string
  support?: string
  changelog?: string[]
}

interface MarketplaceItemProps {
  item: MarketplaceItem
  onInstall: (item: MarketplaceItem) => void
  onPreview: (item: MarketplaceItem) => void
  onShare: (item: MarketplaceItem) => void
  onFavorite: (item: MarketplaceItem) => void
  isInstalled?: boolean
  isFavorite?: boolean
}

const getTypeIcon = (type: MarketplaceItem['type']) => {
  switch (type) {
    case 'plugin': return Code
    case 'template': return Palette
    case 'integration': return Zap
    case 'workflow': return Database
    default: return Code
  }
}

const getTypeColor = (type: MarketplaceItem['type']) => {
  switch (type) {
    case 'plugin': return 'bg-blue-100 text-blue-800'
    case 'template': return 'bg-purple-100 text-purple-800'
    case 'integration': return 'bg-green-100 text-green-800'
    case 'workflow': return 'bg-orange-100 text-orange-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

const getCategoryColor = (category: MarketplaceItem['category']) => {
  switch (category) {
    case 'productivity': return 'bg-blue-100 text-blue-700'
    case 'marketing': return 'bg-purple-100 text-purple-700'
    case 'development': return 'bg-green-100 text-green-700'
    case 'analytics': return 'bg-orange-100 text-orange-700'
    case 'design': return 'bg-pink-100 text-pink-700'
    default: return 'bg-gray-100 text-gray-700'
  }
}

const getStatusColor = (status: MarketplaceItem['status']) => {
  switch (status) {
    case 'active': return 'bg-green-100 text-green-800'
    case 'pending': return 'bg-yellow-100 text-yellow-800'
    case 'deprecated': return 'bg-red-100 text-red-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

const getStatusIcon = (status: MarketplaceItem['status']) => {
  switch (status) {
    case 'active': return CheckCircle
    case 'pending': return Clock
    case 'deprecated': return AlertCircle
    default: return Clock
  }
}

export default function MarketplaceItem({ 
  item, 
  onInstall, 
  onPreview, 
  onShare, 
  onFavorite,
  isInstalled = false,
  isFavorite = false
}: MarketplaceItemProps) {
  const [showDetails, setShowDetails] = useState(false)
  const [showMenu, setShowMenu] = useState(false)

  const TypeIcon = getTypeIcon(item.type)
  const StatusIcon = getStatusIcon(item.status)

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatPrice = (price: number, currency: string) => {
    if (price === 0) return 'Gratis'
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: currency
    }).format(price)
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-200 group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${getTypeColor(item.type)}`}>
              <TypeIcon className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">
                {item.name}
              </CardTitle>
              <div className="flex items-center space-x-2 mt-1">
                <Badge className={`text-xs ${getTypeColor(item.type)}`}>
                  {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                </Badge>
                <Badge className={`text-xs ${getCategoryColor(item.category)}`}>
                  {item.category}
                </Badge>
                {item.isFeatured && (
                  <Badge className="bg-yellow-100 text-yellow-800 text-xs">
                    Destacado
                  </Badge>
                )}
                {item.isNew && (
                  <Badge className="bg-green-100 text-green-800 text-xs">
                    Nuevo
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-1">
            <Badge className={`text-xs ${getStatusColor(item.status)} flex items-center`}>
              <StatusIcon className="h-3 w-3 mr-1" />
              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
            </Badge>
            
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowMenu(!showMenu)}
                className="h-8 w-8 p-0"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>

              {showMenu && (
                <div className="absolute right-0 top-8 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                  <div className="py-1">
                    <button
                      onClick={() => {
                        onPreview(item)
                        setShowMenu(false)
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Vista previa
                    </button>
                    <button
                      onClick={() => {
                        onShare(item)
                        setShowMenu(false)
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Share2 className="h-4 w-4 mr-2" />
                      Compartir
                    </button>
                    <button
                      onClick={() => {
                        onFavorite(item)
                        setShowMenu(false)
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Heart className="h-4 w-4 mr-2" />
                      {isFavorite ? 'Quitar de favoritos' : 'Añadir a favoritos'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Description */}
        <p className="text-sm text-gray-600 line-clamp-2">
          {item.description}
        </p>

        {/* Author */}
        <div className="flex items-center space-x-2">
          <Avatar className="h-6 w-6">
            <AvatarImage src={item.author.avatar} />
            <AvatarFallback className="text-xs">
              {getInitials(item.author.name)}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm text-gray-600">{item.author.name}</span>
          {item.author.verified && (
            <Badge className="bg-blue-100 text-blue-800 text-xs">
              Verificado
            </Badge>
          )}
        </div>

        {/* Rating and Downloads */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Star className="h-4 w-4 text-yellow-500" />
              <span className="text-sm font-medium">{item.rating}</span>
              <span className="text-sm text-gray-500">({item.reviewCount})</span>
            </div>
            <div className="flex items-center space-x-1">
              <Download className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-500">{item.downloadCount.toLocaleString()}</span>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-lg font-bold text-gray-900">
              {formatPrice(item.price, item.currency)}
            </div>
            {item.isFree && (
              <div className="text-xs text-green-600">Gratis para siempre</div>
            )}
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1">
          {item.tags.slice(0, 3).map((tag, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
          {item.tags.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{item.tags.length - 3} más
            </Badge>
          )}
        </div>

        {/* Details */}
        {showDetails && (
          <div className="border-t border-gray-200 pt-4 space-y-3">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-900">Versión:</span>
                <span className="ml-2 text-gray-600">{item.version}</span>
              </div>
              <div>
                <span className="font-medium text-gray-900">Tamaño:</span>
                <span className="ml-2 text-gray-600">{item.size}</span>
              </div>
              <div>
                <span className="font-medium text-gray-900">Licencia:</span>
                <span className="ml-2 text-gray-600">{item.license}</span>
              </div>
              <div>
                <span className="font-medium text-gray-900">Actualizado:</span>
                <span className="ml-2 text-gray-600">{formatDate(item.lastUpdated)}</span>
              </div>
            </div>

            {/* Features */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-2">Características:</h4>
              <div className="flex flex-wrap gap-1">
                {item.features.slice(0, 5).map((feature, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {feature}
                  </Badge>
                ))}
                {item.features.length > 5 && (
                  <Badge variant="outline" className="text-xs">
                    +{item.features.length - 5} más
                  </Badge>
                )}
              </div>
            </div>

            {/* Requirements */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-2">Requisitos:</h4>
              <div className="flex flex-wrap gap-1">
                {item.requirements.map((req, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {req}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowDetails(!showDetails)}
            className="flex items-center"
          >
            {showDetails ? 'Ocultar detalles' : 'Ver detalles'}
          </Button>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPreview(item)}
              className="flex items-center"
            >
              <Eye className="h-3 w-3 mr-1" />
              Vista previa
            </Button>
            
            <Button
              onClick={() => onInstall(item)}
              disabled={isInstalled}
              className={`flex items-center ${
                isInstalled 
                  ? 'bg-green-500 hover:bg-green-600' 
                  : 'bg-blue-500 hover:bg-blue-600'
              } text-white`}
            >
              {isInstalled ? (
                <>
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Instalado
                </>
              ) : (
                <>
                  <Download className="h-3 w-3 mr-1" />
                  {item.isFree ? 'Instalar' : 'Comprar'}
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
