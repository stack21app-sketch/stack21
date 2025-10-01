import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export function middleware(request: NextRequest) {
  // Log para debugging
  console.log('🔍 Middleware:', request.nextUrl.pathname)
  
  // Verificar si es el dominio de producción
  const hostname = request.headers.get('host') || ''
  const isProduction = hostname === 'stack21app.com' || hostname === 'www.stack21app.com'
  
  // Si es producción y no es la página coming-soon, redirigir
  if (isProduction && request.nextUrl.pathname !== '/coming-soon') {
    return NextResponse.redirect(new URL('/coming-soon', request.url))
  }
  
  // Para desarrollo local, permitir acceso a todas las rutas
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
