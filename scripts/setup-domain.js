#!/usr/bin/env node

const readline = require('readline');
const fs = require('fs');
const path = require('path');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🌐 CONFIGURACIÓN DE DOMINIO PERSONALIZADO - STACK21');
console.log('==================================================\n');

const questions = [
  {
    key: 'DOMAIN_NAME',
    question: 'Nombre del dominio (ej: stack21.com): ',
    default: 'stack21.com'
  },
  {
    key: 'SUBDOMAIN',
    question: 'Subdominio (ej: app, www, o vacío): ',
    default: 'app'
  },
  {
    key: 'PROVIDER',
    question: 'Proveedor de dominio (namecheap, godaddy, cloudflare): ',
    default: 'cloudflare'
  },
  {
    key: 'CDN_ENABLED',
    question: '¿Habilitar CDN? (y/n): ',
    default: 'y'
  },
  {
    key: 'SSL_ENABLED',
    question: '¿Habilitar SSL automático? (y/n): ',
    default: 'y'
  }
];

const answers = {};

function askQuestion(index) {
  if (index >= questions.length) {
    generateConfigFiles();
    return;
  }

  const q = questions[index];
  rl.question(q.question, (answer) => {
    answers[q.key] = answer || q.default;
    askQuestion(index + 1);
  });
}

function generateConfigFiles() {
  console.log('\n🔧 Generando archivos de configuración...\n');

  const domain = answers.DOMAIN_NAME;
  const subdomain = answers.SUBDOMAIN;
  const fullDomain = subdomain ? `${subdomain}.${domain}` : domain;

  // 1. Actualizar next.config.js
  updateNextConfig(fullDomain);

  // 2. Crear vercel.json actualizado
  updateVercelConfig(fullDomain);

  // 3. Crear archivo de configuración de dominio
  createDomainConfig(domain, subdomain, fullDomain);

  // 4. Crear archivo de DNS records
  createDNSRecords(domain, subdomain);

  // 5. Crear script de deploy con dominio
  createDeployScript(fullDomain);

  console.log('✅ Archivos de configuración generados!');
  console.log('\n📋 PRÓXIMOS PASOS:');
  console.log('1. Compra el dominio si no lo tienes');
  console.log('2. Configura los DNS records en tu proveedor');
  console.log('3. Ejecuta: npm run deploy:domain');
  console.log('4. Configura el dominio en Vercel dashboard');
  console.log(`5. Tu sitio estará disponible en: https://${fullDomain}\n`);

  rl.close();
}

function updateNextConfig(fullDomain) {
  const nextConfigPath = path.join(process.cwd(), 'next.config.js');
  let nextConfig = '';

  if (fs.existsSync(nextConfigPath)) {
    nextConfig = fs.readFileSync(nextConfigPath, 'utf8');
  }

  const newConfig = `/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    domains: ['${fullDomain}', 'localhost'],
  },
  env: {
    CUSTOM_DOMAIN: '${fullDomain}',
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;`;

  fs.writeFileSync(nextConfigPath, newConfig);
  console.log('✅ next.config.js actualizado');
}

function updateVercelConfig(fullDomain) {
  const vercelConfig = {
    "version": 2,
    "builds": [
      {
        "src": "package.json",
        "use": "@vercel/next"
      }
    ],
    "env": {
      "NODE_ENV": "production",
      "CUSTOM_DOMAIN": fullDomain
    },
    "functions": {
      "src/app/api/**/*.ts": {
        "maxDuration": 30
      }
    },
    "regions": ["iad1"],
    "framework": "nextjs",
    "installCommand": "npm install",
    "buildCommand": "npm run build",
    "outputDirectory": ".next",
    "devCommand": "npm run dev",
    "rewrites": [
      {
        "source": "/api/(.*)",
        "destination": "/api/$1"
      }
    ],
    "headers": [
      {
        "source": "/api/(.*)",
        "headers": [
          {
            "key": "Access-Control-Allow-Origin",
            "value": "*"
          },
          {
            "key": "Access-Control-Allow-Methods",
            "value": "GET, POST, PUT, DELETE, OPTIONS"
          },
          {
            "key": "Access-Control-Allow-Headers",
            "value": "Content-Type, Authorization"
          }
        ]
      }
    ],
    "domains": [fullDomain]
  };

  fs.writeFileSync('vercel.json', JSON.stringify(vercelConfig, null, 2));
  console.log('✅ vercel.json actualizado');
}

