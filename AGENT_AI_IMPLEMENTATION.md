# 🤖 Implementación del Agente AI con Planes y Facturación

Este documento describe la implementación completa del sistema de Agente AI con planes de suscripción, límites de uso y facturación para Stack21.

## 📋 Resumen de Implementación

### ✅ Componentes Implementados

1. **Variables de entorno** - Configuración de modelos AI y límites
2. **Esquema de base de datos** - Tablas para planes, uso y logs
3. **Sistema de uso** - Contadores y metrado por organización
4. **Guard de límites** - Control de acceso y límites por plan
5. **Cache inteligente** - FAQs y respuestas frecuentes
6. **Cliente OpenAI** - Optimizado con selección de modelos
7. **Endpoints del agente** - Público y administrativo
8. **Endpoints de facturación** - Stripe integration
9. **UI de facturación** - Dashboard y gestión de planes
10. **Scripts de configuración** - Stripe y mantenimiento
11. **Tests** - Unitarios e integración

## 🚀 Instrucciones de Implementación

### 1. Variables de Entorno

Añade estas variables a tu archivo `.env`:

```env
# OpenAI
OPENAI_API_KEY="sk-..."
OPENAI_MODEL_PRIMARY="gpt-4o-mini"
OPENAI_MODEL_FALLBACK="gpt-4"

# Agente AI - Límites y cuotas
AGENT_SOFTCAP_CHATS_PRO=1000
AGENT_SOFTCAP_CHATS_FREE=20
AGENT_HARDCAP_TOKENS_DAILY_FREE=1000
AGENT_SOFTCAP_MINUTES_PREMIUM=200

# Cache y optimización
ENABLE_REALTIME=false
CACHE_TTL_FAQ_SECONDS=86400

# Stripe (ya deberías tenerlas)
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
```

### 2. Base de Datos

Ejecuta la migración en Supabase SQL Editor:

```bash
# El archivo está en migrations/agent-ai-billing.sql
# Copia y pega el contenido en Supabase SQL Editor
```

### 3. Configurar Stripe

Ejecuta el script de configuración:

```bash
node scripts/setup-stripe-products.js
```

Esto creará:
- Productos: Free (€0), Pro (€15/mes), Premium (€29/mes)
- Add-ons: 1000 chats (€5), 60 min voz (€5)
- Webhook para sincronización

### 4. Configurar Cron Job

Para resetear contadores mensualmente:

```bash
# Opción 1: Cron directo
0 0 1 * * /usr/bin/node /path/to/scripts/reset-monthly-usage.js reset

# Opción 2: PM2
pm2 start scripts/reset-monthly-usage.js --cron "0 0 1 * *"
```

### 5. Instalar Dependencias

```bash
npm install openai stripe sonner
```

## 📊 Estructura del Sistema

### Planes y Límites

| Plan | Precio | Chats/mes | Tokens/día | Voz | Features |
|------|--------|-----------|------------|-----|----------|
| Free | €0 | 20 | 1,000 | ❌ | Básico |
| Pro | €15 | 1,000 | 50,000 | ❌ | + Marketing AI |
| Premium | €29 | 5,000 | 100,000 | ✅ | + Voz + Prioridad |

### Endpoints Principales

- `POST /api/agent/public` - Chat público del agente
- `POST /api/agent/admin` - Chat administrativo
- `GET /api/usage/current` - Estado de uso actual
- `POST /api/billing/subscribe` - Suscripción a plan
- `POST /api/billing/create-portal` - Portal de cliente Stripe
- `POST /api/billing/webhook` - Webhook de Stripe

### Tablas de Base de Datos

- `usage_counters` - Contadores mensuales por organización
- `agent_action_logs` - Logs detallados de uso
- `org_faqs` - FAQs específicas por organización
- `agent_cache` - Cache de respuestas frecuentes
- `billing_addons` - Add-ons y extras de facturación

## 🔧 Configuración Avanzada

### Modelos AI

El sistema usa `gpt-4o-mini` por defecto (económico) y `gpt-4` como fallback para tareas complejas.

### Cache Inteligente

- **Hard cache**: FAQs del negocio (sin consumir tokens)
- **Soft cache**: Respuestas frecuentes con TTL
- **Similitud semántica**: Búsqueda por trigramas

### Límites Inteligentes

- **Soft cap**: Aviso cuando se alcanza el límite recomendado
- **Hard cap**: Bloqueo cuando se excede el límite máximo
- **Tolerancia**: 10% extra para planes Pro/Premium
- **Reset mensual**: Contadores se resetean automáticamente

## 🧪 Testing

Ejecutar tests:

```bash
# Tests unitarios
npm test src/__tests__/agent-guard.test.ts
npm test src/__tests__/faq-cache.test.ts

# Tests de integración
npm test src/__tests__/integration/agent-api.test.ts
```

## 📈 Monitoreo y Métricas

### Logs Disponibles

- Uso por organización y mes
- Tokens consumidos por consulta
- Tiempo de respuesta
- Tasa de cache hits
- Errores y fallbacks

### Reportes Automáticos

El script `reset-monthly-usage.js` genera reportes mensuales con:
- Total de chats por plan
- Tokens consumidos
- Minutos de voz utilizados
- Estadísticas de uso por organización

## 🔒 Seguridad

### Autenticación

- Endpoints públicos: Verificación por `handle` de organización
- Endpoints admin: Autenticación JWT requerida
- Webhooks: Verificación de firma Stripe

### Límites de Protección

- Rate limiting por plan
- Límites diarios de tokens (especialmente Free)
- Validación de input en todos los endpoints
- Sanitización de logs para privacidad

## 🚨 Troubleshooting

### Problemas Comunes

1. **Error de límites**: Verificar configuración de variables de entorno
2. **Cache no funciona**: Revisar conexión a Supabase
3. **Webhook falla**: Verificar `STRIPE_WEBHOOK_SECRET`
4. **Modelos no responden**: Verificar `OPENAI_API_KEY`

### Logs de Debug

```bash
# Ver logs del agente
tail -f logs/agent.log

# Verificar estado de contadores
node scripts/reset-monthly-usage.js report
```

## 📚 Documentación Adicional

- [API Documentation](./docs/API_DOCUMENTATION.md)
- [Stripe Setup Guide](./STRIPE_SETUP.md)
- [Deployment Guide](./DEPLOYMENT_GUIDE.md)

## 🤝 Soporte

Para problemas o preguntas:
1. Revisar logs de error
2. Verificar configuración de variables de entorno
3. Consultar documentación de Stripe/OpenAI
4. Crear issue en el repositorio

---

**¡El sistema está listo para producción!** 🎉

Con esta implementación tienes un agente AI completo con:
- ✅ Control de costes optimizado
- ✅ Límites por plan configurable
- ✅ Facturación automática con Stripe
- ✅ Cache inteligente para ahorrar tokens
- ✅ Monitoreo y logs detallados
- ✅ UI completa para gestión
