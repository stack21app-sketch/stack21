'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Target, 
  CheckCircle,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Play,
  Pause,
  Settings
} from 'lucide-react'
import { abTesting } from '@/lib/ab-testing'

interface TestResult {
  name: string
  totalEvents: number
  conversions: number
  conversionRate: number
  totalValue: number
  avgValue: number
}

export default function ABTestingPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [testResults, setTestResults] = useState<{[testId: string]: {[variant: string]: TestResult}}>({})
  const [loading, setLoading] = useState(true)

  if (status === 'unauthenticated') {
    router.push('/auth/signin')
    return null
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando A/B tests...</p>
        </div>
      </div>
    )
  }

  useEffect(() => {
    loadTestResults()
  }, [])

  const loadTestResults = () => {
    setLoading(true)
    const activeTests = abTesting.getActiveTests()
    const results: {[testId: string]: {[variant: string]: TestResult}} = {}
    
    activeTests.forEach(test => {
      results[test.id] = abTesting.getTestResults(test.id)
    })
    
    setTestResults(results)
    setLoading(false)
  }

  const getConversionColor = (rate: number) => {
    if (rate >= 5) return 'text-green-600'
    if (rate >= 2) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getConversionIcon = (rate: number) => {
    if (rate >= 5) return <CheckCircle className="h-4 w-4 text-green-600" />
    if (rate >= 2) return <AlertTriangle className="h-4 w-4 text-yellow-600" />
    return <XCircle className="h-4 w-4 text-red-600" />
  }

  const getSignificance = (testId: string) => {
    return abTesting.calculateSignificance(testId)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <BarChart3 className="mr-3 h-8 w-8 text-blue-600" />
              A/B Testing Dashboard
            </h1>
            <p className="text-gray-600 mt-2">
              Optimiza conversiones con pruebas A/B en tiempo real
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button onClick={loadTestResults} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Actualizar
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Configurar
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando resultados...</p>
          </div>
        ) : (
          <>
            {/* Tests Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Play className="h-8 w-8 text-blue-600 mr-3" />
                    <div>
                      <p className="text-2xl font-bold">{Object.keys(testResults).length}</p>
                      <p className="text-sm text-gray-600">Tests Activos</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Users className="h-8 w-8 text-green-600 mr-3" />
                    <div>
                      <p className="text-2xl font-bold">
                        {Object.values(testResults).reduce((total, test) => 
                          total + Object.values(test).reduce((sum, variant) => sum + variant.totalEvents, 0), 0
                        )}
                      </p>
                      <p className="text-sm text-gray-600">Total Participantes</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Target className="h-8 w-8 text-purple-600 mr-3" />
                    <div>
                      <p className="text-2xl font-bold">
                        {Object.values(testResults).reduce((total, test) => 
                          total + Object.values(test).reduce((sum, variant) => sum + variant.conversions, 0), 0
                        )}
                      </p>
                      <p className="text-sm text-gray-600">Total Conversiones</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Individual Tests */}
            {Object.entries(testResults).map(([testId, variants]) => {
              const significance = getSignificance(testId)
              const test = abTesting.getActiveTest(testId)
              
              return (
                <Card key={testId}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-xl">{test?.name}</CardTitle>
                        <CardDescription>Test ID: {testId}</CardDescription>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={test?.isActive ? "default" : "secondary"}>
                          {test?.isActive ? "Activo" : "Inactivo"}
                        </Badge>
                        {significance.isSignificant && (
                          <Badge variant="outline" className="text-green-600 border-green-600">
                            Significativo ({significance.confidence.toFixed(1)}%)
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {Object.entries(variants).map(([variantId, result]) => (
                        <div key={variantId} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-lg">{result.name}</h3>
                            <Badge variant="outline">Variante {variantId}</Badge>
                          </div>
                          
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">Participantes:</span>
                              <span className="font-semibold">{result.totalEvents}</span>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">Conversiones:</span>
                              <span className="font-semibold">{result.conversions}</span>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">Tasa de conversión:</span>
                              <div className="flex items-center space-x-2">
                                {getConversionIcon(result.conversionRate)}
                                <span className={`font-semibold ${getConversionColor(result.conversionRate)}`}>
                                  {result.conversionRate.toFixed(2)}%
                                </span>
                              </div>
                            </div>

                            {result.avgValue > 0 && (
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Valor promedio:</span>
                                <span className="font-semibold">${result.avgValue.toFixed(2)}</span>
                              </div>
                            )}
                          </div>

                          {/* Progress bar */}
                          <div className="mt-4">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full" 
                                style={{ width: `${Math.min(result.conversionRate * 10, 100)}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Test Actions */}
                    <div className="mt-6 flex items-center justify-between pt-4 border-t">
                      <div className="text-sm text-gray-600">
                        Duración: {test?.startDate ? Math.ceil((Date.now() - test.startDate.getTime()) / (1000 * 60 * 60 * 24)) : 0} días
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Pause className="h-4 w-4 mr-2" />
                          Pausar
                        </Button>
                        <Button variant="outline" size="sm">
                          <Settings className="h-4 w-4 mr-2" />
                          Editar
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}

            {/* No tests message */}
            {Object.keys(testResults).length === 0 && (
              <Card>
                <CardContent className="text-center py-12">
                  <BarChart3 className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-700 mb-2">
                    No hay tests A/B activos
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Los tests A/B aparecerán aquí una vez que estén configurados y activos.
                  </p>
                  <Button>
                    <Play className="h-4 w-4 mr-2" />
                    Crear Nuevo Test
                  </Button>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  )
}
