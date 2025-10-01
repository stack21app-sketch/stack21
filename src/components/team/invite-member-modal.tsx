'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  X, 
  Mail, 
  UserPlus, 
  Shield, 
  User, 
  Settings, 
  Crown,
  Send,
  Copy,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react'

interface InviteMemberModalProps {
  isOpen: boolean
  onClose: () => void
  onInvite: (inviteData: InviteData) => void
}

interface InviteData {
  email: string
  role: 'admin' | 'member' | 'viewer'
  department?: string
  message?: string
  permissions: string[]
}

const roleOptions = [
  {
    id: 'admin',
    name: 'Administrador',
    description: 'Acceso completo a todas las funciones',
    icon: Shield,
    color: 'bg-red-100 text-red-800 border-red-200',
    permissions: ['Gestionar usuarios', 'Configurar sistema', 'Ver analytics', 'Gestionar facturación']
  },
  {
    id: 'member',
    name: 'Miembro',
    description: 'Acceso estándar a la plataforma',
    icon: User,
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    permissions: ['Crear workflows', 'Ver proyectos', 'Colaborar en equipo', 'Usar IA']
  },
  {
    id: 'viewer',
    name: 'Observador',
    description: 'Solo lectura, sin permisos de edición',
    icon: Settings,
    color: 'bg-gray-100 text-gray-800 border-gray-200',
    permissions: ['Ver proyectos', 'Ver reportes', 'Leer documentación']
  }
]

const departmentOptions = [
  'Desarrollo',
  'Marketing',
  'Ventas',
  'Soporte',
  'Recursos Humanos',
  'Finanzas',
  'Operaciones',
  'Diseño'
]

export default function InviteMemberModal({ isOpen, onClose, onInvite }: InviteMemberModalProps) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState<InviteData>({
    email: '',
    role: 'member',
    department: '',
    message: '',
    permissions: []
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [inviteLink, setInviteLink] = useState('')

  const selectedRole = roleOptions.find(role => role.id === formData.role)

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleNext = () => {
    const newErrors: Record<string, string> = {}

    if (step === 1) {
      if (!formData.email.trim()) {
        newErrors.email = 'El email es requerido'
      } else if (!validateEmail(formData.email)) {
        newErrors.email = 'El email no es válido'
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setErrors({})
    setStep(step + 1)
  }

  const handleBack = () => {
    setStep(step - 1)
    setErrors({})
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    
    try {
      // Simular envío de invitación
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Generar link de invitación simulado
      const link = `https://stack21.com/invite?token=${Math.random().toString(36).substr(2, 9)}`
      setInviteLink(link)
      
      onInvite(formData)
      setStep(4) // Mostrar confirmación
    } catch (error) {
      console.error('Error sending invitation:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const copyInviteLink = () => {
    navigator.clipboard.writeText(inviteLink)
  }

  const resetForm = () => {
    setFormData({
      email: '',
      role: 'member',
      department: '',
      message: '',
      permissions: []
    })
    setStep(1)
    setErrors({})
    setInviteLink('')
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl bg-white shadow-2xl">
          <CardHeader className="border-b border-gray-200">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center">
                <UserPlus className="h-5 w-5 mr-2 text-blue-500" />
                Invitar Miembro al Equipo
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClose}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            {/* Progress Steps */}
            <div className="flex items-center justify-center mb-8">
              <div className="flex items-center space-x-4">
                {[1, 2, 3, 4].map((stepNumber) => (
                  <div key={stepNumber} className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      step >= stepNumber 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-200 text-gray-600'
                    }`}>
                      {stepNumber}
                    </div>
                    {stepNumber < 4 && (
                      <div className={`w-8 h-0.5 ml-4 ${
                        step > stepNumber ? 'bg-blue-500' : 'bg-gray-200'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Step 1: Email */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Información de Contacto
                  </h3>
                  <p className="text-gray-600">
                    Ingresa el email de la persona que quieres invitar al equipo
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        type="email"
                        placeholder="usuario@empresa.com"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        className={`pl-10 ${errors.email ? 'border-red-500' : ''}`}
                      />
                    </div>
                    {errors.email && (
                      <p className="text-sm text-red-600 mt-1">{errors.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Departamento (Opcional)
                    </label>
                    <select
                      value={formData.department}
                      onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Seleccionar departamento</option>
                      {departmentOptions.map((dept) => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Role */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Seleccionar Rol
                  </h3>
                  <p className="text-gray-600">
                    Elige el nivel de acceso que tendrá este miembro
                  </p>
                </div>

                <div className="space-y-3">
                  {roleOptions.map((role) => {
                    const Icon = role.icon
                    return (
                      <div
                        key={role.id}
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          formData.role === role.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setFormData(prev => ({ 
                          ...prev, 
                          role: role.id as any,
                          permissions: role.permissions
                        }))}
                      >
                        <div className="flex items-start space-x-3">
                          <div className={`p-2 rounded-lg ${role.color}`}>
                            <Icon className="h-5 w-5" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{role.name}</h4>
                            <p className="text-sm text-gray-600 mb-2">{role.description}</p>
                            <div className="flex flex-wrap gap-1">
                              {role.permissions.map((permission, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {permission}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Step 3: Message */}
            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Mensaje Personalizado
                  </h3>
                  <p className="text-gray-600">
                    Añade un mensaje personalizado a la invitación (opcional)
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mensaje
                  </label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                    placeholder="Hola! Te invito a unirte a nuestro equipo en Stack21..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-24 resize-none"
                  />
                </div>

                {/* Preview */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Vista previa de la invitación:</h4>
                  <div className="text-sm text-gray-600">
                    <p><strong>Para:</strong> {formData.email}</p>
                    <p><strong>Rol:</strong> {selectedRole?.name}</p>
                    <p><strong>Departamento:</strong> {formData.department || 'No especificado'}</p>
                    {formData.message && (
                      <div className="mt-2 p-2 bg-white rounded border">
                        <p className="font-medium">Mensaje:</p>
                        <p>{formData.message}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Confirmation */}
            {step === 4 && (
              <div className="text-center space-y-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    ¡Invitación Enviada!
                  </h3>
                  <p className="text-gray-600">
                    Se ha enviado una invitación a <strong>{formData.email}</strong>
                  </p>
                </div>

                {inviteLink && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">Link de invitación:</h4>
                    <div className="flex items-center space-x-2">
                      <Input
                        value={inviteLink}
                        readOnly
                        className="flex-1"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={copyInviteLink}
                      >
                        <Copy className="h-4 w-4 mr-1" />
                        Copiar
                      </Button>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-center space-x-4">
                  <Button
                    variant="outline"
                    onClick={resetForm}
                  >
                    Invitar Otro
                  </Button>
                  <Button
                    onClick={handleClose}
                  >
                    Cerrar
                  </Button>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            {step < 4 && (
              <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                <Button
                  variant="outline"
                  onClick={step === 1 ? handleClose : handleBack}
                >
                  {step === 1 ? 'Cancelar' : 'Atrás'}
                </Button>
                
                <Button
                  onClick={step === 3 ? handleSubmit : handleNext}
                  disabled={isLoading}
                  className="bg-blue-500 hover:bg-blue-600"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                      Enviando...
                    </>
                  ) : step === 3 ? (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Enviar Invitación
                    </>
                  ) : (
                    'Siguiente'
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
