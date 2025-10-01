'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  Store, 
  Star, 
  Download, 
  Heart, 
  TrendingUp, 
  Users, 
  Zap, 
  Filter, 
  Search,
  Crown,
  Award,
  Clock,
  DollarSign,
  Eye,
  Share2
} from 'lucide-react'

interface WorkflowTemplate {
  id: string
  title: string
  description: string
  author: {
    name: string
    avatar: string
    verified: boolean
    level: string
  }
  category: 'marketing' | 'sales' | 'operations' | 'finance' | 'customer-care' | 'productivity'
  price: number
  rating: number
  downloads: number
  tags: string[]
  preview: string[]
  complexity: 'beginner' | 'intermediate' | 'advanced'
  estimatedTime: string
  integrations: string[]
  isPopular: boolean
  isFeatured: boolean
  createdAt: string
}

export default function WorkflowMarketplace() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('popular')

  const workflows: WorkflowTemplate[] = [
    {
      id: '1',
      title: 'Automatización Completa de E-commerce',
      description: 'Workflow que maneja todo el proceso de compra: desde el carrito abandonado hasta el seguimiento post-venta, incluyendo emails personalizados y sincronización con CRM.',
      author: {
        name: 'María García',
        avatar: 'https://ui-avatars.com/api/?name=Maria+Garcia&background=6366f1&color=fff',
        verified: true,
        level: 'Expert'
      },
      category: 'sales',
      price: 29,
      rating: 4.9,
      downloads: 2847,
      tags: ['ecommerce', 'email', 'crm', 'abandoned-cart'],
      preview: ['Trigger: Carrito abandonado', 'Action: Email personalizado', 'Trigger: Compra completada', 'Action: Actualizar CRM'],
      complexity: 'intermediate',
      estimatedTime: '15 min',
      integrations: ['Shopify', 'Mailchimp', 'HubSpot', 'Stripe'],
      isPopular: true,
      isFeatured: true,
      createdAt: '2024-01-15'
    },
    {
      id: '2',
      title: 'Asistente IA para Soporte al Cliente',
      description: 'Sistema inteligente que responde automáticamente el 80% de consultas comunes, escalando solo casos complejos a humanos.',
      author: {
        name: 'Carlos Tech',
        avatar: 'https://ui-avatars.com/api/?name=Carlos+Tech&background=10b981&color=fff',
        verified: true,
        level: 'Master'
      },
      category: 'customer-care',
      price: 49,
      rating: 4.8,
      downloads: 1923,
      tags: ['ai', 'support', 'automation', 'chatbot'],
      preview: ['Trigger: Nuevo ticket', 'Action: Analizar con IA', 'Condition: ¿Es complejo?', 'Action: Responder o escalar'],
      complexity: 'advanced',
      estimatedTime: '30 min',
      integrations: ['Zendesk', 'OpenAI', 'Slack', 'Intercom'],
      isPopular: true,
      isFeatured: false,
      createdAt: '2024-01-10'
    },
    {
      id: '3',
      title: 'Gestión Automática de Facturas',
      description: 'Extrae datos de facturas PDF, crea asientos contables automáticamente y envía recordatorios de pago.',
      author: {
        name: 'Ana Contable',
        avatar: 'https://ui-avatars.com/api/?name=Ana+Contable&background=f59e0b&color=fff',
        verified: true,
        level: 'Expert'
      },
      category: 'finance',
      price: 19,
      rating: 4.7,
      downloads: 3456,
      tags: ['invoices', 'accounting', 'pdf', 'automation'],
      preview: ['Trigger: Email con factura', 'Action: Extraer datos', 'Action: Crear asiento', 'Action: Recordatorio'],
      complexity: 'intermediate',
      estimatedTime: '10 min',
      integrations: ['QuickBooks', 'Xero', 'Gmail', 'Dropbox'],
      isPopular: true,
      isFeatured: true,
      createdAt: '2024-01-20'
    },
    {
      id: '4',
      title: 'Campañas de Marketing Automáticas',
      description: 'Sistema completo de email marketing que segmenta automáticamente y optimiza horarios de envío basado en engagement.',
      author: {
        name: 'Marketing Pro',
        avatar: 'https://ui-avatars.com/api/?name=Marketing+Pro&background=ec4899&color=fff',
        verified: true,
        level: 'Expert'
      },
      category: 'marketing',
      price: 39,
      rating: 4.6,
      downloads: 1567,
      tags: ['email', 'marketing', 'segmentation', 'optimization'],
      preview: ['Trigger: Nuevo usuario', 'Action: Segmentar', 'Action: Optimizar horario', 'Action: Enviar email'],
      complexity: 'intermediate',
      estimatedTime: '20 min',
      integrations: ['Mailchimp', 'Klaviyo', 'Google Analytics', 'Facebook'],
      isPopular: false,
      isFeatured: false,
      createdAt: '2024-01-18'
    },
    {
      id: '5',
      title: 'Onboarding de Empleados Automático',
      description: 'Workflow que automatiza todo el proceso de incorporación: desde la contratación hasta la configuración de herramientas.',
      author: {
        name: 'HR Solutions',
        avatar: 'https://ui-avatars.com/api/?name=HR+Solutions&background=8b5cf6&color=fff',
        verified: true,
        level: 'Master'
      },
      category: 'operations',
      price: 59,
      rating: 4.9,
      downloads: 892,
      tags: ['hr', 'onboarding', 'automation', 'productivity'],
      preview: ['Trigger: Contrato firmado', 'Action: Crear cuentas', 'Action: Enviar bienvenida', 'Action: Programar reuniones'],
      complexity: 'advanced',
      estimatedTime: '45 min',
      integrations: ['BambooHR', 'Slack', 'Google Workspace', 'Calendly'],
      isPopular: false,
      isFeatured: true,
      createdAt: '2024-01-12'
    }
  ]

  const categories = [
    { id: 'all', label: 'Todos', icon: Store },
    { id: 'marketing', label: 'Marketing', icon: TrendingUp },
    { id: 'sales', label: 'Ventas', icon: DollarSign },
    { id: 'operations', label: 'Operaciones', icon: Users },
    { id: 'finance', label: 'Finanzas', icon: Award },
    { id: 'customer-care', label: 'Soporte', icon: Heart },
    { id: 'productivity', label: 'Productividad', icon: Zap }
  ]

  const getCategoryColor = (category: string) => {
    const colors = {
      marketing: 'bg-purple-100 text-purple-800',
      sales: 'bg-blue-100 text-blue-800',
      operations: 'bg-green-100 text-green-800',
      finance: 'bg-yellow-100 text-yellow-800',
      'customer-care': 'bg-pink-100 text-pink-800',
      productivity: 'bg-indigo-100 text-indigo-800'
    }
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const getComplexityColor = (complexity: string) => {
    const colors = {
      beginner: 'bg-green-100 text-green-800',
      intermediate: 'bg-yellow-100 text-yellow-800',
      advanced: 'bg-red-100 text-red-800'
    }
    return colors[complexity as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const filteredWorkflows = workflows.filter(workflow => {
    const matchesSearch = workflow.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         workflow.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         workflow.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesCategory = selectedCategory === 'all' || workflow.category === selectedCategory
    
    return matchesSearch && matchesCategory
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center justify-center">
          <Store className="h-8 w-8 mr-3 text-blue-600" />
          Marketplace de Workflows
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Descubre, compra y comparte automatizaciones creadas por nuestra comunidad. 
          Desde workflows básicos hasta soluciones empresariales avanzadas.
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar workflows, tags, autores..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => {
                const Icon = category.icon
                return (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategory(category.id)}
                    className="flex items-center"
                  >
                    <Icon className="h-4 w-4 mr-1" />
                    {category.label}
                  </Button>
                )
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-blue-500/10 to-blue-600/10">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{workflows.length}</div>
            <div className="text-sm text-gray-600">Workflows Disponibles</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-green-500/10 to-green-600/10">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {workflows.reduce((sum, w) => sum + w.downloads, 0).toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Descargas Totales</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-purple-500/10 to-purple-600/10">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">
              {(workflows.reduce((sum, w) => sum + w.rating, 0) / workflows.length).toFixed(1)}
            </div>
            <div className="text-sm text-gray-600">Rating Promedio</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-orange-500/10 to-orange-600/10">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">24/7</div>
            <div className="text-sm text-gray-600">Soporte Comunidad</div>
          </CardContent>
        </Card>
      </div>

      {/* Workflows Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredWorkflows.map((workflow) => (
          <Card key={workflow.id} className="hover:shadow-lg transition-all duration-300 group">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    {workflow.isFeatured && (
                      <Badge className="bg-yellow-100 text-yellow-800">
                        <Crown className="h-3 w-3 mr-1" />
                        Destacado
                      </Badge>
                    )}
                    {workflow.isPopular && (
                      <Badge className="bg-red-100 text-red-800">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        Popular
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">
                    {workflow.title}
                  </CardTitle>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-600">${workflow.price}</div>
                  <div className="text-xs text-gray-500">una vez</div>
                </div>
              </div>
              
              <CardDescription className="text-sm leading-relaxed">
                {workflow.description}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Author */}
              <div className="flex items-center space-x-3">
                <img 
                  src={workflow.author.avatar} 
                  alt={workflow.author.name}
                  className="w-8 h-8 rounded-full"
                />
                <div className="flex-1">
                  <div className="flex items-center space-x-1">
                    <span className="font-medium text-sm">{workflow.author.name}</span>
                    {workflow.author.verified && (
                      <Badge variant="outline" className="text-xs">
                        <Award className="h-3 w-3 mr-1" />
                        {workflow.author.level}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center justify-between text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span>{workflow.rating}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Download className="h-4 w-4" />
                  <span>{workflow.downloads.toLocaleString()}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>{workflow.estimatedTime}</span>
                </div>
              </div>

              {/* Categories and Complexity */}
              <div className="flex flex-wrap gap-2">
                <Badge className={getCategoryColor(workflow.category)}>
                  {workflow.category}
                </Badge>
                <Badge className={getComplexityColor(workflow.complexity)}>
                  {workflow.complexity}
                </Badge>
              </div>

              {/* Preview */}
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-2">Preview del Workflow:</h4>
                <div className="space-y-1">
                  {workflow.preview.slice(0, 2).map((step, index) => (
                    <div key={index} className="text-xs text-gray-600 flex items-center">
                      <div className={`w-2 h-2 rounded-full mr-2 ${
                        index % 2 === 0 ? 'bg-blue-500' : 'bg-green-500'
                      }`} />
                      {step}
                    </div>
                  ))}
                  {workflow.preview.length > 2 && (
                    <div className="text-xs text-gray-500">
                      +{workflow.preview.length - 2} pasos más...
                    </div>
                  )}
                </div>
              </div>

              {/* Integrations */}
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-2">Integraciones:</h4>
                <div className="flex flex-wrap gap-1">
                  {workflow.integrations.slice(0, 3).map((integration, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {integration}
                    </Badge>
                  ))}
                  {workflow.integrations.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{workflow.integrations.length - 3}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-2 pt-2">
                <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
                  <Download className="h-4 w-4 mr-2" />
                  Comprar
                </Button>
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Heart className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Call to Action */}
      <Card className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/20">
        <CardContent className="p-6 text-center">
          <h3 className="text-xl font-bold text-gray-900 mb-2">¿Tienes un workflow genial?</h3>
          <p className="text-gray-600 mb-4">
            Comparte tus automatizaciones con la comunidad y gana dinero por cada descarga
          </p>
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
            <Zap className="h-4 w-4 mr-2" />
            Publicar mi Workflow
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
