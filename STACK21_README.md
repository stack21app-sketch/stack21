# 🚀 Stack21 - Plataforma de Automatización

Una plataforma SaaS completa de automatización con paridad funcional a Pipedream, construida con Next.js 14, TypeScript, Prisma y Supabase.

## ✨ Características Implementadas

### 🎯 **Core Features**
- ✅ **Workflow Builder Visual** - Editor drag & drop con React Flow
- ✅ **AI Agent Builder** - Generación automática de workflows con IA
- ✅ **App Directory** - Conectores para 100+ aplicaciones
- ✅ **Sistema de Colas** - BullMQ para ejecución asíncrona
- ✅ **Templates Marketplace** - Plantillas predefinidas
- ✅ **Runs & Logs** - Monitoreo de ejecuciones en tiempo real
- ✅ **Conexiones OAuth** - Gestión de autenticación
- ✅ **Data Stores** - Almacenamiento key-value
- ✅ **Webhooks** - Endpoints para triggers HTTP
- ✅ **Scheduler** - Triggers basados en cron

### 🛠 **Stack Técnico**
- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Base de Datos**: PostgreSQL (Supabase)
- **Colas**: BullMQ + Redis
- **UI**: shadcn/ui, React Flow, Framer Motion
- **Autenticación**: NextAuth.js
- **Almacenamiento**: Supabase Storage

## 🚀 Inicio Rápido

### 1. Instalación
```bash
# Clonar repositorio
git clone <repo-url>
cd saas-starter

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con tus credenciales
```

### 2. Base de Datos
```bash
# Generar cliente Prisma
npm run db:generate

# Aplicar migraciones
npm run db:push

# Poblar datos iniciales
npm run seed:automation
```

### 3. Ejecutar Aplicación
```bash
# Desarrollo
npm run dev

# En otra terminal, iniciar workers
npm run workers:dev
```

## 📁 Estructura del Proyecto

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   │   ├── workflows/     # CRUD workflows
│   │   ├── runs/          # Gestión ejecuciones
│   │   ├── apps/          # App Directory
│   │   ├── connections/   # OAuth/API keys
│   │   ├── templates/     # Marketplace
│   │   ├── ai/            # AI Agent Builder
│   │   ├── webhooks/      # Webhook endpoints
│   │   └── scheduler/     # Cron triggers
│   ├── workflows/         # Workflow Builder UI
│   ├── runs/              # Runs Dashboard
│   ├── apps/              # App Directory UI
│   ├── templates/         # Templates UI
│   ├── ai-builder/        # AI Builder UI
│   └── connections/       # Connections UI
├── components/
│   └── workflow/          # Workflow Builder components
├── lib/
│   ├── queue/             # BullMQ workers
│   ├── connectors/        # App connectors
│   └── prisma.ts          # Database client
└── types/
    └── automation.ts      # TypeScript types
