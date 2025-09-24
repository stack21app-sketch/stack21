'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { 
  Webhook, 
  Plus, 
  MoreVertical, 
  Play, 
  Pause, 
  Trash2, 
  Edit, 
  Eye,
  Copy,
  Check,
  AlertCircle,
  CheckCircle,
  Clock,
  ExternalLink,
  RefreshCw,
  Settings,
  Activity,
  Zap
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  getWebhooks,
  // getWebhook,
  createWebhook,
  updateWebhook,
  deleteWebhook,
  // getWebhookDeliveries,
  testWebhook,
  // getEventDisplayName,
  // getStatusColor,
  // getStatusDisplayName,
  // WEBHOOK_EVENTS,
  // type Webhook as WebhookType,
  // type WebhookDelivery
} from '@/lib/webhooks'
import { useToast } from '@/hooks/use-toast'

// Define types and constants locally since they're not exported from the lib
interface WebhookType {
  id: string
  name: string
  secret: string
  events: string[]
  createdAt: Date
  url: string
  isActive: boolean
  retryCount: number
  timeout: number
  successCount: number
  failureCount: number
  updatedAt?: Date
  lastDelivery?: Date
}

interface WebhookDelivery {
  id: string
  webhookId: string
  event: string
  status: 'pending' | 'success' | 'failed'
  responseCode?: number
  responseBody?: string
  createdAt: string
}

const WEBHOOK_EVENTS = [
  { value: 'user.created', label: 'Usuario Creado' },
  { value: 'user.updated', label: 'Usuario Actualizado' },
  { value: 'workspace.created', label: 'Workspace Creado' },
  { value: 'workspace.updated', label: 'Workspace Actualizado' },
  { value: 'workflow.executed', label: 'Workflow Ejecutado' },
  { value: 'workflow.failed', label: 'Workflow Falló' },
  { value: 'billing.subscription.created', label: 'Suscripción Creada' },
  { value: 'billing.subscription.updated', label: 'Suscripción Actualizada' },
  { value: 'billing.payment.succeeded', label: 'Pago Exitoso' },
  { value: 'billing.payment.failed', label: 'Pago Falló' }
]

interface WebhookManagementProps {
  workspaceId: string
}

