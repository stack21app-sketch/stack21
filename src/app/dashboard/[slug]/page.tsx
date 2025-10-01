'use client'

import { useParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Brain, 
  Zap, 
  Cpu, 
  Database, 
  Bot, 
  Sparkles, 
  TrendingUp, 
  Activity,
  Play,
  Settings,
  BarChart3,
  Code2,
  Wand2,
  Image,
  Music,
  FileText,
  Bell,
  CreditCard,
  Users
} from 'lucide-react'

export default function WorkspaceDashboard() {
  const params = useParams()
  const { data: session } = useSession()
  const slug = params.slug as string

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg)]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[var(--text)]">Acceso Denegado</h2>
          <p className="text-[var(--muted)]">Debes iniciar sesión para acceder a este workspace</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      {/* Header */}
      <div className="relative bg-[var(--surface)] border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="relative">
                <Brain className="h-10 w-10 text-[var(--brand)] mr-4" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-ping"></div>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-[var(--text)]">
                  {slug}
                </h1>
                <p className="text-sm text-[var(--muted)] flex items-center">
                  <Zap className="h-4 w-4 mr-1 text-[var(--warning)]" />
                  Workspace de Inteligencia Artificial
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button className="bg-[var(--brand)] hover:bg-[var(--brand-hover)] text-white border-0">
                <Wand2 className="h-4 w-4 mr-2" />
                Crear IA
              </Button>
              <Button variant="outline" className="border-[var(--border)] text-[var(--text)] hover:bg-gray-100">
                <Settings className="h-4 w-4 mr-2" />
                Configurar
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* AI Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-black/20 backdrop-blur-lg border-white/10 hover:bg-black/30 transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Modelos IA</CardTitle>
              <Brain className="h-5 w-5 text-cyan-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">12</div>
              <p className="text-xs text-gray-400 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1 text-green-400" />
                +3 esta semana
              </p>
            </CardContent>
          </Card>

          <Card className="bg-black/20 backdrop-blur-lg border-white/10 hover:bg-black/30 transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Procesamiento</CardTitle>
              <Cpu className="h-5 w-5 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">2.4K</div>
              <p className="text-xs text-gray-400 flex items-center">
                <Activity className="h-3 w-3 mr-1 text-blue-400" />
                requests/min
              </p>
            </CardContent>
          </Card>

          <Card className="bg-black/20 backdrop-blur-lg border-white/10 hover:bg-black/30 transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Bots Activos</CardTitle>
              <Bot className="h-5 w-5 text-pink-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">8</div>
              <p className="text-xs text-gray-400 flex items-center">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-1 animate-pulse"></div>
                Todos operativos
              </p>
            </CardContent>
          </Card>

          <Card className="bg-black/20 backdrop-blur-lg border-white/10 hover:bg-black/30 transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Precisión</CardTitle>
              <BarChart3 className="h-5 w-5 text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">98.7%</div>
              <p className="text-xs text-gray-400 flex items-center">
                <Sparkles className="h-3 w-3 mr-1 text-yellow-400" />
                Excelente rendimiento
              </p>
            </CardContent>
          </Card>
        </div>

        {/* AI Tools Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Quick Actions */}
          <Card className="bg-black/20 backdrop-blur-lg border-white/10">
            <CardHeader>
              <CardTitle className="text-xl text-white flex items-center">
                <Wand2 className="h-6 w-6 mr-2 text-purple-400" />
                Herramientas IA
              </CardTitle>
              <CardDescription className="text-gray-400">
                Accede a las herramientas de inteligencia artificial
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                className="w-full bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 border-0 justify-start"
                onClick={() => window.location.href = `/dashboard/${slug}/generate-image`}
              >
                <Image className="h-4 w-4 mr-3" />
                Generar Imágenes IA
              </Button>
              <Button 
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 border-0 justify-start"
                onClick={() => window.location.href = `/dashboard/${slug}/generate-music`}
              >
                <Music className="h-4 w-4 mr-3" />
                Generar Música IA
              </Button>
              <Button 
                className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 border-0 justify-start"
                onClick={() => window.location.href = `/dashboard/${slug}/chatbot`}
              >
                <Bot className="h-4 w-4 mr-3" />
                Chatbot Personalizado
              </Button>
              <Button className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 border-0 justify-start">
                <Code2 className="h-4 w-4 mr-3" />
                Análisis de Código
              </Button>
              <Button 
                className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 border-0 justify-start"
                onClick={() => window.location.href = `/dashboard/${slug}/text-editor`}
              >
                <FileText className="h-4 w-4 mr-3" />
                Editor de Texto IA
              </Button>
              <Button 
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 border-0 justify-start"
                onClick={() => window.location.href = `/dashboard/${slug}/analytics`}
              >
                <BarChart3 className="h-4 w-4 mr-3" />
                Analytics
              </Button>
              <Button 
                className="w-full bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 border-0 justify-start"
                onClick={() => window.location.href = `/dashboard/${slug}/notifications`}
              >
                <Bell className="h-4 w-4 mr-3" />
                Notificaciones
              </Button>
              <Button 
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 border-0 justify-start"
                onClick={() => window.location.href = `/dashboard/${slug}/billing`}
              >
                <CreditCard className="h-4 w-4 mr-3" />
                Facturación
              </Button>
              <Button 
                className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 border-0 justify-start"
                onClick={() => window.location.href = `/dashboard/${slug}/team`}
              >
                <Users className="h-4 w-4 mr-3" />
                Equipo
              </Button>
              <Button 
                className="w-full bg-gradient-to-r from-slate-600 to-gray-600 hover:from-slate-700 hover:to-gray-700 border-0 justify-start"
                onClick={() => window.location.href = `/dashboard/${slug}/settings`}
              >
                <Settings className="h-4 w-4 mr-3" />
                Configuraciones
              </Button>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="bg-black/20 backdrop-blur-lg border-white/10">
            <CardHeader>
              <CardTitle className="text-xl text-white flex items-center">
                <Activity className="h-6 w-6 mr-2 text-green-400" />
                Actividad Reciente
              </CardTitle>
              <CardDescription className="text-gray-400">
                Últimas acciones en tu workspace
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <div className="flex-1">
                  <p className="text-sm text-white">Modelo GPT-4 entrenado</p>
                  <p className="text-xs text-gray-400">Hace 2 minutos</p>
                </div>
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Completado</Badge>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                <div className="flex-1">
                  <p className="text-sm text-white">Análisis de datos iniciado</p>
                  <p className="text-xs text-gray-400">Hace 5 minutos</p>
                </div>
                <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Procesando</Badge>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm text-white">Bot de chat desplegado</p>
                  <p className="text-xs text-gray-400">Hace 1 hora</p>
                </div>
                <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">Activo</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Welcome Message */}
        <Card className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 backdrop-blur-lg border-white/10">
          <CardHeader>
            <CardTitle className="text-2xl text-white flex items-center">
              <Sparkles className="h-8 w-8 mr-3 text-yellow-400" />
              ¡Bienvenido al futuro de la IA!
            </CardTitle>
            <CardDescription className="text-gray-300 text-lg">
              Tu workspace &quot;{slug}&quot; está equipado con las últimas tecnologías de inteligencia artificial. 
              Comienza creando tu primer modelo de IA.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 border-0">
                <Play className="h-5 w-5 mr-2" />
                Crear Modelo IA
              </Button>
              <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                <Settings className="h-5 w-5 mr-2" />
                Configurar Workspace
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
