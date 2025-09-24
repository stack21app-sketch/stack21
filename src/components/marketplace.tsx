'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog'
import { 
  Search, 
  Filter, 
  Star, 
  Download, 
  Eye, 
  Heart,
  ShoppingCart,
  Tag,
  Clock,
  User,
  Code,
  Zap,
  Brain,
  BarChart3,
  Palette,
  Link,
  FileText,
  ChevronDown,
  SortAsc,
  SortDesc,
  Grid,
  List,
  Plus,
  CheckCircle,
  ExternalLink
} from 'lucide-react'
import { 
  SAMPLE_MODULES, 
  CATEGORIES, 
  getModulesByCategory,
  getFreeModules,
  getPremiumModules,
  searchModules,
  getModuleById,
  getTopRatedModules,
  getMostDownloadedModules,
  getRecentlyAddedModules,
  getModuleStats,
  type Module,
  type Category
} from '@/lib/marketplace'

export function Marketplace() {
  const [modules, setModules] = useState<Module[]>(SAMPLE_MODULES)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<string>('popular')
  const [priceFilter, setPriceFilter] = useState<string>('all')
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedModule, setSelectedModule] = useState<Module | null>(null)
  const [isInstalling, setIsInstalling] = useState(false)

  const stats = getModuleStats()

  useEffect(() => {
    let filteredModules = SAMPLE_MODULES

    // Filtrar por categoría
    if (selectedCategory !== 'all') {
      filteredModules = getModulesByCategory(selectedCategory)
    }

    // Filtrar por búsqueda
    if (searchQuery) {
      filteredModules = searchModules(searchQuery)
    }

    // Filtrar por precio
    if (priceFilter === 'free') {
      filteredModules = filteredModules.filter(m => m.isFree)
    } else if (priceFilter === 'premium') {
      filteredModules = filteredModules.filter(m => !m.isFree)
    }

    // Filtrar por dificultad
    if (difficultyFilter !== 'all') {
      filteredModules = filteredModules.filter(m => m.difficulty === difficultyFilter)
    }

    // Ordenar
    switch (sortBy) {
      case 'popular':
        filteredModules = getMostDownloadedModules(100)
        break
      case 'rating':
        filteredModules = getTopRatedModules(100)
        break
      case 'newest':
        filteredModules = getRecentlyAddedModules(100)
        break
      case 'name':
        filteredModules = filteredModules.sort((a, b) => a.name.localeCompare(b.name))
        break
      case 'price-low':
        filteredModules = filteredModules.sort((a, b) => a.price - b.price)
        break
      case 'price-high':
        filteredModules = filteredModules.sort((a, b) => b.price - a.price)
        break
    }

    setModules(filteredModules)
  }, [selectedCategory, searchQuery, sortBy, priceFilter, difficultyFilter])

  const handleInstallModule = async (module: Module) => {
    setIsInstalling(true)
    try {
      // Simular instalación
      await new Promise(resolve => setTimeout(resolve, 2000))
      console.log(`Installing module: ${module.name}`)
      // Aquí se haría la instalación real
    } catch (error) {
      console.error('Error installing module:', error)
    } finally {
      setIsInstalling(false)
    }
  }

  const getCategoryIcon = (category: string) => {
    const categoryData = CATEGORIES.find(c => c.id === category)
    return categoryData?.icon || '📦'
  }

  const getCategoryColor = (category: string) => {
    const categoryData = CATEGORIES.find(c => c.id === category)
    return categoryData?.color || 'from-gray-500 to-slate-500'
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-500'
      case 'intermediate':
        return 'bg-yellow-500'
      case 'advanced':
        return 'bg-red-500'
      default:
        return 'bg-gray-500'
    }
  }

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'Principiante'
      case 'intermediate':
        return 'Intermedio'
      case 'advanced':
        return 'Avanzado'
      default:
        return 'Desconocido'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white flex items-center">
            <ShoppingCart className="w-8 h-8 mr-3 text-blue-400" />
            Marketplace de Módulos
          </h2>
          <p className="text-gray-400">Descubre e instala módulos para potenciar Stack21</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-white">{stats.totalModules}</div>
          <div className="text-sm text-gray-400">Módulos disponibles</div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-white/5 backdrop-blur-xl border-white/10">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-400">{stats.freeModules}</div>
            <div className="text-sm text-gray-400">Gratuitos</div>
          </CardContent>
        </Card>
        <Card className="bg-white/5 backdrop-blur-xl border-white/10">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-400">{stats.premiumModules}</div>
            <div className="text-sm text-gray-400">Premium</div>
          </CardContent>
        </Card>
        <Card className="bg-white/5 backdrop-blur-xl border-white/10">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-400">{stats.totalDownloads.toLocaleString()}</div>
            <div className="text-sm text-gray-400">Descargas</div>
          </CardContent>
        </Card>
        <Card className="bg-white/5 backdrop-blur-xl border-white/10">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-400">{stats.averageRating}</div>
            <div className="text-sm text-gray-400">Rating promedio</div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros y búsqueda */}
      <Card className="bg-white/5 backdrop-blur-xl border-white/10">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Búsqueda */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar módulos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-gray-800 border-gray-600 text-white"
                />
              </div>
            </div>

            {/* Categorías */}
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48 bg-gray-800 border-gray-600 text-white">
                <SelectValue placeholder="Categoría" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                <SelectItem value="all" className="text-white">Todas las categorías</SelectItem>
                {CATEGORIES.map((category) => (
                  <SelectItem key={category.id} value={category.id} className="text-white">
                    {category.icon} {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Precio */}
            <Select value={priceFilter} onValueChange={setPriceFilter}>
              <SelectTrigger className="w-32 bg-gray-800 border-gray-600 text-white">
                <SelectValue placeholder="Precio" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                <SelectItem value="all" className="text-white">Todos</SelectItem>
                <SelectItem value="free" className="text-white">Gratuitos</SelectItem>
                <SelectItem value="premium" className="text-white">Premium</SelectItem>
              </SelectContent>
            </Select>

            {/* Dificultad */}
            <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
              <SelectTrigger className="w-32 bg-gray-800 border-gray-600 text-white">
                <SelectValue placeholder="Dificultad" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                <SelectItem value="all" className="text-white">Todas</SelectItem>
                <SelectItem value="beginner" className="text-white">Principiante</SelectItem>
                <SelectItem value="intermediate" className="text-white">Intermedio</SelectItem>
                <SelectItem value="advanced" className="text-white">Avanzado</SelectItem>
              </SelectContent>
            </Select>

            {/* Ordenar */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40 bg-gray-800 border-gray-600 text-white">
                <SelectValue placeholder="Ordenar" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                <SelectItem value="popular" className="text-white">Más populares</SelectItem>
                <SelectItem value="rating" className="text-white">Mejor valorados</SelectItem>
                <SelectItem value="newest" className="text-white">Más recientes</SelectItem>
                <SelectItem value="name" className="text-white">Nombre A-Z</SelectItem>
                <SelectItem value="price-low" className="text-white">Precio: Menor</SelectItem>
                <SelectItem value="price-high" className="text-white">Precio: Mayor</SelectItem>
              </SelectContent>
            </Select>

            {/* Vista */}
            <div className="flex space-x-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('grid')}
                className="text-white"
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('list')}
                className="text-white"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Grid de módulos */}
      <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
        {modules.map((module) => (
          <Card key={module.id} className="bg-white/5 backdrop-blur-xl border-white/10 hover:bg-white/10 transition-all duration-300 group">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${getCategoryColor(module.category)} flex items-center justify-center text-2xl`}>
                    {getCategoryIcon(module.category)}
                  </div>
                  <div>
                    <CardTitle className="text-white text-lg">{module.name}</CardTitle>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge className={`${getDifficultyColor(module.difficulty)} text-white`}>
                        {getDifficultyLabel(module.difficulty)}
                      </Badge>
                      <Badge variant="outline" className="text-gray-400">
                        v{module.version}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-white text-sm">{module.rating}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 text-sm mb-4">{module.shortDescription}</p>
              
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4 text-sm text-gray-400">
                  <div className="flex items-center space-x-1">
                    <Download className="w-4 h-4" />
                    <span>{module.downloads.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <User className="w-4 h-4" />
                    <span>{module.author}</span>
                  </div>
                </div>
                <div className="text-right">
                  {module.isFree ? (
                    <Badge className="bg-green-500 text-white">Gratuito</Badge>
                  ) : (
                    <div className="text-white font-semibold">
                      ${module.price}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap gap-1 mb-4">
                {module.tags.slice(0, 3).map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs text-gray-400 border-gray-600">
                    {tag}
                  </Badge>
                ))}
                {module.tags.length > 3 && (
                  <Badge variant="outline" className="text-xs text-gray-400 border-gray-600">
                    +{module.tags.length - 3}
                  </Badge>
                )}
              </div>

              <div className="flex space-x-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedModule(module)}
                      className="flex-1 text-white border-white/20 hover:bg-white/10"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Ver detalles
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-gray-900 border-gray-700 max-w-4xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="text-white text-2xl">{selectedModule?.name}</DialogTitle>
                      <DialogDescription className="text-gray-400">
                        por {selectedModule?.author} • v{selectedModule?.version}
                      </DialogDescription>
                    </DialogHeader>
                    {selectedModule && (
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="text-white font-semibold mb-2">Descripción</h4>
                            <p className="text-gray-300">{selectedModule.description}</p>
                          </div>
                          <div>
                            <h4 className="text-white font-semibold mb-2">Características</h4>
                            <ul className="space-y-1">
                              {selectedModule.features.map((feature, index) => (
                                <li key={index} className="text-gray-300 text-sm flex items-center">
                                  <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                                  {feature}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <h4 className="text-white font-semibold mb-2">Requisitos</h4>
                            <ul className="space-y-1">
                              {selectedModule.requirements.map((req, index) => (
                                <li key={index} className="text-gray-300 text-sm">• {req}</li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h4 className="text-white font-semibold mb-2">Compatibilidad</h4>
                            <ul className="space-y-1">
                              {selectedModule.compatibility.map((comp, index) => (
                                <li key={index} className="text-gray-300 text-sm">• {comp}</li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h4 className="text-white font-semibold mb-2">Industrias</h4>
                            <div className="flex flex-wrap gap-1">
                              {selectedModule.industry.map((ind, index) => (
                                <Badge key={index} variant="outline" className="text-xs text-gray-400 border-gray-600">
                                  {ind}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="flex space-x-4">
                          <Button
                            onClick={() => handleInstallModule(selectedModule)}
                            disabled={isInstalling}
                            className="bg-blue-500 hover:bg-blue-600 text-white"
                          >
                            {isInstalling ? (
                              <>
                                <Clock className="w-4 h-4 mr-2 animate-spin" />
                                Instalando...
                              </>
                            ) : (
                              <>
                                <Download className="w-4 h-4 mr-2" />
                                Instalar módulo
                              </>
                            )}
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => window.open(selectedModule.documentation, '_blank')}
                            className="text-white border-white/20 hover:bg-white/10"
                          >
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Documentación
                          </Button>
                        </div>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>
                
                <Button
                  onClick={() => handleInstallModule(module)}
                  disabled={isInstalling}
                  size="sm"
                  className="bg-green-500 hover:bg-green-600 text-white"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Instalar
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {modules.length === 0 && (
        <Card className="bg-white/5 backdrop-blur-xl border-white/10">
          <CardContent className="p-12 text-center">
            <Search className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-semibold text-white mb-2">No se encontraron módulos</h3>
            <p className="text-gray-400 mb-6">
              Intenta ajustar los filtros o usar términos de búsqueda diferentes
            </p>
            <Button
              onClick={() => {
                setSearchQuery('')
                setSelectedCategory('all')
                setPriceFilter('all')
                setDifficultyFilter('all')
              }}
              variant="outline"
              className="text-white border-white/20 hover:bg-white/10"
            >
              Limpiar filtros
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
