'use client'

import { useSearchParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function AuthErrorPage() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  const getErrorMessage = (error: string | null) => {
    switch (error) {
      case 'Configuration':
        return 'Hay un problema con la configuración del servidor. Por favor, contacta al soporte.'
      case 'AccessDenied':
        return 'Acceso denegado. No tienes permisos para acceder a esta aplicación.'
      case 'Verification':
        return 'El token de verificación ha expirado o ya ha sido usado.'
      case 'Default':
        return 'Ocurrió un error inesperado. Por favor, intenta de nuevo.'
      default:
        return 'Error de autenticación. Por favor, intenta de nuevo.'
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Error de Autenticación
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            No se pudo completar el proceso de autenticación
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              Error
            </CardTitle>
            <CardDescription>
              Se produjo un error durante el proceso de autenticación
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant="destructive">
              <AlertDescription>
                {getErrorMessage(error)}
              </AlertDescription>
            </Alert>

            <div className="flex flex-col gap-2">
              <Button asChild>
                <Link href="/auth/signin">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Intentar de nuevo
                </Link>
              </Button>
              
              <Button variant="outline" asChild>
                <Link href="/">
                  Volver al inicio
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Si el problema persiste, contacta al soporte técnico
          </p>
        </div>
      </div>
    </div>
  )
}