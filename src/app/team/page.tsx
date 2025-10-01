'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  Users, 
  UserPlus, 
  Search, 
  Filter, 
  Download, 
  Settings,
  Crown,
  Shield,
  User,
  Eye,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Activity,
  TrendingUp,
  BarChart3,
  Plus,
  MoreVertical
} from 'lucide-react'
import TeamMemberCard from '@/components/team/team-member-card'
import InviteMemberModal from '@/components/team/invite-member-modal'

interface TeamMember {
  id: string
  name: string
  email: string
  avatar?: string
  role: 'owner' | 'admin' | 'member' | 'viewer'
  status: 'active' | 'pending' | 'inactive'
  joinedAt: Date
  lastActive: Date
  permissions: string[]
  department?: string
  phone?: string
  location?: string
  bio?: string
  skills: string[]
  projects: number
  tasksCompleted: number
  rating: number
}

const mockTeamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'María García',
    email: 'maria.garcia@empresa.com',
    role: 'owner',
    status: 'active',
    joinedAt: new Date('2023-01-15'),
    lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000),
    permissions: ['Gestionar usuarios', 'Configurar sistema', 'Ver analytics', 'Gestionar facturación'],
    department: 'Desarrollo',
    phone: '+34 612 345 678',
    location: 'Madrid, España',
    bio: 'CTO y fundadora de la empresa. Especialista en arquitectura de software.',
    skills: ['React', 'Node.js', 'AWS', 'Docker', 'Kubernetes'],
    projects: 12,
    tasksCompleted: 156,
    rating: 4.9
  },
  {
    id: '2',
    name: 'Carlos López',
    email: 'carlos.lopez@empresa.com',
    role: 'admin',
    status: 'active',
    joinedAt: new Date('2023-03-20'),
    lastActive: new Date(Date.now() - 30 * 60 * 1000),
    permissions: ['Gestionar usuarios', 'Configurar sistema', 'Ver analytics'],
    department: 'Marketing',
    phone: '+34 623 456 789',
    location: 'Barcelona, España',
    bio: 'Director de Marketing con 8 años de experiencia en growth marketing.',
    skills: ['Growth Marketing', 'SEO', 'Analytics', 'Content Strategy'],
    projects: 8,
    tasksCompleted: 89,
    rating: 4.7
  },
  {
    id: '3',
    name: 'Ana Martín',
    email: 'ana.martin@empresa.com',
    role: 'member',
    status: 'active',
    joinedAt: new Date('2023-06-10'),
    lastActive: new Date(Date.now() - 1 * 60 * 60 * 1000),
    permissions: ['Crear workflows', 'Ver proyectos', 'Colaborar en equipo', 'Usar IA'],
    department: 'Diseño',
    phone: '+34 634 567 890',
    location: 'Valencia, España',
    bio: 'Diseñadora UX/UI con pasión por la experiencia de usuario.',
    skills: ['Figma', 'Adobe Creative Suite', 'User Research', 'Prototyping'],
    projects: 15,
    tasksCompleted: 203,
    rating: 4.8
  },
  {
    id: '4',
    name: 'David Rodríguez',
    email: 'david.rodriguez@empresa.com',
    role: 'member',
    status: 'pending',
    joinedAt: new Date('2024-01-05'),
    lastActive: new Date(Date.now() - 24 * 60 * 60 * 1000),
    permissions: ['Crear workflows', 'Ver proyectos', 'Colaborar en equipo'],
    department: 'Ventas',
    phone: '+34 645 678 901',
    location: 'Sevilla, España',
    bio: 'Especialista en ventas B2B con enfoque en tecnología.',
    skills: ['Sales Strategy', 'CRM', 'Lead Generation', 'Negotiation'],
    projects: 3,
    tasksCompleted: 45,
    rating: 4.5
  },
  {
    id: '5',
    name: 'Laura Sánchez',
    email: 'laura.sanchez@empresa.com',
    role: 'viewer',
    status: 'active',
    joinedAt: new Date('2023-09-15'),
    lastActive: new Date(Date.now() - 3 * 60 * 60 * 1000),
    permissions: ['Ver proyectos', 'Ver reportes', 'Leer documentación'],
    department: 'Recursos Humanos',
    phone: '+34 656 789 012',
    location: 'Bilbao, España',
    bio: 'Especialista en RRHH con experiencia en gestión de talento.',
    skills: ['Talent Management', 'Recruitment', 'Employee Relations'],
    projects: 5,
    tasksCompleted: 67,
    rating: 4.6
  }
]

