#!/bin/bash

# Script para configurar la base de datos
echo "🚀 Configurando la base de datos..."

# Verificar si Prisma está instalado
if ! command -v npx &> /dev/null; then
    echo "❌ npx no está instalado. Por favor instala Node.js primero."
    exit 1
fi

# Generar el cliente de Prisma
echo "📦 Generando cliente de Prisma..."
npx prisma generate

# Aplicar migraciones a la base de datos
echo "🗄️ Aplicando migraciones a la base de datos..."
npx prisma db push

# Opcional: Abrir Prisma Studio
echo "🎉 ¡Base de datos configurada correctamente!"
echo "💡 Para abrir Prisma Studio, ejecuta: npm run db:studio"
echo "💡 Para ver el estado de la base de datos, ejecuta: npx prisma db status"
