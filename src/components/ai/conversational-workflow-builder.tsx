'use client'

import { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Send, Bot, User, Zap, CheckCircle, Loader2, Sparkles, Lightbulb } from 'lucide-react'

interface Message {
  id: string
  type: 'user' | 'ai'
  content: string
  timestamp: Date
  suggestions?: string[]
  workflow?: {
    name: string
    triggers: string[]
    actions: string[]
    status: 'draft' | 'ready' | 'implemented'
  }
}

export default function ConversationalWorkflowBuilder() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: '¡Hola! Soy tu asistente IA para crear automatizaciones. Puedes describir lo que quieres automatizar en lenguaje natural y yo te ayudo a crearlo. ¿Qué proceso te gustaría automatizar?',
      timestamp: new Date(),
      suggestions: [
        'Cada vez que alguien compre en mi tienda, envíale un email de confirmación',
        'Cuando reciba un nuevo lead, agregarlo a mi CRM y enviar notificación',
        'Automatizar el seguimiento de facturas vencidas',
        'Crear reportes automáticos cada semana'
      ]
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsTyping(true)

    // Simular respuesta de IA
    setTimeout(() => {
      const aiResponse = generateAIResponse(inputValue)
      setMessages(prev => [...prev, aiResponse])
      setIsTyping(false)
    }, 1500)
  }

  const generateAIResponse = (userInput: string): Message => {
    const responses = {
      'email': {
        content: 'Perfecto, veo que quieres automatizar emails. Te ayudo a crear un workflow que envíe emails automáticamente. ¿Podrías decirme cuándo quieres que se envíe el email? Por ejemplo: "cuando alguien se registre" o "cuando se complete una compra".',
        suggestions: ['Cuando alguien se registre en mi sitio', 'Después de una compra', 'Cuando alguien abandone el carrito', 'Recordatorios de citas']
      },
      'crm': {
        content: 'Excelente, automatizar la gestión de leads es muy efectivo. ¿Desde dónde recibes tus leads? Puedo conectarlo con tu CRM para que se sincronicen automáticamente.',
        suggestions: ['Desde formularios web', 'Desde Facebook Ads', 'Desde Google Ads', 'Desde LinkedIn']
      },
      'factura': {
        content: 'Las facturas son perfectas para automatizar. Puedo crear un sistema que detecte facturas PDF, extraiga los datos automáticamente y actualice tu contabilidad.',
        suggestions: ['Extraer datos de facturas PDF', 'Enviar recordatorios de pago', 'Actualizar contabilidad automáticamente', 'Generar reportes de facturación']
      },
      'reporte': {
        content: 'Los reportes automáticos ahorran mucho tiempo. ¿Qué datos quieres incluir en el reporte y con qué frecuencia?',
        suggestions: ['Reporte de ventas semanal', 'Reporte de marketing mensual', 'Reporte financiero trimestral', 'Dashboard en tiempo real']
      }
    }

    // Detectar intención basada en palabras clave
    const input = userInput.toLowerCase()
    let response = responses['email'] // default

    if (input.includes('crm') || input.includes('lead') || input.includes('cliente')) {
      response = responses['crm']
    } else if (input.includes('factura') || input.includes('pago') || input.includes('contabilidad')) {
      response = responses['factura']
    } else if (input.includes('reporte') || input.includes('dashboard') || input.includes('análisis')) {
      response = responses['reporte']
    }

    return {
      id: (Date.now() + 1).toString(),
      type: 'ai',
      content: response.content,
      timestamp: new Date(),
      suggestions: response.suggestions,
      workflow: input.includes('implementar') ? {
        name: 'Workflow Automático',
        triggers: ['Nuevo evento detectado'],
        actions: ['Ejecutar acción automática'],
        status: 'ready'
      } : undefined
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="border-b">
        <CardTitle className="flex items-center text-blue-600">
          <Sparkles className="h-6 w-6 mr-2" />
          Constructor Conversacional de Workflows
        </CardTitle>
        <p className="text-sm text-gray-600">
          Describe lo que quieres automatizar en lenguaje natural y yo te ayudo a crearlo
        </p>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-0">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.type === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <div className="flex items-start space-x-2">
                  <div className="flex-shrink-0">
                    {message.type === 'user' ? (
                      <User className="h-5 w-5" />
                    ) : (
                      <Bot className="h-5 w-5 text-blue-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm leading-relaxed">{message.content}</p>
                    
                    {/* Workflow Preview */}
                    {message.workflow && (
                      <div className="mt-3 p-3 bg-white rounded-lg border border-gray-200">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-gray-900 flex items-center">
                            <Zap className="h-4 w-4 mr-1 text-blue-600" />
                            {message.workflow.name}
                          </h4>
                          <Badge 
                            className={
                              message.workflow.status === 'ready' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }
                          >
                            {message.workflow.status === 'ready' ? 'Listo' : 'Borrador'}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <h5 className="text-xs font-semibold text-gray-700 mb-1">Triggers:</h5>
                            <ul className="text-xs text-gray-600">
                              {message.workflow.triggers.map((trigger, index) => (
                                <li key={index} className="flex items-center">
                                  <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
                                  {trigger}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h5 className="text-xs font-semibold text-gray-700 mb-1">Acciones:</h5>
                            <ul className="text-xs text-gray-600">
                              {message.workflow.actions.map((action, index) => (
                                <li key={index} className="flex items-center">
                                  <CheckCircle className="h-3 w-3 mr-1 text-blue-500" />
                                  {action}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                        <Button size="sm" className="w-full mt-3">
                          <Zap className="h-4 w-4 mr-2" />
                          Implementar Workflow
                        </Button>
                      </div>
                    )}
                    
                    {/* Suggestions */}
                    {message.suggestions && (
                      <div className="mt-3 space-y-2">
                        <p className="text-xs text-gray-500 flex items-center">
                          <Lightbulb className="h-3 w-3 mr-1" />
                          Sugerencias:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {message.suggestions.map((suggestion, index) => (
                            <button
                              key={index}
                              onClick={() => handleSuggestionClick(suggestion)}
                              className="text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 px-2 py-1 rounded border border-blue-200 transition-colors"
                            >
                              {suggestion}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="text-xs text-gray-500 mt-2">
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-lg p-3 max-w-[80%]">
                <div className="flex items-center space-x-2">
                  <Bot className="h-5 w-5 text-blue-600" />
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <span className="text-sm text-gray-600">IA está pensando...</span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t p-4">
          <div className="flex space-x-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Describe lo que quieres automatizar... (ej: 'cada vez que alguien compre, envíale un email')"
              className="flex-1"
              disabled={isTyping}
            />
            <Button 
              onClick={handleSendMessage} 
              disabled={!inputValue.trim() || isTyping}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isTyping ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            💡 Tip: Puedes ser específico sobre cuándo y qué quieres que pase automáticamente
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
