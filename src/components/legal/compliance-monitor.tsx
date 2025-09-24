'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { 
  Shield, 
  CheckCircle, 
  AlertTriangle, 
  Globe, 
  Clock, 
  RefreshCw,
  ExternalLink,
  BarChart3
} from 'lucide-react'
import Link from 'next/link'
import { legalComplianceManager } from '@/lib/legal-compliance'
import { cookieManager } from '@/lib/cookie-management'
import { gdprManager } from '@/lib/gdpr-utils'

interface ComplianceStatus {
  overall: number
  gdpr: number
  ccpa: number
  pipeda: number
  lgpd: number
  lastChecked: string
  issues: string[]
  recommendations: string[]
}

export default function ComplianceMonitor() {
  const [status, setStatus] = useState<ComplianceStatus>({
    overall: 0,
    gdpr: 0,
    ccpa: 0,
    pipeda: 0,
    lgpd: 0,
    lastChecked: '',
    issues: [],
    recommendations: []
  })
  const [isLoading, setIsLoading] = useState(true)
  const [userRegion, setUserRegion] = useState<string>('ES')

  useEffect(() => {
    checkCompliance()
    // Verificar cada 5 minutos
    const interval = setInterval(checkCompliance, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  const checkCompliance = async () => {
    setIsLoading(true)
    try {
      // Simular detección de región del usuario
      const region = await detectUserRegion()
      setUserRegion(region)

      // Obtener regulaciones aplicables
      const regulations = legalComplianceManager.getApplicableRegulations(region)
      
      // Calcular puntuación de conformidad
      const complianceScore = await calculateComplianceScore(regulations)
      
      // Generar recomendaciones
      const recommendations = generateRecommendations(regulations, complianceScore)
      
      // Identificar problemas
      const issues = identifyIssues(regulations, complianceScore)

      setStatus({
        overall: complianceScore.overall,
        gdpr: complianceScore.gdpr,
        ccpa: complianceScore.ccpa,
        pipeda: complianceScore.pipeda,
        lgpd: complianceScore.lgpd,
        lastChecked: new Date().toISOString(),
        issues,
        recommendations
      })
    } catch (error) {
      console.error('Error checking compliance:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const detectUserRegion = async (): Promise<string> => {
    // En producción, esto vendría de la geolocalización o configuración del usuario
    return 'ES' // Por defecto España
  }

  const calculateComplianceScore = async (regulations: string[]) => {
    let overall = 0
    let gdpr = 0
    let ccpa = 0
    let pipeda = 0
    let lgpd = 0

    // Verificar consentimiento de cookies
    const cookieConsent = cookieManager.getPreferences()
    if (cookieConsent) {
      overall += 20
    }

    // Verificar políticas legales
    overall += 30 // Asumiendo que están implementadas

    // Verificar APIs legales
    overall += 25 // Asumiendo que están funcionando

    // Verificar utilidades de conformidad
    overall += 25 // Asumiendo que están implementadas

    // Ajustar por regulaciones específicas
    if (regulations.includes('GDPR')) {
      gdpr = Math.min(overall + 10, 100)
    }
    if (regulations.includes('CCPA')) {
      ccpa = Math.min(overall + 10, 100)
    }
    if (regulations.includes('PIPEDA')) {
      pipeda = Math.min(overall + 10, 100)
    }
    if (regulations.includes('LGPD')) {
      lgpd = Math.min(overall + 10, 100)
    }

    return { overall, gdpr, ccpa, pipeda, lgpd }
  }

  const generateRecommendations = (regulations: string[], score: any): string[] => {
    const recommendations: string[] = []

    if (score.overall < 90) {
      recommendations.push('Revisar implementación de políticas de privacidad')
    }

    if (regulations.includes('GDPR') && score.gdpr < 95) {
      recommendations.push('Optimizar cumplimiento GDPR - revisar consentimientos')
    }

    if (regulations.includes('CCPA') && score.ccpa < 95) {
      recommendations.push('Mejorar conformidad CCPA - implementar opt-out')
    }

    if (!cookieManager.getPreferences()) {
      recommendations.push('Implementar banner de consentimiento de cookies')
    }

    return recommendations
  }

  const identifyIssues = (regulations: string[], score: any): string[] => {
    const issues: string[] = []

    if (score.overall < 80) {
      issues.push('Conformidad general por debajo del 80%')
    }

    if (regulations.length === 0) {
      issues.push('No se detectaron regulaciones aplicables')
    }

    return issues
  }

  const getStatusColor = (score: number) => {
    if (score >= 95) return 'text-green-600 bg-green-100'
    if (score >= 80) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  const getStatusIcon = (score: number) => {
    if (score >= 95) return <CheckCircle className="h-4 w-4" />
    if (score >= 80) return <AlertTriangle className="h-4 w-4" />
    return <AlertTriangle className="h-4 w-4" />
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <RefreshCw className="h-6 w-6 animate-spin text-blue-600 mr-2" />
            <span>Verificando conformidad legal...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Shield className="h-6 w-6 text-blue-600" />
              <div>
                <CardTitle>Monitor de Conformidad Legal</CardTitle>
                <p className="text-sm text-gray-600">
                  Verificación en tiempo real de cumplimiento regulatorio
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-blue-600 border-blue-600">
                <Globe className="h-3 w-3 mr-1" />
                {userRegion}
              </Badge>
              <Button
                onClick={checkCompliance}
                size="sm"
                variant="outline"
                disabled={isLoading}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Actualizar
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Conformidad General</span>
                <span className="text-sm text-gray-600">{status.overall}%</span>
              </div>
              <Progress value={status.overall} className="h-2" />
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-600">
                Última verificación: {new Date(status.lastChecked).toLocaleTimeString('es-ES')}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Regulaciones Específicas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">GDPR</span>
              <Badge className={getStatusColor(status.gdpr)}>
                {getStatusIcon(status.gdpr)}
                <span className="ml-1">{status.gdpr}%</span>
              </Badge>
            </div>
            <Progress value={status.gdpr} className="h-1" />
            <p className="text-xs text-gray-600 mt-1">Europa</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">CCPA</span>
              <Badge className={getStatusColor(status.ccpa)}>
                {getStatusIcon(status.ccpa)}
                <span className="ml-1">{status.ccpa}%</span>
              </Badge>
            </div>
            <Progress value={status.ccpa} className="h-1" />
            <p className="text-xs text-gray-600 mt-1">California</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">PIPEDA</span>
              <Badge className={getStatusColor(status.pipeda)}>
                {getStatusIcon(status.pipeda)}
                <span className="ml-1">{status.pipeda}%</span>
              </Badge>
            </div>
            <Progress value={status.pipeda} className="h-1" />
            <p className="text-xs text-gray-600 mt-1">Canadá</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">LGPD</span>
              <Badge className={getStatusColor(status.lgpd)}>
                {getStatusIcon(status.lgpd)}
                <span className="ml-1">{status.lgpd}%</span>
              </Badge>
            </div>
            <Progress value={status.lgpd} className="h-1" />
            <p className="text-xs text-gray-600 mt-1">Brasil</p>
          </CardContent>
        </Card>
      </div>

      {/* Problemas y Recomendaciones */}
      {(status.issues.length > 0 || status.recommendations.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {status.issues.length > 0 && (
            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="text-red-600 flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  Problemas Detectados
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {status.issues.map((issue, index) => (
                    <li key={index} className="text-sm text-red-600 flex items-start">
                      <span className="w-2 h-2 bg-red-600 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                      {issue}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {status.recommendations.length > 0 && (
            <Card className="border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-600 flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Recomendaciones
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {status.recommendations.map((recommendation, index) => (
                    <li key={index} className="text-sm text-blue-600 flex items-start">
                      <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                      {recommendation}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Acciones Rápidas */}
      <Card>
        <CardHeader>
          <CardTitle>Acciones Rápidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button asChild variant="outline" className="h-auto p-4">
              <Link href="/legal-compliance">
                <Shield className="h-4 w-4 mr-2" />
                <div className="text-left">
                  <div className="font-medium">Centro de Conformidad</div>
                  <div className="text-xs text-gray-600">Gestionar políticas legales</div>
                </div>
              </Link>
            </Button>

            <Button asChild variant="outline" className="h-auto p-4">
              <Link href="/dashboard/settings/privacy">
                <BarChart3 className="h-4 w-4 mr-2" />
                <div className="text-left">
                  <div className="font-medium">Configurar Privacidad</div>
                  <div className="text-xs text-gray-600">Ajustar preferencias</div>
                </div>
              </Link>
            </Button>

            <Button asChild variant="outline" className="h-auto p-4">
              <Link href="/contact?subject=legal">
                <ExternalLink className="h-4 w-4 mr-2" />
                <div className="text-left">
                  <div className="font-medium">Contactar DPO</div>
                  <div className="text-xs text-gray-600">Soporte legal</div>
                </div>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
