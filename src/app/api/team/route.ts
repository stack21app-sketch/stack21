import { NextRequest, NextResponse } from 'next/server'
import {
  getWorkspaces,
  getWorkspace,
  createWorkspace,
  updateWorkspace,
  getTeamMembers,
  getTeamMember,
  inviteMember,
  updateMemberRole,
  removeMember,
  getInvitations,
  cancelInvitation,
  getActivityLogs,
  logActivity,
  hasPermission,
  type Workspace,
  type TeamMember,
  type Invitation,
  type ActivityLog,
  PERMISSIONS
} from '@/lib/team-management'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const type = searchParams.get('type')
    const workspaceId = searchParams.get('workspaceId')

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID requerido' },
        { status: 400 }
      )
    }

    switch (type) {
      case 'workspaces':
        const workspaces = await getWorkspaces(userId)
        return NextResponse.json({
          success: true,
          data: workspaces
        })

      case 'workspace':
        if (!workspaceId) {
          return NextResponse.json(
            { success: false, error: 'Workspace ID requerido' },
            { status: 400 }
          )
        }
        const workspace = await getWorkspace(workspaceId)
        if (!workspace) {
          return NextResponse.json(
            { success: false, error: 'Workspace no encontrado' },
            { status: 404 }
          )
        }
        return NextResponse.json({
          success: true,
          data: workspace
        })

      case 'members':
        if (!workspaceId) {
          return NextResponse.json(
            { success: false, error: 'Workspace ID requerido' },
            { status: 400 }
          )
        }
        const members = await getTeamMembers(workspaceId)
        return NextResponse.json({
          success: true,
          data: members
        })

      case 'member':
        if (!workspaceId) {
          return NextResponse.json(
            { success: false, error: 'Workspace ID requerido' },
            { status: 400 }
          )
        }
        const member = await getTeamMember(workspaceId, userId)
        if (!member) {
          return NextResponse.json(
            { success: false, error: 'Miembro no encontrado' },
            { status: 404 }
          )
        }
        return NextResponse.json({
          success: true,
          data: member
        })

      case 'invitations':
        if (!workspaceId) {
          return NextResponse.json(
            { success: false, error: 'Workspace ID requerido' },
            { status: 400 }
          )
        }
        const invitations = await getInvitations(workspaceId)
        return NextResponse.json({
          success: true,
          data: invitations
        })

      case 'activity':
        if (!workspaceId) {
          return NextResponse.json(
            { success: false, error: 'Workspace ID requerido' },
            { status: 400 }
          )
        }
        const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 50
        const activityLogs = await getActivityLogs(workspaceId, limit)
        return NextResponse.json({
          success: true,
          data: activityLogs
        })

      default:
        return NextResponse.json({
          success: true,
          data: {
            workspaces: await getWorkspaces(userId),
            message: 'Use type parameter to get specific data'
          }
        })
    }
  } catch (error) {
    console.error('Error in team GET API:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error al obtener los datos del equipo' 
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, userId, workspaceId, data } = body

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID requerido' },
        { status: 400 }
      )
    }

    switch (action) {
      case 'create-workspace':
        const { name, description, slug } = data
        if (!name || !slug) {
          return NextResponse.json(
            { success: false, error: 'Nombre y slug son requeridos' },
            { status: 400 }
          )
        }
        
        const workspace = await createWorkspace(userId, { name, description, slug })
        return NextResponse.json({
          success: true,
          message: 'Workspace creado correctamente',
          data: workspace
        })

      case 'update-workspace':
        if (!workspaceId) {
          return NextResponse.json(
            { success: false, error: 'Workspace ID requerido' },
            { status: 400 }
          )
        }
        
        const updatedWorkspace = await updateWorkspace(workspaceId, data)
        if (!updatedWorkspace) {
          return NextResponse.json(
            { success: false, error: 'Workspace no encontrado' },
            { status: 404 }
          )
        }
        return NextResponse.json({
          success: true,
          message: 'Workspace actualizado correctamente',
          data: updatedWorkspace
        })

      case 'invite-member':
        if (!workspaceId) {
          return NextResponse.json(
            { success: false, error: 'Workspace ID requerido' },
            { status: 400 }
          )
        }
        
        const { email, role } = data
        if (!email || !role) {
          return NextResponse.json(
            { success: false, error: 'Email y rol son requeridos' },
            { status: 400 }
          )
        }
        
        const invitation = await inviteMember(workspaceId, userId, { email, role })
        return NextResponse.json({
          success: true,
          message: 'Invitación enviada correctamente',
          data: invitation
        })

      case 'update-member-role':
        if (!workspaceId) {
          return NextResponse.json(
            { success: false, error: 'Workspace ID requerido' },
            { status: 400 }
          )
        }
        
        const { targetUserId, newRole } = data
        if (!targetUserId || !newRole) {
          return NextResponse.json(
            { success: false, error: 'ID de usuario y nuevo rol son requeridos' },
            { status: 400 }
          )
        }
        
        const updatedMember = await updateMemberRole(workspaceId, targetUserId, newRole)
        if (!updatedMember) {
          return NextResponse.json(
            { success: false, error: 'Miembro no encontrado' },
            { status: 404 }
          )
        }
        return NextResponse.json({
          success: true,
          message: 'Rol actualizado correctamente',
          data: updatedMember
        })

      case 'remove-member':
        if (!workspaceId) {
          return NextResponse.json(
            { success: false, error: 'Workspace ID requerido' },
            { status: 400 }
          )
        }
        
        const { targetUserId: removeUserId } = data
        if (!removeUserId) {
          return NextResponse.json(
            { success: false, error: 'ID de usuario es requerido' },
            { status: 400 }
          )
        }
        
        const removed = await removeMember(workspaceId, removeUserId)
        if (!removed) {
          return NextResponse.json(
            { success: false, error: 'No se pudo remover al miembro' },
            { status: 400 }
          )
        }
        return NextResponse.json({
          success: true,
          message: 'Miembro removido correctamente'
        })

      case 'cancel-invitation':
        const { invitationId } = data
        if (!invitationId) {
          return NextResponse.json(
            { success: false, error: 'ID de invitación es requerido' },
            { status: 400 }
          )
        }
        
        const cancelled = await cancelInvitation(invitationId)
        if (!cancelled) {
          return NextResponse.json(
            { success: false, error: 'No se pudo cancelar la invitación' },
            { status: 400 }
          )
        }
        return NextResponse.json({
          success: true,
          message: 'Invitación cancelada correctamente'
        })

      case 'log-activity':
        if (!workspaceId) {
          return NextResponse.json(
            { success: false, error: 'Workspace ID requerido' },
            { status: 400 }
          )
        }
        
        const { action, resource, resourceId, details } = data
        if (!action || !resource) {
          return NextResponse.json(
            { success: false, error: 'Acción y recurso son requeridos' },
            { status: 400 }
          )
        }
        
        const activityLog = await logActivity(workspaceId, userId, action, resource, details)
        return NextResponse.json({
          success: true,
          message: 'Actividad registrada correctamente',
          data: activityLog
        })

      case 'check-permission':
        if (!workspaceId) {
          return NextResponse.json(
            { success: false, error: 'Workspace ID requerido' },
            { status: 400 }
          )
        }
        
        const { permission } = data
        if (!permission) {
          return NextResponse.json(
            { success: false, error: 'Permiso es requerido' },
            { status: 400 }
          )
        }
        
        const member = await getTeamMember(workspaceId, userId)
        if (!member) {
          return NextResponse.json(
            { success: false, error: 'Miembro no encontrado' },
            { status: 404 }
          )
        }
        
        const hasAccess = hasPermission(member.permissions, permission)
        return NextResponse.json({
          success: true,
          data: { hasPermission: hasAccess }
        })

      default:
        return NextResponse.json(
          { success: false, error: 'Acción no válida' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Error in team POST API:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error al procesar la acción del equipo' 
      },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const workspaceId = searchParams.get('workspaceId')
    const targetUserId = searchParams.get('targetUserId')
    const invitationId = searchParams.get('invitationId')

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID requerido' },
        { status: 400 }
      )
    }

    if (targetUserId && workspaceId) {
      // Remover miembro
      const removed = await removeMember(workspaceId, targetUserId)
      if (removed) {
        return NextResponse.json({
          success: true,
          message: 'Miembro removido correctamente'
        })
      } else {
        return NextResponse.json(
          { success: false, error: 'No se pudo remover al miembro' },
          { status: 400 }
        )
      }
    }

    if (invitationId) {
      // Cancelar invitación
      const cancelled = await cancelInvitation(invitationId)
      if (cancelled) {
        return NextResponse.json({
          success: true,
          message: 'Invitación cancelada correctamente'
        })
      } else {
        return NextResponse.json(
          { success: false, error: 'No se pudo cancelar la invitación' },
          { status: 400 }
        )
      }
    }

    return NextResponse.json(
      { success: false, error: 'Parámetros insuficientes' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Error in team DELETE API:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error al eliminar el recurso' 
      },
      { status: 500 }
    )
  }
}
