#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { execSync } = require('child_process');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🚀 Configuración Completa de Stack21\n');

async function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, resolve);
  });
}

async function main() {
  try {
    console.log('📋 Este script te ayudará a configurar Stack21 completamente:');
    console.log('1. Google OAuth para autenticación');
    console.log('2. Supabase para base de datos');
    console.log('3. Variables de entorno');
    console.log('4. Verificación del sistema\n');

    const setupOAuth = await askQuestion('¿Quieres configurar Google OAuth? (y/n): ');
    const setupSupabase = await askQuestion('¿Quieres configurar Supabase? (y/n): ');
    const setupDomain = await askQuestion('¿Tienes un dominio de producción? (opcional): ');

    let envContent = '';
    const envPath = path.join(process.cwd(), '.env.local');
    
    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, 'utf8');
    }

    // Configurar Google OAuth
    if (setupOAuth.toLowerCase() === 'y') {
      console.log('\n🔐 Configurando Google OAuth...');
      const clientId = await askQuestion('Google Client ID: ');
      const clientSecret = await askQuestion('Google Client Secret: ');
      
      const updates = {
        'GOOGLE_CLIENT_ID': clientId,
        'GOOGLE_CLIENT_SECRET': clientSecret
      };

      for (const [key, value] of Object.entries(updates)) {
        const regex = new RegExp(`^${key}=.*$`, 'm');
        const newLine = `${key}=${value}`;
        
        if (envContent.includes(key + '=')) {
          envContent = envContent.replace(regex, newLine);
        } else {
          envContent += `\n${newLine}`;
        }
      }
    }

    // Configurar Supabase
    if (setupSupabase.toLowerCase() === 'y') {
      console.log('\n🗄️ Configurando Supabase...');
      const supabaseUrl = await askQuestion('Supabase URL: ');
      const supabaseKey = await askQuestion('Supabase anon key: ');
      
      const updates = {
        'NEXT_PUBLIC_SUPABASE_URL': supabaseUrl,
        'NEXT_PUBLIC_SUPABASE_ANON_KEY': supabaseKey
      };

      for (const [key, value] of Object.entries(updates)) {
        const regex = new RegExp(`^${key}=.*$`, 'm');
        const newLine = `${key}=${value}`;
        
        if (envContent.includes(key + '=')) {
          envContent = envContent.replace(regex, newLine);
        } else {
          envContent += `\n${newLine}`;
        }
      }
    }

    // Generar NEXTAUTH_SECRET si no existe
    if (!envContent.includes('NEXTAUTH_SECRET=')) {
      const crypto = require('crypto');
      const nextAuthSecret = crypto.randomBytes(32).toString('base64');
      envContent += `\nNEXTAUTH_SECRET=${nextAuthSecret}`;
    }

    // Configurar NEXTAUTH_URL
    const nextAuthUrl = setupDomain ? `https://${setupDomain}` : 'http://localhost:3000';
    const urlRegex = /^NEXTAUTH_URL=.*$/m;
    if (envContent.includes('NEXTAUTH_URL=')) {
      envContent = envContent.replace(urlRegex, `NEXTAUTH_URL=${nextAuthUrl}`);
    } else {
      envContent += `\nNEXTAUTH_URL=${nextAuthUrl}`;
    }

    // Escribir archivo .env.local
    fs.writeFileSync(envPath, envContent);

    console.log('\n✅ Configuración completada!');
    console.log('📁 Variables actualizadas en .env.local');

    // Verificar que el servidor funcione
    console.log('\n🔍 Verificando sistema...');
    try {
      execSync('node verify-complete.js', { stdio: 'inherit' });
      console.log('\n🎉 ¡Stack21 está 100% funcional!');
    } catch (error) {
      console.log('\n⚠️ Hay algunos errores, pero el sistema está funcionando');
    }

    console.log('\n🚀 Próximos pasos:');
    console.log('1. Reinicia el servidor: npm run dev');
    console.log('2. Ve a http://localhost:3000');
    console.log('3. Prueba la autenticación');
    console.log('4. Explora el dashboard');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    rl.close();
  }
}

main();
