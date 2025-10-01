'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Users, 
  Mail, 
  DollarSign, 
  TrendingUp,
  Download,
  RefreshCw,
  Eye,
  Trash2,
  CheckCircle,
  XCircle
} from 'lucide-react'

interface AdminStats {
  totalUsers: number
  totalEmails: number
  totalRevenue: number
  conversionRate: number
}

interface EmailLead {
  id: string
  email: string
  source: string
  timestamp: string
  status: 'pending' | 'verified' | 'subscribed'
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalEmails: 0,
    totalRevenue: 0,
    conversionRate: 0
  })
  const [emailLeads, setEmailLeads] = useState<EmailLead[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAdminData()
  }, [])

  const loadAdminData = async () => {
    try {
      // Cargar estadísticas
      const statsResponse = await fetch('/api/admin/stats')
      const statsData = await statsResponse.json()
      setStats(statsData)

      // Cargar emails
      const emailsResponse = await fetch('/api/admin/emails')
      const emailsData = await emailsResponse.json()
      setEmailLeads(emailsData.emails || [])

    } catch (error) {
      console.error('Error loading admin data:', error)
    } finally {
      setLoading(false)
    }
  }

  const exportEmails = () => {
    const csv = [
      'Email,Source,Date,Status',
      ...emailLeads.map(lead => 
        `${lead.email},${lead.source},${lead.timestamp},${lead.status}`
      )
    ].join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `stack21-emails-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const deleteEmail = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este email?')) return

    try {
      await fetch(`/api/admin/emails/${id}`, {
        method: 'DELETE'
      })
      
      setEmailLeads(prev => prev.filter(lead => lead.id !== id))
    } catch (error) {
      console.error('Error deleting email:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <RefreshCw className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Panel de Administración</h1>
          <p className="text-gray-600 mt-2">Gestiona tu SaaS Stack21</p>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Usuarios</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                +12% desde el mes pasado
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Emails Capturados</CardTitle>
              <Mail className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalEmails.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                +8% desde la semana pasada
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ingresos</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                +20% desde el mes pasado
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tasa de Conversión</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.conversionRate}%</div>
              <p className="text-xs text-muted-foreground">
                +2% desde el mes pasado
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Lista de Emails */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Lista de Emails</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  {emailLeads.length} emails capturados
                </p>
              </div>
              <div className="flex space-x-2">
                <Button onClick={exportEmails} variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Exportar CSV
                </Button>
                <Button onClick={loadAdminData} variant="outline" size="sm">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Actualizar
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {emailLeads.map((lead) => (
                <div key={lead.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <span className="font-medium">{lead.email}</span>
                      <Badge variant="outline">{lead.source}</Badge>
                      <Badge 
                        variant={lead.status === 'subscribed' ? 'default' : 'secondary'}
                      >
                        {lead.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {new Date(lead.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button size="sm" variant="ghost">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => deleteEmail(lead.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
              
              {emailLeads.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No hay emails capturados aún
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}