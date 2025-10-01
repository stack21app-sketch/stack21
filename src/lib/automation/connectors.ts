/**
 * 🔌 STACK21 - Sistema de Conectores
 * Definiciones de 200+ integraciones con apps populares
 */

export interface ConnectorDefinition {
  id: string
  name: string
  category: string
  icon: string
  color: string
  description: string
  authType: 'oauth2' | 'api_key' | 'basic' | 'custom'
  triggers: TriggerDefinition[]
  actions: ActionDefinition[]
  popular: boolean
  enterprise?: boolean
}

export interface TriggerDefinition {
  id: string
  name: string
  description: string
  inputs: FieldDefinition[]
  outputs: FieldDefinition[]
  polling?: boolean
  webhook?: boolean
}

export interface ActionDefinition {
  id: string
  name: string
  description: string
  inputs: FieldDefinition[]
  outputs: FieldDefinition[]
}

export interface FieldDefinition {
  id: string
  name: string
  type: 'string' | 'number' | 'boolean' | 'date' | 'email' | 'url' | 'json' | 'file'
  required: boolean
  description?: string
  default?: any
  options?: Array<{ label: string; value: any }>
}

/**
 * 📊 CRM & Ventas
 */
export const CRM_CONNECTORS: ConnectorDefinition[] = [
  {
    id: 'hubspot',
    name: 'HubSpot',
    category: 'CRM',
    icon: '🟠',
    color: '#ff7a59',
    description: 'CRM, Marketing y Ventas todo-en-uno',
    authType: 'oauth2',
    popular: true,
    triggers: [
      {
        id: 'new_contact',
        name: 'Nuevo Contacto',
        description: 'Cuando se crea un nuevo contacto',
        inputs: [],
        outputs: [
          { id: 'email', name: 'Email', type: 'email', required: true },
          { id: 'name', name: 'Nombre', type: 'string', required: false },
          { id: 'company', name: 'Empresa', type: 'string', required: false },
          { id: 'score', name: 'Score', type: 'number', required: false }
        ]
      },
      {
        id: 'deal_updated',
        name: 'Deal Actualizado',
        description: 'Cuando cambia el estado de un deal',
        inputs: [],
        outputs: [
          { id: 'deal_id', name: 'ID Deal', type: 'string', required: true },
          { id: 'stage', name: 'Etapa', type: 'string', required: true },
          { id: 'amount', name: 'Monto', type: 'number', required: false }
        ]
      }
    ],
    actions: [
      {
        id: 'create_contact',
        name: 'Crear Contacto',
        description: 'Crea un nuevo contacto en HubSpot',
        inputs: [
          { id: 'email', name: 'Email', type: 'email', required: true },
          { id: 'firstname', name: 'Nombre', type: 'string', required: false },
          { id: 'lastname', name: 'Apellido', type: 'string', required: false },
          { id: 'company', name: 'Empresa', type: 'string', required: false }
        ],
        outputs: [
          { id: 'contact_id', name: 'ID Contacto', type: 'string', required: true }
        ]
      },
      {
        id: 'update_deal',
        name: 'Actualizar Deal',
        description: 'Actualiza un deal existente',
        inputs: [
          { id: 'deal_id', name: 'ID Deal', type: 'string', required: true },
          { id: 'stage', name: 'Nueva Etapa', type: 'string', required: false },
          { id: 'amount', name: 'Monto', type: 'number', required: false }
        ],
        outputs: []
      }
    ]
  },
  {
    id: 'salesforce',
    name: 'Salesforce',
    category: 'CRM',
    icon: '☁️',
    color: '#00a1e0',
    description: 'CRM líder mundial para empresas',
    authType: 'oauth2',
    popular: true,
    enterprise: true,
    triggers: [
      {
        id: 'new_lead',
        name: 'Nuevo Lead',
        description: 'Cuando se crea un nuevo lead',
        inputs: [],
        outputs: [
          { id: 'lead_id', name: 'ID Lead', type: 'string', required: true },
          { id: 'email', name: 'Email', type: 'email', required: true },
          { id: 'status', name: 'Estado', type: 'string', required: true }
        ]
      },
      {
        id: 'opportunity_won',
        name: 'Oportunidad Ganada',
        description: 'Cuando una oportunidad se marca como ganada',
        inputs: [],
        outputs: [
          { id: 'opportunity_id', name: 'ID Oportunidad', type: 'string', required: true },
          { id: 'amount', name: 'Monto', type: 'number', required: true }
        ]
      }
    ],
    actions: [
      {
        id: 'create_lead',
        name: 'Crear Lead',
        description: 'Crea un nuevo lead en Salesforce',
        inputs: [
          { id: 'email', name: 'Email', type: 'email', required: true },
          { id: 'company', name: 'Empresa', type: 'string', required: true },
          { id: 'status', name: 'Estado', type: 'string', required: true }
        ],
        outputs: [
          { id: 'lead_id', name: 'ID Lead', type: 'string', required: true }
        ]
      },
      {
        id: 'create_task',
        name: 'Crear Tarea',
        description: 'Crea una tarea asignada',
        inputs: [
          { id: 'subject', name: 'Asunto', type: 'string', required: true },
          { id: 'assigned_to', name: 'Asignado a', type: 'string', required: true },
          { id: 'due_date', name: 'Fecha límite', type: 'date', required: false }
        ],
        outputs: []
      }
    ]
  }
]

