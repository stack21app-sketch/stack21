// Constructor visual de workflows para Stack21
export interface WorkflowNode {
  id: string
  type: 'trigger' | 'action' | 'condition' | 'delay' | 'webhook' | 'ai'
  name: string
  description: string
  icon: string
  color: string
  position: { x: number; y: number }
  config: Record<string, any>
  inputs: string[]
  outputs: string[]
}

export interface WorkflowConnection {
  id: string
  source: string
  target: string
  sourceHandle: string
  targetHandle: string
}

export interface Workflow {
  id: string
  name: string
  description: string
  industry: string
  status: 'draft' | 'active' | 'paused' | 'error'
  nodes: WorkflowNode[]
  connections: WorkflowConnection[]
  createdAt: Date
  updatedAt: Date
  lastRun?: Date
  runs: number
  successRate: number
}

// Nodos disponibles
export const WORKFLOW_NODES: Omit<WorkflowNode, 'id' | 'position' | 'config'>[] = [
  // Triggers
  {
    type: 'trigger',
    name: 'Email Recibido',
    description: 'Se activa cuando llega un email',
    icon: '📧',
    color: 'from-blue-500 to-cyan-500',
    inputs: [],
    outputs: ['email', 'subject', 'sender', 'body']
  },
  {
    type: 'trigger',
    name: 'Formulario Enviado',
    description: 'Se activa cuando se envía un formulario',
    icon: '📝',
    color: 'from-green-500 to-emerald-500',
    inputs: [],
    outputs: ['form_data', 'user_email', 'form_name']
  },
  {
    type: 'trigger',
    name: 'Página Visitada',
    description: 'Se activa cuando alguien visita una página',
    icon: '🌐',
    color: 'from-purple-500 to-pink-500',
    inputs: [],
    outputs: ['url', 'user_id', 'timestamp', 'referrer']
  },
  {
    type: 'trigger',
    name: 'Producto Comprado',
    description: 'Se activa cuando se completa una compra',
    icon: '🛒',
    color: 'from-orange-500 to-red-500',
    inputs: [],
    outputs: ['order_id', 'customer_email', 'amount', 'products']
  },
  {
    type: 'trigger',
    name: 'Usuario Registrado',
    description: 'Se activa cuando se registra un nuevo usuario',
    icon: '👤',
    color: 'from-indigo-500 to-blue-500',
    inputs: [],
    outputs: ['user_id', 'email', 'name', 'registration_date']
  },

  // Actions
  {
    type: 'action',
    name: 'Enviar Email',
    description: 'Envía un email personalizado',
    icon: '📤',
    color: 'from-cyan-500 to-blue-500',
    inputs: ['to', 'subject', 'body', 'template'],
    outputs: ['email_sent', 'message_id']
  },
  {
    type: 'action',
    name: 'Crear Contacto',
    description: 'Crea un nuevo contacto en el CRM',
    icon: '👥',
    color: 'from-emerald-500 to-green-500',
    inputs: ['email', 'name', 'phone', 'company'],
    outputs: ['contact_id', 'created']
  },
  {
    type: 'action',
    name: 'Actualizar Campo',
    description: 'Actualiza un campo en la base de datos',
    icon: '✏️',
    color: 'from-yellow-500 to-orange-500',
    inputs: ['record_id', 'field', 'value'],
    outputs: ['updated', 'new_value']
  },
  {
    type: 'action',
    name: 'Enviar Notificación',
    description: 'Envía una notificación push o SMS',
    icon: '🔔',
    color: 'from-pink-500 to-rose-500',
    inputs: ['message', 'channel', 'recipient'],
    outputs: ['notification_sent', 'delivery_id']
  },
  {
    type: 'action',
    name: 'Agregar Etiqueta',
    description: 'Agrega una etiqueta a un contacto',
    icon: '🏷️',
    color: 'from-violet-500 to-purple-500',
    inputs: ['contact_id', 'tag'],
    outputs: ['tag_added', 'tag_id']
  },

  // Conditions
  {
    type: 'condition',
    name: 'Si/Entonces',
    description: 'Evalúa una condición y toma una ruta',
    icon: '❓',
    color: 'from-gray-500 to-slate-500',
    inputs: ['condition', 'value'],
    outputs: ['true', 'false']
  },
  {
    type: 'condition',
    name: 'Filtro por Email',
    description: 'Filtra por dominio de email',
    icon: '📧',
    color: 'from-blue-500 to-indigo-500',
    inputs: ['email', 'domain'],
    outputs: ['matches', 'no_match']
  },
  {
    type: 'condition',
    name: 'Filtro por Valor',
    description: 'Filtra por valor de campo',
    icon: '🔍',
    color: 'from-green-500 to-teal-500',
    inputs: ['field', 'operator', 'value'],
    outputs: ['matches', 'no_match']
  },

  // Delays
  {
    type: 'delay',
    name: 'Esperar',
    description: 'Espera un tiempo determinado',
    icon: '⏰',
    color: 'from-amber-500 to-yellow-500',
    inputs: ['duration', 'unit'],
    outputs: ['delayed']
  },
  {
    type: 'delay',
    name: 'Esperar hasta Fecha',
    description: 'Espera hasta una fecha específica',
    icon: '📅',
    color: 'from-rose-500 to-pink-500',
    inputs: ['date', 'time'],
    outputs: ['delayed']
  },

  // Webhooks
  {
    type: 'webhook',
    name: 'Webhook HTTP',
    description: 'Envía datos a una URL externa',
    icon: '🔗',
    color: 'from-teal-500 to-cyan-500',
    inputs: ['url', 'method', 'headers', 'body'],
    outputs: ['response', 'status_code']
  },
  {
    type: 'webhook',
    name: 'Webhook de Slack',
    description: 'Envía mensaje a Slack',
    icon: '💬',
    color: 'from-purple-500 to-violet-500',
    inputs: ['channel', 'message', 'username'],
    outputs: ['message_sent', 'timestamp']
  },

  // AI
  {
    type: 'ai',
    name: 'Análisis de Sentimiento',
    description: 'Analiza el sentimiento de un texto',
    icon: '🧠',
    color: 'from-pink-500 to-rose-500',
    inputs: ['text'],
    outputs: ['sentiment', 'confidence', 'score']
  },
  {
    type: 'ai',
    name: 'Clasificar Texto',
    description: 'Clasifica texto en categorías',
    icon: '🏷️',
    color: 'from-indigo-500 to-purple-500',
    inputs: ['text', 'categories'],
    outputs: ['category', 'confidence', 'scores']
  },
  {
    type: 'ai',
    name: 'Generar Respuesta',
    description: 'Genera respuesta automática con IA',
    icon: '🤖',
    color: 'from-cyan-500 to-blue-500',
    inputs: ['prompt', 'context'],
    outputs: ['response', 'confidence']
  }
]

