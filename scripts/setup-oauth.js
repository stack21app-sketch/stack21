#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

console.log('🔐 Configurando OAuth Real para Stack21...\n')

// Función para mostrar instrucciones de Google OAuth
function showGoogleOAuthInstructions() {
  console.log(`
🔐 CONFIGURACIÓN DE GOOGLE OAUTH:

1. 📝 CREAR PROYECTO EN GOOGLE CLOUD:
   - Ve a https://console.cloud.google.com/
   - Crea un nuevo proyecto: "Stack21 Waitlist"
   - O selecciona un proyecto existente

2. 🔑 HABILITAR GOOGLE+ API:
   - Ve a APIs & Services > Library
   - Busca "Google+ API"
   - Habilita la API

3. 🔐 CREAR CREDENCIALES OAUTH 2.0:
   - Ve a APIs & Services > Credentials
   - Clic en "Create Credentials" > "OAuth 2.0 Client ID"
   - Tipo: "Web application"
   - Nombre: "Stack21 Waitlist"

4. 🌐 CONFIGURAR URIs AUTORIZADAS:
   - Authorized JavaScript origins:
     * http://localhost:3000 (desarrollo)
     * https://tu-dominio.com (producción)
   - Authorized redirect URIs:
     * http://localhost:3000/api/auth/callback/google (desarrollo)
     * https://tu-dominio.com/api/auth/callback/google (producción)

5. 📝 COPIAR CREDENCIALES:
   - Client ID: copia el valor
   - Client Secret: copia el valor

6. 🔧 CONFIGURAR EN .env:
   GOOGLE_CLIENT_ID="tu-google-client-id"
   GOOGLE_CLIENT_SECRET="tu-google-client-secret"

7. ✅ PROBAR CONFIGURACIÓN:
   - Ve a http://localhost:3000/auth/signin
   - Clic en "Sign in with Google"
`)
}

// Función para mostrar instrucciones de GitHub OAuth
function showGitHubOAuthInstructions() {
  console.log(`
🔐 CONFIGURACIÓN DE GITHUB OAUTH:

1. 📝 CREAR APLICACIÓN GITHUB:
   - Ve a https://github.com/settings/developers
   - Clic en "New OAuth App"
   - Nombre: "Stack21 Waitlist"
   - Homepage URL: http://localhost:3000 (desarrollo)
   - Authorization callback URL: http://localhost:3000/api/auth/callback/github

2. 🔑 OBTENER CREDENCIALES:
   - Client ID: copia el valor
   - Client Secret: genera uno nuevo

3. 🔧 CONFIGURAR EN .env:
   GITHUB_CLIENT_ID="tu-github-client-id"
   GITHUB_CLIENT_SECRET="tu-github-client-secret"

4. ✅ PROBAR CONFIGURACIÓN:
   - Ve a http://localhost:3000/auth/signin
   - Clic en "Sign in with GitHub"
`)
}

// Función para mostrar instrucciones de dominio personalizado
function showDomainInstructions() {
  console.log(`
🌐 CONFIGURACIÓN DE DOMINIO PERSONALIZADO:

1. 📝 COMPRAR DOMINIO:
   - Ve a https://namecheap.com, https://godaddy.com, o https://cloudflare.com
   - Busca un dominio: stack21.com, stack21.app, etc.
   - Compra el dominio

2. 🔧 CONFIGURAR DNS:
   - Añade un registro A apuntando a tu servidor
   - O configura CNAME para Vercel/Netlify

3. 🔐 CONFIGURAR SSL:
   - Vercel: SSL automático
   - Netlify: SSL automático
   - Servidor propio: Let's Encrypt

4. 🔄 ACTUALIZAR OAUTH:
   - Actualiza las URIs autorizadas con tu dominio real
   - Cambia NEXTAUTH_URL en .env

5. ✅ PROBAR EN PRODUCCIÓN:
   - Ve a https://tu-dominio.com
   - Prueba el login con OAuth
`)
}

// Función principal
async function main() {
  console.log('🎯 OPCIONES DE OAUTH PARA STACK21:\n')
  
  console.log('1. 🔐 Google OAuth (Recomendado, fácil)')
  console.log('2. 🔐 GitHub OAuth (Para desarrolladores)')
  console.log('3. 🔐 Email/Password (Tradicional)')
  console.log('4. 🔐 Magic Links (Sin contraseña)')
  
  console.log('\n📋 RECOMENDACIÓN:')
  console.log('   Para empezar: Google OAuth')
  console.log('   Para producción: Google + GitHub')
  
  console.log('\n' + '='.repeat(50))
  
  // Mostrar instrucciones de Google OAuth
  showGoogleOAuthInstructions()
  
  console.log('\n' + '='.repeat(50))
  
  // Mostrar instrucciones de GitHub OAuth
  showGitHubOAuthInstructions()
  
  console.log('\n' + '='.repeat(50))
  
  // Mostrar instrucciones de dominio
  showDomainInstructions()
  
  console.log('\n🎉 ¡Configuración de OAuth completada!')
  console.log('\n📋 Próximos pasos:')
  console.log('1. Configura Google OAuth')
  console.log('2. Configura GitHub OAuth (opcional)')
  console.log('3. Compra un dominio')
  console.log('4. Actualiza las URIs autorizadas')
  console.log('5. Prueba el login en http://localhost:3000/auth/signin')
}

// Ejecutar
main().catch(console.error)
