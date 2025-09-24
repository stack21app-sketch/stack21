import { NextRequest, NextResponse } from 'next/server'
import { 
  SAMPLE_MODULES, 
  getModulesByCategory,
  getFreeModules,
  getPremiumModules,
  searchModules,
  getModuleById,
  getTopRatedModules,
  getMostDownloadedModules,
  getRecentlyAddedModules,
  getModuleStats
} from '@/lib/marketplace'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const price = searchParams.get('price')
    const difficulty = searchParams.get('difficulty')
    const sort = searchParams.get('sort')
    const limit = searchParams.get('limit')

    let modules = SAMPLE_MODULES

    // Filtrar por categoría
    if (category && category !== 'all') {
      modules = getModulesByCategory(category)
    }

    // Filtrar por búsqueda
    if (search) {
      modules = searchModules(search)
    }

    // Filtrar por precio
    if (price === 'free') {
      modules = modules.filter(m => m.isFree)
    } else if (price === 'premium') {
      modules = modules.filter(m => !m.isFree)
    }

    // Filtrar por dificultad
    if (difficulty && difficulty !== 'all') {
      modules = modules.filter(m => m.difficulty === difficulty)
    }

    // Ordenar
    switch (sort) {
      case 'popular':
        modules = getMostDownloadedModules(100)
        break
      case 'rating':
        modules = getTopRatedModules(100)
        break
      case 'newest':
        modules = getRecentlyAddedModules(100)
        break
      case 'name':
        modules = modules.sort((a, b) => a.name.localeCompare(b.name))
        break
      case 'price-low':
        modules = modules.sort((a, b) => a.price - b.price)
        break
      case 'price-high':
        modules = modules.sort((a, b) => b.price - a.price)
        break
    }

    // Limitar resultados
    if (limit) {
      const limitNum = parseInt(limit)
      modules = modules.slice(0, limitNum)
    }

    const stats = getModuleStats()

    return NextResponse.json({
      success: true,
      data: {
        modules,
        stats,
        filters: {
          category,
          search,
          price,
          difficulty,
          sort,
          limit
        }
      }
    })
  } catch (error) {
    console.error('Error fetching marketplace modules:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error al obtener los módulos del marketplace' 
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, moduleId, userId } = body

    switch (action) {
      case 'install':
        // Simular instalación de módulo
        console.log(`Installing module ${moduleId} for user ${userId}`)
        
        // Aquí se implementaría la lógica real de instalación
        // - Verificar permisos del usuario
        // - Descargar el módulo
        // - Instalar dependencias
        // - Actualizar configuración
        
        return NextResponse.json({
          success: true,
          message: 'Módulo instalado correctamente',
          data: {
            moduleId,
            installedAt: new Date().toISOString(),
            status: 'active'
          }
        })

      case 'uninstall':
        // Simular desinstalación de módulo
        console.log(`Uninstalling module ${moduleId} for user ${userId}`)
        
        return NextResponse.json({
          success: true,
          message: 'Módulo desinstalado correctamente',
          data: {
            moduleId,
            uninstalledAt: new Date().toISOString(),
            status: 'inactive'
          }
        })

      case 'rate':
        const { rating, review } = body
        
        // Simular calificación de módulo
        console.log(`Rating module ${moduleId}: ${rating} stars`)
        
        return NextResponse.json({
          success: true,
          message: 'Calificación enviada correctamente',
          data: {
            moduleId,
            rating,
            review,
            ratedAt: new Date().toISOString()
          }
        })

      case 'favorite':
        // Simular agregar a favoritos
        console.log(`Adding module ${moduleId} to favorites for user ${userId}`)
        
        return NextResponse.json({
          success: true,
          message: 'Módulo agregado a favoritos',
          data: {
            moduleId,
            favoritedAt: new Date().toISOString()
          }
        })

      case 'unfavorite':
        // Simular quitar de favoritos
        console.log(`Removing module ${moduleId} from favorites for user ${userId}`)
        
        return NextResponse.json({
          success: true,
          message: 'Módulo removido de favoritos',
          data: {
            moduleId,
            unfavoritedAt: new Date().toISOString()
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
    console.error('Error processing marketplace action:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error al procesar la acción del marketplace' 
      },
      { status: 500 }
    )
  }
}