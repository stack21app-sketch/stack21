# 🔐 Configuración Rápida de OAuth - Stack21

## 🚀 **Configuración en 5 minutos**

### **Opción 1: Configuración Automática (Recomendada)**

```bash
# Ejecutar el script de configuración
npm run setup:oauth
```

El script te guiará paso a paso para configurar Google y GitHub OAuth.

### **Opción 2: Configuración Manual**

#### **1. Google OAuth**

1. **Ve a Google Cloud Console**: https://console.cloud.google.com/
2. **Crea un proyecto** o selecciona uno existente
3. **Habilita Google+ API**:
   - Ve a "APIs & Services" > "Library"
   - Busca "Google+ API" y habilítala
4. **Crea credenciales OAuth 2.0**:
   - Ve a "APIs & Services" > "Credentials"
   - Haz clic en "Create Credentials" > "OAuth 2.0 Client IDs"
   - Selecciona "Web application"
5. **Configura las URLs**:
   - **Authorized JavaScript origins**: `http://localhost:3000`
   - **Authorized redirect URIs**: `http://localhost:3000/api/auth/callback/google`
6. **Copia las credenciales**:
   - Client ID
   - Client Secret

#### **2. GitHub OAuth**

1. **Ve a GitHub Settings**: https://github.com/settings/applications/new
2. **Crea nueva OAuth App**:
   - **Application name**: `Stack21`
   - **Homepage URL**: `http://localhost:3000`
   - **Authorization callback URL**: `http://localhost:3000/api/auth/callback/github`
3. **Copia las credenciales**:
   - Client ID
   - Client Secret

#### **3. Configurar archivo .env.local**

Crea o actualiza tu archivo `.env.local`:

```env
# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=tu-secreto-super-seguro-aqui

# OAuth Providers
GOOGLE_CLIENT_ID=tu_google_client_id_aqui
GOOGLE_CLIENT_SECRET=tu_google_client_secret_aqui
GITHUB_CLIENT_ID=tu_github_client_id_aqui
GITHUB_CLIENT_SECRET=tu_github_client_secret_aqui

# Base de datos
DATABASE_URL="postgresql://username:password@localhost:5432/saas_starter?schema=public"

# OpenAI (opcional)
OPENAI_API_KEY=sk-tu-openai-key-aqui
```

## ✅ **Verificar Configuración**

```bash
# Verificar si OAuth está configurado
npm run check:oauth
```

## 🚀 **Iniciar la Aplicación**

```bash
# Iniciar en modo desarrollo
npm run dev
```

## 🔐 **Credenciales Demo**

Si no quieres configurar OAuth ahora, puedes usar las credenciales demo:

- **Email**: `demo@stack21.com`
- **Password**: `demo123`

## 🎯 **URLs de Redirección**

### **Para Desarrollo (localhost)**
- Google: `http://localhost:3000/api/auth/callback/google`
- GitHub: `http://localhost:3000/api/auth/callback/github`

### **Para Producción**
- Google: `https://tu-dominio.com/api/auth/callback/google`
- GitHub: `https://tu-dominio.com/api/auth/callback/github`

## 🔧 **Troubleshooting**

### **Error: "OAuth client not found"**
- Verifica que el Client ID sea correcto
- Asegúrate de que la aplicación esté habilitada en Google Cloud Console

### **Error: "Invalid redirect URI"**
- Verifica que la URL de redirección coincida exactamente
- Incluye el protocolo (http/https) y el puerto

### **Error: "Access denied"**
- Verifica que el Client Secret sea correcto
- Asegúrate de que la aplicación esté configurada correctamente

### **OAuth no aparece en el login**
- Verifica que las variables de entorno estén configuradas
- Reinicia la aplicación después de cambiar .env.local
- Ejecuta `npm run check:oauth` para verificar

## 📚 **Recursos Adicionales**

- [Documentación de NextAuth.js](https://next-auth.js.org/)
- [Google OAuth 2.0](https://developers.google.com/identity/protocols/oauth2)
- [GitHub OAuth Apps](https://docs.github.com/en/developers/apps/building-oauth-apps)

## 🎉 **¡Listo!**

Una vez configurado, podrás:
- ✅ Iniciar sesión con Google
- ✅ Iniciar sesión con GitHub
- ✅ Usar todas las funcionalidades de Stack21
- ✅ Acceder al dashboard con control total por IA
