'use client'

import { useState, useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Workflow, 
  Plus, 
  Play,
  Pause,
  Save,
  Download,
  Upload,
  Settings,
  Trash2,
  Copy,
  CheckCircle,
  AlertCircle,
  Clock,
  Zap,
  Mail,
  Database,
  Webhook,
  FileText,
  Users,
  Calendar,
  MessageSquare,
  BarChart3,
  Eye,
  Edit,
  Move,
  GripVertical,
  Sparkles,
  ArrowRight,
  Brain,
  Target,
  TrendingUp,
  Activity,
  Layers,
  GitBranch,
  PlayCircle,
  PauseCircle,
  RotateCcw,
  Maximize2,
  Minimize2,
  Grid3X3,
  MousePointer,
  Hand,
  Wand2,
  Lightbulb,
  Rocket,
  Star,
  Heart,
  Shield,
  Lock,
  Unlock,
  RefreshCw,
  X,
  Check,
  AlertTriangle,
  Info,
  HelpCircle,
  Languages,
  Code,
  Image
} from 'lucide-react'
import { useWorkspace } from '@/hooks/use-workspace'
import { useToast } from '@/components/advanced-toast'
import { AIAgentChat } from '@/components/ai-agent-chat'

interface WorkflowNode {
  id: string
  type: string
  name: string
  description: string
  icon: any
  color: string
  position: { x: number; y: number }
  config: any
}

interface WorkflowConnection {
  id: string
  from: string
  to: string
}

