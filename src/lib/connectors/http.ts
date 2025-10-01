// Conector HTTP genérico - Para hacer requests HTTP a cualquier API

import { ConnectorInstance, ConnectorConfig, ConnectorAction, ConnectorTrigger } from './index';

export const httpConnector: ConnectorInstance = {
  config: {
    id: 'http',
    name: 'HTTP Request',
    slug: 'http',
    description: 'Hacer requests HTTP a cualquier API',
    category: 'Communication',
    oauthType: 'none',
    version: '1.0.0',
  },

  actions: [
    {
      key: 'http_request',
      name: 'HTTP Request',
      description: 'Hacer una petición HTTP a cualquier URL',
      parameters: [
        {
          key: 'method',
          name: 'Método HTTP',
          type: 'string',
          required: true,
          description: 'Método HTTP a usar',
          default: 'GET',
          options: [
            { label: 'GET', value: 'GET' },
            { label: 'POST', value: 'POST' },
            { label: 'PUT', value: 'PUT' },
            { label: 'PATCH', value: 'PATCH' },
            { label: 'DELETE', value: 'DELETE' },
          ],
        },
        {
          key: 'url',
          name: 'URL',
          type: 'string',
          required: true,
          description: 'URL completa del endpoint',
        },
        {
          key: 'headers',
          name: 'Headers',
          type: 'object',
          required: false,
          description: 'Headers HTTP (JSON)',
          default: {},
        },
        {
          key: 'body',
          name: 'Body',
          type: 'string',
          required: false,
          description: 'Cuerpo de la petición',
        },
        {
          key: 'timeout',
          name: 'Timeout',
          type: 'number',
          required: false,
          description: 'Timeout en milisegundos',
          default: 30000,
        },
        {
          key: 'followRedirects',
          name: 'Seguir redirecciones',
          type: 'boolean',
          required: false,
          description: 'Si debe seguir redirecciones HTTP',
          default: true,
        },
      ],
      outputSchema: {
        type: 'object',
        properties: {
          status: { type: 'number' },
          headers: { type: 'object' },
          body: { type: 'string' },
          data: { type: 'object' },
        },
      },
    },
  ],

  triggers: [
    {
      key: 'webhook',
      name: 'Webhook',
      description: 'Recibir datos via webhook HTTP',
      type: 'webhook',
      outputSchema: {
        type: 'object',
        properties: {
          body: { type: 'string' },
          headers: { type: 'object' },
          method: { type: 'string' },
          path: { type: 'string' },
          query: { type: 'object' },
        },
      },
    },
  ],

  async executeAction(actionKey: string, parameters: any, credentials: any) {
    if (actionKey !== 'http_request') {
      throw new Error(`Acción no soportada: ${actionKey}`);
    }

    const {
      method = 'GET',
      url,
      headers = {},
      body,
      timeout = 30000,
      followRedirects = true,
    } = parameters;

    if (!url) {
      throw new Error('URL es requerida');
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
        body: body ? (typeof body === 'string' ? body : JSON.stringify(body)) : undefined,
        signal: controller.signal,
        redirect: followRedirects ? 'follow' : 'manual',
      });

      clearTimeout(timeoutId);

      const responseBody = await response.text();
      let data;
      try {
        data = JSON.parse(responseBody);
      } catch {
        data = responseBody;
      }

      return {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        body: responseBody,
        data: data,
        ok: response.ok,
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error(`Request timeout después de ${timeout}ms`);
        }
        throw error;
      }
      throw new Error(String(error));
    }
  },

  async setupWebhook(config: any, credentials: any) {
    // Los webhooks HTTP se manejan directamente por la plataforma
    // No requiere setup adicional
    return 'webhook_configured';
  },

  async removeWebhook(webhookId: string, credentials: any) {
    // No requiere cleanup adicional
    return;
  },
};
