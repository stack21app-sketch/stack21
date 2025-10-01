'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { 
  Settings, 
  Save, 
  RefreshCw,
  Eye,
  EyeOff,
  Shield,
  Bell,
  Palette,
  Globe,
  Key,
  Database,
  Zap,
  AlertTriangle,
  CheckCircle,
  Loader2,
  X
} from 'lucide-react'

interface WorkspaceSettings {
  name: string
  slug: string
  description: string
  timezone: string
  language: string
  theme: 'dark' | 'light' | 'auto'
  notifications: {
    email: boolean
    push: boolean
    aiUpdates: boolean
    billing: boolean
    team: boolean
  }
  api: {
    enabled: boolean
    rateLimit: number
    allowedOrigins: string[]
  }
  security: {
    twoFactor: boolean
    sessionTimeout: number
    ipWhitelist: string[]
  }
}

export default function SettingsPage() {
  const params = useParams()
  const { data: session } = useSession()
  const slug = params.slug as string

  const [settings, setSettings] = useState<WorkspaceSettings>({
    name: '',
    slug: '',
    description: '',
    timezone: 'America/Mexico_City',
    language: 'es',
    theme: 'dark',
    notifications: {
      email: true,
      push: true,
      aiUpdates: true,
      billing: true,
      team: true
    },
    api: {
      enabled: false,
      rateLimit: 1000,
      allowedOrigins: []
    },
    security: {
      twoFactor: false,
      sessionTimeout: 30,
      ipWhitelist: []
    }
  })
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [showApiKey, setShowApiKey] = useState(false)
  const [apiKey, setApiKey] = useState('sk_live_...')
  const [activeTab, setActiveTab] = useState<'general' | 'notifications' | 'api' | 'security'>('general')

  const timezones = [
    'America/Mexico_City',
    'America/New_York',
    'America/Los_Angeles',
    'Europe/London',
    'Europe/Paris',
    'Asia/Tokyo',
    'UTC'
  ]

  const languages = [
    { code: 'es', name: 'Español' },
    { code: 'en', name: 'English' },
    { code: 'fr', name: 'Français' },
    { code: 'de', name: 'Deutsch' },
    { code: 'pt', name: 'Português' }
  ]

  const themes = [
    { id: 'dark', name: 'Oscuro', icon: '🌙' },
    { id: 'light', name: 'Claro', icon: '☀️' },
    { id: 'auto', name: 'Automático', icon: '🔄' }
  ]

  const fetchSettings = useCallback(async () => {
    setLoading(true)
    try {
      // Simulación de carga de configuraciones
      const mockSettings: WorkspaceSettings = {
        name: 'Mi Workspace',
        slug: slug,
        description: 'Workspace de desarrollo con IA',
        timezone: 'America/Mexico_City',
        language: 'es',
        theme: 'dark',
        notifications: {
          email: true,
          push: true,
          aiUpdates: true,
          billing: true,
          team: true
        },
        api: {
          enabled: true,
          rateLimit: 1000,
          allowedOrigins: ['localhost:3000', 'mi-app.com']
        },
        security: {
          twoFactor: false,
          sessionTimeout: 30,
          ipWhitelist: []
        }
      }
      setSettings(mockSettings)
    } catch (error) {
      console.error('Error loading settings:', error)
    } finally {
      setLoading(false)
    }
  }, [slug])

  useEffect(() => {
    fetchSettings()
  }, [fetchSettings])

  const handleSave = async () => {
    setSaving(true)
    try {
      const response = await fetch('/api/workspace/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      })

      if (response.ok) {
        alert('Configuraciones guardadas exitosamente')
      }
    } catch (error) {
      console.error('Error saving settings:', error)
      alert('Error al guardar configuraciones')
    } finally {
      setSaving(false)
    }
  }

  const generateApiKey = async () => {
    try {
      const response = await fetch('/api/workspace/generate-api-key', {
        method: 'POST',
      })

      if (response.ok) {
        const data = await response.json()
        setApiKey(data.apiKey)
        alert('Nueva API key generada')
      }
    } catch (error) {
      console.error('Error generating API key:', error)
    }
  }

  const tabs = [
    { id: 'general', name: 'General', icon: Settings },
    { id: 'notifications', name: 'Notificaciones', icon: Bell },
    { id: 'api', name: 'API', icon: Key },
    { id: 'security', name: 'Seguridad', icon: Shield }
  ]

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white">No autorizado</h2>
          <p className="text-gray-300">Debes iniciar sesión para ver configuraciones</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-cyan-400 mx-auto mb-4" />
          <p className="text-gray-300">Cargando configuraciones...</p>
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
              <Settings className="h-8 w-8 text-cyan-400 mr-3" />
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  Configuraciones
                </h1>
                <p className="text-sm text-gray-300">Gestiona la configuración de tu workspace</p>
              </div>
            </div>
            <Button 
              onClick={handleSave}
              disabled={saving}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              {saving ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              {saving ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <Card className="bg-black/20 backdrop-blur-lg border-white/10">
            <CardContent className="p-4">
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <Button
                    key={tab.id}
                    variant={activeTab === tab.id ? "default" : "ghost"}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`w-full justify-start ${
                      activeTab === tab.id 
                        ? 'bg-purple-600 hover:bg-purple-700' 
                        : 'text-white hover:bg-white/10'
                    }`}
                  >
                    <tab.icon className="h-4 w-4 mr-2" />
                    {tab.name}
                  </Button>
                ))}
              </nav>
            </CardContent>
          </Card>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* General Settings */}
            {activeTab === 'general' && (
              <Card className="bg-black/20 backdrop-blur-lg border-white/10">
                <CardHeader>
                  <CardTitle className="text-lg text-white flex items-center">
                    <Settings className="h-5 w-5 mr-2 text-purple-400" />
                    Configuración General
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Información básica del workspace
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-white">Nombre del Workspace</Label>
                      <Input
                        value={settings.name}
                        onChange={(e) => setSettings(prev => ({ ...prev, name: e.target.value }))}
                        className="bg-black/20 border-white/20 text-white placeholder-gray-400"
                        placeholder="Mi Workspace"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-white">Slug (URL)</Label>
                      <Input
                        value={settings.slug}
                        onChange={(e) => setSettings(prev => ({ ...prev, slug: e.target.value }))}
                        className="bg-black/20 border-white/20 text-white placeholder-gray-400"
                        placeholder="mi-workspace"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white">Descripción</Label>
                    <Textarea
                      value={settings.description}
                      onChange={(e) => setSettings(prev => ({ ...prev, description: e.target.value }))}
                      className="bg-black/20 border-white/20 text-white placeholder-gray-400"
                      placeholder="Describe tu workspace..."
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-white">Zona Horaria</Label>
                      <select
                        value={settings.timezone}
                        onChange={(e) => setSettings(prev => ({ ...prev, timezone: e.target.value }))}
                        className="w-full p-2 bg-black/20 border border-white/20 rounded-lg text-white"
                      >
                        {timezones.map((tz) => (
                          <option key={tz} value={tz}>{tz}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-white">Idioma</Label>
                      <select
                        value={settings.language}
                        onChange={(e) => setSettings(prev => ({ ...prev, language: e.target.value }))}
                        className="w-full p-2 bg-black/20 border border-white/20 rounded-lg text-white"
                      >
                        {languages.map((lang) => (
                          <option key={lang.code} value={lang.code}>{lang.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white">Tema</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {themes.map((theme) => (
                        <Button
                          key={theme.id}
                          variant={settings.theme === theme.id ? "default" : "outline"}
                          onClick={() => setSettings(prev => ({ ...prev, theme: theme.id as any }))}
                          className={`justify-start ${
                            settings.theme === theme.id 
                              ? 'bg-purple-600 hover:bg-purple-700' 
                              : 'border-white/20 text-white hover:bg-white/10'
                          }`}
                        >
                          <span className="mr-2">{theme.icon}</span>
                          {theme.name}
                        </Button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Notifications Settings */}
            {activeTab === 'notifications' && (
              <Card className="bg-black/20 backdrop-blur-lg border-white/10">
                <CardHeader>
                  <CardTitle className="text-lg text-white flex items-center">
                    <Bell className="h-5 w-5 mr-2 text-purple-400" />
                    Configuración de Notificaciones
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Controla cuándo y cómo recibes notificaciones
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    {Object.entries(settings.notifications).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                        <div>
                          <h4 className="text-white font-medium capitalize">
                            {key === 'email' ? 'Notificaciones por Email' :
                             key === 'push' ? 'Notificaciones Push' :
                             key === 'aiUpdates' ? 'Actualizaciones de IA' :
                             key === 'billing' ? 'Facturación' :
                             key === 'team' ? 'Equipo' : key}
                          </h4>
                          <p className="text-sm text-gray-400">
                            {key === 'email' ? 'Recibe notificaciones por correo electrónico' :
                             key === 'push' ? 'Recibe notificaciones en el navegador' :
                             key === 'aiUpdates' ? 'Notificaciones sobre actualizaciones de IA' :
                             key === 'billing' ? 'Notificaciones sobre facturación y pagos' :
                             key === 'team' ? 'Notificaciones sobre actividad del equipo' : ''}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          variant={value ? "default" : "outline"}
                          onClick={() => setSettings(prev => ({
                            ...prev,
                            notifications: { ...prev.notifications, [key]: !value }
                          }))}
                          className={value ? 'bg-green-600 hover:bg-green-700' : 'border-white/20 text-white hover:bg-white/10'}
                        >
                          {value ? <CheckCircle className="h-4 w-4" /> : <X className="h-4 w-4" />}
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* API Settings */}
            {activeTab === 'api' && (
              <Card className="bg-black/20 backdrop-blur-lg border-white/10">
                <CardHeader>
                  <CardTitle className="text-lg text-white flex items-center">
                    <Key className="h-5 w-5 mr-2 text-purple-400" />
                    Configuración de API
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Gestiona el acceso a la API de tu workspace
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                    <div>
                      <h4 className="text-white font-medium">API Habilitada</h4>
                      <p className="text-sm text-gray-400">Permite acceso programático a tu workspace</p>
                    </div>
                    <Button
                      size="sm"
                      variant={settings.api.enabled ? "default" : "outline"}
                      onClick={() => setSettings(prev => ({
                        ...prev,
                        api: { ...prev.api, enabled: !prev.api.enabled }
                      }))}
                      className={settings.api.enabled ? 'bg-green-600 hover:bg-green-700' : 'border-white/20 text-white hover:bg-white/10'}
                    >
                      {settings.api.enabled ? <CheckCircle className="h-4 w-4" /> : <X className="h-4 w-4" />}
                    </Button>
                  </div>

                  {settings.api.enabled && (
                    <>
                      <div className="space-y-2">
                        <Label className="text-white">API Key</Label>
                        <div className="flex gap-2">
                          <Input
                            type={showApiKey ? "text" : "password"}
                            value={apiKey}
                            readOnly
                            className="bg-black/20 border-white/20 text-white font-mono"
                          />
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setShowApiKey(!showApiKey)}
                            className="border-white/20 text-white hover:bg-white/10"
                          >
                            {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={generateApiKey}
                            className="border-white/20 text-white hover:bg-white/10"
                          >
                            <RefreshCw className="h-4 w-4 mr-1" />
                            Regenerar
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-white">Límite de Requests por Hora</Label>
                        <Input
                          type="number"
                          value={settings.api.rateLimit}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            api: { ...prev.api, rateLimit: parseInt(e.target.value) }
                          }))}
                          className="bg-black/20 border-white/20 text-white"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-white">Orígenes Permitidos (CORS)</Label>
                        <Textarea
                          value={settings.api.allowedOrigins.join('\n')}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            api: { ...prev.api, allowedOrigins: e.target.value.split('\n').filter(Boolean) }
                          }))}
                          className="bg-black/20 border-white/20 text-white placeholder-gray-400"
                          placeholder="localhost:3000&#10;mi-app.com&#10;otro-dominio.com"
                          rows={3}
                        />
                        <p className="text-xs text-gray-400">Un dominio por línea</p>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Security Settings */}
            {activeTab === 'security' && (
              <Card className="bg-black/20 backdrop-blur-lg border-white/10">
                <CardHeader>
                  <CardTitle className="text-lg text-white flex items-center">
                    <Shield className="h-5 w-5 mr-2 text-purple-400" />
                    Configuración de Seguridad
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Configura las medidas de seguridad de tu workspace
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                    <div>
                      <h4 className="text-white font-medium">Autenticación de Dos Factores</h4>
                      <p className="text-sm text-gray-400">Requiere un código adicional para iniciar sesión</p>
                    </div>
                    <Button
                      size="sm"
                      variant={settings.security.twoFactor ? "default" : "outline"}
                      onClick={() => setSettings(prev => ({
                        ...prev,
                        security: { ...prev.security, twoFactor: !prev.security.twoFactor }
                      }))}
                      className={settings.security.twoFactor ? 'bg-green-600 hover:bg-green-700' : 'border-white/20 text-white hover:bg-white/10'}
                    >
                      {settings.security.twoFactor ? <CheckCircle className="h-4 w-4" /> : <X className="h-4 w-4" />}
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white">Timeout de Sesión (minutos)</Label>
                    <Input
                      type="number"
                      value={settings.security.sessionTimeout}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        security: { ...prev.security, sessionTimeout: parseInt(e.target.value) }
                      }))}
                      className="bg-black/20 border-white/20 text-white"
                      min="5"
                      max="480"
                    />
                    <p className="text-xs text-gray-400">Tiempo antes de que la sesión expire por inactividad</p>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white">Lista Blanca de IPs</Label>
                    <Textarea
                      value={settings.security.ipWhitelist.join('\n')}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        security: { ...prev.security, ipWhitelist: e.target.value.split('\n').filter(Boolean) }
                      }))}
                      className="bg-black/20 border-white/20 text-white placeholder-gray-400"
                      placeholder="192.168.1.1&#10;10.0.0.0/8&#10;172.16.0.0/12"
                      rows={3}
                    />
                    <p className="text-xs text-gray-400">Una IP o rango por línea. Deja vacío para permitir todas las IPs</p>
                  </div>

                  <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                    <div className="flex items-start">
                      <AlertTriangle className="h-5 w-5 text-yellow-400 mr-2 mt-0.5" />
                      <div>
                        <h4 className="text-yellow-400 font-medium">Importante</h4>
                        <p className="text-sm text-yellow-300 mt-1">
                          Los cambios de seguridad pueden afectar el acceso a tu workspace. 
                          Asegúrate de tener acceso de respaldo antes de aplicar restricciones.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
