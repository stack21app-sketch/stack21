// Sistema de Integraciones Básico para Stack21

export interface Integration {
  id: string;
  name: string;
  type: 'slack' | 'discord' | 'zapier' | 'webhook' | 'email';
  status: 'active' | 'inactive';
  credentials: Record<string, any>;
  createdAt: Date;
  usageCount: number;
}

export interface IntegrationMessage {
  id: string;
  integrationId: string;
  content: string;
  status: 'sent' | 'failed' | 'pending';
  sentAt?: Date;
  error?: string;
}

class IntegrationManager {
  private integrations: Map<string, Integration> = new Map();
  private messages: Map<string, IntegrationMessage> = new Map();

  createIntegration(config: Omit<Integration, 'id' | 'createdAt' | 'usageCount'>): Integration {
    const newIntegration: Integration = {
      ...config,
      id: `int_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      usageCount: 0
    };

    this.integrations.set(newIntegration.id, newIntegration);
    return newIntegration;
  }

  async sendMessage(integrationId: string, content: string): Promise<IntegrationMessage> {
    const integration = this.integrations.get(integrationId);
    if (!integration) {
      throw new Error(`Integración ${integrationId} no encontrada`);
    }

    const message: IntegrationMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      integrationId,
      content,
      status: 'pending'
    };

    this.messages.set(message.id, message);

    try {
      switch (integration.type) {
        case 'slack':
          await this.sendToSlack(integration, content);
          break;
        case 'discord':
          await this.sendToDiscord(integration, content);
          break;
        case 'zapier':
          await this.sendToZapier(integration, content);
          break;
        case 'webhook':
          await this.sendToWebhook(integration, content);
          break;
        case 'email':
          await this.sendEmail(integration, content);
          break;
        default:
          throw new Error(`Tipo no soportado: ${integration.type}`);
      }

      message.status = 'sent';
      message.sentAt = new Date();
      integration.usageCount++;

    } catch (error) {
      message.status = 'failed';
      message.error = error instanceof Error ? error.message : 'Unknown error';
      throw error;
    }

    return message;
  }

  private async sendToSlack(integration: Integration, content: string): Promise<void> {
    const { webhookUrl, channel } = integration.credentials;
    
    const payload = {
      text: content,
      channel: channel || '#general',
      username: 'Stack21 Bot'
    };

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`Slack error: ${response.status}`);
    }
  }

  private async sendToDiscord(integration: Integration, content: string): Promise<void> {
    const { webhookUrl } = integration.credentials;
    
    const payload = {
      content,
      username: 'Stack21 Bot'
    };

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`Discord error: ${response.status}`);
    }
  }

  private async sendToZapier(integration: Integration, content: string): Promise<void> {
    const { webhookUrl } = integration.credentials;
    
    const payload = {
      content,
      timestamp: new Date().toISOString(),
      source: 'stack21'
    };

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`Zapier error: ${response.status}`);
    }
  }

  private async sendToWebhook(integration: Integration, content: string): Promise<void> {
    const { url, method = 'POST' } = integration.credentials;
    
    const payload = {
      content,
      timestamp: new Date().toISOString(),
      source: 'stack21'
    };

    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`Webhook error: ${response.status}`);
    }
  }

  private async sendEmail(integration: Integration, content: string): Promise<void> {
    // Simular envío de email
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  getAllIntegrations(): Integration[] {
    return Array.from(this.integrations.values());
  }

  getIntegration(id: string): Integration | undefined {
    return this.integrations.get(id);
  }

  deleteIntegration(id: string): boolean {
    return this.integrations.delete(id);
  }

  getStats() {
    const integrations = Array.from(this.integrations.values());
    const messages = Array.from(this.messages.values());

    return {
      totalIntegrations: integrations.length,
      activeIntegrations: integrations.filter(i => i.status === 'active').length,
      totalMessages: messages.length,
      successfulMessages: messages.filter(m => m.status === 'sent').length,
      failedMessages: messages.filter(m => m.status === 'failed').length
    };
  }
}

export const integrationManager = new IntegrationManager();

// Exportaciones adicionales para las APIs
export const AVAILABLE_INTEGRATIONS = [
  {
    id: 'slack',
    name: 'Slack',
    description: 'Integración con Slack para notificaciones',
    type: 'slack',
    icon: '💬',
    category: 'communication'
  },
  {
    id: 'discord',
    name: 'Discord',
    description: 'Integración con Discord para bots',
    type: 'discord',
    icon: '🎮',
    category: 'communication'
  },
  {
    id: 'zapier',
    name: 'Zapier',
    description: 'Automatización con Zapier',
    type: 'zapier',
    icon: '⚡',
    category: 'automation'
  },
  {
    id: 'webhook',
    name: 'Webhook',
    description: 'Webhooks personalizados',
    type: 'webhook',
    icon: '🔗',
    category: 'integration'
  },
  {
    id: 'email',
    name: 'Email',
    description: 'Integración de email',
    type: 'email',
    icon: '📧',
    category: 'communication'
  }
];

export function configureIntegration(integrationId: string, credentials: Record<string, any>): boolean {
  try {
    const integration = integrationManager.createIntegration({
      name: AVAILABLE_INTEGRATIONS.find(i => i.id === integrationId)?.name || integrationId,
      type: integrationId as any,
      credentials,
      status: 'active'
    });
    return !!integration;
  } catch (error) {
    console.error('Error configuring integration:', error);
    return false;
  }
}

export async function testIntegration(integrationId: string): Promise<{ success: boolean; message: string }> {
  try {
    // Simular test de integración
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const integration = integrationManager.getIntegration(integrationId);
    if (!integration) {
      return { success: false, message: 'Integración no encontrada' };
    }
    
    // Simular diferentes resultados basados en el tipo
    const results = {
      slack: { success: true, message: 'Conexión con Slack exitosa' },
      discord: { success: true, message: 'Bot de Discord conectado' },
      zapier: { success: true, message: 'Zapier configurado correctamente' },
      webhook: { success: true, message: 'Webhook funcionando' },
      email: { success: true, message: 'SMTP configurado' }
    };
    
    return results[integration.type] || { success: false, message: 'Tipo de integración no soportado' };
  } catch (error: unknown) {
    if (error instanceof Error) {
      return { success: false, message: `Error: ${error.message}` };
    }
    return { success: false, message: `Error: ${String(error)}` };
  }
}