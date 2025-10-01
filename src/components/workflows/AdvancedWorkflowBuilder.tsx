'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Pause, 
  Square, 
  Save, 
  Settings, 
  Plus, 
  Trash2, 
  Copy, 
  Download,
  Upload,
  Eye,
  Code,
  Zap,
  GitBranch,
  Repeat,
  Clock,
  Database,
  Bot,
  Globe,
  Mail,
  Filter,
  Workflow
} from 'lucide-react';
import { AdvancedWorkflow, AdvancedWorkflowStep, AdvancedWorkflowExecution } from '@/lib/advanced-workflow-engine';
import { advancedWorkflowEngine, createAdvancedSampleWorkflow } from '@/lib/advanced-workflow-engine';

interface AdvancedWorkflowBuilderProps {
  workflowId?: string;
  onSave?: (workflow: AdvancedWorkflow) => void;
  onExecute?: (execution: AdvancedWorkflowExecution) => void;
}

export function AdvancedWorkflowBuilder({ workflowId, onSave, onExecute }: AdvancedWorkflowBuilderProps) {
  const [workflow, setWorkflow] = useState<AdvancedWorkflow | null>(null);
  const [selectedStep, setSelectedStep] = useState<string | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [execution, setExecution] = useState<AdvancedWorkflowExecution | null>(null);
  const [viewMode, setViewMode] = useState<'visual' | 'code' | 'logs'>('visual');
  const [showSettings, setShowSettings] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);

  // Cargar workflow existente o crear uno nuevo
  useEffect(() => {
    if (workflowId) {
      const existingWorkflow = advancedWorkflowEngine.getWorkflow(workflowId);
      if (existingWorkflow) {
        setWorkflow(existingWorkflow);
      }
    } else {
      // Crear workflow de ejemplo
      const sampleWorkflow = createAdvancedSampleWorkflow();
      setWorkflow(sampleWorkflow);
    }
  }, [workflowId]);

  // Tipos de nodos disponibles
  const nodeTypes = [
    { type: 'trigger', name: 'Trigger', icon: Zap, color: 'from-blue-500 to-cyan-500', description: 'Inicia el workflow' },
    { type: 'action', name: 'Acción', icon: Play, color: 'from-green-500 to-emerald-500', description: 'Ejecuta una acción' },
    { type: 'condition', name: 'Condición', icon: Filter, color: 'from-yellow-500 to-orange-500', description: 'Evalúa una condición' },
    { type: 'loop', name: 'Bucle', icon: Repeat, color: 'from-purple-500 to-pink-500', description: 'Repite acciones' },
    { type: 'parallel', name: 'Paralelo', icon: GitBranch, color: 'from-indigo-500 to-blue-500', description: 'Ejecuta en paralelo' },
    { type: 'delay', name: 'Espera', icon: Clock, color: 'from-amber-500 to-yellow-500', description: 'Espera un tiempo' },
    { type: 'webhook', name: 'Webhook', icon: Globe, color: 'from-teal-500 to-cyan-500', description: 'Llama a una URL' },
    { type: 'email', name: 'Email', icon: Mail, color: 'from-cyan-500 to-blue-500', description: 'Envía un email' },
    { type: 'ai', name: 'IA', icon: Bot, color: 'from-pink-500 to-rose-500', description: 'Procesa con IA' },
    { type: 'database', name: 'Base de Datos', icon: Database, color: 'from-slate-500 to-gray-500', description: 'Opera con BD' },
    { type: 'data', name: 'Datos', icon: Settings, color: 'from-violet-500 to-purple-500', description: 'Transforma datos' }
  ];

  // Agregar nuevo nodo
  const addNode = useCallback((nodeType: string, position: { x: number; y: number }) => {
    if (!workflow) return;

    const nodeTemplate = nodeTypes.find(n => n.type === nodeType);
    if (!nodeTemplate) return;

    const newNode: AdvancedWorkflowStep = {
      id: `step_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: nodeType as any,
      name: `${nodeTemplate.name} ${workflow.steps.length + 1}`,
      description: nodeTemplate.description,
      config: {},
      position,
      inputs: [],
      outputs: []
    };

    const updatedWorkflow = {
      ...workflow,
      steps: [...workflow.steps, newNode],
      updatedAt: new Date()
    };

    setWorkflow(updatedWorkflow);
  }, [workflow, nodeTypes]);

  // Eliminar nodo
  const deleteNode = useCallback((stepId: string) => {
    if (!workflow) return;

    const updatedWorkflow = {
      ...workflow,
      steps: workflow.steps.filter(step => step.id !== stepId),
      updatedAt: new Date()
    };

    setWorkflow(updatedWorkflow);
    setSelectedStep(null);
  }, [workflow]);

  // Actualizar nodo
  const updateNode = useCallback((stepId: string, updates: Partial<AdvancedWorkflowStep>) => {
    if (!workflow) return;

    const updatedWorkflow = {
      ...workflow,
      steps: workflow.steps.map(step => 
        step.id === stepId ? { ...step, ...updates } : step
      ),
      updatedAt: new Date()
    };

    setWorkflow(updatedWorkflow);
  }, [workflow]);

  // Ejecutar workflow
  const executeWorkflow = useCallback(async () => {
    if (!workflow) return;

    setIsExecuting(true);
    try {
      const result = await advancedWorkflowEngine.executeAdvancedWorkflow(workflow.id, {
        testData: true,
        timestamp: new Date().toISOString()
      });
      
      setExecution(result);
      onExecute?.(result);
    } catch (error) {
      console.error('Error ejecutando workflow:', error);
    } finally {
      setIsExecuting(false);
    }
  }, [workflow, onExecute]);

  // Guardar workflow
  const saveWorkflow = useCallback(() => {
    if (!workflow) return;

    const updatedWorkflow = advancedWorkflowEngine.updateWorkflow(workflow.id, workflow);
    if (updatedWorkflow) {
      setWorkflow(updatedWorkflow);
      onSave?.(updatedWorkflow);
    }
  }, [workflow, onSave]);

  // Renderizar nodo
  const renderNode = (step: AdvancedWorkflowStep) => {
    const nodeType = nodeTypes.find(n => n.type === step.type);
    const Icon = nodeType?.icon || Settings;
    const isSelected = selectedStep === step.id;
    const stepExecution = execution?.steps.find(s => s.stepId === step.id);

    return (
      <motion.div
        key={step.id}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        className={`absolute cursor-pointer group ${isSelected ? 'z-10' : 'z-0'}`}
        style={{ left: step.position.x, top: step.position.y }}
        onClick={() => setSelectedStep(step.id)}
        drag
        dragMomentum={false}
        onDragEnd={(_, info) => {
          updateNode(step.id, {
            position: {
              x: step.position.x + info.offset.x,
              y: step.position.y + info.offset.y
            }
          });
        }}
      >
        <div className={`
          relative bg-white rounded-lg shadow-lg border-2 p-4 min-w-[200px] max-w-[250px]
          ${isSelected ? 'border-blue-500 shadow-xl' : 'border-gray-200 hover:border-gray-300'}
          ${stepExecution?.status === 'completed' ? 'bg-green-50 border-green-200' : ''}
          ${stepExecution?.status === 'failed' ? 'bg-red-50 border-red-200' : ''}
          ${stepExecution?.status === 'running' ? 'bg-blue-50 border-blue-200' : ''}
        `}>
          {/* Header del nodo */}
          <div className="flex items-center gap-2 mb-2">
            <div className={`p-2 rounded-lg bg-gradient-to-r ${nodeType?.color || 'from-gray-500 to-gray-600'}`}>
              <Icon className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-sm truncate">{step.name}</h4>
              <p className="text-xs text-gray-500 truncate">{step.description}</p>
            </div>
            {isSelected && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteNode(step.id);
                }}
                className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 rounded"
              >
                <Trash2 className="w-3 h-3 text-red-500" />
              </button>
            )}
          </div>

          {/* Estado de ejecución */}
          {stepExecution && (
            <div className="mb-2">
              <div className="flex items-center gap-2 text-xs">
                <div className={`
                  w-2 h-2 rounded-full
                  ${stepExecution.status === 'completed' ? 'bg-green-500' : ''}
                  ${stepExecution.status === 'failed' ? 'bg-red-500' : ''}
                  ${stepExecution.status === 'running' ? 'bg-blue-500 animate-pulse' : ''}
                  ${stepExecution.status === 'pending' ? 'bg-gray-400' : ''}
                `} />
                <span className="capitalize">{stepExecution.status}</span>
                {stepExecution.iterations && (
                  <span className="text-gray-500">({stepExecution.iterations} iteraciones)</span>
                )}
              </div>
            </div>
          )}

          {/* Configuración del nodo */}
          {isSelected && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-2 pt-2 border-t border-gray-200"
            >
              <div className="space-y-2">
                <input
                  type="text"
                  value={step.name}
                  onChange={(e) => updateNode(step.id, { name: e.target.value })}
                  className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
                  placeholder="Nombre del paso"
                />
                <textarea
                  value={step.description}
                  onChange={(e) => updateNode(step.id, { description: e.target.value })}
                  className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
                  placeholder="Descripción"
                  rows={2}
                />
                
                {/* Configuración específica por tipo */}
                {step.type === 'condition' && (
                  <input
                    type="text"
                    value={step.config.condition || ''}
                    onChange={(e) => updateNode(step.id, { 
                      config: { ...step.config, condition: e.target.value }
                    })}
                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
                    placeholder="Condición (ej: data.email.includes('@'))"
                  />
                )}
                
                {step.type === 'delay' && (
                  <input
                    type="number"
                    value={step.config.delay || 1000}
                    onChange={(e) => updateNode(step.id, { 
                      config: { ...step.config, delay: parseInt(e.target.value) }
                    })}
                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
                    placeholder="Milisegundos"
                  />
                )}
                
                {step.type === 'webhook' && (
                  <input
                    type="url"
                    value={step.config.url || ''}
                    onChange={(e) => updateNode(step.id, { 
                      config: { ...step.config, url: e.target.value }
                    })}
                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
                    placeholder="URL del webhook"
                  />
                )}
              </div>
            </motion.div>
          )}

          {/* Puntos de conexión */}
          <div className="absolute -right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-sm" />
          <div className="absolute -left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-gray-400 rounded-full border-2 border-white shadow-sm" />
        </div>
      </motion.div>
    );
  };

  if (!workflow) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Workflow className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Cargando workflow...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-semibold">{workflow.name}</h2>
            <span className={`px-2 py-1 text-xs rounded-full ${
              workflow.status === 'active' ? 'bg-green-100 text-green-800' :
              workflow.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
              workflow.status === 'error' ? 'bg-red-100 text-red-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {workflow.status}
            </span>
            <span className="text-sm text-gray-500">
              {workflow.steps.length} pasos
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Modos de vista */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('visual')}
                className={`px-3 py-1 text-xs rounded ${
                  viewMode === 'visual' ? 'bg-white shadow-sm' : 'text-gray-600'
                }`}
              >
                Visual
              </button>
              <button
                onClick={() => setViewMode('code')}
                className={`px-3 py-1 text-xs rounded ${
                  viewMode === 'code' ? 'bg-white shadow-sm' : 'text-gray-600'
                }`}
              >
                Código
              </button>
              <button
                onClick={() => setViewMode('logs')}
                className={`px-3 py-1 text-xs rounded ${
                  viewMode === 'logs' ? 'bg-white shadow-sm' : 'text-gray-600'
                }`}
              >
                Logs
              </button>
            </div>

            {/* Acciones */}
            <button
              onClick={executeWorkflow}
              disabled={isExecuting}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {isExecuting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Ejecutando...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  Ejecutar
                </>
              )}
            </button>
            
            <button
              onClick={saveWorkflow}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <Save className="w-4 h-4" />
              Guardar
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Panel lateral */}
        <div className="w-80 bg-white border-r border-gray-200 p-4">
          <h3 className="font-semibold mb-4">Nodos Disponibles</h3>
          
          <div className="space-y-2">
            {nodeTypes.map((nodeType) => {
              const Icon = nodeType.icon;
              return (
                <button
                  key={nodeType.type}
                  onClick={() => addNode(nodeType.type, { x: 100, y: 100 })}
                  className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div className={`p-2 rounded-lg bg-gradient-to-r ${nodeType.color}`}>
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="font-medium text-sm">{nodeType.name}</div>
                    <div className="text-xs text-gray-500">{nodeType.description}</div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Información del workflow */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold text-sm mb-2">Información</h4>
            <div className="space-y-1 text-xs text-gray-600">
              <div>Versión: {workflow.version}</div>
              <div>Ejecuciones: {workflow.executionCount}</div>
              <div>Tasa de éxito: {workflow.successRate}%</div>
              <div>Tiempo promedio: {Math.round(workflow.averageExecutionTime)}ms</div>
            </div>
          </div>
        </div>

        {/* Área principal */}
        <div className="flex-1 flex flex-col">
          {viewMode === 'visual' && (
            <div className="flex-1 relative overflow-hidden">
              <div
                ref={canvasRef}
                className="w-full h-full bg-gray-50 relative"
                style={{
                  backgroundImage: `
                    radial-gradient(circle, #e5e7eb 1px, transparent 1px)
                  `,
                  backgroundSize: '20px 20px'
                }}
              >
                <AnimatePresence>
                  {workflow.steps.map(renderNode)}
                </AnimatePresence>
              </div>
            </div>
          )}

          {viewMode === 'code' && (
            <div className="flex-1 p-4">
              <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-auto h-full text-sm">
                {JSON.stringify(workflow, null, 2)}
              </pre>
            </div>
          )}

          {viewMode === 'logs' && execution && (
            <div className="flex-1 p-4">
              <div className="bg-white rounded-lg border border-gray-200 h-full overflow-auto">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="font-semibold">Logs de Ejecución</h3>
                  <div className="text-sm text-gray-500">
                    Estado: {execution.status} | 
                    Iniciado: {execution.startedAt.toLocaleString()} |
                    {execution.completedAt && ` Completado: ${execution.completedAt.toLocaleString()}`}
                  </div>
                </div>
                
                <div className="p-4 space-y-2">
                  {execution.logs.map((log, index) => (
                    <div key={index} className="flex items-start gap-2 text-sm">
                      <span className="text-gray-400 text-xs">
                        {log.timestamp.toLocaleTimeString()}
                      </span>
                      <span className={`
                        px-2 py-1 rounded text-xs
                        ${log.level === 'error' ? 'bg-red-100 text-red-800' : ''}
                        ${log.level === 'warn' ? 'bg-yellow-100 text-yellow-800' : ''}
                        ${log.level === 'info' ? 'bg-blue-100 text-blue-800' : ''}
                        ${log.level === 'debug' ? 'bg-gray-100 text-gray-800' : ''}
                      `}>
                        {log.level.toUpperCase()}
                      </span>
                      <span className="flex-1">{log.message}</span>
                      {log.stepId && (
                        <span className="text-gray-500 text-xs">({log.stepId})</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
