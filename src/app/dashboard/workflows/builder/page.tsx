'use client'

import { useState, useCallback, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Play, 
  Pause, 
  Save, 
  Share, 
  Settings, 
  Zap, 
  Brain, 
  Workflow,
  Plus,
  Trash2,
  Copy,
  Download,
  Upload,
  MessageSquare,
  Lightbulb,
  Target,
  BarChart3,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Database,
  Mail,
  Calendar,
  FileText,
  Image,
  Music,
  Video,
  Globe,
  Smartphone,
  CreditCard,
  Users,
  Shield,
  Lock,
  Eye,
  EyeOff,
  ChevronRight,
  ChevronDown
} from 'lucide-react'

interface WorkflowNode {
  id: string
  type: 'trigger' | 'action' | 'condition' | 'ai' | 'integration'
  title: string
  description: string
  icon: any
  color: string
  position: { x: number; y: number }
  inputs: string[]
  outputs: string[]
  config: any
  aiEnabled?: boolean
  performance?: {
    avgExecutionTime: number
    successRate: number
    lastRun: string
  }
}

interface WorkflowConnection {
  id: string
  from: string
  to: string
  type: 'success' | 'error' | 'conditional'
}

export default function WorkflowBuilderPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const workflowId = searchParams.get('id') || ''

  const [nodes, setNodes] = useState<WorkflowNode[]>([])
  const [connections, setConnections] = useState<WorkflowConnection[]>([])
  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [showAiChat, setShowAiChat] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [runs, setRuns] = useState<any[]>([])
  const [workflowName, setWorkflowName] = useState<string>('')
  const [showRunModal, setShowRunModal] = useState<boolean>(false)
  const [selectedRun, setSelectedRun] = useState<any>(null)

  // Cargar workflow por id
  useEffect(() => {
    const load = async () => {
      if (!workflowId) return
      try {
        setLoading(true)
        const res = await fetch(`/api/workflows/${workflowId}`, { cache: 'no-store' })
        if (!res.ok) throw new Error('No se pudo cargar el workflow')
        const data = await res.json()
        const wf = data.workflow
        setWorkflowName(wf?.name || '')
        setNodes(Array.isArray(wf?.nodes) ? wf.nodes : [])
        setConnections(Array.isArray(wf?.connections) ? wf.connections : [])
      } catch (e) {
        console.error(e)
        alert('No se pudo cargar el workflow')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [workflowId])

  // Cargar historial de ejecuciones
  const fetchRuns = useCallback(async () => {
    if (!workflowId) return
    try {
      const res = await fetch(`/api/workflows/${workflowId}/runs`, { cache: 'no-store' })
      if (!res.ok) return
      const data = await res.json()
      setRuns(data.runs || [])
    } catch {}
  }, [workflowId])

  useEffect(() => {
    fetchRuns()
  }, [fetchRuns])

  // Nodos predefinidos con IA integrada
  const nodeTypes = [
    {
      type: 'trigger',
      title: 'Webhook',
      description: 'Recibe datos de aplicaciones externas',
      icon: Globe,
      color: 'bg-blue-500',
      aiEnabled: true
    },
    {
      type: 'trigger',
      title: 'Email',
      description: 'Procesa emails entrantes con IA',
      icon: Mail,
      color: 'bg-green-500',
      aiEnabled: true
    },
    {
      type: 'trigger',
      title: 'Calendario',
      description: 'Eventos de calendario inteligentes',
      icon: Calendar,
      color: 'bg-purple-500',
      aiEnabled: true
    },
    {
      type: 'ai',
      title: 'IA Copilot',
      description: 'Procesamiento inteligente con GPT-4',
      icon: Brain,
      color: 'bg-gradient-to-r from-purple-500 to-pink-500',
      aiEnabled: true
    },
    {
      type: 'ai',
      title: 'Análisis de Sentimiento',
      description: 'Analiza emociones en texto',
      icon: Target,
      color: 'bg-orange-500',
      aiEnabled: true
    },
    {
      type: 'ai',
      title: 'Generación de Contenido',
      description: 'Crea contenido con IA',
      icon: FileText,
      color: 'bg-cyan-500',
      aiEnabled: true
    },
    {
      type: 'action',
      title: 'Enviar Email',
      description: 'Email personalizado con IA',
      icon: Mail,
      color: 'bg-green-600',
      aiEnabled: true
    },
    {
      type: 'action',
      title: 'Crear Tarea',
      description: 'Tareas automáticas',
      icon: CheckCircle,
      color: 'bg-blue-600',
      aiEnabled: false
    },
    {
      type: 'integration',
      title: 'Slack',
      description: 'Integración inteligente con Slack',
      icon: MessageSquare,
      color: 'bg-purple-600',
      aiEnabled: true
    },
    {
      type: 'integration',
      title: 'Salesforce',
      description: 'CRM con IA integrada',
      icon: Database,
      color: 'bg-blue-700',
      aiEnabled: true
    }
  ]

  const addNode = useCallback((nodeType: any) => {
    const newNode: WorkflowNode = {
      id: `node-${Date.now()}`,
      type: nodeType.type,
      title: nodeType.title,
      description: nodeType.description,
      icon: nodeType.icon,
      color: nodeType.color,
      position: { x: Math.random() * 400 + 100, y: Math.random() * 300 + 100 },
      inputs: nodeType.type === 'trigger' ? [] : ['input-1'],
      outputs: ['output-1'],
      config: {},
      aiEnabled: nodeType.aiEnabled,
      performance: {
        avgExecutionTime: Math.random() * 1000 + 100,
        successRate: Math.random() * 20 + 80,
        lastRun: new Date().toISOString()
      }
    }
    setNodes(prev => [...prev, newNode])
  }, [])

  const deleteNode = useCallback((nodeId: string) => {
    setNodes(prev => prev.filter(node => node.id !== nodeId))
    setConnections(prev => prev.filter(conn => conn.from !== nodeId && conn.to !== nodeId))
  }, [])

  const updateSelectedNodeConfig = useCallback(
    (patch: any) => {
      if (!selectedNode) return
      setNodes(prev => prev.map(n => n.id === selectedNode ? { ...n, config: { ...n.config, ...patch } } : n))
    },
    [selectedNode]
  )

  const runWorkflow = useCallback(async () => {
    setIsRunning(true)
    try {
      if (!workflowId) return
      const res = await fetch(`/api/workflows/${workflowId}/run`, { method: 'POST' })
      if (!res.ok) throw new Error('No se pudo ejecutar')
      await fetchRuns()
    } catch (e) {
      console.error(e)
      alert('No se pudo ejecutar el workflow')
    } finally {
      setIsRunning(false)
    }
  }, [workflowId, fetchRuns])

  const saveWorkflow = useCallback(async () => {
    if (!workflowId) {
      alert('Falta el id del workflow')
      return
    }
    try {
      setSaving(true)
      const res = await fetch(`/api/workflows/${workflowId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nodes, connections })
      })
      if (!res.ok) throw new Error('No se pudo guardar')
      alert('Guardado')
    } catch (e) {
      console.error(e)
      alert('No se pudo guardar el workflow')
    } finally {
      setSaving(false)
    }
  }, [workflowId, nodes, connections])

  const getAiSuggestions = useCallback(() => {
    const suggestions = [
      "Crear workflow para procesar leads de LinkedIn",
      "Automatizar respuestas de soporte con IA",
      "Generar reportes semanales automáticamente",
      "Sincronizar datos entre CRM y email marketing",
      "Detectar y responder a menciones en redes sociales"
    ]
    setAiSuggestions(suggestions)
  }, [])

  return (
    <div className="h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`${sidebarCollapsed ? 'w-16' : 'w-80'} bg-white border-r border-gray-200 flex flex-col transition-all duration-300`}>
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className={`text-lg font-semibold text-gray-900 ${sidebarCollapsed ? 'hidden' : 'block'}`}>
              Workflow Builder
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            >
              {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </div>
          {!sidebarCollapsed && (
            <p className="text-sm text-gray-500">Crea workflows inteligentes con IA</p>
          )}
        </div>

        {!sidebarCollapsed && (
          <>
            {/* AI Chat */}
            <div className="p-4 border-b border-gray-200">
              <Button
                onClick={() => setShowAiChat(!showAiChat)}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                <Brain className="h-4 w-4 mr-2" />
                IA Copilot
              </Button>
              
              {showAiChat && (
                <div className="mt-4 p-3 bg-purple-50 rounded-lg">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-purple-900">Sugerencias de IA:</p>
                    {aiSuggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => getAiSuggestions()}
                        className="block w-full text-left text-xs text-purple-700 hover:text-purple-900 p-2 rounded hover:bg-purple-100"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Node Types */}
            <div className="flex-1 overflow-y-auto p-4">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Nodos Disponibles</h3>
              <div className="space-y-2">
                {nodeTypes.map((nodeType, index) => (
                  <button
                    key={index}
                    onClick={() => addNode(nodeType)}
                    className="w-full p-3 text-left border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-sm transition-all"
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 ${nodeType.color} rounded-lg flex items-center justify-center`}>
                        <nodeType.icon className="h-4 w-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-gray-900">{nodeType.title}</span>
                          {nodeType.aiEnabled && (
                            <Badge className="bg-purple-100 text-purple-700 text-xs">
                              <Brain className="h-3 w-3 mr-1" />
                              IA
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-gray-500">{nodeType.description}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="p-4 border-t border-gray-200 space-y-2">
              <Button
                onClick={runWorkflow}
                disabled={isRunning || nodes.length === 0}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                {isRunning ? (
                  <>
                    <Pause className="h-4 w-4 mr-2" />
                    Ejecutando...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Ejecutar Workflow
                  </>
                )}
              </Button>
              
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm">
                  <Save className="h-4 w-4 mr-1" />
                  Guardar
                </Button>
                <Button variant="outline" size="sm">
                  <Share className="h-4 w-4 mr-1" />
                  Compartir
                </Button>
              </div>
            </div>
          </>
        )}

        {/* Collapsed Sidebar Icons */}
        {sidebarCollapsed && (
          <div className="flex-1 flex flex-col items-center space-y-4 p-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarCollapsed(false)}
              className="w-10 h-10 p-0"
            >
              <Brain className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarCollapsed(false)}
              className="w-10 h-10 p-0"
            >
              <Plus className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarCollapsed(false)}
              className="w-10 h-10 p-0"
            >
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        )}
      </div>

      {/* Main Canvas */}
      <div className="flex-1 relative">
        <div className="absolute inset-0 bg-gray-50">
          {/* Grid Background */}
          <div className="absolute inset-0 opacity-30" style={{
            backgroundImage: `
              linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px'
          }} />
          
          {/* Nodes */}
          {nodes.map((node) => (
            <div
              key={node.id}
              className={`absolute cursor-move p-4 rounded-lg border-2 shadow-lg bg-white hover:shadow-xl transition-all ${
                selectedNode === node.id ? 'border-blue-500' : 'border-gray-200'
              }`}
              style={{
                left: node.position.x,
                top: node.position.y,
                minWidth: '200px'
              }}
              onClick={() => setSelectedNode(node.id)}
            >
              <div className="flex items-center space-x-3 mb-2">
                <div className={`w-8 h-8 ${node.color} rounded-lg flex items-center justify-center`}>
                  <node.icon className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-900">{node.title}</span>
                    {node.aiEnabled && (
                      <Badge className="bg-purple-100 text-purple-700 text-xs">
                        <Brain className="h-3 w-3 mr-1" />
                        IA
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">{node.description}</p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    deleteNode(node.id)
                  }}
                  className="text-gray-400 hover:text-red-500"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              {/* Performance Metrics */}
              {node.performance && (
                <div className="mt-2 space-y-1">
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Tiempo: {node.performance.avgExecutionTime.toFixed(0)}ms</span>
                    <span>Éxito: {node.performance.successRate.toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1">
                    <div 
                      className="bg-green-500 h-1 rounded-full" 
                      style={{ width: `${node.performance.successRate}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Connections */}
          {connections.map((connection) => (
            <div
              key={connection.id}
              className="absolute pointer-events-none"
              style={{
                left: 0,
                top: 0,
                width: '100%',
                height: '100%'
              }}
            >
              <svg className="w-full h-full">
                <path
                  d="M 100 100 Q 200 50 300 100"
                  stroke={connection.type === 'success' ? '#10b981' : '#ef4444'}
                  strokeWidth="2"
                  fill="none"
                  markerEnd="url(#arrowhead)"
                />
              </svg>
            </div>
          ))}
        </div>

        {/* Canvas Controls */}
        <div className="absolute top-4 right-4 flex space-x-2">
          <Button variant="outline" size="sm" onClick={saveWorkflow} disabled={saving || loading}>
            <Save className="h-4 w-4 mr-1" />
            {saving ? 'Guardando...' : 'Guardar'}
          </Button>
          <Button variant="outline" size="sm" onClick={fetchRuns}>
            <BarChart3 className="h-4 w-4 mr-1" />
            Runs
          </Button>
        </div>

        {/* AI Suggestions Overlay */}
        {nodes.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center max-w-md">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Crea tu primer workflow con IA
              </h3>
              <p className="text-gray-500 mb-4">
                Arrastra nodos desde el panel izquierdo o usa el IA Copilot para generar workflows automáticamente
              </p>
              <Button
                onClick={() => setShowAiChat(true)}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                <Brain className="h-4 w-4 mr-2" />
                Generar con IA
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Right side panels */}
      <div className="w-80 border-l border-gray-200 bg-white p-4 hidden xl:block space-y-6">
        {/* Node config */}
        <div>
          <h3 className="text-sm font-semibold text-gray-800 mb-3">Configuración del nodo</h3>
          {!selectedNode && (
            <p className="text-xs text-gray-500">Selecciona un nodo para editar su configuración</p>
          )}
          {selectedNode && (
            <>
              {nodes.filter(n => n.id === selectedNode).map(node => (
                <div key={node.id} className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Tipo</label>
                    <div className="text-xs text-gray-600 capitalize">{node.type}</div>
                  </div>
                  {/* Configuración para nodos IA */}
                  {node.type === 'ai' && (
                    <>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Modelo</label>
                        <select
                          className="w-full border rounded-md px-2 py-1 text-sm"
                          value={node.config?.model || 'gpt-4o-mini'}
                          onChange={(e) => updateSelectedNodeConfig({ model: e.target.value })}
                        >
                          <option value="gpt-4o-mini">gpt-4o-mini</option>
                          <option value="gpt-4o">gpt-4o</option>
                          <option value="o3-mini">o3-mini (razonamiento)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Prompt</label>
                        <textarea
                          className="w-full border rounded-md px-2 py-1 text-sm"
                          rows={3}
                          placeholder="Instrucciones de la IA..."
                          value={node.config?.prompt || ''}
                          onChange={(e) => updateSelectedNodeConfig({ prompt: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Temperatura</label>
                        <input
                          type="number"
                          min={0}
                          max={1}
                          step={0.1}
                          className="w-full border rounded-md px-2 py-1 text-sm"
                          value={node.config?.temperature ?? 0.2}
                          onChange={(e) => updateSelectedNodeConfig({ temperature: parseFloat(e.target.value) })}
                        />
                      </div>
                    </>
                  )}
                  {/* Config genérica */}
                  {node.type !== 'ai' && (
                    <div className="text-xs text-gray-500">Este nodo no tiene configuración avanzada.</div>
                  )}
                </div>
              ))}
            </>
          )}
        </div>

        <h3 className="text-sm font-semibold text-gray-800 mb-3">Historial de ejecuciones</h3>
        <div className="space-y-3 overflow-y-auto max-h-[calc(100vh-80px)]">
          {runs.length === 0 && (
            <p className="text-xs text-gray-500">No hay ejecuciones aún</p>
          )}
          {runs.map((run) => {
            const output = run?.output || {}
            const ai = Array.isArray(output?.ai) ? output.ai : []
            const preview = ai.length > 0 && ai[0]?.text ? String(ai[0].text) : null
            return (
              <div key={run.id} className="p-3 rounded-lg border bg-gray-50">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium">{run.status}</span>
                  <span className="text-gray-500">{new Date(run.startedAt).toLocaleString()}</span>
                </div>
                <div className="text-xs text-gray-600 mt-1">Duración: {run.duration ?? '-'} ms</div>
                {preview && (
                  <div className="mt-2 text-xs text-gray-700 bg-white border rounded p-2 max-h-32 overflow-auto">
                    {preview}
                  </div>
                )}
                <div className="mt-2">
                  <Button size="sm" variant="outline" onClick={() => { setSelectedRun(run); setShowRunModal(true) }}>Ver detalle</Button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
      {showRunModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowRunModal(false)}>
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[80vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 border-b flex items-center justify-between">
              <h4 className="font-semibold text-gray-900 text-sm">Detalle de ejecución</h4>
              <Button variant="ghost" size="sm" onClick={() => setShowRunModal(false)}>✕</Button>
            </div>
            <pre className="p-4 text-xs whitespace-pre-wrap break-words">{JSON.stringify(selectedRun, null, 2)}</pre>
          </div>
        </div>
      )}
    </div>
  )
}
