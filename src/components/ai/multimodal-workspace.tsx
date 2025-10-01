'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import VoiceControl from './voice-control'
import VideoGenerator from './video-generator'
import ImageProcessor from './image-processor'
import { 
  Mic, 
  Video, 
  Image, 
  Zap, 
  Brain, 
  Sparkles, 
  Layers,
  Workflow,
  MessageSquare,
  Eye,
  Play,
  Pause,
  Download,
  Share,
  Target,
  TrendingUp,
  Users,
  Clock,
  CheckCircle,
  Activity
} from 'lucide-react'

interface MultimodalWorkflow {
  id: string
  name: string
  type: 'voice-to-video' | 'image-to-video' | 'voice-to-image' | 'mixed-media'
  status: 'active' | 'paused' | 'completed'
  elements: {
    voice?: string
    image?: string
    video?: string
    text?: string
  }
  createdAt: Date
  progress: number
}

export default function MultimodalWorkspace() {
  const [activeTab, setActiveTab] = useState('voice')
  const [workflows, setWorkflows] = useState<MultimodalWorkflow[]>([])
  const [isCreating, setIsCreating] = useState(false)

  const createMultimodalWorkflow = (type: string) => {
    setIsCreating(true)
    
    const workflow: MultimodalWorkflow = {
      id: Date.now().toString(),
      name: `Workflow Multimodal ${type}`,
      type: type as any,
      status: 'active',
      elements: {},
      createdAt: new Date(),
      progress: 0
    }

    setWorkflows(prev => [workflow, ...prev])
    
    // Simular creación de workflow
    setTimeout(() => {
      setIsCreating(false)
      setWorkflows(prev => prev.map(w => 
        w.id === workflow.id 
          ? { ...w, progress: 100, status: 'completed' }
          : w
      ))
    }, 3000)
  }

  const getStatusColor = (status: string) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      paused: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-blue-100 text-blue-800'
    }
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'voice-to-video': return <Video className="h-4 w-4" />
      case 'image-to-video': return <Image className="h-4 w-4" />
      case 'voice-to-image': return <Mic className="h-4 w-4" />
      case 'mixed-media': return <Layers className="h-4 w-4" />
      default: return <Workflow className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center justify-center">
          <Brain className="h-8 w-8 mr-3 text-purple-600" />
          Espacio de Trabajo Multimodal
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Combina voz, imagen y video en workflows inteligentes. 
          La IA procesa múltiples formatos de medios simultáneamente para crear contenido único.
        </p>
      </div>

      {/* Quick Actions */}
      <Card className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/20">
        <CardHeader>
          <CardTitle className="flex items-center text-purple-600">
            <Sparkles className="h-6 w-6 mr-2" />
            Crear Workflow Multimodal
          </CardTitle>
          <p className="text-gray-600">
            Combina diferentes tipos de medios para crear automatizaciones avanzadas
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button
              onClick={() => createMultimodalWorkflow('voice-to-video')}
              disabled={isCreating}
              className="h-20 flex-col bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
            >
              <Mic className="h-6 w-6 mb-2" />
              <span className="text-sm">Voz → Video</span>
            </Button>
            
            <Button
              onClick={() => createMultimodalWorkflow('image-to-video')}
              disabled={isCreating}
              className="h-20 flex-col bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
            >
              <Image className="h-6 w-6 mb-2" />
              <span className="text-sm">Imagen → Video</span>
            </Button>
            
            <Button
              onClick={() => createMultimodalWorkflow('voice-to-image')}
              disabled={isCreating}
              className="h-20 flex-col bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
            >
              <MessageSquare className="h-6 w-6 mb-2" />
              <span className="text-sm">Voz → Imagen</span>
            </Button>
            
            <Button
              onClick={() => createMultimodalWorkflow('mixed-media')}
              disabled={isCreating}
              className="h-20 flex-col bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
            >
              <Layers className="h-6 w-6 mb-2" />
              <span className="text-sm">Medios Mixtos</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="voice" className="flex items-center">
            <Mic className="h-4 w-4 mr-2" />
            Control por Voz
          </TabsTrigger>
          <TabsTrigger value="video" className="flex items-center">
            <Video className="h-4 w-4 mr-2" />
            Generador de Video
          </TabsTrigger>
          <TabsTrigger value="image" className="flex items-center">
            <Image className="h-4 w-4 mr-2" />
            Procesador de Imágenes
          </TabsTrigger>
          <TabsTrigger value="workflows" className="flex items-center">
            <Workflow className="h-4 w-4 mr-2" />
            Workflows
          </TabsTrigger>
        </TabsList>

        <TabsContent value="voice" className="space-y-4">
          <VoiceControl />
        </TabsContent>

        <TabsContent value="video" className="space-y-4">
          <VideoGenerator />
        </TabsContent>

        <TabsContent value="image" className="space-y-4">
          <ImageProcessor />
        </TabsContent>

        <TabsContent value="workflows" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Workflow className="h-5 w-5 mr-2" />
                Workflows Multimodales Activos
              </CardTitle>
            </CardHeader>
            <CardContent>
              {workflows.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Layers className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No hay workflows multimodales creados aún.</p>
                  <p className="text-sm">Usa los botones de arriba para crear tu primer workflow.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {workflows.map((workflow) => (
                    <div key={workflow.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          {getTypeIcon(workflow.type)}
                          <div>
                            <h4 className="font-semibold text-gray-900">{workflow.name}</h4>
                            <p className="text-sm text-gray-600">
                              Tipo: {workflow.type.replace('-', ' → ')}
                            </p>
                          </div>
                        </div>
                        <Badge className={getStatusColor(workflow.status)}>
                          {workflow.status}
                        </Badge>
                      </div>

                      {workflow.status === 'active' && workflow.progress < 100 && (
                        <div className="mb-3">
                          <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                            <span>Progreso</span>
                            <span>{workflow.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${workflow.progress}%` }}
                            />
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <div className="flex space-x-2">
                          {workflow.status === 'completed' && (
                            <>
                              <Button size="sm">
                                <Play className="h-4 w-4 mr-2" />
                                Ejecutar
                              </Button>
                              <Button size="sm" variant="outline">
                                <Download className="h-4 w-4 mr-2" />
                                Exportar
                              </Button>
                              <Button size="sm" variant="outline">
                                <Share className="h-4 w-4 mr-2" />
                                Compartir
                              </Button>
                            </>
                          )}
                          {workflow.status === 'active' && (
                            <Button size="sm" variant="outline">
                              <Pause className="h-4 w-4 mr-2" />
                              Pausar
                            </Button>
                          )}
                        </div>
                        <div className="text-xs text-gray-500">
                          Creado: {workflow.createdAt.toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-blue-500/10 to-blue-600/10">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {workflows.filter(w => w.status === 'active').length}
            </div>
            <div className="text-sm text-gray-600">Workflows Activos</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-green-500/10 to-green-600/10">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {workflows.filter(w => w.status === 'completed').length}
            </div>
            <div className="text-sm text-gray-600">Completados</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-purple-500/10 to-purple-600/10">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">4</div>
            <div className="text-sm text-gray-600">Tipos de Media</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-orange-500/10 to-orange-600/10">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">24/7</div>
            <div className="text-sm text-gray-600">Procesamiento IA</div>
          </CardContent>
        </Card>
      </div>

      {/* AI Features */}
      <Card className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border-indigo-500/20">
        <CardHeader>
          <CardTitle className="flex items-center text-indigo-600">
            <Brain className="h-6 w-6 mr-2" />
            Capacidades Multimodales de IA
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Procesamiento Simultáneo:</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Reconocimiento de voz en tiempo real
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Generación de video con IA
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Procesamiento de imágenes automático
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Sincronización de múltiples medios
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Integración Inteligente:</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Workflows que combinan voz + video + imagen
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Análisis de contenido contextual
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Optimización automática de calidad
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Exportación en múltiples formatos
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
