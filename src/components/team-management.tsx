'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { 
  Users, 
  UserPlus, 
  MoreVertical, 
  Mail, 
  Shield, 
  Clock, 
  CheckCircle, 
  XCircle,
  AlertCircle,
  Settings,
  Activity,
  Crown,
  User,
  Eye,
  Trash2,
  Edit,
  Send,
  RefreshCw
} from 'lucide-react'
import {
  getWorkspaces,
  getTeamMembers,
  inviteMember,
  updateMemberRole,
  removeMember,
  getInvitations,
  cancelInvitation,
  getActivityLogs,
  hasPermission,
  canInviteMembers,
  getRoleDisplayName,
  getStatusDisplayName,
  getStatusColor,
  getRoleColor,
  type TeamMember,
  type Workspace,
  type Invitation,
  type ActivityLog,
  PERMISSIONS
} from '@/lib/team-management'
import { useToast } from '@/hooks/use-toast'

interface TeamManagementProps {
  workspaceId: string
  currentUserId: string
}

export function TeamManagement({ workspaceId, currentUserId }: TeamManagementProps) {
  const [workspace, setWorkspace] = useState<Workspace | null>(null)
  const [members, setMembers] = useState<TeamMember[]>([])
  const [invitations, setInvitations] = useState<Invitation[]>([])
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([])
  const [loading, setLoading] = useState(true)
  const [currentMember, setCurrentMember] = useState<TeamMember | null>(null)
  const [showInviteDialog, setShowInviteDialog] = useState(false)
  const [showActivityDialog, setShowActivityDialog] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState<'admin' | 'member' | 'viewer'>('member')
  const { toast } = useToast()

  useEffect(() => {
    loadTeamData()
  }, [workspaceId])

  const loadTeamData = async () => {
    setLoading(true)
    try {
      const [workspaces, membersData, invitationsData, activityData] = await Promise.all([
        getWorkspaces(currentUserId),
        getTeamMembers(workspaceId),
        getInvitations(workspaceId),
        getActivityLogs(workspaceId, 20)
      ])
      
      const currentWorkspace = workspaces.find(ws => ws.id === workspaceId)
      setWorkspace(currentWorkspace || null)
      setMembers(membersData)
      setInvitations(invitationsData)
      setActivityLogs(activityData)
      
      // Encontrar el miembro actual
      const currentMemberData = membersData.find(member => member.userId === currentUserId)
      setCurrentMember(currentMemberData || null)
    } catch (error) {
      console.error('Error loading team data:', error)
      toast({
        title: 'Error',
        description: 'No se pudieron cargar los datos del equipo.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleInviteMember = async () => {
    if (!inviteEmail || !currentMember) return

    try {
      const invitation = await inviteMember(workspaceId, currentUserId, {
        email: inviteEmail,
        role: inviteRole
      })
      
      setInvitations(prev => [invitation, ...prev])
      setInviteEmail('')
      setInviteRole('member')
      setShowInviteDialog(false)
      
      toast({
        title: 'Invitación enviada',
        description: `Se envió una invitación a ${inviteEmail}`,
      })
    } catch (error) {
      console.error('Error inviting member:', error)
      toast({
        title: 'Error',
        description: 'No se pudo enviar la invitación.',
        variant: 'destructive',
      })
    }
  }

  const handleUpdateRole = async (userId: string, newRole: 'admin' | 'member' | 'viewer') => {
    try {
      const updatedMember = await updateMemberRole(workspaceId, userId, newRole)
      if (updatedMember) {
        setMembers(prev => prev.map(member => 
          member.userId === userId ? updatedMember : member
        ))
        toast({
          title: 'Rol actualizado',
          description: `El rol se cambió a ${getRoleDisplayName(newRole)}`,
        })
      }
    } catch (error) {
      console.error('Error updating role:', error)
      toast({
        title: 'Error',
        description: 'No se pudo actualizar el rol.',
        variant: 'destructive',
      })
    }
  }

  const handleRemoveMember = async (userId: string, memberName: string) => {
    if (!confirm(`¿Estás seguro de que quieres remover a ${memberName} del equipo?`)) {
      return
    }

    try {
      const success = await removeMember(workspaceId, userId)
      if (success) {
        setMembers(prev => prev.filter(member => member.userId !== userId))
        toast({
          title: 'Miembro removido',
          description: `${memberName} ha sido removido del equipo`,
        })
      }
    } catch (error) {
      console.error('Error removing member:', error)
      toast({
        title: 'Error',
        description: 'No se pudo remover al miembro.',
        variant: 'destructive',
      })
    }
  }

  const handleCancelInvitation = async (invitationId: string, email: string) => {
    try {
      const success = await cancelInvitation(invitationId)
      if (success) {
        setInvitations(prev => prev.filter(inv => inv.id !== invitationId))
        toast({
          title: 'Invitación cancelada',
          description: `Se canceló la invitación para ${email}`,
        })
      }
    } catch (error) {
      console.error('Error canceling invitation:', error)
      toast({
        title: 'Error',
        description: 'No se pudo cancelar la invitación.',
        variant: 'destructive',
      })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-lg text-muted-foreground">Cargando datos del equipo...</p>
        </div>
      </div>
    )
  }

  if (!workspace || !currentMember) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">No se pudo cargar el equipo</h2>
          <p className="text-muted-foreground">Por favor, inténtalo de nuevo más tarde.</p>
        </div>
      </div>
    )
  }

  const canInvite = canInviteMembers(currentMember.role, workspace.settings)
  const canManageMembers = hasPermission(currentMember.permissions, PERMISSIONS.MEMBERS_EDIT)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Users className="h-8 w-8 mr-3 text-blue-600" />
            Gestión de Equipo
          </h1>
          <p className="text-gray-600 mt-2">
            {workspace.name} • {members.length} miembros
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            onClick={() => setShowActivityDialog(true)}
            variant="outline"
            className="flex items-center"
          >
            <Activity className="h-4 w-4 mr-2" />
            Actividad
          </Button>
          {canInvite && (
            <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
              <DialogTrigger asChild>
                <Button className="flex items-center">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Invitar Miembro
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Invitar nuevo miembro</DialogTitle>
                  <DialogDescription>
                    Envía una invitación por email para unirse al equipo.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="usuario@empresa.com"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="role">Rol</Label>
                    <Select value={inviteRole} onValueChange={(value: any) => setInviteRole(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Administrador</SelectItem>
                        <SelectItem value="member">Miembro</SelectItem>
                        <SelectItem value="viewer">Observador</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowInviteDialog(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleInviteMember} disabled={!inviteEmail}>
                    <Send className="h-4 w-4 mr-2" />
                    Enviar Invitación
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Miembros</p>
                <p className="text-2xl font-semibold text-gray-900">{members.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Activos</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {members.filter(m => m.status === 'active').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Pendientes</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {members.filter(m => m.status === 'pending').length + invitations.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Shield className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Administradores</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {members.filter(m => ['owner', 'admin'].includes(m.role)).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Members Table */}
      <Card>
        <CardHeader>
          <CardTitle>Miembros del Equipo</CardTitle>
          <CardDescription>
            Gestiona los miembros y sus permisos en el workspace
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Miembro</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Última Actividad</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                        {member.avatar ? (
                          <img 
                            src={member.avatar} 
                            alt={member.name}
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        ) : (
                          <User className="h-5 w-5 text-gray-500" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium">{member.name}</div>
                        <div className="text-sm text-gray-500">{member.email}</div>
                      </div>
                      {member.role === 'owner' && (
                        <Crown className="h-4 w-4 text-yellow-500" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getRoleColor(member.role)}>
                      {getRoleDisplayName(member.role)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(member.status)}>
                      {getStatusDisplayName(member.status)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-500">
                      {member.lastActiveAt 
                        ? new Date(member.lastActiveAt).toLocaleDateString('es-ES')
                        : 'Nunca'
                      }
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    {canManageMembers && member.userId !== currentUserId && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Cambiar Rol</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          {member.role !== 'admin' && (
                            <DropdownMenuItem
                              onClick={() => handleUpdateRole(member.userId, 'admin')}
                            >
                              <Shield className="h-4 w-4 mr-2" />
                              Administrador
                            </DropdownMenuItem>
                          )}
                          {member.role !== 'member' && (
                            <DropdownMenuItem
                              onClick={() => handleUpdateRole(member.userId, 'member')}
                            >
                              <User className="h-4 w-4 mr-2" />
                              Miembro
                            </DropdownMenuItem>
                          )}
                          {member.role !== 'viewer' && (
                            <DropdownMenuItem
                              onClick={() => handleUpdateRole(member.userId, 'viewer')}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              Observador
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleRemoveMember(member.userId, member.name)}
                            className="text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Remover
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pending Invitations */}
      {invitations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Invitaciones Pendientes</CardTitle>
            <CardDescription>
              Invitaciones enviadas que aún no han sido aceptadas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {invitations.map((invitation) => (
                <div key={invitation.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-gray-400" />
                    <div>
                      <div className="font-medium">{invitation.email}</div>
                      <div className="text-sm text-gray-500">
                        Rol: {getRoleDisplayName(invitation.role)} • 
                        Enviada: {new Date(invitation.createdAt).toLocaleDateString('es-ES')}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="text-yellow-600">
                      Pendiente
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCancelInvitation(invitation.id, invitation.email)}
                    >
                      <XCircle className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Activity Dialog */}
      <Dialog open={showActivityDialog} onOpenChange={setShowActivityDialog}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Actividad del Equipo</DialogTitle>
            <DialogDescription>
              Historial de actividades recientes en el workspace
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-96 overflow-y-auto">
            <div className="space-y-4">
              {activityLogs.map((log) => (
                <div key={log.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <Activity className="h-4 w-4 text-blue-600" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium">
                      {log.action.replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </div>
                    <div className="text-sm text-gray-500">
                      {log.resource} • {new Date(log.createdAt).toLocaleString('es-ES')}
                    </div>
                    {log.details && (
                      <div className="text-xs text-gray-400 mt-1">
                        {JSON.stringify(log.details, null, 2)}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
