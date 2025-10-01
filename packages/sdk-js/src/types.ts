// Stack21 SDK Types
export interface WorkflowDefinition {
  id: string;
  name: string;
  description?: string;
  status: 'draft' | 'active' | 'paused' | 'archived';
  isActive: boolean;
  version: number;
  projectId: string;
  createdAt: string;
  updatedAt: string;
  triggers: TriggerDefinition[];
  steps: StepDefinition[];
  variables?: Record<string, any>;
  tags?: string[];
}

export interface TriggerDefinition {
  id: string;
  type: 'http_webhook' | 'schedule' | 'app_event' | 'manual';
  config: Record<string, any>;
  isActive: boolean;
}

export interface StepDefinition {
  id: string;
  order: number;
  type: 'app_action' | 'code_step' | 'condition' | 'loop' | 'delay' | 'http_request';
  name: string;
  appId?: string;
  actionKey?: string;
  codeLang?: 'javascript' | 'python';
  code?: string;
  config?: Record<string, any>;
  position?: { x: number; y: number };
}

export interface RunPayload {
  workflowId: string;
  input: any;
  variables?: Record<string, any>;
}

export interface ActionResult {
  success: boolean;
  data?: any;
  error?: string;
  costCents?: number;
  duration?: number;
}

export interface Connection {
  id: string;
  name: string;
  appId: string;
  appName: string;
  projectId: string;
  authType: 'oauth2' | 'api_key' | 'basic_auth';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface App {
  id: string;
  slug: string;
  name: string;
  category?: string;
  description?: string;
  logoUrl?: string;
  oauthType?: string;
  docsUrl?: string;
  features: string[];
  actions: AppAction[];
  triggers: AppTrigger[];
}

export interface AppAction {
  key: string;
  name: string;
  description: string;
  configSchema: Record<string, any>;
}

export interface AppTrigger {
  key: string;
  name: string;
  description: string;
  configSchema: Record<string, any>;
}

export interface Run {
  id: string;
  workflowId: string;
  workflowName: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  input?: any;
  output?: any;
  error?: string;
  costCents: number;
  logsUrl?: string;
  startedAt: string;
  finishedAt?: string;
  duration?: number;
  runSteps: RunStep[];
}

export interface RunStep {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  input?: any;
  output?: any;
  error?: string;
  startedAt: string;
  finishedAt?: string;
  duration?: number;
}

export interface DataStore {
  id: string;
  name: string;
  type: 'kv' | 'file';
  projectId: string;
  createdAt: string;
  updatedAt: string;
}

export interface KV {
  key: string;
  value: any;
  ttl?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Webhook {
  id: string;
  path: string;
  projectId: string;
  secretHash: string;
  createdAt: string;
}

export interface Template {
  id: string;
  title: string;
  summary: string;
  description?: string;
  category?: string;
  featured: boolean;
  downloads: number;
  rating?: number;
  tags: string[];
  definitionJson: WorkflowDefinition;
  createdAt: string;
  updatedAt: string;
}

export interface Stack21Config {
  apiKey: string;
  baseUrl?: string;
  timeout?: number;
  retries?: number;
}

export interface PaginationOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface WebhookEvent {
  id: string;
  type: string;
  data: any;
  timestamp: string;
  signature: string;
}

export interface AIWorkflowRequest {
  description: string;
  projectId: string;
  context?: {
    preferredApps?: string[];
    complexity?: 'simple' | 'medium' | 'complex';
  };
}

export interface AIWorkflowResponse {
  workflow: WorkflowDefinition;
  suggestions: {
    missingConnections: string[];
    optimizations: string[];
    alternatives: WorkflowDefinition[];
  };
  explanation: string;
}
