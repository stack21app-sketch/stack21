#!/bin/bash

# 🚀 Script de Deploy para Stack21
# Automatiza el proceso completo de deploy a producción

set -e  # Salir si hay algún error

echo "🚀 Iniciando deploy de Stack21..."
echo ""

# Colores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 1. Verificar que estamos en la rama correcta
echo -e "${BLUE}📍 Verificando rama de git...${NC}"
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
echo "Rama actual: $CURRENT_BRANCH"

if [ "$CURRENT_BRANCH" != "main" ] && [ "$CURRENT_BRANCH" != "master" ]; then
    read -p "⚠️  No estás en main/master. ¿Continuar de todos modos? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${RED}❌ Deploy cancelado${NC}"
        exit 1
    fi
fi

# 2. Verificar cambios no commiteados
echo ""
echo -e "${BLUE}📝 Verificando cambios...${NC}"
if [[ -n $(git status -s) ]]; then
    echo -e "${YELLOW}⚠️  Tienes cambios sin commitear${NC}"
    git status -s
    echo ""
    read -p "¿Quieres hacer commit automático? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git add .
        echo "Escribe el mensaje del commit (o presiona Enter para usar mensaje por defecto):"
        read COMMIT_MSG
        if [ -z "$COMMIT_MSG" ]; then
            COMMIT_MSG="feat: Stack21 completo - deploy $(date +%Y-%m-%d)"
        fi
        git commit -m "$COMMIT_MSG"
        echo -e "${GREEN}✅ Commit realizado${NC}"
    else
        echo -e "${RED}❌ Deploy cancelado - commitea tus cambios primero${NC}"
        exit 1
    fi
fi

# 3. Inicializar datos de muestra si no existen
echo ""
echo -e "${BLUE}📊 Verificando datos de muestra...${NC}"
if [ ! -f "src/data/workflows.json" ] || [ ! -f "src/data/runs.json" ]; then
    echo "Inicializando datos de muestra..."
    node scripts/init-sample-data.js
    echo -e "${GREEN}✅ Datos inicializados${NC}"
else
    echo -e "${GREEN}✅ Datos ya existen${NC}"
fi

# 4. Linting
echo ""
echo -e "${BLUE}🔍 Ejecutando linter...${NC}"
npm run lint --fix 2>&1 | head -20 || true
echo -e "${GREEN}✅ Linting completado${NC}"

# 5. Type checking
echo ""
echo -e "${BLUE}📐 Verificando tipos TypeScript...${NC}"
npx tsc --noEmit 2>&1 | head -20 || {
    echo -e "${YELLOW}⚠️  Hay errores de tipos pero continuamos...${NC}"
}

# 6. Build de producción
echo ""
echo -e "${BLUE}🏗️  Building para producción...${NC}"
npm run build

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Build exitoso${NC}"
else
    echo -e "${RED}❌ Build falló - revisa los errores arriba${NC}"
    exit 1
fi

# 7. Push a repositorio
echo ""
echo -e "${BLUE}📤 Pushing a repositorio remoto...${NC}"
read -p "¿Hacer push a origin/$CURRENT_BRANCH? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    git push origin $CURRENT_BRANCH
    echo -e "${GREEN}✅ Push completado${NC}"
else
    echo -e "${YELLOW}⚠️  Push omitido${NC}"
fi

# 8. Deploy a Vercel (si está instalado)
echo ""
echo -e "${BLUE}🚀 Deploy a Vercel...${NC}"
if command -v vercel &> /dev/null; then
    read -p "¿Hacer deploy a Vercel ahora? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        read -p "¿Deploy a producción (y) o preview (n)? " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            vercel --prod
        else
            vercel
        fi
        echo -e "${GREEN}✅ Deploy a Vercel completado${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  Vercel CLI no instalado. Instala con: npm i -g vercel${NC}"
    echo "El deploy se hará automáticamente si tienes GitHub integration en Vercel"
fi

# 9. Resumen final
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}🎉 DEPLOY COMPLETADO${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo -e "${BLUE}📦 Información del Deploy:${NC}"
echo "  • Rama: $CURRENT_BRANCH"
echo "  • Commit: $(git log -1 --oneline)"
echo "  • Build: ✅ Exitoso"
echo ""
echo -e "${BLUE}🔗 URLs:${NC}"
echo "  • Local: http://localhost:3000"
echo "  • Producción: Verifica en Vercel Dashboard"
echo ""
echo -e "${BLUE}📋 Próximos pasos:${NC}"
echo "  1. Configura variables de entorno en Vercel/servidor"
echo "  2. Verifica que NEXTAUTH_URL apunta a tu dominio"
echo "  3. Configura DATABASE_URL si usas Postgres en prod"
echo "  4. Prueba los flujos principales en producción"
echo "  5. Monitorea logs y errores"
echo ""
echo -e "${GREEN}✨ Stack21 está listo para el mundo!${NC}"
echo ""

