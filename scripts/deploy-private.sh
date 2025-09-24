#!/bin/bash

# 🚀 Script de Deploy Privado para Stack21
# ========================================

set -e  # Exit on any error

echo "🚀 Iniciando deploy privado de Stack21..."

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para logging
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

success() {
    echo -e "${GREEN}✅ $1${NC}"
}

warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

error() {
    echo -e "${RED}❌ $1${NC}"
}

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    error "No se encontró package.json. Ejecuta este script desde la raíz del proyecto."
    exit 1
fi

# Verificar que Node.js está instalado
if ! command -v node &> /dev/null; then
    error "Node.js no está instalado. Por favor instálalo primero."
    exit 1
fi

# Verificar que npm está instalado
if ! command -v npm &> /dev/null; then
    error "npm no está instalado. Por favor instálalo primero."
    exit 1
fi

log "Verificando dependencias..."

# Instalar dependencias
if [ ! -d "node_modules" ]; then
    log "Instalando dependencias..."
    npm install
    success "Dependencias instaladas"
else
    log "Verificando dependencias actualizadas..."
    npm ci
    success "Dependencias verificadas"
fi

# Verificar variables de entorno
log "Verificando configuración..."

if [ ! -f ".env.production" ]; then
    warning "Archivo .env.production no encontrado"
    echo "Creando archivo de ejemplo..."
    cp .env.local .env.production 2>/dev/null || echo "NODE_ENV=production" > .env.production
    warning "Por favor configura .env.production antes del deploy"
fi

# Build para producción
log "Construyendo aplicación para producción..."
npm run build

if [ $? -eq 0 ]; then
    success "Build completado exitosamente"
else
    error "Error en el build"
    exit 1
fi

# Verificar que el build se completó
if [ ! -d ".next" ]; then
    error "Directorio .next no encontrado. El build falló."
    exit 1
fi

# Ejecutar tests (opcional)
read -p "¿Ejecutar tests antes del deploy? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    log "Ejecutando tests..."
    npm run test 2>/dev/null || warning "Tests no configurados o fallaron"
fi

# Mostrar opciones de deploy
echo
echo "🎯 Opciones de Deploy:"
echo "1) Vercel (Recomendado para privado)"
echo "2) Railway"
echo "3) DigitalOcean App Platform"
echo "4) VPS/Docker"
echo "5) Solo build local (no deploy)"

read -p "Selecciona una opción (1-5): " -n 1 -r
echo

case $REPLY in
    1)
        log "Configurando deploy en Vercel..."
        if ! command -v vercel &> /dev/null; then
            log "Instalando Vercel CLI..."
            npm install -g vercel
        fi
        
        log "Iniciando deploy en Vercel..."
        vercel --prod
        success "Deploy en Vercel completado"
        ;;
    2)
        log "Configurando deploy en Railway..."
        if ! command -v railway &> /dev/null; then
            log "Instalando Railway CLI..."
            npm install -g @railway/cli
        fi
        
        log "Iniciando deploy en Railway..."
        railway login
        railway init
        railway up
        success "Deploy en Railway completado"
        ;;
    3)
        log "Configurando deploy en DigitalOcean..."
        warning "Configura manualmente en DigitalOcean App Platform:"
        echo "1. Conecta tu repositorio"
        echo "2. Configura variables de entorno"
        echo "3. Deploy automático"
        ;;
    4)
        log "Configurando deploy con Docker..."
        
        # Crear Dockerfile si no existe
        if [ ! -f "Dockerfile" ]; then
            log "Creando Dockerfile..."
            cat > Dockerfile << EOF
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
EOF
        fi
        
        # Crear docker-compose.yml si no existe
        if [ ! -f "docker-compose.yml" ]; then
            log "Creando docker-compose.yml..."
            cat > docker-compose.yml << EOF
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    depends_on:
      - db
  db:
    image: postgres:15
    environment:
      POSTGRES_DB: stack21_prod
      POSTGRES_USER: username
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
EOF
        fi
        
        log "Construyendo imagen Docker..."
        docker build -t stack21-private .
        
        log "Iniciando contenedores..."
        docker-compose up -d
        
        success "Deploy con Docker completado"
        echo "Aplicación disponible en: http://localhost:3000"
        ;;
    5)
        success "Build local completado"
        echo "Para iniciar la aplicación:"
        echo "  npm start"
        echo "  o"
        echo "  node server.js"
        ;;
    *)
        error "Opción inválida"
        exit 1
        ;;
esac

# Mostrar información post-deploy
echo
echo "🎉 Deploy completado!"
echo
echo "📋 Próximos pasos:"
echo "1. Configura las variables de entorno en tu plataforma"
echo "2. Configura la base de datos"
echo "3. Configura el dominio privado"
echo "4. Configura SSL/TLS"
echo "5. Configura autenticación básica si es necesario"
echo
echo "📚 Documentación completa en: deploy-config.md"
echo
echo "🔧 Comandos útiles:"
echo "  - Ver logs: pm2 logs stack21"
echo "  - Reiniciar: pm2 restart stack21"
echo "  - Estado: pm2 status"
echo
success "¡Stack21 está listo para uso privado! 🚀"
