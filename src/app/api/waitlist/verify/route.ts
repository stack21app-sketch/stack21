import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')
    
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Token de verificación requerido' },
        { status: 400 }
      )
    }
    
    // Buscar usuario por token de verificación
    const user = await prisma.waitlistUser.findUnique({
      where: { verificationToken: token }
    })
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Token de verificación inválido o expirado' },
        { status: 404 }
      )
    }
    
    // Verificar si ya está verificado
    if (user.isVerified) {
      return NextResponse.json(
        { 
          success: true, 
          message: 'Email ya verificado',
          user: {
            email: user.email,
            name: user.name,
            company: user.company,
            tier: user.tier
          }
        }
      )
    }
    
    // Marcar como verificado
    const updatedUser = await prisma.waitlistUser.update({
      where: { id: user.id },
      data: { 
        isVerified: true,
        verificationToken: null // Limpiar el token
      }
    })
    
    // Log para analytics
    console.log(`Email verificado: ${user.email} (Tier: ${user.tier})`)
    
    return NextResponse.json({
      success: true,
      message: 'Email verificado exitosamente',
      user: {
        email: updatedUser.email,
        name: updatedUser.name,
        company: updatedUser.company,
        tier: updatedUser.tier
      }
    })
    
  } catch (error) {
    console.error('Error verificando email:', error)
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
