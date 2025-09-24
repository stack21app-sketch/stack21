'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Building2, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react'
import { validateWorkspaceName, validateWorkspaceSlug, validateDescription, generateSlug, sanitizeInput } from '@/lib/validations'
import Link from 'next/link'

export default function CreateWorkspacePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: ''
  })
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string[]}>({})

  // Redirigir si no está autenticado
  if (status === 'unauthenticated') {
    router.push('/auth/signin')
    return null
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    )
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    const sanitizedValue = sanitizeInput(value)
    
    setFormData(prev => ({
      ...prev,
      [name]: sanitizedValue
    }))

    // Auto-generar slug desde el nombre
    if (name === 'name') {
      const slug = generateSlug(sanitizedValue)
      setFormData(prev => ({
        ...prev,
        slug
      }))
    }

    // Validar en tiempo real
    validateField(name, sanitizedValue)
  }

  const validateField = (fieldName: string, value: string) => {
    let errors: string[] = []

    switch (fieldName) {
      case 'name':
        const nameValidation = validateWorkspaceName(value)
        errors = nameValidation.errors
        break
      case 'slug':
        const slugValidation = validateWorkspaceSlug(value)
        errors = slugValidation.errors
        break
      case 'description':
        const descValidation = validateDescription(value)
        errors = descValidation.errors
        break
    }

    setValidationErrors(prev => ({
      ...prev,
      [fieldName]: errors
    }))
  }

  const validateForm = (): boolean => {
    const nameValidation = validateWorkspaceName(formData.name)
    const slugValidation = validateWorkspaceSlug(formData.slug)
    const descValidation = validateDescription(formData.description)

    const errors = {
      name: nameValidation.errors,
      slug: slugValidation.errors,
      description: descValidation.errors
    }

    setValidationErrors(errors)

    return nameValidation.isValid && slugValidation.isValid && descValidation.isValid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Validar formulario antes de enviar
    if (!validateForm()) {
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/workspaces', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Error al crear el workspace')
      }

      setSuccess(true)
      
      // Redirigir al dashboard después de 2 segundos
      setTimeout(() => {
        router.push('/dashboard')
      }, 2000)

    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error inesperado')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl">¡Workspace Creado!</CardTitle>
              <CardDescription>
                Tu workspace "{formData.name}" ha sido creado exitosamente.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-sm text-gray-600 mb-4">
                Redirigiendo al dashboard...
              </p>
              <Button asChild>
                <Link href="/dashboard">
                  Ir al Dashboard
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver al Dashboard
            </Link>
          </Button>
          
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Building2 className="h-8 w-8 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Crear Nuevo Workspace
            </h1>
            <p className="text-gray-600">
              Configura tu nuevo espacio de trabajo para organizar tus proyectos
            </p>
          </div>
        </div>

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle>Información del Workspace</CardTitle>
            <CardDescription>
              Proporciona los detalles básicos para tu nuevo workspace
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="name">Nombre del Workspace *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Mi Empresa"
                  required
                  className={validationErrors.name?.length > 0 ? 'border-red-500' : ''}
                />
                {validationErrors.name?.length > 0 ? (
                  <div className="space-y-1">
                    {validationErrors.name.map((error, index) => (
                      <div key={index} className="flex items-center text-sm text-red-600">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {error}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">
                    Este será el nombre visible de tu workspace
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">Slug (URL) *</Label>
                <Input
                  id="slug"
                  name="slug"
                  value={formData.slug}
                  onChange={handleInputChange}
                  placeholder="mi-empresa"
                  required
                  className={validationErrors.slug?.length > 0 ? 'border-red-500' : ''}
                />
                {validationErrors.slug?.length > 0 ? (
                  <div className="space-y-1">
                    {validationErrors.slug.map((error, index) => (
                      <div key={index} className="flex items-center text-sm text-red-600">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {error}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">
                    URL única para tu workspace: {typeof window !== 'undefined' ? window.location.origin : ''}/w/{formData.slug || 'mi-empresa'}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe brevemente qué hace tu workspace..."
                  rows={3}
                  className={validationErrors.description?.length > 0 ? 'border-red-500' : ''}
                />
                {validationErrors.description?.length > 0 ? (
                  <div className="space-y-1">
                    {validationErrors.description.map((error, index) => (
                      <div key={index} className="flex items-center text-sm text-red-600">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {error}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">
                    Opcional: Una breve descripción de tu workspace
                  </p>
                )}
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  type="submit"
                  disabled={loading || !formData.name || !formData.slug}
                  className="flex-1"
                >
                  {loading ? 'Creando...' : 'Crear Workspace'}
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/dashboard">Cancelar</Link>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Info */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            ¿Necesitas ayuda? Consulta nuestra{' '}
            <Link href="#" className="text-blue-600 hover:underline">
              documentación
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}