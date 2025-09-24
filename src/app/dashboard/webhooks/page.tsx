'use client'

import { useState, useEffect, useContext } from 'react'
import { I18nContext } from '@/lib/i18n'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Webhook, 
  Plus, 
  Play,
  Pause,
  Settings,
  Trash2,
  Copy,
  CheckCircle,
  XCircle,
  Clock,
  Activity,
  Eye,
  ExternalLink,
  Zap,
  AlertTriangle,
  Search,
  Filter
} from 'lucide-react'
import { useWorkspace } from '@/hooks/use-workspace'

interface WebhookData {
  id: string
  name: string
  url: string
  events: string[]
  secret: string
  isActive: boolean
  userId: string
  workspaceId?: string
  createdAt: string
  lastTriggered?: string
  successCount: number
  failureCount: number
}

interface WebhookLog {
  id: string
  webhookId: string
  event: string
  status: string
  responseCode: number
  responseTime: number
  timestamp: string
  payload: any
  response: any
}

interface WebhookEvent {
  category: string
  events: Array<{
    id: string
    name: string
    description: string
  }>
}

export default function WebhooksPage() {
  const { t } = useContext(I18nContext)
  const { data: session, status } = useSession()
  const router = useRouter()
  const { currentWorkspace } = useWorkspace()
  const [webhooks, setWebhooks] = useState<WebhookData[]>([])
  const [selectedWebhook, setSelectedWebhook] = useState<WebhookData | null>(null)
  const [webhookLogs, setWebhookLogs] = useState<WebhookLog[]>([])
  const [availableEvents, setAvailableEvents] = useState<WebhookEvent[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showLogsModal, setShowLogsModal] = useState(false)
  const [createForm, setCreateForm] = useState({
    name: '',
    url: '',
    events: [] as string[]
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
    fetchWebhooks()
    fetchAvailableEvents()
  }, [currentWorkspace])

  const fetchWebhooks = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        type: 'webhooks',
        ...(currentWorkspace && { workspaceId: currentWorkspace.id })
      })

      const response = await fetch(`/api/webhooks?${params}`)
      const data = await response.json()

      if (response.ok) {
        setWebhooks(data)
      }
    } catch (error) {
      setError('Error al cargar webhooks')
    } finally {
      setLoading(false)
    }
  }

  const fetchAvailableEvents = async () => {
    try {
      const response = await fetch('/api/webhooks?type=events')
      const data = await response.json()
      if (response.ok) {
        setAvailableEvents(data)
      }
    } catch (error) {
      console.error('Error al cargar eventos:', error)
    }
  }

  const fetchWebhookLogs = async (webhookId: string) => {
    try {
      const response = await fetch(`/api/webhooks?type=logs&webhookId=${webhookId}`)
      const data = await response.json()
      if (response.ok) {
        setWebhookLogs(data)
      }
    } catch (error) {
      console.error('Error al cargar logs:', error)
    }
  }

  const handleCreateWebhook = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/webhooks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'create',
          ...createForm,
          workspaceId: currentWorkspace?.id
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Error al crear webhook')
      }

      setSuccess('Webhook creado exitosamente')
      setShowCreateModal(false)
      setCreateForm({ name: '', url: '', events: [] })
      fetchWebhooks()
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error inesperado')
    } finally {
      setLoading(false)
    }
  }

  const handleToggleWebhook = async (webhookId: string) => {
    setLoading(true)
    try {
      const response = await fetch('/api/webhooks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'toggle',
          webhookId
        }),
      })

      const data = await response.json()

      if (response.ok) {
        fetchWebhooks()
      } else {
        throw new Error(data.error || 'Error al actualizar webhook')
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error inesperado')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteWebhook = async (webhookId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este webhook?')) {
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/webhooks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'delete',
          webhookId
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess('Webhook eliminado exitosamente')
        fetchWebhooks()
      } else {
        throw new Error(data.error || 'Error al eliminar webhook')
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error inesperado')
    } finally {
      setLoading(false)
    }
  }

  const handleTestWebhook = async (webhookId: string) => {
    setLoading(true)
    try {
      const response = await fetch('/api/webhooks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'test',
          webhookId
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(data.success ? 'Prueba exitosa' : 'Prueba falló: ' + data.message)
      } else {
        throw new Error(data.error || 'Error al probar webhook')
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error inesperado')
    } finally {
      setLoading(false)
    }
  }

  const handleCopySecret = (secret: string) => {
    navigator.clipboard.writeText(secret)
    setSuccess('Secret copiado al portapapeles')
  }

  const getStatusIcon = (isActive: boolean) => {
    return isActive ? (
      <CheckCircle className="h-4 w-4 text-green-600" />
    ) : (
      <XCircle className="h-4 w-4 text-gray-400" />
    )
  }

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? (
      <Badge className="bg-green-100 text-green-800">Activo</Badge>
    ) : (
      <Badge variant="secondary">Inactivo</Badge>
    )
  }

  const getLogStatusIcon = (status: string) => {
    switch (status) {
      case 'SUCCESS':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'FAILED':
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('es-ES')
  }

  const getEventLabel = (eventId: string) => {
    for (const category of availableEvents) {
      const event = category.events.find(e => e.id === eventId)
      if (event) return event.name
    }
    return eventId.replace(/_/g, ' ').toLowerCase()
  }

  if (loading && !webhooks.length) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando webhooks...</p>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Webhook className="mr-3 h-8 w-8 text-blue-600" />
              {t('webhooks')}
            </h1>
            <p className="text-gray-600 mt-2">
              {currentWorkspace ? `Configura webhooks para automatizar ${currentWorkspace.name}` : 'Configura webhooks para automatizar tu negocio en tiempo real'}
            </p>
          </div>
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Webhook
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
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Webhooks List */}
      {webhooks.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Webhook className="h-16 w-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-700 mb-2">
              No hay webhooks configurados
            </h3>
            <p className="text-gray-500 mb-6">
              Crea tu primer webhook para recibir notificaciones en tiempo real
            </p>
            <Button onClick={() => setShowCreateModal(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Crear Primer Webhook
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {webhooks.map((webhook) => (
            <Card key={webhook.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(webhook.isActive)}
                    <div>
                      <CardTitle className="text-lg">{webhook.name}</CardTitle>
                      <CardDescription className="text-sm">
                        {webhook.events.length} eventos
                      </CardDescription>
                    </div>
                  </div>
                  {getStatusBadge(webhook.isActive)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">URL</label>
                    <p className="text-sm text-gray-900 truncate">{webhook.url}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-600">Eventos</label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {webhook.events.slice(0, 3).map((event) => (
                        <Badge key={event} variant="outline" className="text-xs">
                          {getEventLabel(event)}
                        </Badge>
                      ))}
                      {webhook.events.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{webhook.events.length - 3} más
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Éxitos:</span>
                      <span className="ml-1 font-medium text-green-600">{webhook.successCount}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Fallos:</span>
                      <span className="ml-1 font-medium text-red-600">{webhook.failureCount}</span>
                    </div>
                  </div>

                  {webhook.lastTriggered && (
                    <div className="text-sm text-gray-500">
                      Último envío: {formatDate(webhook.lastTriggered)}
                    </div>
                  )}

                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleTestWebhook(webhook.id)}
                      disabled={loading}
                    >
                      <Play className="h-4 w-4 mr-1" />
                      Probar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedWebhook(webhook)
                        fetchWebhookLogs(webhook.id)
                        setShowLogsModal(true)
                      }}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Logs
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleWebhook(webhook.id)}
                      disabled={loading}
                    >
                      {webhook.isActive ? (
                        <Pause className="h-4 w-4" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteWebhook(webhook.id)}
                      disabled={loading}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create Webhook Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle>Crear Nuevo Webhook</CardTitle>
              <CardDescription>
                Configura un webhook para recibir notificaciones en tiempo real
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateWebhook} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre</Label>
                  <Input
                    id="name"
                    value={createForm.name}
                    onChange={(e) => setCreateForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Mi Webhook"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="url">URL del Webhook</Label>
                  <Input
                    id="url"
                    type="url"
                    value={createForm.url}
                    onChange={(e) => setCreateForm(prev => ({ ...prev, url: e.target.value }))}
                    placeholder="https://api.ejemplo.com/webhook"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Eventos</Label>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {availableEvents.map((category) => (
                      <div key={category.category}>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">
                          {category.category.charAt(0).toUpperCase() + category.category.slice(1)}
                        </h4>
                        {category.events.map((event) => (
                          <label key={event.id} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={createForm.events.includes(event.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setCreateForm(prev => ({
                                    ...prev,
                                    events: [...prev.events, event.id]
                                  }))
                                } else {
                                  setCreateForm(prev => ({
                                    ...prev,
                                    events: prev.events.filter(ev => ev !== event.id)
                                  }))
                                }
                              }}
                              className="rounded"
                            />
                            <div className="text-sm">
                              <div className="font-medium">{event.name}</div>
                              <div className="text-gray-500">{event.description}</div>
                            </div>
                          </label>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button type="submit" disabled={loading || createForm.events.length === 0} className="flex-1">
                    {loading ? 'Creando...' : 'Crear Webhook'}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setShowCreateModal(false)}
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Logs Modal */}
      {showLogsModal && selectedWebhook && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-4xl mx-4 max-h-[80vh] overflow-hidden">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Logs de {selectedWebhook.name}</span>
                <Button variant="outline" onClick={() => setShowLogsModal(false)}>
                  Cerrar
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="overflow-y-auto max-h-96">
              {webhookLogs.length === 0 ? (
                <div className="text-center py-8">
                  <Activity className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500">No hay logs disponibles</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {webhookLogs.map((log) => (
                    <div key={log.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          {getLogStatusIcon(log.status)}
                          <span className="font-medium">{getEventLabel(log.event)}</span>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>HTTP {log.responseCode}</span>
                          <span>{log.responseTime}ms</span>
                          <span>{formatDate(log.timestamp)}</span>
                        </div>
                      </div>
                      <details className="text-sm">
                        <summary className="cursor-pointer text-gray-600">
                          Ver detalles
                        </summary>
                        <div className="mt-2 space-y-2">
                          <div>
                            <strong>Payload:</strong>
                            <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">
                              {JSON.stringify(log.payload, null, 2)}
                            </pre>
                          </div>
                          <div>
                            <strong>Respuesta:</strong>
                            <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">
                              {JSON.stringify(log.response, null, 2)}
                            </pre>
                          </div>
                        </div>
                      </details>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </DashboardLayout>
  )
}
