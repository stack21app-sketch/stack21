# 🚀 Configuración Rápida - Plataforma SaaS de IA

## ⚡ Configuración en 3 Pasos

### 1. 📋 Variables de Entorno
Crea un archivo `.env.local` con estas variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL="https://tu-proyecto.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="tu-anon-key"
SUPABASE_SERVICE_ROLE_KEY="tu-service-role-key"

# Base de datos (Supabase PostgreSQL)
DATABASE_URL="postgresql://postgres:password@db.tu-proyecto.supabase.co:5432/postgres"
DIRECT_URL="postgresql://postgres:password@db.tu-proyecto.supabase.co:5432/postgres"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="tu-clave-secreta-super-segura"

# OAuth Providers
GOOGLE_CLIENT_ID="tu-google-client-id"
GOOGLE_CLIENT_SECRET="tu-google-client-secret"
GITHUB_CLIENT_ID="tu-github-client-id"
GITHUB_CLIENT_SECRET="tu-github-client-secret"

# Aplicación
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 2. 🗄️ Configurar Base de Datos
Ejecuta este comando para configurar automáticamente la base de datos:

```bash
npm run db:setup
```

**O manualmente:**
```bash
# 1. Generar cliente de Prisma
npm run db:generate

# 2. Sincronizar esquema con Supabase
npm run db:push

# 3. Crear datos de ejemplo
npm run db:seed
```

### 3. 🚀 Iniciar la Aplicación
```bash
npm run dev
```

¡Listo! Ve a http://localhost:3000

## 🔧 Configuración de Supabase

### 1. Crear Proyecto en Supabase
1. Ve a [supabase.com](https://supabase.com)
2. Crea un nuevo proyecto
3. Copia las credenciales de la pestaña "Settings" > "API"

### 2. Ejecutar SQL en Supabase
Ve al SQL Editor de Supabase y ejecuta el script de `scripts/setup-supabase.sql`

### 3. Configurar OAuth (Opcional)
- **Google**: [Google Cloud Console](https://console.cloud.google.com)
- **GitHub**: [GitHub Developer Settings](https://github.com/settings/developers)

## 🎯 Funciones Disponibles

### ✅ Implementadas
- 🔐 Autenticación (Google/GitHub)
- 🏢 Gestión de Workspaces
- 🖼️ Generador de Imágenes IA
- 🎵 Generador de Música IA
- 🤖 Chatbot Personalizado
- 📝 Editor de Texto IA
- 📊 Analytics y Métricas
- 🔔 Sistema de Notificaciones
- 💳 Facturación (Stripe ready)
- 👥 Gestión de Equipos
- ⚙️ Configuraciones Avanzadas

### 🚧 Preparadas para Desarrollo
- 🔄 Integración real con OpenAI
- 📈 Métricas reales de base de datos
- 🔔 Notificaciones push
- 📱 App móvil

## 🆘 Solución de Problemas

### Error de Conexión a Base de Datos
```bash
# Verificar variables de entorno
echo $DATABASE_URL

# Regenerar cliente de Prisma
npm run db:generate

# Verificar conexión
npm run db:studio
```

### Error de Autenticación
1. Verifica las credenciales OAuth
2. Asegúrate de que las URLs de callback estén configuradas
3. Revisa los logs del servidor

### Error de Workspace
1. Verifica que el script SQL se ejecutó correctamente
2. Revisa los triggers de Supabase
3. Ejecuta `npm run db:seed` para crear datos de ejemplo

## 📞 Soporte

Si tienes problemas:
1. Revisa los logs del servidor
2. Verifica las variables de entorno
3. Asegúrate de que Supabase esté activo
4. Ejecuta `npm run db:setup` para reconfigurar

¡Disfruta tu plataforma SaaS de IA! 🎉
