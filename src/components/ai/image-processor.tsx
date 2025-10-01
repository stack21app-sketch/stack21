'use client'

import { useState, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Image, 
  Upload, 
  Download, 
  Zap, 
  Sparkles, 
  Eye, 
  Edit, 
  Palette, 
  Crop, 
  RotateCw,
  Filter,
  Type,
  Brain,
  Loader2,
  CheckCircle,
  AlertCircle,
  Wand2,
  Layers,
  Scissors,
  Maximize,
  Clock,
  X
} from 'lucide-react'

interface ImageProcessingTask {
  id: string
  name: string
  type: 'upscale' | 'enhance' | 'background-remove' | 'style-transfer' | 'object-detect' | 'text-extract'
  status: 'processing' | 'completed' | 'error'
  progress: number
  originalImage?: string
  processedImage?: string
  result?: any
  createdAt: Date
}

export default function ImageProcessor() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>('')
  const [processingTasks, setProcessingTasks] = useState<ImageProcessingTask[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const processingTypes = [
    {
      id: 'upscale',
      name: 'Mejorar Resolución',
      description: 'Aumenta la resolución usando IA hasta 4K',
      icon: Maximize,
      color: 'blue',
      estimatedTime: '2-3 min'
    },
    {
      id: 'enhance',
      name: 'Mejorar Calidad',
      description: 'Corrige colores, brillo y nitidez automáticamente',
      icon: Sparkles,
      color: 'purple',
      estimatedTime: '1-2 min'
    },
    {
      id: 'background-remove',
      name: 'Quitar Fondo',
      description: 'Elimina el fondo automáticamente con precisión',
      icon: Scissors,
      color: 'green',
      estimatedTime: '30 seg'
    },
    {
      id: 'style-transfer',
      name: 'Transferir Estilo',
      description: 'Aplica estilos artísticos usando IA',
      icon: Palette,
      color: 'pink',
      estimatedTime: '3-5 min'
    },
    {
      id: 'object-detect',
      name: 'Detectar Objetos',
      description: 'Identifica y etiqueta objetos en la imagen',
      icon: Eye,
      color: 'orange',
      estimatedTime: '1 min'
    },
    {
      id: 'text-extract',
      name: 'Extraer Texto',
      description: 'Extrae texto de imágenes usando OCR',
      icon: Type,
      color: 'indigo',
      estimatedTime: '30 seg'
    }
  ]

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedImage(file)
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    }
  }

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault()
    const file = event.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file)
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    }
  }

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault()
  }

  const processImage = async (type: string) => {
    if (!selectedImage) return

    setIsProcessing(true)
    
    const task: ImageProcessingTask = {
      id: Date.now().toString(),
      name: `Procesamiento ${type}`,
      type: type as any,
      status: 'processing',
      progress: 0,
      originalImage: previewUrl,
      createdAt: new Date()
    }

    setProcessingTasks(prev => [task, ...prev])

    // Simular procesamiento
    const interval = setInterval(() => {
      setProcessingTasks(prev => prev.map(t => {
        if (t.id === task.id && t.status === 'processing') {
          const newProgress = Math.min(t.progress + Math.random() * 20, 100)
          
          if (newProgress >= 100) {
            clearInterval(interval)
            setIsProcessing(false)
            return {
              ...t,
              progress: 100,
              status: 'completed',
              processedImage: previewUrl, // En producción sería la imagen procesada
              result: generateMockResult(type)
            }
          }
          
          return { ...t, progress: newProgress }
        }
        return t
      }))
    }, 500)
  }

  const generateMockResult = (type: string) => {
    switch (type) {
      case 'upscale':
        return { originalSize: '1024x768', newSize: '4096x3072', improvement: '400%' }
      case 'enhance':
        return { brightness: '+15%', contrast: '+20%', saturation: '+10%', sharpness: '+25%' }
      case 'background-remove':
        return { confidence: '98%', pixelsRemoved: '2.3M', edgesDetected: '1,247' }
      case 'style-transfer':
        return { style: 'Van Gogh', intensity: '85%', processingLayers: '47' }
      case 'object-detect':
        return { objects: ['persona', 'coche', 'edificio'], confidence: '94%', boundingBoxes: 3 }
      case 'text-extract':
        return { text: 'Texto extraído de la imagen', confidence: '97%', words: 5 }
      default:
        return {}
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'processing': return <Loader2 className="h-4 w-4 animate-spin" />
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'error': return <AlertCircle className="h-4 w-4 text-red-500" />
      default: return <Image className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'processing': return 'bg-blue-100 text-blue-800'
      case 'completed': return 'bg-green-100 text-green-800'
      case 'error': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getColorClass = (color: string) => {
    const colors = {
      blue: 'bg-blue-100 text-blue-800 border-blue-200',
      purple: 'bg-purple-100 text-purple-800 border-purple-200',
      green: 'bg-green-100 text-green-800 border-green-200',
      pink: 'bg-pink-100 text-pink-800 border-pink-200',
      orange: 'bg-orange-100 text-orange-800 border-orange-200',
      indigo: 'bg-indigo-100 text-indigo-800 border-indigo-200'
    }
    return colors[color as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200'
  }

  return (
    <div className="space-y-6">
      {/* Image Upload */}
      <Card className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border-green-500/20">
        <CardHeader>
          <CardTitle className="flex items-center text-green-600">
            <Image className="h-6 w-6 mr-2" />
            Procesador de Imágenes con IA
          </CardTitle>
          <p className="text-gray-600">
            Sube una imagen y usa IA para mejorarla, procesarla o extraer información automáticamente.
          </p>
        </CardHeader>
        <CardContent>
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            {previewUrl ? (
              <div className="space-y-4">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="max-w-full max-h-64 mx-auto rounded-lg shadow-lg"
                />
                <div className="flex items-center justify-center space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Cambiar Imagen
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedImage(null)
                      setPreviewUrl('')
                    }}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Limpiar
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <Image className="h-16 w-16 text-gray-400 mx-auto" />
                <div>
                  <p className="text-lg font-semibold text-gray-900">
                    Arrastra una imagen aquí o haz clic para seleccionar
                  </p>
                  <p className="text-gray-500">
                    Soporta JPG, PNG, WebP hasta 10MB
                  </p>
                </div>
                <Button onClick={() => fileInputRef.current?.click()}>
                  <Upload className="h-4 w-4 mr-2" />
                  Seleccionar Imagen
                </Button>
              </div>
            )}
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
            />
          </div>
        </CardContent>
      </Card>

      {/* Processing Options */}
      {selectedImage && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Wand2 className="h-5 w-5 mr-2" />
              Opciones de Procesamiento con IA
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {processingTypes.map((type) => {
                const Icon = type.icon
                return (
                  <div
                    key={type.id}
                    className={`border rounded-lg p-4 hover:shadow-md transition-all cursor-pointer ${getColorClass(type.color)}`}
                    onClick={() => processImage(type.id)}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <Icon className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold mb-1">{type.name}</h4>
                        <p className="text-sm opacity-80 mb-2">{type.description}</p>
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className="text-xs">
                            <Clock className="h-3 w-3 mr-1" />
                            {type.estimatedTime}
                          </Badge>
                          <Button size="sm" variant="ghost" className="h-6 px-2">
                            <Zap className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Processing Tasks */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Layers className="h-5 w-5 mr-2" />
            Tareas de Procesamiento
          </CardTitle>
        </CardHeader>
        <CardContent>
          {processingTasks.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No hay tareas de procesamiento aún.</p>
              <p className="text-sm">Sube una imagen y selecciona una opción de procesamiento.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {processingTasks.map((task) => (
                <div key={task.id} className="border rounded-lg p-4">
                  <div className="flex items-start space-x-4">
                    {task.originalImage && (
                      <img
                        src={task.originalImage}
                        alt="Original"
                        className="w-16 h-12 rounded object-cover"
                      />
                    )}
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-900">{task.name}</h4>
                        <Badge className={getStatusColor(task.status)}>
                          {getStatusIcon(task.status)}
                          <span className="ml-1">{task.status}</span>
                        </Badge>
                      </div>
                      
                      {task.status === 'processing' && (
                        <div className="mb-3">
                          <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                            <span>Progreso</span>
                            <span>{task.progress.toFixed(0)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-green-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${task.progress}%` }}
                            />
                          </div>
                        </div>
                      )}

                      {task.status === 'completed' && task.result && (
                        <div className="mb-3">
                          <h5 className="text-sm font-semibold text-gray-900 mb-2">Resultados:</h5>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            {Object.entries(task.result).map(([key, value]) => (
                              <div key={key} className="flex justify-between">
                                <span className="text-gray-600">{key}:</span>
                                <span className="font-medium">{String(value)}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex space-x-2">
                        {task.status === 'completed' && (
                          <>
                            <Button size="sm">
                              <Eye className="h-4 w-4 mr-2" />
                              Ver Resultado
                            </Button>
                            <Button size="sm" variant="outline">
                              <Download className="h-4 w-4 mr-2" />
                              Descargar
                            </Button>
                          </>
                        )}
                        {task.status === 'processing' && (
                          <Button size="sm" variant="outline" disabled>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Procesando...
                          </Button>
                        )}
                      </div>

                      <div className="text-xs text-gray-500 mt-2">
                        Iniciado: {task.createdAt.toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* AI Capabilities */}
      <Card className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border-indigo-500/20">
        <CardHeader>
          <CardTitle className="flex items-center text-indigo-600">
            <Brain className="h-6 w-6 mr-2" />
            Capacidades de IA Avanzadas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900">Procesamiento Visual:</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Reconocimiento de objetos y personas
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Extracción de texto (OCR) en múltiples idiomas
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Mejora automática de calidad
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Transferencia de estilos artísticos
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900">Optimización:</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Aumento de resolución hasta 4K
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Eliminación de fondo precisa
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Corrección automática de colores
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Reducción de ruido y mejora de nitidez
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
