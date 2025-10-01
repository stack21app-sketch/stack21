// React hooks for Stack21 SDK
import { useState, useEffect, useCallback } from 'react';
import { Stack21Client } from './client';
import {
  WorkflowDefinition,
  Run,
  Connection,
  App,
  DataStore,
  KV,
  Template,
  PaginationOptions,
  PaginatedResponse,
  AIWorkflowRequest,
  AIWorkflowResponse,
} from './types';

// Hook for managing workflows
export function useWorkflows(client: Stack21Client, options?: PaginationOptions) {
  const [workflows, setWorkflows] = useState<WorkflowDefinition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<any>(null);

  const loadWorkflows = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await client.getWorkflows(options);
      setWorkflows(response.data);
      setPagination(response.pagination);
    } catch (err: any) {
      setError(err.message || 'Error cargando workflows');
    } finally {
      setLoading(false);
    }
  }, [client, options]);

  useEffect(() => {
    loadWorkflows();
  }, [loadWorkflows]);

  const createWorkflow = useCallback(async (workflow: Omit<WorkflowDefinition, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newWorkflow = await client.createWorkflow(workflow);
      setWorkflows(prev => [newWorkflow, ...prev]);
      return newWorkflow;
    } catch (err: any) {
      setError(err.message || 'Error creando workflow');
      throw err;
    }
  }, [client]);

  const updateWorkflow = useCallback(async (id: string, updates: Partial<WorkflowDefinition>) => {
    try {
      const updatedWorkflow = await client.updateWorkflow(id, updates);
      setWorkflows(prev => prev.map(w => w.id === id ? updatedWorkflow : w));
      return updatedWorkflow;
    } catch (err: any) {
      setError(err.message || 'Error actualizando workflow');
      throw err;
    }
  }, [client]);

  const deleteWorkflow = useCallback(async (id: string) => {
    try {
      await client.deleteWorkflow(id);
      setWorkflows(prev => prev.filter(w => w.id !== id));
    } catch (err: any) {
      setError(err.message || 'Error eliminando workflow');
      throw err;
    }
  }, [client]);

  return {
    workflows,
    loading,
    error,
    pagination,
    loadWorkflows,
    createWorkflow,
    updateWorkflow,
    deleteWorkflow,
  };
}

// Hook for managing runs
export function useRuns(client: Stack21Client, options?: PaginationOptions) {
  const [runs, setRuns] = useState<Run[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadRuns = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await client.getRuns(options);
      setRuns(response.data);
    } catch (err: any) {
      setError(err.message || 'Error cargando runs');
    } finally {
      setLoading(false);
    }
  }, [client, options]);

  useEffect(() => {
    loadRuns();
  }, [loadRuns]);

  const runWorkflow = useCallback(async (payload: { workflowId: string; input: any }) => {
    try {
      const run = await client.runWorkflow(payload);
      setRuns(prev => [run, ...prev]);
      return run;
    } catch (err: any) {
      setError(err.message || 'Error ejecutando workflow');
      throw err;
    }
  }, [client]);

  return {
    runs,
    loading,
    error,
    loadRuns,
    runWorkflow,
  };
}

// Hook for managing connections
export function useConnections(client: Stack21Client, options?: PaginationOptions) {
  const [connections, setConnections] = useState<Connection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadConnections = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await client.getConnections(options);
      setConnections(response.data);
    } catch (err: any) {
      setError(err.message || 'Error cargando conexiones');
    } finally {
      setLoading(false);
    }
  }, [client, options]);

  useEffect(() => {
    loadConnections();
  }, [loadConnections]);

  const createConnection = useCallback(async (connection: Omit<Connection, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newConnection = await client.createConnection(connection);
      setConnections(prev => [newConnection, ...prev]);
      return newConnection;
    } catch (err: any) {
      setError(err.message || 'Error creando conexión');
      throw err;
    }
  }, [client]);

  const testConnection = useCallback(async (id: string) => {
    try {
      return await client.testConnection(id);
    } catch (err: any) {
      setError(err.message || 'Error probando conexión');
      throw err;
    }
  }, [client]);

  return {
    connections,
    loading,
    error,
    loadConnections,
    createConnection,
    testConnection,
  };
}

