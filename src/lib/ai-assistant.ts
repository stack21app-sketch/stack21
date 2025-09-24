// Asistente IA por industria para Stack21
export interface Industry {
  id: string
  name: string
  description: string
  icon: string
  color: string
  prompts: string[]
  workflows: string[]
  metrics: string[]
  integrations: string[]
}

export interface AIResponse {
  message: string
  suggestions: string[]
  workflows?: string[]
  nextSteps?: string[]
  confidence: number
}

export const INDUSTRIES: Industry[] = [
  {
    id: 'ecommerce',
    name: 'E-commerce',
    description: 'Ventas online y gestión de tiendas digitales',
    icon: '🛒',
    color: 'from-blue-500 to-cyan-500',
    prompts: [
      'Optimiza mi tienda online para aumentar conversiones',
      'Crea una campaña de email marketing para productos nuevos',
      'Mejora mi estrategia de retención de clientes',
      'Automatiza el proceso de seguimiento de pedidos'
    ],
    workflows: [
      'Abandono de carrito',
      'Seguimiento post-venta',
      'Recomendaciones personalizadas',
      'Gestión de inventario'
    ],
    metrics: ['Conversión', 'CAC', 'LTV', 'AOV', 'Churn'],
    integrations: ['Shopify', 'WooCommerce', 'Stripe', 'Mailchimp', 'Google Analytics']
  },
  {
    id: 'saas',
    name: 'SaaS',
    description: 'Software como servicio y suscripciones',
    icon: '💻',
    color: 'from-purple-500 to-pink-500',
    prompts: [
      'Mejora mi onboarding de usuarios',
      'Crea una estrategia de upselling',
      'Optimiza mi funnel de conversión',
      'Automatiza el soporte al cliente'
    ],
    workflows: [
      'Onboarding automatizado',
      'Upselling inteligente',
      'Soporte por tickets',
      'Análisis de uso'
    ],
    metrics: ['MRR', 'Churn', 'CAC', 'LTV', 'Activation Rate'],
    integrations: ['Intercom', 'Stripe', 'Mixpanel', 'Slack', 'Zendesk']
  },
  {
    id: 'realestate',
    name: 'Inmobiliaria',
    description: 'Ventas y alquileres de propiedades',
    icon: '🏠',
    color: 'from-green-500 to-emerald-500',
    prompts: [
      'Automatiza el seguimiento de leads inmobiliarios',
      'Crea campañas para propiedades destacadas',
      'Mejora la gestión de citas',
      'Optimiza el proceso de cierre'
    ],
    workflows: [
      'Nurturing de leads',
      'Programación de citas',
      'Seguimiento de propiedades',
      'Comunicación con clientes'
    ],
    metrics: ['Leads calificados', 'Tasa de cierre', 'Tiempo de venta', 'Satisfacción'],
    integrations: ['Zillow', 'MLS', 'Calendly', 'WhatsApp', 'DocuSign']
  },
  {
    id: 'healthcare',
    name: 'Salud',
    description: 'Servicios médicos y clínicas',
    icon: '🏥',
    color: 'from-red-500 to-orange-500',
    prompts: [
      'Automatiza recordatorios de citas',
      'Mejora la experiencia del paciente',
      'Optimiza la gestión de historiales',
      'Crea campañas de prevención'
    ],
    workflows: [
      'Recordatorios de citas',
      'Seguimiento post-tratamiento',
      'Gestión de historiales',
      'Comunicación con pacientes'
    ],
    metrics: ['Pacientes atendidos', 'Satisfacción', 'Tiempo de espera', 'Reingresos'],
    integrations: ['Epic', 'Cerner', 'Calendly', 'Twilio', 'DocuSign']
  },
  {
    id: 'education',
    name: 'Educación',
    description: 'Instituciones educativas y cursos online',
    icon: '🎓',
    color: 'from-indigo-500 to-blue-500',
    prompts: [
      'Mejora el engagement de estudiantes',
      'Automatiza el proceso de inscripción',
      'Crea contenido educativo personalizado',
      'Optimiza el seguimiento académico'
    ],
    workflows: [
      'Onboarding de estudiantes',
      'Recordatorios de clases',
      'Evaluaciones automáticas',
      'Comunicación con padres'
    ],
    metrics: ['Retención', 'Engagement', 'Calificaciones', 'Satisfacción'],
    integrations: ['Moodle', 'Canvas', 'Zoom', 'Google Classroom', 'Slack']
  },
  {
    id: 'fitness',
    name: 'Fitness',
    description: 'Gimnasios y entrenamiento personal',
    icon: '💪',
    color: 'from-yellow-500 to-orange-500',
    prompts: [
      'Automatiza el seguimiento de entrenamientos',
      'Crea planes personalizados',
      'Mejora la retención de miembros',
      'Optimiza la programación de clases'
    ],
    workflows: [
      'Seguimiento de progreso',
      'Recordatorios de entrenamiento',
      'Programación de clases',
      'Comunicación con miembros'
    ],
    metrics: ['Retención', 'Asistencia', 'Progreso', 'Satisfacción'],
    integrations: ['MyFitnessPal', 'Strava', 'Calendly', 'WhatsApp', 'Stripe']
  },
  {
    id: 'restaurant',
    name: 'Restaurantes',
    description: 'Servicios de comida y delivery',
    icon: '🍽️',
    color: 'from-pink-500 to-rose-500',
    prompts: [
      'Automatiza las reservas de mesa',
      'Mejora la experiencia del cliente',
      'Optimiza el inventario de ingredientes',
      'Crea campañas de fidelización'
    ],
    workflows: [
      'Gestión de reservas',
      'Seguimiento de pedidos',
      'Programas de lealtad',
      'Comunicación con clientes'
    ],
    metrics: ['Ocupación', 'Ticket promedio', 'Retención', 'Satisfacción'],
    integrations: ['OpenTable', 'Uber Eats', 'DoorDash', 'WhatsApp', 'Stripe']
  },
  {
    id: 'consulting',
    name: 'Consultoría',
    description: 'Servicios profesionales y asesoría',
    icon: '💼',
    color: 'from-gray-500 to-slate-500',
    prompts: [
      'Automatiza el proceso de propuestas',
      'Mejora el seguimiento de clientes',
      'Optimiza la gestión de proyectos',
      'Crea contenido de thought leadership'
    ],
    workflows: [
      'Generación de propuestas',
      'Seguimiento de clientes',
      'Gestión de proyectos',
      'Marketing de contenidos'
    ],
    metrics: ['Leads calificados', 'Tasa de cierre', 'Satisfacción', 'Renovaciones'],
    integrations: ['HubSpot', 'Slack', 'Calendly', 'DocuSign', 'LinkedIn']
  }
]