export function WebhookManagement({ workspaceId }: WebhookManagementProps) {
  const [webhooks, setWebhooks] = useState<WebhookType[]>([])
  const [deliveries, setDeliveries] = useState<WebhookDelivery[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedWebhook, setSelectedWebhook] = useState<WebhookType | null>(null)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showDeliveriesDialog, setShowDeliveriesDialog] = useState(false)
  const [testing, setTesting] = useState<string | null>(null)
  const { toast } = useToast()

  // Form data
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    url: '',
    events: [] as string[],
    headers: {} as Record<string, string>,
    retryPolicy: {
      maxRetries: 3,
      retryDelay: 1000,
      backoffMultiplier: 2,
      maxDelay: 30000
    },
    secret: '',
    isActive: true,
    retryCount: 0,
    timeout: 30000
  })

  useEffect(() => {
    loadWebhooks()
  }, [workspaceId])

  const loadWebhooks = async () => {
    setLoading(true)
    try {
      const webhooksData = await getWebhooks()
      setWebhooks(webhooksData)
    } catch (error) {
      console.error('Error loading webhooks:', error)
      toast({
        title: 'Error',
        description: 'No se pudieron cargar los webhooks.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const loadDeliveries = async (webhookId: string) => {
    try {
      // const deliveriesData = await getWebhookDeliveries(webhookId, 20)
      // setDeliveries(deliveriesData)
      // Mock data for now
      setDeliveries([])
    } catch (error) {
      console.error('Error loading deliveries:', error)
    }
  }

  const handleCreateWebhook = async () => {
    if (!formData.name || !formData.url || formData.events.length === 0) {
      toast({
        title: 'Error',
        description: 'Por favor completa todos los campos requeridos.',
        variant: 'destructive',
      })
      return
    }

    try {
      const webhook = await createWebhook(formData)
      setWebhooks(prev => [webhook, ...prev])
      setShowCreateDialog(false)
      resetForm()
      toast({
        title: 'Webhook creado',
        description: 'El webhook se ha creado exitosamente.',
      })
    } catch (error) {
      console.error('Error creating webhook:', error)
      toast({
        title: 'Error',
        description: 'No se pudo crear el webhook.',
        variant: 'destructive',
      })
    }
  }

  const handleUpdateWebhook = async (webhookId: string, data: Partial<WebhookType>) => {
    try {
      const updatedWebhook = await updateWebhook(webhookId, data)
      if (updatedWebhook) {
        setWebhooks(prev => prev.map(wh => wh.id === webhookId ? updatedWebhook : wh))
        toast({
          title: 'Webhook actualizado',
          description: 'El webhook se ha actualizado exitosamente.',
        })
      }
    } catch (error) {
      console.error('Error updating webhook:', error)
      toast({
        title: 'Error',
        description: 'No se pudo actualizar el webhook.',
        variant: 'destructive',
      })
    }
  }

  const handleDeleteWebhook = async (webhookId: string, webhookName: string) => {
    if (!confirm(`¿Estás seguro de que quieres eliminar el webhook "${webhookName}"?`)) {
      return
    }

    try {
      const success = await deleteWebhook(webhookId)
      if (success) {
        setWebhooks(prev => prev.filter(wh => wh.id !== webhookId))
        toast({
          title: 'Webhook eliminado',
          description: 'El webhook se ha eliminado exitosamente.',
        })
      }
    } catch (error) {
      console.error('Error deleting webhook:', error)
      toast({
        title: 'Error',
        description: 'No se pudo eliminar el webhook.',
        variant: 'destructive',
      })
    }
  }

  const handleTestWebhook = async (webhookId: string) => {
    setTesting(webhookId)
    try {
      const result = await testWebhook(webhookId)
      if (result.status === 'success') {
        toast({
          title: 'Prueba exitosa',
          description: 'Webhook probado correctamente',
        })
        loadWebhooks() // Refresh stats
      } else {
        toast({
          title: 'Prueba falló',
          description: result.error || 'Error desconocido',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Error testing webhook:', error)
      toast({
        title: 'Error',
        description: 'Error al probar el webhook.',
        variant: 'destructive',
      })
    } finally {
      setTesting(null)
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      url: '',
      events: [],
      headers: {},
      retryPolicy: {
        maxRetries: 3,
        retryDelay: 1000,
        backoffMultiplier: 2,
        maxDelay: 30000
      },
      secret: '',
      isActive: true,
      retryCount: 0,
      timeout: 30000
    })
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast({
        title: 'Copiado',
        description: 'Texto copiado al portapapeles',
      })
    } catch (error) {
      console.error('Error copying to clipboard:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-lg text-muted-foreground">Cargando webhooks...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Webhook className="h-8 w-8 mr-3 text-blue-600" />
            Gestión de Webhooks
          </h1>
          <p className="text-gray-600 mt-2">
            Configura webhooks para recibir eventos en tiempo real
          </p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button className="flex items-center">
              <Plus className="h-4 w-4 mr-2" />
              Crear Webhook
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Crear nuevo webhook</DialogTitle>
              <DialogDescription>
                Configura un webhook para recibir eventos de Stack21
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nombre *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Mi Webhook"
                />
              </div>
              <div>
                <Label htmlFor="description">Descripción</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Descripción del webhook"
                />
              </div>
              <div>
                <Label htmlFor="url">URL *</Label>
                <Input
                  id="url"
                  type="url"
                  value={formData.url}
                  onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
                  placeholder="https://api.miempresa.com/webhooks/stack21"
                />
              </div>
              <div>
                <Label>Eventos *</Label>
                <div className="grid grid-cols-2 gap-2 mt-2 max-h-40 overflow-y-auto border rounded-lg p-2">
                  {WEBHOOK_EVENTS.map((event) => (
                    <label key={event.value} className="flex items-center space-x-2 text-sm">
                      <input
                        type="checkbox"
                        checked={formData.events.includes(event.value)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData(prev => ({ ...prev, events: [...prev.events, event.value] }))
                          } else {
                            setFormData(prev => ({ ...prev, events: prev.events.filter(ev => ev !== event.value) }))
                          }
                        }}
                        className="rounded"
                      />
                      <span>{event.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreateWebhook}>
                Crear Webhook
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Webhook className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Webhooks</p>
                <p className="text-2xl font-semibold text-gray-900">{webhooks.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Activos</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {webhooks.filter(wh => wh.isActive).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Zap className="h-8 w-8 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Enviados</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {webhooks.reduce((sum, wh) => sum + wh.successCount, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <AlertCircle className="h-8 w-8 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Fallos</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {webhooks.reduce((sum, wh) => sum + wh.failureCount, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Webhooks List */}
      <Card>
        <CardHeader>
          <CardTitle>Webhooks Configurados</CardTitle>
          <CardDescription>
            Gestiona tus webhooks y monitorea su rendimiento
          </CardDescription>
        </CardHeader>
        <CardContent>
          {webhooks.length === 0 ? (
            <div className="text-center py-12">
              <Webhook className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No hay webhooks</h3>
              <p className="text-gray-500 mb-4">Crea tu primer webhook para comenzar a recibir eventos</p>
              <Button onClick={() => setShowCreateDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Crear Webhook
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {webhooks.map((webhook) => (
                <div key={webhook.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold">{webhook.name}</h3>
                        <Badge variant={webhook.isActive ? 'default' : 'secondary'}>
                          {webhook.isActive ? 'Activo' : 'Inactivo'}
                        </Badge>
                        <Badge variant="outline" className="font-mono text-xs">
                          {webhook.url}
                        </Badge>
                      </div>
                      <p className="text-gray-600 mb-2">Webhook para {webhook.name}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>{webhook.events.length} eventos</span>
                        <span>•</span>
                        <span>{webhook.successCount + webhook.failureCount} enviados</span>
                        <span>•</span>
                        <span>{webhook.successCount} exitosos</span>
                        <span>•</span>
                        <span>{webhook.failureCount} fallos</span>
                        {webhook.lastDelivery && (
                          <>
                            <span>•</span>
                            <span>Último: {new Date(webhook.lastDelivery).toLocaleDateString('es-ES')}</span>
                          </>
                        )}
                      </div>
                      <div className="flex items-center space-x-1 mt-2">
                        {webhook.events.map((event) => (
                          <Badge key={event} variant="outline" className="text-xs">
                            {WEBHOOK_EVENTS.find(e => e.value === event)?.label || event}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleTestWebhook(webhook.id)}
                        disabled={testing === webhook.id}
                      >
                        {testing === webhook.id ? (
                          <RefreshCw className="h-4 w-4 animate-spin" />
                        ) : (
                          <Play className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedWebhook(webhook)
                          loadDeliveries(webhook.id)
                          setShowDeliveriesDialog(true)
                        }}
                      >
                        <Activity className="h-4 w-4" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => copyToClipboard(webhook.secret)}
                          >
                            <Copy className="h-4 w-4 mr-2" />
                            Copiar Secret
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleUpdateWebhook(webhook.id, { isActive: !webhook.isActive })}
                          >
                            {webhook.isActive ? (
                              <>
                                <Pause className="h-4 w-4 mr-2" />
                                Desactivar
                              </>
                            ) : (
                              <>
                                <Play className="h-4 w-4 mr-2" />
                                Activar
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleDeleteWebhook(webhook.id, webhook.name)}
                            className="text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Eliminar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Deliveries Dialog */}
      {selectedWebhook && (
        <Dialog open={showDeliveriesDialog} onOpenChange={setShowDeliveriesDialog}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Entregas de Webhook</DialogTitle>
              <DialogDescription>
                Historial de entregas para {selectedWebhook.name}
              </DialogDescription>
            </DialogHeader>
            <div className="max-h-96 overflow-y-auto">
              {deliveries.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No hay entregas registradas
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Evento</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Respuesta</TableHead>
                      <TableHead>Intentos</TableHead>
                      <TableHead>Fecha</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {deliveries.map((delivery) => (
                      <TableRow key={delivery.id}>
                        <TableCell>
                          <div className="font-medium">
                            {WEBHOOK_EVENTS.find(e => e.value === delivery.event)?.label || delivery.event}
                          </div>
                          <div className="text-sm text-gray-500">
                            {delivery.id}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={
                            delivery.status === 'success' ? 'bg-green-100 text-green-800' :
                            delivery.status === 'failed' ? 'bg-red-100 text-red-800' :
                            delivery.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }>
                            {delivery.status === 'success' ? 'Exitoso' :
                             delivery.status === 'failed' ? 'Falló' :
                             delivery.status === 'pending' ? 'Pendiente' :
                             delivery.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {delivery.responseCode && (
                            <div className="text-sm">
                              <div className="font-mono">
                                {delivery.responseCode}
                              </div>
                              {delivery.responseBody && (
                                <div className="text-gray-500 truncate max-w-xs">
                                  {delivery.responseBody}
                                </div>
                              )}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          1/3
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {new Date(delivery.createdAt).toLocaleString('es-ES')}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
