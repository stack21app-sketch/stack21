'use client'

import { useState, useEffect, useContext } from 'react'
import { I18nContext } from '@/lib/i18n'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Plug, 
  Plus, 
  Settings,
  Trash2,
  Play,
  CheckCircle,
  AlertCircle,
  Clock,
  ExternalLink,
  Zap,
  MessageSquare,
  Code,
  Mail,
  Link,
  Activity
} from 'lucide-react'
import { useWorkspace } from '@/hooks/use-workspace'

interface Integration {
  id: string
  name: string
  description: string
  icon: string
  category: string
  status: string
  features: string[]
  setupRequired: boolean
  webhookUrl: boolean
}

interface ConnectedIntegration {
  id: string
  integrationId: string
  workspaceId: string
  name: string
  status: string
  config: any
  createdAt: string
  lastUsed?: string
}

interface IntegrationLog {
  id: string
  integrationId: string
  event: string
  status: string
  message: string
  timestamp: string
  data?: any
}

export default function IntegrationsPage() {
  const { t } = useContext(I18nContext)
  const { data: session, status } = useSession()
  const router = useRouter()
  const { currentWorkspace } = useWorkspace()
  const [availableIntegrations, setAvailableIntegrations] = useState<Integration[]>([])
  const [connectedIntegrations, setConnectedIntegrations] = useState<ConnectedIntegration[]>([])
  const [logs, setLogs] = useState<IntegrationLog[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showConnectModal, setShowConnectModal] = useState(false)
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null)
  const [connectForm, setConnectForm] = useState({
    name: '',
    webhookUrl: '',
    apiKey: '',
    channel: '',
    headers: ''
  })

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
    if (currentWorkspace) {
      fetchIntegrations()
      fetchLogs()
    }
  }, [currentWorkspace])

  const fetchIntegrations = async () => {
    if (!currentWorkspace) return

    setLoading(true)
    try {
      const [availableRes, connectedRes] = await Promise.all([
        fetch('/api/integrations?type=available'),
        fetch(`/api/integrations?type=connected&workspaceId=${currentWorkspace.id}`)
      ])

      const [availableData, connectedData] = await Promise.all([
        availableRes.json(),
        connectedRes.json()
      ])

      if (availableRes.ok) setAvailableIntegrations(availableData)
      if (connectedRes.ok) setConnectedIntegrations(connectedData)
    } catch (error) {
      setError('Error al cargar integraciones')
    } finally {
      setLoading(false)
    }
  }

  const fetchLogs = async () => {
    if (!currentWorkspace) return

    try {
      const response = await fetch(`/api/integrations?type=logs&workspaceId=${currentWorkspace.id}`)
      const data = await response.json()
      if (response.ok) {
        setLogs(data)
      }
    } catch (error) {
      console.error('Error al cargar logs:', error)
    }
  }

  const handleConnect = (integration: Integration) => {
    setSelectedIntegration(integration)
    setConnectForm({
      name: integration.name,
      webhookUrl: '',
      apiKey: '',
      channel: '',
      headers: ''
    })
    setShowConnectModal(true)
  }

  const handleSubmitConnect = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedIntegration || !currentWorkspace) return

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/integrations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'connect',
          integrationId: selectedIntegration.id,
          workspaceId: currentWorkspace.id,
          name: connectForm.name,
          config: {
            webhookUrl: connectForm.webhookUrl,
            apiKey: connectForm.apiKey,
            channel: connectForm.channel,
            headers: connectForm.headers ? JSON.parse(connectForm.headers) : {}
          }
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Error al conectar integración')
      }

      setSuccess('Integración conectada exitosamente')
      setShowConnectModal(false)
      fetchIntegrations()
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error inesperado')
    } finally {
      setLoading(false)
    }
  }

  const handleDisconnect = async (integrationId: string) => {
    if (!confirm('¿Estás seguro de que quieres desconectar esta integración?')) {
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/integrations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'disconnect',
          integrationId,
          workspaceId: currentWorkspace?.id
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess('Integración desconectada exitosamente')
        fetchIntegrations()
      } else {
        throw new Error(data.error || 'Error al desconectar integración')
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error inesperado')
    } finally {
      setLoading(false)
    }
  }

  const handleTest = async (integrationId: string) => {
    setLoading(true)
    try {
      const response = await fetch('/api/integrations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'test',
          integrationId,
          workspaceId: currentWorkspace?.id
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(data.success ? 'Prueba exitosa' : 'Prueba falló: ' + data.message)
      } else {
        throw new Error(data.error || 'Error al probar integración')
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error inesperado')
    } finally {
      setLoading(false)
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'communication':
        return <MessageSquare className="h-5 w-5" />
      case 'development':
        return <Code className="h-5 w-5" />
      case 'automation':
        return <Zap className="h-5 w-5" />
      default:
        return <Plug className="h-5 w-5" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return <Badge className="bg-green-100 text-green-800">Activo</Badge>
      case 'INACTIVE':
        return <Badge variant="secondary">Inactivo</Badge>
      case 'ERROR':
        return <Badge variant="destructive">Error</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getLogStatusIcon = (status: string) => {
    switch (status) {
      case 'SUCCESS':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'ERROR':
        return <AlertCircle className="h-4 w-4 text-red-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('es-ES')
  }

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{t('integrations')}</h1>
            <p className="text-gray-600 mt-2">
              {currentWorkspace ? `Conecta ${currentWorkspace.name} con herramientas externas para automatizar tu negocio` : 'Conecta tu workspace con herramientas externas para automatizar tu negocio'}
            </p>
          </div>
          <Button onClick={() => setShowConnectModal(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Nueva Integración
          </Button>
        </div>
      </div>

      {/* Success/Error Alerts */}
      {success && (
        <Alert className="mb-6 border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            {success}
          </AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Connected Integrations */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Integraciones Conectadas
        </h2>
        {connectedIntegrations.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Plug className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-700 mb-2">
                No hay integraciones conectadas
              </h3>
              <p className="text-gray-500 mb-6">
                Conecta tu primera integración para automatizar tu workflow
              </p>
              <Button onClick={() => setShowConnectModal(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Conectar Integración
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {connectedIntegrations.map((integration) => {
              const integrationInfo = availableIntegrations.find(i => i.id === integration.integrationId)
              return (
                <Card key={integration.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{integrationInfo?.icon}</span>
                        <div>
                          <CardTitle className="text-lg">{integration.name}</CardTitle>
                          <CardDescription>{integrationInfo?.description}</CardDescription>
                        </div>
                      </div>
                      {getStatusBadge(integration.status)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 mb-4">
                      <div className="text-sm text-gray-500">
                        Conectado: {formatDate(integration.createdAt)}
                      </div>
                      {integration.lastUsed && (
                        <div className="text-sm text-gray-500">
                          Último uso: {formatDate(integration.lastUsed)}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleTest(integration.id)}
                        disabled={loading}
                      >
                        <Play className="h-4 w-4 mr-1" />
                        Probar
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                      >
                        <Settings className="h-4 w-4 mr-1" />
                        Config
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDisconnect(integration.id)}
                        disabled={loading}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>

      {/* Available Integrations */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Integraciones Disponibles
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {availableIntegrations.map((integration) => (
            <Card key={integration.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <span className="text-3xl">{integration.icon}</span>
                  <div>
                    <CardTitle className="text-lg">{integration.name}</CardTitle>
                    <CardDescription>{integration.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    {getCategoryIcon(integration.category)}
                    <span className="text-sm text-gray-600 capitalize">
                      {integration.category}
                    </span>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Características:</p>
                    <ul className="text-xs text-gray-600 space-y-1">
                      {integration.features.slice(0, 3).map((feature, index) => (
                        <li key={index} className="flex items-center">
                          <CheckCircle className="h-3 w-3 text-green-600 mr-1" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <Button 
                    className="w-full"
                    onClick={() => handleConnect(integration)}
                    disabled={loading}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Conectar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Activity Logs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Activity className="mr-2 h-5 w-5" />
            Registro de Actividad
          </CardTitle>
          <CardDescription>
            Historial de eventos de integraciones
          </CardDescription>
        </CardHeader>
        <CardContent>
          {logs.length === 0 ? (
            <div className="text-center py-8">
              <Activity className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">No hay actividad reciente</p>
            </div>
          ) : (
            <div className="space-y-4">
              {logs.map((log) => (
                <div key={log.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                  <div className="flex-shrink-0 mt-1">
                    {getLogStatusIcon(log.status)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900">
                        {log.message}
                      </p>
                      <span className="text-xs text-gray-500">
                        {formatDate(log.timestamp)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Evento: {log.event}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Connect Modal */}
      {showConnectModal && selectedIntegration && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle>Conectar {selectedIntegration.name}</CardTitle>
              <CardDescription>
                {selectedIntegration.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitConnect} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre de la integración</Label>
                  <Input
                    id="name"
                    value={connectForm.name}
                    onChange={(e) => setConnectForm(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>

                {selectedIntegration.webhookUrl && (
                  <div className="space-y-2">
                    <Label htmlFor="webhookUrl">URL del Webhook</Label>
                    <Input
                      id="webhookUrl"
                      type="url"
                      value={connectForm.webhookUrl}
                      onChange={(e) => setConnectForm(prev => ({ ...prev, webhookUrl: e.target.value }))}
                      placeholder="https://hooks.slack.com/services/..."
                    />
                  </div>
                )}

                {selectedIntegration.id === 'slack' && (
                  <div className="space-y-2">
                    <Label htmlFor="channel">Canal de Slack</Label>
                    <Input
                      id="channel"
                      value={connectForm.channel}
                      onChange={(e) => setConnectForm(prev => ({ ...prev, channel: e.target.value }))}
                      placeholder="#general"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="headers">Headers personalizados (JSON)</Label>
                  <Textarea
                    id="headers"
                    value={connectForm.headers}
                    onChange={(e) => setConnectForm(prev => ({ ...prev, headers: e.target.value }))}
                    placeholder='{"Authorization": "Bearer token"}'
                    rows={3}
                  />
                </div>

                <div className="flex space-x-2">
                  <Button type="submit" disabled={loading} className="flex-1">
                    {loading ? 'Conectando...' : 'Conectar'}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setShowConnectModal(false)}
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </DashboardLayout>
  )
}
