'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TimeDisplay } from '@/components/TimeDisplay';
import { 
  Users, 
  UserPlus, 
  Settings, 
  Crown, 
  Shield, 
  Edit3, 
  Eye, 
  Mail, 
  Clock, 
  Activity,
  MessageSquare,
  Trash2,
  Copy,
  Check,
  X,
  MoreHorizontal
} from 'lucide-react';
import { Team, TeamMember, TeamInvite, ActivityLog, teamCollaborationManager } from '@/lib/team-collaboration';

interface TeamManagementProps {
  userId: string;
  onTeamChange?: (team: Team) => void;
}

export function TeamManagement({ userId, onTeamChange }: TeamManagementProps) {
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [activeTab, setActiveTab] = useState<'members' | 'invites' | 'activity' | 'settings'>('members');
  const [showCreateTeam, setShowCreateTeam] = useState(false);
  const [showInviteMember, setShowInviteMember] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'admin' | 'editor' | 'viewer'>('viewer');
  const [teamName, setTeamName] = useState('');
  const [teamDescription, setTeamDescription] = useState('');

  // Cargar equipos del usuario
  useEffect(() => {
    const userTeams = teamCollaborationManager.getUserTeams(userId);
    setTeams(userTeams);
    if (userTeams.length > 0 && !selectedTeam) {
      setSelectedTeam(userTeams[0]);
    }
  }, [userId]);

  // Crear equipo
  const handleCreateTeam = () => {
    if (!teamName.trim()) return;

    try {
      const newTeam = teamCollaborationManager.createTeam(userId, teamName, teamDescription);
      setTeams(prev => [...prev, newTeam]);
      setSelectedTeam(newTeam);
      setShowCreateTeam(false);
      setTeamName('');
      setTeamDescription('');
      onTeamChange?.(newTeam);
    } catch (error) {
      console.error('Error creando equipo:', error);
    }
  };

  // Invitar miembro
  const handleInviteMember = () => {
    if (!selectedTeam || !inviteEmail.trim()) return;

    try {
      teamCollaborationManager.inviteMember(selectedTeam.id, userId, inviteEmail, inviteRole);
      setShowInviteMember(false);
      setInviteEmail('');
      setInviteRole('viewer');
      // Actualizar datos
      const updatedTeams = teamCollaborationManager.getUserTeams(userId);
      setTeams(updatedTeams);
      const updatedTeam = updatedTeams.find(t => t.id === selectedTeam.id);
      if (updatedTeam) setSelectedTeam(updatedTeam);
    } catch (error) {
      console.error('Error invitando miembro:', error);
    }
  };

  // Cambiar rol de miembro
  const handleChangeRole = (memberId: string, newRole: 'admin' | 'editor' | 'viewer') => {
    if (!selectedTeam) return;

    try {
      teamCollaborationManager.changeMemberRole(selectedTeam.id, userId, memberId, newRole);
      // Actualizar datos
      const updatedTeams = teamCollaborationManager.getUserTeams(userId);
      setTeams(updatedTeams);
      const updatedTeam = updatedTeams.find(t => t.id === selectedTeam.id);
      if (updatedTeam) setSelectedTeam(updatedTeam);
    } catch (error) {
      console.error('Error cambiando rol:', error);
    }
  };

  // Remover miembro
  const handleRemoveMember = (memberId: string) => {
    if (!selectedTeam) return;

    try {
      teamCollaborationManager.removeMember(selectedTeam.id, userId, memberId);
      // Actualizar datos
      const updatedTeams = teamCollaborationManager.getUserTeams(userId);
      setTeams(updatedTeams);
      const updatedTeam = updatedTeams.find(t => t.id === selectedTeam.id);
      if (updatedTeam) setSelectedTeam(updatedTeam);
    } catch (error) {
      console.error('Error removiendo miembro:', error);
    }
  };

  // Obtener icono de rol
  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'owner': return <Crown className="w-4 h-4 text-yellow-500" />;
      case 'admin': return <Shield className="w-4 h-4 text-blue-500" />;
      case 'editor': return <Edit3 className="w-4 h-4 text-green-500" />;
      case 'viewer': return <Eye className="w-4 h-4 text-gray-500" />;
      default: return null;
    }
  };

  // Obtener color de rol
  const getRoleColor = (role: string) => {
    switch (role) {
      case 'owner': return 'bg-yellow-100 text-yellow-800';
      case 'admin': return 'bg-blue-100 text-blue-800';
      case 'editor': return 'bg-green-100 text-green-800';
      case 'viewer': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!selectedTeam) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Sin equipos</h3>
          <p className="text-gray-600 mb-6">Crea tu primer equipo para empezar a colaborar</p>
          <button
            onClick={() => setShowCreateTeam(true)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Crear Equipo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <select
              value={selectedTeam.id}
              onChange={(e) => {
                const team = teams.find(t => t.id === e.target.value);
                if (team) setSelectedTeam(team);
              }}
              className="text-xl font-semibold bg-transparent border-none outline-none cursor-pointer"
            >
              {teams.map(team => (
                <option key={team.id} value={team.id}>{team.name}</option>
              ))}
            </select>
            <span className={`px-2 py-1 text-xs rounded-full ${
              selectedTeam.plan === 'enterprise' ? 'bg-purple-100 text-purple-800' :
              selectedTeam.plan === 'pro' ? 'bg-blue-100 text-blue-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {selectedTeam.plan}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowInviteMember(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <UserPlus className="w-4 h-4" />
              Invitar
            </button>
            <button
              onClick={() => setShowCreateTeam(true)}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <Users className="w-4 h-4" />
              Nuevo Equipo
            </button>
          </div>
        </div>

        <p className="text-gray-600 mt-2">{selectedTeam.description}</p>

        {/* Tabs */}
        <div className="flex gap-6 mt-6 border-b border-gray-200">
          {[
            { id: 'members', label: 'Miembros', icon: Users },
            { id: 'invites', label: 'Invitaciones', icon: Mail },
            { id: 'activity', label: 'Actividad', icon: Activity },
            { id: 'settings', label: 'Configuración', icon: Settings }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6">
        {activeTab === 'members' && (
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Miembros del Equipo ({selectedTeam.members.length})</h3>
            
            <div className="bg-white rounded-lg border border-gray-200">
              {selectedTeam.members.map((member, index) => (
                <div key={member.id} className={`p-4 ${index !== selectedTeam.members.length - 1 ? 'border-b border-gray-100' : ''}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {member.userId.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{member.userId}</span>
                          {getRoleIcon(member.role)}
                          <span className={`px-2 py-1 text-xs rounded-full ${getRoleColor(member.role)}`}>
                            {member.role}
                          </span>
                        </div>
                        <div className="text-sm text-gray-500">
                          Se unió {member.joinedAt.toLocaleDateString()}
                          {member.lastActive && ` • Activo ${member.lastActive.toLocaleDateString()}`}
                        </div>
                      </div>
                    </div>
                    
                    {member.role !== 'owner' && teamCollaborationManager.hasPermission(userId, selectedTeam.id, 'members', 'write') && (
                      <div className="flex items-center gap-2">
                        <select
                          value={member.role}
                          onChange={(e) => handleChangeRole(member.id, e.target.value as any)}
                          className="text-sm border border-gray-300 rounded px-2 py-1"
                        >
                          <option value="viewer">Viewer</option>
                          <option value="editor">Editor</option>
                          <option value="admin">Admin</option>
                        </select>
                        <button
                          onClick={() => handleRemoveMember(member.id)}
                          className="p-1 text-red-500 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'invites' && (
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Invitaciones Pendientes</h3>
            
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-4 text-center text-gray-500">
                No hay invitaciones pendientes
              </div>
            </div>
          </div>
        )}

        {activeTab === 'activity' && (
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Actividad Reciente</h3>
            
            <div className="bg-white rounded-lg border border-gray-200">
              {teamCollaborationManager.getTeamActivity(selectedTeam.id, 10).map((activity, index) => (
                <div key={activity.id} className={`p-4 ${index !== 9 ? 'border-b border-gray-100' : ''}`}>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Activity className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm">
                        <span className="font-medium">{activity.userId}</span>
                        <span className="text-gray-600"> {activity.action.replace('_', ' ')} </span>
                        <span className="font-medium">{activity.resource}</span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        <TimeDisplay timestamp={activity.timestamp} format="datetime" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-6">
            <h3 className="font-semibold text-lg">Configuración del Equipo</h3>
            
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Permitir invitaciones</h4>
                    <p className="text-sm text-gray-600">Los miembros pueden invitar a otros</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={selectedTeam.settings.allowInvites}
                    onChange={(e) => {
                      teamCollaborationManager.updateTeamSettings(selectedTeam.id, userId, {
                        allowInvites: e.target.checked
                      });
                      const updatedTeams = teamCollaborationManager.getUserTeams(userId);
                      setTeams(updatedTeams);
                      const updatedTeam = updatedTeams.find(t => t.id === selectedTeam.id);
                      if (updatedTeam) setSelectedTeam(updatedTeam);
                    }}
                    className="rounded"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Requerir aprobación</h4>
                    <p className="text-sm text-gray-600">Las invitaciones requieren aprobación</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={selectedTeam.settings.requireApproval}
                    onChange={(e) => {
                      teamCollaborationManager.updateTeamSettings(selectedTeam.id, userId, {
                        requireApproval: e.target.checked
                      });
                      const updatedTeams = teamCollaborationManager.getUserTeams(userId);
                      setTeams(updatedTeams);
                      const updatedTeam = updatedTeams.find(t => t.id === selectedTeam.id);
                      if (updatedTeam) setSelectedTeam(updatedTeam);
                    }}
                    className="rounded"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Habilitar comentarios</h4>
                    <p className="text-sm text-gray-600">Permitir comentarios en recursos</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={selectedTeam.settings.enableComments}
                    onChange={(e) => {
                      teamCollaborationManager.updateTeamSettings(selectedTeam.id, userId, {
                        enableComments: e.target.checked
                      });
                      const updatedTeams = teamCollaborationManager.getUserTeams(userId);
                      setTeams(updatedTeams);
                      const updatedTeam = updatedTeams.find(t => t.id === selectedTeam.id);
                      if (updatedTeam) setSelectedTeam(updatedTeam);
                    }}
                    className="rounded"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modales */}
      <AnimatePresence>
        {showCreateTeam && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-lg p-6 w-full max-w-md mx-4"
            >
              <h3 className="text-lg font-semibold mb-4">Crear Nuevo Equipo</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre del equipo
                  </label>
                  <input
                    type="text"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Mi equipo increíble"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descripción
                  </label>
                  <textarea
                    value={teamDescription}
                    onChange={(e) => setTeamDescription(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={3}
                    placeholder="Descripción opcional del equipo"
                  />
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowCreateTeam(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleCreateTeam}
                  disabled={!teamName.trim()}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  Crear
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {showInviteMember && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-lg p-6 w-full max-w-md mx-4"
            >
              <h3 className="text-lg font-semibold mb-4">Invitar Miembro</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="usuario@ejemplo.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rol
                  </label>
                  <select
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value as any)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="viewer">Viewer - Solo lectura</option>
                    <option value="editor">Editor - Puede editar</option>
                    <option value="admin">Admin - Acceso completo</option>
                  </select>
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowInviteMember(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleInviteMember}
                  disabled={!inviteEmail.trim()}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  Enviar Invitación
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
