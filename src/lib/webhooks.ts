import { z } from 'zod';

// Esquemas de validación
export const webhookConfigSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'El nombre es requerido'),
  url: z.string().url('URL inválida'),
  events: z.array(z.string()).min(1, 'Al menos un evento es requerido'),
  secret: z.string().min(1, 'El secreto es requerido'),
  isActive: z.boolean().default(true),
  retryCount: z.number().min(1).max(10).default(3),
  timeout: z.number().min(5).max(300).default(30),
  lastDelivery: z.date().optional(),
  successCount: z.number().default(0),
  failureCount: z.number().default(0),
  createdAt: z.date(),
  updatedAt: z.date().optional()
});

export const webhookDeliverySchema = z.object({
  id: z.string(),
  webhookId: z.string(),
  event: z.string(),
  status: z.enum(['pending', 'success', 'failed', 'retrying']),
  attempts: z.number().min(1),
  responseCode: z.number().optional(),
  responseTime: z.number().optional(),
  error: z.string().optional(),
  deliveredAt: z.date().optional(),
  createdAt: z.date()
});

export const webhookEventSchema = z.object({
  id: z.string(),
  type: z.string(),
  data: z.record(z.any()),
  timestamp: z.date(),
  source: z.string()
});

export const webhookSettingsSchema = z.object({
  globalRetryCount: z.number().min(1).max(10).default(3),
  globalTimeout: z.number().min(5).max(300).default(30),
  backoffStrategy: z.enum(['exponential', 'linear', 'fixed']).default('exponential'),
  hmacVerification: z.boolean().default(true),
  ipWhitelist: z.boolean().default(false),
  allowedIps: z.array(z.string()).default([]),
  enableAlerts: z.boolean().default(true),
  alertThreshold: z.number().min(1).max(100).default(5),
  alertEmail: z.string().email().optional()
});

export type WebhookConfig = z.infer<typeof webhookConfigSchema>;
export type WebhookDelivery = z.infer<typeof webhookDeliverySchema>;
export type WebhookEvent = z.infer<typeof webhookEventSchema>;
export type WebhookSettings = z.infer<typeof webhookSettingsSchema>;

// Datos mock
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

const mockSettings: WebhookSettings = {
  globalRetryCount: 3,
  globalTimeout: 30,
  backoffStrategy: 'exponential',
  hmacVerification: true,
  ipWhitelist: false,
  allowedIps: [],
  enableAlerts: true,
  alertThreshold: 5,
  alertEmail: 'alerts@stack21.com'
};

