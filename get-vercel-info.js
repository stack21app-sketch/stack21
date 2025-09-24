// Script para obtener información de Vercel
// Ejecutar: node get-vercel-info.js

const https = require('https');

console.log('Para obtener la información de Vercel:');
console.log('');
console.log('1. Ve a https://vercel.com/account/tokens');
console.log('2. Crea un token con scope "Full Account"');
console.log('3. Copia el token');
console.log('');
console.log('4. Luego ejecuta:');
console.log('curl -H "Authorization: Bearer TU_TOKEN_AQUI" https://api.vercel.com/v1/projects');
console.log('');
console.log('5. Busca tu proyecto "saas-starter" en la respuesta');
console.log('6. Copia el "id" (es VERCEL_PROJECT_ID)');
console.log('7. Copia el "accountId" (es VERCEL_ORG_ID)');
console.log('');
console.log('O simplemente ve a tu proyecto en Vercel y mira la URL:');
console.log('https://vercel.com/[ORG_ID]/[PROJECT_ID]');
