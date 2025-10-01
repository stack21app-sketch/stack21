import { useState, useEffect, useMemo } from 'react'
import { useSession } from 'next-auth/react'

// Definir WorkspaceRole localmente para evitar dependencia de Prisma
type WorkspaceRole = 'OWNER' | 'ADMIN' | 'MEMBER' | 'VIEWER'

interface Workspace {
  id: string
  name: string
  slug: string
  role: WorkspaceRole
}

interface UseWorkspaceReturn {
  currentWorkspace: Workspace | null
  workspaces: Workspace[]
  setCurrentWorkspace: (workspace: Workspace | null) => void
  isOwner: boolean
  isAdmin: boolean
  canManage: boolean
  canView: boolean
  loading: boolean
}

export function useWorkspace(): UseWorkspaceReturn {
  const { data: session, status } = useSession()
  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace | null>(null)
  const [loading, setLoading] = useState(true)

  // En modo demo, usar workspaces simulados
  const workspaces: Workspace[] = useMemo(() => (session?.user as any)?.workspaces || [{
    id: 'demo-workspace-id',
    name: 'Demo Workspace',
    slug: 'demo-workspace',
    role: 'OWNER' as const,
  }], [session?.user])

  // Cargar workspace desde localStorage al inicializar
  useEffect(() => {
    if (workspaces.length > 0) {
      const savedWorkspaceId = localStorage.getItem('currentWorkspaceId')
      const savedWorkspace = workspaces.find(w => w.id === savedWorkspaceId)
      
      if (savedWorkspace) {
        setCurrentWorkspace(savedWorkspace)
      } else {
        // Si no hay workspace guardado, usar el primero disponible
        setCurrentWorkspace(workspaces[0])
        localStorage.setItem('currentWorkspaceId', workspaces[0].id)
      }
      setLoading(false)
    } else {
      setCurrentWorkspace(null)
      setLoading(false)
    }
  }, [workspaces])

  // Guardar workspace en localStorage cuando cambie
  useEffect(() => {
    if (currentWorkspace) {
      localStorage.setItem('currentWorkspaceId', currentWorkspace.id)
    }
  }, [currentWorkspace])

  const isOwner = currentWorkspace?.role === 'OWNER'
  const isAdmin = currentWorkspace?.role === 'ADMIN' || isOwner
  const canManage = currentWorkspace?.role === 'MEMBER' || isAdmin
  const canView = currentWorkspace?.role === 'VIEWER' || canManage

  return {
    currentWorkspace,
    workspaces,
    setCurrentWorkspace,
    isOwner,
    isAdmin,
    canManage,
    canView,
    loading: status === 'loading',
  }
}
