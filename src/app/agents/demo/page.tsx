import { Metadata } from 'next'
import { AgentDemo } from '@/components/agent-demo'

export const metadata: Metadata = {
  title: 'Demo de Agentes IA - Stack21',
  description: 'Ve en acción cómo nuestros agentes de IA pueden automatizar tareas complejas como reservas de restaurantes.',
}

export default function AgentDemoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <AgentDemo />
    </div>
  )
}
