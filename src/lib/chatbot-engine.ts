// Sistema de Chatbots con IA para Stack21
export interface ChatbotMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface ChatbotSession {
  id: string;
  chatbotId: string;
  userId?: string;
  messages: ChatbotMessage[];
  context: Record<string, any>;
  createdAt: Date;
  lastActivity: Date;
  status: 'active' | 'ended' | 'paused';
}

export interface Chatbot {
  id: string;
  name: string;
  description: string;
  type: 'support' | 'sales' | 'faq' | 'custom';
  personality: string;
  knowledgeBase: string[];
  responses: ChatbotResponse[];
  settings: ChatbotSettings;
  status: 'active' | 'inactive' | 'training';
  createdAt: Date;
  updatedAt: Date;
  sessionCount: number;
  satisfactionRate: number;
}

export interface ChatbotResponse {
  id: string;
  trigger: string | RegExp;
  response: string;
  type: 'text' | 'action' | 'redirect';
  conditions?: Record<string, any>;
  priority: number;
}

export interface ChatbotSettings {
  welcomeMessage: string;
  fallbackMessage: string;
  maxSessionDuration: number; // minutos
  enableContext: boolean;
  enableLearning: boolean;
  language: string;
  tone: 'formal' | 'casual' | 'friendly' | 'professional';
}

class ChatbotEngine {
  private chatbots: Map<string, Chatbot> = new Map();
  private sessions: Map<string, ChatbotSession> = new Map();
  private conversations: Map<string, ChatbotMessage[]> = new Map();

  // Crear un nuevo chatbot
  createChatbot(chatbot: Omit<Chatbot, 'id' | 'createdAt' | 'updatedAt' | 'sessionCount' | 'satisfactionRate'>): Chatbot {
    const newChatbot: Chatbot = {
      ...chatbot,
      id: `cb_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      updatedAt: new Date(),
      sessionCount: 0,
      satisfactionRate: 100
    };

    this.chatbots.set(newChatbot.id, newChatbot);
    return newChatbot;
  }

  // Crear una nueva sesión de chat
  createSession(chatbotId: string, userId?: string): ChatbotSession {
    const chatbot = this.chatbots.get(chatbotId);
    if (!chatbot) {
      throw new Error(`Chatbot ${chatbotId} not found`);
    }

    const session: ChatbotSession = {
      id: `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      chatbotId,
      userId,
      messages: [],
      context: {},
      createdAt: new Date(),
      lastActivity: new Date(),
      status: 'active'
    };

    this.sessions.set(session.id, session);
    this.conversations.set(session.id, []);

    // Enviar mensaje de bienvenida
    this.addMessage(session.id, {
      role: 'assistant',
      content: chatbot.settings.welcomeMessage
    });

    return session;
  }

  // Procesar mensaje del usuario
  async processMessage(sessionId: string, userMessage: string): Promise<ChatbotMessage> {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error(`Session ${sessionId} not found`);
    }

    const chatbot = this.chatbots.get(session.chatbotId);
    if (!chatbot) {
      throw new Error(`Chatbot not found for session ${sessionId}`);
    }

    // Agregar mensaje del usuario
    const userMsg = this.addMessage(sessionId, {
      role: 'user',
      content: userMessage
    });

    // Procesar y generar respuesta
    const response = await this.generateResponse(chatbot, session, userMessage);
    
    // Agregar respuesta del chatbot
    const botMsg = this.addMessage(sessionId, {
      role: 'assistant',
      content: response
    });

    // Actualizar contexto
    this.updateContext(session, userMessage, response);

