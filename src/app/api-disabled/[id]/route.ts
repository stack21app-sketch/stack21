import { NextRequest, NextResponse } from 'next/server'
import { getModuleById } from '@/lib/marketplace'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    
    if (!id) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'ID de módulo requerido' 
        },
        { status: 400 }
      )
    }

    const moduleData = getModuleById(id)
    
    if (!moduleData) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Módulo no encontrado' 
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: moduleData
    })
  } catch (error) {
    console.error('Error fetching module details:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error al obtener los detalles del módulo' 
      },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()
    const { action, userId, data } = body

    if (!id) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'ID de módulo requerido' 
        },
        { status: 400 }
      )
    }

    const moduleData = getModuleById(id)
    
    if (!moduleData) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Módulo no encontrado' 
        },
        { status: 404 }
      )
    }

    switch (action) {
      case 'install':
        // Simular instalación de módulo específico
        console.log(`Installing module ${id} for user ${userId}`)
        
        // Aquí se implementaría la lógica real de instalación
        // - Verificar compatibilidad
        // - Instalar dependencias
        // - Configurar el módulo
        // - Activar en el workspace del usuario
        
        return NextResponse.json({
          success: true,
          message: `Módulo ${moduleData.name} instalado correctamente`,
          data: {
            moduleId: id,
            moduleName: moduleData.name,
            version: moduleData.version,
            installedAt: new Date().toISOString(),
            status: 'active',
            configuration: {
              enabled: true,
              settings: moduleData.requirements
            }
          }
        })

      case 'uninstall':
        // Simular desinstalación de módulo específico
        console.log(`Uninstalling module ${id} for user ${userId}`)
        
        return NextResponse.json({
          success: true,
          message: `Módulo ${moduleData.name} desinstalado correctamente`,
          data: {
            moduleId: id,
            moduleName: moduleData.name,
            uninstalledAt: new Date().toISOString(),
            status: 'inactive'
          }
        })

      case 'update':
        // Simular actualización de módulo
        console.log(`Updating module ${id} for user ${userId}`)
        
        return NextResponse.json({
          success: true,
          message: `Módulo ${moduleData.name} actualizado correctamente`,
          data: {
            moduleId: id,
            moduleName: moduleData.name,
            previousVersion: data?.previousVersion || '1.0.0',
            newVersion: moduleData.version,
            updatedAt: new Date().toISOString(),
            status: 'active'
          }
        })

      case 'configure':
        // Simular configuración de módulo
        console.log(`Configuring module ${id} for user ${userId}`)
        
        return NextResponse.json({
          success: true,
          message: `Configuración del módulo ${moduleData.name} guardada`,
          data: {
            moduleId: id,
            moduleName: moduleData.name,
            configuration: data?.configuration || {},
            configuredAt: new Date().toISOString(),
            status: 'configured'
          }
        })

      case 'rate':
        const { rating, review, title } = data
        
        // Simular calificación de módulo específico
        console.log(`Rating module ${id}: ${rating} stars - ${title}`)
        
        return NextResponse.json({
          success: true,
          message: 'Calificación enviada correctamente',
          data: {
            moduleId: id,
            moduleName: moduleData.name,
            rating,
            review,
            title,
            ratedAt: new Date().toISOString(),
            userId
          }
        })

      case 'report':
        const { reason, description } = data
        
        // Simular reporte de módulo
        console.log(`Reporting module ${id}: ${reason} - ${description}`)
        
        return NextResponse.json({
          success: true,
          message: 'Reporte enviado correctamente',
          data: {
            moduleId: id,
            moduleName: moduleData.name,
            reason,
            description,
            reportedAt: new Date().toISOString(),
            userId,
            status: 'pending_review'
          }
        })

      default:
        return NextResponse.json(
          { 
            success: false, 
            error: 'Acción no válida' 
          },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Error processing module action:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error al procesar la acción del módulo' 
      },
      { status: 500 }
    )
  }
}
