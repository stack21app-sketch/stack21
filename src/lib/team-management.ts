// Sistema de Gestión de Equipos para Stack21
import { z } from 'zod'

// Esquemas de validación
export const teamMemberSchema = z.object({
  id: z.string(),
  userId: z.string(),
  workspaceId: z.string(),
  email: z.string().email(),
  name: z.string(),
  avatar: z.string().url().optional(),
  role: z.enum(['owner', 'admin', 'member', 'viewer']),
  status: z.enum(['active', 'pending', 'suspended', 'inactive']),
  permissions: z.array(z.string()),
  invitedBy: z.string().optional(),
  invitedAt: z.string().datetime().optional(),
  joinedAt: z.string().datetime().optional(),
  lastActiveAt: z.string().datetime().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})

export const workspaceSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  slug: z.string(),
  ownerId: z.string(),
  plan: z.enum(['free', 'starter', 'pro', 'enterprise']),
  maxMembers: z.number(),
  currentMembers: z.number(),
  settings: z.object({
    allowInvites: z.boolean().default(true),
    requireApproval: z.boolean().default(false),
    defaultRole: z.enum(['member', 'viewer']).default('member'),
    allowExternalUsers: z.boolean().default(true),
  }),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})

export const invitationSchema = z.object({
  id: z.string(),
  workspaceId: z.string(),
  email: z.string().email(),
  role: z.enum(['admin', 'member', 'viewer']),
  invitedBy: z.string(),
  status: z.enum(['pending', 'accepted', 'expired', 'cancelled']),
  token: z.string(),
  expiresAt: z.string().datetime(),
  createdAt: z.string().datetime(),
  acceptedAt: z.string().datetime().optional(),
})

export const activityLogSchema = z.object({
  id: z.string(),
  workspaceId: z.string(),
  userId: z.string(),
  action: z.string(),
  resource: z.string(),
  resourceId: z.string().optional(),
  details: z.record(z.any()).optional(),
  ipAddress: z.string().optional(),
  userAgent: z.string().optional(),
  createdAt: z.string().datetime(),
})

// Tipos
export type TeamMember = z.infer<typeof teamMemberSchema>
export type Workspace = z.infer<typeof workspaceSchema>
export type Invitation = z.infer<typeof invitationSchema>
export type ActivityLog = z.infer<typeof activityLogSchema>

// Permisos del sistema
export const PERMISSIONS = {
  // Workspace
  WORKSPACE_VIEW: 'workspace:view',
  WORKSPACE_EDIT: 'workspace:edit',
  WORKSPACE_DELETE: 'workspace:delete',
  WORKSPACE_SETTINGS: 'workspace:settings',
  
  // Members
  MEMBERS_VIEW: 'members:view',
  MEMBERS_INVITE: 'members:invite',
  MEMBERS_EDIT: 'members:edit',
  MEMBERS_REMOVE: 'members:remove',
  
  // Workflows
  WORKFLOWS_VIEW: 'workflows:view',
  WORKFLOWS_CREATE: 'workflows:create',
  WORKFLOWS_EDIT: 'workflows:edit',
  WORKFLOWS_DELETE: 'workflows:delete',
  WORKFLOWS_EXECUTE: 'workflows:execute',
  
  // Integrations
  INTEGRATIONS_VIEW: 'integrations:view',
  INTEGRATIONS_CONNECT: 'integrations:connect',
  INTEGRATIONS_EDIT: 'integrations:edit',
  INTEGRATIONS_DELETE: 'integrations:delete',
  
  // Analytics
  ANALYTICS_VIEW: 'analytics:view',
  ANALYTICS_EXPORT: 'analytics:export',
  
  // Billing
  BILLING_VIEW: 'billing:view',
  BILLING_EDIT: 'billing:edit',
  
  // Settings
  SETTINGS_VIEW: 'settings:view',
  SETTINGS_EDIT: 'settings:edit',
} as const

