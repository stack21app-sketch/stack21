import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { prompt, genre, mood, duration } = await request.json()

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt es requerido' },
        { status: 400 }
      )
    }

    // Simulación de generación de música (reemplazar con API real de música IA)
    const mockMusicData = {
      id: `music_${Date.now()}`,
      title: `Composición ${genre} - ${mood}`,
      genre: genre,
      mood: mood,
      duration: duration,
      audioUrl: `https://www.soundjay.com/misc/sounds/bell-ringing-05.wav`, // URL de ejemplo
      createdAt: new Date().toISOString()
    }
    
    // En producción, aquí harías la llamada real a una API de música IA:
    /*
    const response = await fetch('https://api.music-ai.com/v1/generate', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.MUSIC_AI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        genre,
        mood,
        duration,
      }),
    })

    const data = await response.json()
    */

    return NextResponse.json(mockMusicData)
  } catch (error) {
    console.error('Error al generar música:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
