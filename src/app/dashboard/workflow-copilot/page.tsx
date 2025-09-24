'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Brain, 
  Sparkles, 
  Play, 
  Save, 
  Download,
  Lightbulb,
  CheckCircle,
  AlertCircle,
  Loader2,
  Workflow,
  Zap
} from 'lucide-react'

export default function WorkflowCopilotPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [description, setDescription] = useState('')
  const [industry, setIndustry] = useState('')
  const [loading, setLoading] = useState(false)
  const [generatedWorkflow, setGeneratedWorkflow] = useState<any>(null)
  const [suggestions, setSuggestions] = useState<string[]>([])

  if (status === 'unauthenticated') {
    router.push('/auth/signin')
    return null
  }

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

  const generateWorkflow = async () => {
    if (!description.trim()) return

    setLoading(true)
    try {
      const response = await fetch('/api/workflows/copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate',
          description,
          industry
        })
      })

      const data = await response.json()
      if (data.success) {
        setGeneratedWorkflow(data.workflow)
        setSuggestions([])
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const getSuggestions = async () => {
    if (!generatedWorkflow) return

    setLoading(true)
    try {
      const response = await fetch('/api/workflows/copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'suggest_improvements',
          workflowId: generatedWorkflow.id
        })
      })

      const data = await response.json()
      if (data.success) {
        setSuggestions(data.suggestions)
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Brain className="mr-3 h-8 w-8 text-purple-600" />
              Copilot de Workflows
            </h1>
            <p className="text-gray-600 mt-2">
              Describe lo que quieres automatizar y la IA creará el workflow completo
            </p>
          </div>
          <Badge variant="secondary" className="px-3 py-1">
            <Sparkles className="w-4 h-4 mr-1" />
            IA Powered
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="mr-2 h-5 w-5 text-blue-600" />
                Describe tu Automatización
              </CardTitle>
              <CardDescription>
                Usa lenguaje natural para describir lo que quieres automatizar
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Industria (opcional)
                </label>
                <Select value={industry} onValueChange={setIndustry}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona tu industria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ecommerce">E-commerce</SelectItem>
                    <SelectItem value="saas">SaaS</SelectItem>
                    <SelectItem value="consultoria">Consultoría</SelectItem>
                    <SelectItem value="inmobiliaria">Inmobiliaria</SelectItem>
                    <SelectItem value="salud">Salud</SelectItem>
                    <SelectItem value="educacion">Educación</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Descripción de la Automatización
                </label>
                <Textarea
                  placeholder="Ej: Cuando alguien compre en mi tienda, crear una factura y enviar email de confirmación"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                />
              </div>

              <Button 
                onClick={generateWorkflow} 
                disabled={loading || !description.trim()}
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generando...
                  </>
                ) : (
                  <>
                    <Brain className="mr-2 h-4 w-4" />
                    Generar Workflow
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Generated Workflow */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Workflow className="mr-2 h-5 w-5 text-green-600" />
                Workflow Generado
              </CardTitle>
              <CardDescription>
                {generatedWorkflow ? 'Tu workflow está listo' : 'El workflow aparecerá aquí'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {generatedWorkflow ? (
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <h3 className="font-semibold text-green-800 mb-2">
                      {generatedWorkflow.name}
                    </h3>
                    <p className="text-green-700 text-sm mb-3">
                      {generatedWorkflow.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {generatedWorkflow.tags?.map((tag: string) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-900">Nodos del Workflow:</h4>
                    <div className="space-y-2">
                      {generatedWorkflow.nodes?.map((node: any, index: number) => (
                        <div key={node.id} className="flex items-center p-2 bg-gray-50 rounded">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                          <span className="text-sm font-medium">{node.name}</span>
                          <Badge variant="secondary" className="ml-auto text-xs">
                            {node.type}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button size="sm" onClick={getSuggestions} disabled={loading}>
                      <Lightbulb className="mr-1 h-4 w-4" />
                      Mejorar
                    </Button>
                    <Button size="sm" variant="outline">
                      <Save className="mr-1 h-4 w-4" />
                      Guardar
                    </Button>
                    <Button size="sm" variant="outline">
                      <Download className="mr-1 h-4 w-4" />
                      Exportar
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Workflow className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                  <p>Describe tu automatización para generar un workflow</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Suggestions */}
        {suggestions.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Lightbulb className="mr-2 h-5 w-5 text-yellow-600" />
                Sugerencias de Mejora
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {suggestions.map((suggestion, index) => (
                  <div key={index} className="flex items-start p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <CheckCircle className="h-5 w-5 text-yellow-600 mr-3 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-yellow-800">{suggestion}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Examples */}
        <Card>
          <CardHeader>
            <CardTitle>Ejemplos de Automatizaciones</CardTitle>
            <CardDescription>
              Inspírate con estos ejemplos para crear tu propio workflow
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  industry: 'E-commerce',
                  description: 'Cuando alguien compre un producto, enviar email de confirmación y actualizar inventario',
                  tags: ['ventas', 'inventario', 'email']
                },
                {
                  industry: 'SaaS',
                  description: 'Si un usuario no ha usado la app en 7 días, enviar email de re-engagement',
                  tags: ['retención', 'email', 'usuarios']
                },
                {
                  industry: 'Consultoría',
                  description: 'Cuando llegue una nueva consulta, asignar a consultor disponible',
                  tags: ['asignación', 'consultas', 'equipo']
                },
                {
                  industry: 'Inmobiliaria',
                  description: 'Si una propiedad lleva 30 días sin vender, sugerir reducción de precio',
                  tags: ['precios', 'propiedades', 'ventas']
                }
              ].map((example, index) => (
                <div 
                  key={index}
                  className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                  onClick={() => {
                    setDescription(example.description)
                    setIndustry(example.industry.toLowerCase())
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{example.industry}</h4>
                    <Badge variant="outline" className="text-xs">
                      {example.industry}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{example.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {example.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
