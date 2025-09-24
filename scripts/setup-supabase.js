#!/usr/bin/env node

/**
 * Script para configurar Supabase con Prisma
 * Ejecutar: node scripts/setup-supabase.js
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Configurando Supabase para tu SaaS...\n');

// Verificar que existe el archivo .env.supabase
const envSupabasePath = path.join(process.cwd(), '.env.supabase');
if (!fs.existsSync(envSupabasePath)) {
  console.error('❌ No se encontró el archivo .env.supabase');
  console.log('Por favor, crea el archivo .env.supabase con las configuraciones de Supabase');
  process.exit(1);
}

console.log('✅ Archivo .env.supabase encontrado');

// Leer el archivo .env.supabase
const envContent = fs.readFileSync(envSupabasePath, 'utf8');

// Verificar que las variables están configuradas
const requiredVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'DATABASE_URL'
];

const missingVars = requiredVars.filter(varName => {
  const regex = new RegExp(`${varName}="[^"]*"`);
  const match = envContent.match(regex);
  return !match || match[0].includes('TU_CLAVE') || match[0].includes('[PASSWORD]');
});

if (missingVars.length > 0) {
  console.log('❌ Variables de entorno faltantes o no configuradas:');
  missingVars.forEach(varName => console.log(`   - ${varName}`));
  console.log('\n📝 Instrucciones:');
  console.log('1. Ve a https://supabase.com/dashboard/project/ctdjuuugrehosaypluit');
  console.log('2. Ve a Settings > API para obtener las claves');
  console.log('3. Ve a Settings > Database para obtener la URL de conexión');
  console.log('4. Actualiza el archivo .env.supabase con los valores reales');
  console.log('5. Ejecuta este script nuevamente');
  process.exit(1);
}

console.log('✅ Todas las variables de entorno están configuradas');

// Copiar .env.supabase a .env.local
try {
  fs.copyFileSync(envSupabasePath, path.join(process.cwd(), '.env.local'));
  console.log('✅ Archivo .env.local actualizado');
} catch (error) {
  console.error('❌ Error al copiar .env.supabase a .env.local:', error.message);
  process.exit(1);
}

// Generar cliente de Prisma
console.log('🔄 Generando cliente de Prisma...');
try {
  execSync('npx prisma generate', { stdio: 'inherit' });
  console.log('✅ Cliente de Prisma generado');
} catch (error) {
  console.error('❌ Error al generar cliente de Prisma:', error.message);
  process.exit(1);
}

// Aplicar migraciones a Supabase
console.log('🔄 Aplicando migraciones a Supabase...');
try {
  execSync('npx prisma db push', { stdio: 'inherit' });
  console.log('✅ Migraciones aplicadas a Supabase');
} catch (error) {
  console.error('❌ Error al aplicar migraciones:', error.message);
  console.log('💡 Asegúrate de que la URL de la base de datos sea correcta');
  process.exit(1);
}

console.log('\n🎉 ¡Configuración de Supabase completada!');
console.log('\n📋 Próximos pasos:');
console.log('1. Ve a https://supabase.com/dashboard/project/ctdjuuugrehosaypluit');
console.log('2. Ve a SQL Editor y ejecuta el script setup-supabase.sql');
console.log('3. Configura la autenticación en Authentication > Providers');
console.log('4. Ejecuta: npm run dev');
console.log('\n🚀 ¡Tu SaaS está listo para funcionar!');