// Funciones de utilidad
export function generateWebhookSecret(): string {
  return 'whsec_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

export function calculateBackoffDelay(attempt: number, strategy: 'exponential' | 'linear' | 'fixed' = 'exponential'): number {
  switch (strategy) {
    case 'exponential':
      return Math.min(1000 * Math.pow(2, attempt - 1), 30000); // Max 30 seconds
    case 'linear':
      return 1000 * attempt; // 1 second per attempt
    case 'fixed':
      return 5000; // 5 seconds fixed
    default:
      return 1000 * Math.pow(2, attempt - 1);
  }
}

export function generateHMACSignature(payload: string, secret: string): string {
  // En un entorno real, usarías crypto.createHmac('sha256', secret).update(payload).digest('hex')
  // Para demo, generamos una firma simulada
  return 'sha256=' + Buffer.from(payload + secret).toString('hex').substring(0, 64);
}

export function verifyHMACSignature(payload: string, signature: string, secret: string): boolean {
  const expectedSignature = generateHMACSignature(payload, secret);
  return signature === expectedSignature;
}

// Funciones de API mock
export async function getWebhooks(): Promise<WebhookConfig[]> {
  await new Promise(resolve => setTimeout(resolve, 100));
  return mockWebhooks;
}

export async function getWebhookById(id: string): Promise<WebhookConfig | null> {
  await new Promise(resolve => setTimeout(resolve, 100));
  return mockWebhooks.find(webhook => webhook.id === id) || null;
}

export async function createWebhook(webhook: Omit<WebhookConfig, 'id' | 'createdAt' | 'successCount' | 'failureCount'>): Promise<WebhookConfig> {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const newWebhook: WebhookConfig = {
    ...webhook,
    id: Date.now().toString(),
    createdAt: new Date(),
    successCount: 0,
    failureCount: 0
  };
  
  mockWebhooks.push(newWebhook);
  return newWebhook;
}

export async function updateWebhook(id: string, updates: Partial<WebhookConfig>): Promise<WebhookConfig | null> {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const index = mockWebhooks.findIndex(webhook => webhook.id === id);
  if (index === -1) return null;
  
  mockWebhooks[index] = {
    ...mockWebhooks[index],
    ...updates,
    updatedAt: new Date()
  };
  
  return mockWebhooks[index];
}

export async function deleteWebhook(id: string): Promise<boolean> {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const index = mockWebhooks.findIndex(webhook => webhook.id === id);
  if (index === -1) return false;
  
  mockWebhooks.splice(index, 1);
  return true;
}

export async function getDeliveries(webhookId?: string): Promise<WebhookDelivery[]> {
  await new Promise(resolve => setTimeout(resolve, 100));
  
  if (webhookId) {
    return mockDeliveries.filter(delivery => delivery.webhookId === webhookId);
  }
  
  return mockDeliveries;
}

export async function getDeliveryById(id: string): Promise<WebhookDelivery | null> {
  await new Promise(resolve => setTimeout(resolve, 100));
  return mockDeliveries.find(delivery => delivery.id === id) || null;
}

export async function createDelivery(delivery: Omit<WebhookDelivery, 'id' | 'createdAt'>): Promise<WebhookDelivery> {
  await new Promise(resolve => setTimeout(resolve, 100));
  
  const newDelivery: WebhookDelivery = {
    ...delivery,
    id: Date.now().toString(),
    createdAt: new Date()
  };
  
  mockDeliveries.unshift(newDelivery);
  return newDelivery;
}

export async function updateDelivery(id: string, updates: Partial<WebhookDelivery>): Promise<WebhookDelivery | null> {
  await new Promise(resolve => setTimeout(resolve, 100));
  
  const index = mockDeliveries.findIndex(delivery => delivery.id === id);
  if (index === -1) return null;
  
  mockDeliveries[index] = { ...mockDeliveries[index], ...updates };
  return mockDeliveries[index];
}

export async function getSettings(): Promise<WebhookSettings> {
  await new Promise(resolve => setTimeout(resolve, 100));
  return mockSettings;
}

export async function updateSettings(settings: Partial<WebhookSettings>): Promise<WebhookSettings> {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  Object.assign(mockSettings, settings);
  return mockSettings;
}

export async function testWebhook(webhookId: string): Promise<WebhookDelivery> {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const webhook = await getWebhookById(webhookId);
  if (!webhook) {
    throw new Error('Webhook no encontrado');
  }
  
  // Simular test de webhook
  const testDelivery: WebhookDelivery = {
    id: Date.now().toString(),
    webhookId,
    event: 'webhook.test',
    status: 'success',
    attempts: 1,
    responseCode: 200,
    responseTime: Math.floor(Math.random() * 200) + 50,
    deliveredAt: new Date(),
    createdAt: new Date()
  };
  
  mockDeliveries.unshift(testDelivery);
  
  // Actualizar contadores del webhook
  await updateWebhook(webhookId, {
    successCount: webhook.successCount + 1,
    lastDelivery: new Date()
  });
  
  return testDelivery;
}

export async function triggerWebhook(webhookId: string, event: string, data: any): Promise<WebhookDelivery> {
  const webhook = await getWebhookById(webhookId);
  if (!webhook || !webhook.isActive) {
    throw new Error('Webhook no encontrado o inactivo');
  }
  
  if (!webhook.events.includes(event)) {
    throw new Error('Evento no suscrito en este webhook');
  }
  
  // Simular envío de webhook
  const delivery: WebhookDelivery = {
    id: Date.now().toString(),
    webhookId,
    event,
    status: 'pending',
    attempts: 1,
    createdAt: new Date()
  };
  
  mockDeliveries.unshift(delivery);
  
  // Simular resultado del envío
  const success = Math.random() > 0.1; // 90% de éxito para demo
  
  if (success) {
    delivery.status = 'success';
    delivery.responseCode = 200;
    delivery.responseTime = Math.floor(Math.random() * 200) + 50;
    delivery.deliveredAt = new Date();
    
    await updateWebhook(webhookId, {
      successCount: webhook.successCount + 1,
      lastDelivery: new Date()
    });
  } else {
    delivery.status = 'failed';
    delivery.responseCode = 500;
    delivery.responseTime = 5000;
    delivery.error = 'Simulated delivery failure';
    
    await updateWebhook(webhookId, {
      failureCount: webhook.failureCount + 1
    });
  }
  
  return delivery;
}

export async function retryDelivery(deliveryId: string): Promise<WebhookDelivery | null> {
  const delivery = await getDeliveryById(deliveryId);
  if (!delivery) return null;
  
  const webhook = await getWebhookById(delivery.webhookId);
  if (!webhook) return null;
  
  // Verificar si se puede reintentar
  if (delivery.attempts >= webhook.retryCount) {
    delivery.status = 'failed';
    return delivery;
  }
  
  // Calcular delay de backoff
  const delay = calculateBackoffDelay(delivery.attempts, 'exponential');
  await new Promise(resolve => setTimeout(resolve, delay));
  
  // Simular reintento
  delivery.attempts += 1;
  delivery.status = 'retrying';
  
  const success = Math.random() > 0.3; // 70% de éxito en reintentos
  
  if (success) {
    delivery.status = 'success';
    delivery.responseCode = 200;
    delivery.responseTime = Math.floor(Math.random() * 200) + 50;
    delivery.deliveredAt = new Date();
    delivery.error = undefined;
    
    await updateWebhook(webhook.id, {
      successCount: webhook.successCount + 1,
      lastDelivery: new Date()
    });
  } else {
    if (delivery.attempts >= webhook.retryCount) {
      delivery.status = 'failed';
    } else {
      delivery.status = 'retrying';
    }
    delivery.error = `Retry attempt ${delivery.attempts} failed`;
  }
  
  return delivery;
}

// Eventos disponibles
export const availableEvents = [
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
  'file.deleted',
  'webhook.test'
];

// Estadísticas
export async function getWebhookStats(): Promise<{
  totalWebhooks: number;
  activeWebhooks: number;
  totalDeliveries: number;
  successRate: number;
  averageResponseTime: number;
  recentFailures: number;
}> {
  const webhooks = await getWebhooks();
  const deliveries = await getDeliveries();
  
  const activeWebhooks = webhooks.filter(w => w.isActive).length;
  const totalDeliveries = deliveries.length;
  const successfulDeliveries = deliveries.filter(d => d.status === 'success').length;
  const successRate = totalDeliveries > 0 ? (successfulDeliveries / totalDeliveries) * 100 : 0;
  
  const responseTimes = deliveries
    .filter(d => d.responseTime)
    .map(d => d.responseTime!);
  const averageResponseTime = responseTimes.length > 0 
    ? responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length 
    : 0;
  
  const recentFailures = deliveries
    .filter(d => d.status === 'failed' && d.createdAt > new Date(Date.now() - 1000 * 60 * 60 * 24))
    .length;
  
  return {
    totalWebhooks: webhooks.length,
    activeWebhooks,
    totalDeliveries,
    successRate: Math.round(successRate * 100) / 100,
    averageResponseTime: Math.round(averageResponseTime),
    recentFailures
  };
}