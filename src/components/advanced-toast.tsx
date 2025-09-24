'use client'

import { useState, useEffect, createContext, useContext, ReactNode } from 'react'
import { X, CheckCircle, AlertCircle, Info, AlertTriangle, Sparkles, Zap, Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Toast {
  id: string
  type: 'success' | 'error' | 'warning' | 'info' | 'premium'
  title: string
  message?: string
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
  icon?: ReactNode
}

interface ToastContextType {
  toasts: Toast[]
  addToast: (toast: Omit<Toast, 'id'>) => void
  removeToast: (id: string) => void
  clearAll: () => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const TOAST_LIMIT = 3

  const addToast = (toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9)
    const newToast = { ...toast, id }
    
    // Evitar duplicados por mismo título+mensaje recientes
    setToasts(prev => {
      const deduped = prev.filter(t => !(t.title === newToast.title && t.message === newToast.message))
      const next = [...deduped, newToast]
      return next.slice(-TOAST_LIMIT)
    })

    // Auto remove after duration
    const duration = toast.duration || 5000
    setTimeout(() => {
      removeToast(id)
    }, duration)
  }

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }

  const clearAll = () => {
    setToasts([])
  }

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, clearAll }}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

function ToastContainer() {
  const { toasts, removeToast } = useToast()

  if (toasts.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {toasts.map(toast => (
        <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
      ))}
    </div>
  )
}

function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: (id: string) => void }) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Trigger entrance animation
    const timer = setTimeout(() => setIsVisible(true), 10)
    return () => clearTimeout(timer)
  }, [])

  const handleRemove = () => {
    setIsVisible(false)
    setTimeout(() => onRemove(toast.id), 300)
  }

  const getToastStyles = () => {
    const baseStyles = "relative p-4 rounded-xl shadow-lg border backdrop-blur-sm transition-all duration-300 transform"
    
    switch (toast.type) {
      case 'success':
        return `${baseStyles} bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 text-green-800`
      case 'error':
        return `${baseStyles} bg-gradient-to-r from-red-50 to-rose-50 border-red-200 text-red-800`
      case 'warning':
        return `${baseStyles} bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-200 text-yellow-800`
      case 'info':
        return `${baseStyles} bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200 text-blue-800`
      case 'premium':
        return `${baseStyles} bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200 text-purple-800`
      default:
        return `${baseStyles} bg-white border-gray-200 text-gray-800`
    }
  }

  const getIcon = () => {
    if (toast.icon) return toast.icon

    switch (toast.type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-600" />
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />
      case 'info':
        return <Info className="h-5 w-5 text-blue-600" />
      case 'premium':
        return <Sparkles className="h-5 w-5 text-purple-600" />
      default:
        return <Info className="h-5 w-5 text-gray-600" />
    }
  }

  return (
    <div 
      className={`${getToastStyles()} ${
        isVisible 
          ? 'translate-x-0 opacity-100 scale-100' 
          : 'translate-x-full opacity-0 scale-95'
      }`}
    >
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          {getIcon()}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-sm">{toast.title}</h4>
          {toast.message && (
            <p className="text-sm opacity-90 mt-1">{toast.message}</p>
          )}
          {toast.action && (
            <Button
              size="sm"
              variant="outline"
              onClick={toast.action.onClick}
              className="mt-2 h-7 text-xs"
            >
              {toast.action.label}
            </Button>
          )}
        </div>
        <Button
          size="sm"
          variant="ghost"
          onClick={handleRemove}
          className="flex-shrink-0 h-6 w-6 p-0 hover:bg-black/10"
        >
          <X className="h-3 w-3" />
        </Button>
      </div>
      
      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/10 rounded-b-xl overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 animate-pulse"
          style={{
            animation: 'toast-progress linear forwards',
            animationDuration: `${toast.duration || 5000}ms`
          }}
        />
      </div>
    </div>
  )
}

// CSS for progress bar animation (solo en cliente)
if (typeof document !== 'undefined') {
  const style = document.createElement('style')
  style.textContent = `
    @keyframes toast-progress {
      from { width: 100% }
      to { width: 0% }
    }
  `
  document.head.appendChild(style)
}
