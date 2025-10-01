/**
 * ⚙️ STACK21 - Motor de Ejecución de Workflows
 * Ejecuta automatizaciones con triggers, condiciones, acciones y AI
 */

import { getConnectorById } from './connectors'
import type { AutomationIntent } from './nlp-processor'

export interface WorkflowNode {
  id: string
  type: 'trigger' | 'action' | 'condition' | 'approval' | 'ai_decision'
  connector: string
  operation: string
  config: Record<string, any>
  position?: { x: number; y: number }
}

export interface WorkflowConnection {
  id: string
  from: string
  to: string
  condition?: string
}

export interface Workflow {
  id: string
  name: string
  description: string
  active: boolean
  nodes: WorkflowNode[]
  connections: WorkflowConnection[]
  createdAt: Date
  updatedAt: Date
}

export interface ExecutionContext {
  workflowId: string
  executionId: string
  trigger

Data: any
  variables: Record<string, any>
  logs: ExecutionLog[]
  status: 'running' | 'completed' | 'failed' | 'paused'
}

export interface ExecutionLog {
  timestamp: Date
  nodeId: string
  type: 'info' | 'success' | 'warning' | 'error'
  message: string
  data?: any
}

/**
 * Ejecuta un workflow completo
 */
export async function executeWorkflow(
  workflow: Workflow,
  triggerData: any
): Promise<ExecutionContext> {
  const executionId = generateExecutionId()
  
  const context: ExecutionContext = {
    workflowId: workflow.id,
    executionId,
    triggerData,
    variables: { trigger: triggerData },
    logs: [],
    status: 'running'
  }

  try {
    // Log inicio
    addLog(context, 'trigger', 'info', `Iniciando workflow: ${workflow.name}`)

    // Obtener nodo trigger
    const triggerNode = workflow.nodes.find(n => n.type === 'trigger')
    if (!triggerNode) {
      throw new Error('No se encontró nodo trigger')
    }

    // Ejecutar nodos en orden
    let currentNodeId = triggerNode.id
    const visitedNodes = new Set<string>()

    while (currentNodeId && !visitedNodes.has(currentNodeId)) {
      visitedNodes.add(currentNodeId)
      
      const node = workflow.nodes.find(n => n.id === currentNodeId)
      if (!node) break

      // Ejecutar nodo
      const result = await executeNode(node, context)
      
      // Determinar siguiente nodo
      const nextConnection = findNextNode(workflow, currentNodeId, result, context)
      currentNodeId = nextConnection?.to || ''
    }

    context.status = 'completed'
    addLog(context, 'workflow', 'success', 'Workflow completado exitosamente')
    
  } catch (error: any) {
    context.status = 'failed'
    addLog(context, 'workflow', 'error', `Error: ${error.message}`, { error: error.stack })
  }

  return context
}

/**
 * Ejecuta un nodo individual
 */
async function executeNode(
  node: WorkflowNode,
  context: ExecutionContext
): Promise<any> {
  addLog(context, node.id, 'info', `Ejecutando: ${node.type} - ${node.connector}`)

  switch (node.type) {
    case 'trigger':
      return executeTrigger(node, context)
    
    case 'action':
      return executeAction(node, context)
    
    case 'condition':
      return executeCondition(node, context)
    
    case 'approval':
      return executeApproval(node, context)
    
    case 'ai_decision':
      return executeAIDecision(node, context)
    
    default:
      throw new Error(`Tipo de nodo desconocido: ${node.type}`)
  }
}

/**
 * Ejecuta un trigger
 */
function executeTrigger(node: WorkflowNode, context: ExecutionContext): any {
  // El trigger ya se ejecutó, solo retornamos los datos
  addLog(context, node.id, 'success', 'Trigger activado', context.triggerData)
  return context.triggerData
}

/**
 * Ejecuta una acción
 */
async function executeAction(node: WorkflowNode, context: ExecutionContext): Promise<any> {
  const connector = getConnectorById(node.connector)
  if (!connector) {
    throw new Error(`Conector no encontrado: ${node.connector}`)
  }

  // Resolver variables en la configuración
  const resolvedConfig = resolveVariables(node.config, context.variables)
  
  addLog(context, node.id, 'info', `Ejecutando acción: ${node.operation}`, resolvedConfig)

  // Simulación de ejecución (en producción, llamar a la API real)
  const result = await simulateActionExecution(node.connector, node.operation, resolvedConfig)
  
  // Guardar resultado en variables
  context.variables[node.id] = result
  
  addLog(context, node.id, 'success', 'Acción completada', result)
  return result
}

/**
 * Ejecuta una condición
 */
