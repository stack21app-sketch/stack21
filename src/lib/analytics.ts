// Sistema de analytics predictivos para Stack21
export interface Metric {
  id: string
  name: string
  value: number
  change: number
  changeType: 'increase' | 'decrease' | 'neutral'
  trend: 'up' | 'down' | 'stable'
  prediction?: number
  confidence: number
  unit: string
  category: 'conversion' | 'engagement' | 'revenue' | 'performance'
}

export interface ChartData {
  labels: string[]
  datasets: {
    label: string
    data: number[]
    borderColor: string
    backgroundColor: string
    fill?: boolean
  }[]
}

export interface Prediction {
  metric: string
  currentValue: number
  predictedValue: number
  confidence: number
  timeframe: string
  factors: string[]
  recommendations: string[]
}

export interface Insight {
  id: string
  type: 'opportunity' | 'warning' | 'success' | 'info'
  title: string
  description: string
  impact: 'high' | 'medium' | 'low'
  action: string
  value?: number
  timeframe?: string
}

// Métricas principales
export const MAIN_METRICS: Metric[] = [
  {
    id: 'conversion_rate',
    name: 'Tasa de Conversión',
    value: 3.2,
    change: 0.8,
    changeType: 'increase',
    trend: 'up',
    prediction: 3.8,
    confidence: 0.85,
    unit: '%',
    category: 'conversion'
  },
  {
    id: 'email_open_rate',
    name: 'Tasa de Apertura de Emails',
    value: 24.5,
    change: -1.2,
    changeType: 'decrease',
    trend: 'down',
    prediction: 22.1,
    confidence: 0.78,
    unit: '%',
    category: 'engagement'
  },
  {
    id: 'revenue',
    name: 'Ingresos Mensuales',
    value: 125000,
    change: 12.5,
    changeType: 'increase',
    trend: 'up',
    prediction: 145000,
    confidence: 0.92,
    unit: '$',
    category: 'revenue'
  },
  {
    id: 'customer_acquisition_cost',
    name: 'Costo de Adquisición',
    value: 45.2,
    change: -8.3,
    changeType: 'decrease',
    trend: 'up',
    prediction: 38.9,
    confidence: 0.88,
    unit: '$',
    category: 'performance'
  },
  {
    id: 'customer_lifetime_value',
    name: 'Valor de Vida del Cliente',
    value: 1250,
    change: 15.7,
    changeType: 'increase',
    trend: 'up',
    prediction: 1450,
    confidence: 0.91,
    unit: '$',
    category: 'revenue'
  },
  {
    id: 'churn_rate',
    name: 'Tasa de Churn',
    value: 2.1,
    change: -0.5,
    changeType: 'decrease',
    trend: 'up',
    prediction: 1.8,
    confidence: 0.83,
    unit: '%',
    category: 'performance'
  }
]

// Datos de gráficos
export const CONVERSION_CHART_DATA: ChartData = {
  labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
  datasets: [
    {
      label: 'Tasa de Conversión',
      data: [2.1, 2.3, 2.8, 3.1, 2.9, 3.2, 3.0, 3.4, 3.2, 3.5, 3.8, 3.2],
      borderColor: 'rgb(59, 130, 246)',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      fill: true
    },
    {
      label: 'Predicción',
      data: [2.1, 2.3, 2.8, 3.1, 2.9, 3.2, 3.0, 3.4, 3.2, 3.5, 3.8, 4.2],
      borderColor: 'rgb(16, 185, 129)',
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
      fill: false
    }
  ]
}

export const REVENUE_CHART_DATA: ChartData = {
  labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
  datasets: [
    {
      label: 'Ingresos',
      data: [85000, 92000, 98000, 105000, 112000, 118000, 120000, 125000, 128000, 132000, 135000, 125000],
      borderColor: 'rgb(168, 85, 247)',
      backgroundColor: 'rgba(168, 85, 247, 0.1)',
      fill: true
    },
    {
      label: 'Predicción',
      data: [85000, 92000, 98000, 105000, 112000, 118000, 120000, 125000, 128000, 132000, 135000, 145000],
      borderColor: 'rgb(34, 197, 94)',
      backgroundColor: 'rgba(34, 197, 94, 0.1)',
      fill: false
    }
  ]
}

