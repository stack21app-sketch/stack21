'use client'

import { useState, useEffect, useContext } from 'react'
import { I18nContext } from '@/lib/i18n'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Search, 
  Filter, 
  Star, 
  Download, 
  ShoppingCart, 
  Zap, 
  Plug, 
  BarChart3, 
  Mail, 
  ShoppingBag, 
  Users, 
  TrendingUp, 
  Shield,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react'
import { useWorkspace } from '@/hooks/use-workspace'

interface Module {
  id: string
  name: string
  slug: string
  description: string
  short_description: string
  category: {
    name: string
    icon: string
    color: string
  }
  developer: {
    name: string
    image: string | null
  }
  version: string
  price: number
  currency: string
  is_premium: boolean
  is_featured: boolean
  download_count: number
  rating: number
  review_count: number
  tags: string[]
  screenshots: string[]
  created_at: string
}

const categoryIcons = {
  'Automatización': Zap,
  'Integraciones': Plug,
  'Analytics': BarChart3,
  'Comunicación': Mail,
  'E-commerce': ShoppingBag,
  'CRM': Users,
  'Productividad': TrendingUp,
  'Seguridad': Shield
}

export default function MarketplacePage() {
  const { t } = useContext(I18nContext)
  const { data: session, status } = useSession()
  const router = useRouter()
  const { currentWorkspace } = useWorkspace()
  const [modules, setModules] = useState<Module[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [showFeatured, setShowFeatured] = useState(false)
  const [installing, setInstalling] = useState<string | null>(null)

  if (status === 'unauthenticated') {
    router.push('/auth/signin')
    return null
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    )
  }

  useEffect(() => {
    fetchModules()
  }, [selectedCategory, showFeatured, searchTerm])

  const fetchModules = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (selectedCategory) params.append('category', selectedCategory)
      if (showFeatured) params.append('featured', 'true')
      if (searchTerm) params.append('search', searchTerm)

      const response = await fetch(`/api/marketplace?${params}`)
      const data = await response.json()
      
      if (data.success) {
        setModules(data.modules)
      }
    } catch (error) {
      console.error('Error fetching modules:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInstall = async (moduleId: string, isPremium: boolean, price: number) => {
    if (!currentWorkspace) {
      alert('Selecciona un workspace primero')
      return
    }

    if (isPremium && price > 0) {
      // Redirigir a compra
      router.push(`/dashboard/marketplace/purchase/${moduleId}`)
      return
    }

    setInstalling(moduleId)
    try {
      const response = await fetch('/api/marketplace', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'install',
          moduleId,
          workspaceId: currentWorkspace.id
        })
      })

      const data = await response.json()
      
      if (data.success) {
        alert('Módulo instalado correctamente')
        fetchModules() // Refrescar lista
      } else {
        alert(data.error || 'Error instalando el módulo')
      }
    } catch (error) {
      console.error('Error installing module:', error)
      alert('Error instalando el módulo')
    } finally {
      setInstalling(null)
    }
  }

  const categories = [
    { id: '', name: 'Todas las categorías' },
    { id: 'cat_auto', name: 'Automatización' },
    { id: 'cat_integ', name: 'Integraciones' },
    { id: 'cat_analytics', name: 'Analytics' },
    { id: 'cat_comm', name: 'Comunicación' },
    { id: 'cat_ecommerce', name: 'E-commerce' },
    { id: 'cat_crm', name: 'CRM' },
    { id: 'cat_prod', name: 'Productividad' },
    { id: 'cat_sec', name: 'Seguridad' }
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <ShoppingCart className="mr-3 h-8 w-8 text-blue-600" />
              {t('marketplace')}
            </h1>
            <p className="text-gray-600 mt-2">
              Descubre e instala módulos para potenciar tu plataforma
            </p>
          </div>
          <Badge variant="secondary" className="px-3 py-1">
            <Download className="w-4 h-4 mr-1" />
            {modules.length} módulos
          </Badge>
        </div>

        {/* Filtros */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Buscar módulos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Categoría" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                variant={showFeatured ? "default" : "outline"}
                onClick={() => setShowFeatured(!showFeatured)}
                className="w-full md:w-auto"
              >
                <Star className="w-4 h-4 mr-2" />
                Destacados
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Módulos */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="h-20 bg-gray-200 rounded mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((module) => {
              const CategoryIcon = categoryIcons[module.category.name as keyof typeof categoryIcons] || Zap
              
              return (
                <Card key={module.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg bg-${module.category.color}-100`}>
                          <CategoryIcon className={`h-6 w-6 text-${module.category.color}-600`} />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{module.name}</CardTitle>
                          <CardDescription className="text-sm">
                            por {module.developer.name}
                          </CardDescription>
                        </div>
                      </div>
                      {module.is_featured && (
                        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                          <Star className="w-3 h-3 mr-1" />
                          Destacado
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {module.short_description}
                    </p>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-500 mr-1" />
                          {module.rating}
                          <span className="ml-1">({module.review_count})</span>
                        </div>
                        <div className="flex items-center">
                          <Download className="w-4 h-4 mr-1" />
                          {module.download_count}
                        </div>
                      </div>
                      <div className="text-right">
                        {module.is_premium ? (
                          <div className="text-lg font-semibold text-gray-900">
                            ${module.price}
                          </div>
                        ) : (
                          <Badge variant="outline" className="text-green-600 border-green-600">
                            Gratis
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-4">
                      {module.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <Button
                      onClick={() => handleInstall(module.id, module.is_premium, module.price)}
                      disabled={installing === module.id}
                      className="w-full"
                      variant={module.is_premium ? "default" : "outline"}
                    >
                      {installing === module.id ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Instalando...
                        </>
                      ) : module.is_premium ? (
                        <>
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          Comprar ${module.price}
                        </>
                      ) : (
                        <>
                          <Download className="w-4 h-4 mr-2" />
                          Instalar Gratis
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}

        {modules.length === 0 && !loading && (
          <Card>
            <CardContent className="text-center py-12">
              <Search className="mx-auto h-12 w-12 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No se encontraron módulos
              </h3>
              <p className="text-gray-500">
                Intenta ajustar los filtros de búsqueda
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
