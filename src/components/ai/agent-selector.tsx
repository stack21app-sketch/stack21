'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Brain, 
  MessageSquare, 
  BarChart3, 
  Mail, 
  ShoppingCart, 
  Code, 
  Image, 
  FileText,
  Zap,
  Star,
  Clock,
  Users,
  TrendingUp,
  Shield,
  Palette
} from 'lucide-react'

interface Agent {
  id: string
  name: string
  description: string
  icon: React.ComponentType<any>
  color: string
  category: 'productivity' | 'marketing' | 'development' | 'analytics' | 'creative'
  isNew?: boolean
  isPopular?: boolean
  capabilities: string[]
  examples: string[]
  rating: number
  usage: number
}

const agents: Agent[] = [
  {
    id: 'workflow-optimizer',
    name: 'Optimizador de Workflows',
    description: 'Analiza y optimiza tus workflows para máxima eficiencia',
    icon: Zap,
    color: 'blue',
    category: 'productivity',
    isPopular: true,
    capabilities: ['Análisis de rendimiento', 'Sugerencias de mejora', 'Detección de cuellos de botella'],
    examples: ['Optimiza mi workflow de email marketing', '¿Cómo puedo mejorar la velocidad de procesamiento?'],
    rating: 4.8,
    usage: 1250
  },
  {
    id: 'data-analyst',
    name: 'Analista de Datos',
    description: 'Procesa y analiza datos complejos para generar insights',
    icon: BarChart3,
    color: 'green',
    category: 'analytics',
    isNew: true,
    capabilities: ['Análisis estadístico', 'Visualización de datos', 'Predicciones'],
    examples: ['Analiza las ventas del último trimestre', 'Crea un dashboard de métricas'],
    rating: 4.9,
    usage: 890
  },
  {
    id: 'marketing-expert',
    name: 'Experto en Marketing',
    description: 'Crea estrategias de marketing y campañas efectivas',
    icon: TrendingUp,
    color: 'purple',
    category: 'marketing',
    capabilities: ['Estrategias de marketing', 'Análisis de competencia', 'Optimización de conversión'],
    examples: ['Crea una campaña para Black Friday', 'Analiza mi competencia en redes sociales'],
    rating: 4.7,
    usage: 2100
  },
  {
    id: 'code-assistant',
    name: 'Asistente de Código',
    description: 'Ayuda con desarrollo, debugging y optimización de código',
    icon: Code,
    color: 'indigo',
    category: 'development',
    capabilities: ['Debugging', 'Refactoring', 'Documentación', 'Testing'],
    examples: ['Revisa mi código JavaScript', 'Crea tests unitarios para esta función'],
    rating: 4.6,
    usage: 1500
  },
  {
    id: 'content-creator',
    name: 'Creador de Contenido',
    description: 'Genera contenido creativo y atractivo para múltiples plataformas',
    icon: Palette,
    color: 'pink',
    category: 'creative',
    capabilities: ['Redacción', 'Diseño', 'SEO', 'Branding'],
    examples: ['Escribe un blog post sobre IA', 'Crea copy para redes sociales'],
    rating: 4.5,
    usage: 1800
  },
  {
    id: 'email-specialist',
    name: 'Especialista en Email',
    description: 'Optimiza campañas de email marketing y automatización',
    icon: Mail,
    color: 'orange',
    category: 'marketing',
    capabilities: ['Templates de email', 'Segmentación', 'A/B Testing', 'Deliverability'],
    examples: ['Crea una secuencia de onboarding', 'Optimiza mi tasa de apertura'],
    rating: 4.8,
    usage: 1650
  },
  {
    id: 'image-generator',
    name: 'Generador de Imágenes',
    description: 'Crea imágenes, gráficos y visuales personalizados',
    icon: Image,
    color: 'yellow',
    category: 'creative',
    capabilities: ['Generación de imágenes', 'Edición', 'Branding visual', 'Templates'],
    examples: ['Crea un banner para mi landing page', 'Diseña un logo para mi startup'],
    rating: 4.4,
    usage: 950
  },
  {
    id: 'document-writer',
    name: 'Escritor de Documentos',
    description: 'Crea documentación técnica, reportes y contenido profesional',
    icon: FileText,
    color: 'teal',
    category: 'productivity',
    capabilities: ['Documentación técnica', 'Reportes', 'Presentaciones', 'Manuales'],
    examples: ['Escribe la documentación de mi API', 'Crea un reporte ejecutivo'],
    rating: 4.7,
    usage: 1200
  },
  {
    id: 'security-advisor',
    name: 'Asesor de Seguridad',
    description: 'Evalúa y mejora la seguridad de tu plataforma',
    icon: Shield,
    color: 'red',
    category: 'development',
    capabilities: ['Auditoría de seguridad', 'Vulnerabilidades', 'Compliance', 'Mejores prácticas'],
    examples: ['Revisa la seguridad de mi aplicación', 'Implementa autenticación 2FA'],
    rating: 4.9,
    usage: 750
  },
  {
    id: 'team-coordinator',
    name: 'Coordinador de Equipo',
    description: 'Gestiona proyectos, tareas y colaboración del equipo',
    icon: Users,
    color: 'cyan',
    category: 'productivity',
    capabilities: ['Gestión de proyectos', 'Asignación de tareas', 'Seguimiento', 'Colaboración'],
    examples: ['Organiza el sprint de esta semana', 'Asigna tareas al equipo de desarrollo'],
    rating: 4.6,
    usage: 1100
  }
]

