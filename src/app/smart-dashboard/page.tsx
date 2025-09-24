'use client'

import { SmartDashboard } from '@/components/smart-dashboard'

export default function SmartDashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <SmartDashboard />
      </div>
    </div>
  )
}
