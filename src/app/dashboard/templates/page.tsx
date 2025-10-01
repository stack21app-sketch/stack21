'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Search, 
  Filter, 
  Star, 
  Download, 
  Eye, 
  Copy,
  Zap,
  Mail,
  MessageCircle,
  BarChart3,
  ShoppingCart,
  Users,
  Calendar,
  FileText,
  Settings
} from 'lucide-react'

export default function TemplatesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const categories = [
    { id: 'all', name: 'Todas', count: 24 },
    { id: 'workflows', name: 'Workflows', count: 8 },
    { id: 'chatbots', name: 'Chatbots', count: 6 },
    { id: 'emails', name: 'Emails', count: 4 },
    { id: 'analytics', name: 'Analytics', count: 3 },
    { id: 'integrations', name: 'Integraciones', count: 3 }
  ]

  const templates = [
    {
      id: 1,
      title: 'Workflow de Bienvenida',
      description: 'Automatiza el proceso de onboarding de nuevos usuarios',
      category: 'workflows',
      type: 'workflow',
      difficulty: 'Fácil',
      rating: 4.8,
      downloads: 1250,
      tags: ['onboarding', 'automatización', 'usuarios'],
      icon: Zap,
      color: 'blue'
    },
    {
      id: 2,
      title: 'Chatbot de Soporte',
      description: 'Asistente virtual para atención al cliente 24/7',
      category: 'chatbots',
      type: 'chatbot',
      difficulty: 'Medio',
      rating: 4.9,
      downloads: 890,
      tags: ['soporte', 'cliente', 'IA'],
      icon: MessageCircle,
      color: 'purple'
    },
    {
      id: 3,
      title: 'Campaña de Email Marketing',
      description: 'Secuencia de emails para promocionar productos',
      category: 'emails',
      type: 'email',
      difficulty: 'Fácil',
      rating: 4.7,
      downloads: 2100,
      tags: ['marketing', 'ventas', 'promoción'],
      icon: Mail,
      color: 'green'
    },
    {
      id: 4,
      title: 'Dashboard de Analytics',
      description: 'Panel de control con métricas clave del negocio',
      category: 'analytics',
      type: 'analytics',
      difficulty: 'Avanzado',
      rating: 4.6,
      downloads: 650,
      tags: ['métricas', 'reportes', 'KPI'],
      icon: BarChart3,
      color: 'orange'
    },
    {
      id: 5,
      title: 'Integración con Shopify',
      description: 'Conecta tu tienda online con workflows automatizados',
      category: 'integrations',
      type: 'integration',
      difficulty: 'Medio',
      rating: 4.5,
      downloads: 420,
      tags: ['ecommerce', 'tienda', 'ventas'],
      icon: ShoppingCart,
      color: 'indigo'
    },
    {
      id: 6,
      title: 'Gestión de Usuarios',
      description: 'Sistema completo para administrar usuarios y permisos',
      category: 'workflows',
      type: 'workflow',
      difficulty: 'Avanzado',
      rating: 4.8,
      downloads: 780,
      tags: ['usuarios', 'permisos', 'admin'],
      icon: Users,
      color: 'blue'
    },
    {
      id: 7,
      title: 'Recordatorios Automáticos',
      description: 'Envía notificaciones y recordatorios programados',
      category: 'workflows',
      type: 'workflow',
      difficulty: 'Fácil',
      rating: 4.4,
      downloads: 1100,
      tags: ['notificaciones', 'recordatorios', 'programación'],
      icon: Calendar,
      color: 'green'
    },
    {
      id: 8,
      title: 'Generador de Reportes',
      description: 'Crea reportes automáticos con datos de múltiples fuentes',
      category: 'analytics',
      type: 'analytics',
      difficulty: 'Medio',
      rating: 4.7,
      downloads: 520,
      tags: ['reportes', 'datos', 'automatización'],
      icon: FileText,
      color: 'orange'
    }
  ]

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Fácil': return 'bg-green-100 text-green-800'
      case 'Medio': return 'bg-yellow-100 text-yellow-800'
      case 'Avanzado': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue': return 'bg-blue-100 text-blue-600'
      case 'purple': return 'bg-purple-100 text-purple-600'
      case 'green': return 'bg-green-100 text-green-600'
      case 'orange': return 'bg-orange-100 text-orange-600'
      case 'indigo': return 'bg-indigo-100 text-indigo-600'
      default: return 'bg-gray-100 text-gray-600'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Plantillas</h1>
          <p className="text-gray-600">Descubre plantillas predefinidas para acelerar tu trabajo</p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Buscar plantillas..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button variant="outline" className="md:w-auto">
                  <Filter className="h-4 w-4 mr-2" />
                  Filtros
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Categories */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Categorías</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <span className="font-medium">{category.name}</span>
                    <Badge variant="secondary" className="text-xs">
                      {category.count}
                    </Badge>
                  </button>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* Templates Grid */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="lg:col-span-3"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredTemplates.map((template, index) => (
                <motion.div
                  key={template.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                >
                  <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getColorClasses(template.color)}`}>
                          <template.icon className="w-6 h-6" />
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="text-sm font-medium">{template.rating}</span>
                        </div>
                      </div>
                      <CardTitle className="text-lg">{template.title}</CardTitle>
                      <CardDescription>{template.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <Badge className={`text-xs ${getDifficultyColor(template.difficulty)}`}>
                            {template.difficulty}
                          </Badge>
                          <span className="text-sm text-gray-500">
                            {template.downloads} descargas
                          </span>
                        </div>
                        
                        <div className="flex flex-wrap gap-1">
                          {template.tags.slice(0, 3).map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex gap-2">
                          <Button size="sm" className="flex-1">
                            <Download className="w-4 h-4 mr-2" />
                            Usar
                          </Button>
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Featured Templates */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Plantillas Destacadas</CardTitle>
              <CardDescription>
                Las plantillas más populares y mejor valoradas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {templates.slice(0, 3).map((template) => (
                  <div key={template.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getColorClasses(template.color)}`}>
                      <template.icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold">{template.title}</h4>
                      <p className="text-sm text-gray-600">{template.downloads} descargas</p>
                    </div>
                    <Button size="sm">Usar</Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}