    return botMsg;
  }

  // Generar respuesta del chatbot
  private async generateResponse(chatbot: Chatbot, session: ChatbotSession, userMessage: string): Promise<string> {
    // 1. Buscar respuesta específica
    const specificResponse = this.findSpecificResponse(chatbot, userMessage, session.context);
    if (specificResponse) {
      return specificResponse;
    }

    // 2. Buscar en base de conocimiento
    const knowledgeResponse = this.searchKnowledgeBase(chatbot, userMessage);
    if (knowledgeResponse) {
      return knowledgeResponse;
    }

    // 3. Generar respuesta inteligente
    const intelligentResponse = await this.generateIntelligentResponse(chatbot, session, userMessage);
    if (intelligentResponse) {
      return intelligentResponse;
    }

    // 4. Respuesta por defecto
    return chatbot.settings.fallbackMessage;
  }

  // Buscar respuesta específica
  private findSpecificResponse(chatbot: Chatbot, message: string, context: Record<string, any>): string | null {
    const responses = chatbot.responses
      .sort((a, b) => b.priority - a.priority);

    for (const response of responses) {
      let matches = false;

      if (typeof response.trigger === 'string') {
        matches = message.toLowerCase().includes(response.trigger.toLowerCase());
      } else if (response.trigger instanceof RegExp) {
        matches = response.trigger.test(message);
      }

      if (matches) {
        // Verificar condiciones
        if (response.conditions) {
          const conditionsMet = this.checkConditions(response.conditions, context);
          if (!conditionsMet) continue;
        }

        return response.response;
      }
    }

    return null;
  }

  // Buscar en base de conocimiento
  private searchKnowledgeBase(chatbot: Chatbot, message: string): string | null {
    const keywords = message.toLowerCase().split(/\s+/);
    
    for (const knowledge of chatbot.knowledgeBase) {
      const knowledgeWords = knowledge.toLowerCase().split(/\s+/);
      const matchCount = keywords.filter(keyword => 
        knowledgeWords.some(knowledgeWord => 
          knowledgeWord.includes(keyword) || keyword.includes(knowledgeWord)
        )
      ).length;

      // Si hay al menos 2 palabras coincidentes
      if (matchCount >= 2) {
        return this.generateKnowledgeResponse(knowledge, message);
      }
    }

    return null;
  }

  // Generar respuesta inteligente
  private async generateIntelligentResponse(chatbot: Chatbot, session: ChatbotSession, message: string): Promise<string> {
    // Simular IA avanzada
    await this.delay(500);

    const context = session.messages.slice(-3); // Últimos 3 mensajes para contexto
    const personality = chatbot.personality;
    const tone = chatbot.settings.tone;

    // Generar respuesta basada en personalidad y contexto
    let response = this.generateContextualResponse(message, context, personality, tone);

    // Agregar variaciones según el tipo de chatbot
    switch (chatbot.type) {
      case 'support':
        response = this.addSupportElements(response);
        break;
      case 'sales':
        response = this.addSalesElements(response);
        break;
      case 'faq':
        response = this.addFAQElements(response);
        break;
    }

    return response;
  }

  private generateContextualResponse(message: string, context: ChatbotMessage[], personality: string, tone: string): string {
    const responses = [
      `Entiendo tu consulta sobre "${message}". Déjame ayudarte con eso.`,
      `Gracias por tu mensaje. Basándome en lo que mencionas, puedo sugerirte lo siguiente.`,
      `Interesante pregunta. Desde mi perspectiva, te recomiendo considerar lo siguiente.`,
      `Me parece que necesitas ayuda con "${message}". Aquí tienes algunas opciones.`,
      `Basándome en nuestro contexto, creo que la mejor respuesta sería la siguiente.`
    ];

    // Seleccionar respuesta basada en personalidad
    const personalityIndex = personality.length % responses.length;
    let response = responses[personalityIndex];

    // Ajustar tono
    switch (tone) {
      case 'formal':
        response = response.replace(/Déjame/g, 'Permíteme').replace(/creo/g, 'considero');
        break;
      case 'casual':
        response = response.replace(/Entiendo/g, 'Entiendo perfectamente').replace(/sugerirte/g, 'decirte');
        break;
      case 'friendly':
        response = `¡Hola! ${response.toLowerCase()}`;
        break;
      case 'professional':
        response = response.replace(/creo/g, 'analizo').replace(/puedo/g, 'estoy en capacidad de');
        break;
    }

    return response;
  }

  private addSupportElements(response: string): string {
    const supportElements = [
      ' ¿Hay algo más en lo que pueda ayudarte?',
      ' Si necesitas asistencia adicional, no dudes en preguntar.',
      ' ¿Te gustaría que te ayude con algo más específico?'
    ];
    return response + supportElements[Math.floor(Math.random() * supportElements.length)];
  }

  private addSalesElements(response: string): string {
    const salesElements = [
      ' ¿Te interesa conocer más sobre nuestros productos?',
      ' ¿Podría mostrarte algunas opciones que podrían interesarte?',
      ' ¿Hay algún producto específico que te llame la atención?'
    ];
    return response + salesElements[Math.floor(Math.random() * salesElements.length)];
  }

  private addFAQElements(response: string): string {
    const faqElements = [
      ' Esta es una pregunta frecuente que recibimos.',
      ' Muchos usuarios tienen la misma duda.',
      ' Esta información suele ser muy útil para nuestros usuarios.'
    ];
    return response + faqElements[Math.floor(Math.random() * faqElements.length)];
  }

  private generateKnowledgeResponse(knowledge: string, message: string): string {
    return `Basándome en nuestra información: ${knowledge}. ¿Te ayuda esto a responder tu pregunta sobre "${message}"?`;
  }

  private checkConditions(conditions: Record<string, any>, context: Record<string, any>): boolean {
    for (const [key, value] of Object.entries(conditions)) {
      if (context[key] !== value) {
        return false;
      }
    }
    return true;
  }

  private updateContext(session: ChatbotSession, userMessage: string, botResponse: string): void {
    // Extraer entidades del mensaje (simplificado)
    const entities = this.extractEntities(userMessage);
    session.context = { ...session.context, ...entities };
    session.lastActivity = new Date();
  }

  private extractEntities(message: string): Record<string, any> {
    const entities: Record<string, any> = {};
    
    // Detectar emails
    const emailMatch = message.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/);
    if (emailMatch) entities.email = emailMatch[0];

    // Detectar números de teléfono
    const phoneMatch = message.match(/\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/);
    if (phoneMatch) entities.phone = phoneMatch[0];

    // Detectar URLs
    const urlMatch = message.match(/https?:\/\/[^\s]+/);
    if (urlMatch) entities.url = urlMatch[0];

    return entities;
  }

  // Agregar mensaje a la sesión
  private addMessage(sessionId: string, message: Omit<ChatbotMessage, 'id' | 'timestamp'>): ChatbotMessage {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error(`Session ${sessionId} not found`);
    }

    const newMessage: ChatbotMessage = {
      ...message,
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date()
    };

    session.messages.push(newMessage);
    const conversation = this.conversations.get(sessionId) || [];
    conversation.push(newMessage);
    this.conversations.set(sessionId, conversation);

    return newMessage;
  }

  // Utilidades
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Getters
  getChatbot(id: string): Chatbot | undefined {
    return this.chatbots.get(id);
  }

  getAllChatbots(): Chatbot[] {
    return Array.from(this.chatbots.values());
  }

  getSession(id: string): ChatbotSession | undefined {
    return this.sessions.get(id);
  }

  getConversation(sessionId: string): ChatbotMessage[] {
    return this.conversations.get(sessionId) || [];
  }

  updateChatbot(id: string, updates: Partial<Chatbot>): Chatbot | null {
    const chatbot = this.chatbots.get(id);
    if (!chatbot) return null;

    const updatedChatbot = { ...chatbot, ...updates, updatedAt: new Date() };
    this.chatbots.set(id, updatedChatbot);
    return updatedChatbot;
  }

  deleteChatbot(id: string): boolean {
    return this.chatbots.delete(id);
  }
}

