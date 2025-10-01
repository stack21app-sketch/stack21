'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  BookOpen, 
  Code, 
  Play, 
  Copy, 
  Download, 
  Search, 
  Filter,
  ChevronDown,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  Clock,
  Zap,
  Database,
  Mail,
  Webhook,
  User,
  Settings,
  Globe,
  Lock,
  Key,
  Eye,
  EyeOff,
  Terminal,
  Smartphone,
  Monitor
} from 'lucide-react'
import APIDocumentation from '@/components/api/api-documentation'

export default function APIDocsPage() {
  const [activeTab, setActiveTab] = useState('documentation')

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl">
              <BookOpen className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Documentación de API</h1>
              <p className="text-gray-600">Explora y prueba nuestra API REST completa</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
            <Button
              variant={activeTab === 'documentation' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('documentation')}
              className="flex items-center"
            >
              <BookOpen className="h-4 w-4 mr-2" />
              Documentación
            </Button>
            <Button
              variant={activeTab === 'playground' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('playground')}
              className="flex items-center"
            >
              <Play className="h-4 w-4 mr-2" />
              Playground
            </Button>
            <Button
              variant={activeTab === 'sdk' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('sdk')}
              className="flex items-center"
            >
              <Code className="h-4 w-4 mr-2" />
              SDKs
            </Button>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'documentation' && <APIDocumentation />}
        
        {activeTab === 'playground' && (
          <div className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Terminal className="h-5 w-5 mr-2 text-green-500" />
                  API Playground
                </CardTitle>
                <p className="text-gray-600">
                  Prueba los endpoints de nuestra API en tiempo real
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Método HTTP
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                        <option value="GET">GET</option>
                        <option value="POST">POST</option>
                        <option value="PUT">PUT</option>
                        <option value="DELETE">DELETE</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        URL
                      </label>
                      <input
                        type="text"
                        placeholder="https://api.stack21.com/v1/workflows"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Headers
                    </label>
                    <div className="space-y-2">
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          placeholder="Authorization"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                          type="text"
                          placeholder="Bearer YOUR_API_KEY"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Body (JSON)
                    </label>
                    <textarea
                      placeholder='{"name": "Test Workflow", "description": "A test workflow"}'
                      className="w-full h-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                    />
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button className="bg-green-500 hover:bg-green-600 text-white">
                      <Play className="h-4 w-4 mr-2" />
                      Ejecutar
                    </Button>
                    <Button variant="outline">
                      <Copy className="h-4 w-4 mr-2" />
                      Copiar cURL
                    </Button>
                    <Button variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Exportar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Response */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                  Respuesta
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto">
                  <pre className="text-sm">
{`{
  "id": "wf_123456789",
  "name": "Test Workflow",
  "status": "active",
  "created_at": "2024-01-20T10:30:00Z"
}`}
                  </pre>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'sdk' && (
          <div className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Code className="h-5 w-5 mr-2 text-blue-500" />
                  SDKs Disponibles
                </CardTitle>
                <p className="text-gray-600">
                  Librerías oficiales para integrar con nuestra API
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { name: 'JavaScript', icon: '🟨', version: '1.2.0', install: 'npm install @stack21/sdk' },
                    { name: 'Python', icon: '🐍', version: '1.1.5', install: 'pip install stack21-sdk' },
                    { name: 'PHP', icon: '🐘', version: '1.0.8', install: 'composer require stack21/sdk' },
                    { name: 'Go', icon: '🐹', version: '1.3.2', install: 'go get github.com/stack21/sdk-go' },
                    { name: 'Java', icon: '☕', version: '1.1.0', install: 'maven: com.stack21:sdk' },
                    { name: 'Ruby', icon: '💎', version: '1.0.5', install: 'gem install stack21-sdk' }
                  ].map((sdk, index) => (
                    <Card key={index} className="p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center space-x-3 mb-3">
                        <span className="text-2xl">{sdk.icon}</span>
                        <div>
                          <h3 className="font-semibold text-gray-900">{sdk.name}</h3>
                          <p className="text-sm text-gray-600">v{sdk.version}</p>
                        </div>
                      </div>
                      <div className="bg-gray-100 p-2 rounded text-sm font-mono">
                        {sdk.install}
                      </div>
                      <div className="flex space-x-2 mt-3">
                        <Button size="sm" variant="outline">
                          <Download className="h-3 w-3 mr-1" />
                          Instalar
                        </Button>
                        <Button size="sm" variant="outline">
                          <BookOpen className="h-3 w-3 mr-1" />
                          Docs
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Start */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="h-5 w-5 mr-2 text-yellow-500" />
                  Inicio Rápido
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">1. Instalar el SDK</h4>
                    <div className="bg-gray-900 text-green-400 p-3 rounded font-mono text-sm">
                      npm install @stack21/sdk
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">2. Configurar tu API Key</h4>
                    <div className="bg-gray-900 text-green-400 p-3 rounded font-mono text-sm">
{`import { Stack21 } from '@stack21/sdk';

const client = new Stack21({
  apiKey: 'your-api-key-here'
});`}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">3. Crear tu primer workflow</h4>
                    <div className="bg-gray-900 text-green-400 p-3 rounded font-mono text-sm">
{`const workflow = await client.workflows.create({
  name: 'My First Workflow',
  description: 'A simple automation',
  steps: [
    {
      type: 'webhook',
      config: { url: '/api/webhooks/test' }
    }
  ]
});

console.log('Workflow created:', workflow.id);`}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}