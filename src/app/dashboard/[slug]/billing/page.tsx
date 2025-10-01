'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  CreditCard, 
  Check, 
  CheckCircle,
  X, 
  Crown,
  Zap,
  Star,
  Settings,
  Download,
  Calendar,
  DollarSign,
  Users,
  Shield,
  Loader2
} from 'lucide-react'

interface Plan {
  id: string
  name: string
  price: number
  interval: 'month' | 'year'
  features: string[]
  limits: {
    requests: number
    workspaces: number
    storage: string
    support: string
  }
  popular?: boolean
  current?: boolean
}

export default function BillingPage() {
  const params = useParams()
  const { data: session } = useSession()
  const slug = params.slug as string

  const [plans, setPlans] = useState<Plan[]>([])
  const [loading, setLoading] = useState(false)
  const [currentPlan, setCurrentPlan] = useState<Plan | null>(null)
  const [billingHistory, setBillingHistory] = useState<any[]>([])

  const mockPlans: Plan[] = [
    {
      id: 'free',
      name: 'Gratis',
      price: 0,
      interval: 'month',
      features: [
        '100 requests/mes',
        '1 workspace',
        '1GB almacenamiento',
        'Soporte por email',
        'Funciones básicas de IA'
      ],
      limits: {
        requests: 100,
        workspaces: 1,
        storage: '1GB',
        support: 'Email'
      },
      current: true
    },
    {
      id: 'pro',
      name: 'Pro',
      price: 29,
      interval: 'month',
      features: [
        '1,000 requests/mes',
        '5 workspaces',
        '10GB almacenamiento',
        'Soporte prioritario',
        'Todas las funciones de IA',
        'Analytics avanzados',
        'API access'
      ],
      limits: {
        requests: 1000,
        workspaces: 5,
        storage: '10GB',
        support: 'Prioritario'
      },
      popular: true
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 99,
      interval: 'month',
      features: [
        'Requests ilimitados',
        'Workspaces ilimitados',
        '100GB almacenamiento',
        'Soporte 24/7',
        'Funciones premium',
        'Analytics personalizados',
        'API completa',
        'Integraciones personalizadas',
        'SLA garantizado'
      ],
      limits: {
        requests: -1, // ilimitado
        workspaces: -1,
        storage: '100GB',
        support: '24/7'
      }
    }
  ]

  const mockBillingHistory = [
    {
      id: '1',
      date: '2024-01-01',
      amount: 29.00,
      status: 'paid',
      description: 'Plan Pro - Enero 2024',
      invoice: 'INV-001'
    },
    {
      id: '2',
      date: '2023-12-01',
      amount: 29.00,
      status: 'paid',
      description: 'Plan Pro - Diciembre 2023',
      invoice: 'INV-002'
    },
    {
      id: '3',
      date: '2023-11-01',
      amount: 0.00,
      status: 'free',
      description: 'Plan Gratis - Noviembre 2023',
      invoice: 'N/A'
    }
  ]

  useEffect(() => {
    setPlans(mockPlans)
    setCurrentPlan(mockPlans[0]) // Plan gratuito actual
    setBillingHistory(mockBillingHistory)
  }, [mockPlans, mockBillingHistory])

  const handleUpgrade = async (planId: string) => {
    setLoading(true)
    try {
      // Simulación de upgrade (reemplazar con Stripe real)
      const response = await fetch('/api/billing/upgrade', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ planId }),
      })

      if (response.ok) {
        // Simular éxito
        alert('¡Upgrade exitoso! Redirigiendo a Stripe...')
        // En producción: window.location.href = checkoutUrl
      }
    } catch (error) {
      console.error('Error upgrading plan:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDowngrade = async (planId: string) => {
    setLoading(true)
    try {
      const response = await fetch('/api/billing/downgrade', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ planId }),
      })

      if (response.ok) {
        alert('Plan actualizado exitosamente')
      }
    } catch (error) {
      console.error('Error downgrading plan:', error)
    } finally {
      setLoading(false)
    }
  }

  const downloadInvoice = (invoiceId: string) => {
    // Simulación de descarga de factura
    alert(`Descargando factura ${invoiceId}...`)
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white">No autorizado</h2>
          <p className="text-gray-300">Debes iniciar sesión para ver billing</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <CreditCard className="h-8 w-8 text-cyan-400 mr-3" />
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  Facturación y Planes
                </h1>
                <p className="text-sm text-gray-300">Gestiona tu suscripción y facturación</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="border-white/20 text-white hover:bg-white/10"
              >
                <Settings className="h-4 w-4 mr-2" />
                Configurar
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Current Plan */}
        {currentPlan && (
          <Card className="bg-black/20 backdrop-blur-lg border-white/10 mb-8">
            <CardHeader>
              <CardTitle className="text-lg text-white flex items-center">
                <Crown className="h-5 w-5 mr-2 text-yellow-400" />
                Plan Actual
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-white">{currentPlan.name}</h3>
                  <p className="text-gray-400">
                    ${currentPlan.price}/{currentPlan.interval === 'month' ? 'mes' : 'año'}
                  </p>
                </div>
                <div className="text-right">
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                    Activo
                  </Badge>
                  <p className="text-sm text-gray-400 mt-1">
                    Renovación: {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {plans.map((plan) => (
            <Card 
              key={plan.id} 
              className={`bg-black/20 backdrop-blur-lg border-white/10 relative ${
                plan.popular ? 'ring-2 ring-purple-500/50' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-purple-600 text-white px-3 py-1">
                    <Star className="h-3 w-3 mr-1" />
                    Más Popular
                  </Badge>
                </div>
              )}
              
              <CardHeader>
                <CardTitle className="text-xl text-white flex items-center justify-between">
                  {plan.name}
                  {plan.current && (
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                      Actual
                    </Badge>
                  )}
                </CardTitle>
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold text-white">${plan.price}</span>
                  <span className="text-gray-400 ml-1">
                    /{plan.interval === 'month' ? 'mes' : 'año'}
                  </span>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-center">
                        <Check className="h-4 w-4 text-green-400 mr-2 flex-shrink-0" />
                        <span className="text-sm text-gray-300">{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="pt-4">
                    {plan.current ? (
                      <Button 
                        className="w-full bg-gray-600 hover:bg-gray-700" 
                        disabled
                      >
                        Plan Actual
                      </Button>
                    ) : (
                      <Button 
                        className={`w-full ${
                          plan.price > (currentPlan?.price || 0) 
                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700' 
                            : 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700'
                        }`}
                        onClick={() => handleUpgrade(plan.id)}
                        disabled={loading}
                      >
                        {loading ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <Zap className="h-4 w-4 mr-2" />
                        )}
                        {plan.price > (currentPlan?.price || 0) ? 'Upgrade' : 'Downgrade'}
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Billing History */}
        <Card className="bg-black/20 backdrop-blur-lg border-white/10">
          <CardHeader>
            <CardTitle className="text-lg text-white flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-blue-400" />
              Historial de Facturación
            </CardTitle>
            <CardDescription className="text-gray-400">
              Tus facturas y pagos recientes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {billingHistory.map((invoice) => (
                <div key={invoice.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      {invoice.status === 'paid' ? (
                        <CheckCircle className="h-8 w-8 text-green-400" />
                      ) : invoice.status === 'free' ? (
                        <Shield className="h-8 w-8 text-blue-400" />
                      ) : (
                        <X className="h-8 w-8 text-red-400" />
                      )}
                    </div>
                    <div>
                      <h4 className="text-white font-medium">{invoice.description}</h4>
                      <p className="text-sm text-gray-400">
                        {new Date(invoice.date).toLocaleDateString()} • {invoice.invoice}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-white font-bold">
                        ${invoice.amount.toFixed(2)}
                      </p>
                      <Badge 
                        className={
                          invoice.status === 'paid' 
                            ? 'bg-green-500/20 text-green-400 border-green-500/30'
                            : invoice.status === 'free'
                            ? 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                            : 'bg-red-500/20 text-red-400 border-red-500/30'
                        }
                      >
                        {invoice.status === 'paid' ? 'Pagado' : 
                         invoice.status === 'free' ? 'Gratis' : 'Pendiente'}
                      </Badge>
                    </div>
                    {invoice.invoice !== 'N/A' && (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => downloadInvoice(invoice.invoice)}
                        className="border-white/20 text-white hover:bg-white/10"
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Descargar
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