const nodeTypes = [
  // Triggers
  {
    id: 'webhook-trigger',
    name: 'Webhook Trigger',
    description: 'Inicia cuando recibe un webhook',
    icon: Webhook,
    color: 'from-green-500 to-emerald-500',
    category: 'Triggers',
    gradient: 'from-green-400 to-emerald-400',
    popular: true
  },
  {
    id: 'schedule-trigger',
    name: 'Schedule',
    description: 'Ejecuta en horarios específicos',
    icon: Clock,
    color: 'from-blue-500 to-cyan-500',
    category: 'Triggers',
    gradient: 'from-blue-400 to-cyan-400',
    popular: true
  },
  {
    id: 'email-trigger',
    name: 'Email Trigger',
    description: 'Inicia cuando llega un email',
    icon: Mail,
    color: 'from-purple-500 to-pink-500',
    category: 'Triggers',
    gradient: 'from-purple-400 to-pink-400'
  },
  {
    id: 'form-trigger',
    name: 'Form Submit',
    description: 'Inicia cuando se envía un formulario',
    icon: FileText,
    color: 'from-orange-500 to-red-500',
    category: 'Triggers',
    gradient: 'from-orange-400 to-red-400'
  },

  // Actions
  {
    id: 'ai-action',
    name: 'IA Assistant',
    description: 'Procesa con inteligencia artificial',
    icon: Brain,
    color: 'from-pink-500 to-rose-500',
    category: 'Actions',
    gradient: 'from-pink-400 to-rose-400',
    popular: true,
    exclusive: true
  },
  {
    id: 'email-action',
    name: 'Send Email',
    description: 'Envía un email personalizado',
    icon: Mail,
    color: 'from-blue-500 to-indigo-500',
    category: 'Actions',
    gradient: 'from-blue-400 to-indigo-400',
    popular: true
  },
  {
    id: 'webhook-action',
    name: 'HTTP Request',
    description: 'Hace una petición HTTP',
    icon: Webhook,
    color: 'from-purple-500 to-violet-500',
    category: 'Actions',
    gradient: 'from-purple-400 to-violet-400',
    popular: true
  },
  {
    id: 'database-action',
    name: 'Database',
    description: 'Operación de base de datos',
    icon: Database,
    color: 'from-orange-500 to-amber-500',
    category: 'Actions',
    gradient: 'from-orange-400 to-amber-400'
  },
  {
    id: 'notification-action',
    name: 'Notification',
    description: 'Envía notificación push',
    icon: MessageSquare,
    color: 'from-red-500 to-pink-500',
    category: 'Actions',
    gradient: 'from-red-400 to-pink-400'
  },
  {
    id: 'analytics-action',
    name: 'Analytics',
    description: 'Registra eventos de analytics',
    icon: BarChart3,
    color: 'from-indigo-500 to-blue-500',
    category: 'Actions',
    gradient: 'from-indigo-400 to-blue-400'
  },

  // Logic
  {
    id: 'condition',
    name: 'Condition',
    description: 'Condición lógica IF/ELSE',
    icon: GitBranch,
    color: 'from-yellow-500 to-orange-500',
    category: 'Logic',
    gradient: 'from-yellow-400 to-orange-400',
    popular: true
  },
  {
    id: 'delay',
    name: 'Delay',
    description: 'Espera un tiempo específico',
    icon: Clock,
    color: 'from-gray-500 to-slate-500',
    category: 'Logic',
    gradient: 'from-gray-400 to-slate-400'
  },
  {
    id: 'loop',
    name: 'Loop',
    description: 'Repite acciones múltiples veces',
    icon: RotateCcw,
    color: 'from-cyan-500 to-teal-500',
    category: 'Logic',
    gradient: 'from-cyan-400 to-teal-400'
  },
  {
    id: 'merge',
    name: 'Merge',
    description: 'Combina múltiples flujos',
    icon: Layers,
    color: 'from-violet-500 to-purple-500',
    category: 'Logic',
    gradient: 'from-violet-400 to-purple-400'
  },

  // AI & Advanced
  {
    id: 'ai-generate',
    name: 'AI Generate',
    description: 'Genera contenido con IA',
    icon: Wand2,
    color: 'from-pink-500 to-purple-500',
    category: 'AI & Advanced',
    gradient: 'from-pink-400 to-purple-400',
    exclusive: true
  },
  {
    id: 'ai-analyze',
    name: 'AI Analyze',
    description: 'Analiza datos con IA',
    icon: Target,
    color: 'from-indigo-500 to-purple-500',
    category: 'AI & Advanced',
    gradient: 'from-indigo-400 to-purple-400',
    exclusive: true
  },
  {
    id: 'ai-translate',
    name: 'AI Translate',
    description: 'Traduce texto con IA',
    icon: Languages,
    color: 'from-emerald-500 to-teal-500',
    category: 'AI & Advanced',
    gradient: 'from-emerald-400 to-teal-400',
    exclusive: true
  },
  {
    id: 'ai-summarize',
    name: 'AI Summarize',
    description: 'Resume documentos largos con IA',
    icon: FileText,
    color: 'from-cyan-500 to-blue-500',
    category: 'AI & Advanced',
    gradient: 'from-cyan-400 to-blue-400',
    exclusive: true
  },
  {
    id: 'ai-sentiment',
    name: 'AI Sentiment',
    description: 'Analiza sentimientos con IA',
    icon: Heart,
    color: 'from-rose-500 to-pink-500',
    category: 'AI & Advanced',
    gradient: 'from-rose-400 to-pink-400',
    exclusive: true
  },
  {
    id: 'ai-classify',
    name: 'AI Classify',
    description: 'Clasifica contenido con IA',
    icon: Layers,
    color: 'from-violet-500 to-purple-500',
    category: 'AI & Advanced',
    gradient: 'from-violet-400 to-purple-400',
    exclusive: true
  },
  {
    id: 'ai-extract',
    name: 'AI Extract',
    description: 'Extrae datos estructurados con IA',
    icon: Database,
    color: 'from-amber-500 to-orange-500',
    category: 'AI & Advanced',
    gradient: 'from-amber-400 to-orange-400',
    exclusive: true
  },
  {
    id: 'ai-chatbot',
    name: 'AI Chatbot',
    description: 'Responde preguntas con IA conversacional',
    icon: MessageSquare,
    color: 'from-teal-500 to-cyan-500',
    category: 'AI & Advanced',
    gradient: 'from-teal-400 to-cyan-400',
    exclusive: true
  },
  {
    id: 'ai-code',
    name: 'AI Code',
    description: 'Genera código con IA',
    icon: Code,
    color: 'from-slate-500 to-gray-500',
    category: 'AI & Advanced',
    gradient: 'from-slate-400 to-gray-400',
    exclusive: true
  },
  {
    id: 'ai-image',
    name: 'AI Image',
    description: 'Genera imágenes con IA',
    icon: Image,
    color: 'from-fuchsia-500 to-pink-500',
    category: 'AI & Advanced',
    gradient: 'from-fuchsia-400 to-pink-400',
    exclusive: true
  }
]

