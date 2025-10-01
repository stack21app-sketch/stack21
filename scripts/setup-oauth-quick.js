#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function setupOAuth() {
  console.log('🔐 Configuración Rápida de OAuth para Stack21\n');
  
  // Verificar si existe .env.local
  const envPath = path.join(process.cwd(), '.env.local');
  let envContent = '';
  
  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, 'utf8');
    console.log('✅ Archivo .env.local encontrado\n');
  } else {
    console.log('📝 Creando archivo .env.local...\n');
    // Crear .env.local básico
    envContent = `# Stack21 - Configuración Local
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=${generateSecret()}

# Base de datos (usar Supabase o local)
DATABASE_URL="postgresql://username:password@localhost:5432/saas_starter?schema=public"

# OAuth Providers (configurar abajo)
GOOGLE_CLIENT_ID=placeholder
GOOGLE_CLIENT_SECRET=placeholder
GITHUB_CLIENT_ID=placeholder
GITHUB_CLIENT_SECRET=placeholder

# OpenAI (opcional)
OPENAI_API_KEY=placeholder

# Stripe (opcional)
STRIPE_PUBLISHABLE_KEY=pk_test_placeholder
STRIPE_SECRET_KEY=sk_test_placeholder
STRIPE_WEBHOOK_SECRET=whsec_placeholder

# Aplicación
NEXT_PUBLIC_APP_URL=http://localhost:3000
`;
  }

  console.log('🚀 Vamos a configurar OAuth paso a paso:\n');

  // Configurar Google OAuth
  console.log('📧 === GOOGLE OAUTH ===');
  console.log('1. Ve a: https://console.cloud.google.com/');
  console.log('2. Crea un proyecto o selecciona uno existente');
  console.log('3. Ve a APIs & Services > Credentials');
  console.log('4. Crea OAuth 2.0 Client ID');
  console.log('5. Configura:');
  console.log('   - Authorized JavaScript origins: http://localhost:3000');
  console.log('   - Authorized redirect URIs: http://localhost:3000/api/auth/callback/google');
  console.log('');

  const googleClientId = await question('🔑 Google Client ID (o presiona Enter para saltar): ');
  const googleClientSecret = googleClientId ? await question('🔐 Google Client Secret: ') : '';

  // Configurar GitHub OAuth
  console.log('\n🐙 === GITHUB OAUTH ===');
  console.log('1. Ve a: https://github.com/settings/applications/new');
  console.log('2. Crea nueva OAuth App');
  console.log('3. Configura:');
  console.log('   - Application name: Stack21');
  console.log('   - Homepage URL: http://localhost:3000');
  console.log('   - Authorization callback URL: http://localhost:3000/api/auth/callback/github');
  console.log('');

  const githubClientId = await question('🔑 GitHub Client ID (o presiona Enter para saltar): ');
  const githubClientSecret = githubClientId ? await question('🔐 GitHub Client Secret: ') : '';

  // Actualizar .env.local
  let updatedEnv = envContent;

  if (googleClientId && googleClientSecret) {
    updatedEnv = updatedEnv.replace('GOOGLE_CLIENT_ID=placeholder', `GOOGLE_CLIENT_ID=${googleClientId}`);
    updatedEnv = updatedEnv.replace('GOOGLE_CLIENT_SECRET=placeholder', `GOOGLE_CLIENT_SECRET=${googleClientSecret}`);
    console.log('✅ Google OAuth configurado');
  }

  if (githubClientId && githubClientSecret) {
    updatedEnv = updatedEnv.replace('GITHUB_CLIENT_ID=placeholder', `GITHUB_CLIENT_ID=${githubClientId}`);
    updatedEnv = updatedEnv.replace('GITHUB_CLIENT_SECRET=placeholder', `GITHUB_CLIENT_SECRET=${githubClientSecret}`);
    console.log('✅ GitHub OAuth configurado');
  }

  // Escribir archivo actualizado
  fs.writeFileSync(envPath, updatedEnv);
  console.log('\n💾 Archivo .env.local actualizado');

  // Mostrar resumen
  console.log('\n🎉 === CONFIGURACIÓN COMPLETADA ===');
  console.log('✅ Archivo .env.local actualizado');
  console.log('✅ OAuth configurado');
  console.log('✅ Listo para usar');
  
  console.log('\n🚀 Para iniciar la aplicación:');
  console.log('npm run dev');
  
  console.log('\n🔐 Credenciales demo disponibles:');
  console.log('Email: demo@stack21.com');
  console.log('Password: demo123');

  rl.close();
}

function generateSecret() {
  return require('crypto').randomBytes(32).toString('hex');
}

// Ejecutar si se llama directamente
if (require.main === module) {
  setupOAuth().catch(console.error);
}

module.exports = { setupOAuth };
