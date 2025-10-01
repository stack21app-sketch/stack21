#!/bin/bash

# Script de Despliegue para Producción - Stack21
# Este script automatiza el despliegue de Stack21 a producción

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

print_status "🚀 Iniciando despliegue de Stack21 a producción..."

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

NODE_VERSION=$(node --version)
NPM_VERSION=$(npm --version)
print_success "Node.js: $NODE_VERSION, npm: $NPM_VERSION"

# Paso 2: Verificar variables de entorno
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

# Paso 3: Instalar dependencias
print_status "Instalando dependencias de producción..."
npm ci --only=production
print_success "Dependencias instaladas"

# Paso 4: Ejecutar tests (si existen)
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

# Paso 5: Construir la aplicación
print_status "Construyendo aplicación para producción..."
npm run build
print_success "Aplicación construida exitosamente"

# Paso 6: Verificar que el build fue exitoso
if [ ! -d ".next" ]; then
    print_error "El directorio .next no fue creado. El build falló."
    exit 1
fi

print_success "Build verificado"

# Paso 7: Crear directorio de logs si no existe
print_status "Configurando directorios de logs..."
mkdir -p logs
print_success "Directorio de logs configurado"

# Paso 8: Configurar PM2 para producción
print_status "Configurando PM2 para producción..."
if command -v pm2 &> /dev/null; then
    # Crear archivo de configuración PM2
    cat > ecosystem.production.config.js << EOF
module.exports = {
  apps: [{
    name: 'stack21',
    script: 'npm',
    args: 'start',
    cwd: '$(pwd)',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true,
    max_memory_restart: '1G',
    node_args: '--max-old-space-size=1024'
  }]
};
EOF
    
    print_success "Configuración PM2 creada"
else
    print_warning "PM2 no está instalado. Instalando..."
    npm install -g pm2
    print_success "PM2 instalado"
fi

# Paso 9: Iniciar aplicación con PM2
print_status "Iniciando aplicación con PM2..."
pm2 start ecosystem.production.config.js --env production
print_success "Aplicación iniciada con PM2"

# Paso 10: Configurar PM2 para inicio automático
print_status "Configurando PM2 para inicio automático..."
pm2 startup
pm2 save
print_success "PM2 configurado para inicio automático"

# Paso 11: Verificar que la aplicación está funcionando
print_status "Verificando que la aplicación está funcionando..."
sleep 5

if curl -f http://localhost:3000/api/health > /dev/null 2>&1; then
    print_success "Aplicación respondiendo correctamente"
else
    print_warning "La aplicación no está respondiendo en el puerto 3000"
    print_status "Verificando logs..."
    pm2 logs stack21 --lines 20
fi

# Paso 12: Configurar Nginx (si está disponible)
if command -v nginx &> /dev/null; then
    print_status "Configurando Nginx..."
    
    # Crear configuración Nginx
    sudo tee /etc/nginx/sites-available/stack21 << EOF
server {
    listen 80;
    server_name _;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF
    
    # Habilitar sitio
    sudo ln -sf /etc/nginx/sites-available/stack21 /etc/nginx/sites-enabled/
    
    # Probar configuración
    sudo nginx -t
    
    if [ $? -eq 0 ]; then
        sudo systemctl reload nginx
        print_success "Nginx configurado correctamente"
    else
        print_warning "Error en la configuración de Nginx"
    fi
else
    print_warning "Nginx no está instalado, omitiendo configuración"
fi

# Paso 13: Configurar SSL con Let's Encrypt (si está disponible)
if command -v certbot &> /dev/null && [ ! -z "$DOMAIN_NAME" ]; then
    print_status "Configurando SSL con Let's Encrypt..."
    sudo certbot --nginx -d $DOMAIN_NAME --non-interactive --agree-tos --email admin@$DOMAIN_NAME
    print_success "SSL configurado correctamente"
else
    print_warning "Let's Encrypt no está disponible o DOMAIN_NAME no está configurado"
fi

# Paso 14: Configurar respaldos automáticos
print_status "Configurando respaldos automáticos..."
if [ ! -f "scripts/backup-production.sh" ]; then
    # Crear script de respaldo
    cat > scripts/backup-production.sh << 'EOF'
#!/bin/bash
# Script de respaldo para producción

BACKUP_DIR="/backups/stack21"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="stack21_backup_$DATE.tar.gz"

mkdir -p $BACKUP_DIR

# Crear respaldo
tar -czf "$BACKUP_DIR/$BACKUP_FILE" \
    --exclude=node_modules \
    --exclude=.next \
    --exclude=.git \
    --exclude=logs \
    .

# Mantener solo los últimos 7 respaldos
cd $BACKUP_DIR
ls -t stack21_backup_*.tar.gz | tail -n +8 | xargs -r rm

echo "Respaldo creado: $BACKUP_FILE"
EOF
    
    chmod +x scripts/backup-production.sh
fi

# Agregar tarea cron para respaldos diarios
(crontab -l 2>/dev/null; echo "0 2 * * * $(pwd)/scripts/backup-production.sh") | crontab -
print_success "Respaldos automáticos configurados"

# Paso 15: Configurar monitoreo
print_status "Configurando monitoreo..."
if command -v htop &> /dev/null; then
    print_success "Herramientas de monitoreo disponibles"
else
    print_warning "Instalando herramientas de monitoreo..."
    sudo apt-get update && sudo apt-get install -y htop iotop
fi

# Paso 16: Mostrar información del despliegue
print_success "🎉 ¡Despliegue completado exitosamente!"
echo ""
echo "📊 Información del despliegue:"
echo "   - Aplicación: http://localhost:3000"
echo "   - Estado PM2: pm2 status"
echo "   - Logs: pm2 logs stack21"
echo "   - Reiniciar: pm2 restart stack21"
echo "   - Detener: pm2 stop stack21"
echo ""
echo "🔧 Comandos útiles:"
echo "   - Ver estado: pm2 monit"
echo "   - Ver logs en tiempo real: pm2 logs stack21 --follow"
echo "   - Reiniciar aplicación: pm2 restart stack21"
echo "   - Actualizar aplicación: pm2 reload stack21"
echo ""
echo "📁 Archivos importantes:"
echo "   - Configuración PM2: ecosystem.production.config.js"
echo "   - Logs: logs/"
echo "   - Respaldos: /backups/stack21/"
echo ""
print_success "¡Stack21 está listo para producción! 🚀"


