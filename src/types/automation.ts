// Tipos para el sistema de automatización tipo Pipedream

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
  type: 'http_webhook' | 'schedule' | 'app_event' | 'manual' | 'email' | 'form_submit';
  config: TriggerConfig;
  isActive: boolean;
  appId?: string;
}

export interface TriggerConfig {
  // HTTP Webhook
  path?: string;
  method?: string;
  headers?: Record<string, string>;
  queryParams?: Record<string, string>;
  
  // Schedule
  cron?: string;
  timezone?: string;
  
  // App Event
  eventType?: string;
  filters?: Record<string, any>;
  
  // Email
  emailAddress?: string;
  subjectFilter?: string;
  
  // Form Submit
  formId?: string;
  fields?: string[];
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
  config: StepConfig;
  position?: { x: number; y: number };
}

export interface StepConfig {
  // App Action
  action?: string;
  parameters?: Record<string, any>;
  connectionId?: string;
  
  // Code Step
  timeout?: number;
  memory?: number;
  environment?: Record<string, string>;
  
  // HTTP Request
  method?: string;
  url?: string;
  headers?: Record<string, string>;
  body?: any;
  auth?: {
    type: 'none' | 'basic' | 'bearer' | 'oauth2' | 'api_key';
    config: Record<string, any>;
  };
  
  // Condition
  condition?: string;
  trueSteps?: string[];
  falseSteps?: string[];
  
  // Loop
  loopType?: 'for' | 'while' | 'foreach';
  loopConfig?: Record<string, any>;
  
  // Delay
  delayMs?: number;
  delayUntil?: string;
}

export interface RunPayload {
  id: string;
  workflowId: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  input?: any;
  output?: any;
  error?: string;
  costCents: number;
  logsUrl?: string;
  startedAt: string;
  finishedAt?: string;
  runSteps: RunStepPayload[];
}

export interface RunStepPayload {
  id: string;
  runId: string;
  stepId?: string;
  name: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  input?: any;
  output?: any;
  error?: string;
  startedAt: string;
  finishedAt?: string;
}

export interface ActionResult {
  success: boolean;
  data?: any;
  error?: string;
  costCents?: number;
  logs?: string[];
}

export interface AppDefinition {
  id: string;
  slug: string;
  name: string;
  description?: string;
  category?: string;
  logoUrl?: string;
  docsUrl?: string;
  oauthType?: 'oauth2' | 'api_key' | 'basic_auth' | 'none';
  isActive: boolean;
  actions: AppAction[];
  triggers: AppTrigger[];
}

export interface AppAction {
  key: string;
  name: string;
  description?: string;
  parameters: AppParameter[];
  outputSchema?: any;
  category?: string;
}

export interface AppTrigger {
  key: string;
  name: string;
  description?: string;
  type: 'webhook' | 'polling' | 'event';
  configSchema?: any;
  outputSchema?: any;
}

export interface AppParameter {
  key: string;
  name: string;
  type: 'string' | 'number' | 'boolean' | 'object' | 'array' | 'file';
  required: boolean;
  description?: string;
  default?: any;
  options?: { label: string; value: any }[];
}

export interface ConnectionDefinition {
  id: string;
  name: string;
  appId: string;
  projectId: string;
  authType: 'oauth2' | 'api_key' | 'basic_auth';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  app: AppDefinition;
}

export interface DataStoreDefinition {
  id: string;
  name: string;
  type: 'kv' | 'file' | 'sql';
  projectId: string;
  config?: any;
  createdAt: string;
  updatedAt: string;
}

export interface TemplateDefinition {
  id: string;
  title: string;
  summary: string;
  description?: string;
  definitionJson: WorkflowDefinition;
  category?: string;
  featured: boolean;
  downloads: number;
  rating?: number;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface WebhookDefinition {
  id: string;
  projectId: string;
  path: string;
  secretHash: string;
  isActive: boolean;
  createdAt: string;
}

// Tipos para el Workflow Builder UI
export interface WorkflowNode {
  id: string;
  type: 'trigger' | 'action' | 'code' | 'condition' | 'loop' | 'delay';
  position: { x: number; y: number };
  data: {
    label: string;
    config: any;
    appId?: string;
    actionKey?: string;
  };
}

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  type?: string;
  animated?: boolean;
}

export interface WorkflowCanvas {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  viewport: {
    x: number;
    y: number;
    zoom: number;
  };
}

// Tipos para AI Agent Builder
export interface AIWorkflowRequest {
  description: string;
  projectId: string;
  context?: {
    existingConnections?: string[];
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

// Tipos para el SDK
export interface SDKConfig {
  apiKey: string;
  baseUrl: string;
  timeout?: number;
  retries?: number;
}

export interface SDKWorkflow {
  id: string;
  name: string;
  status: string;
  trigger: TriggerDefinition;
  steps: StepDefinition[];
}

export interface SDKRun {
  id: string;
  workflowId: string;
  status: string;
  input?: any;
  output?: any;
  error?: string;
  startedAt: string;
  finishedAt?: string;
}

// Tipos para billing y límites
export interface BillingMetrics {
  runCount: number;
  aiTokens: number;
  dataGB: number;
  storageGB: number;
  apiCalls: number;
}

export interface PlanLimits {
  maxRunsPerMonth: number;
  maxWorkflows: number;
  maxConnections: number;
  maxDataStores: number;
  maxTeamMembers: number;
  aiTokensPerMonth: number;
  storageGB: number;
  supportLevel: 'basic' | 'priority' | 'dedicated';
}

// Tipos para auditoría y seguridad
export interface AuditLog {
  id: string;
  orgId?: string;
  userId?: string;
  action: string;
  resource?: string;
  meta?: any;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}

export interface SecurityConfig {
  encryptionKey: string;
  piiRedactionPatterns: string[];
  auditRetentionDays: number;
  maxLoginAttempts: number;
  sessionTimeoutMinutes: number;
}
