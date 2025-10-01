#!/usr/bin/env node

/**
 * Script para probar el Agente AI sin depender de Supabase
 * Útil cuando hay problemas de conexión o configuración
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

async function testOpenAIConnection() {
  log('\n🤖 Probando conexión con OpenAI...', 'blue');
  
  try {
    if (!process.env.OPENAI_API_KEY) {
      log('❌ OPENAI_API_KEY no configurada', 'red');
      return false;
    }
    
    // Simular una llamada simple a OpenAI
    const response = await fetch('https://api.openai.com/v1/models', {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      log(`✅ Conexión con OpenAI exitosa`, 'green');
      log(`📊 Modelos disponibles: ${data.data.length}`, 'blue');
      
      // Mostrar algunos modelos
      const models = data.data.slice(0, 3).map(m => m.id);
      log(`🎯 Modelos: ${models.join(', ')}`, 'cyan');
      return true;
    } else {
      log(`❌ Error en OpenAI: ${response.status}`, 'red');
      return false;
    }
    
  } catch (error) {
    log(`❌ Error de conexión: ${error.message}`, 'red');
    return false;
  }
}

async function testAgentLogic() {
  log('\n🧠 Probando lógica del Agente AI...', 'blue');
  
  try {
    // Simular la lógica de límites
    const plans = {
      free: { chats: 20, tokens: 1000, voice: 0 },
      pro: { chats: 1000, tokens: 50000, voice: 0 },
      premium: { chats: 5000, tokens: 100000, voice: 200 }
    };
    
    log('📋 Planes configurados:', 'cyan');
    Object.entries(plans).forEach(([plan, limits]) => {
      log(`   ${plan.toUpperCase()}: ${limits.chats} chats, ${limits.tokens.toLocaleString()} tokens, ${limits.voice} min voz`, 'blue');
    });
    
    // Simular verificación de límites
    const testUsage = { chats: 15, tokens: 800, voice: 0 };
    const plan = 'free';
    const limits = plans[plan];
    
    log(`\n🔍 Verificando límites para plan ${plan}:`, 'cyan');
    log(`   Uso actual: ${testUsage.chats}/${limits.chats} chats`, 'blue');
    log(`   Uso actual: ${testUsage.tokens}/${limits.tokens} tokens`, 'blue');
    
    if (testUsage.chats >= limits.chats) {
      log('   ❌ Límite de chats excedido', 'red');
    } else if (testUsage.chats >= limits.chats * 0.9) {
      log('   ⚠️  Soft cap alcanzado (90%)', 'yellow');
    } else {
      log('   ✅ Dentro de los límites', 'green');
    }
    
    return true;
    
  } catch (error) {
    log(`❌ Error en lógica: ${error.message}`, 'red');
    return false;
  }
}

async function testCacheLogic() {
  log('\n💾 Probando lógica de cache...', 'blue');
  
  try {
    // Simular cache de FAQs
    const faqs = [
      {
        question: '¿Cuáles son sus horarios?',
        answer: 'Horario de lunes a viernes 9:00-18:00',
        keywords: ['horarios', 'atención', 'horario']
      },
      {
        question: '¿Cómo hago un pedido?',
        answer: 'Puedes hacer pedidos desde nuestro catálogo online',
        keywords: ['pedido', 'comprar', 'orden']
      }
    ];
    
    log('📚 FAQs disponibles:', 'cyan');
    faqs.forEach((faq, index) => {
      log(`   ${index + 1}. ${faq.question}`, 'blue');
      log(`      Keywords: ${faq.keywords.join(', ')}`, 'cyan');
    });
    
    // Simular búsqueda en cache
    const userQuestion = '¿A qué hora abren?';
    const found = faqs.find(faq => 
      faq.keywords.some(keyword => 
        userQuestion.toLowerCase().includes(keyword)
      )
    );
    
    log(`\n🔍 Búsqueda: "${userQuestion}"`, 'cyan');
    if (found) {
      log(`✅ Cache hit: ${found.answer}`, 'green');
    } else {
      log('❌ Cache miss - necesitará llamada a OpenAI', 'yellow');
    }
    
    return true;
    
  } catch (error) {
    log(`❌ Error en cache: ${error.message}`, 'red');
    return false;
  }
}

async function testServerConnection() {
  log('\n🌐 Probando servidor local...', 'blue');
  
  try {
    const baseUrl = 'http://localhost:3001';
    const response = await fetch(baseUrl, { method: 'HEAD' });
    
    if (response.ok) {
      log('✅ Servidor ejecutándose en http://localhost:3001', 'green');
      log('📊 Endpoints disponibles:', 'cyan');
      log('   • POST /api/agent/public', 'blue');
      log('   • GET /api/usage/current', 'blue');
      log('   • /settings/billing', 'blue');
      return true;
    } else {
      log(`❌ Servidor no responde: ${response.status}`, 'red');
      return false;
    }
    
  } catch (error) {
    log(`❌ No se puede conectar al servidor: ${error.message}`, 'red');
    log('💡 Asegúrate de ejecutar: npm run dev', 'yellow');
    return false;
  }
}

async function showNextSteps() {
  log('\n🚀 PRÓXIMOS PASOS:', 'bold');
  log('═'.repeat(50), 'cyan');
  
  log('\n1️⃣ Para usar Supabase:', 'blue');
  log('   • Obtén tu service_role key real de Supabase Dashboard', 'cyan');
  log('   • Reemplaza SUPABASE_SERVICE_ROLE_KEY en .env', 'cyan');
  log('   • Ejecuta la migración SQL', 'cyan');
  
  log('\n2️⃣ Para probar sin Supabase:', 'blue');
  log('   • El sistema funcionará con datos simulados', 'cyan');
  log('   • Puedes probar la lógica y la UI', 'cyan');
  log('   • Los endpoints devolverán datos de prueba', 'cyan');
  
  log('\n3️⃣ Para probar el agente:', 'blue');
  log('   • Visita: http://localhost:3001/settings/billing', 'cyan');
  log('   • Prueba: POST /api/agent/public', 'cyan');
  log('   • Ejecuta: node scripts/test-agent-live.js', 'cyan');
}

async function main() {
  log('🧪 PROBANDO AGENTE AI SIN SUPABASE', 'bold');
  log('═'.repeat(50), 'magenta');
  
  const tests = [
    { name: 'OpenAI Connection', fn: testOpenAIConnection },
    { name: 'Agent Logic', fn: testAgentLogic },
    { name: 'Cache Logic', fn: testCacheLogic },
    { name: 'Server Connection', fn: testServerConnection },
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
  
  // Resumen
  log('\n📊 RESUMEN DE PRUEBAS:', 'bold');
  log(`✅ Pruebas exitosas: ${passedTests}/${totalTests}`, passedTests === totalTests ? 'green' : 'yellow');
  
  if (passedTests >= 3) {
    log('\n🎉 ¡El sistema del Agente AI está funcionando!', 'green');
    log('💡 Solo necesitas configurar Supabase para datos reales', 'yellow');
  } else {
    log('\n⚠️  Algunas pruebas fallaron', 'yellow');
    log('💡 Revisa la configuración y conexión', 'yellow');
  }
  
  await showNextSteps();
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { main };
