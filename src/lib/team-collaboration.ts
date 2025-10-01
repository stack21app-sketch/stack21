// Sistema de Colaboración en Equipo para Stack21

export interface TeamMember {
  id: string;
  userId: string;
  teamId: string;
  role: 'owner' | 'admin' | 'editor' | 'viewer';
  permissions: Permission[];
  joinedAt: Date;
  lastActive?: Date;
  invitedBy: string;
  status: 'active' | 'inactive' | 'pending';
}

export interface Team {
  id: string;
  name: string;
  description: string;
  ownerId: string;
  members: TeamMember[];
  settings: TeamSettings;
  createdAt: Date;
  updatedAt: Date;
  plan: 'free' | 'pro' | 'enterprise';
  memberLimit: number;
}

export interface TeamSettings {
  allowInvites: boolean;
  requireApproval: boolean;
  defaultRole: 'editor' | 'viewer';
  enableNotifications: boolean;
  enableComments: boolean;
  enableVersionHistory: boolean;
}

export interface Permission {
  resource: 'workflows' | 'integrations' | 'analytics' | 'settings' | 'members';
  actions: ('read' | 'write' | 'delete' | 'share')[];
}

export interface TeamInvite {
  id: string;
  teamId: string;
  email: string;
  role: 'admin' | 'editor' | 'viewer';
  invitedBy: string;
  invitedAt: Date;
  expiresAt: Date;
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  token: string;
}

export interface ActivityLog {
  id: string;
  teamId: string;
  userId: string;
  action: string;
  resource: string;
  resourceId?: string;
  details: Record<string, any>;
  timestamp: Date;
}

export interface Comment {
  id: string;
  resourceType: 'workflow' | 'integration' | 'analytics';
  resourceId: string;
  userId: string;
  content: string;
  mentions: string[];
  replies: Comment[];
  createdAt: Date;
  updatedAt?: Date;
  resolved: boolean;
}

class TeamCollaborationManager {
  private teams: Map<string, Team> = new Map();
  private invites: Map<string, TeamInvite> = new Map();
  private activities: Map<string, ActivityLog> = new Map();
  private comments: Map<string, Comment> = new Map();

