# 🏠 Deploy Privado de Stack21

## 🎯 ¿Qué es un Deploy Privado?

Un deploy privado significa que Stack21 estará disponible en internet, pero **solo tú y las personas que invites** podrán acceder a él. Es perfecto para:

- ✅ **Testing con usuarios reales** (pero controlados)
- ✅ **Desarrollo colaborativo** con tu equipo
- ✅ **Validación del producto** antes del lanzamiento público
- ✅ **Uso personal** sin exposición masiva

## 🚀 Inicio Rápido

### Opción 1: Inicio Automático
```bash
./start-private.sh
```

### Opción 2: Deploy Manual
```bash
./scripts/deploy-private.sh
```

### Opción 3: Docker Compose
```bash
docker-compose up -d
```

## 📋 Configuración Paso a Paso

### 1. 🔐 Variables de Entorno

Crea un archivo `.env.production`:

```bash
# Copia el archivo de ejemplo
cp .env.local .env.production

# Edita las variables necesarias
nano .env.production
```

**Variables importantes:**
- `NEXTAUTH_URL`: Tu dominio privado
- `NEXTAUTH_SECRET`: Genera uno con `openssl rand -base64 32`
- `DATABASE_URL`: URL de tu base de datos
- `OPENAI_API_KEY`: Tu clave de OpenAI

### 2. 🗄️ Base de Datos

**Opción A: PostgreSQL Local**
```bash
# Instalar PostgreSQL
brew install postgresql  # macOS
sudo apt install postgresql  # Ubuntu

# Crear base de datos
createdb stack21_prod
```

**Opción B: Docker (Recomendado)**
```bash
# Iniciar solo la base de datos
docker run -d \
  --name stack21-db \
  -e POSTGRES_DB=stack21_prod \
  -e POSTGRES_USER=stack21 \
  -e POSTGRES_PASSWORD=password \
  -p 5432:5432 \
  postgres:15
```

### 3. 🌐 Dominio Privado

**Opción A: Subdominio (Recomendado)**
- `dev.stack21.com`
- `private.stack21.com`
- `beta.stack21.com`

**Opción B: IP Pública**
- `http://tu-ip-publica:3000`

**Opción C: Túnel Local (Para testing)**
```bash
# Instalar ngrok
npm install -g ngrok

# Crear túnel
ngrok http 3000
```

## 🚀 Opciones de Deploy

### 1. 🐳 Docker (Más Fácil)

```bash
# Iniciar todo
docker-compose up -d

# Ver logs
docker-compose logs -f

# Parar
docker-compose down
```

### 2. ☁️ Vercel (Recomendado)

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Configurar variables de entorno en Vercel Dashboard
```

### 3. 🚂 Railway

```bash
# Instalar Railway CLI
npm i -g @railway/cli

# Login y deploy
railway login
railway init
railway up
```

### 4. 🐋 DigitalOcean

1. Crear App en DigitalOcean
2. Conectar repositorio
3. Configurar variables de entorno
4. Deploy automático

## 🔒 Configuración de Seguridad

### 1. Autenticación Básica (Opcional)

```javascript
// middleware.js
import { NextResponse } from 'next/server'

export function middleware(request) {
  const basicAuth = request.headers.get('authorization')
  
  if (basicAuth) {
    const authValue = basicAuth.split(' ')[1]
    const [user, pwd] = atob(authValue).split(':')
    
    if (user === 'admin' && pwd === 'tu-password') {
      return NextResponse.next()
    }
  }
  
  return new Response('Acceso denegado', { status: 401 })
}
```

### 2. Restricción por IP

```javascript
// middleware.js
const allowedIPs = ['192.168.1.100', '10.0.0.50']

export function middleware(request) {
  const ip = request.ip || request.headers.get('x-forwarded-for')
  
  if (!allowedIPs.includes(ip)) {
    return new Response('Acceso denegado', { status: 403 })
  }
  
  return NextResponse.next()
}
```

### 3. SSL/TLS

```bash
# Con Let's Encrypt
certbot --nginx -d tu-dominio-privado.com

# Con Cloudflare (Recomendado)
# 1. Configurar DNS en Cloudflare
# 2. Activar SSL/TLS
# 3. Configurar reglas de acceso
```

## 📊 Monitoreo y Logs

### 1. Ver Logs en Tiempo Real

```bash
# Docker
docker-compose logs -f app

# PM2
pm2 logs stack21-private

# Nginx
tail -f /var/log/nginx/access.log
```

### 2. Health Check

```bash
# Verificar estado
curl http://localhost:3000/api/health

# Respuesta esperada
{
  "status": "ok",
  "timestamp": "2024-12-22T10:30:00.000Z",
  "version": "1.0.0"
}
```

### 3. Métricas Básicas

```bash
# CPU y memoria
docker stats stack21-app

# PM2
pm2 monit
```

## 🔧 Comandos Útiles

### Docker
```bash
# Iniciar
docker-compose up -d

# Parar
docker-compose down

# Reiniciar
docker-compose restart

# Ver logs
docker-compose logs -f

# Entrar al contenedor
docker exec -it stack21-app sh
```

### PM2
```bash
# Iniciar
pm2 start ecosystem.config.js --env production

# Parar
pm2 stop stack21-private

# Reiniciar
pm2 restart stack21-private

# Ver logs
pm2 logs stack21-private

# Monitoreo
pm2 monit
```

### Base de Datos
```bash
# Backup
pg_dump stack21_prod > backup_$(date +%Y%m%d).sql

# Restaurar
psql stack21_prod < backup_20241222.sql

# Conectar
psql -h localhost -U stack21 -d stack21_prod
```

## 🚨 Solución de Problemas

### Error: Puerto en uso
```bash
# Encontrar proceso
lsof -i :3000

# Matar proceso
kill -9 PID
```

### Error: Base de datos no conecta
```bash
# Verificar PostgreSQL
pg_isready -h localhost -p 5432

# Reiniciar base de datos
docker-compose restart db
```

### Error: Build falla
```bash
# Limpiar cache
rm -rf .next node_modules
npm install
npm run build
```

### Error: Variables de entorno
```bash
# Verificar variables
echo $NODE_ENV
echo $DATABASE_URL

# Cargar variables
source .env.production
```

## 📈 Próximos Pasos

1. **✅ Deploy inicial** - Stack21 funcionando
2. **🔐 Configurar seguridad** - Autenticación básica
3. **📊 Monitoreo** - Logs y métricas
4. **🔄 CI/CD** - Deploy automático
5. **📱 Notificaciones** - Alertas de estado
6. **🔄 Backup** - Respaldo automático
7. **🚀 Escalabilidad** - Múltiples instancias

## 🎉 ¡Listo!

Tu Stack21 privado estará disponible en:
- **URL**: `http://localhost:3000` (local) o tu dominio
- **Admin**: Usa el email/contraseña que configuraste
- **API**: `http://localhost:3000/api/health`

**¡Disfruta tu Stack21 privado! 🚀**
