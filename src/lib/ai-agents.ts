import OpenAI from 'openai'
import { openai } from './openai'

// ===== TIPOS Y INTERFACES =====

export interface AIAgent {
  id: string
  name: string
  description: string
  icon: string
  category: AgentCategory
  capabilities: AgentCapability[]
  isActive: boolean
  config: AgentConfig
}

export interface AgentCapability {
  id: string
  name: string
  description: string
  functionName: string
  parameters: Record<string, any>
  requiredParams: string[]
  optionalParams: string[]
}

export interface AgentConfig {
  model: string
  temperature: number
  maxTokens: number
  systemPrompt: string
  functionCalling: boolean
  integrations: string[]
}

export interface AgentExecution {
  id: string
  agentId: string
  userId: string
  workspaceId: string
  input: string
  output: any
  status: 'pending' | 'running' | 'completed' | 'failed'
  error?: string
  duration?: number
  tokensUsed?: number
  cost?: number
  createdAt: Date
  completedAt?: Date
}

export interface AgentFunction {
  name: string
  description: string
  parameters: {
    type: string
    properties: Record<string, any>
    required: string[]
  }
}

export type AgentCategory = 
  | 'reservations' 
  | 'marketing' 
  | 'analytics' 
  | 'automation' 
  | 'customer_service'
  | 'data_processing'
  | 'communication'
  | 'business_intelligence'

// ===== AGENTES PREDEFINIDOS =====

