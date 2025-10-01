// Conector Notion - Para interactuar con bases de datos y páginas de Notion

import { ConnectorInstance, ConnectorConfig, ConnectorAction, ConnectorTrigger } from './index';

export const notionConnector: ConnectorInstance = {
  config: {
    id: 'notion',
    name: 'Notion',
    slug: 'notion',
    description: 'Crear y gestionar páginas y bases de datos en Notion',
    category: 'Productivity',
    logoUrl: 'https://www.notion.so/images/logo-ios.png',
    docsUrl: 'https://developers.notion.com',
    oauthType: 'oauth2',
    version: '1.0.0',
  },

  actions: [
    {
      key: 'create_page',
      name: 'Crear Página',
      description: 'Crear una nueva página en Notion',
      parameters: [
        {
          key: 'parent',
          name: 'Página padre',
          type: 'object',
          required: true,
          description: 'ID de la página padre o base de datos',
        },
        {
          key: 'properties',
          name: 'Propiedades',
          type: 'object',
          required: true,
          description: 'Propiedades de la página',
        },
        {
          key: 'children',
          name: 'Contenido',
          type: 'array',
          required: false,
          description: 'Bloques de contenido de la página',
        },
      ],
      outputSchema: {
        type: 'object',
        properties: {
          object: { type: 'string' },
          id: { type: 'string' },
          created_time: { type: 'string' },
          last_edited_time: { type: 'string' },
          parent: { type: 'object' },
          properties: { type: 'object' },
        },
      },
    },
    {
      key: 'update_page',
      name: 'Actualizar Página',
      description: 'Actualizar una página existente en Notion',
      parameters: [
        {
          key: 'page_id',
          name: 'ID de página',
          type: 'string',
          required: true,
          description: 'ID de la página a actualizar',
        },
        {
          key: 'properties',
          name: 'Propiedades',
          type: 'object',
          required: false,
          description: 'Nuevas propiedades de la página',
        },
        {
          key: 'archived',
          name: 'Archivada',
          type: 'boolean',
          required: false,
          description: 'Si archivar la página',
        },
      ],
      outputSchema: {
        type: 'object',
        properties: {
          object: { type: 'string' },
          id: { type: 'string' },
          created_time: { type: 'string' },
          last_edited_time: { type: 'string' },
          parent: { type: 'object' },
          properties: { type: 'object' },
          archived: { type: 'boolean' },
        },
      },
    },
    {
      key: 'query_database',
      name: 'Consultar Base de Datos',
      description: 'Consultar una base de datos de Notion',
      parameters: [
        {
          key: 'database_id',
          name: 'ID de base de datos',
          type: 'string',
          required: true,
          description: 'ID de la base de datos a consultar',
        },
        {
          key: 'filter',
          name: 'Filtro',
          type: 'object',
          required: false,
          description: 'Filtros para la consulta',
        },
        {
          key: 'sorts',
          name: 'Ordenamiento',
          type: 'array',
          required: false,
          description: 'Criterios de ordenamiento',
        },
        {
          key: 'page_size',
          name: 'Tamaño de página',
          type: 'number',
          required: false,
          description: 'Número de resultados por página',
          default: 100,
        },
        {
          key: 'start_cursor',
          name: 'Cursor inicial',
          type: 'string',
          required: false,
          description: 'Cursor para paginación',
        },
      ],
      outputSchema: {
        type: 'object',
        properties: {
          object: { type: 'string' },
          results: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                object: { type: 'string' },
                id: { type: 'string' },
                created_time: { type: 'string' },
                last_edited_time: { type: 'string' },
                properties: { type: 'object' },
              },
            },
          },
          next_cursor: { type: 'string' },
          has_more: { type: 'boolean' },
        },
      },
    },
    {
      key: 'create_database',
      name: 'Crear Base de Datos',
      description: 'Crear una nueva base de datos en Notion',
      parameters: [
        {
          key: 'parent',
          name: 'Página padre',
          type: 'object',
          required: true,
          description: 'ID de la página padre',
        },
        {
          key: 'title',
          name: 'Título',
          type: 'array',
          required: true,
          description: 'Título de la base de datos',
        },
        {
          key: 'properties',
          name: 'Propiedades',
          type: 'object',
          required: true,
          description: 'Propiedades de la base de datos',
        },
        {
          key: 'description',
          name: 'Descripción',
          type: 'array',
          required: false,
          description: 'Descripción de la base de datos',
        },
      ],
      outputSchema: {
        type: 'object',
        properties: {
          object: { type: 'string' },
          id: { type: 'string' },
          created_time: { type: 'string' },
          last_edited_time: { type: 'string' },
          title: { type: 'array' },
          description: { type: 'array' },
          properties: { type: 'object' },
        },
      },
    },
  ],

  triggers: [
    {
      key: 'page_updated',
      name: 'Página Actualizada',
      description: 'Se dispara cuando se actualiza una página en Notion',
      type: 'webhook',
      outputSchema: {
        type: 'object',
        properties: {
          object: { type: 'string' },
          entry: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                last_edited_time: { type: 'string' },
                property: { type: 'string' },
              },
            },
          },
        },
      },
    },
  ],

  async executeAction(actionKey: string, parameters: any, credentials: any) {
    const { access_token } = credentials;
    
    if (!access_token) {
      throw new Error('Token de acceso de Notion requerido');
    }

    const baseUrl = 'https://api.notion.com/v1';

    switch (actionKey) {
      case 'create_page':
        return await this.createPage(parameters, access_token, baseUrl);
      
      case 'update_page':
        return await this.updatePage(parameters, access_token, baseUrl);
      
      case 'query_database':
        return await this.queryDatabase(parameters, access_token, baseUrl);
      
      case 'create_database':
        return await this.createDatabase(parameters, access_token, baseUrl);
      
      default:
        throw new Error(`Acción no soportada: ${actionKey}`);
    }
  },

  async createPage(parameters: any, accessToken: string, baseUrl: string) {
    const { parent, properties, children } = parameters;

    const body: any = {
      parent,
      properties,
    };

    if (children) {
      body.children = children;
    }

    const response = await fetch(`${baseUrl}/pages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'Notion-Version': '2022-06-28',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Error creando página: ${error}`);
    }

    return await response.json();
  },

  async updatePage(parameters: any, accessToken: string, baseUrl: string) {
    const { page_id, properties, archived } = parameters;

    const body: any = {};
    if (properties) body.properties = properties;
    if (archived !== undefined) body.archived = archived;

    const response = await fetch(`${baseUrl}/pages/${page_id}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'Notion-Version': '2022-06-28',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Error actualizando página: ${error}`);
    }

    return await response.json();
  },

  async queryDatabase(parameters: any, accessToken: string, baseUrl: string) {
    const {
      database_id,
      filter,
      sorts,
      page_size = 100,
      start_cursor,
    } = parameters;

    const body: any = {
      page_size,
    };

    if (filter) body.filter = filter;
    if (sorts) body.sorts = sorts;
    if (start_cursor) body.start_cursor = start_cursor;

    const response = await fetch(`${baseUrl}/databases/${database_id}/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'Notion-Version': '2022-06-28',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Error consultando base de datos: ${error}`);
    }

    return await response.json();
  },

  async createDatabase(parameters: any, accessToken: string, baseUrl: string) {
    const { parent, title, properties, description } = parameters;

    const body: any = {
      parent,
      title,
      properties,
    };

    if (description) {
      body.description = description;
    }

    const response = await fetch(`${baseUrl}/databases`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'Notion-Version': '2022-06-28',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Error creando base de datos: ${error}`);
    }

    return await response.json();
  },

  async setupWebhook(config: any, credentials: any) {
    // Notion webhooks requieren configuración especial
    return 'notion_webhook_setup_required';
  },

  async removeWebhook(webhookId: string, credentials: any) {
    return;
  },
};
