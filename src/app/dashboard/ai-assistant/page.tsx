'use client'

import { useState, useEffect } from 'react'
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
  History,
  Target,
  TrendingUp,
  Users,
  BarChart3,
  Settings
} from 'lucide-react'
import { useWorkspace } from '@/hooks/use-workspace'

interface IndustryTemplate {
  id: string
  name: string
  description: string
  icon: string
  color: string
  prompts: string[]
  features: string[]
}

const industryTemplates: IndustryTemplate[] = [
  {
    id: 'ecommerce',
    name: 'E-commerce',
    description: 'Automatización para tiendas online',
    icon: '🛒',
    color: 'bg-blue-500',
    prompts: [
      'Optimiza mi estrategia de SEO para productos',
      'Crea descripciones de productos que conviertan',
      'Analiza la competencia en mi nicho',
      'Genera campañas de email marketing',
      'Mejora mi página de checkout'
    ],
    features: ['SEO', 'Marketing', 'Conversión', 'Análisis']
  },
  {
    id: 'saas',
    name: 'SaaS',
    description: 'Herramientas para empresas de software',
    icon: '💻',
    color: 'bg-green-500',
    prompts: [
      'Diseña una estrategia de pricing',
      'Crea documentación técnica',
      'Optimiza el onboarding de usuarios',
      'Genera casos de uso para mi API',
      'Mejora mi página de landing'
    ],
    features: ['Pricing', 'Documentación', 'Onboarding', 'API']
  },
  {
    id: 'consulting',
    name: 'Consultoría',
    description: 'Automatización para consultores',
    icon: '📊',
    color: 'bg-purple-500',
    prompts: [
      'Crea propuestas comerciales profesionales',
      'Genera reportes de análisis',
      'Diseña presentaciones ejecutivas',
      'Optimiza procesos de consultoría',
      'Crea templates de contratos'
    ],
    features: ['Propuestas', 'Reportes', 'Presentaciones', 'Contratos']
  },
  {
    id: 'realestate',
    name: 'Inmobiliaria',
    description: 'Herramientas para el sector inmobiliario',
    icon: '🏠',
    color: 'bg-orange-500',
    prompts: [
      'Crea descripciones atractivas de propiedades',
      'Genera estrategias de marketing inmobiliario',
      'Optimiza listados en portales',
      'Crea presentaciones para clientes',
      'Analiza el mercado local'
    ],
    features: ['Descripciones', 'Marketing', 'Listados', 'Análisis']
  },
  {
    id: 'healthcare',
    name: 'Salud',
    description: 'Automatización para el sector salud',
    icon: '🏥',
    color: 'bg-red-500',
    prompts: [
      'Crea protocolos de atención',
      'Genera informes médicos',
      'Optimiza la gestión de citas',
      'Crea materiales educativos',
      'Mejora la comunicación con pacientes'
    ],
    features: ['Protocolos', 'Informes', 'Gestión', 'Educación']
  },
  {
    id: 'education',
    name: 'Educación',
    description: 'Herramientas para educadores',
    icon: '🎓',
    color: 'bg-indigo-500',
    prompts: [
      'Crea planes de estudio personalizados',
      'Genera evaluaciones y exámenes',
      'Diseña materiales didácticos',
      'Optimiza la gestión de clases',
      'Crea contenido educativo interactivo'
    ],
    features: ['Planes', 'Evaluaciones', 'Materiales', 'Gestión']
  }
]

