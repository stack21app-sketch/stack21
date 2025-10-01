#!/usr/bin/env node

/**
 * Script para ejecutar la migración del Agente AI en Supabase
 * 
 * Este script te guiará paso a paso para ejecutar la migración
 */

require('dotenv').config();

const fs = require('fs');
const path = require('path');

const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function main() {
  log('🚀 MIGRACIÓN DEL AGENTE AI PARA SUPABASE', 'bold');
  log('═'.repeat(50), 'cyan');
  
  // Verificar variables de entorno
  log('\n📋 Verificando configuración...', 'blue');
  
  const requiredEnvVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'SUPABASE_SERVICE_ROLE_KEY'
  ];
  
  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    log('❌ Variables de entorno faltantes:', 'red');
    missingVars.forEach(varName => {
      log(`   - ${varName}`, 'red');
    });
    log('\n💡 Asegúrate de tener un archivo .env con las variables de Supabase', 'yellow');
    return;
  }
  
  log('✅ Variables de entorno configuradas', 'green');
  
  // Leer el archivo de migración
  const migrationPath = path.join(__dirname, '../migrations/agent-ai-billing.sql');
  
  if (!fs.existsSync(migrationPath)) {
    log('❌ Archivo de migración no encontrado:', 'red');
    log(`   ${migrationPath}`, 'red');
    return;
  }
  
  const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
  
  log('✅ Archivo de migración encontrado', 'green');
  log(`📄 Tamaño: ${(migrationSQL.length / 1024).toFixed(1)} KB`, 'blue');
  
  // Mostrar información de la migración
  log('\n📊 CONTENIDO DE LA MIGRACIÓN:', 'bold');
  log('═'.repeat(50), 'cyan');
  
  const migrationParts = [
    { name: 'Tipos enum', desc: 'Plan types (free, pro, premium)' },
    { name: 'Tabla workspaces', desc: 'Agregar campos de plan y AI' },
    { name: 'usage_counters', desc: 'Contadores de uso mensual' },
    { name: 'agent_action_logs', desc: 'Logs de acciones del agente' },
    { name: 'org_faqs', desc: 'FAQs por organización' },
    { name: 'agent_cache', desc: 'Cache de respuestas' },
    { name: 'billing_addons', desc: 'Add-ons de facturación' },
    { name: 'Índices', desc: 'Optimización de rendimiento' },
    { name: 'Funciones', desc: 'Helpers para uso y cache' },
    { name: 'Políticas RLS', desc: 'Seguridad por organización' },
    { name: 'FAQs ejemplo', desc: 'Datos iniciales' }
  ];
  
  migrationParts.forEach((part, index) => {
    log(`   ${index + 1}. ${part.name}`, 'blue');
    log(`      ${part.desc}`, 'cyan');
  });
  
  // Instrucciones paso a paso
  log('\n🎯 INSTRUCCIONES PARA EJECUTAR LA MIGRACIÓN:', 'bold');
  log('═'.repeat(50), 'cyan');
  
  log('\n1️⃣ Abre tu panel de Supabase:', 'blue');
  log('   • Ve a https://supabase.com/dashboard', 'cyan');
  log('   • Selecciona tu proyecto', 'cyan');
  
  log('\n2️⃣ Abre el SQL Editor:', 'blue');
  log('   • En el menú lateral, haz clic en "SQL Editor"', 'cyan');
  log('   • Haz clic en "New Query"', 'cyan');
  
  log('\n3️⃣ Copia y pega el SQL:', 'blue');
  log('   • Copia TODO el contenido del archivo de migración', 'cyan');
  log('   • Pégalo en el editor SQL', 'cyan');
  
  log('\n4️⃣ Ejecuta la migración:', 'blue');
  log('   • Haz clic en "Run" (o Ctrl+Enter)', 'cyan');
  log('   • Espera a que termine (puede tomar 30-60 segundos)', 'cyan');
  
  log('\n5️⃣ Verifica el resultado:', 'blue');
  log('   • Deberías ver "Success. No rows returned"', 'cyan');
  log('   • Ve a "Table Editor" para verificar las nuevas tablas', 'cyan');
  
  // Mostrar el SQL completo
  log('\n📄 CONTENIDO COMPLETO DE LA MIGRACIÓN:', 'bold');
  log('═'.repeat(50), 'cyan');
  log('(Copia desde aquí hasta el final)', 'yellow');
  log('', 'reset');
  
  console.log(migrationSQL);
  
  log('\n🎉 DESPUÉS DE EJECUTAR LA MIGRACIÓN:', 'bold');
  log('═'.repeat(50), 'cyan');
  
  log('\n✅ Podrás probar:', 'green');
  log('   • POST /api/agent/public - Chat público del agente', 'blue');
  log('   • GET /api/usage/current - Estado de uso actual', 'blue');
  log('   • /settings/billing - UI de gestión de planes', 'blue');
  
  log('\n✅ El sistema incluirá:', 'green');
  log('   • 3 planes de suscripción (Free/Pro/Premium)', 'blue');
  log('   • Control de límites automático', 'blue');
  log('   • Cache inteligente para FAQs', 'blue');
  log('   • Monitoreo de uso en tiempo real', 'blue');
  log('   • Sistema de facturación preparado', 'blue');
  
  log('\n🚀 ¡Tu Agente AI estará listo para generar ingresos!', 'bold');
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { main };