export default function TeamPage() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(mockTeamMembers)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRole, setFilterRole] = useState<'all' | TeamMember['role']>('all')
  const [filterStatus, setFilterStatus] = useState<'all' | TeamMember['status']>('all')
  const [filterDepartment, setFilterDepartment] = useState<'all' | string>('all')
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [sortBy, setSortBy] = useState<'name' | 'joinedAt' | 'lastActive' | 'rating'>('name')

  const filteredMembers = teamMembers
    .filter(member => {
      const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           member.department?.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesRole = filterRole === 'all' || member.role === filterRole
      const matchesStatus = filterStatus === 'all' || member.status === filterStatus
      const matchesDepartment = filterDepartment === 'all' || member.department === filterDepartment
      
      return matchesSearch && matchesRole && matchesStatus && matchesDepartment
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name': return a.name.localeCompare(b.name)
        case 'joinedAt': return b.joinedAt.getTime() - a.joinedAt.getTime()
        case 'lastActive': return b.lastActive.getTime() - a.lastActive.getTime()
        case 'rating': return b.rating - a.rating
        default: return 0
      }
    })

  const stats = {
    total: teamMembers.length,
    active: teamMembers.filter(m => m.status === 'active').length,
    pending: teamMembers.filter(m => m.status === 'pending').length,
    admins: teamMembers.filter(m => m.role === 'admin' || m.role === 'owner').length,
    departments: Array.from(new Set(teamMembers.map(m => m.department).filter((d): d is string => Boolean(d)))).length
  }

  const handleEditMember = (member: TeamMember) => {
    console.log('Edit member:', member)
    // Implementar edición de miembro
  }

  const handleDeleteMember = (member: TeamMember) => {
    if (confirm(`¿Estás seguro de que quieres eliminar a ${member.name} del equipo?`)) {
      setTeamMembers(prev => prev.filter(m => m.id !== member.id))
    }
  }

  const handleRoleChange = (member: TeamMember, newRole: TeamMember['role']) => {
    setTeamMembers(prev => 
      prev.map(m => 
        m.id === member.id ? { ...m, role: newRole } : m
      )
    )
  }

  const handleStatusChange = (member: TeamMember, newStatus: TeamMember['status']) => {
    setTeamMembers(prev => 
      prev.map(m => 
        m.id === member.id ? { ...m, status: newStatus } : m
      )
    )
  }

  const handleInvite = (inviteData: any) => {
    console.log('Invite data:', inviteData)
    // Implementar lógica de invitación
  }

  const departments = Array.from(new Set(teamMembers.map(m => m.department).filter((d): d is string => Boolean(d))))

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl">
                <Users className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Gestión de Equipo</h1>
                <p className="text-gray-600">Administra miembros, roles y permisos</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Configuración
              </Button>
              <Button
                onClick={() => setShowInviteModal(true)}
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Invitar Miembro
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                  </div>
                  <Users className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Activos</p>
                    <p className="text-2xl font-bold text-green-600">{stats.active}</p>
                  </div>
                  <Activity className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Pendientes</p>
                    <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                  </div>
                  <Calendar className="h-8 w-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Admins</p>
                    <p className="text-2xl font-bold text-red-600">{stats.admins}</p>
                  </div>
                  <Shield className="h-8 w-8 text-red-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Departamentos</p>
                    <p className="text-2xl font-bold text-purple-600">{stats.departments}</p>
                  </div>
                  <BarChart3 className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Filters */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg mb-6">
          <CardContent className="p-6">
            <div className="space-y-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar por nombre, email o departamento..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center space-x-2">
                  <Filter className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">Filtros:</span>
                </div>

                <select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value as any)}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Todos los roles</option>
                  <option value="owner">Propietario</option>
                  <option value="admin">Administrador</option>
                  <option value="member">Miembro</option>
                  <option value="viewer">Observador</option>
                </select>

                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as any)}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Todos los estados</option>
                  <option value="active">Activo</option>
                  <option value="pending">Pendiente</option>
                  <option value="inactive">Inactivo</option>
                </select>

                <select
                  value={filterDepartment}
                  onChange={(e) => setFilterDepartment(e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Todos los departamentos</option>
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
                >
                  <option value="name">Ordenar por nombre</option>
                  <option value="joinedAt">Ordenar por fecha de ingreso</option>
                  <option value="lastActive">Ordenar por última actividad</option>
                  <option value="rating">Ordenar por calificación</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Team Members Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredMembers.map((member) => (
            <TeamMemberCard
              key={member.id}
              member={member}
              onEdit={handleEditMember}
              onDelete={handleDeleteMember}
              onRoleChange={handleRoleChange}
              onStatusChange={handleStatusChange}
              canEdit={true}
              canDelete={member.role !== 'owner'}
            />
          ))}
        </div>

        {filteredMembers.length === 0 && (
          <Card className="bg-gray-50 border-dashed">
            <CardContent className="p-8 text-center">
              <Users className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron miembros</h3>
              <p className="text-gray-600 mb-4">Intenta ajustar los filtros de búsqueda</p>
              <Button
                onClick={() => setShowInviteModal(true)}
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Invitar Primer Miembro
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Invite Modal */}
        <InviteMemberModal
          isOpen={showInviteModal}
          onClose={() => setShowInviteModal(false)}
          onInvite={handleInvite}
        />
      </div>
    </div>
  )
}