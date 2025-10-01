'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Globe, 
  Database,
  Key,
  Mail,
  Smartphone,
  Monitor
} from 'lucide-react'
import { ConfigStatus } from '@/components/ConfigStatus'
import { TestPanel } from '@/components/TestPanel'
import { PerformanceMonitorComponent } from '@/components/PerformanceMonitor'
import { SEOOptimizer } from '@/components/SEOOptimizer'

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    profile: {
      name: 'Kevin Santiago Villa',
      email: 'kesafavil19@gmail.com',
      avatar: 'https://lh3.googleusercontent.com/a/ACg8ocLUoTFF2NRWVdA4lpnrDx6vVVvrD99c8TAiSP130skHRu8-dQM=s96-c'
    },
    notifications: {
      email: true,
      push: true,
      sms: false,
      marketing: false
    },
    security: {
      twoFactor: false,
      sessionTimeout: 30,
      loginAlerts: true
    },
    appearance: {
      theme: 'light',
      language: 'es',
      fontSize: 'medium'
    },
    integrations: {
      google: true,
      github: true,
      slack: false,
      discord: false
    }
  })

  const updateSetting = (category: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [key]: value
      }
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Configuración</h1>
          <p className="text-gray-600">Personaliza tu experiencia en Stack21</p>
        </motion.div>

        {/* Estado de Configuración */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
        >
          <ConfigStatus />
        </motion.div>

        {/* Panel de Pruebas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <TestPanel />
        </motion.div>

        {/* Monitor de Rendimiento */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <PerformanceMonitorComponent />
        </motion.div>

        {/* Optimizador SEO */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <SEOOptimizer />
        </motion.div>

        <div className="grid gap-6">
          {/* Profile Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Perfil
                </CardTitle>
                <CardDescription>
                  Información personal y preferencias de cuenta
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-xl font-bold">
                    {settings.profile.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-semibold">{settings.profile.name}</h3>
                    <p className="text-sm text-gray-600">{settings.profile.email}</p>
                  </div>
                </div>
                <Separator />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Nombre</Label>
                    <Input
                      id="name"
                      value={settings.profile.name}
                      onChange={(e) => updateSetting('profile', 'name', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={settings.profile.email}
                      onChange={(e) => updateSetting('profile', 'email', e.target.value)}
                    />
                  </div>
                </div>
                <Button className="w-full">Guardar Cambios</Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Notifications */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notificaciones
                </CardTitle>
                <CardDescription>
                  Configura cómo y cuándo recibir notificaciones
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-gray-600" />
                    <div>
                      <Label>Notificaciones por Email</Label>
                      <p className="text-sm text-gray-600">Recibir notificaciones importantes por email</p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.notifications.email}
                    onCheckedChange={(checked) => updateSetting('notifications', 'email', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Smartphone className="h-4 w-4 text-gray-600" />
                    <div>
                      <Label>Notificaciones Push</Label>
                      <p className="text-sm text-gray-600">Recibir notificaciones en tiempo real</p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.notifications.push}
                    onCheckedChange={(checked) => updateSetting('notifications', 'push', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Bell className="h-4 w-4 text-gray-600" />
                    <div>
                      <Label>Marketing</Label>
                      <p className="text-sm text-gray-600">Recibir ofertas y actualizaciones de productos</p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.notifications.marketing}
                    onCheckedChange={(checked) => updateSetting('notifications', 'marketing', checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Security */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Seguridad
                </CardTitle>
                <CardDescription>
                  Configuración de seguridad y privacidad
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Key className="h-4 w-4 text-gray-600" />
                    <div>
                      <Label>Autenticación de Dos Factores</Label>
                      <p className="text-sm text-gray-600">Añade una capa extra de seguridad</p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.security.twoFactor}
                    onCheckedChange={(checked) => updateSetting('security', 'twoFactor', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Bell className="h-4 w-4 text-gray-600" />
                    <div>
                      <Label>Alertas de Inicio de Sesión</Label>
                      <p className="text-sm text-gray-600">Recibir notificaciones de nuevos inicios de sesión</p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.security.loginAlerts}
                    onCheckedChange={(checked) => updateSetting('security', 'loginAlerts', checked)}
                  />
                </div>
                <div>
                  <Label htmlFor="timeout">Tiempo de Sesión (minutos)</Label>
                  <Input
                    id="timeout"
                    type="number"
                    value={settings.security.sessionTimeout}
                    onChange={(e) => updateSetting('security', 'sessionTimeout', parseInt(e.target.value))}
                    className="mt-2"
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Appearance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Apariencia
                </CardTitle>
                <CardDescription>
                  Personaliza la apariencia de la interfaz
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Tema</Label>
                  <div className="flex gap-2 mt-2">
                    <Button
                      variant={settings.appearance.theme === 'light' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => updateSetting('appearance', 'theme', 'light')}
                    >
                      <Monitor className="h-4 w-4 mr-2" />
                      Claro
                    </Button>
                    <Button
                      variant={settings.appearance.theme === 'dark' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => updateSetting('appearance', 'theme', 'dark')}
                    >
                      <Monitor className="h-4 w-4 mr-2" />
                      Oscuro
                    </Button>
                  </div>
                </div>
                <div>
                  <Label>Idioma</Label>
                  <div className="flex gap-2 mt-2">
                    <Button
                      variant={settings.appearance.language === 'es' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => updateSetting('appearance', 'language', 'es')}
                    >
                      <Globe className="h-4 w-4 mr-2" />
                      Español
                    </Button>
                    <Button
                      variant={settings.appearance.language === 'en' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => updateSetting('appearance', 'language', 'en')}
                    >
                      <Globe className="h-4 w-4 mr-2" />
                      English
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Integrations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Integraciones
                </CardTitle>
                <CardDescription>
                  Conecta con otros servicios y plataformas
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center">
                      <span className="text-white text-xs font-bold">G</span>
                    </div>
                    <div>
                      <Label>Google</Label>
                      <p className="text-sm text-gray-600">Conectar con Google Workspace</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">Conectado</Badge>
                    <Switch
                      checked={settings.integrations.google}
                      onCheckedChange={(checked) => updateSetting('integrations', 'google', checked)}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-800 rounded flex items-center justify-center">
                      <span className="text-white text-xs font-bold">GH</span>
                    </div>
                    <div>
                      <Label>GitHub</Label>
                      <p className="text-sm text-gray-600">Conectar con GitHub</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">Conectado</Badge>
                    <Switch
                      checked={settings.integrations.github}
                      onCheckedChange={(checked) => updateSetting('integrations', 'github', checked)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}