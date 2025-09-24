'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Bot, Play, CheckCircle, Clock, MapPin, Calendar, Users } from 'lucide-react'

interface DemoStep {
  id: string
  title: string
  description: string
  icon: string
  action: string
  result: string
  status: 'pending' | 'running' | 'completed'
}

export function AgentDemo() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isRunning, setIsRunning] = useState(false)

  const demoSteps: DemoStep[] = [
    {
      id: '1',
      title: 'Buscar Restaurantes',
      description: 'El agente busca restaurantes italianos cerca de tu ubicación',
      icon: '🍽️',
      action: 'Buscando restaurantes italianos cerca de tu oficina...',
      result: '✅ Encontrados 3 restaurantes:\n• Restaurante Italiano Premium (4.5⭐, 0.8km)\n• Bella Italia (4.2⭐, 1.2km)\n• Trattoria Romana (4.0⭐, 1.5km)',
      status: 'pending'
    },
    {
      id: '2',
      title: 'Verificar Disponibilidad',
      description: 'Verifica horarios disponibles para mañana a las 8pm',
      icon: '📅',
      action: 'Verificando disponibilidad para mañana 8:00 PM...',
      result: '✅ Disponibilidad confirmada:\n• Restaurante Italiano Premium: ✅ Disponible\n• Bella Italia: ❌ Completo (alternativa: 7:30 PM)\n• Trattoria Romana: ✅ Disponible',
      status: 'pending'
    },
    {
      id: '3',
      title: 'Hacer Reserva',
      description: 'Realiza la reserva automáticamente con tus datos',
      icon: '✅',
      action: 'Realizando reserva en Restaurante Italiano Premium...',
      result: '🎉 ¡Reserva confirmada!\n📧 Código: RES4A8B2C\n📍 Restaurante Italiano Premium\n📅 Mañana, 8:00 PM\n👥 4 personas\n📱 Confirmación enviada por SMS',
      status: 'pending'
    }
  ]

  const startDemo = async () => {
    setIsRunning(true)
    setCurrentStep(0)

    for (let i = 0; i < demoSteps.length; i++) {
      setCurrentStep(i)
      demoSteps[i].status = 'running'
      
      // Simular tiempo de procesamiento
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      demoSteps[i].status = 'completed'
      setCurrentStep(i + 1)
    }

    setIsRunning(false)
  }

  const resetDemo = () => {
    setCurrentStep(0)
    setIsRunning(false)
    demoSteps.forEach(step => {
      step.status = 'pending'
    })
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center space-y-4 mb-8">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          🚀 Demo en Vivo: Agente de Reservas
        </h2>
        <p className="text-gray-600">
          Ve cómo un agente de IA puede reservar una mesa en un restaurante automáticamente
        </p>
      </div>

      {/* Prompt de ejemplo */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            Solicitud del Usuario
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border-l-4 border-blue-500">
            <p className="text-blue-800 dark:text-blue-200">
              "Reserva una mesa para 4 personas mañana a las 8pm en un restaurante italiano cerca de mi oficina"
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Pasos del demo */}
      <div className="space-y-4 mb-6">
        {demoSteps.map((step, index) => (
          <Card 
            key={step.id} 
            className={`transition-all duration-300 ${
              index <= currentStep ? 'border-blue-200 bg-blue-50/50' : 'border-gray-200'
            }`}
          >
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${
                    step.status === 'completed' ? 'bg-green-100 text-green-600' :
                    step.status === 'running' ? 'bg-blue-100 text-blue-600' :
                    'bg-gray-100 text-gray-400'
                  }`}>
                    {step.status === 'completed' ? <CheckCircle className="h-6 w-6" /> :
                     step.status === 'running' ? <Clock className="h-6 w-6 animate-pulse" /> :
                     step.icon}
                  </div>
                </div>
                
                <div className="flex-1 space-y-3">
                  <div>
                    <h3 className="font-semibold text-lg">{step.title}</h3>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                  
                  {step.status === 'running' && (
                    <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                      <div className="flex items-center gap-2 text-blue-800 dark:text-blue-200">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
                        {step.action}
                      </div>
                    </div>
                  )}
                  
                  {step.status === 'completed' && (
                    <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                      <pre className="text-green-800 dark:text-green-200 text-sm whitespace-pre-wrap">
                        {step.result}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Controles */}
      <div className="flex justify-center gap-4">
        <Button
          onClick={startDemo}
          disabled={isRunning}
          size="lg"
          className="px-8"
        >
          {isRunning ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
              Ejecutando...
            </>
          ) : (
            <>
              <Play className="h-4 w-4 mr-2" />
              Ejecutar Demo
            </>
          )}
        </Button>
        
        {currentStep > 0 && (
          <Button
            onClick={resetDemo}
            variant="outline"
            size="lg"
            className="px-8"
          >
            Reiniciar Demo
          </Button>
        )}
      </div>

      {/* Información adicional */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <MapPin className="h-8 w-8 mx-auto mb-2 text-blue-600" />
            <h3 className="font-semibold">Geolocalización</h3>
            <p className="text-sm text-gray-600">Encuentra restaurantes cerca de ti</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Calendar className="h-8 w-8 mx-auto mb-2 text-green-600" />
            <h3 className="font-semibold">Disponibilidad</h3>
            <p className="text-sm text-gray-600">Verifica horarios en tiempo real</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Users className="h-8 w-8 mx-auto mb-2 text-purple-600" />
            <h3 className="font-semibold">Reserva Automática</h3>
            <p className="text-sm text-gray-600">Confirma tu mesa sin esfuerzo</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
