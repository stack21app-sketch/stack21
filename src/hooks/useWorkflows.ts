import { useState, useEffect } from 'react';
// Tipo mínimo local para workflows usado en este hook
export interface Workflow {
  id: string;
  name: string;
  description?: string;
  status?: string;
  trigger?: any;
  steps?: any[];
}

export function useWorkflows() {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWorkflows = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/workflows');
      
      if (response.ok) {
        const data = await response.json();
        setWorkflows(data.workflows);
      } else {
        setError('Error al cargar workflows');
      }
    } catch (err) {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  const createWorkflow = async (workflowData: Partial<Workflow>) => {
    try {
      const response = await fetch('/api/workflows', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(workflowData)
      });

      if (response.ok) {
        const data = await response.json();
        setWorkflows(prev => [data.workflow, ...prev]);
        return data.workflow;
      } else {
        throw new Error('Error al crear workflow');
      }
    } catch (err) {
      setError('Error al crear workflow');
      throw err;
    }
  };

  const updateWorkflow = async (id: string, workflowData: Partial<Workflow>) => {
    try {
      const response = await fetch(`/api/workflows/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(workflowData)
      });

      if (response.ok) {
        const data = await response.json();
        setWorkflows(prev => prev.map(w => w.id === id ? data.workflow : w));
        return data.workflow;
      } else {
        throw new Error('Error al actualizar workflow');
      }
    } catch (err) {
      setError('Error al actualizar workflow');
      throw err;
    }
  };

  const deleteWorkflow = async (id: string) => {
    try {
      const response = await fetch(`/api/workflows/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setWorkflows(prev => prev.filter(w => w.id !== id));
      } else {
        throw new Error('Error al eliminar workflow');
      }
    } catch (err) {
      setError('Error al eliminar workflow');
      throw err;
    }
  };

  const executeWorkflow = async (id: string, inputData?: any) => {
    try {
      const response = await fetch(`/api/workflows/${id}/execute`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ input_data: inputData })
      });

      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        throw new Error('Error al ejecutar workflow');
      }
    } catch (err) {
      setError('Error al ejecutar workflow');
      throw err;
    }
  };

  useEffect(() => {
    fetchWorkflows();
  }, []);

  return {
    workflows,
    loading,
    error,
    fetchWorkflows,
    createWorkflow,
    updateWorkflow,
    deleteWorkflow,
    executeWorkflow
  };
}
