# Configuración de Analytics para Stack21

## Google Analytics
1. Ve a https://analytics.google.com
2. Crea una nueva propiedad para "Stack21"
3. Copia el Measurement ID (formato: G-XXXXXXXXXX)
4. Agrégale a las variables de entorno

## Hotjar
1. Ve a https://www.hotjar.com
2. Crea una cuenta gratuita
3. Copia el Site ID (formato: número)
4. Agrégale a las variables de entorno

## Variables de entorno necesarias:
```
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_HOTJAR_ID=1234567
```
