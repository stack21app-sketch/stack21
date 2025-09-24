'use client'

import { useEffect, useState, useContext } from 'react'
import { I18nContext } from '@/lib/i18n'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Plus, 
  Play, 
  Pause, 
  Settings, 
  MoreVertical,
  Zap,
  Brain,
  Clock,
  CheckCircle,
  AlertCircle,
  BarChart3,
  Users,
  Globe,
  Mail,
  Calendar,
  FileText,
  Image,
  Music,
  Video,
  Database,
  MessageSquare,
  CreditCard,
  Smartphone,
  Workflow,
  Sparkles
} from 'lucide-react'

interface WorkflowItem {
  id: string
  name: string
  description?: string
  status: 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'ARCHIVED'
  isActive: boolean
  nodes: any
  connections: any
  createdAt: string
  updatedAt: string
}

export default function WorkflowsPage() {
  const { t } = useContext(I18nContext)
  const [workflows, setWorkflows] = useState<WorkflowItem[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newName, setNewName] = useState('')
  const [newDescription, setNewDescription] = useState('')

  const fetchWorkflows = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/workflows', { cache: 'no-store' })
      const data = await res.json()
      setWorkflows(data.workflows || [])
    } catch (e) {
      console.error('Error cargando workflows', e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchWorkflows()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800 border-green-200'
      case 'PAUSED': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'DRAFT': return 'bg-gray-100 text-gray-800 border-gray-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'Activo'
      case 'PAUSED': return 'Pausado'
      case 'DRAFT': return 'Borrador'
      default: return 'Desconocido'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleCreate = async () => {
    try {
      const res = await fetch('/api/workflows', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ name: newName, description: newDescription, nodes: [], connections: [] })
      })
      if (!res.ok) {
        const msg = await res.text()
        if (res.status === 401) {
          alert('Tu sesión expiró. Por favor inicia sesión de nuevo.')
          window.location.assign('/auth/signin')
          return
        }
        throw new Error(msg || 'Error creando workflow')
      }
      setShowCreateModal(false)
      setNewName('')
      setNewDescription('')
      await fetchWorkflows()
    } catch (e) {
      console.error(e)
      alert('No se pudo crear el workflow')
    }
  }

  const handleRun = async (id: string) => {
    try {
      const res = await fetch(`/api/workflows/${id}/run`, { method: 'POST' })
      if (!res.ok) throw new Error('Error ejecutando workflow')
      const data = await res.json()
      alert('Ejecución iniciada. Duración: ' + (data.run?.duration ?? 'N/A') + 'ms')
    } catch (e) {
      console.error(e)
      alert('No se pudo ejecutar el workflow')
    }
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('workflows')}</h1>
          <p className="text-gray-600 mt-2">
            Automatiza tu negocio con workflows inteligentes impulsados por IA
          </p>
        </div>
        <Button
          onClick={() => setShowCreateModal(true)}
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
        >
          <Plus className="h-4 w-4 mr-2" />
          Crear Workflow
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Workflow className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Workflows</p>
                <p className="text-2xl font-bold text-gray-900">{workflows.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Play className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Activos</p>
                <p className="text-2xl font-bold text-gray-900">
                  {workflows.filter(w => w.status === 'ACTIVE').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Brain className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Con IA</p>
                <p className="text-2xl font-bold text-gray-900">
                  {workflows.filter(w => Array.isArray(w.nodes) && w.nodes.length > 0).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Zap className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Ejecuciones</p>
                <p className="text-2xl font-bold text-gray-900">
                  {workflows.length.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Workflows List */}
      <div className="space-y-4">
        {workflows.map((workflow) => (
          <Card key={workflow.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{workflow.name}</h3>
                    <Badge className={getStatusColor(workflow.status)}>
                      {getStatusText(workflow.status)}
                    </Badge>
                    {Array.isArray(workflow.nodes) && workflow.nodes.length > 0 && (
                      <Badge className="bg-purple-100 text-purple-800 border-purple-200">
                        <Brain className="h-3 w-3 mr-1" />
                        IA
                      </Badge>
                    )}
                  </div>
                  
                  <p className="text-gray-600 mb-4">{workflow.description}</p>
                  
                  <div className="flex items-center space-x-6 text-sm text-gray-500">
                    <div className="flex items-center">
                      <BarChart3 className="h-4 w-4 mr-1" />
                      {Array.isArray(workflow.nodes) ? workflow.nodes.length : 0} nodos
                    </div>
                    <div className="flex items-center">
                      <Workflow className="h-4 w-4 mr-1" />
                      Creado: {formatDate(workflow.createdAt)}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" onClick={() => handleRun(workflow.id)}>
                    <Play className="h-4 w-4 mr-1" />
                    Ejecutar
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => location.assign(`/dashboard/workflows/builder?id=${workflow.id}`)}>
                    <Settings className="h-4 w-4 mr-1" />
                    Editar
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {workflows.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Workflow className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No tienes workflows aún
            </h3>
            <p className="text-gray-600 mb-6">
              Crea tu primer workflow para automatizar tu negocio con IA
            </p>
            <Button
              onClick={() => setShowCreateModal(true)}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              <Plus className="h-4 w-4 mr-2" />
              Crear mi primer workflow
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Crear Nuevo Workflow</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowCreateModal(false)}
                >
                  ✕
                </Button>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre del Workflow
                  </label>
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Ej: Procesamiento de Leads con IA"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descripción
                  </label>
                  <textarea
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    rows={3}
                    placeholder="Describe qué hace este workflow..."
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    variant="outline"
                    onClick={() => setShowCreateModal(false)}
                  >
                    Cancelar
                  </Button>
                  <Button
                    disabled={!newName.trim()}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                    onClick={handleCreate}
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    Crear con IA
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}