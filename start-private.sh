#!/bin/bash

# 🚀 Script de Inicio Rápido para Stack21 - Deploy Privado
# ========================================================

set -e

# Colores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}🚀 Iniciando Stack21 en modo privado...${NC}"

# Verificar si Docker está instalado
if command -v docker &> /dev/null; then
    echo -e "${GREEN}✅ Docker encontrado${NC}"
    
    # Verificar si docker-compose está instalado
    if command -v docker-compose &> /dev/null; then
        echo -e "${GREEN}✅ Docker Compose encontrado${NC}"
        
        # Crear directorio de logs si no existe
        mkdir -p logs
        
        # Iniciar con Docker Compose
        echo -e "${BLUE}🐳 Iniciando con Docker Compose...${NC}"
        docker-compose up -d
        
        echo -e "${GREEN}✅ Stack21 iniciado con Docker${NC}"
        echo -e "${YELLOW}📱 Aplicación disponible en: http://localhost:3000${NC}"
        echo -e "${YELLOW}🗄️  Base de datos disponible en: localhost:5432${NC}"
        echo -e "${YELLOW}🔴 Redis disponible en: localhost:6379${NC}"
        
    else
        echo -e "${YELLOW}⚠️  Docker Compose no encontrado, iniciando solo la app...${NC}"
        docker build -t stack21-private .
        docker run -p 3000:3000 --name stack21-app stack21-private
    fi
    
else
    echo -e "${YELLOW}⚠️  Docker no encontrado, iniciando con Node.js...${NC}"
    
    # Verificar si Node.js está instalado
    if ! command -v node &> /dev/null; then
        echo -e "${RED}❌ Node.js no está instalado${NC}"
        exit 1
    fi
    
    # Instalar dependencias si es necesario
    if [ ! -d "node_modules" ]; then
        echo -e "${BLUE}📦 Instalando dependencias...${NC}"
        npm install
    fi
    
    # Build si es necesario
    if [ ! -d ".next" ]; then
        echo -e "${BLUE}🔨 Construyendo aplicación...${NC}"
        npm run build
    fi
    
    # Iniciar aplicación
    echo -e "${BLUE}🚀 Iniciando aplicación...${NC}"
    npm start
fi

echo -e "${GREEN}🎉 ¡Stack21 está ejecutándose en modo privado!${NC}"
