#!/usr/bin/env node

const http = require('http');

const BASE_URL = 'http://localhost:3000';

// Función para hacer login con credenciales demo
async function testAuth() {
  console.log('🔐 Probando autenticación...\n');
  
  try {
    // 1. Obtener CSRF token
    console.log('⏳ Obteniendo CSRF token...');
    const csrfResponse = await makeRequest(`${BASE_URL}/api/auth/csrf`);
    console.log(`✅ CSRF token obtenido: ${csrfResponse.status}`);
    
    // 2. Intentar login con credenciales demo
    console.log('⏳ Intentando login con credenciales demo...');
    const loginData = JSON.stringify({
      email: 'demo@stack21.com',
      password: 'demo123',
      csrfToken: csrfResponse.data.csrfToken
    });
    
    const loginResponse = await makePostRequest(`${BASE_URL}/api/auth/callback/credentials`, loginData);
    console.log(`✅ Login response: ${loginResponse.status}`);
    
    if (loginResponse.status === 200) {
      console.log('🎉 ¡Autenticación exitosa!');
      
      // 3. Probar acceso al dashboard
      console.log('⏳ Probando acceso al dashboard...');
      const dashboardResponse = await makeRequest(`${BASE_URL}/dashboard`);
      console.log(`✅ Dashboard response: ${dashboardResponse.status}`);
      
      if (dashboardResponse.status === 200) {
        console.log('🎉 ¡Dashboard accesible!');
      }
    }
    
  } catch (error) {
    console.log(`❌ Error en autenticación: ${error.message}`);
  }
}

function makeRequest(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
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

function makePostRequest(url, data) {
  return new Promise((resolve, reject) => {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    };
    
    const req = http.request(url, options, (res) => {
      let responseData = '';
      res.on('data', chunk => responseData += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(responseData);
          resolve({ status: res.statusCode, data: json });
        } catch (e) {
          resolve({ status: res.statusCode, data: responseData });
        }
      });
    });
    
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

testAuth().catch(console.error);
