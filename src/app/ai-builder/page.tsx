'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  Send, 
  Loader2, 
  CheckCircle, 
  AlertCircle,
  Zap,
  Code,
  Database,
  MessageSquare,
  ArrowRight,
  RefreshCw
} from 'lucide-react';

interface AISuggestion {
  id: string;
  name: string;
  description: string;
  workflow: any;
  confidence: number;
}

export default function AIBuilderPage() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    setError(null);
    setSuggestions([]);

    try {
      // Simular llamada a AI
      await new Promise(resolve => setTimeout(resolve, 2000));

      const mockSuggestions: AISuggestion[] = [
        {
          id: 'suggestion_1',
          name: 'Notificación de Nuevo Usuario',
          description: 'Envía un email de bienvenida cuando se registra un nuevo usuario',
          confidence: 95,
          workflow: {
            trigger: {
              type: 'webhook',
              config: { path: '/webhook/user-registered' }
            },
            steps: [
              {
                id: 'step_1',
                type: 'data_transform',
                name: 'Preparar Datos',
                config: {
                  transform: {
                    email: '$.email',
                    name: '$.name',
                    welcome_message: 'Bienvenido $.name!'
                  }
                }
              },
              {
                id: 'step_2',
                type: 'http_request',
                name: 'Enviar Email',
                config: {
                  url: 'https://api.email.com/send',
                  method: 'POST',
                  body: {
                    to: '$.email',
                    subject: 'Bienvenido a nuestra plataforma',
                    body: '$.welcome_message'
                  }
                }
              }
            ]
          }
        },
        {
          id: 'suggestion_2',
          name: 'Sincronización de Datos',
          description: 'Sincroniza datos entre dos sistemas cuando hay cambios',
          confidence: 88,
          workflow: {
            trigger: {
              type: 'webhook',
              config: { path: '/webhook/data-changed' }
            },
            steps: [
              {
                id: 'step_1',
                type: 'http_request',
                name: 'Obtener Datos',
                config: {
                  url: 'https://api.source.com/data',
                  method: 'GET'
                }
              },
              {
                id: 'step_2',
                type: 'http_request',
                name: 'Enviar a Destino',
                config: {
                  url: 'https://api.destination.com/sync',
                  method: 'POST',
                  body: '$.'
                }
              }
            ]
          }
        }
      ];

      setSuggestions(mockSuggestions);
    } catch (err: any) {
      setError(err.message || 'Error generando sugerencias');
    } finally {
      setLoading(false);
    }
  };

  const handleApplySuggestion = async (suggestion: AISuggestion) => {
    try {
      const response = await fetch('/api/workflows', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: suggestion.name,
          description: suggestion.description,
          ...suggestion.workflow
        })
      });

      if (!response.ok) throw new Error('Error creando workflow');
      
      const data = await response.json();
      alert(`Workflow "${suggestion.name}" creado exitosamente!`);
      // Redirigir al editor
      window.location.href = `/workflows/${data.id}/edit`;
    } catch (error) {
      alert('Error al crear el workflow');
    }
  };

  const examplePrompts = [
    "Enviar email cuando alguien se registra",
    "Sincronizar datos entre dos sistemas",
    "Crear backup automático de la base de datos",
    "Notificar en Slack cuando hay un error",
    "Procesar pagos y actualizar inventario"
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">AI Builder</h1>
          </div>
          <p className="text-xl text-gray-600 mb-8">
            Describe lo que quieres automatizar y deja que la IA cree tu workflow
          </p>
        </div>

        {/* Input Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-8 mb-8">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ¿Qué quieres automatizar?
            </label>
            <div className="relative">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Ej: Enviar un email de bienvenida cuando alguien se registra en mi sitio web..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                rows={4}
                disabled={loading}
              />
              <button
                onClick={handleGenerate}
                disabled={loading || !prompt.trim()}
                className="absolute bottom-3 right-3 flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Generando...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Generar
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Example Prompts */}
          <div>
            <p className="text-sm text-gray-500 mb-3">Ejemplos de prompts:</p>
            <div className="flex flex-wrap gap-2">
              {examplePrompts.map((example, index) => (
                <button
                  key={index}
                  onClick={() => setPrompt(example)}
                  className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8"
          >
            <div className="flex items-center gap-2 text-red-800">
              <AlertCircle className="w-5 h-5" />
              <span className="font-medium">Error</span>
            </div>
            <p className="text-red-700 mt-1">{error}</p>
            <button
              onClick={() => setError(null)}
              className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
            >
              Cerrar
            </button>
          </motion.div>
        )}

        {/* Loading State */}
        {loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg border border-gray-200 p-8 text-center"
          >
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Generando workflows...
            </h3>
            <p className="text-gray-600">
              Nuestra IA está analizando tu solicitud y creando las mejores opciones
            </p>
          </motion.div>
        )}

        {/* Suggestions */}
        {suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                Workflows Sugeridos
              </h2>
              <button
                onClick={() => {
                  setSuggestions([]);
                  setPrompt('');
                }}
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Generar nuevos
              </button>
            </div>

            {suggestions.map((suggestion, index) => (
              <motion.div
                key={suggestion.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {suggestion.name}
                      </h3>
                      <div className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                        <CheckCircle className="w-3 h-3" />
                        {suggestion.confidence}% confianza
                      </div>
                    </div>
                    <p className="text-gray-600 mb-4">{suggestion.description}</p>
                  </div>
                </div>

                {/* Workflow Preview */}
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Estructura del workflow:</h4>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded">
                      <Zap className="w-3 h-3" />
                      {suggestion.workflow.trigger.type}
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                    {suggestion.workflow.steps.map((step: any, stepIndex: number) => (
                      <React.Fragment key={step.id}>
                        <div className="flex items-center gap-1 px-2 py-1 bg-gray-200 text-gray-700 rounded">
                          {step.type === 'http_request' && <Database className="w-3 h-3" />}
                          {step.type === 'data_transform' && <Code className="w-3 h-3" />}
                          {step.type === 'log' && <MessageSquare className="w-3 h-3" />}
                          {step.name}
                        </div>
                        {stepIndex < suggestion.workflow.steps.length - 1 && (
                          <ArrowRight className="w-4 h-4 text-gray-400" />
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleApplySuggestion(suggestion)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Zap className="w-4 h-4" />
                    Usar este workflow
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                    <Code className="w-4 h-4" />
                    Ver código
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Empty State */}
        {!loading && suggestions.length === 0 && !error && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              ¡Comienza a automatizar!
            </h3>
            <p className="text-gray-600 mb-6">
              Describe lo que quieres automatizar y nuestra IA creará workflows personalizados para ti
            </p>
          </div>
        )}
      </div>
    </div>
  );
}