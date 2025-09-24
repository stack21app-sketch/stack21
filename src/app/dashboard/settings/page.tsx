'use client'

import { useState, useEffect, useContext } from 'react'
import { I18nContext } from '@/lib/i18n'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useWorkspace } from '@/hooks/use-workspace'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Settings, 
  User,
  Bell,
  Shield,
  CreditCard,
  Database,
  Key,
  Save,
  CheckCircle,
  Download,
  Trash2,
  AlertTriangle,
  RefreshCw,
  AlertCircle
} from 'lucide-react'

export default function SettingsPage() {
  const { t } = useContext(I18nContext)
  const { data: session, status } = useSession()
  const router = useRouter()
  const { currentWorkspace } = useWorkspace()
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [settings, setSettings] = useState<any>(null)
  const [formData, setFormData] = useState({
    theme: 'dark',
    language: 'es',
    timezone: 'UTC',
    notifications: {
      email: true,
      projectUpdates: true,
      workflowAlerts: false
    },
    security: {
      twoFactor: false,
      sessionTimeout: true
    }
  })
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  if (status === 'unauthenticated') {
    router.push('/auth/signin')
    return null
  }

  useEffect(() => {
    if (status === 'authenticated') {
      fetchSettings()
    }
  }, [status])

  const fetchSettings = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/settings')
      const data = await response.json()

      if (response.ok) {
        setSettings(data)
        if (data.preferences) {
          setFormData({
            theme: data.preferences.theme || 'dark',
            language: data.preferences.language || 'es',
            timezone: data.preferences.timezone || 'UTC',
            notifications: {
              email: data.preferences.notifications?.email ?? true,
              projectUpdates: data.preferences.notifications?.projectUpdates ?? true,
              workflowAlerts: data.preferences.notifications?.workflowAlerts ?? false
            },
            security: {
              twoFactor: data.preferences.security?.twoFactor ?? false,
              sessionTimeout: data.preferences.security?.sessionTimeout ?? true
            }
          })
        }
      }
    } catch (error) {
      console.error('Error al cargar configuración:', error)
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    )
  }

  const handleSave = async () => {
    setLoading(true)
    setSaved(false)

    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Error al guardar configuración')
      }

      setSettings(data)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (error) {
      console.error('Error al guardar configuración:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleReset = async () => {
    if (!confirm('¿Estás seguro de que quieres resetear todas las preferencias a los valores por defecto?')) {
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'reset_preferences' }),
      })

      const data = await response.json()

      if (response.ok) {
        fetchSettings() // Recargar configuración
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      }
    } catch (error) {
      console.error('Error al resetear configuración:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleExportData = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'export_data' }),
      })

      const data = await response.json()

      if (response.ok) {
        // Descargar archivo JSON
        const blob = new Blob([JSON.stringify(data.data, null, 2)], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `datos-usuario-${new Date().toISOString().split('T')[0]}.json`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
      }
    } catch (error) {
      console.error('Error al exportar datos:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (!confirm('¿Estás SEGURO de que quieres eliminar tu cuenta? Esta acción no se puede deshacer.')) {
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'delete_account' }),
      })

      const data = await response.json()

      if (response.ok) {
        // Redirigir al login
        window.location.href = '/auth/signin'
      }
    } catch (error) {
      console.error('Error al eliminar cuenta:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{t('settings')}</h1>
        <p className="text-gray-600 mt-2">
          Personaliza tu experiencia de automatización y configura las preferencias de tu workspace.
        </p>
      </div>

      {/* Success Alert */}
      {saved && (
        <Alert className="mb-6 border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            Configuración guardada exitosamente
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-6">
        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="mr-2 h-5 w-5" />
              Perfil de Usuario
            </CardTitle>
            <CardDescription>
              Información personal y preferencias de cuenta
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre completo</Label>
                <Input
                  id="name"
                  value={session?.user?.name || ''}
                  placeholder="Tu nombre completo"
                  disabled
                />
                <p className="text-xs text-gray-500">
                  El nombre se actualiza automáticamente desde tu proveedor de autenticación
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Correo electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  value={session?.user?.email || ''}
                  disabled
                />
                <p className="text-xs text-gray-500">
                  El correo no se puede cambiar
                </p>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="bio">Biografía</Label>
              <Textarea
                id="bio"
                placeholder="Cuéntanos un poco sobre ti..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Workspace Settings */}
        {currentWorkspace && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="mr-2 h-5 w-5" />
                Configuración del Workspace
              </CardTitle>
              <CardDescription>
                Configuración específica de {currentWorkspace.name}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="workspace-name">Nombre del workspace</Label>
                  <Input
                    id="workspace-name"
                    defaultValue={currentWorkspace.name}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="workspace-slug">Slug (URL)</Label>
                  <Input
                    id="workspace-slug"
                    defaultValue={currentWorkspace.slug}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="workspace-description">Descripción</Label>
                <Textarea
                  id="workspace-description"
                  placeholder="Describe tu workspace..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="mr-2 h-5 w-5" />
              Notificaciones
            </CardTitle>
            <CardDescription>
              Configura cómo y cuándo recibir notificaciones
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="email-notifications">Notificaciones por correo</Label>
                <p className="text-sm text-gray-500">
                  Recibe notificaciones importantes por correo electrónico
                </p>
              </div>
              <Switch id="email-notifications" defaultChecked />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="project-updates">Actualizaciones de proyectos</Label>
                <p className="text-sm text-gray-500">
                  Notificaciones cuando hay cambios en tus proyectos
                </p>
              </div>
              <Switch id="project-updates" defaultChecked />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="workflow-alerts">Alertas de workflows</Label>
                <p className="text-sm text-gray-500">
                  Notificaciones cuando los workflows fallan o completan
                </p>
              </div>
              <Switch id="workflow-alerts" />
            </div>
          </CardContent>
        </Card>

        {/* Security */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="mr-2 h-5 w-5" />
              Seguridad
            </CardTitle>
            <CardDescription>
              Configuración de seguridad y privacidad
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="two-factor">Autenticación de dos factores</Label>
                <p className="text-sm text-gray-500">
                  Añade una capa extra de seguridad a tu cuenta
                </p>
              </div>
              <Switch id="two-factor" />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="session-timeout">Cerrar sesión automática</Label>
                <p className="text-sm text-gray-500">
                  Cierra la sesión después de 30 minutos de inactividad
                </p>
              </div>
              <Switch id="session-timeout" defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* API Keys */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Key className="mr-2 h-5 w-5" />
              Claves API
            </CardTitle>
            <CardDescription>
              Gestiona tus claves de API para integraciones
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <Key className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No tienes claves API
              </h3>
              <p className="text-gray-500 mb-4">
                Crea claves API para integrar tu aplicación con servicios externos
              </p>
              <Button variant="outline">
                Crear Clave API
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Advanced Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="mr-2 h-5 w-5" />
              Configuración Avanzada
            </CardTitle>
            <CardDescription>
              Opciones adicionales y herramientas de administración
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="theme">Tema</Label>
                <Select
                  value={formData.theme}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, theme: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Claro</SelectItem>
                    <SelectItem value="dark">Oscuro</SelectItem>
                    <SelectItem value="system">Sistema</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="language">Idioma</Label>
                <Select
                  value={formData.language}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, language: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="es">Español</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="fr">Français</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="timezone">Zona Horaria</Label>
              <Select
                value={formData.timezone}
                onValueChange={(value) => setFormData(prev => ({ ...prev, timezone: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="UTC">UTC</SelectItem>
                  <SelectItem value="America/Mexico_City">México (GMT-6)</SelectItem>
                  <SelectItem value="America/New_York">Nueva York (GMT-5)</SelectItem>
                  <SelectItem value="Europe/Madrid">Madrid (GMT+1)</SelectItem>
                  <SelectItem value="Europe/London">Londres (GMT+0)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Database className="mr-2 h-5 w-5" />
              Gestión de Datos
            </CardTitle>
            <CardDescription>
              Exportar, resetear o eliminar tus datos
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="outline" onClick={handleExportData} disabled={loading}>
                <Download className="mr-2 h-4 w-4" />
                Exportar Datos
              </Button>
              
              <Button variant="outline" onClick={handleReset} disabled={loading}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Resetear Preferencias
              </Button>
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-red-600">Zona Peligrosa</h4>
              <p className="text-sm text-gray-500">
                Estas acciones son irreversibles. Ten cuidado.
              </p>
              <Button 
                variant="destructive" 
                onClick={() => setShowDeleteConfirm(true)}
                disabled={loading}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Eliminar Cuenta
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={loading}>
            <Save className="mr-2 h-4 w-4" />
            {loading ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="w-full max-w-md mx-4">
              <CardHeader>
                <CardTitle className="text-red-600 flex items-center">
                  <AlertTriangle className="mr-2 h-5 w-5" />
                  Eliminar Cuenta
                </CardTitle>
                <CardDescription>
                  Esta acción es irreversible. Se eliminarán todos tus datos permanentemente.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Advertencia:</strong> Esta acción eliminará:
                      <ul className="list-disc list-inside mt-2 space-y-1">
                        <li>Tu cuenta de usuario</li>
                        <li>Todos tus workspaces</li>
                        <li>Todos tus proyectos</li>
                        <li>Todos tus datos personales</li>
                      </ul>
                    </AlertDescription>
                  </Alert>
                  
                  <div className="flex space-x-2">
                    <Button 
                      variant="destructive" 
                      onClick={handleDeleteAccount}
                      disabled={loading}
                      className="flex-1"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      {loading ? 'Eliminando...' : 'Sí, Eliminar Cuenta'}
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setShowDeleteConfirm(false)}
                    >
                      Cancelar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}