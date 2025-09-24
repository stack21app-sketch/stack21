// Sistema de Smart Dashboard con IA para Stack21
export interface DashboardInsight {
  id: string
  type: 'performance' | 'optimization' | 'alert' | 'recommendation' | 'trend'
  title: string
  description: string
  priority: 'low' | 'medium' | 'high' | 'critical'
  category: 'workflow' | 'integration' | 'user' | 'system' | 'business'
  impact: 'positive' | 'negative' | 'neutral'
  confidence: number // 0-100
  actionable: boolean
  action?: {
    type: 'configure' | 'optimize' | 'fix' | 'upgrade' | 'learn'
    title: string
    description: string
    url?: string
  }
  metrics?: {
    current: number
    previous: number
    target?: number
    unit: string
  }
  createdAt: Date
  expiresAt?: Date
}

export interface SmartMetric {
  id: string
  name: string
  value: number
  previousValue: number
  change: number
  changePercent: number
  trend: 'up' | 'down' | 'stable'
  unit: string
  category: 'performance' | 'usage' | 'revenue' | 'efficiency'
  icon: string
  color: string
  description: string
  prediction?: {
    value: number
    confidence: number
    timeframe: string
  }
}

export interface WorkflowRecommendation {
  id: string
  title: string
  description: string
  type: 'optimization' | 'automation' | 'integration' | 'scaling'
  priority: 'low' | 'medium' | 'high'
  effort: 'low' | 'medium' | 'high'
  impact: 'low' | 'medium' | 'high'
  estimatedSavings: {
    time: number // en horas
    cost: number // en USD
  }
  steps: string[]
  prerequisites: string[]
  category: string
  tags: string[]
}

export interface UserBehavior {
  userId: string
  userName: string
  activity: {
    workflowsCreated: number
    workflowsExecuted: number
    integrationsUsed: number
    timeSpent: number // en minutos
    lastActive: Date
  }
  performance: {
    efficiency: number // 0-100
    productivity: number // 0-100
    collaboration: number // 0-100
  }
  insights: string[]
  recommendations: string[]
}

export interface SystemHealth {
  status: 'healthy' | 'warning' | 'critical'
  uptime: number // porcentaje
  performance: number // 0-100
  errors: number
  warnings: number
  lastCheck: Date
  components: {
    database: 'healthy' | 'warning' | 'critical'
    api: 'healthy' | 'warning' | 'critical'
    integrations: 'healthy' | 'warning' | 'critical'
    ai: 'healthy' | 'warning' | 'critical'
  }
}

// Métricas inteligentes de ejemplo
export const SMART_METRICS: SmartMetric[] = [
  {
    id: 'workflow-efficiency',
    name: 'Eficiencia de Workflows',
    value: 87,
    previousValue: 82,
    change: 5,
    changePercent: 6.1,
    trend: 'up',
    unit: '%',
    category: 'performance',
    icon: '⚡',
    color: 'text-green-400',
    description: 'Porcentaje de workflows que se ejecutan sin errores',
    prediction: {
      value: 92,
      confidence: 85,
      timeframe: 'próximos 30 días'
    }
  },
  {
    id: 'automation-savings',
    name: 'Ahorro por Automatización',
    value: 1240,
    previousValue: 980,
    change: 260,
    changePercent: 26.5,
    trend: 'up',
    unit: 'horas/mes',
    category: 'efficiency',
    icon: '💰',
    color: 'text-blue-400',
    description: 'Tiempo ahorrado mensualmente por automatización',
    prediction: {
      value: 1580,
      confidence: 78,
      timeframe: 'próximos 30 días'
    }
  },
  {
    id: 'user-engagement',
    name: 'Engagement de Usuarios',
    value: 73,
    previousValue: 68,
    change: 5,
    changePercent: 7.4,
    trend: 'up',
    unit: '%',
    category: 'usage',
    icon: '👥',
    color: 'text-purple-400',
    description: 'Porcentaje de usuarios activos diariamente',
    prediction: {
      value: 78,
      confidence: 82,
      timeframe: 'próximos 30 días'
    }
  },
  {
    id: 'integration-success',
    name: 'Éxito de Integraciones',
    value: 94,
    previousValue: 91,
    change: 3,
    changePercent: 3.3,
    trend: 'up',
    unit: '%',
    category: 'performance',
    icon: '🔗',
    color: 'text-cyan-400',
    description: 'Tasa de éxito de las integraciones activas',
    prediction: {
      value: 96,
      confidence: 88,
      timeframe: 'próximos 30 días'
    }
  },
  {
    id: 'ai-accuracy',
    name: 'Precisión de IA',
    value: 89,
    previousValue: 85,
    change: 4,
    changePercent: 4.7,
    trend: 'up',
    unit: '%',
    category: 'performance',
    icon: '🧠',
    color: 'text-orange-400',
    description: 'Precisión de las predicciones y recomendaciones de IA',
    prediction: {
      value: 92,
      confidence: 75,
      timeframe: 'próximos 30 días'
    }
  },
  {
    id: 'cost-optimization',
    name: 'Optimización de Costos',
    value: 15,
    previousValue: 12,
    change: 3,
    changePercent: 25.0,
    trend: 'up',
    unit: '%',
    category: 'revenue',
    icon: '📊',
    color: 'text-emerald-400',
    description: 'Reducción de costos operativos mensuales',
    prediction: {
      value: 18,
      confidence: 80,
      timeframe: 'próximos 30 días'
    }
  }
]

