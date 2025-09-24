'use client'

import { useState, useEffect, useContext } from 'react'
import { I18nContext } from '@/lib/i18n'
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
  MousePointer, 
  Target, 
  Eye,
  Download,
  RefreshCw,
  Calendar,
  ArrowUp,
  ArrowDown
} from 'lucide-react'

interface AnalyticsData {
  totalPageViews: number
  totalCTAClicks: number
  totalSignups: number
  totalDemoRequests: number
  ctaConversionRate: number
  signupConversionRate: number
  demoConversionRate: number
  topCTAs: Array<{ cta: string; count: number }>
  pageViews: Array<{ page: string; views: number }>
  dailyStats: Array<{ date: string; pageViews: number; ctaClicks: number; signups: number }>
}

export default function AnalyticsPage() {
  const { t } = useContext(I18nContext)
  const { data: session, status } = useSession()
  const router = useRouter()
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('7d')

  if (status === 'unauthenticated') {
    router.push('/auth/signin')
    return null
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando analytics...</p>
        </div>
      </div>
    )
  }

  useEffect(() => {
    fetchAnalytics()
  }, [timeRange])

  const fetchAnalytics = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/analytics?timeRange=${timeRange}`)
      const data = await response.json()
      if (response.ok) {
        setAnalyticsData(data)
      }
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  const exportData = () => {
    if (!analyticsData) return
    
    const csvContent = [
      ['Metric', 'Value'],
      ['Total Page Views', analyticsData.totalPageViews],
      ['Total CTA Clicks', analyticsData.totalCTAClicks],
      ['Total Signups', analyticsData.totalSignups],
      ['Total Demo Requests', analyticsData.totalDemoRequests],
      ['CTA Conversion Rate', `${analyticsData.ctaConversionRate.toFixed(2)}%`],
      ['Signup Conversion Rate', `${analyticsData.signupConversionRate.toFixed(2)}%`],
      ['Demo Conversion Rate', `${analyticsData.demoConversionRate.toFixed(2)}%`]
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `stack21-analytics-${timeRange}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const getConversionColor = (rate: number) => {
    if (rate >= 5) return 'text-green-600'
    if (rate >= 2) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getConversionIcon = (rate: number) => {
    if (rate >= 5) return <ArrowUp className="h-4 w-4 text-green-600" />
    if (rate >= 2) return <ArrowUp className="h-4 w-4 text-yellow-600" />
    return <ArrowDown className="h-4 w-4 text-red-600" />
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <BarChart3 className="mr-3 h-8 w-8 text-blue-600" />
              {t('analytics')}
            </h1>
            <p className="text-gray-600 mt-2">
              Métricas de rendimiento y conversión de tu plataforma
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="1d">Último día</option>
              <option value="7d">Últimos 7 días</option>
              <option value="30d">Últimos 30 días</option>
              <option value="90d">Últimos 90 días</option>
            </select>
            <Button onClick={fetchAnalytics} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Actualizar
            </Button>
            <Button onClick={exportData} variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando métricas...</p>
          </div>
        ) : analyticsData ? (
          <>
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Eye className="h-8 w-8 text-blue-600 mr-3" />
                    <div>
                      <p className="text-2xl font-bold">{analyticsData.totalPageViews.toLocaleString()}</p>
                      <p className="text-sm text-gray-600">Vistas de Página</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <MousePointer className="h-8 w-8 text-green-600 mr-3" />
                    <div>
                      <p className="text-2xl font-bold">{analyticsData.totalCTAClicks.toLocaleString()}</p>
                      <p className="text-sm text-gray-600">Clicks en CTA</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Users className="h-8 w-8 text-purple-600 mr-3" />
                    <div>
                      <p className="text-2xl font-bold">{analyticsData.totalSignups.toLocaleString()}</p>
                      <p className="text-sm text-gray-600">Registros</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Target className="h-8 w-8 text-orange-600 mr-3" />
                    <div>
                      <p className="text-2xl font-bold">{analyticsData.totalDemoRequests.toLocaleString()}</p>
                      <p className="text-sm text-gray-600">Solicitudes Demo</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Conversion Rates */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Tasa de Conversión CTA</CardTitle>
                  <CardDescription>
                    Porcentaje de visitantes que hacen click en CTAs
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    {getConversionIcon(analyticsData.ctaConversionRate)}
                    <span className={`text-3xl font-bold ${getConversionColor(analyticsData.ctaConversionRate)}`}>
                      {analyticsData.ctaConversionRate.toFixed(2)}%
                    </span>
                  </div>
                  <div className="mt-4">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${Math.min(analyticsData.ctaConversionRate * 10, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Tasa de Registro</CardTitle>
                  <CardDescription>
                    Porcentaje de visitantes que se registran
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    {getConversionIcon(analyticsData.signupConversionRate)}
                    <span className={`text-3xl font-bold ${getConversionColor(analyticsData.signupConversionRate)}`}>
                      {analyticsData.signupConversionRate.toFixed(2)}%
                    </span>
                  </div>
                  <div className="mt-4">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full" 
                        style={{ width: `${Math.min(analyticsData.signupConversionRate * 20, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Tasa de Demo</CardTitle>
                  <CardDescription>
                    Porcentaje de visitantes que solicitan demo
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    {getConversionIcon(analyticsData.demoConversionRate)}
                    <span className={`text-3xl font-bold ${getConversionColor(analyticsData.demoConversionRate)}`}>
                      {analyticsData.demoConversionRate.toFixed(2)}%
                    </span>
                  </div>
                  <div className="mt-4">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-purple-600 h-2 rounded-full" 
                        style={{ width: `${Math.min(analyticsData.demoConversionRate * 20, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Top Performing CTAs */}
            <Card>
              <CardHeader>
                <CardTitle>CTAs Más Efectivos</CardTitle>
                <CardDescription>
                  Los botones y enlaces que más clicks generan
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.topCTAs.map((cta, index) => (
                    <div key={cta.cta} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Badge variant="secondary" className="text-sm">
                          #{index + 1}
                        </Badge>
                        <span className="font-medium">{cta.cta}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl font-bold text-blue-600">{cta.count}</span>
                        <span className="text-sm text-gray-500">clicks</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Page Views */}
            <Card>
              <CardHeader>
                <CardTitle>Vistas por Página</CardTitle>
                <CardDescription>
                  Distribución de tráfico en tu plataforma
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.pageViews.map((page, index) => (
                    <div key={page.page} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Badge variant="outline" className="text-sm">
                          {page.page}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-lg font-semibold">{page.views}</span>
                        <span className="text-sm text-gray-500">vistas</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <BarChart3 className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-700 mb-2">
                No hay datos de analytics
              </h3>
              <p className="text-gray-500">
                Los datos de analytics aparecerán aquí una vez que tengas tráfico en tu plataforma.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}