import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import {
  WorkflowDefinition,
  RunPayload,
  Connection,
  App,
  Run,
  DataStore,
  KV,
  Webhook,
  Template,
  Stack21Config,
  PaginationOptions,
  PaginatedResponse,
  AIWorkflowRequest,
  AIWorkflowResponse,
} from './types';

export class Stack21Client {
  private client: AxiosInstance;
  private config: Stack21Config;

  constructor(config: Stack21Config) {
    this.config = {
      baseUrl: 'https://api.stack21.com',
      timeout: 30000,
      retries: 3,
      ...config,
    };

    this.client = axios.create({
      baseURL: this.config.baseUrl,
      timeout: this.config.timeout,
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor for retries
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        const config = error.config;
        if (!config || !config.retry) return Promise.reject(error);

        config.retryCount = config.retryCount || 0;
        if (config.retryCount >= this.config.retries!) {
          return Promise.reject(error);
        }

        config.retryCount++;
        await new Promise(resolve => setTimeout(resolve, 1000 * config.retryCount));
        return this.client(config);
      }
    );
  }

  // Workflows
  async getWorkflows(options?: PaginationOptions): Promise<PaginatedResponse<WorkflowDefinition>> {
    const response = await this.client.get('/workflows', { params: options });
    return response.data;
  }

  async getWorkflow(id: string): Promise<WorkflowDefinition> {
    const response = await this.client.get(`/workflows/${id}`);
    return response.data;
  }

  async createWorkflow(workflow: Omit<WorkflowDefinition, 'id' | 'createdAt' | 'updatedAt'>): Promise<WorkflowDefinition> {
    const response = await this.client.post('/workflows', workflow);
    return response.data;
  }

  async updateWorkflow(id: string, workflow: Partial<WorkflowDefinition>): Promise<WorkflowDefinition> {
    const response = await this.client.put(`/workflows/${id}`, workflow);
    return response.data;
  }

  async deleteWorkflow(id: string): Promise<void> {
    await this.client.delete(`/workflows/${id}`);
  }

  async activateWorkflow(id: string, isActive: boolean): Promise<WorkflowDefinition> {
    const response = await this.client.put(`/workflows/${id}/activate`, { isActive });
    return response.data;
  }

  // Runs
  async getRuns(options?: PaginationOptions): Promise<PaginatedResponse<Run>> {
    const response = await this.client.get('/runs', { params: options });
    return response.data;
  }

  async getRun(id: string): Promise<Run> {
    const response = await this.client.get(`/runs/${id}`);
    return response.data;
  }

  async runWorkflow(payload: RunPayload): Promise<Run> {
    const response = await this.client.post('/runs', payload);
    return response.data;
  }

  async cancelRun(id: string): Promise<Run> {
    const response = await this.client.post(`/runs/${id}/cancel`);
    return response.data;
  }

  // Apps
  async getApps(options?: PaginationOptions): Promise<PaginatedResponse<App>> {
    const response = await this.client.get('/apps', { params: options });
    return response.data;
  }

  async getApp(slug: string): Promise<App> {
    const response = await this.client.get(`/apps/${slug}`);
    return response.data;
  }

  // Connections
  async getConnections(options?: PaginationOptions): Promise<PaginatedResponse<Connection>> {
    const response = await this.client.get('/connections', { params: options });
    return response.data;
  }

  async createConnection(connection: Omit<Connection, 'id' | 'createdAt' | 'updatedAt'>): Promise<Connection> {
    const response = await this.client.post('/connections', connection);
    return response.data;
  }

  async updateConnection(id: string, connection: Partial<Connection>): Promise<Connection> {
    const response = await this.client.put(`/connections/${id}`, connection);
    return response.data;
  }

  async deleteConnection(id: string): Promise<void> {
    await this.client.delete(`/connections/${id}`);
  }

