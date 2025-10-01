'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  Search, 
  Filter, 
  X, 
  Star, 
  Download, 
  Clock, 
  TrendingUp,
  Code,
  Palette,
  Zap,
  Database,
  Globe,
  Shield,
  DollarSign,
  CheckCircle
} from 'lucide-react'

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

interface MarketplaceFiltersProps {
  filters: FilterOptions
  onFiltersChange: (filters: FilterOptions) => void
  onClearFilters: () => void
  totalItems: number
  filteredItems: number
}

const typeOptions = [
  { id: 'all', label: 'Todos', icon: Globe, count: 0 },
  { id: 'plugin', label: 'Plugins', icon: Code, count: 0 },
  { id: 'template', label: 'Templates', icon: Palette, count: 0 },
  { id: 'integration', label: 'Integraciones', icon: Zap, count: 0 },
  { id: 'workflow', label: 'Workflows', icon: Database, count: 0 }
]

const categoryOptions = [
  { id: 'all', label: 'Todas las categorías', count: 0 },
  { id: 'productivity', label: 'Productividad', count: 0 },
  { id: 'marketing', label: 'Marketing', count: 0 },
  { id: 'development', label: 'Desarrollo', count: 0 },
  { id: 'analytics', label: 'Analytics', count: 0 },
  { id: 'design', label: 'Diseño', count: 0 }
]

const priceOptions = [
  { id: 'all', label: 'Todos los precios', count: 0 },
  { id: 'free', label: 'Gratis', count: 0 },
  { id: 'paid', label: 'De pago', count: 0 },
  { id: 'premium', label: 'Premium', count: 0 }
]

const ratingOptions = [
  { id: 'all', label: 'Todas las calificaciones', count: 0 },
  { id: '4+', label: '4+ estrellas', count: 0 },
  { id: '3+', label: '3+ estrellas', count: 0 },
  { id: '2+', label: '2+ estrellas', count: 0 }
]

const sortOptions = [
  { id: 'popular', label: 'Más populares', icon: TrendingUp },
  { id: 'newest', label: 'Más recientes', icon: Clock },
  { id: 'rating', label: 'Mejor calificados', icon: Star },
  { id: 'price', label: 'Precio', icon: DollarSign },
  { id: 'name', label: 'Nombre', icon: CheckCircle }
]

const statusOptions = [
  { id: 'all', label: 'Todos los estados', count: 0 },
  { id: 'active', label: 'Activo', count: 0 },
  { id: 'pending', label: 'Pendiente', count: 0 },
  { id: 'deprecated', label: 'Deprecado', count: 0 }
]

const licenseOptions = [
  { id: 'all', label: 'Todas las licencias', count: 0 },
  { id: 'MIT', label: 'MIT', count: 0 },
  { id: 'GPL', label: 'GPL', count: 0 },
  { id: 'Commercial', label: 'Comercial', count: 0 },
  { id: 'Free', label: 'Gratis', count: 0 }
]

