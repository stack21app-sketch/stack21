import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { message, userId } = body

    // Obtener información del chatbot
    const { data: chatbot, error: chatbotError } = await supabase
      .from('chatbots')
      .select('*')
      .eq('id', params.id)
      .single()

    if (chatbotError || !chatbot) {
      return NextResponse.json({ error: 'Chatbot not found' }, { status: 404 })
    }

    // Guardar el mensaje del usuario
    const { data: userMessage, error: messageError } = await supabase
      .from('chat_messages')
      .insert([
        {
          chatbot_id: params.id,
          user_id: userId,
          message,
          sender: 'user',
          created_at: new Date().toISOString()
        }
      ])
      .select()
      .single()

    if (messageError) {
      console.error('Error saving user message:', messageError)
      return NextResponse.json({ error: 'Failed to save message' }, { status: 500 })
    }

    // Generar respuesta del chatbot (simulada por ahora)
    const botResponse = await generateBotResponse(message, chatbot)

    // Guardar la respuesta del chatbot
    const { data: botMessage, error: botMessageError } = await supabase
      .from('chat_messages')
      .insert([
        {
          chatbot_id: params.id,
          user_id: userId,
          message: botResponse,
          sender: 'bot',
          created_at: new Date().toISOString()
        }
      ])
      .select()
      .single()

    if (botMessageError) {
      console.error('Error saving bot message:', botMessageError)
      return NextResponse.json({ error: 'Failed to save bot response' }, { status: 500 })
    }

    return NextResponse.json({ 
      userMessage, 
      botMessage,
      conversation: [userMessage, botMessage]
    })
  } catch (error) {
    console.error('Error in chatbot chat API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

async function generateBotResponse(message: string, chatbot: any) {
  // Simulación de respuesta del chatbot
  // En una implementación real, aquí se integraría con OpenAI, Claude, etc.
  
  const personality = chatbot.personality ? JSON.parse(chatbot.personality) : {}
  const responseStyle = chatbot.response_style ? JSON.parse(chatbot.response_style) : {}
  
  // Respuestas predefinidas basadas en el tipo de mensaje
  const responses = {
    greeting: [
      `¡Hola! Soy ${chatbot.name}. ¿En qué puedo ayudarte hoy?`,
      `¡Buenos días! Me llamo ${chatbot.name}. ¿Cómo estás?`,
      `¡Hola! Soy tu asistente ${chatbot.name}. ¿Qué necesitas?`
    ],
    question: [
      "Esa es una excelente pregunta. Déjame ayudarte con eso.",
      "Entiendo tu consulta. Te voy a explicar paso a paso.",
      "Buena pregunta. Aquí tienes la información que necesitas."
    ],
    help: [
      "Por supuesto, estaré encantado de ayudarte.",
      "Claro, puedo asistirte con eso.",
      "¡Por supuesto! ¿Qué necesitas exactamente?"
    ],
    default: [
      "Interesante. ¿Puedes contarme más detalles?",
      "Entiendo. ¿Hay algo específico en lo que pueda ayudarte?",
      "Gracias por compartir eso conmigo. ¿Cómo puedo asistirte?"
    ]
  }

  const messageLower = message.toLowerCase()
  
  let responseType = 'default'
  if (messageLower.includes('hola') || messageLower.includes('buenos') || messageLower.includes('buenas')) {
    responseType = 'greeting'
  } else if (messageLower.includes('?') || messageLower.includes('cómo') || messageLower.includes('qué')) {
    responseType = 'question'
  } else if (messageLower.includes('ayuda') || messageLower.includes('help')) {
    responseType = 'help'
  }

  const possibleResponses = responses[responseType as keyof typeof responses]
  const randomResponse = possibleResponses[Math.floor(Math.random() * possibleResponses.length)]

  return randomResponse
}