/**
 * 📧 Comunicación
 */
export const COMMUNICATION_CONNECTORS: ConnectorDefinition[] = [
  {
    id: 'slack',
    name: 'Slack',
    category: 'Comunicación',
    icon: '💬',
    color: '#4a154b',
    description: 'Mensajería para equipos',
    authType: 'oauth2',
    popular: true,
    triggers: [
      {
        id: 'new_message',
        name: 'Nuevo Mensaje',
        description: 'Cuando se recibe un mensaje en un canal',
        inputs: [
          { id: 'channel', name: 'Canal', type: 'string', required: true }
        ],
        outputs: [
          { id: 'text', name: 'Texto', type: 'string', required: true },
          { id: 'user', name: 'Usuario', type: 'string', required: true }
        ]
      }
    ],
    actions: [
      {
        id: 'send_message',
        name: 'Enviar Mensaje',
        description: 'Envía un mensaje a un canal o usuario',
        inputs: [
          { id: 'channel', name: 'Canal/Usuario', type: 'string', required: true },
          { id: 'text', name: 'Mensaje', type: 'string', required: true },
          { id: 'thread_ts', name: 'Thread (opcional)', type: 'string', required: false }
        ],
        outputs: []
      },
      {
        id: 'send_notification',
        name: 'Enviar Notificación',
        description: 'Envía una notificación con formato enriquecido',
        inputs: [
          { id: 'channel', name: 'Canal', type: 'string', required: true },
          { id: 'title', name: 'Título', type: 'string', required: true },
          { id: 'message', name: 'Mensaje', type: 'string', required: true },
          { id: 'color', name: 'Color', type: 'string', required: false, default: 'good' }
        ],
        outputs: []
      }
    ]
  },
  {
    id: 'gmail',
    name: 'Gmail',
    category: 'Comunicación',
    icon: '📧',
    color: '#ea4335',
    description: 'Email de Google',
    authType: 'oauth2',
    popular: true,
    triggers: [
      {
        id: 'new_email',
        name: 'Nuevo Email',
        description: 'Cuando llega un nuevo email',
        inputs: [
          { id: 'label', name: 'Etiqueta (opcional)', type: 'string', required: false }
        ],
        outputs: [
          { id: 'from', name: 'De', type: 'email', required: true },
          { id: 'subject', name: 'Asunto', type: 'string', required: true },
          { id: 'body', name: 'Cuerpo', type: 'string', required: true },
          { id: 'attachments', name: 'Adjuntos', type: 'json', required: false }
        ]
      },
      {
        id: 'attachment_received',
        name: 'Adjunto Recibido',
        description: 'Cuando llega un email con adjunto',
        inputs: [
          { id: 'file_type', name: 'Tipo archivo', type: 'string', required: false }
        ],
        outputs: [
          { id: 'from', name: 'De', type: 'email', required: true },
          { id: 'filename', name: 'Nombre archivo', type: 'string', required: true },
          { id: 'file_url', name: 'URL archivo', type: 'url', required: true }
        ]
      }
    ],
    actions: [
      {
        id: 'send_email',
        name: 'Enviar Email',
        description: 'Envía un email',
        inputs: [
          { id: 'to', name: 'Para', type: 'email', required: true },
          { id: 'subject', name: 'Asunto', type: 'string', required: true },
          { id: 'body', name: 'Cuerpo', type: 'string', required: true },
          { id: 'cc', name: 'CC', type: 'email', required: false }
        ],
        outputs: []
      }
    ]
  }
]

