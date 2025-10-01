'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  BookOpen, 
  Code, 
  Play, 
  Copy, 
  Download, 
  Search, 
  Filter,
  ChevronDown,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  Clock,
  Zap,
  Database,
  Mail,
  Webhook,
  User,
  Settings,
  Globe,
  Lock,
  Key,
  Eye,
  EyeOff,
  Brain
} from 'lucide-react'

interface APIEndpoint {
  id: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  path: string
  title: string
  description: string
  category: 'workflows' | 'users' | 'analytics' | 'integrations' | 'webhooks' | 'ai'
  tags: string[]
  parameters: Array<{
    name: string
    type: string
    required: boolean
    description: string
    example?: any
  }>
  requestBody?: {
    type: string
    schema: any
    example: any
  }
  responses: Array<{
    status: number
    description: string
    schema: any
    example: any
  }>
  examples: Array<{
    language: 'curl' | 'javascript' | 'python' | 'php' | 'go'
    code: string
    description: string
  }>
  rateLimit?: {
    requests: number
    window: string
  }
  authentication: 'api-key' | 'oauth' | 'jwt' | 'none'
}

const mockEndpoints: APIEndpoint[] = [
  {
    id: '1',
    method: 'POST',
    path: '/api/v1/workflows',
    title: 'Crear Workflow',
    description: 'Crea un nuevo workflow de automatización',
    category: 'workflows',
    tags: ['workflows', 'automation', 'create'],
    parameters: [],
    requestBody: {
      type: 'application/json',
      schema: {
        type: 'object',
        properties: {
          name: { type: 'string', description: 'Nombre del workflow' },
          description: { type: 'string', description: 'Descripción del workflow' },
          steps: { type: 'array', description: 'Pasos del workflow' }
        },
        required: ['name', 'steps']
      },
      example: {
        name: 'Email Marketing Automation',
        description: 'Workflow para automatizar email marketing',
        steps: [
          {
            id: 'trigger-1',
            type: 'webhook',
            config: {
              url: '/api/webhooks/email-signup',
              method: 'POST'
            }
          }
        ]
      }
    },
    responses: [
      {
        status: 201,
        description: 'Workflow creado exitosamente',
        schema: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            status: { type: 'string' },
            created_at: { type: 'string' }
          }
        },
        example: {
          id: 'wf_123456789',
          name: 'Email Marketing Automation',
          status: 'active',
          created_at: '2024-01-20T10:30:00Z'
        }
      },
      {
        status: 400,
        description: 'Error de validación',
        schema: {
          type: 'object',
          properties: {
            error: { type: 'string' },
            details: { type: 'array' }
          }
        },
        example: {
          error: 'Validation failed',
          details: ['Name is required', 'Steps must be an array']
        }
      }
    ],
    examples: [
      {
        language: 'curl',
        code: `curl -X POST https://api.stack21.com/v1/workflows \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "Email Marketing Automation",
    "description": "Workflow para automatizar email marketing",
    "steps": [
      {
        "id": "trigger-1",
        "type": "webhook",
        "config": {
          "url": "/api/webhooks/email-signup",
          "method": "POST"
        }
      }
    ]
  }'`,
        description: 'Crear workflow con cURL'
      },
      {
        language: 'javascript',
        code: `const response = await fetch('https://api.stack21.com/v1/workflows', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'Email Marketing Automation',
    description: 'Workflow para automatizar email marketing',
    steps: [
      {
        id: 'trigger-1',
        type: 'webhook',
        config: {
          url: '/api/webhooks/email-signup',
          method: 'POST'
        }
      }
    ]
  })
});

const workflow = await response.json();
console.log(workflow);`,
        description: 'Crear workflow con JavaScript'
      }
    ],
    rateLimit: {
      requests: 100,
      window: '1 hour'
    },
    authentication: 'api-key'
  },
  {
    id: '2',
    method: 'GET',
    path: '/api/v1/workflows',
    title: 'Listar Workflows',
    description: 'Obtiene una lista de todos los workflows del usuario',
    category: 'workflows',
    tags: ['workflows', 'list', 'read'],
    parameters: [
      {
        name: 'page',
        type: 'integer',
        required: false,
        description: 'Número de página',
        example: 1
      },
      {
        name: 'limit',
        type: 'integer',
        required: false,
        description: 'Número de elementos por página',
        example: 20
      },
      {
        name: 'status',
        type: 'string',
        required: false,
        description: 'Filtrar por estado',
        example: 'active'
      }
    ],
    responses: [
      {
        status: 200,
        description: 'Lista de workflows obtenida exitosamente',
        schema: {
          type: 'object',
          properties: {
            data: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  name: { type: 'string' },
                  status: { type: 'string' },
                  created_at: { type: 'string' }
                }
              }
            },
            pagination: {
              type: 'object',
              properties: {
                page: { type: 'integer' },
                limit: { type: 'integer' },
                total: { type: 'integer' }
              }
            }
          }
        },
        example: {
          data: [
            {
              id: 'wf_123456789',
              name: 'Email Marketing Automation',
              status: 'active',
              created_at: '2024-01-20T10:30:00Z'
            }
          ],
          pagination: {
            page: 1,
            limit: 20,
            total: 1
          }
        }
      }
    ],
    examples: [
      {
        language: 'curl',
        code: `curl -X GET "https://api.stack21.com/v1/workflows?page=1&limit=20&status=active" \\
  -H "Authorization: Bearer YOUR_API_KEY"`,
        description: 'Listar workflows con cURL'
      }
    ],
    rateLimit: {
      requests: 1000,
      window: '1 hour'
    },
    authentication: 'api-key'
  }
]

