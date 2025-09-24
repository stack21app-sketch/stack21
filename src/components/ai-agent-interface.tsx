'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Loader2, Bot, MessageSquare, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import { AgentUsageStats } from './agent-usage-stats'

// ===== TIPOS =====

interface AIAgent {
  id: string
  name: string
  description: string
  icon: string
  category: string
  capabilities: Array<{
    id: string
    name: string
    description: string
  }>
  isActive: boolean
}

interface AgentExecution {
  id: string
  agentId: string
  userId: string
  workspaceId: string
  input: string
  output: any
  status: 'pending' | 'running' | 'completed' | 'failed'
  error?: string
  duration?: number
  tokensUsed?: number
  cost?: number
  createdAt: string
  completedAt?: string
  agent?: {
    id: string
    name: string
    description: string
    icon: string
    category: string
  }
}

// ===== COMPONENTE PRINCIPAL =====

export function AIAgentInterface() {
  const { data: session } = useSession()
  const [agents, setAgents] = useState<AIAgent[]>([])
  const [executions, setExecutions] = useState<AgentExecution[]>([])
  const [selectedAgent, setSelectedAgent] = useState<AIAgent | null>(null)
  const [userInput, setUserInput] = useState('')
  const [isExecuting, setIsExecuting] = useState(false)
  const [activeTab, setActiveTab] = useState('chat')

  // Cargar agentes disponibles
  useEffect(() => {
    loadAgents()
    loadExecutions()
  }, [])

  const loadAgents = async () => {
    try {
      const response = await fetch('/api/agents')
      const data = await response.json()
      
      if (data.success) {
        setAgents(data.data.agents)
        if (data.data.agents.length > 0) {
          setSelectedAgent(data.data.agents[0])
        }
      }
    } catch (error) {
      console.error('Error cargando agentes:', error)
      toast({
        title: "Error",
        description: "No se pudieron cargar los agentes",
        variant: "destructive"
      })
    }
  }

  const loadExecutions = async () => {
    try {
      const response = await fetch('/api/agents/executions?limit=20')
      const data = await response.json()
      
      if (data.success) {
        setExecutions(data.data.executions)
      }
    } catch (error) {
      console.error('Error cargando ejecuciones:', error)
    }
  }

  const executeAgent = async () => {
    if (!selectedAgent || !userInput.trim()) {
      toast({
        title: "Error",
        description: "Selecciona un agente y escribe tu solicitud",
        variant: "destructive"
      })
      return
    }

    setIsExecuting(true)

    try {
      const response = await fetch('/api/agents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          agentId: selectedAgent.id,
          input: userInput.trim()
        })
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "¡Éxito!",
          description: "El agente ha procesado tu solicitud",
        })
        
        // Actualizar ejecuciones
        await loadExecutions()
        
        // Limpiar input
        setUserInput('')
        
        // Cambiar a pestaña de historial
        setActiveTab('history')
      } else {
        throw new Error(data.error || 'Error ejecutando agente')
      }
    } catch (error) {
      console.error('Error ejecutando agente:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error ejecutando agente",
        variant: "destructive"
      })
    } finally {
      setIsExecuting(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />
      case 'running':
        return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />
    }
  }

  const formatDuration = (ms?: number) => {
    if (!ms) return 'N/A'
    return `${(ms / 1000).toFixed(1)}s`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-ES')
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          🤖 Agentes de IA Inteligentes
        </h1>
        <p className="text-gray-600">
          Automatiza tareas complejas con nuestros agentes especializados
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="chat">💬 Chat con Agentes</TabsTrigger>
          <TabsTrigger value="agents">🤖 Agentes Disponibles</TabsTrigger>
          <TabsTrigger value="history">📋 Historial</TabsTrigger>
        </TabsList>

        {/* Pestaña de Chat */}
        <TabsContent value="chat" className="space-y-6">
          {/* Estadísticas de uso */}
          <AgentUsageStats />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Selector de Agente */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bot className="h-5 w-5" />
                  Seleccionar Agente
                </CardTitle>
                <CardDescription>
                  Elige el agente que mejor se adapte a tu tarea
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {agents.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Bot className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Cargando agentes disponibles...</p>
                  </div>
                ) : (
                  agents.map((agent) => (
                    <div
                      key={agent.id}
                      className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 hover:shadow-md ${
                        selectedAgent?.id === agent.id
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-950 shadow-md ring-2 ring-blue-200 dark:ring-blue-800'
                          : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                      }`}
                      onClick={() => {
                        setSelectedAgent(agent)
                        // Feedback visual
                        const element = document.querySelector(`[data-agent-id="${agent.id}"]`)
                        if (element) {
                          element.classList.add('animate-pulse')
                          setTimeout(() => element.classList.remove('animate-pulse'), 1000)
                        }
                      }}
                      data-agent-id={agent.id}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${
                          selectedAgent?.id === agent.id 
                            ? 'bg-blue-100 dark:bg-blue-900' 
                            : 'bg-gray-100 dark:bg-gray-800'
                        }`}>
                          <span className="text-2xl">{agent.icon}</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium text-gray-900 dark:text-gray-100">
                              {agent.name}
                            </h3>
                            {selectedAgent?.id === agent.id && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {agent.description}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge 
                              variant={selectedAgent?.id === agent.id ? "default" : "secondary"}
                              className="text-xs"
                            >
                              {agent.category}
                            </Badge>
                            {agent.isActive && (
                              <Badge variant="outline" className="text-xs text-green-600 border-green-200">
                                Activo
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Chat Interface */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  {selectedAgent ? `Chat con ${selectedAgent.name}` : 'Selecciona un Agente'}
                </CardTitle>
                <CardDescription>
                  {selectedAgent ? selectedAgent.description : 'Elige un agente para comenzar'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedAgent && (
                  <>
                    {/* Capabilities */}
                    <div>
                      <h4 className="font-medium mb-2">Capacidades:</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedAgent.capabilities.map((capability) => (
                          <Badge key={capability.id} variant="outline">
                            {capability.name}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    {/* Input */}
                    <div className="space-y-3">
                      <label className="text-sm font-medium">
                        ¿Qué necesitas que haga el agente?
                      </label>
                      <Textarea
                        placeholder="Ej: Reserva una mesa para 4 personas mañana a las 8pm en un restaurante italiano cerca de mi oficina..."
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        rows={4}
                        disabled={isExecuting}
                      />
                      <Button
                        onClick={executeAgent}
                        disabled={!userInput.trim() || isExecuting}
                        className="w-full"
                      >
                        {isExecuting ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Ejecutando...
                          </>
                        ) : (
                          <>
                            <Bot className="h-4 w-4 mr-2" />
                            Ejecutar Agente
                          </>
                        )}
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Pestaña de Agentes */}
        <TabsContent value="agents" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agents.map((agent) => (
              <Card key={agent.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-2xl">{agent.icon}</span>
                    {agent.name}
                  </CardTitle>
                  <CardDescription>{agent.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Badge variant="secondary">{agent.category}</Badge>
                  <div>
                    <h4 className="font-medium mb-2">Capacidades:</h4>
                    <div className="space-y-1">
                      {agent.capabilities.slice(0, 3).map((capability) => (
                        <div key={capability.id} className="text-sm text-gray-600">
                          • {capability.name}
                        </div>
                      ))}
                      {agent.capabilities.length > 3 && (
                        <div className="text-sm text-gray-500">
                          +{agent.capabilities.length - 3} más...
                        </div>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedAgent(agent)
                      setActiveTab('chat')
                    }}
                    className="w-full"
                  >
                    Usar este Agente
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Pestaña de Historial */}
        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Historial de Ejecuciones</CardTitle>
              <CardDescription>
                Revisa todas las tareas que han ejecutado los agentes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-4">
                  {executions.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Bot className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No hay ejecuciones aún</p>
                      <p className="text-sm">Usa un agente para ver el historial aquí</p>
                    </div>
                  ) : (
                    executions.map((execution) => (
                      <div
                        key={execution.id}
                        className="p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            {getStatusIcon(execution.status)}
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-lg">{execution.agent?.icon}</span>
                                <h3 className="font-medium">{execution.agent?.name}</h3>
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {execution.input}
                              </p>
                            </div>
                          </div>
                          <div className="text-right text-sm text-gray-500">
                            <div>{formatDate(execution.createdAt)}</div>
                            <div>{formatDuration(execution.duration)}</div>
                          </div>
                        </div>
                        
                        {execution.status === 'completed' && execution.output && (
                          <div className="mt-3 p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                            <h4 className="font-medium text-green-800 dark:text-green-200 mb-1">
                              Resultado:
                            </h4>
                            <pre className="text-sm text-green-700 dark:text-green-300 whitespace-pre-wrap">
                              {JSON.stringify(execution.output, null, 2)}
                            </pre>
                          </div>
                        )}
                        
                        {execution.status === 'failed' && execution.error && (
                          <div className="mt-3 p-3 bg-red-50 dark:bg-red-950 rounded-lg">
                            <h4 className="font-medium text-red-800 dark:text-red-200 mb-1">
                              Error:
                            </h4>
                            <p className="text-sm text-red-700 dark:text-red-300">
                              {execution.error}
                            </p>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
