'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Video, 
  Play, 
  Pause, 
  Download, 
  Share, 
  Zap, 
  Clock, 
  Users, 
  Target,
  TrendingUp,
  Brain,
  Image,
  Type,
  Palette,
  Music,
  Sparkles,
  Loader2,
  CheckCircle,
  AlertCircle,
  Calendar
} from 'lucide-react'

interface VideoTemplate {
  id: string
  name: string
  description: string
  category: 'marketing' | 'education' | 'social' | 'presentation' | 'promo'
  duration: string
  thumbnail: string
  price: number
  features: string[]
}

interface GeneratedVideo {
  id: string
  title: string
  status: 'generating' | 'ready' | 'error'
  progress: number
  thumbnail: string
  duration: string
  size: string
  createdAt: Date
  template?: VideoTemplate
}

export default function VideoGenerator() {
  const [prompt, setPrompt] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState<VideoTemplate | null>(null)
  const [generatedVideos, setGeneratedVideos] = useState<GeneratedVideo[]>([])
  const [isGenerating, setIsGenerating] = useState(false)

  const templates: VideoTemplate[] = [
    {
      id: '1',
      name: 'Anuncio de Producto',
      description: 'Video promocional dinámico con efectos visuales y música de fondo',
      category: 'marketing',
      duration: '30 segundos',
      thumbnail: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=300&h=200&fit=crop',
      price: 25,
      features: ['Texto animado', 'Música de fondo', 'Transiciones suaves', 'Logo integrado']
    },
    {
      id: '2',
      name: 'Tutorial Educativo',
      description: 'Video explicativo con narración y capturas de pantalla',
      category: 'education',
      duration: '2 minutos',
      thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=200&fit=crop',
      price: 35,
      features: ['Narración IA', 'Capturas de pantalla', 'Subtítulos', 'Música suave']
    },
    {
      id: '3',
      name: 'Post de Redes Sociales',
      description: 'Video corto optimizado para Instagram, TikTok y YouTube Shorts',
      category: 'social',
      duration: '15 segundos',
      thumbnail: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=300&h=200&fit=crop',
      price: 20,
      features: ['Formato vertical', 'Efectos visuales', 'Texto sobre imagen', 'Hashtags animados']
    },
    {
      id: '4',
      name: 'Presentación Corporativa',
      description: 'Video profesional para presentaciones empresariales',
      category: 'presentation',
      duration: '3 minutos',
      thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=300&h=200&fit=crop',
      price: 45,
      features: ['Diseño corporativo', 'Gráficos animados', 'Música profesional', 'Logo y branding']
    }
  ]

  const handleGenerateVideo = async () => {
    if (!prompt.trim() || !selectedTemplate) return

    setIsGenerating(true)
    
    const newVideo: GeneratedVideo = {
      id: Date.now().toString(),
      title: prompt.substring(0, 50) + (prompt.length > 50 ? '...' : ''),
      status: 'generating',
      progress: 0,
      thumbnail: selectedTemplate.thumbnail,
      duration: selectedTemplate.duration,
      size: '0 MB',
      createdAt: new Date(),
      template: selectedTemplate
    }

    setGeneratedVideos(prev => [newVideo, ...prev])

    // Simular generación de video con progreso
    const interval = setInterval(() => {
      setGeneratedVideos(prev => prev.map(video => {
        if (video.id === newVideo.id && video.status === 'generating') {
          const newProgress = Math.min(video.progress + Math.random() * 15, 100)
          
          if (newProgress >= 100) {
            clearInterval(interval)
            setIsGenerating(false)
            return {
              ...video,
              progress: 100,
              status: 'ready',
              size: `${(Math.random() * 50 + 10).toFixed(1)} MB`
            }
          }
          
          return { ...video, progress: newProgress }
        }
        return video
      }))
    }, 500)
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      marketing: 'bg-purple-100 text-purple-800',
      education: 'bg-blue-100 text-blue-800',
      social: 'bg-pink-100 text-pink-800',
      presentation: 'bg-green-100 text-green-800',
      promo: 'bg-orange-100 text-orange-800'
    }
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const getStatusColor = (status: string) => {
    const colors = {
      generating: 'bg-blue-100 text-blue-800',
      ready: 'bg-green-100 text-green-800',
      error: 'bg-red-100 text-red-800'
    }
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'generating': return <Loader2 className="h-4 w-4 animate-spin" />
      case 'ready': return <CheckCircle className="h-4 w-4" />
      case 'error': return <AlertCircle className="h-4 w-4" />
      default: return <Video className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Video Generation Form */}
      <Card className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/20">
        <CardHeader>
          <CardTitle className="flex items-center text-purple-600">
            <Video className="h-6 w-6 mr-2" />
            Generador de Video con IA
          </CardTitle>
          <p className="text-gray-600">
            Crea videos profesionales automáticamente usando inteligencia artificial. 
            Describe lo que quieres y la IA genera el video completo.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Prompt Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Describe tu video:
            </label>
            <Input
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ej: Un video promocional de 30 segundos para mi nuevo producto de tecnología, con música energética y efectos visuales modernos"
              className="w-full"
            />
            <p className="text-xs text-gray-500 mt-1">
              Sé específico sobre el estilo, duración, música y elementos visuales que quieres
            </p>
          </div>

          {/* Template Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              Selecciona una plantilla:
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {templates.map((template) => (
                <div
                  key={template.id}
                  className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                    selectedTemplate?.id === template.id
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedTemplate(template)}
                >
                  <div className="flex items-start space-x-3">
                    <img
                      src={template.thumbnail}
                      alt={template.name}
                      className="w-16 h-12 rounded object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-semibold text-gray-900">{template.name}</h4>
                        <Badge className={getCategoryColor(template.category)}>
                          {template.category}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{template.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {template.duration}
                          </span>
                          <span className="flex items-center">
                            <Zap className="h-3 w-3 mr-1" />
                            {template.features.length} características
                          </span>
                        </div>
                        <span className="text-sm font-semibold text-green-600">
                          ${template.price}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <Button
            onClick={handleGenerateVideo}
            disabled={!prompt.trim() || !selectedTemplate || isGenerating}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generando Video...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Generar Video con IA
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Generated Videos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Video className="h-5 w-5 mr-2" />
            Videos Generados
          </CardTitle>
        </CardHeader>
        <CardContent>
          {generatedVideos.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Video className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No hay videos generados aún.</p>
              <p className="text-sm">Crea tu primer video usando el generador de IA.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {generatedVideos.map((video) => (
                <div key={video.id} className="border rounded-lg p-4">
                  <div className="flex items-start space-x-4">
                    <div className="relative">
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-24 h-16 rounded object-cover"
                      />
                      {video.status === 'generating' && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 rounded flex items-center justify-center">
                          <div className="text-white text-xs text-center">
                            <div className="font-semibold">{video.progress.toFixed(0)}%</div>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-900">{video.title}</h4>
                        <Badge className={getStatusColor(video.status)}>
                          {getStatusIcon(video.status)}
                          <span className="ml-1">{video.status}</span>
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {video.duration}
                        </div>
                        <div className="flex items-center">
                          <Video className="h-4 w-4 mr-1" />
                          {video.size}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {video.createdAt.toLocaleDateString()}
                        </div>
                        {video.template && (
                          <div className="flex items-center">
                            <Type className="h-4 w-4 mr-1" />
                            {video.template.name}
                          </div>
                        )}
                      </div>

                      {video.status === 'generating' && (
                        <div className="mb-3">
                          <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                            <span>Progreso</span>
                            <span>{video.progress.toFixed(0)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${video.progress}%` }}
                            />
                          </div>
                        </div>
                      )}

                      <div className="flex space-x-2">
                        {video.status === 'ready' && (
                          <>
                            <Button size="sm">
                              <Play className="h-4 w-4 mr-2" />
                              Reproducir
                            </Button>
                            <Button size="sm" variant="outline">
                              <Download className="h-4 w-4 mr-2" />
                              Descargar
                            </Button>
                            <Button size="sm" variant="outline">
                              <Share className="h-4 w-4 mr-2" />
                              Compartir
                            </Button>
                          </>
                        )}
                        {video.status === 'generating' && (
                          <Button size="sm" variant="outline" disabled>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Generando...
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* AI Features */}
      <Card className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border-blue-500/20">
        <CardHeader>
          <CardTitle className="flex items-center text-blue-600">
            <Brain className="h-6 w-6 mr-2" />
            Características de IA Avanzadas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-white rounded-lg border">
              <Image className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <h4 className="font-semibold text-gray-900">Generación de Imágenes</h4>
              <p className="text-xs text-gray-600">IA crea imágenes personalizadas</p>
            </div>
            <div className="text-center p-4 bg-white rounded-lg border">
              <Type className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <h4 className="font-semibold text-gray-900">Texto Animado</h4>
              <p className="text-xs text-gray-600">Efectos de texto automáticos</p>
            </div>
            <div className="text-center p-4 bg-white rounded-lg border">
              <Music className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <h4 className="font-semibold text-gray-900">Música de Fondo</h4>
              <p className="text-xs text-gray-600">Sintonización automática</p>
            </div>
            <div className="text-center p-4 bg-white rounded-lg border">
              <Palette className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <h4 className="font-semibold text-gray-900">Paleta de Colores</h4>
              <p className="text-xs text-gray-600">Coordinación automática</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
