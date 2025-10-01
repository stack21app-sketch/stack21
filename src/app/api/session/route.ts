import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET || 'fallback-secret');

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value;
    
    if (!token) {
      return NextResponse.json({ user: null });
    }

    const { payload } = await jwtVerify(token, secret);
    
    return NextResponse.json({ 
      user: {
        id: payload.sub,
        email: payload.email,
        name: payload.name
      }
    });
  } catch (error) {
    console.error('Error verificando sesión:', error);
    return NextResponse.json({ user: null });
  }
}
