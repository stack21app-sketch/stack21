'use client'

import { AIAssistant } from '@/components/ai-assistant'

export default function AIAssistantPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <AIAssistant />
      </div>
    </div>
  )
}
