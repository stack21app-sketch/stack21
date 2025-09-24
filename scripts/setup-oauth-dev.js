#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const readline = require('readline')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve)
  })
}

async function setupOAuth() {
  console.log('🔐 Configuración de OAuth para Stack21')
  console.log('=====================================\n')

  // Verificar si existe .env.local
  const envPath = path.join(process.cwd(), '.env.local')
  let envContent = ''

  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, 'utf8')
    console.log('✅ Archivo .env.local encontrado\n')
  } else {
    console.log('📝 Creando archivo .env.local...\n')
    envContent = `# Base de datos
DATABASE_URL="postgresql://postgres:password@localhost:5432/stack21_dev?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="tu-clave-secreta-super-segura-aqui-cambiar-en-produccion"

# OAuth Providers
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
GITHUB_CLIENT_ID=""
GITHUB_CLIENT_SECRET=""

# Stripe
STRIPE_PUBLISHABLE_KEY=""
STRIPE_SECRET_KEY=""
STRIPE_WEBHOOK_SECRET=""

# OpenAI
OPENAI_API_KEY=""

# Aplicación
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Email
EMAIL_PROVIDER="console"
SMTP_HOST=""
SMTP_PORT="587"
SMTP_USER=""
SMTP_PASS=""
SMTP_FROM="Stack21 <noreply@stack21.com>"

# Admin
ADMIN_KEY="admin-key-123"
JWT_SECRET="jwt-secret-key"
ENCRYPTION_KEY="encryption-key-32-chars-long"
`
  }

  console.log('📋 Para configurar OAuth, necesitas crear aplicaciones en:')
  console.log('   • Google: https://console.developers.google.com/')
  console.log('   • GitHub: https://github.com/settings/applications/new\n')

  console.log('🔧 Configuración de Google OAuth:')
  console.log('1. Ve a https://console.developers.google.com/')
  console.log('2. Crea un nuevo proyecto o selecciona uno existente')
  console.log('3. Habilita la API de Google+')
  console.log('4. Ve a "Credenciales" > "Crear credenciales" > "ID de cliente OAuth 2.0"')
  console.log('5. Configura las URLs autorizadas:')
  console.log('   - Orígenes JavaScript autorizados: http://localhost:3000')
  console.log('   - URI de redirección autorizados: http://localhost:3000/api/auth/callback/google\n')

  const googleClientId = await question('🔑 Google Client ID (o presiona Enter para omitir): ')
  const googleClientSecret = await question('🔑 Google Client Secret (o presiona Enter para omitir): ')

  console.log('\n🔧 Configuración de GitHub OAuth:')
  console.log('1. Ve a https://github.com/settings/applications/new')
  console.log('2. Nombre de la aplicación: Stack21')
  console.log('3. URL de la página de inicio: http://localhost:3000')
  console.log('4. URL de autorización de callback: http://localhost:3000/api/auth/callback/github\n')

  const githubClientId = await question('🔑 GitHub Client ID (o presiona Enter para omitir): ')
  const githubClientSecret = await question('🔑 GitHub Client Secret (o presiona Enter para omitir): ')

  // Actualizar el contenido del archivo
  if (googleClientId) {
    envContent = envContent.replace('GOOGLE_CLIENT_ID=""', `GOOGLE_CLIENT_ID="${googleClientId}"`)
  }
  if (googleClientSecret) {
    envContent = envContent.replace('GOOGLE_CLIENT_SECRET=""', `GOOGLE_CLIENT_SECRET="${googleClientSecret}"`)
  }
  if (githubClientId) {
    envContent = envContent.replace('GITHUB_CLIENT_ID=""', `GITHUB_CLIENT_ID="${githubClientId}"`)
  }
  if (githubClientSecret) {
    envContent = envContent.replace('GITHUB_CLIENT_SECRET=""', `GITHUB_CLIENT_SECRET="${githubClientSecret}"`)
  }

  // Escribir el archivo
  fs.writeFileSync(envPath, envContent)

  console.log('\n✅ Archivo .env.local actualizado!')
  console.log('\n📝 Para continuar:')
  console.log('1. Reinicia el servidor: npm run dev')
  console.log('2. Ve a http://localhost:3000/auth/signin')
  console.log('3. Prueba el login con Google o GitHub\n')

  if (!googleClientId && !githubClientId) {
    console.log('⚠️  No se configuraron credenciales OAuth.')
    console.log('   El login solo funcionará con email/password por ahora.\n')
  }

  rl.close()
}

setupOAuth().catch(console.error)
