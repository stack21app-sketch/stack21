'use client'

import { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Send, 
  Bot, 
  User, 
  Loader2, 
  Copy, 
  ThumbsUp, 
  ThumbsDown, 
  RefreshCw,
  Download,
  Share2,
  MoreVertical,
  Brain,
  Zap,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react'

interface Message {
  id: string
  type: 'user' | 'assistant'
  content: string
  timestamp: Date
  isTyping?: boolean
  status?: 'sending' | 'sent' | 'error'
  metadata?: {
    agent?: string
    confidence?: number
    processingTime?: number
    suggestions?: string[]
  }
}

interface AIChatInterfaceProps {
  selectedAgent?: {
    id: string
    name: string
    description: string
    icon: React.ComponentType<any>
    color: string
  } | null
  onAgentChange?: () => void
}

export default function AIChatInterface({ selectedAgent, onAgentChange }: AIChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Mensaje de bienvenida
  useEffect(() => {
    if (selectedAgent && messages.length === 0) {
      const welcomeMessage: Message = {
        id: 'welcome',
        type: 'assistant',
        content: `¡Hola! Soy tu ${selectedAgent.name}. ${selectedAgent.description}\n\n¿En qué puedo ayudarte hoy?`,
        timestamp: new Date(),
        metadata: {
          agent: selectedAgent.name,
          confidence: 1.0,
          suggestions: [
            'Explícame cómo optimizar mi workflow',
            'Analiza los datos de mi última campaña',
            'Crea una estrategia de marketing',
            'Ayúdame con el código de mi aplicación'
          ]
        }
      }
      setMessages([welcomeMessage])
    }
  }, [selectedAgent])

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date(),
      status: 'sending'
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)
    setIsTyping(true)

    // Simular respuesta del agente
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: generateResponse(inputValue, selectedAgent?.name || 'Asistente'),
        timestamp: new Date(),
        metadata: {
          agent: selectedAgent?.name || 'Asistente',
          confidence: 0.85 + Math.random() * 0.15,
          processingTime: 1500 + Math.random() * 2000,
          suggestions: generateSuggestions(inputValue)
        }
      }

      setMessages(prev => [
        ...prev.slice(0, -1),
        { ...userMessage, status: 'sent' },
        assistantMessage
      ])
      setIsLoading(false)
      setIsTyping(false)
    }, 2000 + Math.random() * 3000)
  }

  const generateResponse = (input: string, agentName: string): string => {
    const responses = {
      'Optimizador de Workflows': [
        `He analizado tu solicitud sobre "${input}". Para optimizar tu workflow, te recomiendo:\n\n1. **Identificar cuellos de botella**: Revisa los pasos que toman más tiempo\n2. **Automatizar tareas repetitivas**: Implementa triggers automáticos\n3. **Paralelizar procesos**: Ejecuta tareas independientes simultáneamente\n\n¿Te gustaría que profundice en alguno de estos puntos?`,
        `Basándome en tu consulta "${input}", puedo sugerir varias mejoras:\n\n• **Reducir latencia**: Optimizar conexiones de API\n• **Implementar caché**: Almacenar resultados frecuentes\n• **Monitoreo en tiempo real**: Detectar problemas inmediatamente\n\n¿Quieres que analice algún workflow específico?`
      ],
      'Analista de Datos': [
        `He procesado tu solicitud "${input}". Los datos muestran patrones interesantes:\n\n📊 **Tendencias identificadas**: Crecimiento del 23% en Q4\n📈 **Métricas clave**: Conversión mejoró un 15%\n🎯 **Recomendaciones**: Enfocar en segmento premium\n\n¿Necesitas un análisis más detallado?`,
        `Análisis completado para "${input}":\n\n• **KPIs principales**: Todos en verde ✅\n• **Anomalías detectadas**: 3 puntos de atención\n• **Predicciones**: Crecimiento sostenido esperado\n\n¿Quieres que genere un reporte visual?`
      ],
      'Experto en Marketing': [
        `Estrategia de marketing para "${input}":\n\n🎯 **Audiencia objetivo**: Millennials profesionales\n📱 **Canales recomendados**: Instagram, LinkedIn, Email\n💰 **Presupuesto sugerido**: $5,000/mes\n📊 **ROI esperado**: 300% en 6 meses\n\n¿Implementamos esta estrategia?`,
        `Campaña optimizada para "${input}":\n\n• **Hook principal**: "Transforma tu negocio en 30 días"\n• **CTA**: "Comenzar ahora" con urgencia\n• **Segmentación**: Por industria y tamaño\n• **Timing**: Lunes 9 AM, miércoles 2 PM\n\n¿Quieres ver los creativos?`
      ],
      'Asistente de Código': [
        `Revisión de código para "${input}":\n\n\`\`\`javascript\n// Optimización sugerida\nconst optimizedFunction = async (data) => {\n  try {\n    const result = await processData(data);\n    return { success: true, data: result };\n  } catch (error) {\n    console.error('Error:', error);\n    return { success: false, error: error.message };\n  }\n};\n\`\`\`\n\n**Mejoras**: Manejo de errores, async/await, tipado\n\n¿Necesitas tests unitarios?`,
        `Solución para "${input}":\n\n• **Problema identificado**: Memory leak en el componente\n• **Solución**: Cleanup en useEffect\n• **Performance**: 40% más rápido\n• **Best practices**: Hooks personalizados\n\n¿Implemento la corrección?`
      ]
    }

    const agentResponses = responses[agentName as keyof typeof responses] || responses['Asistente de Código']
    return agentResponses[Math.floor(Math.random() * agentResponses.length)]
  }

  const generateSuggestions = (input: string): string[] => {
    const suggestions = [
      '¿Puedes explicar esto más detalladamente?',
      '¿Tienes algún ejemplo práctico?',
      '¿Cómo puedo implementar esto?',
      '¿Qué otras opciones hay?',
      '¿Puedes crear un plan paso a paso?'
    ]
    return suggestions.slice(0, 3)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const formatTime = (timestamp: Date) => {
    return timestamp.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'sending': return <Loader2 className="h-3 w-3 animate-spin text-blue-500" />
      case 'sent': return <CheckCircle className="h-3 w-3 text-green-500" />
      case 'error': return <AlertCircle className="h-3 w-3 text-red-500" />
      default: return null
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <CardHeader className="border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {selectedAgent ? (
              <>
                <div className={`p-2 rounded-lg ${selectedAgent.color === 'blue' ? 'bg-blue-500' : 'bg-purple-500'} text-white`}>
                  <selectedAgent.icon className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-lg">{selectedAgent.name}</CardTitle>
                  <p className="text-sm text-gray-600">{selectedAgent.description}</p>
                </div>
              </>
            ) : (
              <>
                <div className="p-2 rounded-lg bg-gray-500 text-white">
                  <Brain className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-lg">Asistente IA</CardTitle>
                  <p className="text-sm text-gray-600">Selecciona un agente especializado</p>
                </div>
              </>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            {selectedAgent && (
              <Button
                variant="outline"
                size="sm"
                onClick={onAgentChange}
                className="text-blue-600 hover:text-blue-700"
              >
                Cambiar agente
              </Button>
            )}
            <Button variant="ghost" size="sm">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      {/* Messages */}
      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex space-x-2 max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
              {/* Avatar */}
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                message.type === 'user' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {message.type === 'user' ? (
                  <User className="h-4 w-4" />
                ) : (
                  <Bot className="h-4 w-4" />
                )}
              </div>

              {/* Message content */}
              <div className={`rounded-lg p-3 ${
                message.type === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}>
                <div className="whitespace-pre-wrap">{message.content}</div>
                
                {/* Message metadata */}
                <div className={`flex items-center justify-between mt-2 text-xs ${
                  message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  <div className="flex items-center space-x-2">
                    <span>{formatTime(message.timestamp)}</span>
                    {message.status && getStatusIcon(message.status)}
                    {message.metadata?.processingTime && (
                      <span className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {(message.metadata.processingTime / 1000).toFixed(1)}s
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(message.content)}
                      className="h-6 w-6 p-0 hover:bg-white/20"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                    {message.type === 'assistant' && (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 hover:bg-white/20"
                        >
                          <ThumbsUp className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 hover:bg-white/20"
                        >
                          <ThumbsDown className="h-3 w-3" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>

                {/* Suggestions */}
                {message.metadata?.suggestions && message.type === 'assistant' && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <p className="text-xs font-medium mb-2">Sugerencias:</p>
                    <div className="flex flex-wrap gap-1">
                      {message.metadata.suggestions.map((suggestion, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          onClick={() => setInputValue(suggestion)}
                          className="text-xs h-6"
                        >
                          {suggestion}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="flex space-x-2">
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                <Bot className="h-4 w-4 text-gray-600" />
              </div>
              <div className="bg-gray-100 rounded-lg p-3">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </CardContent>

      {/* Input */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex space-x-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={selectedAgent ? `Pregúntale a ${selectedAgent.name}...` : "Selecciona un agente primero..."}
            disabled={!selectedAgent || isLoading}
            className="flex-1"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || !selectedAgent || isLoading}
            className="bg-blue-500 hover:bg-blue-600"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
        
        {/* Quick actions */}
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
              <RefreshCw className="h-3 w-3 mr-1" />
              Nueva conversación
            </Button>
            <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
              <Download className="h-3 w-3 mr-1" />
              Exportar
            </Button>
            <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
              <Share2 className="h-3 w-3 mr-1" />
              Compartir
            </Button>
          </div>
          
          {selectedAgent && (
            <div className="flex items-center space-x-1 text-xs text-gray-500">
              <Zap className="h-3 w-3" />
              <span>Powered by {selectedAgent.name}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
