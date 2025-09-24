// Documentación de API para Stack21
export interface ApiEndpoint {
  path: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  summary: string
  description: string
  tags: string[]
  parameters?: ApiParameter[]
  requestBody?: ApiRequestBody
  responses: ApiResponse[]
  examples?: ApiExample[]
  authentication?: ApiAuthentication
}

export interface ApiParameter {
  name: string
  in: 'query' | 'path' | 'header' | 'cookie'
  required: boolean
  description: string
  type: 'string' | 'number' | 'boolean' | 'array' | 'object'
  schema?: any
  example?: any
}

export interface ApiRequestBody {
  description: string
  required: boolean
  content: {
    [mediaType: string]: {
      schema: any
      example?: any
    }
  }
}

export interface ApiResponse {
  status: number
  description: string
  content?: {
    [mediaType: string]: {
      schema: any
      example?: any
    }
  }
}

export interface ApiExample {
  name: string
  description: string
  request: {
    method: string
    url: string
    headers?: Record<string, string>
    body?: any
  }
  response: {
    status: number
    headers?: Record<string, string>
    body: any
  }
}

export interface ApiAuthentication {
  type: 'bearer' | 'api-key' | 'oauth2'
  description: string
  scheme?: string
  bearerFormat?: string
}

export interface ApiTag {
  name: string
  description: string
  color: string
}

// Tags de la API
export const API_TAGS: ApiTag[] = [
  { name: 'Auth', description: 'Autenticación y autorización', color: 'bg-red-500' },
  { name: 'Users', description: 'Gestión de usuarios', color: 'bg-blue-500' },
  { name: 'Workspaces', description: 'Gestión de workspaces', color: 'bg-green-500' },
  { name: 'Team', description: 'Gestión de equipos', color: 'bg-purple-500' },
  { name: 'Workflows', description: 'Workflows y automatización', color: 'bg-orange-500' },
  { name: 'Integrations', description: 'Integraciones externas', color: 'bg-cyan-500' },
  { name: 'Analytics', description: 'Analytics y métricas', color: 'bg-pink-500' },
  { name: 'Notifications', description: 'Sistema de notificaciones', color: 'bg-yellow-500' },
  { name: 'Billing', description: 'Facturación y suscripciones', color: 'bg-indigo-500' },
  { name: 'AI', description: 'Asistente de IA', color: 'bg-teal-500' },
]

