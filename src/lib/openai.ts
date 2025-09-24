import OpenAI from 'openai'

// Solo inicializar OpenAI si la clave está configurada
export const openai = process.env.OPENAI_API_KEY ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
}) : null

// Configuración de modelos
export const MODELS = {
  GPT_4: 'gpt-4',
  GPT_3_5_TURBO: 'gpt-3.5-turbo',
  DALL_E_3: 'dall-e-3',
  DALL_E_2: 'dall-e-2',
  WHISPER_1: 'whisper-1',
} as const

// Configuración de límites
export const LIMITS = {
  MAX_TOKENS: 4000,
  MAX_IMAGES: 4,
  MAX_AUDIO_SIZE: 25 * 1024 * 1024, // 25MB
} as const

// Función para generar texto con GPT
export async function generateText(
  prompt: string,
  model: string = MODELS.GPT_3_5_TURBO,
  temperature: number = 0.7
) {
  if (!openai) {
    throw new Error('OpenAI no está configurado. Configura OPENAI_API_KEY en las variables de entorno.')
  }

  try {
    const completion = await openai.chat.completions.create({
      model,
      messages: [
        {
          role: 'system',
          content: 'Eres un asistente de IA experto que ayuda a los usuarios con sus tareas de manera clara y precisa.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: LIMITS.MAX_TOKENS,
      temperature,
    })

    return completion.choices[0]?.message?.content || ''
  } catch (error) {
    console.error('Error generando texto:', error)
    throw new Error('Error al generar texto con IA')
  }
}

// Función para generar imágenes con DALL-E
export async function generateImage(prompt: string, size: string = '1024x1024', quality: string = 'standard') {
  if (!openai) {
    throw new Error('OpenAI no está configurado. Configura OPENAI_API_KEY en las variables de entorno.')
  }

  try {
    const response = await openai.images.generate({
      model: MODELS.DALL_E_3,
      prompt,
      size: size as '1024x1024' | '1792x1024' | '1024x1792',
      quality: quality as 'standard' | 'hd',
      n: 1,
    })

    return response.data?.[0]?.url || ''
  } catch (error) {
    console.error('Error generando imagen:', error)
    throw new Error('Error al generar imagen con IA')
  }
}

// Función para generar música con Whisper (transcripción de audio)
export async function transcribeAudio(audioBuffer: Buffer) {
  try {
    if (!openai) {
      throw new Error('OpenAI no está configurado')
    }
    const response = await openai.audio.transcriptions.create({
      file: new File([new Uint8Array(audioBuffer)], 'audio.mp3', { type: 'audio/mpeg' }),
      model: MODELS.WHISPER_1,
    })

    return response.text
  } catch (error) {
    console.error('Error transcribiendo audio:', error)
    throw new Error('Error al transcribir audio con IA')
  }
}