#!/usr/bin/env node

const dns = require('dns').promises;
const https = require('https');
const fs = require('fs');
const path = require('path');

console.log('🔍 VERIFICACIÓN DE DOMINIO - STACK21');
console.log('===================================\n');

async function verifyDomain(domain) {
  console.log(`🌐 Verificando dominio: ${domain}\n`);

  try {
    // 1. Verificar DNS A record
    console.log('1️⃣ Verificando DNS A record...');
    const addresses = await dns.resolve4(domain);
    console.log(`   ✅ A record: ${addresses.join(', ')}`);
    
    // Verificar que apunte a Vercel
    const vercelIPs = ['76.76.19.61', '76.76.21.61'];
    const isVercelIP = addresses.some(addr => vercelIPs.includes(addr));
    if (isVercelIP) {
      console.log('   ✅ Apunta a Vercel');
    } else {
      console.log('   ⚠️  No apunta a Vercel (puede estar en CDN)');
    }

    // 2. Verificar HTTPS
    console.log('\n2️⃣ Verificando HTTPS...');
    await verifyHTTPS(domain);

    // 3. Verificar headers de seguridad
    console.log('\n3️⃣ Verificando headers de seguridad...');
    await verifySecurityHeaders(domain);

    // 4. Verificar API endpoints
    console.log('\n4️⃣ Verificando API endpoints...');
    await verifyAPIEndpoints(domain);

    // 5. Verificar performance
    console.log('\n5️⃣ Verificando performance...');
    await verifyPerformance(domain);

    console.log('\n✅ Verificación completada!');
    console.log(`🌐 Tu sitio está disponible en: https://${domain}`);

  } catch (error) {
    console.error('❌ Error verificando dominio:', error.message);
    process.exit(1);
  }
}

async function verifyHTTPS(domain) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: domain,
      port: 443,
      path: '/',
      method: 'HEAD',
      timeout: 10000
    };

    const req = https.request(options, (res) => {
      console.log(`   ✅ HTTPS: ${res.statusCode}`);
      console.log(`   ✅ SSL: ${res.socket.getProtocol()}`);
      resolve();
    });

    req.on('error', (error) => {
      console.log(`   ❌ HTTPS Error: ${error.message}`);
      reject(error);
    });

    req.on('timeout', () => {
      console.log('   ⚠️  Timeout verificando HTTPS');
      req.destroy();
      reject(new Error('Timeout'));
    });

    req.end();
  });
}

async function verifySecurityHeaders(domain) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: domain,
      port: 443,
      path: '/',
      method: 'HEAD',
      timeout: 10000
    };

    const req = https.request(options, (res) => {
      const headers = res.headers;
      
      const securityHeaders = {
        'x-frame-options': 'X-Frame-Options',
        'x-content-type-options': 'X-Content-Type-Options',
        'referrer-policy': 'Referrer-Policy',
        'strict-transport-security': 'Strict-Transport-Security'
      };

      Object.entries(securityHeaders).forEach(([key, name]) => {
        if (headers[key]) {
          console.log(`   ✅ ${name}: ${headers[key]}`);
        } else {
          console.log(`   ⚠️  ${name}: No configurado`);
        }
      });

      resolve();
    });

    req.on('error', (error) => {
      console.log(`   ❌ Error verificando headers: ${error.message}`);
      reject(error);
    });

    req.end();
  });
}

async function verifyAPIEndpoints(domain) {
  const endpoints = [
    '/api/status',
    '/api/analytics',
    '/api/workflows'
  ];

  for (const endpoint of endpoints) {
    try {
      await new Promise((resolve, reject) => {
        const options = {
          hostname: domain,
          port: 443,
          path: endpoint,
          method: 'GET',
          timeout: 5000
        };

        const req = https.request(options, (res) => {
          console.log(`   ✅ ${endpoint}: ${res.statusCode}`);
          resolve();
        });

        req.on('error', (error) => {
          console.log(`   ⚠️  ${endpoint}: ${error.message}`);
          resolve(); // No fallar por endpoints opcionales
        });

        req.end();
      });
    } catch (error) {
      console.log(`   ⚠️  ${endpoint}: Error`);
    }
  }
}

async function verifyPerformance(domain) {
  const start = Date.now();
  
  try {
    await new Promise((resolve, reject) => {
      const options = {
        hostname: domain,
        port: 443,
        path: '/',
        method: 'GET',
        timeout: 10000
      };

      const req = https.request(options, (res) => {
        const end = Date.now();
        const duration = end - start;
        
        console.log(`   ✅ Tiempo de respuesta: ${duration}ms`);
        
        if (duration < 1000) {
          console.log('   ✅ Performance: Excelente');
        } else if (duration < 2000) {
          console.log('   ✅ Performance: Buena');
        } else {
          console.log('   ⚠️  Performance: Lenta');
        }
        
        resolve();
      });

      req.on('error', (error) => {
        console.log(`   ❌ Error verificando performance: ${error.message}`);
        reject(error);
      });

      req.end();
    });
  } catch (error) {
    console.log('   ⚠️  No se pudo verificar performance');
  }
}

// Función principal
async function main() {
  const domain = process.argv[2];
  
  if (!domain) {
    console.log('❌ Uso: node scripts/verify-domain.js <dominio>');
    console.log('Ejemplo: node scripts/verify-domain.js stack21.com');
    process.exit(1);
  }

  await verifyDomain(domain);
}

main().catch(console.error);
