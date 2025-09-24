'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { 
  Image, 
  Wand2, 
  Download, 
  RefreshCw, 
  Sparkles,
  Palette,
  Settings,
  Loader2
} from 'lucide-react'

export default function GenerateImagePage() {
  const params = useParams()
  const { data: session } = useSession()
  const slug = params.slug as string

  const [prompt, setPrompt] = useState('')
  const [style, setStyle] = useState('realistic')
  const [size, setSize] = useState('1024x1024')
  const [quality, setQuality] = useState('standard')
  const [loading, setLoading] = useState(false)
  const [generatedImages, setGeneratedImages] = useState<string[]>([])
  const [error, setError] = useState('')

  const styles = [
    { id: 'realistic', name: 'Realista', icon: '🎨' },
    { id: 'artistic', name: 'Artístico', icon: '🖼️' },
    { id: 'anime', name: 'Anime', icon: '🎌' },
    { id: 'pixel', name: 'Pixel Art', icon: '🎮' },
    { id: 'abstract', name: 'Abstracto', icon: '🌈' },
    { id: 'photographic', name: 'Fotográfico', icon: '📸' }
  ]

  const sizes = [
    { id: '512x512', name: '512x512', desc: 'Rápido' },
    { id: '1024x1024', name: '1024x1024', desc: 'Estándar' },
    { id: '1792x1024', name: '1792x1024', desc: 'Wide' },
    { id: '1024x1792', name: '1024x1792', desc: 'Alto' }
  ]

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Por favor ingresa un prompt para generar la imagen')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: `${prompt}, ${styles.find(s => s.id === style)?.name} style`,
          size,
          quality,
          n: 1
        }),
      })

      if (!response.ok) {
        throw new Error('Error al generar la imagen')
      }

      const data = await response.json()
      setGeneratedImages(prev => [...prev, data.imageUrl])
    } catch (err: any) {
      setError(err.message || 'Error al generar la imagen')
    } finally {
      setLoading(false)
    }
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white">No autorizado</h2>
          <p className="text-gray-300">Debes iniciar sesión para generar imágenes</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center">
            <Image className="h-8 w-8 text-cyan-400 mr-3" />
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Generador de Imágenes IA
              </h1>
              <p className="text-sm text-gray-300">Crea imágenes increíbles con inteligencia artificial</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Generator Panel */}
          <Card className="bg-black/20 backdrop-blur-lg border-white/10">
            <CardHeader>
              <CardTitle className="text-xl text-white flex items-center">
                <Wand2 className="h-6 w-6 mr-2 text-purple-400" />
                Generar Imagen
              </CardTitle>
              <CardDescription className="text-gray-400">
                Describe la imagen que quieres crear
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {error && (
                <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="prompt" className="text-white">Descripción de la imagen</Label>
                <Textarea
                  id="prompt"
                  placeholder="Un gato astronauta flotando en el espacio con estrellas de fondo..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="bg-black/20 border-white/20 text-white placeholder-gray-400"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-white">Estilo artístico</Label>
                <div className="grid grid-cols-2 gap-2">
                  {styles.map((styleOption) => (
                    <Button
                      key={styleOption.id}
                      variant={style === styleOption.id ? "default" : "outline"}
                      onClick={() => setStyle(styleOption.id)}
                      className={`justify-start ${
                        style === styleOption.id 
                          ? 'bg-purple-600 hover:bg-purple-700' 
                          : 'border-white/20 text-white hover:bg-white/10'
                      }`}
                    >
                      <span className="mr-2">{styleOption.icon}</span>
                      {styleOption.name}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-white">Tamaño de imagen</Label>
                <div className="grid grid-cols-2 gap-2">
                  {sizes.map((sizeOption) => (
                    <Button
                      key={sizeOption.id}
                      variant={size === sizeOption.id ? "default" : "outline"}
                      onClick={() => setSize(sizeOption.id)}
                      className={`justify-start ${
                        size === sizeOption.id 
                          ? 'bg-blue-600 hover:bg-blue-700' 
                          : 'border-white/20 text-white hover:bg-white/10'
                      }`}
                    >
                      {sizeOption.name}
                      <Badge variant="outline" className="ml-2 text-xs">
                        {sizeOption.desc}
                      </Badge>
                    </Button>
                  ))}
                </div>
              </div>

              <Button 
                onClick={handleGenerate} 
                disabled={loading || !prompt.trim()}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 border-0"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4 mr-2" />
                )}
                {loading ? 'Generando...' : 'Generar Imagen'}
              </Button>
            </CardContent>
          </Card>

          {/* Generated Images */}
          <Card className="bg-black/20 backdrop-blur-lg border-white/10">
            <CardHeader>
              <CardTitle className="text-xl text-white flex items-center">
                <Palette className="h-6 w-6 mr-2 text-pink-400" />
                Imágenes Generadas
              </CardTitle>
              <CardDescription className="text-gray-400">
                Tus creaciones aparecerán aquí
              </CardDescription>
            </CardHeader>
            <CardContent>
              {generatedImages.length === 0 ? (
                <div className="text-center py-12">
                  <Image className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400">Aún no has generado ninguna imagen</p>
                  <p className="text-sm text-gray-500">Usa el panel de la izquierda para crear tu primera imagen</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {generatedImages.map((imageUrl, index) => (
                    <div key={index} className="relative group">
                      <img 
                        src={imageUrl} 
                        alt={`Imagen generada ${index + 1}`}
                        className="w-full rounded-lg border border-white/20"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                        <Button size="sm" className="bg-white/20 hover:bg-white/30">
                          <Download className="h-4 w-4 mr-2" />
                          Descargar
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
