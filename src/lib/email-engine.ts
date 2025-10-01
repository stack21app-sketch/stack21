// Sistema de Automatización de Emails para Stack21
export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  type: 'welcome' | 'newsletter' | 'promotion' | 'reminder' | 'custom';
  variables: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface EmailCampaign {
  id: string;
  name: string;
  description: string;
  templateId: string;
  recipientList: string[];
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'paused' | 'cancelled';
  scheduleDate?: Date;
  sendDate?: Date;
  metrics: EmailMetrics;
  createdAt: Date;
  updatedAt: Date;
}

export interface EmailMetrics {
  totalSent: number;
  delivered: number;
  opened: number;
  clicked: number;
  bounced: number;
  unsubscribed: number;
  openRate: number;
  clickRate: number;
  bounceRate: number;
}

export interface EmailAutomation {
  id: string;
  name: string;
  trigger: EmailTrigger;
  conditions: EmailCondition[];
  actions: EmailAction[];
  status: 'active' | 'inactive' | 'paused';
  createdAt: Date;
  updatedAt: Date;
  executionCount: number;
}

export interface EmailTrigger {
  type: 'user_signup' | 'purchase' | 'abandoned_cart' | 'date_based' | 'custom';
  config: Record<string, any>;
}

export interface EmailCondition {
  field: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than';
  value: any;
}

export interface EmailAction {
  type: 'send_email' | 'add_to_list' | 'remove_from_list' | 'update_user' | 'webhook';
  config: Record<string, any>;
  delay?: number; // minutos
}

export interface EmailRecipient {
  email: string;
  name?: string;
  variables?: Record<string, any>;
  tags?: string[];
  status: 'active' | 'unsubscribed' | 'bounced';
  subscribedAt: Date;
}

class EmailEngine {
  private templates: Map<string, EmailTemplate> = new Map();
  private campaigns: Map<string, EmailCampaign> = new Map();
  private automations: Map<string, EmailAutomation> = new Map();
  private recipients: Map<string, EmailRecipient> = new Map();
  private sentEmails: Map<string, any> = new Map();

  // Crear plantilla de email
  createTemplate(template: Omit<EmailTemplate, 'id' | 'createdAt' | 'updatedAt'>): EmailTemplate {
    const newTemplate: EmailTemplate = {
      ...template,
      id: `tpl_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.templates.set(newTemplate.id, newTemplate);
    return newTemplate;
  }

  // Crear campaña de email
  createCampaign(campaign: Omit<EmailCampaign, 'id' | 'createdAt' | 'updatedAt' | 'metrics'>): EmailCampaign {
    const newCampaign: EmailCampaign = {
      ...campaign,
      id: `cmp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      updatedAt: new Date(),
      metrics: {
        totalSent: 0,
        delivered: 0,
        opened: 0,
        clicked: 0,
        bounced: 0,
        unsubscribed: 0,
        openRate: 0,
        clickRate: 0,
        bounceRate: 0
      }
    };

    this.campaigns.set(newCampaign.id, newCampaign);
    return newCampaign;
  }

  // Crear automatización de email
  createAutomation(automation: Omit<EmailAutomation, 'id' | 'createdAt' | 'updatedAt' | 'executionCount'>): EmailAutomation {
    const newAutomation: EmailAutomation = {
      ...automation,
      id: `auto_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      updatedAt: new Date(),
      executionCount: 0
    };

    this.automations.set(newAutomation.id, newAutomation);
    return newAutomation;
  }

  // Enviar email individual
  async sendEmail(to: string, templateId: string, variables?: Record<string, any>): Promise<boolean> {
    const template = this.templates.get(templateId);
    if (!template) {
      throw new Error(`Template ${templateId} not found`);
    }

    try {
      const processedEmail = this.processTemplate(template, variables || {});
      
      // Simular envío de email
      const emailId = `email_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      this.sentEmails.set(emailId, {
        id: emailId,
        to,
        subject: processedEmail.subject,
        body: processedEmail.body,
        sentAt: new Date(),
        status: 'sent'
      });

      // Simular métricas
      setTimeout(() => {
        this.simulateEmailMetrics(emailId);
      }, 1000);

      return true;
    } catch (error) {
      console.error('Error sending email:', error);
      return false;
    }
  }

