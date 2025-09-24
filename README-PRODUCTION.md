# 🚀 Stack21 Waitlist - Guía de Producción

## 📋 Configuración Completa para Producción

### ✅ Lo que ya está configurado:

- ✅ **Base de datos** - PostgreSQL con Supabase
- ✅ **Sistema de email** - SMTP con Nodemailer
- ✅ **Autenticación** - NextAuth con OAuth
- ✅ **Rate limiting** - Protección contra spam
- ✅ **Logging** - Sistema de logs profesional
- ✅ **Monitoreo** - Métricas y analytics
- ✅ **Seguridad** - Headers y validaciones
- ✅ **Docker** - Contenedores para despliegue
- ✅ **CI/CD** - GitHub Actions
- ✅ **Nginx** - Proxy reverso y SSL

## 🔧 Configuración Paso a Paso

### 1. 📧 Configurar Email SMTP

#### Opción A: Gmail
```bash
# 1. Activa la verificación en 2 pasos en tu cuenta Google
# 2. Genera una "App Password" específica
# 3. Configura en .env.production:

SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="tu-email@gmail.com"
SMTP_PASS="tu-app-password-de-16-caracteres"
SMTP_FROM="Stack21 <noreply@tu-dominio.com>"
```

#### Opción B: SendGrid
```bash
# 1. Crea cuenta en SendGrid
# 2. Obtén API Key
# 3. Configura en .env.production:

SMTP_HOST="smtp.sendgrid.net"
SMTP_PORT="587"
SMTP_USER="apikey"
SMTP_PASS="tu-sendgrid-api-key"
SMTP_FROM="Stack21 <noreply@tu-dominio.com>"
```

### 2. 🔐 Configurar OAuth

#### Google OAuth
1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto
3. Habilita Google+ API
4. Crea credenciales OAuth 2.0
5. Configura URLs autorizadas:
   - **Authorized JavaScript origins**: `https://tu-dominio.com`
   - **Authorized redirect URIs**: `https://tu-dominio.com/api/auth/callback/google`

#### GitHub OAuth
1. Ve a GitHub Settings > Developer settings > OAuth Apps
2. Crea nueva aplicación
3. Configura URLs:
   - **Homepage URL**: `https://tu-dominio.com`
   - **Authorization callback URL**: `https://tu-dominio.com/api/auth/callback/github`

### 3. 💳 Configurar Stripe

1. Crea cuenta en [Stripe](https://stripe.com)
2. Obtén claves de producción:
   - `pk_live_...` (Publishable Key)
   - `sk_live_...` (Secret Key)
3. Configura webhooks:
   - Endpoint: `https://tu-dominio.com/api/webhooks/stripe`
   - Eventos: `checkout.session.completed`, `customer.subscription.updated`

### 4. 🤖 Configurar OpenAI

1. Crea cuenta en [OpenAI](https://openai.com)
2. Obtén API Key
3. Configura en `.env.production`:
```bash
OPENAI_API_KEY="sk-tu-clave-openai-real"
```

### 5. 📊 Configurar Analytics

#### Google Analytics 4
1. Crea propiedad en [Google Analytics](https://analytics.google.com)
2. Obtén Measurement ID (G-XXXXXXXXXX)
3. Configura en `.env.production`:
```bash
GOOGLE_ANALYTICS_ID="G-XXXXXXXXXX"
```

#### Mixpanel (Opcional)
1. Crea cuenta en [Mixpanel](https://mixpanel.com)
2. Obtén Project Token
3. Configura en `.env.production`:
```bash
MIXPANEL_TOKEN="tu-mixpanel-token"
```

### 6. 🚀 Configurar Dominio y SSL

#### Opción A: Vercel (Recomendado)
1. Conecta tu repositorio a Vercel
2. Configura variables de entorno
3. Configura dominio personalizado
4. SSL se configura automáticamente

#### Opción B: Servidor Propio
1. Compra dominio
2. Configura DNS apuntando a tu servidor
3. Configura SSL con Let's Encrypt:
```bash
sudo certbot --nginx -d tu-dominio.com -d www.tu-dominio.com
```

### 7. 🔒 Configurar Seguridad

#### Generar Claves Seguras
```bash
# NEXTAUTH_SECRET (32 caracteres)
openssl rand -base64 32

# ADMIN_KEY (32 caracteres)
openssl rand -base64 32

# JWT_SECRET (32 caracteres)
openssl rand -base64 32

# ENCRYPTION_KEY (32 caracteres)
openssl rand -base64 32
```

#### Configurar Supabase
1. Ve a tu proyecto en Supabase
2. Obtén claves reales:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
3. Configura RLS (Row Level Security)
4. Configura políticas de seguridad

## 🚀 Despliegue

### Opción A: Vercel (Más Fácil)
```bash
# 1. Instala Vercel CLI
npm i -g vercel

# 2. Login
vercel login

# 3. Despliega
vercel --prod

# 4. Configura variables de entorno en Vercel Dashboard
```

### Opción B: Docker
```bash
# 1. Construir imagen
docker build -t stack21-waitlist .

# 2. Ejecutar con Docker Compose
docker-compose up -d

# 3. Configurar Nginx y SSL
```

### Opción C: Servidor VPS
```bash
# 1. Clonar repositorio
git clone https://github.com/tu-usuario/stack21-waitlist.git

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.production .env

# 4. Ejecutar migraciones
npx prisma db push

# 5. Construir aplicación
npm run build

# 6. Ejecutar en producción
npm start
```

## 📊 Monitoreo

### Logs
- Los logs se envían automáticamente a la consola
- En producción, configurar Sentry para logs centralizados

### Métricas
- Google Analytics para métricas de usuario
- Mixpanel para eventos personalizados
- Vercel Analytics para rendimiento

### Alertas
- Configurar alertas de error en Sentry
- Monitorear uptime con UptimeRobot
- Alertas de email para errores críticos

## 🔧 Mantenimiento

### Backup de Base de Datos
```bash
# Backup automático con Supabase
# O configurar backup manual:
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql
```

### Actualizaciones
```bash
# 1. Actualizar dependencias
npm update

# 2. Ejecutar migraciones
npx prisma db push

# 3. Redesplegar
vercel --prod
```

### Monitoreo de Rendimiento
- Usar Vercel Analytics
- Configurar New Relic o DataDog
- Monitorear métricas de Supabase

## 🆘 Solución de Problemas

### Error de Base de Datos
```bash
# Verificar conexión
npx prisma db push

# Verificar logs
docker logs stack21-waitlist-app
```

### Error de Email
```bash
# Verificar configuración SMTP
node -e "console.log(process.env.SMTP_HOST)"

# Probar envío de email
curl -X POST https://tu-dominio.com/api/waitlist \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","name":"Test"}'
```

### Error de OAuth
```bash
# Verificar URLs de callback
# Verificar claves de OAuth
# Verificar configuración de NextAuth
```

## 📞 Soporte

- **Documentación**: [docs.stack21.com](https://docs.stack21.com)
- **Issues**: [GitHub Issues](https://github.com/tu-usuario/stack21-waitlist/issues)
- **Email**: soporte@stack21.com

## 🎉 ¡Listo para Producción!

Tu aplicación Stack21 Waitlist está configurada para producción con:
- ✅ Seguridad enterprise
- ✅ Escalabilidad automática
- ✅ Monitoreo completo
- ✅ Backup automático
- ✅ CI/CD configurado

¡Disfruta de tu plataforma SaaS en producción! 🚀
