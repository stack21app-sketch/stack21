const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:3000';

async function verifyComplete() {
  console.log('🚀 Verificando Stack21 COMPLETO...\n');

  let passed = 0;
  let failed = 0;

  const tests = [
    {
      name: 'Servidor funcionando',
      url: '/api/health/public',
      expectedStatus: 200,
      checkResponse: (data) => data.status === 'ok'
    },
    {
      name: 'Página principal',
      url: '/',
      expectedStatus: 200
    },
    {
      name: 'Página de login',
      url: '/auth/signin',
      expectedStatus: 200
    },
    {
      name: 'Dashboard',
      url: '/dashboard',
      expectedStatus: 200
    },
    {
      name: 'Workflow Builder',
      url: '/workflow-builder',
      expectedStatus: 200
    },
    {
      name: 'Analytics',
      url: '/dashboard/analytics',
      expectedStatus: 200
    },
    {
      name: 'Testing',
      url: '/dashboard/testing',
      expectedStatus: 200
    },
    {
      name: 'Documentación',
      url: '/dashboard/docs',
      expectedStatus: 200
    },
    {
      name: 'API Workflows',
      url: '/api/workflows',
      expectedStatus: 401 // Sin autenticación
    },
    {
      name: 'API Analytics',
      url: '/api/analytics',
      expectedStatus: 401 // Sin autenticación
    },
    {
      name: 'API Notifications',
      url: '/api/notifications',
      expectedStatus: 401 // Sin autenticación
    }
  ];

  for (const test of tests) {
    console.log(`⏳ ${test.name}...`);
    try {
      const response = await fetch(`${BASE_URL}${test.url}`);
      
      if (response.status === test.expectedStatus) {
        if (test.checkResponse) {
          const data = await response.json();
          if (test.checkResponse(data)) {
            console.log(`✅ ${test.name} - OK`);
            passed++;
          } else {
            console.log(`❌ ${test.name} - FALLÓ (respuesta inválida)`);
            failed++;
          }
        } else {
          console.log(`✅ ${test.name} - OK`);
          passed++;
        }
      } else {
        console.log(`❌ ${test.name} - FALLÓ (Status ${response.status}, esperado ${test.expectedStatus})`);
        failed++;
      }
    } catch (error) {
      console.log(`❌ ${test.name} - FALLÓ: ${error.message}`);
      failed++;
    }
  }

  console.log('\n📊 Resultados Finales:');
  console.log(`✅ Pasaron: ${passed}`);
  console.log(`❌ Fallaron: ${failed}`);
  console.log(`📈 Éxito: ${((passed / (passed + failed)) * 100).toFixed(0)}%`);

  if (failed === 0) {
    console.log('\n🎉 ¡STACK21 ESTÁ 100% COMPLETO Y FUNCIONANDO!');
    console.log('🚀 Todas las funcionalidades están operativas');
    console.log('✨ Listo para producción');
  } else {
    console.log('\n⚠️ Se encontraron errores. Revisa los logs.');
    process.exit(1);
  }
}

verifyComplete();