// Hook for managing apps
export function useApps(client: Stack21Client, options?: PaginationOptions) {
  const [apps, setApps] = useState<App[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadApps = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await client.getApps(options);
      setApps(response.data);
    } catch (err: any) {
      setError(err.message || 'Error cargando apps');
    } finally {
      setLoading(false);
    }
  }, [client, options]);

  useEffect(() => {
    loadApps();
  }, [loadApps]);

  return {
    apps,
    loading,
    error,
    loadApps,
  };
}

// Hook for managing data stores
export function useDataStores(client: Stack21Client, options?: PaginationOptions) {
  const [dataStores, setDataStores] = useState<DataStore[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDataStores = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await client.getDataStores(options);
      setDataStores(response.data);
    } catch (err: any) {
      setError(err.message || 'Error cargando data stores');
    } finally {
      setLoading(false);
    }
  }, [client, options]);

  useEffect(() => {
    loadDataStores();
  }, [loadDataStores]);

  const createDataStore = useCallback(async (store: Omit<DataStore, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newStore = await client.createDataStore(store);
      setDataStores(prev => [newStore, ...prev]);
      return newStore;
    } catch (err: any) {
      setError(err.message || 'Error creando data store');
      throw err;
    }
  }, [client]);

  return {
    dataStores,
    loading,
    error,
    loadDataStores,
    createDataStore,
  };
}

// Hook for managing key-value storage
export function useKV(client: Stack21Client, storeId: string) {
  const [kv, setKv] = useState<KV[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadKV = useCallback(async (prefix?: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await client.listKV(storeId, prefix);
      setKv(data);
    } catch (err: any) {
      setError(err.message || 'Error cargando KV');
    } finally {
      setLoading(false);
    }
  }, [client, storeId]);

  useEffect(() => {
    loadKV();
  }, [loadKV]);

  const setValue = useCallback(async (key: string, value: any, ttl?: number) => {
    try {
      const newKV = await client.setKV(storeId, key, value, ttl);
      setKv(prev => {
        const existing = prev.find(k => k.key === key);
        if (existing) {
          return prev.map(k => k.key === key ? newKV : k);
        }
        return [newKV, ...prev];
      });
      return newKV;
    } catch (err: any) {
      setError(err.message || 'Error guardando valor');
      throw err;
    }
  }, [client, storeId]);

  const getValue = useCallback(async (key: string) => {
    try {
      return await client.getKV(storeId, key);
    } catch (err: any) {
      setError(err.message || 'Error obteniendo valor');
      throw err;
    }
  }, [client, storeId]);

  const deleteValue = useCallback(async (key: string) => {
    try {
      await client.deleteKV(storeId, key);
      setKv(prev => prev.filter(k => k.key !== key));
    } catch (err: any) {
      setError(err.message || 'Error eliminando valor');
      throw err;
    }
  }, [client, storeId]);

  return {
    kv,
    loading,
    error,
    loadKV,
    setValue,
    getValue,
    deleteValue,
  };
}

// Hook for AI workflow generation
export function useAIWorkflow(client: Stack21Client) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateWorkflow = useCallback(async (request: AIWorkflowRequest): Promise<AIWorkflowResponse> => {
    try {
      setLoading(true);
      setError(null);
      const response = await client.generateWorkflow(request);
      return response;
    } catch (err: any) {
      setError(err.message || 'Error generando workflow');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [client]);

  return {
    generateWorkflow,
    loading,
    error,
  };
}

// Hook for real-time updates
export function useRealtimeRuns(client: Stack21Client, workflowId?: string) {
  const [runs, setRuns] = useState<Run[]>([]);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const unsubscribe = workflowId 
      ? client.subscribeToWorkflow(workflowId, (run) => {
          setRuns(prev => [run, ...prev]);
        })
      : client.subscribeToRuns((run) => {
          setRuns(prev => [run, ...prev]);
        });

    setConnected(true);

    return () => {
      unsubscribe();
      setConnected(false);
    };
  }, [client, workflowId]);

  return {
    runs,
    connected,
  };
}