export default function WorkflowBuilderPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { currentWorkspace } = useWorkspace()
  const { addToast } = useToast()
  const canvasRef = useRef<HTMLDivElement>(null)

  const [workflowName, setWorkflowName] = useState('')
  const [workflowDescription, setWorkflowDescription] = useState('')
  const [nodes, setNodes] = useState<WorkflowNode[]>([])
  const [connections, setConnections] = useState<WorkflowConnection[]>([])
  const [selectedNode, setSelectedNode] = useState<WorkflowNode | null>(null)
  const [isRunning, setIsRunning] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [viewMode, setViewMode] = useState<'design' | 'preview'>('design')
  const [zoom, setZoom] = useState(100)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [draggedNode, setDraggedNode] = useState<any>(null)
  const [canvasPosition, setCanvasPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    } else if (status === 'authenticated') {
      setIsLoaded(true)
    }
  }, [status, router])

  // Atajos de teclado
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 's':
            e.preventDefault()
            saveWorkflow()
            break
          case 'r':
            e.preventDefault()
            if (nodes.length > 0) {
              runWorkflow()
            }
            break
          case 'n':
            e.preventDefault()
            addToast({
              type: 'info',
              title: 'Atajo de teclado',
              message: 'Ctrl+N: Crear nuevo nodo (próximamente)',
              duration: 3000
            })
            break
          case 'd':
            e.preventDefault()
            if (selectedNode) {
              deleteNode(selectedNode.id)
            }
            break
        }
      }
      
      if (e.key === 'Delete' && selectedNode) {
        deleteNode(selectedNode.id)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedNode, nodes.length])

  const addNode = (nodeType: any, position?: { x: number; y: number }) => {
    const newNode: WorkflowNode = {
      id: `node_${Date.now()}`,
      type: nodeType.id,
      name: nodeType.name,
      description: nodeType.description,
      icon: nodeType.icon,
      color: nodeType.color,
      position: position || { x: Math.random() * 400 + 100, y: Math.random() * 300 + 100 },
      config: {}
    }
    setNodes([...nodes, newNode])
    setSelectedNode(newNode)
    
    // Mostrar toast de confirmación
    addToast({
      type: nodeType.exclusive ? 'premium' : 'success',
      title: 'Nodo añadido',
      message: `${nodeType.name} se ha añadido al workflow`,
      duration: 3000,
      icon: nodeType.exclusive ? <Sparkles className="h-4 w-4" /> : undefined
    })
  }

  const handleDragStart = (e: React.DragEvent, nodeType: any) => {
    setDraggedNode(nodeType)
    e.dataTransfer.effectAllowed = 'copy'
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'copy'
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    if (draggedNode && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      addNode(draggedNode, { x, y })
      setDraggedNode(null)
    }
  }

  const updateNode = (nodeId: string, updates: Partial<WorkflowNode>) => {
    setNodes(nodes.map(node => 
      node.id === nodeId ? { ...node, ...updates } : node
    ))
  }

  const deleteNode = (nodeId: string) => {
    const nodeToDelete = nodes.find(node => node.id === nodeId)
    setNodes(nodes.filter(node => node.id !== nodeId))
    setConnections(connections.filter(conn => 
      conn.from !== nodeId && conn.to !== nodeId
    ))
    
    // Mostrar toast de confirmación
    addToast({
      type: 'info',
      title: 'Nodo eliminado',
      message: `${nodeToDelete?.name || 'Nodo'} se ha eliminado del workflow`,
      duration: 3000
    })
  }

  const saveWorkflow = async () => {
    if (!workflowName.trim()) {
      setError('El nombre del workflow es requerido')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/workflows', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: workflowName,
          description: workflowDescription,
          nodes,
          connections,
          workspaceId: currentWorkspace?.id
        }),
      })

      if (response.ok) {
        setSuccess('Workflow guardado exitosamente')
        addToast({
          type: 'success',
          title: 'Workflow guardado',
          message: `${workflowName} se ha guardado exitosamente`,
          duration: 4000
        })
      } else {
        throw new Error('Error al guardar el workflow')
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const runWorkflow = async () => {
    setIsRunning(true)
    addToast({
      type: 'info',
      title: 'Workflow iniciado',
      message: 'Tu automatización está ejecutándose...',
      duration: 3000
    })
    
    // Simular ejecución del workflow
    setTimeout(() => {
      setIsRunning(false)
      setSuccess('Workflow ejecutado exitosamente')
      addToast({
        type: 'success',
        title: 'Workflow completado',
        message: 'Tu automatización se ha ejecutado exitosamente',
        duration: 4000
      })
    }, 3000)
  }

  const handleAIAction = (action: any) => {
    console.log('AI Action executed:', action)
    
    // Manejar acciones específicas del workflow builder
    switch (action.type) {
      case 'create_workflow':
        setWorkflowName(action.parameters.name)
        setWorkflowDescription(action.parameters.description)
        addToast({
          type: 'success',
          title: 'Workflow creado',
          message: `"${action.parameters.name}" ha sido configurado`,
          duration: 3000
        })
        break
      
      case 'add_node':
        const nodeType = nodeTypes.find(nt => nt.id === action.parameters.nodeType)
        if (nodeType) {
          addNode(nodeType, action.parameters.position)
        }
        break
      
      case 'execute_workflow':
        if (nodes.length > 0) {
          runWorkflow()
        } else {
          addToast({
            type: 'warning',
            title: 'Workflow vacío',
            message: 'Añade nodos antes de ejecutar',
            duration: 3000
          })
        }
        break
      
      default:
        console.log('Acción no manejada:', action)
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-32 w-32 border-4 border-blue-200 mx-auto"></div>
            <div className="animate-spin rounded-full h-32 w-32 border-4 border-blue-600 border-t-transparent mx-auto absolute top-0 left-0"></div>
          </div>
          <p className="mt-6 text-gray-600 text-lg font-medium">Cargando constructor de workflows...</p>
          <div className="mt-4 flex justify-center space-x-1">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce delay-100"></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce delay-200"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <DashboardLayout>
      <div className={`space-y-6 transition-all duration-1000 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Constructor de Workflows Visual
              </h1>
              <Sparkles className="h-8 w-8 text-purple-500 animate-pulse" />
            </div>
            <p className="text-gray-600 text-lg">
              Crea automatizaciones complejas arrastrando y soltando nodos. 
              <span className="text-purple-600 font-semibold"> Sin código requerido.</span>
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Badge variant="secondary" className="text-sm bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 border-purple-200">
              <Sparkles className="w-3 h-3 mr-1" />
              Exclusivo de Stack21
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="hover:bg-blue-50"
            >
              {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Configuración del Workflow */}
        <Card className="group relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-500 bg-white/80 backdrop-blur-sm">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 group-hover:from-blue-500/10 group-hover:to-purple-500/10 transition-opacity duration-300"></div>
          <CardHeader className="relative">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg">
                <Settings className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl">Configuración del Workflow</CardTitle>
                <CardDescription className="text-gray-600">
                  Define los detalles básicos de tu automatización
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 relative">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Nombre del Workflow</label>
                <Input
                  placeholder="Mi Workflow de Automatización"
                  value={workflowName}
                  onChange={(e) => setWorkflowName(e.target.value)}
                  className="border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Estado</label>
                <Select>
                  <SelectTrigger className="border-gray-200 focus:border-blue-500 focus:ring-blue-500/20">
                    <SelectValue placeholder="Selecciona estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">📝 Borrador</SelectItem>
                    <SelectItem value="active">✅ Activo</SelectItem>
                    <SelectItem value="paused">⏸️ Pausado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Descripción</label>
              <Textarea
                placeholder="Describe qué hace este workflow y cómo ayuda a tu negocio..."
                value={workflowDescription}
                onChange={(e) => setWorkflowDescription(e.target.value)}
                rows={3}
                className="border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
              />
            </div>
          </CardContent>
        </Card>

        <div className={`grid grid-cols-1 xl:grid-cols-4 gap-4 lg:gap-6 transition-all duration-1000 delay-200 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          {/* Panel de Nodos */}
          <div className="lg:col-span-1">
            <Card className="group relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-500 bg-white/80 backdrop-blur-sm">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 group-hover:from-purple-500/10 group-hover:to-pink-500/10 transition-opacity duration-300"></div>
              <CardHeader className="relative">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg">
                    <Layers className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Nodos Disponibles</CardTitle>
                    <CardDescription className="text-gray-600">
                      Arrastra nodos al canvas para crear tu workflow
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="relative">
                <div className="space-y-6">
                  {['Triggers', 'Actions', 'Logic', 'AI & Advanced'].map(category => (
                    <div key={category}>
                      <div className="flex items-center space-x-2 mb-3">
                        <h4 className="font-semibold text-sm text-gray-700">{category}</h4>
                        {category === 'AI & Advanced' && (
                          <Badge variant="secondary" className="text-xs bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800">
                            <Sparkles className="w-3 h-3 mr-1" />
                            IA
                          </Badge>
                        )}
                      </div>
                      <div className="space-y-2">
                        {nodeTypes
                          .filter(node => node.category === category)
                          .map(nodeType => (
                            <div
                              key={nodeType.id}
                              draggable
                              onDragStart={(e) => handleDragStart(e, nodeType)}
                              className={`group/node p-3 border rounded-xl cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-md ${
                                nodeType.popular ? 'border-blue-200 bg-blue-50/50' : 'border-gray-200 bg-white'
                              } ${nodeType.exclusive ? 'border-purple-200 bg-purple-50/50' : ''}`}
                              onClick={() => addNode(nodeType)}
                            >
                              <div className="flex items-center space-x-3">
                                <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${nodeType.color} flex items-center justify-center text-white shadow-lg group-hover/node:scale-110 transition-transform duration-300`}>
                                  <nodeType.icon className="h-4 w-4" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center space-x-2">
                                    <p className="font-medium text-sm text-gray-900 truncate">{nodeType.name}</p>
                                    {nodeType.popular && (
                                      <Star className="h-3 w-3 text-yellow-500 fill-current" />
                                    )}
                                    {nodeType.exclusive && (
                                      <Sparkles className="h-3 w-3 text-purple-500" />
                                    )}
                                  </div>
                                  <p className="text-xs text-gray-500 truncate">{nodeType.description}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Canvas del Workflow */}
          <div className="lg:col-span-3">
            <Card className="group relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-500 bg-white/80 backdrop-blur-sm">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 group-hover:from-indigo-500/10 group-hover:to-purple-500/10 transition-opacity duration-300"></div>
              <CardHeader className="relative">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 shadow-lg">
                      <Workflow className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Canvas del Workflow</CardTitle>
                      <CardDescription className="text-gray-600">
                        {nodes.length} nodos • {connections.length} conexiones
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
                      <Button
                        variant={viewMode === 'design' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setViewMode('design')}
                        className="h-8"
                      >
                        <MousePointer className="h-3 w-3 mr-1" />
                        Diseño
                      </Button>
                      <Button
                        variant={viewMode === 'preview' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setViewMode('preview')}
                        className="h-8"
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        Vista
                      </Button>
                    </div>
                    <div className="hidden lg:flex items-center space-x-1 text-xs text-gray-500">
                      <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Ctrl+S</kbd>
                      <span>Guardar</span>
                      <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Ctrl+R</kbd>
                      <span>Ejecutar</span>
                      <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Del</kbd>
                      <span>Eliminar</span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={runWorkflow}
                      disabled={isRunning || nodes.length === 0}
                      className="hover:bg-green-50 hover:border-green-300"
                    >
                      {isRunning ? (
                        <>
                          <Clock className="mr-2 h-4 w-4 animate-spin" />
                          Ejecutando...
                        </>
                      ) : (
                        <>
                          <PlayCircle className="mr-2 h-4 w-4" />
                          Ejecutar
                        </>
                      )}
                    </Button>
                    <Button
                      onClick={saveWorkflow}
                      disabled={loading}
                      className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <Save className="mr-2 h-4 w-4" />
                      Guardar
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="relative">
                <div 
                  ref={canvasRef}
                  className="relative bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl h-[600px] overflow-hidden border border-gray-200"
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                >
                  {/* Grid Pattern */}
                  <div className="absolute inset-0 opacity-30">
                    <svg width="100%" height="100%">
                      <defs>
                        <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e5e7eb" strokeWidth="1"/>
                        </pattern>
                      </defs>
                      <rect width="100%" height="100%" fill="url(#grid)" />
                    </svg>
                  </div>

                  {nodes.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-gray-500">
                      <div className="text-center">
                        <div className="relative mb-6">
                          <div className="w-20 h-20 mx-auto bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full flex items-center justify-center">
                            <Workflow className="h-10 w-10 text-indigo-400" />
                          </div>
                          <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                            <Sparkles className="h-3 w-3 text-white" />
                          </div>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">¡Comienza tu workflow!</h3>
                        <p className="text-gray-500 mb-4">Arrastra nodos desde el panel izquierdo o haz clic para agregarlos</p>
                        <div className="flex items-center justify-center space-x-4 text-sm text-gray-400">
                          <div className="flex items-center space-x-1">
                            <MousePointer className="h-4 w-4" />
                            <span>Arrastra</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Hand className="h-4 w-4" />
                            <span>Haz clic</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="relative h-full">
                      {nodes.map(node => {
                        const nodeType = nodeTypes.find(nt => nt.id === node.type)
                        return (
                          <div
                            key={node.id}
                            className={`group absolute p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl ${
                              selectedNode?.id === node.id 
                                ? 'border-blue-500 bg-blue-50 shadow-lg shadow-blue-500/25' 
                                : 'border-gray-300 bg-white hover:border-gray-400'
                            }`}
                            style={{
                              left: node.position.x,
                              top: node.position.y,
                              width: '180px'
                            }}
                            onClick={() => setSelectedNode(node)}
                          >
                            <div className="flex items-center space-x-3 mb-3">
                              <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${nodeType?.color || 'from-gray-500 to-gray-600'} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                {nodeType?.icon ? <nodeType.icon className="h-5 w-5" /> : <Workflow className="h-5 w-5" />}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-sm text-gray-900 truncate">{node.name}</p>
                                <p className="text-xs text-gray-500 truncate">{node.description}</p>
                              </div>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  deleteNode(node.id)
                                }}
                                className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-red-100 hover:text-red-600"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                            <div className="flex items-center justify-between">
                              <Badge 
                                variant="secondary" 
                                className="text-xs bg-gray-100 text-gray-600"
                              >
                                {nodeType?.category || 'Unknown'}
                              </Badge>
                              {nodeType?.exclusive && (
                                <Sparkles className="h-3 w-3 text-purple-500" />
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Panel de Configuración del Nodo */}
        {selectedNode && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Edit className="mr-2 h-5 w-5" />
                Configurar Nodo: {selectedNode.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Nombre del Nodo</label>
                  <Input
                    value={selectedNode.name}
                    onChange={(e) => updateNode(selectedNode.id, { name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Descripción</label>
                  <Textarea
                    value={selectedNode.description}
                    onChange={(e) => updateNode(selectedNode.id, { description: e.target.value })}
                    rows={2}
                  />
                </div>
                {/* Configuración específica según el tipo de nodo */}
                {selectedNode.type === 'email' && (
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Email de Destino</label>
                      <Input placeholder="usuario@ejemplo.com" />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Asunto</label>
                      <Input placeholder="Asunto del email" />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Mensaje</label>
                      <Textarea placeholder="Contenido del email" rows={3} />
                    </div>
                  </div>
                )}
                {selectedNode.type === 'webhook' && (
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">URL del Webhook</label>
                      <Input placeholder="https://api.ejemplo.com/webhook" />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Método HTTP</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona método" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="GET">GET</SelectItem>
                          <SelectItem value="POST">POST</SelectItem>
                          <SelectItem value="PUT">PUT</SelectItem>
                          <SelectItem value="DELETE">DELETE</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
                {selectedNode.type === 'ai' && (
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Prompt de IA</label>
                      <Textarea placeholder="Describe qué quieres que haga la IA..." rows={3} />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Modelo de IA</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona modelo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="gpt-4">GPT-4</SelectItem>
                          <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                          <SelectItem value="claude">Claude</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Alertas */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">{success}</AlertDescription>
          </Alert>
        )}

        {/* Agente de IA */}
        <AIAgentChat onActionExecuted={handleAIAction} />
      </div>
    </DashboardLayout>
  )
}
