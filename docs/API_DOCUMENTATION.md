# Stack21 API Documentation

## Base URL
- **Development**: `http://localhost:3000/api`
- **Production**: `https://stack21.vercel.app/api`

## Authentication
All API endpoints require authentication via NextAuth session cookies.

## Endpoints

### Workflows

#### GET /api/workflows
Get all workflows for the authenticated user.

**Response:**
```json
{
  "workflows": [
    {
      "id": "workflow_id",
      "name": "Workflow Name",
      "description": "Workflow Description",
      "status": "ACTIVE",
      "nodes": [],
      "connections": [],
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### POST /api/workflows
Create a new workflow.

**Request Body:**
```json
{
  "name": "Workflow Name",
  "description": "Workflow Description",
  "nodes": [],
  "connections": []
}
```

**Response:**
```json
{
  "workflow": {
    "id": "workflow_id",
    "name": "Workflow Name",
    "description": "Workflow Description",
    "status": "DRAFT",
    "nodes": [],
    "connections": [],
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### GET /api/workflows/[id]
Get a specific workflow by ID.

#### PUT /api/workflows/[id]
Update a workflow.

#### DELETE /api/workflows/[id]
Delete a workflow.

#### POST /api/workflows/[id]/run
Execute a workflow.

**Response:**
```json
{
  "run": {
    "id": "run_id",
    "status": "COMPLETED",
    "output": {
      "ai": [
        {
          "nodeId": "node_id",
          "model": "gpt-4",
          "text": "AI generated text"
        }
      ],
      "email": {
        "to": "user@example.com",
        "subject": "Email Subject",
        "success": true
      }
    },
    "duration": 1500,
    "startedAt": "2024-01-01T00:00:00.000Z",
    "completedAt": "2024-01-01T00:00:01.500Z"
  }
}
```

### Marketplace

#### GET /api/marketplace
Get public workflows from the marketplace.

**Query Parameters:**
- `search` (optional): Search term
- `category` (optional): Category filter
- `sort` (optional): Sort by (trending, rating, downloads, newest, price-low, price-high)
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 12)

**Response:**
```json
{
  "workflows": [
    {
      "id": "workflow_id",
      "name": "Public Workflow",
      "description": "Description",
      "rating": 4.8,
      "downloads": 156,
      "price": 29.99,
      "category": "ai",
      "featured": true,
      "user": {
        "name": "Creator Name",
        "image": "avatar_url"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 12,
    "total": 50,
    "totalPages": 5,
    "hasNext": true,
    "hasPrev": false
  }
}
```

### Pricing

#### GET /api/pricing
Calculate pricing based on usage.

**Query Parameters:**
- `workflowExecutions` (optional): Number of workflow executions
- `aiNodes` (optional): Number of AI nodes
- `emailNodes` (optional): Number of email nodes
- `integrations` (optional): Number of integrations
- `workspaces` (optional): Number of workspaces
- `users` (optional): Number of users

**Response:**
```json
{
  "pricing": {
    "workflowExecution": {
      "free": 100,
      "price": 0.01
    },
    "aiNode": {
      "free": 50,
      "price": 0.02
    }
  },
  "usage": {
    "workflowExecutions": 150,
    "aiNodes": 75,
    "emailNodes": 30
  },
  "costs": {
    "workflowExecutions": 0.5,
    "aiNodes": 0.5,
    "emailNodes": 0.025
  },
  "totalCost": 1.025,
  "breakdown": [
    {
      "type": "workflowExecutions",
      "cost": 0.5,
      "description": "Ejecuciones de workflow"
    }
  ]
}
```

### AI Suggestions

#### GET /api/ai/suggestions
Get personalized AI suggestions.

**Query Parameters:**
- `userId`: User ID
- `context` (optional): Context for suggestions (default: "workflow_optimization")

**Response:**
```json
{
  "suggestions": [
    "Considera agregar un nodo de validación de datos",
    "Un nodo de logging puede ayudar con el debugging",
    "Agrega manejo de errores para mejorar la robustez"
  ],
  "personalized": true,
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

#### POST /api/ai/suggestions
Get personalized AI suggestions via POST.

**Request Body:**
```json
{
  "userId": "user_id",
  "context": "workflow_optimization"
}
```

## Error Responses

All endpoints return appropriate HTTP status codes and error messages:

```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Rate Limiting

- **Free Tier**: 100 requests per hour
- **Pro Tier**: 1000 requests per hour
- **Enterprise**: Unlimited

Rate limit headers are included in responses:
- `X-RateLimit-Limit`: Request limit per hour
- `X-RateLimit-Remaining`: Remaining requests
- `X-RateLimit-Reset`: Reset timestamp

## Webhooks

### Workflow Execution Webhook

**URL**: `https://your-domain.com/api/webhooks/workflow-execution`

**Payload:**
```json
{
  "event": "workflow.execution.completed",
  "workflowId": "workflow_id",
  "runId": "run_id",
  "status": "COMPLETED",
  "duration": 1500,
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## SDKs

### JavaScript/TypeScript
```bash
npm install @stack21/sdk
```

```javascript
import { Stack21Client } from '@stack21/sdk'

const client = new Stack21Client({
  apiKey: 'your-api-key',
  baseUrl: 'https://stack21.vercel.app/api'
})

// Create workflow
const workflow = await client.workflows.create({
  name: 'My Workflow',
  description: 'Description',
  nodes: [],
  connections: []
})

// Execute workflow
const result = await client.workflows.execute(workflow.id)
```

## Support

- **Documentation**: https://docs.stack21.com
- **Support**: support@stack21.com
- **Discord**: https://discord.gg/stack21
- **GitHub**: https://github.com/stack21/saas-starter
