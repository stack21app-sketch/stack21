#!/bin/bash

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
vercel domains add vacio.stack21app.com

# Verificar deploy
echo "✅ Deploy completado!"
echo "🌐 Tu sitio está disponible en: https://vacio.stack21app.com"
echo ""
echo "📋 Próximos pasos:"
echo "1. Configura las variables de entorno en Vercel dashboard"
echo "2. Verifica que el dominio funcione correctamente"
echo "3. Configura SSL si no se activó automáticamente"
