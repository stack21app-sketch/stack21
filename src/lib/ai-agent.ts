'use client'

import { OpenAI } from 'openai'
import { apiIntegrations } from './ai-integrations'

// Tipos para el agente de IA
export interface AIAction {
  type: 'create_workflow' | 'add_node' | 'execute_workflow' | 'configure_node' | 'get_analytics' | 'send_email' | 'create_integration' | 'help' | 'analyze_data' | 'generate_report' | 'slack_message' | 'gmail_send' | 'schedule_workflow' | 'optimize_workflow' | 'backup_data' | 'monitor_system' | 'predict_performance' | 'classify_data' | 'analyze_sentiment' | 'recommend_workflow' | 'detect_anomalies' | 'forecast_usage'
  parameters: Record<string, any>
  description: string
}

export interface AIResponse {
  message: string
  action?: AIAction
  success: boolean
  data?: any
}

export interface AIConversation {
  id: string
  messages: Array<{
    role: 'user' | 'assistant' | 'system'
    content: string
    timestamp: Date
    action?: AIAction
  }>
}

class AIAgent {
  private openai: OpenAI
  private conversation: AIConversation

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
      dangerouslyAllowBrowser: true
    })
    this.conversation = {
      id: `conv_${Date.now()}`,
      messages: []
    }
  }

  // Procesar mensaje del usuario y determinar acción
  async processMessage(userMessage: string): Promise<AIResponse> {
    try {
      // Añadir mensaje del usuario
      this.conversation.messages.push({
        role: 'user',
        content: userMessage,
        timestamp: new Date()
      })

      // Determinar la intención y acción
      const action = await this.determineAction(userMessage)
      
      // Ejecutar la acción si existe
      let result = null
      if (action) {
        result = await this.executeAction(action)
      }

      // Generar respuesta del agente
      const response = await this.generateResponse(userMessage, action, result)
      
      // Añadir respuesta del agente
      this.conversation.messages.push({
        role: 'assistant',
        content: response.message,
        timestamp: new Date(),
        action: action || undefined
      })

      return response
    } catch (error) {
      console.error('Error processing message:', error)
      return {
        message: 'Lo siento, hubo un error procesando tu solicitud. ¿Podrías intentarlo de nuevo?',
        success: false
      }
    }
  }

  // Determinar qué acción debe ejecutar el agente
  private async determineAction(message: string): Promise<AIAction | null> {
    const lowerMessage = message.toLowerCase()

    // Crear workflow
    if (lowerMessage.includes('crear') && lowerMessage.includes('workflow')) {
      return {
        type: 'create_workflow',
        parameters: {
          name: this.extractWorkflowName(message),
          description: this.extractDescription(message)
        },
        description: 'Crear un nuevo workflow'
      }
    }

    // Añadir nodo
    if (lowerMessage.includes('añadir') || lowerMessage.includes('agregar')) {
      if (lowerMessage.includes('nodo')) {
        return {
          type: 'add_node',
          parameters: {
            nodeType: this.extractNodeType(message),
            position: { x: Math.random() * 400 + 100, y: Math.random() * 300 + 100 }
          },
          description: 'Añadir nodo al workflow'
        }
      }
    }

    // Ejecutar workflow
    if (lowerMessage.includes('ejecutar') || lowerMessage.includes('correr') || lowerMessage.includes('run')) {
      return {
        type: 'execute_workflow',
        parameters: {
          workflowId: this.extractWorkflowId(message)
        },
        description: 'Ejecutar workflow'
      }
    }

    // Enviar email
    if (lowerMessage.includes('enviar') && lowerMessage.includes('email')) {
      return {
        type: 'send_email',
        parameters: {
          to: this.extractEmail(message),
          subject: this.extractSubject(message),
          body: this.extractBody(message)
        },
        description: 'Enviar email'
      }
    }

    // Análisis de datos
    if (lowerMessage.includes('analizar') && lowerMessage.includes('datos')) {
      return {
        type: 'analyze_data',
        parameters: {
          dataSource: this.extractDataSource(message),
          analysisType: this.extractAnalysisType(message)
        },
        description: 'Analizar datos del workspace'
      }
    }

    // Generar reporte
    if (lowerMessage.includes('generar') && lowerMessage.includes('reporte')) {
      return {
        type: 'generate_report',
        parameters: {
          reportType: this.extractReportType(message),
          period: this.extractPeriod(message),
          format: this.extractFormat(message)
        },
        description: 'Generar reporte personalizado'
      }
    }

    // Mensaje de Slack
    if (lowerMessage.includes('slack') || lowerMessage.includes('canal')) {
      return {
        type: 'slack_message',
        parameters: {
          channel: this.extractSlackChannel(message),
          message: this.extractSlackMessage(message)
        },
        description: 'Enviar mensaje a Slack'
      }
    }

    // Gmail
    if (lowerMessage.includes('gmail') || lowerMessage.includes('correo')) {
      return {
        type: 'gmail_send',
        parameters: {
          to: this.extractEmail(message),
          subject: this.extractSubject(message),
          body: this.extractBody(message),
          attachments: this.extractAttachments(message)
        },
        description: 'Enviar email via Gmail'
      }
    }

    // Programar workflow
    if (lowerMessage.includes('programar') || lowerMessage.includes('schedule')) {
      return {
        type: 'schedule_workflow',
        parameters: {
          workflowId: this.extractWorkflowId(message),
          schedule: this.extractSchedule(message),
          timezone: this.extractTimezone(message)
        },
        description: 'Programar ejecución de workflow'
      }
    }

    // Optimizar workflow
    if (lowerMessage.includes('optimizar') || lowerMessage.includes('mejorar')) {
      return {
        type: 'optimize_workflow',
        parameters: {
          workflowId: this.extractWorkflowId(message),
          optimizationType: this.extractOptimizationType(message)
        },
        description: 'Optimizar workflow existente'
      }
    }

    // Backup de datos
    if (lowerMessage.includes('backup') || lowerMessage.includes('respaldo')) {
      return {
        type: 'backup_data',
        parameters: {
          dataType: this.extractDataType(message),
          destination: this.extractDestination(message)
        },
        description: 'Crear backup de datos'
      }
    }

    // Machine Learning - Predicciones
    if (lowerMessage.includes('predecir') || lowerMessage.includes('predicción')) {
      return {
        type: 'predict_performance',
        parameters: {
          dataType: this.extractDataSource(message),
          predictionType: this.extractPredictionType(message)
        },
        description: 'Predecir rendimiento usando ML'
      }
    }

    // Machine Learning - Clasificación
    if (lowerMessage.includes('clasificar') || lowerMessage.includes('categorizar')) {
      return {
        type: 'classify_data',
        parameters: {
          data: this.extractData(message),
          classificationType: this.extractClassificationType(message)
        },
        description: 'Clasificar datos usando ML'
      }
    }

    // Machine Learning - Análisis de sentimientos
    if (lowerMessage.includes('sentimiento') || lowerMessage.includes('sentiment')) {
      return {
        type: 'analyze_sentiment',
        parameters: {
          text: this.extractText(message)
        },
        description: 'Analizar sentimientos del texto'
      }
    }

    // Machine Learning - Recomendaciones
    if (lowerMessage.includes('recomendar') || lowerMessage.includes('sugerir')) {
      return {
        type: 'recommend_workflow',
        parameters: {
          userBehavior: this.extractUserBehavior(message),
          context: this.extractContext(message)
        },
        description: 'Recomendar workflow usando ML'
      }
    }

    // Machine Learning - Detección de anomalías
    if (lowerMessage.includes('anomalía') || lowerMessage.includes('anomaly') || lowerMessage.includes('detectar')) {
      return {
        type: 'detect_anomalies',
        parameters: {
          data: this.extractData(message),
          threshold: this.extractThreshold(message)
        },
        description: 'Detectar anomalías en los datos'
      }
    }

    // Machine Learning - Pronóstico de uso
    if (lowerMessage.includes('pronosticar') || lowerMessage.includes('forecast') || lowerMessage.includes('proyección')) {
      return {
        type: 'forecast_usage',
        parameters: {
          period: this.extractPeriod(message),
          metrics: this.extractMetrics(message)
        },
        description: 'Pronosticar uso futuro'
      }
    }

    // Monitoreo del sistema
    if (lowerMessage.includes('monitorear') || lowerMessage.includes('estado') || lowerMessage.includes('health')) {
      return {
        type: 'monitor_system',
        parameters: {
          metrics: this.extractMetrics(message),
          alertThreshold: this.extractAlertThreshold(message)
        },
        description: 'Monitorear estado del sistema'
      }
    }

    // Obtener analytics
    if (lowerMessage.includes('analytics') || lowerMessage.includes('estadísticas') || lowerMessage.includes('métricas')) {
      return {
        type: 'get_analytics',
        parameters: {},
        description: 'Obtener analytics del workspace'
      }
    }

    // Ayuda
    if (lowerMessage.includes('ayuda') || lowerMessage.includes('help') || lowerMessage.includes('qué puedes hacer')) {
      return {
        type: 'help',
        parameters: {},
        description: 'Mostrar comandos disponibles'
      }
    }

    return null
  }

  // Ejecutar la acción determinada
  private async executeAction(action: AIAction): Promise<any> {
    switch (action.type) {
      case 'create_workflow':
        return await this.createWorkflow(action.parameters)
      
      case 'add_node':
        return await this.addNode(action.parameters)
      
      case 'execute_workflow':
        return await this.executeWorkflow(action.parameters)
      
      case 'send_email':
        return await this.sendEmail(action.parameters)
      
      case 'get_analytics':
        return await this.getAnalytics(action.parameters)
      
      case 'analyze_data':
        return await this.analyzeData(action.parameters)
      
      case 'generate_report':
        return await this.generateReport(action.parameters)
      
      case 'slack_message':
        return await this.sendSlackMessage(action.parameters)
      
      case 'gmail_send':
        return await this.sendGmailMessage(action.parameters)
      
      case 'schedule_workflow':
        return await this.scheduleWorkflow(action.parameters)
      
      case 'optimize_workflow':
        return await this.optimizeWorkflow(action.parameters)
      
      case 'backup_data':
        return await this.backupData(action.parameters)
      
      case 'monitor_system':
        return await this.monitorSystem(action.parameters)
      
      case 'predict_performance':
        return await this.predictPerformance(action.parameters)
      
      case 'classify_data':
        return await this.classifyData(action.parameters)
      
      case 'analyze_sentiment':
        return await this.analyzeSentiment(action.parameters)
      
      case 'recommend_workflow':
        return await this.recommendWorkflow(action.parameters)
      
      case 'detect_anomalies':
        return await this.detectAnomalies(action.parameters)
      
      case 'forecast_usage':
        return await this.forecastUsage(action.parameters)
      
      case 'help':
        return this.getHelpCommands()
      
      default:
        return null
    }
  }

  // Generar respuesta del agente usando OpenAI
  private async generateResponse(userMessage: string, action: AIAction | null, result: any): Promise<AIResponse> {
    const systemPrompt = `Eres un asistente de IA para Stack21, una plataforma de automatización. 
    Puedes crear workflows, añadir nodos, ejecutar tareas y más. 
    Responde en español de manera amigable y profesional.
    Si ejecutaste una acción, confirma que se completó exitosamente.`

    const messages = [
      { role: 'system', content: systemPrompt },
      ...this.conversation.messages.slice(-5), // Últimos 5 mensajes para contexto
      { role: 'user', content: userMessage }
    ]

    try {
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: messages as any,
        max_tokens: 500,
        temperature: 0.7
      })

      const response = completion.choices[0]?.message?.content || 'No pude generar una respuesta.'

      return {
        message: response,
        action: action || undefined,
        success: true,
        data: result
      }
    } catch (error) {
      console.error('Error generating response:', error)
      return {
        message: 'Lo siento, no pude procesar tu solicitud en este momento.',
        success: false
      }
    }
  }

  // Métodos para ejecutar acciones específicas
  private async createWorkflow(params: any) {
    // Simular creación de workflow
    return {
      id: `workflow_${Date.now()}`,
      name: params.name || 'Nuevo Workflow',
      description: params.description || 'Creado por IA',
      status: 'created'
    }
  }

  private async addNode(params: any) {
    // Simular añadir nodo
    return {
      id: `node_${Date.now()}`,
      type: params.nodeType || 'webhook-trigger',
      position: params.position,
      status: 'added'
    }
  }

  private async executeWorkflow(params: any) {
    // Simular ejecución
    return {
      workflowId: params.workflowId,
      status: 'running',
      startTime: new Date()
    }
  }

  private async sendEmail(params: any) {
    // Simular envío de email
    return {
      to: params.to,
      subject: params.subject,
      status: 'sent',
      messageId: `msg_${Date.now()}`
    }
  }

  private async getAnalytics(params: any) {
    // Simular analytics
    return {
      workflows: 12,
      executions: 145,
      successRate: 98.5,
      avgExecutionTime: '2.3s'
    }
  }

  // Nuevos métodos de ejecución
  private async analyzeData(params: any) {
    return {
      dataSource: params.dataSource || 'workflows',
      analysisType: params.analysisType || 'performance',
      insights: [
        'Workflows más ejecutados: Email Marketing (45%), Lead Nurturing (32%)',
        'Tiempo promedio de ejecución: 2.3 segundos',
        'Tasa de éxito: 98.5%',
        'Recomendación: Optimizar workflow de backup (reduce 0.5s)'
      ],
      charts: ['performance_trend', 'success_rate', 'execution_time'],
      status: 'completed'
    }
  }

  private async generateReport(params: any) {
    return {
      reportType: params.reportType || 'monthly',
      period: params.period || 'last_30_days',
      format: params.format || 'pdf',
      data: {
        totalWorkflows: 12,
        totalExecutions: 145,
        successRate: 98.5,
        avgExecutionTime: '2.3s',
        topWorkflows: ['Email Marketing', 'Lead Nurturing', 'Data Backup']
      },
      fileUrl: `/reports/report_${Date.now()}.${params.format || 'pdf'}`,
      status: 'generated'
    }
  }

  private async sendSlackMessage(params: any) {
    try {
      const result = await apiIntegrations.sendSlackMessage(
        params.channel || '#general',
        params.message || 'Mensaje desde Stack21'
      )
      return result
    } catch (error) {
      console.error('Error enviando a Slack:', error)
      return {
        channel: params.channel || '#general',
        message: params.message || 'Mensaje desde Stack21',
        status: 'error',
        error: error instanceof Error ? error.message : 'Error desconocido'
      }
    }
  }

  private async sendGmailMessage(params: any) {
    try {
      const result = await apiIntegrations.sendGmailMessage(
        params.to || 'usuario@ejemplo.com',
        params.subject || 'Mensaje desde Stack21',
        params.body || 'Mensaje generado por IA'
      )
      return result
    } catch (error) {
      console.error('Error enviando Gmail:', error)
      return {
        to: params.to || 'usuario@ejemplo.com',
        subject: params.subject || 'Mensaje desde Stack21',
        body: params.body || 'Mensaje generado por IA',
        status: 'error',
        error: error instanceof Error ? error.message : 'Error desconocido'
      }
    }
  }

  private async scheduleWorkflow(params: any) {
    return {
      workflowId: params.workflowId || 'default',
      schedule: params.schedule || 'daily',
      timezone: params.timezone || 'UTC',
      nextRun: new Date(Date.now() + 24 * 60 * 60 * 1000),
      status: 'scheduled'
    }
  }

  private async optimizeWorkflow(params: any) {
    return {
      workflowId: params.workflowId || 'default',
      optimizationType: params.optimizationType || 'performance',
      improvements: [
        'Reducir nodos redundantes (ahorro: 0.3s)',
        'Paralelizar tareas independientes (ahorro: 0.8s)',
        'Optimizar queries de base de datos (ahorro: 0.2s)'
      ],
      estimatedSavings: '1.3 segundos',
      status: 'optimized'
    }
  }

  private async backupData(params: any) {
    return {
      dataType: params.dataType || 'all',
      destination: params.destination || 's3://stack21-backups',
      size: '2.3 GB',
      files: 1247,
      status: 'completed',
      backupId: `backup_${Date.now()}`
    }
  }

  private async monitorSystem(params: any) {
    return {
      metrics: params.metrics || ['cpu', 'memory', 'disk', 'network'],
      status: 'healthy',
      alerts: [],
      uptime: '99.9%',
      lastCheck: new Date(),
      recommendations: [
        'Sistema funcionando óptimamente',
        'Considerar escalar en 2 semanas si el crecimiento continúa'
      ]
    }
  }

  // Métodos de Machine Learning
  private async predictPerformance(params: any) {
    try {
      const result = await apiIntegrations.predictWorkflowPerformance({
        dataType: params.dataType || 'workflows',
        predictionType: params.predictionType || 'performance'
      })
      return result
    } catch (error) {
      console.error('Error en predicción:', error)
      return {
        error: 'Error en predicción de rendimiento',
        confidence: 0
      }
    }
  }

  private async classifyData(params: any) {
    try {
      const result = await apiIntegrations.classifyData(
        params.data || [],
        params.classificationType || 'workflow_type'
      )
      return result
    } catch (error) {
      console.error('Error en clasificación:', error)
      return {
        error: 'Error clasificando datos',
        confidence: 0
      }
    }
  }

  private async analyzeSentiment(params: any) {
    try {
      const result = await apiIntegrations.analyzeSentiment(
        params.text || ''
      )
      return result
    } catch (error) {
      console.error('Error en análisis de sentimientos:', error)
      return {
        error: 'Error analizando sentimientos',
        confidence: 0
      }
    }
  }

  private async recommendWorkflow(params: any) {
    // Simular recomendaciones basadas en comportamiento
    const recommendations = [
      {
        type: 'email_marketing',
        confidence: 0.85,
        reason: 'Basado en tu historial de workflows de email',
        suggestedNodes: ['email-trigger', 'ai-action', 'email-action']
      },
      {
        type: 'data_processing',
        confidence: 0.72,
        reason: 'Patrón detectado en tus automatizaciones',
        suggestedNodes: ['webhook-trigger', 'ai-analyze', 'database-action']
      }
    ]

    return {
      recommendations,
      userBehavior: params.userBehavior || 'general',
      context: params.context || 'workflow_creation',
      timestamp: new Date()
    }
  }

  private async detectAnomalies(params: any) {
    // Simular detección de anomalías
    const anomalies = [
      {
        type: 'unusual_execution_time',
        severity: 'medium',
        description: 'Tiempo de ejecución 3x mayor al promedio',
        timestamp: new Date(),
        confidence: 0.78
      }
    ]

    return {
      anomalies: params.threshold > 0.5 ? anomalies : [],
      threshold: params.threshold || 0.5,
      totalChecked: 100,
      anomaliesFound: anomalies.length
    }
  }

  private async forecastUsage(params: any) {
    // Simular pronóstico de uso
    const forecast = {
      period: params.period || 'next_30_days',
      predictedExecutions: 250,
      predictedWorkflows: 8,
      confidence: 0.82,
      trends: {
        executions: '+15%',
        workflows: '+8%',
        users: '+12%'
      },
      recommendations: [
        'Considerar escalar infraestructura en 2 semanas',
        'Optimizar workflows más utilizados'
      ]
    }

    return forecast
  }

  private getHelpCommands() {
    return {
      commands: [
        'Crear workflow "Mi automatización"',
        'Añadir nodo de email',
        'Ejecutar workflow',
        'Enviar email a usuario@ejemplo.com',
        'Analizar datos del workspace',
        'Generar reporte mensual en PDF',
        'Enviar mensaje a Slack #general',
        'Programar workflow para ejecutar diariamente',
        'Optimizar workflow existente',
        'Crear backup de todos los datos',
        'Monitorear estado del sistema',
        'Predecir rendimiento del workflow',
        'Clasificar datos de workflows',
        'Analizar sentimientos del texto',
        'Recomendar workflow personalizado',
        'Detectar anomalías en los datos',
        'Pronosticar uso futuro',
        'Mostrar analytics',
        '¿Qué puedes hacer?'
      ]
    }
  }

  // Métodos de extracción de parámetros
  private extractWorkflowName(message: string): string {
    const match = message.match(/workflow\s+"([^"]+)"/i) || message.match(/workflow\s+([a-zA-Z0-9\s]+)/i)
    return match ? match[1].trim() : 'Workflow creado por IA'
  }

  private extractDescription(message: string): string {
    const match = message.match(/descripción\s+"([^"]+)"/i) || message.match(/descripción\s+([a-zA-Z0-9\s]+)/i)
    return match ? match[1].trim() : 'Descripción generada por IA'
  }

  private extractNodeType(message: string): string {
    if (message.includes('email')) return 'email-action'
    if (message.includes('webhook')) return 'webhook-trigger'
    if (message.includes('ia') || message.includes('ai')) return 'ai-action'
    if (message.includes('schedule')) return 'schedule-trigger'
    return 'webhook-trigger'
  }

  private extractWorkflowId(message: string): string {
    const match = message.match(/workflow\s+([a-zA-Z0-9_-]+)/i)
    return match ? match[1] : 'default'
  }

  private extractEmail(message: string): string {
    const match = message.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i)
    return match ? match[1] : 'usuario@ejemplo.com'
  }

  private extractSubject(message: string): string {
    const match = message.match(/asunto\s+"([^"]+)"/i) || message.match(/subject\s+"([^"]+)"/i)
    return match ? match[1] : 'Mensaje desde Stack21'
  }

  private extractBody(message: string): string {
    const match = message.match(/mensaje\s+"([^"]+)"/i) || message.match(/body\s+"([^"]+)"/i)
    return match ? match[1] : 'Mensaje generado por IA'
  }

  // Nuevos métodos de extracción
  private extractDataSource(message: string): string {
    if (message.includes('workflows')) return 'workflows'
    if (message.includes('usuarios')) return 'users'
    if (message.includes('ejecuciones')) return 'executions'
    return 'workflows'
  }

  private extractAnalysisType(message: string): string {
    if (message.includes('rendimiento') || message.includes('performance')) return 'performance'
    if (message.includes('uso') || message.includes('usage')) return 'usage'
    if (message.includes('errores') || message.includes('errors')) return 'errors'
    return 'performance'
  }

  private extractReportType(message: string): string {
    if (message.includes('mensual')) return 'monthly'
    if (message.includes('semanal')) return 'weekly'
    if (message.includes('diario')) return 'daily'
    return 'monthly'
  }

  private extractPeriod(message: string): string {
    if (message.includes('últimos 7 días')) return 'last_7_days'
    if (message.includes('últimos 30 días')) return 'last_30_days'
    if (message.includes('último año')) return 'last_year'
    return 'last_30_days'
  }

  private extractFormat(message: string): string {
    if (message.includes('pdf')) return 'pdf'
    if (message.includes('excel') || message.includes('xlsx')) return 'xlsx'
    if (message.includes('csv')) return 'csv'
    return 'pdf'
  }

  private extractSlackChannel(message: string): string {
    const match = message.match(/#([a-zA-Z0-9_-]+)/i)
    return match ? `#${match[1]}` : '#general'
  }

  private extractSlackMessage(message: string): string {
    const match = message.match(/mensaje\s+"([^"]+)"/i) || message.match(/decir\s+"([^"]+)"/i)
    return match ? match[1] : 'Mensaje desde Stack21'
  }

  private extractAttachments(message: string): string[] {
    const matches = message.match(/adjuntar\s+([a-zA-Z0-9._-]+)/gi)
    return matches ? matches.map(m => m.replace(/adjuntar\s+/i, '')) : []
  }

  private extractSchedule(message: string): string {
    if (message.includes('diariamente') || message.includes('daily')) return 'daily'
    if (message.includes('semanalmente') || message.includes('weekly')) return 'weekly'
    if (message.includes('mensualmente') || message.includes('monthly')) return 'monthly'
    if (message.includes('cada hora') || message.includes('hourly')) return 'hourly'
    return 'daily'
  }

  private extractTimezone(message: string): string {
    const match = message.match(/zona\s+([a-zA-Z/_-]+)/i) || message.match(/timezone\s+([a-zA-Z/_-]+)/i)
    return match ? match[1] : 'UTC'
  }

  private extractOptimizationType(message: string): string {
    if (message.includes('rendimiento') || message.includes('performance')) return 'performance'
    if (message.includes('costo') || message.includes('cost')) return 'cost'
    if (message.includes('velocidad') || message.includes('speed')) return 'speed'
    return 'performance'
  }

  private extractDataType(message: string): string {
    if (message.includes('workflows')) return 'workflows'
    if (message.includes('usuarios')) return 'users'
    if (message.includes('configuración')) return 'config'
    return 'all'
  }

  private extractDestination(message: string): string {
    const match = message.match(/destino\s+([a-zA-Z0-9:/._-]+)/i) || message.match(/to\s+([a-zA-Z0-9:/._-]+)/i)
    return match ? match[1] : 's3://stack21-backups'
  }

  private extractMetrics(message: string): string[] {
    const metrics = []
    if (message.includes('cpu')) metrics.push('cpu')
    if (message.includes('memoria') || message.includes('memory')) metrics.push('memory')
    if (message.includes('disco') || message.includes('disk')) metrics.push('disk')
    if (message.includes('red') || message.includes('network')) metrics.push('network')
    return metrics.length > 0 ? metrics : ['cpu', 'memory', 'disk', 'network']
  }

  private extractAlertThreshold(message: string): number {
    const match = message.match(/(\d+)%/i)
    return match ? parseInt(match[1]) : 80
  }

  // Nuevos métodos de extracción para ML
  private extractPredictionType(message: string): string {
    if (message.includes('rendimiento') || message.includes('performance')) return 'performance'
    if (message.includes('comportamiento') || message.includes('behavior')) return 'behavior'
    if (message.includes('carga') || message.includes('load')) return 'load'
    return 'performance'
  }

  private extractData(message: string): any[] {
    // Extraer datos del mensaje (simplificado)
    return []
  }

  private extractClassificationType(message: string): string {
    if (message.includes('workflow')) return 'workflow_type'
    if (message.includes('intención') || message.includes('intent')) return 'user_intent'
    if (message.includes('error')) return 'error_severity'
    return 'workflow_type'
  }

  private extractText(message: string): string {
    // Extraer texto para análisis de sentimientos
    return message
  }

  private extractUserBehavior(message: string): string {
    if (message.includes('email')) return 'email_focused'
    if (message.includes('datos')) return 'data_focused'
    if (message.includes('automatización')) return 'automation_focused'
    return 'general'
  }

  private extractContext(message: string): string {
    if (message.includes('crear')) return 'workflow_creation'
    if (message.includes('optimizar')) return 'workflow_optimization'
    if (message.includes('analizar')) return 'data_analysis'
    return 'general'
  }

  private extractThreshold(message: string): number {
    const match = message.match(/(\d+\.?\d*)/i)
    return match ? parseFloat(match[1]) : 0.5
  }

  // Obtener historial de conversación
  getConversation(): AIConversation {
    return this.conversation
  }

  // Limpiar conversación
  clearConversation() {
    this.conversation = {
      id: `conv_${Date.now()}`,
      messages: []
    }
  }
}

export const aiAgent = new AIAgent()
