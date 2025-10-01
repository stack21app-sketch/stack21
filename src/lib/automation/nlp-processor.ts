/**
 * 🤖 STACK21 - Procesador de Lenguaje Natural para Automatizaciones
 * Convierte descripciones en lenguaje natural a workflows ejecutables
 */

export interface AutomationIntent {
  type: 'trigger' | 'action' | 'condition' | 'approval' | 'ai_decision'
  app?: string
  event?: string
  action?: string
  parameters?: Record<string, any>
  conditions?: Array<{
    field: string
    operator: string
    value: any
  }>
}

export interface ParsedWorkflow {
  name: string
  description: string
  trigger: AutomationIntent
  steps: AutomationIntent[]
  confidence: number
  suggestedConnectors: string[]
}

/**
 * Patrones para detectar triggers comunes
 */
const TRIGGER_PATTERNS = {
  // Ventas & Marketing
  'lead.*facebook': { app: 'facebook_ads', event: 'new_lead' },
  'lead.*hubspot': { app: 'hubspot', event: 'new_contact' },
  'responda.*email|email.*respuesta': { app: 'gmail', event: 'email_reply' },
  'deal.*closed.*won|ganado': { app: 'salesforce', event: 'deal_won' },
  'pide.*demo|solicita.*demo': { app: 'calendly', event: 'new_booking' },
  
  // E-commerce
  'stock.*<|inventario.*bajo': { app: 'shopify', event: 'low_stock' },
  'pedido.*>|orden.*mayor': { app: 'shopify', event: 'new_order' },
  'compra|nueva.*venta': { app: 'shopify', event: 'order_created' },
  'devolución|rma': { app: 'shopify', event: 'return_requested' },
  
  // Finanzas
  'factura.*pdf|invoice.*pdf': { app: 'gmail', event: 'attachment_received' },
  'fin.*mes|cierre.*mensual': { app: 'scheduler', event: 'monthly_schedule' },
  'pago.*stripe|cobro.*stripe': { app: 'stripe', event: 'payment_received' },
  
  // Soporte
  'ticket|nuevo.*caso': { app: 'zendesk', event: 'new_ticket' },
  'menciona.*cancelar|quiere.*cancelar': { app: 'zendesk', event: 'keyword_detected' },
  
  // Operaciones
  'pedido.*retrasa|envío.*retraso': { app: 'shipstation', event: 'shipment_delayed' },
  'onboarding|nuevo.*empleado': { app: 'bamboohr', event: 'new_hire' },
  
  // Programados
  'cada.*día|diario|daily': { app: 'scheduler', event: 'daily' },
  'cada.*semana|semanal|weekly': { app: 'scheduler', event: 'weekly' },
}

/**
 * Patrones para detectar acciones comunes
 */
const ACTION_PATTERNS = {
  // CRM & Ventas
  'crea.*crm|añade.*crm|hubspot|salesforce': { app: 'crm', action: 'create_contact' },
  'actualiza.*lead|enriquece': { app: 'clearbit', action: 'enrich_lead' },
  'score.*ia|puntua|califica': { app: 'ai_agent', action: 'score_lead' },
  'abre.*hilo.*slack|mensaje.*slack': { app: 'slack', action: 'send_message' },
  'tarea.*salesforce': { app: 'salesforce', action: 'create_task' },
  'whatsapp': { app: 'whatsapp', action: 'send_message' },
  
  // Comunicación
  'email|correo|envía.*mensaje': { app: 'gmail', action: 'send_email' },
  'sms': { app: 'twilio', action: 'send_sms' },
  'notifica|avisa|alerta': { app: 'slack', action: 'send_notification' },
  
  // Documentos
  'notion': { app: 'notion', action: 'create_page' },
  'google.*sheets|hoja.*cálculo': { app: 'google_sheets', action: 'add_row' },
  'pdf': { app: 'pdf_generator', action: 'generate_pdf' },
  
  // E-commerce
  'actualiza.*precio|cambia.*precio': { app: 'shopify', action: 'update_product' },
  'factura|invoice': { app: 'quickbooks', action: 'create_invoice' },
  
  // IA
  'genera.*ia|crea.*ia|ai.*genera': { app: 'openai', action: 'generate_content' },
  'traduce|traducción': { app: 'deepl', action: 'translate' },
  'analiza|análisis': { app: 'ai_agent', action: 'analyze' },
  'clasifica': { app: 'ai_agent', action: 'classify' },
  
  // Datos
  'bigquery': { app: 'bigquery', action: 'insert_data' },
  'base.*datos|database': { app: 'postgresql', action: 'insert_record' },
}

