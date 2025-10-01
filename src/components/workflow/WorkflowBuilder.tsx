'use client';

import React, { useState, useCallback, useMemo } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  NodeTypes,
  EdgeTypes,
  BackgroundVariant,
  Panel,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { 
  Plus, 
  Play, 
  Save, 
  Settings, 
  Zap, 
  Code, 
  GitBranch, 
  Clock,
  AlertCircle,
  CheckCircle,
  X,
  Edit3,
  Trash2,
  Copy
} from 'lucide-react';
import { WorkflowDefinition, StepDefinition, TriggerDefinition } from '@/types/automation';

interface WorkflowBuilderProps {
  workflow?: WorkflowDefinition;
  onSave?: (workflow: WorkflowDefinition) => void;
  onRun?: (workflow: WorkflowDefinition) => void;
  onClose?: () => void;
}

// Tipos de nodos personalizados
const nodeTypes: NodeTypes = {
  trigger: TriggerNode,
  action: ActionNode,
  code: CodeNode,
  condition: ConditionNode,
  loop: LoopNode,
  delay: DelayNode,
};

const edgeTypes: EdgeTypes = {};

// Nodo Trigger
function TriggerNode({ data, selected }: { data: any; selected: boolean }) {
  return (
    <div className={`px-4 py-2 shadow-md rounded-md bg-white border-2 min-w-[200px] ${
      selected ? 'border-blue-500' : 'border-gray-300'
    }`}>
      <div className="flex items-center gap-2">
        <Zap className="w-4 h-4 text-orange-500" />
        <div className="font-bold text-sm">Trigger</div>
      </div>
      <div className="text-xs text-gray-600 mt-1">{data.label}</div>
    </div>
  );
}

// Nodo Action
function ActionNode({ data, selected }: { data: any; selected: boolean }) {
  return (
    <div className={`px-4 py-2 shadow-md rounded-md bg-white border-2 min-w-[200px] ${
      selected ? 'border-blue-500' : 'border-gray-300'
    }`}>
      <div className="flex items-center gap-2">
        <Settings className="w-4 h-4 text-blue-500" />
        <div className="font-bold text-sm">Action</div>
      </div>
      <div className="text-xs text-gray-600 mt-1">{data.label}</div>
      {data.app && (
        <div className="text-xs text-blue-600 mt-1">{data.app}</div>
      )}
    </div>
  );
}

// Nodo Code
function CodeNode({ data, selected }: { data: any; selected: boolean }) {
  return (
    <div className={`px-4 py-2 shadow-md rounded-md bg-white border-2 min-w-[200px] ${
      selected ? 'border-blue-500' : 'border-gray-300'
    }`}>
      <div className="flex items-center gap-2">
        <Code className="w-4 h-4 text-green-500" />
        <div className="font-bold text-sm">Code</div>
      </div>
      <div className="text-xs text-gray-600 mt-1">{data.label}</div>
      <div className="text-xs text-green-600 mt-1">{data.language}</div>
    </div>
  );
}

// Nodo Condition
function ConditionNode({ data, selected }: { data: any; selected: boolean }) {
  return (
    <div className={`px-4 py-2 shadow-md rounded-md bg-white border-2 min-w-[200px] ${
      selected ? 'border-blue-500' : 'border-gray-300'
    }`}>
      <div className="flex items-center gap-2">
        <GitBranch className="w-4 h-4 text-purple-500" />
        <div className="font-bold text-sm">Condition</div>
      </div>
      <div className="text-xs text-gray-600 mt-1">{data.label}</div>
    </div>
  );
}

// Nodo Loop
function LoopNode({ data, selected }: { data: any; selected: boolean }) {
  return (
    <div className={`px-4 py-2 shadow-md rounded-md bg-white border-2 min-w-[200px] ${
      selected ? 'border-blue-500' : 'border-gray-300'
    }`}>
      <div className="flex items-center gap-2">
        <GitBranch className="w-4 h-4 text-indigo-500" />
        <div className="font-bold text-sm">Loop</div>
      </div>
      <div className="text-xs text-gray-600 mt-1">{data.label}</div>
    </div>
  );
}

// Nodo Delay
function DelayNode({ data, selected }: { data: any; selected: boolean }) {
  return (
    <div className={`px-4 py-2 shadow-md rounded-md bg-white border-2 min-w-[200px] ${
      selected ? 'border-blue-500' : 'border-gray-300'
    }`}>
      <div className="flex items-center gap-2">
        <Clock className="w-4 h-4 text-yellow-500" />
        <div className="font-bold text-sm">Delay</div>
      </div>
      <div className="text-xs text-gray-600 mt-1">{data.label}</div>
    </div>
  );
}

