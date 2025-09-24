import { NextRequest, NextResponse } from 'next/server'
import { 
  MAIN_METRICS, 
  PREDICTIONS, 
  INSIGHTS, 
  getMetricsByCategory,
  getHighImpactInsights,
  getPredictionsByConfidence
} from '@/lib/analytics'

// GET /api/analytics - Obtener métricas y analytics
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const type = searchParams.get('type') // metrics, predictions, insights

    console.log(`📊 GET /api/analytics: type=${type}, category=${category}`)

    switch (type) {
      case 'metrics':
        const metrics = category ? getMetricsByCategory(category) : MAIN_METRICS
        console.log(`✅ Métricas obtenidas: ${metrics.length} items`)
        return NextResponse.json({
          success: true,
          data: metrics,
          total: metrics.length,
          category: category || 'all'
        })

      case 'predictions':
        const minConfidence = parseFloat(searchParams.get('minConfidence') || '0.8')
        const predictions = getPredictionsByConfidence(minConfidence)
        console.log(`✅ Predicciones obtenidas: ${predictions.length} items (minConfidence: ${minConfidence})`)
        return NextResponse.json({
          success: true,
          data: predictions,
          total: predictions.length,
          minConfidence
        })

      case 'insights':
        const insights = getHighImpactInsights()
        console.log(`✅ Insights obtenidos: ${insights.length} items`)
        return NextResponse.json({
          success: true,
          data: insights,
          total: insights.length
        })

      default:
        console.log('✅ Analytics completos obtenidos')
        return NextResponse.json({
          success: true,
          data: {
            metrics: MAIN_METRICS,
            predictions: PREDICTIONS,
            insights: INSIGHTS
          },
          summary: {
            totalMetrics: MAIN_METRICS.length,
            totalPredictions: PREDICTIONS.length,
            totalInsights: INSIGHTS.length
          }
        })
    }
  } catch (error) {
    console.error('❌ Error fetching analytics:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: 'Error al obtener analytics',
        error: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : 'Unknown error') : undefined
      },
      { status: 500 }
    )
  }
}

// POST /api/analytics - Generar nuevo insight
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { metricId, action } = body

    if (!metricId) {
      return NextResponse.json(
        { success: false, message: 'ID de métrica requerido' },
        { status: 400 }
      )
    }

    const metric = MAIN_METRICS.find(m => m.id === metricId)
    if (!metric) {
      return NextResponse.json(
        { success: false, message: 'Métrica no encontrada' },
        { status: 404 }
      )
    }

    // Simular generación de insight
    const insight = {
      id: `insight-${Date.now()}`,
      type: 'opportunity',
      title: `Optimizar ${metric.name}`,
      description: `Tu ${metric.name.toLowerCase()} está en ${metric.value}${metric.unit}. Con las optimizaciones correctas, podrías alcanzar ${metric.prediction}${metric.unit}.`,
      impact: 'high',
      action: `Implementar estrategias de optimización para ${metric.name.toLowerCase()}`,
      value: Math.round(((metric.prediction || metric.value) - metric.value) / metric.value * 100),
      timeframe: '2-4 semanas'
    }

    return NextResponse.json({
      success: true,
      data: insight,
      message: 'Insight generado exitosamente'
    })
  } catch (error) {
    console.error('Error generating insight:', error)
    return NextResponse.json(
      { success: false, message: 'Error al generar insight' },
      { status: 500 }
    )
  }
}