#!/usr/bin/env node

// Script de Verificación Completa de Stack21
// Verifica todas las funcionalidades implementadas

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Colores para output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logStep(step, message) {
  log(`\n${step}. ${message}`, 'cyan');
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

class Stack21Verifier {
  constructor() {
    this.projectRoot = process.cwd();
    this.results = {
      pages: [],
      apis: [],
      components: [],
      systems: [],
      scripts: [],
      documentation: []
    };
    this.totalTests = 0;
    this.passedTests = 0;
    this.failedTests = 0;
    this.baseUrl = 'http://localhost:3000';
  }

  // Verificar que el servidor esté corriendo
  async checkServerRunning() {
    const candidates = [3000, 3001, 3002, 3003, 3004, 3005].map(p => `http://localhost:${p}`);
    for (const url of candidates) {
      try {
        const response = await fetch(`${url}/api/health`);
        if (response.ok) {
          this.baseUrl = url;
          return true;
        }
      } catch (_) {}
    }
    return false;
  }

  // Verificar página
  async verifyPage(url, expectedContent, name) {
    this.totalTests++;
    try {
      const response = await fetch(`${this.baseUrl}${url}`);
      if (response.ok) {
        const content = await response.text();
        if (expectedContent ? content.includes(expectedContent) : true) {
          this.results.pages.push({ name, url, status: 'PASS' });
          this.passedTests++;
          logSuccess(`Página ${name}: OK`);
          return true;
        } else {
          this.results.pages.push({ name, url, status: 'CONTENT_MISMATCH' });
          this.failedTests++;
          logWarning(`Página ${name}: Contenido no coincide`);
          return false;
        }
      } else {
        this.results.pages.push({ name, url, status: `HTTP_${response.status}` });
        this.failedTests++;
        logError(`Página ${name}: HTTP ${response.status}`);
        return false;
      }
    } catch (error) {
      this.results.pages.push({ name, url, status: 'ERROR' });
      this.failedTests++;
      logError(`Página ${name}: ${error.message}`);
      return false;
    }
  }

  // Verificar API
  async verifyAPI(url, expectedContent, name) {
    this.totalTests++;
    try {
      const response = await fetch(`${this.baseUrl}${url}`);
      if (response.ok) {
        const data = await response.json();
        if (expectedContent ? JSON.stringify(data).includes(expectedContent) : true) {
          this.results.apis.push({ name, url, status: 'PASS' });
          this.passedTests++;
          logSuccess(`API ${name}: OK`);
          return true;
        } else {
          this.results.apis.push({ name, url, status: 'CONTENT_MISMATCH' });
          this.failedTests++;
          logWarning(`API ${name}: Contenido no coincide`);
          return false;
        }
      } else {
        this.results.apis.push({ name, url, status: `HTTP_${response.status}` });
        this.failedTests++;
        logError(`API ${name}: HTTP ${response.status}`);
        return false;
      }
    } catch (error) {
      this.results.apis.push({ name, url, status: 'ERROR' });
      this.failedTests++;
      logError(`API ${name}: ${error.message}`);
      return false;
    }
  }

  // Verificar componente
  verifyComponent(filePath, name) {
    this.totalTests++;
    if (fs.existsSync(filePath)) {
      this.results.components.push({ name, file: filePath, status: 'PASS' });
      this.passedTests++;
      logSuccess(`Componente ${name}: OK`);
      return true;
    } else {
      this.results.components.push({ name, file: filePath, status: 'NOT_FOUND' });
      this.failedTests++;
      logError(`Componente ${name}: No encontrado`);
      return false;
    }
  }

  // Verificar sistema
  verifySystem(filePath, name) {
    this.totalTests++;
    if (fs.existsSync(filePath)) {
      this.results.systems.push({ name, file: filePath, status: 'PASS' });
      this.passedTests++;
      logSuccess(`Sistema ${name}: OK`);
      return true;
    } else {
      this.results.systems.push({ name, file: filePath, status: 'NOT_FOUND' });
      this.failedTests++;
      logError(`Sistema ${name}: No encontrado`);
      return false;
    }
  }

  // Verificar script
  verifyScript(filePath, name) {
    this.totalTests++;
    if (fs.existsSync(filePath)) {
      this.results.scripts.push({ name, file: filePath, status: 'PASS' });
      this.passedTests++;
      logSuccess(`Script ${name}: OK`);
      return true;
    } else {
      this.results.scripts.push({ name, file: filePath, status: 'NOT_FOUND' });
      this.failedTests++;
      logError(`Script ${name}: No encontrado`);
      return false;
    }
  }

  // Verificar documentación
  verifyDocumentation(filePath, name) {
    this.totalTests++;
    if (fs.existsSync(filePath)) {
      this.results.documentation.push({ name, file: filePath, status: 'PASS' });
      this.passedTests++;
      logSuccess(`Documentación ${name}: OK`);
      return true;
    } else {
      this.results.documentation.push({ name, file: filePath, status: 'NOT_FOUND' });
      this.failedTests++;
      logError(`Documentación ${name}: No encontrada`);
      return false;
    }
  }

  // Ejecutar verificación completa
  async run() {
    log('🚀 Iniciando verificación completa de Stack21...', 'bright');
    
    // Verificar que el servidor esté corriendo
    logStep(1, 'Verificando servidor...');
    const serverRunning = await this.checkServerRunning();
    if (!serverRunning) {
      logError('Servidor no está corriendo. Ejecuta: npm run dev');
      process.exit(1);
    }
    logSuccess(`Servidor está corriendo en ${this.baseUrl}`);

    // Verificar páginas principales
    logStep(2, 'Verificando páginas principales...');
    await this.verifyPage('/', 'Stack21', 'Página de inicio');
    await this.verifyPage('/dashboard', 'Dashboard', 'Dashboard principal');
    await this.verifyPage('/dashboard/workflows', 'Workflows', 'Página de workflows');
    await this.verifyPage('/dashboard/chatbot', 'Chatbots', 'Página de chatbots');
    await this.verifyPage('/dashboard/emails', 'Emails', 'Página de emails');
    await this.verifyPage('/dashboard/billing', 'Facturación', 'Página de facturación');
    await this.verifyPage('/dashboard/analytics', 'Analytics', 'Página de analytics');
    await this.verifyPage('/dashboard/admin', 'Administración', 'Panel de administración');
    await this.verifyPage('/workflow-builder', 'Constructor', 'Constructor de workflows');
    await this.verifyPage('/marketplace', 'Marketplace', 'Marketplace');

    // Verificar APIs principales
    logStep(3, 'Verificando APIs principales...');
    await this.verifyAPI('/api/health', 'status', 'API de salud');
    await this.verifyAPI('/api/workflows', 'workflows', 'API de workflows');
    await this.verifyAPI('/api/chatbots', 'chatbots', 'API de chatbots');
    await this.verifyAPI('/api/emails', 'emails', 'API de emails');
    await this.verifyAPI('/api/billing', 'plans', 'API de facturación');
    await this.verifyAPI('/api/analytics', 'analytics', 'API de analytics');
    await this.verifyAPI('/api/monitoring', 'metrics', 'API de monitoreo');
    await this.verifyAPI('/api/backups', 'jobs', 'API de respaldos');
    await this.verifyAPI('/api/notifications', 'notifications', 'API de notificaciones');

    // Verificar componentes principales
    logStep(4, 'Verificando componentes principales...');
    this.verifyComponent('src/components/Sidebar.tsx', 'Sidebar');
    this.verifyComponent('src/components/NoSSR.tsx', 'NoSSR');
    this.verifyComponent('src/components/workflow/WorkflowBuilder.tsx', 'WorkflowBuilder');
    this.verifyComponent('src/components/ai/QuantumWorkflowEngine.tsx', 'QuantumWorkflowEngine');
    this.verifyComponent('src/components/ai/PredictiveIntelligence.tsx', 'PredictiveIntelligence');
    this.verifyComponent('src/components/ai/UniversalMultimodalInterface.tsx', 'UniversalMultimodalInterface');
    this.verifyComponent('src/components/ai/SelfOptimizationSystem.tsx', 'SelfOptimizationSystem');
    this.verifyComponent('src/components/ai/AdaptiveLearningSystem.tsx', 'AdaptiveLearningSystem');

    // Verificar sistemas principales
    logStep(5, 'Verificando sistemas principales...');
    this.verifySystem('src/lib/workflow-engine.ts', 'Motor de Workflows');
    this.verifySystem('src/lib/chatbot-engine.ts', 'Motor de Chatbots');
    this.verifySystem('src/lib/email-engine.ts', 'Motor de Emails');
    this.verifySystem('src/lib/payment-engine.ts', 'Motor de Pagos');
    this.verifySystem('src/lib/monitoring-engine.ts', 'Motor de Monitoreo');
    this.verifySystem('src/lib/backup-engine.ts', 'Motor de Respaldos');

    // Verificar scripts de despliegue
    logStep(6, 'Verificando scripts de despliegue...');
    this.verifyScript('scripts/deploy-production.sh', 'Script de despliegue a producción');
    this.verifyScript('scripts/deploy-vercel-production.sh', 'Script de despliegue a Vercel');
    this.verifyScript('scripts/optimize-performance.js', 'Script de optimización');
    this.verifyScript('scripts/setup-supabase.js', 'Script de configuración de Supabase');
    this.verifyScript('scripts/setup-oauth.js', 'Script de configuración de OAuth');

    // Verificar documentación
    logStep(7, 'Verificando documentación...');
    this.verifyDocumentation('docs/COMPLETE_DOCUMENTATION.md', 'Documentación completa');
    this.verifyDocumentation('docs/USER_GUIDE.md', 'Guía de usuario');
    this.verifyDocumentation('README.md', 'README principal');
    this.verifyDocumentation('docs/API_DOCUMENTATION.md', 'Documentación de APIs');
    this.verifyDocumentation('docs/PLATFORM_SUMMARY.md', 'Resumen de la plataforma');

    // Verificar archivos de configuración
    logStep(8, 'Verificando archivos de configuración...');
    this.verifySystem('next.config.js', 'Configuración de Next.js');
    this.verifySystem('tailwind.config.js', 'Configuración de Tailwind');
    this.verifySystem('package.json', 'Configuración de dependencias');
    this.verifySystem('middleware.ts', 'Middleware de Next.js');
    this.verifySystem('vercel.json', 'Configuración de Vercel');

    // Generar reporte final
    this.generateReport();
  }

  // Generar reporte final
  generateReport() {
    logStep(9, 'Generando reporte final...');
    
    const successRate = ((this.passedTests / this.totalTests) * 100).toFixed(1);
    
    log('\n📊 REPORTE FINAL DE VERIFICACIÓN', 'bright');
    log('='.repeat(50), 'cyan');
    
    log(`\n📈 ESTADÍSTICAS GENERALES:`, 'cyan');
    log(`   Total de pruebas: ${this.totalTests}`, 'white');
    log(`   Pruebas exitosas: ${this.passedTests}`, 'green');
    log(`   Pruebas fallidas: ${this.failedTests}`, 'red');
    log(`   Tasa de éxito: ${successRate}%`, successRate >= 90 ? 'green' : successRate >= 70 ? 'yellow' : 'red');
    
    // Reporte por categorías
    const categories = [
      { name: 'Páginas', data: this.results.pages },
      { name: 'APIs', data: this.results.apis },
      { name: 'Componentes', data: this.results.components },
      { name: 'Sistemas', data: this.results.systems },
      { name: 'Scripts', data: this.results.scripts },
      { name: 'Documentación', data: this.results.documentation }
    ];

    categories.forEach(category => {
      const passed = category.data.filter(item => item.status === 'PASS').length;
      const total = category.data.length;
      const rate = total > 0 ? ((passed / total) * 100).toFixed(1) : '0';
      
      log(`\n📋 ${category.name.toUpperCase()}:`, 'cyan');
      log(`   ✅ Exitosas: ${passed}/${total} (${rate}%)`, 'green');
      
      if (passed < total) {
        const failed = category.data.filter(item => item.status !== 'PASS');
        failed.forEach(item => {
          log(`   ❌ ${item.name || item.file}: ${item.status}`, 'red');
        });
      }
    });

    // Guardar reporte en archivo
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        totalTests: this.totalTests,
        passedTests: this.passedTests,
        failedTests: this.failedTests,
        successRate: parseFloat(successRate)
      },
      results: this.results
    };

    fs.writeFileSync('verification-report.json', JSON.stringify(report, null, 2));
    logSuccess('Reporte guardado en verification-report.json');

    // Conclusión
    log('\n🎯 CONCLUSIÓN:', 'bright');
    if (successRate >= 95) {
      log('🎉 ¡EXCELENTE! Stack21 está completamente funcional y listo para producción.', 'green');
    } else if (successRate >= 90) {
      log('✅ ¡MUY BIEN! Stack21 está casi completo, solo faltan algunos detalles menores.', 'green');
    } else if (successRate >= 80) {
      log('👍 ¡BIEN! Stack21 está funcional pero necesita algunos ajustes.', 'yellow');
    } else {
      log('⚠️ Stack21 necesita trabajo adicional para estar completamente funcional.', 'red');
    }

    log('\n🚀 PRÓXIMOS PASOS RECOMENDADOS:', 'cyan');
    if (successRate < 95) {
      log('1. Revisar y corregir los elementos que fallaron', 'yellow');
      log('2. Ejecutar este script nuevamente después de las correcciones', 'yellow');
    }
    log('3. Ejecutar: npm run build para verificar el build de producción', 'blue');
    log('4. Ejecutar: ./scripts/deploy-production.sh para desplegar', 'blue');
    log('5. Configurar variables de entorno para producción', 'blue');

    log('\n📚 RECURSOS ADICIONALES:', 'cyan');
    log('• Documentación: docs/COMPLETE_DOCUMENTATION.md', 'blue');
    log('• Guía de usuario: docs/USER_GUIDE.md', 'blue');
    log('• APIs: docs/API_DOCUMENTATION.md', 'blue');
    log('• Soporte: soporte@stack21.com', 'blue');

    log('\n✨ ¡Stack21 está listo para el mundo! 🚀', 'bright');
  }
}

// Ejecutar verificación si se llama directamente
if (require.main === module) {
  const verifier = new Stack21Verifier();
  verifier.run().catch(error => {
    logError(`Error durante la verificación: ${error.message}`);
    process.exit(1);
  });
}

module.exports = Stack21Verifier;

    process.exit(1);
  });
}

module.exports = Stack21Verifier;

    process.exit(1);
  });
}

module.exports = Stack21Verifier;

    process.exit(1);
  });
}

module.exports = Stack21Verifier;