export default function MarketplaceFilters({ 
  filters, 
  onFiltersChange, 
  onClearFilters, 
  totalItems, 
  filteredItems 
}: MarketplaceFiltersProps) {
  const [showAdvanced, setShowAdvanced] = useState(false)

  const handleFilterChange = (key: keyof FilterOptions, value: any) => {
    onFiltersChange({ ...filters, [key]: value })
  }

  const getActiveFiltersCount = () => {
    let count = 0
    if (filters.search) count++
    if (filters.type !== 'all') count++
    if (filters.category !== 'all') count++
    if (filters.price !== 'all') count++
    if (filters.rating !== 'all') count++
    if (filters.status !== 'all') count++
    if (filters.license !== 'all') count++
    return count
  }

  const activeFiltersCount = getActiveFiltersCount()

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <Filter className="h-5 w-5 mr-2 text-blue-500" />
            Filtros
          </CardTitle>
          <div className="flex items-center space-x-2">
            {activeFiltersCount > 0 && (
              <Badge className="bg-blue-100 text-blue-800">
                {activeFiltersCount} activos
              </Badge>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              {showAdvanced ? 'Ocultar' : 'Avanzado'}
            </Button>
          </div>
        </div>
        
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>
            Mostrando {filteredItems} de {totalItems} elementos
          </span>
          {activeFiltersCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              className="text-red-600 hover:text-red-700"
            >
              <X className="h-3 w-3 mr-1" />
              Limpiar filtros
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Search */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Buscar
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar por nombre, descripción o autor..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Type Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipo
          </label>
          <div className="grid grid-cols-2 gap-2">
            {typeOptions.map((option) => {
              const Icon = option.icon
              return (
                <Button
                  key={option.id}
                  variant={filters.type === option.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleFilterChange('type', option.id)}
                  className="justify-start"
                >
                  <Icon className="h-3 w-3 mr-2" />
                  {option.label}
                </Button>
              )
            })}
          </div>
        </div>

        {/* Category Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Categoría
          </label>
          <div className="space-y-1">
            {categoryOptions.map((option) => (
              <Button
                key={option.id}
                variant={filters.category === option.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleFilterChange('category', option.id)}
                className="w-full justify-start"
              >
                {option.label}
                {option.count > 0 && (
                  <Badge className="ml-auto bg-gray-100 text-gray-700">
                    {option.count}
                  </Badge>
                )}
              </Button>
            ))}
          </div>
        </div>

        {/* Price Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Precio
          </label>
          <div className="space-y-1">
            {priceOptions.map((option) => (
              <Button
                key={option.id}
                variant={filters.price === option.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleFilterChange('price', option.id)}
                className="w-full justify-start"
              >
                {option.label}
                {option.count > 0 && (
                  <Badge className="ml-auto bg-gray-100 text-gray-700">
                    {option.count}
                  </Badge>
                )}
              </Button>
            ))}
          </div>
        </div>

        {/* Rating Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Calificación
          </label>
          <div className="space-y-1">
            {ratingOptions.map((option) => (
              <Button
                key={option.id}
                variant={filters.rating === option.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleFilterChange('rating', option.id)}
                className="w-full justify-start"
              >
                <Star className="h-3 w-3 mr-2 text-yellow-500" />
                {option.label}
                {option.count > 0 && (
                  <Badge className="ml-auto bg-gray-100 text-gray-700">
                    {option.count}
                  </Badge>
                )}
              </Button>
            ))}
          </div>
        </div>

        {/* Sort By */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ordenar por
          </label>
          <select
            value={filters.sortBy}
            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {sortOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Advanced Filters */}
        {showAdvanced && (
          <div className="space-y-4 pt-4 border-t border-gray-200">
            <h4 className="text-sm font-medium text-gray-900">Filtros Avanzados</h4>
            
            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estado
              </label>
              <div className="space-y-1">
                {statusOptions.map((option) => (
                  <Button
                    key={option.id}
                    variant={filters.status === option.id ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleFilterChange('status', option.id)}
                    className="w-full justify-start"
                  >
                    {option.label}
                    {option.count > 0 && (
                      <Badge className="ml-auto bg-gray-100 text-gray-700">
                        {option.count}
                      </Badge>
                    )}
                  </Button>
                ))}
              </div>
            </div>

            {/* License Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Licencia
              </label>
              <div className="space-y-1">
                {licenseOptions.map((option) => (
                  <Button
                    key={option.id}
                    variant={filters.license === option.id ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleFilterChange('license', option.id)}
                    className="w-full justify-start"
                  >
                    {option.label}
                    {option.count > 0 && (
                      <Badge className="ml-auto bg-gray-100 text-gray-700">
                        {option.count}
                      </Badge>
                    )}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="pt-4 border-t border-gray-200">
          <div className="space-y-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleFilterChange('type', 'plugin')}
              className="w-full justify-start"
            >
              <Code className="h-3 w-3 mr-2" />
              Solo Plugins
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleFilterChange('price', 'free')}
              className="w-full justify-start"
            >
              <DollarSign className="h-3 w-3 mr-2" />
              Solo Gratis
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleFilterChange('rating', '4+')}
              className="w-full justify-start"
            >
              <Star className="h-3 w-3 mr-2" />
              Mejor Calificados
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