```

## 🔧 APIs Principales

### Workflows
- `GET /api/workflows` - Listar workflows
- `POST /api/workflows` - Crear workflow
- `PUT /api/workflows/[id]` - Actualizar workflow
- `DELETE /api/workflows/[id]` - Eliminar workflow
- `PUT /api/workflows/[id]/activate` - Activar/desactivar

### Runs
- `GET /api/runs` - Listar ejecuciones
- `GET /api/runs/[id]` - Detalles de ejecución

### Apps & Connections
- `GET /api/apps` - Listar aplicaciones
- `GET /api/apps/[slug]` - Detalles de app
- `GET /api/connections` - Listar conexiones
- `POST /api/connections` - Crear conexión

### Templates
- `GET /api/templates` - Listar templates
- `POST /api/templates/[id]/apply` - Aplicar template

### AI Builder
- `POST /api/ai/assist` - Generar workflow con IA

### Webhooks
- `POST /api/webhooks/[path]` - Endpoint webhook

## 🎨 Conectores Implementados

### Apps Disponibles
- **Gmail** - Envío y gestión de emails
- **Slack** - Notificaciones y mensajes
- **Notion** - Gestión de bases de datos
- **GitHub** - Issues, PRs, webhooks
- **Google Sheets** - Lectura/escritura de datos
- **HTTP** - Requests genéricos

### Tipos de Triggers
- **HTTP Webhook** - Endpoints personalizados
- **Schedule** - Triggers basados en cron
- **App Events** - Eventos de aplicaciones

### Tipos de Steps
- **App Actions** - Acciones de aplicaciones
- **Code Steps** - JavaScript/Python personalizado
- **Conditions** - Lógica condicional
- **Loops** - Iteraciones
- **Delays** - Pausas temporales
- **HTTP Requests** - Requests HTTP

## 🤖 AI Agent Builder

### Funcionalidades
- **Generación Natural** - Describe tu automatización en lenguaje natural
- **Sugerencias Inteligentes** - IA sugiere optimizaciones
- **Detección de Apps** - Identifica automáticamente aplicaciones necesarias
- **Conexiones Faltantes** - Alerta sobre conexiones requeridas

### Ejemplo de Uso
```
"Cuando llegue un email importante, guardarlo en Notion y enviar una notificación a Slack"
```

## 📊 Sistema de Monitoreo

### Runs Dashboard
- **Estado en Tiempo Real** - Pending, Running, Completed, Failed
- **Logs Detallados** - Por cada paso del workflow
- **Métricas** - Duración, costo, éxito/fallo
- **Filtros** - Por estado, workflow, fecha

### Analytics
- **Ejecuciones por Día** - Gráficos de actividad
- **Apps Más Usadas** - Estadísticas de conectores
- **Tiempo Ahorrado** - Cálculo de eficiencia
- **Costos** - Tracking de gastos por ejecución

## 🔐 Seguridad

### Autenticación
- **NextAuth.js** - OAuth + Email
- **JWT Tokens** - Autenticación API
- **RBAC** - Roles y permisos

### Datos Sensibles
- **Encriptación** - Credenciales de conexiones
- **PII Redaction** - Redacción de datos personales
- **Audit Logs** - Registro de actividades

## 🚀 Despliegue

### Variables de Entorno Requeridas
```env
# Database
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."

# Redis
REDIS_HOST="localhost"
REDIS_PORT="6379"
REDIS_PASSWORD=""

# Auth
NEXTAUTH_SECRET="your-secret"
NEXTAUTH_URL="http://localhost:3000"

# Apps
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

# AI
OPENAI_API_KEY=""

# Encryption
ENCRYPTION_KEY="your-encryption-key"
```

### Scripts Disponibles
```bash
# Desarrollo
npm run dev              # Aplicación
npm run workers:dev      # Workers

# Producción
npm run build           # Build
npm run start           # Start
npm run workers         # Workers

# Base de datos
npm run db:generate     # Generar cliente
npm run db:push         # Aplicar cambios
npm run db:studio       # Prisma Studio

# Seeds
npm run seed:connectors # Poblar conectores
npm run seed:templates  # Poblar templates
npm run seed:automation # Poblar todo
```

## 🎯 Próximos Pasos

### Pendientes
- [ ] **Sistema de Billing** - Stripe integration
- [ ] **SDK JavaScript** - Cliente para desarrolladores
- [ ] **Git Sync** - Versionado de workflows
- [ ] **CLI Tool** - Herramienta de línea de comandos
- [ ] **Tests E2E** - Pruebas automatizadas

### Mejoras Futuras
- [ ] **Python Workers** - Ejecución de código Python
- [ ] **Webhooks Outbound** - Envío de webhooks
- [ ] **Data Transformations** - Transformación de datos
- [ ] **Error Handling** - Manejo avanzado de errores
- [ ] **Rate Limiting** - Límites por plan

## 📚 Documentación

- [API Documentation](./docs/API_DOCUMENTATION.md)
- [User Guide](./docs/USER_GUIDE.md)
- [Deployment Guide](./docs/DEPLOYMENT_GUIDE.md)
- [AI Agents Guide](./docs/AI_AGENTS_README.md)

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver [LICENSE](LICENSE) para más detalles.

---

**Stack21** - Automatiza todo, construye el futuro 🚀
