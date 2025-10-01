#!/bin/bash

echo "🚀 Iniciando Stack21..."
echo "================================"

# Verificar si el servidor ya está corriendo
if lsof -i :3000 > /dev/null 2>&1; then
    echo "✅ Servidor ya está corriendo en puerto 3000"
    echo "🌐 Abre http://localhost:3000 en tu navegador"
else
    echo "⏳ Iniciando servidor..."
    npm run dev
fi

echo ""
echo "📋 Información de acceso:"
echo "• URL: http://localhost:3000"
echo "• Credenciales demo: demo@stack21.com / demo123"
echo "• Dashboard: http://localhost:3000/dashboard"
echo "• Workflow Builder: http://localhost:3000/workflow-builder"
echo ""
echo "🔧 Para configurar OAuth:"
echo "• Ejecuta: node setup-oauth.js"
echo "• Sigue las instrucciones en OAUTH_SETUP.md"
echo ""
echo "✨ ¡Stack21 está listo para usar!"
