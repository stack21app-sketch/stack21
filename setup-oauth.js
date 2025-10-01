#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🔐 Configuración de Google OAuth para Stack21\n');

async function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, resolve);
  });
}

async function main() {
  try {
    console.log('📋 Necesitarás las credenciales de Google OAuth:');
    console.log('1. Ve a https://console.cloud.google.com/');
    console.log('2. Crea un proyecto o selecciona uno existente');
    console.log('3. Habilita Google+ API');
    console.log('4. Crea credenciales OAuth 2.0');
    console.log('5. Configura las URIs de redirección:\n');
    console.log('   - http://localhost:3000/api/auth/callback/google');
    console.log('   - https://tu-dominio.com/api/auth/callback/google\n');

    const clientId = await askQuestion('🔑 Ingresa tu Google Client ID: ');
    const clientSecret = await askQuestion('🔐 Ingresa tu Google Client Secret: ');
    const domain = await askQuestion('🌐 Ingresa tu dominio de producción (opcional): ');

    // Generar NEXTAUTH_SECRET
    const crypto = require('crypto');
    const nextAuthSecret = crypto.randomBytes(32).toString('base64');

    // Leer archivo .env.local existente
    const envPath = path.join(process.cwd(), '.env.local');
    let envContent = '';
    
    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, 'utf8');
    }

    // Actualizar o agregar variables
    const updates = {
      'GOOGLE_CLIENT_ID': clientId,
      'GOOGLE_CLIENT_SECRET': clientSecret,
      'NEXTAUTH_SECRET': nextAuthSecret,
      'NEXTAUTH_URL': domain ? `https://${domain}` : 'http://localhost:3000'
    };

    // Procesar cada variable
    for (const [key, value] of Object.entries(updates)) {
      const regex = new RegExp(`^${key}=.*$`, 'm');
      const newLine = `${key}=${value}`;
      
      if (envContent.includes(key + '=')) {
        envContent = envContent.replace(regex, newLine);
      } else {
        envContent += `\n${newLine}`;
      }
    }

    // Escribir archivo actualizado
    fs.writeFileSync(envPath, envContent);

    console.log('\n✅ Configuración completada!');
    console.log('📁 Variables actualizadas en .env.local:');
    console.log(`   GOOGLE_CLIENT_ID=${clientId}`);
    console.log(`   GOOGLE_CLIENT_SECRET=${clientSecret.substring(0, 10)}...`);
    console.log(`   NEXTAUTH_SECRET=${nextAuthSecret.substring(0, 10)}...`);
    console.log(`   NEXTAUTH_URL=${updates.NEXTAUTH_URL}`);

    console.log('\n🚀 Próximos pasos:');
    console.log('1. Reinicia el servidor: npm run dev');
    console.log('2. Ve a http://localhost:3000/auth/signin');
    console.log('3. Prueba el botón "Continuar con Google"');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    rl.close();
  }
}

main();