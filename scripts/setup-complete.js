#!/usr/bin/env node

/**
 * Script completo de setup para Stack21
 * Configura todo lo necesario para el SaaS
 */

const fs = require('fs')
const path = require('path')

console.log('🚀 Configurando Stack21 SaaS completo...\n')

// 1. Verificar variables de entorno
console.log('📋 Verificando variables de entorno...')

const envPath = path.join(process.cwd(), '.env.local')
const envExample = `
# Stack21 SaaS Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="stack21-super-secret-key-development-2024"

# Supabase (Reemplaza con tus credenciales reales)
NEXT_PUBLIC_SUPABASE_URL="https://tu-proyecto.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="tu-anon-key-aqui"

# Google Analytics (Reemplaza con tu Measurement ID real)
NEXT_PUBLIC_GA_MEASUREMENT_ID="G-XXXXXXXXXX"

# Hotjar (Reemplaza con tu Site ID real)
NEXT_PUBLIC_HOTJAR_ID="1234567"

# OpenAI (Para características de IA)
OPENAI_API_KEY="tu-openai-key-aqui"

# Stripe (Para pagos)
STRIPE_SECRET_KEY="sk_test_tu-stripe-key-aqui"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_tu-stripe-key-aqui"

# Email (Para notificaciones)
SENDGRID_API_KEY="tu-sendgrid-key-aqui"
FROM_EMAIL="noreply@stack21app.com"
`

if (!fs.existsSync(envPath)) {
  fs.writeFileSync(envPath, envExample)
  console.log('✅ Archivo .env.local creado con variables de ejemplo')
} else {
  console.log('⚠️  Archivo .env.local ya existe. Verifica las variables.')
}

// 2. Crear estructura de directorios
console.log('\n📁 Creando estructura de directorios...')

const directories = [
  'src/lib/database',
  'src/lib/payments',
  'src/lib/email',
  'src/lib/ai',
  'src/lib/integrations',
  'public/images',
  'public/icons',
  'docs'
]

directories.forEach(dir => {
  const fullPath = path.join(process.cwd(), dir)
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true })
    console.log(`✅ Directorio creado: ${dir}`)
  }
})

// 3. Crear archivos de configuración
console.log('\n⚙️  Creando archivos de configuración...')

// Configuración de Stripe
const stripeConfig = `
import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
})

export const STRIPE_CONFIG = {
  success_url: \`\${process.env.NEXTAUTH_URL}/dashboard/billing/success\`,
  cancel_url: \`\${process.env.NEXTAUTH_URL}/dashboard/billing\`,
  webhook_secret: process.env.STRIPE_WEBHOOK_SECRET!,
}

export const PRICING_PLANS = {
  free: {
    name: 'Gratis',
    price: 0,
    features: ['5 workflows', '100 emails/mes', 'Soporte básico'],
    limits: {
      workflows: 5,
      emails: 100,
      apiCalls: 1000
    }
  },
  pro: {
    name: 'Pro',
    price: 29,
    features: ['Workflows ilimitados', '1000 emails/mes', 'Soporte prioritario', 'IA avanzada'],
    limits: {
      workflows: -1, // ilimitado
      emails: 1000,
      apiCalls: 10000
    }
  },
  enterprise: {
    name: 'Empresarial',
    price: 99,
    features: ['Todo de Pro', 'API personalizada', 'Soporte 24/7', 'SSO', 'Integraciones personalizadas'],
    limits: {
      workflows: -1,
      emails: 10000,
      apiCalls: 100000
    }
  }
}
`

fs.writeFileSync(path.join(process.cwd(), 'src/lib/payments/stripe-config.ts'), stripeConfig)
console.log('✅ Configuración de Stripe creada')

// Configuración de email
const emailConfig = `
import sgMail from '@sendgrid/mail'

sgMail.setApiKey(process.env.SENDGRID_API_KEY!)

export interface EmailTemplate {
  to: string
  subject: string
  html: string
  text?: string
}

export async function sendEmail(template: EmailTemplate) {
  try {
    const msg = {
      to: template.to,
      from: process.env.FROM_EMAIL!,
      subject: template.subject,
      html: template.html,
      text: template.text,
    }

    await sgMail.send(msg)
    return { success: true }
  } catch (error) {
    console.error('Error sending email:', error)
    return { success: false, error: error.message }
  }
}

export const EMAIL_TEMPLATES = {
  welcome: (email: string, name?: string) => ({
    to: email,
    subject: '¡Bienvenido a Stack21! 🚀',
    html: \`
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2563eb;">¡Hola \${name || 'Usuario'}!</h1>
        <p>Gracias por unirte a Stack21. Estamos trabajando duro para traerte la mejor plataforma de automatización.</p>
        <p>Te notificaremos tan pronto como esté listo.</p>
        <p>Saludos,<br>El equipo de Stack21</p>
      </div>
    \`
  }),
  
  launch: (email: string, name?: string) => ({
    to: email,
    subject: '🎉 ¡Stack21 ya está disponible!',
    html: \`
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2563eb;">¡Es oficial!</h1>
        <p>Stack21 ya está disponible. Accede a tu cuenta y comienza a automatizar tu negocio.</p>
        <a href="\${process.env.NEXTAUTH_URL}/dashboard" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Acceder ahora</a>
      </div>
    \`
  })
}
`

