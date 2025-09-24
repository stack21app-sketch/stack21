#!/usr/bin/env node

const readline = require('readline');
const fs = require('fs');
const path = require('path');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('📧 CONFIGURACIÓN DE SMTP PARA STACK21');
console.log('=====================================\n');

const questions = [
  {
    key: 'SMTP_HOST',
    question: 'Host SMTP (ej: smtp.gmail.com): ',
    default: 'smtp.gmail.com'
  },
  {
    key: 'SMTP_PORT',
    question: 'Puerto SMTP (ej: 587): ',
    default: '587'
  },
  {
    key: 'SMTP_USER',
    question: 'Email de envío (ej: tu-email@gmail.com): ',
    default: ''
  },
  {
    key: 'SMTP_PASS',
    question: 'Contraseña de aplicación (App Password): ',
    default: ''
  },
  {
    key: 'SMTP_FROM',
    question: 'Nombre del remitente (ej: Stack21 <noreply@stack21.com>): ',
    default: 'Stack21 <noreply@stack21.com>'
  }
];

const answers = {};

function askQuestion(index) {
  if (index >= questions.length) {
    updateEnvFile();
    return;
  }

  const q = questions[index];
  rl.question(q.question, (answer) => {
    answers[q.key] = answer || q.default;
    askQuestion(index + 1);
  });
}

function updateEnvFile() {
  console.log('\n🔧 Actualizando archivos de configuración...\n');

  // Actualizar .env
  const envPath = path.join(process.cwd(), '.env');
  let envContent = '';

  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, 'utf8');
  }

  // Actualizar variables SMTP
  Object.entries(answers).forEach(([key, value]) => {
    const regex = new RegExp(`^${key}=.*$`, 'm');
    const newLine = `${key}="${value}"`;
    
    if (envContent.match(regex)) {
      envContent = envContent.replace(regex, newLine);
    } else {
      envContent += `\n${newLine}`;
    }
  });

  fs.writeFileSync(envPath, envContent);
  console.log('✅ Archivo .env actualizado');

  // Actualizar .env.local
  const envLocalPath = path.join(process.cwd(), '.env.local');
  let envLocalContent = '';

  if (fs.existsSync(envLocalPath)) {
    envLocalContent = fs.readFileSync(envLocalPath, 'utf8');
  }

  Object.entries(answers).forEach(([key, value]) => {
    const regex = new RegExp(`^${key}=.*$`, 'm');
    const newLine = `${key}="${value}"`;
    
    if (envLocalContent.match(regex)) {
      envLocalContent = envLocalContent.replace(regex, newLine);
    } else {
      envLocalContent += `\n${newLine}`;
    }
  });

  fs.writeFileSync(envLocalPath, envLocalContent);
  console.log('✅ Archivo .env.local actualizado');

  console.log('\n🎉 Configuración SMTP completada!');
  console.log('\n📋 Próximos pasos:');
  console.log('1. Reinicia el servidor: npm run dev');
  console.log('2. Prueba el envío de emails desde el workflow builder');
  console.log('3. Verifica que los emails lleguen correctamente\n');

  rl.close();
}

console.log('💡 INSTRUCCIONES:');
console.log('• Para Gmail: Usa contraseña de aplicación (App Password)');
console.log('• Para Outlook: Usa tu contraseña normal');
console.log('• Para otros proveedores: Consulta su documentación\n');

askQuestion(0);