export const PREDEFINED_AGENTS: AIAgent[] = [
  {
    id: 'restaurant-reservations',
    name: 'Agente de Reservas de Restaurantes',
    description: 'Reserva mesas en restaurantes automáticamente usando APIs de OpenTable, Resy y Yelp',
    icon: '🍽️',
    category: 'reservations',
    isActive: true,
    capabilities: [
      {
        id: 'search-restaurants',
        name: 'Buscar Restaurantes',
        description: 'Busca restaurantes por tipo de cocina, ubicación y calificaciones',
        functionName: 'search_restaurants',
        parameters: {
          cuisine: 'string',
          location: 'string',
          radius: 'number',
          minRating: 'number'
        },
        requiredParams: ['cuisine', 'location'],
        optionalParams: ['radius', 'minRating']
      },
      {
        id: 'check-availability',
        name: 'Verificar Disponibilidad',
        description: 'Verifica disponibilidad de mesas en restaurantes específicos',
        functionName: 'check_availability',
        parameters: {
          restaurantId: 'string',
          date: 'string',
          time: 'string',
          partySize: 'number'
        },
        requiredParams: ['restaurantId', 'date', 'time', 'partySize'],
        optionalParams: []
      },
      {
        id: 'make-reservation',
        name: 'Hacer Reserva',
        description: 'Realiza una reserva en el restaurante seleccionado',
        functionName: 'make_reservation',
        parameters: {
          restaurantId: 'string',
          date: 'string',
          time: 'string',
          partySize: 'number',
          customerName: 'string',
          customerPhone: 'string',
          specialRequests: 'string'
        },
        requiredParams: ['restaurantId', 'date', 'time', 'partySize', 'customerName'],
        optionalParams: ['customerPhone', 'specialRequests']
      }
    ],
    config: {
      model: 'gpt-4',
      temperature: 0.3,
      maxTokens: 1000,
      systemPrompt: `Eres un asistente especializado en reservas de restaurantes. 
      Puedes buscar restaurantes, verificar disponibilidad y hacer reservas.
      Siempre confirma los detalles antes de hacer una reserva.
      Responde en español de manera amigable y profesional.`,
      functionCalling: true,
      integrations: ['opentable', 'resy', 'yelp']
    }
  },
  {
    id: 'marketing-automation',
    name: 'Agente de Marketing Automatizado',
    description: 'Crea y gestiona campañas de marketing en múltiples plataformas',
    icon: '📈',
    category: 'marketing',
    isActive: true,
    capabilities: [
      {
        id: 'create-campaign',
        name: 'Crear Campaña',
        description: 'Crea campañas de marketing optimizadas para diferentes plataformas',
        functionName: 'create_marketing_campaign',
        parameters: {
          product: 'string',
          targetAudience: 'string',
          budget: 'number',
          platforms: 'array',
          goals: 'array'
        },
        requiredParams: ['product', 'targetAudience', 'budget'],
        optionalParams: ['platforms', 'goals']
      },
      {
        id: 'optimize-content',
        name: 'Optimizar Contenido',
        description: 'Optimiza contenido de marketing para diferentes plataformas',
        functionName: 'optimize_marketing_content',
        parameters: {
          content: 'string',
          platform: 'string',
          targetAudience: 'string'
        },
        requiredParams: ['content', 'platform'],
        optionalParams: ['targetAudience']
      },
      {
        id: 'schedule-posts',
        name: 'Programar Publicaciones',
        description: 'Programa publicaciones en redes sociales',
        functionName: 'schedule_social_posts',
        parameters: {
          content: 'string',
          platforms: 'array',
          scheduleTime: 'string',
          media: 'array'
        },
        requiredParams: ['content', 'platforms', 'scheduleTime'],
        optionalParams: ['media']
      }
    ],
    config: {
      model: 'gpt-4',
      temperature: 0.7,
      maxTokens: 1500,
      systemPrompt: `Eres un experto en marketing digital y automatización.
      Puedes crear campañas, optimizar contenido y programar publicaciones.
      Conoces las mejores prácticas de cada plataforma social.
      Responde en español con creatividad y profesionalismo.`,
      functionCalling: true,
      integrations: ['facebook', 'instagram', 'twitter', 'linkedin', 'tiktok']
    }
  },
  {
    id: 'business-analytics',
    name: 'Agente de Análisis de Negocio',
    description: 'Analiza datos empresariales y genera reportes inteligentes',
    icon: '📊',
    category: 'analytics',
    isActive: true,
    capabilities: [
      {
        id: 'analyze-sales',
        name: 'Analizar Ventas',
        description: 'Analiza datos de ventas y identifica tendencias',
        functionName: 'analyze_sales_data',
        parameters: {
          dateRange: 'string',
          metrics: 'array',
          filters: 'object'
        },
        requiredParams: ['dateRange'],
        optionalParams: ['metrics', 'filters']
      },
      {
        id: 'generate-report',
        name: 'Generar Reporte',
        description: 'Genera reportes ejecutivos con insights clave',
        functionName: 'generate_business_report',
        parameters: {
          reportType: 'string',
          period: 'string',
          includeCharts: 'boolean'
        },
        requiredParams: ['reportType', 'period'],
        optionalParams: ['includeCharts']
      },
      {
        id: 'predict-trends',
        name: 'Predecir Tendencias',
        description: 'Predice tendencias futuras basadas en datos históricos',
        functionName: 'predict_business_trends',
        parameters: {
          dataType: 'string',
          forecastPeriod: 'string',
          confidence: 'number'
        },
        requiredParams: ['dataType', 'forecastPeriod'],
        optionalParams: ['confidence']
      }
    ],
    config: {
      model: 'gpt-4',
      temperature: 0.2,
      maxTokens: 2000,
      systemPrompt: `Eres un analista de datos empresariales experto.
      Puedes analizar datos, generar reportes y predecir tendencias.
      Siempre proporciona insights accionables y recomendaciones claras.
      Responde en español con precisión técnica y claridad.`,
      functionCalling: true,
      integrations: ['stripe', 'shopify', 'google_analytics', 'salesforce']
    }
  }
]

// ===== CLASE PRINCIPAL DE AGENTES =====

export class AIAgentManager {
  private openai: OpenAI
  private executions: Map<string, AgentExecution> = new Map()

  constructor() {
    this.openai = openai!
  }

  // Obtener todos los agentes disponibles
  getAvailableAgents(): AIAgent[] {
    return PREDEFINED_AGENTS.filter(agent => agent.isActive)
  }

  // Obtener agente por ID
  getAgent(agentId: string): AIAgent | undefined {
    return PREDEFINED_AGENTS.find(agent => agent.id === agentId)
  }

  // Obtener agentes por categoría
  getAgentsByCategory(category: AgentCategory): AIAgent[] {
    return PREDEFINED_AGENTS.filter(agent => 
      agent.category === category && agent.isActive
    )
  }

