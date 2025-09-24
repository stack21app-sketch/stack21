'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  RefreshCw,
  Database,
  Settings,
  Globe,
  Mail,
  CreditCard,
  Brain
} from 'lucide-react'

interface SystemStatus {
  config: boolean
  database: boolean
  ready: boolean
  details: {
    configErrors: string[]
    configWarnings: string[]
    databaseError: string | null
  }
}

export default function StatusPage() {
  const [status, setStatus] = useState<SystemStatus | null>(null)
  const [loading, setLoading] = useState(true)

  const checkStatus = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/status')
      const data = await response.json()
      setStatus(data)
    } catch (error) {
      console.error('Error checking status:', error)
      setStatus({
        config: false,
        database: false,
        ready: false,
        details: {
          configErrors: ['Error conectando al servidor'],
          configWarnings: [],
          databaseError: 'Error de conexión'
        }
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkStatus()
  }, [])

  const getStatusIcon = (isValid: boolean) => {
    return isValid ? (
      <CheckCircle className="h-5 w-5 text-green-500" />
    ) : (
      <XCircle className="h-5 w-5 text-red-500" />
    )
  }

  const getStatusBadge = (isValid: boolean) => {
    return isValid ? (
      <Badge className="bg-green-100 text-green-800">Funcionando</Badge>
    ) : (
      <Badge variant="destructive">Error</Badge>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <Card className="max-w-md mx-auto bg-white/10 backdrop-blur-sm border-white/20">
          <CardContent className="p-8 text-center">
            <RefreshCw className="h-8 w-8 text-white animate-spin mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">
              Verificando Sistema...
            </h2>
            <p className="text-gray-300">
              Revisando configuración y conectividad
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            Estado del Sistema
          </h1>
          <p className="text-gray-300 mb-6">
            Verificación de configuración y conectividad de Stack21 Waitlist
          </p>
          <Button 
            onClick={checkStatus}
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Verificar Ahora
          </Button>
        </div>

        {/* Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center mb-4">
                {getStatusIcon(status?.config || false)}
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Configuración
              </h3>
              {getStatusBadge(status?.config || false)}
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center mb-4">
                {getStatusIcon(status?.database || false)}
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Base de Datos
              </h3>
              {getStatusBadge(status?.database || false)}
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center mb-4">
                {getStatusIcon(status?.ready || false)}
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Sistema
              </h3>
              {getStatusBadge(status?.ready || false)}
            </CardContent>
          </Card>
        </div>

        {/* Detailed Status */}
        <div className="space-y-6">
          {/* Configuration Status */}
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <Settings className="h-5 w-5 mr-2" />
                Estado de Configuración
              </CardTitle>
            </CardHeader>
            <CardContent>
              {status?.details.configErrors.length ? (
                <div className="space-y-2">
                  <h4 className="text-red-400 font-semibold">Errores:</h4>
                  {status.details.configErrors.map((error, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <XCircle className="h-4 w-4 text-red-400 mt-0.5 flex-shrink-0" />
                      <p className="text-red-300 text-sm">{error}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center space-x-2 text-green-400">
                  <CheckCircle className="h-4 w-4" />
                  <p>Configuración válida</p>
                </div>
              )}
              
              {status?.details.configWarnings.length ? (
                <div className="mt-4 space-y-2">
                  <h4 className="text-yellow-400 font-semibold">Advertencias:</h4>
                  {status.details.configWarnings.map((warning, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                      <p className="text-yellow-300 text-sm">{warning}</p>
                    </div>
                  ))}
                </div>
              ) : null}
            </CardContent>
          </Card>

          {/* Database Status */}
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <Database className="h-5 w-5 mr-2" />
                Estado de Base de Datos
              </CardTitle>
            </CardHeader>
            <CardContent>
              {status?.database ? (
                <div className="flex items-center space-x-2 text-green-400">
                  <CheckCircle className="h-4 w-4" />
                  <p>Conexión exitosa a PostgreSQL</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-red-400">
                    <XCircle className="h-4 w-4" />
                    <p>Error de conexión</p>
                  </div>
                  {status?.details.databaseError && (
                    <p className="text-red-300 text-sm ml-6">
                      {status.details.databaseError}
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Acciones Rápidas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button 
                  variant="outline" 
                  className="border-white/30 text-white hover:bg-white/10"
                  onClick={() => window.open('/landing', '_blank')}
                >
                  <Globe className="h-4 w-4 mr-2" />
                  Ver Landing Page
                </Button>
                
                <Button 
                  variant="outline" 
                  className="border-white/30 text-white hover:bg-white/10"
                  onClick={() => window.open('/dashboard/waitlist', '_blank')}
                >
                  <Database className="h-4 w-4 mr-2" />
                  Dashboard Admin
                </Button>
                
                <Button 
                  variant="outline" 
                  className="border-white/30 text-white hover:bg-white/10"
                  onClick={() => window.open('/prelaunch', '_blank')}
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Página Prelanzamiento
                </Button>
                
                <Button 
                  variant="outline" 
                  className="border-white/30 text-white hover:bg-white/10"
                  onClick={() => window.open('http://localhost:5555', '_blank')}
                >
                  <Database className="h-4 w-4 mr-2" />
                  Prisma Studio
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-400 text-sm">
            Stack21 Waitlist - Sistema de Prelanzamiento
          </p>
        </div>
      </div>
    </div>
  )
}
