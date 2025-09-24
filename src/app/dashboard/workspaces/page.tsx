'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { 
  Building2, 
  Plus, 
  Settings, 
  Users, 
  Calendar,
  ExternalLink,
  MoreVertical,
  Edit,
  Trash2,
  Save,
  X,
  CheckCircle
} from 'lucide-react'
import { useWorkspace } from '@/hooks/use-workspace'
import Link from 'next/link'

export default function WorkspacesPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { workspaces, currentWorkspace, setCurrentWorkspace } = useWorkspace()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [editingWorkspace, setEditingWorkspace] = useState<any>(null)
  const [editForm, setEditForm] = useState({
    name: '',
    slug: '',
    description: ''
  })
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null)

  if (status === 'unauthenticated') {
    router.push('/auth/signin')
    return null
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    )
  }

  const handleWorkspaceSelect = (workspace: any) => {
    setCurrentWorkspace(workspace)
  }

  const handleEdit = (workspace: any) => {
    setEditingWorkspace(workspace)
    setEditForm({
      name: workspace.name,
      slug: workspace.slug,
      description: workspace.description || ''
    })
  }

  const handleSaveEdit = async () => {
    if (!editingWorkspace) return

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/workspaces', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: editingWorkspace.id,
          ...editForm
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Error al actualizar el workspace')
      }

      // Actualizar el workspace en la lista
      const updatedWorkspaces = workspaces.map(w => 
        w.id === editingWorkspace.id ? { ...w, ...data } : w
      )
      
      // Actualizar el workspace actual si es el que se editó
      if (currentWorkspace?.id === editingWorkspace.id) {
        setCurrentWorkspace({ ...currentWorkspace, ...data })
      }

      setEditingWorkspace(null)
      setEditForm({ name: '', slug: '', description: '' })
      
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error inesperado')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (workspaceId: string) => {
    setLoading(true)
    setError('')

    try {
      const response = await fetch(`/api/workspaces?id=${workspaceId}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Error al eliminar el workspace')
      }

      // Si era el workspace actual, cambiar a otro
      if (currentWorkspace?.id === workspaceId) {
        const remainingWorkspaces = workspaces.filter(w => w.id !== workspaceId)
        if (remainingWorkspaces.length > 0) {
          setCurrentWorkspace(remainingWorkspaces[0])
        } else {
          setCurrentWorkspace(null)
        }
      }

      setShowDeleteConfirm(null)
      
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error inesperado')
    } finally {
      setLoading(false)
    }
  }

  const cancelEdit = () => {
    setEditingWorkspace(null)
    setEditForm({ name: '', slug: '', description: '' })
  }

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'OWNER':
        return 'default'
      case 'ADMIN':
        return 'secondary'
      case 'MEMBER':
        return 'outline'
      case 'VIEWER':
        return 'outline'
      default:
        return 'outline'
    }
  }

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'OWNER':
        return 'Propietario'
      case 'ADMIN':
        return 'Administrador'
      case 'MEMBER':
        return 'Miembro'
      case 'VIEWER':
        return 'Observador'
      default:
        return role
    }
  }

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Mis Workspaces
            </h1>
            <p className="text-gray-600 mt-2">
              Gestiona todos tus espacios de trabajo
            </p>
          </div>
          <Button asChild>
            <Link href="/workspace/create">
              <Plus className="mr-2 h-4 w-4" />
              Crear Workspace
            </Link>
          </Button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Workspaces Grid */}
      {workspaces.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Building2 className="h-12 w-12 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No tienes workspaces
            </h3>
            <p className="text-gray-500 mb-6">
              Comienza creando tu primer workspace para organizar tus proyectos
            </p>
            <Button asChild>
              <Link href="/workspace/create">
                <Plus className="mr-2 h-4 w-4" />
                Crear Primer Workspace
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workspaces.map((workspace) => (
            <Card 
              key={workspace.id} 
              className={`cursor-pointer transition-all hover:shadow-lg ${
                currentWorkspace?.id === workspace.id 
                  ? 'ring-2 ring-blue-500 bg-blue-50' 
                  : 'hover:border-blue-300'
              }`}
              onClick={() => handleWorkspaceSelect(workspace)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                      <Building2 className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{workspace.name}</CardTitle>
                      <p className="text-sm text-gray-500">@{workspace.slug}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={getRoleBadgeVariant(workspace.role)}>
                      {getRoleLabel(workspace.role)}
                    </Badge>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center text-gray-600">
                      <Users className="h-4 w-4 mr-2" />
                      <span>1 miembro</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>Hoy</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleEdit(workspace)
                      }}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Editar
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        setShowDeleteConfirm(workspace.id)
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Current Workspace Indicator */}
                  {currentWorkspace?.id === workspace.id && (
                    <div className="flex items-center text-blue-600 text-sm">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mr-2"></div>
                      Workspace actual
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Help Section */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>¿Necesitas ayuda?</CardTitle>
          <CardDescription>
            Aprende más sobre cómo usar workspaces en tu plataforma
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button variant="outline" asChild>
              <Link href="#">
                <ExternalLink className="mr-2 h-4 w-4" />
                Ver Documentación
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="#">
                <Users className="mr-2 h-4 w-4" />
                Invitar Miembros
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Edit Modal */}
      {editingWorkspace && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle>Editar Workspace</CardTitle>
              <CardDescription>
                Modifica la información de tu workspace
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Nombre</Label>
                <Input
                  id="edit-name"
                  value={editForm.name}
                  onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-slug">Slug</Label>
                <Input
                  id="edit-slug"
                  value={editForm.slug}
                  onChange={(e) => setEditForm(prev => ({ ...prev, slug: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">Descripción</Label>
                <Textarea
                  id="edit-description"
                  value={editForm.description}
                  onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                />
              </div>
              <div className="flex space-x-2">
                <Button onClick={handleSaveEdit} disabled={loading} className="flex-1">
                  <Save className="h-4 w-4 mr-2" />
                  {loading ? 'Guardando...' : 'Guardar'}
                </Button>
                <Button variant="outline" onClick={cancelEdit}>
                  <X className="h-4 w-4 mr-2" />
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle className="text-red-600">Eliminar Workspace</CardTitle>
              <CardDescription>
                Esta acción no se puede deshacer. Se eliminarán todos los datos del workspace.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-2">
                <Button 
                  variant="destructive" 
                  onClick={() => handleDelete(showDeleteConfirm)} 
                  disabled={loading}
                  className="flex-1"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  {loading ? 'Eliminando...' : 'Eliminar'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowDeleteConfirm(null)}
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </DashboardLayout>
  )
}