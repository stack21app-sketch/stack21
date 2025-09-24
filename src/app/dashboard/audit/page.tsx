'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Shield, 
  Search,
  Filter,
  Download,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Info,
  Activity,
  Eye,
  Clock,
  Globe,
  User,
  Building2,
  BarChart3,
  FileText
} from 'lucide-react'
import { useWorkspace } from '@/hooks/use-workspace'

interface AuditLog {
  id: string
  userId: string
  workspaceId?: string
  action: string
  resource: string
  resourceId?: string
  details: any
  ipAddress: string
  userAgent: string
  timestamp: string
  severity: string
  user?: {
    name: string
    email: string
  }
  workspace?: {
    name: string
    slug: string
  }
}

interface AuditStats {
  total: number
  today: number
  thisWeek: number
  thisMonth: number
  bySeverity: {
    INFO: number
    WARNING: number
    ERROR: number
  }
  topActions: Array<{
    action: string
    count: number
  }>
}

export default function AuditPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { currentWorkspace } = useWorkspace()
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [stats, setStats] = useState<AuditStats | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [filters, setFilters] = useState({
    search: '',
    action: 'ALL',
    severity: 'ALL',
    startDate: '',
    endDate: ''
  })
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50,
    total: 0,
    hasMore: false
  })

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

  useEffect(() => {
    fetchLogs()
    fetchStats()
  }, [currentWorkspace, filters, pagination.page])

  const fetchLogs = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        type: 'logs',
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...(currentWorkspace && { workspaceId: currentWorkspace.id }),
        ...(filters.action !== 'ALL' && { action: filters.action }),
        ...(filters.severity !== 'ALL' && { severity: filters.severity }),
        ...(filters.startDate && { startDate: filters.startDate }),
        ...(filters.endDate && { endDate: filters.endDate })
      })

      const response = await fetch(`/api/audit?${params}`)
      const data = await response.json()

      if (response.ok) {
        setLogs(data.logs)
        setPagination(prev => ({
          ...prev,
          total: data.pagination.total,
          hasMore: data.pagination.hasMore
        }))
      }
    } catch (error) {
      setError('Error al cargar logs de auditoría')
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const params = new URLSearchParams({
        type: 'stats',
        ...(currentWorkspace && { workspaceId: currentWorkspace.id })
      })

      const response = await fetch(`/api/audit?${params}`)
      const data = await response.json()

      if (response.ok) {
        setStats(data)
      }
    } catch (error) {
      console.error('Error al cargar estadísticas:', error)
    }
  }

  const handleExport = async () => {
    try {
      const params = new URLSearchParams({
        type: 'export',
        ...(currentWorkspace && { workspaceId: currentWorkspace.id })
      })

      const response = await fetch(`/api/audit?${params}`)
      
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `audit-logs-${new Date().toISOString().split('T')[0]}.csv`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        window.URL.revokeObjectURL(url)
      }
    } catch (error) {
      setError('Error al exportar logs')
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'ERROR':
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      case 'WARNING':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      case 'INFO':
        return <Info className="h-4 w-4 text-blue-600" />
      default:
        return <Info className="h-4 w-4 text-gray-600" />
    }
  }

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'ERROR':
        return <Badge variant="destructive">Error</Badge>
      case 'WARNING':
        return <Badge className="bg-yellow-100 text-yellow-800">Advertencia</Badge>
      case 'INFO':
        return <Badge className="bg-blue-100 text-blue-800">Info</Badge>
      default:
        return <Badge variant="outline">{severity}</Badge>
    }
  }

  const getActionLabel = (action: string) => {
    const actionLabels: { [key: string]: string } = {
      'WORKSPACE_CREATED': 'Workspace Creado',
      'WORKSPACE_UPDATED': 'Workspace Actualizado',
      'WORKSPACE_DELETED': 'Workspace Eliminado',
      'MEMBER_INVITED': 'Miembro Invitado',
      'MEMBER_REMOVED': 'Miembro Eliminado',
      'PROJECT_CREATED': 'Proyecto Creado',
      'PROJECT_UPDATED': 'Proyecto Actualizado',
      'PROJECT_DELETED': 'Proyecto Eliminado',
      'INTEGRATION_CONNECTED': 'Integración Conectada',
      'INTEGRATION_DISCONNECTED': 'Integración Desconectada',
      'BILLING_SUBSCRIPTION_UPDATED': 'Suscripción Actualizada',
      'FAILED_LOGIN_ATTEMPT': 'Intento de Login Fallido',
      'PASSWORD_CHANGED': 'Contraseña Cambiada',
      'SETTINGS_UPDATED': 'Configuración Actualizada'
    }
    return actionLabels[action] || action.replace(/_/g, ' ').toLowerCase()
  }

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('es-ES')
  }

  const formatUserAgent = (userAgent: string) => {
    // Extraer información básica del user agent
    if (userAgent.includes('Chrome')) return 'Chrome'
    if (userAgent.includes('Firefox')) return 'Firefox'
    if (userAgent.includes('Safari')) return 'Safari'
    if (userAgent.includes('Edge')) return 'Edge'
    return 'Otro'
  }

  if (loading && !logs.length) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando logs de auditoría...</p>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Shield className="mr-3 h-8 w-8 text-blue-600" />
              Auditoría
            </h1>
            <p className="text-gray-600 mt-2">
              {currentWorkspace ? `Logs de auditoría para ${currentWorkspace.name}` : 'Logs de auditoría y actividad'}
            </p>
          </div>
          <Button onClick={handleExport} variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Exportar CSV
          </Button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Activity className="h-8 w-8 text-blue-600 mr-3" />
                <div>
                  <p className="text-2xl font-bold">{stats.total}</p>
                  <p className="text-sm text-gray-600">Total Logs</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-green-600 mr-3" />
                <div>
                  <p className="text-2xl font-bold">{stats.today}</p>
                  <p className="text-sm text-gray-600">Hoy</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-purple-600 mr-3" />
                <div>
                  <p className="text-2xl font-bold">{stats.thisWeek}</p>
                  <p className="text-sm text-gray-600">Esta Semana</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <BarChart3 className="h-8 w-8 text-orange-600 mr-3" />
                <div>
                  <p className="text-2xl font-bold">{stats.thisMonth}</p>
                  <p className="text-sm text-gray-600">Este Mes</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Buscar</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar en logs..."
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  className="pl-9"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Acción</label>
              <Select
                value={filters.action}
                onValueChange={(value) => setFilters(prev => ({ ...prev, action: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Todas las acciones</SelectItem>
                  <SelectItem value="WORKSPACE_CREATED">Workspace Creado</SelectItem>
                  <SelectItem value="MEMBER_INVITED">Miembro Invitado</SelectItem>
                  <SelectItem value="PROJECT_CREATED">Proyecto Creado</SelectItem>
                  <SelectItem value="INTEGRATION_CONNECTED">Integración Conectada</SelectItem>
                  <SelectItem value="FAILED_LOGIN_ATTEMPT">Login Fallido</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Severidad</label>
              <Select
                value={filters.severity}
                onValueChange={(value) => setFilters(prev => ({ ...prev, severity: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Todas</SelectItem>
                  <SelectItem value="INFO">Info</SelectItem>
                  <SelectItem value="WARNING">Advertencia</SelectItem>
                  <SelectItem value="ERROR">Error</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Fecha Inicio</label>
              <Input
                type="date"
                value={filters.startDate}
                onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Fecha Fin</label>
              <Input
                type="date"
                value={filters.endDate}
                onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Logs Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Logs de Auditoría</span>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span>{pagination.total} registros</span>
              <span>•</span>
              <span>Página {pagination.page}</span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {logs.length === 0 ? (
            <div className="text-center py-12">
              <Shield className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-700 mb-2">
                No hay logs de auditoría
              </h3>
              <p className="text-gray-500">
                Los logs de actividad aparecerán aquí
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {logs.map((log) => (
                <div key={log.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      {getSeverityIcon(log.severity)}
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {getActionLabel(log.action)}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {log.resource} {log.resourceId && `• ID: ${log.resourceId}`}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getSeverityBadge(log.severity)}
                      <span className="text-sm text-gray-500">
                        {formatDate(log.timestamp)}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600">
                        {log.user?.name || 'Usuario'}
                      </span>
                    </div>

                    {log.workspace && (
                      <div className="flex items-center space-x-2">
                        <Building2 className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-600">
                          {log.workspace.name}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center space-x-2">
                      <Globe className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600">
                        {log.ipAddress} • {formatUserAgent(log.userAgent)}
                      </span>
                    </div>
                  </div>

                  {log.details && Object.keys(log.details).length > 0 && (
                    <div className="mt-3 p-3 bg-gray-100 rounded-lg">
                      <details className="text-sm">
                        <summary className="cursor-pointer font-medium text-gray-700">
                          Ver detalles
                        </summary>
                        <pre className="mt-2 text-xs text-gray-600 overflow-x-auto">
                          {JSON.stringify(log.details, null, 2)}
                        </pre>
                      </details>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {pagination.total > pagination.limit && (
            <div className="flex items-center justify-between mt-6 pt-4 border-t">
              <div className="text-sm text-gray-500">
                Mostrando {((pagination.page - 1) * pagination.limit) + 1} a {Math.min(pagination.page * pagination.limit, pagination.total)} de {pagination.total} registros
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                  disabled={pagination.page === 1}
                >
                  Anterior
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                  disabled={!pagination.hasMore}
                >
                  Siguiente
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  )
}
