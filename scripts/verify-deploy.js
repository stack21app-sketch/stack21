#!/usr/bin/env node

/**
 * 🔍 Script de Verificación Post-Deploy - Stack21
 * 
 * Verifica que todos los componentes críticos funcionen después del deploy
 */

const https = require('https');
const http = require('http');

// Configuración
const config = {
  baseUrl: process.env.DEPLOY_URL || 'http://localhost:3000',
  timeout: 10000,
};

// Colores para output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

// Resultados
const results = {
  passed: 0,
  failed: 0,
  warnings: 0,
  tests: [],
};

// Helper: Hacer request HTTP
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const lib = url.startsWith('https:') ? https : http;
    const timeout = setTimeout(() => {
      reject(new Error('Request timeout'));
    }, config.timeout);

    const req = lib.get(url, options, (res) => {
      clearTimeout(timeout);
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data,
        });
      });
    });

    req.on('error', (err) => {
      clearTimeout(timeout);
      reject(err);
    });
  });
}

// Helper: Log con color
function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Helper: Registrar resultado
function recordResult(name, passed, message) {
  results.tests.push({ name, passed, message });
  if (passed) {
    results.passed++;
    log(`  ✅ ${name}`, 'green');
  } else {
    results.failed++;
    log(`  ❌ ${name}`, 'red');
    if (message) log(`     ${message}`, 'yellow');
  }
}

// Helper: Warning
function recordWarning(name, message) {
  results.warnings++;
  results.tests.push({ name, passed: true, warning: true, message });
  log(`  ⚠️  ${name}`, 'yellow');
  if (message) log(`     ${message}`, 'cyan');
}

// Tests

async function testHealthEndpoint() {
  log('\n📍 Testing Health Endpoint...', 'blue');
  try {
    const res = await makeRequest(`${config.baseUrl}/api/health`);
    
    if (res.statusCode === 200) {
      const data = JSON.parse(res.body);
      recordResult('Health endpoint responds', data.status === 'ok', null);
    } else {
      recordResult('Health endpoint responds', false, `Status ${res.statusCode}`);
    }
  } catch (err) {
    recordResult('Health endpoint responds', false, err.message);
  }
}

async function testAppsAPI() {
  log('\n📱 Testing Apps API...', 'blue');
  
  // Test 1: List apps
  try {
    const res = await makeRequest(`${config.baseUrl}/api/apps?limit=5`);
    
    if (res.statusCode === 200) {
      const data = JSON.parse(res.body);
      const hasApps = data.apps && data.apps.length > 0;
      recordResult('Apps API lists applications', hasApps, null);
      
      if (hasApps) {
        recordResult('Apps have required fields', 
          data.apps[0].slug && data.apps[0].name && data.apps[0].category,
          null
        );
      }
    } else {
      recordResult('Apps API lists applications', false, `Status ${res.statusCode}`);
    }
  } catch (err) {
    recordResult('Apps API lists applications', false, err.message);
  }
  
  // Test 2: Search functionality
  try {
    const res = await makeRequest(`${config.baseUrl}/api/apps?search=github`);
    
    if (res.statusCode === 200) {
      const data = JSON.parse(res.body);
      recordResult('Apps API search works', data.apps && data.apps.length > 0, null);
    } else {
      recordResult('Apps API search works', false, `Status ${res.statusCode}`);
    }
  } catch (err) {
    recordResult('Apps API search works', false, err.message);
  }
  
  // Test 3: Specific app
  try {
    const res = await makeRequest(`${config.baseUrl}/api/apps/github`);
    
    if (res.statusCode === 200) {
      const data = JSON.parse(res.body);
      recordResult('Apps API returns specific app', data.app && data.app.slug === 'github', null);
    } else {
      recordResult('Apps API returns specific app', false, `Status ${res.statusCode}`);
    }
  } catch (err) {
    recordResult('Apps API returns specific app', false, err.message);
  }
}

async function testConnectionsAPI() {
  log('\n🔗 Testing Connections API...', 'blue');
  
  try {
    const res = await makeRequest(`${config.baseUrl}/api/connections`);
    
    if (res.statusCode === 200) {
      const data = JSON.parse(res.body);
      recordResult('Connections API responds', true, null);
      
      if (data.connections && Array.isArray(data.connections)) {
        recordResult('Connections API returns array', true, null);
      } else {
        recordWarning('Connections API format', 'Response format unexpected');
      }
    } else if (res.statusCode === 401) {
      recordWarning('Connections API auth', 'Authentication required (expected in production)');
    } else {
      recordResult('Connections API responds', false, `Status ${res.statusCode}`);
    }
  } catch (err) {
    recordResult('Connections API responds', false, err.message);
  }
}

async function testWorkflowsAPI() {
  log('\n⚡ Testing Workflows API...', 'blue');
  
  try {
    const res = await makeRequest(`${config.baseUrl}/api/workflows`);
    
    if (res.statusCode === 200) {
      const data = JSON.parse(res.body);
      recordResult('Workflows API responds', true, null);
      
      if (data.workflows && Array.isArray(data.workflows)) {
        recordResult('Workflows API returns array', true, null);
      } else {
        recordWarning('Workflows API format', 'Response format unexpected');
      }
    } else if (res.statusCode === 401) {
      recordWarning('Workflows API auth', 'Authentication required (expected in production)');
    } else {
      recordResult('Workflows API responds', false, `Status ${res.statusCode}`);
    }
  } catch (err) {
    recordResult('Workflows API responds', false, err.message);
  }
}

