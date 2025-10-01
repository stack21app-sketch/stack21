import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

// Configuración de base de datos
const { PrismaClient } = require('@prisma/client')

let prisma: any = null
let useDatabase = false

try {
  prisma = new PrismaClient()
  useDatabase = true
  console.log('✅ Prisma Client inicializado para auditoría')
} catch (error) {
  console.log('⚠️ Error inicializando Prisma para auditoría:', error)
  useDatabase = false
}

// Simulación de logs de auditoría
const mockAuditLogs = [
  {
    id: 'audit_1',
    userId: 'user_1',
    workspaceId: 'workspace_1',
    action: 'WORKSPACE_CREATED',
    resource: 'workspace',
    resourceId: 'workspace_1',
    details: {
      name: 'Mi Empresa',
      slug: 'mi-empresa'
    },
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    severity: 'INFO'
  },
  {
    id: 'audit_2',
    userId: 'user_1',
    workspaceId: 'workspace_1',
    action: 'MEMBER_INVITED',
    resource: 'workspace_member',
    resourceId: 'member_1',
    details: {
      email: 'nuevo@ejemplo.com',
      role: 'MEMBER'
    },
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    severity: 'INFO'
  },
  {
    id: 'audit_3',
    userId: 'user_1',
    workspaceId: 'workspace_1',
    action: 'PROJECT_CREATED',
    resource: 'project',
    resourceId: 'project_1',
    details: {
      name: 'E-commerce Platform',
      description: 'Desarrollo de plataforma de comercio electrónico'
    },
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    severity: 'INFO'
  },
  {
    id: 'audit_4',
    userId: 'user_1',
    workspaceId: 'workspace_1',
    action: 'INTEGRATION_CONNECTED',
    resource: 'integration',
    resourceId: 'integration_1',
    details: {
      type: 'slack',
      name: 'Slack Workspace'
    },
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    severity: 'INFO'
  },
  {
    id: 'audit_5',
    userId: 'user_1',
    workspaceId: 'workspace_1',
    action: 'FAILED_LOGIN_ATTEMPT',
    resource: 'auth',
    resourceId: null,
    details: {
      email: 'usuario@ejemplo.com',
      reason: 'Invalid password'
    },
    ipAddress: '192.168.1.200',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    severity: 'WARNING'
  },
  {
    id: 'audit_6',
    userId: 'user_1',
    workspaceId: 'workspace_1',
    action: 'BILLING_SUBSCRIPTION_UPDATED',
    resource: 'billing',
    resourceId: 'subscription_1',
    details: {
      plan: 'pro',
      previousPlan: 'free',
      amount: 29
    },
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    severity: 'INFO'
  }
]

