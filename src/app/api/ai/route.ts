import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import OpenAI from 'openai'

// Configuración de OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Configuración de base de datos
const { PrismaClient } = require('@prisma/client')

let prisma: any = null
let useDatabase = false

try {
  prisma = new PrismaClient()
  useDatabase = true
  console.log('✅ Prisma Client inicializado para IA')
} catch (error) {
  console.log('⚠️ Error inicializando Prisma para IA:', error)
  useDatabase = false
}

// Simulación de respuestas de IA cuando no hay API key
const mockAIResponses = {
  'generate_code': 'Aquí tienes un ejemplo de código para tu proyecto...',
  'explain_concept': 'Este concepto se refiere a...',
  'suggest_improvements': 'Te sugiero las siguientes mejoras...',
  'debug_error': 'El error que estás viendo se debe a...',
  'create_documentation': 'Aquí tienes la documentación solicitada...'
}

export async function POST(request: NextRequest) {
  try {
    const token = await getToken({ req: request });
    if (!token || !token.sub) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { action, prompt, context, workspaceId } = await request.json()

    if (!action || !prompt) {
      return NextResponse.json(
        { error: 'Acción y prompt son requeridos' },
        { status: 400 }
      )
    }

    // Verificar límites de uso
    if (useDatabase && prisma) {
      const userUsage = await prisma.analytics.count({
        where: {
          userId: token.sub,
          event: 'ai_request',
          timestamp: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Últimas 24 horas
          }
        }
      })

      // Límite de 50 requests por día para usuarios gratuitos
      if (userUsage >= 50) {
        return NextResponse.json(
          { error: 'Has alcanzado el límite de requests de IA. Actualiza tu plan.' },
          { status: 429 }
        )
      }
    }

    let response: string

    if (process.env.OPENAI_API_KEY) {
      // Usar OpenAI real
      try {
        const systemPrompt = getSystemPrompt(action, context)
        
        const completion = await openai.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: systemPrompt
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 1000,
          temperature: 0.7,
        })

        response = completion.choices[0]?.message?.content || 'No se pudo generar una respuesta'
      } catch (error) {
        console.error('Error con OpenAI:', error)
        return NextResponse.json(
          { error: 'Error al procesar la solicitud de IA' },
          { status: 500 }
        )
      }
    } else {
      // Usar simulación
      response = mockAIResponses[action as keyof typeof mockAIResponses] || 
        'Esta es una respuesta simulada de IA. Configura tu API key de OpenAI para usar la IA real.'
    }

    // Registrar uso en analytics
    if (useDatabase && prisma) {
      await prisma.analytics.create({
        data: {
          userId: token.sub,
          workspaceId: workspaceId || null,
          event: 'ai_request',
          data: {
            action,
            prompt: prompt.substring(0, 100), // Solo primeros 100 caracteres
            responseLength: response.length
          },
          timestamp: new Date()
        }
      })
    } else {
      console.log(`🤖 AI Request: ${action}`, {
        userId: token.sub,
        workspaceId,
        promptLength: prompt.length,
        responseLength: response.length
      })
    }

    return NextResponse.json({
      success: true,
      response,
      action,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error en AI API:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

function getSystemPrompt(action: string, context?: any): string {
  const basePrompt = `Eres un asistente de IA especializado en desarrollo de software y gestión de proyectos. 
  Responde en español de manera clara, concisa y profesional.`

  switch (action) {
    case 'generate_code':
      return `${basePrompt}
      
      Tu tarea es generar código de alta calidad basado en la solicitud del usuario.
      - Usa las mejores prácticas de programación
      - Incluye comentarios explicativos
      - Asegúrate de que el código sea funcional y eficiente
      - Especifica el lenguaje de programación y framework si es relevante`

    case 'explain_concept':
      return `${basePrompt}
      
      Explica conceptos técnicos de manera clara y comprensible.
      - Usa analogías cuando sea apropiado
      - Proporciona ejemplos prácticos
      - Estructura la información de manera lógica
      - Incluye referencias a recursos adicionales si es necesario`

    case 'suggest_improvements':
      return `${basePrompt}
      
      Analiza el código o proyecto proporcionado y sugiere mejoras específicas.
      - Identifica problemas de rendimiento, seguridad o mantenibilidad
      - Proporciona soluciones concretas y prácticas
      - Prioriza las mejoras por importancia
      - Explica el beneficio de cada mejora`

    case 'debug_error':
      return `${basePrompt}
      
      Ayuda a diagnosticar y resolver errores de programación.
      - Analiza el mensaje de error y el contexto
      - Identifica las posibles causas
      - Proporciona soluciones paso a paso
      - Sugiere formas de prevenir errores similares`

    case 'create_documentation':
      return `${basePrompt}
      
      Crea documentación técnica clara y completa.
      - Usa un formato estructurado y fácil de leer
      - Incluye ejemplos de código cuando sea apropiado
      - Explica el propósito y uso de cada componente
      - Mantén un tono profesional pero accesible`

    case 'project_planning':
      return `${basePrompt}
      
      Ayuda con la planificación y arquitectura de proyectos de software.
      - Sugiere estructuras de proyecto apropiadas
      - Identifica tecnologías y herramientas relevantes
      - Proporciona estimaciones de tiempo y complejidad
      - Considera escalabilidad y mantenibilidad`

        case 'code_review':
          return `${basePrompt}
          
          Realiza una revisión de código profesional.
          - Identifica problemas de calidad, rendimiento y seguridad
          - Sugiere mejoras específicas con ejemplos
          - Reconoce buenas prácticas cuando las veas
          - Proporciona feedback constructivo y educativo`

        case 'industry_assistant':
          return `${basePrompt}
          
          Eres un asistente de IA especializado en la industria especificada.
          - Proporciona respuestas específicas y relevantes para esa industria
          - Usa terminología y conceptos propios del sector
          - Sugiere estrategias y tácticas específicas de la industria
          - Considera las mejores prácticas y tendencias actuales del sector
          - Adapta tu respuesta al contexto del workspace del usuario`

        default:
          return `${basePrompt}
          
          Proporciona asistencia general con desarrollo de software y gestión de proyectos.
          - Sé específico y práctico en tus respuestas
          - Incluye ejemplos cuando sea apropiado
          - Mantén un enfoque profesional y educativo`
  }
}

export async function GET(request: NextRequest) {
  try {
    const token = await getToken({ req: request })
    
    if (!token || !token.sub) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'capabilities'

    switch (type) {
      case 'capabilities':
        return NextResponse.json({
          capabilities: [
            {
              id: 'generate_code',
              name: 'Generar Código',
              description: 'Genera código de alta calidad para tu proyecto',
              icon: '💻'
            },
            {
              id: 'explain_concept',
              name: 'Explicar Conceptos',
              description: 'Explica conceptos técnicos de manera clara',
              icon: '📚'
            },
            {
              id: 'suggest_improvements',
              name: 'Sugerir Mejoras',
              description: 'Analiza y sugiere mejoras para tu código',
              icon: '⚡'
            },
            {
              id: 'debug_error',
              name: 'Depurar Errores',
              description: 'Ayuda a diagnosticar y resolver errores',
              icon: '🐛'
            },
            {
              id: 'create_documentation',
              name: 'Crear Documentación',
              description: 'Genera documentación técnica completa',
              icon: '📝'
            },
            {
              id: 'project_planning',
              name: 'Planificación de Proyectos',
              description: 'Ayuda con arquitectura y planificación',
              icon: '🏗️'
            },
            {
              id: 'code_review',
              name: 'Revisión de Código',
              description: 'Revisa código y proporciona feedback',
              icon: '👀'
            }
          ]
        })

      case 'usage':
        if (useDatabase && prisma) {
          const usage = await prisma.analytics.findMany({
            where: {
              userId: token.sub,
              event: 'ai_request',
              timestamp: {
                gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Últimos 30 días
              }
            },
            orderBy: { timestamp: 'desc' },
            take: 20
          })

          return NextResponse.json({
            totalRequests: usage.length,
            recentRequests: usage.map((req: any) => ({
              id: req.id,
              action: req.data?.action,
              timestamp: req.timestamp,
              responseLength: req.data?.responseLength
            }))
          })
        } else {
          // Simulación de uso
          return NextResponse.json({
            totalRequests: 15,
            recentRequests: [
              {
                id: '1',
                action: 'generate_code',
                timestamp: new Date(Date.now() - 3600000).toISOString(),
                responseLength: 250
              },
              {
                id: '2',
                action: 'explain_concept',
                timestamp: new Date(Date.now() - 7200000).toISOString(),
                responseLength: 180
              }
            ]
          })
        }

      default:
        return NextResponse.json({ error: 'Tipo no válido' }, { status: 400 })
    }
  } catch (error) {
    console.error('Error en AI API:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
