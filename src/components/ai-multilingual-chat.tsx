'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Send, Bot, User, Globe, Sparkles, Workflow, Brain, Target } from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'
import { MultilingualAI, MultilingualAIResponse } from '@/lib/ai-multilingual'

interface Message {
  id: string
  content: string
  role: 'user' | 'assistant'
  language: string
  timestamp: Date
  type?: 'workflow' | 'advice' | 'general'
}

interface MultilingualChatProps {
  className?: string
  initialLanguage?: string
}

export function MultilingualChat({ className, initialLanguage = 'es' }: MultilingualChatProps) {
  const { t, getCurrentLanguage } = useTranslation('common')
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [currentLanguage, setCurrentLanguage] = useState(initialLanguage)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Agregar mensaje de bienvenida
    const welcomeMessages = {
      es: "¡Hola! Soy tu asistente de IA multilingüe. Puedes preguntarme sobre automatización, workflows, o cualquier tema de negocio. ¿En qué puedo ayudarte?",
      en: "Hello! I'm your multilingual AI assistant. You can ask me about automation, workflows, or any business topic. How can I help you?",
      pt: "Olá! Sou seu assistente de IA multilíngue. Você pode me perguntar sobre automação, workflows ou qualquer tópico de negócio. Como posso ajudá-lo?",
      fr: "Bonjour! Je suis votre assistant IA multilingue. Vous pouvez me demander sur l'automatisation, les workflows ou tout sujet d'entreprise. Comment puis-je vous aider?",
      de: "Hallo! Ich bin Ihr mehrsprachiger KI-Assistent. Sie können mich nach Automatisierung, Workflows oder jedem Geschäftsthema fragen. Wie kann ich Ihnen helfen?"
    }

    const welcomeMessage: Message = {
      id: 'welcome',
      content: welcomeMessages[currentLanguage as keyof typeof welcomeMessages] || welcomeMessages.es,
      role: 'assistant',
      language: currentLanguage,
      timestamp: new Date(),
      type: 'general'
    }

    setMessages([welcomeMessage])
  }, [currentLanguage])

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]')
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight
      }
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: 'user',
      language: currentLanguage,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      // Detectar idioma del mensaje del usuario
      const detectedLanguage = await MultilingualAI.detectLanguage(input)
      setCurrentLanguage(detectedLanguage)

      // Generar respuesta basada en el tipo de mensaje
      let aiResponse: MultilingualAIResponse

      if (input.toLowerCase().includes('workflow') || input.toLowerCase().includes('automatizar')) {
        aiResponse = await MultilingualAI.generateWorkflowSuggestion(input, detectedLanguage)
      } else if (input.toLowerCase().includes('negocio') || input.toLowerCase().includes('empresa') || 
                 input.toLowerCase().includes('business') || input.toLowerCase().includes('company')) {
        aiResponse = await MultilingualAI.generateBusinessAdvice(input, detectedLanguage)
      } else {
        aiResponse = await MultilingualAI.generateResponse(input, detectedLanguage)
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse.response,
        role: 'assistant',
        language: detectedLanguage,
        timestamp: new Date(),
        type: input.toLowerCase().includes('workflow') ? 'workflow' : 
              input.toLowerCase().includes('negocio') || input.toLowerCase().includes('business') ? 'advice' : 'general'
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Error generating AI response:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: t('ai.error', 'Lo siento, hubo un error al procesar tu mensaje.'),
        role: 'assistant',
        language: currentLanguage,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const getMessageIcon = (message: Message) => {
    if (message.role === 'user') return <User className="h-4 w-4" />
    
    switch (message.type) {
      case 'workflow': return <Workflow className="h-4 w-4" />
      case 'advice': return <Target className="h-4 w-4" />
      default: return <Bot className="h-4 w-4" />
    }
  }

  const getLanguageFlag = (language: string) => {
    const flags = {
      es: '🇪🇸',
      en: '🇺🇸',
      pt: '🇧🇷',
      fr: '🇫🇷',
      de: '🇩🇪'
    }
    return flags[language as keyof typeof flags] || '🌍'
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-blue-500" />
            {t('ai.title', 'Asistente IA Multilingüe')}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-gray-500" />
            <Badge variant="outline" className="text-xs">
              {getLanguageFlag(currentLanguage)} {currentLanguage.toUpperCase()}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea ref={scrollAreaRef} className="h-96 px-4">
          <div className="space-y-4 py-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.role === 'assistant' && (
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    {getMessageIcon(message)}
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    message.role === 'user'
                      ? 'bg-blue-500 text-white ml-12'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    {message.role === 'assistant' && (
                      <Badge variant="secondary" className="text-xs">
                        {getLanguageFlag(message.language)} {message.type || 'general'}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
                {message.role === 'user' && (
                  <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4" />
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-3 justify-start">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="bg-gray-100 rounded-lg px-4 py-2">
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                    <span className="text-sm text-gray-600">{t('ai.thinking', 'Pensando...')}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        <div className="border-t p-4">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={t('ai.placeholder', 'Escribe tu mensaje...')}
              className="flex-1"
              disabled={isLoading}
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              size="icon"
              className="bg-blue-500 hover:bg-blue-600"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
            <Sparkles className="h-3 w-3" />
            <span>{t('ai.suggestion', 'Pregunta sobre workflows, automatización o consejos de negocio')}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
