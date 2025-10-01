// Conector Gmail - Para enviar y recibir emails

import { ConnectorInstance, ConnectorConfig, ConnectorAction, ConnectorTrigger } from './index';

export const gmailConnector: ConnectorInstance = {
  config: {
    id: 'gmail',
    name: 'Gmail',
    slug: 'gmail',
    description: 'Enviar y recibir emails con Gmail',
    category: 'Communication',
    logoUrl: 'https://ssl.gstatic.com/ui/v1/icons/mail/rfr/gmail.ico',
    docsUrl: 'https://developers.google.com/gmail/api',
    oauthType: 'oauth2',
    version: '1.0.0',
  },

  actions: [
    {
      key: 'send_email',
      name: 'Enviar Email',
      description: 'Enviar un email usando Gmail',
      parameters: [
        {
          key: 'to',
          name: 'Para',
          type: 'string',
          required: true,
          description: 'Dirección de email del destinatario',
        },
        {
          key: 'subject',
          name: 'Asunto',
          type: 'string',
          required: true,
          description: 'Asunto del email',
        },
        {
          key: 'body',
          name: 'Cuerpo',
          type: 'string',
          required: true,
          description: 'Cuerpo del email (HTML o texto)',
        },
        {
          key: 'cc',
          name: 'CC',
          type: 'string',
          required: false,
          description: 'Direcciones de email en copia (separadas por comas)',
        },
        {
          key: 'bcc',
          name: 'BCC',
          type: 'string',
          required: false,
          description: 'Direcciones de email en copia oculta (separadas por comas)',
        },
        {
          key: 'isHtml',
          name: 'Es HTML',
          type: 'boolean',
          required: false,
          description: 'Si el cuerpo del email es HTML',
          default: false,
        },
        {
          key: 'attachments',
          name: 'Adjuntos',
          type: 'array',
          required: false,
          description: 'Archivos adjuntos',
        },
      ],
      outputSchema: {
        type: 'object',
        properties: {
          messageId: { type: 'string' },
          threadId: { type: 'string' },
          labelIds: { type: 'array' },
        },
      },
    },
    {
      key: 'get_emails',
      name: 'Obtener Emails',
      description: 'Obtener emails de la bandeja de entrada',
      parameters: [
        {
          key: 'query',
          name: 'Consulta',
          type: 'string',
          required: false,
          description: 'Consulta de búsqueda de Gmail (ej: "is:unread from:example@gmail.com")',
        },
        {
          key: 'maxResults',
          name: 'Máximo de resultados',
          type: 'number',
          required: false,
          description: 'Número máximo de emails a obtener',
          default: 10,
        },
        {
          key: 'includeSpamTrash',
          name: 'Incluir spam y papelera',
          type: 'boolean',
          required: false,
          description: 'Si incluir emails en spam y papelera',
          default: false,
        },
      ],
      outputSchema: {
        type: 'object',
        properties: {
          messages: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                threadId: { type: 'string' },
                snippet: { type: 'string' },
                payload: { type: 'object' },
              },
            },
          },
          nextPageToken: { type: 'string' },
          resultSizeEstimate: { type: 'number' },
        },
      },
    },
    {
      key: 'get_email',
      name: 'Obtener Email',
      description: 'Obtener un email específico por ID',
      parameters: [
        {
          key: 'messageId',
          name: 'ID del mensaje',
          type: 'string',
          required: true,
          description: 'ID del mensaje de Gmail',
        },
        {
          key: 'format',
          name: 'Formato',
          type: 'string',
          required: false,
          description: 'Formato de respuesta',
          default: 'full',
          options: [
            { label: 'Minimal', value: 'minimal' },
            { label: 'Full', value: 'full' },
            { label: 'Raw', value: 'raw' },
            { label: 'Metadata', value: 'metadata' },
          ],
        },
      ],
      outputSchema: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          threadId: { type: 'string' },
          snippet: { type: 'string' },
          payload: { type: 'object' },
          sizeEstimate: { type: 'number' },
          historyId: { type: 'string' },
        },
      },
    },
  ],

  triggers: [
    {
      key: 'new_email',
      name: 'Nuevo Email',
      description: 'Se dispara cuando llega un nuevo email',
      type: 'webhook',
      outputSchema: {
        type: 'object',
        properties: {
          messageId: { type: 'string' },
          threadId: { type: 'string' },
          from: { type: 'string' },
          to: { type: 'string' },
          subject: { type: 'string' },
          snippet: { type: 'string' },
          timestamp: { type: 'string' },
        },
      },
    },
  ],

  async executeAction(actionKey: string, parameters: any, credentials: any) {
    const { access_token } = credentials;
    
    if (!access_token) {
      throw new Error('Token de acceso de Gmail requerido');
    }

    const baseUrl = 'https://gmail.googleapis.com/gmail/v1';

    switch (actionKey) {
      case 'send_email':
        return await this.sendEmail(parameters, access_token, baseUrl);
      
      case 'get_emails':
        return await this.getEmails(parameters, access_token, baseUrl);
      
      case 'get_email':
        return await this.getEmail(parameters, access_token, baseUrl);
      
      default:
        throw new Error(`Acción no soportada: ${actionKey}`);
    }
  },

  async sendEmail(parameters: any, accessToken: string, baseUrl: string) {
    const {
      to,
      subject,
      body,
      cc,
      bcc,
      isHtml = false,
      attachments = [],
    } = parameters;

    // Construir el mensaje MIME
    const message = this.buildMimeMessage({
      to,
      subject,
      body,
      cc,
      bcc,
      isHtml,
      attachments,
    });

    const response = await fetch(`${baseUrl}/users/me/messages/send`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        raw: Buffer.from(message).toString('base64url'),
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Error enviando email: ${error}`);
    }

    return await response.json();
  },

  async getEmails(parameters: any, accessToken: string, baseUrl: string) {
    const {
      query = '',
      maxResults = 10,
      includeSpamTrash = false,
    } = parameters;

    const searchParams = new URLSearchParams({
      maxResults: maxResults.toString(),
      includeSpamTrash: includeSpamTrash.toString(),
    });

    if (query) {
      searchParams.append('q', query);
    }

    const response = await fetch(`${baseUrl}/users/me/messages?${searchParams}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Error obteniendo emails: ${error}`);
    }

    return await response.json();
  },

  async getEmail(parameters: any, accessToken: string, baseUrl: string) {
    const { messageId, format = 'full' } = parameters;

    const response = await fetch(`${baseUrl}/users/me/messages/${messageId}?format=${format}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Error obteniendo email: ${error}`);
    }

    return await response.json();
  },

  buildMimeMessage(options: any): string {
    const { to, subject, body, cc, bcc, isHtml, attachments } = options;
    
    let message = `To: ${to}\r\n`;
    if (cc) message += `Cc: ${cc}\r\n`;
    if (bcc) message += `Bcc: ${bcc}\r\n`;
    message += `Subject: ${subject}\r\n`;
    message += `MIME-Version: 1.0\r\n`;
    
    if (attachments && attachments.length > 0) {
      const boundary = `boundary_${Date.now()}`;
      message += `Content-Type: multipart/mixed; boundary="${boundary}"\r\n\r\n`;
      
      // Cuerpo del mensaje
      message += `--${boundary}\r\n`;
      message += `Content-Type: ${isHtml ? 'text/html' : 'text/plain'}; charset=UTF-8\r\n\r\n`;
      message += `${body}\r\n\r\n`;
      
      // Adjuntos
      for (const attachment of attachments) {
        message += `--${boundary}\r\n`;
        message += `Content-Type: ${attachment.type || 'application/octet-stream'}\r\n`;
        message += `Content-Disposition: attachment; filename="${attachment.filename}"\r\n`;
        message += `Content-Transfer-Encoding: base64\r\n\r\n`;
        message += `${attachment.data}\r\n\r\n`;
      }
      
      message += `--${boundary}--\r\n`;
    } else {
      message += `Content-Type: ${isHtml ? 'text/html' : 'text/plain'}; charset=UTF-8\r\n\r\n`;
      message += `${body}\r\n`;
    }
    
    return message;
  },

  async setupWebhook(config: any, credentials: any) {
    // Gmail webhooks requieren configuración especial con Google Cloud Pub/Sub
    // Por ahora retornamos un ID temporal
    return 'gmail_webhook_setup_required';
  },

  async removeWebhook(webhookId: string, credentials: any) {
    // Cleanup de webhook de Gmail
    return;
  },
};
