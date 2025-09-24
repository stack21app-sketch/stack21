#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

console.log('🚀 Configurando Stack21 para Producción...\n')

// Función para ejecutar comandos
function runCommand(command, description) {
  console.log(`📋 ${description}...`)
  try {
    execSync(command, { stdio: 'inherit' })
    console.log(`✅ ${description} completado\n`)
  } catch (error) {
    console.error(`❌ Error en ${description}:`, error.message)
    process.exit(1)
  }
}

// Función para verificar archivos
function checkFile(filePath, description) {
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${description} encontrado`)
    return true
  } else {
    console.log(`❌ ${description} no encontrado`)
    return false
  }
}

// Función para crear archivo de configuración
function createConfigFile() {
  const configContent = `# ===========================================
# CONFIGURACIÓN DE PRODUCCIÓN - STACK21
# ===========================================

# IMPORTANTE: Reemplaza todos los valores con tus datos reales

# Base de datos Supabase (REAL)
DATABASE_URL="postgresql://postgres.ctdjuuugrehosaypluit:TU_PASSWORD@aws-1-eu-north-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.ctdjuuugrehosaypluit:TU_PASSWORD@aws-1-eu-north-1.pooler.supabase.com:5432/postgres"

# Supabase (REAL)
NEXT_PUBLIC_SUPABASE_URL="https://ctdjuuugrehosaypluit.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="TU_CLAVE_ANONIMA_REAL"
SUPABASE_SERVICE_ROLE_KEY="TU_CLAVE_SERVICE_ROLE_REAL"

# NextAuth (PRODUCCIÓN)
NEXTAUTH_URL="https://tu-dominio.com"
NEXTAUTH_SECRET="genera-una-clave-super-segura-de-32-caracteres"

# OAuth Providers (REALES)
GOOGLE_CLIENT_ID="tu-google-client-id-real"
GOOGLE_CLIENT_SECRET="tu-google-client-secret-real"
GITHUB_CLIENT_ID="tu-github-client-id-real"
GITHUB_CLIENT_SECRET="tu-github-client-secret-real"

# Stripe (PRODUCCIÓN)
STRIPE_PUBLISHABLE_KEY="pk_live_tu_clave_publica_real"
STRIPE_SECRET_KEY="sk_live_tu_clave_secreta_real"
STRIPE_WEBHOOK_SECRET="whsec_tu_webhook_secret_real"

# OpenAI (REAL)
OPENAI_API_KEY="sk-tu_clave_openai_real"

# Email SMTP (REAL)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="tu-email@gmail.com"
SMTP_PASS="tu-app-password"
SMTP_FROM="Stack21 <noreply@tu-dominio.com>"

# Aplicación (PRODUCCIÓN)
NEXT_PUBLIC_APP_URL="https://tu-dominio.com"
NODE_ENV="production"

# Admin (PRODUCCIÓN)
ADMIN_KEY="genera-una-clave-admin-super-segura"

# Analytics (REALES)
GOOGLE_ANALYTICS_ID="G-XXXXXXXXXX"
MIXPANEL_TOKEN="tu_mixpanel_token_real"

# Seguridad
JWT_SECRET="genera-una-clave-jwt-super-segura"
ENCRYPTION_KEY="genera-una-clave-de-32-caracteres"

# Rate Limiting
RATE_LIMIT_MAX="100"
RATE_LIMIT_WINDOW="900000"

# Logging
LOG_LEVEL="info"
SENTRY_DSN="tu_sentry_dsn_real"
`

  fs.writeFileSync('.env.production', configContent)
  console.log('✅ Archivo .env.production creado')
}

// Función para generar claves seguras
function generateSecureKey(length = 32) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

// Función para mostrar instrucciones
function showInstructions() {
  console.log(`
🎯 INSTRUCCIONES PARA CONFIGURAR PRODUCCIÓN:

1. 📧 CONFIGURAR EMAIL SMTP:
   - Gmail: Activa "App Passwords" en tu cuenta
   - O usa SendGrid, Mailgun, o AWS SES

2. 🔐 CONFIGURAR OAUTH:
   - Google Cloud Console: Crea proyecto y OAuth 2.0
   - GitHub: Settings > Developer settings > OAuth Apps

3. 💳 CONFIGURAR STRIPE:
   - Crea cuenta en Stripe
   - Obtén claves de producción (pk_live_... y sk_live_...)
   - Configura webhooks

4. 🤖 CONFIGURAR OPENAI:
   - Crea cuenta en OpenAI
   - Obtén API key

5. 📊 CONFIGURAR ANALYTICS:
   - Google Analytics 4
   - Mixpanel (opcional)

6. 🚀 CONFIGURAR DOMINIO:
   - Compra dominio
   - Configura DNS
   - Configura SSL

7. 🔒 CONFIGURAR SEGURIDAD:
   - Genera claves seguras para NEXTAUTH_SECRET
   - Configura ADMIN_KEY
   - Configura JWT_SECRET

8. 📝 CONFIGURAR SUPABASE:
   - Obtén claves reales de tu proyecto
   - Configura RLS (Row Level Security)
   - Configura políticas de seguridad

CLAVES GENERADAS:
- NEXTAUTH_SECRET: ${generateSecureKey(32)}
- ADMIN_KEY: ${generateSecureKey(32)}
- JWT_SECRET: ${generateSecureKey(32)}
- ENCRYPTION_KEY: ${generateSecureKey(32)}

¡IMPORTANTE! Guarda estas claves en un lugar seguro.
`)
}

// Función principal
async function main() {
  console.log('🔍 Verificando archivos necesarios...\n')
  
  // Verificar archivos necesarios
  const requiredFiles = [
    ['package.json', 'Package.json'],
    ['prisma/schema.prisma', 'Schema de Prisma'],
    ['src/app/api/waitlist/route.ts', 'API de Waitlist'],
    ['src/lib/email.ts', 'Sistema de Email'],
  ]
  
  let allFilesExist = true
  for (const [file, description] of requiredFiles) {
    if (!checkFile(file, description)) {
      allFilesExist = false
    }
  }
  
  if (!allFilesExist) {
    console.log('\n❌ Faltan archivos necesarios. Ejecuta primero el setup básico.')
    process.exit(1)
  }
  
  console.log('\n📦 Instalando dependencias de producción...\n')
  
  // Instalar dependencias
  runCommand('npm install', 'Instalando dependencias')
  
  // Crear archivo de configuración
  console.log('📝 Creando archivo de configuración...')
  createConfigFile()
  
  // Generar cliente Prisma
  runCommand('npx prisma generate', 'Generando cliente Prisma')
  
  // Mostrar instrucciones
  showInstructions()
  
  console.log('🎉 ¡Configuración de producción completada!')
  console.log('\n📋 Próximos pasos:')
  console.log('1. Edita .env.production con tus datos reales')
  console.log('2. Configura tu base de datos Supabase')
  console.log('3. Configura tu dominio y SSL')
  console.log('4. Despliega en Vercel, Netlify, o tu servidor')
  console.log('5. Configura monitoreo y analytics')
}

// Ejecutar
main().catch(console.error)
