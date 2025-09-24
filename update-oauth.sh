#!/bin/bash

echo "🔧 Actualizando credenciales de Google OAuth..."
echo ""

# Solicitar las credenciales
read -p "Ingresa tu Google Client ID: " GOOGLE_CLIENT_ID
read -p "Ingresa tu Google Client Secret: " GOOGLE_CLIENT_SECRET

# Verificar que se ingresaron las credenciales
if [ -z "$GOOGLE_CLIENT_ID" ] || [ -z "$GOOGLE_CLIENT_SECRET" ]; then
    echo "❌ Error: Debes ingresar ambas credenciales"
    exit 1
fi

# Actualizar el archivo .env.local
echo "📝 Actualizando .env.local..."

# Crear el nuevo archivo .env.local
cat > .env.local << EOF
# Base de datos
DATABASE_URL="postgresql://username:password@localhost:5432/saas_starter?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="tu-clave-secreta-super-segura-aqui-cambiar-en-produccion"

# OAuth Providers
GOOGLE_CLIENT_ID="${GOOGLE_CLIENT_ID}"
GOOGLE_CLIENT_SECRET="${GOOGLE_CLIENT_SECRET}"
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"

# Stripe (configurar con tus claves reales)
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# OpenAI (configurar con tu clave real)
OPENAI_API_KEY="sk-..."

# Aplicación
NEXT_PUBLIC_APP_URL="http://localhost:3000"
EOF

echo "✅ Credenciales actualizadas exitosamente!"
echo ""
echo "🔄 Reiniciando servidor..."
echo ""

# Reiniciar el servidor
pkill -f "next dev" 2>/dev/null
sleep 2
npm run dev &

echo "🚀 Servidor reiniciado. Puedes probar la autenticación ahora."
echo ""
echo "📋 URLs importantes:"
echo "   - Aplicación: http://localhost:3000"
echo "   - Login: http://localhost:3000/auth/signin"
echo "   - Debug: http://localhost:3000/dashboard/debug"
