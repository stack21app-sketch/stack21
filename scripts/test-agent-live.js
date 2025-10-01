#!/usr/bin/env node

/**
 * Script para probar el Agente AI en vivo después de la migración
 * 
 * Uso:
 *   node scripts/test-agent-live.js
 */

require('dotenv').config();

const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function testAgentAPI() {
  log('\n🤖 Probando API del Agente AI...', 'blue');
  
  try {
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    
    // Test 1: Chat público del agente
    log('\n1️⃣ Probando chat público...', 'cyan');
    
    const testMessage = {
      handle: 'test-org', // Asegúrate de que esta organización existe
      message: '¿Cuáles son sus horarios de atención?',
      context: {
        mode: 'text',
        userAgent: 'Test Script'
      }
    };
    
    log(`   📤 Enviando: "${testMessage.message}"`, 'blue');
    log(`   🎯 A organización: ${testMessage.handle}`, 'blue');
    
    const response = await fetch(`${baseUrl}/api/agent/public`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testMessage)
    });
    
    if (response.ok) {
      const data = await response.json();
      log('   ✅ Respuesta recibida:', 'green');
      log(`      💬 Agente: "${data.answer}"`, 'green');
      log(`      📊 Tokens: ${data.tokens_in} entrada + ${data.tokens_out} salida`, 'blue');
      log(`      💾 Cache: ${data.cached ? 'Hit' : 'Miss'}`, data.cached ? 'green' : 'yellow');
      log(`      ⏱️  Duración: ${data.duration_ms}ms`, 'blue');
    } else {
      const error = await response.text();
      log(`   ❌ Error: ${response.status} - ${error}`, 'red');
    }
    
  } catch (error) {
    log(`   ❌ Error de conexión: ${error.message}`, 'red');
    log('   💡 Asegúrate de que el servidor esté ejecutándose', 'yellow');
  }
}

async function testUsageAPI() {
  log('\n📊 Probando API de uso...', 'blue');
  
  try {
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    
    // Test 2: Estado de uso actual
    log('\n2️⃣ Probando estado de uso...', 'cyan');
    
    const response = await fetch(`${baseUrl}/api/usage/current?organizationId=test-org-id`, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer test-token' // En producción usarías un token real
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      log('   ✅ Estado de uso recibido:', 'green');
      log(`      📈 Plan: ${data.plan}`, 'blue');
      log(`      💬 Chats: ${data.currentUsage?.chats_used || 0}/${data.limits?.chats?.hard || 0}`, 'blue');
      log(`      🔢 Tokens: ${data.currentUsage?.tokens_in || 0} entrada`, 'blue');
    } else {
      const error = await response.text();
      log(`   ❌ Error: ${response.status} - ${error}`, 'red');
    }
    
  } catch (error) {
    log(`   ❌ Error de conexión: ${error.message}`, 'red');
  }
}

async function showNextSteps() {
  log('\n🚀 PRÓXIMOS PASOS DESPUÉS DE LA MIGRACIÓN:', 'bold');
  log('═'.repeat(50), 'cyan');
  
  log('\n1️⃣ Verificar la migración:', 'blue');
  log('   • Ve a Supabase → Table Editor', 'cyan');
  log('   • Deberías ver las nuevas tablas:', 'cyan');
  log('     - usage_counters', 'cyan');
  log('     - agent_action_logs', 'cyan');
  log('     - org_faqs', 'cyan');
  log('     - agent_cache', 'cyan');
  log('     - billing_addons', 'cyan');
  
  log('\n2️⃣ Iniciar el servidor de desarrollo:', 'blue');
  log('   npm run dev', 'cyan');
  
  log('\n3️⃣ Probar en el navegador:', 'blue');
  log('   • http://localhost:3000/settings/billing', 'cyan');
  log('   • Deberías ver la UI de gestión de planes', 'cyan');
  
  log('\n4️⃣ Probar el agente:', 'blue');
  log('   • Haz una petición POST a /api/agent/public', 'cyan');
  log('   • O usa el script de prueba:', 'cyan');
  log('     node scripts/test-agent-live.js', 'cyan');
  
  log('\n5️⃣ Configurar Stripe (opcional):', 'blue');
  log('   • node scripts/setup-stripe-products.js', 'cyan');
  log('   • Configurar variables de Stripe en .env', 'cyan');
  
  log('\n6️⃣ Configurar cron job para reset mensual:', 'blue');
  log('   • Programar reset_monthly_usage_counters()', 'cyan');
  log('   • Ejecutar el día 1 de cada mes', 'cyan');
}

async function main() {
  log('🎉 PROBANDO AGENTE AI EN VIVO', 'bold');
  log('═'.repeat(50), 'magenta');
  
  log('\n📋 Verificando configuración...', 'blue');
  
  // Verificar variables de entorno
  const requiredVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'SUPABASE_SERVICE_ROLE_KEY',
    'OPENAI_API_KEY'
  ];
  
  const missingVars = requiredVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    log('❌ Variables de entorno faltantes:', 'red');
    missingVars.forEach(varName => {
      log(`   - ${varName}`, 'red');
    });
    log('\n💡 Configura estas variables en tu archivo .env', 'yellow');
    return;
  }
  
  log('✅ Variables de entorno configuradas', 'green');
  
  // Probar APIs
  await testAgentAPI();
  await testUsageAPI();
  
  // Mostrar próximos pasos
  await showNextSteps();
  
  log('\n🎯 ¡Tu Agente AI está listo para generar ingresos!', 'bold');
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { main };