function executeCondition(node: WorkflowNode, context: ExecutionContext): boolean {
  const conditions = node.config.conditions || []
  
  for (const condition of conditions) {
    const value = resolveVariable(condition.field, context.variables)
    const result = evaluateCondition(value, condition.operator, condition.value)
    
    addLog(context, node.id, 'info', 
      `Condición: ${condition.field} ${condition.operator} ${condition.value} = ${result}`)
    
    if (!result) return false
  }
  
  addLog(context, node.id, 'success', 'Todas las condiciones cumplidas')
  return true
}

/**
 * Ejecuta una aprobación
 */
async function executeApproval(node: WorkflowNode, context: ExecutionContext): Promise<any> {
  addLog(context, node.id, 'info', 'Solicitando aprobación...')
  
  // En producción, esto enviaría un email/notificación y esperaría respuesta
  const approvalData = {
    approvalId: generateExecutionId(),
    approver: node.config.approver_email,
    title: resolveVariables(node.config.title, context.variables),
    status: 'pending',
    url: `https://stack21app.com/approvals/${generateExecutionId()}`
  }
  
  // Pausar workflow
  context.status = 'paused'
  addLog(context, node.id, 'warning', 'Workflow pausado - Esperando aprobación', approvalData)
  
  return approvalData
}

/**
 * Ejecuta una decisión IA
 */
async function executeAIDecision(node: WorkflowNode, context: ExecutionContext): Promise<any> {
  addLog(context, node.id, 'info', 'Procesando con IA...')
  
  const contextData = resolveVariables(node.config.context, context.variables)
  const rules = node.config.rules || []
  
  // Simulación de decisión IA
  const decision = await simulateAIDecision(contextData, rules)
  
  context.variables[node.id] = decision
  addLog(context, node.id, 'success', `Decisión IA: ${decision.decision}`, decision)
  
  return decision
}

/**
 * Encuentra el siguiente nodo a ejecutar
 */
function findNextNode(
  workflow: Workflow,
  currentNodeId: string,
  nodeResult: any,
  context: ExecutionContext
): WorkflowConnection | undefined {
  const connections = workflow.connections.filter(c => c.from === currentNodeId)
  
  if (connections.length === 0) return undefined
  if (connections.length === 1) return connections[0]
  
  // Si hay múltiples conexiones, evaluar condiciones
  for (const connection of connections) {
    if (!connection.condition) return connection
    
    // Evaluar condición de conexión
    if (evaluateConnectionCondition(connection.condition, nodeResult, context)) {
      return connection
    }
  }
  
  return undefined
}

/**
 * Resuelve variables en un objeto
 */
function resolveVariables(obj: any, variables: Record<string, any>): any {
  if (typeof obj === 'string') {
    return resolveVariable(obj, variables)
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => resolveVariables(item, variables))
  }
  
  if (typeof obj === 'object' && obj !== null) {
    const resolved: any = {}
    for (const [key, value] of Object.entries(obj)) {
      resolved[key] = resolveVariables(value, variables)
    }
    return resolved
  }
  
  return obj
}

/**
 * Resuelve una variable individual
 */
function resolveVariable(value: string, variables: Record<string, any>): any {
  // Formato: {{variable.path}}
  const matches = value.match(/\{\{(.+?)\}\}/g)
  if (!matches) return value
  
  let result = value
  for (const match of matches) {
    const path = match.slice(2, -2).trim()
    const resolved = getNestedValue(variables, path)
    result = result.replace(match, String(resolved || ''))
  }
  
  return result
}

/**
 * Obtiene un valor anidado de un objeto
 */
function getNestedValue(obj: any, path: string): any {
  const parts = path.split('.')
  let current = obj
  
  for (const part of parts) {
    if (current === null || current === undefined) return undefined
    current = current[part]
  }
  
  return current
}

/**
 * Evalúa una condición
 */
function evaluateCondition(value: any, operator: string, expected: any): boolean {
  switch (operator) {
    case '==':
    case 'equals':
      return value == expected
    case '!=':
    case 'not_equals':
      return value != expected
    case '>':
    case 'greater_than':
      return value > expected
    case '>=':
    case 'greater_or_equal':
      return value >= expected
    case '<':
    case 'less_than':
      return value < expected
    case '<=':
    case 'less_or_equal':
      return value <= expected
    case 'contains':
      return String(value).toLowerCase().includes(String(expected).toLowerCase())
    case 'not_contains':
      return !String(value).toLowerCase().includes(String(expected).toLowerCase())
    case 'starts_with':
      return String(value).toLowerCase().startsWith(String(expected).toLowerCase())
    case 'ends_with':
      return String(value).toLowerCase().endsWith(String(expected).toLowerCase())
    default:
      return false
  }
}

/**
 * Evalúa condición de conexión
 */
