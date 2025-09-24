'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
  DialogTrigger,
} from '@/components/ui/dialog'
import { 
  BookOpen, 
  Code, 
  Play, 
  Copy, 
  Check, 
  Search, 
  Filter,
  ExternalLink,
  Download,
  Globe,
  Key,
  Shield,
  Zap,
  Users,
  Workflow,
  Bell,
  Brain,
  CreditCard,
  BarChart3,
  Puzzle,
  Settings
} from 'lucide-react'
import {
  API_ENDPOINTS,
  API_TAGS,
  CODE_EXAMPLES,
  API_INFO,
  generateOpenAPISpec,
  type ApiEndpoint
} from '@/lib/api-docs'
import { useToast } from '@/hooks/use-toast'

interface ApiDocumentationProps {
  baseUrl?: string
}

export function ApiDocumentation({ baseUrl = 'http://localhost:3000' }: ApiDocumentationProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTag, setSelectedTag] = useState<string>('all')
  const [selectedEndpoint, setSelectedEndpoint] = useState<ApiEndpoint | null>(null)
  const [selectedLanguage, setSelectedLanguage] = useState<keyof typeof CODE_EXAMPLES>('javascript')
  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  const [testData, setTestData] = useState<Record<string, any>>({})
  const [testResponse, setTestResponse] = useState<any>(null)
  const [testing, setTesting] = useState(false)
  const { toast } = useToast()

  const filteredEndpoints = API_ENDPOINTS.filter(endpoint => {
    const matchesSearch = endpoint.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         endpoint.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         endpoint.path.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTag = selectedTag === 'all' || endpoint.tags.includes(selectedTag)
    return matchesSearch && matchesTag
  })

  const getTagIcon = (tagName: string) => {
    const icons: Record<string, any> = {
      'Auth': Key,
      'Users': Users,
      'Workspaces': Globe,
      'Team': Users,
      'Workflows': Workflow,
      'Integrations': Puzzle,
      'Analytics': BarChart3,
      'Notifications': Bell,
      'Billing': CreditCard,
      'AI': Brain
    }
    const Icon = icons[tagName] || Code
    return <Icon className="h-4 w-4" />
  }

  const getMethodColor = (method: string) => {
    const colors: Record<string, string> = {
      'GET': 'bg-green-100 text-green-800',
      'POST': 'bg-blue-100 text-blue-800',
      'PUT': 'bg-yellow-100 text-yellow-800',
      'DELETE': 'bg-red-100 text-red-800',
      'PATCH': 'bg-purple-100 text-purple-800'
    }
    return colors[method] || 'bg-gray-100 text-gray-800'
  }

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedCode(type)
      setTimeout(() => setCopiedCode(null), 2000)
      toast({
        title: 'Copiado',
        description: 'Código copiado al portapapeles',
      })
    } catch (error) {
      console.error('Error copying to clipboard:', error)
    }
  }

  const testEndpoint = async (endpoint: ApiEndpoint) => {
    setTesting(true)
    try {
      const url = `${baseUrl}${endpoint.path}`
      const options: RequestInit = {
        method: endpoint.method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${testData.token || 'YOUR_TOKEN'}`
        }
      }

      if (endpoint.requestBody && testData.body) {
        options.body = JSON.stringify(testData.body)
      }

      const response = await fetch(url, options)
      const data = await response.json()
      
      setTestResponse({
        status: response.status,
        statusText: response.statusText,
        data
      })

      toast({
        title: 'Prueba completada',
        description: `Respuesta recibida con status ${response.status}`,
      })
    } catch (error) {
      console.error('Error testing endpoint:', error)
      toast({
        title: 'Error',
        description: 'Error al probar el endpoint',
        variant: 'destructive',
      })
    } finally {
      setTesting(false)
    }
  }

  const downloadOpenAPISpec = () => {
    const spec = generateOpenAPISpec()
    const blob = new Blob([JSON.stringify(spec, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'stack21-api-spec.json'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <BookOpen className="h-8 w-8 mr-3 text-blue-600" />
            Documentación de API
          </h1>
          <p className="text-gray-600 mt-2">
            {API_INFO.description} • Versión {API_INFO.version}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            onClick={downloadOpenAPISpec}
            variant="outline"
            className="flex items-center"
          >
            <Download className="h-4 w-4 mr-2" />
            Descargar OpenAPI
          </Button>
          <Button
            onClick={() => window.open(`${baseUrl}/api/docs`, '_blank')}
            variant="outline"
            className="flex items-center"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Swagger UI
          </Button>
        </div>
      </div>

      {/* API Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Globe className="h-5 w-5 mr-2 text-blue-500" />
            Información General
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <Label className="text-sm font-medium text-gray-500">URL Base</Label>
              <p className="text-lg font-mono">{baseUrl}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-500">Versión</Label>
              <p className="text-lg">{API_INFO.version}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-500">Autenticación</Label>
              <p className="text-lg">Bearer Token (JWT)</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Buscar endpoints..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-full md:w-64">
              <Select value={selectedTag} onValueChange={setSelectedTag}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las categorías</SelectItem>
                  {API_TAGS.map(tag => (
                    <SelectItem key={tag.name} value={tag.name}>
                      <div className="flex items-center">
                        {getTagIcon(tag.name)}
                        <span className="ml-2">{tag.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Endpoints List */}
      <div className="space-y-4">
        {filteredEndpoints.map((endpoint) => (
          <Card key={`${endpoint.method}-${endpoint.path}`} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <Badge className={getMethodColor(endpoint.method)}>
                      {endpoint.method}
                    </Badge>
                    <code className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                      {endpoint.path}
                    </code>
                    <div className="flex items-center space-x-1">
                      {endpoint.tags.map(tag => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {endpoint.summary}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {endpoint.description}
                  </p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    {endpoint.parameters && (
                      <span>{endpoint.parameters.length} parámetros</span>
                    )}
                    {endpoint.requestBody && (
                      <span>Requiere body</span>
                    )}
                    <span>{endpoint.responses.length} respuestas</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedEndpoint(endpoint)}
                  >
                    <Code className="h-4 w-4 mr-1" />
                    Ver Detalles
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => testEndpoint(endpoint)}
                    disabled={testing}
                  >
                    <Play className="h-4 w-4 mr-1" />
                    Probar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Endpoint Details Dialog */}
      {selectedEndpoint && (
        <Dialog open={!!selectedEndpoint} onOpenChange={() => setSelectedEndpoint(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <Badge className={getMethodColor(selectedEndpoint.method)}>
                  {selectedEndpoint.method}
                </Badge>
                <code className="ml-3 text-lg font-mono">
                  {selectedEndpoint.path}
                </code>
              </DialogTitle>
              <DialogDescription>
                {selectedEndpoint.description}
              </DialogDescription>
            </DialogHeader>

            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Resumen</TabsTrigger>
                <TabsTrigger value="parameters">Parámetros</TabsTrigger>
                <TabsTrigger value="examples">Ejemplos</TabsTrigger>
                <TabsTrigger value="test">Probar</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Respuestas</h4>
                  <div className="space-y-2">
                    {selectedEndpoint.responses.map((response, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 border rounded-lg">
                        <Badge className={response.status < 300 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                          {response.status}
                        </Badge>
                        <span className="text-sm">{response.description}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="parameters" className="space-y-4">
                {selectedEndpoint.parameters && selectedEndpoint.parameters.length > 0 ? (
                  <div className="space-y-3">
                    {selectedEndpoint.parameters.map((param, index) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <code className="font-mono text-sm">{param.name}</code>
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline">{param.in}</Badge>
                            <Badge variant={param.required ? 'destructive' : 'secondary'}>
                              {param.required ? 'Requerido' : 'Opcional'}
                            </Badge>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{param.description}</p>
                        <div className="text-xs text-gray-500">
                          Tipo: {param.type} {param.example && `• Ejemplo: ${param.example}`}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No hay parámetros para este endpoint</p>
                )}
              </TabsContent>

              <TabsContent value="examples" className="space-y-4">
                <div>
                  <Label className="text-sm font-medium mb-2">Lenguaje de programación</Label>
                  <Select value={selectedLanguage} onValueChange={(value: any) => setSelectedLanguage(value)}>
                    <SelectTrigger className="w-64">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(CODE_EXAMPLES).map(([key, example]) => (
                        <SelectItem key={key} value={key}>
                          {example.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  {Object.entries(CODE_EXAMPLES[selectedLanguage].examples).map(([key, code]) => (
                    <div key={key} className="relative">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-sm">{key.replace('-', ' ').toUpperCase()}</h4>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(code, `${selectedLanguage}-${key}`)}
                        >
                          {copiedCode === `${selectedLanguage}-${key}` ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                        <code>{code}</code>
                      </pre>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="test" className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="token">Token de Autorización</Label>
                    <Input
                      id="token"
                      type="password"
                      placeholder="Bearer YOUR_TOKEN"
                      value={testData.token || ''}
                      onChange={(e) => setTestData(prev => ({ ...prev, token: e.target.value }))}
                    />
                  </div>

                  {selectedEndpoint.requestBody && (
                    <div>
                      <Label htmlFor="body">Request Body (JSON)</Label>
                      <textarea
                        id="body"
                        className="w-full h-32 p-3 border rounded-lg font-mono text-sm"
                        placeholder={JSON.stringify(selectedEndpoint.requestBody.content['application/json'].example, null, 2)}
                        value={testData.body ? JSON.stringify(testData.body, null, 2) : ''}
                        onChange={(e) => {
                          try {
                            const parsed = JSON.parse(e.target.value)
                            setTestData(prev => ({ ...prev, body: parsed }))
                          } catch {
                            // Invalid JSON, ignore
                          }
                        }}
                      />
                    </div>
                  )}

                  <Button
                    onClick={() => testEndpoint(selectedEndpoint)}
                    disabled={testing}
                    className="w-full"
                  >
                    {testing ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Probando...
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        Probar Endpoint
                      </>
                    )}
                  </Button>

                  {testResponse && (
                    <div className="mt-4">
                      <h4 className="font-semibold mb-2">Respuesta</h4>
                      <div className="bg-gray-100 p-4 rounded-lg">
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge className={testResponse.status < 300 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                            {testResponse.status}
                          </Badge>
                          <span className="text-sm">{testResponse.statusText}</span>
                        </div>
                        <pre className="text-sm overflow-x-auto">
                          {JSON.stringify(testResponse.data, null, 2)}
                        </pre>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