/**
 * Detecta apps y servicios mencionados
 */
const APP_KEYWORDS = {
  // CRM & Ventas
  'hubspot': 'hubspot',
  'salesforce': 'salesforce',
  'pipedrive': 'pipedrive',
  'clearbit': 'clearbit',
  
  // Comunicación
  'slack': 'slack',
  'gmail': 'gmail',
  'outlook': 'outlook',
  'whatsapp': 'whatsapp',
  'twilio': 'twilio',
  
  // E-commerce
  'shopify': 'shopify',
  'woocommerce': 'woocommerce',
  'stripe': 'stripe',
  'paypal': 'paypal',
  
  // Productividad
  'notion': 'notion',
  'airtable': 'airtable',
  'asana': 'asana',
  'jira': 'jira',
  'trello': 'trello',
  
  // Datos
  'bigquery': 'bigquery',
  'postgresql': 'postgresql',
  'mysql': 'mysql',
  'mongodb': 'mongodb',
  
  // Soporte
  'zendesk': 'zendesk',
  'intercom': 'intercom',
  'freshdesk': 'freshdesk',
  
  // Marketing
  'mailchimp': 'mailchimp',
  'sendgrid': 'sendgrid',
  'facebook.*ads': 'facebook_ads',
  'google.*ads': 'google_ads',
}

/**
 * Parsea una descripción en lenguaje natural y la convierte en un workflow
 */
export async function parseNaturalLanguage(description: string): Promise<ParsedWorkflow> {
  const lowerDesc = description.toLowerCase()
  
  // 1. Detectar el trigger
  const trigger = detectTrigger(lowerDesc)
  
  // 2. Detectar las acciones
  const steps = detectActions(lowerDesc)
  
  // 3. Detectar condiciones
  const conditions = detectConditions(lowerDesc)
  
  // 4. Detectar apps mencionadas
  const suggestedConnectors = detectApps(lowerDesc)
  
  // 5. Calcular confianza
  const confidence = calculateConfidence(trigger, steps, description)
  
  // 6. Generar nombre automático
  const name = generateWorkflowName(trigger, steps)
  
  return {
    name,
    description,
    trigger,
    steps: [...steps, ...conditions],
    confidence,
    suggestedConnectors
  }
}

function detectTrigger(text: string): AutomationIntent {
  // Buscar patrones de trigger
  for (const [pattern, config] of Object.entries(TRIGGER_PATTERNS)) {
    const regex = new RegExp(pattern, 'i')
    if (regex.test(text)) {
      return {
        type: 'trigger',
        ...config
      }
    }
  }
  
  // Trigger por defecto: webhook
  return {
    type: 'trigger',
    app: 'webhook',
    event: 'http_request'
  }
}

function detectActions(text: string): AutomationIntent[] {
  const actions: AutomationIntent[] = []
  
  // Buscar todas las acciones mencionadas
  for (const [pattern, config] of Object.entries(ACTION_PATTERNS)) {
    const regex = new RegExp(pattern, 'i')
    if (regex.test(text)) {
      actions.push({
        type: 'action',
        ...config
      })
    }
  }
  
  // Detectar aprobaciones
  if (/aprob|aprueba|autoriza|firma/i.test(text)) {
    actions.push({
      type: 'approval',
      app: 'approval_system',
      action: 'request_approval'
    })
  }
  
  // Detectar decisiones IA
  if (/ia.*decide|ai.*decide|inteligencia.*decide/i.test(text)) {
    actions.push({
      type: 'ai_decision',
      app: 'ai_agent',
      action: 'make_decision'
    })
  }
  
  return actions
}

