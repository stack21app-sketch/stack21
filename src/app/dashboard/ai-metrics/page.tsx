'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { AIAgentMetrics } from '@/components/ai-agent-metrics'

export default function AIMetricsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-32 w-32 border-4 border-blue-200 mx-auto"></div>
            <div className="animate-spin rounded-full h-32 w-32 border-4 border-blue-600 border-t-transparent mx-auto absolute top-0 left-0"></div>
          </div>
          <p className="mt-6 text-gray-600 text-lg font-medium">Cargando métricas del agente...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Métricas del Agente IA
            </h1>
            <p className="text-gray-600 mt-2">
              Análisis detallado del rendimiento y uso del asistente inteligente
            </p>
          </div>
        </div>

        <AIAgentMetrics />
      </div>
    </DashboardLayout>
  )
}
