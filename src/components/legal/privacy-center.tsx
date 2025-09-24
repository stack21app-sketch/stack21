'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Shield, 
  Download, 
  Trash2, 
  Eye, 
  Settings, 
  Mail, 
  FileText, 
  Lock, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Globe,
  User
} from 'lucide-react'
import Link from 'next/link'

interface PrivacyData {
  dataTypes: string[]
  dataSources: string[]
  retentionPeriod: string
  lastUpdated: string
  consentStatus: 'active' | 'pending' | 'expired'
  dataExportAvailable: boolean
  deletionRequested: boolean
}

export default function PrivacyCenter() {
  const [privacyData, setPrivacyData] = useState<PrivacyData>({
    dataTypes: ['Perfil', 'Uso', 'Técnicos', 'Facturación'],
    dataSources: ['OAuth', 'Formularios', 'Analytics', 'Stripe'],
    retentionPeriod: '2 años',
    lastUpdated: new Date().toISOString(),
    consentStatus: 'active',
    dataExportAvailable: true,
    deletionRequested: false
  })
  const [isLoading, setIsLoading] = useState(false)
  const [exportProgress, setExportProgress] = useState(0)

  const handleDataExport = async () => {
    setIsLoading(true)
    setExportProgress(0)
    
    try {
      // Simular progreso de exportación
      const interval = setInterval(() => {
        setExportProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval)
            setIsLoading(false)
            return 100
          }
          return prev + 10
        })
      }, 200)

      // Aquí iría la llamada real a la API
      await new Promise(resolve => setTimeout(resolve, 2000))
      
    } catch (error) {
      console.error('Error exporting data:', error)
      setIsLoading(false)
    }
  }

  const handleDataDeletion = async () => {
    if (!confirm('¿Estás seguro de que quieres eliminar todos tus datos? Esta acción no se puede deshacer.')) {
      return
    }

    setIsLoading(true)
    try {
      // Aquí iría la llamada real a la API
      await new Promise(resolve => setTimeout(resolve, 1000))
      setPrivacyData(prev => ({ ...prev, deletionRequested: true }))
    } catch (error) {
      console.error('Error deleting data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getConsentStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100'
      case 'pending': return 'text-yellow-600 bg-yellow-100'
      case 'expired': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getConsentStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Activo'
      case 'pending': return 'Pendiente'
      case 'expired': return 'Expirado'
      default: return 'Desconocido'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Shield className="h-8 w-8 text-blue-600" />
              <div>
                <CardTitle className="text-2xl">Centro de Privacidad</CardTitle>
                <p className="text-gray-600 mt-1">
                  Gestiona tus datos personales y preferencias de privacidad
                </p>
              </div>
            </div>
            <Badge className="bg-green-600 text-white">
              <CheckCircle className="h-3 w-3 mr-1" />
              GDPR Compliant
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Resumen de Datos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <User className="h-8 w-8 text-blue-600" />
              <div>
                <h3 className="font-semibold text-gray-900">Tipos de Datos</h3>
                <p className="text-2xl font-bold text-blue-600">{privacyData.dataTypes.length}</p>
                <p className="text-sm text-gray-600">Categorías recopiladas</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <Globe className="h-8 w-8 text-green-600" />
              <div>
                <h3 className="font-semibold text-gray-900">Consentimiento</h3>
                <Badge className={getConsentStatusColor(privacyData.consentStatus)}>
                  {getConsentStatusText(privacyData.consentStatus)}
                </Badge>
                <p className="text-sm text-gray-600 mt-1">Estado actual</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <Clock className="h-8 w-8 text-orange-600" />
              <div>
                <h3 className="font-semibold text-gray-900">Retención</h3>
                <p className="text-2xl font-bold text-orange-600">{privacyData.retentionPeriod}</p>
                <p className="text-sm text-gray-600">Período de conservación</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Acciones Principales */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings className="h-5 w-5 mr-2 text-blue-600" />
            Acciones de Privacidad
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Exportar Datos */}
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Download className="h-6 w-6 text-green-600 mt-1" />
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">Exportar Mis Datos</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Descarga una copia completa de todos tus datos personales en formato estándar.
                  </p>
                  <div className="mt-3">
                    <Button
                      onClick={handleDataExport}
                      disabled={isLoading}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      {isLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Exportando...
                        </>
                      ) : (
                        <>
                          <Download className="h-4 w-4 mr-2" />
                          Exportar Datos
                        </>
                      )}
                    </Button>
                  </div>
                  {isLoading && (
                    <div className="mt-3">
                      <Progress value={exportProgress} className="w-full" />
                      <p className="text-xs text-gray-600 mt-1">{exportProgress}% completado</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Eliminar Datos */}
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Trash2 className="h-6 w-6 text-red-600 mt-1" />
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">Eliminar Mis Datos</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Solicita la eliminación permanente de todos tus datos personales (Derecho al Olvido).
                  </p>
                  <div className="mt-3">
                    <Button
                      onClick={handleDataDeletion}
                      disabled={isLoading || privacyData.deletionRequested}
                      variant="destructive"
                    >
                      {privacyData.deletionRequested ? (
                        <>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Eliminación Solicitada
                        </>
                      ) : (
                        <>
                          <Trash2 className="h-4 w-4 mr-2" />
                          Eliminar Datos
                        </>
                      )}
                    </Button>
                  </div>
                  {privacyData.deletionRequested && (
                    <p className="text-xs text-green-600 mt-2">
                      ✅ Tu solicitud de eliminación ha sido procesada
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detalles de Datos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Eye className="h-5 w-5 mr-2 text-blue-600" />
            Detalles de tus Datos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Tipos de Datos Recopilados</h4>
              <div className="space-y-2">
                {privacyData.dataTypes.map((type, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span className="text-sm text-gray-700">{type}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Fuentes de Datos</h4>
              <div className="space-y-2">
                {privacyData.dataSources.map((source, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    <span className="text-sm text-gray-700">{source}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enlaces Legales */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="h-5 w-5 mr-2 text-blue-600" />
            Documentos Legales
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/privacy-policy" className="block">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4 text-center">
                  <Shield className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <h4 className="font-medium text-gray-900">Política de Privacidad</h4>
                  <p className="text-xs text-gray-600 mt-1">Información completa sobre datos</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/terms-of-service" className="block">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4 text-center">
                  <FileText className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <h4 className="font-medium text-gray-900">Términos de Servicio</h4>
                  <p className="text-xs text-gray-600 mt-1">Condiciones de uso</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/cookie-policy" className="block">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4 text-center">
                  <Lock className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                  <h4 className="font-medium text-gray-900">Política de Cookies</h4>
                  <p className="text-xs text-gray-600 mt-1">Uso de cookies</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/legal-compliance" className="block">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4 text-center">
                  <Globe className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <h4 className="font-medium text-gray-900">Conformidad Legal</h4>
                  <p className="text-xs text-gray-600 mt-1">Regulaciones internacionales</p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Contacto */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Mail className="h-5 w-5 mr-2 text-blue-600" />
            Contacto y Soporte
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Delegado de Protección de Datos (DPO)</h4>
              <p className="text-sm text-gray-600 mb-1">📧 privacy@stack21.com</p>
              <p className="text-sm text-gray-600 mb-1">⏰ Respuesta: Máximo 30 días</p>
              <p className="text-sm text-gray-600">🌍 Idiomas: ES, EN, FR, DE</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Soporte General</h4>
              <p className="text-sm text-gray-600 mb-1">📧 support@stack21.com</p>
              <p className="text-sm text-gray-600 mb-1">⏰ Respuesta: 24-48 horas</p>
              <p className="text-sm text-gray-600">📍 Madrid, España</p>
            </div>
          </div>
          <div className="mt-6 flex gap-4">
            <Button asChild className="bg-blue-600 hover:bg-blue-700">
              <Link href="/contact">
                <Mail className="h-4 w-4 mr-2" />
                Contactar Soporte
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/dashboard/settings/privacy">
                <Settings className="h-4 w-4 mr-2" />
                Configurar Privacidad
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Información Importante */}
      <Card className="bg-yellow-50 border-yellow-200">
        <CardContent className="p-6">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="h-6 w-6 text-yellow-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-yellow-900">Información Importante</h4>
              <p className="text-sm text-yellow-800 mt-1">
                Todos los cambios en tus preferencias de privacidad se aplicarán inmediatamente.
                Si tienes preguntas sobre el procesamiento de tus datos, no dudes en contactar
                a nuestro Delegado de Protección de Datos.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