// Roles y sus permisos
export const ROLE_PERMISSIONS = {
  owner: [
    PERMISSIONS.WORKSPACE_VIEW,
    PERMISSIONS.WORKSPACE_EDIT,
    PERMISSIONS.WORKSPACE_DELETE,
    PERMISSIONS.WORKSPACE_SETTINGS,
    PERMISSIONS.MEMBERS_VIEW,
    PERMISSIONS.MEMBERS_INVITE,
    PERMISSIONS.MEMBERS_EDIT,
    PERMISSIONS.MEMBERS_REMOVE,
    PERMISSIONS.WORKFLOWS_VIEW,
    PERMISSIONS.WORKFLOWS_CREATE,
    PERMISSIONS.WORKFLOWS_EDIT,
    PERMISSIONS.WORKFLOWS_DELETE,
    PERMISSIONS.WORKFLOWS_EXECUTE,
    PERMISSIONS.INTEGRATIONS_VIEW,
    PERMISSIONS.INTEGRATIONS_CONNECT,
    PERMISSIONS.INTEGRATIONS_EDIT,
    PERMISSIONS.INTEGRATIONS_DELETE,
    PERMISSIONS.ANALYTICS_VIEW,
    PERMISSIONS.ANALYTICS_EXPORT,
    PERMISSIONS.BILLING_VIEW,
    PERMISSIONS.BILLING_EDIT,
    PERMISSIONS.SETTINGS_VIEW,
    PERMISSIONS.SETTINGS_EDIT,
  ],
  admin: [
    PERMISSIONS.WORKSPACE_VIEW,
    PERMISSIONS.WORKSPACE_EDIT,
    PERMISSIONS.MEMBERS_VIEW,
    PERMISSIONS.MEMBERS_INVITE,
    PERMISSIONS.MEMBERS_EDIT,
    PERMISSIONS.MEMBERS_REMOVE,
    PERMISSIONS.WORKFLOWS_VIEW,
    PERMISSIONS.WORKFLOWS_CREATE,
    PERMISSIONS.WORKFLOWS_EDIT,
    PERMISSIONS.WORKFLOWS_DELETE,
    PERMISSIONS.WORKFLOWS_EXECUTE,
    PERMISSIONS.INTEGRATIONS_VIEW,
    PERMISSIONS.INTEGRATIONS_CONNECT,
    PERMISSIONS.INTEGRATIONS_EDIT,
    PERMISSIONS.INTEGRATIONS_DELETE,
    PERMISSIONS.ANALYTICS_VIEW,
    PERMISSIONS.ANALYTICS_EXPORT,
    PERMISSIONS.BILLING_VIEW,
    PERMISSIONS.SETTINGS_VIEW,
  ],
  member: [
    PERMISSIONS.WORKSPACE_VIEW,
    PERMISSIONS.MEMBERS_VIEW,
    PERMISSIONS.WORKFLOWS_VIEW,
    PERMISSIONS.WORKFLOWS_CREATE,
    PERMISSIONS.WORKFLOWS_EDIT,
    PERMISSIONS.WORKFLOWS_EXECUTE,
    PERMISSIONS.INTEGRATIONS_VIEW,
    PERMISSIONS.INTEGRATIONS_CONNECT,
    PERMISSIONS.INTEGRATIONS_EDIT,
    PERMISSIONS.ANALYTICS_VIEW,
    PERMISSIONS.SETTINGS_VIEW,
  ],
  viewer: [
    PERMISSIONS.WORKSPACE_VIEW,
    PERMISSIONS.MEMBERS_VIEW,
    PERMISSIONS.WORKFLOWS_VIEW,
    PERMISSIONS.INTEGRATIONS_VIEW,
    PERMISSIONS.ANALYTICS_VIEW,
  ],
} as const

// Datos de ejemplo
const mockWorkspaces: Workspace[] = [
  {
    id: 'workspace-1',
    name: 'Mi Empresa',
    description: 'Workspace principal de la empresa',
    slug: 'mi-empresa',
    ownerId: 'user-1',
    plan: 'pro',
    maxMembers: 50,
    currentMembers: 8,
    settings: {
      allowInvites: true,
      requireApproval: false,
      defaultRole: 'member',
      allowExternalUsers: true,
    },
    createdAt: new Date('2024-01-01T00:00:00Z').toISOString(),
    updatedAt: new Date('2024-01-20T00:00:00Z').toISOString(),
  },
  {
    id: 'workspace-2',
    name: 'Equipo Marketing',
    description: 'Workspace para el equipo de marketing',
    slug: 'equipo-marketing',
    ownerId: 'user-2',
    plan: 'starter',
    maxMembers: 10,
    currentMembers: 3,
    settings: {
      allowInvites: true,
      requireApproval: true,
      defaultRole: 'viewer',
      allowExternalUsers: false,
    },
    createdAt: new Date('2024-01-15T00:00:00Z').toISOString(),
    updatedAt: new Date('2024-01-20T00:00:00Z').toISOString(),
  },
]

