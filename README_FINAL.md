# 🚀 Stack21 - Plataforma SaaS Completa

**La plataforma de automatización más avanzada del mundo, optimizada para MacBook**

## ✨ Características Principales

### 🧠 **IA Avanzada**
- **Motor Cuántico de Workflows**: Generación automática de flujos de trabajo
- **Inteligencia Predictiva**: Anticipación de necesidades del usuario
- **Interfaz Multimodal**: Control por voz, texto e imagen
- **Sistema de Auto-Optimización**: Mejora continua automática
- **Aprendizaje Adaptativo**: Se adapta a tus patrones de uso

### 🔧 **Funcionalidades Core**
- **Workflow Builder**: Editor visual drag & drop
- **Templates Predefinidos**: 6+ templates listos para usar
- **Analytics Avanzado**: Métricas detalladas en tiempo real
- **Integraciones**: Conecta con 100+ servicios
- **Backup Automático**: Respaldo continuo de datos
- **Testing Automatizado**: Tests integrados

### 💳 **Sistema de Pagos**
- **Planes Flexibles**: Starter (Gratis), Pro ($29/mes), Enterprise ($99/mes)
- **Pago Anual**: 20% de descuento
- **Stripe Integration**: Pagos seguros y confiables
- **Facturación Automática**: Sin sorpresas

### 🔐 **Seguridad y Autenticación**
- **Google OAuth**: Inicio de sesión con Google
- **GitHub OAuth**: Inicio de sesión con GitHub
- **NextAuth.js**: Autenticación robusta
- **Supabase**: Base de datos segura con RLS
- **Middleware**: Protección de rutas

## 🚀 Inicio Rápido

### 1. **Clonar y Instalar**
```bash
git clone https://github.com/tu-usuario/stack21.git
cd stack21
npm install
```

### 2. **Configuración Automática**
```bash
# Configuración completa (recomendado)
node setup-complete.js

# O configuración individual
node setup-oauth.js      # Google OAuth
node setup-supabase.js   # Supabase
```

### 3. **Ejecutar en Desarrollo**
```bash
npm run dev
```

### 4. **Desplegar a Producción**
```bash
node deploy-vercel.js
```

## 📁 Estructura del Proyecto

```
stack21/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── dashboard/          # Dashboard principal
│   │   ├── auth/              # Autenticación
│   │   └── api/               # API Routes
│   ├── components/            # Componentes React
│   │   ├── ai/               # Componentes de IA
│   │   ├── real/             # Motores en tiempo real
│   │   └── automation/       # Automatización
│   ├── hooks/                # Custom hooks
│   └── lib/                  # Utilidades
├── scripts/                  # Scripts de configuración
├── docs/                     # Documentación
└── tests/                    # Tests automatizados
```

## 🔧 Configuración Manual

### **Variables de Entorno (.env.local)**
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=tu_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_key

# NextAuth
NEXTAUTH_SECRET=tu_secret_generado
NEXTAUTH_URL=http://localhost:3000

# Google OAuth
GOOGLE_CLIENT_ID=tu_google_client_id
GOOGLE_CLIENT_SECRET=tu_google_client_secret

# GitHub OAuth (opcional)
GITHUB_CLIENT_ID=tu_github_client_id
GITHUB_CLIENT_SECRET=tu_github_client_secret
```

### **Configuración de Google OAuth**
1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un proyecto
3. Habilita Google+ API
4. Crea credenciales OAuth 2.0
5. Configura URIs de redirección:
   - `http://localhost:3000/api/auth/callback/google`
   - `https://tu-dominio.com/api/auth/callback/google`

### **Configuración de Supabase**
1. Ve a [supabase.com](https://supabase.com/)
2. Crea un nuevo proyecto
3. Ejecuta la migración SQL (`fixed_supabase_migration.sql`)
4. Configura autenticación en Authentication > Settings

## 🎯 Uso de la Plataforma

### **Dashboard Principal**
- **Métricas en Tiempo Real**: Workflows activos, ejecuciones, ahorros
- **Workflows Recientes**: Acceso rápido a tus automatizaciones
- **IA Multimodal**: Control por voz y texto
- **Monitor del Sistema**: Estado en tiempo real

### **Workflow Builder**
- **Editor Visual**: Drag & drop intuitivo
- **Nodos Inteligentes**: Input, Proceso, Decisión, IA, Output
- **Templates**: 6+ plantillas predefinidas
- **Ejecución**: Prueba y ejecuta workflows

### **Templates Disponibles**
1. **Email Marketing**: Automatización de emails
2. **E-commerce**: Procesamiento de pedidos
3. **Soporte**: Sistema de tickets inteligente
4. **Contenido**: Generación automática
5. **Citas**: Reservas y recordatorios
6. **Analytics**: Procesamiento de datos

## 🧪 Testing

### **Verificación Completa**
```bash
node verify-complete.js
```

### **Tests Automatizados**
```bash
npm run test
```

### **Tests E2E**
```bash
npm run test:e2e
```

## 📊 Monitoreo y Analytics

### **Métricas Disponibles**
- Workflows activos/inactivos
- Ejecuciones por día/mes
- Tasa de éxito
- Tiempo ahorrado
- Ahorro estimado en dinero
- Crecimiento de usuarios

### **Alertas Automáticas**
- Workflows fallidos
- Límites de uso alcanzados
- Nuevas integraciones disponibles
- Actualizaciones del sistema

## 🔒 Seguridad

### **Medidas Implementadas**
- **Row Level Security (RLS)**: Protección a nivel de fila
- **Middleware de Autenticación**: Verificación de tokens
- **Rate Limiting**: Protección contra abuso
- **CORS**: Configuración segura de origen cruzado
- **Headers de Seguridad**: CSP, HSTS, etc.

### **Cumplimiento**
- **GDPR**: Cumplimiento con regulaciones europeas
- **CCPA**: Cumplimiento con regulaciones de California
- **SOC 2**: Estándares de seguridad empresarial

## 🚀 Despliegue

### **Vercel (Recomendado)**
```bash
node deploy-vercel.js
```

### **Docker**
```bash
docker build -t stack21 .
docker run -p 3000:3000 stack21
```

### **Manual**
```bash
npm run build
npm start
```

## 📈 Escalabilidad

### **Arquitectura**
- **Next.js 14**: App Router para mejor rendimiento
- **Supabase**: Base de datos escalable
- **Vercel**: CDN global
- **React Flow**: Visualización optimizada

### **Límites por Plan**
- **Starter**: 5 workflows, 100 ejecuciones/mes
- **Pro**: 50 workflows, 1,000 ejecuciones/mes
- **Enterprise**: Ilimitado + funciones avanzadas

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 🆘 Soporte

- **Documentación**: [docs.stack21.com](https://docs.stack21.com)
- **Email**: support@stack21.com
- **Discord**: [discord.gg/stack21](https://discord.gg/stack21)
- **GitHub Issues**: [github.com/tu-usuario/stack21/issues](https://github.com/tu-usuario/stack21/issues)

## 🎉 Agradecimientos

- **Next.js Team**: Por el framework increíble
- **Supabase Team**: Por la base de datos perfecta
- **Vercel Team**: Por el hosting excepcional
- **React Flow Team**: Por la visualización de workflows
- **Comunidad Open Source**: Por todas las librerías increíbles

---

**¡Stack21 está listo para revolucionar tu productividad! 🚀**

*Desarrollado con ❤️ para la comunidad de desarrolladores*