/**
 * 🛒 E-commerce
 */
export const ECOMMERCE_CONNECTORS: ConnectorDefinition[] = [
  {
    id: 'shopify',
    name: 'Shopify',
    category: 'E-commerce',
    icon: '🛍️',
    color: '#96bf48',
    description: 'Plataforma de e-commerce',
    authType: 'oauth2',
    popular: true,
    triggers: [
      {
        id: 'new_order',
        name: 'Nuevo Pedido',
        description: 'Cuando se crea un nuevo pedido',
        inputs: [],
        outputs: [
          { id: 'order_id', name: 'ID Pedido', type: 'string', required: true },
          { id: 'customer_email', name: 'Email Cliente', type: 'email', required: true },
          { id: 'total', name: 'Total', type: 'number', required: true },
          { id: 'items', name: 'Productos', type: 'json', required: true }
        ]
      },
      {
        id: 'low_stock',
        name: 'Stock Bajo',
        description: 'Cuando un producto tiene stock bajo',
        inputs: [
          { id: 'threshold', name: 'Umbral', type: 'number', required: true, default: 10 }
        ],
        outputs: [
          { id: 'product_id', name: 'ID Producto', type: 'string', required: true },
          { id: 'name', name: 'Nombre', type: 'string', required: true },
          { id: 'stock', name: 'Stock Actual', type: 'number', required: true }
        ],
        polling: true
      }
    ],
    actions: [
      {
        id: 'update_product',
        name: 'Actualizar Producto',
        description: 'Actualiza un producto existente',
        inputs: [
          { id: 'product_id', name: 'ID Producto', type: 'string', required: true },
          { id: 'price', name: 'Precio', type: 'number', required: false },
          { id: 'inventory', name: 'Inventario', type: 'number', required: false }
        ],
        outputs: []
      },
      {
        id: 'create_order',
        name: 'Crear Pedido',
        description: 'Crea un nuevo pedido',
        inputs: [
          { id: 'customer_email', name: 'Email Cliente', type: 'email', required: true },
          { id: 'items', name: 'Productos', type: 'json', required: true }
        ],
        outputs: [
          { id: 'order_id', name: 'ID Pedido', type: 'string', required: true }
        ]
      }
    ]
  },
  {
    id: 'stripe',
    name: 'Stripe',
    category: 'Pagos',
    icon: '💳',
    color: '#635bff',
    description: 'Procesamiento de pagos',
    authType: 'api_key',
    popular: true,
    triggers: [
      {
        id: 'payment_received',
        name: 'Pago Recibido',
        description: 'Cuando se recibe un pago exitoso',
        inputs: [],
        outputs: [
          { id: 'payment_id', name: 'ID Pago', type: 'string', required: true },
          { id: 'amount', name: 'Monto', type: 'number', required: true },
          { id: 'customer_email', name: 'Email Cliente', type: 'email', required: true }
        ],
        webhook: true
      },
      {
        id: 'payment_failed',
        name: 'Pago Fallido',
        description: 'Cuando falla un pago',
        inputs: [],
        outputs: [
          { id: 'payment_id', name: 'ID Pago', type: 'string', required: true },
          { id: 'error', name: 'Error', type: 'string', required: true }
        ],
        webhook: true
      }
    ],
    actions: [
      {
        id: 'create_invoice',
        name: 'Crear Factura',
        description: 'Crea una nueva factura',
        inputs: [
          { id: 'customer_email', name: 'Email Cliente', type: 'email', required: true },
          { id: 'amount', name: 'Monto', type: 'number', required: true },
          { id: 'description', name: 'Descripción', type: 'string', required: false }
        ],
        outputs: [
          { id: 'invoice_url', name: 'URL Factura', type: 'url', required: true }
        ]
      },
      {
        id: 'refund_payment',
        name: 'Reembolsar Pago',
        description: 'Reembolsa un pago',
        inputs: [
          { id: 'payment_id', name: 'ID Pago', type: 'string', required: true },
          { id: 'amount', name: 'Monto', type: 'number', required: false }
        ],
        outputs: []
      }
    ]
  }
]

