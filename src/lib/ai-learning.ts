// Sistema de IA que aprende de los datos del usuario
// Fine-tuning personalizado y aprendizaje adaptativo

import { prisma } from './prisma'
import { openai } from './openai'

export interface LearningData {
  userId: string
  workflowId: string
  input: any
  output: any
  feedback?: 'positive' | 'negative' | 'neutral'
  context?: string
}

export interface UserProfile {
  userId: string
  preferences: {
    industry: string
    commonTasks: string[]
    preferredModels: string[]
    temperature: number
    responseStyle: 'formal' | 'casual' | 'technical'
  }
  patterns: {
    frequentNodes: string[]
    commonConnections: string[]
    successRate: number
  }
  learningHistory: LearningData[]
}

export class AILearningSystem {
  private static instance: AILearningSystem

  public static getInstance(): AILearningSystem {
    if (!AILearningSystem.instance) {
      AILearningSystem.instance = new AILearningSystem()
    }
    return AILearningSystem.instance
  }

  // Aprender de la ejecución de workflows
  async learnFromWorkflowExecution(data: LearningData): Promise<void> {
    try {
      // Guardar datos de aprendizaje
      await prisma.analytics.create({
        data: {
          userId: data.userId,
          event: 'workflow_learning',
          data: {
            workflowId: data.workflowId,
            input: data.input,
            output: data.output,
            feedback: data.feedback,
            context: data.context,
            timestamp: new Date().toISOString()
          }
        }
      })

      // Actualizar perfil del usuario
      await this.updateUserProfile(data.userId, data)

      console.log(`🧠 IA aprendió de workflow ${data.workflowId} para usuario ${data.userId}`)
    } catch (error) {
      console.error('Error en aprendizaje de IA:', error)
    }
  }

  // Actualizar perfil de usuario basado en patrones
  private async updateUserProfile(userId: string, data: LearningData): Promise<void> {
    try {
      // Obtener historial de aprendizaje
      const learningHistory = await prisma.analytics.findMany({
        where: {
          userId,
          event: 'workflow_learning'
        },
        orderBy: { timestamp: 'desc' },
        take: 100
      })

      // Analizar patrones
      const patterns = this.analyzePatterns(learningHistory)
      
      // Actualizar o crear perfil
      await prisma.userSettings.upsert({
        where: { userId },
        update: {
          preferences: {
            industry: patterns.industry,
            commonTasks: patterns.commonTasks,
            preferredModels: patterns.preferredModels,
            temperature: patterns.temperature,
            responseStyle: patterns.responseStyle
          }
        },
        create: {
          userId,
          preferences: {
            industry: patterns.industry,
            commonTasks: patterns.commonTasks,
            preferredModels: patterns.preferredModels,
            temperature: patterns.temperature,
            responseStyle: patterns.responseStyle
          }
        }
      })

    } catch (error) {
      console.error('Error actualizando perfil de usuario:', error)
    }
  }

  // Analizar patrones de uso
  private analyzePatterns(learningHistory: any[]): any {
    const patterns = {
      industry: 'General',
      commonTasks: [] as string[],
      preferredModels: ['gpt-4'] as string[],
      temperature: 0.7,
      responseStyle: 'technical' as 'formal' | 'casual' | 'technical'
    }

    if (learningHistory.length === 0) return patterns

    // Analizar tareas comunes
    const taskCounts: Record<string, number> = {}
    const modelCounts: Record<string, number> = {}
    const temperatureSum = learningHistory.reduce((sum, entry) => {
      const data = entry.data as any
      if (data.context) {
        taskCounts[data.context] = (taskCounts[data.context] || 0) + 1
      }
      if (data.output?.model) {
        modelCounts[data.output.model] = (modelCounts[data.output.model] || 0) + 1
      }
      return sum + (data.temperature || 0.7)
    }, 0)

    patterns.commonTasks = Object.entries(taskCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([task]) => task)

    patterns.preferredModels = Object.entries(modelCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([model]) => model)

    patterns.temperature = temperatureSum / learningHistory.length

    return patterns
  }

  // Generar sugerencias personalizadas
  async generatePersonalizedSuggestions(userId: string, context: string): Promise<string[]> {
    try {
      const userProfile = await this.getUserProfile(userId)
      
      if (!userProfile) {
        return this.getDefaultSuggestions()
      }

      const prompt = this.buildPersonalizedPrompt(userProfile, context)
      
      if (!openai) {
        return this.getDefaultSuggestions()
      }

      const completion = await openai.chat.completions.create({
        model: userProfile.preferences.preferredModels[0] || 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `Eres un asistente de automatización que conoce los patrones de uso del usuario. 
            Basándote en su historial, genera 3 sugerencias específicas y útiles para el contexto dado.
            Responde en formato JSON con un array de strings.`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: userProfile.preferences.temperature,
        max_tokens: 500
      })

      const suggestions = JSON.parse(completion.choices[0]?.message?.content || '[]')
      return Array.isArray(suggestions) ? suggestions : this.getDefaultSuggestions()

    } catch (error) {
      console.error('Error generando sugerencias personalizadas:', error)
      return this.getDefaultSuggestions()
    }
  }

