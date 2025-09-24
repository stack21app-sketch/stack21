'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Users, 
  Building, 
  MessageSquare, 
  CheckCircle, 
  ArrowRight,
  Star,
  Shield,
  Zap,
  Brain,
  Workflow,
  BarChart3
} from 'lucide-react'

const enterpriseFeatures = [
  {
    icon: Brain,
    title: 'IA Personalizada',
    description: 'Modelos de IA entrenados específicamente para tu industria y datos'
  },
  {
    icon: Workflow,
    title: 'Workflows Avanzados',
    description: 'Automatizaciones complejas con lógica condicional y bucles'
  },
  {
    icon: BarChart3,
    title: 'Analytics Avanzados',
    description: 'Dashboards personalizados con métricas específicas de tu negocio'
  },
  {
    icon: Shield,
    title: 'Seguridad Enterprise',
    description: 'Cumplimiento SOC2, GDPR, HIPAA y auditorías de seguridad'
  },
  {
    icon: Users,
    title: 'Gestión de Equipos',
    description: 'Roles y permisos granulares, SSO, LDAP y Active Directory'
  },
  {
    icon: Zap,
    title: 'Integraciones Personalizadas',
    description: 'APIs personalizadas y integraciones con tus sistemas existentes'
  }
]

const industries = [
  'E-commerce',
  'SaaS',
  'Consultoría',
  'Inmobiliaria',
  'Salud',
  'Educación',
  'Finanzas',
  'Manufactura',
  'Retail',
  'Otro'
]

const companySizes = [
  '1-10 empleados',
  '11-50 empleados',
  '51-200 empleados',
  '201-1000 empleados',
  '1000+ empleados'
]

const useCases = [
  'Automatización de procesos',
  'Análisis de datos con IA',
  'Gestión de clientes',
  'Optimización de operaciones',
  'Generación de contenido',
  'Análisis predictivo',
  'Integración de sistemas',
  'Otro'
]

export default function ContactPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    industry: '',
    companySize: '',
    useCase: '',
    message: '',
    phone: ''
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simular envío del formulario
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setIsSubmitting(false)
    setIsSubmitted(true)
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 flex items-center justify-center">
        <Card className="max-w-md mx-4">
          <CardContent className="pt-6 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              ¡Gracias por tu interés!
            </h2>
            <p className="text-gray-600 mb-6">
              Hemos recibido tu solicitud. Nuestro equipo de ventas se pondrá en contacto contigo en las próximas 24 horas.
            </p>
            <Button asChild className="w-full">
              <a href="/">
                Volver al Inicio
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <Badge variant="secondary" className="mb-4 text-sm bg-white/20 text-white border-white/30">
            <Building className="w-4 h-4 mr-2" />
            Plan Enterprise
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Hablemos sobre tu
            <span className="block bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              proyecto empresarial
            </span>
          </h1>
          <p className="text-xl opacity-90 max-w-3xl mx-auto mb-8">
            Obtén una solución personalizada con IA especializada, integraciones customizadas y soporte dedicado para tu empresa.
          </p>
        </div>
      </div>

      <div className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Formulario */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Solicita una Demo Personalizada</CardTitle>
                  <CardDescription>
                    Completa el formulario y nuestro equipo se pondrá en contacto contigo en 24 horas.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">
                          Nombre *
                        </label>
                        <Input
                          value={formData.firstName}
                          onChange={(e) => handleChange('firstName', e.target.value)}
                          placeholder="Tu nombre"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">
                          Apellido *
                        </label>
                        <Input
                          value={formData.lastName}
                          onChange={(e) => handleChange('lastName', e.target.value)}
                          placeholder="Tu apellido"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        Email Corporativo *
                      </label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        placeholder="tu@empresa.com"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">
                          Empresa *
                        </label>
                        <Input
                          value={formData.company}
                          onChange={(e) => handleChange('company', e.target.value)}
                          placeholder="Nombre de tu empresa"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">
                          Teléfono
                        </label>
                        <Input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => handleChange('phone', e.target.value)}
                          placeholder="+34 600 000 000"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">
                          Industria *
                        </label>
                        <Select value={formData.industry} onValueChange={(value) => handleChange('industry', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona tu industria" />
                          </SelectTrigger>
                          <SelectContent>
                            {industries.map((industry) => (
                              <SelectItem key={industry} value={industry}>
                                {industry}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">
                          Tamaño de Empresa *
                        </label>
                        <Select value={formData.companySize} onValueChange={(value) => handleChange('companySize', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona el tamaño" />
                          </SelectTrigger>
                          <SelectContent>
                            {companySizes.map((size) => (
                              <SelectItem key={size} value={size}>
                                {size}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        Caso de Uso Principal *
                      </label>
                      <Select value={formData.useCase} onValueChange={(value) => handleChange('useCase', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="¿Qué quieres automatizar?" />
                        </SelectTrigger>
                        <SelectContent>
                          {useCases.map((useCase) => (
                            <SelectItem key={useCase} value={useCase}>
                              {useCase}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        Cuéntanos más sobre tu proyecto
                      </label>
                      <Textarea
                        value={formData.message}
                        onChange={(e) => handleChange('message', e.target.value)}
                        placeholder="Describe tus necesidades específicas, objetivos y cualquier requisito especial..."
                        rows={4}
                      />
                    </div>

                    <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Enviando...
                        </>
                      ) : (
                        <>
                          Solicitar Demo Personalizada
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Información del Plan Enterprise */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  ¿Por qué elegir el Plan Enterprise?
                </h2>
                <p className="text-lg text-gray-600 mb-6">
                  Obtén una solución completamente personalizada con funcionalidades exclusivas diseñadas específicamente para tu empresa.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {enterpriseFeatures.map((feature, index) => (
                  <Card key={index} className="h-full">
                    <CardContent className="pt-6">
                      <div className="flex items-start space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <feature.icon className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                          <p className="text-sm text-gray-600">{feature.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
                <CardContent className="pt-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    Incluye en tu Plan Enterprise:
                  </h3>
                  <ul className="space-y-2">
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span className="text-gray-700">Workspaces ilimitados</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span className="text-gray-700">Usuarios ilimitados</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span className="text-gray-700">IA personalizada (100,000+ requests/mes)</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span className="text-gray-700">Soporte 24/7 con manager dedicado</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span className="text-gray-700">Integraciones personalizadas</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span className="text-gray-700">SLA 99.9% con garantía</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Información de Contacto
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-blue-600" />
                    <span className="text-gray-700">enterprise@stack21.com</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-blue-600" />
                    <span className="text-gray-700">+34 900 123 456</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-blue-600" />
                    <span className="text-gray-700">Lun-Vie 9:00-18:00 CET</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-blue-600" />
                    <span className="text-gray-700">Madrid, España</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
