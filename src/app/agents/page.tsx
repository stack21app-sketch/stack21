import { Metadata } from 'next'
import { AIAgentInterface } from '@/components/ai-agent-interface'

export const metadata: Metadata = {
  title: 'Agentes de IA - Stack21',
  description: 'Automatiza tareas complejas con nuestros agentes de IA especializados. Reservas, marketing, análisis de datos y más.',
}

export default function AgentsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <AIAgentInterface />
    </div>
  )
}