function createDomainConfig(domain, subdomain, fullDomain) {
  const domainConfig = {
    domain: domain,
    subdomain: subdomain,
    fullDomain: fullDomain,
    provider: answers.PROVIDER,
    cdn: answers.CDN_ENABLED === 'y',
    ssl: answers.SSL_ENABLED === 'y',
    createdAt: new Date().toISOString(),
    status: 'pending'
  };

  fs.writeFileSync('domain-config.json', JSON.stringify(domainConfig, null, 2));
  console.log('✅ domain-config.json creado');
}

function createDNSRecords(domain, subdomain) {
  const dnsRecords = [
    {
      type: 'A',
      name: subdomain || '@',
      value: '76.76.19.61', // Vercel IP
      ttl: 300
    },
    {
      type: 'CNAME',
      name: 'www',
      value: `${subdomain || 'www'}.${domain}`,
      ttl: 300
    },
    {
      type: 'TXT',
      name: '@',
      value: 'v=spf1 include:_spf.vercel.com ~all',
      ttl: 300
    },
    {
      type: 'CNAME',
      name: '_vercel',
      value: 'cname.vercel-dns.com',
      ttl: 300
    }
  ];

  const dnsConfig = {
    domain: domain,
    records: dnsRecords,
    instructions: [
      '1. Accede a tu panel de DNS del proveedor de dominio',
      '2. Agrega los siguientes registros DNS:',
      '3. Espera 5-10 minutos para que se propaguen',
      '4. Verifica con: nslookup ' + (subdomain ? `${subdomain}.${domain}` : domain)
    ]
  };

  fs.writeFileSync('dns-records.json', JSON.stringify(dnsConfig, null, 2));
  console.log('✅ dns-records.json creado');
}

function createDeployScript(fullDomain) {
  const deployScript = `#!/bin/bash

echo "🚀 DEPLOY CON DOMINIO PERSONALIZADO - STACK21"
echo "============================================="
echo ""

# Verificar que Vercel CLI esté instalado
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI no encontrado"
    echo "📦 Instalando Vercel CLI..."
    npm install -g vercel
fi

# Verificar que el dominio esté configurado
echo "🔍 Verificando configuración del dominio..."
if [ ! -f "domain-config.json" ]; then
    echo "❌ Archivo domain-config.json no encontrado"
    echo "Ejecuta: npm run setup:domain"
    exit 1
fi

# Deploy a Vercel
echo "🚀 Haciendo deploy a Vercel..."
vercel --prod

# Configurar dominio en Vercel
echo "🌐 Configurando dominio en Vercel..."
vercel domains add ${fullDomain}

# Verificar deploy
echo "✅ Deploy completado!"
echo "🌐 Tu sitio está disponible en: https://${fullDomain}"
echo ""
echo "📋 Próximos pasos:"
echo "1. Configura las variables de entorno en Vercel dashboard"
echo "2. Verifica que el dominio funcione correctamente"
echo "3. Configura SSL si no se activó automáticamente"
`;

  fs.writeFileSync('scripts/deploy-domain.sh', deployScript);
  fs.chmodSync('scripts/deploy-domain.sh', '755');
  console.log('✅ scripts/deploy-domain.sh creado');
}

console.log('💡 INSTRUCCIONES:');
console.log('• Asegúrate de tener el dominio registrado');
console.log('• Cloudflare es recomendado para mejor rendimiento');
console.log('• El SSL se configurará automáticamente\n');

askQuestion(0);
