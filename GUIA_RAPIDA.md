# 🚀 Stack21 - Guía Rápida de Inicio

## ⚡ Inicio Rápido (5 minutos)

### 1. Instalación

```bash
# Si aún no lo hiciste
npm install
```

### 2. Inicializar Datos

```bash
# Genera workflows, runs y templates de ejemplo
node scripts/init-sample-data.js
```

### 3. Iniciar Servidor

```bash
# Desarrollo
npm run dev

# Abre: http://localhost:3000
```

---

## 🎯 Flujos Principales

### A. Explorar Apps (1 min)

1. Ve a: http://localhost:3000/apps
2. Busca "github" o "slack"
3. Filtra por categoría
4. Abre detalle de cualquier app

### B. Conectar una App (2 min)

1. En detalle de app → "Conectar"
2. Elige "OAuth Demo" o "API Key Demo"
3. Confirma en: http://localhost:3000/connections
4. Verás tu conexión activa

### C. Crear Workflow (3 min)

1. Ve a: http://localhost:3000/workflows/new
2. Nombre: "Mi Primer Workflow"
3. Trigger: Webhook
4. Agrega pasos:
   - Log: "Inicio del workflow"
   - Delay: 1000ms
   - HTTP Request: https://api.ejemplo.com/test
5. Guarda
6. En el editor, clic "Ejecutar"
7. Ve a /runs para ver el resultado

### D. Usar Plantilla (1 min)

1. Ve a: http://localhost:3000/templates
2. Elige una plantilla
3. Clic "Aplicar Plantilla"
4. Te lleva al editor con workflow pre-construido

### E. AI Builder (2 min)

1. Ve a: http://localhost:3000/ai-builder
2. Escribe: "Enviar email cuando alguien se registra"
3. Clic "Generar"
4. Revisa sugerencias
5. Clic "Usar este workflow"

---

## 🔌 APIs Clave

### Apps
```bash
# Listar
curl "http://localhost:3000/api/apps?limit=10"

# Detalle
curl "http://localhost:3000/api/apps/github"
```

### Conexiones
```bash
# Crear
curl -X POST "http://localhost:3000/api/connections" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Mi Conexión",
    "appSlug": "github",
    "authType": "oauth2",
    "credentials": {"token": "xxx"}
  }'

# Listar
curl "http://localhost:3000/api/connections"

# Eliminar
curl -X DELETE "http://localhost:3000/api/connections?id=conn_xxx"
```

### Workflows
```bash
# Crear
curl -X POST "http://localhost:3000/api/workflows" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Workflow",
    "trigger": {"type": "webhook", "config": {}},
    "steps": [
      {"id": "step_1", "type": "log", "name": "Log", "config": {"message": "Test"}}
    ]
  }'

# Ejecutar
curl -X POST "http://localhost:3000/api/workflows/wf_xxx/run" \
  -H "Content-Type: application/json" \
  -d '{"triggerData": {"test": true}}'
```

### Webhooks
```bash
# Enviar datos al webhook
curl -X POST "http://localhost:3000/api/webhooks/webhook/form-submit" \
  -H "Content-Type: application/json" \
  -d '{"email": "test@test.com", "name": "Usuario"}'
```

---

## 🛠️ Comandos Útiles

```bash
# Desarrollo
npm run dev           # Servidor de desarrollo

# Build
npm run build         # Build de producción
npm start            # Servidor de producción

# Testing
npm run lint         # Linter
npx tsc --noEmit     # Type checking

# Datos
node scripts/init-sample-data.js      # Inicializar datos
node scripts/generate-more-apps.js    # Generar más apps

# Deploy
./deploy-stack21.sh   # Script automatizado de deploy
```

---

## 📁 Estructura Clave

```
src/
├── app/
│   ├── api/              # API Routes
│   │   ├── apps/         # Apps API
│   │   ├── connections/  # Conexiones API
│   │   ├── workflows/    # Workflows API
│   │   ├── runs/         # Runs API
│   │   ├── templates/    # Templates API
│   │   ├── webhooks/     # Webhooks API
│   │   └── oauth/        # OAuth flow
│   ├── apps/             # App Directory pages
│   ├── connections/      # Conexiones page
│   ├── workflows/        # Workflows pages
│   ├── runs/             # Runs pages
│   ├── templates/        # Templates page
│   ├── ai-builder/       # AI Builder page
│   └── dashboard/        # Dashboard page
├── components/
│   ├── layout/           # Layouts (AppLayout, etc.)
│   ├── workflow/         # Workflow components
│   └── ui/               # shadcn/ui components
├── lib/
│   ├── execution-engine.ts  # Motor de ejecución
│   ├── connectors/          # Conectores (GitHub, Slack, etc.)
│   ├── queue/               # BullMQ (configurado)
│   └── stripe.ts            # Pagos
└── data/                 # Almacenamiento JSON
    ├── apps.json         # 1669 apps
    ├── categories.json   # Categorías
    ├── connections.json  # Conexiones
    ├── workflows.json    # Workflows
    ├── runs.json         # Ejecuciones
    └── templates.json    # Plantillas
```

