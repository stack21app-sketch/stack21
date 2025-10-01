import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function PUT(request: NextRequest) {
  try {
    const token = await getToken({ req: request })
    
    if (!token || !token.sub) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const settings = await request.json()

    // Validar datos de entrada
    if (!settings.name || !settings.slug) {
      return NextResponse.json(
        { error: 'Nombre y slug son requeridos' },
        { status: 400 }
      )
    }

    // Simulación de guardado de configuraciones (reemplazar con base de datos real)
    const updatedSettings = {
      ...settings,
      updatedAt: new Date().toISOString(),
      updatedBy: token.sub
    }

    // En producción, aquí guardarías en la base de datos:
    /*
    const workspace = await prisma.workspace.update({
      where: { 
        slug: workspaceSlug,
        members: {
          some: {
            userId: token.sub,
            role: { in: ['OWNER', 'ADMIN'] }
          }
        }
      },
      data: {
        name: settings.name,
        slug: settings.slug,
        description: settings.description,
        timezone: settings.timezone,
        language: settings.language,
        theme: settings.theme,
        settings: {
          notifications: settings.notifications,
          api: settings.api,
          security: settings.security
        }
      }
    })
    */

    return NextResponse.json({ 
      message: 'Configuraciones actualizadas exitosamente',
      settings: updatedSettings
    })
  } catch (error) {
    console.error('Error al actualizar configuraciones:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const token = await getToken({ req: request })
    
    if (!token || !token.sub) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // Simulación de carga de configuraciones (reemplazar con base de datos real)
    const settings = {
      name: 'Mi Workspace',
      slug: 'mi-workspace',
      description: 'Workspace de desarrollo con IA',
      timezone: 'America/Mexico_City',
      language: 'es',
      theme: 'dark',
      notifications: {
        email: true,
        push: true,
        aiUpdates: true,
        billing: true,
        team: true
      },
      api: {
        enabled: true,
        rateLimit: 1000,
        allowedOrigins: ['localhost:3000', 'mi-app.com']
      },
      security: {
        twoFactor: false,
        sessionTimeout: 30,
        ipWhitelist: []
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    // En producción, aquí cargarías desde la base de datos:
    /*
    const workspace = await prisma.workspace.findFirst({
      where: { 
        slug: workspaceSlug,
        members: {
          some: {
            userId: token.sub
          }
        }
      },
      include: {
        settings: true
      }
    })
    */

    return NextResponse.json(settings)
  } catch (error) {
    console.error('Error al cargar configuraciones:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
