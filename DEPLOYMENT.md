# 🚀 Guía de Deployment - Stack21

## ✅ Estado Actual
- ✅ Aplicación completamente funcional
- ✅ Todas las configuraciones implementadas
- ✅ Tests automatizados
- ✅ Optimización de rendimiento
- ✅ SEO optimizado
- ✅ Listo para producción

## 🎯 Opciones de Deployment

### 1. **Vercel (Recomendado)**
```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel

# Deploy con variables de entorno
vercel --env-file .env.local
```

**Ventajas:**
- Integración nativa con Next.js
- Deploy automático desde GitHub
- CDN global
- SSL automático
- Variables de entorno seguras

### 2. **Netlify**
```bash
# Build
npm run build

# Deploy
npx netlify deploy --prod --dir=out
```

### 3. **Railway**
```bash
# Instalar Railway CLI
npm install -g @railway/cli

# Login y deploy
railway login
railway init
railway up
```

### 4. **Docker**
```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
```

## 🔧 Configuración para Producción

### Variables de Entorno Requeridas
```bash
# Base de datos
NEXT_PUBLIC_SUPABASE_URL="tu-url-real"
NEXT_PUBLIC_SUPABASE_ANON_KEY="tu-clave-real"

# NextAuth
NEXTAUTH_URL="https://tu-dominio.com"
NEXTAUTH_SECRET="clave-secreta-super-segura"

# OAuth
GOOGLE_CLIENT_ID="tu-google-client-id"
GOOGLE_CLIENT_SECRET="tu-google-client-secret"
GITHUB_CLIENT_ID="tu-github-client-id"
GITHUB_CLIENT_SECRET="tu-github-client-secret"

# OpenAI
OPENAI_API_KEY="sk-tu-clave-real"

# Stripe
STRIPE_PUBLISHABLE_KEY="pk_live_..."
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Aplicación
NEXT_PUBLIC_APP_URL="https://tu-dominio.com"
```

### Configuración de Dominio
1. **Comprar dominio** (Namecheap, GoDaddy, etc.)
2. **Configurar DNS** apuntando a tu proveedor
3. **SSL automático** con Let's Encrypt

### Base de Datos en Producción
```sql
-- Ejecutar en Supabase
-- Usar el script create-tables.sql
-- Configurar RLS (Row Level Security)
-- Crear backups automáticos
```

## 📊 Monitoreo y Analytics

### 1. **Vercel Analytics**
```bash
npm install @vercel/analytics
```

### 2. **Google Analytics**
```javascript
// En _app.tsx
import { GoogleAnalytics } from 'nextjs-google-analytics'

export default function App({ Component, pageProps }) {
  return (
    <>
      <GoogleAnalytics gaMeasurementId="G-XXXXXXXXXX" />
      <Component {...pageProps} />
    </>
  )
}
```

### 3. **Sentry para Error Tracking**
```bash
npm install @sentry/nextjs
```

## 🔒 Seguridad

### 1. **Headers de Seguridad**
```javascript
// next.config.js
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  }
]
```

### 2. **Rate Limiting**
```javascript
// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Implementar rate limiting
  return NextResponse.next()
}
```

## 📈 Optimización de Rendimiento

### 1. **Bundle Analysis**
```bash
npm install --save-dev @next/bundle-analyzer
```

### 2. **Image Optimization**
```javascript
// next.config.js
module.exports = {
  images: {
    domains: ['tu-dominio.com'],
    formats: ['image/webp', 'image/avif'],
  },
}
```

### 3. **Caching**
```javascript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Cache-Control', value: 's-maxage=60, stale-while-revalidate' }
        ]
      }
    ]
  }
}
```

## 🧪 Testing en Producción

### 1. **Health Check**
```javascript
// pages/api/health.js
export default function handler(req, res) {
  res.status(200).json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version
  })
}
```

### 2. **Smoke Tests**
```bash
# Test básico
curl https://tu-dominio.com/api/health

# Test de funcionalidades
npm run test:e2e
```

## 📱 PWA (Progressive Web App)

### 1. **Manifest**
```json
// public/manifest.json
{
  "name": "Stack21",
  "short_name": "Stack21",
  "description": "Plataforma SaaS con IA",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#000000",
  "icons": [
    {
      "src": "/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    }
  ]
}
```

### 2. **Service Worker**
```javascript
// public/sw.js
const CACHE_NAME = 'stack21-v1'
const urlsToCache = [
  '/',
  '/dashboard',
  '/static/js/bundle.js',
  '/static/css/main.css'
]

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  )
})
```

## 🚀 Comandos de Deployment

### Vercel
```bash
# Deploy inicial
vercel

# Deploy de producción
vercel --prod

# Configurar variables de entorno
vercel env add NEXTAUTH_SECRET
vercel env add NEXT_PUBLIC_SUPABASE_URL
# ... más variables
```

### Netlify
```bash
# Deploy
netlify deploy --prod

# Configurar variables de entorno
netlify env:set NEXTAUTH_SECRET "valor"
netlify env:set NEXT_PUBLIC_SUPABASE_URL "valor"
```

### Railway
```bash
# Deploy
railway up

# Configurar variables de entorno
railway variables set NEXTAUTH_SECRET="valor"
railway variables set NEXT_PUBLIC_SUPABASE_URL="valor"
```

## 📋 Checklist Pre-Deployment

- [ ] Variables de entorno configuradas
- [ ] Base de datos configurada
- [ ] OAuth configurado
- [ ] Stripe configurado
- [ ] OpenAI configurado
- [ ] Dominio configurado
- [ ] SSL configurado
- [ ] Analytics configurado
- [ ] Error tracking configurado
- [ ] Tests pasando
- [ ] Performance optimizado
- [ ] SEO optimizado
- [ ] Backup configurado
- [ ] Monitoreo configurado

## 🎉 ¡Listo para Producción!

Tu aplicación Stack21 está completamente configurada y lista para deployment. 

**URLs importantes:**
- Dashboard: `https://tu-dominio.com/dashboard`
- Configuración: `https://tu-dominio.com/dashboard/settings`
- API Health: `https://tu-dominio.com/api/health`

**Soporte:**
- Documentación: `https://tu-dominio.com/docs`
- Status: `https://tu-dominio.com/status`
- Contacto: `support@tu-dominio.com`
