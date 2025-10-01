import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

// Configuración de base de datos
const { PrismaClient } = require('@prisma/client')

let prisma: any = null
let useDatabase = false

try {
  prisma = new PrismaClient()
  useDatabase = true
  console.log('✅ Prisma Client inicializado para soporte')
} catch (error) {
  console.log('⚠️ Error inicializando Prisma para soporte:', error)
  useDatabase = false
}

// Simulación de tickets de soporte
const mockTickets: any[] = [
  {
    id: 'ticket_1',
    title: 'Error al crear workspace',
    description: 'No puedo crear un nuevo workspace, aparece un error 500',
    status: 'OPEN',
    priority: 'HIGH',
    category: 'BUG',
    userId: 'user_1',
    workspaceId: 'workspace_1',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    messages: [
      {
        id: 'msg_1',
        content: 'Hola, tengo un problema al crear un workspace. Cuando hago clic en "Crear Workspace" aparece un error 500.',
        sender: 'USER',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'msg_2',
        content: 'Hola! Gracias por contactarnos. Estamos investigando el problema. ¿Podrías enviarnos una captura de pantalla del error?',
        sender: 'SUPPORT',
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
      }
    ]
  },
  {
    id: 'ticket_2',
    title: 'Pregunta sobre integraciones',
    description: '¿Cómo puedo conectar mi workspace con Slack?',
    status: 'RESOLVED',
    priority: 'MEDIUM',
    category: 'QUESTION',
    userId: 'user_1',
    workspaceId: 'workspace_1',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    messages: [
      {
        id: 'msg_3',
        content: 'Hola, me gustaría saber cómo conectar mi workspace con Slack para recibir notificaciones.',
        sender: 'USER',
        timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'msg_4',
        content: '¡Por supuesto! Te explico el proceso paso a paso:\n\n1. Ve a Configuración > Integraciones\n2. Busca Slack y haz clic en "Conectar"\n3. Sigue las instrucciones para configurar el webhook\n\n¿Te ayudo con algún paso específico?',
        sender: 'SUPPORT',
        timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'msg_5',
        content: '¡Perfecto! Ya lo configuré y funciona correctamente. Muchas gracias.',
        sender: 'USER',
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
      }
    ]
  }
]

