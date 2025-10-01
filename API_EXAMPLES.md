# 📡 Stack21 - Ejemplos de APIs

Guía completa con ejemplos prácticos de todas las APIs disponibles en Stack21.

---

## 📋 Tabla de Contenidos

1. [Health & Status](#health--status)
2. [Apps API](#apps-api)
3. [Connections API](#connections-api)
4. [Workflows API](#workflows-api)
5. [Runs API](#runs-api)
6. [Templates API](#templates-api)
7. [Webhooks API](#webhooks-api)
8. [OAuth API](#oauth-api)
9. [AI Builder API](#ai-builder-api)

---

## Health & Status

### GET /api/health

Verifica el estado del servidor.

```bash
curl http://localhost:3000/api/health
```

**Response:**
```json
{
  "status": "ok"
}
```

---

## Apps API

### GET /api/apps

Lista aplicaciones disponibles con paginación y filtros.

#### Listar todas (primeras 10)

```bash
curl "http://localhost:3000/api/apps?limit=10"
```

**Response:**
```json
{
  "apps": [
    {
      "slug": "github",
      "name": "GitHub",
      "description": "GitHub is a development platform...",
      "logo": "https://...",
      "category": "developer-tools",
      "isPremium": false,
      "pricing": {
        "model": "free",
        "plans": []
      },
      "features": [
        "Repository management",
        "Issue tracking",
        "Pull requests"
      ],
      "authMethods": ["oauth2", "api_key"]
    },
    ...
  ],
  "total": 1669,
  "page": 1,
  "limit": 10,
  "totalPages": 167
}
```

#### Buscar apps

```bash
curl "http://localhost:3000/api/apps?search=slack"
```

#### Filtrar por categoría

```bash
curl "http://localhost:3000/api/apps?category=developer-tools&limit=5"
```

#### Paginación

```bash
curl "http://localhost:3000/api/apps?page=2&limit=20"
```

#### Combinar filtros

```bash
curl "http://localhost:3000/api/apps?search=google&category=productivity&page=1&limit=10"
```

### GET /api/apps/[slug]

Obtiene detalles de una aplicación específica.

```bash
curl "http://localhost:3000/api/apps/github"
```

**Response:**
```json
{
  "app": {
    "slug": "github",
    "name": "GitHub",
    "description": "GitHub is a development platform...",
    "logo": "https://...",
    "category": "developer-tools",
    "isPremium": false,
    "rating": 4.8,
    "usersCount": 10000,
    "pricing": {
      "model": "freemium",
      "plans": [
        {
          "name": "Free",
          "price": 0
        },
        {
          "name": "Pro",
          "price": 7
        }
      ]
    },
    "features": [
      "Repository management",
      "Issue tracking",
      "Pull requests",
      "Code review",
      "CI/CD with Actions"
    ],
    "authMethods": ["oauth2", "api_key"],
    "docs": "https://docs.github.com",
    "website": "https://github.com"
  }
}
```

---

## Connections API

### GET /api/connections

Lista las conexiones del usuario.

```bash
curl "http://localhost:3000/api/connections"
```

**Response:**
```json
{
  "connections": [
    {
      "id": "conn_abc123",
      "userId": "user_xyz",
      "name": "My GitHub Account",
      "appSlug": "github",
      "authType": "oauth2",
      "isActive": true,
      "createdAt": "2025-10-01T10:00:00Z",
      "updatedAt": "2025-10-01T10:00:00Z"
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 10
}
```

#### Con paginación

```bash
curl "http://localhost:3000/api/connections?page=1&limit=5"
```

#### Filtrar por app

```bash
curl "http://localhost:3000/api/connections?appSlug=github"
```

### POST /api/connections

Crea una nueva conexión.

```bash
curl -X POST "http://localhost:3000/api/connections" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My GitHub",
    "appSlug": "github",
    "authType": "oauth2",
    "credentials": {
      "access_token": "ghp_xxxxxxxxxxxxx",
      "token_type": "Bearer",
      "scope": "repo,user"
    }
  }'
```

**Response:**
```json
{
  "connection": {
    "id": "conn_new123",
    "userId": "dev-user",
    "name": "My GitHub",
    "appSlug": "github",
    "authType": "oauth2",
    "isActive": true,
    "createdAt": "2025-10-01T10:30:00Z"
  }
}
```

### DELETE /api/connections

Elimina una conexión.

```bash
curl -X DELETE "http://localhost:3000/api/connections?id=conn_abc123"
```

**Response:**
```json
{
  "message": "Connection deleted successfully"
}
```

---

## Workflows API

### GET /api/workflows

Lista workflows del usuario.

```bash
curl "http://localhost:3000/api/workflows"
```

**Response:**
```json
{
  "workflows": [
    {
      "id": "wf_123",
      "name": "Welcome Email",
      "description": "Send welcome email to new users",
      "status": "active",
      "trigger": {
        "type": "webhook",
        "config": {
          "path": "/webhook/new-user"
        }
      },
      "steps": [
        {
          "id": "step_1",
          "type": "http_request",
          "name": "Get User Data",
          "config": {
            "url": "https://api.example.com/users/{{userId}}",
            "method": "GET"
          }
        },
        {
          "id": "step_2",
          "type": "log",
          "name": "Log User",
          "config": {
            "message": "New user: {{user.email}}"
          }
        }
      ],
      "createdAt": "2025-10-01T09:00:00Z",
      "updatedAt": "2025-10-01T09:00:00Z"
    }
  ]
}
```

### POST /api/workflows

Crea un nuevo workflow.

```bash
curl -X POST "http://localhost:3000/api/workflows" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Send Slack Notification",
    "description": "Notify team on Slack",
    "trigger": {
      "type": "manual",
      "config": {}
    },
    "steps": [
      {
        "id": "step_1",
        "type": "http_request",
        "name": "Post to Slack",
        "config": {
          "url": "https://hooks.slack.com/services/xxx",
          "method": "POST",
          "body": {
            "text": "Hello from Stack21!"
          }
        }
      }
    ]
  }'
```

**Response:**
```json
{
  "workflow": {
    "id": "wf_new456",
    "name": "Send Slack Notification",
    "status": "active",
    ...
  }
}
```

### GET /api/workflows/[id]

Obtiene un workflow específico.

```bash
curl "http://localhost:3000/api/workflows/wf_123"
```

### PUT /api/workflows/[id]

Actualiza un workflow.

```bash
curl -X PUT "http://localhost:3000/api/workflows/wf_123" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Workflow Name",
    "status": "inactive"
  }'
```

### DELETE /api/workflows/[id]

Elimina un workflow.

```bash
curl -X DELETE "http://localhost:3000/api/workflows/wf_123"
```

### POST /api/workflows/[id]/run

Ejecuta un workflow manualmente.

```bash
curl -X POST "http://localhost:3000/api/workflows/wf_123/run" \
  -H "Content-Type: application/json" \
  -d '{
    "triggerData": {
      "userId": "user_123",
      "event": "manual_trigger"
    }
  }'
```

**Response:**
```json
{
  "runId": "run_abc789",
  "status": "running",
  "startedAt": "2025-10-01T11:00:00Z"
}
```

### POST /api/workflows/[id]/activate

Activa o desactiva un workflow.

```bash
# Activar
curl -X POST "http://localhost:3000/api/workflows/wf_123/activate" \
  -H "Content-Type: application/json" \
  -d '{"active": true}'

# Desactivar
curl -X POST "http://localhost:3000/api/workflows/wf_123/activate" \
  -H "Content-Type: application/json" \
  -d '{"active": false}'
```

---

## Runs API

### GET /api/runs

Lista ejecuciones de workflows.

```bash
curl "http://localhost:3000/api/runs"
```

**Response:**
```json
{
  "runs": [
    {
      "id": "run_abc",
      "workflowId": "wf_123",
      "workflowName": "Welcome Email",
      "status": "completed",
      "startedAt": "2025-10-01T10:00:00Z",
      "completedAt": "2025-10-01T10:00:03Z",
      "duration": 3000,
      "triggerType": "webhook",
      "steps": [
        {
          "stepId": "step_1",
          "name": "Get User Data",
          "status": "completed",
          "startedAt": "2025-10-01T10:00:00Z",
          "completedAt": "2025-10-01T10:00:02Z",
          "input": {"userId": "123"},
          "output": {"user": {"email": "user@example.com"}}
        },
        {
          "stepId": "step_2",
          "name": "Log User",
          "status": "completed",
          "startedAt": "2025-10-01T10:00:02Z",
          "completedAt": "2025-10-01T10:00:03Z",
          "logs": ["New user: user@example.com"]
        }
      ]
    }
  ]
}
```

#### Filtrar por workflow

```bash
curl "http://localhost:3000/api/runs?workflowId=wf_123"
```

#### Filtrar por estado

```bash
curl "http://localhost:3000/api/runs?status=failed"
```

### GET /api/runs/[id]

Obtiene detalles de una ejecución específica.

```bash
curl "http://localhost:3000/api/runs/run_abc"
```

**Response:**
```json
{
  "run": {
    "id": "run_abc",
    "workflowId": "wf_123",
    "workflowName": "Welcome Email",
    "status": "completed",
    "startedAt": "2025-10-01T10:00:00Z",
    "completedAt": "2025-10-01T10:00:03Z",
    "duration": 3000,
    "triggerType": "webhook",
    "triggerData": {
      "userId": "123",
      "event": "user.created"
    },
    "steps": [...],
    "errorMessage": null
  }
}
```

---

## Templates API

### GET /api/templates

Lista plantillas disponibles.

```bash
curl "http://localhost:3000/api/templates"
```

**Response:**
```json
{
  "templates": [
    {
      "id": "template_1",
      "name": "Welcome Email Workflow",
      "description": "Send a welcome email to new users",
      "category": "communication",
      "difficulty": "beginner",
      "apps": ["http", "email"],
      "createdAt": "2025-09-01T00:00:00Z"
    }
  ]
}
```

#### Filtros

```bash
# Por categoría
curl "http://localhost:3000/api/templates?category=communication"

# Por dificultad
curl "http://localhost:3000/api/templates?difficulty=beginner"

# Búsqueda
curl "http://localhost:3000/api/templates?search=email"
```

### GET /api/templates/[id]

Obtiene un template específico con su definición completa.

```bash
curl "http://localhost:3000/api/templates/template_1"
```

**Response:**
```json
{
  "template": {
    "id": "template_1",
    "name": "Welcome Email Workflow",
    "description": "Send a welcome email to new users",
    "category": "communication",
    "difficulty": "beginner",
    "definition": {
      "trigger": {
        "type": "webhook",
        "config": {"path": "/new-user"}
      },
      "steps": [...]
    }
  }
}
```

### POST /api/templates/[id]/apply

Aplica un template y crea un nuevo workflow.

```bash
curl -X POST "http://localhost:3000/api/templates/template_1/apply" \
  -H "Content-Type: application/json" \
  -d '{
    "projectId": "proj_123",
    "name": "My Welcome Email"
  }'
```

**Response:**
```json
{
  "workflowId": "wf_new789",
  "redirect": "/workflows/wf_new789/edit"
}
```

---

## Webhooks API

### POST /api/webhooks/[path]

Recibe webhooks y ejecuta workflows asociados.

```bash
# Webhook genérico
curl -X POST "http://localhost:3000/api/webhooks/webhook/form-submit" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "name": "John Doe",
    "message": "Hello!"
  }'
```

**Response:**
```json
{
  "message": "Webhook received",
  "triggered": true,
  "runId": "run_xyz123"
}
```

#### Webhook con autenticación

```bash
curl -X POST "http://localhost:3000/api/webhooks/webhook/secure-endpoint" \
  -H "Content-Type: application/json" \
  -H "X-Webhook-Secret: my-secret-key" \
  -d '{"data": "sensitive"}'
```

---

## OAuth API

### OAuth Flow Completo

#### 1. Iniciar OAuth (Authorize)

```bash
# Redirige al usuario a esta URL desde el navegador
open "http://localhost:3000/api/oauth/demo/authorize?client_id=stack21&redirect_uri=http://localhost:3000/api/oauth/demo/callback&state=random-state&app_slug=github"
```

#### 2. Callback (Automático)

El usuario es redirigido aquí después de autorizar:

```
GET /api/oauth/demo/callback?code=demo_auth_code_xxx&state=random-state&app_slug=github
```

Stack21 automáticamente:
1. Intercambia el code por access_token
2. Crea la conexión
3. Redirige a `/apps/github?status=success`

---

## AI Builder API

### POST /api/ai/assist

Genera sugerencias de workflows desde lenguaje natural.

```bash
curl -X POST "http://localhost:3000/api/ai/assist" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Send an email when someone submits a form",
    "projectId": "proj_123"
  }'
```

**Response:**
```json
{
  "suggestions": [
    {
      "confidence": 0.9,
      "workflow": {
        "name": "Form Submission Email",
        "description": "Sends an email notification when a form is submitted",
        "trigger": {
          "type": "webhook",
          "config": {"path": "/form-submit"}
        },
        "steps": [
          {
            "id": "step_1",
            "type": "http_request",
            "name": "Send Email",
            "config": {
              "url": "https://api.email-service.com/send",
              "method": "POST",
              "body": {
                "to": "{{form.email}}",
                "subject": "Form Received",
                "text": "Thank you for your submission!"
              }
            }
          }
        ]
      },
      "explanation": "This workflow listens for form submissions via webhook and sends a confirmation email"
    }
  ]
}
```

---

## Ejemplos Avanzados

### 1. Crear Workflow Completo con Múltiples Pasos

```bash
curl -X POST "http://localhost:3000/api/workflows" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Process Order",
    "description": "Process new orders and notify team",
    "trigger": {
      "type": "webhook",
      "config": {"path": "/new-order"}
    },
    "steps": [
      {
        "id": "step_1",
        "type": "http_request",
        "name": "Fetch Order Details",
        "config": {
          "url": "https://api.shop.com/orders/{{orderId}}",
          "method": "GET",
          "headers": {
            "Authorization": "Bearer {{env.SHOP_API_KEY}}"
          }
        }
      },
      {
        "id": "step_2",
        "type": "condition",
        "name": "Check Order Total",
        "config": {
          "condition": "{{order.total}} > 100",
          "then": "step_3",
          "else": "step_4"
        }
      },
      {
        "id": "step_3",
        "type": "http_request",
        "name": "Send Slack Alert (High Value)",
        "config": {
          "url": "{{env.SLACK_WEBHOOK_URL}}",
          "method": "POST",
          "body": {
            "text": "🎉 High value order: ${{order.total}}"
          }
        }
      },
      {
        "id": "step_4",
        "type": "log",
        "name": "Log Standard Order",
        "config": {
          "message": "Standard order processed: ${{order.total}}"
        }
      }
    ]
  }'
```

### 2. Testing de Workflow con Datos Mock

```bash
# Ejecutar workflow con datos de prueba
curl -X POST "http://localhost:3000/api/workflows/wf_123/run" \
  -H "Content-Type: application/json" \
  -d '{
    "triggerData": {
      "orderId": "ORD-123",
      "total": 150.00,
      "customer": {
        "email": "customer@example.com",
        "name": "Jane Doe"
      }
    },
    "dryRun": false
  }'
```

### 3. Monitorear Ejecuciones en Tiempo Real

```bash
# Polling cada 2 segundos
watch -n 2 'curl -s "http://localhost:3000/api/runs?limit=5" | jq ".runs[] | {id, status, workflowName}"'
```

---

## Rate Limiting

En producción, las APIs tienen rate limiting:

- **Anónimo:** 100 requests/hora
- **Autenticado:** 1000 requests/hora
- **Premium:** Ilimitado

**Headers de respuesta:**
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1633046400
```

---

## Autenticación

### En Desarrollo

Sin autenticación requerida en `localhost:3000`

### En Producción

Usa JWT tokens de NextAuth:

```bash
# 1. Login y obtener token
TOKEN=$(curl -X POST "https://stack21.vercel.app/api/auth/signin" \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "pass"}' \
  | jq -r '.token')

# 2. Usar token en requests
curl "https://stack21.vercel.app/api/workflows" \
  -H "Authorization: Bearer $TOKEN"
```

---

## Códigos de Estado HTTP

| Código | Significado |
|--------|-------------|
| 200 | OK - Request exitoso |
| 201 | Created - Recurso creado |
| 400 | Bad Request - Datos inválidos |
| 401 | Unauthorized - No autenticado |
| 403 | Forbidden - Sin permisos |
| 404 | Not Found - Recurso no existe |
| 429 | Too Many Requests - Rate limit excedido |
| 500 | Internal Server Error - Error del servidor |

---

## Postman Collection

Importa esta colección en Postman para testing rápido:

```json
{
  "info": {
    "name": "Stack21 API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Health Check",
      "request": {
        "method": "GET",
        "url": "{{baseUrl}}/api/health"
      }
    }
  ],
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:3000"
    }
  ]
}
```

---

**¡Listo para automatizar! 🚀**

---

**Última actualización:** 1 de Octubre, 2025  
**Versión:** 1.0  
**API Version:** v2.1.0