const mockTeamMembers: TeamMember[] = [
  {
    id: 'member-1',
    userId: 'user-1',
    workspaceId: 'workspace-1',
    email: 'admin@miempresa.com',
    name: 'María González',
    avatar: 'https://vacio.stack21app.com/avatar-1.png',
    role: 'owner',
    status: 'active',
    permissions: [...ROLE_PERMISSIONS.owner],
    joinedAt: new Date('2024-01-01T00:00:00Z').toISOString(),
    lastActiveAt: new Date('2024-01-20T14:30:00Z').toISOString(),
    createdAt: new Date('2024-01-01T00:00:00Z').toISOString(),
    updatedAt: new Date('2024-01-20T00:00:00Z').toISOString(),
  },
  {
    id: 'member-2',
    userId: 'user-2',
    workspaceId: 'workspace-1',
    email: 'juan@miempresa.com',
    name: 'Juan Pérez',
    avatar: 'https://vacio.stack21app.com/avatar-2.png',
    role: 'admin',
    status: 'active',
    permissions: [...ROLE_PERMISSIONS.admin],
    invitedBy: 'user-1',
    invitedAt: new Date('2024-01-05T00:00:00Z').toISOString(),
    joinedAt: new Date('2024-01-06T00:00:00Z').toISOString(),
    lastActiveAt: new Date('2024-01-20T12:15:00Z').toISOString(),
    createdAt: new Date('2024-01-05T00:00:00Z').toISOString(),
    updatedAt: new Date('2024-01-20T00:00:00Z').toISOString(),
  },
  {
    id: 'member-3',
    userId: 'user-3',
    workspaceId: 'workspace-1',
    email: 'ana@miempresa.com',
    name: 'Ana López',
    avatar: 'https://vacio.stack21app.com/avatar-3.png',
    role: 'member',
    status: 'active',
    permissions: [...ROLE_PERMISSIONS.member],
    invitedBy: 'user-1',
    invitedAt: new Date('2024-01-10T00:00:00Z').toISOString(),
    joinedAt: new Date('2024-01-11T00:00:00Z').toISOString(),
    lastActiveAt: new Date('2024-01-20T10:45:00Z').toISOString(),
    createdAt: new Date('2024-01-10T00:00:00Z').toISOString(),
    updatedAt: new Date('2024-01-20T00:00:00Z').toISOString(),
  },
  {
    id: 'member-4',
    userId: 'user-4',
    workspaceId: 'workspace-1',
    email: 'carlos@miempresa.com',
    name: 'Carlos Ruiz',
    avatar: 'https://vacio.stack21app.com/avatar-4.png',
    role: 'viewer',
    status: 'active',
    permissions: [...ROLE_PERMISSIONS.viewer],
    invitedBy: 'user-2',
    invitedAt: new Date('2024-01-15T00:00:00Z').toISOString(),
    joinedAt: new Date('2024-01-16T00:00:00Z').toISOString(),
    lastActiveAt: new Date('2024-01-20T09:30:00Z').toISOString(),
    createdAt: new Date('2024-01-15T00:00:00Z').toISOString(),
    updatedAt: new Date('2024-01-20T00:00:00Z').toISOString(),
  },
  {
    id: 'member-5',
    userId: 'user-5',
    workspaceId: 'workspace-1',
    email: 'sofia@miempresa.com',
    name: 'Sofía García',
    avatar: 'https://vacio.stack21app.com/avatar-5.png',
    role: 'member',
    status: 'pending',
    permissions: [...ROLE_PERMISSIONS.member],
    invitedBy: 'user-1',
    invitedAt: new Date('2024-01-18T00:00:00Z').toISOString(),
    createdAt: new Date('2024-01-18T00:00:00Z').toISOString(),
    updatedAt: new Date('2024-01-18T00:00:00Z').toISOString(),
  },
]

const mockInvitations: Invitation[] = [
  {
    id: 'invitation-1',
    workspaceId: 'workspace-1',
    email: 'nuevo@miempresa.com',
    role: 'member',
    invitedBy: 'user-1',
    status: 'pending',
    token: 'inv-token-123',
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 días
    createdAt: new Date('2024-01-19T00:00:00Z').toISOString(),
  },
  {
    id: 'invitation-2',
    workspaceId: 'workspace-1',
    email: 'colaborador@empresa.com',
    role: 'viewer',
    invitedBy: 'user-2',
    status: 'pending',
    token: 'inv-token-456',
    expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 días
    createdAt: new Date('2024-01-20T00:00:00Z').toISOString(),
  },
]

