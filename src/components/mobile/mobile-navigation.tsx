'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Home, 
  Workflow, 
  Brain, 
  BarChart3, 
  Puzzle, 
  Store, 
  LayoutDashboard, 
  UserPlus, 
  Gamepad2, 
  Webhook, 
  BookOpen, 
  CreditCard, 
  Settings, 
  Menu, 
  X, 
  Bell,
  Search,
  Plus
} from 'lucide-react'

interface MobileNavigationProps {
  currentPath: string
  onNavigate: (path: string) => void
  unreadCount?: number
}

const menuItems = [
  { name: 'Dashboard', icon: Home, href: '/dashboard', active: true },
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
  { name: 'Settings', icon: Settings, href: '/dashboard/settings' },
]

export default function MobileNavigation({ currentPath, onNavigate, unreadCount = 0 }: MobileNavigationProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const filteredItems = menuItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleNavigate = (href: string) => {
    onNavigate(href)
    setIsOpen(false)
  }

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center justify-between h-16 px-4">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(true)}
              className="p-2"
            >
              <Menu className="h-5 w-5" />
            </Button>
            
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <LayoutDashboard className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold text-gray-900">Stack21</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {/* Handle search */}}
              className="p-2"
            >
              <Search className="h-5 w-5" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {/* Handle notifications */}}
              className="p-2 relative"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs h-5 w-5 flex items-center justify-center p-0">
                  {unreadCount}
                </Badge>
              )}
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {/* Handle add */}}
              className="p-2"
            >
              <Plus className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50 overflow-hidden">
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          
          <div className="absolute left-0 top-0 h-full w-80 max-w-[85vw] bg-white shadow-xl transform transition-transform duration-300 ease-in-out">
            <div className="flex flex-col h-full">
              {/* Sidebar Header */}
              <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
                <div className="flex items-center space-x-2">
                  <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                    <LayoutDashboard className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-lg font-bold text-gray-900">Stack21</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="p-2"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Search */}
              <div className="p-4 border-b border-gray-200">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Navigation Menu */}
              <div className="flex-1 overflow-y-auto">
                <nav className="p-4 space-y-1">
                  {filteredItems.map((item) => {
                    const Icon = item.icon
                    const isActive = currentPath === item.href
                    
                    return (
                      <button
                        key={item.name}
                        onClick={() => handleNavigate(item.href)}
                        className={`w-full flex items-center px-3 py-3 text-left rounded-lg transition-colors ${
                          isActive
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <Icon className="h-5 w-5 mr-3 flex-shrink-0" />
                        <span className="font-medium">{item.name}</span>
                        {item.name === 'Notifications' && unreadCount > 0 && (
                          <Badge className="ml-auto bg-red-500 text-white text-xs">
                            {unreadCount}
                          </Badge>
                        )}
                      </button>
                    )
                  })}
                </nav>
              </div>

              {/* User Section */}
              <div className="p-4 border-t border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <UserPlus className="h-5 w-5 text-gray-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">Usuario</p>
                    <p className="text-xs text-gray-500 truncate">usuario@ejemplo.com</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {/* Handle logout */}}
                    className="text-red-600 hover:text-red-700"
                  >
                    Salir
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation (for mobile) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 shadow-lg">
        <div className="flex items-center justify-around h-16">
          {[
            { name: 'Dashboard', icon: Home, href: '/dashboard' },
            { name: 'Workflows', icon: Workflow, href: '/workflow-builder' },
            { name: 'AI', icon: Brain, href: '/ai-assistant' },
            { name: 'Analytics', icon: BarChart3, href: '/analytics' },
            { name: 'Team', icon: UserPlus, href: '/team' }
          ].map((item) => {
            const Icon = item.icon
            const isActive = currentPath === item.href
            
            return (
              <button
                key={item.name}
                onClick={() => handleNavigate(item.href)}
                className={`flex flex-col items-center justify-center p-2 rounded-lg transition-colors ${
                  isActive
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon className="h-5 w-5 mb-1" />
                <span className="text-xs font-medium">{item.name}</span>
              </button>
            )
          })}
        </div>
      </div>
    </>
  )
}
