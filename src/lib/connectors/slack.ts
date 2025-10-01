// Conector Slack - Para enviar mensajes y interactuar con Slack

import { ConnectorInstance, ConnectorConfig, ConnectorAction, ConnectorTrigger } from './index';

export const slackConnector: ConnectorInstance = {
  config: {
    id: 'slack',
    name: 'Slack',
    slug: 'slack',
    description: 'Enviar mensajes y interactuar con Slack',
    category: 'Communication',
    logoUrl: 'https://a.slack-edge.com/80588/marketing/img/icons/icon_slack_hash.png',
    docsUrl: 'https://api.slack.com',
    oauthType: 'oauth2',
    version: '1.0.0',
  },

  actions: [
    {
      key: 'send_message',
      name: 'Enviar Mensaje',
      description: 'Enviar un mensaje a un canal o usuario de Slack',
      parameters: [
        {
          key: 'channel',
          name: 'Canal',
          type: 'string',
          required: true,
          description: 'ID del canal o nombre (ej: #general, @usuario)',
        },
        {
          key: 'text',
          name: 'Texto',
          type: 'string',
          required: true,
          description: 'Texto del mensaje',
        },
        {
          key: 'blocks',
          name: 'Bloques',
          type: 'array',
          required: false,
          description: 'Bloques de Slack para formato avanzado',
        },
        {
          key: 'attachments',
          name: 'Adjuntos',
          type: 'array',
          required: false,
          description: 'Adjuntos del mensaje',
        },
        {
          key: 'thread_ts',
          name: 'Hilo',
          type: 'string',
          required: false,
          description: 'Timestamp del mensaje padre para responder en hilo',
        },
        {
          key: 'username',
          name: 'Nombre de usuario',
          type: 'string',
          required: false,
          description: 'Nombre de usuario personalizado',
        },
        {
          key: 'icon_emoji',
          name: 'Icono emoji',
          type: 'string',
          required: false,
          description: 'Emoji para el icono del bot',
        },
      ],
      outputSchema: {
        type: 'object',
        properties: {
          ok: { type: 'boolean' },
          channel: { type: 'string' },
          ts: { type: 'string' },
          message: { type: 'object' },
        },
      },
    },
    {
      key: 'update_message',
      name: 'Actualizar Mensaje',
      description: 'Actualizar un mensaje existente en Slack',
      parameters: [
        {
          key: 'channel',
          name: 'Canal',
          type: 'string',
          required: true,
          description: 'ID del canal',
        },
        {
          key: 'ts',
          name: 'Timestamp',
          type: 'string',
          required: true,
          description: 'Timestamp del mensaje a actualizar',
        },
        {
          key: 'text',
          name: 'Texto',
          type: 'string',
          required: false,
          description: 'Nuevo texto del mensaje',
        },
        {
          key: 'blocks',
          name: 'Bloques',
          type: 'array',
          required: false,
          description: 'Nuevos bloques del mensaje',
        },
        {
          key: 'attachments',
          name: 'Adjuntos',
          type: 'array',
          required: false,
          description: 'Nuevos adjuntos del mensaje',
        },
      ],
      outputSchema: {
        type: 'object',
        properties: {
          ok: { type: 'boolean' },
          channel: { type: 'string' },
          ts: { type: 'string' },
          message: { type: 'object' },
        },
      },
    },
    {
      key: 'get_channels',
      name: 'Obtener Canales',
      description: 'Obtener lista de canales del workspace',
      parameters: [
        {
          key: 'types',
          name: 'Tipos',
          type: 'string',
          required: false,
          description: 'Tipos de canales (public_channel,private_channel,mpim,im)',
          default: 'public_channel,private_channel',
        },
        {
          key: 'limit',
          name: 'Límite',
          type: 'number',
          required: false,
          description: 'Número máximo de canales a obtener',
          default: 100,
        },
        {
          key: 'exclude_archived',
          name: 'Excluir archivados',
          type: 'boolean',
          required: false,
          description: 'Si excluir canales archivados',
          default: true,
        },
      ],
      outputSchema: {
        type: 'object',
        properties: {
          ok: { type: 'boolean' },
          channels: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                name: { type: 'string' },
                is_channel: { type: 'boolean' },
                is_group: { type: 'boolean' },
                is_im: { type: 'boolean' },
                is_private: { type: 'boolean' },
                is_archived: { type: 'boolean' },
                is_member: { type: 'boolean' },
                num_members: { type: 'number' },
                topic: { type: 'object' },
                purpose: { type: 'object' },
              },
            },
          },
        },
      },
    },
    {
      key: 'get_users',
      name: 'Obtener Usuarios',
      description: 'Obtener lista de usuarios del workspace',
      parameters: [
        {
          key: 'limit',
          name: 'Límite',
          type: 'number',
          required: false,
          description: 'Número máximo de usuarios a obtener',
          default: 100,
        },
        {
          key: 'include_locale',
          name: 'Incluir idioma',
          type: 'boolean',
          required: false,
          description: 'Si incluir información de idioma',
          default: false,
        },
      ],
      outputSchema: {
        type: 'object',
        properties: {
          ok: { type: 'boolean' },
          members: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                name: { type: 'string' },
                real_name: { type: 'string' },
                profile: { type: 'object' },
                is_admin: { type: 'boolean' },
                is_owner: { type: 'boolean' },
                is_bot: { type: 'boolean' },
                deleted: { type: 'boolean' },
              },
            },
          },
        },
      },
    },
  ],

  triggers: [
    {
      key: 'message_posted',
      name: 'Mensaje Publicado',
      description: 'Se dispara cuando se publica un mensaje en un canal',
      type: 'webhook',
      outputSchema: {
        type: 'object',
        properties: {
          type: { type: 'string' },
          channel: { type: 'string' },
          user: { type: 'string' },
          text: { type: 'string' },
          ts: { type: 'string' },
          thread_ts: { type: 'string' },
        },
      },
    },
    {
      key: 'reaction_added',
      name: 'Reacción Añadida',
      description: 'Se dispara cuando se añade una reacción a un mensaje',
      type: 'webhook',
      outputSchema: {
        type: 'object',
        properties: {
          type: { type: 'string' },
          user: { type: 'string' },
          reaction: { type: 'string' },
          item: { type: 'object' },
          event_ts: { type: 'string' },
        },
      },
    },
  ],

  async executeAction(actionKey: string, parameters: any, credentials: any) {
    const { access_token } = credentials;
    
    if (!access_token) {
      throw new Error('Token de acceso de Slack requerido');
    }

    const baseUrl = 'https://slack.com/api';

    switch (actionKey) {
      case 'send_message':
        return await this.sendMessage(parameters, access_token, baseUrl);
      
      case 'update_message':
        return await this.updateMessage(parameters, access_token, baseUrl);
      
      case 'get_channels':
        return await this.getChannels(parameters, access_token, baseUrl);
      
      case 'get_users':
        return await this.getUsers(parameters, access_token, baseUrl);
      
      default:
        throw new Error(`Acción no soportada: ${actionKey}`);
    }
  },

  async sendMessage(parameters: any, accessToken: string, baseUrl: string) {
    const {
      channel,
      text,
      blocks,
      attachments,
      thread_ts,
      username,
      icon_emoji,
    } = parameters;

    const body: any = {
      channel,
      text,
    };

    if (blocks) body.blocks = blocks;
    if (attachments) body.attachments = attachments;
    if (thread_ts) body.thread_ts = thread_ts;
    if (username) body.username = username;
    if (icon_emoji) body.icon_emoji = icon_emoji;

    const response = await fetch(`${baseUrl}/chat.postMessage`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const result = await response.json();

    if (!result.ok) {
      throw new Error(`Error enviando mensaje: ${result.error}`);
    }

    return result;
  },

  async updateMessage(parameters: any, accessToken: string, baseUrl: string) {
    const {
      channel,
      ts,
      text,
      blocks,
      attachments,
    } = parameters;

    const body: any = {
      channel,
      ts,
    };

    if (text) body.text = text;
    if (blocks) body.blocks = blocks;
    if (attachments) body.attachments = attachments;

    const response = await fetch(`${baseUrl}/chat.update`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const result = await response.json();

    if (!result.ok) {
      throw new Error(`Error actualizando mensaje: ${result.error}`);
    }

    return result;
  },

  async getChannels(parameters: any, accessToken: string, baseUrl: string) {
    const {
      types = 'public_channel,private_channel',
      limit = 100,
      exclude_archived = true,
    } = parameters;

    const searchParams = new URLSearchParams({
      types,
      limit: limit.toString(),
      exclude_archived: exclude_archived.toString(),
    });

    const response = await fetch(`${baseUrl}/conversations.list?${searchParams}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    const result = await response.json();

    if (!result.ok) {
      throw new Error(`Error obteniendo canales: ${result.error}`);
    }

    return result;
  },

  async getUsers(parameters: any, accessToken: string, baseUrl: string) {
    const {
      limit = 100,
      include_locale = false,
    } = parameters;

    const searchParams = new URLSearchParams({
      limit: limit.toString(),
      include_locale: include_locale.toString(),
    });

    const response = await fetch(`${baseUrl}/users.list?${searchParams}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    const result = await response.json();

    if (!result.ok) {
      throw new Error(`Error obteniendo usuarios: ${result.error}`);
    }

    return result;
  },

  async setupWebhook(config: any, credentials: any) {
    // Slack webhooks requieren configuración de eventos en la app de Slack
    return 'slack_webhook_setup_required';
  },

  async removeWebhook(webhookId: string, credentials: any) {
    return;
  },
};
