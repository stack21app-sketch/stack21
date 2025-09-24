#!/usr/bin/env node

const { execSync } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🚀 Migración de datos a Supabase');
console.log('================================');
console.log('');

// Pedir la contraseña de forma segura
rl.question('Ingresa la contraseña de tu base de datos Supabase: ', (password) => {
  const supabaseUrl = `postgresql://postgres:${password}@db.ctdjuuugrehosaypluit.supabase.co:5432/postgres`;
  
  console.log('');
  console.log('📤 Importando datos a Supabase...');
  
  try {
    // Importar el backup a Supabase
    execSync(`psql "${supabaseUrl}" -f local_backup.sql`, { stdio: 'inherit' });
    
    console.log('');
    console.log('✅ ¡Migración completada exitosamente!');
    console.log('');
    console.log('🔗 URL de producción:');
    console.log(supabaseUrl);
    console.log('');
    console.log('📝 Ahora puedes usar esta URL en Vercel como DATABASE_URL');
    
  } catch (error) {
    console.error('');
    console.error('❌ Error durante la migración:');
    console.error(error.message);
    console.error('');
    console.error('💡 Verifica que:');
    console.error('   - La contraseña sea correcta');
    console.error('   - La base de datos esté disponible');
    console.error('   - Tengas psql instalado');
  }
  
  rl.close();
});

// Ocultar la contraseña mientras se escribe
rl._writeToOutput = function _writeToOutput(stringToWrite) {
  if (stringToWrite.includes('Ingresa la contraseña')) {
    rl.output.write(stringToWrite);
  } else {
    rl.output.write('*');
  }
};