// Endpoints de la API
export const API_ENDPOINTS: ApiEndpoint[] = [
  // Auth
  {
    path: '/api/auth/signin',
    method: 'POST',
    summary: 'Iniciar sesión',
    description: 'Autentica un usuario y devuelve un token de acceso',
    tags: ['Auth'],
    requestBody: {
      description: 'Credenciales del usuario',
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              email: { type: 'string', format: 'email' },
              password: { type: 'string', minLength: 6 }
            },
            required: ['email', 'password']
          },
          example: {
            email: 'usuario@ejemplo.com',
            password: 'password123'
          }
        }
      }
    },
    responses: [
      {
        status: 200,
        description: 'Inicio de sesión exitoso',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                success: { type: 'boolean' },
                token: { type: 'string' },
                user: {
                  type: 'object',
                  properties: {
                    id: { type: 'string' },
                    email: { type: 'string' },
                    name: { type: 'string' }
                  }
                }
              }
            },
            example: {
              success: true,
              token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
              user: {
                id: 'user-123',
                email: 'usuario@ejemplo.com',
                name: 'Juan Pérez'
              }
            }
          }
        }
      },
      {
        status: 401,
        description: 'Credenciales inválidas',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                success: { type: 'boolean' },
                error: { type: 'string' }
              }
            },
            example: {
              success: false,
              error: 'Credenciales inválidas'
            }
          }
        }
      }
    ],
    authentication: {
      type: 'bearer',
      description: 'Token JWT requerido para endpoints protegidos',
      scheme: 'Bearer',
      bearerFormat: 'JWT'
    }
  },

  // Team Management
  {
    path: '/api/team',
    method: 'GET',
    summary: 'Obtener workspaces del usuario',
    description: 'Devuelve todos los workspaces a los que pertenece el usuario',
    tags: ['Team', 'Workspaces'],
    parameters: [
      {
        name: 'userId',
        in: 'query',
        required: true,
        description: 'ID del usuario',
        type: 'string',
        example: 'user-123'
      },
      {
        name: 'type',
        in: 'query',
        required: true,
        description: 'Tipo de datos a obtener',
        type: 'string',
        example: 'workspaces'
      }
    ],
    responses: [
      {
        status: 200,
        description: 'Lista de workspaces',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                success: { type: 'boolean' },
                data: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      id: { type: 'string' },
                      name: { type: 'string' },
                      description: { type: 'string' },
                      slug: { type: 'string' },
                      plan: { type: 'string', enum: ['free', 'starter', 'pro', 'enterprise'] },
                      maxMembers: { type: 'number' },
                      currentMembers: { type: 'number' }
                    }
                  }
                }
              }
            },
            example: {
              success: true,
              data: [
                {
                  id: 'workspace-1',
                  name: 'Mi Empresa',
                  description: 'Workspace principal',
                  slug: 'mi-empresa',
                  plan: 'pro',
                  maxMembers: 50,
                  currentMembers: 8
                }
              ]
            }
          }
        }
      }
    ]
  },

  {
    path: '/api/team',
    method: 'POST',
    summary: 'Invitar miembro al equipo',
    description: 'Envía una invitación por email para unirse al workspace',
    tags: ['Team'],
    parameters: [
      {
        name: 'userId',
        in: 'query',
        required: true,
        description: 'ID del usuario que invita',
        type: 'string',
        example: 'user-123'
      },
      {
        name: 'workspaceId',
        in: 'query',
        required: true,
        description: 'ID del workspace',
        type: 'string',
        example: 'workspace-1'
      }
    ],
    requestBody: {
      description: 'Datos de la invitación',
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              action: { type: 'string', example: 'invite-member' },
              data: {
                type: 'object',
                properties: {
                  email: { type: 'string', format: 'email' },
                  role: { type: 'string', enum: ['admin', 'member', 'viewer'] }
                },
                required: ['email', 'role']
              }
            }
          },
          example: {
            action: 'invite-member',
            data: {
              email: 'nuevo@empresa.com',
              role: 'member'
            }
          }
        }
      }
    },
    responses: [
      {
        status: 200,
        description: 'Invitación enviada correctamente',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                success: { type: 'boolean' },
                message: { type: 'string' },
                data: {
                  type: 'object',
                  properties: {
                    id: { type: 'string' },
                    email: { type: 'string' },
                    role: { type: 'string' },
                    status: { type: 'string' },
                    token: { type: 'string' },
                    expiresAt: { type: 'string' }
                  }
                }
              }
            },
            example: {
              success: true,
              message: 'Invitación enviada correctamente',
              data: {
                id: 'invitation-123',
                email: 'nuevo@empresa.com',
                role: 'member',
                status: 'pending',
                token: 'inv-token-abc123',
                expiresAt: '2024-01-27T00:00:00Z'
              }
            }
          }
        }
      }
    ]
  },

  // Workflows
  {
    path: '/api/workflows',
    method: 'GET',
    summary: 'Obtener workflows',
    description: 'Devuelve la lista de workflows del usuario',
    tags: ['Workflows'],
    parameters: [
      {
        name: 'userId',
        in: 'query',
        required: true,
        description: 'ID del usuario',
        type: 'string',
        example: 'user-123'
      },
      {
        name: 'limit',
        in: 'query',
        required: false,
        description: 'Número máximo de workflows a devolver',
        type: 'number',
        example: 10
      },
      {
        name: 'offset',
        in: 'query',
        required: false,
        description: 'Número de workflows a omitir',
        type: 'number',
        example: 0
      }
    ],
    responses: [
      {
        status: 200,
        description: 'Lista de workflows',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                success: { type: 'boolean' },
                data: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      id: { type: 'string' },
                      name: { type: 'string' },
                      description: { type: 'string' },
                      status: { type: 'string', enum: ['active', 'inactive', 'draft'] },
                      createdAt: { type: 'string' },
                      updatedAt: { type: 'string' }
                    }
                  }
                }
              }
            },
            example: {
              success: true,
              data: [
                {
                  id: 'workflow-1',
                  name: 'Procesamiento de Leads',
                  description: 'Workflow para procesar nuevos leads',
                  status: 'active',
                  createdAt: '2024-01-01T00:00:00Z',
                  updatedAt: '2024-01-20T00:00:00Z'
                }
              ]
            }
          }
        }
      }
    ]
  },

  // Notifications
  {
    path: '/api/notifications',
    method: 'GET',
    summary: 'Obtener notificaciones',
    description: 'Devuelve las notificaciones del usuario',
    tags: ['Notifications'],
    parameters: [
      {
        name: 'userId',
        in: 'query',
        required: true,
        description: 'ID del usuario',
        type: 'string',
        example: 'user-123'
      },
      {
        name: 'type',
        in: 'query',
        required: false,
        description: 'Tipo de notificaciones',
        type: 'string',
        example: 'list'
      },
      {
        name: 'isRead',
        in: 'query',
        required: false,
        description: 'Filtrar por estado de lectura',
        type: 'boolean',
        example: false
      }
    ],
    responses: [
      {
        status: 200,
        description: 'Lista de notificaciones',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                success: { type: 'boolean' },
                data: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      id: { type: 'string' },
                      title: { type: 'string' },
                      message: { type: 'string' },
                      type: { type: 'string', enum: ['info', 'success', 'warning', 'error'] },
                      category: { type: 'string' },
                      priority: { type: 'string', enum: ['low', 'medium', 'high', 'urgent'] },
                      isRead: { type: 'boolean' },
                      createdAt: { type: 'string' }
                    }
                  }
                }
              }
            },
            example: {
              success: true,
              data: [
                {
                  id: 'notif-1',
                  title: 'Workflow completado',
                  message: 'Tu workflow se ejecutó correctamente',
                  type: 'success',
                  category: 'workflow',
                  priority: 'medium',
                  isRead: false,
                  createdAt: '2024-01-20T14:30:00Z'
                }
              ]
            }
          }
        }
      }
    ]
  },

  // AI Assistant
  {
    path: '/api/ai/chat',
    method: 'POST',
    summary: 'Chat con IA',
    description: 'Envía un mensaje al asistente de IA y recibe una respuesta',
    tags: ['AI'],
    requestBody: {
      description: 'Mensaje para el asistente de IA',
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              message: { type: 'string' },
              context: { type: 'string' },
              language: { type: 'string', default: 'es' }
            },
            required: ['message']
          },
          example: {
            message: 'Ayúdame a crear un workflow para procesar emails',
            context: 'workflow_creation',
            language: 'es'
          }
        }
      }
    },
    responses: [
      {
        status: 200,
        description: 'Respuesta del asistente de IA',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                success: { type: 'boolean' },
                data: {
                  type: 'object',
                  properties: {
                    response: { type: 'string' },
                    suggestions: { type: 'array', items: { type: 'string' } },
                    confidence: { type: 'number' }
                  }
                }
              }
            },
            example: {
              success: true,
              data: {
                response: 'Te ayudo a crear un workflow para procesar emails. Primero necesitamos configurar un trigger...',
                suggestions: [
                  'Configurar trigger de email',
                  'Agregar filtros de contenido',
                  'Definir acciones de respuesta'
                ],
                confidence: 0.95
              }
            }
          }
        }
      }
    ]
  }
]

