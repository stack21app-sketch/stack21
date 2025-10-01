# 🚀 Guía de Configuración - Stack21

## ✅ Estado Actual
- ✅ Servidor funcionando en `http://localhost:3000`
- ✅ Dashboard cargando correctamente
- ✅ Variables de entorno configuradas
- ✅ Caché limpiada y errores resueltos

## 📋 Configuraciones Disponibles

### 1. **Base de Datos (Supabase)**
```bash
# En .env.local
NEXT_PUBLIC_SUPABASE_URL="tu-url-de-supabase"
NEXT_PUBLIC_SUPABASE_ANON_KEY="tu-clave-anonima"
```

**Pasos para configurar Supabase:**
1. Ve a [supabase.com](https://supabase.com)
2. Crea un nuevo proyecto
3. Copia la URL y la clave anónima
4. Ejecuta el script SQL en `create-tables.sql`

### 2. **Autenticación OAuth (Google/GitHub)**
```bash
# En .env.local
GOOGLE_CLIENT_ID="tu-google-client-id"
GOOGLE_CLIENT_SECRET="tu-google-client-secret"
GITHUB_CLIENT_ID="tu-github-client-id"
GITHUB_CLIENT_SECRET="tu-github-client-secret"
```

**Configurar Google OAuth:**
1. Ve a [Google Cloud Console](https://console.cloud.google.com)
2. Crea un proyecto o selecciona uno existente
3. Habilita la API de Google+
4. Crea credenciales OAuth 2.0
5. Agrega `http://localhost:3000/api/auth/callback/google` como redirect URI

### 3. **OpenAI (Para funcionalidades de IA)**
```bash
# En .env.local
OPENAI_API_KEY="sk-tu-clave-de-openai"
OPENAI_MODEL_PRIMARY="gpt-4o-mini"
OPENAI_MODEL_FALLBACK="gpt-4"
```

### 4. **Stripe (Para pagos)**
```bash
# En .env.local
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
```

## 🎯 Funcionalidades Implementadas

### ✅ **Dashboard Principal**
- Métricas en tiempo real
- Actividad reciente
- Acciones rápidas
- Diseño responsive con glassmorphism

### ✅ **Workflows Avanzados**
- Constructor visual drag-and-drop
- Lógica condicional
- Ejecución en paralelo
- Integración con IA

### ✅ **Chatbots con IA**
- Interfaz de chat
- Configuración de personalidad
- Historial de conversaciones
- Integración con workflows

### ✅ **Automatización de Emails**
- Plantillas personalizables
- Programación automática
- Seguimiento de entregas
- Analytics de engagement

### ✅ **Sistema de Analytics**
- Métricas de rendimiento
- Reportes personalizados
- Insights inteligentes
- Exportación de datos

### ✅ **Gestión de Equipos**
- Roles y permisos
- Invitaciones
- Colaboración en tiempo real
- Historial de actividades

### ✅ **Marketplace**
- Plantillas de workflows
- Sistema de ratings
- Búsqueda y filtros
- Compartir y descubrir

### ✅ **Sistema de Facturación**
- Planes de suscripción
- Pagos automáticos
- Facturación inteligente
- Gestión de clientes

### ✅ **Integraciones Externas**
- Slack
- Discord
- Zapier
- Webhooks
- Email SMTP

## 🔧 Comandos Útiles

```bash
# Limpiar caché
rm -rf .next

# Reiniciar servidor
npm run dev

# Verificar variables de entorno
cat .env.local

# Ver logs del servidor
npm run dev
```

## 📱 URLs Importantes

- **Dashboard:** http://localhost:3000/dashboard
- **Workflows:** http://localhost:3000/dashboard/workflows
- **Chatbots:** http://localhost:3000/dashboard/chatbot
- **Analytics:** http://localhost:3000/dashboard/analytics
- **Configuración:** http://localhost:3000/dashboard/settings
- **Marketplace:** http://localhost:3000/dashboard/marketplace

## 🚀 Próximos Pasos

1. **Configurar Supabase** para base de datos real
2. **Configurar OAuth** para autenticación
3. **Configurar OpenAI** para funcionalidades de IA
4. **Configurar Stripe** para pagos
5. **Personalizar diseño** según necesidades
6. **Agregar tests** automatizados
7. **Preparar para producción**

## 📞 Soporte

Si necesitas ayuda con la configuración, revisa:
- Los logs del servidor en la terminal
- Los archivos de configuración en `.env.local`
- La documentación de cada servicio (Supabase, Google, etc.)

¡Tu plataforma Stack21 está lista para usar! 🎉