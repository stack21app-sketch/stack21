# 🗄️ Configuración de Supabase para Stack21

## 📋 Pasos para configurar Supabase

### 1. **Crear proyecto en Supabase**

1. Ve a [supabase.com](https://supabase.com/)
2. Haz clic en **"Start your project"**
3. Inicia sesión con GitHub, Google, o email
4. Haz clic en **"New project"**
5. Completa la información:
   - **Name**: `Stack21`
   - **Database Password**: Genera una contraseña segura
   - **Region**: Elige la más cercana a tus usuarios
6. Haz clic en **"Create new project"**

### 2. **Obtener credenciales**

Una vez creado el proyecto:

1. Ve a **Settings** > **API**
2. Copia las siguientes credenciales:
   - **Project URL**: `https://tu-proyecto.supabase.co`
   - **anon public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### 3. **Ejecutar migración de base de datos**

1. Ve a **SQL Editor** en el dashboard de Supabase
2. Copia y pega el contenido del archivo `fixed_supabase_migration.sql`
3. Haz clic en **"Run"** para ejecutar la migración

### 4. **Configurar Row Level Security (RLS)**

La migración ya incluye las políticas RLS, pero puedes verificar en:
- **Authentication** > **Policies**
- **Table Editor** > Selecciona una tabla > **RLS**

### 5. **Actualizar variables de entorno**

Edita tu archivo `.env.local`:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key_aqui
```

### 6. **Configurar autenticación**

1. Ve a **Authentication** > **Settings**
2. En **Site URL**, agrega:
   - `http://localhost:3000` (desarrollo)
   - `https://tu-dominio.com` (producción)
3. En **Redirect URLs**, agrega:
   - `http://localhost:3000/auth/callback` (desarrollo)
   - `https://tu-dominio.com/auth/callback` (producción)

### 7. **Configurar providers de autenticación**

1. Ve a **Authentication** > **Providers**
2. Habilita **Google** y configura:
   - **Client ID**: Tu Google Client ID
   - **Client Secret**: Tu Google Client Secret
3. Habilita **GitHub** si lo deseas
4. Guarda los cambios

### 8. **Reiniciar el servidor**

```bash
npm run dev
```

## ✅ **Verificación**

1. Ve a `http://localhost:3000/auth/signin`
2. Inicia sesión con Google
3. Deberías ser redirigido al dashboard
4. Los datos ahora se guardan en Supabase real

## 🔧 **Solución de problemas**

### Error: "Invalid API key"
- Verifica que la URL y la clave anon estén correctas
- Asegúrate de que no haya espacios extra en `.env.local`

### Error: "RLS policy violation"
- Verifica que las políticas RLS estén configuradas correctamente
- Asegúrate de que el usuario esté autenticado

### Error: "Database connection failed"
- Verifica que el proyecto de Supabase esté activo
- Revisa que la URL del proyecto sea correcta

## 🚀 **Para producción**

1. Cambia las URLs en Supabase a tu dominio de producción
2. Considera usar un proyecto separado para producción
3. Configura backups automáticos
4. Monitorea el uso de la base de datos

## 📊 **Estructura de la base de datos**

La migración crea las siguientes tablas:

- **users**: Información de usuarios
- **workflows**: Workflows de los usuarios
- **workflow_runs**: Ejecuciones de workflows
- **notifications**: Notificaciones del sistema
- **analytics**: Métricas y estadísticas
- **workspaces**: Espacios de trabajo
- **user_workspaces**: Relación usuario-workspace

¡Listo! 🎉 Ahora tienes una base de datos real funcionando.
