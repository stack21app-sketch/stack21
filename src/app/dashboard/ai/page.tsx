'use client'

import { useState, useEffect, useCallback } from 'react'
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
  Brain, 
  Send, 
  Loader2,
  CheckCircle,
  AlertCircle,
  Clock,
  Zap,
  Code,
  BookOpen,
  Lightbulb,
  Bug,
  FileText,
  Building,
  Eye,
  History
} from 'lucide-react'
import { useWorkspace } from '@/hooks/use-workspace'

interface AICapability {
  id: string
  name: string
  description: string
  icon: string
}

interface AIRequest {
  id: string
  action: string
  timestamp: string
  responseLength: number
}

export default function AIPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { currentWorkspace } = useWorkspace()
  const [capabilities, setCapabilities] = useState<AICapability[]>([])
  const [usage, setUsage] = useState<{ totalRequests: number; recentRequests: AIRequest[] } | null>(null)
  const [selectedCapability, setSelectedCapability] = useState('')
  const [prompt, setPrompt] = useState('')
  const [response, setResponse] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [history, setHistory] = useState<Array<{
    id: string
    action: string
    prompt: string
    response: string
    timestamp: string
  }>>([])

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  const fetchCapabilities = useCallback(async () => {
    try {
      const response = await fetch('/api/ai?type=capabilities')
      const data = await response.json()
      if (response.ok) {
        setCapabilities(data.capabilities)
      }
    } catch (error) {
      console.error('Error al cargar capacidades:', error)
    }
  }, [])

  const fetchUsage = useCallback(async () => {
    try {
      const response = await fetch('/api/ai?type=usage')
      const data = await response.json()
      if (response.ok) {
        setUsage(data)
      }
    } catch (error) {
      console.error('Error al cargar uso:', error)
    }
  }, [])

  useEffect(() => {
    void fetchCapabilities()
    void fetchUsage()
  }, [fetchCapabilities, fetchUsage])

  
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    )
  }

  if (status === 'unauthenticated') {
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedCapability || !prompt.trim()) return

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: selectedCapability,
          prompt: prompt.trim(),
          workspaceId: currentWorkspace?.id
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Error al procesar solicitud')
      }

      setResponse(data.response)
      
      // Agregar a historial
      const newEntry = {
        id: Date.now().toString(),
        action: selectedCapability,
        prompt: prompt.trim(),
        response: data.response,
        timestamp: new Date().toISOString()
      }
      setHistory(prev => [newEntry, ...prev.slice(0, 9)]) // Mantener solo 10 entradas

      // Recargar uso
      fetchUsage()
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error inesperado')
    } finally {
      setLoading(false)
    }
  }

  const getCapabilityIcon = (capabilityId: string) => {
    switch (capabilityId) {
      case 'generate_code':
        return <Code className="h-5 w-5" />
      case 'explain_concept':
        return <BookOpen className="h-5 w-5" />
      case 'suggest_improvements':
        return <Lightbulb className="h-5 w-5" />
      case 'debug_error':
        return <Bug className="h-5 w-5" />
      case 'create_documentation':
        return <FileText className="h-5 w-5" />
      case 'project_planning':
        return <Building className="h-5 w-5" />
      case 'code_review':
        return <Eye className="h-5 w-5" />
      default:
        return <Brain className="h-5 w-5" />
    }
  }

  const getCapabilityName = (capabilityId: string) => {
    const capability = capabilities.find(c => c.id === capabilityId)
    return capability?.name || capabilityId
  }

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('es-ES')
  }

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Brain className="mr-3 h-8 w-8 text-purple-600" />
              Asistente de IA
            </h1>
            <p className="text-gray-600 mt-2">
              {currentWorkspace ? `En ${currentWorkspace.name}` : 'Tu asistente inteligente para desarrollo'}
            </p>
          </div>
          {usage && (
            <Badge variant="outline" className="text-sm">
              <Zap className="mr-1 h-3 w-3" />
              {usage.totalRequests} requests
            </Badge>
          )}
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* AI Interface */}
        <div className="lg:col-span-2 space-y-6">
          {/* Capabilities */}
          <Card>
            <CardHeader>
              <CardTitle>Capacidades de IA</CardTitle>
              <CardDescription>
                Selecciona qué tipo de ayuda necesitas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {capabilities.map((capability) => (
                  <Button
                    key={capability.id}
                    variant={selectedCapability === capability.id ? 'default' : 'outline'}
                    className="h-auto p-4 justify-start"
                    onClick={() => setSelectedCapability(capability.id)}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{capability.icon}</span>
                      <div className="text-left">
                        <div className="font-medium">{capability.name}</div>
                        <div className="text-xs text-gray-500">
                          {capability.description}
                        </div>
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* AI Chat */}
          <Card>
            <CardHeader>
              <CardTitle>Conversar con IA</CardTitle>
              <CardDescription>
                {selectedCapability 
                  ? `Modo: ${getCapabilityName(selectedCapability)}`
                  : 'Selecciona una capacidad primero'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Tu solicitud
                  </label>
                  <Textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder={
                      selectedCapability === 'generate_code' 
                        ? 'Describe el código que necesitas generar...'
                        : selectedCapability === 'explain_concept'
                        ? '¿Qué concepto te gustaría que explique?'
                        : 'Describe lo que necesitas...'
                    }
                    rows={4}
                    disabled={!selectedCapability || loading}
                  />
                </div>
                
                <Button 
                  type="submit" 
                  disabled={!selectedCapability || !prompt.trim() || loading}
                  className="w-full"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Procesando...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Enviar
                    </>
                  )}
                </Button>
              </form>

              {/* Response */}
              {response && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">Respuesta de IA</h4>
                    <Badge variant="outline" className="text-xs">
                      {getCapabilityName(selectedCapability)}
                    </Badge>
                  </div>
                  <div className="prose prose-sm max-w-none">
                    <pre className="whitespace-pre-wrap text-sm text-gray-700">
                      {response}
                    </pre>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Usage Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="mr-2 h-5 w-5" />
                Uso de IA
              </CardTitle>
            </CardHeader>
            <CardContent>
              {usage ? (
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600">
                      {usage.totalRequests}
                    </div>
                    <div className="text-sm text-gray-500">
                      Requests este mes
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Límite diario</div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-purple-600 h-2 rounded-full" 
                        style={{ width: `${Math.min((usage.totalRequests / 50) * 100, 100)}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500">
                      {usage.totalRequests}/50 requests
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600 mx-auto"></div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <History className="mr-2 h-5 w-5" />
                Historial Reciente
              </CardTitle>
            </CardHeader>
            <CardContent>
              {history.length === 0 ? (
                <div className="text-center py-4">
                  <Clock className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">No hay historial</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {history.slice(0, 5).map((entry) => (
                    <div key={entry.id} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center space-x-2">
                          {getCapabilityIcon(entry.action)}
                          <span className="text-sm font-medium">
                            {getCapabilityName(entry.action)}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500">
                          {formatDate(entry.timestamp)}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 line-clamp-2">
                        {entry.prompt}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Tips */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Lightbulb className="mr-2 h-5 w-5" />
                Consejos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="font-medium text-blue-900">Sé específico</div>
                  <div className="text-blue-700">
                    Proporciona contexto detallado para mejores respuestas
                  </div>
                </div>
                
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="font-medium text-green-900">Usa ejemplos</div>
                  <div className="text-green-700">
                    Incluye código o ejemplos cuando sea relevante
                  </div>
                </div>
                
                <div className="p-3 bg-purple-50 rounded-lg">
                  <div className="font-medium text-purple-900">Itera</div>
                  <div className="text-purple-700">
                    Haz preguntas de seguimiento para refinar la respuesta
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
