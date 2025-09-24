// Sistema de A/B Testing para optimización de conversiones
export interface ABTest {
  id: string
  name: string
  variants: {
    [key: string]: {
      name: string
      weight: number
      config: any
    }
  }
  isActive: boolean
  startDate: Date
  endDate?: Date
}

export interface ABTestResult {
  testId: string
  variant: string
  userId: string
  timestamp: Date
  conversion?: boolean
  conversionValue?: number
}

class ABTestingService {
  private tests: Map<string, ABTest> = new Map()
  private results: ABTestResult[] = []

  // Configuración de tests activos
  constructor() {
    this.initializeTests()
  }

  private initializeTests() {
    // Test 1: Hero Headline
    this.tests.set('hero-headline', {
      id: 'hero-headline',
      name: 'Hero Headline Test',
      variants: {
        'A': {
          name: 'Control',
          weight: 50,
          config: {
            headline: 'Automatiza tu Negocio con IA',
            subheadline: 'Stack21 combina inteligencia artificial, facturación automática y gestión multi-tenant para revolucionar tu negocio.'
          }
        },
        'B': {
          name: 'Benefit-focused',
          weight: 50,
          config: {
            headline: 'Ahorra 40% de Tiempo con IA Especializada',
            subheadline: 'La única plataforma con IA por industria que automatiza procesos específicos de tu sector en minutos.'
          }
        }
      },
      isActive: true,
      startDate: new Date()
    })

    // Test 2: CTA Button Text
    this.tests.set('cta-button', {
      id: 'cta-button',
      name: 'CTA Button Text Test',
      variants: {
        'A': {
          name: 'Control',
          weight: 50,
          config: {
            primaryCta: 'Comenzar Prueba Gratis',
            secondaryCta: 'Ver Demo en Vivo'
          }
        },
        'B': {
          name: 'Urgency-focused',
          weight: 50,
          config: {
            primaryCta: 'Comenzar Ahora - Gratis',
            secondaryCta: 'Ver Demo Exclusivo'
          }
        }
      },
      isActive: true,
      startDate: new Date()
    })

    // Test 3: Pricing Page Layout
    this.tests.set('pricing-layout', {
      id: 'pricing-layout',
      name: 'Pricing Page Layout Test',
      variants: {
        'A': {
          name: 'Control',
          weight: 50,
          config: {
            layout: 'standard',
            highlightPlan: 'pro'
          }
        },
        'B': {
          name: 'Enterprise-focused',
          weight: 50,
          config: {
            layout: 'enterprise-first',
            highlightPlan: 'enterprise'
          }
        }
      },
      isActive: true,
      startDate: new Date()
    })
  }

  // Obtener variante para un usuario
  getVariant(testId: string, userId: string): string | null {
    const test = this.tests.get(testId)
    if (!test || !test.isActive) return null

    // Usar hash del userId para consistencia
    const hash = this.hashString(userId + testId)
    const hashValue = hash % 100

    let cumulativeWeight = 0
    for (const [variantId, variant] of Object.entries(test.variants)) {
      cumulativeWeight += variant.weight
      if (hashValue < cumulativeWeight) {
        return variantId
      }
    }

    return Object.keys(test.variants)[0] // Fallback
  }

  // Obtener configuración de variante
  getVariantConfig(testId: string, variant: string): any {
    const test = this.tests.get(testId)
    if (!test || !test.variants[variant]) return null

    return test.variants[variant].config
  }

  // Registrar conversión
  recordConversion(testId: string, variant: string, userId: string, conversionValue?: number) {
    const result: ABTestResult = {
      testId,
      variant,
      userId,
      timestamp: new Date(),
      conversion: true,
      conversionValue
    }
    this.results.push(result)
  }

  // Registrar evento (no conversión)
  recordEvent(testId: string, variant: string, userId: string) {
    const result: ABTestResult = {
      testId,
      variant,
      userId,
      timestamp: new Date(),
      conversion: false
    }
    this.results.push(result)
  }

  // Obtener resultados de test
  getTestResults(testId: string) {
    const testResults = this.results.filter(r => r.testId === testId)
    const variants = this.tests.get(testId)?.variants || {}

    const results: { [variant: string]: any } = {}
    
    for (const variantId of Object.keys(variants)) {
      const variantResults = testResults.filter(r => r.variant === variantId)
      const conversions = variantResults.filter(r => r.conversion)
      
      results[variantId] = {
        name: variants[variantId].name,
        totalEvents: variantResults.length,
        conversions: conversions.length,
        conversionRate: variantResults.length > 0 ? (conversions.length / variantResults.length) * 100 : 0,
        totalValue: conversions.reduce((sum, r) => sum + (r.conversionValue || 0), 0),
        avgValue: conversions.length > 0 ? conversions.reduce((sum, r) => sum + (r.conversionValue || 0), 0) / conversions.length : 0
      }
    }

    return results
  }

  // Obtener test activo
  getActiveTest(testId: string): ABTest | null {
    return this.tests.get(testId) || null
  }

  // Obtener todos los tests activos
  getActiveTests(): ABTest[] {
    return Array.from(this.tests.values()).filter(test => test.isActive)
  }

  // Función hash simple
  private hashString(str: string): number {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32bit integer
    }
    return Math.abs(hash)
  }

  // Calcular significancia estadística (simplificado)
  calculateSignificance(testId: string): { isSignificant: boolean; confidence: number } {
    const results = this.getTestResults(testId)
    const variants = Object.keys(results)
    
    if (variants.length < 2) {
      return { isSignificant: false, confidence: 0 }
    }

    const [variantA, variantB] = variants
    const resultA = results[variantA]
    const resultB = results[variantB]

    // Cálculo simplificado de significancia
    const n1 = resultA.totalEvents
    const n2 = resultB.totalEvents
    const p1 = resultA.conversionRate / 100
    const p2 = resultB.conversionRate / 100

    if (n1 < 30 || n2 < 30) {
      return { isSignificant: false, confidence: 0 }
    }

    // Z-test simplificado
    const p = (resultA.conversions + resultB.conversions) / (n1 + n2)
    const se = Math.sqrt(p * (1 - p) * (1/n1 + 1/n2))
    const z = Math.abs(p1 - p2) / se

    // 95% confidence level
    const isSignificant = z > 1.96
    const confidence = Math.min(95, (z / 1.96) * 95)

    return { isSignificant, confidence }
  }
}

// Singleton instance
export const abTesting = new ABTestingService()

// Hook para React
export function useABTest(testId: string, userId: string) {
  const variant = abTesting.getVariant(testId, userId)
  const config = variant ? abTesting.getVariantConfig(testId, variant) : null
  const test = abTesting.getActiveTest(testId)

  return {
    variant,
    config,
    test,
    recordConversion: (conversionValue?: number) => {
      if (variant) {
        abTesting.recordConversion(testId, variant, userId, conversionValue)
      }
    },
    recordEvent: () => {
      if (variant) {
        abTesting.recordEvent(testId, variant, userId)
      }
    }
  }
}
