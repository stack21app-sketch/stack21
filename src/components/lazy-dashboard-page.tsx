'use client'

import { Suspense, lazy, ComponentType } from 'react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'

// Loading component
function DashboardPageSkeleton() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header skeleton */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-8 w-64 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 w-96 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="flex space-x-2">
            <div className="h-10 w-24 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-10 w-24 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>

        {/* Content skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded-lg border p-6">
              <div className="space-y-3">
                <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}

// Lazy load dashboard pages
const LazyAnalyticsPage = lazy(() => import('@/app/dashboard/analytics/page'))
const LazyABTestingPage = lazy(() => import('@/app/dashboard/ab-testing/page'))
const LazyAIPage = lazy(() => import('@/app/dashboard/ai/page'))
const LazyBillingPage = lazy(() => import('@/app/dashboard/billing/page'))
const LazyIntegrationsPage = lazy(() => import('@/app/dashboard/integrations/page'))
const LazySettingsPage = lazy(() => import('@/app/dashboard/settings/page'))
const LazySupportPage = lazy(() => import('@/app/dashboard/support/page'))
const LazyWebhooksPage = lazy(() => import('@/app/dashboard/webhooks/page'))

// Page mapping
const pageComponents: Record<string, ComponentType> = {
  'analytics': LazyAnalyticsPage,
  'ab-testing': LazyABTestingPage,
  'ai': LazyAIPage,
  'billing': LazyBillingPage,
  'integrations': LazyIntegrationsPage,
  'settings': LazySettingsPage,
  'support': LazySupportPage,
  'webhooks': LazyWebhooksPage,
}

interface LazyDashboardPageProps {
  page: string
}

export function LazyDashboardPage({ page }: LazyDashboardPageProps) {
  const PageComponent = pageComponents[page]

  if (!PageComponent) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Página no encontrada</h2>
            <p className="text-gray-600">La página que buscas no existe.</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <Suspense fallback={<DashboardPageSkeleton />}>
      <PageComponent />
    </Suspense>
  )
}

// Error boundary for lazy loaded components
export function LazyPageErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Error al cargar la página</h2>
        <p className="text-gray-600 mb-4">Hubo un problema al cargar esta página.</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Recargar página
        </button>
      </div>
    </div>
  )
}
