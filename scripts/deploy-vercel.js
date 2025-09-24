#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 DEPLOY A VERCEL - STACK21');
console.log('============================\n');

// Verificar que Vercel CLI esté instalado
try {
  execSync('vercel --version', { stdio: 'pipe' });
  console.log('✅ Vercel CLI encontrado');
} catch (error) {
  console.log('❌ Vercel CLI no encontrado');
  console.log('📦 Instalando Vercel CLI...');
  execSync('npm install -g vercel', { stdio: 'inherit' });
}

// Crear archivo .vercelignore
const vercelIgnore = `
node_modules
.next
.env.local
.env.development.local
.env.test.local
.env.production.local
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.DS_Store
*.tsbuildinfo
`;

fs.writeFileSync('.vercelignore', vercelIgnore.trim());
console.log('✅ Archivo .vercelignore creado');

// Crear archivo de configuración de producción
const productionEnv = `
# Producción
NODE_ENV=production
NEXTAUTH_URL=https://stack21.vercel.app
NEXTAUTH_SECRET=stack21-production-secret-key-2024

# Base de datos de producción (usar Railway, Supabase, o Neon)
DATABASE_URL=postgresql://user:password@host:port/database

# OAuth (configurar en Vercel dashboard)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=

# OpenAI
OPENAI_API_KEY=

# SMTP (configurar en Vercel dashboard)
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
SMTP_FROM=Stack21 <noreply@stack21.com>

# Stripe (opcional)
STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# Analytics
GOOGLE_ANALYTICS_ID=
MIXPANEL_TOKEN=

# Monitoreo
SENTRY_DSN=

# Seguridad
JWT_SECRET=jwt-secret-production-2024
ENCRYPTION_KEY=encryption-key-32-chars-prod-2024
ADMIN_KEY=admin-key-stack21-prod-2024
`;

fs.writeFileSync('.env.production', productionEnv.trim());
console.log('✅ Archivo .env.production creado');

console.log('\n📋 INSTRUCCIONES PARA DEPLOY:');
console.log('1. Ejecuta: vercel login');
console.log('2. Ejecuta: vercel');
console.log('3. Configura las variables de entorno en Vercel dashboard');
console.log('4. Configura la base de datos de producción');
console.log('5. Configura el dominio personalizado\n');

console.log('🔧 VARIABLES DE ENTORNO A CONFIGURAR EN VERCEL:');
console.log('• DATABASE_URL (base de datos de producción)');
console.log('• NEXTAUTH_SECRET (clave secreta)');
console.log('• GOOGLE_CLIENT_ID y GOOGLE_CLIENT_SECRET');
console.log('• GITHUB_CLIENT_ID y GITHUB_CLIENT_SECRET');
console.log('• OPENAI_API_KEY');
console.log('• SMTP_HOST, SMTP_USER, SMTP_PASS');
console.log('• STRIPE_SECRET_KEY (opcional)');
console.log('• SENTRY_DSN (opcional)\n');

console.log('🎯 COMANDOS DE DEPLOY:');
console.log('vercel login');
console.log('vercel --prod');
console.log('vercel domains add stack21.com');
