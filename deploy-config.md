# 🚀 Deploy Privado de Stack21

## 📋 Configuración de Variables de Entorno

Crea un archivo `.env.production` con las siguientes variables:

```bash
# Stack21 - Configuración de Producción Privada
# ================================================

# Base de datos
DATABASE_URL="postgresql://username:password@localhost:5432/stack21_prod"

# NextAuth.js
NEXTAUTH_URL="https://tu-dominio-privado.com"
NEXTAUTH_SECRET="tu-secret-super-seguro-aqui"

# OAuth Providers (opcional para deploy privado)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
GITHUB_CLIENT_ID=""
GITHUB_CLIENT_SECRET=""

# OpenAI
OPENAI_API_KEY="tu-openai-api-key"

# Stripe (opcional)
STRIPE_PUBLISHABLE_KEY=""
STRIPE_SECRET_KEY=""
STRIPE_WEBHOOK_SECRET=""

# Email (opcional)
SENDGRID_API_KEY=""
FROM_EMAIL="noreply@tu-dominio-privado.com"

# Configuración de la aplicación
NODE_ENV="production"
NEXT_PUBLIC_APP_URL="https://tu-dominio-privado.com"
NEXT_PUBLIC_APP_NAME="Stack21 Private"

# Configuración de seguridad
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW=900000

# Configuración de logging
LOG_LEVEL="info"
```

## 🔐 Configuración de Seguridad

### 1. Generar NEXTAUTH_SECRET
```bash
openssl rand -base64 32
```

### 2. Configurar Base de Datos
- Usar PostgreSQL en producción
- Configurar backup automático
- Usar conexiones SSL

### 3. Configurar Dominio Privado
- Usar subdominio privado (ej: dev.stack21.com)
- Configurar SSL/TLS
- Restringir acceso por IP si es necesario

## 🚀 Opciones de Deploy

### Opción 1: Vercel (Recomendado)
```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Configurar variables de entorno en Vercel Dashboard
```

### Opción 2: Railway
```bash
# Instalar Railway CLI
npm install -g @railway/cli

# Login y deploy
railway login
railway init
railway up
```

### Opción 3: DigitalOcean App Platform
```bash
# Crear app en DigitalOcean
# Conectar repositorio
# Configurar variables de entorno
```

### Opción 4: VPS Privado
```bash
# Configurar servidor privado
# Instalar Docker
# Deploy con Docker Compose
```

## 🔒 Configuración de Acceso Privado

### 1. Autenticación Básica
```javascript
// middleware.js
import { NextResponse } from 'next/server'

export function middleware(request) {
  const basicAuth = request.headers.get('authorization')
  const url = request.nextUrl

  if (basicAuth) {
    const authValue = basicAuth.split(' ')[1]
    const [user, pwd] = atob(authValue).split(':')

    if (user === 'admin' && pwd === 'tu-password-seguro') {
      return NextResponse.next()
    }
  }
  url.pathname = '/api/auth/unauthorized'
  return NextResponse.redirect(url)
}

export const config = {
  matcher: ['/((?!api/auth/unauthorized|_next/static|_next/image|favicon.ico).*)']
}
```

### 2. Restricción por IP
```javascript
// middleware.js
const allowedIPs = ['192.168.1.100', '10.0.0.50'] // Tus IPs

export function middleware(request) {
  const ip = request.ip || request.headers.get('x-forwarded-for')
  
  if (!allowedIPs.includes(ip)) {
    return new Response('Acceso denegado', { status: 403 })
  }
  
  return NextResponse.next()
}
```

## 📊 Monitoreo y Logs

### 1. Configurar Logging
```javascript
// lib/logger.js
import winston from 'winston'

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
})

export default logger
```

### 2. Health Check
```javascript
// app/api/health/route.js
export async function GET() {
  return Response.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version
  })
}
```

## 🚀 Comandos de Deploy

### Build para Producción
```bash
npm run build
npm start
```

### Deploy con Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Docker Compose
```yaml
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
```

## ✅ Checklist de Deploy

- [ ] Variables de entorno configuradas
- [ ] Base de datos configurada
- [ ] SSL/TLS configurado
- [ ] Dominio privado configurado
- [ ] Autenticación básica activada
- [ ] Logging configurado
- [ ] Health check funcionando
- [ ] Backup automático configurado
- [ ] Monitoreo básico activo
- [ ] Tests pasando en producción

## 🔧 Mantenimiento

### Actualizaciones
```bash
# Pull cambios
git pull origin main

# Rebuild y redeploy
npm run build
pm2 restart stack21
```

### Logs
```bash
# Ver logs en tiempo real
pm2 logs stack21

# Ver logs de error
pm2 logs stack21 --err
```

### Backup
```bash
# Backup de base de datos
pg_dump stack21_prod > backup_$(date +%Y%m%d).sql

# Restaurar backup
psql stack21_prod < backup_20241222.sql
```
