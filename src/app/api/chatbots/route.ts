import { NextRequest, NextResponse } from 'next/server'
import { chatbotEngine, createSampleChatbot } from '@/lib/chatbot-engine'

export async function GET(request: NextRequest) {
  try {
    const chatbots = chatbotEngine.getAllChatbots();
    
    // Si no hay chatbots, crear uno de ejemplo
    if (chatbots.length === 0) {
      createSampleChatbot();
      return NextResponse.json({ chatbots: chatbotEngine.getAllChatbots() });
    }
    
    return NextResponse.json({ chatbots });
  } catch (error) {
    console.error('Error fetching chatbots:', error);
    return NextResponse.json({ error: 'Failed to fetch chatbots' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, type, personality, settings } = body;

    const chatbot = chatbotEngine.createChatbot({
      name,
      description,
      type: type || 'support',
      personality: personality || 'Amigable y servicial',
      knowledgeBase: [],
      responses: [],
      settings: {
        welcomeMessage: '¡Hola! ¿En qué puedo ayudarte?',
        fallbackMessage: 'Lo siento, no entendí tu consulta. ¿Podrías reformularla?',
        maxSessionDuration: 60,
        enableContext: true,
        enableLearning: true,
        language: 'es',
        tone: 'friendly',
        ...settings
      },
      status: 'active'
    });

    return NextResponse.json({ chatbot }, { status: 201 });
  } catch (error) {
    console.error('Error creating chatbot:', error);
    return NextResponse.json({ error: 'Failed to create chatbot' }, { status: 500 });
  }
}


