'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Check, X, Calculator, Zap, Shield, Users, Globe } from 'lucide-react'

interface PricingBreakdown {
  type: string
  cost: number
  description: string
}

interface PricingData {
  pricing: any
  usage: any
  costs: any
  totalCost: number
  breakdown: PricingBreakdown[]
}

export default function PricingPage() {
  const [pricingData, setPricingData] = useState<PricingData | null>(null)
  const [loading, setLoading] = useState(false)
  const [usage, setUsage] = useState({
    workflowExecutions: 0,
    aiNodes: 0,
    emailNodes: 0,
    integrations: 0,
    workspaces: 0,
    users: 0
  })

  const calculatePricing = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      Object.entries(usage).forEach(([key, value]) => {
        params.append(key, value.toString())
      })

      const response = await fetch(`/api/pricing?${params}`)
      const data = await response.json()
      setPricingData(data)
    } catch (error) {
      console.error('Error calculating pricing:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    calculatePricing()
  }, [usage])

  const handleUsageChange = (key: string, value: number) => {
    setUsage(prev => ({
      ...prev,
      [key]: Math.max(0, value)
    }))
  }

  const plans = [
    {
      name: 'Gratis',
      price: 0,
      description: 'Perfecto para empezar',
      features: [
        '100 ejecuciones de workflow/mes',
        '50 nodos de IA/mes',
        '25 emails/mes',
        '5 integraciones',
        '1 workspace',
        '3 usuarios',
        'Soporte por email'
      ],
      limitations: [
        'Sin soporte prioritario',
        'Sin white-label'
      ],
      popular: false
    },
    {
      name: 'Pro',
      price: 29,
      description: 'Para equipos en crecimiento',
      features: [
        'Ejecuciones ilimitadas',
        'Nodos de IA ilimitados',
        'Emails ilimitados',
        'Integraciones ilimitadas',
        '5 workspaces',
        '10 usuarios',
        'Soporte prioritario',
        'White-label básico',
        'Analytics avanzados'
      ],
      limitations: [],
      popular: true
    },
    {
      name: 'Enterprise',
      price: 99,
      description: 'Para grandes organizaciones',
      features: [
        'Todo de Pro',
        'Workspaces ilimitados',
        'Usuarios ilimitados',
        'White-label completo',
        'SLA 99.9%',
        'Soporte 24/7',
        'Integración personalizada',
        'Dedicated support'
      ],
      limitations: [],
      popular: false
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              💰 Precios Transparentes
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Paga solo por lo que uses. Sin costos ocultos, sin sorpresas.
            </p>
            <div className="flex items-center justify-center gap-2 text-green-600 font-semibold">
              <Shield className="w-5 h-5" />
              Garantía de 30 días
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Calculadora de Precios */}
        <Card className="mb-16">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="w-6 h-6" />
              Calculadora de Precios en Tiempo Real
            </CardTitle>
            <CardDescription>
              Ajusta tu uso y ve el costo exacto que pagarías
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <div>
                <Label htmlFor="workflowExecutions">Ejecuciones de Workflow/mes</Label>
                <Input
                  id="workflowExecutions"
                  type="number"
                  value={usage.workflowExecutions}
                  onChange={(e) => handleUsageChange('workflowExecutions', parseInt(e.target.value) || 0)}
                  placeholder="100"
                />
                <p className="text-sm text-gray-500 mt-1">100 gratis, luego $0.01 c/u</p>
              </div>
              <div>
                <Label htmlFor="aiNodes">Nodos de IA/mes</Label>
                <Input
                  id="aiNodes"
                  type="number"
                  value={usage.aiNodes}
                  onChange={(e) => handleUsageChange('aiNodes', parseInt(e.target.value) || 0)}
                  placeholder="50"
                />
                <p className="text-sm text-gray-500 mt-1">50 gratis, luego $0.02 c/u</p>
              </div>
              <div>
                <Label htmlFor="emailNodes">Emails/mes</Label>
                <Input
                  id="emailNodes"
                  type="number"
                  value={usage.emailNodes}
                  onChange={(e) => handleUsageChange('emailNodes', parseInt(e.target.value) || 0)}
                  placeholder="25"
                />
                <p className="text-sm text-gray-500 mt-1">25 gratis, luego $0.005 c/u</p>
              </div>
              <div>
                <Label htmlFor="integrations">Integraciones</Label>
                <Input
                  id="integrations"
                  type="number"
                  value={usage.integrations}
                  onChange={(e) => handleUsageChange('integrations', parseInt(e.target.value) || 0)}
                  placeholder="5"
                />
                <p className="text-sm text-gray-500 mt-1">5 gratis, luego $2.00 c/u</p>
              </div>
              <div>
                <Label htmlFor="workspaces">Workspaces</Label>
                <Input
                  id="workspaces"
                  type="number"
                  value={usage.workspaces}
                  onChange={(e) => handleUsageChange('workspaces', parseInt(e.target.value) || 0)}
                  placeholder="1"
                />
                <p className="text-sm text-gray-500 mt-1">1 gratis, luego $5.00 c/u</p>
              </div>
              <div>
                <Label htmlFor="users">Usuarios</Label>
                <Input
                  id="users"
                  type="number"
                  value={usage.users}
                  onChange={(e) => handleUsageChange('users', parseInt(e.target.value) || 0)}
                  placeholder="3"
                />
                <p className="text-sm text-gray-500 mt-1">3 gratis, luego $10.00 c/u</p>
              </div>
            </div>

            {pricingData && (
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Costo Estimado</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Desglose de Costos</h4>
                    {pricingData.breakdown.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span>{item.description}</span>
                        <span className="font-medium">${item.cost.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">
                      ${pricingData.totalCost.toFixed(2)}
                    </div>
                    <p className="text-gray-600">por mes</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Planes de Suscripción */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            O elige un plan fijo
          </h2>
          <p className="text-xl text-gray-600">
            Para uso predecible y sin sorpresas
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <Card key={index} className={`relative ${plan.popular ? 'border-2 border-blue-500 shadow-lg' : ''}`}>
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-blue-500 text-white px-4 py-1">
                    Más Popular
                  </Badge>
                </div>
              )}
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">${plan.price}</span>
                  <span className="text-gray-600">/mes</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-2">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                  {plan.limitations.map((limitation, limitationIndex) => (
                    <li key={limitationIndex} className="flex items-center gap-2">
                      <X className="w-5 h-5 text-red-500 flex-shrink-0" />
                      <span className="text-sm text-gray-500">{limitation}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  className={`w-full ${plan.popular ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
                  variant={plan.popular ? 'default' : 'outline'}
                >
                  {plan.price === 0 ? 'Empezar Gratis' : 'Elegir Plan'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Ventajas Competitivas */}
        <div className="mt-16 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            ¿Por qué elegir Stack21?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Pay-per-use</h3>
              <p className="text-gray-600">
                Paga solo por lo que uses. Sin costos fijos ocultos.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Multi-tenant</h3>
              <p className="text-gray-600">
                Workspaces ilimitados por empresa. Aislamiento total.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">White-label</h3>
              <p className="text-gray-600">
                Rebranding completo para clientes enterprise.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}