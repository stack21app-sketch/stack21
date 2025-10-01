// Sistema de conectores para Stack21
// Cada conector implementa acciones y triggers específicos

export interface ConnectorConfig {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  logoUrl?: string;
  docsUrl?: string;
  oauthType: 'oauth2' | 'api_key' | 'basic_auth' | 'none';
  version: string;
}

export interface ConnectorAction {
  key: string;
  name: string;
  description: string;
  parameters: ConnectorParameter[];
  outputSchema?: any;
  category?: string;
}

export interface ConnectorTrigger {
  key: string;
  name: string;
  description: string;
  type: 'webhook' | 'polling' | 'event';
  configSchema?: any;
  outputSchema?: any;
}

export interface ConnectorParameter {
  key: string;
  name: string;
  type: 'string' | 'number' | 'boolean' | 'object' | 'array' | 'file';
  required: boolean;
  description?: string;
  default?: any;
  options?: { label: string; value: any }[];
}

export interface ConnectorInstance {
  config: ConnectorConfig;
  actions: ConnectorAction[];
  triggers: ConnectorTrigger[];
  
  // Métodos para ejecutar acciones
  executeAction(actionKey: string, parameters: any, credentials: any): Promise<any>;
  
  // Métodos para manejar triggers
  setupWebhook?(config: any, credentials: any): Promise<string>;
  removeWebhook?(webhookId: string, credentials: any): Promise<void>;
  pollEvents?(config: any, credentials: any): Promise<any[]>;

  // Métodos internos específicos del conector (helpers)
  [key: string]: any;
}

// Conectores disponibles
export * from './http';
export * from './gmail';
export * from './google-sheets';
export * from './slack';
export * from './notion';
export * from './github';

// Registro de conectores
export const CONNECTORS: Record<string, ConnectorInstance> = {
  'http': require('./http').httpConnector,
  'gmail': require('./gmail').gmailConnector,
  'google-sheets': require('./google-sheets').googleSheetsConnector,
  'slack': require('./slack').slackConnector,
  'notion': require('./notion').notionConnector,
  'github': require('./github').githubConnector,
};

// Función para obtener un conector
export function getConnector(slug: string): ConnectorInstance | null {
  return CONNECTORS[slug] || null;
}

// Función para listar todos los conectores
export function listConnectors(): ConnectorConfig[] {
  return Object.values(CONNECTORS).map(connector => connector.config);
}

// Función para obtener acciones de un conector
export function getConnectorActions(slug: string): ConnectorAction[] {
  const connector = getConnector(slug);
  return connector?.actions || [];
}

// Función para obtener triggers de un conector
export function getConnectorTriggers(slug: string): ConnectorTrigger[] {
  const connector = getConnector(slug);
  return connector?.triggers || [];
}