// Templates de workflows por industria
export const WORKFLOW_TEMPLATES: Partial<Workflow>[] = [
  {
    name: 'Abandono de Carrito',
    description: 'Recupera carritos abandonados con emails automatizados',
    industry: 'ecommerce',
    nodes: [
      {
        id: 'trigger-1',
        type: 'trigger',
        name: 'Carrito Abandonado',
        description: 'Se activa cuando un carrito se abandona',
        icon: '🛒',
        color: 'from-orange-500 to-red-500',
        position: { x: 100, y: 100 },
        config: { timeout: '1 hour' },
        inputs: [],
        outputs: ['cart_id', 'customer_email', 'products', 'total']
      },
      {
        id: 'delay-1',
        type: 'delay',
        name: 'Esperar 1 Hora',
        description: 'Espera 1 hora antes de enviar el email',
        icon: '⏰',
        color: 'from-amber-500 to-yellow-500',
        position: { x: 300, y: 100 },
        config: { duration: 1, unit: 'hours' },
        inputs: ['delayed'],
        outputs: ['delayed']
      },
      {
        id: 'action-1',
        type: 'action',
        name: 'Enviar Email de Recuperación',
        description: 'Envía email personalizado de recuperación',
        icon: '📤',
        color: 'from-cyan-500 to-blue-500',
        position: { x: 500, y: 100 },
        config: { template: 'cart_abandonment' },
        inputs: ['to', 'subject', 'body'],
        outputs: ['email_sent']
      }
    ],
    connections: [
      {
        id: 'conn-1',
        source: 'trigger-1',
        target: 'delay-1',
        sourceHandle: 'cart_id',
        targetHandle: 'delayed'
      },
      {
        id: 'conn-2',
        source: 'delay-1',
        target: 'action-1',
        sourceHandle: 'delayed',
        targetHandle: 'to'
      }
    ]
  },
  {
    name: 'Onboarding de Usuario',
    description: 'Secuencia de bienvenida para nuevos usuarios',
    industry: 'saas',
    nodes: [
      {
        id: 'trigger-1',
        type: 'trigger',
        name: 'Usuario Registrado',
        description: 'Se activa cuando se registra un nuevo usuario',
        icon: '👤',
        color: 'from-indigo-500 to-blue-500',
        position: { x: 100, y: 100 },
        config: {},
        inputs: [],
        outputs: ['user_id', 'email', 'name']
      },
      {
        id: 'action-1',
        type: 'action',
        name: 'Email de Bienvenida',
        description: 'Envía email de bienvenida inmediato',
        icon: '📤',
        color: 'from-cyan-500 to-blue-500',
        position: { x: 300, y: 50 },
        config: { template: 'welcome' },
        inputs: ['to', 'subject', 'body'],
        outputs: ['email_sent']
      },
      {
        id: 'delay-1',
        type: 'delay',
        name: 'Esperar 1 Día',
        description: 'Espera 1 día para el siguiente email',
        icon: '⏰',
        color: 'from-amber-500 to-yellow-500',
        position: { x: 300, y: 150 },
        config: { duration: 1, unit: 'days' },
        inputs: ['delayed'],
        outputs: ['delayed']
      },
      {
        id: 'action-2',
        type: 'action',
        name: 'Email de Tutorial',
        description: 'Envía tutorial de uso de la plataforma',
        icon: '📚',
        color: 'from-green-500 to-emerald-500',
        position: { x: 500, y: 150 },
        config: { template: 'tutorial' },
        inputs: ['to', 'subject', 'body'],
        outputs: ['email_sent']
      }
    ],
    connections: [
      {
        id: 'conn-1',
        source: 'trigger-1',
        target: 'action-1',
        sourceHandle: 'email',
        targetHandle: 'to'
      },
      {
        id: 'conn-2',
        source: 'trigger-1',
        target: 'delay-1',
        sourceHandle: 'user_id',
        targetHandle: 'delayed'
      },
      {
        id: 'conn-3',
        source: 'delay-1',
        target: 'action-2',
        sourceHandle: 'delayed',
        targetHandle: 'to'
      }
    ]
  }
]

