// Conector Google Sheets - Para leer y escribir en hojas de cálculo

import { ConnectorInstance, ConnectorConfig, ConnectorAction, ConnectorTrigger } from './index';

export const googleSheetsConnector: ConnectorInstance = {
  config: {
    id: 'google-sheets',
    name: 'Google Sheets',
    slug: 'google-sheets',
    description: 'Leer y escribir en hojas de cálculo de Google',
    category: 'Productivity',
    logoUrl: 'https://ssl.gstatic.com/docs/spreadsheets/favicon.ico',
    docsUrl: 'https://developers.google.com/sheets/api',
    oauthType: 'oauth2',
    version: '1.0.0',
  },

  actions: [
    {
      key: 'read_sheet',
      name: 'Leer Hoja',
      description: 'Leer datos de una hoja de cálculo',
      parameters: [
        {
          key: 'spreadsheetId',
          name: 'ID de la hoja',
          type: 'string',
          required: true,
          description: 'ID de la hoja de cálculo de Google',
        },
        {
          key: 'range',
          name: 'Rango',
          type: 'string',
          required: true,
          description: 'Rango a leer (ej: "Sheet1!A1:Z100")',
        },
        {
          key: 'valueRenderOption',
          name: 'Formato de valores',
          type: 'string',
          required: false,
          description: 'Cómo renderizar los valores',
          default: 'FORMATTED_VALUE',
          options: [
            { label: 'Valores formateados', value: 'FORMATTED_VALUE' },
            { label: 'Valores sin formato', value: 'UNFORMATTED_VALUE' },
            { label: 'Fórmulas', value: 'FORMULA' },
          ],
        },
        {
          key: 'dateTimeRenderOption',
          name: 'Formato de fechas',
          type: 'string',
          required: false,
          description: 'Cómo renderizar fechas y horas',
          default: 'SERIAL_NUMBER',
          options: [
            { label: 'Número serial', value: 'SERIAL_NUMBER' },
            { label: 'Cadena formateada', value: 'FORMATTED_STRING' },
          ],
        },
      ],
      outputSchema: {
        type: 'object',
        properties: {
          range: { type: 'string' },
          majorDimension: { type: 'string' },
          values: {
            type: 'array',
            items: {
              type: 'array',
              items: { type: 'string' },
            },
          },
        },
      },
    },
    {
      key: 'write_sheet',
      name: 'Escribir Hoja',
      description: 'Escribir datos en una hoja de cálculo',
      parameters: [
        {
          key: 'spreadsheetId',
          name: 'ID de la hoja',
          type: 'string',
          required: true,
          description: 'ID de la hoja de cálculo de Google',
        },
        {
          key: 'range',
          name: 'Rango',
          type: 'string',
          required: true,
          description: 'Rango donde escribir (ej: "Sheet1!A1:Z100")',
        },
        {
          key: 'values',
          name: 'Valores',
          type: 'array',
          required: true,
          description: 'Array de arrays con los valores a escribir',
        },
        {
          key: 'valueInputOption',
          name: 'Opción de entrada',
          type: 'string',
          required: false,
          description: 'Cómo interpretar los valores',
          default: 'RAW',
          options: [
            { label: 'Valores sin procesar', value: 'RAW' },
            { label: 'Valores de usuario', value: 'USER_ENTERED' },
          ],
        },
      ],
      outputSchema: {
        type: 'object',
        properties: {
          spreadsheetId: { type: 'string' },
          updatedRange: { type: 'string' },
          updatedRows: { type: 'number' },
          updatedColumns: { type: 'number' },
          updatedCells: { type: 'number' },
        },
      },
    },
    {
      key: 'append_sheet',
      name: 'Añadir a Hoja',
      description: 'Añadir filas al final de una hoja',
      parameters: [
        {
          key: 'spreadsheetId',
          name: 'ID de la hoja',
          type: 'string',
          required: true,
          description: 'ID de la hoja de cálculo de Google',
        },
        {
          key: 'range',
          name: 'Rango',
          type: 'string',
          required: true,
          description: 'Rango de la tabla (ej: "Sheet1!A:Z")',
        },
        {
          key: 'values',
          name: 'Valores',
          type: 'array',
          required: true,
          description: 'Array de arrays con los valores a añadir',
        },
        {
          key: 'valueInputOption',
          name: 'Opción de entrada',
          type: 'string',
          required: false,
          description: 'Cómo interpretar los valores',
          default: 'RAW',
          options: [
            { label: 'Valores sin procesar', value: 'RAW' },
            { label: 'Valores de usuario', value: 'USER_ENTERED' },
          ],
        },
        {
          key: 'insertDataOption',
          name: 'Opción de inserción',
          type: 'string',
          required: false,
          description: 'Cómo insertar los datos',
          default: 'INSERT_ROWS',
          options: [
            { label: 'Insertar filas', value: 'INSERT_ROWS' },
            { label: 'Sobrescribir', value: 'OVERWRITE' },
          ],
        },
      ],
      outputSchema: {
        type: 'object',
        properties: {
          spreadsheetId: { type: 'string' },
          tableRange: { type: 'string' },
          updates: {
            type: 'object',
            properties: {
              spreadsheetId: { type: 'string' },
              updatedRange: { type: 'string' },
              updatedRows: { type: 'number' },
              updatedColumns: { type: 'number' },
              updatedCells: { type: 'number' },
            },
          },
        },
      },
    },
    {
      key: 'create_sheet',
      name: 'Crear Hoja',
      description: 'Crear una nueva hoja de cálculo',
      parameters: [
        {
          key: 'title',
          name: 'Título',
          type: 'string',
          required: true,
          description: 'Título de la nueva hoja de cálculo',
        },
        {
          key: 'locale',
          name: 'Idioma',
          type: 'string',
          required: false,
          description: 'Código de idioma (ej: "es_ES")',
          default: 'es_ES',
        },
        {
          key: 'timeZone',
          name: 'Zona horaria',
          type: 'string',
          required: false,
          description: 'Zona horaria (ej: "Europe/Madrid")',
          default: 'Europe/Madrid',
        },
      ],
      outputSchema: {
        type: 'object',
        properties: {
          spreadsheetId: { type: 'string' },
          properties: {
            type: 'object',
            properties: {
              title: { type: 'string' },
              locale: { type: 'string' },
              timeZone: { type: 'string' },
            },
          },
          sheets: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                properties: {
                  type: 'object',
                  properties: {
                    sheetId: { type: 'number' },
                    title: { type: 'string' },
                  },
                },
              },
            },
          },
        },
      },
    },
  ],

  triggers: [
    {
      key: 'sheet_updated',
      name: 'Hoja Actualizada',
      description: 'Se dispara cuando se actualiza una hoja de cálculo',
      type: 'webhook',
      outputSchema: {
        type: 'object',
        properties: {
          spreadsheetId: { type: 'string' },
          updatedRange: { type: 'string' },
          updatedCells: { type: 'number' },
          timestamp: { type: 'string' },
        },
      },
    },
  ],

  async executeAction(actionKey: string, parameters: any, credentials: any) {
    const { access_token } = credentials;
    
    if (!access_token) {
      throw new Error('Token de acceso de Google Sheets requerido');
    }

    const baseUrl = 'https://sheets.googleapis.com/v4/spreadsheets';

    switch (actionKey) {
      case 'read_sheet':
        return await this.readSheet(parameters, access_token, baseUrl);
      
      case 'write_sheet':
        return await this.writeSheet(parameters, access_token, baseUrl);
      
      case 'append_sheet':
        return await this.appendSheet(parameters, access_token, baseUrl);
      
      case 'create_sheet':
        return await this.createSheet(parameters, access_token);
      
      default:
        throw new Error(`Acción no soportada: ${actionKey}`);
    }
  },

  async readSheet(parameters: any, accessToken: string, baseUrl: string) {
    const {
      spreadsheetId,
      range,
      valueRenderOption = 'FORMATTED_VALUE',
      dateTimeRenderOption = 'SERIAL_NUMBER',
    } = parameters;

    const searchParams = new URLSearchParams({
      valueRenderOption,
      dateTimeRenderOption,
    });

    const response = await fetch(`${baseUrl}/${spreadsheetId}/values/${range}?${searchParams}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Error leyendo hoja: ${error}`);
    }

    return await response.json();
  },

  async writeSheet(parameters: any, accessToken: string, baseUrl: string) {
    const {
      spreadsheetId,
      range,
      values,
      valueInputOption = 'RAW',
    } = parameters;

    const response = await fetch(`${baseUrl}/${spreadsheetId}/values/${range}?valueInputOption=${valueInputOption}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        values,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Error escribiendo hoja: ${error}`);
    }

    return await response.json();
  },

  async appendSheet(parameters: any, accessToken: string, baseUrl: string) {
    const {
      spreadsheetId,
      range,
      values,
      valueInputOption = 'RAW',
      insertDataOption = 'INSERT_ROWS',
    } = parameters;

    const searchParams = new URLSearchParams({
      valueInputOption,
      insertDataOption,
    });

    const response = await fetch(`${baseUrl}/${spreadsheetId}/values/${range}:append?${searchParams}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        values,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Error añadiendo a hoja: ${error}`);
    }

    return await response.json();
  },

  async createSheet(parameters: any, accessToken: string) {
    const {
      title,
      locale = 'es_ES',
      timeZone = 'Europe/Madrid',
    } = parameters;

    const response = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        properties: {
          title,
          locale,
          timeZone,
        },
        sheets: [
          {
            properties: {
              title: 'Sheet1',
            },
          },
        ],
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Error creando hoja: ${error}`);
    }

    return await response.json();
  },

  async setupWebhook(config: any, credentials: any) {
    // Google Sheets webhooks requieren configuración especial
    return 'sheets_webhook_setup_required';
  },

  async removeWebhook(webhookId: string, credentials: any) {
    return;
  },
};
