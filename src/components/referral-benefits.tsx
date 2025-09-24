'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  Star, 
  CheckCircle, 
  Gift, 
  Users,
  Copy,
  Sparkles
} from 'lucide-react'
import { validateReferralCode, getReferralBenefits } from '@/lib/referral-codes'

interface ReferralBenefitsProps {
  onCodeValidated?: (tier: string, benefits: any) => void
}

export function ReferralBenefits({ onCodeValidated }: ReferralBenefitsProps) {
  const [code, setCode] = useState('')
  const [isValidating, setIsValidating] = useState(false)
  const [validationResult, setValidationResult] = useState<{
    isValid: boolean
    tier?: string
    benefits?: any
  } | null>(null)

  const handleValidateCode = async () => {
    if (!code.trim()) return
    
    setIsValidating(true)
    
    try {
      // Validación local primero
      const result = validateReferralCode(code)
      
      if (result.isValid) {
        const benefits = getReferralBenefits(result.tier || 'BASIC')
        setValidationResult({ ...result, benefits })
        onCodeValidated?.(result.tier || 'BASIC', benefits)
      } else {
        setValidationResult({ isValid: false })
      }
    } catch (error) {
      console.error('Error validating code:', error)
      setValidationResult({ isValid: false })
    } finally {
      setIsValidating(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    // Aquí podrías mostrar un toast de confirmación
  }

  const specialCodes = [
    { code: 'VIP-12345678', tier: 'VIP', description: 'Acceso VIP con máximo descuento' },
    { code: 'PREMIUM-87654321', tier: 'PREMIUM', description: 'Acceso Premium con descuento especial' },
    { code: 'EARLY-11111111', tier: 'EARLY', description: 'Acceso temprano con beneficios' },
    { code: 'BETA-99999999', tier: 'BETA', description: 'Acceso beta con descuento' }
  ]

  return (
    <div className="space-y-6">
      {/* Validar Código */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Gift className="h-5 w-5 mr-2 text-yellow-500" />
            ¿Tienes un Código de Referido?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2">
            <Input
              placeholder="Ingresa tu código de referido"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="flex-1"
            />
            <Button 
              onClick={handleValidateCode}
              disabled={isValidating || !code.trim()}
            >
              {isValidating ? 'Validando...' : 'Validar'}
            </Button>
          </div>
          
          {validationResult && (
            <div className={`mt-4 p-4 rounded-lg ${
              validationResult.isValid 
                ? 'bg-green-900/20 border border-green-500/20' 
                : 'bg-red-900/20 border border-red-500/20'
            }`}>
              {validationResult.isValid ? (
                <div>
                  <div className="flex items-center text-green-400 mb-2">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    ¡Código válido!
                  </div>
                  <div className="text-white">
                    <Badge className="mb-2">{validationResult.tier}</Badge>
                    <p className="font-semibold">
                      Descuento: {validationResult.benefits?.discount}
                    </p>
                    <ul className="text-sm text-gray-300 mt-2">
                      {validationResult.benefits?.benefits.map((benefit: string, index: number) => (
                        <li key={index} className="flex items-center">
                          <CheckCircle className="h-3 w-3 mr-2 text-green-400" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="text-red-400">
                  Código inválido. Por favor, verifica e inténtalo de nuevo.
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Códigos Especiales */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Star className="h-5 w-5 mr-2 text-yellow-500" />
            Códigos Especiales Disponibles
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {specialCodes.map((specialCode, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline">{specialCode.tier}</Badge>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard(specialCode.code)}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
                <p className="font-mono text-sm text-gray-600 mb-1">
                  {specialCode.code}
                </p>
                <p className="text-xs text-gray-500">
                  {specialCode.description}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Beneficios por Tier */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { tier: 'VIP', color: 'from-yellow-500 to-orange-500', icon: Star },
          { tier: 'PREMIUM', color: 'from-blue-500 to-purple-500', icon: Sparkles },
          { tier: 'BASIC', color: 'from-gray-500 to-gray-600', icon: Users }
        ].map((tierInfo, index) => {
          const benefits = getReferralBenefits(tierInfo.tier)
          const Icon = tierInfo.icon
          
          return (
            <Card key={index} className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
              <CardHeader className="text-center">
                <div className={`w-12 h-12 bg-gradient-to-r ${tierInfo.color} rounded-full flex items-center justify-center mx-auto mb-2`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-white">{tierInfo.tier}</CardTitle>
                <p className="text-2xl font-bold text-yellow-400">
                  {benefits.discount} Descuento
                </p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {benefits.benefits.map((benefit: string, benefitIndex: number) => (
                    <li key={benefitIndex} className="flex items-center text-sm text-gray-300">
                      <CheckCircle className="h-4 w-4 text-green-400 mr-2 flex-shrink-0" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