// Ejemplos de código en diferentes lenguajes
export const CODE_EXAMPLES = {
  javascript: {
    name: 'JavaScript (Fetch)',
    language: 'javascript',
    examples: {
      'get-workspaces': `// Obtener workspaces
const response = await fetch('/api/team?userId=user-123&type=workspaces', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer YOUR_TOKEN',
    'Content-Type': 'application/json'
  }
});

const data = await response.json();
console.log(data);`,

      'invite-member': `// Invitar miembro
const response = await fetch('/api/team', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_TOKEN',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    action: 'invite-member',
    userId: 'user-123',
    workspaceId: 'workspace-1',
    data: {
      email: 'nuevo@empresa.com',
      role: 'member'
    }
  })
});

const result = await response.json();
console.log(result);`,

      'create-workflow': `// Crear workflow
const response = await fetch('/api/workflows', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_TOKEN',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'Mi Workflow',
    description: 'Descripción del workflow',
    steps: [
      { type: 'trigger', config: { event: 'email_received' } },
      { type: 'action', config: { action: 'send_response' } }
    ]
  })
});

const workflow = await response.json();
console.log(workflow);`
    }
  },

  python: {
    name: 'Python (Requests)',
    language: 'python',
    examples: {
      'get-workspaces': `import requests

# Obtener workspaces
response = requests.get(
    'http://localhost:3000/api/team',
    params={
        'userId': 'user-123',
        'type': 'workspaces'
    },
    headers={
        'Authorization': 'Bearer YOUR_TOKEN',
        'Content-Type': 'application/json'
    }
)

data = response.json()
print(data)`,

      'invite-member': `import requests

# Invitar miembro
response = requests.post(
    'http://localhost:3000/api/team',
    json={
        'action': 'invite-member',
        'userId': 'user-123',
        'workspaceId': 'workspace-1',
        'data': {
            'email': 'nuevo@empresa.com',
            'role': 'member'
        }
    },
    headers={
        'Authorization': 'Bearer YOUR_TOKEN',
        'Content-Type': 'application/json'
    }
)

result = response.json()
print(result)`,

      'create-workflow': `import requests

# Crear workflow
response = requests.post(
    'http://localhost:3000/api/workflows',
    json={
        'name': 'Mi Workflow',
        'description': 'Descripción del workflow',
        'steps': [
            {'type': 'trigger', 'config': {'event': 'email_received'}},
            {'type': 'action', 'config': {'action': 'send_response'}}
        ]
    },
    headers={
        'Authorization': 'Bearer YOUR_TOKEN',
        'Content-Type': 'application/json'
    }
)

workflow = response.json()
print(workflow)`
    }
  },

  curl: {
    name: 'cURL',
    language: 'bash',
    examples: {
      'get-workspaces': `# Obtener workspaces
curl -X GET "http://localhost:3000/api/team?userId=user-123&type=workspaces" \\
  -H "Authorization: Bearer YOUR_TOKEN" \\
  -H "Content-Type: application/json"`,

      'invite-member': `# Invitar miembro
curl -X POST "http://localhost:3000/api/team" \\
  -H "Authorization: Bearer YOUR_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "action": "invite-member",
    "userId": "user-123",
    "workspaceId": "workspace-1",
    "data": {
      "email": "nuevo@empresa.com",
      "role": "member"
    }
  }'`,

      'create-workflow': `# Crear workflow
curl -X POST "http://localhost:3000/api/workflows" \\
  -H "Authorization: Bearer YOUR_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "Mi Workflow",
    "description": "Descripción del workflow",
    "steps": [
      {"type": "trigger", "config": {"event": "email_received"}},
      {"type": "action", "config": {"action": "send_response"}}
    ]
  }'`
    }
  }
}

