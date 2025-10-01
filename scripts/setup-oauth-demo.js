#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

function generateSecret() {
  return crypto.randomBytes(32).toString('hex');
}

function setupOAuthDemo() {
  console.log('🔐 Configurando OAuth Demo para Stack21\n');
  
  const envPath = path.join(process.cwd(), '.env.local');
  
  // Crear .env.local con configuración demo
  const envContent = `# Stack21 - Configuración Demo
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=${generateSecret()}

# Base de datos (usar Supabase o local)
DATABASE_URL="postgresql://username:password@localhost:5432/saas_starter?schema=public"

# OAuth Providers (configurar con tus credenciales reales)
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

# Configuración de OAuth (para el banner)
NEXT_PUBLIC_GOOGLE_CONFIGURED=false
NEXT_PUBLIC_GITHUB_CONFIGURED=false
`;

  fs.writeFileSync(envPath, envContent);
  console.log('✅ Archivo .env.local creado con configuración demo');
  
  console.log('\n🎉 === CONFIGURACIÓN DEMO COMPLETADA ===');
  console.log('✅ Archivo .env.local creado');
  console.log('✅ NextAuth configurado');
  console.log('✅ Listo para usar con credenciales demo');
  
  console.log('\n🔐 Credenciales demo disponibles:');
  console.log('Email: demo@stack21.com');
  console.log('Password: demo123');
  
  console.log('\n🚀 Para configurar OAuth real:');
  console.log('1. Ejecuta: npm run setup:oauth');
  console.log('2. Sigue las instrucciones para Google y GitHub');
  
  console.log('\n🚀 Para iniciar la aplicación:');
  console.log('npm run dev');
}

// Ejecutar si se llama directamente
if (require.main === module) {
  setupOAuthDemo();
}

module.exports = { setupOAuthDemo };
