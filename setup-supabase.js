#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🗄️ Configuración de Supabase para Stack21\n');

async function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, resolve);
  });
}

async function main() {
  try {
    console.log('📋 Necesitarás las credenciales de Supabase:');
    console.log('1. Ve a https://supabase.com/');
    console.log('2. Crea un nuevo proyecto');
    console.log('3. Ve a Settings > API');
    console.log('4. Copia la Project URL y anon public key\n');

    const supabaseUrl = await askQuestion('🔗 Ingresa tu Supabase URL: ');
    const supabaseKey = await askQuestion('🔐 Ingresa tu Supabase anon key: ');
    const domain = await askQuestion('🌐 Ingresa tu dominio de producción (opcional): ');

    // Leer archivo .env.local existente
    const envPath = path.join(process.cwd(), '.env.local');
    let envContent = '';
    
    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, 'utf8');
    }

    // Actualizar o agregar variables
    const updates = {
      'NEXT_PUBLIC_SUPABASE_URL': supabaseUrl,
      'NEXT_PUBLIC_SUPABASE_ANON_KEY': supabaseKey
    };

    // Procesar cada variable
    for (const [key, value] of Object.entries(updates)) {
      const regex = new RegExp(`^${key}=.*$`, 'm');
      const newLine = `${key}=${value}`;
      
      if (envContent.includes(key + '=')) {
        envContent = envContent.replace(regex, newLine);
      } else {
        envContent += `\n${newLine}`;
      }
    }

    // Escribir archivo actualizado
    fs.writeFileSync(envPath, envContent);

    console.log('\n✅ Configuración completada!');
    console.log('📁 Variables actualizadas en .env.local:');
    console.log(`   NEXT_PUBLIC_SUPABASE_URL=${supabaseUrl}`);
    console.log(`   NEXT_PUBLIC_SUPABASE_ANON_KEY=${supabaseKey.substring(0, 20)}...`);

    console.log('\n📋 Próximos pasos:');
    console.log('1. Ve a tu dashboard de Supabase');
    console.log('2. Ve a SQL Editor');
    console.log('3. Copia y pega el contenido de fixed_supabase_migration.sql');
    console.log('4. Ejecuta la migración');
    console.log('5. Configura la autenticación en Authentication > Settings');
    console.log('6. Reinicia el servidor: npm run dev');

    console.log('\n🔧 Configuración de autenticación:');
    console.log('En Supabase > Authentication > Settings:');
    console.log(`   Site URL: ${domain ? `https://${domain}` : 'http://localhost:3000'}`);
    console.log(`   Redirect URLs: ${domain ? `https://${domain}/auth/callback` : 'http://localhost:3000/auth/callback'}`);

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    rl.close();
  }
}

main();
