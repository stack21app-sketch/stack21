// Validador de configuración para Stack21 Waitlist

interface ConfigValidation {
  isValid: boolean
  errors: string[]
  warnings: string[]
  required: string[]
  optional: string[]
}

export function validateConfig(): ConfigValidation {
  const errors: string[] = []
  const warnings: string[] = []
  const required: string[] = []
  const optional: string[] = []

  // Variables requeridas
  const requiredVars = [
    'DATABASE_URL',
    'NEXTAUTH_SECRET',
    'ADMIN_KEY'
  ]

  // Variables opcionales
  const optionalVars = [
    'GOOGLE_CLIENT_ID',
    'GOOGLE_CLIENT_SECRET',
    'GITHUB_CLIENT_ID',
    'GITHUB_CLIENT_SECRET',
    'STRIPE_PUBLISHABLE_KEY',
    'STRIPE_SECRET_KEY',
    'OPENAI_API_KEY',
    'SMTP_HOST',
    'SMTP_USER',
    'SMTP_PASS'
  ]

  // Verificar variables requeridas
  requiredVars.forEach(varName => {
    const value = process.env[varName]
    if (!value || value.trim() === '') {
      errors.push(`❌ ${varName} es requerida pero no está configurada`)
    } else {
      required.push(`✅ ${varName} configurada`)
    }
  })

  // Verificar variables opcionales
  optionalVars.forEach(varName => {
    const value = process.env[varName]
    if (value && value.trim() !== '') {
      optional.push(`✅ ${varName} configurada`)
    } else {
      warnings.push(`⚠️  ${varName} no configurada (opcional)`)
    }
  })

  // Validaciones específicas
  validateDatabaseUrl(errors)
  validateSecrets(errors)
  validateAdminKey(errors)

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    required,
    optional
  }
}

function validateDatabaseUrl(errors: string[]) {
  const dbUrl = process.env.DATABASE_URL
  if (dbUrl) {
    if (!dbUrl.startsWith('postgresql://')) {
      errors.push('❌ DATABASE_URL debe ser una URL de PostgreSQL válida')
    }
    
    if (dbUrl.includes('username:password')) {
      errors.push('❌ DATABASE_URL contiene valores de ejemplo. Configura credenciales reales')
    }
  }
}

function validateSecrets(errors: string[]) {
  const nextAuthSecret = process.env.NEXTAUTH_SECRET
  if (nextAuthSecret && nextAuthSecret.length < 32) {
    errors.push('❌ NEXTAUTH_SECRET debe tener al menos 32 caracteres')
  }
}

function validateAdminKey(errors: string[]) {
  const adminKey = process.env.ADMIN_KEY
  if (adminKey && adminKey.length < 16) {
    errors.push('❌ ADMIN_KEY debe tener al menos 16 caracteres')
  }
}

export function getConfigStatus(): string {
  const config = validateConfig()
  
  let status = '🔧 Estado de Configuración:\n\n'
  
  if (config.required.length > 0) {
    status += '✅ Variables Requeridas:\n'
    config.required.forEach(item => status += `   ${item}\n`)
    status += '\n'
  }
  
  if (config.optional.length > 0) {
    status += '✅ Variables Opcionales Configuradas:\n'
    config.optional.forEach(item => status += `   ${item}\n`)
    status += '\n'
  }
  
  if (config.warnings.length > 0) {
    status += '⚠️  Advertencias:\n'
    config.warnings.forEach(item => status += `   ${item}\n`)
    status += '\n'
  }
  
  if (config.errors.length > 0) {
    status += '❌ Errores:\n'
    config.errors.forEach(item => status += `   ${item}\n`)
    status += '\n'
  }
  
  if (config.isValid) {
    status += '🎉 ¡Configuración válida! El sistema está listo para funcionar.'
  } else {
    status += '⚠️  Configuración incompleta. Corrige los errores antes de continuar.'
  }
  
  return status
}

export function checkDatabaseConnection(): Promise<boolean> {
  return new Promise(async (resolve) => {
    try {
      // Importar Prisma de forma estática para evitar errores de webpack
      const { PrismaClient } = require('@prisma/client')
      const prisma = new PrismaClient()
      await prisma.$queryRaw`SELECT 1`
      await prisma.$disconnect()
      resolve(true)
    } catch (error) {
      console.error('Error conectando a la base de datos:', error)
      resolve(false)
    }
  })
}

export async function getSystemStatus() {
  const config = validateConfig()
  const dbConnected = await checkDatabaseConnection()
  
  return {
    config: config.isValid,
    database: dbConnected,
    ready: config.isValid && dbConnected,
    details: {
      configErrors: config.errors,
      configWarnings: config.warnings,
      databaseError: dbConnected ? null : 'No se pudo conectar a la base de datos'
    }
  }
}
