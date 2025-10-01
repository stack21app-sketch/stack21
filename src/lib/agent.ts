import OpenAI from 'openai';

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ChatResponse {
  answer: string;
  tokensIn: number;
  tokensOut: number;
  model: string;
  duration: number;
  cached?: boolean;
}

export interface AgentOptions {
  model?: string;
  messages: ChatMessage[];
  maxTokens?: number;
  temperature?: number;
  timeoutMs?: number;
  organizationId: string;
  context?: {
    products?: any[];
    orders?: any[];
    faqs?: any[];
  };
}

// Cliente OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Selecciona el modelo óptimo según el tipo de tarea
 */
function selectModel(taskType: 'chat' | 'reasoning' | 'admin', plan: 'free' | 'pro' | 'premium'): string {
  const primaryModel = process.env.OPENAI_MODEL_PRIMARY || 'gpt-4o-mini';
  const fallbackModel = process.env.OPENAI_MODEL_FALLBACK || 'gpt-4';

  // Para tareas de razonamiento complejo o admin, usar modelo más potente
  if (taskType === 'reasoning' || taskType === 'admin') {
    return plan === 'free' ? primaryModel : fallbackModel;
  }

  // Para chat normal, usar modelo económico
  return primaryModel;
}

/**
 * Construye el prompt del sistema según el contexto
 */
function buildSystemPrompt(context?: AgentOptions['context']): string {
  let systemPrompt = `Eres un asistente AI especializado en e-commerce y atención al cliente. 

Tu función es ayudar a los usuarios con:
- Consultas sobre productos y servicios
- Procesamiento de pedidos
- Resolución de dudas comunes
- Soporte técnico básico

Instrucciones:
- Sé conciso y directo en tus respuestas
- Si no tienes información específica, di que no la tienes disponible
- Mantén un tono profesional y amigable
- Si la consulta requiere atención humana, sugiere contactar soporte`;

  if (context?.products && context.products.length > 0) {
    systemPrompt += `\n\nProductos disponibles:\n${context.products.map(p => `- ${p.name}: ${p.description || 'Sin descripción'}`).join('\n')}`;
  }

  if (context?.faqs && context.faqs.length > 0) {
    systemPrompt += `\n\nPreguntas frecuentes:\n${context.faqs.map(f => `Q: ${f.question}\nA: ${f.answer}`).join('\n\n')}`;
  }

  return systemPrompt;
}

/**
 * Ejecuta un chat con OpenAI con retry y timeout
 */
export async function openaiChat(options: AgentOptions): Promise<ChatResponse> {
  const startTime = Date.now();
  const timeout = options.timeoutMs || 8000;
  
  const model = selectModel('chat', 'pro'); // Se puede pasar el plan como parámetro
  
  const systemPrompt = buildSystemPrompt(options.context);
  
  const messages: ChatMessage[] = [
    { role: 'system', content: systemPrompt },
    ...options.messages,
  ];

  try {
    const response = await Promise.race([
      openai.chat.completions.create({
        model,
        messages: messages as any,
        max_tokens: options.maxTokens || 500,
        temperature: options.temperature || 0.7,
      }),
      new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error('Request timeout')), timeout)
      ),
    ]);

    const answer = response.choices[0]?.message?.content || 'No pude generar una respuesta.';
    const tokensIn = response.usage?.prompt_tokens || 0;
    const tokensOut = response.usage?.completion_tokens || 0;
    const duration = Date.now() - startTime;

    return {
      answer,
      tokensIn,
      tokensOut,
      model,
      duration,
    };

  } catch (error) {
    console.error('OpenAI API error:', error);
    
    // Retry con modelo fallback si es un error de API
    if (error instanceof Error && !error.message.includes('timeout')) {
      try {
        const fallbackModel = process.env.OPENAI_MODEL_FALLBACK || 'gpt-4';
        const response = await openai.chat.completions.create({
          model: fallbackModel,
          messages: messages as any,
          max_tokens: options.maxTokens || 500,
          temperature: options.temperature || 0.7,
        });

        const answer = response.choices[0]?.message?.content || 'No pude generar una respuesta.';
        const tokensIn = response.usage?.prompt_tokens || 0;
        const tokensOut = response.usage?.completion_tokens || 0;
        const duration = Date.now() - startTime;

        return {
          answer,
          tokensIn,
          tokensOut,
          model: fallbackModel,
          duration,
        };

      } catch (retryError) {
        console.error('Fallback model also failed:', retryError);
      }
    }

    // Respuesta de fallback
    return {
      answer: 'Lo siento, estoy experimentando problemas técnicos. Por favor, intenta de nuevo en unos minutos.',
      tokensIn: 0,
      tokensOut: 0,
      model: 'fallback',
      duration: Date.now() - startTime,
    };
  }
}

