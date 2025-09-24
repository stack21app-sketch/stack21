'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Webhook, 
  Plus, 
  Edit, 
  Trash2, 
  Play, 
  Pause, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle,
  Activity,
  Settings,
  Eye,
  Copy,
  ExternalLink
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface WebhookConfig {
  id: string;
  name: string;
  url: string;
  events: string[];
  secret: string;
  isActive: boolean;
  retryCount: number;
  timeout: number;
  lastDelivery?: Date;
  successCount: number;
  failureCount: number;
  createdAt: Date;
}

interface WebhookDelivery {
  id: string;
  webhookId: string;
  event: string;
  status: 'pending' | 'success' | 'failed' | 'retrying';
  attempts: number;
  responseCode?: number;
  responseTime?: number;
  error?: string;
  deliveredAt?: Date;
  createdAt: Date;
}

const mockWebhooks: WebhookConfig[] = [
  {
    id: '1',
    name: 'User Registration',
    url: 'https://api.example.com/webhooks/user-registered',
    events: ['user.created', 'user.verified'],
    secret: 'whsec_1234567890abcdef',
    isActive: true,
    retryCount: 3,
    timeout: 30,
    lastDelivery: new Date(Date.now() - 1000 * 60 * 5),
    successCount: 45,
    failureCount: 2,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7)
  },
  {
    id: '2',
    name: 'Payment Processing',
    url: 'https://api.example.com/webhooks/payment',
    events: ['payment.succeeded', 'payment.failed', 'subscription.updated'],
    secret: 'whsec_abcdef1234567890',
    isActive: true,
    retryCount: 5,
    timeout: 60,
    lastDelivery: new Date(Date.now() - 1000 * 60 * 2),
    successCount: 123,
    failureCount: 1,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14)
  },
  {
    id: '3',
    name: 'Team Management',
    url: 'https://api.example.com/webhooks/team',
    events: ['team.member.added', 'team.member.removed', 'team.role.updated'],
    secret: 'whsec_9876543210fedcba',
    isActive: false,
    retryCount: 3,
    timeout: 30,
    successCount: 23,
    failureCount: 0,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3)
  }
];

const mockDeliveries: WebhookDelivery[] = [
  {
    id: '1',
    webhookId: '1',
    event: 'user.created',
    status: 'success',
    attempts: 1,
    responseCode: 200,
    responseTime: 150,
    deliveredAt: new Date(Date.now() - 1000 * 60 * 5),
    createdAt: new Date(Date.now() - 1000 * 60 * 5)
  },
  {
    id: '2',
    webhookId: '2',
    event: 'payment.succeeded',
    status: 'success',
    attempts: 1,
    responseCode: 200,
    responseTime: 89,
    deliveredAt: new Date(Date.now() - 1000 * 60 * 2),
    createdAt: new Date(Date.now() - 1000 * 60 * 2)
  },
  {
    id: '3',
    webhookId: '1',
    event: 'user.verified',
    status: 'failed',
    attempts: 3,
    responseCode: 500,
    responseTime: 5000,
    error: 'Connection timeout',
    createdAt: new Date(Date.now() - 1000 * 60 * 10)
  },
  {
    id: '4',
    webhookId: '2',
    event: 'subscription.updated',
    status: 'retrying',
    attempts: 2,
    responseCode: 503,
    responseTime: 3000,
    error: 'Service unavailable',
    createdAt: new Date(Date.now() - 1000 * 60 * 1)
  }
];

const availableEvents = [
  'user.created',
  'user.updated',
  'user.verified',
  'user.deleted',
  'team.member.added',
  'team.member.removed',
  'team.role.updated',
  'payment.succeeded',
  'payment.failed',
  'subscription.created',
  'subscription.updated',
  'subscription.cancelled',
  'workflow.created',
  'workflow.updated',
  'workflow.executed',
  'integration.connected',
  'integration.disconnected',
  'notification.sent',
  'file.uploaded',
  'file.deleted'
];

