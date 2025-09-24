'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { WorkspaceSelector } from '@/components/workspace-selector'
import { NotificationCenter } from '@/components/ui/notification-center'
import { ThemeSelector } from '@/components/theme-selector'
import { LanguageSelector } from '@/components/ui/language-selector'
import { useTranslation } from '@/hooks/useTranslation'
import { 
  LayoutDashboard, 
  Building2, 
  FolderOpen, 
  Workflow, 
  Settings, 
  LogOut,
  Menu,
  X,
  Users,
  CreditCard,
  Brain,
  Bell,
  Plug,
  BookOpen,
  HelpCircle,
  Shield,
  Webhook,
  BarChart3,
  ShoppingCart,
  Trophy,
  Database
} from 'lucide-react'
import { cn } from '@/lib/utils'

// Se mueve a dentro del componente para usar i18n

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const { t } = useTranslation('common')
  const [isOpen, setIsOpen] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const pathname = usePathname()
  
  const bottomNavigation = [
    {
      name: t('settings', 'Configuración'),
      href: '/dashboard/settings',
      icon: Settings,
    },
  ]

  const navigation = [
    {
      name: t('navigation.dashboard', 'Dashboard'),
      href: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      name: t('navigation.workspaces', 'Workspaces'),
      href: '/dashboard/workspaces',
      icon: Building2,
    },
    {
      name: t('navigation.projects', 'Proyectos'),
      href: '/dashboard/projects',
      icon: FolderOpen,
    },
    {
      name: t('navigation.workflows', 'Workflows'),
      href: '/dashboard/workflows',
      icon: Workflow,
    },
    {
      name: t('navigation.members', 'Miembros'),
      href: '/dashboard/members',
      icon: Users,
    },
    {
      name: t('navigation.analytics', 'Analytics'),
      href: '/dashboard/analytics',
      icon: BarChart3,
    },
    {
      name: t('navigation.aiAssistant', 'IA Assistant'),
      href: '/dashboard/ai',
      icon: Brain,
    },
    {
      name: t('navigation.aiAssistantByIndustry', 'Asistente IA por Industria'),
      href: '/dashboard/ai-assistant',
      icon: Brain,
      badge: t('badges.new', 'Nuevo'),
      exclusive: true,
    },
    {
      name: t('navigation.workflowBuilder', 'Constructor Workflows'),
      href: '/dashboard/workflow-builder',
      icon: Workflow,
      badge: t('badges.visual', 'Visual'),
      exclusive: true,
    },
    {
      name: t('navigation.workflowCopilot', 'Copilot de Workflows'),
      href: '/dashboard/workflow-copilot',
      icon: Brain,
      badge: t('badges.ai', 'IA'),
      exclusive: true,
    },
    {
      name: t('navigation.marketplace', 'Marketplace'),
      href: '/marketplace',
      icon: ShoppingCart,
      badge: t('badges.new', 'Nuevo'),
      exclusive: true,
    },
    {
      name: t('navigation.smartDashboard', 'Dashboard Inteligente'),
      href: '/dashboard/smart-dashboard',
      icon: Brain,
      badge: t('badges.ai', 'IA'),
      exclusive: true,
    },
    {
      name: t('navigation.gamification', 'Gamificación'),
      href: '/dashboard/gamification',
      icon: Trophy,
      badge: t('badges.new', 'Nuevo'),
      exclusive: true,
    },
    {
      name: t('navigation.businessIntelligence', 'Inteligencia de Negocio'),
      href: '/dashboard/business-intelligence',
      icon: BarChart3,
      badge: t('badges.ai', 'IA'),
      exclusive: true,
    },
    {
      name: t('navigation.integrations', 'Integraciones'),
      href: '/integrations',
      icon: Plug,
    },
    {
      name: t('navigation.documentation', 'Documentación'),
      href: '/dashboard/docs',
      icon: BookOpen,
    },
    {
      name: t('navigation.support', 'Soporte'),
      href: '/dashboard/support',
      icon: HelpCircle,
    },
    {
      name: t('navigation.audit', 'Auditoría'),
      href: '/dashboard/audit',
      icon: Shield,
    },
    {
      name: t('navigation.webhooks', 'Webhooks'),
      href: '/webhooks',
      icon: Webhook,
      badge: t('badges.new', 'Nuevo'),
    },
    {
      name: t('navigation.backups', 'Respaldo y Restauración'),
      href: '/backups',
      icon: Database,
      badge: t('badges.new', 'Nuevo'),
    },
    {
      name: t('navigation.billing', 'Facturación'),
      href: '/dashboard/billing',
      icon: CreditCard,
    },
    {
      name: t('navigation.pricing', 'Precios'),
      href: '/pricing',
      icon: CreditCard,
      badge: t('badges.transparent', 'Transparente'),
    },
    {
      name: t('navigation.whiteLabel', 'White-Label'),
      href: '/white-label',
      icon: Shield,
      badge: t('badges.enterprise', 'Enterprise'),
    },
  ]

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-40 w-64 sm:w-72 bg-white/80 backdrop-blur-xl border-r border-white/20 shadow-2xl transform transition-all duration-300 ease-in-out lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full",
        className
      )}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/20 bg-gradient-to-r from-white/50 to-blue-50/50">
            <div className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <div>
                <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">Stack21</span>
                <p className="text-xs text-gray-500">SaaS Platform</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <LanguageSelector />
              <NotificationCenter 
                isOpen={showNotifications} 
                onClose={() => setShowNotifications(false)} 
              />
            </div>
          </div>

          {/* Workspace Selector */}
          <div className="px-4 py-4 border-b border-white/20">
            <WorkspaceSelector />
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "group flex items-center px-3 py-3 text-sm font-medium rounded-xl transition-all duration-300 hover:scale-105",
                    isActive
                      ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-500/25"
                      : "text-gray-700 hover:bg-white/50 hover:text-gray-900 hover:shadow-md"
                  )}
                >
                  <div className={cn(
                    "p-1.5 rounded-lg mr-3 transition-all duration-300",
                    isActive 
                      ? "bg-white/20" 
                      : "group-hover:bg-blue-100 group-hover:scale-110"
                  )}>
                    <item.icon className={cn(
                      "h-4 w-4 transition-colors duration-300",
                      isActive ? "text-white" : "text-gray-600 group-hover:text-blue-600"
                    )} />
                  </div>
                  <span className="flex-1">{item.name}</span>
                  {item.badge && (
                    <Badge 
                      variant={item.exclusive ? "default" : "secondary"} 
                      className={cn(
                        "ml-2 text-xs transition-all duration-300",
                        isActive ? "bg-white/20 text-white" : ""
                      )}
                    >
                      {item.badge}
                    </Badge>
                  )}
                  {item.exclusive && (
                    <span className={cn(
                      "ml-1 text-xs transition-colors duration-300",
                      isActive ? "text-white" : "text-blue-600"
                    )}>✨</span>
                  )}
                </Link>
              )
            })}
          </nav>

          <Separator className="bg-white/20" />

          {/* Bottom navigation */}
          <div className="px-4 py-4 space-y-1">
            <div className="mb-3">
              <ThemeSelector />
            </div>
            
            <Button
              variant="ghost"
              className="group w-full justify-start text-gray-700 hover:bg-white/50 hover:text-gray-900 transition-all duration-300 hover:scale-105"
              onClick={() => setShowNotifications(true)}
            >
              <div className="p-1.5 rounded-lg mr-3 group-hover:bg-red-100 group-hover:scale-110 transition-all duration-300">
                <Bell className="h-4 w-4 text-gray-600 group-hover:text-red-600 transition-colors duration-300" />
              </div>
              {t('notifications', 'Notificaciones')}
              <Badge variant="destructive" className="ml-auto group-hover:scale-110 transition-transform duration-300">3</Badge>
            </Button>
            
            {bottomNavigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "group flex items-center px-3 py-3 text-sm font-medium rounded-xl transition-all duration-300 hover:scale-105",
                    isActive
                      ? "bg-gradient-to-r from-gray-500 to-gray-600 text-white shadow-lg"
                      : "text-gray-700 hover:bg-white/50 hover:text-gray-900 hover:shadow-md"
                  )}
                >
                  <div className={cn(
                    "p-1.5 rounded-lg mr-3 transition-all duration-300",
                    isActive 
                      ? "bg-white/20" 
                      : "group-hover:bg-gray-100 group-hover:scale-110"
                  )}>
                    <item.icon className={cn(
                      "h-4 w-4 transition-colors duration-300",
                      isActive ? "text-white" : "text-gray-600 group-hover:text-gray-700"
                    )} />
                  </div>
                  {item.name}
                </Link>
              )
            })}
            
            <Button
              variant="ghost"
              className="group w-full justify-start text-gray-700 hover:bg-red-50 hover:text-red-700 transition-all duration-300 hover:scale-105"
              onClick={() => window.location.href = '/api/auth/signout'}
            >
              <div className="p-1.5 rounded-lg mr-3 group-hover:bg-red-100 group-hover:scale-110 transition-all duration-300">
                <LogOut className="h-4 w-4 text-gray-600 group-hover:text-red-600 transition-colors duration-300" />
              </div>
              {t('logout', 'Cerrar Sesión')}
            </Button>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Notification Center */}
      <NotificationCenter 
        isOpen={showNotifications} 
        onClose={() => setShowNotifications(false)} 
      />
    </>
  )
}
