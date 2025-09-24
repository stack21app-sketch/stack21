import { NextRequest, NextResponse } from 'next/server'
import {
  getNotificationsByUser,
  getUnreadCount,
  getNotificationStats,
  getNotificationSettings,
  updateNotificationSettings,
  markNotificationAsRead,
  markNotificationAsArchived,
  markAllAsRead,
  createNotification,
  // getNotificationTemplates,
  type Notification,
  type NotificationSettings
} from '@/lib/notifications'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const type = searchParams.get('type')

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID requerido' },
        { status: 400 }
      )
    }

    switch (type) {
      case 'list':
        const filters = {
          isRead: searchParams.get('isRead') === 'true' ? true : 
                  searchParams.get('isRead') === 'false' ? false : undefined,
          isArchived: searchParams.get('isArchived') === 'true' ? true : 
                     searchParams.get('isArchived') === 'false' ? false : undefined,
          category: searchParams.get('category') || undefined,
          type: searchParams.get('notificationType') || undefined,
          priority: searchParams.get('priority') || undefined,
          limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined,
          offset: searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : undefined
        }
        
        const notifications = getNotificationsByUser(userId, filters)
        return NextResponse.json({
          success: true,
          data: notifications
        })

      case 'unread-count':
        const unreadCount = getUnreadCount(userId)
        return NextResponse.json({
          success: true,
          data: { unreadCount }
        })

      case 'stats':
        const stats = getNotificationStats(userId)
        return NextResponse.json({
          success: true,
          data: stats
        })

      case 'settings':
        const settings = getNotificationSettings(userId)
        return NextResponse.json({
          success: true,
          data: settings
        })

      case 'templates':
        // const templates = getNotificationTemplates()
        return NextResponse.json({
          success: true,
          data: []
        })

      default:
        return NextResponse.json({
          success: true,
          data: {
            notifications: getNotificationsByUser(userId),
            unreadCount: getUnreadCount(userId),
            stats: getNotificationStats(userId),
            settings: getNotificationSettings(userId)
          }
        })
    }
  } catch (error) {
    console.error('Error fetching notifications:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error al obtener las notificaciones' 
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, userId, data } = body

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID requerido' },
        { status: 400 }
      )
    }

    switch (action) {
      case 'mark-read':
        const { notificationId } = data
        if (!notificationId) {
          return NextResponse.json(
            { success: false, error: 'Notification ID requerido' },
            { status: 400 }
          )
        }
        
        const success = markNotificationAsRead(notificationId)
        if (success) {
          return NextResponse.json({
            success: true,
            message: 'Notificación marcada como leída'
          })
        } else {
          return NextResponse.json(
            { success: false, error: 'No se pudo marcar la notificación como leída' },
            { status: 400 }
          )
        }

      case 'mark-archived':
        const { notificationId: archivedId } = data
        if (!archivedId) {
          return NextResponse.json(
            { success: false, error: 'Notification ID requerido' },
            { status: 400 }
          )
        }
        
        const archivedSuccess = markNotificationAsArchived(archivedId)
        if (archivedSuccess) {
          return NextResponse.json({
            success: true,
            message: 'Notificación archivada'
          })
        } else {
          return NextResponse.json(
            { success: false, error: 'No se pudo archivar la notificación' },
            { status: 400 }
          )
        }

      case 'mark-all-read':
        const count = markAllAsRead(userId)
        return NextResponse.json({
          success: true,
          message: `${count} notificaciones marcadas como leídas`,
          data: { count }
        })

      case 'update-settings':
        const { settings } = data
        if (!settings) {
          return NextResponse.json(
            { success: false, error: 'Configuración requerida' },
            { status: 400 }
          )
        }
        
        const updatedSettings = updateNotificationSettings(userId, settings)
        return NextResponse.json({
          success: true,
          message: 'Configuración actualizada',
          data: updatedSettings
        })

      case 'create':
        const { templateId, variables, overrides } = data
        if (!templateId) {
          return NextResponse.json(
            { success: false, error: 'Template ID requerido' },
            { status: 400 }
          )
        }
        
        try {
          const notification = createNotification(userId, templateId, variables, overrides)
          return NextResponse.json({
            success: true,
            message: 'Notificación creada',
            data: notification
          })
        } catch (error) {
          return NextResponse.json(
            { 
              success: false, 
              error: error instanceof Error ? error.message : 'Error creando notificación' 
            },
            { status: 400 }
          )
        }

      case 'test':
        // Crear una notificación de prueba
        const testNotification = createNotification(userId, 'workflow-completed', {
          workflowName: 'Workflow de Prueba',
          recordsCount: 25,
          duration: '1.5 minutos'
        })
        
        return NextResponse.json({
          success: true,
          message: 'Notificación de prueba creada',
          data: testNotification
        })

      case 'bulk-action':
        const { action: bulkAction, notificationIds } = data
        if (!bulkAction || !notificationIds || !Array.isArray(notificationIds)) {
          return NextResponse.json(
            { success: false, error: 'Acción y IDs de notificaciones requeridos' },
            { status: 400 }
          )
        }
        
        let processedCount = 0
        
        for (const notificationId of notificationIds) {
          let success = false
          
          switch (bulkAction) {
            case 'mark-read':
              success = markNotificationAsRead(notificationId)
              break
            case 'mark-archived':
              success = markNotificationAsArchived(notificationId)
              break
            default:
              continue
          }
          
          if (success) processedCount++
        }
        
        return NextResponse.json({
          success: true,
          message: `${processedCount} notificaciones procesadas`,
          data: { processedCount, total: notificationIds.length }
        })

      case 'simulate-realtime':
        // Simular notificaciones en tiempo real para testing
        const templates = [
          'workflow-completed',
          'integration-connected',
          'achievement-unlocked',
          'team-invitation',
          'billing-payment-success'
        ]
        
        const randomTemplate = templates[Math.floor(Math.random() * templates.length)]
        const simulationVariables = {
          workflowName: 'Workflow Simulado',
          integrationName: 'Integración Simulada',
          achievementName: 'Logro Simulado',
          workspaceName: 'Equipo Simulado',
          amount: 99.00
        }
        
        const simulatedNotification = createNotification(userId, randomTemplate, simulationVariables)
        
        return NextResponse.json({
          success: true,
          message: 'Notificación simulada creada',
          data: simulatedNotification
        })

      default:
        return NextResponse.json(
          { success: false, error: 'Acción no válida' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Error processing notification action:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error al procesar la acción de notificación' 
      },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const notificationId = searchParams.get('notificationId')

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID requerido' },
        { status: 400 }
      )
    }

    if (notificationId) {
      // Eliminar notificación específica
      const success = markNotificationAsArchived(notificationId)
      if (success) {
        return NextResponse.json({
          success: true,
          message: 'Notificación eliminada'
        })
      } else {
        return NextResponse.json(
          { success: false, error: 'No se pudo eliminar la notificación' },
          { status: 400 }
        )
      }
    } else {
      // Eliminar todas las notificaciones del usuario
      const count = markAllAsRead(userId)
      return NextResponse.json({
        success: true,
        message: `${count} notificaciones eliminadas`,
        data: { count }
      })
    }
  } catch (error) {
    console.error('Error deleting notifications:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error al eliminar las notificaciones' 
      },
      { status: 500 }
    )
  }
}
