'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  MoreVertical, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Shield,
  Crown,
  User,
  Settings,
  Trash2,
  Edit,
  CheckCircle,
  Clock,
  XCircle,
  Star,
  Activity
} from 'lucide-react'

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

interface TeamMemberCardProps {
  member: TeamMember
  onEdit: (member: TeamMember) => void
  onDelete: (member: TeamMember) => void
  onRoleChange: (member: TeamMember, newRole: TeamMember['role']) => void
  onStatusChange: (member: TeamMember, newStatus: TeamMember['status']) => void
  canEdit?: boolean
  canDelete?: boolean
}

const getRoleIcon = (role: TeamMember['role']) => {
  switch (role) {
    case 'owner': return Crown
    case 'admin': return Shield
    case 'member': return User
    case 'viewer': return Settings
    default: return User
  }
}

const getRoleColor = (role: TeamMember['role']) => {
  switch (role) {
    case 'owner': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    case 'admin': return 'bg-red-100 text-red-800 border-red-200'
    case 'member': return 'bg-blue-100 text-blue-800 border-blue-200'
    case 'viewer': return 'bg-gray-100 text-gray-800 border-gray-200'
    default: return 'bg-gray-100 text-gray-800 border-gray-200'
  }
}

const getStatusIcon = (status: TeamMember['status']) => {
  switch (status) {
    case 'active': return CheckCircle
    case 'pending': return Clock
    case 'inactive': return XCircle
    default: return Clock
  }
}

const getStatusColor = (status: TeamMember['status']) => {
  switch (status) {
    case 'active': return 'bg-green-100 text-green-800'
    case 'pending': return 'bg-yellow-100 text-yellow-800'
    case 'inactive': return 'bg-red-100 text-red-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export default function TeamMemberCard({ 
  member, 
  onEdit, 
  onDelete, 
  onRoleChange, 
  onStatusChange,
  canEdit = true,
  canDelete = true
}: TeamMemberCardProps) {
  const [showMenu, setShowMenu] = useState(false)
  const [showDetails, setShowDetails] = useState(false)

  const RoleIcon = getRoleIcon(member.role)
  const StatusIcon = getStatusIcon(member.status)

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatLastActive = (date: Date) => {
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Activo ahora'
    if (diffInHours < 24) return `Hace ${diffInHours}h`
    if (diffInHours < 168) return `Hace ${Math.floor(diffInHours / 24)}d`
    return `Hace ${Math.floor(diffInHours / 168)} sem`
  }

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-200">
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={member.avatar} />
              <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                {getInitials(member.name)}
              </AvatarFallback>
            </Avatar>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{member.name}</h3>
              <p className="text-sm text-gray-600">{member.email}</p>
              {member.department && (
                <p className="text-xs text-gray-500">{member.department}</p>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Badge className={`${getRoleColor(member.role)} flex items-center`}>
              <RoleIcon className="h-3 w-3 mr-1" />
              {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
            </Badge>
            
            <Badge className={`${getStatusColor(member.status)} flex items-center`}>
              <StatusIcon className="h-3 w-3 mr-1" />
              {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
            </Badge>

            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowMenu(!showMenu)}
                className="h-8 w-8 p-0"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>

              {showMenu && (
                <div className="absolute right-0 top-8 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                  <div className="py-1">
                    {canEdit && (
                      <button
                        onClick={() => {
                          onEdit(member)
                          setShowMenu(false)
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Editar
                      </button>
                    )}
                    
                    <button
                      onClick={() => {
                        setShowDetails(!showDetails)
                        setShowMenu(false)
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Activity className="h-4 w-4 mr-2" />
                      {showDetails ? 'Ocultar detalles' : 'Ver detalles'}
                    </button>

                    {canDelete && member.role !== 'owner' && (
                      <button
                        onClick={() => {
                          onDelete(member)
                          setShowMenu(false)
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Eliminar
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{member.projects}</div>
            <div className="text-xs text-gray-600">Proyectos</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{member.tasksCompleted}</div>
            <div className="text-xs text-gray-600">Tareas</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center">
              <Star className="h-4 w-4 text-yellow-500 mr-1" />
              <span className="text-lg font-bold text-gray-900">{member.rating}</span>
            </div>
            <div className="text-xs text-gray-600">Rating</div>
          </div>
        </div>

        {/* Skills */}
        {member.skills.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Habilidades</h4>
            <div className="flex flex-wrap gap-1">
              {member.skills.slice(0, 3).map((skill, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {skill}
                </Badge>
              ))}
              {member.skills.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{member.skills.length - 3} más
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Details */}
        {showDetails && (
          <div className="border-t border-gray-200 pt-4 space-y-3">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center text-gray-600">
                <Calendar className="h-4 w-4 mr-2" />
                Se unió: {formatDate(member.joinedAt)}
              </div>
              <div className="flex items-center text-gray-600">
                <Activity className="h-4 w-4 mr-2" />
                Último activo: {formatLastActive(member.lastActive)}
              </div>
            </div>

            {member.phone && (
              <div className="flex items-center text-sm text-gray-600">
                <Phone className="h-4 w-4 mr-2" />
                {member.phone}
              </div>
            )}

            {member.location && (
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="h-4 w-4 mr-2" />
                {member.location}
              </div>
            )}

            {member.bio && (
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-1">Biografía</h4>
                <p className="text-sm text-gray-600">{member.bio}</p>
              </div>
            )}

            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-2">Permisos</h4>
              <div className="flex flex-wrap gap-1">
                {member.permissions.map((permission, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {permission}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(`mailto:${member.email}`)}
              className="flex items-center"
            >
              <Mail className="h-3 w-3 mr-1" />
              Email
            </Button>
            
            {member.status === 'pending' && (
              <Button
                size="sm"
                onClick={() => onStatusChange(member, 'active')}
                className="bg-green-500 hover:bg-green-600 text-white"
              >
                Activar
              </Button>
            )}
          </div>

          <div className="flex items-center space-x-1">
            {member.role !== 'owner' && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRoleChange(member, member.role === 'admin' ? 'member' : 'admin')}
                  className="text-xs"
                >
                  {member.role === 'admin' ? 'Quitar Admin' : 'Hacer Admin'}
                </Button>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