  // Ejecutar un agente con input del usuario
  async executeAgent(
    agentId: string, 
    input: string, 
    userId: string, 
    workspaceId: string,
    context?: any
  ): Promise<AgentExecution> {
    const agent = this.getAgent(agentId)
    if (!agent) {
      throw new Error(`Agente ${agentId} no encontrado`)
    }

    // Crear ejecución
    const execution: AgentExecution = {
      id: this.generateId(),
      agentId,
      userId,
      workspaceId,
      input,
      output: null,
      status: 'pending',
      createdAt: new Date()
    }

    this.executions.set(execution.id, execution)

    try {
      execution.status = 'running'
      
      // Preparar funciones del agente
      const functions = this.prepareFunctions(agent)
      
      // Ejecutar con OpenAI
      const result = await this.runWithOpenAI(agent, input, functions, context)
      
      execution.output = result
      execution.status = 'completed'
      execution.completedAt = new Date()
      execution.duration = execution.completedAt.getTime() - execution.createdAt.getTime()
      
      // Calcular tokens y costo (aproximado)
      execution.tokensUsed = this.estimateTokens(input + JSON.stringify(result))
      execution.cost = this.calculateCost(execution.tokensUsed, agent.config.model)

    } catch (error) {
      execution.status = 'failed'
      execution.error = error instanceof Error ? error.message : 'Error desconocido'
      execution.completedAt = new Date()
    }

    return execution
  }

  // Preparar funciones para OpenAI
  private prepareFunctions(agent: AIAgent): AgentFunction[] {
    return agent.capabilities.map(capability => ({
      name: capability.functionName,
      description: capability.description,
      parameters: {
        type: 'object',
        properties: capability.parameters,
        required: capability.requiredParams
      }
    }))
  }

  // Ejecutar con OpenAI
  private async runWithOpenAI(
    agent: AIAgent, 
    input: string, 
    functions: AgentFunction[],
    context?: any
  ): Promise<any> {
    const messages = [
      {
        role: 'system' as const,
        content: agent.config.systemPrompt + (context ? `\nContexto: ${JSON.stringify(context)}` : '')
      },
      {
        role: 'user' as const,
        content: input
      }
    ]

    const completion = await this.openai.chat.completions.create({
      model: agent.config.model,
      messages,
      functions: functions.length > 0 ? functions : undefined,
      function_call: functions.length > 0 ? 'auto' : undefined,
      max_tokens: agent.config.maxTokens,
      temperature: agent.config.temperature
    })

    const message = completion.choices[0]?.message
    
    if (message?.function_call) {
      // Ejecutar función llamada por el agente
      return await this.executeFunction(message.function_call.name, message.function_call.arguments)
    }

    return message?.content || 'No se pudo generar respuesta'
  }

  // Ejecutar función específica
  private async executeFunction(functionName: string, arguments_: string): Promise<any> {
    const params = JSON.parse(arguments_ || '{}')
    
    switch (functionName) {
      case 'search_restaurants':
        return await this.searchRestaurants(params)
      
      case 'check_availability':
        return await this.checkAvailability(params)
      
      case 'make_reservation':
        return await this.makeReservation(params)
      
      case 'create_marketing_campaign':
        return await this.createMarketingCampaign(params)
      
      case 'analyze_sales_data':
        return await this.analyzeSalesData(params)
      
      default:
        throw new Error(`Función ${functionName} no implementada`)
    }
  }

  // ===== IMPLEMENTACIONES DE FUNCIONES =====

  private async searchRestaurants(params: any): Promise<any> {
    // Simulación de búsqueda en Yelp API
    const { cuisine, location, radius = 5000, minRating = 4.0 } = params
    
    // En producción, aquí harías la llamada real a la API de Yelp
    const mockResults = [
      {
        id: 'rest_1',
        name: `Restaurante ${cuisine} Premium`,
        cuisine: cuisine,
        location: location,
        rating: 4.5,
        priceRange: '$$',
        distance: '0.8 km',
        availability: true
      },
      {
        id: 'rest_2', 
        name: `${cuisine} House`,
        cuisine: cuisine,
        location: location,
        rating: 4.2,
        priceRange: '$',
        distance: '1.2 km',
        availability: true
      }
    ].filter(r => r.rating >= minRating)

    return {
      restaurants: mockResults,
      totalFound: mockResults.length,
      searchParams: params
    }
  }

