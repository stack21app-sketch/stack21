#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function checkOAuthConfig() {
  const envPath = path.join(process.cwd(), '.env.local');
  
  if (!fs.existsSync(envPath)) {
    console.log('❌ Archivo .env.local no encontrado');
    console.log('💡 Ejecuta: npm run setup:oauth');
    return false;
  }

  const envContent = fs.readFileSync(envPath, 'utf8');
  
  const googleConfigured = envContent.includes('GOOGLE_CLIENT_ID=') && 
                          !envContent.includes('GOOGLE_CLIENT_ID=placeholder') &&
                          envContent.includes('GOOGLE_CLIENT_SECRET=') &&
                          !envContent.includes('GOOGLE_CLIENT_SECRET=placeholder');

  const githubConfigured = envContent.includes('GITHUB_CLIENT_ID=') && 
                          !envContent.includes('GITHUB_CLIENT_ID=placeholder') &&
                          envContent.includes('GITHUB_CLIENT_SECRET=') &&
                          !envContent.includes('GITHUB_CLIENT_SECRET=placeholder');

  console.log('🔐 Estado de Configuración OAuth:');
  console.log(`📧 Google OAuth: ${googleConfigured ? '✅ Configurado' : '❌ No configurado'}`);
  console.log(`🐙 GitHub OAuth: ${githubConfigured ? '✅ Configurado' : '❌ No configurado'}`);
  
  if (!googleConfigured && !githubConfigured) {
    console.log('\n💡 Para configurar OAuth:');
    console.log('1. Ejecuta: npm run setup:oauth');
    console.log('2. O usa las credenciales demo: demo@stack21.com / demo123');
    return false;
  }

  return true;
}

// Ejecutar si se llama directamente
if (require.main === module) {
  checkOAuthConfig();
}

module.exports = { checkOAuthConfig };