function detectConditions(text: string): AutomationIntent[] {
  const conditions: AutomationIntent[] = []
  
  // Detectar condiciones numéricas
  const numericPattern = /si\s+.*?([><]=?)\s*(\d+)/gi
  let match
  while ((match = numericPattern.exec(text)) !== null) {
    conditions.push({
      type: 'condition',
      conditions: [{
        field: 'value',
        operator: match[1],
        value: parseInt(match[2])
      }]
    })
  }
  
  // Detectar condiciones de keywords
  if (/contiene|menciona|incluye/i.test(text)) {
    const keywords = text.match(/"([^"]+)"|'([^']+)'/g)
    if (keywords) {
      conditions.push({
        type: 'condition',
        conditions: keywords.map(kw => ({
          field: 'content',
          operator: 'contains',
          value: kw.replace(/["']/g, '')
        }))
      })
    }
  }
  
  return conditions
}

function detectApps(text: string): string[] {
  const apps: Set<string> = new Set()
  
  for (const [keyword, appName] of Object.entries(APP_KEYWORDS)) {
    const regex = new RegExp(keyword, 'i')
    if (regex.test(text)) {
      apps.add(appName)
    }
  }
  
  return Array.from(apps)
}

function calculateConfidence(
  trigger: AutomationIntent, 
  steps: AutomationIntent[], 
  description: string
): number {
  let confidence = 0.5 // Base
  
  // +20% si detectó un trigger específico
  if (trigger.app !== 'webhook') {
    confidence += 0.2
  }
  
  // +10% por cada acción detectada (máx 30%)
  confidence += Math.min(steps.length * 0.1, 0.3)
  
  // +10% si es una descripción detallada (>100 caracteres)
  if (description.length > 100) {
    confidence += 0.1
  }
  
  return Math.min(confidence, 0.95)
}

function generateWorkflowName(trigger: AutomationIntent, steps: AutomationIntent[]): string {
  const triggerName = trigger.app?.replace('_', ' ') || 'Evento'
  const firstAction = steps[0]?.app?.replace('_', ' ') || 'Automatización'
  
  return `${triggerName} → ${firstAction}`.split(' ').map(w => 
    w.charAt(0).toUpperCase() + w.slice(1)
  ).join(' ')
}

/**
 * Genera sugerencias basadas en el contexto
 */
export function generateSuggestions(partial: string): string[] {
  const suggestions = [
    "Cuando llegue un lead de Facebook Ads, enriquécelo con Clearbit y créalo en HubSpot con score IA",
    "Si un cliente menciona 'cancelar' en email o chat, abre un caso de retención y ofrece cupón",
    "Lee facturas PDF de email, extrae datos con IA y crea asientos en QuickBooks",
    "Cada día a las 8:00, genera un reporte de ventas y publícalo en Slack",
    "Si Stock < 10 en Shopify, actualiza precio dinámico y avisa al buyer en Slack",
    "Cuando un pedido > 500 €, verifica antifraude y solicita aprobación si hay riesgo",
    "Clasifica tickets por urgencia con IA y escala a humano si confianza < 0.85",
    "Al onboardear un empleado, crea cuentas en Google, Slack y Notion automáticamente",
    "Genera un resumen ejecutivo semanal de ventas y envíalo por email al equipo",
    "Si un deal pasa a Closed Won, crea el pedido en el ERP y envía la factura"
  ]
  
  if (!partial || partial.length < 3) {
    return suggestions.slice(0, 5)
  }
  
  return suggestions.filter(s => 
    s.toLowerCase().includes(partial.toLowerCase())
  ).slice(0, 5)
}

