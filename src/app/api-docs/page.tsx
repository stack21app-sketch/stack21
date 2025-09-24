'use client'

import { ApiDocumentation } from '@/components/api-documentation'

export default function ApiDocsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <ApiDocumentation baseUrl="http://localhost:3000" />
      </div>
    </div>
  )
}
