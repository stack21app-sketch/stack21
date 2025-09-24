const fs = require('fs');
const path = require('path');
const readline = require('readline');

const envLocalPath = path.resolve(__dirname, '../.env.local');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function askQuestion(query) {
  return new Promise(resolve => rl.question(query, ans => resolve(ans)));
}

async function fixGoogleOAuth() {
  console.log('\n🔧 Configuración de Google OAuth');
  console.log('=====================================\n');
  
  console.log('Para que funcione el login con Google, necesitas:');
  console.log('1. Ir a https://console.developers.google.com/');
  console.log('2. Crear un proyecto o seleccionar uno existente');
  console.log('3. Habilitar la API de Google+');
  console.log('4. Ir a "Credenciales" > "Crear credenciales" > "ID de cliente OAuth 2.0"');
  console.log('5. Configurar las URLs autorizadas:');
  console.log('   - Orígenes JavaScript autorizados: http://localhost:3000');
  console.log('   - URI de redirección autorizados: http://localhost:3000/api/auth/callback/google\n');

  const googleClientSecret = await askQuestion('Ingresa tu GOOGLE_CLIENT_SECRET real: ');

  if (!googleClientSecret || googleClientSecret === 'GOCSPX-your-actual-secret-here') {
    console.log('❌ No se proporcionó un secret válido. El login con Google no funcionará.');
    rl.close();
    return;
  }

  try {
    let envContent = fs.readFileSync(envLocalPath, 'utf8');
    
    // Actualizar el GOOGLE_CLIENT_SECRET
    envContent = envContent.replace(
      /GOOGLE_CLIENT_SECRET=".*"/,
      `GOOGLE_CLIENT_SECRET="${googleClientSecret}"`
    );

    fs.writeFileSync(envLocalPath, envContent, 'utf8');
    
    console.log('\n✅ Google OAuth configurado correctamente!');
    console.log('📝 Archivo .env.local actualizado');
    console.log('\n🔄 Reinicia el servidor para que los cambios surtan efecto:');
    console.log('   npm run dev');
    console.log('\n🌐 Luego ve a: http://localhost:3000/auth/signin');
    
  } catch (error) {
    console.error('❌ Error al actualizar .env.local:', error);
  } finally {
    rl.close();
  }
}

fixGoogleOAuth();
