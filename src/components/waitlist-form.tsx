'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  CheckCircle, 
  ArrowRight, 
  Sparkles, 
  Users,
  TrendingUp,
  Star
} from 'lucide-react'
import { ReferralBenefits } from './referral-benefits'
import { useWaitlist } from '@/hooks/use-waitlist'

interface WaitlistFormProps {
  variant?: 'default' | 'compact' | 'hero'
  showSocialProof?: boolean
  className?: string
}

export function WaitlistForm({ 
  variant = 'default', 
  showSocialProof = true,
  className = ''
}: WaitlistFormProps) {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [company, setCompany] = useState('')
  const [referralCode, setReferralCode] = useState('')
  
  const { submitToWaitlist, isSubmitting, isSubmitted, resetForm } = useWaitlist()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const result = await submitToWaitlist({
      email,
      name: name || undefined,
      company: company || undefined,
      referralCode: referralCode || undefined
    })
    
    if (result) {
      // Reset form after successful submission
      setEmail('')
      setName('')
      setCompany('')
      setReferralCode('')
    }
  }

  if (isSubmitted) {
    return (
      <Card className={`max-w-md mx-auto bg-green-900/20 border-green-500/20 ${className}`}>
        <CardContent className="p-6 text-center">
          <div className="text-green-400 text-4xl mb-4">✅</div>
          <h3 className="text-xl font-bold text-white mb-2">
            ¡Te has unido a la revolución!
          </h3>
          <p className="text-gray-300 mb-4">
            Te notificaremos cuando Stack21 esté listo. 
            Mientras tanto, te enviaremos actualizaciones exclusivas.
          </p>
          {showSocialProof && (
            <div className="bg-white/10 rounded-lg p-4 mb-4">
              <h4 className="text-white font-semibold mb-2">¿Quieres acceso prioritario?</h4>
              <p className="text-sm text-gray-300 mb-3">
                Invita a 5 amigos y obtén acceso beta gratuito
              </p>
              <Button className="w-full bg-gradient-to-r from-yellow-400 to-pink-400 hover:from-yellow-500 hover:to-pink-500 text-black font-bold">
                <Users className="mr-2 h-4 w-4" />
                Compartir con Amigos
              </Button>
            </div>
          )}
          <p className="text-xs text-gray-400">
            Sin spam. Solo actualizaciones importantes sobre Stack21.
          </p>
        </CardContent>
      </Card>
    )
  }

  if (variant === 'compact') {
    return (
      <div className={`max-w-md mx-auto ${className}`}>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex space-x-2">
            <Input
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-white/20 border-white/30 text-white placeholder-gray-300"
              required
            />
            <Button 
              type="submit" 
              className="bg-gradient-to-r from-yellow-400 to-pink-400 hover:from-yellow-500 hover:to-pink-500 text-black font-bold"
              disabled={isSubmitting}
            >
              {isSubmitting ? '...' : 'Unirse'}
            </Button>
          </div>
        </form>
      </div>
    )
  }

  if (variant === 'hero') {
    return (
      <div className={`max-w-2xl mx-auto ${className}`}>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              type="text"
              placeholder="Tu nombre"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-white/20 border-white/30 text-white placeholder-gray-300"
              required
            />
            <Input
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white/20 border-white/30 text-white placeholder-gray-300"
              required
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              type="text"
              placeholder="Empresa (opcional)"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="bg-white/20 border-white/30 text-white placeholder-gray-300"
            />
            <Input
              type="text"
              placeholder="Código de referido (opcional)"
              value={referralCode}
              onChange={(e) => setReferralCode(e.target.value)}
              className="bg-white/20 border-white/30 text-white placeholder-gray-300"
            />
          </div>
          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-yellow-400 to-pink-400 hover:from-yellow-500 hover:to-pink-500 text-black font-bold py-4 text-lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>
                Uniéndose...
              </div>
            ) : (
              <div className="flex items-center">
                <Sparkles className="mr-2 h-5 w-5" />
                Unirse a la Lista de Espera
                <ArrowRight className="ml-2 h-5 w-5" />
              </div>
            )}
          </Button>
        </form>
        {showSocialProof && (
          <div className="mt-8 text-center">
            <p className="text-gray-400 mb-4">Ya se han unido a la revolución:</p>
            <div className="flex justify-center items-center space-x-8 flex-wrap gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">1,247</div>
                <div className="text-sm text-gray-400">Emails</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">89</div>
                <div className="text-sm text-gray-400">Países</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">$50K</div>
                <div className="text-sm text-gray-400">Pre-ventas</div>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  // Default variant
  return (
    <Card className={`max-w-lg mx-auto bg-white/10 backdrop-blur-sm border-white/20 ${className}`}>
      <CardContent className="p-8">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-pink-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Sparkles className="h-8 w-8 text-black" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Únete a la Lista de Espera
          </h2>
          <p className="text-gray-300">
            Sé el primero en conocer cuando Stack21 esté listo
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            placeholder="Tu nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-white/20 border-white/30 text-white placeholder-gray-300"
            required
          />
          <Input
            type="email"
            placeholder="tu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-white/20 border-white/30 text-white placeholder-gray-300"
            required
          />
          <Input
            type="text"
            placeholder="Empresa (opcional)"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="bg-white/20 border-white/30 text-white placeholder-gray-300"
          />
          <Input
            type="text"
            placeholder="Código de referido (opcional)"
            value={referralCode}
            onChange={(e) => setReferralCode(e.target.value)}
            className="bg-white/20 border-white/30 text-white placeholder-gray-300"
          />
          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-yellow-400 to-pink-400 hover:from-yellow-500 hover:to-pink-500 text-black font-bold py-3"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>
                Uniéndose...
              </div>
            ) : (
              <div className="flex items-center">
                Unirse a la Lista de Espera
                <ArrowRight className="ml-2 h-4 w-4" />
              </div>
            )}
          </Button>
        </form>
        
        {showSocialProof && (
          <div className="mt-6 pt-6 border-t border-white/20">
            <div className="flex justify-center items-center space-x-6">
              <div className="text-center">
                <div className="text-lg font-bold text-white">1,247</div>
                <div className="text-xs text-gray-400">Emails</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-white">89</div>
                <div className="text-xs text-gray-400">Países</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-white">$50K</div>
                <div className="text-xs text-gray-400">Pre-ventas</div>
              </div>
            </div>
          </div>
        )}
        
        <p className="text-xs text-gray-400 mt-4 text-center">
          Sin spam. Solo actualizaciones importantes sobre Stack21.
        </p>
      </CardContent>
    </Card>
  )
}
