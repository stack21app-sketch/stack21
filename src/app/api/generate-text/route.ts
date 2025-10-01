import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function POST(request: NextRequest) {
  try {
    const token = await getToken({ req: request })
    
    if (!token || !token.sub) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { prompt, textType, tone, wordCount, existingContent } = await request.json()

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt es requerido' },
        { status: 400 }
      )
    }

    // Simulación de generación de texto (reemplazar con OpenAI GPT)
    const textTemplates = {
      article: `# ${prompt}\n\nEste es un artículo completo sobre "${prompt}". El contenido ha sido generado con inteligencia artificial y está optimizado para el tono ${tone}. El artículo incluye introducción, desarrollo de ideas principales, y conclusiones relevantes.\n\n## Puntos Clave\n\n- Punto importante 1\n- Punto importante 2\n- Punto importante 3\n\n## Conclusión\n\nEn resumen, ${prompt} es un tema fascinante que merece atención y análisis detallado.`,
      blog: `# ${prompt}\n\n¡Hola! Hoy quiero hablar sobre "${prompt}". Es un tema que me apasiona y creo que te va a interesar.\n\n## ¿Por qué es importante?\n\n${prompt} tiene un impacto significativo en nuestras vidas. Te explico por qué:\n\n1. **Beneficio principal 1**\n2. **Beneficio principal 2**\n3. **Beneficio principal 3**\n\n## Mi experiencia personal\n\nHe tenido la oportunidad de trabajar con ${prompt} y puedo decirte que...\n\n¿Qué opinas tú? ¿Has tenido alguna experiencia con ${prompt}?`,
      email: `Asunto: ${prompt}\n\nEstimado/a,\n\nEspero que te encuentres bien. Te escribo para hablar sobre ${prompt}.\n\nMe gustaría compartir contigo información importante sobre este tema que creo que puede ser de tu interés.\n\n**Puntos principales:**\n- Información clave 1\n- Información clave 2\n- Información clave 3\n\nPor favor, no dudes en contactarme si tienes alguna pregunta.\n\nSaludos cordiales,\n[Tu nombre]`,
      social: `🚀 ${prompt}\n\n¿Sabías que...? Te comparto algunos datos interesantes sobre este tema que me parecen fascinantes:\n\n✨ Punto destacado 1\n✨ Punto destacado 2\n✨ Punto destacado 3\n\n#${prompt.replace(/\s+/g, '')} #IA #Tecnologia\n\n¿Qué opinas? 👇`,
      ad: `🎯 ${prompt}\n\n¡No te lo pierdas! Oferta especial por tiempo limitado.\n\n✅ Beneficio 1\n✅ Beneficio 2\n✅ Beneficio 3\n\n🔥 Precio especial: [Precio]\n⏰ Solo hasta [Fecha]\n\n¡Actúa ahora! [Enlace]`,
      story: `# ${prompt}\n\nHabía una vez...\n\n${prompt} era el protagonista de nuestra historia. Todo comenzó cuando...\n\nEl ambiente estaba cargado de misterio y emoción. Los personajes se movían en un mundo donde ${prompt} tenía un papel fundamental.\n\nCon cada giro de la trama, descubrimos nuevos aspectos sobre ${prompt} que nos mantenían en vilo.\n\n¿Cómo terminaría esta historia? Solo el tiempo lo diría...`
    }

    const toneModifiers = {
      professional: 'El contenido mantiene un tono profesional y formal, apropiado para contextos empresariales.',
      casual: 'El contenido tiene un tono relajado y conversacional, perfecto para comunicación informal.',
      formal: 'El contenido utiliza un lenguaje formal y estructurado, ideal para documentos oficiales.',
      friendly: 'El contenido es cálido y amigable, creando una conexión personal con el lector.',
      persuasive: 'El contenido está diseñado para convencer y motivar a la acción.',
      creative: 'El contenido es imaginativo y original, con un enfoque artístico y único.'
    }

    const baseText = textTemplates[textType as keyof typeof textTemplates] || textTemplates.article
    const toneNote = toneModifiers[tone as keyof typeof toneModifiers] || toneModifiers.professional
    
    // En producción, aquí harías la llamada real a OpenAI GPT:
    /*
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `Eres un escritor profesional especializado en ${textType}. Escribe en tono ${tone}. El texto debe tener aproximadamente ${wordCount} palabras.`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: Math.min(wordCount * 2, 4000),
        temperature: 0.7
      }),
    })

    const data = await response.json()
    const generatedText = data.choices[0].message.content
    */

    return NextResponse.json({ 
      text: baseText,
      metadata: {
        textType,
        tone,
        wordCount: baseText.split(' ').length,
        generatedAt: new Date().toISOString()
      }
    })
  } catch (error) {
    console.error('Error al generar texto:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
