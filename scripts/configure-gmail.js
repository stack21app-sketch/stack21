#!/usr/bin/env node

const fs = require('fs')
const readline = require('readline')

console.log('📧 Configurando Gmail para Stack21...\n')

// Crear interfaz de readline
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

// Función para hacer preguntas
function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer)
    })
  })
}

// Función para mostrar instrucciones de Gmail
function showGmailInstructions() {
  console.log(`
🔐 INSTRUCCIONES PARA CONFIGURAR GMAIL:

1. 📧 CREAR CUENTA GMAIL (si no tienes):
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
   - Te ayudaré a configurar las variables automáticamente

¡Presiona ENTER cuando hayas completado los pasos 1-3!
`)
}

// Función principal
async function main() {
  try {
    // Mostrar instrucciones
    showGmailInstructions()
    
    await askQuestion('Presiona ENTER cuando hayas completado la configuración de Gmail...')
    
    console.log('\n📝 Ahora vamos a configurar las variables de entorno...\n')
    
    // Solicitar información
    const email = await askQuestion('📧 Tu email de Gmail: ')
    const appPassword = await askQuestion('🔐 App Password (16 caracteres): ')
    const fromName = await askQuestion('📝 Nombre del remitente (ej: Stack21): ') || 'Stack21'
    
    // Validar email
    if (!email.includes('@gmail.com')) {
      console.log('⚠️  Advertencia: El email no parece ser de Gmail')
    }
    
    // Validar app password
    if (appPassword.length !== 16) {
      console.log('⚠️  Advertencia: El App Password debe tener 16 caracteres')
    }
    
    // Crear configuración
    const smtpConfig = `
# Configuración SMTP para Gmail
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="${email}"
SMTP_PASS="${appPassword}"
SMTP_FROM="${fromName} <noreply@stack21.com>"
`
    
    console.log('\n📝 Configuración generada:')
    console.log(smtpConfig)
    
    // Preguntar si quiere guardar
    const save = await askQuestion('\n¿Quieres guardar esta configuración en .env? (y/n): ')
    
    if (save.toLowerCase() === 'y' || save.toLowerCase() === 'yes') {
      // Leer archivo .env actual
      let envContent = ''
      if (fs.existsSync('.env')) {
        envContent = fs.readFileSync('.env', 'utf8')
      }
      
      // Remover configuraciones SMTP existentes
      const lines = envContent.split('\n')
      const filteredLines = lines.filter(line => 
        !line.startsWith('SMTP_HOST') && 
        !line.startsWith('SMTP_PORT') && 
        !line.startsWith('SMTP_USER') && 
        !line.startsWith('SMTP_PASS') && 
        !line.startsWith('SMTP_FROM')
      )
      
      // Añadir nueva configuración
      const newEnvContent = filteredLines.join('\n') + smtpConfig
      
      // Guardar archivo
      fs.writeFileSync('.env', newEnvContent)
      
      console.log('✅ Configuración guardada en .env')
      
      // Probar configuración
      console.log('\n🧪 Probando configuración...')
      const { execSync } = require('child_process')
      
      try {
        execSync('npm run test:email', { stdio: 'inherit' })
      } catch (error) {
        console.log('❌ Error en la prueba, pero la configuración se guardó correctamente')
      }
      
    } else {
      console.log('📋 Configuración no guardada. Puedes copiarla manualmente a tu archivo .env')
    }
    
    console.log('\n🎉 ¡Configuración de Gmail completada!')
    console.log('\n📋 Próximos pasos:')
    console.log('   1. Prueba el waitlist: http://localhost:3000/landing')
    console.log('   2. Registra un email real')
    console.log('   3. Verifica que recibas el email de verificación')
    
  } catch (error) {
    console.error('❌ Error:', error.message)
  } finally {
    rl.close()
  }
}

// Ejecutar
main()
