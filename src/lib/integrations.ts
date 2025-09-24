// Sistema de integraciones para Stack21
export interface Integration {
  id: string
  name: string
  description: string
  category: 'email' | 'crm' | 'social' | 'payment' | 'analytics' | 'productivity'
  icon: string
  status: 'active' | 'inactive' | 'pending'
  config: Record<string, any>
  apiEndpoint: string
  webhookUrl?: string
  lastSync?: Date
  credentials?: {
    apiKey?: string
    secret?: string
    token?: string
    refreshToken?: string
  }
}

export interface IntegrationConfig {
  apiKey: string
  secret?: string
  webhookUrl?: string
  settings?: Record<string, any>
}

// Integraciones disponibles
export const AVAILABLE_INTEGRATIONS: Integration[] = [
  // Email Marketing
  {
    id: 'mailchimp',
    name: 'Mailchimp',
    description: 'Email marketing y automatización',
    category: 'email',
    icon: '📧',
    status: 'inactive',
    config: {},
    apiEndpoint: '/api/integrations/mailchimp',
    webhookUrl: '/api/webhooks/mailchimp'
  },
  {
    id: 'sendgrid',
    name: 'SendGrid',
    description: 'API de email transaccional',
    category: 'email',
    icon: '📬',
    status: 'inactive',
    config: {},
    apiEndpoint: '/api/integrations/sendgrid',
    webhookUrl: '/api/webhooks/sendgrid'
  },
  {
    id: 'convertkit',
    name: 'ConvertKit',
    description: 'Email marketing para creadores',
    category: 'email',
    icon: '🎯',
    status: 'inactive',
    config: {},
    apiEndpoint: '/api/integrations/convertkit',
    webhookUrl: '/api/webhooks/convertkit'
  },

  // CRM
  {
    id: 'hubspot',
    name: 'HubSpot',
    description: 'CRM y marketing automation',
    category: 'crm',
    icon: '🟠',
    status: 'inactive',
    config: {},
    apiEndpoint: '/api/integrations/hubspot',
    webhookUrl: '/api/webhooks/hubspot'
  },
  {
    id: 'salesforce',
    name: 'Salesforce',
    description: 'CRM empresarial',
    category: 'crm',
    icon: '☁️',
    status: 'inactive',
    config: {},
    apiEndpoint: '/api/integrations/salesforce',
    webhookUrl: '/api/webhooks/salesforce'
  },
  {
    id: 'pipedrive',
    name: 'Pipedrive',
    description: 'CRM simple y efectivo',
    category: 'crm',
    icon: '🔵',
    status: 'inactive',
    config: {},
    apiEndpoint: '/api/integrations/pipedrive',
    webhookUrl: '/api/webhooks/pipedrive'
  },

  // Redes Sociales
  {
    id: 'facebook',
    name: 'Facebook',
    description: 'Facebook e Instagram marketing',
    category: 'social',
    icon: '📘',
    status: 'inactive',
    config: {},
    apiEndpoint: '/api/integrations/facebook',
    webhookUrl: '/api/webhooks/facebook'
  },
  {
    id: 'twitter',
    name: 'Twitter',
    description: 'Twitter marketing y automatización',
    category: 'social',
    icon: '🐦',
    status: 'inactive',
    config: {},
    apiEndpoint: '/api/integrations/twitter',
    webhookUrl: '/api/webhooks/twitter'
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    description: 'LinkedIn marketing profesional',
    category: 'social',
    icon: '💼',
    status: 'inactive',
    config: {},
    apiEndpoint: '/api/integrations/linkedin',
    webhookUrl: '/api/webhooks/linkedin'
  },
  {
    id: 'youtube',
    name: 'YouTube',
    description: 'YouTube marketing y analytics',
    category: 'social',
    icon: '📺',
    status: 'inactive',
    config: {},
    apiEndpoint: '/api/integrations/youtube',
    webhookUrl: '/api/webhooks/youtube'
  },

  // Pagos
  {
    id: 'stripe',
    name: 'Stripe',
    description: 'Procesamiento de pagos',
    category: 'payment',
    icon: '💳',
    status: 'inactive',
    config: {},
    apiEndpoint: '/api/integrations/stripe',
    webhookUrl: '/api/webhooks/stripe'
  },
  {
    id: 'paypal',
    name: 'PayPal',
    description: 'Pagos online seguros',
    category: 'payment',
    icon: '🅿️',
    status: 'inactive',
    config: {},
    apiEndpoint: '/api/integrations/paypal',
    webhookUrl: '/api/webhooks/paypal'
  },

  // Analytics
  {
    id: 'google-analytics',
    name: 'Google Analytics',
    description: 'Analytics web avanzados',
    category: 'analytics',
    icon: '📊',
    status: 'inactive',
    config: {},
    apiEndpoint: '/api/integrations/google-analytics',
    webhookUrl: '/api/webhooks/google-analytics'
  },
  {
    id: 'facebook-pixel',
    name: 'Facebook Pixel',
    description: 'Tracking de conversiones',
    category: 'analytics',
    icon: '📈',
    status: 'inactive',
    config: {},
    apiEndpoint: '/api/integrations/facebook-pixel',
    webhookUrl: '/api/webhooks/facebook-pixel'
  },

  // Productividad
  {
    id: 'slack',
    name: 'Slack',
    description: 'Comunicación de equipos',
    category: 'productivity',
    icon: '💬',
    status: 'inactive',
    config: {},
    apiEndpoint: '/api/integrations/slack',
    webhookUrl: '/api/webhooks/slack'
  },
  {
    id: 'zapier',
    name: 'Zapier',
    description: 'Automatización entre apps',
    category: 'productivity',
    icon: '⚡',
    status: 'inactive',
    config: {},
    apiEndpoint: '/api/integrations/zapier',
    webhookUrl: '/api/webhooks/zapier'
  },
  {
    id: 'airtable',
    name: 'Airtable',
    description: 'Base de datos colaborativa',
    category: 'productivity',
    icon: '🗃️',
    status: 'inactive',
    config: {},
    apiEndpoint: '/api/integrations/airtable',
    webhookUrl: '/api/webhooks/airtable'
  }
]