  private async checkAvailability(params: any): Promise<any> {
    const { restaurantId, date, time, partySize } = params
    
    // Simulación de verificación de disponibilidad
    const available = Math.random() > 0.3 // 70% probabilidad de disponibilidad
    
    return {
      restaurantId,
      date,
      time,
      partySize,
      available,
      alternativeTimes: available ? [] : ['19:00', '20:30', '21:00']
    }
  }

  private async makeReservation(params: any): Promise<any> {
    const { restaurantId, date, time, partySize, customerName, customerPhone, specialRequests } = params
    
    // Simulación de creación de reserva
    const reservationId = `res_${Date.now()}`
    
    return {
      success: true,
      reservationId,
      confirmation: {
        restaurant: 'Restaurante Confirmado',
        date,
        time,
        partySize,
        customerName,
        confirmationCode: `RES${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
        specialRequests: specialRequests || 'Ninguna'
      },
      message: `¡Reserva confirmada! Código: RES${Math.random().toString(36).substr(2, 6).toUpperCase()}`
    }
  }

  private async createMarketingCampaign(params: any): Promise<any> {
    const { product, targetAudience, budget, platforms = ['facebook', 'instagram'], goals } = params
    
    // Simulación de creación de campaña
    return {
      campaignId: `camp_${Date.now()}`,
      name: `Campaña ${product}`,
      status: 'created',
      budget,
      platforms,
      estimatedReach: Math.floor(budget * 100),
      estimatedClicks: Math.floor(budget * 50),
      recommendations: [
        'Optimizar para móviles',
        'Usar videos cortos',
        'A/B test de creatividades'
      ]
    }
  }

  private async analyzeSalesData(params: any): Promise<any> {
    const { dateRange, metrics = ['revenue', 'orders'], filters } = params
    
    // Simulación de análisis de datos
    return {
      period: dateRange,
      metrics: {
        revenue: { current: 125000, previous: 110000, change: '+13.6%' },
        orders: { current: 1250, previous: 1100, change: '+13.6%' },
        averageOrder: { current: 100, previous: 100, change: '0%' }
      },
      insights: [
        'Crecimiento constante en los últimos 30 días',
        'Pico de ventas los fines de semana',
        'Oportunidad en segmento de productos premium'
      ],
      recommendations: [
        'Aumentar inventario para fines de semana',
        'Crear campaña para productos premium',
        'Optimizar proceso de checkout'
      ]
    }
  }

  // ===== UTILIDADES =====

  private generateId(): string {
    return `agent_exec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private estimateTokens(text: string): number {
    // Estimación aproximada: 1 token ≈ 4 caracteres
    return Math.ceil(text.length / 4)
  }

  private calculateCost(tokens: number, model: string): number {
    // Precios aproximados por token (en USD)
    const prices: Record<string, number> = {
      'gpt-4': 0.00003,
      'gpt-3.5-turbo': 0.000002
    }
    
    return tokens * (prices[model] || 0.00003)
  }

  // Obtener ejecuciones del usuario
  getUserExecutions(userId: string, limit: number = 50): AgentExecution[] {
    return Array.from(this.executions.values())
      .filter(exec => exec.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit)
  }

  // Obtener ejecución específica
  getExecution(executionId: string): AgentExecution | undefined {
    return this.executions.get(executionId)
  }
}

// ===== INSTANCIA SINGLETON =====

export const aiAgentManager = new AIAgentManager()

// ===== HOOKS PARA REACT =====

export function useAIAgents() {
  const getAvailableAgents = () => aiAgentManager.getAvailableAgents()
  const getAgent = (id: string) => aiAgentManager.getAgent(id)
  const getAgentsByCategory = (category: AgentCategory) => aiAgentManager.getAgentsByCategory(category)
  
  return {
    getAvailableAgents,
    getAgent,
    getAgentsByCategory
  }
}

export function useAgentExecution() {
  const executeAgent = async (
    agentId: string, 
    input: string, 
    userId: string, 
    workspaceId: string,
    context?: any
  ) => {
    return await aiAgentManager.executeAgent(agentId, input, userId, workspaceId, context)
  }

  const getUserExecutions = (userId: string, limit?: number) => {
    return aiAgentManager.getUserExecutions(userId, limit)
  }

  const getExecution = (executionId: string) => {
    return aiAgentManager.getExecution(executionId)
  }

  return {
    executeAgent,
    getUserExecutions,
    getExecution
  }
}