// Función para obtener sugerencias por industria
export function getIndustrySuggestions(industryId: string): string[] {
  const industry = INDUSTRIES.find(i => i.id === industryId)
  return industry?.prompts || []
}

// Función para generar respuesta del asistente IA
export async function generateAIResponse(
  message: string, 
  industryId: string, 
  context?: any
): Promise<AIResponse> {
  try {
    // Simular llamada a OpenAI
    const industry = INDUSTRIES.find(i => i.id === industryId)
    if (!industry) {
      throw new Error('Industria no encontrada')
    }

    // Simular procesamiento con IA
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Generar respuesta contextual basada en la industria
    const responses = {
      ecommerce: {
        message: `Para tu tienda de e-commerce, te recomiendo implementar un sistema de abandono de carrito con emails automatizados. Esto puede aumentar tus conversiones hasta un 15%.`,
        suggestions: [
          'Configurar emails de recuperación de carrito',
          'Implementar descuentos por tiempo limitado',
          'Optimizar el checkout para reducir fricción',
          'Crear campañas de remarketing'
        ],
        workflows: ['Abandono de carrito', 'Seguimiento post-venta'],
        nextSteps: [
          'Conectar tu plataforma de e-commerce',
          'Configurar triggers de abandono',
          'Diseñar emails de recuperación',
          'Establecer métricas de seguimiento'
        ],
        confidence: 0.92
      },
      saas: {
        message: `Para tu SaaS, el onboarding es clave. Te sugiero crear una secuencia automatizada que guíe a los usuarios desde el registro hasta la primera conversión.`,
        suggestions: [
          'Crear tour interactivo de la plataforma',
          'Implementar checkpoints de progreso',
          'Enviar tips personalizados por email',
          'Configurar alertas de inactividad'
        ],
        workflows: ['Onboarding automatizado', 'Upselling inteligente'],
        nextSteps: [
          'Mapear el journey del usuario',
          'Crear contenido educativo',
          'Configurar triggers de comportamiento',
          'Establecer métricas de activación'
        ],
        confidence: 0.89
      },
      realestate: {
        message: `En inmobiliaria, la calificación de leads es fundamental. Te ayudo a crear un sistema que identifique automáticamente los leads más calificados.`,
        suggestions: [
          'Implementar scoring de leads automático',
          'Crear secuencias de nurturing personalizadas',
          'Automatizar el seguimiento de propiedades',
          'Configurar recordatorios de citas'
        ],
        workflows: ['Nurturing de leads', 'Programación de citas'],
        nextSteps: [
          'Conectar tu CRM inmobiliario',
          'Definir criterios de calificación',
          'Crear secuencias de email',
          'Configurar integración con calendario'
        ],
        confidence: 0.87
      }
    }

    const response = responses[industryId as keyof typeof responses] || {
      message: `Basándome en tu industria ${industry.name}, te ayudo a optimizar tus procesos de automatización.`,
      suggestions: industry.prompts.slice(0, 3),
      workflows: industry.workflows.slice(0, 2),
      nextSteps: [
        'Analizar tus procesos actuales',
        'Identificar oportunidades de automatización',
        'Implementar workflows básicos',
        'Medir y optimizar resultados'
      ],
      confidence: 0.75
    }

    return response
  } catch (error) {
    return {
      message: 'Lo siento, hubo un error al procesar tu solicitud. Por favor, inténtalo de nuevo.',
      suggestions: ['Verificar conexión', 'Reformular la pregunta', 'Contactar soporte'],
      confidence: 0.1
    }
  }
}

// Función para obtener métricas relevantes por industria
export function getIndustryMetrics(industryId: string): string[] {
  const industry = INDUSTRIES.find(i => i.id === industryId)
  return industry?.metrics || []
}

// Función para obtener integraciones recomendadas por industria
export function getIndustryIntegrations(industryId: string): string[] {
  const industry = INDUSTRIES.find(i => i.id === industryId)
  return industry?.integrations || []
}
