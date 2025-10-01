'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  Search, 
  Filter, 
  Plus, 
  Settings, 
  CheckCircle, 
  AlertCircle, 
  ExternalLink,
  Zap,
  Database,
  Mail,
  MessageSquare,
  Calendar,
  FileText,
  CreditCard,
  Users,
  BarChart3,
  Cloud,
  Shield,
  Globe,
  Smartphone,
  Monitor,
  Server,
  Lock,
  Key,
  RefreshCw,
  Trash2,
  Edit,
  Eye,
  Play,
  Pause
} from 'lucide-react'

interface Integration {
  id: string
  name: string
  description: string
  category: string
  status: 'connected' | 'disconnected' | 'error'
  icon: any
  color: string
  features: string[]
  setupSteps: number
  isPopular: boolean
  isNew?: boolean
  lastSync?: Date
  usage?: {
    requests: number
    limit: number
  }
}

const integrations: Integration[] = [
  // Communication
  {
    id: 'slack',
    name: 'Slack',
    description: 'Envía mensajes y notificaciones a canales de Slack',
    category: 'Communication',
    status: 'connected',
    icon: MessageSquare,
    color: 'bg-purple-500',
    features: ['Mensajes', 'Canales', 'Webhooks', 'Bot Commands'],
    setupSteps: 3,
    isPopular: true,
    lastSync: new Date(),
    usage: { requests: 1250, limit: 5000 }
  },
  {
    id: 'discord',
    name: 'Discord',
    description: 'Integración con servidores de Discord',
    category: 'Communication',
    status: 'disconnected',
    icon: MessageSquare,
    color: 'bg-indigo-500',
    features: ['Mensajes', 'Servidores', 'Webhooks', 'Embeds'],
    setupSteps: 4,
    isPopular: true,
    isNew: true
  },
  {
    id: 'teams',
    name: 'Microsoft Teams',
    description: 'Notificaciones y mensajes en Teams',
    category: 'Communication',
    status: 'disconnected',
    icon: MessageSquare,
    color: 'bg-blue-500',
    features: ['Mensajes', 'Canal', 'Adaptive Cards', 'Bot Framework'],
    setupSteps: 5,
    isPopular: false
  },
  {
    id: 'telegram',
    name: 'Telegram',
    description: 'Bot de Telegram para notificaciones',
    category: 'Communication',
    status: 'disconnected',
    icon: MessageSquare,
    color: 'bg-cyan-500',
    features: ['Mensajes', 'Grupos', 'Inline Keyboards', 'File Sharing'],
    setupSteps: 2,
    isPopular: false
  },

  // Email
  {
    id: 'gmail',
    name: 'Gmail',
    description: 'Envía y recibe emails con Gmail API',
    category: 'Email',
    status: 'connected',
    icon: Mail,
    color: 'bg-red-500',
    features: ['Envío', 'Recepción', 'Etiquetas', 'Adjuntos'],
    setupSteps: 4,
    isPopular: true,
    lastSync: new Date(),
    usage: { requests: 890, limit: 1000 }
  },
  {
    id: 'outlook',
    name: 'Outlook',
    description: 'Integración con Microsoft Outlook',
    category: 'Email',
    status: 'disconnected',
    icon: Mail,
    color: 'bg-blue-600',
    features: ['Envío', 'Recepción', 'Calendario', 'Contactos'],
    setupSteps: 5,
    isPopular: false
  },
  {
    id: 'sendgrid',
    name: 'SendGrid',
    description: 'Servicio de email transaccional',
    category: 'Email',
    status: 'disconnected',
    icon: Mail,
    color: 'bg-green-500',
    features: ['Templates', 'Analytics', 'Suppression Lists', 'Webhooks'],
    setupSteps: 3,
    isPopular: true
  },

  // Productivity
  {
    id: 'notion',
    name: 'Notion',
    description: 'Crea y actualiza páginas en Notion',
    category: 'Productivity',
    status: 'connected',
    icon: FileText,
    color: 'bg-gray-800',
    features: ['Páginas', 'Bases de datos', 'Templates', 'Comentarios'],
    setupSteps: 3,
    isPopular: true,
    lastSync: new Date(),
    usage: { requests: 2100, limit: 10000 }
  },
  {
    id: 'airtable',
    name: 'Airtable',
    description: 'Gestiona bases de datos en Airtable',
    category: 'Productivity',
    status: 'disconnected',
    icon: Database,
    color: 'bg-orange-500',
    features: ['Records', 'Bases', 'Views', 'Automations'],
    setupSteps: 4,
    isPopular: true
  },
  {
    id: 'trello',
    name: 'Trello',
    description: 'Gestiona tableros y tarjetas de Trello',
    category: 'Productivity',
    status: 'disconnected',
    icon: BarChart3,
    color: 'bg-blue-500',
    features: ['Tarjetas', 'Tableros', 'Listas', 'Webhooks'],
    setupSteps: 3,
    isPopular: false
  },
  {
    id: 'asana',
    name: 'Asana',
    description: 'Gestión de proyectos y tareas',
    category: 'Productivity',
    status: 'disconnected',
    icon: BarChart3,
    color: 'bg-red-500',
    features: ['Tareas', 'Proyectos', 'Equipos', 'Timeline'],
    setupSteps: 4,
    isPopular: false
  },

  // Calendar
  {
    id: 'google-calendar',
    name: 'Google Calendar',
    description: 'Gestiona eventos en Google Calendar',
    category: 'Calendar',
    status: 'connected',
    icon: Calendar,
    color: 'bg-blue-500',
    features: ['Eventos', 'Calendarios', 'Recordatorios', 'Conferencias'],
    setupSteps: 3,
    isPopular: true,
    lastSync: new Date(),
    usage: { requests: 450, limit: 1000 }
  },
  {
    id: 'outlook-calendar',
    name: 'Outlook Calendar',
    description: 'Integración con calendario de Outlook',
    category: 'Calendar',
    status: 'disconnected',
    icon: Calendar,
    color: 'bg-blue-600',
    features: ['Eventos', 'Reuniones', 'Disponibilidad', 'Scheduling'],
    setupSteps: 4,
    isPopular: false
  },

  // Payment
  {
    id: 'stripe',
    name: 'Stripe',
    description: 'Procesamiento de pagos con Stripe',
    category: 'Payment',
    status: 'connected',
    icon: CreditCard,
    color: 'bg-indigo-500',
    features: ['Pagos', 'Suscripciones', 'Webhooks', 'Refunds'],
    setupSteps: 4,
    isPopular: true,
    lastSync: new Date(),
    usage: { requests: 3200, limit: 5000 }
  },
  {
    id: 'paypal',
    name: 'PayPal',
    description: 'Integración con PayPal para pagos',
    category: 'Payment',
    status: 'disconnected',
    icon: CreditCard,
    color: 'bg-blue-500',
    features: ['Pagos', 'Subscriptions', 'Webhooks', 'Invoicing'],
    setupSteps: 5,
    isPopular: true
  },

  // Analytics
  {
    id: 'google-analytics',
    name: 'Google Analytics',
    description: 'Datos de analytics de Google',
    category: 'Analytics',
    status: 'connected',
    icon: BarChart3,
    color: 'bg-orange-500',
    features: ['Métricas', 'Audiencias', 'Conversiones', 'E-commerce'],
    setupSteps: 4,
    isPopular: true,
    lastSync: new Date(),
    usage: { requests: 1800, limit: 10000 }
  },
  {
    id: 'mixpanel',
    name: 'Mixpanel',
    description: 'Analytics de eventos y usuarios',
    category: 'Analytics',
    status: 'disconnected',
    icon: BarChart3,
    color: 'bg-purple-500',
    features: ['Eventos', 'Funnels', 'Cohorts', 'A/B Testing'],
    setupSteps: 3,
    isPopular: false
  },

  // Cloud Storage
  {
    id: 'google-drive',
    name: 'Google Drive',
    description: 'Gestiona archivos en Google Drive',
    category: 'Storage',
    status: 'connected',
    icon: Cloud,
    color: 'bg-green-500',
    features: ['Archivos', 'Carpetas', 'Compartir', 'Colaboración'],
    setupSteps: 3,
    isPopular: true,
    lastSync: new Date(),
    usage: { requests: 650, limit: 1000 }
  },
  {
    id: 'dropbox',
    name: 'Dropbox',
    description: 'Integración con Dropbox',
    category: 'Storage',
    status: 'disconnected',
    icon: Cloud,
    color: 'bg-blue-500',
    features: ['Archivos', 'Sincronización', 'Compartir', 'Versionado'],
    setupSteps: 4,
    isPopular: false
  },
  {
    id: 'onedrive',
    name: 'OneDrive',
    description: 'Microsoft OneDrive integration',
    category: 'Storage',
    status: 'disconnected',
    icon: Cloud,
    color: 'bg-blue-600',
    features: ['Archivos', 'Sincronización', 'Compartir', 'Office Online'],
    setupSteps: 4,
    isPopular: false
  },

  // CRM
  {
    id: 'salesforce',
    name: 'Salesforce',
    description: 'CRM y gestión de ventas',
    category: 'CRM',
    status: 'disconnected',
    icon: Users,
    color: 'bg-blue-500',
    features: ['Leads', 'Oportunidades', 'Contactos', 'Reports'],
    setupSteps: 6,
    isPopular: true
  },
  {
    id: 'hubspot',
    name: 'HubSpot',
    description: 'Marketing y CRM automation',
    category: 'CRM',
    status: 'disconnected',
    icon: Users,
    color: 'bg-orange-500',
    features: ['Contacts', 'Deals', 'Marketing', 'Analytics'],
    setupSteps: 4,
    isPopular: true
  },
  {
    id: 'pipedrive',
    name: 'Pipedrive',
    description: 'CRM simple y efectivo',
    category: 'CRM',
    status: 'disconnected',
    icon: Users,
    color: 'bg-red-500',
    features: ['Deals', 'Activities', 'Reports', 'Automation'],
    setupSteps: 3,
    isPopular: false
  },

  // Development
  {
    id: 'github',
    name: 'GitHub',
    description: 'Integración con repositorios de GitHub',
    category: 'Development',
    status: 'connected',
    icon: Server,
    color: 'bg-gray-800',
    features: ['Repos', 'Issues', 'PRs', 'Webhooks'],
    setupSteps: 3,
    isPopular: true,
    lastSync: new Date(),
    usage: { requests: 3200, limit: 5000 }
  },
  {
    id: 'gitlab',
    name: 'GitLab',
    description: 'Integración con GitLab',
    category: 'Development',
    status: 'disconnected',
    icon: Server,
    color: 'bg-orange-500',
    features: ['Repos', 'Issues', 'CI/CD', 'Webhooks'],
    setupSteps: 4,
    isPopular: false
  },
  {
    id: 'jira',
    name: 'Jira',
    description: 'Gestión de proyectos y tickets',
    category: 'Development',
    status: 'disconnected',
    icon: BarChart3,
    color: 'bg-blue-500',
    features: ['Issues', 'Projects', 'Workflows', 'Reports'],
    setupSteps: 5,
    isPopular: true
  }
]