const mockActivityLogs: ActivityLog[] = [
  {
    id: 'activity-1',
    workspaceId: 'workspace-1',
    userId: 'user-1',
    action: 'workspace.created',
    resource: 'workspace',
    resourceId: 'workspace-1',
    details: { name: 'Mi Empresa' },
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
    createdAt: new Date('2024-01-01T00:00:00Z').toISOString(),
  },
  {
    id: 'activity-2',
    workspaceId: 'workspace-1',
    userId: 'user-1',
    action: 'member.invited',
    resource: 'member',
    resourceId: 'member-2',
    details: { email: 'juan@miempresa.com', role: 'admin' },
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
    createdAt: new Date('2024-01-05T00:00:00Z').toISOString(),
  },
  {
    id: 'activity-3',
    workspaceId: 'workspace-1',
    userId: 'user-2',
    action: 'workflow.created',
    resource: 'workflow',
    resourceId: 'workflow-123',
    details: { name: 'Procesamiento de Leads' },
    ipAddress: '192.168.1.101',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    createdAt: new Date('2024-01-20T14:30:00Z').toISOString(),
  },
]

// Funciones de la API
export async function getWorkspaces(userId: string): Promise<Workspace[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const userWorkspaces = mockWorkspaces.filter(ws => 
        mockTeamMembers.some(member => 
          member.userId === userId && member.workspaceId === ws.id
        )
      )
      resolve(userWorkspaces)
    }, 300)
  })
}

export async function getWorkspace(workspaceId: string): Promise<Workspace | undefined> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const workspace = mockWorkspaces.find(ws => ws.id === workspaceId)
      resolve(workspace)
    }, 300)
  })
}

export async function createWorkspace(
  userId: string, 
  data: { name: string; description?: string; slug: string }
): Promise<Workspace> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const workspace: Workspace = {
        id: `workspace-${Date.now()}`,
        name: data.name,
        description: data.description,
        slug: data.slug,
        ownerId: userId,
        plan: 'free',
        maxMembers: 5,
        currentMembers: 1,
        settings: {
          allowInvites: true,
          requireApproval: false,
          defaultRole: 'member',
          allowExternalUsers: true,
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      
      mockWorkspaces.push(workspace)
      
      // Agregar al owner como miembro
      const ownerMember: TeamMember = {
        id: `member-${Date.now()}`,
        userId,
        workspaceId: workspace.id,
        email: 'owner@example.com', // En producción esto vendría del usuario
        name: 'Owner',
        role: 'owner',
        status: 'active',
        permissions: [...ROLE_PERMISSIONS.owner],
        joinedAt: new Date().toISOString(),
        lastActiveAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      
      mockTeamMembers.push(ownerMember)
      
      resolve(workspace)
    }, 500)
  })
}

export async function updateWorkspace(
  workspaceId: string, 
  data: Partial<Workspace>
): Promise<Workspace | undefined> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const workspaceIndex = mockWorkspaces.findIndex(ws => ws.id === workspaceId)
      if (workspaceIndex !== -1) {
        mockWorkspaces[workspaceIndex] = {
          ...mockWorkspaces[workspaceIndex],
          ...data,
          updatedAt: new Date().toISOString(),
        }
        resolve(mockWorkspaces[workspaceIndex])
      } else {
        resolve(undefined)
      }
    }, 300)
  })
}

export async function getTeamMembers(workspaceId: string): Promise<TeamMember[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const members = mockTeamMembers.filter(member => member.workspaceId === workspaceId)
      resolve(members)
    }, 300)
  })
}

export async function getTeamMember(workspaceId: string, userId: string): Promise<TeamMember | undefined> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const member = mockTeamMembers.find(member => 
        member.workspaceId === workspaceId && member.userId === userId
      )
      resolve(member)
    }, 300)
  })
}

