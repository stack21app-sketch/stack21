#!/bin/bash

echo "🚀 Desplegando Stack21 a producción..."
echo "======================================"

# Verificar que estamos en la rama main
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "main" ]; then
    echo "❌ Error: Debes estar en la rama 'main' para desplegar"
    echo "💡 Ejecuta: git checkout main"
    exit 1
fi

# Verificar que no hay cambios sin commitear
if [ -n "$(git status --porcelain)" ]; then
    echo "❌ Error: Hay cambios sin commitear"
    echo "💡 Ejecuta: git add . && git commit -m 'Deploy: $(date)'"
    exit 1
fi

# Verificar que las variables de entorno están configuradas
echo "🔍 Verificando configuración..."

if [ -z "$NEXTAUTH_SECRET" ]; then
    echo "❌ Error: NEXTAUTH_SECRET no está configurado"
    exit 1
fi

if [ -z "$NEXTAUTH_URL" ]; then
    echo "❌ Error: NEXTAUTH_URL no está configurado"
    exit 1
fi

echo "✅ Configuración verificada"

# Construir la aplicación
echo "🔨 Construyendo aplicación..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Error: Falló la construcción de la aplicación"
    exit 1
fi

echo "✅ Aplicación construida exitosamente"

# Opciones de despliegue
echo ""
echo "🎯 Selecciona el método de despliegue:"
echo "1) Vercel (recomendado)"
echo "2) Docker"
echo "3) Manual"

read -p "Opción (1-3): " choice

case $choice in
    1)
        echo "🚀 Desplegando a Vercel..."
        npx vercel --prod
        ;;
    2)
        echo "🐳 Desplegando con Docker..."
        docker-compose -f docker-compose.prod.yml up -d
        ;;
    3)
        echo "📋 Instrucciones para despliegue manual:"
        echo "1. Sube los archivos a tu servidor"
        echo "2. Ejecuta: npm ci --production"
        echo "3. Ejecuta: npm run build"
        echo "4. Ejecuta: npm start"
        ;;
    *)
        echo "❌ Opción inválida"
        exit 1
        ;;
esac

echo ""
echo "🎉 ¡Despliegue completado!"
echo "🌐 Tu aplicación debería estar disponible en: $NEXTAUTH_URL"