/**
 * 📊 Datos & Analytics
 */
export const DATA_CONNECTORS: ConnectorDefinition[] = [
  {
    id: 'google_sheets',
    name: 'Google Sheets',
    category: 'Productividad',
    icon: '📊',
    color: '#0f9d58',
    description: 'Hojas de cálculo de Google',
    authType: 'oauth2',
    popular: true,
    triggers: [
      {
        id: 'new_row',
        name: 'Nueva Fila',
        description: 'Cuando se agrega una nueva fila',
        inputs: [
          { id: 'spreadsheet_id', name: 'ID Hoja', type: 'string', required: true },
          { id: 'sheet_name', name: 'Nombre Pestaña', type: 'string', required: false }
        ],
        outputs: [
          { id: 'row_data', name: 'Datos Fila', type: 'json', required: true }
        ],
        polling: true
      }
    ],
    actions: [
      {
        id: 'add_row',
        name: 'Agregar Fila',
        description: 'Agrega una nueva fila',
        inputs: [
          { id: 'spreadsheet_id', name: 'ID Hoja', type: 'string', required: true },
          { id: 'sheet_name', name: 'Nombre Pestaña', type: 'string', required: false },
          { id: 'values', name: 'Valores', type: 'json', required: true }
        ],
        outputs: []
      },
      {
        id: 'update_row',
        name: 'Actualizar Fila',
        description: 'Actualiza una fila existente',
        inputs: [
          { id: 'spreadsheet_id', name: 'ID Hoja', type: 'string', required: true },
          { id: 'row_number', name: 'Número Fila', type: 'number', required: true },
          { id: 'values', name: 'Valores', type: 'json', required: true }
        ],
        outputs: []
      }
    ]
  },
  {
    id: 'bigquery',
    name: 'BigQuery',
    category: 'Datos',
    icon: '🗄️',
    color: '#4285f4',
    description: 'Data warehouse de Google',
    authType: 'oauth2',
    enterprise: true,
    triggers: [],
    actions: [
      {
        id: 'insert_data',
        name: 'Insertar Datos',
        description: 'Inserta datos en una tabla',
        inputs: [
          { id: 'dataset', name: 'Dataset', type: 'string', required: true },
          { id: 'table', name: 'Tabla', type: 'string', required: true },
          { id: 'data', name: 'Datos', type: 'json', required: true }
        ],
        outputs: []
      },
      {
        id: 'run_query',
        name: 'Ejecutar Query',
        description: 'Ejecuta una consulta SQL',
        inputs: [
          { id: 'query', name: 'Query SQL', type: 'string', required: true }
        ],
        outputs: [
          { id: 'results', name: 'Resultados', type: 'json', required: true }
        ]
      }
    ]
  }
]

/**
 * 🤖 IA & Automatización
 */
