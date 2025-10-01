'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  Square, 
  Zap,
  Brain,
  MessageSquare,
  Activity,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react'

interface VoiceCommand {
  id: string
  command: string
  action: string
  status: 'pending' | 'processing' | 'completed' | 'error'
  timestamp: Date
}

export default function VoiceControl() {
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [commands, setCommands] = useState<VoiceCommand[]>([])
  const [currentTranscript, setCurrentTranscript] = useState('')
  const [isSupported, setIsSupported] = useState(false)
  const recognitionRef = useRef<any>(null)
  const synthesisRef = useRef<SpeechSynthesisUtterance | null>(null)

  useEffect(() => {
    // Verificar soporte de APIs de voz
    const speechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    const speechSynthesis = window.speechSynthesis

    if (speechRecognition && speechSynthesis) {
      setIsSupported(true)
      recognitionRef.current = new speechRecognition()
      recognitionRef.current.continuous = true
      recognitionRef.current.interimResults = true
      recognitionRef.current.lang = 'es-ES'

      recognitionRef.current.onstart = () => {
        setIsListening(true)
      }

      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = ''
        let interimTranscript = ''

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript
          if (event.results[i].isFinal) {
            finalTranscript += transcript
          } else {
            interimTranscript += transcript
          }
        }

        setCurrentTranscript(interimTranscript)
        
        if (finalTranscript) {
          handleVoiceCommand(finalTranscript.trim())
        }
      }

      recognitionRef.current.onerror = (event: any) => {
        console.error('Error en reconocimiento de voz:', event.error)
        setIsListening(false)
      }

      recognitionRef.current.onend = () => {
        setIsListening(false)
      }
    }
  }, [])

  const handleVoiceCommand = async (command: string) => {
    const newCommand: VoiceCommand = {
      id: Date.now().toString(),
      command,
      action: 'Procesando...',
      status: 'processing',
      timestamp: new Date()
    }

    setCommands(prev => [newCommand, ...prev])
    setCurrentTranscript('')

    // Simular procesamiento de comando
    setTimeout(() => {
      const action = processVoiceCommand(command)
      setCommands(prev => prev.map(cmd => 
        cmd.id === newCommand.id 
          ? { ...cmd, action, status: 'completed' }
          : cmd
      ))

      // Respuesta por voz
      speakResponse(action)
    }, 2000)
  }

  const processVoiceCommand = (command: string): string => {
    const lowerCommand = command.toLowerCase()

    // Comandos de control
    if (lowerCommand.includes('pausar') || lowerCommand.includes('parar')) {
      return 'Pausando todos los workflows activos'
    }
    
    if (lowerCommand.includes('activar') || lowerCommand.includes('iniciar')) {
      return 'Activando workflows seleccionados'
    }

    if (lowerCommand.includes('dashboard') || lowerCommand.includes('panel')) {
      return 'Abriendo dashboard principal'
    }

    if (lowerCommand.includes('reporte') || lowerCommand.includes('estadísticas')) {
      return 'Generando reporte de actividad'
    }

    if (lowerCommand.includes('agente') || lowerCommand.includes('asistente')) {
      return 'Activando asistente IA'
    }

    if (lowerCommand.includes('email') || lowerCommand.includes('correo')) {
      return 'Enviando emails programados'
    }

    if (lowerCommand.includes('factura') || lowerCommand.includes('facturas')) {
      return 'Procesando facturas pendientes'
    }

    // Comandos de creación
    if (lowerCommand.includes('crear') && lowerCommand.includes('workflow')) {
      return 'Abriendo constructor de workflows'
    }

    if (lowerCommand.includes('nuevo') && lowerCommand.includes('proyecto')) {
      return 'Creando nuevo proyecto de automatización'
    }

    // Comandos de información
    if (lowerCommand.includes('estado') || lowerCommand.includes('cómo')) {
      return 'Todo funciona correctamente. 15 workflows activos, 247 tareas completadas hoy'
    }

    if (lowerCommand.includes('ayuda') || lowerCommand.includes('comandos')) {
      return 'Puedes decir: activar workflows, pausar todo, crear proyecto, ver reportes, o abrir dashboard'
    }

    return `Comando reconocido: "${command}". Procesando acción correspondiente`
  }

  const speakResponse = (text: string) => {
    if (!window.speechSynthesis) return

    setIsSpeaking(true)
    
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'es-ES'
    utterance.rate = 0.9
    utterance.pitch = 1

    utterance.onend = () => {
      setIsSpeaking(false)
    }

    utterance.onerror = () => {
      setIsSpeaking(false)
    }

    speechSynthesis.speak(utterance)
    synthesisRef.current = utterance
  }

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      recognitionRef.current.start()
    }
  }

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop()
    }
  }

  const stopSpeaking = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
    }
  }

  const clearCommands = () => {
    setCommands([])
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'processing': return <Loader2 className="h-4 w-4 animate-spin" />
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'error': return <AlertCircle className="h-4 w-4 text-red-500" />
      default: return <Activity className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'processing': return 'bg-blue-100 text-blue-800'
      case 'completed': return 'bg-green-100 text-green-800'
      case 'error': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (!isSupported) {
    return (
      <Card className="bg-gradient-to-r from-red-500/10 to-orange-500/10 border-red-500/20">
        <CardContent className="p-6 text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Control por Voz No Disponible
          </h3>
          <p className="text-gray-600">
            Tu navegador no soporta las APIs de reconocimiento de voz. 
            Prueba con Chrome, Edge o Safari.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Voice Control Panel */}
      <Card className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/20">
        <CardHeader>
          <CardTitle className="flex items-center text-blue-600">
            <Mic className="h-6 w-6 mr-2" />
            Control por Voz de Stack21
          </CardTitle>
          <p className="text-gray-600">
            Controla tu plataforma con comandos de voz. Di "ayuda" para ver comandos disponibles.
          </p>
        </CardHeader>
        <CardContent>
          {/* Voice Controls */}
          <div className="flex items-center justify-center space-x-4 mb-6">
            <Button
              onClick={isListening ? stopListening : startListening}
              className={`${
                isListening 
                  ? 'bg-red-600 hover:bg-red-700' 
                  : 'bg-blue-600 hover:bg-blue-700'
              } text-white px-8 py-3 rounded-full`}
              disabled={isSpeaking}
            >
              {isListening ? (
                <>
                  <MicOff className="h-6 w-6 mr-2" />
                  Escuchando... (Di "parar")
                </>
              ) : (
                <>
                  <Mic className="h-6 w-6 mr-2" />
                  Iniciar Voz
                </>
              )}
            </Button>

            {isSpeaking && (
              <Button
                onClick={stopSpeaking}
                variant="outline"
                className="border-red-500 text-red-600 hover:bg-red-50"
              >
                <VolumeX className="h-4 w-4 mr-2" />
                Parar Voz
              </Button>
            )}
          </div>

          {/* Current Transcript */}
          {currentTranscript && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <div className="flex items-center space-x-2 mb-2">
                <Brain className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-semibold text-blue-800">Escuchando:</span>
              </div>
              <p className="text-blue-700 italic">"{currentTranscript}"</p>
            </div>
          )}

          {/* Status Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-white rounded-lg border">
              <div className={`w-4 h-4 rounded-full mx-auto mb-2 ${
                isListening ? 'bg-green-500 animate-pulse' : 'bg-gray-300'
              }`} />
              <div className="text-sm font-semibold text-gray-900">
                {isListening ? 'Escuchando' : 'Inactivo'}
              </div>
              <div className="text-xs text-gray-600">Reconocimiento de voz</div>
            </div>
            
            <div className="text-center p-4 bg-white rounded-lg border">
              <div className={`w-4 h-4 rounded-full mx-auto mb-2 ${
                isSpeaking ? 'bg-blue-500 animate-pulse' : 'bg-gray-300'
              }`} />
              <div className="text-sm font-semibold text-gray-900">
                {isSpeaking ? 'Hablando' : 'Silencioso'}
              </div>
              <div className="text-xs text-gray-600">Síntesis de voz</div>
            </div>

            <div className="text-center p-4 bg-white rounded-lg border">
              <div className="text-lg font-bold text-purple-600">{commands.length}</div>
              <div className="text-sm font-semibold text-gray-900">Comandos</div>
              <div className="text-xs text-gray-600">Ejecutados hoy</div>
            </div>
          </div>

          {/* Quick Commands */}
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Comandos Rápidos:</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {[
                'Activar workflows',
                'Pausar todo',
                'Ver reportes',
                'Crear proyecto',
                'Estado del sistema',
                'Abrir dashboard',
                'Enviar emails',
                'Ayuda'
              ].map((command, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleVoiceCommand(command)}
                  className="text-xs"
                >
                  <MessageSquare className="h-3 w-3 mr-1" />
                  {command}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Commands History */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <Activity className="h-5 w-5 mr-2" />
              Historial de Comandos de Voz
            </CardTitle>
            {commands.length > 0 && (
              <Button variant="outline" size="sm" onClick={clearCommands}>
                Limpiar
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {commands.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Mic className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No hay comandos de voz ejecutados aún.</p>
              <p className="text-sm">Usa el control de voz para comenzar.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {commands.map((command) => (
                <div
                  key={command.id}
                  className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex-shrink-0 mt-1">
                    {getStatusIcon(command.status)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium text-gray-900">
                        "{command.command}"
                      </span>
                      <Badge className={getStatusColor(command.status)}>
                        {command.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{command.action}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {command.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