/**
 * Ejecuta una tarea de razonamiento complejo (para admin)
 */
export async function openaiReasoning(options: AgentOptions): Promise<ChatResponse> {
  const startTime = Date.now();
  const model = selectModel('reasoning', 'pro');
  
  const systemPrompt = `Eres un asistente AI avanzado para tareas administrativas complejas.

Tu función es:
- Analizar datos complejos
- Generar reportes detallados
- Procesar múltiples fuentes de información
- Realizar razonamiento lógico avanzado

Sé exhaustivo en tu análisis pero mantén la claridad.`;

  const messages: ChatMessage[] = [
    { role: 'system', content: systemPrompt },
    ...options.messages,
  ];

  try {
    const response = await openai.chat.completions.create({
      model,
      messages: messages as any,
      max_tokens: options.maxTokens || 1000,
      temperature: options.temperature || 0.3, // Más determinístico para razonamiento
    });

    const answer = response.choices[0]?.message?.content || 'No pude completar el análisis.';
    const tokensIn = response.usage?.prompt_tokens || 0;
    const tokensOut = response.usage?.completion_tokens || 0;
    const duration = Date.now() - startTime;

    return {
      answer,
      tokensIn,
      tokensOut,
      model,
      duration,
    };

  } catch (error) {
    console.error('OpenAI reasoning error:', error);
    
    return {
      answer: 'No pude completar el análisis solicitado. Por favor, verifica los datos e intenta de nuevo.',
      tokensIn: 0,
      tokensOut: 0,
      model: 'fallback',
      duration: Date.now() - startTime,
    };
  }
}

/**
 * Genera contenido de marketing (copies, descripciones, etc.)
 */
export async function generateMarketingContent(
  type: 'product_description' | 'email_copy' | 'social_media' | 'ad_copy',
  context: {
    productName?: string;
    productDescription?: string;
    targetAudience?: string;
    tone?: 'formal' | 'casual' | 'persuasive' | 'friendly';
  }
): Promise<ChatResponse> {
  const systemPrompt = `Eres un copywriter experto en marketing digital y e-commerce.

Tu función es crear contenido de marketing efectivo para:
- Descripciones de productos
- Emails promocionales
- Posts para redes sociales
- Anuncios publicitarios

Instrucciones:
- Adapta el tono según el tipo de contenido
- Incluye llamadas a la acción claras
- Mantén el contenido conciso pero persuasivo
- Evita exageraciones o claims falsos`;

  const userPrompt = `Genera contenido de marketing para:
Tipo: ${type}
Producto: ${context.productName || 'No especificado'}
Descripción: ${context.productDescription || 'No especificada'}
Audiencia: ${context.targetAudience || 'General'}
Tono: ${context.tone || 'friendly'}

Por favor, crea el contenido solicitado.`;

  return openaiChat({
    organizationId: 'marketing', // Placeholder
    messages: [
      { role: 'user', content: userPrompt },
    ],
    maxTokens: 300,
    temperature: 0.8, // Más creativo para marketing
  });
}

/**
 * Procesa audio de voz (para funcionalidad de voz)
 */
export async function processVoiceAudio(audioBuffer: Buffer): Promise<{
  transcript: string;
  tokensIn: number;
  tokensOut: number;
}> {
  // Esta función sería implementada cuando se habilite la funcionalidad de voz
  // Por ahora, retorna un placeholder
  
  return {
    transcript: 'Funcionalidad de voz no disponible aún',
    tokensIn: 0,
    tokensOut: 0,
  };
}

/**
 * Estima el costo de una consulta antes de ejecutarla
 */
export function estimateCost(tokensIn: number, tokensOut: number, model: string): number {
  // Precios aproximados por 1000 tokens (en centavos)
  const pricing = {
    'gpt-4o-mini': { input: 0.15, output: 0.6 },
    'gpt-4': { input: 3.0, output: 6.0 },
    'gpt-4-turbo': { input: 1.0, output: 3.0 },
  };

  const modelPricing = pricing[model as keyof typeof pricing] || pricing['gpt-4o-mini'];
  
  const inputCost = (tokensIn / 1000) * modelPricing.input;
  const outputCost = (tokensOut / 1000) * modelPricing.output;
  
  return inputCost + outputCost;
}