export default function AIAssistantPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { currentWorkspace } = useWorkspace()

  const [selectedIndustry, setSelectedIndustry] = useState<string>('')
  const [prompt, setPrompt] = useState<string>('')
  const [aiResponse, setAiResponse] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [conversationHistory, setConversationHistory] = useState<Array<{
    id: string
    prompt: string
    response: string
    industry: string
    timestamp: string
  }>>([])

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  const handleIndustrySelect = (industryId: string) => {
    setSelectedIndustry(industryId)
    const industry = industryTemplates.find(i => i.id === industryId)
    if (industry) {
      setPrompt(industry.prompts[0])
    }
  }

  const handlePromptSelect = (promptText: string) => {
    setPrompt(promptText)
  }

  const handleGenerate = async () => {
    if (!selectedIndustry || !prompt) {
      setError('Por favor, selecciona una industria y escribe un prompt.')
      return
    }

    setLoading(true)
    setError(null)
    setAiResponse('')

    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'industry_assistant',
          prompt: `Industria: ${selectedIndustry}\n\nPrompt: ${prompt}`,
          workspaceId: currentWorkspace?.id,
          context: {
            industry: selectedIndustry,
            workspace: currentWorkspace?.name
          }
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Error al procesar la solicitud de IA')
      }

      setAiResponse(data.response)
      
      // Agregar a historial
      const newEntry = {
        id: Date.now().toString(),
        prompt,
        response: data.response,
        industry: selectedIndustry,
        timestamp: new Date().toISOString()
      }
      setConversationHistory(prev => [newEntry, ...prev.slice(0, 9)]) // Mantener solo 10 entradas

    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const selectedIndustryData = industryTemplates.find(i => i.id === selectedIndustry)

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

  if (!session) {
    return null
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center">
              <Brain className="mr-3 h-8 w-8 text-blue-600" />
              Asistente de IA por Industria
            </h1>
            <p className="text-muted-foreground mt-2">
              IA especializada que se adapta a tu industria específica para darte respuestas más precisas y relevantes.
            </p>
          </div>
          <Badge variant="secondary" className="text-sm">
            ✨ Exclusivo de Stack21
          </Badge>
        </div>

        {/* Selección de Industria */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="mr-2 h-5 w-5" />
              Selecciona tu Industria
            </CardTitle>
            <CardDescription>
              Elige tu industria para obtener respuestas personalizadas y especializadas.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {industryTemplates.map((industry) => (
                <div
                  key={industry.id}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${
                    selectedIndustry === industry.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleIndustrySelect(industry.id)}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-full ${industry.color} flex items-center justify-center text-white text-xl`}>
                      {industry.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold">{industry.name}</h3>
                      <p className="text-sm text-gray-600">{industry.description}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1">
                    {industry.features.map((feature) => (
                      <Badge key={feature} variant="outline" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Prompt y Generación */}
        {selectedIndustry && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="mr-2 h-5 w-5" />
                Generar con IA Especializada
              </CardTitle>
              <CardDescription>
                {selectedIndustryData?.name} - Prompts especializados para tu industria
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Prompts Rápidos */}
              <div>
                <label className="text-sm font-medium mb-2 block">Prompts Rápidos</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {selectedIndustryData?.prompts.map((quickPrompt, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="justify-start text-left h-auto p-3"
                      onClick={() => handlePromptSelect(quickPrompt)}
                    >
                      {quickPrompt}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Prompt Personalizado */}
              <div>
                <label className="text-sm font-medium mb-2 block">Tu Prompt Personalizado</label>
                <Textarea
                  placeholder="Escribe tu solicitud específica..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={4}
                />
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button onClick={handleGenerate} disabled={loading} className="w-full">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generando con IA Especializada...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Generar Respuesta Especializada
                  </>
                )}
              </Button>

              {aiResponse && (
                <Card className="mt-4">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                      Respuesta de IA Especializada
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: aiResponse.replace(/\n/g, '<br/>') }} />
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        )}

        {/* Historial de Conversaciones */}
        {conversationHistory.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <History className="mr-2 h-5 w-5" />
                Historial de Conversaciones
              </CardTitle>
              <CardDescription>
                Tus últimas consultas con el asistente de IA especializado
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {conversationHistory.map((entry) => (
                  <div key={entry.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="secondary">
                        {industryTemplates.find(i => i.id === entry.industry)?.name}
                      </Badge>
                      <span className="text-sm text-gray-500">
                        {new Date(entry.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <strong>Pregunta:</strong>
                        <p className="text-sm text-gray-700 mt-1">{entry.prompt}</p>
                      </div>
                      <div>
                        <strong>Respuesta:</strong>
                        <p className="text-sm text-gray-700 mt-1 line-clamp-3">{entry.response}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