async function testTemplatesAPI() {
  log('\n📚 Testing Templates API...', 'blue');
  
  try {
    const res = await makeRequest(`${config.baseUrl}/api/templates`);
    
    if (res.statusCode === 200) {
      const data = JSON.parse(res.body);
      recordResult('Templates API responds', true, null);
      
      if (data.templates && Array.isArray(data.templates)) {
        recordResult('Templates API returns array', true, null);
        
        if (data.templates.length > 0) {
          recordResult('Templates are available', true, null);
        } else {
          recordWarning('Templates count', 'No templates found');
        }
      } else {
        recordWarning('Templates API format', 'Response format unexpected');
      }
    } else if (res.statusCode === 401) {
      recordWarning('Templates API auth', 'Authentication required (expected in production)');
    } else {
      recordResult('Templates API responds', false, `Status ${res.statusCode}`);
    }
  } catch (err) {
    recordResult('Templates API responds', false, err.message);
  }
}

async function testUIPages() {
  log('\n🎨 Testing UI Pages...', 'blue');
  
  const pages = [
    { url: '/', name: 'Landing page' },
    { url: '/apps', name: 'Apps directory' },
    { url: '/connections', name: 'Connections page' },
    { url: '/workflows', name: 'Workflows page' },
    { url: '/runs', name: 'Runs page' },
    { url: '/templates', name: 'Templates page' },
    { url: '/ai-builder', name: 'AI Builder page' },
    { url: '/dashboard', name: 'Dashboard' },
  ];
  
  for (const page of pages) {
    try {
      const res = await makeRequest(`${config.baseUrl}${page.url}`);
      
      if (res.statusCode === 200) {
        recordResult(`${page.name} loads`, true, null);
      } else if (res.statusCode === 302 || res.statusCode === 307) {
        recordWarning(`${page.name} redirect`, 'Page redirects (might need auth)');
      } else {
        recordResult(`${page.name} loads`, false, `Status ${res.statusCode}`);
      }
    } catch (err) {
      recordResult(`${page.name} loads`, false, err.message);
    }
  }
}

async function testSecurityHeaders() {
  log('\n🔒 Testing Security Headers...', 'blue');
  
  try {
    const res = await makeRequest(`${config.baseUrl}/`);
    
    const requiredHeaders = [
      { name: 'x-frame-options', value: 'DENY' },
      { name: 'x-content-type-options', value: 'nosniff' },
    ];
    
    for (const header of requiredHeaders) {
      const value = res.headers[header.name];
      if (value && value.toLowerCase() === header.value.toLowerCase()) {
        recordResult(`Security header: ${header.name}`, true, null);
      } else {
        recordWarning(`Security header: ${header.name}`, `Expected "${header.value}", got "${value || 'none'}"`);
      }
    }
    
    // Check for HTTPS in production
    if (config.baseUrl.startsWith('https://')) {
      const hsts = res.headers['strict-transport-security'];
      if (hsts) {
        recordResult('HTTPS enforced (HSTS)', true, null);
      } else {
        recordWarning('HTTPS enforced (HSTS)', 'HSTS header not found');
      }
    }
  } catch (err) {
    recordWarning('Security headers check', err.message);
  }
}

// Resumen final
function printSummary() {
  log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'cyan');
  log('📊 RESUMEN DE VERIFICACIÓN', 'cyan');
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'cyan');
  
  const total = results.passed + results.failed;
  const percentage = total > 0 ? Math.round((results.passed / total) * 100) : 0;
  
  log(`\n✅ Passed:   ${results.passed}/${total} (${percentage}%)`, 'green');
  log(`❌ Failed:   ${results.failed}/${total}`, results.failed > 0 ? 'red' : 'reset');
  log(`⚠️  Warnings: ${results.warnings}`, results.warnings > 0 ? 'yellow' : 'reset');
  
  log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'cyan');
  
  if (results.failed === 0 && results.warnings === 0) {
    log('\n🎉 ¡TODO PERFECTO! Stack21 está funcionando correctamente.', 'green');
    process.exit(0);
  } else if (results.failed === 0) {
    log('\n✅ Tests pasaron pero hay advertencias. Revisa los detalles arriba.', 'yellow');
    process.exit(0);
  } else {
    log('\n❌ Algunos tests fallaron. Revisa los errores arriba.', 'red');
    process.exit(1);
  }
}

// Main
async function main() {
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'cyan');
  log('🔍 VERIFICACIÓN POST-DEPLOY - STACK21', 'cyan');
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'cyan');
  log(`\n🌐 URL: ${config.baseUrl}`, 'blue');
  log(`⏱️  Timeout: ${config.timeout}ms`, 'blue');
  
  try {
    await testHealthEndpoint();
    await testAppsAPI();
    await testConnectionsAPI();
    await testWorkflowsAPI();
    await testTemplatesAPI();
    await testUIPages();
    await testSecurityHeaders();
    
    printSummary();
  } catch (err) {
    log(`\n❌ Error fatal: ${err.message}`, 'red');
    process.exit(1);
  }
}

// Ejecutar
main();

