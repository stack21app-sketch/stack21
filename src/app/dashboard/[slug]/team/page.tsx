'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { 
  Users, 
  Plus, 
  Mail, 
  Crown,
  Shield,
  User,
  Settings,
  Trash2,
  Edit,
  MoreVertical,
  Search,
  Filter,
  Send,
  Check,
  X
} from 'lucide-react'

interface TeamMember {
  id: string
  name: string
  email: string
  role: 'owner' | 'admin' | 'member' | 'viewer'
  status: 'active' | 'pending' | 'suspended'
  joinedAt: Date
  lastActive: Date
  avatar?: string
}

interface Invitation {
  id: string
  email: string
  role: 'admin' | 'member' | 'viewer'
  status: 'pending' | 'accepted' | 'expired'
  invitedAt: Date
  invitedBy: string
}

export default function TeamPage() {
  const params = useParams()
  const { data: session } = useSession()
  const slug = params.slug as string

  const [members, setMembers] = useState<TeamMember[]>([])
  const [invitations, setInvitations] = useState<Invitation[]>([])
  const [showInviteForm, setShowInviteForm] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState<'admin' | 'member' | 'viewer'>('member')
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState<'all' | 'owner' | 'admin' | 'member' | 'viewer'>('all')
  const [loading, setLoading] = useState(false)

  const mockMembers: TeamMember[] = [
    {
      id: '1',
      name: 'Tu Nombre',
      email: session?.user?.email || 'tu@email.com',
      role: 'owner',
      status: 'active',
      joinedAt: new Date('2024-01-01'),
      lastActive: new Date(Date.now() - 5 * 60 * 1000), // 5 minutos atrás
      avatar: session?.user?.image || undefined
    },
    {
      id: '2',
      name: 'Juan Pérez',
      email: 'juan@empresa.com',
      role: 'admin',
      status: 'active',
      joinedAt: new Date('2024-01-15'),
      lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 horas atrás
    },
    {
      id: '3',
      name: 'María García',
      email: 'maria@empresa.com',
      role: 'member',
      status: 'active',
      joinedAt: new Date('2024-02-01'),
      lastActive: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 día atrás
    },
    {
      id: '4',
      name: 'Carlos López',
      email: 'carlos@empresa.com',
      role: 'viewer',
      status: 'pending',
      joinedAt: new Date('2024-02-10'),
      lastActive: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 días atrás
    }
  ]

  const mockInvitations: Invitation[] = [
    {
      id: '1',
      email: 'ana@empresa.com',
      role: 'member',
      status: 'pending',
      invitedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 días atrás
      invitedBy: 'Tu Nombre'
    },
    {
      id: '2',
      email: 'pedro@empresa.com',
      role: 'admin',
      status: 'pending',
      invitedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 días atrás
      invitedBy: 'Tu Nombre'
    }
  ]

  useEffect(() => {
    setMembers(mockMembers)
    setInvitations(mockInvitations)
  }, [])

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'owner': return <Crown className="h-4 w-4 text-yellow-400" />
      case 'admin': return <Shield className="h-4 w-4 text-purple-400" />
      case 'member': return <User className="h-4 w-4 text-blue-400" />
      case 'viewer': return <Users className="h-4 w-4 text-gray-400" />
      default: return <User className="h-4 w-4 text-gray-400" />
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'owner': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'admin': return 'bg-purple-500/20 text-purple-400 border-purple-500/30'
      case 'member': return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      case 'viewer': return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'suspended': return 'bg-red-500/20 text-red-400 border-red-500/30'
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  const handleInviteMember = async () => {
    if (!inviteEmail.trim()) return

    setLoading(true)
    try {
      const response = await fetch('/api/team/invite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: inviteEmail,
          role: inviteRole
        }),
      })

      if (response.ok) {
        const newInvitation: Invitation = {
          id: Date.now().toString(),
          email: inviteEmail,
          role: inviteRole,
          status: 'pending',
          invitedAt: new Date(),
          invitedBy: session?.user?.name || 'Tu Nombre'
        }
        setInvitations(prev => [...prev, newInvitation])
        setInviteEmail('')
        setShowInviteForm(false)
      }
    } catch (error) {
      console.error('Error inviting member:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveMember = async (memberId: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar a este miembro?')) {
      setMembers(prev => prev.filter(member => member.id !== memberId))
    }
  }

  const handleChangeRole = async (memberId: string, newRole: string) => {
    setMembers(prev => 
      prev.map(member => 
        member.id === memberId ? { ...member, role: newRole as any } : member
      )
    )
  }

  const handleResendInvitation = async (invitationId: string) => {
    // Simulación de reenvío de invitación
    alert('Invitación reenviada')
  }

  const handleCancelInvitation = async (invitationId: string) => {
    setInvitations(prev => prev.filter(inv => inv.id !== invitationId))
  }

  const filteredMembers = members.filter(member => {
    const matchesSearch = 
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesRole = roleFilter === 'all' || member.role === roleFilter
    
    return matchesSearch && matchesRole
  })

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white">No autorizado</h2>
          <p className="text-gray-300">Debes iniciar sesión para gestionar el equipo</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-cyan-400 mr-3" />
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  Gestión de Equipo
                </h1>
                <p className="text-sm text-gray-300">Administra miembros y permisos del workspace</p>
              </div>
            </div>
            <Button 
              onClick={() => setShowInviteForm(true)}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Invitar Miembro
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Invite Form Modal */}
        {showInviteForm && (
          <Card className="bg-black/20 backdrop-blur-lg border-white/10 mb-8">
            <CardHeader>
              <CardTitle className="text-lg text-white">Invitar Nuevo Miembro</CardTitle>
              <CardDescription className="text-gray-400">
                Envía una invitación por email para unirse al workspace
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-white">Email</Label>
                  <Input
                    type="email"
                    placeholder="usuario@empresa.com"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    className="bg-black/20 border-white/20 text-white placeholder-gray-400"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white">Rol</Label>
                  <select
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value as any)}
                    className="w-full p-2 bg-black/20 border border-white/20 rounded-lg text-white"
                  >
                    <option value="viewer">Viewer - Solo lectura</option>
                    <option value="member">Member - Acceso completo</option>
                    <option value="admin">Admin - Gestión completa</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={handleInviteMember}
                  disabled={loading || !inviteEmail.trim()}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  {loading ? (
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  ) : (
                    <Send className="h-4 w-4 mr-2" />
                  )}
                  Enviar Invitación
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowInviteForm(false)}
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Filters */}
        <Card className="bg-black/20 backdrop-blur-lg border-white/10 mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar miembros..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-black/20 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                {[
                  { id: 'all', name: 'Todos' },
                  { id: 'owner', name: 'Owners' },
                  { id: 'admin', name: 'Admins' },
                  { id: 'member', name: 'Members' },
                  { id: 'viewer', name: 'Viewers' }
                ].map((filter) => (
                  <Button
                    key={filter.id}
                    size="sm"
                    variant={roleFilter === filter.id ? "default" : "outline"}
                    onClick={() => setRoleFilter(filter.id as any)}
                    className={roleFilter === filter.id ? 'bg-purple-600 hover:bg-purple-700' : 'border-white/20 text-white hover:bg-white/10'}
                  >
                    {filter.name}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Team Members */}
        <Card className="bg-black/20 backdrop-blur-lg border-white/10 mb-8">
          <CardHeader>
            <CardTitle className="text-lg text-white flex items-center">
              <Users className="h-5 w-5 mr-2 text-purple-400" />
              Miembros del Equipo ({filteredMembers.length})
            </CardTitle>
            <CardDescription className="text-gray-400">
              Gestiona los permisos y roles de los miembros
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredMembers.map((member) => (
                <div key={member.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                      {member.avatar ? (
                        <img src={member.avatar} alt={member.name} className="w-10 h-10 rounded-full" />
                      ) : (
                        member.name.charAt(0).toUpperCase()
                      )}
                    </div>
                    <div>
                      <h4 className="text-white font-medium">{member.name}</h4>
                      <p className="text-sm text-gray-400">{member.email}</p>
                      <p className="text-xs text-gray-500">
                        Última actividad: {member.lastActive.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge className={getRoleColor(member.role)}>
                      {getRoleIcon(member.role)}
                      <span className="ml-1 capitalize">{member.role}</span>
                    </Badge>
                    <Badge className={getStatusColor(member.status)}>
                      {member.status === 'active' ? 'Activo' : 
                       member.status === 'pending' ? 'Pendiente' : 'Suspendido'}
                    </Badge>
                    {member.role !== 'owner' && (
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleChangeRole(member.id, 'admin')}
                          className="h-8 w-8 p-0 text-gray-400 hover:text-purple-400"
                        >
                          <Shield className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleChangeRole(member.id, 'member')}
                          className="h-8 w-8 p-0 text-gray-400 hover:text-blue-400"
                        >
                          <User className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleChangeRole(member.id, 'viewer')}
                          className="h-8 w-8 p-0 text-gray-400 hover:text-gray-400"
                        >
                          <Users className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleRemoveMember(member.id)}
                          className="h-8 w-8 p-0 text-gray-400 hover:text-red-400"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pending Invitations */}
        {invitations.length > 0 && (
          <Card className="bg-black/20 backdrop-blur-lg border-white/10">
            <CardHeader>
              <CardTitle className="text-lg text-white flex items-center">
                <Mail className="h-5 w-5 mr-2 text-yellow-400" />
                Invitaciones Pendientes ({invitations.length})
              </CardTitle>
              <CardDescription className="text-gray-400">
                Invitaciones enviadas que aún no han sido aceptadas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {invitations.map((invitation) => (
                  <div key={invitation.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                        <Mail className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="text-white font-medium">{invitation.email}</h4>
                        <p className="text-sm text-gray-400">
                          Invitado por {invitation.invitedBy} • {invitation.invitedAt.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge className={getRoleColor(invitation.role)}>
                        {getRoleIcon(invitation.role)}
                        <span className="ml-1 capitalize">{invitation.role}</span>
                      </Badge>
                      <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                        Pendiente
                      </Badge>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleResendInvitation(invitation.id)}
                          className="border-white/20 text-white hover:bg-white/10"
                        >
                          <Send className="h-4 w-4 mr-1" />
                          Reenviar
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleCancelInvitation(invitation.id)}
                          className="border-white/20 text-white hover:bg-white/10"
                        >
                          <X className="h-4 w-4 mr-1" />
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
