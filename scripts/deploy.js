#!/usr/bin/env node

const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

console.log('🚀 Desplegando Stack21 a Vercel...\n')

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

// Función para mostrar instrucciones de Vercel
function showVercelInstructions() {
  console.log(`
🌐 CONFIGURACIÓN DE VERCEL:

1. 📝 CREAR CUENTA VERCEL:
   - Ve a https://vercel.com
   - Crea cuenta con GitHub
   - O usa email/password

2. 🔧 INSTALAR VERCEL CLI:
   npm install -g vercel
   # O usar: npx vercel

3. 🚀 DESPLEGAR:
   npx vercel --prod

4. 🔑 CONFIGURAR VARIABLES DE ENTORNO:
   - Ve a tu proyecto en Vercel Dashboard
   - Settings > Environment Variables
   - Añade todas las variables de .env.production

5. 🌐 CONFIGURAR DOMINIO:
   - Ve a Settings > Domains
   - Añade tu dominio personalizado
   - Configura DNS

6. ✅ PROBAR DESPLIEGUE:
   - Ve a tu URL de Vercel
   - Prueba todas las funcionalidades
`)
}

// Función para mostrar variables de entorno necesarias
function showEnvironmentVariables() {
  console.log(`
🔧 VARIABLES DE ENTORNO PARA VERCEL:

OBLIGATORIAS:
- DATABASE_URL (Supabase)
- NEXTAUTH_URL (tu dominio)
- NEXTAUTH_SECRET (clave segura)
- ADMIN_KEY (clave de admin)

OPCIONALES (pero recomendadas):
- GOOGLE_CLIENT_ID
- GOOGLE_CLIENT_SECRET
- GITHUB_CLIENT_ID
- GITHUB_CLIENT_SECRET
- STRIPE_PUBLISHABLE_KEY
- STRIPE_SECRET_KEY
- OPENAI_API_KEY
- SMTP_HOST
- SMTP_USER
- SMTP_PASS
- SMTP_FROM

📋 COMO CONFIGURAR:
1. Ve a tu proyecto en Vercel
2. Settings > Environment Variables
3. Añade cada variable con su valor
4. Selecciona "Production" environment
5. Redeploy tu proyecto
`)
}

// Función principal
async function main() {
  console.log('🔍 Verificando archivos necesarios...\n')
  
  // Verificar archivos necesarios
  const requiredFiles = [
    ['package.json', 'Package.json'],
    ['vercel.json', 'Configuración de Vercel'],
    ['prisma/schema.prisma', 'Schema de Prisma'],
    ['.env.production', 'Variables de entorno de producción'],
  ]
  
  let allFilesExist = true
  for (const [file, description] of requiredFiles) {
    if (!checkFile(file, description)) {
      allFilesExist = false
    }
  }
  
  if (!allFilesExist) {
    console.log('\n❌ Faltan archivos necesarios. Ejecuta primero el setup de producción.')
    process.exit(1)
  }
  
  console.log('\n📦 Preparando para despliegue...\n')
  
  // Verificar que la aplicación compile
  runCommand('npm run build', 'Compilando aplicación')
  
  // Mostrar instrucciones
  showVercelInstructions()
  
  console.log('\n' + '='.repeat(50))
  
  showEnvironmentVariables()
  
  console.log('\n🎉 ¡Preparación para despliegue completada!')
  console.log('\n📋 Próximos pasos:')
  console.log('1. Crea cuenta en Vercel')
  console.log('2. Ejecuta: npx vercel --prod')
  console.log('3. Configura variables de entorno')
  console.log('4. Configura dominio personalizado')
  console.log('5. Prueba tu aplicación en producción')
  
  console.log('\n🚀 Para desplegar ahora, ejecuta:')
  console.log('   npx vercel --prod')
}

// Ejecutar
main().catch(console.error)
