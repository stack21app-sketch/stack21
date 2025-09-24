// Utilidades para códigos de referido

export function generateReferralCode(prefix?: string): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  const codeLength = 8
  
  let code = prefix ? prefix.toUpperCase() + '-' : ''
  
  for (let i = 0; i < codeLength; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  
  return code
}

export function generateSpecialCodes() {
  return {
    vip: generateReferralCode('VIP'),
    premium: generateReferralCode('PREMIUM'),
    early: generateReferralCode('EARLY'),
    beta: generateReferralCode('BETA')
  }
}

export function validateReferralCode(code: string): { isValid: boolean; tier?: string } {
  const upperCode = code.toUpperCase()
  
  // Códigos especiales
  if (upperCode.startsWith('VIP-')) {
    return { isValid: true, tier: 'VIP' }
  }
  
  if (upperCode.startsWith('PREMIUM-')) {
    return { isValid: true, tier: 'PREMIUM' }
  }
  
  if (upperCode.startsWith('EARLY-')) {
    return { isValid: true, tier: 'BASIC' }
  }
  
  if (upperCode.startsWith('BETA-')) {
    return { isValid: true, tier: 'BASIC' }
  }
  
  // Códigos normales (8 caracteres alfanuméricos)
  if (/^[A-Z0-9]{8}$/.test(upperCode)) {
    return { isValid: true, tier: 'BASIC' }
  }
  
  return { isValid: false }
}

export function getReferralBenefits(tier: string) {
  switch (tier) {
    case 'VIP':
      return {
        discount: '50%',
        benefits: [
          'Acceso beta gratuito',
          '6 meses gratis',
          'Consultoría personalizada',
          'Módulos premium incluidos'
        ]
      }
    case 'PREMIUM':
      return {
        discount: '40%',
        benefits: [
          'Acceso beta gratuito',
          '3 meses gratis',
          'Módulos premium incluidos'
        ]
      }
    case 'BASIC':
      return {
        discount: '20%',
        benefits: [
          'Acceso beta gratuito',
          '1 mes gratis'
        ]
      }
    default:
      return {
        discount: '10%',
        benefits: [
          'Acceso beta gratuito'
        ]
      }
  }
}
