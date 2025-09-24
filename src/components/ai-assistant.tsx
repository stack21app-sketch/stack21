'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { 
  MessageCircle, 
  Send, 
  Loader2, 
  Lightbulb, 
  Workflow, 
  TrendingUp,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Brain
} from 'lucide-react'
import { 
  INDUSTRIES, 
  generateAIResponse, 
  getIndustrySuggestions,
  getIndustryMetrics,
  getIndustryIntegrations,
  type Industry,
  type AIResponse 
} from '@/lib/ai-assistant'

interface Message {
  id: string
  type: 'user' | 'ai'
  content: string
  timestamp: Date
  suggestions?: string[]
  workflows?: string[]
  nextSteps?: string[]
  confidence?: number
}

export function AIAssistant() {
  const [selectedIndustry, setSelectedIndustry] = useState<string>('')
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [suggestions, setSuggestions] = useState<string[]>([])

  useEffect(() => {
    if (selectedIndustry) {
      setSuggestions(getIndustrySuggestions(selectedIndustry))
    }
  }, [selectedIndustry])

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !selectedIndustry) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)

    try {
      const response = await generateAIResponse(inputMessage, selectedIndustry)
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: response.message,
        timestamp: new Date(),
        suggestions: response.suggestions,
        workflows: response.workflows,
        nextSteps: response.nextSteps,
        confidence: response.confidence
      }

      setMessages(prev => [...prev, aiMessage])
    } catch (error) {
      console.error('Error generating AI response:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setInputMessage(suggestion)
  }

  const selectedIndustryData = INDUSTRIES.find(i => i.id === selectedIndustry)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white flex items-center">
            <Brain className="w-8 h-8 mr-3 text-purple-400" />
            Asistente IA por Industria
          </h2>
          <p className="text-gray-400">Obtén recomendaciones personalizadas para tu sector</p>
        </div>
        <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
          <Sparkles className="w-4 h-4 mr-1" />
          IA Avanzada
        </Badge>
      </div>

      {/* Selector de Industria */}
      <Card className="bg-white/5 backdrop-blur-xl border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Selecciona tu Industria</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
            <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
              <SelectValue placeholder="Elige tu industria para obtener recomendaciones personalizadas" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-600">
              {INDUSTRIES.map((industry) => (
                <SelectItem 
                  key={industry.id} 
                  value={industry.id}
                  className="text-white hover:bg-gray-700"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-xl">{industry.icon}</span>
                    <div>
                      <div className="font-semibold">{industry.name}</div>
                      <div className="text-sm text-gray-400">{industry.description}</div>
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {selectedIndustry && (
        <>
          {/* Información de la Industria */}
          <Card className="bg-white/5 backdrop-blur-xl border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <span className="text-2xl mr-3">{selectedIndustryData?.icon}</span>
                {selectedIndustryData?.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h4 className="text-white font-semibold mb-2 flex items-center">
                    <Lightbulb className="w-4 h-4 mr-2 text-yellow-400" />
                    Sugerencias Rápidas
                  </h4>
                  <div className="space-y-1">
                    {suggestions.slice(0, 3).map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="block w-full text-left text-sm text-gray-300 hover:text-white hover:bg-white/5 p-2 rounded transition-colors"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-2 flex items-center">
                    <Workflow className="w-4 h-4 mr-2 text-blue-400" />
                    Workflows Populares
                  </h4>
                  <div className="space-y-1">
                    {selectedIndustryData?.workflows.slice(0, 3).map((workflow, index) => (
                      <div key={index} className="text-sm text-gray-300">
                        {workflow}
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-2 flex items-center">
                    <TrendingUp className="w-4 h-4 mr-2 text-green-400" />
                    Métricas Clave
                  </h4>
                  <div className="space-y-1">
                    {getIndustryMetrics(selectedIndustry).slice(0, 3).map((metric, index) => (
                      <div key={index} className="text-sm text-gray-300">
                        {metric}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Chat */}
          <Card className="bg-white/5 backdrop-blur-xl border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <MessageCircle className="w-5 h-5 mr-2" />
                Conversación con IA
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Mensajes */}
              <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                {messages.length === 0 ? (
                  <div className="text-center text-gray-400 py-8">
                    <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Haz una pregunta para comenzar la conversación</p>
                  </div>
                ) : (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-3xl p-4 rounded-lg ${
                          message.type === 'user'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-800 text-white'
                        }`}
                      >
                        <div className="whitespace-pre-wrap">{message.content}</div>
                        {message.type === 'ai' && message.confidence && (
                          <div className="mt-2 text-xs opacity-75">
                            Confianza: {Math.round(message.confidence * 100)}%
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-800 text-white p-4 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Pensando...</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Sugerencias de la IA */}
              {messages.length > 0 && messages[messages.length - 1].type === 'ai' && (
                <div className="mb-6">
                  {messages[messages.length - 1].suggestions && (
                    <div className="mb-4">
                      <h4 className="text-white font-semibold mb-2 flex items-center">
                        <Lightbulb className="w-4 h-4 mr-2 text-yellow-400" />
                        Sugerencias
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {messages[messages.length - 1].suggestions!.map((suggestion, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="text-white border-white/20 hover:bg-white/10"
                          >
                            {suggestion}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}

                  {messages[messages.length - 1].workflows && (
                    <div className="mb-4">
                      <h4 className="text-white font-semibold mb-2 flex items-center">
                        <Workflow className="w-4 h-4 mr-2 text-blue-400" />
                        Workflows Recomendados
                      </h4>
                      <div className="space-y-2">
                        {messages[messages.length - 1].workflows!.map((workflow, index) => (
                          <div key={index} className="flex items-center text-sm text-gray-300">
                            <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                            {workflow}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {messages[messages.length - 1].nextSteps && (
                    <div>
                      <h4 className="text-white font-semibold mb-2 flex items-center">
                        <ArrowRight className="w-4 h-4 mr-2 text-purple-400" />
                        Próximos Pasos
                      </h4>
                      <div className="space-y-2">
                        {messages[messages.length - 1].nextSteps!.map((step, index) => (
                          <div key={index} className="flex items-center text-sm text-gray-300">
                            <div className="w-6 h-6 rounded-full bg-purple-500 text-white text-xs flex items-center justify-center mr-3">
                              {index + 1}
                            </div>
                            {step}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Input */}
              <div className="flex space-x-2">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Escribe tu pregunta aquí..."
                  className="flex-1 bg-gray-800 border-gray-600 text-white"
                  disabled={isLoading}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isLoading}
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