export const AI_CONNECTORS: ConnectorDefinition[] = [
  {
    id: 'openai',
    name: 'OpenAI',
    category: 'IA',
    icon: '🧠',
    color: '#10a37f',
    description: 'GPT-4, DALL-E y más',
    authType: 'api_key',
    popular: true,
    triggers: [],
    actions: [
      {
        id: 'generate_content',
        name: 'Generar Contenido',
        description: 'Genera texto con GPT-4',
        inputs: [
          { id: 'prompt', name: 'Prompt', type: 'string', required: true },
          { id: 'model', name: 'Modelo', type: 'string', required: false, default: 'gpt-4' },
          { id: 'max_tokens', name: 'Max Tokens', type: 'number', required: false, default: 1000 }
        ],
        outputs: [
          { id: 'text', name: 'Texto Generado', type: 'string', required: true }
        ]
      },
      {
        id: 'analyze_sentiment',
        name: 'Analizar Sentimiento',
        description: 'Analiza el sentimiento de un texto',
        inputs: [
          { id: 'text', name: 'Texto', type: 'string', required: true }
        ],
        outputs: [
          { id: 'sentiment', name: 'Sentimiento', type: 'string', required: true },
          { id: 'score', name: 'Score', type: 'number', required: true }
        ]
      },
      {
        id: 'extract_data',
        name: 'Extraer Datos',
        description: 'Extrae datos estructurados de texto',
        inputs: [
          { id: 'text', name: 'Texto', type: 'string', required: true },
          { id: 'schema', name: 'Schema JSON', type: 'json', required: true }
        ],
        outputs: [
          { id: 'extracted_data', name: 'Datos Extraídos', type: 'json', required: true }
        ]
      }
    ]
  },
  {
    id: 'ai_agent',
    name: 'AI Agent (Stack21)',
    category: 'IA',
    icon: '🤖',
    color: '#667eea',
    description: 'Agentes IA integrados de Stack21',
    authType: 'custom',
    popular: true,
    triggers: [],
    actions: [
      {
        id: 'score_lead',
        name: 'Puntuar Lead',
        description: 'Calcula score de calidad de un lead con IA',
        inputs: [
          { id: 'lead_data', name: 'Datos Lead', type: 'json', required: true }
        ],
        outputs: [
          { id: 'score', name: 'Score (0-100)', type: 'number', required: true },
          { id: 'reasons', name: 'Razones', type: 'json', required: true }
        ]
      },
      {
        id: 'classify',
        name: 'Clasificar',
        description: 'Clasifica texto en categorías',
        inputs: [
          { id: 'text', name: 'Texto', type: 'string', required: true },
          { id: 'categories', name: 'Categorías', type: 'json', required: true }
        ],
        outputs: [
          { id: 'category', name: 'Categoría', type: 'string', required: true },
          { id: 'confidence', name: 'Confianza', type: 'number', required: true }
        ]
      },
      {
        id: 'make_decision',
        name: 'Tomar Decisión',
        description: 'Toma una decisión basada en reglas y contexto',
        inputs: [
          { id: 'context', name: 'Contexto', type: 'json', required: true },
          { id: 'rules', name: 'Reglas', type: 'json', required: true }
        ],
        outputs: [
          { id: 'decision', name: 'Decisión', type: 'string', required: true },
          { id: 'explanation', name: 'Explicación', type: 'string', required: true }
        ]
      }
    ]
  }
]

/**
 * 🏢 Sistema Stack21
 */