const categories = [
  'All',
  'Communication',
  'Email',
  'Productivity',
  'Calendar',
  'Payment',
  'Analytics',
  'Storage',
  'CRM',
  'Development'
]

export function IntegrationsManager() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [showConnectedOnly, setShowConnectedOnly] = useState(false)

  const filteredIntegrations = integrations.filter(integration => {
    const matchesSearch = integration.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         integration.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || integration.category === selectedCategory
    const matchesStatus = !showConnectedOnly || integration.status === 'connected'
    
    return matchesSearch && matchesCategory && matchesStatus
  })

  const connectedCount = integrations.filter(i => i.status === 'connected').length
  const totalRequests = integrations
    .filter(i => i.usage)
    .reduce((sum, i) => sum + (i.usage?.requests || 0), 0)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">Integraciones</h1>
        <p className="text-xl text-gray-300 mb-8">
          Conecta Stack21 con más de {integrations.length} servicios populares
        </p>
        
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-white mb-2">{connectedCount}</div>
              <div className="text-gray-300">Conectadas</div>
            </CardContent>
          </Card>
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-white mb-2">{integrations.length}</div>
              <div className="text-gray-300">Disponibles</div>
            </CardContent>
          </Card>
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-white mb-2">{totalRequests.toLocaleString()}</div>
              <div className="text-gray-300">Requests este mes</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Filters */}
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar integraciones..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/20 border-white/30 text-white placeholder-gray-300"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white"
              >
                {categories.map(category => (
                  <option key={category} value={category} className="bg-gray-800">
                    {category}
                  </option>
                ))}
              </select>
              <Button
                variant={showConnectedOnly ? "default" : "outline"}
                onClick={() => setShowConnectedOnly(!showConnectedOnly)}
                className="flex items-center"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Solo Conectadas
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Integrations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredIntegrations.map((integration) => (
          <Card key={integration.id} className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all duration-200">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${integration.color}`}>
                    <integration.icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-white flex items-center gap-2">
                      {integration.name}
                      {integration.isPopular && (
                        <Badge variant="secondary" className="text-xs">Popular</Badge>
                      )}
                      {integration.isNew && (
                        <Badge variant="outline" className="text-xs border-green-500 text-green-500">Nuevo</Badge>
                      )}
                    </CardTitle>
                    <CardDescription className="text-gray-300">
                      {integration.category}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {integration.status === 'connected' && (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  )}
                  {integration.status === 'disconnected' && (
                    <AlertCircle className="h-5 w-5 text-gray-400" />
                  )}
                  {integration.status === 'error' && (
                    <AlertCircle className="h-5 w-5 text-red-500" />
                  )}
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <p className="text-gray-300 text-sm">{integration.description}</p>
              
              <div className="space-y-2">
                <h4 className="text-white font-medium text-sm">Características:</h4>
                <div className="flex flex-wrap gap-1">
                  {integration.features.slice(0, 3).map((feature, index) => (
                    <Badge key={index} variant="outline" className="text-xs border-white/30 text-gray-300">
                      {feature}
                    </Badge>
                  ))}
                  {integration.features.length > 3 && (
                    <Badge variant="outline" className="text-xs border-white/30 text-gray-300">
                      +{integration.features.length - 3} más
                    </Badge>
                  )}
                </div>
              </div>

              {integration.usage && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300">Uso este mes:</span>
                    <span className="text-white">
                      {integration.usage.requests.toLocaleString()} / {integration.usage.limit.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ 
                        width: `${Math.min((integration.usage.requests / integration.usage.limit) * 100, 100)}%` 
                      }}
                    />
                  </div>
                </div>
              )}

              {integration.lastSync && (
                <div className="text-xs text-gray-400">
                  Última sincronización: {integration.lastSync.toLocaleDateString()}
                </div>
              )}

              <div className="flex space-x-2">
                {integration.status === 'connected' ? (
                  <>
                    <Button size="sm" variant="outline" className="flex-1">
                      <Settings className="h-4 w-4 mr-2" />
                      Configurar
                    </Button>
                    <Button size="sm" variant="outline">
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </>
                ) : (
                  <Button size="sm" className="flex-1">
                    <Plus className="h-4 w-4 mr-2" />
                    Conectar
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredIntegrations.length === 0 && (
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardContent className="p-12 text-center">
            <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No se encontraron integraciones</h3>
            <p className="text-gray-300">Intenta ajustar los filtros de búsqueda</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}