// Insights inteligentes de ejemplo
export const SMART_INSIGHTS: DashboardInsight[] = [
  {
    id: 'workflow-optimization-1',
    type: 'optimization',
    title: 'Optimización de Workflow Detectada',
    description: 'El workflow "Email Marketing Campaign" puede optimizarse reduciendo 3 pasos redundantes, ahorrando 45 minutos por ejecución.',
    priority: 'medium',
    category: 'workflow',
    impact: 'positive',
    confidence: 92,
    actionable: true,
    action: {
      type: 'optimize',
      title: 'Optimizar Workflow',
      description: 'Revisar y eliminar pasos redundantes',
      url: '/workflow-builder/email-marketing-campaign'
    },
    metrics: {
      current: 12,
      previous: 15,
      target: 8,
      unit: 'pasos'
    },
    createdAt: new Date('2024-01-20T10:30:00Z')
  },
  {
    id: 'integration-alert-1',
    type: 'alert',
    title: 'Integración con Problemas',
    description: 'La integración con Salesforce ha fallado 3 veces en las últimas 2 horas. Revisar configuración de API.',
    priority: 'high',
    category: 'integration',
    impact: 'negative',
    confidence: 95,
    actionable: true,
    action: {
      type: 'fix',
      title: 'Revisar Integración',
      description: 'Verificar configuración de Salesforce API',
      url: '/integrations/salesforce'
    },
    metrics: {
      current: 3,
      previous: 0,
      unit: 'errores'
    },
    createdAt: new Date('2024-01-20T14:15:00Z')
  },
  {
    id: 'ai-recommendation-1',
    type: 'recommendation',
    title: 'Nueva Integración Recomendada',
    description: 'Basado en tus workflows actuales, te recomendamos integrar HubSpot para mejorar la gestión de leads.',
    priority: 'low',
    category: 'integration',
    impact: 'positive',
    confidence: 78,
    actionable: true,
    action: {
      type: 'configure',
      title: 'Configurar HubSpot',
      description: 'Agregar integración con HubSpot',
      url: '/integrations/hubspot'
    },
    createdAt: new Date('2024-01-20T09:00:00Z')
  },
  {
    id: 'performance-trend-1',
    type: 'trend',
    title: 'Tendencia de Rendimiento Positiva',
    description: 'El rendimiento general de la plataforma ha mejorado un 15% en la última semana.',
    priority: 'low',
    category: 'system',
    impact: 'positive',
    confidence: 88,
    actionable: false,
    metrics: {
      current: 87,
      previous: 72,
      unit: '%'
    },
    createdAt: new Date('2024-01-20T08:00:00Z')
  },
  {
    id: 'user-behavior-1',
    type: 'recommendation',
    title: 'Oportunidad de Capacitación',
    description: 'El equipo podría beneficiarse de una capacitación en automatización avanzada. 3 usuarios tienen workflows básicos que podrían optimizarse.',
    priority: 'medium',
    category: 'user',
    impact: 'positive',
    confidence: 82,
    actionable: true,
    action: {
      type: 'learn',
      title: 'Programar Capacitación',
      description: 'Organizar sesión de capacitación en automatización',
      url: '/training/automation-advanced'
    },
    createdAt: new Date('2024-01-19T16:30:00Z')
  }
]

// Recomendaciones de workflows de ejemplo
export const WORKFLOW_RECOMMENDATIONS: WorkflowRecommendation[] = [
  {
    id: 'rec-1',
    title: 'Automatizar Seguimiento de Leads',
    description: 'Crea un workflow que envíe emails de seguimiento automáticos basados en el comportamiento del lead.',
    type: 'automation',
    priority: 'high',
    effort: 'medium',
    impact: 'high',
    estimatedSavings: {
      time: 20,
      cost: 500
    },
    steps: [
      'Configurar trigger de comportamiento',
      'Crear plantillas de email personalizadas',
      'Establecer reglas de segmentación',
      'Configurar métricas de seguimiento'
    ],
    prerequisites: ['Integración con CRM', 'Plantillas de email'],
    category: 'marketing',
    tags: ['leads', 'email', 'automation', 'crm']
  },
  {
    id: 'rec-2',
    title: 'Optimizar Proceso de Onboarding',
    description: 'Automatiza el proceso de incorporación de nuevos clientes con emails personalizados y tareas automáticas.',
    type: 'optimization',
    priority: 'medium',
    effort: 'low',
    impact: 'medium',
    estimatedSavings: {
      time: 15,
      cost: 300
    },
    steps: [
      'Mapear proceso actual de onboarding',
      'Crear secuencia de emails automatizada',
      'Configurar tareas de seguimiento',
      'Implementar métricas de éxito'
    ],
    prerequisites: ['Sistema de emails', 'Base de datos de clientes'],
    category: 'customer-success',
    tags: ['onboarding', 'automation', 'customer-success']
  },
  {
    id: 'rec-3',
    title: 'Integrar Analytics Avanzados',
    description: 'Conecta Google Analytics con tu CRM para obtener insights más profundos sobre el comportamiento de los clientes.',
    type: 'integration',
    priority: 'medium',
    effort: 'high',
    impact: 'high',
    estimatedSavings: {
      time: 30,
      cost: 800
    },
    steps: [
      'Configurar conexión con Google Analytics',
      'Mapear eventos de conversión',
      'Crear dashboard personalizado',
      'Configurar alertas automáticas'
    ],
    prerequisites: ['Google Analytics', 'CRM configurado'],
    category: 'analytics',
    tags: ['analytics', 'integration', 'insights']
  }
]

