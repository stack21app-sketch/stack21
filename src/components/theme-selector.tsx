'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Palette, 
  Sun, 
  Moon, 
  Sparkles, 
  Droplets, 
  Leaf, 
  Zap,
  Check,
  ChevronDown
} from 'lucide-react'
import { useTheme } from '@/contexts/theme-context'

const themes = [
  {
    id: 'light',
    name: 'Claro',
    description: 'Tema claro y limpio',
    icon: Sun,
    gradient: 'from-yellow-400 to-orange-400',
    preview: 'bg-gradient-to-br from-gray-50 to-blue-50'
  },
  {
    id: 'dark',
    name: 'Oscuro',
    description: 'Tema oscuro elegante',
    icon: Moon,
    gradient: 'from-gray-700 to-gray-900',
    preview: 'bg-gradient-to-br from-gray-900 to-black'
  },
  {
    id: 'purple',
    name: 'Púrpura',
    description: 'Tema púrpura vibrante',
    icon: Sparkles,
    gradient: 'from-purple-500 to-pink-500',
    preview: 'bg-gradient-to-br from-purple-900 to-pink-900',
    exclusive: true
  },
  {
    id: 'blue',
    name: 'Azul',
    description: 'Tema azul profesional',
    icon: Droplets,
    gradient: 'from-blue-500 to-cyan-500',
    preview: 'bg-gradient-to-br from-blue-900 to-cyan-900'
  },
  {
    id: 'green',
    name: 'Verde',
    description: 'Tema verde natural',
    icon: Leaf,
    gradient: 'from-green-500 to-emerald-500',
    preview: 'bg-gradient-to-br from-green-900 to-emerald-900'
  },
  {
    id: 'orange',
    name: 'Naranja',
    description: 'Tema naranja energético',
    icon: Zap,
    gradient: 'from-orange-500 to-red-500',
    preview: 'bg-gradient-to-br from-orange-900 to-red-900'
  }
]

export function ThemeSelector() {
  const { theme, setTheme } = useTheme()
  const [isOpen, setIsOpen] = useState(false)

  const currentTheme = themes.find(t => t.id === theme)
  const IconComp = (currentTheme?.icon ?? Palette) as React.ComponentType<{ className?: string }>

  return (
    <div className="relative">
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="group flex items-center space-x-2 hover:bg-gray-50 transition-all duration-300"
      >
        <div className={`p-1.5 rounded-lg bg-gradient-to-r ${currentTheme?.gradient} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
          <IconComp className="h-4 w-4 text-white" />
        </div>
        <span className="text-sm font-medium">{currentTheme?.name}</span>
        <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </Button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-80 z-50">
          <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-xl">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2 mb-4">
                <Palette className="h-5 w-5 text-gray-600" />
                <h3 className="font-semibold text-gray-900">Seleccionar Tema</h3>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                {themes.map((themeOption) => {
                  const OptionIcon = themeOption.icon as React.ComponentType<{ className?: string }>
                  return (
                    <div
                      key={themeOption.id}
                      onClick={() => {
                        setTheme(themeOption.id as any)
                        setIsOpen(false)
                      }}
                      className={`group relative p-3 rounded-xl cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                        theme === themeOption.id 
                          ? 'ring-2 ring-blue-500 bg-blue-50' 
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${themeOption.gradient} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                          <OptionIcon className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <p className="font-medium text-sm text-gray-900 truncate">
                              {themeOption.name}
                            </p>
                            {themeOption.exclusive && (
                              <Badge variant="secondary" className="text-xs bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800">
                                <Sparkles className="w-3 h-3 mr-1" />
                                Pro
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 truncate">
                            {themeOption.description}
                          </p>
                        </div>
                        {theme === themeOption.id && (
                          <Check className="h-4 w-4 text-blue-600" />
                        )}
                      </div>
                      
                      {/* Preview */}
                      <div className={`mt-2 h-8 rounded-lg ${themeOption.preview} border border-gray-200`}></div>
                    </div>
                  )
                })}
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-500 text-center">
                  Los temas se aplican en tiempo real
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
