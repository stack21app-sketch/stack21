'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  CheckCircle, 
  X, 
  Crown, 
  Zap, 
  Brain, 
  Users, 
  BarChart3, 
  Shield,
  Clock,
  CreditCard,
  Download,
  AlertCircle,
  Sparkles,
  MessageSquare
} from 'lucide-react'
import { PLANS } from '@/lib/stripe'

interface CurrentPlan {
  name: string
  price: number
  status: 'active' | 'canceled' | 'past_due' | 'trialing'
  currentPeriodEnd: string
  cancelAtPeriodEnd: boolean
}

export default function BillingPage() {
  const [currentPlan, setCurrentPlan] = useState<CurrentPlan>({
    name: 'Free',
    price: 0,
    status: 'active',
    currentPeriodEnd: '2024-10-16T10:30:00Z',
    cancelAtPeriodEnd: false
  })

  const [isLoading, setIsLoading] = useState(false)

  const handleUpgrade = async (planName: string) => {
    setIsLoading(true)
    // Simular proceso de upgrade
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsLoading(false)
    // Aquí se integraría con Stripe
  }

  const handleDowngrade = async () => {
    setIsLoading(true)
    // Simular proceso de downgrade
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsLoading(false)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200'
      case 'canceled': return 'bg-red-100 text-red-800 border-red-200'
      case 'past_due': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'trialing': return 'bg-blue-100 text-blue-800 border-blue-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Activo'
      case 'canceled': return 'Cancelado'
      case 'past_due': return 'Pago pendiente'
      case 'trialing': return 'Prueba'
      default: return 'Desconocido'
    }
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Facturación</h1>
        <p className="text-gray-600 mt-2">
          Gestiona tu suscripción y facturación
        </p>
      </div>

      {/* Current Plan */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Crown className="h-5 w-5 text-yellow-500" />
                <span>Plan Actual</span>
              </CardTitle>
              <p className="text-gray-600 mt-1">
                {currentPlan.name} - ${currentPlan.price}/mes
              </p>
            </div>
            <Badge className={getStatusColor(currentPlan.status)}>
              {getStatusText(currentPlan.status)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600">Próxima facturación</p>
              <p className="font-semibold">{formatDate(currentPlan.currentPeriodEnd)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Estado</p>
              <p className="font-semibold">{getStatusText(currentPlan.status)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Cancelación</p>
              <p className="font-semibold">
                {currentPlan.cancelAtPeriodEnd ? 'Al final del período' : 'No programada'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Available Plans */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Planes Disponibles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Object.entries(PLANS).map(([key, plan]) => (
            <Card 
              key={key} 
              className={`relative ${
                currentPlan.name === plan.name 
                  ? 'ring-2 ring-purple-500 border-purple-200' 
                  : 'hover:shadow-lg transition-shadow'
              }`}
            >
              {currentPlan.name === plan.name && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-purple-500 text-white">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Actual
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center space-x-2">
                  {plan.name === 'Free' && <Zap className="h-5 w-5 text-blue-500" />}
                  {plan.name === 'Growth' && <Brain className="h-5 w-5 text-purple-500" />}
                  {plan.name === 'Scale' && <Crown className="h-5 w-5 text-yellow-500" />}
                  {plan.name === 'Enterprise' && <Shield className="h-5 w-5 text-red-500" />}
                  <span>{plan.name}</span>
                </CardTitle>
                <div className="text-3xl font-bold text-gray-900">
                  ${plan.price}
                  <span className="text-lg text-gray-500">/mes</span>
                </div>
              </CardHeader>
              
              <CardContent>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button
                  className={`w-full ${
                    currentPlan.name === plan.name
                      ? 'bg-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600'
                  }`}
                  disabled={currentPlan.name === plan.name || isLoading}
                  onClick={() => handleUpgrade(plan.name)}
                >
                  {currentPlan.name === plan.name ? (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Plan Actual
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      {plan.price === 0 ? 'Gratis' : 'Actualizar'}
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Billing History */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CreditCard className="h-5 w-5" />
            <span>Historial de Facturación</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                id: '1',
                date: '2024-09-16T10:30:00Z',
                amount: 29,
                status: 'paid',
                description: 'Growth Plan - Septiembre 2024'
              },
              {
                id: '2',
                date: '2024-08-16T10:30:00Z',
                amount: 29,
                status: 'paid',
                description: 'Growth Plan - Agosto 2024'
              },
              {
                id: '3',
                date: '2024-07-16T10:30:00Z',
                amount: 0,
                status: 'paid',
                description: 'Free Plan - Julio 2024'
              }
            ].map((invoice) => (
              <div key={invoice.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className={`w-2 h-2 rounded-full ${
                    invoice.status === 'paid' ? 'bg-green-500' : 'bg-red-500'
                  }`} />
                  <div>
                    <p className="font-medium text-gray-900">{invoice.description}</p>
                    <p className="text-sm text-gray-500">{formatDate(invoice.date)}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="font-semibold text-gray-900">
                    ${invoice.amount}
                  </span>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-1" />
                    PDF
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Billing Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-yellow-500" />
              <span>Gestionar Suscripción</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">
              Actualiza tu método de pago, descarga facturas o cancela tu suscripción.
            </p>
            <Button variant="outline" className="w-full">
              <CreditCard className="h-4 w-4 mr-2" />
              Portal de Facturación
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-blue-500" />
              <span>Soporte</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">
              ¿Necesitas ayuda con tu facturación? Nuestro equipo está aquí para ayudarte.
            </p>
            <Button variant="outline" className="w-full">
              <MessageSquare className="h-4 w-4 mr-2" />
              Contactar Soporte
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}