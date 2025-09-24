'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { 
  FileText, 
  Wand2, 
  Copy, 
  Download,
  Sparkles,
  Loader2,
  RefreshCw,
  Save,
  Eye,
  Edit3
} from 'lucide-react'

export default function TextEditorPage() {
  const params = useParams()
  const { data: session } = useSession()
  const slug = params.slug as string

  const [content, setContent] = useState('')
  const [aiPrompt, setAiPrompt] = useState('')
  const [loading, setLoading] = useState(false)
  const [generatedText, setGeneratedText] = useState('')
  const [textType, setTextType] = useState('article')
  const [tone, setTone] = useState('professional')
  const [wordCount, setWordCount] = useState(500)

  const textTypes = [
    { id: 'article', name: 'Artículo', icon: '📰' },
    { id: 'blog', name: 'Blog Post', icon: '📝' },
    { id: 'email', name: 'Email', icon: '📧' },
    { id: 'social', name: 'Red Social', icon: '📱' },
    { id: 'ad', name: 'Anuncio', icon: '📢' },
    { id: 'story', name: 'Historia', icon: '📚' }
  ]

  const tones = [
    { id: 'professional', name: 'Profesional', color: 'bg-blue-500' },
    { id: 'casual', name: 'Casual', color: 'bg-green-500' },
    { id: 'formal', name: 'Formal', color: 'bg-gray-500' },
    { id: 'friendly', name: 'Amigable', color: 'bg-yellow-500' },
    { id: 'persuasive', name: 'Persuasivo', color: 'bg-red-500' },
    { id: 'creative', name: 'Creativo', color: 'bg-purple-500' }
  ]

  const wordCounts = [100, 250, 500, 750, 1000, 1500]

  const handleGenerateText = async () => {
    if (!aiPrompt.trim()) {
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/generate-text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: aiPrompt,
          textType,
          tone,
          wordCount,
          existingContent: content
        }),
      })

      if (!response.ok) {
        throw new Error('Error al generar texto')
      }

      const data = await response.json()
      setGeneratedText(data.text)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleImproveText = async () => {
    if (!content.trim()) {
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/improve-text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: content,
          tone,
          textType
        }),
      })

      if (!response.ok) {
        throw new Error('Error al mejorar texto')
      }

      const data = await response.json()
      setContent(data.improvedText)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const downloadText = (text: string, filename: string) => {
    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white">No autorizado</h2>
          <p className="text-gray-300">Debes iniciar sesión para usar el editor de texto</p>
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
            <FileText className="h-8 w-8 text-cyan-400 mr-3" />
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Editor de Texto IA
              </h1>
              <p className="text-sm text-gray-300">Crea y mejora contenido con inteligencia artificial</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* AI Generation Panel */}
          <Card className="bg-black/20 backdrop-blur-lg border-white/10">
            <CardHeader>
              <CardTitle className="text-lg text-white flex items-center">
                <Wand2 className="h-5 w-5 mr-2 text-purple-400" />
                Generar Contenido
              </CardTitle>
              <CardDescription className="text-gray-400">
                Crea contenido desde cero con IA
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-white">Describe lo que quieres escribir</Label>
                <Textarea
                  placeholder="Escribe sobre las tendencias de IA en 2024..."
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  className="bg-black/20 border-white/20 text-white placeholder-gray-400"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-white">Tipo de contenido</Label>
                <div className="grid grid-cols-2 gap-2">
                  {textTypes.map((type) => (
                    <Button
                      key={type.id}
                      variant={textType === type.id ? "default" : "outline"}
                      onClick={() => setTextType(type.id)}
                      className={`justify-start ${
                        textType === type.id 
                          ? 'bg-purple-600 hover:bg-purple-700' 
                          : 'border-white/20 text-white hover:bg-white/10'
                      }`}
                    >
                      <span className="mr-2">{type.icon}</span>
                      {type.name}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-white">Tono</Label>
                <div className="grid grid-cols-2 gap-2">
                  {tones.map((toneOption) => (
                    <Button
                      key={toneOption.id}
                      variant={tone === toneOption.id ? "default" : "outline"}
                      onClick={() => setTone(toneOption.id)}
                      className={`justify-start ${
                        tone === toneOption.id 
                          ? 'bg-purple-600 hover:bg-purple-700' 
                          : 'border-white/20 text-white hover:bg-white/10'
                      }`}
                    >
                      <div className={`w-3 h-3 rounded-full ${toneOption.color} mr-2`}></div>
                      {toneOption.name}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-white">Longitud aproximada</Label>
                <div className="grid grid-cols-3 gap-2">
                  {wordCounts.map((count) => (
                    <Button
                      key={count}
                      variant={wordCount === count ? "default" : "outline"}
                      onClick={() => setWordCount(count)}
                      className={`justify-center ${
                        wordCount === count 
                          ? 'bg-blue-600 hover:bg-blue-700' 
                          : 'border-white/20 text-white hover:bg-white/10'
                      }`}
                    >
                      {count}
                    </Button>
                  ))}
                </div>
              </div>

              <Button 
                onClick={handleGenerateText} 
                disabled={loading || !aiPrompt.trim()}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 border-0"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4 mr-2" />
                )}
                {loading ? 'Generando...' : 'Generar Texto'}
              </Button>
            </CardContent>
          </Card>

          {/* Main Editor */}
          <Card className="bg-black/20 backdrop-blur-lg border-white/10 lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg text-white flex items-center">
                  <Edit3 className="h-5 w-5 mr-2 text-cyan-400" />
                  Editor Principal
                </CardTitle>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => handleImproveText()}
                    disabled={loading || !content.trim()}
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    <RefreshCw className="h-4 w-4 mr-1" />
                    Mejorar
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => copyToClipboard(content)}
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    <Copy className="h-4 w-4 mr-1" />
                    Copiar
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => downloadText(content, 'documento.txt')}
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Descargar
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Escribe tu contenido aquí o usa la IA para generarlo..."
                className="bg-black/20 border-white/20 text-white placeholder-gray-400 min-h-[400px]"
                rows={20}
              />
              <div className="flex justify-between items-center mt-4 text-sm text-gray-400">
                <span>Palabras: {content.split(' ').filter(word => word.length > 0).length}</span>
                <span>Caracteres: {content.length}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Generated Text Preview */}
        {generatedText && (
          <Card className="mt-8 bg-black/20 backdrop-blur-lg border-white/10">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg text-white flex items-center">
                  <Eye className="h-5 w-5 mr-2 text-green-400" />
                  Texto Generado
                </CardTitle>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => setContent(generatedText)}
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    <Save className="h-4 w-4 mr-1" />
                    Usar en Editor
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => copyToClipboard(generatedText)}
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    <Copy className="h-4 w-4 mr-1" />
                    Copiar
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-black/20 border border-white/20 rounded-lg p-4 text-white whitespace-pre-wrap">
                {generatedText}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
