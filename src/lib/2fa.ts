import { authenticator } from 'otplib'
import QRCode from 'qrcode'
import { prisma } from '@/lib/prisma'

// Configure OTP settings
authenticator.options = {
  window: 2, // Allow 2 time steps (60 seconds) of tolerance
  step: 30,  // 30 second time steps
}

export interface TwoFactorSetup {
  secret: string
  qrCodeUrl: string
  backupCodes: string[]
}

export interface TwoFactorVerification {
  isValid: boolean
  backupCodeUsed?: boolean
}

/**
 * Generate a new 2FA secret for a user
 */
export async function generateTwoFactorSecret(userId: string, userEmail: string): Promise<TwoFactorSetup> {
  // Generate secret
  const secret = authenticator.generateSecret()
  
  // Generate service name (your app name)
  const serviceName = process.env.NEXTAUTH_URL ? 
    new URL(process.env.NEXTAUTH_URL).hostname : 
    'SaaS Starter'
  
  // Create OTP URL
  const otpUrl = authenticator.keyuri(userEmail, serviceName, secret)
  
  // Generate QR code
  const qrCodeUrl = await QRCode.toDataURL(otpUrl)
  
  // Generate backup codes
  const backupCodes = generateBackupCodes()
  
  // Store secret and backup codes in database
  await prisma.user.update({
    where: { id: userId },
    data: {
      twoFactorSecret: secret,
      twoFactorBackupCodes: backupCodes,
      twoFactorEnabled: false, // Will be enabled after verification
    },
  })
  
  return {
    secret,
    qrCodeUrl,
    backupCodes,
  }
}

/**
 * Verify a 2FA token
 */
export async function verifyTwoFactorToken(
  userId: string, 
  token: string
): Promise<TwoFactorVerification> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { 
      twoFactorSecret: true, 
      twoFactorBackupCodes: true,
      twoFactorEnabled: true 
    },
  })
  
  if (!user || !user.twoFactorSecret) {
    return { isValid: false }
  }
  
  // Check if 2FA is enabled
  if (!user.twoFactorEnabled) {
    return { isValid: false }
  }
  
  // Verify TOTP token
  const isValidToken = authenticator.verify({
    token,
    secret: user.twoFactorSecret,
  })
  
  if (isValidToken) {
    return { isValid: true }
  }
  
  // Check backup codes if TOTP failed
  const backupCodes = user.twoFactorBackupCodes as string[]
  const backupCodeIndex = backupCodes.findIndex(code => code === token)
  
  if (backupCodeIndex !== -1) {
    // Remove used backup code
    const updatedBackupCodes = backupCodes.filter((_, index) => index !== backupCodeIndex)
    
    await prisma.user.update({
      where: { id: userId },
      data: { twoFactorBackupCodes: updatedBackupCodes },
    })
    
    return { isValid: true, backupCodeUsed: true }
  }
  
  return { isValid: false }
}

/**
 * Enable 2FA after initial verification
 */
export async function enableTwoFactor(userId: string, token: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { twoFactorSecret: true },
  })
  
  if (!user || !user.twoFactorSecret) {
    return false
  }
  
  // Verify the token before enabling
  const isValid = authenticator.verify({
    token,
    secret: user.twoFactorSecret,
  })
  
  if (isValid) {
    await prisma.user.update({
      where: { id: userId },
      data: { twoFactorEnabled: true },
    })
    return true
  }
  
  return false
}

/**
 * Disable 2FA
 */
export async function disableTwoFactor(userId: string): Promise<void> {
  await prisma.user.update({
    where: { id: userId },
    data: {
      twoFactorEnabled: false,
      twoFactorSecret: null,
      twoFactorBackupCodes: [],
    },
  })
}

/**
 * Generate new backup codes
 */
export async function regenerateBackupCodes(userId: string): Promise<string[]> {
  const backupCodes = generateBackupCodes()
  
  await prisma.user.update({
    where: { id: userId },
    data: { twoFactorBackupCodes: backupCodes },
  })
  
  return backupCodes
}

/**
 * Check if user has 2FA enabled
 */
export async function isTwoFactorEnabled(userId: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { twoFactorEnabled: true },
  })
  
  return user?.twoFactorEnabled || false
}

/**
 * Generate backup codes
 */
function generateBackupCodes(): string[] {
  const codes: string[] = []
  
  for (let i = 0; i < 10; i++) {
    // Generate 8-character alphanumeric codes
    const code = Math.random().toString(36).substring(2, 10).toUpperCase()
    codes.push(code)
  }
  
  return codes
}

/**
 * Validate backup code format
 */
export function isValidBackupCode(code: string): boolean {
  return /^[A-Z0-9]{8}$/.test(code)
}

/**
 * Get remaining backup codes count
 */
export async function getRemainingBackupCodes(userId: string): Promise<number> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { twoFactorBackupCodes: true },
  })
  
  if (!user || !user.twoFactorBackupCodes) {
    return 0
  }
  
  return (user.twoFactorBackupCodes as string[]).length
}
