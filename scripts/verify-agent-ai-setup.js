#!/usr/bin/env node

/**
 * Script para verificar que el setup del Agente AI está completo
 * 
 * Uso:
 *   node scripts/verify-agent-ai-setup.js
 */

const fs = require('fs');
const path = require('path');

// Cargar variables de entorno
require('dotenv').config();

// Colores para output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkFileExists(filePath, description) {
  const fullPath = path.join(process.cwd(), filePath);
  const exists = fs.existsSync(fullPath);
  
  if (exists) {
    log(`✅ ${description}`, 'green');
    return true;
  } else {
    log(`❌ ${description} - Archivo no encontrado: ${filePath}`, 'red');
    return false;
  }
}

function checkEnvVar(varName, description) {
  const value = process.env[varName];
  
  if (value && value !== 'placeholder' && value !== '') {
    log(`✅ ${description}: ${varName}`, 'green');
    return true;
  } else {
    log(`❌ ${description}: ${varName} no configurada`, 'red');
    return false;
  }
}

function checkPackageInstalled(packageName) {
  try {
    require.resolve(packageName);
    log(`✅ Paquete instalado: ${packageName}`, 'green');
    return true;
  } catch (error) {
    log(`❌ Paquete no instalado: ${packageName}`, 'red');
    return false;
  }
}

async function main() {
  log('\n🤖 Verificando setup del Agente AI para Stack21\n', 'bold');
  
  let allChecksPassed = true;
  
  // Verificar archivos principales
  log('📁 Verificando archivos principales...', 'blue');
  const coreFiles = [
    ['src/lib/agent.ts', 'Cliente OpenAI optimizado'],
    ['src/lib/agent-guard.ts', 'Sistema de límites y control'],
    ['src/lib/usage.ts', 'Sistema de contadores de uso'],
    ['src/lib/faq-cache.ts', 'Sistema de cache inteligente'],
    ['migrations/agent-ai-billing.sql', 'Migración de base de datos'],
    ['src/app/api/agent/public/route.ts', 'Endpoint público del agente'],
    ['src/app/api/agent/admin/route.ts', 'Endpoint administrativo'],
    ['src/app/api/usage/current/route.ts', 'Endpoint de uso actual'],
    ['src/app/api/billing/webhook/route.ts', 'Webhook de Stripe'],
    ['src/app/settings/billing/page.tsx', 'UI de facturación'],
    ['scripts/setup-stripe-products.js', 'Script de configuración de Stripe'],
    ['scripts/reset-monthly-usage.js', 'Script de reset mensual'],
    ['AGENT_AI_IMPLEMENTATION.md', 'Documentación de implementación']
  ];
  
  coreFiles.forEach(([file, description]) => {
    if (!checkFileExists(file, description)) {
      allChecksPassed = false;
    }
  });
  
  // Verificar dependencias
  log('\n📦 Verificando dependencias...', 'blue');
  const dependencies = [
    ['openai', 'Cliente OpenAI'],
    ['stripe', 'SDK de Stripe'],
    ['sonner', 'Sistema de notificaciones']
  ];
  
  dependencies.forEach(([pkg, description]) => {
    if (!checkPackageInstalled(pkg)) {
      allChecksPassed = false;
    }
  });
  
  // Verificar variables de entorno
  log('\n🔧 Verificando variables de entorno...', 'blue');
  const envVars = [
    ['OPENAI_API_KEY', 'Clave de API de OpenAI'],
    ['OPENAI_MODEL_PRIMARY', 'Modelo principal de AI'],
    ['OPENAI_MODEL_FALLBACK', 'Modelo de fallback'],
    ['AGENT_SOFTCAP_CHATS_PRO', 'Límite de chats Pro'],
    ['AGENT_SOFTCAP_CHATS_FREE', 'Límite de chats Free'],
    ['AGENT_HARDCAP_TOKENS_DAILY_FREE', 'Límite diario de tokens Free'],
    ['AGENT_SOFTCAP_MINUTES_PREMIUM', 'Límite de minutos Premium'],
    ['CACHE_TTL_FAQ_SECONDS', 'TTL del cache de FAQs']
  ];
  
  envVars.forEach(([varName, description]) => {
    if (!checkEnvVar(varName, description)) {
      allChecksPassed = false;
    }
  });
  
  // Verificar variables opcionales de Stripe
  log('\n💳 Verificando configuración de Stripe...', 'blue');
  const stripeVars = [
    ['STRIPE_SECRET_KEY', 'Clave secreta de Stripe'],
    ['STRIPE_PUBLISHABLE_KEY', 'Clave pública de Stripe'],
    ['STRIPE_WEBHOOK_SECRET', 'Secret del webhook']
  ];
  
  let stripeConfigured = true;
  stripeVars.forEach(([varName, description]) => {
    if (!checkEnvVar(varName, description)) {
      stripeConfigured = false;
    }
  });
  
  if (!stripeConfigured) {
    log('⚠️  Stripe no está completamente configurado', 'yellow');
    log('   Ejecuta: node scripts/setup-stripe-products.js', 'yellow');
  }
  
  // Verificar estructura de directorios
  log('\n📂 Verificando estructura de directorios...', 'blue');
  const directories = [
    ['src/lib', 'Librerías principales'],
    ['src/app/api/agent', 'Endpoints del agente'],
    ['src/app/api/billing', 'Endpoints de facturación'],
    ['src/app/api/usage', 'Endpoints de uso'],
    ['src/app/settings/billing', 'UI de facturación'],
    ['migrations', 'Migraciones de base de datos'],
    ['scripts', 'Scripts de configuración']
  ];
  
  directories.forEach(([dir, description]) => {
    if (!checkFileExists(dir, description)) {
      allChecksPassed = false;
    }
  });
  
  // Resumen final
  log('\n📊 Resumen de verificación:', 'bold');
  
  if (allChecksPassed && stripeConfigured) {
    log('🎉 ¡Setup del Agente AI completado exitosamente!', 'green');
    log('\n🚀 Próximos pasos:', 'blue');
    log('   1. Ejecutar migración en Supabase SQL Editor');
    log('   2. Configurar productos en Stripe');
    log('   3. Probar endpoints del agente');
    log('   4. Configurar cron job para reset mensual');
  } else if (allChecksPassed) {
    log('✅ Setup básico completado, falta configuración de Stripe', 'yellow');
    log('\n🔧 Configuración pendiente:', 'blue');
    log('   1. Configurar variables de Stripe en .env');
    log('   2. Ejecutar: node scripts/setup-stripe-products.js');
    log('   3. Ejecutar migración en Supabase');
  } else {
    log('❌ Setup incompleto, revisar errores arriba', 'red');
    log('\n🔧 Acciones requeridas:', 'blue');
    log('   1. Verificar que todos los archivos estén creados');
    log('   2. Instalar dependencias faltantes: npm install');
    log('   3. Configurar variables de entorno');
  }
  
  log('\n📚 Documentación disponible en: AGENT_AI_IMPLEMENTATION.md', 'blue');
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { main };
