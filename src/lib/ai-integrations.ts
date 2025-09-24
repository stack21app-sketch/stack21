'use client'

// Integraciones reales con APIs externas
export class APIIntegrations {
  private static instance: APIIntegrations
  private slackToken: string | null = null
  private gmailToken: string | null = null

  static getInstance(): APIIntegrations {
    if (!APIIntegrations.instance) {
      APIIntegrations.instance = new APIIntegrations()
    }
    return APIIntegrations.instance
  }

  // Slack Integration
  async sendSlackMessage(channel: string, message: string, token?: string): Promise<any> {
    const slackToken = token || this.slackToken || process.env.NEXT_PUBLIC_SLACK_TOKEN
    
    if (!slackToken) {
      throw new Error('Slack token no configurado')
    }

    try {
      const response = await fetch('https://slack.com/api/chat.postMessage', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${slackToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          channel: channel,
          text: message,
          username: 'Stack21 Bot',
          icon_emoji: ':robot_face:'
        })
      })

      const data = await response.json()
      
      if (!data.ok) {
        throw new Error(data.error || 'Error enviando mensaje a Slack')
      }

      return {
        success: true,
        messageId: data.ts,
        channel: data.channel,
        timestamp: data.ts
      }
    } catch (error) {
      console.error('Error Slack:', error)
      throw error
    }
  }

  // Gmail Integration
  async sendGmailMessage(to: string, subject: string, body: string, token?: string): Promise<any> {
    const gmailToken = token || this.gmailToken || process.env.NEXT_PUBLIC_GMAIL_TOKEN
    
    if (!gmailToken) {
      throw new Error('Gmail token no configurado')
    }

    try {
      const message = {
        to: to,
        subject: subject,
        body: body,
        from: 'noreply@stack21.com'
      }

      const response = await fetch('/api/gmail/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${gmailToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message)
      })

      const data = await response.json()
      
      if (!data.success) {
        throw new Error(data.error || 'Error enviando email')
      }

      return {
        success: true,
        messageId: data.messageId,
        to: to,
        timestamp: new Date().toISOString()
      }
    } catch (error) {
      console.error('Error Gmail:', error)
      throw error
    }
  }

  // OpenAI Integration para análisis avanzado
  async analyzeWithAI(prompt: string, data: any): Promise<any> {
    try {
      const response = await fetch('/api/openai/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt,
          data: data,
          model: 'gpt-4'
        })
      })

      const result = await response.json()
      return result
    } catch (error) {
      console.error('Error OpenAI:', error)
      throw error
    }
  }

  // Machine Learning - Predicciones
  async predictWorkflowPerformance(workflowData: any): Promise<any> {
    try {
      const response = await fetch('/api/ml/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'workflow_performance',
          data: workflowData
        })
      })

      const result = await response.json()
      return result
    } catch (error) {
      console.error('Error ML:', error)
      throw error
    }
  }

  // Machine Learning - Clasificación
  async classifyData(data: any[], type: string): Promise<any> {
    try {
      const response = await fetch('/api/ml/classify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: type,
          data: data
        })
      })

      const result = await response.json()
      return result
    } catch (error) {
      console.error('Error ML Classification:', error)
      throw error
    }
  }

  // Machine Learning - Análisis de sentimientos
  async analyzeSentiment(text: string): Promise<any> {
    try {
      const response = await fetch('/api/ml/sentiment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text
        })
      })

      const result = await response.json()
      return result
    } catch (error) {
      console.error('Error Sentiment Analysis:', error)
      throw error
    }
  }

  // Configurar tokens
  setSlackToken(token: string) {
    this.slackToken = token
  }

  setGmailToken(token: string) {
    this.gmailToken = token
  }
}

export const apiIntegrations = APIIntegrations.getInstance()
