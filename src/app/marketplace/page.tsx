'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Store, 
  Search, 
  Filter, 
  TrendingUp, 
  Star, 
  Download, 
  Heart,
  Eye,
  Share2,
  Plus,
  Grid,
  List,
  Settings,
  BookOpen,
  Zap,
  Code,
  Palette,
  Database
} from 'lucide-react'
import MarketplaceItem from '@/components/marketplace/marketplace-item'
import MarketplaceFilters from '@/components/marketplace/marketplace-filters'

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

interface FilterOptions {
  search: string
  type: 'all' | 'plugin' | 'template' | 'integration' | 'workflow'
  category: 'all' | 'productivity' | 'marketing' | 'development' | 'analytics' | 'design'
  price: 'all' | 'free' | 'paid' | 'premium'
  rating: 'all' | '4+' | '3+' | '2+'
  sortBy: 'popular' | 'newest' | 'rating' | 'price' | 'name'
  status: 'all' | 'active' | 'pending' | 'deprecated'
  license: 'all' | 'MIT' | 'GPL' | 'Commercial' | 'Free'
}

const mockItems: MarketplaceItem[] = [
  {
    id: '1',
    name: 'Email Marketing Pro',
    description: 'Plugin avanzado para automatización de email marketing con templates personalizables y analytics en tiempo real.',
    type: 'plugin',
    category: 'marketing',
    price: 49.99,
    currency: 'USD',
    isFree: false,
    isPremium: true,
    isFeatured: true,
    isNew: false,
    rating: 4.8,
    reviewCount: 234,
    downloadCount: 15420,
    author: {
      name: 'Marketing Solutions Inc.',
      verified: true
    },
    tags: ['email', 'marketing', 'automation', 'templates'],
    screenshots: [],
    features: ['Templates personalizables', 'Analytics en tiempo real', 'Automatización avanzada', 'A/B Testing'],
    requirements: ['Stack21 Pro', 'PHP 8.0+'],
    compatibility: ['Chrome', 'Firefox', 'Safari'],
    lastUpdated: new Date('2024-01-15'),
    version: '2.1.0',
    size: '2.4 MB',
    status: 'active',
    license: 'Commercial'
  },
  {
    id: '2',
    name: 'React Dashboard Template',
    description: 'Template moderno y responsive para dashboards administrativos con componentes reutilizables.',
    type: 'template',
    category: 'development',
    price: 0,
    currency: 'USD',
    isFree: true,
    isPremium: false,
    isFeatured: false,
    isNew: true,
    rating: 4.9,
    reviewCount: 89,
    downloadCount: 3240,
    author: {
      name: 'UI Design Studio',
      verified: true
    },
    tags: ['react', 'dashboard', 'template', 'responsive'],
    screenshots: [],
    features: ['Componentes reutilizables', 'Diseño responsive', 'Dark mode', 'Documentación completa'],
    requirements: ['React 18+', 'Node.js 16+'],
    compatibility: ['Chrome', 'Firefox', 'Safari', 'Edge'],
    lastUpdated: new Date('2024-01-20'),
    version: '1.0.0',
    size: '15.2 MB',
    status: 'active',
    license: 'MIT'
  },
  {
    id: '3',
    name: 'Slack Integration',
    description: 'Integración completa con Slack para notificaciones automáticas y gestión de equipos.',
    type: 'integration',
    category: 'productivity',
    price: 19.99,
    currency: 'USD',
    isFree: false,
    isPremium: false,
    isFeatured: false,
    isNew: false,
    rating: 4.6,
    reviewCount: 156,
    downloadCount: 8920,
    author: {
      name: 'Productivity Tools',
      verified: false
    },
    tags: ['slack', 'notifications', 'team', 'productivity'],
    screenshots: [],
    features: ['Notificaciones automáticas', 'Gestión de canales', 'Comandos personalizados', 'Webhooks'],
    requirements: ['Stack21 Basic', 'Slack API'],
    compatibility: ['Chrome', 'Firefox', 'Safari'],
    lastUpdated: new Date('2024-01-10'),
    version: '1.5.2',
    size: '1.8 MB',
    status: 'active',
    license: 'Commercial'
  },
  {
    id: '4',
    name: 'Data Analytics Workflow',
    description: 'Workflow automatizado para análisis de datos con visualizaciones interactivas y reportes automáticos.',
    type: 'workflow',
    category: 'analytics',
    price: 0,
    currency: 'USD',
    isFree: true,
    isPremium: false,
    isFeatured: true,
    isNew: false,
    rating: 4.7,
    reviewCount: 203,
    downloadCount: 5670,
    author: {
      name: 'Data Science Team',
      verified: true
    },
    tags: ['analytics', 'data', 'visualization', 'reports'],
    screenshots: [],
    features: ['Visualizaciones interactivas', 'Reportes automáticos', 'Múltiples fuentes de datos', 'Exportación PDF'],
    requirements: ['Stack21 Pro', 'Python 3.8+'],
    compatibility: ['Chrome', 'Firefox', 'Safari', 'Edge'],
    lastUpdated: new Date('2024-01-18'),
    version: '3.2.1',
    size: '8.7 MB',
    status: 'active',
    license: 'MIT'
  },
  {
    id: '5',
    name: 'AI Content Generator',
    description: 'Plugin de IA para generación automática de contenido con múltiples idiomas y estilos.',
    type: 'plugin',
    category: 'marketing',
    price: 79.99,
    currency: 'USD',
    isFree: false,
    isPremium: true,
    isFeatured: true,
    isNew: true,
    rating: 4.9,
    reviewCount: 67,
    downloadCount: 1230,
    author: {
      name: 'AI Solutions Corp',
      verified: true
    },
    tags: ['ai', 'content', 'generation', 'multilingual'],
    screenshots: [],
    features: ['Generación automática', 'Múltiples idiomas', 'Estilos personalizables', 'API completa'],
    requirements: ['Stack21 Pro', 'OpenAI API'],
    compatibility: ['Chrome', 'Firefox', 'Safari'],
    lastUpdated: new Date('2024-01-22'),
    version: '1.0.0',
    size: '4.2 MB',
    status: 'active',
    license: 'Commercial'
  }
]

