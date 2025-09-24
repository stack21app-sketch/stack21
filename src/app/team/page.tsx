'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { TeamManagement } from '@/components/team-management'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Users, 
  Plus, 
  Settings, 
  Crown, 
  Shield, 
  User, 
  Eye,
  ArrowLeft,
  Building2,
  Calendar,
  CheckCircle
} from 'lucide-react'
import { getWorkspaces, type Workspace } from '@/lib/team-management'

export default function TeamPage() {
  const router = useRouter()
  const [workspaces, setWorkspaces] = useState<Workspace[]>([])
  const [selectedWorkspace, setSelectedWorkspace] = useState<Workspace | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentUserId] = useState('user-1') // En producción esto vendría del contexto de autenticación

  useEffect(() => {
    loadWorkspaces()
  }, [])

  const loadWorkspaces = async () => {
    try {
      const userWorkspaces = await getWorkspaces(currentUserId)
      setWorkspaces(userWorkspaces)
      if (userWorkspaces.length > 0) {
        setSelectedWorkspace(userWorkspaces[0])
      }
    } catch (error) {
      console.error('Error loading workspaces:', error)
    } finally {
      setLoading(false)
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'owner': return <Crown className="h-4 w-4 text-yellow-500" />
      case 'admin': return <Shield className="h-4 w-4 text-blue-500" />
      case 'member': return <User className="h-4 w-4 text-green-500" />
      case 'viewer': return <Eye className="h-4 w-4 text-gray-500" />
      default: return <User className="h-4 w-4 text-gray-500" />
    }
  }

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'enterprise': return 'bg-purple-100 text-purple-800'
      case 'pro': return 'bg-blue-100 text-blue-800'
      case 'starter': return 'bg-green-100 text-green-800'
      case 'free': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando workspaces...</p>
        </div>
      </div>
    )
  }

  if (workspaces.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center">
            <Building2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">No tienes workspaces</h1>
            <p className="text-gray-600 mb-8">
              Crea tu primer workspace para comenzar a colaborar con tu equipo.
            </p>
            <Button onClick={() => router.push('/dashboard')}>
              <Plus className="h-4 w-4 mr-2" />
              Crear Workspace
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => router.push('/dashboard')}
                className="flex items-center"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver al Dashboard
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                  <Users className="h-8 w-8 mr-3 text-blue-600" />
                  Gestión de Equipos
                </h1>
                <p className="text-gray-600 mt-2">
                  Administra tus workspaces y equipos
                </p>
              </div>
            </div>
            <Button onClick={() => router.push('/dashboard')}>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Workspace
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Workspaces List */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Mis Workspaces</CardTitle>
                <CardDescription>
                  Selecciona un workspace para gestionar
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-1">
                  {workspaces.map((workspace) => (
                    <button
                      key={workspace.id}
                      onClick={() => setSelectedWorkspace(workspace)}
                      className={`w-full text-left p-4 hover:bg-gray-50 transition-colors ${
                        selectedWorkspace?.id === workspace.id 
                          ? 'bg-blue-50 border-r-2 border-blue-500' 
                          : ''
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-medium text-gray-900 truncate">
                          {workspace.name}
                        </div>
                        <Badge className={getPlanColor(workspace.plan)}>
                          {workspace.plan}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-500 mb-2">
                        {workspace.description}
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-400">
                        <span>{workspace.currentMembers}/{workspace.maxMembers} miembros</span>
                        <div className="flex items-center space-x-1">
                          {getRoleIcon('owner')} {/* En producción esto vendría del rol del usuario */}
                          <span>Propietario</span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Team Management */}
          <div className="lg:col-span-3">
            {selectedWorkspace ? (
              <TeamManagement 
                workspaceId={selectedWorkspace.id} 
                currentUserId={currentUserId} 
              />
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Selecciona un workspace
                  </h3>
                  <p className="text-gray-500">
                    Elige un workspace de la lista para gestionar su equipo
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
