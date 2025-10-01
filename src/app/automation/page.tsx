'use client'

/**
 * 🤖 STACK21 - Página Principal de Automatizaciones
 * Hub central para crear y gestionar automatizaciones
 */

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Sparkles,
  Zap,
  Clock,
  Play,
  Pause,
  Trash2,
  Edit,
  Plus,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Users,
  Code2
} from 'lucide-react'
import NaturalLanguageAutomation from '@/components/automation/NaturalLanguageAutomation'
import type { ParsedWorkflow } from '@/lib/automation/nlp-processor'

export default function AutomationPage() {
  const [view, setView] = useState<'create' | 'list'>('create')
  const [workflows, setWorkflows] = useState<any[]>([
    {
      id: 'wf_1',
      name: 'Lead Scoring Automático',
      description: 'Enriquece leads de Facebook Ads con IA',
      active: true,
      executions: 1247,
      lastRun: '2025-10-01T08:30:00',
      status: 'success',
      connectors: ['facebook_ads', 'clearbit', 'hubspot', 'slack']
    },
    {
      id: 'wf_2',
      name: 'Gestión de Inventario',
      description: 'Alerta cuando stock es bajo en Shopify',
      active: true,
      executions: 523,
      lastRun: '2025-10-01T09:15:00',
      status: 'success',
      connectors: ['shopify', 'slack']
    },
    {
      id: 'wf_3',
      name: 'Procesamiento de Facturas',
      description: 'OCR de facturas PDF a QuickBooks',
      active: false,
      executions: 89,
      lastRun: '2025-09-28T14:20:00',
      status: 'paused',
      connectors: ['gmail', 'openai', 'quickbooks']
    }
  ])

  const handleWorkflowCreated = (workflow: ParsedWorkflow) => {
    const newWorkflow = {
      id: `wf_${workflows.length + 1}`,
      name: workflow.name,
      description: workflow.description,
      active: false,
      executions: 0,
      lastRun: null,
      status: 'draft',
      connectors: workflow.suggestedConnectors
    }
    
    setWorkflows([...workflows, newWorkflow])
    setView('list')
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 60) return `Hace ${diffMins} min`
    if (diffHours < 24) return `Hace ${diffHours}h`
    return `Hace ${diffDays}d`
  }

  const stats = {
    total: workflows.length,
    active: workflows.filter(w => w.active).length,
    executions: workflows.reduce((sum, w) => sum + w.executions, 0),
    successRate: 98.5
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Automatizaciones
            </h1>
            <p className="text-gray-600">
              Crea workflows inteligentes con IA en lenguaje natural
            </p>
          </div>
          <div className="flex space-x-3">
            <Button
              variant={view === 'create' ? 'default' : 'outline'}
              onClick={() => setView('create')}
              className={view === 'create' ? 'bg-gradient-to-r from-blue-600 to-purple-600' : ''}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Crear con IA
            </Button>
            <Button
              variant={view === 'list' ? 'default' : 'outline'}
              onClick={() => setView('list')}
            >
              <Code2 className="w-4 h-4 mr-2" />
              Mis Workflows
            </Button>
          </div>
        </div>

        {/* Stats Overview (solo en vista list) */}
        {view === 'list' && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total Workflows</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Zap className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Activos</p>
                    <p className="text-3xl font-bold text-green-600">{stats.active}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Ejecuciones</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.executions.toLocaleString()}</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Tasa de Éxito</p>
                    <p className="text-3xl font-bold text-green-600">{stats.successRate}%</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Content */}
        {view === 'create' ? (
          <NaturalLanguageAutomation onWorkflowCreated={handleWorkflowCreated} />
        ) : (
          <div className="space-y-4">
            {/* Lista de Workflows */}
            {workflows.map((workflow) => (
              <Card key={workflow.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-900">{workflow.name}</h3>
                        {workflow.active ? (
                          <Badge className="bg-green-100 text-green-700">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Activo
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-gray-600">
                            <Pause className="w-3 h-3 mr-1" />
                            Pausado
                          </Badge>
                        )}
                      </div>
                      <p className="text-gray-600 mb-4">{workflow.description}</p>

                      <div className="flex items-center space-x-6 text-sm">
                        <div className="flex items-center text-gray-600">
                          <Play className="w-4 h-4 mr-1" />
                          {workflow.executions.toLocaleString()} ejecuciones
                        </div>
                        {workflow.lastRun && (
                          <div className="flex items-center text-gray-600">
                            <Clock className="w-4 h-4 mr-1" />
                            {formatDate(workflow.lastRun)}
                          </div>
                        )}
                        <div className="flex items-center space-x-2">
                          {workflow.connectors.slice(0, 4).map((conn: string, idx: number) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {conn.replace('_', ' ')}
                            </Badge>
                          ))}
                          {workflow.connectors.length > 4 && (
                            <Badge variant="outline" className="text-xs">
                              +{workflow.connectors.length - 4}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 ml-6">
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className={workflow.active ? 'hover:bg-yellow-50' : 'hover:bg-green-50'}
                      >
                        {workflow.active ? (
                          <Pause className="w-4 h-4" />
                        ) : (
                          <Play className="w-4 h-4" />
                        )}
                      </Button>
                      <Button variant="outline" size="sm" className="hover:bg-red-50">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                      <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600">
                        Ver detalles
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Empty State */}
            {workflows.length === 0 && (
              <Card className="border-2 border-dashed">
                <CardContent className="p-12 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Zap className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    No tienes workflows todavía
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Crea tu primera automatización con IA en lenguaje natural
                  </p>
                  <Button 
                    onClick={() => setView('create')}
                    className="bg-gradient-to-r from-blue-600 to-purple-600"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Crear mi primer workflow
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

