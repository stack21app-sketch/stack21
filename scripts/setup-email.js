#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

console.log('📧 Configurando Sistema de Email Real...\n')

// Función para mostrar instrucciones de Gmail
function showGmailInstructions() {
  console.log(`
🔐 CONFIGURACIÓN DE GMAIL PARA STACK21:

1. 📧 CREAR CUENTA GMAIL:
   - Ve a https://gmail.com
   - Crea una cuenta: stack21.waitlist@gmail.com
   - O usa tu cuenta personal

2. 🔑 ACTIVAR VERIFICACIÓN EN 2 PASOS:
   - Ve a https://myaccount.google.com/security
   - Activa "Verificación en 2 pasos"
   - Sigue las instrucciones

3. 🔐 GENERAR APP PASSWORD:
   - Ve a https://myaccount.google.com/apppasswords
   - Selecciona "Aplicación" > "Otra (nombre personalizado)"
   - Nombre: "Stack21 Waitlist"
   - Copia la contraseña de 16 caracteres

4. 📝 CONFIGURAR EN .env:
   SMTP_HOST="smtp.gmail.com"
   SMTP_PORT="587"
   SMTP_USER="tu-email@gmail.com"
   SMTP_PASS="tu-app-password-de-16-caracteres"
   SMTP_FROM="Stack21 <noreply@stack21.com>"

5. ✅ PROBAR CONFIGURACIÓN:
   npm run test:email
`)
}

// Función para mostrar instrucciones de SendGrid
function showSendGridInstructions() {
  console.log(`
📧 CONFIGURACIÓN DE SENDGRID PARA STACK21:

1. 📝 CREAR CUENTA:
   - Ve a https://sendgrid.com
   - Crea cuenta gratuita (100 emails/día)
   - Verifica tu email

2. 🔑 OBTENER API KEY:
   - Ve a Settings > API Keys
   - Crea nueva API Key
   - Nombre: "Stack21 Waitlist"
   - Permisos: "Full Access"
   - Copia la API Key

3. 📝 CONFIGURAR EN .env:
   SMTP_HOST="smtp.sendgrid.net"
   SMTP_PORT="587"
   SMTP_USER="apikey"
   SMTP_PASS="tu-sendgrid-api-key"
   SMTP_FROM="Stack21 <noreply@stack21.com>"

4. ✅ PROBAR CONFIGURACIÓN:
   npm run test:email
`)
}

// Función para mostrar instrucciones de Mailgun
function showMailgunInstructions() {
  console.log(`
📧 CONFIGURACIÓN DE MAILGUN PARA STACK21:

1. 📝 CREAR CUENTA:
   - Ve a https://mailgun.com
   - Crea cuenta gratuita (5,000 emails/mes)
   - Verifica tu email

2. 🔑 OBTENER CREDENCIALES:
   - Ve a Sending > Domains
   - Selecciona tu dominio
   - Copia SMTP credentials

3. 📝 CONFIGURAR EN .env:
   SMTP_HOST="smtp.mailgun.org"
   SMTP_PORT="587"
   SMTP_USER="postmaster@tu-dominio.mailgun.org"
   SMTP_PASS="tu-mailgun-password"
   SMTP_FROM="Stack21 <noreply@tu-dominio.com>"

4. ✅ PROBAR CONFIGURACIÓN:
   npm run test:email
`)
}

// Función principal
async function main() {
  console.log('🎯 OPCIONES DE EMAIL PARA STACK21:\n')
  
  console.log('1. 📧 Gmail (Gratis, fácil de configurar)')
  console.log('2. 📧 SendGrid (Profesional, 100 emails/día gratis)')
  console.log('3. 📧 Mailgun (Profesional, 5,000 emails/mes gratis)')
  console.log('4. 📧 AWS SES (Escalable, pago por uso)')
  
  console.log('\n📋 RECOMENDACIÓN:')
  console.log('   Para empezar: Gmail (fácil)')
  console.log('   Para producción: SendGrid o Mailgun')
  
  console.log('\n' + '='.repeat(50))
  
  // Mostrar instrucciones de Gmail
  showGmailInstructions()
  
  console.log('\n' + '='.repeat(50))
  
  // Mostrar instrucciones de SendGrid
  showSendGridInstructions()
  
  console.log('\n' + '='.repeat(50))
  
  // Mostrar instrucciones de Mailgun
  showMailgunInstructions()
  
  console.log('\n🎉 ¡Configuración de email completada!')
  console.log('\n📋 Próximos pasos:')
  console.log('1. Elige un proveedor de email')
  console.log('2. Configura las credenciales en .env')
  console.log('3. Ejecuta: npm run test:email')
  console.log('4. Prueba el waitlist en http://localhost:3000/landing')
}

// Ejecutar
main().catch(console.error)
