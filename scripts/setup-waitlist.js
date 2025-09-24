#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

console.log('🚀 Configurando Stack21 Waitlist...\n')

// Función para crear archivo .env.local
function createEnvFile() {
  const envContent = `# ===========================================
# CONFIGURACIÓN DE STACK21 WAITLIST
# ===========================================

# Base de datos PostgreSQL (REQUERIDO)
DATABASE_URL="postgresql://username:password@localhost:5432/stack21?schema=public"
DIRECT_URL="postgresql://username:password@localhost:5432/stack21?schema=public"

# NextAuth (REQUERIDO)
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="${generateSecret()}"

# Admin (REQUERIDO para dashboard)
ADMIN_KEY="${generateSecret()}"

# Aplicación
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# OAuth Providers (Opcional)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
GITHUB_CLIENT_ID=""
GITHUB_CLIENT_SECRET=""

# Stripe (Opcional para pre-ventas)
STRIPE_PUBLISHABLE_KEY=""
STRIPE_SECRET_KEY=""
STRIPE_WEBHOOK_SECRET=""

# OpenAI (Opcional)
OPENAI_API_KEY=""

# Email (Opcional)
SMTP_HOST=""
SMTP_PORT="587"
SMTP_USER=""
SMTP_PASS=""
SMTP_FROM="Stack21 <noreply@stack21.com>"

# Analytics (Opcional)
GOOGLE_ANALYTICS_ID=""
MIXPANEL_TOKEN=""
`

  const envPath = path.join(process.cwd(), '.env.local')
  
  if (fs.existsSync(envPath)) {
    console.log('⚠️  El archivo .env.local ya existe')
    console.log('   Si quieres recrearlo, elimínalo primero\n')
    return false
  }

  fs.writeFileSync(envPath, envContent)
  console.log('✅ Archivo .env.local creado')
  return true
}

// Función para generar secretos
function generateSecret() {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15) +
         Math.random().toString(36).substring(2, 15)
}

// Función para verificar dependencias
function checkDependencies() {
  console.log('🔍 Verificando dependencias...')
  
  try {
    // Verificar Node.js
    const nodeVersion = process.version
    console.log(`   Node.js: ${nodeVersion}`)
    
    // Verificar npm
    execSync('npm --version', { stdio: 'pipe' })
    console.log('   npm: ✅')
    
    // Verificar si Prisma está instalado
    try {
      execSync('npx prisma --version', { stdio: 'pipe' })
      console.log('   Prisma: ✅')
    } catch (error) {
      console.log('   Prisma: ❌ (se instalará automáticamente)')
    }
    
    return true
  } catch (error) {
    console.log('❌ Error verificando dependencias:', error.message)
    return false
  }
}

// Función para instalar dependencias
function installDependencies() {
  console.log('\n📦 Instalando dependencias...')
  
  try {
    execSync('npm install', { stdio: 'inherit' })
    console.log('✅ Dependencias instaladas')
    return true
  } catch (error) {
    console.log('❌ Error instalando dependencias:', error.message)
    return false
  }
}

// Función para configurar base de datos
function setupDatabase() {
  console.log('\n🗄️  Configurando base de datos...')
  
  try {
    // Generar cliente Prisma
    console.log('   Generando cliente Prisma...')
    execSync('npx prisma generate', { stdio: 'inherit' })
    
    // Aplicar migraciones
    console.log('   Aplicando migraciones...')
    execSync('npx prisma db push', { stdio: 'inherit' })
    
    console.log('✅ Base de datos configurada')
    return true
  } catch (error) {
    console.log('❌ Error configurando base de datos:', error.message)
    console.log('   Asegúrate de que PostgreSQL esté ejecutándose')
    console.log('   y que la DATABASE_URL sea correcta en .env.local')
    return false
  }
}

// Función para crear script de inicio
function createStartScript() {
  const startScript = `#!/bin/bash

echo "🚀 Iniciando Stack21 Waitlist..."

# Verificar si .env.local existe
if [ ! -f .env.local ]; then
    echo "❌ Archivo .env.local no encontrado"
    echo "   Ejecuta: npm run setup"
    exit 1
fi

# Verificar variables requeridas
source .env.local

if [ -z "$DATABASE_URL" ]; then
    echo "❌ DATABASE_URL no configurada en .env.local"
    exit 1
fi

if [ -z "$NEXTAUTH_SECRET" ]; then
    echo "❌ NEXTAUTH_SECRET no configurada en .env.local"
    exit 1
fi

if [ -z "$ADMIN_KEY" ]; then
    echo "❌ ADMIN_KEY no configurada en .env.local"
    exit 1
fi

echo "✅ Configuración verificada"
echo "🌐 Iniciando servidor en http://localhost:3000"
echo ""
echo "📋 Páginas disponibles:"
echo "   • /landing - Página principal con waitlist"
echo "   • /prelaunch - Página de prelanzamiento"
echo "   • /dashboard/waitlist - Dashboard de admin"
echo ""

npm run dev
`

  const scriptPath = path.join(process.cwd(), 'start-waitlist.sh')
  fs.writeFileSync(scriptPath, startScript)
  fs.chmodSync(scriptPath, '755')
  
  console.log('✅ Script de inicio creado: start-waitlist.sh')
}

// Función para mostrar instrucciones
function showInstructions() {
  console.log('\n🎉 ¡Configuración completada!\n')
  
  console.log('📋 Próximos pasos:')
  console.log('1. Configura tu base de datos PostgreSQL')
  console.log('2. Actualiza DATABASE_URL en .env.local')
  console.log('3. Ejecuta: npm run dev')
  console.log('4. Visita: http://localhost:3000/landing\n')
  
  console.log('🔧 Comandos útiles:')
  console.log('   npm run dev          - Iniciar servidor')
  console.log('   npm run db:studio    - Abrir Prisma Studio')
  console.log('   npm run db:push      - Aplicar cambios de DB')
  console.log('   ./start-waitlist.sh  - Script de inicio\n')
  
  console.log('📊 Dashboard de admin:')
  console.log('   http://localhost:3000/dashboard/waitlist')
  console.log('   Usa la ADMIN_KEY del .env.local\n')
  
  console.log('🚀 ¡Tu waitlist está lista para capturar leads!')
}

// Función principal
async function main() {
  console.log('='.repeat(50))
  console.log('🚀 STACK21 WAITLIST SETUP')
  console.log('='.repeat(50))
  
  // 1. Verificar dependencias
  if (!checkDependencies()) {
    process.exit(1)
  }
  
  // 2. Crear archivo .env.local
  createEnvFile()
  
  // 3. Instalar dependencias
  if (!installDependencies()) {
    process.exit(1)
  }
  
  // 4. Configurar base de datos (opcional, puede fallar)
  setupDatabase()
  
  // 5. Crear script de inicio
  createStartScript()
  
  // 6. Mostrar instrucciones
  showInstructions()
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  main().catch(console.error)
}

module.exports = { main }