  async testConnection(id: string): Promise<{ success: boolean; error?: string }> {
    const response = await this.client.post(`/connections/${id}/test`);
    return response.data;
  }

  // Data Stores
  async getDataStores(options?: PaginationOptions): Promise<PaginatedResponse<DataStore>> {
    const response = await this.client.get('/datastores', { params: options });
    return response.data;
  }

  async createDataStore(store: Omit<DataStore, 'id' | 'createdAt' | 'updatedAt'>): Promise<DataStore> {
    const response = await this.client.post('/datastores', store);
    return response.data;
  }

  async deleteDataStore(id: string): Promise<void> {
    await this.client.delete(`/datastores/${id}`);
  }

  // Key-Value Storage
  async getKV(storeId: string, key: string): Promise<KV | null> {
    try {
      const response = await this.client.get(`/datastore/kv`, {
        params: { storeId, key }
      });
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) return null;
      throw error;
    }
  }

  async setKV(storeId: string, key: string, value: any, ttl?: number): Promise<KV> {
    const response = await this.client.post('/datastore/kv', {
      storeId,
      key,
      value,
      ttl,
    });
    return response.data;
  }

  async deleteKV(storeId: string, key: string): Promise<void> {
    await this.client.delete('/datastore/kv', {
      params: { storeId, key }
    });
  }

  async listKV(storeId: string, prefix?: string): Promise<KV[]> {
    const response = await this.client.get('/datastore/kv/list', {
      params: { storeId, prefix }
    });
    return response.data;
  }

  // Webhooks
  async getWebhooks(options?: PaginationOptions): Promise<PaginatedResponse<Webhook>> {
    const response = await this.client.get('/webhooks', { params: options });
    return response.data;
  }

  async createWebhook(webhook: Omit<Webhook, 'id' | 'createdAt'>): Promise<Webhook> {
    const response = await this.client.post('/webhooks', webhook);
    return response.data;
  }

  async deleteWebhook(id: string): Promise<void> {
    await this.client.delete(`/webhooks/${id}`);
  }

  // Templates
  async getTemplates(options?: PaginationOptions): Promise<PaginatedResponse<Template>> {
    const response = await this.client.get('/templates', { params: options });
    return response.data;
  }

  async getTemplate(id: string): Promise<Template> {
    const response = await this.client.get(`/templates/${id}`);
    return response.data;
  }

  async applyTemplate(id: string, projectId: string): Promise<WorkflowDefinition> {
    const response = await this.client.post(`/templates/${id}/apply`, { projectId });
    return response.data;
  }

  // AI Assistant
  async generateWorkflow(request: AIWorkflowRequest): Promise<AIWorkflowResponse> {
    const response = await this.client.post('/ai/assist', request);
    return response.data;
  }

  // Utility methods
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    const response = await this.client.get('/health');
    return response.data;
  }

  async getUsage(): Promise<{
    runs: { current: number; limit: number };
    storage: { current: number; limit: number };
    aiTokens: { current: number; limit: number };
  }> {
    const response = await this.client.get('/usage');
    return response.data;
  }

  // Webhook verification
  verifyWebhook(payload: string, signature: string, secret: string): boolean {
    const crypto = require('crypto');
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex');
    
    return crypto.timingSafeEqual(
      Buffer.from(signature, 'hex'),
      Buffer.from(expectedSignature, 'hex')
    );
  }

  // Event streaming (WebSocket)
  subscribeToRuns(callback: (run: Run) => void): () => void {
    // TODO: Implement WebSocket connection
    console.warn('WebSocket subscription not implemented yet');
    return () => {};
  }

  subscribeToWorkflow(workflowId: string, callback: (run: Run) => void): () => void {
    // TODO: Implement WebSocket connection for specific workflow
    console.warn('WebSocket subscription not implemented yet');
    return () => {};
  }
}

// Factory function
export function createClient(config: Stack21Config): Stack21Client {
  return new Stack21Client(config);
}

// Default export
export default Stack21Client;
