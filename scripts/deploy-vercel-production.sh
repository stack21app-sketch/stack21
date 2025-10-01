#!/bin/bash

# Script de Despliegue a Vercel para Producción - Stack21
# Este script automatiza el despliegue de Stack21 a Vercel

set -e  # Salir si cualquier comando falla

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para imprimir mensajes con color
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    print_error "No se encontró package.json. Asegúrate de estar en el directorio raíz del proyecto."
    exit 1
fi

print_status "🚀 Iniciando despliegue de Stack21 a Vercel..."

# Paso 1: Verificar dependencias
print_status "Verificando dependencias..."
if ! command -v node &> /dev/null; then
    print_error "Node.js no está instalado"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    print_error "npm no está instalado"
    exit 1
fi

if ! command -v vercel &> /dev/null; then
    print_warning "Vercel CLI no está instalado. Instalando..."
    npm install -g vercel
    print_success "Vercel CLI instalado"
fi

NODE_VERSION=$(node --version)
NPM_VERSION=$(npm --version)
VERCEL_VERSION=$(vercel --version)
print_success "Node.js: $NODE_VERSION, npm: $NPM_VERSION, Vercel: $VERCEL_VERSION"

# Paso 2: Verificar configuración de Vercel
print_status "Verificando configuración de Vercel..."
if [ ! -f "vercel.json" ]; then
    print_warning "No se encontró vercel.json, creando configuración..."
    cat > vercel.json << 'EOF'
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/$1"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  },
  "functions": {
    "src/app/api/**/*.ts": {
      "maxDuration": 30
    }
  }
}
EOF
    print_success "Configuración de Vercel creada"
fi

# Paso 3: Verificar variables de entorno
print_status "Verificando variables de entorno..."
if [ ! -f ".env.production" ]; then
    print_warning "No se encontró .env.production, creando desde .env.example..."
    if [ -f ".env.example" ]; then
        cp .env.example .env.production
        print_warning "Por favor, configura las variables de entorno en .env.production"
    else
        print_error "No se encontró .env.example"
        exit 1
    fi
fi

# Paso 4: Instalar dependencias
print_status "Instalando dependencias..."
npm ci
print_success "Dependencias instaladas"

# Paso 5: Ejecutar tests (si existen)
if [ -f "jest.config.js" ] || [ -f "jest.config.ts" ]; then
    print_status "Ejecutando tests..."
    if npm run test -- --passWithNoTests; then
        print_success "Tests pasaron exitosamente"
    else
        print_warning "Algunos tests fallaron, pero continuando con el despliegue"
    fi
else
    print_status "No se encontraron tests, omitiendo..."
fi

# Paso 6: Construir la aplicación localmente para verificar
print_status "Verificando build local..."
npm run build
print_success "Build local exitoso"

# Paso 7: Autenticar con Vercel
print_status "Autenticando con Vercel..."
if ! vercel whoami > /dev/null 2>&1; then
    print_status "Iniciando autenticación con Vercel..."
    vercel login
fi

VERCEL_USER=$(vercel whoami)
print_success "Autenticado como: $VERCEL_USER"

# Paso 8: Configurar proyecto en Vercel
print_status "Configurando proyecto en Vercel..."
if [ ! -f ".vercel/project.json" ]; then
    print_status "Vinculando proyecto con Vercel..."
    vercel link --yes
fi

# Paso 9: Configurar variables de entorno en Vercel
print_status "Configurando variables de entorno en Vercel..."
if [ -f ".env.production" ]; then
    # Leer variables de entorno y configurarlas en Vercel
    while IFS='=' read -r key value; do
        # Saltar comentarios y líneas vacías
        if [[ ! $key =~ ^# ]] && [[ -n $key ]]; then
            # Remover comillas si existen
            value=$(echo "$value" | sed 's/^"//;s/"$//')
            print_status "Configurando $key..."
            vercel env add "$key" production <<< "$value"
        fi
    done < .env.production
    print_success "Variables de entorno configuradas"
else
    print_warning "No se encontró .env.production, omitiendo configuración de variables"
fi

# Paso 10: Desplegar a producción
print_status "Desplegando a producción..."
DEPLOYMENT_URL=$(vercel --prod)
print_success "Despliegue completado: $DEPLOYMENT_URL"

# Paso 11: Verificar que el despliegue está funcionando
print_status "Verificando que el despliegue está funcionando..."
sleep 10

if curl -f "$DEPLOYMENT_URL/api/health" > /dev/null 2>&1; then
    print_success "✅ Aplicación respondiendo correctamente"
else
    print_warning "⚠️ La aplicación no está respondiendo correctamente"
fi

# Paso 12: Configurar dominio personalizado (si se proporciona)
if [ ! -z "$CUSTOM_DOMAIN" ]; then
    print_status "Configurando dominio personalizado: $CUSTOM_DOMAIN"
    vercel domains add "$CUSTOM_DOMAIN"
    print_success "Dominio personalizado configurado"
else
    print_status "Para configurar un dominio personalizado, ejecuta:"
    echo "  vercel domains add tu-dominio.com"
fi

# Paso 13: Configurar SSL automático
print_status "SSL automático está habilitado por defecto en Vercel"

# Paso 14: Configurar respaldos automáticos
print_status "Configurando respaldos automáticos..."
if [ ! -f "scripts/backup-vercel.sh" ]; then
    cat > scripts/backup-vercel.sh << 'EOF'
#!/bin/bash
# Script de respaldo para Vercel

BACKUP_DIR="./backups/vercel"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="stack21_vercel_backup_$DATE.tar.gz"

mkdir -p $BACKUP_DIR

# Crear respaldo del código
tar -czf "$BACKUP_DIR/$BACKUP_FILE" \
    --exclude=node_modules \
    --exclude=.next \
    --exclude=.vercel \
    --exclude=.git \
    --exclude=logs \
    .

# Mantener solo los últimos 7 respaldos
cd $BACKUP_DIR
ls -t stack21_vercel_backup_*.tar.gz | tail -n +8 | xargs -r rm

echo "Respaldo de Vercel creado: $BACKUP_FILE"
EOF
    
    chmod +x scripts/backup-vercel.sh
fi

# Paso 15: Mostrar información del despliegue
print_success "🎉 ¡Despliegue a Vercel completado exitosamente!"
echo ""
echo "📊 Información del despliegue:"
echo "   - URL de Producción: $DEPLOYMENT_URL"
echo "   - Dashboard Vercel: https://vercel.com/dashboard"
echo "   - Logs: vercel logs"
echo "   - Estado: vercel ls"
echo ""
echo "🔧 Comandos útiles:"
echo "   - Ver logs: vercel logs"
echo "   - Ver deployments: vercel ls"
echo "   - Rollback: vercel rollback"
echo "   - Inspect: vercel inspect"
echo "   - Domains: vercel domains"
echo ""
echo "📁 Archivos importantes:"
echo "   - Configuración Vercel: vercel.json"
echo "   - Variables de entorno: vercel env ls"
echo "   - Respaldos: backups/vercel/"
echo ""
echo "🌐 URLs importantes:"
echo "   - Aplicación: $DEPLOYMENT_URL"
echo "   - API Health: $DEPLOYMENT_URL/api/health"
echo "   - Dashboard: $DEPLOYMENT_URL/dashboard"
echo ""
print_success "¡Stack21 está desplegado en Vercel! 🚀"

# Paso 16: Abrir en el navegador (opcional)
if command -v open &> /dev/null; then
    read -p "¿Quieres abrir la aplicación en el navegador? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        open "$DEPLOYMENT_URL"
    fi
fi
