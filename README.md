# 🚀 Stack21 - Plataforma de Automatización

<div align="center">

![Stack21 Logo](https://img.shields.io/badge/Stack21-v2.1.0-blue)
![Next.js](https://img.shields.io/badge/Next.js-14.0.4-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

**Plataforma de automatización con paridad funcional a Pipedream**

[Demo](https://stack21.vercel.app) · [Documentación](./STACK21_COMPLETADO.md) · [Reporte un Issue](https://github.com/stack21app-sketch/stack21/issues)

</div>

---

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Inicio Rápido](#-inicio-rápido)
- [Documentación](#-documentación)
- [Tech Stack](#-tech-stack)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Scripts Disponibles](#-scripts-disponibles)
- [Deploy](#-deploy)
- [Contribuir](#-contribuir)
- [Licencia](#-licencia)

---

## ✨ Características

### Core Features

- **🔌 1669+ Aplicaciones** - Directorio completo con búsqueda y filtros
- **🔐 Sistema de Conexiones** - OAuth 2.0, API Key, Basic Auth
- **⚡ Motor de Ejecución** - 5 tipos de pasos (HTTP, Transform, Condition, Delay, Log)
- **🎨 Editor Visual** - Drag & drop para workflows
- **📊 Monitoreo de Runs** - Logs detallados paso a paso
- **📚 Galería de Templates** - Plantillas aplicables con un clic
- **🤖 AI Builder** - Genera workflows desde lenguaje natural
- **📈 Dashboard** - Analytics en tiempo real
- **🔔 Webhooks** - Recepción y procesamiento automático
- **⏰ Scheduler** - Cron jobs programables

### Ventajas Competitivas

| Característica | Stack21 | Pipedream | Zapier | Make |
|----------------|---------|-----------|--------|------|
| Apps Conectadas | ✅ 1669 | ✅ 2000+ | ✅ 5000+ | ✅ 1000+ |
| AI Builder | 🚀 Sí | ❌ No | ❌ No | ❌ No |
| Open Source | ✅ Sí | ❌ No | ❌ No | ❌ No |
| Self-Hosted | ✅ Sí | ❌ No | ❌ No | ❌ No |
| Visual Editor | ✅ Sí | ✅ Sí | ✅ Sí | ✅ Sí |
| Code Steps | ✅ Sí | ✅ Sí | ❌ No | ✅ Sí |

---

## 🚀 Inicio Rápido

### Pre-requisitos

- Node.js 18+ instalado
- npm o yarn
- Git

### Instalación

```bash
# 1. Clonar repositorio
git clone https://github.com/stack21app-sketch/stack21.git
cd stack21

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp env.example .env.local
# Editar .env.local con tus credenciales

# 4. Inicializar datos de muestra
node scripts/init-sample-data.js

# 5. Iniciar servidor de desarrollo
npm run dev

# 6. Abrir en navegador
open http://localhost:3000
```

### Primeros Pasos

#### 1. Explora el Directorio de Apps

```
http://localhost:3000/apps
```

Busca, filtra y conecta aplicaciones como GitHub, Slack, Gmail, etc.

#### 2. Conecta tu Primera App

1. Selecciona una app (ej: GitHub)
2. Click "Conectar"
3. Elige "OAuth Demo" o "API Key Demo"
4. ¡Listo! Verás tu conexión en `/connections`

#### 3. Crea un Workflow

1. Ve a `/workflows/new`
2. Dale un nombre
3. Selecciona trigger (webhook, schedule, manual)
4. Agrega pasos
5. Guarda y ejecuta

#### 4. Usa el AI Builder

1. Ve a `/ai-builder`
2. Escribe: "Enviar email cuando alguien se registra"
3. Click "Generar"
4. Aplica el workflow sugerido

---

## 📚 Documentación

### Guías Principales

- **[Documentación Completa](./STACK21_COMPLETADO.md)** - Todo sobre Stack21
- **[Guía Rápida](./GUIA_RAPIDA.md)** - Inicio en 5 minutos
- **[Deploy a Vercel](./VERCEL_DEPLOY_GUIDE.md)** - Paso a paso para producción
- **[Testing Checklist](./TESTING_CHECKLIST.md)** - Verificación completa
- **[Changelog](./CHANGELOG.md)** - Historial de versiones

### Documentación de APIs

#### Apps API

```bash
# Listar apps
GET /api/apps?limit=10&page=1&search=github&category=developer-tools

# App específica
GET /api/apps/github
```

#### Connections API

```bash
# Listar conexiones
GET /api/connections?page=1&limit=10

# Crear conexión
POST /api/connections
{
  "name": "Mi GitHub",
  "appSlug": "github",
  "authType": "oauth2",
  "credentials": {...}
}

# Eliminar conexión
DELETE /api/connections?id=conn_xxx
```

#### Workflows API

```bash
# Listar workflows
GET /api/workflows

# Crear workflow
POST /api/workflows
{
  "name": "Mi Workflow",
  "trigger": {"type": "manual"},
  "steps": [...]
}

# Ejecutar workflow
POST /api/workflows/{id}/run
```

Ver más en [API_DOCUMENTATION.md](./docs/API_DOCUMENTATION.md)

---

## 🛠️ Tech Stack

### Frontend

- **Framework:** Next.js 14 (App Router)
- **Lenguaje:** TypeScript 5.0
- **Styling:** Tailwind CSS 3.3
- **UI Components:** shadcn/ui
- **Icons:** Lucide React
- **Animaciones:** Framer Motion
- **Forms:** React Hook Form + Zod
- **Charts:** React Flow

### Backend

- **API:** Next.js API Routes
- **Auth:** NextAuth.js
- **Database:** Prisma + PostgreSQL (Supabase)
- **Cache:** Redis (opcional)
- **Queue:** BullMQ (opcional)
- **Payments:** Stripe
- **Email:** Nodemailer

### DevOps

- **Hosting:** Vercel
- **CI/CD:** GitHub Actions
- **Monitoring:** Sentry (opcional)
- **Analytics:** Vercel Analytics

---

## 📁 Estructura del Proyecto

```
stack21/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API Routes
│   │   │   ├── apps/         # Apps API
│   │   │   ├── connections/  # Conexiones API
│   │   │   ├── workflows/    # Workflows API
│   │   │   ├── runs/         # Runs API
│   │   │   ├── templates/    # Templates API
│   │   │   ├── webhooks/     # Webhooks API
│   │   │   └── oauth/        # OAuth flow
│   │   ├── apps/             # Directorio de apps
│   │   ├── connections/      # Página de conexiones
│   │   ├── workflows/        # Gestión de workflows
│   │   ├── runs/             # Historial de ejecuciones
│   │   ├── templates/        # Galería de templates
│   │   ├── ai-builder/       # AI Builder
│   │   └── dashboard/        # Dashboard
│   ├── components/           # Componentes React
│   │   ├── layout/          # Layouts
│   │   ├── workflow/        # Workflow editor
│   │   ├── ui/              # shadcn/ui
│   │   └── ...
│   ├── lib/                  # Utilidades
│   │   ├── execution-engine.ts  # Motor de ejecución
│   │   ├── connectors/          # Conectores
│   │   ├── queue/               # BullMQ setup
│   │   └── ...
│   ├── data/                 # Almacenamiento JSON
│   │   ├── apps.json        # 1669 apps
│   │   ├── categories.json  # Categorías
│   │   ├── connections.json # Conexiones
│   │   ├── workflows.json   # Workflows
│   │   ├── runs.json        # Ejecuciones
│   │   └── templates.json   # Plantillas
│   └── types/               # TypeScript types
├── scripts/                  # Scripts de utilidad
│   ├── init-sample-data.js  # Inicializar datos
│   ├── generate-more-apps.js # Generar apps
│   └── ...
├── public/                   # Assets estáticos
├── prisma/                   # Prisma schema
├── docs/                     # Documentación
├── next.config.js           # Next.js config
├── tailwind.config.js       # Tailwind config
├── tsconfig.json            # TypeScript config
└── package.json             # Dependencies
```

---

## 🎯 Scripts Disponibles

### Desarrollo

```bash
# Iniciar servidor de desarrollo
npm run dev

# Build de producción
npm run build

# Iniciar servidor de producción
npm start

# Linter
npm run lint
```

### Datos

```bash
# Inicializar datos de muestra
node scripts/init-sample-data.js

# Generar más aplicaciones
node scripts/generate-more-apps.js
```

### Deploy

```bash
# Deploy automatizado
./deploy-stack21.sh

# Deploy a Vercel (CLI)
vercel --prod
```

### Testing

```bash
# Type checking
npx tsc --noEmit

# Test rápido de APIs
./test-quick.sh

# E2E con Playwright (opcional)
npx playwright test
```

---

## 🚀 Deploy

### Opción 1: Vercel (Recomendado)

#### Con GitHub Integration

1. Ve a https://vercel.com/new
2. Importa el repositorio
3. Configura variables de entorno:
   ```
   NEXTAUTH_SECRET=xxx
   NEXTAUTH_URL=https://tu-dominio.vercel.app
   ```
4. Click "Deploy"

Ver guía completa: [VERCEL_DEPLOY_GUIDE.md](./VERCEL_DEPLOY_GUIDE.md)

#### Con Vercel CLI

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy a producción
vercel --prod
```

### Opción 2: Docker

```bash
# Build imagen
docker build -f Dockerfile.production -t stack21:latest .

# Run contenedor
docker run -p 3000:3000 \
  -e NEXTAUTH_SECRET="xxx" \
  -e NEXTAUTH_URL="https://tudominio.com" \
  stack21:latest
```

### Opción 3: VPS/Servidor

```bash
# Build
npm run build

# Usar PM2
npm install -g pm2
pm2 start npm --name "stack21" -- start
pm2 save
pm2 startup
```

### Variables de Entorno en Producción

```env
# REQUERIDO
NEXTAUTH_SECRET="genera-con: openssl rand -base64 32"
NEXTAUTH_URL="https://tudominio.com"

# OPCIONAL
DATABASE_URL="postgresql://..."
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
GITHUB_CLIENT_ID="..."
GITHUB_CLIENT_SECRET="..."
STRIPE_SECRET_KEY="sk_live_..."
OPENAI_API_KEY="sk-..."
```

---

## 🧪 Testing

### Checklist de Testing

Ver checklist completo: [TESTING_CHECKLIST.md](./TESTING_CHECKLIST.md)

### Test Rápido

```bash
# Health check
curl http://localhost:3000/api/health

# Apps API
curl "http://localhost:3000/api/apps?limit=5"

# Connections API
curl http://localhost:3000/api/connections
```

### Lighthouse Score

```bash
npm install -g lighthouse
lighthouse http://localhost:3000 --view
```

**Metas:**
- Performance: > 70
- Accessibility: > 90
- Best Practices: > 85
- SEO: > 80

---

## 🤝 Contribuir

¡Las contribuciones son bienvenidas!

### Cómo Contribuir

1. Fork el proyecto
2. Crea tu feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la branch (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

### Guías de Contribución

- Usa TypeScript con tipado completo
- Sigue las convenciones de código existentes
- Agrega tests para nuevas funcionalidades
- Actualiza la documentación
- Mantén commits pequeños y descriptivos

### Reporte de Bugs

Usa [GitHub Issues](https://github.com/stack21app-sketch/stack21/issues) para reportar bugs.

Incluye:
- Descripción del bug
- Pasos para reproducir
- Comportamiento esperado vs actual
- Screenshots (si aplica)
- Entorno (OS, browser, versión de Node)

---

## 📊 Roadmap

### v2.2.0 (Próxima - Q1 2026)
- [ ] Migración de JSON a PostgreSQL
- [ ] BullMQ workers activos
- [ ] Conectores reales (APIs)
- [ ] Testing E2E automatizado
- [ ] Mejoras de performance

### v2.3.0 (Q2 2026)
- [ ] React Flow editor avanzado
- [ ] WebSocket notifications
- [ ] Git Sync con GitHub
- [ ] CLI tool (`npx stack21`)
- [ ] Marketplace público

### v3.0.0 (Q3 2026)
- [ ] SDK JavaScript en npm
- [ ] Mobile app (React Native)
- [ ] Analytics predictivos
- [ ] Multi-región
- [ ] Enterprise features

---

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](./LICENSE) para más detalles.

---

## 🙏 Agradecimientos

- [Next.js](https://nextjs.org/) - El framework de React
- [Vercel](https://vercel.com/) - Platform de hosting
- [shadcn/ui](https://ui.shadcn.com/) - Componentes UI
- [Tailwind CSS](https://tailwindcss.com/) - Framework CSS
- [Prisma](https://www.prisma.io/) - ORM
- [Supabase](https://supabase.com/) - Backend as a Service

---

## 📞 Soporte

- **Documentación:** [STACK21_COMPLETADO.md](./STACK21_COMPLETADO.md)
- **Issues:** [GitHub Issues](https://github.com/stack21app-sketch/stack21/issues)
- **Email:** support@stack21.com
- **Discord:** [Únete a la comunidad](https://discord.gg/stack21)

---

## 🌟 ¿Te gusta Stack21?

Dale una ⭐ al proyecto en GitHub!

---

<div align="center">

**Hecho con ❤️ por el equipo de Stack21**

[Website](https://stack21.com) · [Twitter](https://twitter.com/stack21) · [LinkedIn](https://linkedin.com/company/stack21)

</div>
