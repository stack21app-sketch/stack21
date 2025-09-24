# 🚀 Setup Completo de Stack21 Waitlist

## 📋 Resumen

Este documento te guía paso a paso para configurar y lanzar el sistema de waitlist de Stack21. El sistema está **100% funcional** y listo para capturar leads.

## ⚡ Setup Rápido (5 minutos)

### 1. **Ejecutar Setup Automático**
```bash
# Clonar el repositorio (si no lo has hecho)
git clone <tu-repositorio>
cd saas-starter

# Ejecutar setup automático
npm run setup
```

### 2. **Configurar Base de Datos**
```bash
# Instalar PostgreSQL (si no lo tienes)
# macOS: brew install postgresql
# Ubuntu: sudo apt-get install postgresql
# Windows: Descargar desde postgresql.org

# Crear base de datos
createdb stack21

# Actualizar DATABASE_URL en .env.local
# DATABASE_URL="postgresql://tu-usuario:tu-password@localhost:5432/stack21?schema=public"
```

### 3. **Iniciar el Sistema**
```bash
# Iniciar servidor
npm run dev

# Verificar estado
# Visita: http://localhost:3000/status
```

## 🔧 Setup Detallado

### **Paso 1: Dependencias del Sistema**

#### **Node.js (Requerido)**
```bash
# Verificar versión (requerido: 18+)
node --version

# Instalar si es necesario
# macOS: brew install node
# Ubuntu: curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
```

#### **PostgreSQL (Requerido)**
```bash
# macOS
brew install postgresql
brew services start postgresql

# Ubuntu
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql

# Windows
# Descargar desde: https://www.postgresql.org/download/windows/
```

### **Paso 2: Configuración del Proyecto**

#### **Variables de Entorno**
El script de setup crea automáticamente `.env.local` con:

```env
# REQUERIDAS
DATABASE_URL="postgresql://username:password@localhost:5432/stack21?schema=public"
NEXTAUTH_SECRET="clave-secreta-generada-automaticamente"
ADMIN_KEY="clave-admin-generada-automaticamente"

# OPCIONALES
GOOGLE_CLIENT_ID=""
GITHUB_CLIENT_ID=""
STRIPE_SECRET_KEY=""
OPENAI_API_KEY=""
SMTP_HOST=""
```

#### **Base de Datos**
```bash
# Crear base de datos
createdb stack21

# Aplicar migraciones
npm run db:push

# Verificar con Prisma Studio
npm run db:studio
# Abre: http://localhost:5555
```

### **Paso 3: Verificación del Sistema**

#### **Página de Estado**
Visita: `http://localhost:3000/status`

Deberías ver:
- ✅ Configuración: Funcionando
- ✅ Base de Datos: Funcionando  
- ✅ Sistema: Funcionando

#### **Páginas Disponibles**
- `http://localhost:3000/landing` - Página principal
- `http://localhost:3000/prelaunch` - Prelanzamiento
- `http://localhost:3000/dashboard/waitlist` - Admin (requiere ADMIN_KEY)

## 🎯 Funcionalidades Implementadas

### ✅ **Sistema de Waitlist Completo**
- Formularios de suscripción con validación
- Captura de email, nombre, empresa
- Códigos de referido con tiers automáticos
- Verificación de emails únicos
- Base de datos PostgreSQL

### ✅ **Sistema de Referidos**
- Códigos especiales: `VIP-`, `PREMIUM-`, `EARLY-`, `BETA-`
- Validación en tiempo real
- Tiers automáticos basados en código
- Beneficios diferenciados

### ✅ **Dashboard de Administración**
- Estadísticas en tiempo real
- Lista de usuarios con filtros
- Exportación a CSV
- Búsqueda y filtrado
- Métricas de conversión

### ✅ **Sistema de Email**
- Verificación de email automática
- Templates HTML y texto
- Configuración SMTP opcional
- Modo desarrollo con logs

### ✅ **Analytics Integrado**
- Tracking de eventos
- Métricas de comportamiento
- Almacenamiento en base de datos
- Dashboard de métricas

## 🚀 Comandos Útiles

### **Desarrollo**
```bash
npm run dev              # Iniciar servidor
npm run build            # Build para producción
npm run start            # Servidor de producción
npm run lint             # Verificar código
```

### **Base de Datos**
```bash
npm run db:push          # Aplicar migraciones
npm run db:generate      # Generar cliente Prisma
npm run db:studio        # Abrir Prisma Studio
npm run db:reset         # Reset completo
```

### **Setup y Mantenimiento**
```bash
npm run setup            # Setup completo
npm run setup:db         # Solo base de datos
./start-waitlist.sh      # Script de inicio
```