function WorkflowBuilder({ 
  workflow, 
  onSave, 
  onRun, 
  onClose 
}: WorkflowBuilderProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState<any>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [workflowName, setWorkflowName] = useState(workflow?.name || '');
  const [workflowDescription, setWorkflowDescription] = useState(workflow?.description || '');

  // Inicializar nodos desde workflow existente
  React.useEffect(() => {
    if (workflow) {
      const initialNodes: Node[] = [];
      const initialEdges: Edge[] = [];

      // Crear nodo trigger
      if (workflow.triggers.length > 0) {
        const trigger = workflow.triggers[0];
        initialNodes.push({
          id: 'trigger-1',
          type: 'trigger',
          position: { x: 100, y: 100 },
          data: {
            label: trigger.type === 'http_webhook' ? 'HTTP Webhook' : 
                   trigger.type === 'schedule' ? 'Schedule' : 
                   trigger.type === 'app_event' ? 'App Event' : 'Manual',
            config: trigger.config,
          },
        });
      }

      // Crear nodos de steps
      workflow.steps.forEach((step, index) => {
        const nodeId = `step-${step.id}`;
        const nodeType = step.type === 'app_action' ? 'action' : 
                        step.type === 'code_step' ? 'code' :
                        step.type === 'condition' ? 'condition' :
                        step.type === 'loop' ? 'loop' :
                        step.type === 'delay' ? 'delay' : 'action';

        initialNodes.push({
          id: nodeId,
          type: nodeType,
          position: { x: 100 + (index + 1) * 250, y: 100 },
          data: {
            label: step.name,
            app: step.appId,
            language: step.codeLang,
            config: step.config,
            stepId: step.id,
          },
        });

        // Crear edge desde trigger o step anterior
        const sourceId = index === 0 ? 'trigger-1' : `step-${workflow.steps[index - 1].id}`;
        initialEdges.push({
          id: `edge-${sourceId}-${nodeId}`,
          source: sourceId,
          target: nodeId,
          type: 'smoothstep',
        });
      });

      setNodes(initialNodes as any);
      setEdges(initialEdges as any);
    }
  }, [workflow]);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  }, []);

  const addNode = (type: string) => {
    const newNode: Node = {
      id: `${type}-${Date.now()}`,
      type,
      position: { x: Math.random() * 400 + 100, y: Math.random() * 300 + 100 },
      data: {
        label: `New ${type}`,
        config: {},
      },
    };
    setNodes((nds) => [...nds, newNode]);
    setShowAddMenu(false);
  };

  const updateNode = (nodeId: string, updates: Partial<Node>) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId ? { ...node, ...updates } : node
      )
    );
  };

  const deleteNode = (nodeId: string) => {
    setNodes((nds) => nds.filter((node) => node.id !== nodeId));
    setEdges((eds: any) => eds.filter((edge: any) => edge.source !== nodeId && edge.target !== nodeId));
    if (selectedNode?.id === nodeId) {
      setSelectedNode(null);
    }
  };

  const duplicateNode = (nodeId: string) => {
    const node = nodes.find((n) => n.id === nodeId);
    if (node) {
      const newNode: Node = {
        ...node,
        id: `${node.type}-${Date.now()}`,
        position: {
          x: node.position.x + 50,
          y: node.position.y + 50,
        },
      };
      setNodes((nds) => [...nds, newNode]);
    }
  };

  const saveWorkflow = () => {
    if (!workflowName.trim()) return;

    const triggers: TriggerDefinition[] = [];
    const steps: StepDefinition[] = [];

    // Procesar trigger
    const triggerNode = nodes.find((n) => n.type === 'trigger');
    if (triggerNode) {
      triggers.push({
        id: 'trigger-1',
        type: 'http_webhook', // Por defecto
        config: triggerNode.data.config || {},
        isActive: true,
      });
    }

    // Procesar steps
    const stepNodes = nodes
      .filter((n) => n.type !== 'trigger')
      .sort((a, b) => {
        const aIndex = nodes.indexOf(a);
        const bIndex = nodes.indexOf(b);
        return aIndex - bIndex;
      });

    stepNodes.forEach((node, index) => {
      steps.push({
        id: node.id,
        order: index + 1,
        type: node.type === 'action' ? 'app_action' :
              node.type === 'code' ? 'code_step' :
              node.type === 'condition' ? 'condition' :
              node.type === 'loop' ? 'loop' :
              node.type === 'delay' ? 'delay' : 'app_action',
        name: node.data.label,
        appId: node.data.app,
        actionKey: node.data.actionKey,
        codeLang: node.data.language,
        code: node.data.code,
        config: node.data.config || {},
        position: node.position,
      });
    });

    const workflowDefinition: WorkflowDefinition = {
      id: workflow?.id || '',
      name: workflowName,
      description: workflowDescription,
      status: 'draft',
      isActive: false,
      version: (workflow?.version || 0) + 1,
      projectId: workflow?.projectId || '',
      createdAt: workflow?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      triggers,
      steps,
      variables: workflow?.variables || {},
      tags: workflow?.tags || [],
    };

    onSave?.(workflowDefinition);
  };

  const runWorkflow = () => {
    saveWorkflow();
    // onRun se llamará después de guardar
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold text-gray-900">
              {workflow ? 'Editar Workflow' : 'Nuevo Workflow'}
            </h1>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={workflowName}
                onChange={(e) => setWorkflowName(e.target.value)}
                placeholder="Nombre del workflow"
                className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAddMenu(!showAddMenu)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Añadir
            </button>
            <button
              onClick={runWorkflow}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Play className="w-4 h-4" />
              Ejecutar
            </button>
            <button
              onClick={saveWorkflow}
              className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <Save className="w-4 h-4" />
              Guardar
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Canvas */}
        <div className="flex-1">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            fitView
            attributionPosition="bottom-left"
          >
            <Controls />
            <MiniMap />
            <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
          </ReactFlow>
        </div>

        {/* Sidebar */}
        {selectedNode && (
          <div className="w-80 bg-white border-l border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Configurar Nodo
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => duplicateNode(selectedNode.id)}
                  className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                  title="Duplicar"
                >
                  <Copy className="w-4 h-4" />
                </button>
                <button
                  onClick={() => deleteNode(selectedNode.id)}
                  className="p-1 text-red-400 hover:text-red-600 transition-colors"
                  title="Eliminar"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre
                </label>
                <input
                  type="text"
                  value={selectedNode.data.label as string}
                  onChange={(e) => updateNode(selectedNode.id, {
                    data: { ...selectedNode.data, label: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {selectedNode.type === 'action' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Aplicación
                  </label>
                  <select
                    value={(selectedNode.data.app as string) || ''}
                    onChange={(e) => updateNode(selectedNode.id, {
                      data: { ...selectedNode.data, app: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Seleccionar app</option>
                    <option value="gmail">Gmail</option>
                    <option value="slack">Slack</option>
                    <option value="notion">Notion</option>
                    <option value="github">GitHub</option>
                    <option value="google-sheets">Google Sheets</option>
                    <option value="http">HTTP Request</option>
                  </select>
                </div>
              )}

              {selectedNode.type === 'code' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Lenguaje
                  </label>
                  <select
                    value={(selectedNode.data.language as string) || 'javascript'}
                    onChange={(e) => updateNode(selectedNode.id, {
                      data: { ...selectedNode.data, language: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="javascript">JavaScript</option>
                    <option value="python">Python</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Configuración
                </label>
                <textarea
                  value={JSON.stringify(selectedNode.data.config, null, 2)}
                  onChange={(e) => {
                    try {
                      const config = JSON.parse(e.target.value);
                      updateNode(selectedNode.id, {
                        data: { ...selectedNode.data, config }
                      });
                    } catch (error) {
                      // Ignore invalid JSON
                    }
                  }}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add Menu */}
      {showAddMenu && (
        <div className="absolute top-20 left-6 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-10">
          <h3 className="font-semibold text-gray-900 mb-3">Añadir Nodo</h3>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => addNode('action')}
              className="flex items-center gap-2 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
            >
              <Settings className="w-4 h-4 text-blue-500" />
              <span className="text-sm">Action</span>
            </button>
            <button
              onClick={() => addNode('code')}
              className="flex items-center gap-2 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
            >
              <Code className="w-4 h-4 text-green-500" />
              <span className="text-sm">Code</span>
            </button>
            <button
              onClick={() => addNode('condition')}
              className="flex items-center gap-2 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
            >
              <GitBranch className="w-4 h-4 text-purple-500" />
              <span className="text-sm">Condition</span>
            </button>
            <button
              onClick={() => addNode('loop')}
              className="flex items-center gap-2 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
            >
              <GitBranch className="w-4 h-4 text-indigo-500" />
              <span className="text-sm">Loop</span>
            </button>
            <button
              onClick={() => addNode('delay')}
              className="flex items-center gap-2 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
            >
              <Clock className="w-4 h-4 text-yellow-500" />
              <span className="text-sm">Delay</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default WorkflowBuilder;
export { WorkflowBuilder };