// Predicciones
export const PREDICTIONS: Prediction[] = [
  {
    metric: 'Tasa de Conversión',
    currentValue: 3.2,
    predictedValue: 3.8,
    confidence: 0.85,
    timeframe: 'Próximos 30 días',
    factors: ['Optimización de landing pages', 'Mejora en targeting', 'Nuevas campañas estacionales'],
    recommendations: [
      'Implementar A/B testing en formularios de contacto',
      'Optimizar velocidad de carga de páginas',
      'Mejorar copy de CTAs'
    ]
  },
  {
    metric: 'Ingresos Mensuales',
    currentValue: 125000,
    predictedValue: 145000,
    confidence: 0.92,
    timeframe: 'Próximos 60 días',
    factors: ['Nuevos clientes corporativos', 'Expansión de productos', 'Mejora en retención'],
    recommendations: [
      'Lanzar programa de referidos',
      'Implementar upselling automatizado',
      'Mejorar onboarding de clientes'
    ]
  },
  {
    metric: 'Costo de Adquisición',
    currentValue: 45.2,
    predictedValue: 38.9,
    confidence: 0.88,
    timeframe: 'Próximos 45 días',
    factors: ['Mejora en targeting', 'Optimización de canales', 'Aumento en conversión'],
    recommendations: [
      'Refinar audiencias de Facebook Ads',
      'Implementar retargeting inteligente',
      'Optimizar funnel de conversión'
    ]
  }
]

// Insights generados por IA
export const INSIGHTS: Insight[] = [
  {
    id: 'insight-1',
    type: 'opportunity',
    title: 'Optimización de Email Marketing',
    description: 'Tus emails de bienvenida tienen una tasa de apertura del 45%, pero solo 8% de clics. Optimizar el contenido puede aumentar conversiones.',
    impact: 'high',
    action: 'Revisar y optimizar templates de email',
    value: 23,
    timeframe: '2 semanas'
  },
  {
    id: 'insight-2',
    type: 'warning',
    title: 'Aumento en Tasa de Churn',
    description: 'La tasa de churn ha aumentado 0.3% en el último mes. Los usuarios se van principalmente en el día 7.',
    impact: 'medium',
    action: 'Implementar secuencia de retención',
    value: -15,
    timeframe: '1 mes'
  },
  {
    id: 'insight-3',
    type: 'success',
    title: 'Mejora en Conversión Móvil',
    description: 'Las conversiones desde dispositivos móviles han aumentado 34% después de la optimización de la landing page.',
    impact: 'high',
    action: 'Aplicar optimizaciones similares a otras páginas',
    value: 34,
    timeframe: 'Completado'
  },
  {
    id: 'insight-4',
    type: 'info',
    title: 'Nueva Oportunidad de Mercado',
    description: 'Análisis de datos muestra alta demanda en el segmento de empresas de 50-200 empleados.',
    impact: 'medium',
    action: 'Crear campaña dirigida a este segmento',
    value: 18,
    timeframe: '3 semanas'
  }
]

// Funciones de utilidad
export function getMetricsByCategory(category: string): Metric[] {
  return MAIN_METRICS.filter(metric => metric.category === category)
}

export function getHighImpactInsights(): Insight[] {
  return INSIGHTS.filter(insight => insight.impact === 'high')
}

export function getPredictionsByConfidence(minConfidence: number): Prediction[] {
  return PREDICTIONS.filter(prediction => prediction.confidence >= minConfidence)
}

export function calculateROI(investment: number, returns: number): number {
  return ((returns - investment) / investment) * 100
}

export function generateInsight(metric: Metric): Insight {
  const insights = [
    {
      type: 'opportunity' as const,
      title: `Optimizar ${metric.name}`,
      description: `Tu ${metric.name.toLowerCase()} está en ${metric.value}${metric.unit}. Con las optimizaciones correctas, podrías alcanzar ${metric.prediction}${metric.unit}.`,
      impact: 'high' as const,
      action: `Implementar estrategias de optimización para ${metric.name.toLowerCase()}`,
      value: Math.round(((metric.prediction || metric.value) - metric.value) / metric.value * 100),
      timeframe: '2-4 semanas'
    }
  ]

  return {
    ...insights[0],
    id: `insight-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }
}

export function getTrendAnalysis(metric: Metric): string {
  if (metric.trend === 'up' && metric.changeType === 'increase') {
    return 'Tendencia positiva y creciente'
  } else if (metric.trend === 'up' && metric.changeType === 'decrease') {
    return 'Tendencia positiva pero con disminución reciente'
  } else if (metric.trend === 'down' && metric.changeType === 'increase') {
    return 'Tendencia negativa pero con mejora reciente'
  } else {
    return 'Tendencia negativa y decreciente'
  }
}

export function getRecommendation(metric: Metric): string {
  const recommendations = {
    conversion_rate: 'Optimizar formularios y CTAs, implementar A/B testing',
    email_open_rate: 'Mejorar subject lines, optimizar horarios de envío',
    revenue: 'Implementar upselling, mejorar retención de clientes',
    customer_acquisition_cost: 'Optimizar canales de adquisición, mejorar targeting',
    customer_lifetime_value: 'Mejorar experiencia del cliente, implementar programas de lealtad',
    churn_rate: 'Implementar secuencias de retención, mejorar onboarding'
  }

  return recommendations[metric.id as keyof typeof recommendations] || 'Revisar métricas y implementar mejoras'
}