const categories = [
  { id: 'all', name: 'Todas', icon: Globe, count: mockEndpoints.length },
  { id: 'workflows', name: 'Workflows', icon: Zap, count: 2 },
  { id: 'users', name: 'Usuarios', icon: User, count: 0 },
  { id: 'analytics', name: 'Analytics', icon: Database, count: 0 },
  { id: 'integrations', name: 'Integraciones', icon: Settings, count: 0 },
  { id: 'webhooks', name: 'Webhooks', icon: Webhook, count: 0 },
  { id: 'ai', name: 'IA', icon: Brain, count: 0 }
]

export default function APIDocumentation() {
  const [selectedEndpoint, setSelectedEndpoint] = useState<APIEndpoint | null>(mockEndpoints[0])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedExample, setSelectedExample] = useState(0)
  const [showApiKey, setShowApiKey] = useState(false)

  const filteredEndpoints = mockEndpoints.filter(endpoint => {
    const matchesCategory = selectedCategory === 'all' || endpoint.category === selectedCategory
    const matchesSearch = endpoint.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         endpoint.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         endpoint.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    return matchesCategory && matchesSearch
  })

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET': return 'bg-green-100 text-green-800'
      case 'POST': return 'bg-blue-100 text-blue-800'
      case 'PUT': return 'bg-yellow-100 text-yellow-800'
      case 'DELETE': return 'bg-red-100 text-red-800'
      case 'PATCH': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return 'text-green-600'
    if (status >= 400 && status < 500) return 'text-red-600'
    if (status >= 500) return 'text-orange-600'
    return 'text-gray-600'
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl">
              <BookOpen className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Documentación de API</h1>
              <p className="text-gray-600">Explora y prueba nuestra API REST completa</p>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar endpoints, métodos, descripciones..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => {
                const Icon = category.icon
                return (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategory(category.id)}
                    className="flex items-center"
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {category.name}
                    <Badge className="ml-2 bg-gray-100 text-gray-700">
                      {category.count}
                    </Badge>
                  </Button>
                )
              })}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Endpoints List */}
          <div className="lg:col-span-1">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Code className="h-5 w-5 mr-2 text-blue-500" />
                  Endpoints
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-1">
                  {filteredEndpoints.map((endpoint) => (
                    <div
                      key={endpoint.id}
                      className={`p-4 cursor-pointer transition-colors hover:bg-gray-50 ${
                        selectedEndpoint?.id === endpoint.id ? 'bg-blue-50 border-r-2 border-blue-500' : ''
                      }`}
                      onClick={() => setSelectedEndpoint(endpoint)}
                    >
                      <div className="flex items-start space-x-3">
                        <Badge className={`text-xs ${getMethodColor(endpoint.method)}`}>
                          {endpoint.method}
                        </Badge>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-medium text-gray-900 truncate">
                            {endpoint.title}
                          </h3>
                          <p className="text-xs text-gray-600 truncate">
                            {endpoint.path}
                          </p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {endpoint.tags.slice(0, 2).map((tag, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                            {endpoint.tags.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{endpoint.tags.length - 2}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Endpoint Details */}
          <div className="lg:col-span-2">
            {selectedEndpoint ? (
              <div className="space-y-6">
                {/* Endpoint Header */}
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Badge className={`text-sm ${getMethodColor(selectedEndpoint.method)}`}>
                          {selectedEndpoint.method}
                        </Badge>
                        <code className="text-lg font-mono text-gray-900">
                          {selectedEndpoint.path}
                        </code>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <Play className="h-4 w-4 mr-2" />
                          Probar
                        </Button>
                        <Button variant="outline" size="sm">
                          <Copy className="h-4 w-4 mr-2" />
                          Copiar
                        </Button>
                      </div>
                    </div>
                    <CardTitle className="text-xl mt-2">{selectedEndpoint.title}</CardTitle>
                    <p className="text-gray-600">{selectedEndpoint.description}</p>
                  </CardHeader>
                </Card>

                {/* Parameters */}
                {selectedEndpoint.parameters.length > 0 && (
                  <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-lg">Parámetros</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {selectedEndpoint.parameters.map((param, index) => (
                          <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2">
                                <code className="text-sm font-mono text-gray-900">{param.name}</code>
                                <Badge variant="outline" className="text-xs">
                                  {param.type}
                                </Badge>
                                {param.required && (
                                  <Badge className="bg-red-100 text-red-800 text-xs">
                                    Requerido
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-gray-600 mt-1">{param.description}</p>
                              {param.example && (
                                <p className="text-xs text-gray-500 mt-1">
                                  Ejemplo: <code>{JSON.stringify(param.example)}</code>
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Request Body */}
                {selectedEndpoint.requestBody && (
                  <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-lg">Cuerpo de la Petición</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">Content-Type</Badge>
                          <code className="text-sm">{selectedEndpoint.requestBody.type}</code>
                        </div>
                        <div className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto">
                          <pre className="text-sm">
                            {JSON.stringify(selectedEndpoint.requestBody.example, null, 2)}
                          </pre>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Responses */}
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-lg">Respuestas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {selectedEndpoint.responses.map((response, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center space-x-2 mb-2">
                            <code className={`text-sm font-mono ${getStatusColor(response.status)}`}>
                              {response.status}
                            </code>
                            <span className="text-sm text-gray-600">{response.description}</span>
                          </div>
                          <div className="bg-gray-900 text-green-400 p-3 rounded overflow-x-auto">
                            <pre className="text-sm">
                              {JSON.stringify(response.example, null, 2)}
                            </pre>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Examples */}
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-lg">Ejemplos de Código</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex flex-wrap gap-2">
                        {selectedEndpoint.examples.map((example, index) => (
                          <Button
                            key={index}
                            variant={selectedExample === index ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setSelectedExample(index)}
                          >
                            {example.language}
                          </Button>
                        ))}
                      </div>
                      
                      {selectedEndpoint.examples[selectedExample] && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <p className="text-sm text-gray-600">
                              {selectedEndpoint.examples[selectedExample].description}
                            </p>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(selectedEndpoint.examples[selectedExample].code)}
                            >
                              <Copy className="h-4 w-4 mr-2" />
                              Copiar
                            </Button>
                          </div>
                          <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                            <pre className="text-sm">
                              {selectedEndpoint.examples[selectedExample].code}
                            </pre>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Rate Limits */}
                {selectedEndpoint.rateLimit && (
                  <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-lg">Límites de Velocidad</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">
                            {selectedEndpoint.rateLimit.requests} requests por {selectedEndpoint.rateLimit.window}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Authentication */}
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-lg">Autenticación</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-2">
                      <Lock className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">
                        {selectedEndpoint.authentication === 'api-key' && 'API Key requerida'}
                        {selectedEndpoint.authentication === 'oauth' && 'OAuth 2.0 requerido'}
                        {selectedEndpoint.authentication === 'jwt' && 'JWT Token requerido'}
                        {selectedEndpoint.authentication === 'none' && 'No se requiere autenticación'}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-8 text-center">
                  <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Selecciona un endpoint
                  </h3>
                  <p className="text-gray-600">
                    Elige un endpoint de la lista para ver su documentación completa
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
