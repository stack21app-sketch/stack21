'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  Zap, 
  Workflow, 
  Mail, 
  BarChart3, 
  HelpCircle,
  Mic,
  MicOff,
  X,
  Minimize2,
  Maximize2,
  Clock,
  Activity,
  FileText,
  Database,
  Shield,
  Settings
} from 'lucide-react'
import { aiAgent, AIResponse } from '@/lib/ai-agent'
import { useToast } from '@/components/advanced-toast'

interface AIAgentChatProps {
  onActionExecuted?: (action: any) => void
  className?: string
}

export function AIAgentChat({ onActionExecuted, className }: AIAgentChatProps) {
  const [messages, setMessages] = useState<Array<{
    role: 'user' | 'assistant'
    content: string
    timestamp: Date
    action?: any
    isTyping?: boolean
  }>>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const { addToast } = useToast()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    setInput('')
    setIsLoading(true)

    // Añadir mensaje del usuario
    const newMessages = [...messages, {
      role: 'user' as const,
      content: userMessage,
      timestamp: new Date()
    }]
    setMessages(newMessages)

    try {
      const response: AIResponse = await aiAgent.processMessage(userMessage)
      
      // Añadir respuesta del agente
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: response.message,
        timestamp: new Date(),
        action: response.action
      }])

      // Ejecutar callback si hay acción
      if (response.action && onActionExecuted) {
        onActionExecuted(response.action)
      }

      // Mostrar toast de confirmación
      if (response.action) {
        addToast({
          type: 'success',
          title: 'Acción ejecutada',
          message: response.action.description,
          duration: 3000
        })
      }

    } catch (error) {
      console.error('Error sending message:', error)
      addToast({
        type: 'error',
        title: 'Error',
        message: 'No pude procesar tu solicitud',
        duration: 3000
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window)) {
      addToast({
        type: 'warning',
        title: 'No soportado',
        message: 'Tu navegador no soporta reconocimiento de voz',
        duration: 3000
      })
      return
    }

    const recognition = new (window as any).webkitSpeechRecognition()
    recognition.continuous = false
    recognition.interimResults = false
    recognition.lang = 'es-ES'

    recognition.onstart = () => {
      setIsListening(true)
    }

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript
      setInput(transcript)
      setIsListening(false)
    }

    recognition.onerror = () => {
      setIsListening(false)
    }

    recognition.start()
  }

  const getActionIcon = (actionType: string) => {
    switch (actionType) {
      case 'create_workflow':
        return <Workflow className="h-4 w-4" />
      case 'add_node':
        return <Zap className="h-4 w-4" />
      case 'send_email':
        return <Mail className="h-4 w-4" />
      case 'get_analytics':
        return <BarChart3 className="h-4 w-4" />
      case 'analyze_data':
        return <BarChart3 className="h-4 w-4" />
      case 'generate_report':
        return <FileText className="h-4 w-4" />
      case 'slack_message':
        return <Zap className="h-4 w-4" />
      case 'gmail_send':
        return <Mail className="h-4 w-4" />
      case 'schedule_workflow':
        return <Clock className="h-4 w-4" />
      case 'optimize_workflow':
        return <Settings className="h-4 w-4" />
      case 'backup_data':
        return <Database className="h-4 w-4" />
      case 'monitor_system':
        return <Activity className="h-4 w-4" />
      case 'help':
        return <HelpCircle className="h-4 w-4" />
      default:
        return <Sparkles className="h-4 w-4" />
    }
  }

  const quickActions = [
    { text: 'Crear workflow de email', icon: <Workflow className="h-4 w-4" /> },
    { text: 'Analizar datos del workspace', icon: <BarChart3 className="h-4 w-4" /> },
    { text: 'Generar reporte mensual', icon: <BarChart3 className="h-4 w-4" /> },
    { text: 'Enviar mensaje a Slack', icon: <Zap className="h-4 w-4" /> },
    { text: 'Programar workflow diario', icon: <Clock className="h-4 w-4" /> },
    { text: 'Monitorear sistema', icon: <Activity className="h-4 w-4" /> },
    { text: '¿Qué puedes hacer?', icon: <HelpCircle className="h-4 w-4" /> }
  ]

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105 z-50"
      >
        <Bot className="h-6 w-6 text-white" />
      </Button>
    )
  }

  return (
    <Card className={`fixed bottom-6 right-6 w-96 h-[500px] shadow-2xl border-0 bg-white/95 backdrop-blur-xl z-50 ${isMinimized ? 'h-16' : ''} ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
              <Bot className="h-4 w-4 text-white" />
            </div>
            <div>
              <CardTitle className="text-sm">Asistente IA</CardTitle>
              <p className="text-xs text-gray-500">Stack21 Agent</p>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsMinimized(!isMinimized)}
              className="h-6 w-6 p-0"
            >
              {isMinimized ? <Maximize2 className="h-3 w-3" /> : <Minimize2 className="h-3 w-3" />}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsOpen(false)}
              className="h-6 w-6 p-0"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardHeader>

      {!isMinimized && (
        <>
          <CardContent className="flex-1 flex flex-col p-0">
            {/* Mensajes */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 && (
                <div className="text-center text-gray-500 text-sm">
                  <Bot className="h-8 w-8 mx-auto mb-2 text-purple-400" />
                  <p>¡Hola! Soy tu asistente de IA.</p>
                  <p className="text-xs mt-1">Puedo crear workflows, ejecutar tareas y más.</p>
                </div>
              )}

              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.role === 'user'
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <div className="flex items-start space-x-2">
                      {message.role === 'assistant' && (
                        <Bot className="h-4 w-4 mt-0.5 text-purple-500" />
                      )}
                      {message.role === 'user' && (
                        <User className="h-4 w-4 mt-0.5 text-white" />
                      )}
                      <div className="flex-1">
                        <p className="text-sm">{message.content}</p>
                        {message.action && (
                          <div className="mt-2 flex items-center space-x-1">
                            {getActionIcon(message.action.type)}
                            <Badge variant="secondary" className="text-xs">
                              {message.action.description}
                            </Badge>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 p-3 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Bot className="h-4 w-4 text-purple-500" />
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Acciones rápidas */}
            {messages.length === 0 && (
              <div className="p-4 border-t">
                <p className="text-xs text-gray-500 mb-2">Acciones rápidas:</p>
                <div className="grid grid-cols-2 gap-2">
                  {quickActions.map((action, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => setInput(action.text)}
                      className="text-xs h-8 justify-start"
                    >
                      {action.icon}
                      <span className="ml-1 truncate">{action.text}</span>
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t">
              <div className="flex space-x-2">
                <Input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Escribe tu comando..."
                  className="flex-1"
                  disabled={isLoading}
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleVoiceInput}
                  disabled={isLoading || isListening}
                  className={`${isListening ? 'bg-red-100 border-red-300' : ''}`}
                >
                  {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </Button>
                <Button
                  size="sm"
                  onClick={handleSendMessage}
                  disabled={!input.trim() || isLoading}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </>
      )}
    </Card>
  )
}