function evaluateConnectionCondition(
  condition: string,
  nodeResult: any,
  context: ExecutionContext
): boolean {
  // Condiciones especiales
  if (condition === 'true' || condition === 'approved') {
    return nodeResult === true || nodeResult?.approved === true
  }
  if (condition === 'false' || condition === 'rejected') {
    return nodeResult === false || nodeResult?.approved === false
  }
  
  return false
}

/**
 * Agrega un log a la ejecución
 */
function addLog(
  context: ExecutionContext,
  nodeId: string,
  type: ExecutionLog['type'],
  message: string,
  data?: any
) {
  context.logs.push({
    timestamp: new Date(),
    nodeId,
    type,
    message,
    data
  })
}

/**
 * Genera un ID de ejecución único
 */
function generateExecutionId(): string {
  return `exec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Simulación de ejecución de acción (en producción, llamar APIs reales)
 */
async function simulateActionExecution(
  connector: string,
  operation: string,
  config: any
): Promise<any> {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 500))
  
  // Simular respuestas según el conector
  switch (connector) {
    case 'slack':
      return { message_ts: '1234567890.123456', ok: true }
    
    case 'gmail':
      return { message_id: 'msg_abc123', status: 'sent' }
    
    case 'hubspot':
    case 'salesforce':
      return { id: 'contact_123', created: true }
    
    case 'shopify':
      return { product_id: 'prod_456', updated: true }
    
    case 'openai':
      if (operation === 'generate_content') {
        return { text: 'Contenido generado por IA...', tokens: 150 }
      }
      return { result: 'Procesado', confidence: 0.92 }
    
    case 'ai_agent':
      if (operation === 'score_lead') {
        return {
          score: 85,
          reasons: ['Email corporativo', 'Empresa grande', 'Industria relevante']
        }
      }
      return { analysis: 'Completado', confidence: 0.88 }
    
    default:
      return { success: true, message: 'Operación completada' }
  }
}

/**
 * Simulación de decisión IA
 */
async function simulateAIDecision(context: any, rules: any[]): Promise<any> {
  await new Promise(resolve => setTimeout(resolve, 800))
  
  return {
    decision: 'approve',
    confidence: 0.89,
    explanation: 'Los datos cumplen con los criterios establecidos y no se detectaron anomalías.',
    factors: [
      { name: 'Monto dentro del rango', weight: 0.3, value: true },
      { name: 'Cliente verificado', weight: 0.4, value: true },
      { name: 'Sin señales de fraude', weight: 0.3, value: true }
    ]
  }
}

/**
 * Valida un workflow antes de ejecutarlo
 */
export function validateWorkflow(workflow: Workflow): { valid: boolean; errors: string[] } {
  const errors: string[] = []
  
  // Verificar que tenga al menos un trigger
  const triggers = workflow.nodes.filter(n => n.type === 'trigger')
  if (triggers.length === 0) {
    errors.push('El workflow debe tener al menos un trigger')
  }
  if (triggers.length > 1) {
    errors.push('El workflow solo puede tener un trigger')
  }
  
  // Verificar que todos los nodos tengan ID único
  const ids = workflow.nodes.map(n => n.id)
  const uniqueIds = new Set(ids)
  if (ids.length !== uniqueIds.size) {
    errors.push('Hay nodos con IDs duplicados')
  }
  
  // Verificar que las conexiones referencien nodos existentes
  for (const conn of workflow.connections) {
    if (!workflow.nodes.find(n => n.id === conn.from)) {
      errors.push(`Conexión referencia nodo inexistente: ${conn.from}`)
    }
    if (!workflow.nodes.find(n => n.id === conn.to)) {
      errors.push(`Conexión referencia nodo inexistente: ${conn.to}`)
    }
  }
  
  // Verificar que no haya ciclos infinitos (simplificado)
  const hasLoop = detectCycles(workflow)
  if (hasLoop) {
    errors.push('Se detectó un ciclo infinito en el workflow')
  }
  
  return {
    valid: errors.length === 0,
    errors
  }
}

/**
 * Detecta ciclos en el workflow
 */
function detectCycles(workflow: Workflow): boolean {
  const visited = new Set<string>()
  const recursionStack = new Set<string>()
  
  function dfs(nodeId: string): boolean {
    visited.add(nodeId)
    recursionStack.add(nodeId)
    
    const connections = workflow.connections.filter(c => c.from === nodeId)
    for (const conn of connections) {
      if (!visited.has(conn.to)) {
        if (dfs(conn.to)) return true
      } else if (recursionStack.has(conn.to)) {
        return true // Ciclo detectado
      }
    }
    
    recursionStack.delete(nodeId)
    return false
  }
  
  const triggerNode = workflow.nodes.find(n => n.type === 'trigger')
  if (!triggerNode) return false
  
  return dfs(triggerNode.id)
}

