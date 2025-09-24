'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { 
  Settings, 
  Play, 
  CheckCircle, 
  XCircle, 
  Loader2, 
  ExternalLink,
  Zap,
  Mail,
  Users,
  CreditCard,
  BarChart3,
  MessageSquare
} from 'lucide-react'
import { 
  AVAILABLE_INTEGRATIONS, 
  getIntegrationsByCategory, 
  configureIntegration, 
  testIntegration,
  type Integration 
} from '@/lib/integrations'

const categoryIcons = {
  email: Mail,
  crm: Users,
  social: MessageSquare,
  payment: CreditCard,
  analytics: BarChart3,
  productivity: Zap
}

const categoryLabels = {
  email: 'Email Marketing',
  crm: 'CRM',
  social: 'Redes Sociales',
  payment: 'Pagos',
  analytics: 'Analytics',
  productivity: 'Productividad'
}

export function IntegrationsManager() {
  const [integrations, setIntegrations] = useState<Integration[]>(AVAILABLE_INTEGRATIONS)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null)
  const [isConfiguring, setIsConfiguring] = useState(false)
  const [isTesting, setIsTesting] = useState(false)
  const [config, setConfig] = useState({
    apiKey: '',
    secret: '',
    webhookUrl: ''
  })

  const filteredIntegrations = selectedCategory === 'all' 
    ? integrations 
    : getIntegrationsByCategory(selectedCategory)

  const handleConfigure = async (integration: Integration) => {
    setSelectedIntegration(integration)
    setConfig({
      apiKey: integration.credentials?.apiKey || '',
      secret: integration.credentials?.secret || '',
      webhookUrl: integration.webhookUrl || ''
    })
  }

  const handleSaveConfiguration = async () => {
    if (!selectedIntegration) return

    setIsConfiguring(true)
    try {
      const result = await configureIntegration(selectedIntegration.id, config)
      
      if (result.success) {
        // Actualizar el estado de la integración
        setIntegrations(prev => prev.map(integration => 
          integration.id === selectedIntegration.id 
            ? { 
                ...integration, 
                status: 'active',
                credentials: {
                  apiKey: config.apiKey,
                  secret: config.secret
                },
                webhookUrl: config.webhookUrl
              }
            : integration
        ))
        
        setSelectedIntegration(null)
        setConfig({ apiKey: '', secret: '', webhookUrl: '' })
      }
    } catch (error) {
      console.error('Error configuring integration:', error)
    } finally {
      setIsConfiguring(false)
    }
  }

  const handleTestConnection = async (integration: Integration) => {
    setIsTesting(true)
    try {
      const result = await testIntegration(integration.id)
      // Aquí podrías mostrar un toast con el resultado
      console.log(result)
    } catch (error) {
      console.error('Error testing connection:', error)
    } finally {
      setIsTesting(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500"><CheckCircle className="w-3 h-3 mr-1" />Activo</Badge>
      case 'inactive':
        return <Badge variant="outline">Inactivo</Badge>
      case 'pending':
        return <Badge className="bg-yellow-500">Pendiente</Badge>
      default:
        return <Badge variant="outline">Desconocido</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">Integraciones</h2>
          <p className="text-gray-400">Conecta Stack21 con tus herramientas favoritas</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-white">
            {integrations.filter(i => i.status === 'active').length}
          </div>
          <div className="text-sm text-gray-400">Integraciones activas</div>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={selectedCategory === 'all' ? 'default' : 'outline'}
          onClick={() => setSelectedCategory('all')}
          className="text-white"
        >
          Todas ({integrations.length})
        </Button>
        {Object.entries(categoryLabels).map(([key, label]) => {
          const count = getIntegrationsByCategory(key).length
          const Icon = categoryIcons[key as keyof typeof categoryIcons]
          return (
            <Button
              key={key}
              variant={selectedCategory === key ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(key)}
              className="text-white"
            >
              <Icon className="w-4 h-4 mr-2" />
              {label} ({count})
            </Button>
          )
        })}
      </div>

      {/* Grid de integraciones */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredIntegrations.map((integration) => {
          const CategoryIcon = categoryIcons[integration.category]
          return (
            <Card key={integration.id} className="bg-white/5 backdrop-blur-xl border-white/10 hover:bg-white/10 transition-all duration-300">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{integration.icon}</div>
                    <div>
                      <CardTitle className="text-white text-lg">{integration.name}</CardTitle>
                      <div className="flex items-center space-x-2 mt-1">
                        <CategoryIcon className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-400">{categoryLabels[integration.category]}</span>
                      </div>
                    </div>
                  </div>
                  {getStatusBadge(integration.status)}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 text-sm mb-4">{integration.description}</p>
                <div className="flex space-x-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleConfigure(integration)}
                        className="text-white border-white/20 hover:bg-white/10"
                      >
                        <Settings className="w-4 h-4 mr-2" />
                        Configurar
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-gray-900 border-gray-700">
                      <DialogHeader>
                        <DialogTitle className="text-white">Configurar {integration.name}</DialogTitle>
                        <DialogDescription className="text-gray-400">
                          Ingresa las credenciales para conectar {integration.name}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="apiKey" className="text-white">API Key</Label>
                          <Input
                            id="apiKey"
                            type="password"
                            value={config.apiKey}
                            onChange={(e) => setConfig(prev => ({ ...prev, apiKey: e.target.value }))}
                            className="bg-gray-800 border-gray-600 text-white"
                            placeholder="Ingresa tu API Key"
                          />
                        </div>
                        {integration.id !== 'stripe' && (
                          <div>
                            <Label htmlFor="secret" className="text-white">Secret</Label>
                            <Input
                              id="secret"
                              type="password"
                              value={config.secret}
                              onChange={(e) => setConfig(prev => ({ ...prev, secret: e.target.value }))}
                              className="bg-gray-800 border-gray-600 text-white"
                              placeholder="Ingresa tu Secret"
                            />
                          </div>
                        )}
                        <div>
                          <Label htmlFor="webhookUrl" className="text-white">Webhook URL (Opcional)</Label>
                          <Input
                            id="webhookUrl"
                            value={config.webhookUrl}
                            onChange={(e) => setConfig(prev => ({ ...prev, webhookUrl: e.target.value }))}
                            className="bg-gray-800 border-gray-600 text-white"
                            placeholder="https://tu-dominio.com/webhook"
                          />
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            onClick={handleSaveConfiguration}
                            disabled={isConfiguring || !config.apiKey}
                            className="bg-blue-500 hover:bg-blue-600 text-white"
                          >
                            {isConfiguring ? (
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            ) : (
                              <CheckCircle className="w-4 h-4 mr-2" />
                            )}
                            {isConfiguring ? 'Configurando...' : 'Guardar'}
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => setSelectedIntegration(null)}
                            className="text-white border-gray-600"
                          >
                            Cancelar
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                  
                  {integration.status === 'active' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleTestConnection(integration)}
                      disabled={isTesting}
                      className="text-white border-white/20 hover:bg-white/10"
                    >
                      {isTesting ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Play className="w-4 h-4 mr-2" />
                      )}
                      Probar
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Estadísticas */}
      <Card className="bg-white/5 backdrop-blur-xl border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Resumen de Integraciones</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">
                {integrations.filter(i => i.status === 'active').length}
              </div>
              <div className="text-sm text-gray-400">Activas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">
                {integrations.filter(i => i.status === 'pending').length}
              </div>
              <div className="text-sm text-gray-400">Pendientes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-400">
                {integrations.filter(i => i.status === 'inactive').length}
              </div>
              <div className="text-sm text-gray-400">Inactivas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">
                {Object.keys(categoryLabels).length}
              </div>
              <div className="text-sm text-gray-400">Categorías</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
