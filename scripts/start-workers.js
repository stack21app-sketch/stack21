#!/usr/bin/env node

// Script para iniciar los workers de BullMQ
const { runWorker, scheduleWorker } = require('../src/lib/queue/index.ts');

console.log('🚀 Iniciando workers de Stack21...');

// Manejar señales de terminación
process.on('SIGINT', async () => {
  console.log('\n🛑 Deteniendo workers...');
  
  try {
    await runWorker.close();
    await scheduleWorker.close();
    console.log('✅ Workers detenidos correctamente');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error deteniendo workers:', error);
    process.exit(1);
  }
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Deteniendo workers...');
  
  try {
    await runWorker.close();
    await scheduleWorker.close();
    console.log('✅ Workers detenidos correctamente');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error deteniendo workers:', error);
    process.exit(1);
  }
});

// Manejar errores no capturados
process.on('uncaughtException', (error) => {
  console.error('❌ Error no capturado:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Promise rechazada:', reason);
  process.exit(1);
});

console.log('✅ Workers iniciados correctamente');
console.log('📊 Monitoreando colas: runs, schedules, runs-dlq');
console.log('💡 Presiona Ctrl+C para detener');
