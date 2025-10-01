# Stack21 SDK

SDK oficial de JavaScript/TypeScript para la plataforma de automatización Stack21.

## Instalación

```bash
npm install @stack21/sdk
```

## Uso Básico

```typescript
import { createClient } from '@stack21/sdk';

// Crear cliente
const client = createClient({
  apiKey: 'tu-api-key',
  baseUrl: 'https://api.stack21.com', // Opcional
});

// Obtener workflows
const workflows = await client.getWorkflows();

// Crear un workflow
const workflow = await client.createWorkflow({
  name: 'Mi Workflow',
  description: 'Un workflow de ejemplo',
  status: 'draft',
  isActive: false,
  version: 1,
  projectId: 'proj-123',
  triggers: [],
  steps: [],
});

// Ejecutar workflow
const run = await client.runWorkflow({
  workflowId: workflow.id,
  input: { message: 'Hola mundo' },
});
```

## React Hooks

```typescript
import { useWorkflows, useRuns, useConnections } from '@stack21/sdk';

function MyComponent() {
  const { workflows, loading, createWorkflow } = useWorkflows(client);
  const { runs, runWorkflow } = useRuns(client);
  const { connections } = useConnections(client);

  const handleCreateWorkflow = async () => {
    await createWorkflow({
      name: 'Nuevo Workflow',
      // ... otros campos
    });
  };

  return (
    <div>
      {loading ? 'Cargando...' : (
        <div>
          {workflows.map(workflow => (
            <div key={workflow.id}>{workflow.name}</div>
          ))}
        </div>
      )}
    </div>
  );
}
```

## Gestión de Datos

```typescript
// Key-Value Storage
await client.setKV('store-123', 'user:name', 'Juan Pérez');
const user = await client.getKV('store-123', 'user:name');

// Listar todos los valores
const allValues = await client.listKV('store-123');

// Eliminar valor
await client.deleteKV('store-123', 'user:name');
```

## AI Assistant

```typescript
// Generar workflow con IA
const response = await client.generateWorkflow({
  description: 'Cuando llegue un email, guardarlo en Notion',
  projectId: 'proj-123',
  context: {
    preferredApps: ['gmail', 'notion'],
    complexity: 'medium',
  },
});

console.log(response.workflow);
console.log(response.suggestions);
```

## Webhooks

```typescript
// Verificar webhook
const isValid = client.verifyWebhook(payload, signature, secret);

// Suscribirse a runs en tiempo real
const unsubscribe = client.subscribeToRuns((run) => {
  console.log('Nuevo run:', run);
});
```

## Utilidades

```typescript
import { formatDuration, formatCost, getStatusColor } from '@stack21/sdk';

// Formatear duración
const duration = formatDuration(1500); // "1.5s"

// Formatear costo
const cost = formatCost(150); // "$1.50"

// Obtener color de estado
const colorClass = getStatusColor('completed'); // "text-green-600 bg-green-100"
```

## Configuración

```typescript
const client = createClient({
  apiKey: 'tu-api-key',
  baseUrl: 'https://api.stack21.com', // Opcional
  timeout: 30000, // Opcional, en ms
  retries: 3, // Opcional, número de reintentos
});
```

## Tipos TypeScript

El SDK incluye tipos completos para todas las entidades:

```typescript
import type {
  WorkflowDefinition,
  Run,
  Connection,
  App,
  DataStore,
  KV,
  Template,
} from '@stack21/sdk';
```

## Ejemplos Completos

### Crear y Ejecutar un Workflow

```typescript
import { createClient } from '@stack21/sdk';

const client = createClient({
  apiKey: process.env.STACK21_API_KEY!,
});

async function createAndRunWorkflow() {
  // 1. Crear workflow
  const workflow = await client.createWorkflow({
    name: 'Procesar Emails',
    description: 'Procesa emails importantes automáticamente',
    status: 'draft',
    isActive: false,
    version: 1,
    projectId: 'proj-123',
    triggers: [{
      id: 'trigger-1',
      type: 'http_webhook',
      config: { path: '/webhook/emails' },
      isActive: true,
    }],
    steps: [{
      id: 'step-1',
      order: 1,
      type: 'app_action',
      name: 'Enviar a Notion',
      appId: 'notion',
      actionKey: 'create_page',
      config: { database_id: 'db-123' },
    }],
  });

  // 2. Activar workflow
  await client.activateWorkflow(workflow.id, true);

  // 3. Ejecutar workflow
  const run = await client.runWorkflow({
    workflowId: workflow.id,
    input: {
      email: {
        subject: 'Email importante',
        body: 'Contenido del email',
        from: 'usuario@ejemplo.com',
      },
    },
  });

  console.log('Run creado:', run.id);
}
```

### Monitorear Ejecuciones en Tiempo Real

```typescript
import { useRealtimeRuns } from '@stack21/sdk';

function RunsMonitor() {
  const { runs, connected } = useRealtimeRuns(client);

  return (
    <div>
      <div>Estado: {connected ? 'Conectado' : 'Desconectado'}</div>
      <div>
        {runs.map(run => (
          <div key={run.id}>
            {run.workflowName} - {run.status}
          </div>
        ))}
      </div>
    </div>
  );
}
```

## API Reference

### Cliente Principal

- `getWorkflows(options?)` - Obtener workflows
- `getWorkflow(id)` - Obtener workflow específico
- `createWorkflow(workflow)` - Crear workflow
- `updateWorkflow(id, updates)` - Actualizar workflow
- `deleteWorkflow(id)` - Eliminar workflow
- `activateWorkflow(id, isActive)` - Activar/desactivar workflow

### Ejecuciones

- `getRuns(options?)` - Obtener ejecuciones
- `getRun(id)` - Obtener ejecución específica
- `runWorkflow(payload)` - Ejecutar workflow
- `cancelRun(id)` - Cancelar ejecución

### Conexiones

- `getConnections(options?)` - Obtener conexiones
- `createConnection(connection)` - Crear conexión
- `updateConnection(id, updates)` - Actualizar conexión
- `deleteConnection(id)` - Eliminar conexión
- `testConnection(id)` - Probar conexión

### Almacenamiento

- `getKV(storeId, key)` - Obtener valor
- `setKV(storeId, key, value, ttl?)` - Guardar valor
- `deleteKV(storeId, key)` - Eliminar valor
- `listKV(storeId, prefix?)` - Listar valores

### IA

- `generateWorkflow(request)` - Generar workflow con IA

## Licencia

MIT
