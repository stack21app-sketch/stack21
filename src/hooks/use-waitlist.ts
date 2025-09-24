'use client'

import { useState } from 'react'
import { useToast } from '@/hooks/use-toast'

interface WaitlistData {
  email: string
  name?: string
  company?: string
  referralCode?: string
}

interface WaitlistResponse {
  success: boolean
  message: string
  data?: {
    id: string
    email: string
    tier: string
  }
  errors?: any[]
}

export function useWaitlist() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const { toast } = useToast()

  const submitToWaitlist = async (data: WaitlistData): Promise<WaitlistResponse | null> => {
    setIsSubmitting(true)
    
    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      
      const result: WaitlistResponse = await response.json()
      
      if (result.success) {
        setIsSubmitted(true)
        toast({
          title: "¡Bienvenido a la lista!",
          description: "Te notificaremos cuando Stack21 esté listo.",
          variant: "default"
        })
        return result
      } else {
        toast({
          title: "Error",
          description: result.message || "Hubo un problema al suscribirte",
          variant: "destructive"
        })
        return null
      }
    } catch (error) {
      console.error('Error submitting to waitlist:', error)
      toast({
        title: "Error de conexión",
        description: "No se pudo conectar con el servidor. Inténtalo de nuevo.",
        variant: "destructive"
      })
      return null
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setIsSubmitted(false)
    setIsSubmitting(false)
  }

  return {
    submitToWaitlist,
    isSubmitting,
    isSubmitted,
    resetForm
  }
}
