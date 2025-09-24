'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState, useContext } from 'react'
import { I18nContext } from '@/lib/i18n'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Building2, Users, FolderOpen, Workflow, Plus, ExternalLink, CheckCircle, AlertCircle, TrendingUp, Zap, Brain, Target, Sparkles, ArrowRight, Play, BarChart3, Activity, Clock, DollarSign, Menu, X, Home, Settings, CreditCard, Store, Puzzle, Palette, LogOut, Trophy, Gamepad2, Bell, UserPlus, BookOpen, LayoutDashboard, Webhook, Database } from 'lucide-react'
import ComplianceMonitor from '@/components/legal/compliance-monitor'

export default function DashboardPage() {
  const { t } = useContext(I18nContext)
  const router = useRouter()
  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [notificationCenterOpen, setNotificationCenterOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    // Verificar sesión temporal del localStorage
    const checkSession = () => {
      try {
        const devSession = localStorage.getItem('dev-session')
        if (devSession) {
          const userData = JSON.parse(devSession)
          setSession({ user: userData })
        } else {
          router.push('/auth/signin')
        }
      } catch (error) {
        console.error('Error checking session:', error)
        router.push('/auth/signin')
      } finally {
        setLoading(false)
      }
    }

    checkSession()
  }, [router])

  // Cargar notificaciones
  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const response = await fetch(`/api/notifications?userId=user-1&type=unread-count`)
        const data = await response.json()
        if (data.success) {
          setUnreadCount(data.data.unreadCount)
        }
      } catch (error) {
        console.error('Error loading notifications:', error)
      }
    }

    if (session) {
      loadNotifications()
      // Actualizar cada 30 segundos
      const interval = setInterval(loadNotifications, 30000)
      return () => clearInterval(interval)
    }
  }, [session])

  const handleLogout = () => {
    localStorage.removeItem('dev-session')
    setSession(null)
    router.push('/auth/signin')
  }

  const menuItems = [
    { name: t('dashboard'), icon: Home, href: '/dashboard', active: true },
    { name: 'Workflows', icon: Workflow, href: '/workflow-builder' },
    { name: 'AI Assistant', icon: Brain, href: '/ai-assistant' },
    { name: 'Analytics', icon: BarChart3, href: '/analytics' },
    { name: 'Integrations', icon: Puzzle, href: '/integrations' },
    { name: 'Marketplace', icon: Store, href: '/marketplace' },
    { name: 'Smart Dashboard', icon: LayoutDashboard, href: '/smart-dashboard' },
    { name: 'Team', icon: UserPlus, href: '/team' },
    { name: 'Gamification', icon: Gamepad2, href: '/gamification' },
    { name: 'Webhooks', icon: Webhook, href: '/webhooks' },
    { name: 'API Docs', icon: BookOpen, href: '/api-docs' },
    { name: 'Pricing', icon: CreditCard, href: '/pricing' },
    { name: t('settings') ?? 'Settings', icon: Settings, href: '/dashboard/settings' },
  ]

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-32 w-32 border-4 border-blue-200 mx-auto"></div>
            <div className="animate-spin rounded-full h-32 w-32 border-4 border-blue-600 border-t-transparent mx-auto absolute top-0 left-0"></div>
          </div>
          <p className="mt-6 text-gray-600 text-lg font-medium">Cargando tu dashboard...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <div className="flex items-center">
            <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
              <Zap className="h-5 w-5 text-white" />
            </div>
              <span className="ml-2 text-xl font-bold text-gray-900">{t('app_title')}</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="mt-6 px-3">
          <div className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.name}
                  onClick={() => {
                    router.push(item.href)
                    setSidebarOpen(false)
                  }}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                    item.active
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className="h-5 w-5 mr-3" />
                  {item.name}
                </button>
              )
            })}
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="px-3">
              <div className="flex items-center">
                <div className="h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center">
                  <Users className="h-4 w-4 text-gray-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">{session?.user?.name || 'Usuario'}</p>
                  <p className="text-xs text-gray-500">{session?.user?.email || 'usuario@ejemplo.com'}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="mt-4 w-full flex items-center px-3 py-2 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors duration-200"
              >
                <LogOut className="h-4 w-4 mr-3" />
                {t('logout') ?? 'Logout'}
              </button>
            </div>
          </div>
        </nav>
      </div>

      {/* Overlay para móvil */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header móvil */}
        <div className="lg:hidden flex items-center justify-between h-16 px-4 bg-white border-b border-gray-200">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex items-center">
            <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <span className="ml-2 text-xl font-bold text-gray-900">{t('app_title')}</span>
          </div>
          <div className="w-10"></div>
        </div>

        {/* Contenido del dashboard */}
        <div className="flex-1 overflow-y-auto">
          <div className="container mx-auto px-4 py-8">
            <div className="space-y-8">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                    {t('welcome_title')}, {session?.user?.name || 'Usuario'}
                  </h1>
                  <p className="text-gray-600 mt-1 text-sm sm:text-base">
                    {t('dashboard_subtitle')}
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <Button
                    onClick={() => setNotificationCenterOpen(true)}
                    variant="outline"
                    className="relative"
                  >
                    <Bell className="h-4 w-4 mr-2" />
                    {t('notifications')}
                    {unreadCount > 0 && (
                      <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs">
                        {unreadCount}
                      </Badge>
                    )}
                  </Button>
                  <Button
                    onClick={() => router.push('/dashboard/workflows/builder')}
                    className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    {t('new_workflow')}
                  </Button>
                </div>
              </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{t('active_workflows')}</p>
                    <p className="text-2xl font-bold text-gray-900">12</p>
                  </div>
                  <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Workflow className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{t('runs_today')}</p>
                    <p className="text-2xl font-bold text-gray-900">1,234</p>
                  </div>
                  <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Activity className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{t('time_saved')}</p>
                    <p className="text-2xl font-bold text-gray-900">45h</p>
                  </div>
                  <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Clock className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{t('estimated_saving')}</p>
                    <p className="text-2xl font-bold text-gray-900">$2,340</p>
                  </div>
                  <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <DollarSign className="h-6 w-6 text-yellow-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Legal Compliance Monitor */}
          <ComplianceMonitor />

          {/* Gamification Section */}
          <Card className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 backdrop-blur-sm border border-yellow-500/20 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center text-yellow-600">
                <Trophy className="h-6 w-6 mr-2" />
                {t('gamification_progress')}
              </CardTitle>
              <CardDescription className="text-yellow-700">
                {t('keep_earning')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-600 mb-1">15</div>
                  <div className="text-sm text-yellow-700">{t('level')}</div>
                  <Badge className="mt-1 bg-yellow-500 text-white">Platinum</Badge>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-600 mb-1">12,500</div>
                  <div className="text-sm text-yellow-700">{t('points')}</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-600 mb-1">12</div>
                  <div className="text-sm text-yellow-700">{t('current_streak')}</div>
                  <div className="text-xs text-yellow-600">{t('on_fire')}</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-600 mb-1">8</div>
                  <div className="text-sm text-yellow-700">{t('badges_label')}</div>
                </div>
              </div>
              <div className="mt-4 flex justify-center">
                <Button 
                  onClick={() => router.push('/gamification')}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white"
                >
                  <Gamepad2 className="h-4 w-4 mr-2" />
                  {t('view_full_gamification')}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="h-5 w-5 mr-2 text-yellow-500" />
                  {t('quick_actions')}
                </CardTitle>
                <CardDescription>
                  {t('manage_automation_tools')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => router.push('/workflow-builder')}
                >
                  <Workflow className="h-4 w-4 mr-2" />
                  {t('workflow_builder_label')}
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => router.push('/ai-assistant')}
                >
                  <Brain className="h-4 w-4 mr-2" />
                  {t('ai_assistant_label')}
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => router.push('/analytics')}
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  {t('analytics_label')}
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => router.push('/integrations')}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  {t('integrations_label')}
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Brain className="h-5 w-5 mr-2 text-purple-500" />
                  {t('ai_assistant_title')}
                </CardTitle>
                <CardDescription>
                  {t('ai_assistant_subtitle')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <p className="text-sm text-purple-800">
                      💡 <strong>Sugerencia:</strong> Puedes optimizar tu workflow de email marketing para aumentar la conversión en un 23%.
                    </p>
                  </div>
                  <Button 
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                    onClick={() => router.push('/ai-assistant')}
                  >
                    <Brain className="h-4 w-4 mr-2" />
                    {t('open_ai_assistant')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Team Management Section */}
          <Card className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 backdrop-blur-sm border border-blue-500/20 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center text-blue-600">
                <UserPlus className="h-6 w-6 mr-2" />
                {t('team_management')}
              </CardTitle>
              <CardDescription className="text-blue-700">
                {t('manage_team_subtitle')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-1">8</div>
                  <div className="text-sm text-blue-700">{t('active_members')}</div>
                  <Badge className="mt-1 bg-blue-500 text-white">{t('company_label')}</Badge>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-1">3</div>
                  <div className="text-sm text-blue-700">{t('admins')}</div>
                  <div className="text-xs text-blue-600">{t('full_permissions')}</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-1">2</div>
                  <div className="text-sm text-blue-700">{t('pending_invites')}</div>
                </div>
              </div>
              <div className="mt-4 flex justify-center">
                <Button
                  onClick={() => router.push('/team')}
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  {t('manage_team')}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* API Documentation Section */}
          <Card className="bg-gradient-to-r from-green-500/10 to-teal-500/10 backdrop-blur-sm border border-green-500/20 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center text-green-600">
                <BookOpen className="h-6 w-6 mr-2" />
                {t('api_docs')}
              </CardTitle>
              <CardDescription className="text-green-700">
                {t('api_docs_subtitle')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-1">15+</div>
                  <div className="text-sm text-green-700">Endpoints</div>
                  <div className="text-xs text-green-600">REST API completa</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-1">3</div>
                  <div className="text-sm text-green-700">Lenguajes</div>
                  <div className="text-xs text-green-600">JS, Python, cURL</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-1">OpenAPI</div>
                  <div className="text-sm text-green-700">Especificación</div>
                  <div className="text-xs text-green-600">Swagger compatible</div>
                </div>
              </div>
              <div className="mt-4 flex justify-center space-x-3">
                <Button
                  onClick={() => router.push('/api-docs')}
                  className="bg-green-500 hover:bg-green-600 text-white"
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  {t('view_docs')}
                </Button>
                <Button
                  onClick={() => window.open('/api/docs', '_blank')}
                  variant="outline"
                  className="border-green-500 text-green-600 hover:bg-green-50"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  {t('swagger_ui')}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Webhooks Section */}
          <Card className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-sm border border-purple-500/20 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center text-purple-600">
                <Webhook className="h-6 w-6 mr-2" />
                {t('webhooks_system')}
              </CardTitle>
              <CardDescription className="text-purple-700">
                {t('webhooks_subtitle')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-1">3</div>
                  <div className="text-sm text-purple-700">{t('active_webhooks')}</div>
                  <div className="text-xs text-purple-600">Configurados</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-1">57</div>
                  <div className="text-sm text-purple-700">{t('events_sent')}</div>
                  <div className="text-xs text-purple-600">Esta semana</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-1">98%</div>
                  <div className="text-sm text-purple-700">{t('success_rate')}</div>
                  <div className="text-xs text-purple-600">Entregas exitosas</div>
                </div>
              </div>
              <div className="mt-4 flex justify-center">
                <Button
                  onClick={() => router.push('/webhooks')}
                  className="bg-purple-500 hover:bg-purple-600 text-white"
                >
                  <Webhook className="h-4 w-4 mr-2" />
                  {t('manage_webhooks')}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Backup & Restore Section */}
          <Card className="bg-gradient-to-r from-green-500/10 to-blue-500/10 backdrop-blur-sm border border-green-500/20 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center text-green-600">
                <Database className="h-6 w-6 mr-2" />
                {t('backup_restore')}
              </CardTitle>
              <CardDescription className="text-green-700">
                {t('backup_subtitle')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-1">12</div>
                  <div className="text-sm text-green-700">{t('total_backups')}</div>
                  <div className="text-xs text-green-600">Completados</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-1">2.4GB</div>
                  <div className="text-sm text-green-700">{t('backed_data')}</div>
                  <div className="text-xs text-green-600">Comprimidos</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-1">98%</div>
                  <div className="text-sm text-green-700">{t('success_rate')}</div>
                  <div className="text-xs text-green-600">{t('backups_success_rate')}</div>
                </div>
              </div>
              <div className="mt-4 flex justify-center">
                <Button
                  onClick={() => router.push('/backups')}
                  className="bg-green-500 hover:bg-green-600 text-white"
                >
                  <Database className="h-4 w-4 mr-2" />
                  {t('manage_backups')}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2 text-blue-500" />
                {t('recent_activity')}
              </CardTitle>
              <CardDescription>
                {t('latest_runs')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { action: 'Workflow "Email Marketing" ejecutado', time: 'Hace 5 minutos', status: 'success' },
                  { action: 'Nueva integración con Slack configurada', time: 'Hace 1 hora', status: 'success' },
                  { action: 'Workflow "Lead Scoring" actualizado', time: 'Hace 2 horas', status: 'info' },
                  { action: 'Backup de datos completado', time: 'Hace 3 horas', status: 'success' }
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div className={`h-2 w-2 rounded-full mr-3 ${
                        item.status === 'success' ? 'bg-green-500' : 
                        item.status === 'info' ? 'bg-blue-500' : 'bg-yellow-500'
                      }`}></div>
                      <span className="text-sm text-gray-700">{item.action}</span>
                    </div>
                    <span className="text-xs text-gray-500">{item.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Notification Center */}
      {notificationCenterOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setNotificationCenterOpen(false)}
          />
          <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl transform transition-transform duration-300 ease-in-out">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Bell className="w-6 h-6 text-gray-700" />
                    {unreadCount > 0 && (
                      <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs">
                        {unreadCount}
                      </Badge>
                    )}
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Notificaciones</h2>
                    <p className="text-sm text-gray-500">
                      {unreadCount} no leídas
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setNotificationCenterOpen(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6">
                <div className="space-y-4">
                  <div className="text-center text-gray-500">
                    <Bell className="w-12 h-12 mx-auto mb-2" />
                    <p className="text-sm">Centro de notificaciones</p>
                    <p className="text-xs">Las notificaciones aparecerán aquí</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Button
                      onClick={() => {
                        setNotificationCenterOpen(false)
                        router.push('/notifications')
                      }}
                      className="w-full"
                    >
                      Ver todas las notificaciones
                    </Button>
                    <Button
                      onClick={() => {
                        // Simular crear notificación de prueba
                        fetch('/api/notifications', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            action: 'test',
                            userId: 'user-1'
                          })
                        }).then(() => {
                          // Recargar contador
                          fetch(`/api/notifications?userId=user-1&type=unread-count`)
                            .then(res => res.json())
                            .then(data => {
                              if (data.success) {
                                setUnreadCount(data.data.unreadCount)
                              }
                            })
                        })
                      }}
                      variant="outline"
                      className="w-full"
                    >
                      Crear notificación de prueba
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}