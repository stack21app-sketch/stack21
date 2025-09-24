import { PrismaClient } from '@prisma/client'

// Singleton pattern para Prisma Client
let prisma: PrismaClient | null = null

export function getPrismaClient(): PrismaClient {
  if (!prisma) {
    prisma = new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
      errorFormat: 'pretty',
    })
  }
  return prisma
}

// Función para verificar la conexión a la base de datos
export async function checkDatabaseConnection(): Promise<{ connected: boolean; error?: string }> {
  try {
    const client = getPrismaClient()
    await client.$connect()
    await client.$queryRaw`SELECT 1`
    return { connected: true }
  } catch (error) {
    console.error('❌ Error de conexión a la base de datos:', error)
    return { 
      connected: false, 
      error: error instanceof Error ? error.message : 'Error desconocido'
    }
  }
}

// Función para ejecutar operaciones de base de datos con manejo de errores
export async function executeDatabaseOperation<T>(
  operation: (client: PrismaClient) => Promise<T>,
  operationName: string
): Promise<{ success: boolean; data?: T; error?: string }> {
  try {
    const client = getPrismaClient()
    const result = await operation(client)
    console.log(`✅ ${operationName}: Operación exitosa`)
    return { success: true, data: result }
  } catch (error) {
    console.error(`❌ ${operationName}: Error en operación de base de datos:`, error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Error desconocido en base de datos'
    }
  }
}

// Operaciones específicas para User
export const userOperations = {
  async create(userData: {
    email: string
    name: string
    image?: string
  }) {
    return executeDatabaseOperation(
      async (client) => {
        return await client.user.create({
          data: {
            email: userData.email,
            name: userData.name,
            image: userData.image,
            emailVerified: null,
            createdAt: new Date(),
            updatedAt: new Date(),
          }
        })
      },
      'Crear Usuario'
    )
  },

  async findById(id: string) {
    return executeDatabaseOperation(
      async (client) => {
        return await client.user.findUnique({
          where: { id },
          include: {
            workspaces: {
              include: {
                workspace: true
              }
            }
          }
        })
      },
      'Buscar Usuario por ID'
    )
  },

  async findByEmail(email: string) {
    return executeDatabaseOperation(
      async (client) => {
        return await client.user.findUnique({
          where: { email },
          include: {
            workspaces: {
              include: {
                workspace: true
              }
            }
          }
        })
      },
      'Buscar Usuario por Email'
    )
  },

  async update(id: string, data: { name?: string; image?: string }) {
    return executeDatabaseOperation(
      async (client) => {
        return await client.user.update({
          where: { id },
          data: {
            ...data,
            updatedAt: new Date()
          }
        })
      },
      'Actualizar Usuario'
    )
  },

  async delete(id: string) {
    return executeDatabaseOperation(
      async (client) => {
        return await client.user.delete({
          where: { id }
        })
      },
      'Eliminar Usuario'
    )
  }
}

// Operaciones específicas para Workspace
export const workspaceOperations = {
  async create(workspaceData: {
    name: string
    slug: string
    description?: string
    creatorId: string
  }) {
    return executeDatabaseOperation(
      async (client) => {
        return await client.workspace.create({
          data: {
            name: workspaceData.name,
            slug: workspaceData.slug,
            description: workspaceData.description,
            creatorId: workspaceData.creatorId,
            createdAt: new Date(),
            updatedAt: new Date(),
          }
        })
      },
      'Crear Workspace'
    )
  },

  async findById(id: string) {
    return executeDatabaseOperation(
      async (client) => {
        return await client.workspace.findUnique({
          where: { id },
          include: {
            members: {
              include: {
                user: true
              }
            },
            projects: true
          }
        })
      },
      'Buscar Workspace por ID'
    )
  },

  async findBySlug(slug: string) {
    return executeDatabaseOperation(
      async (client) => {
        return await client.workspace.findUnique({
          where: { slug },
          include: {
            members: {
              include: {
                user: true
              }
            }
          }
        })
      },
      'Buscar Workspace por Slug'
    )
  },

  async findByUserId(userId: string) {
    return executeDatabaseOperation(
      async (client) => {
        return await client.workspaceMember.findMany({
          where: { userId },
          include: {
            workspace: true
          }
        })
      },
      'Buscar Workspaces por Usuario'
    )
  },

  async update(id: string, data: { name?: string; slug?: string; description?: string }) {
    return executeDatabaseOperation(
      async (client) => {
        return await client.workspace.update({
          where: { id },
          data: {
            ...data,
            updatedAt: new Date()
          }
        })
      },
      'Actualizar Workspace'
    )
  },

  async delete(id: string) {
    return executeDatabaseOperation(
      async (client) => {
        // Eliminar miembros primero
        await client.workspaceMember.deleteMany({
          where: { workspaceId: id }
        })
        
        // Eliminar workspace
        return await client.workspace.delete({
          where: { id }
        })
      },
      'Eliminar Workspace'
    )
  }
}

// Operaciones específicas para WorkspaceMember
export const workspaceMemberOperations = {
  async addMember(workspaceId: string, userId: string, role: 'OWNER' | 'ADMIN' | 'MEMBER' = 'MEMBER') {
    return executeDatabaseOperation(
      async (client) => {
        return await client.workspaceMember.create({
          data: {
            workspaceId,
            userId,
            role,
            createdAt: new Date()
          }
        })
      },
      'Agregar Miembro a Workspace'
    )
  },

  async removeMember(workspaceId: string, userId: string) {
    return executeDatabaseOperation(
      async (client) => {
        return await client.workspaceMember.deleteMany({
          where: {
            workspaceId,
            userId
          }
        })
      },
      'Remover Miembro de Workspace'
    )
  },

  async updateMemberRole(workspaceId: string, userId: string, role: 'OWNER' | 'ADMIN' | 'MEMBER') {
    return executeDatabaseOperation(
      async (client) => {
        return await client.workspaceMember.updateMany({
          where: {
            workspaceId,
            userId
          },
          data: { role }
        })
      },
      'Actualizar Rol de Miembro'
    )
  },

  async getMembers(workspaceId: string) {
    return executeDatabaseOperation(
      async (client) => {
        return await client.workspaceMember.findMany({
          where: { workspaceId },
          include: {
            user: true
          }
        })
      },
      'Obtener Miembros de Workspace'
    )
  }
}

// Función para cerrar la conexión (útil para testing)
export async function closeDatabaseConnection(): Promise<void> {
  if (prisma) {
    await prisma.$disconnect()
    prisma = null
  }
}

// Función para limpiar datos de prueba
export async function cleanupTestData(): Promise<void> {
  try {
    const client = getPrismaClient()
    
    // Eliminar datos de prueba en orden correcto (respetando foreign keys)
    await client.workspaceMember.deleteMany({
      where: {
        user: {
          email: {
            contains: 'test'
          }
        }
      }
    })
    
    await client.workspace.deleteMany({
      where: {
        name: {
          contains: 'Test'
        }
      }
    })
    
    await client.user.deleteMany({
      where: {
        email: {
          contains: 'test'
        }
      }
    })
    
    console.log('✅ Datos de prueba limpiados')
  } catch (error) {
    console.error('❌ Error limpiando datos de prueba:', error)
  }
}

export default getPrismaClient