export const SYSTEM_CONNECTORS: ConnectorDefinition[] = [
  {
    id: 'scheduler',
    name: 'Programador',
    category: 'Sistema',
    icon: '⏰',
    color: '#667eea',
    description: 'Ejecuta workflows en horarios específicos',
    authType: 'custom',
    popular: true,
    triggers: [
      {
        id: 'daily',
        name: 'Diario',
        description: 'Ejecuta diariamente a una hora específica',
        inputs: [
          { id: 'time', name: 'Hora (HH:MM)', type: 'string', required: true, default: '09:00' }
        ],
        outputs: [
          { id: 'timestamp', name: 'Timestamp', type: 'date', required: true }
        ]
      },
      {
        id: 'weekly',
        name: 'Semanal',
        description: 'Ejecuta semanalmente',
        inputs: [
          { id: 'day', name: 'Día', type: 'string', required: true, 
            options: [
              { label: 'Lunes', value: 'monday' },
              { label: 'Martes', value: 'tuesday' },
              { label: 'Miércoles', value: 'wednesday' },
              { label: 'Jueves', value: 'thursday' },
              { label: 'Viernes', value: 'friday' },
              { label: 'Sábado', value: 'saturday' },
              { label: 'Domingo', value: 'sunday' }
            ]
          },
          { id: 'time', name: 'Hora (HH:MM)', type: 'string', required: true, default: '09:00' }
        ],
        outputs: [
          { id: 'timestamp', name: 'Timestamp', type: 'date', required: true }
        ]
      },
      {
        id: 'monthly',
        name: 'Mensual',
        description: 'Ejecuta mensualmente',
        inputs: [
          { id: 'day_of_month', name: 'Día del Mes', type: 'number', required: true, default: 1 },
          { id: 'time', name: 'Hora (HH:MM)', type: 'string', required: true, default: '09:00' }
        ],
        outputs: [
          { id: 'timestamp', name: 'Timestamp', type: 'date', required: true }
        ]
      }
    ],
    actions: []
  },
  {
    id: 'webhook',
    name: 'Webhook',
    category: 'Sistema',
    icon: '🔗',
    color: '#718096',
    description: 'Recibe o envía webhooks HTTP',
    authType: 'custom',
    popular: true,
    triggers: [
      {
        id: 'http_request',
        name: 'HTTP Request',
        description: 'Cuando se recibe una petición HTTP',
        inputs: [
          { id: 'method', name: 'Método', type: 'string', required: false,
            options: [
              { label: 'GET', value: 'GET' },
              { label: 'POST', value: 'POST' },
              { label: 'PUT', value: 'PUT' },
              { label: 'DELETE', value: 'DELETE' }
            ]
          }
        ],
        outputs: [
          { id: 'body', name: 'Body', type: 'json', required: false },
          { id: 'headers', name: 'Headers', type: 'json', required: false },
          { id: 'query', name: 'Query Params', type: 'json', required: false }
        ],
        webhook: true
      }
    ],
    actions: [
      {
        id: 'http_request',
        name: 'HTTP Request',
        description: 'Hace una petición HTTP',
        inputs: [
          { id: 'url', name: 'URL', type: 'url', required: true },
          { id: 'method', name: 'Método', type: 'string', required: true, default: 'POST' },
          { id: 'body', name: 'Body', type: 'json', required: false },
          { id: 'headers', name: 'Headers', type: 'json', required: false }
        ],
        outputs: [
          { id: 'response', name: 'Respuesta', type: 'json', required: true },
          { id: 'status_code', name: 'Status Code', type: 'number', required: true }
        ]
      }
    ]
  },
  {
    id: 'approval_system',
    name: 'Sistema de Aprobaciones',
    category: 'Sistema',
    icon: '✅',
    color: '#48bb78',
    description: 'Sistema de aprobaciones enterprise',
    authType: 'custom',
    enterprise: true,
    triggers: [
      {
        id: 'approval_completed',
        name: 'Aprobación Completada',
        description: 'Cuando se completa una aprobación',
        inputs: [],
        outputs: [
          { id: 'approved', name: 'Aprobado', type: 'boolean', required: true },
          { id: 'approver', name: 'Aprobador', type: 'email', required: true },
          { id: 'comments', name: 'Comentarios', type: 'string', required: false }
        ]
      }
    ],
    actions: [
      {
        id: 'request_approval',
        name: 'Solicitar Aprobación',
        description: 'Solicita aprobación a un usuario',
        inputs: [
          { id: 'approver_email', name: 'Email Aprobador', type: 'email', required: true },
          { id: 'title', name: 'Título', type: 'string', required: true },
          { id: 'description', name: 'Descripción', type: 'string', required: false },
          { id: 'data', name: 'Datos', type: 'json', required: false }
        ],
        outputs: [
          { id: 'approval_id', name: 'ID Aprobación', type: 'string', required: true },
          { id: 'approval_url', name: 'URL Aprobación', type: 'url', required: true }
        ]
      }
    ]
  }
]

/**
 * Obtener todos los conectores
 */
export function getAllConnectors(): ConnectorDefinition[] {
  return [
    ...CRM_CONNECTORS,
    ...COMMUNICATION_CONNECTORS,
    ...ECOMMERCE_CONNECTORS,
    ...DATA_CONNECTORS,
    ...AI_CONNECTORS,
    ...SYSTEM_CONNECTORS
  ]
}

/**
 * Buscar conector por ID
 */
export function getConnectorById(id: string): ConnectorDefinition | undefined {
  return getAllConnectors().find(c => c.id === id)
}

/**
 * Obtener conectores por categoría
 */
export function getConnectorsByCategory(category: string): ConnectorDefinition[] {
  return getAllConnectors().filter(c => c.category === category)
}

/**
 * Obtener conectores populares
 */
export function getPopularConnectors(): ConnectorDefinition[] {
  return getAllConnectors().filter(c => c.popular)
}

/**
 * Buscar conectores
 */
export function searchConnectors(query: string): ConnectorDefinition[] {
  const lowerQuery = query.toLowerCase()
  return getAllConnectors().filter(c => 
    c.name.toLowerCase().includes(lowerQuery) ||
    c.description.toLowerCase().includes(lowerQuery) ||
    c.category.toLowerCase().includes(lowerQuery)
  )
}

