# SaaS Starter

Una plataforma SaaS multi-tenant completa construida con Next.js 14, TypeScript, Prisma, Stripe, NextAuth y OpenAI.

## 🚀 Características

- **🤖 Agentes de IA**: Sistema completo de agentes especializados para automatización
- **Multi-tenant**: Arquitectura diseñada para múltiples organizaciones
- **Autenticación**: Google y GitHub OAuth con NextAuth.js
- **Base de Datos**: PostgreSQL con Prisma ORM
- **Facturación**: Integración completa con Stripe
- **IA**: Integración con OpenAI API y Function Calling
- **UI**: Componentes modernos con Tailwind CSS y Radix UI
- **TypeScript**: Tipado completo para mejor experiencia de desarrollo

## 📋 Prerrequisitos

- Node.js 18+ 
- PostgreSQL
- Cuentas de desarrollador para:
  - Google OAuth
  - GitHub OAuth
  - Stripe
  - OpenAI

## 🛠️ Instalación

### Opción 1: Instalación Rápida (Recomendada)

```bash
# Clona el repositorio
git clone <tu-repositorio>
cd saas-starter

# Ejecuta el script de configuración automática
npm run setup
```

### Opción 2: Instalación Manual

1. **Clona el repositorio**
   ```bash
   git clone <tu-repositorio>
   cd saas-starter
   ```

2. **Instala las dependencias**
   ```bash
   npm install
   ```

3. **Configura las variables de entorno**
   Crea un archivo `.env.local` copiando y pegando esta plantilla y completa tus valores:
   
   ```env
   # === App ===
   NODE_ENV=development
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   CUSTOM_DOMAIN=

   # === Auth (NextAuth) ===
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=tu-clave-secreta-segura

   # === Database ===
   DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/DBNAME?schema=public

   # === OAuth (opcional) ===
   GOOGLE_CLIENT_ID=
   GOOGLE_CLIENT_SECRET=
   GITHUB_CLIENT_ID=
   GITHUB_CLIENT_SECRET=

   # === Stripe ===
   STRIPE_PUBLIC_KEY=
   STRIPE_SECRET_KEY=
   STRIPE_WEBHOOK_SECRET=

   # === Email (SMTP) ===
   SMTP_HOST=
   SMTP_PORT=587
   SMTP_USER=
   SMTP_PASS=
   SMTP_FROM=noreply@example.com

   # === OpenAI (opcional) ===
   OPENAI_API_KEY=

   # === Seguridad ===
   ENCRYPTION_KEY=replace_with_32_chars_key________________

   # === Admin ===
   ADMIN_KEY=
   ```

4. **Configura la base de datos**
   ```bash
   # Genera el cliente de Prisma
   npm run db:generate
   
   # Aplica migraciones (entorno local)
   npm run migrate:dev
   
   # Opcional: Ejecuta el seed
   npm run db:seed
   ```

5. **Inicia el servidor de desarrollo**
   ```bash
   npm run dev
   ```

6. **Abre tu navegador**
   Visita [http://localhost:3000](http://localhost:3000)

## 🏗️ Estructura del Proyecto

```
saas-starter/
├── prisma/
│   └── schema.prisma          # Esquema de la base de datos
├── src/
│   ├── app/                   # App Router de Next.js
│   │   ├── api/              # API Routes
│   │   ├── auth/             # Páginas de autenticación
│   │   ├── dashboard/        # Dashboard principal
│   │   └── layout.tsx        # Layout raíz
│   ├── components/           # Componentes reutilizables
│   │   └── ui/              # Componentes de UI base
│   ├── lib/                 # Utilidades y configuraciones
│   │   ├── auth.ts          # Configuración de NextAuth
│   │   ├── prisma.ts        # Cliente de Prisma
│   │   ├── stripe.ts        # Configuración de Stripe
│   │   └── openai.ts        # Configuración de OpenAI
│   └── types/               # Tipos TypeScript
└── package.json
```

## 🗄️ Modelos de Base de Datos

### User
- Información básica del usuario
- Relación con cuentas OAuth

### Workspace
- Espacio de trabajo multi-tenant
- Relación con miembros y proyectos

### Project
- Proyectos dentro de un workspace
- Contiene módulos

### Module
- Componentes de un proyecto
- Tipos: AI_CHAT, DATA_PROCESSOR, API_INTEGRATION, etc.

### Workflow
- Flujos de trabajo automatizados
- Estados: DRAFT, ACTIVE, PAUSED, ARCHIVED

### RunLog
- Registro de ejecuciones de workflows
- Estados: PENDING, RUNNING, COMPLETED, FAILED, CANCELLED

## 🔧 Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run start` - Inicia el servidor de producción
- `npm run lint` - Ejecuta el linter
- `npm run db:push` - Sincroniza el esquema con la base de datos
- `npm run db:generate` - Genera el cliente de Prisma
- `npm run db:studio` - Abre Prisma Studio

## 🚀 Despliegue

### Vercel (Recomendado)

1. Conecta tu repositorio a Vercel
2. Configura las variables de entorno en el dashboard de Vercel
3. Despliega automáticamente
4. En producción, Prisma ejecutará migraciones con `prisma migrate deploy` desde CI

### Variables de Entorno (Producción)

Configura estas variables en tu plataforma (Vercel, etc.):

- `DATABASE_URL`
- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`
- `STRIPE_PUBLIC_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`
- `SMTP_*` (si usas email)
- `OPENAI_API_KEY` (si usas IA)
- `CUSTOM_DOMAIN` (opcional)

### Otras plataformas

El proyecto es compatible con cualquier plataforma que soporte Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 📚 Próximos Pasos

1. **Configurar OAuth Providers**:
   - [Google OAuth Setup](https://developers.google.com/identity/protocols/oauth2)
   - [GitHub OAuth Setup](https://docs.github.com/en/developers/apps/building-oauth-apps)

2. **Configurar Stripe**:
   - [Stripe Dashboard](https://dashboard.stripe.com/)
   - [Stripe Webhooks](https://stripe.com/docs/webhooks)

3. **Configurar OpenAI**:
   - [OpenAI API Keys](https://platform.openai.com/api-keys)

4. **Personalizar la UI**:
   - Modifica los componentes en `src/components/ui/`
   - Ajusta los estilos en `src/app/globals.css`

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🤖 Agentes de IA

Stack21 incluye un sistema completo de agentes de IA que pueden automatizar tareas complejas:

### **Agentes Disponibles**
- **🍽️ Agente de Reservas**: Reserva mesas en restaurantes automáticamente
- **📈 Agente de Marketing**: Crea y optimiza campañas de marketing
- **📊 Agente de Análisis**: Analiza datos empresariales y genera reportes

### **Características**
- ✅ OpenAI Function Calling integrado
- ✅ Interfaz de chat interactiva
- ✅ Sistema de límites por plan
- ✅ Historial completo de ejecuciones
- ✅ APIs externas simuladas (listas para integración real)

### **Cómo Usar**
1. Ve a `/agents` en tu dashboard
2. Selecciona un agente especializado
3. Escribe tu solicitud en lenguaje natural
4. El agente ejecuta la tarea automáticamente

### **Demo en Vivo**
Visita `/agents/demo` para ver una demostración interactiva del agente de reservas.

Para más información, consulta la [documentación completa de agentes](./docs/AI_AGENTS_README.md).

## 🆘 Soporte

Si tienes preguntas o necesitas ayuda:

1. Revisa la documentación
2. Busca en los issues existentes
3. Crea un nuevo issue con detalles específicos

---

¡Construido con ❤️ usando Next.js, Prisma, OpenAI y las mejores herramientas de desarrollo!