  // Ejecutar campaña
  async executeCampaign(campaignId: string): Promise<boolean> {
    const campaign = this.campaigns.get(campaignId);
    if (!campaign) {
      throw new Error(`Campaign ${campaignId} not found`);
    }

    if (campaign.status !== 'draft' && campaign.status !== 'scheduled') {
      throw new Error(`Campaign ${campaignId} cannot be executed`);
    }

    const template = this.templates.get(campaign.templateId);
    if (!template) {
      throw new Error(`Template ${campaign.templateId} not found`);
    }

    campaign.status = 'sending';
    campaign.sendDate = new Date();

    let successCount = 0;
    for (const recipientEmail of campaign.recipientList) {
      try {
        const recipient = this.recipients.get(recipientEmail);
        const variables = recipient?.variables || {};
        
        const sent = await this.sendEmail(recipientEmail, campaign.templateId, variables);
        if (sent) {
          successCount++;
          campaign.metrics.totalSent++;
          campaign.metrics.delivered++;
        }
      } catch (error) {
        console.error(`Error sending to ${recipientEmail}:`, error);
        campaign.metrics.bounced++;
      }

      // Simular delay entre envíos
      await this.delay(100);
    }

    campaign.status = 'sent';
    campaign.metrics.bounceRate = (campaign.metrics.bounced / campaign.metrics.totalSent) * 100;

    return successCount > 0;
  }

  // Procesar automatización
  async processAutomation(automationId: string, triggerData: any): Promise<boolean> {
    const automation = this.automations.get(automationId);
    if (!automation) {
      throw new Error(`Automation ${automationId} not found`);
    }

    if (automation.status !== 'active') {
      return false;
    }

    // Verificar trigger
    const triggerMatched = this.checkTrigger(automation.trigger, triggerData);
    if (!triggerMatched) {
      return false;
    }

    // Verificar condiciones
    const conditionsMet = this.checkConditions(automation.conditions, triggerData);
    if (!conditionsMet) {
      return false;
    }

    // Ejecutar acciones
    for (const action of automation.actions) {
      if (action.delay) {
        await this.delay(action.delay * 60 * 1000); // Convertir minutos a ms
      }

      await this.executeAction(action, triggerData);
    }

    automation.executionCount++;
    return true;
  }

  // Procesar plantilla con variables
  private processTemplate(template: EmailTemplate, variables: Record<string, any>): { subject: string; body: string } {
    let subject = template.subject;
    let body = template.body;

    // Reemplazar variables en el subject
    for (const [key, value] of Object.entries(variables)) {
      const placeholder = `{{${key}}}`;
      subject = subject.replace(new RegExp(placeholder, 'g'), String(value));
    }

    // Reemplazar variables en el body
    for (const [key, value] of Object.entries(variables)) {
      const placeholder = `{{${key}}}`;
      body = body.replace(new RegExp(placeholder, 'g'), String(value));
    }

    return { subject, body };
  }

  // Verificar trigger
  private checkTrigger(trigger: EmailTrigger, data: any): boolean {
    switch (trigger.type) {
      case 'user_signup':
        return data.event === 'user_signup';
      case 'purchase':
        return data.event === 'purchase';
      case 'abandoned_cart':
        return data.event === 'abandoned_cart';
      case 'date_based':
        const targetDate = new Date(trigger.config.date);
        const now = new Date();
        return now >= targetDate;
      case 'custom':
        // Implementar lógica personalizada
        return true;
      default:
        return false;
    }
  }

  // Verificar condiciones
  private checkConditions(conditions: EmailCondition[], data: any): boolean {
    for (const condition of conditions) {
      const fieldValue = this.getNestedValue(data, condition.field);
      const conditionMet = this.evaluateCondition(fieldValue, condition.operator, condition.value);
      
      if (!conditionMet) {
        return false;
      }
    }
    return true;
  }