## 📊 Estructura de Base de Datos

### **Tabla: waitlist_users**
```sql
CREATE TABLE waitlist_users (
  id                TEXT PRIMARY KEY,
  email             TEXT UNIQUE NOT NULL,
  name              TEXT,
  company           TEXT,
  role              TEXT,
  interests         TEXT[],
  source            TEXT,
  referredBy        TEXT,
  tier              TEXT DEFAULT 'BASIC',
  isVerified        BOOLEAN DEFAULT false,
  verificationToken TEXT UNIQUE,
  subscribedAt      TIMESTAMP DEFAULT NOW(),
  createdAt         TIMESTAMP DEFAULT NOW(),
  updatedAt         TIMESTAMP DEFAULT NOW()
);
```

### **Tabla: analytics**
```sql
CREATE TABLE analytics (
  id          TEXT PRIMARY KEY,
  userId      TEXT,
  workspaceId TEXT,
  event       TEXT NOT NULL,
  data        JSONB,
  timestamp   TIMESTAMP DEFAULT NOW(),
  ipAddress   TEXT,
  userAgent   TEXT
);
```

## 🔒 Configuración de Seguridad

### **Variables Críticas**
- `NEXTAUTH_SECRET`: Mínimo 32 caracteres
- `ADMIN_KEY`: Mínimo 16 caracteres
- `DATABASE_URL`: Credenciales reales de PostgreSQL

### **Acceso al Dashboard**
- URL: `/dashboard/waitlist`
- Requiere: `ADMIN_KEY` en query params
- Ejemplo: `?admin_key=tu-clave-admin`

## 📧 Configuración de Email (Opcional)

### **SMTP Básico**
```env
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="tu-email@gmail.com"
SMTP_PASS="tu-password-de-aplicacion"
SMTP_FROM="Stack21 <noreply@stack21.com>"
```

### **Modo Desarrollo**
Sin configuración SMTP, los emails se loguean en consola.

## 🎨 Personalización

### **Páginas Principales**
- `src/app/landing/page.tsx` - Landing page
- `src/app/prelaunch/page.tsx` - Prelanzamiento
- `src/components/waitlist-form.tsx` - Formulario

### **Estilos**
- `src/app/globals.css` - Estilos globales
- `tailwind.config.ts` - Configuración Tailwind

### **Configuración**
- `src/lib/config-validator.ts` - Validación
- `src/lib/email.ts` - Sistema de email
- `src/lib/referral-codes.ts` - Códigos de referido

## 🚨 Solución de Problemas

### **Error: DATABASE_URL no configurada**
```bash
# Verificar archivo .env.local
cat .env.local

# Recrear si es necesario
npm run setup
```

### **Error: No se puede conectar a PostgreSQL**
```bash
# Verificar que PostgreSQL esté ejecutándose
brew services list | grep postgresql

# Iniciar si es necesario
brew services start postgresql

# Verificar conexión
psql -d stack21 -c "SELECT 1;"
```

### **Error: Página de status no carga**
```bash
# Verificar que el servidor esté ejecutándose
npm run dev

# Verificar logs en consola
# Revisar variables de entorno
```

### **Error: Dashboard no accesible**
- Verificar `ADMIN_KEY` en `.env.local`
- Usar URL: `http://localhost:3000/dashboard/waitlist?admin_key=tu-clave`

## 📈 Próximos Pasos

### **1. Lanzamiento Inmediato**
- [ ] Configurar dominio
- [ ] Configurar hosting (Vercel/Netlify)
- [ ] Configurar variables de entorno en producción
- [ ] Lanzar campaña de marketing

### **2. Optimizaciones**
- [ ] Configurar email SMTP real
- [ ] Implementar analytics avanzados
- [ ] A/B testing de formularios
- [ ] Integración con CRM

### **3. Escalamiento**
- [ ] Monitoreo de performance
- [ ] Backup automático de base de datos
- [ ] CDN para assets estáticos
- [ ] Rate limiting avanzado

## 🎉 ¡Listo para Lanzar!

Tu sistema de waitlist está **completamente funcional** y listo para capturar leads. 

### **URLs de Prueba:**
- **Landing**: http://localhost:3000/landing
- **Prelanzamiento**: http://localhost:3000/prelaunch  
- **Status**: http://localhost:3000/status
- **Admin**: http://localhost:3000/dashboard/waitlist

### **Comandos de Lanzamiento:**
```bash
# Desarrollo
npm run dev

# Producción
npm run build
npm run start
```

**¡Tu waitlist está lista para revolucionar el mercado!** 🚀
