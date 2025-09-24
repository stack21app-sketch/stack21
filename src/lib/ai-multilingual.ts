import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export interface MultilingualAIResponse {
  response: string
  language: string
  confidence: number
}

export class MultilingualAI {
  private static languagePrompts = {
    es: "Responde en español de manera natural y profesional. Usa un tono amigable pero profesional.",
    en: "Respond in English in a natural and professional way. Use a friendly but professional tone.",
    pt: "Responda em português de forma natural e profissional. Use um tom amigável mas profissional.",
    fr: "Répondez en français de manière naturelle et professionnelle. Utilisez un ton amical mais professionnel.",
    de: "Antworten Sie auf Deutsch auf natürliche und professionelle Weise. Verwenden Sie einen freundlichen, aber professionellen Ton.",
  }

  static async generateResponse(
    userMessage: string,
    userLanguage: string = 'es',
    context?: string
  ): Promise<MultilingualAIResponse> {
    try {
      const languagePrompt = this.languagePrompts[userLanguage as keyof typeof this.languagePrompts] || this.languagePrompts.es
      
      const systemPrompt = `Eres un asistente de IA especializado en automatización de negocios y Stack21. 
      
${languagePrompt}

Contexto: ${context || 'Asistente general de Stack21'}

Instrucciones:
- Responde de manera útil y específica
- Si el usuario pregunta sobre funcionalidades de Stack21, explica cómo pueden ayudar
- Mantén un tono profesional pero amigable
- Si no sabes algo, admítelo y ofrece alternativas
- Enfócate en automatización, workflows, IA y productividad empresarial`

      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: systemPrompt
          },
          {
            role: "user",
            content: userMessage
          }
        ],
        max_tokens: 500,
        temperature: 0.7,
      })

      const response = completion.choices[0]?.message?.content || 'Lo siento, no pude generar una respuesta.'

      return {
        response,
        language: userLanguage,
        confidence: 0.9
      }
    } catch (error) {
      console.error('Error generating multilingual AI response:', error)
      
      const fallbackMessages = {
        es: "Lo siento, hubo un error al procesar tu solicitud. Por favor, intenta de nuevo.",
        en: "Sorry, there was an error processing your request. Please try again.",
        pt: "Desculpe, houve um erro ao processar sua solicitação. Tente novamente.",
        fr: "Désolé, il y a eu une erreur lors du traitement de votre demande. Veuillez réessayer.",
        de: "Entschuldigung, es gab einen Fehler bei der Verarbeitung Ihrer Anfrage. Bitte versuchen Sie es erneut.",
      }

      return {
        response: fallbackMessages[userLanguage as keyof typeof fallbackMessages] || fallbackMessages.es,
        language: userLanguage,
        confidence: 0.1
      }
    }
  }

  static async detectLanguage(text: string): Promise<string> {
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "Detecta el idioma del siguiente texto y responde solo con el código de idioma (es, en, pt, fr, de). Si no estás seguro, responde 'es'."
          },
          {
            role: "user",
            content: text
          }
        ],
        max_tokens: 10,
        temperature: 0.1,
      })

      const detectedLanguage = completion.choices[0]?.message?.content?.trim().toLowerCase() || 'es'
      
      // Validar que sea un idioma soportado
      const supportedLanguages = ['es', 'en', 'pt', 'fr', 'de']
      return supportedLanguages.includes(detectedLanguage) ? detectedLanguage : 'es'
    } catch (error) {
      console.error('Error detecting language:', error)
      return 'es' // Fallback a español
    }
  }

  static async generateWorkflowSuggestion(
    userRequest: string,
    userLanguage: string = 'es'
  ): Promise<MultilingualAIResponse> {
    const context = "Sugerencia de workflow de automatización"
    return this.generateResponse(
      `El usuario quiere: ${userRequest}. Sugiere un workflow de automatización que pueda ayudar con esta tarea.`,
      userLanguage,
      context
    )
  }

  static async generateBusinessAdvice(
    userQuestion: string,
    userLanguage: string = 'es'
  ): Promise<MultilingualAIResponse> {
    const context = "Consejo de negocio y automatización"
    return this.generateResponse(
      `Pregunta de negocio: ${userQuestion}. Proporciona consejos sobre cómo automatizar y mejorar este aspecto del negocio.`,
      userLanguage,
      context
    )
  }
}