  // Crear equipo
  createTeam(ownerId: string, name: string, description: string): Team {
    const team: Team = {
      id: `team_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name,
      description,
      ownerId,
      members: [{
        id: `member_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId: ownerId,
        teamId: '',
        role: 'owner',
        permissions: this.getAllPermissions(),
        joinedAt: new Date(),
        invitedBy: ownerId,
        status: 'active'
      }],
      settings: {
        allowInvites: true,
        requireApproval: false,
        defaultRole: 'viewer',
        enableNotifications: true,
        enableComments: true,
        enableVersionHistory: true
      },
      createdAt: new Date(),
      updatedAt: new Date(),
      plan: 'free',
      memberLimit: 5
    };

    team.members[0].teamId = team.id;
    this.teams.set(team.id, team);
    
    this.logActivity(team.id, ownerId, 'team_created', 'team', team.id, {
      teamName: name
    });

    return team;
  }

  // Invitar miembro
  inviteMember(teamId: string, invitedBy: string, email: string, role: 'admin' | 'editor' | 'viewer'): TeamInvite {
    const team = this.teams.get(teamId);
    if (!team) {
      throw new Error('Equipo no encontrado');
    }

    // Verificar permisos
    const inviter = team.members.find(m => m.userId === invitedBy);
    if (!inviter || !this.canInviteMembers(inviter.role)) {
      throw new Error('Sin permisos para invitar miembros');
    }

    // Verificar límite de miembros
    if (team.members.length >= team.memberLimit) {
      throw new Error('Límite de miembros alcanzado');
    }

    // Verificar si ya está invitado o es miembro
    const existingMember = team.members.find(m => m.userId === email);
    if (existingMember) {
      throw new Error('El usuario ya es miembro del equipo');
    }

    const existingInvite = Array.from(this.invites.values())
      .find(inv => inv.teamId === teamId && inv.email === email && inv.status === 'pending');
    if (existingInvite) {
      throw new Error('Ya existe una invitación pendiente para este email');
    }

    const invite: TeamInvite = {
      id: `invite_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      teamId,
      email,
      role,
      invitedBy,
      invitedAt: new Date(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 días
      status: 'pending',
      token: this.generateInviteToken()
    };

    this.invites.set(invite.id, invite);
    
    this.logActivity(teamId, invitedBy, 'member_invited', 'member', invite.id, {
      email,
      role
    });

    return invite;
  }

  // Aceptar invitación
  acceptInvite(inviteToken: string, userId: string): TeamMember {
    const invite = Array.from(this.invites.values())
      .find(inv => inv.token === inviteToken && inv.status === 'pending');
    
    if (!invite) {
      throw new Error('Invitación no encontrada o expirada');
    }

    if (invite.expiresAt < new Date()) {
      invite.status = 'expired';
      throw new Error('La invitación ha expirado');
    }

    const team = this.teams.get(invite.teamId);
    if (!team) {
      throw new Error('Equipo no encontrado');
    }

    // Crear miembro
    const member: TeamMember = {
      id: `member_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      teamId: invite.teamId,
      role: invite.role,
      permissions: this.getRolePermissions(invite.role),
      joinedAt: new Date(),
      invitedBy: invite.invitedBy,
      status: 'active'
    };

    team.members.push(member);
    team.updatedAt = new Date();
    
    invite.status = 'accepted';

    this.logActivity(invite.teamId, userId, 'member_joined', 'member', member.id, {
      role: invite.role
    });

    return member;
  }

  // Cambiar rol de miembro
  changeMemberRole(teamId: string, changerId: string, memberId: string, newRole: 'admin' | 'editor' | 'viewer'): TeamMember {
    const team = this.teams.get(teamId);
    if (!team) {
      throw new Error('Equipo no encontrado');
    }

    const changer = team.members.find(m => m.userId === changerId);
    const member = team.members.find(m => m.id === memberId);

    if (!changer || !member) {
      throw new Error('Miembro no encontrado');
    }

    // Verificar permisos
    if (!this.canManageMembers(changer.role) || member.role === 'owner') {
      throw new Error('Sin permisos para cambiar roles');
    }

    const oldRole = member.role;
    member.role = newRole;
    member.permissions = this.getRolePermissions(newRole);
    team.updatedAt = new Date();

    this.logActivity(teamId, changerId, 'role_changed', 'member', memberId, {
      oldRole,
      newRole
    });

    return member;
  }

  // Remover miembro
  removeMember(teamId: string, removerId: string, memberId: string): boolean {
    const team = this.teams.get(teamId);
    if (!team) {
      throw new Error('Equipo no encontrado');
    }

    const remover = team.members.find(m => m.userId === removerId);
    const memberToRemove = team.members.find(m => m.id === memberId);

    if (!remover || !memberToRemove) {
      throw new Error('Miembro no encontrado');
    }

    // Verificar permisos
    if (!this.canManageMembers(remover.role) || memberToRemove.role === 'owner') {
      throw new Error('Sin permisos para remover miembros');
    }

    // Remover miembro
    team.members = team.members.filter(m => m.id !== memberId);
    team.updatedAt = new Date();

    this.logActivity(teamId, removerId, 'member_removed', 'member', memberId, {
      removedUserId: memberToRemove.userId,
      role: memberToRemove.role
    });

    return true;
  }

  // Agregar comentario
  addComment(userId: string, resourceType: 'workflow' | 'integration' | 'analytics', resourceId: string, content: string, mentions: string[] = []): Comment {
    const comment: Comment = {
      id: `comment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      resourceType,
      resourceId,
      userId,
      content,
      mentions,
      replies: [],
      createdAt: new Date(),
      resolved: false
    };

    this.comments.set(comment.id, comment);

    // Log activity para el equipo (asumiendo que el recurso pertenece a un equipo)
    // En una implementación real, se buscaría el equipo basado en el recurso
    
    return comment;
  }

  // Responder comentario
  replyToComment(userId: string, commentId: string, content: string): Comment {
    const parentComment = this.comments.get(commentId);
    if (!parentComment) {
      throw new Error('Comentario no encontrado');
    }

    const reply: Comment = {
      id: `reply_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      resourceType: parentComment.resourceType,
      resourceId: parentComment.resourceId,
      userId,
      content,
      mentions: [],
      replies: [],
      createdAt: new Date(),
      resolved: false
    };

    parentComment.replies.push(reply);
    this.comments.set(reply.id, reply);

    return reply;
  }

  // Resolver comentario
  resolveComment(userId: string, commentId: string): Comment {
    const comment = this.comments.get(commentId);
    if (!comment) {
      throw new Error('Comentario no encontrado');
    }

    comment.resolved = true;
    return comment;
  }

  // Obtener actividad del equipo
  getTeamActivity(teamId: string, limit: number = 50): ActivityLog[] {
    return Array.from(this.activities.values())
      .filter(activity => activity.teamId === teamId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  // Obtener comentarios de recurso
  getResourceComments(resourceType: string, resourceId: string): Comment[] {
    return Array.from(this.comments.values())
      .filter(comment => comment.resourceType === resourceType && comment.resourceId === resourceId)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }

  // Verificar permisos
  hasPermission(userId: string, teamId: string, resource: string, action: string): boolean {
    const team = this.teams.get(teamId);
    if (!team) {
      return false;
    }

    const member = team.members.find(m => m.userId === userId && m.status === 'active');
    if (!member) {
      return false;
    }

    const permission = member.permissions.find(p => p.resource === resource);
    return permission ? permission.actions.includes(action as any) : false;
  }

  // Métodos privados
  private canInviteMembers(role: string): boolean {
    return ['owner', 'admin'].includes(role);
  }

  private canManageMembers(role: string): boolean {
    return ['owner', 'admin'].includes(role);
  }

  private getAllPermissions(): Permission[] {
    return [
      { resource: 'workflows', actions: ['read', 'write', 'delete', 'share'] },
      { resource: 'integrations', actions: ['read', 'write', 'delete', 'share'] },
      { resource: 'analytics', actions: ['read', 'write', 'delete', 'share'] },
      { resource: 'settings', actions: ['read', 'write', 'delete', 'share'] },
      { resource: 'members', actions: ['read', 'write', 'delete', 'share'] }
    ];
  }

  private getRolePermissions(role: string): Permission[] {
    switch (role) {
      case 'owner':
      case 'admin':
        return this.getAllPermissions();
      case 'editor':
        return [
          { resource: 'workflows', actions: ['read', 'write', 'share'] },
          { resource: 'integrations', actions: ['read', 'write', 'share'] },
          { resource: 'analytics', actions: ['read'] },
          { resource: 'settings', actions: ['read'] },
          { resource: 'members', actions: ['read'] }
        ];
      case 'viewer':
        return [
          { resource: 'workflows', actions: ['read'] },
          { resource: 'integrations', actions: ['read'] },
          { resource: 'analytics', actions: ['read'] },
          { resource: 'settings', actions: ['read'] },
          { resource: 'members', actions: ['read'] }
        ];
      default:
        return [];
    }
  }

  private generateInviteToken(): string {
    return `invite_${Date.now()}_${Math.random().toString(36).substr(2, 16)}`;
  }

  private logActivity(teamId: string, userId: string, action: string, resource: string, resourceId?: string, details: Record<string, any> = {}): void {
    const activity: ActivityLog = {
      id: `activity_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      teamId,
      userId,
      action,
      resource,
      resourceId,
      details,
      timestamp: new Date()
    };

    this.activities.set(activity.id, activity);
  }

  // Métodos públicos
  getTeam(id: string): Team | undefined {
    return this.teams.get(id);
  }

  getUserTeams(userId: string): Team[] {
    return Array.from(this.teams.values())
      .filter(team => team.members.some(member => member.userId === userId && member.status === 'active'));
  }

  getTeamMembers(teamId: string): TeamMember[] {
    const team = this.teams.get(teamId);
    return team ? team.members.filter(m => m.status === 'active') : [];
  }

  updateTeamSettings(teamId: string, userId: string, settings: Partial<TeamSettings>): Team {
    const team = this.teams.get(teamId);
    if (!team) {
      throw new Error('Equipo no encontrado');
    }

    // Verificar permisos
    if (!this.hasPermission(userId, teamId, 'settings', 'write')) {
      throw new Error('Sin permisos para modificar configuración');
    }

    team.settings = { ...team.settings, ...settings };
    team.updatedAt = new Date();

    this.logActivity(teamId, userId, 'settings_updated', 'team', teamId, settings);

    return team;
  }

  deleteTeam(teamId: string, userId: string): boolean {
    const team = this.teams.get(teamId);
    if (!team) {
      throw new Error('Equipo no encontrado');
    }

    // Solo el owner puede eliminar el equipo
    if (team.ownerId !== userId) {
      throw new Error('Solo el propietario puede eliminar el equipo');
    }

    this.teams.delete(teamId);
    
    // Limpiar invitaciones relacionadas
    Array.from(this.invites.values())
      .filter(invite => invite.teamId === teamId)
      .forEach(invite => this.invites.delete(invite.id));

    return true;
  }

  getTeamStats(teamId: string): {
    memberCount: number;
    activeMembers: number;
    pendingInvites: number;
    recentActivity: number;
    commentsCount: number;
  } {
    const team = this.teams.get(teamId);
    if (!team) {
      throw new Error('Equipo no encontrado');
    }

    const pendingInvites = Array.from(this.invites.values())
      .filter(invite => invite.teamId === teamId && invite.status === 'pending').length;

    const recentActivity = Array.from(this.activities.values())
      .filter(activity => 
        activity.teamId === teamId && 
        activity.timestamp > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      ).length;

    const commentsCount = Array.from(this.comments.values()).length;

    return {
      memberCount: team.members.length,
      activeMembers: team.members.filter(m => m.status === 'active').length,
      pendingInvites,
      recentActivity,
      commentsCount
    };
  }
}

export const teamCollaborationManager = new TeamCollaborationManager();
