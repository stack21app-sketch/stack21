#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🚀 Despliegue de Stack21 a Vercel\n');

async function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, resolve);
  });
}

async function main() {
  try {
    console.log('📋 Este script te ayudará a desplegar Stack21 a Vercel:');
    console.log('1. Verificar configuración');
    console.log('2. Instalar Vercel CLI');
    console.log('3. Configurar variables de entorno');
    console.log('4. Desplegar la aplicación\n');

    // Verificar si Vercel CLI está instalado
    let vercelInstalled = false;
    try {
      execSync('vercel --version', { stdio: 'pipe' });
      vercelInstalled = true;
      console.log('✅ Vercel CLI ya está instalado');
    } catch (error) {
      console.log('❌ Vercel CLI no está instalado');
    }

    if (!vercelInstalled) {
      const installVercel = await askQuestion('¿Quieres instalar Vercel CLI? (y/n): ');
      if (installVercel.toLowerCase() === 'y') {
        console.log('📦 Instalando Vercel CLI...');
        execSync('npm install -g vercel', { stdio: 'inherit' });
        console.log('✅ Vercel CLI instalado correctamente');
      } else {
        console.log('❌ Necesitas Vercel CLI para continuar');
        process.exit(1);
      }
    }

    // Verificar archivo .env.local
    const envPath = path.join(process.cwd(), '.env.local');
    if (!fs.existsSync(envPath)) {
      console.log('❌ No se encontró archivo .env.local');
      console.log('💡 Ejecuta primero: node setup-complete.js');
      process.exit(1);
    }

    console.log('✅ Archivo .env.local encontrado');

    // Leer variables de entorno
    const envContent = fs.readFileSync(envPath, 'utf8');
    const envVars = {};
    envContent.split('\n').forEach(line => {
      const [key, value] = line.split('=');
      if (key && value) {
        envVars[key.trim()] = value.trim();
      }
    });

    console.log('\n📋 Variables de entorno encontradas:');
    Object.keys(envVars).forEach(key => {
      if (key.startsWith('NEXT_PUBLIC_') || key.startsWith('NEXTAUTH_') || key.startsWith('GOOGLE_') || key.startsWith('GITHUB_')) {
        console.log(`   ${key}=${envVars[key].substring(0, 20)}...`);
      }
    });

    // Crear vercel.json si no existe
    const vercelConfig = {
      "framework": "nextjs",
      "buildCommand": "npm run build",
      "devCommand": "npm run dev",
      "installCommand": "npm install",
      "env": {
        "NEXTAUTH_URL": envVars.NEXTAUTH_URL || "https://tu-dominio.vercel.app",
        "NEXTAUTH_SECRET": envVars.NEXTAUTH_SECRET || "tu-secret-aqui"
      }
    };

    if (!fs.existsSync('vercel.json')) {
      fs.writeFileSync('vercel.json', JSON.stringify(vercelConfig, null, 2));
      console.log('✅ Archivo vercel.json creado');
    }

    // Verificar que el proyecto compile
    console.log('\n🔨 Verificando que el proyecto compile...');
    try {
      execSync('npm run build', { stdio: 'pipe' });
      console.log('✅ Proyecto compila correctamente');
    } catch (error) {
      console.log('❌ Error al compilar el proyecto:');
      console.log(error.message);
      process.exit(1);
    }

    // Iniciar sesión en Vercel
    console.log('\n🔐 Iniciando sesión en Vercel...');
    try {
      execSync('vercel login', { stdio: 'inherit' });
    } catch (error) {
      console.log('❌ Error al iniciar sesión en Vercel');
      process.exit(1);
    }

    // Desplegar
    console.log('\n🚀 Desplegando a Vercel...');
    try {
      execSync('vercel --prod', { stdio: 'inherit' });
      console.log('\n🎉 ¡Despliegue completado!');
    } catch (error) {
      console.log('❌ Error durante el despliegue:');
      console.log(error.message);
      process.exit(1);
    }

    // Configurar variables de entorno en Vercel
    console.log('\n⚙️ Configurando variables de entorno en Vercel...');
    const envCommands = [];
    
    Object.entries(envVars).forEach(([key, value]) => {
      if (key.startsWith('NEXT_PUBLIC_') || key.startsWith('NEXTAUTH_') || key.startsWith('GOOGLE_') || key.startsWith('GITHUB_') || key.startsWith('SUPABASE_')) {
        envCommands.push(`vercel env add ${key} ${value}`);
      }
    });

    if (envCommands.length > 0) {
      console.log('📝 Ejecutando comandos de variables de entorno...');
      for (const command of envCommands) {
        try {
          execSync(command, { stdio: 'pipe' });
          console.log(`✅ ${command.split(' ')[2]} configurada`);
        } catch (error) {
          console.log(`⚠️ Error configurando ${command.split(' ')[2]}: ${error.message}`);
        }
      }
    }

    console.log('\n🎉 ¡Stack21 desplegado exitosamente!');
    console.log('🌐 Tu aplicación está disponible en: https://tu-proyecto.vercel.app');
    console.log('\n📋 Próximos pasos:');
    console.log('1. Verifica que todas las variables de entorno estén configuradas');
    console.log('2. Prueba la autenticación con Google/GitHub');
    console.log('3. Configura tu dominio personalizado si lo deseas');
    console.log('4. ¡Comienza a usar Stack21!');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    rl.close();
  }
}

main();
