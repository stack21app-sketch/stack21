'use client'

import { Marketplace } from '@/components/marketplace'

export default function MarketplacePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <Marketplace />
      </div>
    </div>
  )
}