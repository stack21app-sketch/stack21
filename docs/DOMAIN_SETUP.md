# Configuración de Dominio Personalizado - Stack21

## 🌐 Guía Completa para Configurar Dominio

### **Paso 1: Preparación**

1. **Registra tu dominio** en un proveedor (recomendado: Cloudflare, Namecheap, GoDaddy)
2. **Ejecuta el script de configuración:**
   ```bash
   npm run setup:domain
   ```

### **Paso 2: Configuración DNS**

Después de ejecutar el script, tendrás un archivo `dns-records.json` con los registros necesarios:

#### **Registros DNS Requeridos:**

| Tipo | Nombre | Valor | TTL |
|------|--------|-------|-----|
| A | @ (o subdominio) | 76.76.19.61 | 300 |
| CNAME | www | tu-dominio.com | 300 |
| TXT | @ | v=spf1 include:_spf.vercel.com ~all | 300 |
| CNAME | _vercel | cname.vercel-dns.com | 300 |

#### **Configuración por Proveedor:**

**Cloudflare:**
1. Ve a DNS > Records
2. Agrega los registros de la tabla
3. Asegúrate de que el proxy esté desactivado (nube gris)

**Namecheap:**
1. Ve a Domain List > Manage > Advanced DNS
2. Agrega los registros de la tabla
3. Guarda los cambios

**GoDaddy:**
1. Ve a My Products > DNS
2. Agrega los registros de la tabla
3. Guarda los cambios

### **Paso 3: Deploy con Dominio**

```bash
# Deploy automático con dominio
npm run deploy:domain

# O manualmente
vercel --prod
vercel domains add tu-dominio.com
```

### **Paso 4: Configuración en Vercel**

1. **Ve a Vercel Dashboard** → Tu Proyecto → Settings → Domains
2. **Agrega tu dominio** personalizado
3. **Configura las variables de entorno:**
   - `CUSTOM_DOMAIN=tu-dominio.com`
   - `NEXTAUTH_URL=https://tu-dominio.com`

### **Paso 5: Verificación**

```bash
# Verificar DNS
nslookup tu-dominio.com

# Verificar SSL
curl -I https://tu-dominio.com

# Verificar headers de seguridad
curl -I https://tu-dominio.com | grep -i "x-frame-options"
```

## 🔧 Configuración Avanzada

### **Subdominios**

Para configurar subdominios (ej: app.tu-dominio.com):

```bash
npm run setup:domain
# Cuando pregunte por subdominio, escribe: app
```

### **CDN y Performance**

El script configura automáticamente:
- ✅ CDN de Vercel
- ✅ SSL automático
- ✅ Headers de seguridad
- ✅ Compresión gzip
- ✅ Cache optimizado

### **Monitoreo de Dominio**

```bash
# Verificar estado del dominio
curl -s https://tu-dominio.com/api/status | jq

# Verificar métricas
curl -s https://tu-dominio.com/api/analytics | jq
```

## 🚨 Troubleshooting

### **Problema: Dominio no resuelve**
```bash
# Verificar DNS
dig tu-dominio.com
nslookup tu-dominio.com

# Esperar propagación (5-10 minutos)
```

### **Problema: SSL no funciona**
1. Verifica que el dominio esté en Vercel
2. Espera 5-10 minutos para SSL automático
3. Verifica con: `curl -I https://tu-dominio.com`

### **Problema: Headers de seguridad faltantes**
1. Verifica que `CUSTOM_DOMAIN` esté configurado
2. Revisa el middleware en `src/middleware.ts`
3. Hacer redeploy: `vercel --prod`

## 📊 Métricas de Dominio

### **Performance**
- **TTFB**: < 200ms
- **LCP**: < 2.5s
- **CLS**: < 0.1
- **FID**: < 100ms

### **Seguridad**
- ✅ SSL/TLS 1.3
- ✅ HSTS habilitado
- ✅ CSP configurado
- ✅ X-Frame-Options: DENY

## 🎯 Próximos Pasos

1. **Configurar Google Analytics** con el nuevo dominio
2. **Actualizar OAuth redirects** en Google/GitHub
3. **Configurar email** con el nuevo dominio
4. **Monitorear métricas** de performance

## 📞 Soporte

Si tienes problemas:
1. Revisa los logs: `vercel logs`
2. Verifica DNS: `dig tu-dominio.com`
3. Contacta soporte: support@stack21.com

---

**¡Tu dominio personalizado está listo! 🚀**