  // Ejecutar acción
  private async executeAction(action: EmailAction, data: any): Promise<void> {
    switch (action.type) {
      case 'send_email':
        const { to, templateId, variables } = action.config;
        await this.sendEmail(to, templateId, { ...variables, ...data });
        break;
      case 'add_to_list':
        // Implementar lógica para agregar a lista
        break;
      case 'remove_from_list':
        // Implementar lógica para remover de lista
        break;
      case 'update_user':
        // Implementar lógica para actualizar usuario
        break;
      case 'webhook':
        // Implementar webhook
        try {
          await fetch(action.config.url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...action.config.data, ...data })
          });
        } catch (error) {
          console.error('Webhook failed:', error);
        }
        break;
    }
  }

  // Utilidades
  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  private evaluateCondition(value: any, operator: string, expected: any): boolean {
    switch (operator) {
      case 'equals':
        return value === expected;
      case 'not_equals':
        return value !== expected;
      case 'contains':
        return String(value).includes(String(expected));
      case 'greater_than':
        return Number(value) > Number(expected);
      case 'less_than':
        return Number(value) < Number(expected);
      default:
        return false;
    }
  }

  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private simulateEmailMetrics(emailId: string): void {
    // Simular apertura (70% de probabilidad)
    if (Math.random() < 0.7) {
      setTimeout(() => {
        // Simular click (20% de probabilidad)
        if (Math.random() < 0.2) {
          console.log(`Email ${emailId} clicked`);
        }
        console.log(`Email ${emailId} opened`);
      }, Math.random() * 10000 + 5000); // 5-15 segundos
    }
  }

  // Getters
  getTemplate(id: string): EmailTemplate | undefined {
    return this.templates.get(id);
  }

  getAllTemplates(): EmailTemplate[] {
    return Array.from(this.templates.values());
  }

  getCampaign(id: string): EmailCampaign | undefined {
    return this.campaigns.get(id);
  }

  getAllCampaigns(): EmailCampaign[] {
    return Array.from(this.campaigns.values());
  }

  getAutomation(id: string): EmailAutomation | undefined {
    return this.automations.get(id);
  }

  getAllAutomations(): EmailAutomation[] {
    return Array.from(this.automations.values());
  }

  // Actualizar métricas de campaña
  updateCampaignMetrics(campaignId: string, metrics: Partial<EmailMetrics>): void {
    const campaign = this.campaigns.get(campaignId);
    if (campaign) {
      campaign.metrics = { ...campaign.metrics, ...metrics };
      
      // Recalcular tasas
      if (campaign.metrics.totalSent > 0) {
        campaign.metrics.openRate = (campaign.metrics.opened / campaign.metrics.totalSent) * 100;
        campaign.metrics.clickRate = (campaign.metrics.clicked / campaign.metrics.totalSent) * 100;
        campaign.metrics.bounceRate = (campaign.metrics.bounced / campaign.metrics.totalSent) * 100;
      }
    }
  }
}

// Instancia singleton del motor de emails
export const emailEngine = new EmailEngine();

// Funciones para crear datos de ejemplo
export const createSampleEmailTemplate = (): EmailTemplate => {
  return emailEngine.createTemplate({
    name: 'Bienvenida',
    subject: '¡Bienvenido a Stack21, {{name}}!',
    body: `
      <h1>¡Hola {{name}}!</h1>
      <p>Bienvenido a Stack21, la plataforma de automatización más avanzada.</p>
      <p>Tu cuenta ha sido creada exitosamente con el email: {{email}}</p>
      <p>¡Comienza a automatizar tu negocio hoy mismo!</p>
      <p>Saludos,<br>El equipo de Stack21</p>
    `,
    type: 'welcome',
    variables: ['name', 'email']
  });
};

export const createSampleEmailCampaign = (): EmailCampaign => {
  return emailEngine.createCampaign({
    name: 'Newsletter Semanal',
    description: 'Newsletter con las últimas novedades y tips de automatización',
    templateId: createSampleEmailTemplate().id,
    recipientList: ['usuario1@example.com', 'usuario2@example.com', 'usuario3@example.com'],
    status: 'draft'
  });
};