export async function inviteMember(
  workspaceId: string,
  invitedBy: string,
  data: { email: string; role: 'admin' | 'member' | 'viewer' }
): Promise<Invitation> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const invitation: Invitation = {
        id: `invitation-${Date.now()}`,
        workspaceId,
        email: data.email,
        role: data.role,
        invitedBy,
        status: 'pending',
        token: `inv-token-${Math.random().toString(36).substr(2, 9)}`,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date().toISOString(),
      }
      
      mockInvitations.push(invitation)
      resolve(invitation)
    }, 500)
  })
}

export async function updateMemberRole(
  workspaceId: string,
  userId: string,
  newRole: 'admin' | 'member' | 'viewer'
): Promise<TeamMember | undefined> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const memberIndex = mockTeamMembers.findIndex(member => 
        member.workspaceId === workspaceId && member.userId === userId
      )
      
      if (memberIndex !== -1) {
        mockTeamMembers[memberIndex] = {
          ...mockTeamMembers[memberIndex],
          role: newRole,
          permissions: [...ROLE_PERMISSIONS[newRole]],
          updatedAt: new Date().toISOString(),
        }
        resolve(mockTeamMembers[memberIndex])
      } else {
        resolve(undefined)
      }
    }, 300)
  })
}

export async function removeMember(
  workspaceId: string,
  userId: string
): Promise<boolean> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const memberIndex = mockTeamMembers.findIndex(member => 
        member.workspaceId === workspaceId && member.userId === userId
      )
      
      if (memberIndex !== -1) {
        mockTeamMembers.splice(memberIndex, 1)
        resolve(true)
      } else {
        resolve(false)
      }
    }, 300)
  })
}

export async function getInvitations(workspaceId: string): Promise<Invitation[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const invitations = mockInvitations.filter(inv => inv.workspaceId === workspaceId)
      resolve(invitations)
    }, 300)
  })
}

export async function cancelInvitation(invitationId: string): Promise<boolean> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const invitationIndex = mockInvitations.findIndex(inv => inv.id === invitationId)
      
      if (invitationIndex !== -1) {
        mockInvitations[invitationIndex].status = 'cancelled'
        resolve(true)
      } else {
        resolve(false)
      }
    }, 300)
  })
}

export async function getActivityLogs(workspaceId: string, limit = 50): Promise<ActivityLog[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const logs = mockActivityLogs
        .filter(log => log.workspaceId === workspaceId)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, limit)
      resolve(logs)
    }, 300)
  })
}

export async function logActivity(
  workspaceId: string,
  userId: string,
  action: string,
  resource: string,
  details?: Record<string, any>
): Promise<ActivityLog> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const activityLog: ActivityLog = {
        id: `activity-${Date.now()}`,
        workspaceId,
        userId,
        action,
        resource,
        details,
        createdAt: new Date().toISOString(),
      }
      
      mockActivityLogs.unshift(activityLog)
      resolve(activityLog)
    }, 200)
  })
}

export function hasPermission(
  userPermissions: string[],
  requiredPermission: string
): boolean {
  return userPermissions.includes(requiredPermission)
}

export function canInviteMembers(
  userRole: string,
  workspaceSettings: Workspace['settings']
): boolean {
  if (!workspaceSettings.allowInvites) return false
  return ['owner', 'admin'].includes(userRole)
}

export function getRoleDisplayName(role: string): string {
  const roleNames = {
    owner: 'Propietario',
    admin: 'Administrador',
    member: 'Miembro',
    viewer: 'Observador',
  }
  return roleNames[role as keyof typeof roleNames] || role
}

export function getStatusDisplayName(status: string): string {
  const statusNames = {
    active: 'Activo',
    pending: 'Pendiente',
    suspended: 'Suspendido',
    inactive: 'Inactivo',
  }
  return statusNames[status as keyof typeof statusNames] || status
}

export function getStatusColor(status: string): string {
  const statusColors = {
    active: 'text-green-600 bg-green-100',
    pending: 'text-yellow-600 bg-yellow-100',
    suspended: 'text-red-600 bg-red-100',
    inactive: 'text-gray-600 bg-gray-100',
  }
  return statusColors[status as keyof typeof statusColors] || 'text-gray-600 bg-gray-100'
}

export function getRoleColor(role: string): string {
  const roleColors = {
    owner: 'text-purple-600 bg-purple-100',
    admin: 'text-blue-600 bg-blue-100',
    member: 'text-green-600 bg-green-100',
    viewer: 'text-gray-600 bg-gray-100',
  }
  return roleColors[role as keyof typeof roleColors] || 'text-gray-600 bg-gray-100'
}
