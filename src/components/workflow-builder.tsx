'use client'

import { useState, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog'
import { 
  Play, 
  Save, 
  Settings, 
  Plus, 
  Trash2, 
  Copy,
  Pause,
  CheckCircle,
  AlertCircle,
  Workflow as WorkflowIcon,
  Zap,
  Eye,
  Download
} from 'lucide-react'
import { 
  WORKFLOW_NODES, 
  WORKFLOW_TEMPLATES,
  createWorkflow,
  addNodeToWorkflow,
  connectNodes,
  validateWorkflow,
  executeWorkflow,
  type Workflow,
  type WorkflowNode,
  type WorkflowConnection
} from '@/lib/workflow-builder'

interface WorkflowBuilderProps {
  onSave?: (workflow: Workflow) => void
  onExecute?: (workflow: Workflow) => void
}

export function WorkflowBuilder({ onSave, onExecute }: WorkflowBuilderProps) {
  const [workflow, setWorkflow] = useState<Workflow | null>(null)
  const [selectedNode, setSelectedNode] = useState<WorkflowNode | null>(null)
  const [isExecuting, setIsExecuting] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showTemplates, setShowTemplates] = useState(false)
  const [workflowName, setWorkflowName] = useState('')
  const [workflowDescription, setWorkflowDescription] = useState('')
  const [selectedIndustry, setSelectedIndustry] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [validationErrors, setValidationErrors] = useState<string[]>([])

  const handleCreateWorkflow = () => {
    if (!workflowName || !selectedIndustry) {
      setError('Por favor, completa el nombre del workflow y selecciona una industria')
      return
    }

    try {
      setError(null)
      setSuccess(null)
      const newWorkflow = createWorkflow(workflowName, selectedIndustry)
      setWorkflow(newWorkflow)
      setWorkflowDescription('')
      setSuccess('Workflow creado exitosamente')
    } catch (err) {
      setError('Error creando el workflow. Por favor, intenta de nuevo.')
      console.error('Error creating workflow:', err)
    }
  }

  const handleLoadTemplate = (template: Partial<Workflow>) => {
    const newWorkflow: Workflow = {
      id: `workflow-${Date.now()}`,
      name: template.name || 'Nuevo Workflow',
      description: template.description || '',
      industry: template.industry || 'general',
      status: 'draft',
      nodes: template.nodes || [],
      connections: template.connections || [],
      createdAt: new Date(),
      updatedAt: new Date(),
      runs: 0,
      successRate: 0
    }
    setWorkflow(newWorkflow)
    setWorkflowName(newWorkflow.name)
    setWorkflowDescription(newWorkflow.description)
    setSelectedIndustry(newWorkflow.industry)
    setShowTemplates(false)
  }

  const handleAddNode = (nodeType: string) => {
    if (!workflow) return

    const position = {
      x: Math.random() * 400 + 100,
      y: Math.random() * 300 + 100
    }

    const updatedWorkflow = addNodeToWorkflow(workflow, nodeType, position)
    setWorkflow(updatedWorkflow)
  }

  const handleNodeClick = (node: WorkflowNode) => {
    setSelectedNode(node)
  }

  const handleSaveWorkflow = () => {
    if (!workflow) return

    const updatedWorkflow = {
      ...workflow,
      name: workflowName,
      description: workflowDescription,
      industry: selectedIndustry,
      updatedAt: new Date()
    }

    setWorkflow(updatedWorkflow)
    onSave?.(updatedWorkflow)
  }

  const handleExecuteWorkflow = async () => {
    if (!workflow) {
      setError('No hay workflow para ejecutar')
      return
    }

    // Validar workflow
    const validation = validateWorkflow(workflow)
    if (!validation.valid) {
      setValidationErrors(validation.errors)
      setError(`Errores en el workflow: ${validation.errors.join(', ')}`)
      return
    }

    setIsExecuting(true)
    setError(null)
    setSuccess(null)
    setValidationErrors([])

    try {
      const result = await executeWorkflow(workflow, { test: true })
      console.log('Workflow ejecutado:', result)
      setSuccess('Workflow ejecutado exitosamente')
      onExecute?.(workflow)
    } catch (error) {
      console.error('Error ejecutando workflow:', error)
      setError('Error ejecutando el workflow. Por favor, revisa la configuración.')
    } finally {
      setIsExecuting(false)
    }
  }

  const getNodeColor = (type: string) => {
    const colors = {
      trigger: 'from-blue-500 to-cyan-500',
      action: 'from-green-500 to-emerald-500',
      condition: 'from-yellow-500 to-orange-500',
      delay: 'from-purple-500 to-pink-500',
      webhook: 'from-indigo-500 to-blue-500',
      ai: 'from-rose-500 to-pink-500'
    }
    return colors[type as keyof typeof colors] || 'from-gray-500 to-slate-500'
  }

  const getNodeIcon = (type: string) => {
    const icons = {
      trigger: '⚡',
      action: '🎯',
      condition: '❓',
      delay: '⏰',
      webhook: '🔗',
      ai: '🧠'
    }
    return icons[type as keyof typeof icons] || '🔧'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white flex items-center">
            <WorkflowIcon className="w-8 h-8 mr-3 text-blue-400" />
            Constructor de Workflows
          </h2>
          <p className="text-gray-400">Crea automatizaciones visuales sin código</p>
        </div>
        <div className="flex space-x-2">
          <Dialog open={showTemplates} onOpenChange={setShowTemplates}>
            <DialogTrigger asChild>
              <Button variant="outline" className="text-white border-white/20 hover:bg-white/10">
                <Copy className="w-4 h-4 mr-2" />
                Plantillas
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-900 border-gray-700 max-w-4xl">
              <DialogHeader>
                <DialogTitle className="text-white">Plantillas de Workflows</DialogTitle>
                <DialogDescription className="text-gray-400">
                  Elige una plantilla para empezar rápidamente
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {WORKFLOW_TEMPLATES.map((template, index) => (
                  <Card key={index} className="bg-gray-800 border-gray-700 cursor-pointer hover:bg-gray-700 transition-colors">
                    <CardHeader>
                      <CardTitle className="text-white text-lg">{template.name}</CardTitle>
                      <p className="text-gray-400 text-sm">{template.description}</p>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <Badge className="bg-blue-500">{template.industry}</Badge>
                        <Button
                          size="sm"
                          onClick={() => handleLoadTemplate(template)}
                          className="bg-blue-500 hover:bg-blue-600 text-white"
                        >
                          Usar Plantilla
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Mensajes de Error y Éxito */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <p className="text-red-400 font-medium">Error</p>
          </div>
          <p className="text-red-300 mt-1">{error}</p>
          {validationErrors.length > 0 && (
            <ul className="mt-2 list-disc list-inside text-red-300 text-sm">
              {validationErrors.map((err, index) => (
                <li key={index}>{err}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      {success && (
        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-400" />
            <p className="text-green-400 font-medium">Éxito</p>
          </div>
          <p className="text-green-300 mt-1">{success}</p>
        </div>
      )}

      {!workflow ? (
        /* Crear nuevo workflow */
        <Card className="bg-white/5 backdrop-blur-xl border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Crear Nuevo Workflow</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="workflowName" className="text-white">Nombre del Workflow</Label>
              <Input
                id="workflowName"
                value={workflowName}
                onChange={(e) => setWorkflowName(e.target.value)}
                placeholder="Mi Workflow de Automatización"
                className="bg-gray-800 border-gray-600 text-white"
              />
            </div>
            <div>
              <Label htmlFor="workflowDescription" className="text-white">Descripción</Label>
              <Input
                id="workflowDescription"
                value={workflowDescription}
                onChange={(e) => setWorkflowDescription(e.target.value)}
                placeholder="Describe qué hace este workflow"
                className="bg-gray-800 border-gray-600 text-white"
              />
            </div>
            <div>
              <Label htmlFor="industry" className="text-white">Industria</Label>
              <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
                <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                  <SelectValue placeholder="Selecciona una industria" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  <SelectItem value="ecommerce" className="text-white">E-commerce</SelectItem>
                  <SelectItem value="saas" className="text-white">SaaS</SelectItem>
                  <SelectItem value="realestate" className="text-white">Inmobiliaria</SelectItem>
                  <SelectItem value="healthcare" className="text-white">Salud</SelectItem>
                  <SelectItem value="education" className="text-white">Educación</SelectItem>
                  <SelectItem value="fitness" className="text-white">Fitness</SelectItem>
                  <SelectItem value="restaurant" className="text-white">Restaurantes</SelectItem>
                  <SelectItem value="consulting" className="text-white">Consultoría</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              onClick={handleCreateWorkflow}
              disabled={!workflowName || !selectedIndustry}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Crear Workflow
            </Button>
          </CardContent>
        </Card>
      ) : (
        /* Editor de workflow */
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Panel de nodos */}
          <div className="lg:col-span-1">
            <Card className="bg-white/5 backdrop-blur-xl border-white/10">
              <CardHeader>
                <CardTitle className="text-white text-lg">Nodos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {Object.entries(
                  WORKFLOW_NODES.reduce((acc, node) => {
                    if (!acc[node.type]) acc[node.type] = []
                    acc[node.type].push(node)
                    return acc
                  }, {} as Record<string, typeof WORKFLOW_NODES>)
                ).map(([type, nodes]) => (
                  <div key={type} className="space-y-1">
                    <h4 className="text-white font-semibold text-sm capitalize">{type}s</h4>
                    {nodes.map((node, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => handleAddNode(node.name)}
                        className="w-full justify-start text-white border-white/20 hover:bg-white/10"
                      >
                        <span className="mr-2">{node.icon}</span>
                        {node.name}
                      </Button>
                    ))}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Canvas del workflow */}
          <div className="lg:col-span-2">
            <Card className="bg-white/5 backdrop-blur-xl border-white/10 h-96">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white">{workflow.name}</CardTitle>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      onClick={handleSaveWorkflow}
                      className="bg-green-500 hover:bg-green-600 text-white"
                    >
                      <Save className="w-4 h-4 mr-1" />
                      Guardar
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleExecuteWorkflow}
                      disabled={isExecuting}
                      className="bg-blue-500 hover:bg-blue-600 text-white"
                    >
                      {isExecuting ? (
                        <Zap className="w-4 h-4 mr-1 animate-spin" />
                      ) : (
                        <Play className="w-4 h-4 mr-1" />
                      )}
                      {isExecuting ? 'Ejecutando...' : 'Ejecutar'}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="relative h-64 bg-gray-900 rounded-lg overflow-hidden">
                  {workflow.nodes.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      <div className="text-center">
                        <WorkflowIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>Arrastra nodos aquí para crear tu workflow</p>
                      </div>
                    </div>
                  ) : (
                    <div className="relative h-full">
                      {workflow.nodes.map((node) => (
                        <div
                          key={node.id}
                          onClick={() => handleNodeClick(node)}
                          className={`absolute cursor-pointer p-3 rounded-lg border-2 border-white/20 hover:border-white/40 transition-all ${
                            selectedNode?.id === node.id ? 'border-blue-400' : ''
                          }`}
                          style={{
                            left: node.position.x,
                            top: node.position.y,
                            background: `linear-gradient(135deg, ${getNodeColor(node.type)})`
                          }}
                        >
                          <div className="flex items-center space-x-2 text-white">
                            <span className="text-lg">{getNodeIcon(node.type)}</span>
                            <div>
                              <div className="font-semibold text-sm">{node.name}</div>
                              <div className="text-xs opacity-75">{node.description}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Panel de propiedades */}
          <div className="lg:col-span-1">
            <Card className="bg-white/5 backdrop-blur-xl border-white/10">
              <CardHeader>
                <CardTitle className="text-white text-lg">Propiedades</CardTitle>
              </CardHeader>
              <CardContent>
                {selectedNode ? (
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-white font-semibold">{selectedNode.name}</h4>
                      <p className="text-gray-400 text-sm">{selectedNode.description}</p>
                    </div>
                    <div>
                      <Label className="text-white">Tipo</Label>
                      <Badge className="bg-blue-500 capitalize">{selectedNode.type}</Badge>
                    </div>
                    <div>
                      <Label className="text-white">Entradas</Label>
                      <div className="space-y-1">
                        {selectedNode.inputs.map((input, index) => (
                          <div key={index} className="text-sm text-gray-300 bg-gray-800 px-2 py-1 rounded">
                            {input}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <Label className="text-white">Salidas</Label>
                      <div className="space-y-1">
                        {selectedNode.outputs.map((output, index) => (
                          <div key={index} className="text-sm text-gray-300 bg-gray-800 px-2 py-1 rounded">
                            {output}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-400">
                    <Settings className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>Selecciona un nodo para ver sus propiedades</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Estadísticas del workflow */}
      {workflow && (
        <Card className="bg-white/5 backdrop-blur-xl border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Estadísticas del Workflow</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{workflow.nodes.length}</div>
                <div className="text-sm text-gray-400">Nodos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{workflow.connections.length}</div>
                <div className="text-sm text-gray-400">Conexiones</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{workflow.runs}</div>
                <div className="text-sm text-gray-400">Ejecuciones</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{workflow.successRate}%</div>
                <div className="text-sm text-gray-400">Tasa de Éxito</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}