export async function GET(request: NextRequest) {
  try {
    const token = await getToken({ req: request })
    
    if (!token || !token.sub) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'tickets'
    const ticketId = searchParams.get('ticketId')

    switch (type) {
      case 'tickets':
        let tickets: any[]

        if (useDatabase && prisma) {
          tickets = await prisma.supportTicket.findMany({
            where: { userId: token.sub },
            orderBy: { updatedAt: 'desc' },
            include: {
              workspace: true,
              messages: {
                orderBy: { timestamp: 'asc' }
              }
            }
          })
        } else {
          // Usar simulación
          tickets = mockTickets.filter(ticket => ticket.userId === token.sub)
        }

        return NextResponse.json(tickets)

      case 'ticket':
        if (!ticketId) {
          return NextResponse.json(
            { error: 'ticketId es requerido' },
            { status: 400 }
          )
        }

        let ticket: any

        if (useDatabase && prisma) {
          ticket = await prisma.supportTicket.findFirst({
            where: { 
              id: ticketId,
              userId: token.sub 
            },
            include: {
              workspace: true,
              messages: {
                orderBy: { timestamp: 'asc' }
              }
            }
          })
        } else {
          // Usar simulación
          ticket = mockTickets.find(t => t.id === ticketId && t.userId === token.sub)
        }

        if (!ticket) {
          return NextResponse.json(
            { error: 'Ticket no encontrado' },
            { status: 404 }
          )
        }

        return NextResponse.json(ticket)

      case 'stats':
        let stats: any

        if (useDatabase && prisma) {
          const [total, open, resolved, inProgress] = await Promise.all([
            prisma.supportTicket.count({ where: { userId: token.sub } }),
            prisma.supportTicket.count({ where: { userId: token.sub, status: 'OPEN' } }),
            prisma.supportTicket.count({ where: { userId: token.sub, status: 'RESOLVED' } }),
            prisma.supportTicket.count({ where: { userId: token.sub, status: 'IN_PROGRESS' } })
          ])

          stats = { total, open, resolved, inProgress }
        } else {
          // Simulación
          const userTickets = mockTickets.filter(t => t.userId === token.sub)
          stats = {
            total: userTickets.length,
            open: userTickets.filter(t => t.status === 'OPEN').length,
            resolved: userTickets.filter(t => t.status === 'RESOLVED').length,
            inProgress: userTickets.filter(t => t.status === 'IN_PROGRESS').length
          }
        }

        return NextResponse.json(stats)

      default:
        return NextResponse.json({ error: 'Tipo no válido' }, { status: 400 })
    }
  } catch (error) {
    console.error('Error en support API:', error)
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

    const { action, title, description, category, priority, ticketId, message, status } = await request.json()

    if (!action) {
      return NextResponse.json(
        { error: 'Acción es requerida' },
        { status: 400 }
      )
    }

    switch (action) {
      case 'create_ticket':
        if (!title || !description || !category) {
          return NextResponse.json(
            { error: 'Título, descripción y categoría son requeridos' },
            { status: 400 }
          )
        }

        let newTicket: any

        if (useDatabase && prisma) {
          newTicket = await prisma.supportTicket.create({
            data: {
              title,
              description,
              category,
              priority: priority || 'MEDIUM',
              status: 'OPEN',
              userId: token.sub,
              workspaceId: null, // Se puede asociar a un workspace específico
              messages: {
                create: {
                  content: description,
                  sender: 'USER',
                  timestamp: new Date()
                }
              }
            },
            include: {
              messages: true
            }
          })
        } else {
          // Simulación
          newTicket = {
            id: `ticket_${Date.now()}`,
            title,
            description,
            status: 'OPEN',
            priority: priority || 'MEDIUM',
            category,
            userId: token.sub,
            workspaceId: null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            messages: [
              {
                id: `msg_${Date.now()}`,
                content: description,
                sender: 'USER',
                timestamp: new Date().toISOString()
              }
            ]
          }
          mockTickets.push(newTicket)
        }

        return NextResponse.json(newTicket)

      case 'add_message':
        if (!ticketId || !message) {
          return NextResponse.json(
            { error: 'ticketId y message son requeridos' },
            { status: 400 }
          )
        }

        let updatedTicket: any

        if (useDatabase && prisma) {
          // Verificar que el ticket pertenece al usuario
          const ticket = await prisma.supportTicket.findFirst({
            where: { 
              id: ticketId,
              userId: token.sub 
            }
          })

          if (!ticket) {
            return NextResponse.json(
              { error: 'Ticket no encontrado' },
              { status: 404 }
            )
          }

          // Agregar mensaje
          await prisma.supportMessage.create({
            data: {
              ticketId,
              content: message,
              sender: 'USER',
              timestamp: new Date()
            }
          })

          // Actualizar timestamp del ticket
          updatedTicket = await prisma.supportTicket.update({
            where: { id: ticketId },
            data: { updatedAt: new Date() },
            include: {
              messages: {
                orderBy: { timestamp: 'asc' }
              }
            }
          })
        } else {
          // Simulación
          const ticketIndex = mockTickets.findIndex(t => t.id === ticketId && t.userId === token.sub)
          if (ticketIndex === -1) {
            return NextResponse.json(
              { error: 'Ticket no encontrado' },
              { status: 404 }
            )
          }

          const newMessage = {
            id: `msg_${Date.now()}`,
            content: message,
            sender: 'USER',
            timestamp: new Date().toISOString()
          }

          mockTickets[ticketIndex].messages.push(newMessage)
          mockTickets[ticketIndex].updatedAt = new Date().toISOString()
          updatedTicket = mockTickets[ticketIndex]
        }

        return NextResponse.json(updatedTicket)

      case 'update_status':
        if (!ticketId || !status) {
          return NextResponse.json(
            { error: 'ticketId y status son requeridos' },
            { status: 400 }
          )
        }

        if (useDatabase && prisma) {
          const ticket = await prisma.supportTicket.findFirst({
            where: { 
              id: ticketId,
              userId: token.sub 
            }
          })

          if (!ticket) {
            return NextResponse.json(
              { error: 'Ticket no encontrado' },
              { status: 404 }
            )
          }

          updatedTicket = await prisma.supportTicket.update({
            where: { id: ticketId },
            data: { 
              status,
              updatedAt: new Date()
            }
          })
        } else {
          // Simulación
          const ticketIndex = mockTickets.findIndex(t => t.id === ticketId && t.userId === token.sub)
          if (ticketIndex === -1) {
            return NextResponse.json(
              { error: 'Ticket no encontrado' },
              { status: 404 }
            )
          }

          mockTickets[ticketIndex].status = status
          mockTickets[ticketIndex].updatedAt = new Date().toISOString()
          updatedTicket = mockTickets[ticketIndex]
        }

        return NextResponse.json(updatedTicket)

      default:
        return NextResponse.json(
          { error: 'Acción no válida' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Error en support API:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