const getColorClasses = (color: string) => {
  const colors = {
    blue: 'bg-blue-500 text-white',
    green: 'bg-green-500 text-white',
    purple: 'bg-purple-500 text-white',
    indigo: 'bg-indigo-500 text-white',
    pink: 'bg-pink-500 text-white',
    orange: 'bg-orange-500 text-white',
    yellow: 'bg-yellow-500 text-white',
    teal: 'bg-teal-500 text-white',
    red: 'bg-red-500 text-white',
    cyan: 'bg-cyan-500 text-white'
  }
  return colors[color as keyof typeof colors] || colors.blue
}

const getCategoryColor = (category: Agent['category']) => {
  const colors = {
    productivity: 'bg-blue-100 text-blue-700',
    marketing: 'bg-purple-100 text-purple-700',
    development: 'bg-green-100 text-green-700',
    analytics: 'bg-orange-100 text-orange-700',
    creative: 'bg-pink-100 text-pink-700'
  }
  return colors[category]
}

interface AgentSelectorProps {
  onSelectAgent: (agent: Agent) => void
  selectedAgent?: Agent | null
}

export default function AgentSelector({ onSelectAgent, selectedAgent }: AgentSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<'all' | Agent['category']>('all')
  const [sortBy, setSortBy] = useState<'name' | 'rating' | 'usage'>('rating')

  const filteredAgents = agents
    .filter(agent => {
      const matchesSearch = agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           agent.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           agent.capabilities.some(cap => cap.toLowerCase().includes(searchTerm.toLowerCase()))
      const matchesCategory = selectedCategory === 'all' || agent.category === selectedCategory
      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name': return a.name.localeCompare(b.name)
        case 'rating': return b.rating - a.rating
        case 'usage': return b.usage - a.usage
        default: return 0
      }
    })

  const categories = [
    { id: 'all', label: 'Todos', count: agents.length },
    { id: 'productivity', label: 'Productividad', count: agents.filter(a => a.category === 'productivity').length },
    { id: 'marketing', label: 'Marketing', count: agents.filter(a => a.category === 'marketing').length },
    { id: 'development', label: 'Desarrollo', count: agents.filter(a => a.category === 'development').length },
    { id: 'analytics', label: 'Analytics', count: agents.filter(a => a.category === 'analytics').length },
    { id: 'creative', label: 'Creativo', count: agents.filter(a => a.category === 'creative').length }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Selecciona un Agente IA</h2>
        <p className="text-gray-600">Elige el agente especializado que mejor se adapte a tu tarea</p>
      </div>

      {/* Filtros y búsqueda */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Búsqueda */}
            <div className="relative">
              <MessageSquare className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar agentes por nombre, descripción o capacidades..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Filtros */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id as any)}
                  className="flex items-center"
                >
                  {category.label}
                  <Badge className="ml-2 bg-gray-100 text-gray-700">
                    {category.count}
                  </Badge>
                </Button>
              ))}
            </div>

            {/* Ordenamiento */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Ordenar por:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
              >
                <option value="rating">Calificación</option>
                <option value="usage">Uso</option>
                <option value="name">Nombre</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Grid de agentes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAgents.map((agent) => {
          const Icon = agent.icon
          const isSelected = selectedAgent?.id === agent.id
          
          return (
            <Card
              key={agent.id}
              className={`cursor-pointer transition-all hover:shadow-lg ${
                isSelected 
                  ? 'ring-2 ring-blue-500 bg-blue-50' 
                  : 'hover:shadow-md'
              }`}
              onClick={() => onSelectAgent(agent)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${getColorClasses(agent.color)}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{agent.name}</CardTitle>
                      <Badge className={`text-xs ${getCategoryColor(agent.category)}`}>
                        {agent.category}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-1">
                    {agent.isNew && (
                      <Badge className="bg-green-100 text-green-700 text-xs">Nuevo</Badge>
                    )}
                    {agent.isPopular && (
                      <Badge className="bg-blue-100 text-blue-700 text-xs">Popular</Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">{agent.description}</p>
                
                {/* Capacidades */}
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Capacidades:</h4>
                  <div className="flex flex-wrap gap-1">
                    {agent.capabilities.slice(0, 3).map((capability, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {capability}
                      </Badge>
                    ))}
                    {agent.capabilities.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{agent.capabilities.length - 3} más
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Ejemplos */}
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Ejemplos:</h4>
                  <div className="space-y-1">
                    {agent.examples.slice(0, 2).map((example, index) => (
                      <p key={index} className="text-xs text-gray-600 italic">
                        "{example}"
                      </p>
                    ))}
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm font-medium">{agent.rating}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{agent.usage.toLocaleString()}</span>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    className={isSelected ? 'bg-blue-600 hover:bg-blue-700' : ''}
                  >
                    {isSelected ? 'Seleccionado' : 'Seleccionar'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredAgents.length === 0 && (
        <Card className="bg-gray-50 border-dashed">
          <CardContent className="p-8 text-center">
            <Brain className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron agentes</h3>
            <p className="text-gray-600">Intenta ajustar los filtros de búsqueda</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
