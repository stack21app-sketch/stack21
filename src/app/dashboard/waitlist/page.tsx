'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { useToast } from '@/hooks/use-toast'

interface WaitlistUser {
  id: string
  email: string
  name?: string
  company?: string
  tier: string
  isVerified: boolean
  createdAt: string
  source: string
}

interface WaitlistStats {
  totalUsers: number
  verifiedUsers: number
  usersByTier: Array<{
    _count: { tier: number }
    tier: string
  }>
  recentUsers: WaitlistUser[]
}

export default function WaitlistDashboard() {
  const [stats, setStats] = useState<WaitlistStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [adminKey, setAdminKey] = useState('')
  const [showLogin, setShowLogin] = useState(false)
  const { toast } = useToast()

  // Verificar si ya hay una clave de admin guardada
  useEffect(() => {
    const savedKey = localStorage.getItem('admin_key')
    if (savedKey) {
      setAdminKey(savedKey)
      fetchStats(savedKey)
    } else {
      setShowLogin(true)
    }
  }, [])

  const fetchStats = async (key: string) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/waitlist?admin_key=${key}`)
      const data = await response.json()
      
      if (data.success) {
        setStats(data.data)
        setShowLogin(false)
        localStorage.setItem('admin_key', key)
      } else {
        throw new Error(data.message || 'Error obteniendo estadísticas')
      }
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: "Error",
        description: "No se pudieron cargar las estadísticas",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    fetchStats(adminKey)
  }

  const handleLogout = () => {
    localStorage.removeItem('admin_key')
    setAdminKey('')
    setStats(null)
    setShowLogin(true)
  }

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'VIP': return 'bg-purple-500'
      case 'PREMIUM': return 'bg-blue-500'
      case 'ENTERPRISE': return 'bg-green-500'
      default: return 'bg-gray-500'
    }
  }

  if (showLogin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-white">Acceso Admin</CardTitle>
            <CardDescription className="text-gray-300">
              Ingresa tu clave de administrador para acceder al dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="adminKey" className="text-white">Clave de Administrador</Label>
                <Input
                  id="adminKey"
                  type="password"
                  value={adminKey}
                  onChange={(e) => setAdminKey(e.target.value)}
                  placeholder="admin-key-stack21-dev-2024"
                  className="mt-1"
                  required
                />
              </div>
              <Button type="submit" className="w-full bg-gradient-to-r from-yellow-400 to-pink-400 hover:from-yellow-500 hover:to-pink-500 text-black font-bold">
                Acceder
              </Button>
            </form>
            <div className="mt-4 p-3 bg-blue-500/20 rounded-lg">
              <p className="text-sm text-blue-300">
                <strong>Clave de desarrollo:</strong> admin-key-stack21-dev-2024
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto mb-4"></div>
          <p className="text-white">Cargando estadísticas...</p>
        </div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="text-center p-6">
            <p className="text-white">Error cargando las estadísticas</p>
            <Button onClick={() => setShowLogin(true)} className="mt-4">
              Intentar de nuevo
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-sm border-b border-white/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-pink-400 rounded-lg flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-black">
                  <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"></path>
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-white">Stack21 Waitlist Dashboard</h1>
            </div>
            <Button 
              onClick={handleLogout}
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10"
            >
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-white">Total Usuarios</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-400">{stats.totalUsers}</div>
              <p className="text-gray-300 text-sm">Registrados en waitlist</p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-white">Verificados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-400">{stats.verifiedUsers}</div>
              <p className="text-gray-300 text-sm">Emails verificados</p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-white">Tasa de Verificación</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-400">
                {stats.totalUsers > 0 ? Math.round((stats.verifiedUsers / stats.totalUsers) * 100) : 0}%
              </div>
              <p className="text-gray-300 text-sm">Usuarios verificados</p>
            </CardContent>
          </Card>
        </div>

        {/* Tiers Distribution */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20 mb-8">
          <CardHeader>
            <CardTitle className="text-white">Distribución por Tiers</CardTitle>
            <CardDescription className="text-gray-300">
              Usuarios agrupados por nivel de acceso
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.usersByTier.map((tier) => (
                <div key={tier.tier} className="text-center">
                  <div className={`w-16 h-16 ${getTierColor(tier.tier)} rounded-full flex items-center justify-center mx-auto mb-2`}>
                    <span className="text-white font-bold text-lg">{tier._count.tier}</span>
                  </div>
                  <p className="text-white font-medium">{tier.tier}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Users */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="text-white">Usuarios Recientes</CardTitle>
            <CardDescription className="text-gray-300">
              Últimos registros en la waitlist
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-pink-400 rounded-full flex items-center justify-center">
                      <span className="text-black font-bold text-sm">
                        {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="text-white font-medium">{user.name || 'Sin nombre'}</p>
                      <p className="text-gray-300 text-sm">{user.email}</p>
                      {user.company && (
                        <p className="text-gray-400 text-xs">{user.company}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getTierColor(user.tier)}>
                      {user.tier}
                    </Badge>
                    <Badge variant={user.isVerified ? "default" : "secondary"}>
                      {user.isVerified ? "Verificado" : "Pendiente"}
                    </Badge>
                    <span className="text-gray-400 text-xs">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}