export async function GET(request: NextRequest) {
  try {
    const token = await getToken({ req: request })
    
    if (!token || !token.sub) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'logs'
    const workspaceId = searchParams.get('workspaceId')
    const action = searchParams.get('action')
    const severity = searchParams.get('severity')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')

    switch (type) {
      case 'logs':
        let logs: any[]

        if (useDatabase && prisma) {
          const whereClause: any = { userId: token.sub }
          
          if (workspaceId) whereClause.workspaceId = workspaceId
          if (action) whereClause.action = action
          if (severity) whereClause.severity = severity
          
          if (startDate || endDate) {
            whereClause.timestamp = {}
            if (startDate) whereClause.timestamp.gte = new Date(startDate)
            if (endDate) whereClause.timestamp.lte = new Date(endDate)
          }

          logs = await prisma.auditLog.findMany({
            where: whereClause,
            orderBy: { timestamp: 'desc' },
            skip: (page - 1) * limit,
            take: limit,
            include: {
              user: {
                select: {
                  name: true,
                  email: true
                }
              },
              workspace: {
                select: {
                  name: true,
                  slug: true
                }
              }
            }
          })
        } else {
          // Usar simulación
          logs = mockAuditLogs
            .filter(log => log.userId === token.sub)
            .filter(log => !workspaceId || log.workspaceId === workspaceId)
            .filter(log => !action || log.action === action)
            .filter(log => !severity || log.severity === severity)
            .slice((page - 1) * limit, page * limit)
        }

        return NextResponse.json({
          logs,
          pagination: {
            page,
            limit,
            total: logs.length,
            hasMore: logs.length === limit
          }
        })

      case 'stats':
        let stats: any

        if (useDatabase && prisma) {
          const whereClause: any = { userId: token.sub }
          if (workspaceId) whereClause.workspaceId = workspaceId

          const [
            total,
            today,
            thisWeek,
            thisMonth,
            bySeverity,
            byAction
          ] = await Promise.all([
            prisma.auditLog.count({ where: whereClause }),
            prisma.auditLog.count({
              where: {
                ...whereClause,
                timestamp: {
                  gte: new Date(new Date().setHours(0, 0, 0, 0))
                }
              }
            }),
            prisma.auditLog.count({
              where: {
                ...whereClause,
                timestamp: {
                  gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                }
              }
            }),
            prisma.auditLog.count({
              where: {
                ...whereClause,
                timestamp: {
                  gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
                }
              }
            }),
            prisma.auditLog.groupBy({
              by: ['severity'],
              where: whereClause,
              _count: { severity: true }
            }),
            prisma.auditLog.groupBy({
              by: ['action'],
              where: whereClause,
              _count: { action: true },
              orderBy: { _count: { action: 'desc' } },
              take: 10
            })
          ])

          stats = {
            total,
            today,
            thisWeek,
            thisMonth,
            bySeverity: bySeverity.reduce((acc: Record<string, number>, item: any) => {
              acc[item.severity] = item._count.severity
              return acc
            }, {} as Record<string, number>),
            topActions: byAction.map((item: any) => ({
              action: item.action,
              count: item._count.action
            }))
          }
        } else {
          // Simulación
          const userLogs = mockAuditLogs.filter(log => log.userId === token.sub)
          const today = new Date().toDateString()
          const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)

          stats = {
            total: userLogs.length,
            today: userLogs.filter(log => new Date(log.timestamp).toDateString() === today).length,
            thisWeek: userLogs.filter(log => new Date(log.timestamp) >= weekAgo).length,
            thisMonth: userLogs.filter(log => new Date(log.timestamp) >= monthAgo).length,
            bySeverity: {
              INFO: userLogs.filter(log => log.severity === 'INFO').length,
              WARNING: userLogs.filter(log => log.severity === 'WARNING').length,
              ERROR: userLogs.filter(log => log.severity === 'ERROR').length
            },
            topActions: [
              { action: 'WORKSPACE_CREATED', count: 1 },
              { action: 'MEMBER_INVITED', count: 1 },
              { action: 'PROJECT_CREATED', count: 1 }
            ]
          }
        }

        return NextResponse.json(stats)

      case 'export':
        // Exportar logs en formato CSV
        let exportLogs: any[]

        if (useDatabase && prisma) {
          const whereClause: any = { userId: token.sub }
          if (workspaceId) whereClause.workspaceId = workspaceId

          exportLogs = await prisma.auditLog.findMany({
            where: whereClause,
            orderBy: { timestamp: 'desc' },
            include: {
              user: {
                select: {
                  name: true,
                  email: true
                }
              },
              workspace: {
                select: {
                  name: true
                }
              }
            }
          })
        } else {
          exportLogs = mockAuditLogs.filter(log => log.userId === token.sub)
        }

        // Generar CSV
        const csvHeaders = 'Timestamp,Action,Resource,Severity,IP Address,User Agent,Details\n'
        const csvRows = exportLogs.map(log => {
          const details = JSON.stringify(log.details).replace(/"/g, '""')
          return `"${log.timestamp}","${log.action}","${log.resource}","${log.severity}","${log.ipAddress}","${log.userAgent}","${details}"`
        }).join('\n')

        const csv = csvHeaders + csvRows

        return new NextResponse(csv, {
          headers: {
            'Content-Type': 'text/csv',
            'Content-Disposition': `attachment; filename="audit-logs-${new Date().toISOString().split('T')[0]}.csv"`
          }
        })

      default:
        return NextResponse.json({ error: 'Tipo no válido' }, { status: 400 })
    }
  } catch (error) {
    console.error('Error en audit API:', error)
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

    const { action, resource, resourceId, details, workspaceId, severity = 'INFO' } = await request.json()

    if (!action || !resource) {
      return NextResponse.json(
        { error: 'Acción y recurso son requeridos' },
        { status: 400 }
      )
    }

    // Obtener información de la request
    const ipAddress = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown'
    const userAgent = request.headers.get('user-agent') || 'unknown'

    const auditLog = {
      userId: token.sub,
      workspaceId: workspaceId || null,
      action,
      resource,
      resourceId: resourceId || null,
      details: details || {},
      ipAddress,
      userAgent,
      timestamp: new Date(),
      severity
    }

    if (useDatabase && prisma) {
      await prisma.auditLog.create({
        data: auditLog
      })
    } else {
      // Simulación - solo loggear
      console.log(`📋 Audit Log: ${action}`, {
        userId: token.sub,
        workspaceId,
        resource,
        resourceId,
        severity
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error en audit API:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