// Información general de la API
export const API_INFO = {
  title: 'Stack21 API',
  version: '1.0.0',
  description: 'API completa para la plataforma Stack21 - Automatización de workflows con IA',
  baseUrl: 'http://localhost:3000',
  contact: {
    name: 'Stack21 Support',
    email: 'support@stack21.com',
    url: 'https://stack21.com/support'
  },
  license: {
    name: 'MIT',
    url: 'https://opensource.org/licenses/MIT'
  }
}

// Función para generar OpenAPI spec
export function generateOpenAPISpec() {
  return {
    openapi: '3.0.0',
    info: API_INFO,
    servers: [
      {
        url: API_INFO.baseUrl,
        description: 'Servidor de desarrollo'
      }
    ],
    tags: API_TAGS.map(tag => ({
      name: tag.name,
      description: tag.description
    })),
    paths: API_ENDPOINTS.reduce((paths, endpoint) => {
      const pathKey = endpoint.path.replace('/api', '')
      if (!paths[pathKey]) {
        paths[pathKey] = {}
      }
      
      paths[pathKey][endpoint.method.toLowerCase()] = {
        summary: endpoint.summary,
        description: endpoint.description,
        tags: endpoint.tags,
        parameters: endpoint.parameters,
        requestBody: endpoint.requestBody,
        responses: endpoint.responses.reduce((responses, response) => {
          responses[response.status] = {
            description: response.description,
            content: response.content
          }
          return responses
        }, {} as any)
      }
      
      return paths
    }, {} as any),
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  }
}
