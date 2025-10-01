# ✅ Checklist de Testing Completo - Stack21

---

## 📋 Tabla de Contenidos

1. [Testing Local](#testing-local)
2. [Testing de APIs](#testing-de-apis)
3. [Testing de UI](#testing-de-ui)
4. [Testing de Flujos Completos](#testing-de-flujos-completos)
5. [Testing de Performance](#testing-de-performance)
6. [Testing de Seguridad](#testing-de-seguridad)
7. [Testing Post-Deploy](#testing-post-deploy)

---

## Testing Local

### Pre-requisitos

```bash
# Verificar que el servidor está corriendo
ps aux | grep "next dev" | grep -v grep

# Si no está corriendo:
npm run dev
```

### 1. Build y Compilación

```bash
# Limpiar caché
rm -rf .next

# Build de producción
npm run build

# Verificar output
# ✅ Debe mostrar: "Compiled successfully"
# ✅ Sin errores de TypeScript
# ⚠️  Warnings menores son OK
```

**Resultado esperado:**
```
✓ Compiled successfully
✓ Linting and checking validity of types
✓ Collecting page data
✓ Generating static pages (X/X)
✓ Collecting build traces
✓ Finalizing page optimization

Route (app)                              Size     First Load JS
┌ ○ /                                    142 B          87.2 kB
├ ○ /apps                                142 B          87.2 kB
└ ...
```

### 2. Verificar Archivos de Datos

```bash
# Verificar que existen
ls -lh src/data/*.json

# apps.json (debe ser ~2-3MB si tiene 1669 apps)
# categories.json (debe tener 50+ categorías)
# connections.json
# workflows.json
# runs.json
# templates.json
```

**Checklist:**
- [ ] `apps.json` existe y tiene > 100 apps
- [ ] `categories.json` tiene > 10 categorías
- [ ] `connections.json` es un array válido
- [ ] `workflows.json` tiene estructura correcta
- [ ] `runs.json` tiene al menos 1 run de ejemplo
- [ ] `templates.json` tiene 3+ templates

---

## Testing de APIs

### Health Check

```bash
# API de salud
curl http://localhost:3000/api/health
```

**Resultado esperado:**
```json
{"status":"ok"}
```

### Apps API

```bash
# Listar apps (primeras 5)
curl "http://localhost:3000/api/apps?limit=5" | jq

# Buscar apps
curl "http://localhost:3000/api/apps?search=github" | jq

# Filtrar por categoría
curl "http://localhost:3000/api/apps?category=developer-tools" | jq

# Paginación
curl "http://localhost:3000/api/apps?page=2&limit=10" | jq

# App específica
curl "http://localhost:3000/api/apps/github" | jq
```

**Checklist:**
- [ ] Lista apps sin errores
- [ ] Búsqueda retorna resultados relevantes
- [ ] Filtro por categoría funciona
- [ ] Paginación retorna diferentes resultados
- [ ] App detalle muestra info completa

### Connections API

```bash
# Listar conexiones
curl "http://localhost:3000/api/connections" | jq

# Crear conexión (OAuth demo)
curl -X POST "http://localhost:3000/api/connections" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test GitHub",
    "appSlug": "github",
    "authType": "oauth2",
    "credentials": {"token": "test123"}
  }' | jq

# Eliminar conexión
curl -X DELETE "http://localhost:3000/api/connections?id=conn_xxx" | jq
```

**Checklist:**
- [ ] GET retorna array de conexiones
- [ ] POST crea nueva conexión con ID único
- [ ] DELETE elimina conexión correctamente

### Workflows API

```bash
# Listar workflows
curl "http://localhost:3000/api/workflows" | jq

# Crear workflow
curl -X POST "http://localhost:3000/api/workflows" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Workflow",
    "description": "Workflow de prueba",
    "trigger": {"type": "manual", "config": {}},
    "steps": [
      {"id": "step_1", "type": "log", "name": "Log Test", "config": {"message": "Hola"}}
    ]
  }' | jq

# Obtener workflow
curl "http://localhost:3000/api/workflows/wf_xxx" | jq

# Ejecutar workflow
curl -X POST "http://localhost:3000/api/workflows/wf_xxx/run" \
  -H "Content-Type: application/json" \
  -d '{"triggerData": {"test": true}}' | jq

# Activar/desactivar
curl -X POST "http://localhost:3000/api/workflows/wf_xxx/activate" \
  -H "Content-Type: application/json" \
  -d '{"active": true}' | jq
```

**Checklist:**
- [ ] Lista workflows existentes
- [ ] Crea workflow con ID único
- [ ] Obtiene workflow específico
- [ ] Ejecuta workflow y retorna runId
- [ ] Activa/desactiva estado

### Runs API

```bash
# Listar runs
curl "http://localhost:3000/api/runs" | jq

# Run específico
curl "http://localhost:3000/api/runs/run_xxx" | jq
```

**Checklist:**
- [ ] Lista runs con paginación
- [ ] Detalle muestra pasos y logs
- [ ] Estados son correctos (running/completed/failed)

### Templates API

```bash
# Listar templates
curl "http://localhost:3000/api/templates" | jq

# Template específico
curl "http://localhost:3000/api/templates/template_1" | jq

# Aplicar template
curl -X POST "http://localhost:3000/api/templates/template_1/apply" \
  -H "Content-Type: application/json" \
  -d '{"projectId": "proj_1"}' | jq
```

**Checklist:**
- [ ] Lista templates disponibles
- [ ] Detalle muestra definición completa
- [ ] Aplicar crea nuevo workflow

### Webhooks API

```bash
# Enviar webhook
curl -X POST "http://localhost:3000/api/webhooks/webhook/test-webhook" \
  -H "Content-Type: application/json" \
  -d '{"event": "test", "data": {"message": "Hola"}}' | jq
```

**Checklist:**
- [ ] Recibe webhook sin errores
- [ ] Ejecuta workflow asociado (si existe)

---

## Testing de UI

### Landing Page (/)

**URL:** http://localhost:3000/

**Checklist:**
- [ ] Carga sin sidebar
- [ ] Hero section visible
- [ ] Botones funcionan
- [ ] Responsive en mobile
- [ ] Sin errores en console
- [ ] Animaciones fluidas

### App Directory (/apps)

**URL:** http://localhost:3000/apps

**Checklist:**
- [ ] Muestra grid de apps
- [ ] Total de resultados correcto
- [ ] Búsqueda funciona (escribe "github")
- [ ] Filtro por categoría funciona
- [ ] Paginación funciona (Next/Prev)
- [ ] Selector numérico de página funciona
- [ ] Click en app lleva a detalle
- [ ] Responsive en mobile

### App Detail (/apps/[slug])

**URL:** http://localhost:3000/apps/github

**Checklist:**
- [ ] Muestra información de la app
- [ ] Logo se visualiza
- [ ] Botón "Conectar" funciona
- [ ] Sección de features visible
- [ ] Pricing info mostrada
- [ ] Link "Go to Connections" (si hay conexiones)

### App Connect (/apps/[slug]/connect)

**URL:** http://localhost:3000/apps/github/connect

**Checklist:**
- [ ] Muestra opciones de conexión
- [ ] Botón OAuth demo funciona
- [ ] Botón API Key demo funciona
- [ ] Redirect correcto después de conectar
- [ ] Mensaje de éxito visible

### Connections (/connections)

**URL:** http://localhost:3000/connections

**Checklist:**
- [ ] Lista conexiones existentes
- [ ] Paginación funciona
- [ ] Botón "Disconnect" funciona
- [ ] Modal de confirmación aparece
- [ ] Contador en header actualiza

### Workflows (/workflows)

**URL:** http://localhost:3000/workflows

**Checklist:**
- [ ] Lista workflows existentes
- [ ] Botón "New Workflow" funciona
- [ ] Click en workflow abre editor
- [ ] Estados visibles (active/inactive)

### Workflow Creator (/workflows/new)

**URL:** http://localhost:3000/workflows/new

**Checklist:**
- [ ] Formulario de creación visible
- [ ] Campos requeridos validados
- [ ] Selección de trigger funciona
- [ ] Botón "Create" redirige a editor

### Workflow Editor (/workflows/[id]/edit)

**URL:** http://localhost:3000/workflows/[id]/edit

**Checklist:**
- [ ] Carga workflow existente
- [ ] Puede agregar pasos
- [ ] Puede editar pasos
- [ ] Puede eliminar pasos
- [ ] Botón "Save" guarda cambios
- [ ] Botón "Run" ejecuta workflow
- [ ] Loading states visibles

### Runs (/runs)

**URL:** http://localhost:3000/runs

**Checklist:**
- [ ] Lista ejecuciones
- [ ] Estados visibles (completed/failed)
- [ ] Duración mostrada
- [ ] Click en run abre detalle
- [ ] Filtros funcionan

### Run Detail (/runs/[id])

**URL:** http://localhost:3000/runs/[id]

**Checklist:**
- [ ] Muestra información del run
- [ ] Logs paso a paso visibles
- [ ] Input/output de cada paso
- [ ] Estados de pasos correctos
- [ ] Errores mostrados (si hay)

### Templates (/templates)

**URL:** http://localhost:3000/templates

**Checklist:**
- [ ] Grid de templates visible
- [ ] Búsqueda funciona
- [ ] Filtros por categoría funcionan
- [ ] Filtro por dificultad funciona
- [ ] Botón "Apply Template" funciona
- [ ] Redirige a editor con workflow

### AI Builder (/ai-builder)

**URL:** http://localhost:3000/ai-builder

**Checklist:**
- [ ] Textarea visible
- [ ] Botón "Generate" funciona
- [ ] Sugerencias aparecen
- [ ] Puede aplicar sugerencia
- [ ] Ejemplos de prompts visibles

### Dashboard (/dashboard)

**URL:** http://localhost:3000/dashboard

**Checklist:**
- [ ] Métricas visibles
- [ ] Gráfico de ejecuciones
- [ ] Actividad reciente
- [ ] Acciones rápidas funcionan
- [ ] Layout diferente (no AppLayout)

---

## Testing de Flujos Completos

### Flujo 1: Conectar una App

1. [ ] Ir a `/apps`
2. [ ] Buscar "github"
3. [ ] Click en GitHub app
4. [ ] Click "Conectar GitHub"
5. [ ] Elegir "OAuth Demo"
6. [ ] Verificar redirect a `/api/oauth/demo/authorize`
7. [ ] Verificar redirect a `/api/oauth/demo/callback`
8. [ ] Verificar redirect a `/apps/github?status=success`
9. [ ] Verificar mensaje de éxito
10. [ ] Ir a `/connections`
11. [ ] Verificar que la conexión aparece

**Tiempo estimado:** 1-2 minutos

### Flujo 2: Crear y Ejecutar Workflow

1. [ ] Ir a `/workflows/new`
2. [ ] Nombre: "Mi Workflow de Prueba"
3. [ ] Trigger: Manual
4. [ ] Click "Create"
5. [ ] En editor, agregar paso "Log"
6. [ ] Configurar mensaje: "Hola Mundo"
7. [ ] Agregar paso "Delay" (1000ms)
8. [ ] Agregar paso "Log" (mensaje: "Adiós")
9. [ ] Click "Save Workflow"
10. [ ] Click "Run Workflow"
11. [ ] Verificar modal de confirmación
12. [ ] Confirmar ejecución
13. [ ] Ir a `/runs`
14. [ ] Verificar que aparece nuevo run
15. [ ] Click en el run
16. [ ] Verificar logs de cada paso

**Tiempo estimado:** 3-4 minutos

### Flujo 3: Aplicar Template

1. [ ] Ir a `/templates`
2. [ ] Elegir template "Welcome Email"
3. [ ] Click "Apply Template"
4. [ ] Verificar redirect a editor
5. [ ] Verificar que workflow tiene pasos del template
6. [ ] Modificar algo (opcional)
7. [ ] Guardar
8. [ ] Ejecutar
9. [ ] Verificar en `/runs`

**Tiempo estimado:** 2-3 minutos

### Flujo 4: AI Builder

1. [ ] Ir a `/ai-builder`
2. [ ] Escribir: "Enviar email cuando alguien se registra"
3. [ ] Click "Generate"
4. [ ] Esperar respuesta
5. [ ] Verificar sugerencias
6. [ ] Click "Use this workflow"
7. [ ] Verificar redirect a editor
8. [ ] Workflow tiene estructura sugerida

**Tiempo estimado:** 1-2 minutos

### Flujo 5: Desconectar App

1. [ ] Ir a `/connections`
2. [ ] Click "Disconnect" en una conexión
3. [ ] Confirmar en modal
4. [ ] Verificar que desaparece de la lista
5. [ ] Verificar que contador en header actualiza

**Tiempo estimado:** 30 segundos

---

## Testing de Performance

### Lighthouse Score

```bash
# Instalar Lighthouse CLI
npm install -g lighthouse

# Ejecutar audit
lighthouse http://localhost:3000 \
  --output=html \
  --output-path=./lighthouse-report.html \
  --chrome-flags="--headless"

# Abrir reporte
open lighthouse-report.html
```

**Metas:**
- [ ] Performance: > 70
- [ ] Accessibility: > 90
- [ ] Best Practices: > 85
- [ ] SEO: > 80

### Tiempos de Carga

```bash
# Usar curl con timing
curl -o /dev/null -s -w "Time: %{time_total}s\n" http://localhost:3000/
curl -o /dev/null -s -w "Time: %{time_total}s\n" http://localhost:3000/apps
curl -o /dev/null -s -w "Time: %{time_total}s\n" http://localhost:3000/workflows
```

**Metas:**
- [ ] Landing: < 1s
- [ ] /apps: < 2s
- [ ] /workflows: < 1.5s

### Bundle Size

```bash
# Ver bundle size después del build
npm run build

# Buscar línea:
# Route (app)                              Size     First Load JS
```

**Metas:**
- [ ] First Load JS Shared: < 100 kB
- [ ] Páginas individuales: < 10 kB

---

## Testing de Seguridad

### HTTPS y Headers

```bash
# En producción, verificar headers
curl -I https://tu-dominio.vercel.app/

# Debe incluir:
# Strict-Transport-Security
# X-Frame-Options: DENY
# X-Content-Type-Options: nosniff
# X-XSS-Protection
```

**Checklist:**
- [ ] HTTPS forzado
- [ ] Headers de seguridad presentes
- [ ] No expone información sensible

### Secrets

```bash
# Verificar que no hay secrets en el código
grep -r "NEXTAUTH_SECRET" src/
grep -r "sk_live_" src/
grep -r "sk_test_" src/

# No debe retornar resultados en archivos commiteados
```

**Checklist:**
- [ ] No hay API keys en código
- [ ] .env.local en .gitignore
- [ ] Secrets solo en variables de entorno

### Authentication

**Checklist:**
- [ ] APIs protegidas en producción
- [ ] Middleware funciona
- [ ] Rate limiting activo (en prod)
- [ ] Sessions expiran correctamente

---

## Testing Post-Deploy

### Producción (Vercel)

```bash
# Reemplazar con tu URL
DEPLOY_URL="https://tu-dominio.vercel.app"

# Health check
curl "$DEPLOY_URL/api/health"

# Apps API
curl "$DEPLOY_URL/api/apps?limit=5" | jq

# Connections API
curl "$DEPLOY_URL/api/connections" | jq

# Workflows API
curl "$DEPLOY_URL/api/workflows" | jq
```

### Navegador (Producción)

**Checklist:**
- [ ] Landing carga correctamente
- [ ] SSL activo (candado verde)
- [ ] No hay errores en console
- [ ] /apps muestra aplicaciones
- [ ] OAuth flow funciona (si configurado)
- [ ] Workflows ejecutan
- [ ] Runs se registran

### Monitoring

**Checklist en Vercel Dashboard:**
- [ ] No hay errores 5xx
- [ ] 4xx son esperados (ej: 404)
- [ ] Latencia < 500ms promedio
- [ ] No hay memory leaks
- [ ] Functions no exceden timeout

---

## Reporte de Testing

### Template de Reporte

```markdown
# Reporte de Testing - Stack21

**Fecha:** [Fecha]
**Tester:** [Nombre]
**Entorno:** Local / Staging / Producción
**URL:** [URL]

## Resumen
- Total de tests: X
- Pasados: Y
- Fallados: Z
- Bloqueadores: W

## Tests Ejecutados

### APIs
- [ ] Health: ✅ PASS
- [ ] Apps: ✅ PASS
- [ ] Connections: ⚠️ PASS con warnings
- [ ] Workflows: ❌ FAIL (detalle abajo)

### UI
- [ ] Landing: ✅ PASS
- [ ] App Directory: ✅ PASS
...

## Issues Encontrados

### Issue #1: [Título]
- **Severidad:** Alta / Media / Baja
- **Pasos para reproducir:**
  1. ...
  2. ...
- **Comportamiento esperado:** ...
- **Comportamiento actual:** ...
- **Screenshot:** [adjuntar si aplica]

## Recomendaciones

1. ...
2. ...
```

---

## Automatización de Tests

### Setup de Tests E2E (Playwright)

```bash
# Instalar Playwright
npm install -D @playwright/test

# Configurar
npx playwright install

# Crear test básico
cat > tests/e2e/landing.spec.ts << 'EOF'
import { test, expect } from '@playwright/test';

test('landing page loads', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await expect(page.locator('h1')).toContainText('Stack21');
});
EOF

# Ejecutar tests
npx playwright test
```

### Script de Testing Rápido

```bash
# Crear script de test rápido
cat > test-quick.sh << 'EOF'
#!/bin/bash
echo "🧪 Testing Stack21..."

# Health check
echo "1. Health Check..."
curl -f http://localhost:3000/api/health || echo "❌ FAIL"

# Apps API
echo "2. Apps API..."
curl -f "http://localhost:3000/api/apps?limit=1" || echo "❌ FAIL"

# Connections API
echo "3. Connections API..."
curl -f "http://localhost:3000/api/connections" || echo "❌ FAIL"

echo "✅ Tests completados"
EOF

chmod +x test-quick.sh
./test-quick.sh
```

---

## 🎯 Checklist Final

### Pre-Launch
- [ ] Todos los tests locales pasan
- [ ] APIs funcionan correctamente
- [ ] UI responsive en mobile/tablet/desktop
- [ ] Flujos completos funcionan
- [ ] Performance aceptable
- [ ] No hay secrets expuestos

### Launch
- [ ] Deploy a producción exitoso
- [ ] Tests post-deploy pasan
- [ ] Monitoring configurado
- [ ] Alertas activas

### Post-Launch
- [ ] Monitorear errores primeras 24h
- [ ] Verificar métricas de uso
- [ ] Recopilar feedback
- [ ] Iterar mejoras

---

**¡Testing completo! Stack21 listo para producción! 🚀**

---

**Última actualización:** 1 de Octubre, 2025  
**Versión:** 1.0  
**Mantenedor:** Stack21 Team

