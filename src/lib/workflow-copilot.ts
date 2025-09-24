// Copilot de Workflows con IA
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export interface WorkflowNode {
  id: string
  type: 'trigger' | 'action' | 'condition' | 'delay' | 'webhook' | 'email' | 'database' | 'api'
  name: string
  description: string
  config: Record<string, any>
  position: { x: number; y: number }
}

export interface WorkflowConnection {
  id: string
  source: string
  target: string
  condition?: string
}

export interface GeneratedWorkflow {
  name: string
  description: string
  triggerType: 'WEBHOOK' | 'SCHEDULE' | 'MANUAL' | 'EMAIL' | 'FORM_SUBMIT' | 'API_CALL' | 'FILE_UPLOAD' | 'DATABASE_CHANGE'
  triggerConfig: Record<string, any>
  nodes: WorkflowNode[]
  connections: WorkflowConnection[]
  variables: Record<string, any>
  industry?: string
  tags: string[]
}

export class WorkflowCopilot {
  // Generar workflow desde descripción en lenguaje natural
  async generateFromDescription(
    description: string,
    industry?: string,
    context?: Record<string, any>
  ): Promise<GeneratedWorkflow> {
    const prompt = this.buildPrompt(description, industry, context)
    
    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `Eres un experto en automatización de procesos y workflows. 
            Tu tarea es convertir descripciones en lenguaje natural en workflows técnicos detallados.
            
            Responde SOLO con un JSON válido que contenga:
            - name: nombre del workflow
            - description: descripción detallada
            - triggerType: tipo de trigger (WEBHOOK, SCHEDULE, MANUAL, EMAIL, FORM_SUBMIT, API_CALL, FILE_UPLOAD, DATABASE_CHANGE)
            - triggerConfig: configuración del trigger
            - nodes: array de nodos del workflow
            - connections: array de conexiones entre nodos
            - variables: variables del workflow
            - industry: industria específica
            - tags: tags relevantes
            
            Cada nodo debe tener:
            - id: identificador único
            - type: tipo de nodo (trigger, action, condition, delay, webhook, email, database, api)
            - name: nombre del nodo
            - description: descripción del nodo
            - config: configuración específica del nodo
            - position: posición en el canvas {x, y}
            
            Cada conexión debe tener:
            - id: identificador único
            - source: id del nodo origen
            - target: id del nodo destino
            - condition: condición opcional`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 4000,
        temperature: 0.7,
      })

      const response = completion.choices[0]?.message?.content
      if (!response) {
        throw new Error('No se pudo generar el workflow')
      }

      return JSON.parse(response) as GeneratedWorkflow
    } catch (error) {
      console.error('Error generando workflow:', error)
      throw new Error('Error al generar el workflow con IA')
    }
  }

  // Generar sugerencias de mejora para un workflow existente
  async suggestImprovements(
    workflow: GeneratedWorkflow,
    metrics?: Record<string, any>
  ): Promise<string[]> {
    const prompt = `Analiza este workflow y sugiere mejoras:

    Workflow: ${workflow.name}
    Descripción: ${workflow.description}
    Nodos: ${workflow.nodes.length}
    Métricas: ${JSON.stringify(metrics || {})}

    Sugiere 3-5 mejoras específicas y accionables.`

    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'Eres un experto en optimización de workflows. Analiza workflows y sugiere mejoras específicas y accionables.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 1000,
        temperature: 0.7,
      })

      const response = completion.choices[0]?.message?.content
      return response?.split('\n').filter(line => line.trim().length > 0) || []
    } catch (error) {
      console.error('Error generando sugerencias:', error)
      return []
    }
  }

  // Generar templates por industria
  async generateIndustryTemplates(industry: string): Promise<GeneratedWorkflow[]> {
    const templates = {
      'ecommerce': [
        'Cuando alguien compre un producto, enviar email de confirmación y actualizar inventario',
        'Si el stock es bajo, notificar al administrador y reordenar automáticamente',
        'Después de 24 horas sin completar compra, enviar email de recordatorio'
      ],
      'saas': [
        'Cuando un usuario se registre, enviar email de bienvenida y configurar workspace',
        'Si un usuario no ha usado la app en 7 días, enviar email de re-engagement',
        'Cuando se alcance el límite de uso, notificar y sugerir upgrade'
      ],
      'consultoria': [
        'Cuando llegue una nueva consulta, asignar a consultor disponible',
        'Después de cada reunión, enviar resumen y próximos pasos',
        'Si un proyecto está atrasado, notificar al equipo y cliente'
      ],
      'inmobiliaria': [
        'Cuando se publique una propiedad, notificar a clientes interesados',
        'Si una propiedad lleva 30 días sin vender, sugerir reducción de precio',
        'Después de cada visita, enviar seguimiento personalizado'
      ]
    }

    const industryTemplates = templates[industry as keyof typeof templates] || []
    const workflows: GeneratedWorkflow[] = []

    for (const template of industryTemplates) {
      try {
        const workflow = await this.generateFromDescription(template, industry)
        workflows.push(workflow)
      } catch (error) {
        console.error(`Error generando template para ${industry}:`, error)
      }
    }

    return workflows
  }

  // Validar workflow generado
  validateWorkflow(workflow: GeneratedWorkflow): { valid: boolean; errors: string[] } {
    const errors: string[] = []

    if (!workflow.name || workflow.name.trim().length === 0) {
      errors.push('El nombre del workflow es requerido')
    }

    if (!workflow.triggerType) {
      errors.push('El tipo de trigger es requerido')
    }

    if (!workflow.nodes || workflow.nodes.length === 0) {
      errors.push('El workflow debe tener al menos un nodo')
    }

    // Validar que haya un nodo trigger
    const hasTrigger = workflow.nodes.some(node => node.type === 'trigger')
    if (!hasTrigger) {
      errors.push('El workflow debe tener un nodo trigger')
    }

    // Validar conexiones
    if (workflow.connections && workflow.connections.length > 0) {
      for (const connection of workflow.connections) {
        const sourceExists = workflow.nodes.some(node => node.id === connection.source)
        const targetExists = workflow.nodes.some(node => node.id === connection.target)
        
        if (!sourceExists) {
          errors.push(`Conexión inválida: nodo origen '${connection.source}' no existe`)
        }
        if (!targetExists) {
          errors.push(`Conexión inválida: nodo destino '${connection.target}' no existe`)
        }
      }
    }

    return {
      valid: errors.length === 0,
      errors
    }
  }

  // Construir prompt para la IA
  private buildPrompt(description: string, industry?: string, context?: Record<string, any>): string {
    let prompt = `Convierte esta descripción en un workflow de automatización:

"${description}"

`

    if (industry) {
      prompt += `Industria: ${industry}\n`
    }

    if (context) {
      prompt += `Contexto adicional: ${JSON.stringify(context)}\n`
    }

    prompt += `
Considera:
- Usar nodos apropiados para la industria
- Incluir validaciones y manejo de errores
- Hacer el workflow escalable y mantenible
- Incluir logging y monitoreo
- Usar variables para hacer el workflow reutilizable

Genera un workflow completo y funcional.`

    return prompt
  }

  // Obtener nodos disponibles por tipo
  getAvailableNodes(): Record<string, { name: string; description: string; config: any }> {
    return {
      trigger: {
        name: 'Trigger',
        description: 'Nodo que inicia el workflow',
        config: { type: 'trigger' }
      },
      action: {
        name: 'Acción',
        description: 'Ejecuta una acción específica',
        config: { type: 'action' }
      },
      condition: {
        name: 'Condición',
        description: 'Evalúa una condición y decide el flujo',
        config: { type: 'condition' }
      },
      delay: {
        name: 'Retraso',
        description: 'Pausa el workflow por un tiempo determinado',
        config: { type: 'delay' }
      },
      webhook: {
        name: 'Webhook',
        description: 'Envía datos a una URL externa',
        config: { type: 'webhook' }
      },
      email: {
        name: 'Email',
        description: 'Envía un email',
        config: { type: 'email' }
      },
      database: {
        name: 'Base de Datos',
        description: 'Operación en base de datos',
        config: { type: 'database' }
      },
      api: {
        name: 'API',
        description: 'Llamada a API externa',
        config: { type: 'api' }
      }
    }
  }
}

// Instancia singleton
export const workflowCopilot = new WorkflowCopilot()
