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
  Music, 
  Play, 
  Pause, 
  Download, 
  Volume2,
  Sparkles,
  Headphones,
  Loader2,
  Shuffle
} from 'lucide-react'

export default function GenerateMusicPage() {
  const params = useParams()
  const { data: session } = useSession()
  const slug = params.slug as string

  const [prompt, setPrompt] = useState('')
  const [genre, setGenre] = useState('electronic')
  const [mood, setMood] = useState('upbeat')
  const [duration, setDuration] = useState('30')
  const [loading, setLoading] = useState(false)
  const [generatedMusic, setGeneratedMusic] = useState<any[]>([])
  const [error, setError] = useState('')
  const [playing, setPlaying] = useState<string | null>(null)

  const genres = [
    { id: 'electronic', name: 'Electrónica', icon: '🎧' },
    { id: 'classical', name: 'Clásica', icon: '🎼' },
    { id: 'jazz', name: 'Jazz', icon: '🎷' },
    { id: 'rock', name: 'Rock', icon: '🎸' },
    { id: 'ambient', name: 'Ambient', icon: '🌊' },
    { id: 'pop', name: 'Pop', icon: '🎤' }
  ]

  const moods = [
    { id: 'upbeat', name: 'Animado', color: 'bg-yellow-500' },
    { id: 'calm', name: 'Tranquilo', color: 'bg-blue-500' },
    { id: 'energetic', name: 'Energético', color: 'bg-red-500' },
    { id: 'melancholic', name: 'Melancólico', color: 'bg-purple-500' },
    { id: 'mysterious', name: 'Misterioso', color: 'bg-gray-500' },
    { id: 'romantic', name: 'Romántico', color: 'bg-pink-500' }
  ]

  const durations = [
    { id: '15', name: '15 segundos' },
    { id: '30', name: '30 segundos' },
    { id: '60', name: '1 minuto' },
    { id: '120', name: '2 minutos' }
  ]

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Por favor ingresa una descripción para generar la música')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/generate-music', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: `${prompt}, ${genres.find(g => g.id === genre)?.name} genre, ${moods.find(m => m.id === mood)?.name} mood`,
          genre,
          mood,
          duration: parseInt(duration)
        }),
      })

      if (!response.ok) {
        throw new Error('Error al generar la música')
      }

      const data = await response.json()
      setGeneratedMusic(prev => [...prev, data])
    } catch (err: any) {
      setError(err.message || 'Error al generar la música')
    } finally {
      setLoading(false)
    }
  }

  const togglePlay = (musicId: string) => {
    setPlaying(playing === musicId ? null : musicId)
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white">No autorizado</h2>
          <p className="text-gray-300">Debes iniciar sesión para generar música</p>
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
            <Music className="h-8 w-8 text-cyan-400 mr-3" />
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Generador de Música IA
              </h1>
              <p className="text-sm text-gray-300">Crea música original con inteligencia artificial</p>
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
                <Headphones className="h-6 w-6 mr-2 text-purple-400" />
                Generar Música
              </CardTitle>
              <CardDescription className="text-gray-400">
                Describe el tipo de música que quieres crear
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {error && (
                <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="prompt" className="text-white">Descripción de la música</Label>
                <Textarea
                  id="prompt"
                  placeholder="Una melodía épica de aventura con violines y percusión..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="bg-black/20 border-white/20 text-white placeholder-gray-400"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-white">Género musical</Label>
                <div className="grid grid-cols-2 gap-2">
                  {genres.map((genreOption) => (
                    <Button
                      key={genreOption.id}
                      variant={genre === genreOption.id ? "default" : "outline"}
                      onClick={() => setGenre(genreOption.id)}
                      className={`justify-start ${
                        genre === genreOption.id 
                          ? 'bg-purple-600 hover:bg-purple-700' 
                          : 'border-white/20 text-white hover:bg-white/10'
                      }`}
                    >
                      <span className="mr-2">{genreOption.icon}</span>
                      {genreOption.name}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-white">Estado de ánimo</Label>
                <div className="grid grid-cols-3 gap-2">
                  {moods.map((moodOption) => (
                    <Button
                      key={moodOption.id}
                      variant={mood === moodOption.id ? "default" : "outline"}
                      onClick={() => setMood(moodOption.id)}
                      className={`justify-start ${
                        mood === moodOption.id 
                          ? 'bg-purple-600 hover:bg-purple-700' 
                          : 'border-white/20 text-white hover:bg-white/10'
                      }`}
                    >
                      <div className={`w-3 h-3 rounded-full ${moodOption.color} mr-2`}></div>
                      {moodOption.name}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-white">Duración</Label>
                <div className="grid grid-cols-2 gap-2">
                  {durations.map((durationOption) => (
                    <Button
                      key={durationOption.id}
                      variant={duration === durationOption.id ? "default" : "outline"}
                      onClick={() => setDuration(durationOption.id)}
                      className={`justify-start ${
                        duration === durationOption.id 
                          ? 'bg-blue-600 hover:bg-blue-700' 
                          : 'border-white/20 text-white hover:bg-white/10'
                      }`}
                    >
                      {durationOption.name}
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
                {loading ? 'Generando...' : 'Generar Música'}
              </Button>
            </CardContent>
          </Card>

          {/* Generated Music */}
          <Card className="bg-black/20 backdrop-blur-lg border-white/10">
            <CardHeader>
              <CardTitle className="text-xl text-white flex items-center">
                <Volume2 className="h-6 w-6 mr-2 text-pink-400" />
                Música Generada
              </CardTitle>
              <CardDescription className="text-gray-400">
                Tus composiciones aparecerán aquí
              </CardDescription>
            </CardHeader>
            <CardContent>
              {generatedMusic.length === 0 ? (
                <div className="text-center py-12">
                  <Music className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400">Aún no has generado ninguna música</p>
                  <p className="text-sm text-gray-500">Usa el panel de la izquierda para crear tu primera composición</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {generatedMusic.map((music, index) => (
                    <div key={index} className="p-4 bg-white/5 rounded-lg border border-white/10">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="text-white font-medium">{music.title}</h3>
                          <p className="text-sm text-gray-400">{music.genre} • {music.mood}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            onClick={() => togglePlay(music.id)}
                            className="bg-purple-600 hover:bg-purple-700"
                          >
                            {playing === music.id ? (
                              <Pause className="h-4 w-4" />
                            ) : (
                              <Play className="h-4 w-4" />
                            )}
                          </Button>
                          <Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-white/10 rounded-full h-2">
                          <div className="bg-purple-500 h-2 rounded-full w-1/3"></div>
                        </div>
                        <span className="text-xs text-gray-400">0:15 / 0:30</span>
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
