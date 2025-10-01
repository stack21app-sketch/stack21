#!/usr/bin/env node

/**
 * Script para probar el Agente AI básico
 * 
 * Uso:
 *   node scripts/test-agent-ai.js
 */

require('dotenv').config();
const OpenAI = require('openai');

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

async function testOpenAIConnection() {
  log('\n🤖 Probando conexión con OpenAI...', 'blue');
  
  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'sk-temp-key-for-development') {
    log('❌ OPENAI_API_KEY no configurada o es temporal', 'red');
    log('   Configura tu clave real de OpenAI en el archivo .env', 'yellow');
    return false;
  }
  
  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    
    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL_PRIMARY || 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'Eres un asistente AI para Stack21. Responde de forma concisa y profesional.'
        },
        {
          role: 'user',
          content: 'Hola, ¿puedes ayudarme con información sobre mi tienda online?'
        }
      ],
      max_tokens: 150,
      temperature: 0.7,
    });
    
    const answer = response.choices[0]?.message?.content;
    const usage = response.usage;
    
    log('✅ Conexión con OpenAI exitosa!', 'green');
    log(`📝 Respuesta: ${answer}`, 'blue');
    log(`💰 Tokens usados: ${usage?.prompt_tokens || 0} entrada + ${usage?.completion_tokens || 0} salida`, 'blue');
    
    return true;
    
  } catch (error) {
    log('❌ Error conectando con OpenAI:', 'red');
    log(`   ${error.message}`, 'red');
    return false;
  }
}

async function testAgentGuard() {
  log('\n🛡️  Probando sistema de límites...', 'blue');
  
  try {
    // Importar el módulo dinámicamente
    const { checkLimits } = require('../src/lib/agent-guard');
    
    // Test con plan free
    const resultFree = await checkLimits({
      org: {
        id: 'test-org',
        plan: 'free',
        ai_voice_enabled: false,
      },
      usage: {
        chats_used: 15,
        tokens_in: 500,
        tokens_out: 250,
        voice_minutes: 0,
      },
      mode: 'text',
    });
    
    log('✅ Sistema de límites funcionando', 'green');
    log(`📊 Resultado Free (15/20 chats): ${resultFree.ok ? 'OK' : 'BLOQUEADO'}`, 'blue');
    
    // Test con plan pro
    const resultPro = await checkLimits({
      org: {
        id: 'test-org',
        plan: 'pro',
        ai_voice_enabled: false,
      },
      usage: {
        chats_used: 950,
        tokens_in: 10000,
        tokens_out: 5000,
        voice_minutes: 0,
      },
      mode: 'text',
    });
    
    log(`📊 Resultado Pro (950/1000 chats): ${resultPro.ok ? 'OK' : 'BLOQUEADO'}`, 'blue');
    if (resultPro.warning) {
      log(`⚠️  Advertencia: ${resultPro.warning}`, 'yellow');
    }
    
    return true;
    
  } catch (error) {
    log('❌ Error probando sistema de límites:', 'red');
    log(`   ${error.message}`, 'red');
    return false;
  }
}

async function testFAQCache() {
  log('\n💾 Probando sistema de cache...', 'blue');
  
  try {
    // Importar el módulo dinámicamente
    const { shouldCache, generateKeywords } = require('../src/lib/faq-cache');
    
    // Test de cache
    const testAnswers = [
      'Nuestros horarios son de lunes a viernes de 9:00 a 18:00 horas.',
      'Sí',
      'Error en el procesamiento',
      'Puedes hacer tu pedido directamente desde nuestro catálogo online.'
    ];
    
    testAnswers.forEach((answer, index) => {
      const shouldCacheResult = shouldCache(answer);
      log(`📝 Respuesta ${index + 1}: ${shouldCacheResult ? '✅ Cacheable' : '❌ No cacheable'}`, 
          shouldCacheResult ? 'green' : 'yellow');
    });
    
    // Test de keywords
    const testQuestion = '¿Cuáles son los horarios de atención al cliente?';
    const keywords = generateKeywords(testQuestion);
    log(`🔍 Keywords generadas: ${keywords.join(', ')}`, 'blue');
    
    log('✅ Sistema de cache funcionando', 'green');
    return true;
    
  } catch (error) {
    log('❌ Error probando sistema de cache:', 'red');
    log(`   ${error.message}`, 'red');
    return false;
  }
}

async function testUsageSystem() {
  log('\n📊 Probando sistema de uso...', 'blue');
  
  try {
    // Importar el módulo dinámicamente
    const { getLimitsInfo } = require('../src/lib/agent-guard');
    
    // Test de límites por plan
    const plans = ['free', 'pro', 'premium'];
    
    plans.forEach(plan => {
      const limits = getLimitsInfo(plan);
      log(`📋 Plan ${plan.toUpperCase()}:`, 'blue');
      log(`   - Chats: ${limits.chats.soft}/${limits.chats.hard}`, 'blue');
      log(`   - Voz: ${limits.voiceMinutes.soft} min`, 'blue');
      log(`   - Tokens diarios: ${limits.dailyTokens.toLocaleString()}`, 'blue');
      log(`   - Features: ${limits.features.length}`, 'blue');
    });
    
    log('✅ Sistema de uso funcionando', 'green');
    return true;
    
  } catch (error) {
    log('❌ Error probando sistema de uso:', 'red');
    log(`   ${error.message}`, 'red');
    return false;
  }
}

async function main() {
  log('🚀 Iniciando pruebas del Agente AI...', 'bold');
  
  const tests = [
    { name: 'OpenAI Connection', fn: testOpenAIConnection },
    { name: 'Agent Guard', fn: testAgentGuard },
    { name: 'FAQ Cache', fn: testFAQCache },
    { name: 'Usage System', fn: testUsageSystem },
  ];
  
  let passedTests = 0;
  const totalTests = tests.length;
  
  for (const test of tests) {
    try {
      const result = await test.fn();
      if (result) {
        passedTests++;
      }
    } catch (error) {
      log(`❌ Error inesperado en ${test.name}:`, 'red');
      log(`   ${error.message}`, 'red');
    }
  }
  
  // Resumen final
  log('\n📊 Resumen de pruebas:', 'bold');
  log(`✅ Pruebas exitosas: ${passedTests}/${totalTests}`, passedTests === totalTests ? 'green' : 'yellow');
  
  if (passedTests === totalTests) {
    log('🎉 ¡Todas las pruebas pasaron! El Agente AI está listo.', 'green');
    log('\n🚀 Próximos pasos:', 'blue');
    log('   1. Configurar Stripe para facturación');
    log('   2. Ejecutar migración en Supabase');
    log('   3. Probar endpoints en el navegador');
    log('   4. Configurar cron job para reset mensual');
  } else {
    log('⚠️  Algunas pruebas fallaron. Revisa la configuración.', 'yellow');
    log('\n🔧 Posibles soluciones:', 'blue');
    log('   1. Verificar variables de entorno');
    log('   2. Instalar dependencias: npm install');
    log('   3. Revisar logs de error arriba');
  }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { main };
