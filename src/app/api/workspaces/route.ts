import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

// Configuración de base de datos
const { PrismaClient } = require('@prisma/client')

let prisma: any = null
let useDatabase = false

// Función para inicializar la base de datos
async function initializeDatabase() {
  try {
    prisma = new PrismaClient()
    // Verificar la conexión
    await prisma.$connect()
    useDatabase = true
    console.log('✅ Base de datos conectada')
  } catch (error) {
    console.log('⚠️ Error conectando a la base de datos:', error)
    console.log('🔄 Usando simulación en memoria')
    useDatabase = false
  }
}

// Inicializar la base de datos
initializeDatabase()

// Simulación de base de datos en memoria (fallback)
const workspaces: any[] = []
const workspaceMembers: any[] = []

export async function POST(request: NextRequest) {
  try {
    const token = await getToken({ req: request })
    
    if (!token || !token.sub) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { name, slug, description } = await request.json()

    if (!name || !slug) {
      return NextResponse.json(
        { error: 'Nombre y slug son requeridos' },
        { status: 400 }
      )
    }

    let workspace: any

    if (useDatabase && prisma) {
      // Usar base de datos real
      const existingWorkspace = await prisma.workspace.findUnique({
        where: { slug },
      })

      if (existingWorkspace) {
        return NextResponse.json(
          { error: 'Este slug ya está en uso' },
          { status: 400 }
        )
      }

      workspace = await prisma.workspace.create({
        data: {
          name,
          slug,
          description,
          creatorId: token.sub,
        },
      })

      await prisma.workspaceMember.create({
        data: {
          workspaceId: workspace.id,
          userId: token.sub,
          role: 'OWNER',
        },
      })
    } else {
      // Usar simulación
      const existingWorkspace = workspaces.find(w => w.slug === slug)

      if (existingWorkspace) {
        return NextResponse.json(
          { error: 'Este slug ya está en uso' },
          { status: 400 }
        )
      }

      workspace = {
        id: `workspace_${Date.now()}`,
        name,
        slug,
        description,
        creatorId: token.sub,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      workspaces.push(workspace)

      const member = {
        id: `member_${Date.now()}`,
        workspaceId: workspace.id,
        userId: token.sub,
        role: 'OWNER',
        createdAt: new Date().toISOString(),
      }

      workspaceMembers.push(member)
    }

    console.log(`✅ Workspace creado: ${name} (${slug})`)
    return NextResponse.json(workspace)
  } catch (error) {
    console.error('Error al crear workspace:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const token = await getToken({ req: request })
    
    if (!token || !token.sub) {
      console.log('❌ GET /api/workspaces: No autorizado')
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    console.log(`📋 GET /api/workspaces: Obteniendo workspaces para usuario ${token.sub}`)

    let userWorkspaces: any[]

    if (useDatabase && prisma) {
      // Usar base de datos real
      userWorkspaces = await prisma.workspaceMember.findMany({
        where: { userId: token.sub },
        include: {
          workspace: true,
        },
      })
      console.log(`✅ Base de datos: ${userWorkspaces.length} workspaces encontrados`)
    } else {
      // Usar simulación
      const userMembers = workspaceMembers.filter(m => m.userId === token.sub)
      userWorkspaces = userMembers.map(member => {
        const workspace = workspaces.find(w => w.id === member.workspaceId)
        return {
          id: member.id,
          workspaceId: member.workspaceId,
          userId: member.userId,
          role: member.role,
          createdAt: member.createdAt,
          workspace: workspace
        }
      })
      console.log(`✅ Simulación: ${userWorkspaces.length} workspaces encontrados`)
    }

    return NextResponse.json({
      success: true,
      data: userWorkspaces,
      count: userWorkspaces.length
    })
  } catch (error) {
    console.error('❌ Error al obtener workspaces:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Error interno del servidor',
        details: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : 'Unknown error') : undefined
      },
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

    const { id, name, slug, description } = await request.json()

    if (!id || !name || !slug) {
      return NextResponse.json(
        { error: 'ID, nombre y slug son requeridos' },
        { status: 400 }
      )
    }

    let updatedWorkspace: any

    if (useDatabase && prisma) {
      // Verificar permisos
      const member = await prisma.workspaceMember.findFirst({
        where: { 
          workspaceId: id, 
          userId: token.sub,
          role: { in: ['OWNER', 'ADMIN'] }
        }
      })

      if (!member) {
        return NextResponse.json(
          { error: 'No tienes permisos para editar este workspace' },
          { status: 403 }
        )
      }

      // Verificar si el slug ya existe en otro workspace
      const existingWorkspace = await prisma.workspace.findFirst({
        where: { 
          slug,
          id: { not: id }
        }
      })

      if (existingWorkspace) {
        return NextResponse.json(
          { error: 'Este slug ya está en uso' },
          { status: 400 }
        )
      }

      updatedWorkspace = await prisma.workspace.update({
        where: { id },
        data: { name, slug, description }
      })
    } else {
      // Usar simulación
      const workspaceIndex = workspaces.findIndex(w => w.id === id)
      if (workspaceIndex === -1) {
        return NextResponse.json(
          { error: 'Workspace no encontrado' },
          { status: 404 }
        )
      }

      // Verificar permisos
      const member = workspaceMembers.find(m => 
        m.workspaceId === id && 
        m.userId === token.sub &&
        ['OWNER', 'ADMIN'].includes(m.role)
      )

      if (!member) {
        return NextResponse.json(
          { error: 'No tienes permisos para editar este workspace' },
          { status: 403 }
        )
      }

      // Verificar si el slug ya existe
      const existingWorkspace = workspaces.find(w => w.slug === slug && w.id !== id)
      if (existingWorkspace) {
        return NextResponse.json(
          { error: 'Este slug ya está en uso' },
          { status: 400 }
        )
      }

      workspaces[workspaceIndex] = {
        ...workspaces[workspaceIndex],
        name,
        slug,
        description,
        updatedAt: new Date().toISOString()
      }

      updatedWorkspace = workspaces[workspaceIndex]
    }

    console.log(`✅ Workspace actualizado: ${name} (${slug})`)
    return NextResponse.json(updatedWorkspace)
  } catch (error) {
    console.error('Error al actualizar workspace:', error)
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
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'ID del workspace es requerido' },
        { status: 400 }
      )
    }

    if (useDatabase && prisma) {
      // Verificar permisos (solo OWNER puede eliminar)
      const member = await prisma.workspaceMember.findFirst({
        where: { 
          workspaceId: id, 
          userId: token.sub,
          role: 'OWNER'
        }
      })

      if (!member) {
        return NextResponse.json(
          { error: 'Solo el propietario puede eliminar el workspace' },
          { status: 403 }
        )
      }

      // Eliminar workspace y todos sus datos relacionados
      await prisma.workspaceMember.deleteMany({
        where: { workspaceId: id }
      })
      
      await prisma.workspace.delete({
        where: { id }
      })
    } else {
      // Usar simulación
      const workspaceIndex = workspaces.findIndex(w => w.id === id)
      if (workspaceIndex === -1) {
        return NextResponse.json(
          { error: 'Workspace no encontrado' },
          { status: 404 }
        )
      }

      // Verificar permisos
      const member = workspaceMembers.find(m => 
        m.workspaceId === id && 
        m.userId === token.sub &&
        m.role === 'OWNER'
      )

      if (!member) {
        return NextResponse.json(
          { error: 'Solo el propietario puede eliminar el workspace' },
          { status: 403 }
        )
      }

      // Eliminar workspace y miembros
      workspaces.splice(workspaceIndex, 1)
      const memberIndex = workspaceMembers.findIndex(m => m.workspaceId === id)
      if (memberIndex !== -1) {
        workspaceMembers.splice(memberIndex, 1)
      }
    }

    console.log(`✅ Workspace eliminado: ${id}`)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error al eliminar workspace:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