export function WebhooksManager() {
  const [webhooks, setWebhooks] = useState<WebhookConfig[]>(mockWebhooks);
  const [deliveries, setDeliveries] = useState<WebhookDelivery[]>(mockDeliveries);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingWebhook, setEditingWebhook] = useState<WebhookConfig | null>(null);
  const [selectedWebhook, setSelectedWebhook] = useState<string | null>(null);
  const { toast } = useToast();

  const [newWebhook, setNewWebhook] = useState({
    name: '',
    url: '',
    events: [] as string[],
    secret: '',
    retryCount: 3,
    timeout: 30
  });

  const generateSecret = () => {
    const secret = 'whsec_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    setNewWebhook(prev => ({ ...prev, secret }));
  };

  const createWebhook = () => {
    if (!newWebhook.name || !newWebhook.url || newWebhook.events.length === 0) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos requeridos",
        variant: "destructive"
      });
      return;
    }

    const webhook: WebhookConfig = {
      id: Date.now().toString(),
      ...newWebhook,
      isActive: true,
      successCount: 0,
      failureCount: 0,
      createdAt: new Date()
    };

    setWebhooks(prev => [...prev, webhook]);
    setNewWebhook({
      name: '',
      url: '',
      events: [],
      secret: '',
      retryCount: 3,
      timeout: 30
    });
    setIsCreateDialogOpen(false);
    
    toast({
      title: "Webhook creado",
      description: "El webhook ha sido creado exitosamente"
    });
  };

  const updateWebhook = (id: string, updates: Partial<WebhookConfig>) => {
    setWebhooks(prev => prev.map(webhook => 
      webhook.id === id ? { ...webhook, ...updates } : webhook
    ));
    
    toast({
      title: "Webhook actualizado",
      description: "Los cambios han sido guardados"
    });
  };

  const deleteWebhook = (id: string) => {
    setWebhooks(prev => prev.filter(webhook => webhook.id !== id));
    setDeliveries(prev => prev.filter(delivery => delivery.webhookId !== id));
    
    toast({
      title: "Webhook eliminado",
      description: "El webhook ha sido eliminado"
    });
  };

  const testWebhook = (webhook: WebhookConfig) => {
    // Simular test de webhook
    const testDelivery: WebhookDelivery = {
      id: Date.now().toString(),
      webhookId: webhook.id,
      event: 'webhook.test',
      status: 'success',
      attempts: 1,
      responseCode: 200,
      responseTime: Math.floor(Math.random() * 200) + 50,
      deliveredAt: new Date(),
      createdAt: new Date()
    };

    setDeliveries(prev => [testDelivery, ...prev]);
    
    toast({
      title: "Test enviado",
      description: "El webhook de prueba ha sido enviado exitosamente"
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'retrying':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'pending':
        return <Activity className="h-4 w-4 text-blue-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      success: 'default',
      failed: 'destructive',
      retrying: 'secondary',
      pending: 'outline'
    } as const;

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'outline'}>
        {status}
      </Badge>
    );
  };

  const filteredDeliveries = selectedWebhook 
    ? deliveries.filter(delivery => delivery.webhookId === selectedWebhook)
    : deliveries;

  return (
    <div className="space-y-6">
      <Tabs defaultValue="webhooks" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
          <TabsTrigger value="deliveries">Entregas</TabsTrigger>
          <TabsTrigger value="settings">Configuración</TabsTrigger>
        </TabsList>

        <TabsContent value="webhooks" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Configuración de Webhooks</h2>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Nuevo Webhook
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Crear Nuevo Webhook</DialogTitle>
                  <DialogDescription>
                    Configura un nuevo webhook para recibir eventos en tiempo real
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Nombre</Label>
                    <Input
                      id="name"
                      value={newWebhook.name}
                      onChange={(e) => setNewWebhook(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Ej: User Registration"
                    />
                  </div>
                  <div>
                    <Label htmlFor="url">URL del Webhook</Label>
                    <Input
                      id="url"
                      value={newWebhook.url}
                      onChange={(e) => setNewWebhook(prev => ({ ...prev, url: e.target.value }))}
                      placeholder="https://api.example.com/webhooks/endpoint"
                    />
                  </div>
                  <div>
                    <Label>Eventos</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2 max-h-40 overflow-y-auto">
                      {availableEvents.map(event => (
                        <label key={event} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={newWebhook.events.includes(event)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setNewWebhook(prev => ({ ...prev, events: [...prev.events, event] }));
                              } else {
                                setNewWebhook(prev => ({ ...prev, events: prev.events.filter(ev => ev !== event) }));
                              }
                            }}
                          />
                          <span className="text-sm">{event}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="secret">Secreto</Label>
                    <div className="flex space-x-2">
                      <Input
                        id="secret"
                        value={newWebhook.secret}
                        onChange={(e) => setNewWebhook(prev => ({ ...prev, secret: e.target.value }))}
                        placeholder="whsec_..."
                      />
                      <Button type="button" variant="outline" onClick={generateSecret}>
                        Generar
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="retryCount">Intentos de Reintento</Label>
                      <Input
                        id="retryCount"
                        type="number"
                        value={newWebhook.retryCount}
                        onChange={(e) => setNewWebhook(prev => ({ ...prev, retryCount: parseInt(e.target.value) || 3 }))}
                        min="1"
                        max="10"
                      />
                    </div>
                    <div>
                      <Label htmlFor="timeout">Timeout (segundos)</Label>
                      <Input
                        id="timeout"
                        type="number"
                        value={newWebhook.timeout}
                        onChange={(e) => setNewWebhook(prev => ({ ...prev, timeout: parseInt(e.target.value) || 30 }))}
                        min="5"
                        max="300"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={createWebhook}>
                      Crear Webhook
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4">
            {webhooks.map(webhook => (
              <Card key={webhook.id} className="relative">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center">
                        <Webhook className="h-5 w-5 mr-2" />
                        {webhook.name}
                        <Badge variant={webhook.isActive ? 'default' : 'secondary'} className="ml-2">
                          {webhook.isActive ? 'Activo' : 'Inactivo'}
                        </Badge>
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {webhook.url}
                      </CardDescription>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => testWebhook(webhook)}
                      >
                        <Play className="h-4 w-4 mr-1" />
                        Test
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setEditingWebhook(webhook);
                          setIsEditDialogOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => deleteWebhook(webhook.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <div className="text-sm font-medium text-gray-500">Eventos</div>
                      <div className="text-sm">{webhook.events.length} configurados</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-500">Éxitos</div>
                      <div className="text-sm text-green-600">{webhook.successCount}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-500">Fallos</div>
                      <div className="text-sm text-red-600">{webhook.failureCount}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-500">Última Entrega</div>
                      <div className="text-sm">
                        {webhook.lastDelivery 
                          ? webhook.lastDelivery.toLocaleString()
                          : 'Nunca'
                        }
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="text-sm font-medium text-gray-500 mb-2">Eventos Suscritos</div>
                    <div className="flex flex-wrap gap-1">
                      {webhook.events.map(event => (
                        <Badge key={event} variant="outline" className="text-xs">
                          {event}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="deliveries" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Historial de Entregas</h2>
            <div className="flex space-x-2">
              <Select value={selectedWebhook || 'all'} onValueChange={(value) => setSelectedWebhook(value === 'all' ? null : value)}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filtrar por webhook" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los webhooks</SelectItem>
                  {webhooks.map(webhook => (
                    <SelectItem key={webhook.id} value={webhook.id}>
                      {webhook.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            {filteredDeliveries.map(delivery => {
              const webhook = webhooks.find(w => w.id === delivery.webhookId);
              return (
                <Card key={delivery.id}>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(delivery.status)}
                        <div>
                          <div className="font-medium">{delivery.event}</div>
                          <div className="text-sm text-gray-500">
                            {webhook?.name} • {delivery.createdAt.toLocaleString()}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        {getStatusBadge(delivery.status)}
                        <div className="text-right text-sm">
                          <div>Intento {delivery.attempts}</div>
                          {delivery.responseTime && (
                            <div className="text-gray-500">{delivery.responseTime}ms</div>
                          )}
                        </div>
                      </div>
                    </div>
                    {delivery.error && (
                      <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
                        <div className="text-sm text-red-800">{delivery.error}</div>
                      </div>
                    )}
                    {delivery.responseCode && (
                      <div className="mt-2 text-sm text-gray-600">
                        Código de respuesta: {delivery.responseCode}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <h2 className="text-2xl font-bold">Configuración Global</h2>
          
          <Card>
            <CardHeader>
              <CardTitle>Configuración de Reintentos</CardTitle>
              <CardDescription>
                Configura el comportamiento de reintentos para todos los webhooks
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="globalRetryCount">Intentos Máximos</Label>
                  <Input
                    id="globalRetryCount"
                    type="number"
                    defaultValue="3"
                    min="1"
                    max="10"
                  />
                </div>
                <div>
                  <Label htmlFor="globalTimeout">Timeout Global (segundos)</Label>
                  <Input
                    id="globalTimeout"
                    type="number"
                    defaultValue="30"
                    min="5"
                    max="300"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="backoffStrategy">Estrategia de Backoff</Label>
                <Select defaultValue="exponential">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="exponential">Exponencial</SelectItem>
                    <SelectItem value="linear">Lineal</SelectItem>
                    <SelectItem value="fixed">Fijo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Configuración de Seguridad</CardTitle>
              <CardDescription>
                Configuración de seguridad para webhooks
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="hmacVerification">Verificación HMAC</Label>
                  <div className="text-sm text-gray-500">
                    Verificar firmas HMAC en las solicitudes entrantes
                  </div>
                </div>
                <Switch id="hmacVerification" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="ipWhitelist">Lista Blanca de IPs</Label>
                  <div className="text-sm text-gray-500">
                    Permitir solo IPs específicas
                  </div>
                </div>
                <Switch id="ipWhitelist" />
              </div>
              <div>
                <Label htmlFor="allowedIps">IPs Permitidas</Label>
                <Input
                  id="allowedIps"
                  placeholder="192.168.1.1, 10.0.0.1"
                  disabled
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Configuración de Monitoreo</CardTitle>
              <CardDescription>
                Configuración para monitoreo y alertas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="enableAlerts">Habilitar Alertas</Label>
                  <div className="text-sm text-gray-500">
                    Recibir alertas por fallos de webhooks
                  </div>
                </div>
                <Switch id="enableAlerts" defaultChecked />
              </div>
              <div>
                <Label htmlFor="alertThreshold">Umbral de Fallos</Label>
                <Input
                  id="alertThreshold"
                  type="number"
                  defaultValue="5"
                  min="1"
                  max="100"
                />
              </div>
              <div>
                <Label htmlFor="alertEmail">Email de Alertas</Label>
                <Input
                  id="alertEmail"
                  type="email"
                  placeholder="alerts@example.com"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
