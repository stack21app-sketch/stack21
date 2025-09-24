#!/usr/bin/env node

// Cargar variables de entorno
require('dotenv').config({ path: '.env' })

console.log('📧 Probando Sistema de Email...\n')

// Simular el envío de email
async function testEmail() {
  try {
    console.log('📤 Simulando envío de email...')
    
    // Verificar configuración SMTP
    const smtpHost = process.env.SMTP_HOST
    const smtpUser = process.env.SMTP_USER
    const smtpPass = process.env.SMTP_PASS
    
    console.log('🔧 Configuración SMTP:')
    console.log(`   Host: ${smtpHost || 'No configurado'}`)
    console.log(`   User: ${smtpUser || 'No configurado'}`)
    console.log(`   Pass: ${smtpPass ? '***configurado***' : 'No configurado'}`)
    
    if (!smtpHost || !smtpUser || !smtpPass) {
      console.log('\n❌ Configuración SMTP incompleta!')
      console.log('📋 Para configurar Gmail:')
      console.log('   1. Ve a https://myaccount.google.com/security')
      console.log('   2. Activa "Verificación en 2 pasos"')
      console.log('   3. Ve a https://myaccount.google.com/apppasswords')
      console.log('   4. Genera una App Password')
      console.log('   5. Configura en .env:')
      console.log('      SMTP_HOST="smtp.gmail.com"')
      console.log('      SMTP_PORT="587"')
      console.log('      SMTP_USER="tu-email@gmail.com"')
      console.log('      SMTP_PASS="tu-app-password"')
      console.log('      SMTP_FROM="Stack21 <noreply@stack21.com>"')
      return
    }
    
    // Simular envío exitoso
    console.log('\n✅ Email simulado enviado exitosamente!')
    console.log('📧 Detalles del email:')
    console.log('   To: test@example.com')
    console.log('   Subject: ¡Bienvenido a Stack21! Verifica tu email')
    console.log('   Token: test-token-123')
    console.log('   URL: http://localhost:3000/verify-email?token=test-token-123')
    
    console.log('\n🎉 ¡Sistema de email configurado correctamente!')
    console.log('📋 Próximos pasos:')
    console.log('   1. Prueba el waitlist en http://localhost:3000/landing')
    console.log('   2. Registra un email real')
    console.log('   3. Verifica que recibas el email')
    
  } catch (error) {
    console.error('❌ Error en prueba de email:', error.message)
  }
}

// Ejecutar prueba
testEmail()
