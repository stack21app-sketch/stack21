import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { PrismaClient, DeletionStatus } from '@prisma/client'

const prisma = new PrismaClient()

interface DeletionRequest {
  id: string
  userId: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  requested_at: string
  processed_at?: string
  reason?: string
  data_categories: string[]
  retention_exceptions: string[]
}

// Simulación de base de datos (en producción usar Prisma)
const deletionRequests: DeletionRequest[] = []

export async function POST(request: NextRequest) {
  try {
    const token = await getToken({ req: request })
    
    if (!token || !token.sub) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { reason, confirm_deletion } = body

    // Validar confirmación
    if (!confirm_deletion) {
      return NextResponse.json(
        { error: 'Debes confirmar que quieres eliminar todos tus datos' },
        { status: 400 }
      )
    }

    // Verificar si ya existe una solicitud pendiente (DB)
    const existingRequest = await prisma.dataDeletionRequest.findFirst({
      where: { userId: token.sub, status: DeletionStatus.PENDING },
    })

    if (existingRequest) {
      return NextResponse.json(
        { error: 'Ya tienes una solicitud de eliminación pendiente' },
        { status: 409 }
      )
    }

    // Crear nueva solicitud de eliminación
    const deletionRequest = await prisma.dataDeletionRequest.create({
      data: {
        userId: token.sub,
        status: DeletionStatus.PENDING,
        reason: reason || 'Solicitud del usuario',
        dataCategories: [
          'profile_data',
          'preference_data',
          'usage_data',
          'billing_data',
          'consent_data',
          'technical_data',
          'session_data',
          'analytics_data',
        ],
        retentionExceptions: [
          'billing_records',
          'audit_logs',
          'legal_obligations',
        ],
      },
    })

    // Log de auditoría
    console.log(`Solicitud de eliminación creada para usuario ${token.sub}:`, {
      request_id: deletionRequest.id,
      reason: deletionRequest.reason,
      timestamp: new Date().toISOString(),
      ip_address: request.headers.get('x-forwarded-for') || 'unknown'
    })

    // En producción, aquí se iniciaría el proceso real de eliminación
    // Por ahora, simulamos el procesamiento
    setTimeout(async () => {
      await processDeletionRequest(deletionRequest.id)
    }, 1000)

    return NextResponse.json({
      success: true,
      request: {
        id: deletionRequest.id,
        status: deletionRequest.status.toLowerCase(),
        requested_at: (deletionRequest.requestedAt as any)?.toISOString?.() || new Date().toISOString(),
        estimated_completion: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 horas
      },
      message: 'Solicitud de eliminación recibida. Procesaremos tu solicitud en las próximas 24 horas.',
      notice: 'Algunos datos pueden conservarse por obligaciones legales o fiscales.'
    })

  } catch (error) {
    console.error('Error creando solicitud de eliminación:', error)
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
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    // Buscar solicitudes del usuario (DB)
    const userRequests = await prisma.dataDeletionRequest.findMany({
      where: { userId: token.sub },
      orderBy: { requestedAt: 'desc' },
    })

    return NextResponse.json({
      requests: userRequests.map(req => ({
        id: req.id,
        status: req.status.toLowerCase(),
        requested_at: req.requestedAt?.toISOString(),
        processed_at: req.processedAt?.toISOString(),
        reason: req.reason || undefined,
        data_categories: req.dataCategories,
        retention_exceptions: req.retentionExceptions,
      }))
    })

  } catch (error) {
    console.error('Error obteniendo solicitudes de eliminación:', error)
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
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const requestId = searchParams.get('id')

    if (!requestId) {
      return NextResponse.json(
        { error: 'ID de solicitud requerido' },
        { status: 400 }
      )
    }

    // Buscar la solicitud (DB)
    const existing = await prisma.dataDeletionRequest.findFirst({
      where: { id: requestId, userId: token.sub },
    })

    if (!existing) {
      // Considerar como ya cancelada/no existente para idempotencia
      return NextResponse.json({
        success: true,
        message: 'Solicitud de eliminación no encontrada o ya cancelada'
      })
    }

    // Solo se puede cancelar si está pendiente
    if (existing.status !== DeletionStatus.PENDING) {
      return NextResponse.json(
        { error: 'Solo se pueden cancelar solicitudes pendientes' },
        { status: 400 }
      )
    }

    // Eliminar la solicitud en DB
    await prisma.dataDeletionRequest.delete({ where: { id: requestId } })

    // Log de auditoría
    console.log(`Solicitud de eliminación cancelada por usuario ${token.sub}:`, {
      request_id: requestId,
      timestamp: new Date().toISOString()
    })

    return NextResponse.json({
      success: true,
      message: 'Solicitud de eliminación cancelada correctamente'
    })

  } catch (error) {
    console.error('Error cancelando solicitud de eliminación:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// Función para procesar solicitudes de eliminación
async function processDeletionRequest(requestId: string) {
  try {
    const deletionRequest = await prisma.dataDeletionRequest.findUnique({ where: { id: requestId } })
    if (!deletionRequest) {
      console.error(`Solicitud de eliminación no encontrada: ${requestId}`)
      return
    }
    
    // Actualizar estado a procesando
    await prisma.dataDeletionRequest.update({
      where: { id: requestId },
      data: { status: DeletionStatus.PROCESSING },
    })

    console.log(`Procesando eliminación de datos para usuario ${deletionRequest.userId}`)

    // Simular procesamiento de eliminación
    // En producción, aquí se eliminarían los datos reales de todas las fuentes
    
    // 1. Eliminar datos de perfil
    await deleteUserProfile(deletionRequest.userId)
    
    // 2. Eliminar datos de preferencias
    await deleteUserPreferences(deletionRequest.userId)
    
    // 3. Eliminar datos de uso
    await deleteUserUsage(deletionRequest.userId)
    
    // 4. Eliminar datos de consentimiento
    await deleteUserConsent(deletionRequest.userId)
    
    // 5. Eliminar datos técnicos (excepto los que deben conservarse)
    await deleteUserTechnicalData(deletionRequest.userId, deletionRequest.retentionExceptions)
    
    // 6. Eliminar sesiones activas
    await deleteUserSessions(deletionRequest.userId)
    
    // 7. Eliminar datos de analytics (anonimizados)
    await deleteUserAnalytics(deletionRequest.userId)

    // Actualizar estado a completado
    await prisma.dataDeletionRequest.update({
      where: { id: requestId },
      data: { status: DeletionStatus.COMPLETED, processedAt: new Date() },
    })

    console.log(`Eliminación de datos completada para usuario ${deletionRequest.userId}`)

    // En producción, aquí se enviaría un email de confirmación al usuario

  } catch (error) {
    console.error(`Error procesando eliminación ${requestId}:`, error)
    
    // Actualizar estado a fallido
    await prisma.dataDeletionRequest.update({
      where: { id: requestId },
      data: { status: DeletionStatus.FAILED, processedAt: new Date() },
    }).catch(() => null)
  }
}

// Funciones de eliminación específicas (simuladas)
async function deleteUserProfile(userId: string) {
  console.log(`Eliminando perfil de usuario ${userId}`)
  // En producción: DELETE FROM users WHERE id = userId
}

async function deleteUserPreferences(userId: string) {
  console.log(`Eliminando preferencias de usuario ${userId}`)
  // En producción: DELETE FROM user_preferences WHERE user_id = userId
}

async function deleteUserUsage(userId: string) {
  console.log(`Eliminando datos de uso de usuario ${userId}`)
  // En producción: DELETE FROM user_usage WHERE user_id = userId
}

async function deleteUserConsent(userId: string) {
  console.log(`Eliminando consentimiento de usuario ${userId}`)
  // En producción: DELETE FROM user_consent WHERE user_id = userId
}

async function deleteUserTechnicalData(userId: string, exceptions: string[]) {
  console.log(`Eliminando datos técnicos de usuario ${userId}, excepciones: ${exceptions.join(', ')}`)
  // En producción: DELETE FROM technical_data WHERE user_id = userId AND category NOT IN exceptions
}

async function deleteUserSessions(userId: string) {
  console.log(`Eliminando sesiones de usuario ${userId}`)
  // En producción: DELETE FROM user_sessions WHERE user_id = userId
}

async function deleteUserAnalytics(userId: string) {
  console.log(`Eliminando analytics de usuario ${userId}`)
  // En producción: DELETE FROM analytics WHERE user_id = userId
}
