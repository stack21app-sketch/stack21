'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  HelpCircle, 
  Search, 
  BookOpen, 
  MessageCircle, 
  Video, 
  FileText,
  ExternalLink,
  ChevronRight,
  Play,
  Download
} from 'lucide-react'

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const categories = [
    { id: 'all', name: 'Todo', count: 24 },
    { id: 'getting-started', name: 'Primeros Pasos', count: 8 },
    { id: 'workflows', name: 'Workflows', count: 6 },
    { id: 'integrations', name: 'Integraciones', count: 4 },
    { id: 'billing', name: 'Facturación', count: 3 },
    { id: 'troubleshooting', name: 'Solución de Problemas', count: 3 }
  ]

  const helpArticles = [
    {
      id: 1,
      title: 'Cómo crear tu primer workflow',
      description: 'Aprende a crear y configurar tu primer workflow en Stack21',
      category: 'getting-started',
      type: 'article',
      readTime: '5 min',
      difficulty: 'Fácil'
    },
    {
      id: 2,
      title: 'Configurar integraciones con Google',
      description: 'Guía paso a paso para conectar tu cuenta de Google',
      category: 'integrations',
      type: 'video',
      readTime: '8 min',
      difficulty: 'Medio'
    },
    {
      id: 3,
      title: 'Solución de problemas de autenticación',
      description: 'Resuelve problemas comunes de inicio de sesión',
      category: 'troubleshooting',
      type: 'article',
      readTime: '3 min',
      difficulty: 'Fácil'
    },
    {
      id: 4,
      title: 'Crear chatbots inteligentes',
      description: 'Aprende a crear y personalizar chatbots con IA',
      category: 'workflows',
      type: 'video',
      readTime: '12 min',
      difficulty: 'Avanzado'
    },
    {
      id: 5,
      title: 'Configurar notificaciones por email',
      description: 'Cómo configurar y personalizar notificaciones',
      category: 'workflows',
      type: 'article',
      readTime: '4 min',
      difficulty: 'Fácil'
    },
    {
      id: 6,
      title: 'Entender la facturación',
      description: 'Explicación de planes, precios y facturación',
      category: 'billing',
      type: 'article',
      readTime: '6 min',
      difficulty: 'Fácil'
    }
  ]

  const filteredArticles = helpArticles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Centro de Ayuda</h1>
          <p className="text-gray-600">Encuentra respuestas a tus preguntas y aprende a usar Stack21</p>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar en la documentación..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
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

          {/* Articles */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="lg:col-span-3"
          >
            <div className="space-y-4">
              {filteredArticles.map((article, index) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                >
                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {article.type === 'video' ? (
                              <Play className="h-4 w-4 text-blue-600" />
                            ) : (
                              <FileText className="h-4 w-4 text-green-600" />
                            )}
                            <Badge variant="outline" className="text-xs">
                              {article.type === 'video' ? 'Video' : 'Artículo'}
                            </Badge>
                            <Badge className={`text-xs ${getDifficultyColor(article.difficulty)}`}>
                              {article.difficulty}
                            </Badge>
                          </div>
                          <h3 className="font-semibold text-lg mb-2">{article.title}</h3>
                          <p className="text-gray-600 mb-3">{article.description}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>{article.readTime} de lectura</span>
                            <span>•</span>
                            <span>{categories.find(c => c.id === article.category)?.name}</span>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Acciones Rápidas</CardTitle>
              <CardDescription>
                Enlaces útiles y recursos adicionales
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                  <BookOpen className="h-6 w-6" />
                  <span>Documentación</span>
                </Button>
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                  <MessageCircle className="h-6 w-6" />
                  <span>Chat de Soporte</span>
                </Button>
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                  <Video className="h-6 w-6" />
                  <span>Tutoriales</span>
                </Button>
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                  <Download className="h-6 w-6" />
                  <span>Descargar Guía</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
