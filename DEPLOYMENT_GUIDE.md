# 🚀 **Guía de Despliegue de Stack21**

## 📋 **Preparación**

### **1. Variables de Entorno Requeridas**
```env
# NextAuth.js
NEXTAUTH_SECRET=tu_secreto_super_seguro_aqui
NEXTAUTH_URL=https://tu-dominio.com

# OAuth (opcional)
GOOGLE_CLIENT_ID=tu_google_client_id
GOOGLE_CLIENT_SECRET=tu_google_client_secret
GITHUB_CLIENT_ID=tu_github_client_id
GITHUB_CLIENT_SECRET=tu_github_client_secret

# Supabase (opcional)
NEXT_PUBLIC_SUPABASE_URL=tu_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key
```

### **2. Generar NEXTAUTH_SECRET**
```bash
openssl rand -base64 32
```

---

## 🎯 **Métodos de Despliegue**

### **Opción 1: Vercel (Recomendado)**

#### **Paso 1: Instalar Vercel CLI**
```bash
npm i -g vercel
```

#### **Paso 2: Configurar proyecto**
```bash
vercel login
vercel link
```

#### **Paso 3: Configurar variables de entorno**
```bash
vercel env add NEXTAUTH_SECRET
vercel env add NEXTAUTH_URL
# ... agregar todas las variables necesarias
```

#### **Paso 4: Desplegar**
```bash
vercel --prod
```

**✅ Ventajas:**
- Despliegue automático desde GitHub
- CDN global
- SSL automático
- Escalado automático

---

### **Opción 2: Docker**

#### **Paso 1: Construir imagen**
```bash
docker build -f Dockerfile.production -t stack21 .
```

#### **Paso 2: Ejecutar contenedor**
```bash
docker run -p 3000:3000 \
  -e NEXTAUTH_SECRET=tu_secreto \
  -e NEXTAUTH_URL=https://tu-dominio.com \
  stack21
```

#### **Paso 3: Con Docker Compose**
```bash
docker-compose -f docker-compose.prod.yml up -d
```

**✅ Ventajas:**
- Entorno consistente
- Fácil escalado
- Aislamiento completo

---

### **Opción 3: Servidor VPS**

#### **Paso 1: Preparar servidor**
```bash
# Instalar Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Instalar PM2
npm install -g pm2
```

#### **Paso 2: Clonar y configurar**
```bash
git clone tu-repositorio
cd saas-starter
npm ci --production
npm run build
```

#### **Paso 3: Configurar PM2**
```bash
# Crear ecosystem.config.js
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

#### **Paso 4: Configurar Nginx**
```bash
# Copiar nginx.prod.conf a /etc/nginx/sites-available/
sudo ln -s /etc/nginx/sites-available/stack21 /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## 🔧 **Script de Despliegue Automático**

```bash
# Ejecutar script interactivo
./deploy.sh

# O desplegar directamente
npm run deploy
```

---

## 📊 **Monitoreo Post-Despliegue**

### **1. Verificar Salud**
```bash
curl https://tu-dominio.com/api/health/public
```

### **2. Verificar Logs**
```bash
# Vercel
vercel logs

# Docker
docker logs stack21

# PM2
pm2 logs stack21
```

### **3. Métricas de Rendimiento**
- **Lighthouse:** https://pagespeed.web.dev/
- **GTmetrix:** https://gtmetrix.com/
- **WebPageTest:** https://www.webpagetest.org/

---

## 🚨 **Solución de Problemas**

### **Error: NEXTAUTH_SECRET not set**
```bash
export NEXTAUTH_SECRET=$(openssl rand -base64 32)
```

### **Error: Build failed**
```bash
rm -rf .next node_modules
npm ci
npm run build
```

### **Error: OAuth not working**
1. Verificar URLs de redirección
2. Verificar variables de entorno
3. Verificar configuración en Google/GitHub

### **Error: Database connection**
1. Verificar variables de Supabase
2. Verificar conectividad de red
3. Verificar permisos de base de datos

---

## 🎉 **¡Despliegue Exitoso!**

Una vez desplegado, tu Stack21 estará disponible en:
- **URL:** https://tu-dominio.com
- **Dashboard:** https://tu-dominio.com/dashboard
- **APIs:** https://tu-dominio.com/api/health/public

**¡Felicidades! Stack21 está en producción!** 🚀✨
