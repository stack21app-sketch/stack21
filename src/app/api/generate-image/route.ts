import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { generateImage } from '@/lib/openai'

export async function POST(request: NextRequest) {
  try {
    const token = await getToken({ req: request })

    if (!token || !token.sub) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { prompt, size, quality, n } = await request.json()

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { error: 'Prompt es requerido y debe ser un string' },
        { status: 400 }
      )
    }

    if (prompt.length > 1000) {
      return NextResponse.json(
        { error: 'El prompt no puede exceder 1000 caracteres' },
        { status: 400 }
      )
    }

    // Validar tamaño
    const validSizes = ['512x512', '1024x1024', '1792x1024', '1024x1792']
    if (size && !validSizes.includes(size)) {
      return NextResponse.json(
        { error: 'Tamaño de imagen no válido' },
        { status: 400 }
      )
    }

    // Validar calidad
    const validQualities = ['standard', 'hd']
    if (quality && !validQualities.includes(quality)) {
      return NextResponse.json(
        { error: 'Calidad de imagen no válida' },
        { status: 400 }
      )
    }

    // Validar número de imágenes
    const numImages = n || 1
    if (numImages < 1 || numImages > 4) {
      return NextResponse.json(
        { error: 'Número de imágenes debe estar entre 1 y 4' },
        { status: 400 }
      )
    }

    console.log(`🎨 Generando imagen para usuario: "${prompt}"`)

    // Generar imagen usando OpenAI
    const imageUrl = await generateImage(prompt, size || '1024x1024', quality || 'standard')

    if (!imageUrl) {
      throw new Error('No se pudo generar la imagen')
    }

    console.log(`✅ Imagen generada exitosamente: ${imageUrl}`)

    return NextResponse.json({
      success: true,
      imageUrl,
      prompt,
      size: size || '1024x1024',
      quality: quality || 'standard',
      generatedAt: new Date().toISOString(),
    })

  } catch (error: any) {
    console.error('Error generando imagen:', error)
    
    // Manejar errores específicos de OpenAI
    if (error.message?.includes('billing')) {
      return NextResponse.json(
        { error: 'Error de facturación de OpenAI. Verifica tu cuenta.' },
        { status: 402 }
      )
    }
    
    if (error.message?.includes('content_policy')) {
      return NextResponse.json(
        { error: 'El prompt viola las políticas de contenido de OpenAI' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: error.message || 'Error interno del servidor al generar imagen' },
      { status: 500 }
    )
  }
}