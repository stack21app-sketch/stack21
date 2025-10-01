#!/usr/bin/env node

// Script de verificación para Stack21
const fs = require('fs');
const path = require('path');

console.log('🔍 Verificando implementación de Stack21...\n');

const checks = [
  {
    name: 'Schema de Prisma',
    path: 'prisma/schema.prisma',
    required: true,
  },
  {
    name: 'Tipos TypeScript',
    path: 'src/types/automation.ts',
    required: true,
  },
  {
    name: 'APIs de Workflows',
    path: 'src/app/api/workflows/route.ts',
    required: true,
  },
  {
    name: 'APIs de Runs',
    path: 'src/app/api/runs/route.ts',
    required: true,
  },
  {
    name: 'APIs de Apps',
    path: 'src/app/api/apps/route.ts',
    required: true,
  },
  {
    name: 'APIs de Connections',
    path: 'src/app/api/connections/route.ts',
    required: true,
  },
  {
    name: 'APIs de Templates',
    path: 'src/app/api/templates/route.ts',
    required: true,
  },
  {
    name: 'API de AI Assistant',
    path: 'src/app/api/ai/assist/route.ts',
    required: true,
  },
  {
    name: 'APIs de Webhooks',
    path: 'src/app/api/webhooks/[path]/route.ts',
    required: true,
  },
  {
    name: 'APIs de Scheduler',
    path: 'src/app/api/scheduler/tick/route.ts',
    required: true,
  },
  {
    name: 'APIs de DataStore',
    path: 'src/app/api/datastore/kv/route.ts',
    required: true,
  },
  {
    name: 'Workflow Builder',
    path: 'src/components/workflow/WorkflowBuilder.tsx',
    required: true,
  },
  {
    name: 'Página de Workflows',
    path: 'src/app/workflows/page.tsx',
    required: true,
  },
  {
    name: 'Página de Runs',
    path: 'src/app/runs/page.tsx',
    required: true,
  },
  {
    name: 'Página de Apps',
    path: 'src/app/apps/page.tsx',
    required: true,
  },
  {
    name: 'Página de Templates',
    path: 'src/app/templates/page.tsx',
    required: true,
  },
  {
    name: 'Página de AI Builder',
    path: 'src/app/ai-builder/page.tsx',
    required: true,
  },
  {
    name: 'Página de Connections',
    path: 'src/app/connections/page.tsx',
    required: true,
  },
  {
    name: 'Página de Billing',
    path: 'src/app/billing/page.tsx',
    required: true,
  },
  {
    name: 'Página de Dashboard',
    path: 'src/app/dashboard/page.tsx',
    required: true,
  },
  {
    name: 'Layout Principal',
    path: 'src/components/layout/AppLayout.tsx',
    required: true,
  },
  {
    name: 'Sistema de Colas',
    path: 'src/lib/queue/index.ts',
    required: true,
  },
  {
    name: 'Conectores',
    path: 'src/lib/connectors/index.ts',
    required: true,
  },
  {
    name: 'Integración Stripe',
    path: 'src/lib/stripe.ts',
    required: true,
  },
  {
    name: 'APIs de Billing',
    path: 'src/app/api/billing/checkout/route.ts',
    required: true,
  },
  {
    name: 'Sistema de Notificaciones',
    path: 'src/components/notifications/NotificationCenter.tsx',
    required: true,
  },
  {
    name: 'SDK JavaScript',
    path: 'packages/sdk-js/src/index.ts',
    required: true,
  },
  {
    name: 'Cliente SDK',
    path: 'packages/sdk-js/src/client.ts',
    required: true,
  },
  {
    name: 'Hooks React',
    path: 'packages/sdk-js/src/hooks.ts',
    required: true,
  },
  {
    name: 'Utilidades SDK',
    path: 'packages/sdk-js/src/utils.ts',
    required: true,
  },
  {
    name: 'Scripts de Seeding',
    path: 'scripts/seed-connectors.js',
    required: true,
  },
  {
    name: 'Scripts de Workers',
    path: 'scripts/start-workers.js',
    required: true,
  },
];

let passed = 0;
let failed = 0;
let warnings = 0;

console.log('📋 Verificando archivos...\n');

checks.forEach(check => {
  const filePath = path.join(process.cwd(), check.path);
  const exists = fs.existsSync(filePath);
  
  if (exists) {
    console.log(`✅ ${check.name}`);
    passed++;
  } else {
    if (check.required) {
      console.log(`❌ ${check.name} - REQUERIDO`);
      failed++;
    } else {
      console.log(`⚠️  ${check.name} - OPCIONAL`);
      warnings++;
    }
  }
});

console.log('\n📊 Resumen de Verificación:');
console.log(`✅ Archivos encontrados: ${passed}`);
console.log(`❌ Archivos faltantes: ${failed}`);
console.log(`⚠️  Advertencias: ${warnings}`);

if (failed === 0) {
  console.log('\n🎉 ¡Stack21 está completamente implementado!');
  console.log('\n🚀 Para empezar:');
  console.log('1. npm install');
  console.log('2. npm run db:generate');
  console.log('3. npm run db:push');
  console.log('4. npm run seed:automation');
  console.log('5. npm run dev');
  console.log('6. npm run workers:dev (en otra terminal)');
  console.log('\n📚 Documentación completa en STACK21_README.md');
} else {
  console.log('\n⚠️  Algunos archivos requeridos no se encontraron.');
  console.log('Por favor, verifica la implementación.');
  process.exit(1);
}
