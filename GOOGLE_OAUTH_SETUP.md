# 🔐 Configuración de Google OAuth para Stack21

## 📋 Pasos para configurar Google OAuth

### 1. **Crear proyecto en Google Cloud Console**

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Nombra tu proyecto: `Stack21` (o el nombre que prefieras)

### 2. **Habilitar Google+ API**

1. En el menú lateral, ve a **APIs & Services** > **Library**
2. Busca "Google+ API" o "Google Identity"
3. Haz clic en **Enable**

### 3. **Crear credenciales OAuth 2.0**

1. Ve a **APIs & Services** > **Credentials**
2. Haz clic en **+ CREATE CREDENTIALS** > **OAuth client ID**
3. Si es la primera vez, configura la pantalla de consentimiento:
   - **User Type**: External
   - **App name**: Stack21
   - **User support email**: tu-email@ejemplo.com
   - **Developer contact**: tu-email@ejemplo.com
   - Guarda y continúa

### 4. **Configurar OAuth client**

1. **Application type**: Web application
2. **Name**: Stack21 Web Client
3. **Authorized JavaScript origins**:
   - `http://localhost:3000` (desarrollo)
   - `https://tu-dominio.com` (producción)
4. **Authorized redirect URIs**:
   - `http://localhost:3000/api/auth/callback/google` (desarrollo)
   - `https://tu-dominio.com/api/auth/callback/google` (producción)
5. Haz clic en **Create**

### 5. **Obtener credenciales**

Después de crear, verás:
- **Client ID**: `123456789-abcdefg.apps.googleusercontent.com`
- **Client Secret**: `GOCSPX-abcdefghijklmnop`

### 6. **Actualizar variables de entorno**

Edita tu archivo `.env.local`:

```env
# Google OAuth
GOOGLE_CLIENT_ID=tu_client_id_aqui
GOOGLE_CLIENT_SECRET=tu_client_secret_aqui

# NextAuth
NEXTAUTH_SECRET=tu_secret_generado
NEXTAUTH_URL=http://localhost:3000
```

### 7. **Generar NEXTAUTH_SECRET**

Ejecuta este comando para generar un secret seguro:

```bash
openssl rand -base64 32
```

### 8. **Reiniciar el servidor**

```bash
npm run dev
```

## ✅ **Verificación**

1. Ve a `http://localhost:3000/auth/signin`
2. Deberías ver el botón "Continuar con Google"
3. Haz clic y deberías ser redirigido a Google
4. Después de autorizar, regresarás al dashboard

## 🔧 **Solución de problemas**

### Error: "redirect_uri_mismatch"
- Verifica que las URIs de redirección en Google Console coincidan exactamente
- Asegúrate de incluir `http://localhost:3000/api/auth/callback/google`

### Error: "invalid_client"
- Verifica que el Client ID y Secret estén correctos
- Asegúrate de que no haya espacios extra en el archivo `.env.local`

### Error: "access_denied"
- Verifica que la pantalla de consentimiento esté configurada
- Asegúrate de que el dominio esté autorizado

## 🚀 **Para producción**

1. Cambia las URIs de redirección a tu dominio de producción
2. Actualiza `NEXTAUTH_URL` a tu dominio
3. Considera usar un dominio personalizado para la pantalla de consentimiento

¡Listo! 🎉 Ahora los usuarios pueden registrarse con Google.