export default function MarketplacePage() {
  const [items, setItems] = useState<MarketplaceItem[]>(mockItems)
  const [filteredItems, setFilteredItems] = useState<MarketplaceItem[]>(mockItems)
  const [filters, setFilters] = useState<FilterOptions>({
    search: '',
    type: 'all',
    category: 'all',
    price: 'all',
    rating: 'all',
    sortBy: 'popular',
    status: 'all',
    license: 'all'
  })
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [installedItems, setInstalledItems] = useState<Set<string>>(new Set())
  const [favoriteItems, setFavoriteItems] = useState<Set<string>>(new Set())

  // Filter and sort items
  useEffect(() => {
    let filtered = [...items]

    // Apply filters
    if (filters.search) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        item.description.toLowerCase().includes(filters.search.toLowerCase()) ||
        item.author.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        item.tags.some(tag => tag.toLowerCase().includes(filters.search.toLowerCase()))
      )
    }

    if (filters.type !== 'all') {
      filtered = filtered.filter(item => item.type === filters.type)
    }

    if (filters.category !== 'all') {
      filtered = filtered.filter(item => item.category === filters.category)
    }

    if (filters.price !== 'all') {
      switch (filters.price) {
        case 'free':
          filtered = filtered.filter(item => item.isFree)
          break
        case 'paid':
          filtered = filtered.filter(item => !item.isFree && !item.isPremium)
          break
        case 'premium':
          filtered = filtered.filter(item => item.isPremium)
          break
      }
    }

    if (filters.rating !== 'all') {
      const minRating = parseFloat(filters.rating.replace('+', ''))
      filtered = filtered.filter(item => item.rating >= minRating)
    }

    if (filters.status !== 'all') {
      filtered = filtered.filter(item => item.status === filters.status)
    }

    if (filters.license !== 'all') {
      filtered = filtered.filter(item => item.license === filters.license)
    }

    // Sort items
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'popular':
          return b.downloadCount - a.downloadCount
        case 'newest':
          return b.lastUpdated.getTime() - a.lastUpdated.getTime()
        case 'rating':
          return b.rating - a.rating
        case 'price':
          return a.price - b.price
        case 'name':
          return a.name.localeCompare(b.name)
        default:
          return 0
      }
    })

    setFilteredItems(filtered)
  }, [items, filters])

  const handleInstall = (item: MarketplaceItem) => {
    setInstalledItems(prev => new Set(Array.from(prev).concat(item.id)))
    console.log('Installing:', item.name)
  }

  const handlePreview = (item: MarketplaceItem) => {
    console.log('Previewing:', item.name)
  }

  const handleShare = (item: MarketplaceItem) => {
    console.log('Sharing:', item.name)
  }

  const handleFavorite = (item: MarketplaceItem) => {
    setFavoriteItems(prev => {
      const newSet = new Set(prev)
      if (newSet.has(item.id)) {
        newSet.delete(item.id)
      } else {
        newSet.add(item.id)
      }
      return newSet
    })
  }

  const handleClearFilters = () => {
    setFilters({
      search: '',
      type: 'all',
      category: 'all',
      price: 'all',
      rating: 'all',
      sortBy: 'popular',
      status: 'all',
      license: 'all'
    })
  }

  const stats = {
    total: items.length,
    free: items.filter(item => item.isFree).length,
    premium: items.filter(item => item.isPremium).length,
    featured: items.filter(item => item.isFeatured).length,
    new: items.filter(item => item.isNew).length
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl">
                <Store className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Marketplace</h1>
                <p className="text-gray-600">Descubre plugins, templates e integraciones para potenciar tu plataforma</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <BookOpen className="h-4 w-4 mr-2" />
                Documentación
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Configuración
              </Button>
              <Button className="bg-blue-500 hover:bg-blue-600 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Publicar
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                  </div>
                  <Store className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Gratis</p>
                    <p className="text-2xl font-bold text-green-600">{stats.free}</p>
                  </div>
                  <Download className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Premium</p>
                    <p className="text-2xl font-bold text-purple-600">{stats.premium}</p>
                  </div>
                  <Star className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Destacados</p>
                    <p className="text-2xl font-bold text-yellow-600">{stats.featured}</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Nuevos</p>
                    <p className="text-2xl font-bold text-orange-600">{stats.new}</p>
                  </div>
                  <Zap className="h-8 w-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <MarketplaceFilters
              filters={filters}
              onFiltersChange={setFilters}
              onClearFilters={handleClearFilters}
              totalItems={items.length}
              filteredItems={filteredItems.length}
            />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* View Controls */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  {filteredItems.length} elementos encontrados
                </h2>
                <div className="flex items-center space-x-2">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Items Grid/List */}
            <div className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' 
                : 'grid-cols-1'
            }`}>
              {filteredItems.map((item) => (
                <MarketplaceItem
                  key={item.id}
                  item={item}
                  onInstall={handleInstall}
                  onPreview={handlePreview}
                  onShare={handleShare}
                  onFavorite={handleFavorite}
                  isInstalled={installedItems.has(item.id)}
                  isFavorite={favoriteItems.has(item.id)}
                />
              ))}
            </div>

            {filteredItems.length === 0 && (
              <Card className="bg-gray-50 border-dashed">
                <CardContent className="p-8 text-center">
                  <Store className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron elementos</h3>
                  <p className="text-gray-600 mb-4">Intenta ajustar los filtros de búsqueda</p>
                  <Button
                    onClick={handleClearFilters}
                    variant="outline"
                  >
                    Limpiar filtros
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}