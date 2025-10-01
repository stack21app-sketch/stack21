import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

// Configuración de base de datos
const { PrismaClient } = require('@prisma/client')

let prisma: any = null
let useDatabase = false

try {
  prisma = new PrismaClient()
  useDatabase = true
  console.log('✅ Prisma Client inicializado para miembros')
} catch (error) {
  console.log('⚠️ Error inicializando Prisma para miembros:', error)
  useDatabase = false
}

// Simulación de base de datos en memoria (fallback)
const workspaceMembers: any[] = []

export async function GET(request: NextRequest) {
  try {
    const token = await getToken({ req: request })
    
    if (!token || !token.sub) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const workspaceId = searchParams.get('workspaceId')

    if (!workspaceId) {
      return NextResponse.json(
        { error: 'workspaceId es requerido' },
        { status: 400 }
      )
    }

    let members: any[]

    if (useDatabase && prisma) {
      // Verificar que el usuario pertenece al workspace
      const userMember = await prisma.workspaceMember.findFirst({
        where: { 
          workspaceId, 
          userId: token.sub 
        }
      })

      if (!userMember) {
        return NextResponse.json(
          { error: 'No tienes acceso a este workspace' },
          { status: 403 }
        )
      }

      members = await prisma.workspaceMember.findMany({
        where: { workspaceId },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true
            }
          }
        },
        orderBy: { createdAt: 'asc' }
      })
    } else {
      // Usar simulación
      members = workspaceMembers
        .filter(m => m.workspaceId === workspaceId)
        .map(member => ({
          ...member,
          user: {
            id: member.userId,
            name: `Usuario ${member.userId}`,
            email: `user${member.userId}@example.com`,
            image: null
          }
        }))
    }

    return NextResponse.json(members)
  } catch (error) {
    console.error('Error al obtener miembros:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = await getToken({ req: request })
    
    if (!token || !token.sub) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { workspaceId, email, role = 'MEMBER' } = await request.json()

    if (!workspaceId || !email) {
      return NextResponse.json(
        { error: 'workspaceId y email son requeridos' },
        { status: 400 }
      )
    }

    // Verificar permisos (solo OWNER y ADMIN pueden invitar)
    if (useDatabase && prisma) {
      const userMember = await prisma.workspaceMember.findFirst({
        where: { 
          workspaceId, 
          userId: token.sub,
          role: { in: ['OWNER', 'ADMIN'] }
        }
      })

      if (!userMember) {
        return NextResponse.json(
          { error: 'No tienes permisos para invitar miembros' },
          { status: 403 }
        )
      }

      // Buscar usuario por email
      const user = await prisma.user.findUnique({
        where: { email }
      })

      if (!user) {
        return NextResponse.json(
          { error: 'Usuario no encontrado' },
          { status: 404 }
        )
      }

      // Verificar si ya es miembro
      const existingMember = await prisma.workspaceMember.findFirst({
        where: { workspaceId, userId: user.id }
      })

      if (existingMember) {
        return NextResponse.json(
          { error: 'El usuario ya es miembro de este workspace' },
          { status: 400 }
        )
      }

      // Crear miembro
      const member = await prisma.workspaceMember.create({
        data: {
          workspaceId,
          userId: user.id,
          role
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true
            }
          }
        }
      })

      return NextResponse.json(member)
    } else {
      // Usar simulación
      const member = {
        id: `member_${Date.now()}`,
        workspaceId,
        userId: `user_${Date.now()}`,
        role,
        createdAt: new Date().toISOString(),
        user: {
          id: `user_${Date.now()}`,
          name: email.split('@')[0],
          email,
          image: null
        }
      }

      workspaceMembers.push(member)
      return NextResponse.json(member)
    }
  } catch (error) {
    console.error('Error al invitar miembro:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const token = await getToken({ req: request })
    
    if (!token || !token.sub) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { memberId, role } = await request.json()

    if (!memberId || !role) {
      return NextResponse.json(
        { error: 'memberId y role son requeridos' },
        { status: 400 }
      )
    }

    if (useDatabase && prisma) {
      // Verificar permisos (solo OWNER y ADMIN pueden cambiar roles)
      const userMember = await prisma.workspaceMember.findFirst({
        where: { 
          userId: token.sub,
          role: { in: ['OWNER', 'ADMIN'] }
        }
      })

      if (!userMember) {
        return NextResponse.json(
          { error: 'No tienes permisos para cambiar roles' },
          { status: 403 }
        )
      }

      // No permitir cambiar el rol del OWNER
      const targetMember = await prisma.workspaceMember.findUnique({
        where: { id: memberId }
      })

      if (targetMember?.role === 'OWNER') {
        return NextResponse.json(
          { error: 'No se puede cambiar el rol del propietario' },
          { status: 400 }
        )
      }

      const updatedMember = await prisma.workspaceMember.update({
        where: { id: memberId },
        data: { role },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true
            }
          }
        }
      })

      return NextResponse.json(updatedMember)
    } else {
      // Usar simulación
      const memberIndex = workspaceMembers.findIndex(m => m.id === memberId)
      if (memberIndex === -1) {
        return NextResponse.json(
          { error: 'Miembro no encontrado' },
          { status: 404 }
        )
      }

      workspaceMembers[memberIndex].role = role
      return NextResponse.json(workspaceMembers[memberIndex])
    }
  } catch (error) {
    console.error('Error al actualizar miembro:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const token = await getToken({ req: request })
    
    if (!token || !token.sub) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const memberId = searchParams.get('memberId')

    if (!memberId) {
      return NextResponse.json(
        { error: 'memberId es requerido' },
        { status: 400 }
      )
    }

    if (useDatabase && prisma) {
      // Verificar permisos
      const userMember = await prisma.workspaceMember.findFirst({
        where: { 
          userId: token.sub,
          role: { in: ['OWNER', 'ADMIN'] }
        }
      })

      if (!userMember) {
        return NextResponse.json(
          { error: 'No tienes permisos para eliminar miembros' },
          { status: 403 }
        )
      }

      // No permitir eliminar al OWNER
      const targetMember = await prisma.workspaceMember.findUnique({
        where: { id: memberId }
      })

      if (targetMember?.role === 'OWNER') {
        return NextResponse.json(
          { error: 'No se puede eliminar al propietario' },
          { status: 400 }
        )
      }

      await prisma.workspaceMember.delete({
        where: { id: memberId }
      })

      return NextResponse.json({ success: true })
    } else {
      // Usar simulación
      const memberIndex = workspaceMembers.findIndex(m => m.id === memberId)
      if (memberIndex === -1) {
        return NextResponse.json(
          { error: 'Miembro no encontrado' },
          { status: 404 }
        )
      }

      workspaceMembers.splice(memberIndex, 1)
      return NextResponse.json({ success: true })
    }
  } catch (error) {
    console.error('Error al eliminar miembro:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
