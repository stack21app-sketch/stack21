'use client'

import { useState, useRef, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { 
  Bot, 
  Send, 
  Settings, 
  MessageSquare,
  Sparkles,
  Loader2,
  User,
  Trash2,
  Copy,
  ThumbsUp,
  ThumbsDown
} from 'lucide-react'

interface Message {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: Date
  rating?: 'like' | 'dislike'
}

export default function ChatbotPage() {
  const params = useParams()
  const { data: session } = useSession()
  const slug = params.slug as string
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: '¡Hola! Soy tu asistente de IA personalizado. ¿En qué puedo ayudarte hoy?',
      role: 'assistant',
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [botPersonality, setBotPersonality] = useState('helpful')
  const [botName, setBotName] = useState('Asistente IA')
  const [showSettings, setShowSettings] = useState(false)

  const personalities = [
    { id: 'helpful', name: 'Útil', desc: 'Responde de manera útil y directa' },
    { id: 'creative', name: 'Creativo', desc: 'Respuestas creativas e imaginativas' },
    { id: 'professional', name: 'Profesional', desc: 'Tono formal y empresarial' },
    { id: 'friendly', name: 'Amigable', desc: 'Conversación casual y amigable' },
    { id: 'technical', name: 'Técnico', desc: 'Enfoque técnico y detallado' }
  ]

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || loading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      const response = await fetch('/api/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: input,
          personality: botPersonality,
          botName: botName,
          conversationHistory: messages.slice(-10) // Últimos 10 mensajes para contexto
        }),
      })

      if (!response.ok) {
        throw new Error('Error al enviar mensaje')
      }

      const data = await response.json()
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response,
        role: 'assistant',
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Lo siento, hubo un error al procesar tu mensaje. Por favor, inténtalo de nuevo.',
        role: 'assistant',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const rateMessage = (messageId: string, rating: 'like' | 'dislike') => {
    setMessages(prev => 
      prev.map(msg => 
        msg.id === messageId ? { ...msg, rating } : msg
      )
    )
  }

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content)
  }

  const clearChat = () => {
    setMessages([{
      id: '1',
      content: '¡Hola! Soy tu asistente de IA personalizado. ¿En qué puedo ayudarte hoy?',
      role: 'assistant',
      timestamp: new Date()
    }])
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white">No autorizado</h2>
          <p className="text-gray-300">Debes iniciar sesión para usar el chatbot</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Bot className="h-8 w-8 text-cyan-400 mr-3" />
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  Chatbot Personalizado
                </h1>
                <p className="text-sm text-gray-300">Conversa con tu asistente de IA personalizado</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => setShowSettings(!showSettings)}
                className="border-white/20 text-white hover:bg-white/10"
              >
                <Settings className="h-4 w-4 mr-2" />
                Configurar
              </Button>
              <Button 
                variant="outline" 
                onClick={clearChat}
                className="border-white/20 text-white hover:bg-white/10"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Limpiar
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Settings Panel */}
          {showSettings && (
            <Card className="bg-black/20 backdrop-blur-lg border-white/10">
              <CardHeader>
                <CardTitle className="text-lg text-white">Configuración del Bot</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-white">Nombre del Bot</Label>
                  <Input
                    value={botName}
                    onChange={(e) => setBotName(e.target.value)}
                    className="bg-black/20 border-white/20 text-white"
                    placeholder="Mi Asistente"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white">Personalidad</Label>
                  <div className="space-y-2">
                    {personalities.map((personality) => (
                      <Button
                        key={personality.id}
                        variant={botPersonality === personality.id ? "default" : "outline"}
                        onClick={() => setBotPersonality(personality.id)}
                        className={`w-full justify-start ${
                          botPersonality === personality.id 
                            ? 'bg-purple-600 hover:bg-purple-700' 
                            : 'border-white/20 text-white hover:bg-white/10'
                        }`}
                      >
                        <div>
                          <div className="font-medium">{personality.name}</div>
                          <div className="text-xs opacity-70">{personality.desc}</div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Chat Interface */}
          <div className={`${showSettings ? 'lg:col-span-3' : 'col-span-full'}`}>
            <Card className="bg-black/20 backdrop-blur-lg border-white/10 h-[600px] flex flex-col">
              <CardHeader className="flex-shrink-0">
                <CardTitle className="text-lg text-white flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2 text-purple-400" />
                  Conversación con {botName}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="flex-1 flex flex-col">
                {/* Messages */}
                <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] p-3 rounded-lg ${
                          message.role === 'user'
                            ? 'bg-purple-600 text-white'
                            : 'bg-white/10 text-white'
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          {message.role === 'assistant' && (
                            <Bot className="h-4 w-4 mt-1 text-cyan-400 flex-shrink-0" />
                          )}
                          {message.role === 'user' && (
                            <User className="h-4 w-4 mt-1 text-purple-200 flex-shrink-0" />
                          )}
                          <div className="flex-1">
                            <p className="text-sm">{message.content}</p>
                            <p className="text-xs opacity-70 mt-1">
                              {message.timestamp.toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                        
                        {message.role === 'assistant' && (
                          <div className="flex items-center gap-2 mt-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => copyMessage(message.content)}
                              className="h-6 w-6 p-0 text-gray-400 hover:text-white"
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => rateMessage(message.id, 'like')}
                              className={`h-6 w-6 p-0 ${
                                message.rating === 'like' 
                                  ? 'text-green-400' 
                                  : 'text-gray-400 hover:text-green-400'
                              }`}
                            >
                              <ThumbsUp className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => rateMessage(message.id, 'dislike')}
                              className={`h-6 w-6 p-0 ${
                                message.rating === 'dislike' 
                                  ? 'text-red-400' 
                                  : 'text-gray-400 hover:text-red-400'
                              }`}
                            >
                              <ThumbsDown className="h-3 w-3" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {loading && (
                    <div className="flex justify-start">
                      <div className="bg-white/10 text-white p-3 rounded-lg flex items-center gap-2">
                        <Bot className="h-4 w-4 text-cyan-400" />
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="text-sm">Escribiendo...</span>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="flex gap-2">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Escribe tu mensaje aquí..."
                    className="flex-1 bg-black/20 border-white/20 text-white placeholder-gray-400"
                    disabled={loading}
                  />
                  <Button
                    onClick={handleSend}
                    disabled={loading || !input.trim()}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
