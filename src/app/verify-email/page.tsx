'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  CheckCircle, 
  XCircle, 
  Mail, 
  Sparkles,
  ArrowRight,
  Users,
  Star
} from 'lucide-react'
import Link from 'next/link'

export default function VerifyEmailPage() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const [verificationStatus, setVerificationStatus] = useState<'loading' | 'success' | 'error' | 'invalid'>('loading')
  const [userData, setUserData] = useState<any>(null)

  useEffect(() => {
    if (token) {
      verifyEmail(token)
    } else {
      setVerificationStatus('invalid')
    }
  }, [token])

  const verifyEmail = async (verificationToken: string) => {
    try {
      const response = await fetch(`/api/waitlist/verify?token=${verificationToken}`)
      const data = await response.json()
      
      if (data.success) {
        setVerificationStatus('success')
        setUserData(data.user)
      } else {
        setVerificationStatus('error')
      }
    } catch (error) {
      console.error('Error verifying email:', error)
      setVerificationStatus('error')
    }
  }

  const getTierBadgeVariant = (tier: string) => {
    switch (tier) {
      case 'VIP':
        return 'default'
      case 'PREMIUM':
        return 'secondary'
      case 'ENTERPRISE':
        return 'outline'
      default:
        return 'outline'
    }
  }

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'VIP':
        return <Star className="h-4 w-4 text-yellow-500" />
      case 'PREMIUM':
        return <Sparkles className="h-4 w-4 text-blue-500" />
      case 'ENTERPRISE':
        return <Users className="h-4 w-4 text-purple-500" />
      default:
        return <Users className="h-4 w-4 text-gray-500" />
    }
  }

  if (verificationStatus === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <Card className="max-w-md mx-auto bg-white/10 backdrop-blur-sm border-white/20">
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-yellow-400 mx-auto mb-4"></div>
            <h2 className="text-xl font-bold text-white mb-2">
              Verificando tu email...
            </h2>
            <p className="text-gray-300">
              Por favor espera mientras confirmamos tu suscripción
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (verificationStatus === 'invalid') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <Card className="max-w-md mx-auto bg-red-900/20 border-red-500/20">
          <CardContent className="p-8 text-center">
            <XCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-4">
              Enlace Inválido
            </h2>
            <p className="text-gray-300 mb-6">
              El enlace de verificación no es válido o ha expirado.
            </p>
            <Button asChild className="w-full">
              <Link href="/landing">
                Volver al Inicio
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (verificationStatus === 'error') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <Card className="max-w-md mx-auto bg-red-900/20 border-red-500/20">
          <CardContent className="p-8 text-center">
            <XCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-4">
              Error de Verificación
            </h2>
            <p className="text-gray-300 mb-6">
              Hubo un problema al verificar tu email. Por favor, inténtalo de nuevo.
            </p>
            <Button asChild className="w-full">
              <Link href="/landing">
                Volver al Inicio
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
      <Card className="max-w-lg mx-auto bg-green-900/20 border-green-500/20 backdrop-blur-sm">
        <CardContent className="p-8 text-center">
          <CheckCircle className="h-20 w-20 text-green-400 mx-auto mb-6" />
          
          <h1 className="text-3xl font-bold text-white mb-4">
            ¡Email Verificado!
          </h1>
          
          <p className="text-gray-300 mb-6">
            Tu email ha sido verificado exitosamente. Ahora recibirás todas las 
            actualizaciones sobre Stack21.
          </p>

          {userData && (
            <div className="bg-white/10 rounded-lg p-4 mb-6">
              <h3 className="text-white font-semibold mb-2">Tu Perfil</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Email:</span>
                  <span className="text-white">{userData.email}</span>
                </div>
                {userData.name && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Nombre:</span>
                    <span className="text-white">{userData.name}</span>
                  </div>
                )}
                {userData.company && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Empresa:</span>
                    <span className="text-white">{userData.company}</span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Tier:</span>
                  <Badge variant={getTierBadgeVariant(userData.tier)}>
                    {getTierIcon(userData.tier)}
                    <span className="ml-1">{userData.tier}</span>
                  </Badge>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div className="bg-white/10 rounded-lg p-4">
              <h4 className="text-white font-semibold mb-2">¿Qué sigue?</h4>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• Recibirás actualizaciones exclusivas por email</li>
                <li>• Acceso prioritario cuando lancemos Stack21</li>
                <li>• Invitaciones a webinars y demos en vivo</li>
                <li>• Ofertas especiales solo para la lista de espera</li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button asChild className="flex-1 bg-gradient-to-r from-yellow-400 to-pink-400 hover:from-yellow-500 hover:to-pink-500 text-black font-bold">
                <Link href="/landing">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Explorar Stack21
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="flex-1 border-white/30 text-white hover:bg-white/10">
                <Link href="/prelaunch">
                  Ver Prelanzamiento
                </Link>
              </Button>
            </div>
          </div>

          <p className="text-xs text-gray-400 mt-6">
            Gracias por unirte a la revolución de la automatización
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