  // Obtener perfil del usuario
  private async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const userSettings = await prisma.userSettings.findUnique({
        where: { userId }
      })

      if (!userSettings) return null

      const learningHistory = await prisma.analytics.findMany({
        where: {
          userId,
          event: 'workflow_learning'
        },
        orderBy: { timestamp: 'desc' },
        take: 50
      })

      return {
        userId,
        preferences: userSettings.preferences as any,
        patterns: this.analyzePatterns(learningHistory),
        learningHistory: learningHistory.map(entry => ({
          userId: entry.userId,
          workflowId: (entry.data as any).workflowId || '',
          input: (entry.data as any).input || {},
          output: (entry.data as any).output || {},
          feedback: (entry.data as any).feedback,
          context: (entry.data as any).context
        }))
      }
    } catch (error) {
      console.error('Error obteniendo perfil de usuario:', error)
      return null
    }
  }

  // Construir prompt personalizado
  private buildPersonalizedPrompt(profile: UserProfile, context: string): string {
    const { preferences, patterns } = profile
    
    return `Contexto: ${context}

Perfil del usuario:
- Industria: ${preferences.industry}
- Tareas comunes: ${preferences.commonTasks.join(', ')}
- Modelos preferidos: ${preferences.preferredModels.join(', ')}
- Estilo de respuesta: ${preferences.responseStyle}
- Temperatura: ${preferences.temperature}

Patrones identificados:
- Nodos frecuentes: ${patterns.frequentNodes.join(', ')}
- Conexiones comunes: ${patterns.commonConnections.join(', ')}
- Tasa de éxito: ${patterns.successRate}%

Genera 3 sugerencias específicas para este usuario basándote en sus patrones de uso.`
  }

  // Sugerencias por defecto
  private getDefaultSuggestions(): string[] {
    return [
      "Considera agregar un nodo de validación de datos antes del procesamiento",
      "Un nodo de logging puede ayudar con el debugging",
      "Agrega manejo de errores para mejorar la robustez del workflow"
    ]
  }

  // Aprender de feedback del usuario
  async learnFromFeedback(userId: string, workflowId: string, feedback: 'positive' | 'negative' | 'neutral', details?: string): Promise<void> {
    try {
      await this.learnFromWorkflowExecution({
        userId,
        workflowId,
        input: {},
        output: {},
        feedback,
        context: details || 'user_feedback'
      })

      console.log(`📝 IA aprendió de feedback ${feedback} para workflow ${workflowId}`)
    } catch (error) {
      console.error('Error aprendiendo de feedback:', error)
    }
  }

  // Generar workflow personalizado
  async generatePersonalizedWorkflow(userId: string, description: string): Promise<any> {
    try {
      const userProfile = await this.getUserProfile(userId)
      
      if (!userProfile) {
        return this.generateDefaultWorkflow(description)
      }

      const prompt = `Genera un workflow de automatización para: ${description}

Basándote en el perfil del usuario:
- Industria: ${userProfile.preferences.industry}
- Tareas comunes: ${userProfile.preferences.commonTasks.join(', ')}
- Estilo: ${userProfile.preferences.responseStyle}

Responde en formato JSON con la estructura:
{
  "name": "Nombre del workflow",
  "description": "Descripción detallada",
  "nodes": [array de nodos],
  "connections": [array de conexiones]
}`

      if (!openai) {
        return this.generateDefaultWorkflow(description)
      }

      const completion = await openai.chat.completions.create({
        model: userProfile.preferences.preferredModels[0] || 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'Eres un experto en automatización de workflows. Genera workflows personalizados basándote en el perfil del usuario.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: userProfile.preferences.temperature,
        max_tokens: 1000
      })

      const workflow = JSON.parse(completion.choices[0]?.message?.content || '{}')
      return workflow

    } catch (error) {
      console.error('Error generando workflow personalizado:', error)
      return this.generateDefaultWorkflow(description)
    }
  }

  // Generar workflow por defecto
  private generateDefaultWorkflow(description: string): any {
    return {
      name: `Workflow: ${description}`,
      description: `Workflow automatizado para ${description}`,
      nodes: [
        {
          id: "1",
          type: "webhook",
          position: { x: 100, y: 100 },
          config: { url: "https://api.example.com/trigger" }
        },
        {
          id: "2",
          type: "ai",
          position: { x: 300, y: 100 },
          config: {
            model: "gpt-4",
            prompt: `Procesa los datos para: ${description}`,
            temperature: 0.7
          }
        }
      ],
      connections: [
        { from: "1", to: "2" }
      ]
    }
  }
}

export const aiLearning = AILearningSystem.getInstance()
