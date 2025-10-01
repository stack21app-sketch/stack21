import { NextRequest, NextResponse } from 'next/server';
import { SignJWT } from 'jose';

const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET || 'fallback-secret');

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('🔍 Login request body:', body);
    
    const { email, password } = body;
    console.log('🔍 Email:', email, 'Password:', password);
    
    // Verificar credenciales demo
    if (email === 'demo@stack21.com' && password === 'demo123') {
      console.log('✅ Credenciales válidas, creando token...');
      
      // Crear JWT token
      const token = await new SignJWT({ 
        sub: 'demo-user',
        email: 'demo@stack21.com',
        name: 'Usuario Demo'
      })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('24h')
        .sign(secret);

      console.log('✅ Token creado:', token.substring(0, 50) + '...');

      // Crear cookie de sesión
      const response = NextResponse.json({ 
        success: true, 
        user: { 
          id: 'demo-user', 
          email: 'demo@stack21.com', 
          name: 'Usuario Demo' 
        } 
      });

      response.cookies.set('auth-token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24, // 24 horas
      });

      console.log('✅ Respuesta creada');
      return response;
    }

    console.log('❌ Credenciales inválidas');
    return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 });
  } catch (error) {
    console.error('❌ Error en login:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