// Funciones de utilidad
export function createWorkflow(name: string, industry: string): Workflow {
  return {
    id: `workflow-${Date.now()}`,
    name,
    description: '',
    industry,
    status: 'draft',
    nodes: [],
    connections: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    runs: 0,
    successRate: 0
  }
}

export function addNodeToWorkflow(
  workflow: Workflow, 
  nodeType: string, 
  position: { x: number; y: number }
): Workflow {
  const nodeTemplate = WORKFLOW_NODES.find(n => n.name === nodeType)
  if (!nodeTemplate) return workflow

  const newNode: WorkflowNode = {
    id: `node-${Date.now()}`,
    ...nodeTemplate,
    position,
    config: {}
  }

  return {
    ...workflow,
    nodes: [...workflow.nodes, newNode],
    updatedAt: new Date()
  }
}

export function connectNodes(
  workflow: Workflow,
  sourceId: string,
  targetId: string,
  sourceHandle: string,
  targetHandle: string
): Workflow {
  const newConnection: WorkflowConnection = {
    id: `conn-${Date.now()}`,
    source: sourceId,
    target: targetId,
    sourceHandle,
    targetHandle
  }

  return {
    ...workflow,
    connections: [...workflow.connections, newConnection],
    updatedAt: new Date()
  }
}

export function validateWorkflow(workflow: Workflow): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  // Verificar que hay al menos un trigger
  const hasTrigger = workflow.nodes.some(node => node.type === 'trigger')
  if (!hasTrigger) {
    errors.push('El workflow debe tener al menos un trigger')
  }

  // Verificar que hay al menos una acción
  const hasAction = workflow.nodes.some(node => node.type === 'action')
  if (!hasAction) {
    errors.push('El workflow debe tener al menos una acción')
  }

  // Verificar que todos los nodos están conectados
  const connectedNodes = new Set<string>()
  workflow.connections.forEach(conn => {
    connectedNodes.add(conn.source)
    connectedNodes.add(conn.target)
  })

  const orphanNodes = workflow.nodes.filter(node => !connectedNodes.has(node.id))
  if (orphanNodes.length > 0 && workflow.nodes.length > 1) {
    errors.push('Hay nodos sin conectar')
  }

  return {
    valid: errors.length === 0,
    errors
  }
}

export function executeWorkflow(workflow: Workflow, data: any): Promise<any> {
  // Simular ejecución del workflow
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: { ...data, workflow_executed: true },
        timestamp: new Date()
      })
    }, 1000)
  })
}
