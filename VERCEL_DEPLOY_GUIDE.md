# 🚀 Guía Completa de Deploy a Vercel - Stack21

---

## 📋 Tabla de Contenidos

1. [Pre-requisitos](#pre-requisitos)
2. [Opción 1: Deploy con GitHub Integration (Recomendado)](#opción-1-deploy-con-github-integration)
3. [Opción 2: Deploy con Vercel CLI](#opción-2-deploy-con-vercel-cli)
4. [Configuración de Variables de Entorno](#configuración-de-variables-de-entorno)
5. [Configuración de Dominio Personalizado](#configuración-de-dominio-personalizado)
6. [Verificación Post-Deploy](#verificación-post-deploy)
7. [Troubleshooting](#troubleshooting)

---

## Pre-requisitos

### ✅ Checklist antes de deploy

- [x] Build local exitoso (`npm run build`)
- [x] Código pusheado a GitHub
- [x] Sin secrets en el código (archivo `.env.local.backup` eliminado)
- [ ] Cuenta de Vercel creada (https://vercel.com/signup)
- [ ] Variables de entorno preparadas

### 📝 Variables de Entorno Necesarias

Crea un archivo temporal con tus variables (NO lo commitees):

```env
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# REQUERIDO para autenticación
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

NEXTAUTH_SECRET="tu-secret-aqui"
# Genera con: openssl rand -base64 32

NEXTAUTH_URL="https://tu-dominio.vercel.app"
# Actualizar después del primer deploy

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# OPCIONAL (para funcionalidades completas)
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

# Base de datos (opcional, usa JSON en producción si no hay DB)
DATABASE_URL="postgresql://user:pass@host:5432/stack21"

# Google OAuth (opcional)
GOOGLE_CLIENT_ID="xxx.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="GOCSPX-xxx"

# GitHub OAuth (opcional)
GITHUB_CLIENT_ID="xxx"
GITHUB_CLIENT_SECRET="xxx"

# Stripe (opcional)
STRIPE_SECRET_KEY="sk_live_xxx"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_xxx"

# OpenAI para AI Builder (opcional)
OPENAI_API_KEY="sk-xxx"

# Supabase (opcional)
NEXT_PUBLIC_SUPABASE_URL="https://xxx.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJxxx"
```

---

## Opción 1: Deploy con GitHub Integration (Recomendado)

### Paso 1: Conectar Repositorio

1. Ve a https://vercel.com/new
2. Selecciona "Import Git Repository"
3. Conecta tu cuenta de GitHub si no lo has hecho
4. Busca y selecciona: `stack21app-sketch/stack21`
5. Click "Import"

### Paso 2: Configurar Proyecto

En la pantalla de configuración:

```yaml
Framework Preset: Next.js
Root Directory: ./
Build Command: npm run build
Output Directory: .next
Install Command: npm install
```

### Paso 3: Variables de Entorno

En la sección "Environment Variables":

1. Click "Add Environment Variable"
2. Agrega cada variable:
   ```
   Name: NEXTAUTH_SECRET
   Value: (tu secret generado)
   ```
3. Para `NEXTAUTH_URL`:
   - Primero deploy sin ella
   - Luego agrega con tu dominio de Vercel
   - Redeploy

### Paso 4: Deploy

1. Click "Deploy"
2. Espera 2-3 minutos
3. Vercel te dará una URL tipo: `https://stack21-xxx.vercel.app`

### Paso 5: Actualizar NEXTAUTH_URL

1. Ve a tu proyecto en Vercel
2. Settings → Environment Variables
3. Edita `NEXTAUTH_URL` con tu URL de Vercel
4. Redeploy desde "Deployments" → "..." → "Redeploy"

---

## Opción 2: Deploy con Vercel CLI

### Instalación

```bash
# Instalar Vercel CLI globalmente
npm i -g vercel

# Login
vercel login
# Sigue las instrucciones en el navegador
```

### Deploy a Preview (Staging)

```bash
cd /Users/santivilla/saas-starter

# Deploy a preview
vercel

# Sigue el wizard:
# ? Set up and deploy "~/saas-starter"? [Y/n] y
# ? Which scope do you want to deploy to? [Tu cuenta]
# ? Link to existing project? [n] n
# ? What's your project's name? stack21
# ? In which directory is your code located? ./
```

### Deploy a Producción

```bash
# Deploy a producción
vercel --prod

# URL final: https://stack21.vercel.app (o tu dominio)
```

### Agregar Variables de Entorno (CLI)

```bash
# Agregar variables una por una
vercel env add NEXTAUTH_SECRET production
# Pega el valor cuando te lo pida

vercel env add NEXTAUTH_URL production
# Pega: https://tu-dominio.vercel.app

# O importar desde archivo
vercel env pull .env.production
```

---

## Configuración de Variables de Entorno

### En Vercel Dashboard

1. Ve a: https://vercel.com/[tu-usuario]/stack21
2. Click "Settings"
3. Click "Environment Variables"

### Variables REQUERIDAS

#### NEXTAUTH_SECRET
```bash
# Generar en terminal:
openssl rand -base64 32

# Copiar output y pegar en Vercel
```

#### NEXTAUTH_URL
```
https://tu-dominio.vercel.app
```

### Variables OPCIONALES

Solo agrega las que necesites según tus integraciones:

#### Para OAuth Google
1. Ve a: https://console.cloud.google.com/
2. Crear/seleccionar proyecto
3. APIs & Services → Credentials
4. Create Credentials → OAuth 2.0 Client ID
5. Application type: Web application
6. Authorized redirect URIs:
   ```
   https://tu-dominio.vercel.app/api/auth/callback/google
   ```
7. Copia Client ID y Secret a Vercel

#### Para OAuth GitHub
1. Ve a: https://github.com/settings/developers
2. New OAuth App
3. Application name: Stack21
4. Homepage URL: `https://tu-dominio.vercel.app`
5. Authorization callback URL:
   ```
   https://tu-dominio.vercel.app/api/auth/callback/github
   ```
6. Copia Client ID y Secret a Vercel

#### Para Stripe
1. Ve a: https://dashboard.stripe.com/apikeys
2. Copia "Secret key" y "Publishable key"
3. Para webhooks:
   - Ve a Developers → Webhooks
   - Add endpoint: `https://tu-dominio.vercel.app/api/stripe/webhook`
   - Copia "Signing secret"

#### Para OpenAI
1. Ve a: https://platform.openai.com/api-keys
2. Create new secret key
3. Copia a Vercel como `OPENAI_API_KEY`

### Aplicar Cambios

Después de agregar/modificar variables:
1. Ve a "Deployments"
2. Click "..." en el último deployment
3. Click "Redeploy"

---

## Configuración de Dominio Personalizado

### Paso 1: Agregar Dominio

1. En tu proyecto Vercel → Settings → Domains
2. Click "Add"
3. Escribe tu dominio: `stack21.com`
4. Click "Add"

### Paso 2: Configurar DNS

Vercel te dirá cómo configurar tu DNS:

#### Opción A: Dominio Raíz (stack21.com)
```
Type: A
Name: @
Value: 76.76.21.21
```

#### Opción B: Subdominio (app.stack21.com)
```
Type: CNAME
Name: app
Value: cname.vercel-dns.com
```

### Paso 3: Actualizar NEXTAUTH_URL

1. Settings → Environment Variables
2. Edita `NEXTAUTH_URL` a: `https://stack21.com`
3. Redeploy

### Paso 4: Configurar SSL

Vercel configura SSL automáticamente:
- Espera 30-60 segundos
- Verifica: https://tu-dominio.com

---

## Verificación Post-Deploy

### 1. Verificar Build

En Vercel Dashboard → Deployments → [Último deploy] → Building:

```
✓ Compiling...
✓ Linting and checking validity of types...
✓ Creating an optimized production build...
✓ Build completed successfully
```

### 2. Verificar URLs

```bash
# Landing
curl -I https://tu-dominio.vercel.app/
# Debe retornar: HTTP/2 200

# API Health
curl https://tu-dominio.vercel.app/api/health
# Debe retornar: {"status":"ok"}

# Apps API
curl https://tu-dominio.vercel.app/api/apps?limit=5
# Debe retornar JSON con 5 apps
```

### 3. Pruebas en Navegador

Abre en navegador:

- [ ] **Landing:** `https://tu-dominio.vercel.app/`
  - ✅ Carga sin sidebar
  - ✅ Diseño correcto
  - ✅ Sin errores en console

- [ ] **App Directory:** `https://tu-dominio.vercel.app/apps`
  - ✅ Muestra 1669 apps (o 5 de fallback)
  - ✅ Búsqueda funciona
  - ✅ Paginación funciona

- [ ] **Conexiones:** `https://tu-dominio.vercel.app/connections`
  - ✅ Lista de conexiones
  - ✅ Botones funcionales

- [ ] **Workflows:** `https://tu-dominio.vercel.app/workflows`
  - ✅ Listado carga
  - ✅ Puede crear nuevo

- [ ] **AI Builder:** `https://tu-dominio.vercel.app/ai-builder`
  - ✅ UI carga correctamente
  - ✅ Input funciona

### 4. Verificar Logs

En Vercel Dashboard:
1. Click en tu deployment
2. Click "Functions"
3. Verifica que no hay errores críticos

---

## Troubleshooting

### Error: "Module not found"

**Síntoma:**
```
Error: Cannot find module 'XXX'
```

**Solución:**
```bash
# Local
npm install
npm run build

# Vercel
# En Settings → General → Build & Development Settings
# Install Command: npm ci
```

### Error: "NEXTAUTH_URL is not set"

**Síntoma:**
```
[next-auth][error][NO_SECRET]
```

**Solución:**
1. Settings → Environment Variables
2. Agregar `NEXTAUTH_URL` y `NEXTAUTH_SECRET`
3. Redeploy

### Error: "Function timeout"

**Síntoma:**
```
Task timed out after 10.01 seconds
```

**Solución:**
1. Upgrade a plan Pro (timeout 60s)
2. O optimizar función:
   - Reducir queries a DB
   - Usar cache
   - Paginación más pequeña

### Error: "No such file: apps.json"

**Síntoma:**
```
ENOENT: no such file or directory, open 'src/data/apps.json'
```

**Solución:**
La API ya tiene fallback. Si persiste:
1. Verifica que `src/data/apps.json` está en el repo
2. No está en `.gitignore`
3. Redeploy

### Error: "Invalid OAuth redirect"

**Síntoma:**
```
redirect_uri_mismatch
```

**Solución:**
1. Google/GitHub Console
2. Agregar redirect URI:
   ```
   https://tu-dominio.vercel.app/api/auth/callback/google
   https://tu-dominio.vercel.app/api/auth/callback/github
   ```

### Build Warnings (Seguros de ignorar)

Estos warnings son normales:
```
Warning: Using `<img>` could result in slower LCP
Warning: React Hook useEffect has missing dependencies
Warning: `"` can be escaped with &quot;
```

No afectan funcionalidad.

---

## Optimizaciones Post-Deploy

### 1. Performance

#### Habilitar Analytics
```bash
# En vercel.json (ya existe)
{
  "analytics": {
    "enable": true
  }
}
```

#### Habilitar Speed Insights
1. Vercel Dashboard → Speed Insights
2. Click "Enable"
3. Gratis hasta 100k views/mes

### 2. Seguridad

#### Headers de Seguridad
Ya configurados en `next.config.js`:
```js
headers: [
  {
    key: 'X-Frame-Options',
    value: 'DENY'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  }
]
```

#### Rate Limiting
Middleware ya implementado en `src/middleware.ts`

### 3. Monitoreo

#### Configurar Alertas
1. Settings → Notifications
2. Agregar email/Slack
3. Configurar alertas:
   - Build failures
   - Function errors
   - Domain changes

#### Logs
```bash
# Ver logs en tiempo real (CLI)
vercel logs [deployment-url] --follow
```

---

## Costos de Vercel

### Plan Hobby (Gratis)
- ✅ 100 GB bandwidth/mes
- ✅ 100 deployments/mes
- ✅ Serverless functions (10s timeout)
- ✅ Dominios personalizados
- ✅ SSL automático
- ✅ Preview deployments

**Suficiente para Stack21 en etapa inicial**

### Plan Pro ($20/mes)
- ✅ 1 TB bandwidth
- ✅ Deployments ilimitados
- ✅ 60s timeout
- ✅ Analytics avanzado
- ✅ Soporte prioritario

**Recomendado para producción con tráfico**

---

## Checklist Final

### Pre-Deploy
- [x] `npm run build` exitoso localmente
- [x] Código en GitHub
- [x] Variables de entorno preparadas
- [x] Cuenta Vercel creada

### Durante Deploy
- [ ] Proyecto conectado a GitHub
- [ ] Variables de entorno configuradas
- [ ] Primer deploy exitoso
- [ ] `NEXTAUTH_URL` actualizada
- [ ] Redeploy con URL correcta

### Post-Deploy
- [ ] Landing page carga
- [ ] /apps muestra aplicaciones
- [ ] APIs responden
- [ ] Sin errores en console
- [ ] SSL funcionando
- [ ] Dominio personalizado (opcional)

### Producción
- [ ] OAuth configurado (si aplica)
- [ ] Stripe configurado (si aplica)
- [ ] Monitoreo activo
- [ ] Alertas configuradas
- [ ] Backup strategy

---

## Recursos Útiles

### Documentación
- Vercel: https://vercel.com/docs
- Next.js Deploy: https://nextjs.org/docs/deployment
- Vercel CLI: https://vercel.com/docs/cli

### Soporte
- Vercel Discord: https://vercel.com/discord
- Stack21 Docs: `STACK21_COMPLETADO.md`
- Guía Rápida: `GUIA_RAPIDA.md`

---

## 🎉 ¡Listo!

Una vez completados todos los pasos, Stack21 estará corriendo en producción con:

✅ HTTPS automático  
✅ CDN global  
✅ Auto-scaling  
✅ Zero-downtime deploys  
✅ Preview branches  
✅ Analytics  

**Tu plataforma de automatización está lista para el mundo! 🚀**

---

**Última actualización:** 1 de Octubre, 2025  
**Versión de la guía:** 1.0  
**Compatibilidad:** Stack21 v2.1.0+

