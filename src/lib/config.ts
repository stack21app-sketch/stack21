// Configuración centralizada para producción
export const config = {
  // Base de datos
  database: {
    url: process.env.DATABASE_URL!,
    directUrl: process.env.DIRECT_URL!,
  },

  // Supabase
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
  },

  // NextAuth
  auth: {
    url: process.env.NEXTAUTH_URL!,
    secret: process.env.NEXTAUTH_SECRET!,
  },

  // OAuth Providers
  oauth: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    },
  },

  // Stripe
  stripe: {
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY!,
    secretKey: process.env.STRIPE_SECRET_KEY!,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,
  },

  // OpenAI
  openai: {
    apiKey: process.env.OPENAI_API_KEY!,
  },

  // Email
  email: {
    smtp: {
      host: process.env.SMTP_HOST!,
      port: parseInt(process.env.SMTP_PORT || '587'),
      user: process.env.SMTP_USER!,
      pass: process.env.SMTP_PASS!,
      from: process.env.SMTP_FROM || 'Stack21 <noreply@stack21.com>',
    },
  },

  // Aplicación
  app: {
    url: process.env.NEXT_PUBLIC_APP_URL!,
    env: process.env.NODE_ENV || 'development',
  },

  // Admin
  admin: {
    key: process.env.ADMIN_KEY!,
  },

  // Analytics
  analytics: {
    google: process.env.GOOGLE_ANALYTICS_ID,
    mixpanel: process.env.MIXPANEL_TOKEN,
  },

  // Seguridad
  security: {
    jwtSecret: process.env.JWT_SECRET!,
    encryptionKey: process.env.ENCRYPTION_KEY!,
  },

  // Rate Limiting
  rateLimit: {
    max: parseInt(process.env.RATE_LIMIT_MAX || '100'),
    window: parseInt(process.env.RATE_LIMIT_WINDOW || '900000'), // 15 minutos
  },

  // Logging
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    sentryDsn: process.env.SENTRY_DSN,
  },
}

// Validación de configuración requerida
export function validateConfig() {
  const required = [
    'DATABASE_URL',
    'NEXTAUTH_URL',
    'NEXTAUTH_SECRET',
    'ADMIN_KEY',
    'NEXT_PUBLIC_APP_URL',
  ]

  const missing = required.filter(key => !process.env[key])
  
  if (missing.length > 0) {
    throw new Error(`Variables de entorno faltantes: ${missing.join(', ')}`)
  }

  return true
}

// Configuración de producción
export function isProduction() {
  return process.env.NODE_ENV === 'production'
}

// Configuración de desarrollo
export function isDevelopment() {
  return process.env.NODE_ENV === 'development'
}