// Comportamiento de usuarios de ejemplo
export const USER_BEHAVIORS: UserBehavior[] = [
  {
    userId: 'user-1',
    userName: 'María González',
    activity: {
      workflowsCreated: 12,
      workflowsExecuted: 156,
      integrationsUsed: 8,
      timeSpent: 420,
      lastActive: new Date('2024-01-20T15:30:00Z')
    },
    performance: {
      efficiency: 85,
      productivity: 92,
      collaboration: 78
    },
    insights: [
      'Usuaria más productiva del equipo',
      'Crea workflows complejos regularmente',
      'Excelente uso de integraciones'
    ],
    recommendations: [
      'Considerar como mentora para nuevos usuarios',
      'Explorar funcionalidades avanzadas de IA'
    ]
  },
  {
    userId: 'user-2',
    userName: 'Carlos Ruiz',
    activity: {
      workflowsCreated: 5,
      workflowsExecuted: 89,
      integrationsUsed: 3,
      timeSpent: 280,
      lastActive: new Date('2024-01-20T12:15:00Z')
    },
    performance: {
      efficiency: 72,
      productivity: 68,
      collaboration: 85
    },
    insights: [
      'Usuario intermedio con potencial de crecimiento',
      'Prefiere workflows simples',
      'Buen colaborador en equipo'
    ],
    recommendations: [
      'Capacitación en automatización avanzada',
      'Explorar más integraciones disponibles'
    ]
  }
]

// Salud del sistema de ejemplo
export const SYSTEM_HEALTH: SystemHealth = {
  status: 'healthy',
  uptime: 99.9,
  performance: 87,
  errors: 2,
  warnings: 5,
  lastCheck: new Date('2024-01-20T15:45:00Z'),
  components: {
    database: 'healthy',
    api: 'healthy',
    integrations: 'warning',
    ai: 'healthy'
  }
}

// Funciones de utilidad
export function getInsightsByPriority(priority: string): DashboardInsight[] {
  return SMART_INSIGHTS.filter(insight => insight.priority === priority)
}

export function getInsightsByCategory(category: string): DashboardInsight[] {
  return SMART_INSIGHTS.filter(insight => insight.category === category)
}

export function getActionableInsights(): DashboardInsight[] {
  return SMART_INSIGHTS.filter(insight => insight.actionable)
}

export function getCriticalInsights(): DashboardInsight[] {
  return SMART_INSIGHTS.filter(insight => insight.priority === 'critical')
}

export function getMetricsByCategory(category: string): SmartMetric[] {
  return SMART_METRICS.filter(metric => metric.category === category)
}

export function getTopPerformingMetrics(): SmartMetric[] {
  return SMART_METRICS
    .filter(metric => metric.trend === 'up')
    .sort((a, b) => b.changePercent - a.changePercent)
}

export function getRecommendationsByPriority(priority: string): WorkflowRecommendation[] {
  return WORKFLOW_RECOMMENDATIONS.filter(rec => rec.priority === priority)
}

export function getHighImpactRecommendations(): WorkflowRecommendation[] {
  return WORKFLOW_RECOMMENDATIONS.filter(rec => rec.impact === 'high')
}

export function getDashboardSummary() {
  const totalInsights = SMART_INSIGHTS.length
  const criticalInsights = getCriticalInsights().length
  const actionableInsights = getActionableInsights().length
  const totalRecommendations = WORKFLOW_RECOMMENDATIONS.length
  const highImpactRecommendations = getHighImpactRecommendations().length

  return {
    insights: {
      total: totalInsights,
      critical: criticalInsights,
      actionable: actionableInsights
    },
    recommendations: {
      total: totalRecommendations,
      highImpact: highImpactRecommendations
    },
    systemHealth: SYSTEM_HEALTH,
    lastUpdated: new Date()
  }
}