// Instancia singleton del motor de chatbots
export const chatbotEngine = new ChatbotEngine();

// Función para crear chatbot de ejemplo
export const createSampleChatbot = (): Chatbot => {
  return chatbotEngine.createChatbot({
    name: 'Asistente de Soporte',
    description: 'Chatbot especializado en atención al cliente',
    type: 'support',
    personality: 'Amigable y servicial',
    knowledgeBase: [
      'Nuestro horario de atención es de lunes a viernes de 9 AM a 6 PM',
      'Ofrecemos soporte técnico 24/7 para usuarios premium',
      'Puedes contactarnos por email en soporte@stack21.com',
      'Tenemos un centro de ayuda con documentación completa',
      'Los tiempos de respuesta promedio son de 2 horas en horario laboral'
    ],
    responses: [
      {
        id: 'resp_1',
        trigger: 'hola|hi|hello',
        response: '¡Hola! Soy tu asistente virtual. ¿En qué puedo ayudarte hoy?',
        type: 'text',
        priority: 10
      },
      {
        id: 'resp_2',
        trigger: /horario|horarios|atención/i,
        response: 'Nuestro horario de atención es de lunes a viernes de 9 AM a 6 PM. ¿Hay algo específico en lo que pueda ayudarte?',
        type: 'text',
        priority: 8
      },
      {
        id: 'resp_3',
        trigger: /precio|costos|cuanto/i,
        response: 'Te ayudo con información sobre nuestros precios. ¿Qué plan te interesa conocer?',
        type: 'text',
        priority: 9
      }
    ],
    settings: {
      welcomeMessage: '¡Hola! 👋 Soy tu asistente virtual de Stack21. ¿En qué puedo ayudarte hoy?',
      fallbackMessage: 'Lo siento, no entendí completamente tu consulta. ¿Podrías reformularla o preguntarme algo más específico?',
      maxSessionDuration: 60,
      enableContext: true,
      enableLearning: true,
      language: 'es',
      tone: 'friendly'
    },
    status: 'active'
  });
};
