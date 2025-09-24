'use client'

import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react'

export default function DebugPage() {
  const envVars = {
    NEXTAUTH_URL: process.env.NEXT_PUBLIC_APP_URL || 'No configurado',
    GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ? 'Configurado' : 'No configurado',
    GITHUB_CLIENT_ID: process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID ? 'Configurado' : 'No configurado',
    DATABASE_URL: process.env.NEXT_PUBLIC_DATABASE_URL ? 'Configurado' : 'No configurado',
  }

  const getStatusIcon = (status: string) => {
    if (status === 'Configurado') {
      return <CheckCircle className="h-4 w-4 text-green-600" />
    } else if (status === 'No configurado') {
      return <XCircle className="h-4 w-4 text-red-600" />
    } else {
      return <AlertCircle className="h-4 w-4 text-yellow-600" />
    }
  }

  const getStatusColor = (status: string) => {
    if (status === 'Configurado') {
      return 'bg-green-100 text-green-800'
    } else if (status === 'No configurado') {
      return 'bg-red-100 text-red-800'
    } else {
      return 'bg-yellow-100 text-yellow-800'
    }
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Diagnóstico del Sistema</h1>
          <p className="text-gray-600 mt-2">
            Verifica el estado de configuración de tu aplicación
          </p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Variables de Entorno</CardTitle>
              <CardDescription>
                Estado de las configuraciones necesarias
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(envVars).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(value)}
                    <span className="font-medium">{key}</span>
                  </div>
                  <Badge className={getStatusColor(value)}>
                    {value}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Configuración de OAuth</CardTitle>
              <CardDescription>
                Pasos para configurar la autenticación
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-sm font-semibold text-blue-600">1</div>
                  <div>
                    <p className="font-medium">Crear proyecto en Google Cloud Console</p>
                    <p className="text-sm text-gray-600">Ve a console.cloud.google.com y crea un nuevo proyecto</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-sm font-semibold text-blue-600">2</div>
                  <div>
                    <p className="font-medium">Habilitar Google+ API</p>
                    <p className="text-sm text-gray-600">En APIs & Services &gt; Library, busca y habilita Google+ API</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-sm font-semibold text-blue-600">3</div>
                  <div>
                    <p className="font-medium">Crear credenciales OAuth 2.0</p>
                    <p className="text-sm text-gray-600">En APIs & Services &gt; Credentials, crea OAuth 2.0 Client ID</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-sm font-semibold text-blue-600">4</div>
                  <div>
                    <p className="font-medium">Configurar URLs autorizadas</p>
                    <p className="text-sm text-gray-600">
                      JavaScript origins: <code className="bg-gray-100 px-1 rounded">http://localhost:3000</code><br/>
                      Redirect URIs: <code className="bg-gray-100 px-1 rounded">http://localhost:3000/api/auth/callback/google</code>
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-sm font-semibold text-blue-600">5</div>
                  <div>
                    <p className="font-medium">Actualizar .env.local</p>
                    <p className="text-sm text-gray-600">Reemplaza las credenciales de ejemplo con las reales</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Próximos Pasos</CardTitle>
              <CardDescription>
                Una vez configurado OAuth, podrás:
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Registrarte con Google</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Iniciar sesión automáticamente</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Acceder al dashboard completo</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Crear workspaces y proyectos</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
