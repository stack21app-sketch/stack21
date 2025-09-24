import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { type, data } = await request.json()

    let classification = {}

    switch (type) {
      case 'workflow_type':
        // Clasificar tipo de workflow basado en nodos
        const nodeTypes = data.map((item: any) => item.type)
        const hasEmail = nodeTypes.includes('email-action')
        const hasAI = nodeTypes.includes('ai-action')
        const hasWebhook = nodeTypes.includes('webhook-trigger')

        let workflowType = 'general'
        if (hasEmail && hasAI) workflowType = 'marketing_automation'
        else if (hasWebhook && hasAI) workflowType = 'data_processing'
        else if (hasEmail) workflowType = 'notification'
        else if (hasAI) workflowType = 'ai_workflow'

        classification = {
          type: workflowType,
          confidence: 0.89,
          features: {
            hasEmail,
            hasAI,
            hasWebhook,
            nodeCount: data.length
          }
        }
        break

      case 'user_intent':
        // Clasificar intención del usuario
        const message = data.message || ''
        const lowerMessage = message.toLowerCase()

        let intent = 'general'
        let confidence = 0.5

        if (lowerMessage.includes('crear') && lowerMessage.includes('workflow')) {
          intent = 'create_workflow'
          confidence = 0.95
        } else if (lowerMessage.includes('analizar') || lowerMessage.includes('datos')) {
          intent = 'analyze_data'
          confidence = 0.88
        } else if (lowerMessage.includes('enviar') && lowerMessage.includes('email')) {
          intent = 'send_email'
          confidence = 0.92
        } else if (lowerMessage.includes('programar') || lowerMessage.includes('schedule')) {
          intent = 'schedule_workflow'
          confidence = 0.87
        }

        classification = {
          intent,
          confidence,
          entities: extractEntities(message)
        }
        break

      case 'error_severity':
        // Clasificar severidad de errores
        const errorMessage = data.message || ''
        const errorCode = data.code || ''

        let severity = 'low'
        if (errorCode.includes('500') || errorMessage.includes('critical')) {
          severity = 'critical'
        } else if (errorCode.includes('400') || errorMessage.includes('error')) {
          severity = 'high'
        } else if (errorCode.includes('300') || errorMessage.includes('warning')) {
          severity = 'medium'
        }

        classification = {
          severity,
          confidence: 0.82,
          suggestedAction: getSuggestedAction(severity)
        }
        break

      default:
        classification = {
          message: 'Tipo de clasificación no soportado',
          confidence: 0
        }
    }

    return NextResponse.json({
      success: true,
      classification,
      type,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error en clasificación ML:', error)
    return NextResponse.json(
      { success: false, error: 'Error en clasificación' },
      { status: 500 }
    )
  }
}

function extractEntities(message: string) {
  const entities = []
  
  // Extraer emails
  const emailMatch = message.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g)
  if (emailMatch) {
    entities.push({ type: 'email', values: emailMatch })
  }

  // Extraer canales de Slack
  const slackMatch = message.match(/#([a-zA-Z0-9_-]+)/g)
  if (slackMatch) {
    entities.push({ type: 'slack_channel', values: slackMatch })
  }

  // Extraer URLs
  const urlMatch = message.match(/(https?:\/\/[^\s]+)/g)
  if (urlMatch) {
    entities.push({ type: 'url', values: urlMatch })
  }

  return entities
}

function getSuggestedAction(severity: string) {
  switch (severity) {
    case 'critical':
      return 'Contactar soporte inmediatamente'
    case 'high':
      return 'Revisar logs y reiniciar servicio'
    case 'medium':
      return 'Monitorear y documentar'
    case 'low':
      return 'Revisar en próxima actualización'
    default:
      return 'Investigar más'
  }
}
