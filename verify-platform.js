#!/usr/bin/env node

const https = require('https');
const http = require('http');

const BASE_URL = 'http://localhost:3000';

// Función para hacer requests
function makeRequest(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    
    client.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve({ status: res.statusCode, data: json });
        } catch (e) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    }).on('error', reject);
  });
}

// Tests de verificación
async function runTests() {
  console.log('🔍 Verificando Stack21...\n');
  
  const tests = [
    {
      name: 'Servidor funcionando',
      url: `${BASE_URL}/api/health/public`,
      expectedStatus: 200,
      check: (data) => data.status === 'ok'
    },
    {
      name: 'Página principal',
      url: `${BASE_URL}/`,
      expectedStatus: 200,
      check: (data) => typeof data === 'string' && data.includes('Stack21')
    },
    {
      name: 'Página de login',
      url: `${BASE_URL}/auth/signin`,
      expectedStatus: 200,
      check: (data) => typeof data === 'string' && data.includes('Iniciar Sesión')
    },
    {
      name: 'API Analytics (sin auth)',
      url: `${BASE_URL}/api/analytics`,
      expectedStatus: 401,
      check: (data) => data.error === 'No autorizado'
    },
    {
      name: 'API Workflows (sin auth)',
      url: `${BASE_URL}/api/workflows`,
      expectedStatus: 401,
      check: (data) => data.error === 'No autorizado'
    }
  ];

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    try {
      console.log(`⏳ ${test.name}...`);
      const result = await makeRequest(test.url);
      
      if (result.status === test.expectedStatus) {
        if (test.check && test.check(result.data)) {
          console.log(`✅ ${test.name} - OK`);
          passed++;
        } else {
          console.log(`❌ ${test.name} - Falló verificación de datos`);
          failed++;
        }
      } else {
        console.log(`❌ ${test.name} - Status ${result.status}, esperado ${test.expectedStatus}`);
        failed++;
      }
    } catch (error) {
      console.log(`❌ ${test.name} - Error: ${error.message}`);
      failed++;
    }
  }

  console.log(`\n📊 Resultados:`);
  console.log(`✅ Pasaron: ${passed}`);
  console.log(`❌ Fallaron: ${failed}`);
  console.log(`📈 Éxito: ${Math.round((passed / (passed + failed)) * 100)}%`);

  if (failed === 0) {
    console.log('\n🎉 ¡Stack21 está funcionando correctamente!');
  } else {
    console.log('\n⚠️  Hay algunos problemas que necesitan atención.');
  }
}

runTests().catch(console.error);
