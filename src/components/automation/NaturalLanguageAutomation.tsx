'use client'

/**
 * 🤖 STACK21 - Interfaz de Automatización con Lenguaje Natural
 * Permite crear workflows escribiendo en lenguaje natural
 */

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Sparkles,
  Zap,
  ChevronRight,
  Check,
  AlertCircle,
  Loader2,
  Lightbulb,
  Play,
  Code
} from 'lucide-react'
import { parseNaturalLanguage, generateSuggestions } from '@/lib/automation/nlp-processor'
import { getConnectorById } from '@/lib/automation/connectors'
import type { ParsedWorkflow } from '@/lib/automation/nlp-processor'

interface NaturalLanguageAutomationProps {
  onWorkflowCreated?: (workflow: ParsedWorkflow) => void
}

export default function NaturalLanguageAutomation({ onWorkflowCreated }: NaturalLanguageAutomationProps) {
  const [input, setInput] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [parsedWorkflow, setParsedWorkflow] = useState<ParsedWorkflow | null>(null)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)

  // Generar sugerencias según el input
  useEffect(() => {
    if (input.length > 2) {
      const newSuggestions = generateSuggestions(input)
      setSuggestions(newSuggestions)
      setShowSuggestions(true)
    } else {
      setShowSuggestions(false)
    }
  }, [input])

  const handleParse = async () => {
    if (!input.trim()) return

    setIsProcessing(true)
    try {
      // Simular delay de procesamiento
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const workflow = await parseNaturalLanguage(input)
      setParsedWorkflow(workflow)
      setShowSuggestions(false)
    } catch (error) {
      console.error('Error parsing workflow:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion)
    setShowSuggestions(false)
  }

  const handleCreateWorkflow = () => {
    if (parsedWorkflow && onWorkflowCreated) {
      onWorkflowCreated(parsedWorkflow)
    }
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600'
    if (confidence >= 0.6) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getConfidenceLabel = (confidence: number) => {
    if (confidence >= 0.8) return 'Alta'
    if (confidence >= 0.6) return 'Media'
    return 'Baja'
  }

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mb-4">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900">
          Crea Automatizaciones con IA
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Describe lo que quieres automatizar en <span className="font-semibold text-blue-600">lenguaje natural</span> y Stack21 lo convierte en un workflow funcional
        </p>
      </div>

      {/* Input Principal */}
      <Card className="max-w-4xl mx-auto">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="flex-1">
                <Input
                  placeholder="Ej: Cuando llegue un lead de Facebook Ads, enriquécelo con Clearbit y créalo en HubSpot con score IA..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && !isProcessing && handleParse()}
                  className="text-base h-auto py-4 px-4"
                  disabled={isProcessing}
                />
                <p className="text-xs text-gray-500 mt-2 flex items-center">
                  <Lightbulb className="w-3 h-3 mr-1" />
                  Describe tu automatización con el máximo detalle posible
                </p>
              </div>
              <Button
                onClick={handleParse}
                disabled={!input.trim() || isProcessing}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 h-[56px] px-8"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Procesando...
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5 mr-2" />
                    Crear
                  </>
                )}
              </Button>
            </div>

            {/* Sugerencias */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="border-t pt-4">
                <p className="text-sm font-semibold text-gray-700 mb-3">💡 Sugerencias:</p>
                <div className="space-y-2">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-blue-50 rounded-lg text-sm text-gray-700 hover:text-blue-700 transition-colors border border-transparent hover:border-blue-200"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Resultado del Parsing */}
      {parsedWorkflow && (
        <Card className="max-w-4xl mx-auto border-2 border-blue-200 bg-blue-50/50">
          <CardContent className="p-6 space-y-6">
            {/* Header con Confianza */}
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {parsedWorkflow.name}
                </h3>
                <p className="text-gray-600">{parsedWorkflow.description}</p>
              </div>
              <div className="text-right">
                <Badge className={`text-lg px-4 py-2 ${parsedWorkflow.confidence >= 0.8 ? 'bg-green-100 text-green-700' : parsedWorkflow.confidence >= 0.6 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                  <Check className="w-4 h-4 mr-1" />
                  Confianza: {getConfidenceLabel(parsedWorkflow.confidence)} ({Math.round(parsedWorkflow.confidence * 100)}%)
                </Badge>
              </div>
            </div>

            {/* Trigger */}
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                🎯 Trigger (Disparador)
              </h4>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      {getConnectorById(parsedWorkflow.trigger.app || '')?.icon || '🔗'}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">
                        {parsedWorkflow.trigger.app?.replace('_', ' ').toUpperCase()}
                      </p>
                      <p className="text-sm text-gray-600">
                        {parsedWorkflow.trigger.event?.replace('_', ' ')}
                      </p>
                    </div>
                    <Badge variant="outline">Trigger</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Steps (Acciones) */}
            {parsedWorkflow.steps.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                  ⚡ Acciones ({parsedWorkflow.steps.length})
                </h4>
                <div className="space-y-3">
                  {parsedWorkflow.steps.map((step, index) => (
                    <Card key={index}>
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-sm font-bold text-purple-700">
                            {index + 1}
                          </div>
                          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                            {getConnectorById(step.app || '')?.icon || '⚙️'}
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900">
                              {step.app?.replace('_', ' ').toUpperCase()}
                            </p>
                            <p className="text-sm text-gray-600">
                              {step.action?.replace('_', ' ')}
                            </p>
                          </div>
                          <Badge variant="outline" className="capitalize">
                            {step.type}
                          </Badge>
                        </div>
                        
                        {/* Condiciones */}
                        {step.conditions && step.conditions.length > 0 && (
                          <div className="mt-3 pl-14 space-y-1">
                            {step.conditions.map((cond, cidx) => (
                              <div key={cidx} className="text-sm text-gray-600 flex items-center">
                                <AlertCircle className="w-4 h-4 mr-2 text-yellow-600" />
                                Si <code className="bg-gray-100 px-2 py-0.5 rounded mx-1">{cond.field}</code>
                                <code className="bg-gray-100 px-2 py-0.5 rounded mx-1">{cond.operator}</code>
                                <code className="bg-gray-100 px-2 py-0.5 rounded mx-1">{cond.value}</code>
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Conectores Sugeridos */}
            {parsedWorkflow.suggestedConnectors.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                  🔌 Conectores Necesarios
                </h4>
                <div className="flex flex-wrap gap-2">
                  {parsedWorkflow.suggestedConnectors.map((connectorId, index) => {
                    const connector = getConnectorById(connectorId)
                    return (
                      <Badge key={index} variant="outline" className="text-sm px-3 py-1">
                        {connector?.icon} {connector?.name || connectorId}
                      </Badge>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Advertencias */}
            {parsedWorkflow.confidence < 0.7 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold text-yellow-900 mb-1">Confianza Media/Baja</p>
                  <p className="text-sm text-yellow-800">
                    El sistema no está completamente seguro de la interpretación. Te recomendamos revisar 
                    y ajustar el workflow manualmente antes de activarlo.
                  </p>
                </div>
              </div>
            )}

            {/* Acciones */}
            <div className="flex items-center justify-between pt-4 border-t">
              <Button variant="outline" onClick={() => setParsedWorkflow(null)}>
                Cancelar
              </Button>
              <div className="flex space-x-3">
                <Button variant="outline">
                  <Code className="w-4 h-4 mr-2" />
                  Ver JSON
                </Button>
                <Button 
                  onClick={handleCreateWorkflow}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Crear Workflow
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Ejemplos */}
      {!parsedWorkflow && !isProcessing && (
        <div className="max-w-4xl mx-auto">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">📚 Ejemplos de Automatizaciones</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              {
                title: 'Lead Scoring con IA',
                description: 'Cuando llegue un lead de Facebook Ads, enriquécelo con Clearbit y créalo en HubSpot con score IA',
                category: 'Ventas',
                icon: '💼'
              },
              {
                title: 'Gestión de Stock',
                description: 'Si Stock < 10 en Shopify, actualiza precio dinámico y avisa al buyer en Slack',
                category: 'E-commerce',
                icon: '📦'
              },
              {
                title: 'Automatización Contable',
                description: 'Lee facturas PDF de email, extrae datos con IA y crea asientos en QuickBooks',
                category: 'Finanzas',
                icon: '💰'
              },
              {
                title: 'Soporte Inteligente',
                description: 'Clasifica tickets por urgencia con IA y escala a humano si confianza < 0.85',
                category: 'Soporte',
                icon: '🎧'
              }
            ].map((example, index) => (
              <Card 
                key={index}
                className="cursor-pointer hover:shadow-lg transition-shadow hover:border-blue-300"
                onClick={() => setInput(example.description)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <div className="text-3xl">{example.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-900">{example.title}</h4>
                        <Badge variant="outline" className="text-xs">
                          {example.category}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{example.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

