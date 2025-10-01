import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

// Configuración de base de datos
const { PrismaClient } = require('@prisma/client')

let prisma: any = null
let useDatabase = false

try {
  prisma = new PrismaClient()
  useDatabase = true
  console.log('✅ Prisma Client inicializado para configuración')
} catch (error) {
  console.log('⚠️ Error inicializando Prisma para configuración:', error)
  useDatabase = false
}

// Simulación de configuración en memoria
const userSettings: { [userId: string]: any } = {}

export async function GET(request: NextRequest) {
  try {
    const token = await getToken({ req: request })
    
    if (!token || !token.sub) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    let settings: any

    if (useDatabase && prisma) {
      settings = await prisma.userSettings.findUnique({
        where: { userId: token.sub }
      })

      if (!settings) {
        // Crear configuración por defecto
        settings = await prisma.userSettings.create({
          data: {
            userId: token.sub,
            preferences: {
              theme: 'dark',
              language: 'es',
              timezone: 'UTC',
              notifications: {
                email: true,
                projectUpdates: true,
                workflowAlerts: false
              },
              security: {
                twoFactor: false,
                sessionTimeout: true
              }
            }
          }
        })
      }
    } else {
      // Usar simulación
      settings = userSettings[token.sub] || {
        id: `settings_${token.sub}`,
        userId: token.sub,
        preferences: {
          theme: 'dark',
          language: 'es',
          timezone: 'UTC',
          notifications: {
            email: true,
            projectUpdates: true,
            workflowAlerts: false
          },
          security: {
            twoFactor: false,
            sessionTimeout: true
          }
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    }

    return NextResponse.json(settings)
  } catch (error) {
    console.error('Error al obtener configuración:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const token = await getToken({ req: request })
    
    if (!token || !token.sub) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { preferences, theme, language, timezone, notifications, security } = await request.json()

    if (!preferences && !theme && !language && !timezone && !notifications && !security) {
      return NextResponse.json(
        { error: 'Al menos un campo de configuración es requerido' },
        { status: 400 }
      )
    }

    let updatedSettings: any

    if (useDatabase && prisma) {
      // Obtener configuración actual
      const currentSettings = await prisma.userSettings.findUnique({
        where: { userId: token.sub }
      })

      const newPreferences = {
        ...(currentSettings?.preferences || {}),
        ...(preferences || {}),
        ...(theme && { theme }),
        ...(language && { language }),
        ...(timezone && { timezone }),
        ...(notifications && { notifications }),
        ...(security && { security })
      }

      updatedSettings = await prisma.userSettings.upsert({
        where: { userId: token.sub },
        update: {
          preferences: newPreferences,
          updatedAt: new Date()
        },
        create: {
          userId: token.sub,
          preferences: newPreferences
        }
      })
    } else {
      // Usar simulación
      const currentSettings = userSettings[token.sub] || {
        id: `settings_${token.sub}`,
        userId: token.sub,
        preferences: {}
      }

      const newPreferences = {
        ...currentSettings.preferences,
        ...(preferences || {}),
        ...(theme && { theme }),
        ...(language && { language }),
        ...(timezone && { timezone }),
        ...(notifications && { notifications }),
        ...(security && { security })
      }

      updatedSettings = {
        ...currentSettings,
        preferences: newPreferences,
        updatedAt: new Date().toISOString()
      }

      userSettings[token.sub] = updatedSettings
    }

    console.log(`✅ Configuración actualizada para usuario: ${token.sub}`)
    return NextResponse.json(updatedSettings)
  } catch (error) {
    console.error('Error al actualizar configuración:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = await getToken({ req: request })
    
    if (!token || !token.sub) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { action, data } = await request.json()

    if (!action) {
      return NextResponse.json(
        { error: 'Acción es requerida' },
        { status: 400 }
      )
    }

    switch (action) {
      case 'reset_preferences':
        // Resetear preferencias a valores por defecto
        const defaultPreferences = {
          theme: 'dark',
          language: 'es',
          timezone: 'UTC',
          notifications: {
            email: true,
            projectUpdates: true,
            workflowAlerts: false
          },
          security: {
            twoFactor: false,
            sessionTimeout: true
          }
        }

        if (useDatabase && prisma) {
          await prisma.userSettings.upsert({
            where: { userId: token.sub },
            update: {
              preferences: defaultPreferences,
              updatedAt: new Date()
            },
            create: {
              userId: token.sub,
              preferences: defaultPreferences
            }
          })
        } else {
          userSettings[token.sub] = {
            id: `settings_${token.sub}`,
            userId: token.sub,
            preferences: defaultPreferences,
            updatedAt: new Date().toISOString()
          }
        }

        return NextResponse.json({ success: true, message: 'Preferencias reseteadas' })

      case 'export_data':
        // Exportar datos del usuario
        if (useDatabase && prisma) {
          const userData = await prisma.user.findUnique({
            where: { id: token.sub },
            include: {
              workspaces: {
                include: {
                  workspace: true
                }
              },
              settings: true
            }
          })

          return NextResponse.json({
            success: true,
            data: userData,
            exportedAt: new Date().toISOString()
          })
        } else {
          // Simulación de exportación
          return NextResponse.json({
            success: true,
            data: {
              user: {
                id: token.sub,
                name: 'User',
                email: 'user@example.com'
              },
              settings: userSettings[token.sub] || {}
            },
            exportedAt: new Date().toISOString()
          })
        }

      case 'delete_account':
        // Eliminar cuenta del usuario
        if (useDatabase && prisma) {
          // Eliminar en cascada todos los datos del usuario
          await prisma.user.delete({
            where: { id: token.sub }
          })
        } else {
          // Simulación de eliminación
          delete userSettings[token.sub]
        }

        return NextResponse.json({ 
          success: true, 
          message: 'Cuenta eliminada exitosamente' 
        })

      default:
        return NextResponse.json(
          { error: 'Acción no válida' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Error al procesar acción de configuración:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
