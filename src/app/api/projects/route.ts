import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

// Configuración de base de datos
const { PrismaClient } = require('@prisma/client')

let prisma: any = null
let useDatabase = false

try {
  prisma = new PrismaClient()
  useDatabase = true
  console.log('✅ Prisma Client inicializado para proyectos')
} catch (error) {
  console.log('⚠️ Error inicializando Prisma para proyectos:', error)
  useDatabase = false
}

// Simulación de base de datos en memoria (fallback)
const projects: any[] = []

export async function POST(request: NextRequest) {
  try {
    const token = await getToken({ req: request })
    
    if (!token || !token.sub) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { name, description, workspaceId } = await request.json()

    if (!name || !workspaceId) {
      return NextResponse.json(
        { error: 'Nombre y workspaceId son requeridos' },
        { status: 400 }
      )
    }

    let project: any

    if (useDatabase && prisma) {
      // Verificar que el usuario pertenece al workspace
      const member = await prisma.workspaceMember.findFirst({
        where: { 
          workspaceId, 
          userId: token.sub 
        }
      })

      if (!member) {
        return NextResponse.json(
          { error: 'No tienes acceso a este workspace' },
          { status: 403 }
        )
      }

      project = await prisma.project.create({
        data: {
          name,
          description,
          workspaceId,
        },
      })
    } else {
      // Usar simulación
      project = {
        id: `project_${Date.now()}`,
        name,
        description,
        workspaceId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      projects.push(project)
    }

    console.log(`✅ Proyecto creado: ${name}`)
    return NextResponse.json(project)
  } catch (error) {
    console.error('Error al crear proyecto:', error)
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
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const workspaceId = searchParams.get('workspaceId')

    let userProjects: any[]

    if (useDatabase && prisma) {
      // Obtener proyectos del workspace
      const whereClause: any = {}
      if (workspaceId) {
        whereClause.workspaceId = workspaceId
      } else {
        // Obtener workspaces del usuario
        const userWorkspaces = await prisma.workspaceMember.findMany({
          where: { userId: token.sub },
          select: { workspaceId: true }
        })
        whereClause.workspaceId = { in: userWorkspaces.map((w: any) => w.workspaceId) }
      }

      userProjects = await prisma.project.findMany({
        where: whereClause,
        include: {
          workspace: true,
        },
        orderBy: { createdAt: 'desc' }
      })
    } else {
      // Usar simulación
      if (workspaceId) {
        userProjects = projects.filter(p => p.workspaceId === workspaceId)
      } else {
        userProjects = projects
      }
    }

    return NextResponse.json(userProjects)
  } catch (error) {
    console.error('Error al obtener proyectos:', error)
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

    const { id, name, description } = await request.json()

    if (!id || !name) {
      return NextResponse.json(
        { error: 'ID y nombre son requeridos' },
        { status: 400 }
      )
    }

    let updatedProject: any

    if (useDatabase && prisma) {
      // Verificar permisos
      const project = await prisma.project.findUnique({
        where: { id },
        include: {
          workspace: {
            include: {
              members: {
                where: { userId: token.sub }
              }
            }
          }
        }
      })

      if (!project) {
        return NextResponse.json(
          { error: 'Proyecto no encontrado' },
          { status: 404 }
        )
      }

      if (project.workspace.members.length === 0) {
        return NextResponse.json(
          { error: 'No tienes permisos para editar este proyecto' },
          { status: 403 }
        )
      }

      updatedProject = await prisma.project.update({
        where: { id },
        data: { name, description }
      })
    } else {
      // Usar simulación
      const projectIndex = projects.findIndex(p => p.id === id)
      if (projectIndex === -1) {
        return NextResponse.json(
          { error: 'Proyecto no encontrado' },
          { status: 404 }
        )
      }

      projects[projectIndex] = {
        ...projects[projectIndex],
        name,
        description,
        updatedAt: new Date().toISOString()
      }

      updatedProject = projects[projectIndex]
    }

    console.log(`✅ Proyecto actualizado: ${name}`)
    return NextResponse.json(updatedProject)
  } catch (error) {
    console.error('Error al actualizar proyecto:', error)
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
        { error: 'ID del proyecto es requerido' },
        { status: 400 }
      )
    }

    if (useDatabase && prisma) {
      // Verificar permisos
      const project = await prisma.project.findUnique({
        where: { id },
        include: {
          workspace: {
            include: {
              members: {
                where: { 
                  userId: token.sub,
                  role: { in: ['OWNER', 'ADMIN'] }
                }
              }
            }
          }
        }
      })

      if (!project) {
        return NextResponse.json(
          { error: 'Proyecto no encontrado' },
          { status: 404 }
        )
      }

      if (project.workspace.members.length === 0) {
        return NextResponse.json(
          { error: 'No tienes permisos para eliminar este proyecto' },
          { status: 403 }
        )
      }

      await prisma.project.delete({
        where: { id }
      })
    } else {
      // Usar simulación
      const projectIndex = projects.findIndex(p => p.id === id)
      if (projectIndex === -1) {
        return NextResponse.json(
          { error: 'Proyecto no encontrado' },
          { status: 404 }
        )
      }

      projects.splice(projectIndex, 1)
    }

    console.log(`✅ Proyecto eliminado: ${id}`)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error al eliminar proyecto:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
