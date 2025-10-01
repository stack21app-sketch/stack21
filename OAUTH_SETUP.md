# 🔐 **Configuración de OAuth para Stack21**

## 📋 **Estado Actual**

**✅ Funcionando:**
- Credenciales demo (`demo@stack21.com` / `demo123`)
- Sistema de autenticación completo
- Dashboard protegido

**⚠️ No configurado:**
- Google OAuth
- GitHub OAuth

---

## 🚀 **Configuración Rápida**

### **1. Google OAuth**

#### **Paso 1: Crear proyecto en Google Cloud Console**
1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Habilita la API de Google+ (si es necesario)

#### **Paso 2: Configurar OAuth**
1. Ve a **APIs y servicios > Credenciales**
2. Haz clic en **+ CREAR CREDENCIALES > ID de cliente de OAuth**
3. Selecciona **Aplicación web**
4. Configura:
   - **Nombre:** `Stack21 OAuth`
   - **Orígenes de JavaScript autorizados:**
     - `http://localhost:3000`
     - `https://tu-dominio.com` (para producción)
   - **URI de redireccionamiento autorizados:**
     - `http://localhost:3000/api/auth/callback/google`
     - `https://tu-dominio.com/api/auth/callback/google`

#### **Paso 3: Obtener credenciales**
1. Copia el **ID de cliente** y **Secreto de cliente**
2. Agrégalos a tu archivo `.env.local`:

```env
GOOGLE_CLIENT_ID=tu_google_client_id_aqui
GOOGLE_CLIENT_SECRET=tu_google_client_secret_aqui
```

---

### **2. GitHub OAuth**

#### **Paso 1: Crear OAuth App en GitHub**
1. Ve a [GitHub Settings > Developer settings > OAuth Apps](https://github.com/settings/applications/new)
2. Haz clic en **New OAuth App**

#### **Paso 2: Configurar la aplicación**
- **Application name:** `Stack21`
- **Homepage URL:** `http://localhost:3000`
- **Authorization callback URL:** `http://localhost:3000/api/auth/callback/github`

#### **Paso 3: Obtener credenciales**
1. Copia el **Client ID** y **Client Secret**
2. Agrégalos a tu archivo `.env.local`:

```env
GITHUB_CLIENT_ID=tu_github_client_id_aqui
GITHUB_CLIENT_SECRET=tu_github_client_secret_aqui
```

---

## 🔧 **Configuración del Archivo .env.local**

```env
# NextAuth.js
NEXTAUTH_SECRET=tu_nextauth_secret_aqui
NEXTAUTH_URL=http://localhost:3000

# Google OAuth
GOOGLE_CLIENT_ID=tu_google_client_id_aqui
GOOGLE_CLIENT_SECRET=tu_google_client_secret_aqui

# GitHub OAuth
GITHUB_CLIENT_ID=tu_github_client_id_aqui
GITHUB_CLIENT_SECRET=tu_github_client_secret_aqui

# Supabase (opcional - funciona sin esto)
NEXT_PUBLIC_SUPABASE_URL=https://placeholder.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=placeholder-key
```

---

## ✅ **Verificación**

### **1. Reiniciar el servidor**
```bash
npm run dev
```

### **2. Verificar configuración**
```bash
node setup-oauth.js
```

### **3. Probar login**
1. Ve a `http://localhost:3000/auth/signin`
2. Deberías ver los botones de Google y GitHub habilitados
3. Prueba el login con cada provider

---

## 🎯 **Comportamiento Actual**

### **Sin OAuth configurado:**
- ✅ Solo aparece el formulario de credenciales demo
- ✅ Botones de OAuth deshabilitados con mensaje informativo
- ✅ Login funciona perfectamente con `demo@stack21.com` / `demo123`

### **Con OAuth configurado:**
- ✅ Botones de Google y GitHub habilitados
- ✅ Login social funciona
- ✅ Redirección automática al dashboard

---

## 🚨 **Solución de Problemas**

### **Error: "OAuth provider not configured"**
- Verifica que las variables de entorno estén configuradas
- Reinicia el servidor después de cambiar `.env.local`

### **Error: "Invalid client"**
- Verifica que las credenciales sean correctas
- Asegúrate de que las URLs de redirección coincidan exactamente

### **Error: "Redirect URI mismatch"**
- Verifica que las URLs en Google/GitHub coincidan con las de tu `.env.local`
- Incluye tanto `http://localhost:3000` como tu dominio de producción

---

## 🎉 **¡Listo!**

Una vez configurado, Stack21 tendrá:
- ✅ **Login con Google** - Rápido y seguro
- ✅ **Login con GitHub** - Para desarrolladores
- ✅ **Credenciales demo** - Para pruebas
- ✅ **Dashboard completo** - Con todas las funcionalidades

**¡Stack21 está listo para producción!** 🚀✨
