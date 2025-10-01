'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  Save,
  Play,
  ArrowLeft,
  Plus,
  Trash2,
  Settings,
  Zap,
  Eye
} from 'lucide-react';

interface WorkflowStep {
  id: string;
  type: string;
  name: string;
  config: any;
  next?: string;
}

interface Workflow {
  id: string;
  name: string;
  description?: string;
  trigger: {
    type: string;
    config: any;
  };
  steps: WorkflowStep[];
  status: string;
}

export default function EditWorkflowPage() {
  const params = useParams();
  const router = useRouter();
  const workflowId = String(params?.id || '');
  
  const [workflow, setWorkflow] = useState<Workflow | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (workflowId) {
      loadWorkflow();
    }
  }, [workflowId]);

  const loadWorkflow = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/workflows/${workflowId}`);
      if (!response.ok) throw new Error('Workflow no encontrado');
      const data = await response.json();
      setWorkflow(data);
    } catch (error) {
      console.error('Error cargando workflow:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveWorkflow = async () => {
    if (!workflow) return;
    
    setSaving(true);
    try {
      const response = await fetch(`/api/workflows/${workflowId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(workflow)
      });

      if (!response.ok) throw new Error('Error guardando workflow');
      alert('Workflow guardado correctamente');
    } catch (error) {
      alert('Error al guardar el workflow');
    } finally {
      setSaving(false);
    }
  };

  const runWorkflow = async () => {
    if (!workflow) return;
    
    setRunning(true);
    try {
      const response = await fetch(`/api/workflows/${workflowId}/run`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ triggerData: { test: true } })
      });

      if (!response.ok) throw new Error('Error ejecutando workflow');
      
      const data = await response.json();
      alert(`Workflow ejecutado. Run ID: ${data.runId}`);
      router.push(`/runs/${data.runId}`);
    } catch (error) {
      alert('Error al ejecutar el workflow');
    } finally {
      setRunning(false);
    }
  };

  const stepTypes = [
    { id: 'http_request', name: 'HTTP Request', icon: '🌐' },
    { id: 'data_transform', name: 'Transform Data', icon: '🔄' },
    { id: 'condition', name: 'Condition', icon: '❓' },
    { id: 'delay', name: 'Delay', icon: '⏱️' },
    { id: 'log', name: 'Log', icon: '📝' },
  ];

  const addStep = (type: string) => {
    if (!workflow) return;
    
    const newStep: WorkflowStep = {
      id: `step_${Date.now()}`,
      type,
      name: `Step ${workflow.steps.length + 1}`,
      config: getDefaultConfig(type)
    };
    setWorkflow({
      ...workflow,
      steps: [...workflow.steps, newStep]
    });
  };

  const getDefaultConfig = (type: string) => {
    switch (type) {
      case 'http_request':
        return { url: '', method: 'GET', headers: {}, body: null };
      case 'data_transform':
        return { transform: {} };
      case 'condition':
        return { condition: '', trueValue: null, falseValue: null };
      case 'delay':
        return { duration: 1000 };
      case 'log':
        return { message: '', level: 'info' };
      default:
        return {};
    }
  };

  const updateStep = (stepId: string, updates: Partial<WorkflowStep>) => {
    if (!workflow) return;
    
    setWorkflow({
      ...workflow,
      steps: workflow.steps.map(step => 
        step.id === stepId ? { ...step, ...updates } : step
      )
    });
  };

  const deleteStep = (stepId: string) => {
    if (!workflow) return;
    
    setWorkflow({
      ...workflow,
      steps: workflow.steps.filter(step => step.id !== stepId)
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando workflow...</p>
        </div>
      </div>
    );
  }

  if (!workflow) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Workflow no encontrado</h1>
          <p className="text-gray-600 mb-6">El workflow que buscas no existe o fue eliminado</p>
          <button
            onClick={() => router.push('/workflows')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Volver a Workflows
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver
          </button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {workflow.name}
              </h1>
              <p className="text-gray-600">
                {workflow.description || 'Sin descripción'}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={runWorkflow}
                disabled={running}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
              >
                <Play className="w-4 h-4" />
                {running ? 'Ejecutando...' : 'Ejecutar'}
              </button>
              <button
                onClick={saveWorkflow}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Workflow Settings */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Configuración
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre
                  </label>
                  <input
                    type="text"
                    value={workflow.name}
                    onChange={(e) => setWorkflow({ ...workflow, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descripción
                  </label>
                  <textarea
                    value={workflow.description || ''}
                    onChange={(e) => setWorkflow({ ...workflow, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Trigger
                  </label>
                  <select
                    value={workflow.trigger.type}
                    onChange={(e) => setWorkflow({ 
                      ...workflow, 
                      trigger: { ...workflow.trigger, type: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="webhook">Webhook</option>
                    <option value="schedule">Schedule</option>
                    <option value="manual">Manual</option>
                  </select>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <div className="text-sm text-gray-500 mb-2">Estado</div>
                  <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    workflow.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {workflow.status === 'active' ? 'Activo' : 'Inactivo'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Steps Editor */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Pasos del Workflow
                </h2>
                <div className="text-sm text-gray-500">
                  {workflow.steps.length} paso{workflow.steps.length !== 1 ? 's' : ''}
                </div>
              </div>

              {workflow.steps.length === 0 ? (
                <div className="text-center py-12">
                  <Zap className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No hay pasos
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Agrega pasos para construir tu workflow
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {workflow.steps.map((step, index) => (
                    <div key={step.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                            {index + 1}
                          </div>
                          <div>
                            <input
                              type="text"
                              value={step.name}
                              onChange={(e) => updateStep(step.id, { name: e.target.value })}
                              className="font-medium text-gray-900 bg-transparent border-none p-0 focus:ring-0"
                            />
                            <div className="text-sm text-gray-500">
                              {stepTypes.find(t => t.id === step.type)?.name}
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => deleteStep(step.id)}
                          className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="ml-11">
                        {step.type === 'http_request' && (
                          <div className="space-y-2">
                            <input
                              type="text"
                              placeholder="URL"
                              value={step.config.url || ''}
                              onChange={(e) => updateStep(step.id, { 
                                config: { ...step.config, url: e.target.value }
                              })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                            />
                            <select
                              value={step.config.method || 'GET'}
                              onChange={(e) => updateStep(step.id, { 
                                config: { ...step.config, method: e.target.value }
                              })}
                              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                            >
                              <option value="GET">GET</option>
                              <option value="POST">POST</option>
                              <option value="PUT">PUT</option>
                              <option value="DELETE">DELETE</option>
                            </select>
                          </div>
                        )}

                        {step.type === 'log' && (
                          <div className="space-y-2">
                            <input
                              type="text"
                              placeholder="Mensaje"
                              value={step.config.message || ''}
                              onChange={(e) => updateStep(step.id, { 
                                config: { ...step.config, message: e.target.value }
                              })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                            />
                            <select
                              value={step.config.level || 'info'}
                              onChange={(e) => updateStep(step.id, { 
                                config: { ...step.config, level: e.target.value }
                              })}
                              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                            >
                              <option value="info">Info</option>
                              <option value="warn">Warning</option>
                              <option value="error">Error</option>
                            </select>
                          </div>
                        )}

                        {step.type === 'delay' && (
                          <div>
                            <input
                              type="number"
                              placeholder="Duración (ms)"
                              value={step.config.duration || ''}
                              onChange={(e) => updateStep(step.id, { 
                                config: { ...step.config, duration: parseInt(e.target.value) || 0 }
                              })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Add Step Buttons */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex flex-wrap gap-2">
                  {stepTypes.map(type => (
                    <button
                      key={type.id}
                      onClick={() => addStep(type.id)}
                      className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                    >
                      <span>{type.icon}</span>
                      {type.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
