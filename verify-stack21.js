#!/usr/bin/env node

const https = require('https');
const http = require('http');

// Colores para la consola
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

function makeRequest(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https:') ? https : http;
    
    const req = client.request(url, { 
      method: 'GET',
      timeout: 10000,
      headers: {
        'User-Agent': 'Stack21-Verification/1.0'
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          data: data.substring(0, 500) // Solo primeros 500 caracteres
        });
      });
    });

    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    req.end();
  });
}

async function verifyEndpoint(url, expectedContent = null) {
  try {
    const response = await makeRequest(url);
    
    if (response.status >= 200 && response.status < 400) {
      if (expectedContent && response.data.includes(expectedContent)) {
        log(`✅ ${url} - Status: ${response.status} - Content: ✓`, 'green');
        return true;
      } else if (!expectedContent) {
        log(`✅ ${url} - Status: ${response.status}`, 'green');
        return true;
      } else {
        log(`⚠️  ${url} - Status: ${response.status} - Content: ✗ (Expected: ${expectedContent})`, 'yellow');
        return false;
      }
    } else {
      log(`❌ ${url} - Status: ${response.status}`, 'red');
      return false;
    }
  } catch (error) {
    log(`❌ ${url} - Error: ${error.message}`, 'red');
    return false;
  }
}

async function main() {
  log('🚀 Verificando Stack21 - Estado Completo de la Plataforma', 'bold');
  log('=' .repeat(60), 'blue');
  
  const baseUrl = 'http://localhost:3000';
  let totalTests = 0;
  let passedTests = 0;

  // Páginas principales
  const pages = [
    { url: `${baseUrl}/`, content: 'Stack21' },
    { url: `${baseUrl}/dashboard`, content: 'Stack21' },
    { url: `${baseUrl}/dashboard/workflows`, content: 'Workflows' },
    { url: `${baseUrl}/dashboard/chatbot`, content: 'Chatbot' },
    { url: `${baseUrl}/dashboard/emails`, content: 'Emails' },
    { url: `${baseUrl}/dashboard/analytics`, content: 'Analytics' },
    { url: `${baseUrl}/workflow-builder`, content: 'Workflow' },
    { url: `${baseUrl}/auth/signin`, content: 'Sesión' }
  ];

  log('\n📄 Verificando Páginas:', 'bold');
  for (const page of pages) {
    totalTests++;
    if (await verifyEndpoint(page.url, page.content)) {
      passedTests++;
    }
  }

  // APIs
  const apis = [
    { url: `${baseUrl}/api/health`, content: 'ok' },
    { url: `${baseUrl}/api/workflows`, content: null },
    { url: `${baseUrl}/api/notifications`, content: null },
    { url: `${baseUrl}/api/analytics`, content: null }
  ];

  log('\n🔌 Verificando APIs:', 'bold');
  for (const api of apis) {
    totalTests++;
    if (await verifyEndpoint(api.url, api.content)) {
      passedTests++;
    }
  }

  // Resumen
  log('\n' + '=' .repeat(60), 'blue');
  log('📊 RESUMEN DE VERIFICACIÓN:', 'bold');
  log(`Total de tests: ${totalTests}`, 'blue');
  log(`Pasaron: ${passedTests}`, 'green');
  log(`Fallaron: ${totalTests - passedTests}`, totalTests - passedTests > 0 ? 'red' : 'green');
  
  const successRate = Math.round((passedTests / totalTests) * 100);
  log(`Tasa de éxito: ${successRate}%`, successRate >= 90 ? 'green' : successRate >= 70 ? 'yellow' : 'red');

  if (successRate >= 90) {
    log('\n🎉 ¡Stack21 está funcionando perfectamente!', 'green');
    log('✅ La plataforma está lista para usar', 'green');
  } else if (successRate >= 70) {
    log('\n⚠️  Stack21 funciona bien con algunos problemas menores', 'yellow');
    log('🔧 Revisa los elementos marcados con ❌', 'yellow');
  } else {
    log('\n❌ Stack21 tiene problemas significativos', 'red');
    log('🚨 Revisa la configuración y los errores', 'red');
  }

  log('\n🔗 URLs principales:');
  log(`   • Dashboard: ${baseUrl}/dashboard`, 'blue');
  log(`   • Workflows: ${baseUrl}/dashboard/workflows`, 'blue');
  log(`   • Chatbots: ${baseUrl}/dashboard/chatbot`, 'blue');
  log(`   • Emails: ${baseUrl}/dashboard/emails`, 'blue');
  log(`   • Analytics: ${baseUrl}/dashboard/analytics`, 'blue');
  log(`   • Builder: ${baseUrl}/workflow-builder`, 'blue');
}

// Ejecutar verificación
main().catch(console.error);
