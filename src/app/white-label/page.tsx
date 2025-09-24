'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Upload, Palette, Globe, Shield, Zap, Check, Star } from 'lucide-react'

export default function WhiteLabelPage() {
  const [formData, setFormData] = useState({
    companyName: '',
    domain: '',
    logo: null as File | null,
    primaryColor: '#3B82F6',
    secondaryColor: '#1E40AF',
    customCss: '',
    features: {
      customDomain: false,
      customLogo: false,
      customColors: false,
      customCss: false,
      removeBranding: false,
      customEmail: false,
      customSupport: false,
      sso: false,
      apiAccess: false,
      prioritySupport: false
    }
  })

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleFeatureToggle = (feature: string) => {
    setFormData(prev => ({
      ...prev,
      features: {
        ...prev.features,
        [feature]: !(prev.features as any)[feature]
      }
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('White-label config:', formData)
  }

  const whiteLabelPlans = [
    {
      name: 'Básico',
      price: 99,
      description: 'Para pequeñas empresas',
      features: [
        'Dominio personalizado',
        'Logo personalizado',
        'Colores personalizados',
        'Email de soporte personalizado',
        'Hasta 50 usuarios'
      ],
      limitations: [
        'Sin SSO',
        'Sin API personalizada',
        'Branding de Stack21 visible'
      ]
    },
    {
      name: 'Profesional',
      price: 299,
      description: 'Para empresas medianas',
      features: [
        'Todo de Básico',
        'CSS personalizado',
        'SSO (SAML/OAuth)',
        'API personalizada',
        'Soporte prioritario',
        'Hasta 200 usuarios',
        'Branding completamente removido'
      ],
      limitations: []
    },
    {
      name: 'Enterprise',
      price: 999,
      description: 'Para grandes organizaciones',
      features: [
        'Todo de Profesional',
        'Instalación on-premise',
        'Soporte 24/7',
        'Desarrollo personalizado',
        'Usuarios ilimitados',
        'SLA 99.9%',
        'Dedicated support'
      ],
      limitations: [],
      popular: true
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              🎨 White-Label Completo
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Rebranding total de Stack21 para tu empresa
            </p>
            <div className="flex items-center justify-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-600" />
                Seguro y confiable
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-blue-600" />
                Configuración rápida
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-purple-600" />
                Dominio personalizado
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Configurador Interactivo */}
        <Card className="mb-16">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="w-6 h-6" />
              Configurador de White-Label
            </CardTitle>
            <CardDescription>
              Personaliza la apariencia y funcionalidad de tu instancia
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Información Básica */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">Información Básica</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="companyName">Nombre de la Empresa</Label>
                    <Input
                      id="companyName"
                      value={formData.companyName}
                      onChange={(e) => handleInputChange('companyName', e.target.value)}
                      placeholder="Mi Empresa S.A."
                    />
                  </div>
                  <div>
                    <Label htmlFor="domain">Dominio Personalizado</Label>
                    <Input
                      id="domain"
                      value={formData.domain}
                      onChange={(e) => handleInputChange('domain', e.target.value)}
                      placeholder="miempresa.com"
                    />
                  </div>
                </div>
              </div>

              {/* Personalización Visual */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">Personalización Visual</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="logo">Logo de la Empresa</Label>
                    <div className="mt-2">
                      <input
                        type="file"
                        id="logo"
                        accept="image/*"
                        onChange={(e) => handleInputChange('logo', e.target.files?.[0] || null)}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="primaryColor">Color Primario</Label>
                      <div className="flex items-center gap-2 mt-2">
                        <Input
                          type="color"
                          id="primaryColor"
                          value={formData.primaryColor}
                          onChange={(e) => handleInputChange('primaryColor', e.target.value)}
                          className="w-16 h-10 p-1"
                        />
                        <Input
                          value={formData.primaryColor}
                          onChange={(e) => handleInputChange('primaryColor', e.target.value)}
                          className="flex-1"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="secondaryColor">Color Secundario</Label>
                      <div className="flex items-center gap-2 mt-2">
                        <Input
                          type="color"
                          id="secondaryColor"
                          value={formData.secondaryColor}
                          onChange={(e) => handleInputChange('secondaryColor', e.target.value)}
                          className="w-16 h-10 p-1"
                        />
                        <Input
                          value={formData.secondaryColor}
                          onChange={(e) => handleInputChange('secondaryColor', e.target.value)}
                          className="flex-1"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <Label htmlFor="customCss">CSS Personalizado</Label>
                  <Textarea
                    id="customCss"
                    value={formData.customCss}
                    onChange={(e) => handleInputChange('customCss', e.target.value)}
                    placeholder="/* Tu CSS personalizado aquí */"
                    rows={6}
                    className="font-mono text-sm"
                  />
                </div>
              </div>

              {/* Características */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">Características</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(formData.features).map(([feature, enabled]) => (
                    <div key={feature} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <div className="font-medium capitalize">
                          {feature.replace(/([A-Z])/g, ' $1').trim()}
                        </div>
                        <div className="text-sm text-gray-600">
                          {getFeatureDescription(feature)}
                        </div>
                      </div>
                      <Switch
                        checked={enabled}
                        onCheckedChange={() => handleFeatureToggle(feature)}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                <Zap className="w-5 h-5 mr-2" />
                Generar Preview
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Planes de White-Label */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Planes de White-Label
          </h2>
          <p className="text-xl text-gray-600">
            Elige el plan que mejor se adapte a tu empresa
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {whiteLabelPlans.map((plan, index) => (
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
                      <div className="w-5 h-5 flex-shrink-0 text-red-500">✗</div>
                      <span className="text-sm text-gray-500">{limitation}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  className={`w-full ${plan.popular ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
                  variant={plan.popular ? 'default' : 'outline'}
                >
                  Elegir Plan
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Ventajas del White-Label */}
        <div className="mt-16 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            ¿Por qué elegir White-Label?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Marca Propia</h3>
              <p className="text-gray-600">
                Tu empresa, tu marca. Sin referencias a Stack21.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Seguridad Total</h3>
              <p className="text-gray-600">
                Instalación on-premise disponible para máxima seguridad.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Soporte Dedicado</h3>
              <p className="text-gray-600">
                Equipo de soporte dedicado para tu empresa.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function getFeatureDescription(feature: string): string {
  const descriptions: Record<string, string> = {
    customDomain: 'Usa tu propio dominio (miempresa.com)',
    customLogo: 'Logo de tu empresa en toda la plataforma',
    customColors: 'Paleta de colores personalizada',
    customCss: 'CSS personalizado para mayor control',
    removeBranding: 'Elimina todas las referencias a Stack21',
    customEmail: 'Emails desde tu dominio',
    customSupport: 'Página de soporte personalizada',
    sso: 'Single Sign-On con SAML/OAuth',
    apiAccess: 'API personalizada con tu branding',
    prioritySupport: 'Soporte prioritario 24/7'
  }
  return descriptions[feature] || feature
}
