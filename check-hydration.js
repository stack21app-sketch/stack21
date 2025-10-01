#!/usr/bin/env node

// Script para verificar errores de hidratación
const { spawn } = require('child_process');
const fs = require('fs');

console.log('🔍 Verificando errores de hidratación...');

// Verificar que el servidor esté corriendo
const checkServer = async () => {
  try {
    const response = await fetch('http://localhost:3001/api/health');
    if (response.ok) {
      console.log('✅ Servidor funcionando en puerto 3001');
      return true;
    }
  } catch (error) {
    console.log('❌ Servidor no está funcionando');
    return false;
  }
  return false;
};

// Ejecutar build para detectar errores de hidratación
const runBuild = () => {
  return new Promise((resolve, reject) => {
    console.log('🏗️ Ejecutando build para detectar errores...');
    
    const buildProcess = spawn('npm', ['run', 'build'], {
      stdio: 'pipe',
      shell: true
    });

    let output = '';
    let errorOutput = '';

    buildProcess.stdout.on('data', (data) => {
      output += data.toString();
    });

    buildProcess.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });

    buildProcess.on('close', (code) => {
      if (code === 0) {
        console.log('✅ Build exitoso - No se detectaron errores críticos');
        resolve(true);
      } else {
        console.log('❌ Build falló con código:', code);
        console.log('Errores:', errorOutput);
        reject(new Error(`Build failed with code ${code}`));
      }
    });
  });
};

// Verificar páginas específicas
const checkPages = async () => {
  const pages = [
    '/',
    '/dashboard',
    '/dashboard/workflows',
    '/dashboard/chatbot',
    '/dashboard/emails',
    '/dashboard/billing',
    '/dashboard/analytics',
    '/dashboard/admin',
    '/workflow-builder',
    '/marketplace'
  ];

  console.log('🌐 Verificando páginas...');
  
  for (const page of pages) {
    try {
      const response = await fetch(`http://localhost:3001${page}`);
      if (response.ok) {
        console.log(`✅ ${page} - OK`);
      } else {
        console.log(`⚠️ ${page} - HTTP ${response.status}`);
      }
    } catch (error) {
      console.log(`❌ ${page} - Error: ${error.message}`);
    }
  }
};

// Verificar APIs
const checkAPIs = async () => {
  const apis = [
    '/api/health',
    '/api/workflows',
    '/api/chatbots',
    '/api/emails',
    '/api/billing',
    '/api/analytics',
    '/api/monitoring',
    '/api/backups',
    '/api/notifications'
  ];

  console.log('🔌 Verificando APIs...');
  
  for (const api of apis) {
    try {
      const response = await fetch(`http://localhost:3001${api}`);
      if (response.ok) {
        console.log(`✅ ${api} - OK`);
      } else {
        console.log(`⚠️ ${api} - HTTP ${response.status}`);
      }
    } catch (error) {
      console.log(`❌ ${api} - Error: ${error.message}`);
    }
  }
};

// Función principal
const main = async () => {
  try {
    console.log('🚀 Iniciando verificación de hidratación...\n');
    
    // Verificar servidor
    const serverRunning = await checkServer();
    if (!serverRunning) {
      console.log('❌ No se puede verificar sin servidor funcionando');
      process.exit(1);
    }

    // Verificar páginas y APIs
    await checkPages();
    await checkAPIs();

    // Ejecutar build
    await runBuild();

    console.log('\n🎉 ¡Verificación completada!');
    console.log('📝 Recomendaciones:');
    console.log('   • Revisar la consola del navegador para errores de hidratación');
    console.log('   • Usar React DevTools para inspeccionar componentes');
    console.log('   • Verificar que todos los componentes usen useClientOnly cuando sea necesario');
    console.log('   • Asegurar que los valores de tiempo/fecha sean consistentes entre servidor y cliente');

  } catch (error) {
    console.error('❌ Error durante la verificación:', error.message);
    process.exit(1);
  }
};

// Ejecutar si se llama directamente
if (require.main === module) {
  main();
}

module.exports = { checkServer, runBuild, checkPages, checkAPIs };