fs.writeFileSync(path.join(process.cwd(), 'src/lib/email/email-service.ts'), emailConfig)
console.log('✅ Configuración de email creada')

// 4. Crear documentación
console.log('\n📚 Creando documentación...')

const readme = `
# Stack21 - SaaS de Automatización

## 🚀 Características

- ✅ Página Coming Soon profesional
- ✅ Sistema de captura de emails
- ✅ Analytics (Google Analytics + Hotjar)
- ✅ Base de datos con Supabase
- ✅ Sistema de pagos con Stripe
- ✅ Notificaciones por email
- ✅ IA integrada
- ✅ Motor de workflows
- ✅ Integraciones con APIs populares

## 📋 Setup Rápido

1. **Configurar variables de entorno:**
   \`\`\`bash
   cp .env.local.example .env.local
   # Edita .env.local con tus credenciales reales
   \`\`\`

2. **Instalar dependencias:**
   \`\`\`bash
   npm install
   \`\`\`

3. **Configurar base de datos:**
   \`\`\`bash
   npm run db:setup
   \`\`\`

4. **Ejecutar en desarrollo:**
   \`\`\`bash
   npm run dev
   \`\`\`

## 🌐 URLs Importantes

- **Desarrollo:** http://localhost:3000
- **Producción:** https://stack21app.com
- **Dashboard:** https://stack21app.com/dashboard
- **API:** https://stack21app.com/api

## 📊 Analytics

- **Google Analytics:** Configurado para tracking de eventos
- **Hotjar:** Configurado para heatmaps y grabaciones

## 💳 Pagos

- **Stripe:** Configurado para suscripciones
- **Planes:** Gratis, Pro ($29/mes), Empresarial ($99/mes)

## 🔧 Comandos Útiles

\`\`\`bash
# Desarrollo
npm run dev

# Build
npm run build

# Deploy
npm run deploy

# Base de datos
npm run db:push
npm run db:seed

# Testing
npm run test
\`\`\`

## 📞 Soporte

Para soporte técnico, contacta a: support@stack21app.com
`

fs.writeFileSync(path.join(process.cwd(), 'README.md'), readme)
console.log('✅ README.md creado')

// 5. Crear package.json scripts adicionales
console.log('\n📦 Agregando scripts al package.json...')

const packagePath = path.join(process.cwd(), 'package.json')
const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'))

packageJson.scripts = {
  ...packageJson.scripts,
  'setup:complete': 'node scripts/setup-complete.js',
  'setup:analytics': 'node scripts/setup-analytics.js',
  'setup:database': 'node scripts/setup-database.js',
  'setup:payments': 'node scripts/setup-payments.js',
  'setup:email': 'node scripts/setup-email.js',
  'deploy:complete': 'npm run build && vercel --prod',
  'test:all': 'npm run test && npm run test:e2e',
  'db:reset': 'prisma db push --force-reset && npm run db:seed',
  'db:backup': 'node scripts/backup-database.js',
  'db:restore': 'node scripts/restore-database.js'
}

fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2))
console.log('✅ Scripts agregados al package.json')

// 6. Resumen final
console.log('\n🎉 ¡Setup completo finalizado!')
console.log('\n📋 Próximos pasos:')
console.log('1. Configura tus variables de entorno en .env.local')
console.log('2. Ejecuta: npm run dev')
console.log('3. Visita: http://localhost:3000')
console.log('4. Configura Analytics reales (Google Analytics + Hotjar)')
console.log('5. Configura Stripe para pagos')
console.log('6. Configura SendGrid para emails')
console.log('7. Haz deploy: npm run deploy:complete')

console.log('\n🔗 Enlaces útiles:')
console.log('- Google Analytics: https://analytics.google.com')
console.log('- Hotjar: https://www.hotjar.com')
console.log('- Stripe: https://stripe.com')
console.log('- SendGrid: https://sendgrid.com')
console.log('- Supabase: https://supabase.com')

console.log('\n✨ ¡Tu SaaS Stack21 está listo para conquistar el mundo! 🚀')
