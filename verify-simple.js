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
      timeout: 5000,
      headers: {
        'User-Agent': 'Stack21-Verification/1.0'
      }
    }, (res) => {
      resolve({ status: res.statusCode });
    });

    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    req.end();
  });
}

async function verifyEndpoint(url) {
  try {
    const response = await makeRequest(url);
    
    if (response.status >= 200 && response.status < 400) {
      log(`✅ ${url} - Status: ${response.status}`, 'green');
      return true;
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
  log('🚀 Verificación Simple de Stack21', 'bold');
  log('=' .repeat(50), 'blue');
  
  const baseUrl = 'http://localhost:3000';
  let totalTests = 0;
  let passedTests = 0;

  // URLs a verificar
  const urls = [
    `${baseUrl}/`,
    `${baseUrl}/dashboard`,
    `${baseUrl}/dashboard/workflows`,
    `${baseUrl}/dashboard/chatbot`,
    `${baseUrl}/dashboard/emails`,
    `${baseUrl}/dashboard/analytics`,
    `${baseUrl}/workflow-builder`,
    `${baseUrl}/auth/signin`,
    `${baseUrl}/api/health`,
    `${baseUrl}/api/workflows`,
    `${baseUrl}/api/notifications`,
    `${baseUrl}/api/analytics`
  ];

  for (const url of urls) {
    totalTests++;
    if (await verifyEndpoint(url)) {
      passedTests++;
    }
  }

  // Resumen
  log('\n' + '=' .repeat(50), 'blue');
  log('📊 RESUMEN:', 'bold');
  log(`Total: ${totalTests} | Pasaron: ${passedTests} | Fallaron: ${totalTests - passedTests}`, 'blue');
  
  const successRate = Math.round((passedTests / totalTests) * 100);
  log(`Tasa de éxito: ${successRate}%`, successRate >= 90 ? 'green' : successRate >= 70 ? 'yellow' : 'red');

  if (successRate >= 90) {
    log('\n🎉 ¡Stack21 está funcionando perfectamente!', 'green');
  } else if (successRate >= 70) {
    log('\n⚠️  Stack21 funciona bien con algunos problemas menores', 'yellow');
  } else {
    log('\n❌ Stack21 tiene problemas', 'red');
  }
}

main().catch(console.error);