// Funciones de utilidad
export function getIntegrationsByCategory(category: string): Integration[] {
  return AVAILABLE_INTEGRATIONS.filter(integration => integration.category === category)
}

export function getActiveIntegrations(): Integration[] {
  return AVAILABLE_INTEGRATIONS.filter(integration => integration.status === 'active')
}

export function getIntegrationById(id: string): Integration | undefined {
  return AVAILABLE_INTEGRATIONS.find(integration => integration.id === id)
}

// Configuración de integración
export async function configureIntegration(
  integrationId: string, 
  config: IntegrationConfig
): Promise<{ success: boolean; message: string }> {
  try {
    const integration = getIntegrationById(integrationId)
    if (!integration) {
      return { success: false, message: 'Integración no encontrada' }
    }

    // Aquí se haría la configuración real con la API
    // Por ahora simulamos el proceso
    await new Promise(resolve => setTimeout(resolve, 1000))

    return { 
      success: true, 
      message: `${integration.name} configurado exitosamente` 
    }
  } catch (error) {
    return { 
      success: false, 
      message: 'Error al configurar la integración' 
    }
  }
}

// Test de conexión
export async function testIntegration(integrationId: string): Promise<{ success: boolean; message: string }> {
  try {
    const integration = getIntegrationById(integrationId)
    if (!integration) {
      return { success: false, message: 'Integración no encontrada' }
    }

    // Simular test de conexión
    await new Promise(resolve => setTimeout(resolve, 2000))

    return { 
      success: true, 
      message: `Conexión con ${integration.name} exitosa` 
    }
  } catch (error) {
    return { 
      success: false, 
      message: 'Error al conectar con la integración' 
    }
  }
}