'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { User, Mail } from 'lucide-react'

export default function DevSignInPage() {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleDevSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !name) {
      setError('Por favor completa todos los campos')
      return
    }

    setLoading(true)
    setError('')

    try {
      // Simular login de desarrollo
      const userData = {
        id: `dev_${Date.now()}`,
        name,
        email,
        image: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`,
        workspaces: [{
          id: `workspace_${Date.now()}`,
          name: 'Mi Workspace',
          slug: 'mi-workspace',
          role: 'OWNER'
        }]
      }

      // Guardar en localStorage para simular sesión
      localStorage.setItem('dev-user', JSON.stringify(userData))
      
      // Redirigir al dashboard
      router.push('/dashboard')
    } catch (error) {
      setError('Error al iniciar sesión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Modo Desarrollo
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Inicia sesión sin configuración OAuth
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Acceso de Desarrollo</CardTitle>
            <CardDescription>
              Ingresa tus datos para acceder en modo desarrollo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleDevSignIn} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="name">Nombre completo</Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Tu nombre"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Correo electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full"
              >
                <User className="mr-2 h-4 w-4" />
                {loading ? 'Iniciando...' : 'Iniciar Sesión'}
              </Button>
            </form>

            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                Este es un modo de desarrollo. En producción usa OAuth.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
