const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Configurando base de datos de Supabase...');

// Verificar variables de entorno
const requiredEnvVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'DATABASE_URL',
  'DIRECT_URL'
];

const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error('❌ Variables de entorno faltantes:');
  missingVars.forEach(varName => console.error(`  - ${varName}`));
  console.error('\nPor favor, configura estas variables en tu archivo .env.local');
  process.exit(1);
}

console.log('✅ Variables de entorno verificadas');

try {
  // 1. Generar cliente de Prisma
  console.log('📦 Generando cliente de Prisma...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  console.log('✅ Cliente de Prisma generado');

  // 2. Sincronizar esquema con la base de datos
  console.log('🔄 Sincronizando esquema de Prisma con Supabase...');
  execSync('npx prisma db push --accept-data-loss', { stdio: 'inherit' });
  console.log('✅ Esquema sincronizado con Supabase');

  // 3. Verificar conexión
  console.log('🔍 Verificando conexión a la base de datos...');
  execSync('npx prisma db seed', { stdio: 'inherit' });
  console.log('✅ Conexión verificada');

  console.log('\n🎉 ¡Configuración completada exitosamente!');
  console.log('📝 Próximos pasos:');
  console.log('  1. Ejecuta: npm run dev');
  console.log('  2. Ve a: http://localhost:3000');
  console.log('  3. Inicia sesión con Google');
  console.log('  4. Crea tu primer workspace');
  console.log('\n✨ ¡Tu plataforma SaaS de IA está lista!');

} catch (error) {
  console.error('❌ Error durante la configuración:', error.message);
  console.log('\n🔧 Soluciones posibles:');
  console.log('  1. Verifica que las variables de entorno estén correctas');
  console.log('  2. Asegúrate de que Supabase esté activo');
  console.log('  3. Ejecuta el script SQL en el editor de Supabase');
  console.log('  4. Revisa los logs de error arriba');
  process.exit(1);
}