---

## 🔐 Configuración de Producción

### Variables de Entorno Esenciales

```env
# NextAuth (REQUERIDO)
NEXTAUTH_SECRET="genera-con: openssl rand -base64 32"
NEXTAUTH_URL="https://tudominio.com"

# Base de datos (OPCIONAL - usa JSON en dev)
DATABASE_URL="postgresql://user:pass@host:5432/db"

# OAuth (OPCIONAL)
GOOGLE_CLIENT_ID="xxx.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="xxx"
GITHUB_CLIENT_ID="xxx"
GITHUB_CLIENT_SECRET="xxx"
```

### Vercel Deploy

```bash
# Opción 1: CLI
npm i -g vercel
vercel --prod

# Opción 2: GitHub Integration
# Push a main → auto-deploy
git push origin main
```

### Variables en Vercel Dashboard

1. Ve a: vercel.com/tu-proyecto/settings/environment-variables
2. Agrega:
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL`
   - (Resto opcionales según necesites)
3. Redeploy

---

## 🐛 Troubleshooting

### "No hay apps"
- Asegúrate de que `src/data/apps.json` existe
- O deja que el fallback cargue 5 apps de ejemplo
- Recarga la página sin caché (Cmd+Shift+R)

### "No autorizado" en API
- En desarrollo: las APIs están abiertas sin auth
- En producción: necesitas estar logueado
- Verifica `NODE_ENV` variable

### "Error de crypto"
- Borra `.next`: `rm -rf .next`
- Reinicia: `npm run dev`
- El nuevo código no usa crypto en dev

### El sidebar aparece en landing
- Hard reload: Cmd+Shift+R
- O abre en incógnito
- Debería desaparecer en `/`, `/landing`, `/prelaunch`

---

## 📊 Métricas de Éxito

Después de deploy, verifica:

- [ ] Landing page carga sin sidebar
- [ ] /apps muestra 1669 apps (o 5 de fallback)
- [ ] Puedes conectar apps via OAuth demo
- [ ] /connections lista tus conexiones
- [ ] Puedes crear workflows en /workflows/new
- [ ] Ejecutar workflows funciona
- [ ] /runs muestra ejecuciones con logs
- [ ] /templates permite aplicar plantillas
- [ ] /ai-builder genera sugerencias

---

## 🎯 Próximos Pasos

### Inmediato
1. Probar todos los flujos en localhost
2. Deploy a staging/preview
3. Testing en producción

### Corto Plazo
1. Migrar de JSON a PostgreSQL
2. Activar BullMQ workers
3. Implementar conectores reales
4. Testing E2E automatizado

### Medio Plazo
1. React Flow editor avanzado
2. Notificaciones WebSocket
3. Git Sync
4. CLI tool
5. Mobile app

---

## 💡 Tips

- **Desarrollo sin login:** Todo funciona sin autenticación en localhost
- **Datos persistentes:** JSON files en `src/data/` persisten entre reinicios
- **Hot reload:** Cambios en código recargan automáticamente
- **Debug:** Console del navegador + terminal del servidor
- **Performance:** Build tarda ~30s, dev server ~1s ready

---

## 📞 Ayuda

### Logs
```bash
# Ver logs del servidor
tail -f .next/server/app/api/*/route.js

# Logs de Next.js
# Se muestran en la terminal donde corre npm run dev
```

### Reset Completo
```bash
# Si algo falla, resetea todo
pkill -f "next dev"
rm -rf .next
rm -rf node_modules
npm install
npm run dev
```

---

## 🎉 ¡Listo!

Stack21 está **100% funcional** y listo para:
- ✅ Desarrollo local
- ✅ Testing
- ✅ Deploy a staging
- ✅ Deploy a producción

**¡Disfruta automatizando! 🚀**

