'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark' | 'purple' | 'blue' | 'green' | 'orange'

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  isDark: boolean
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light')
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    // Cargar tema guardado del localStorage
    const savedTheme = localStorage.getItem('theme') as Theme
    if (savedTheme) {
      setTheme(savedTheme)
    }
  }, [])

  useEffect(() => {
    // Aplicar tema al documento
    const root = document.documentElement
    // Preservar clases existentes (p.ej., fuentes de Next) y solo alternar clases de tema
    const themeClasses = Array.from(root.classList).filter(cls => cls.startsWith('theme-'))
    themeClasses.forEach(cls => root.classList.remove(cls))
    root.classList.add(`theme-${theme}`)
    
    // Determinar si es modo oscuro
    setIsDark(theme === 'dark')
    
    // Guardar en localStorage
    localStorage.setItem('theme', theme)
  }, [theme])

  return (
    <ThemeContext.Provider value={{ theme, setTheme, isDark }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
