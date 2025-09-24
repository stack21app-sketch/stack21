import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// Configuración de base de datos
const { PrismaClient } = require('@prisma/client')

let prisma: any = null
let useDatabase = false

try {
  prisma = new PrismaClient()
  useDatabase = true
  console.log('✅ Prisma Client inicializado para plantillas')
} catch (error) {
  console.log('⚠️ Error inicializando Prisma para plantillas:', error)
  useDatabase = false
}

// Simulación de plantillas
const mockTemplates = [
  {
    id: 'template_1',
    name: 'E-commerce Platform',
    description: 'Plantilla completa para una plataforma de comercio electrónico',
    category: 'ecommerce',
    icon: '🛒',
    tags: ['ecommerce', 'shopping', 'payments', 'inventory'],
    preview: 'https://example.com/preview/ecommerce',
    isPublic: true,
    isOfficial: true,
    downloads: 1250,
    rating: 4.8,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
    author: {
      name: 'SaaS Platform',
      avatar: null
    },
    components: [
      {
        type: 'workspace',
        name: 'E-commerce Workspace',
        description: 'Workspace principal con configuración de tienda',
        config: {
          name: 'Mi Tienda Online',
          slug: 'mi-tienda-online',
          description: 'Plataforma de comercio electrónico'
        }
      },
      {
        type: 'project',
        name: 'Frontend React',
        description: 'Aplicación frontend con React y Next.js',
        config: {
          name: 'Frontend E-commerce',
          description: 'Interfaz de usuario para la tienda online',
          techStack: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS']
        }
      },
      {
        type: 'project',
        name: 'Backend API',
        description: 'API backend con Node.js y Express',
        config: {
          name: 'API E-commerce',
          description: 'API REST para la tienda online',
          techStack: ['Node.js', 'Express', 'MongoDB', 'JWT']
        }
      },
      {
        type: 'workflow',
        name: 'Order Processing',
        description: 'Workflow para procesar pedidos',
        config: {
          name: 'Procesamiento de Pedidos',
          steps: [
            'Validar pedido',
            'Verificar inventario',
            'Procesar pago',
            'Enviar confirmación',
            'Actualizar inventario'
          ]
        }
      },
      {
        type: 'integration',
        name: 'Payment Gateway',
        description: 'Integración con pasarela de pagos',
        config: {
          type: 'stripe',
          name: 'Stripe Payments',
          settings: {
            webhookUrl: 'https://api.mitienda.com/webhooks/stripe',
            currency: 'USD'
          }
        }
      }
    ]
  },
  {
    id: 'template_2',
    name: 'SaaS Dashboard',
    description: 'Dashboard administrativo para aplicaciones SaaS',
    category: 'dashboard',
    icon: '📊',
    tags: ['dashboard', 'admin', 'analytics', 'management'],
    preview: 'https://example.com/preview/dashboard',
    isPublic: true,
    isOfficial: true,
    downloads: 890,
    rating: 4.6,
    createdAt: '2024-01-05T00:00:00Z',
    updatedAt: '2024-01-12T00:00:00Z',
    author: {
      name: 'SaaS Platform',
      avatar: null
    },
    components: [
      {
        type: 'workspace',
        name: 'Admin Workspace',
        description: 'Workspace para administración',
        config: {
          name: 'Admin Dashboard',
          slug: 'admin-dashboard',
          description: 'Panel de administración'
        }
      },
      {
        type: 'project',
        name: 'Analytics Dashboard',
        description: 'Dashboard de analytics y métricas',
        config: {
          name: 'Analytics Dashboard',
          description: 'Visualización de datos y métricas',
          techStack: ['React', 'Chart.js', 'D3.js']
        }
      },
      {
        type: 'workflow',
        name: 'User Onboarding',
        description: 'Workflow de incorporación de usuarios',
        config: {
          name: 'Onboarding de Usuarios',
          steps: [
            'Crear cuenta',
            'Verificar email',
            'Completar perfil',
            'Configurar preferencias',
            'Tutorial inicial'
          ]
        }
      }
    ]
  },
  {
    id: 'template_3',
    name: 'Content Management',
    description: 'Sistema de gestión de contenido',
    category: 'cms',
    icon: '📝',
    tags: ['cms', 'content', 'blog', 'publishing'],
    preview: 'https://example.com/preview/cms',
    isPublic: true,
    isOfficial: false,
    downloads: 450,
    rating: 4.4,
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: '2024-01-14T00:00:00Z',
    author: {
      name: 'Community User',
      avatar: null
    },
    components: [
      {
        type: 'workspace',
        name: 'Content Workspace',
        description: 'Workspace para gestión de contenido',
        config: {
          name: 'Content Management',
          slug: 'content-management',
          description: 'Sistema de gestión de contenido'
        }
      },
      {
        type: 'project',
        name: 'Blog Platform',
        description: 'Plataforma de blog',
        config: {
          name: 'Blog Platform',
          description: 'Sistema de blog con editor WYSIWYG',
          techStack: ['React', 'Quill.js', 'Markdown']
        }
      }
    ]
  }
]

const categories = [
  { id: 'all', name: 'Todas', icon: '📁' },
  { id: 'ecommerce', name: 'E-commerce', icon: '🛒' },
  { id: 'dashboard', name: 'Dashboard', icon: '📊' },
  { id: 'cms', name: 'CMS', icon: '📝' },
  { id: 'blog', name: 'Blog', icon: '📰' },
  { id: 'portfolio', name: 'Portfolio', icon: '💼' },
  { id: 'saas', name: 'SaaS', icon: '🚀' },
  { id: 'mobile', name: 'Mobile', icon: '📱' }
]

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'templates'
    const category = searchParams.get('category') || 'all'
    const search = searchParams.get('search') || ''
    const sort = searchParams.get('sort') || 'popular'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')

    switch (type) {
      case 'templates':
        let filteredTemplates = [...mockTemplates]

        // Filtrar por categoría
        if (category !== 'all') {
          filteredTemplates = filteredTemplates.filter(t => t.category === category)
        }

        // Filtrar por búsqueda
        if (search) {
          const searchLower = search.toLowerCase()
          filteredTemplates = filteredTemplates.filter(t => 
            t.name.toLowerCase().includes(searchLower) ||
            t.description.toLowerCase().includes(searchLower) ||
            t.tags.some(tag => tag.toLowerCase().includes(searchLower))
          )
        }

        // Ordenar
        switch (sort) {
          case 'popular':
            filteredTemplates.sort((a, b) => b.downloads - a.downloads)
            break
          case 'rating':
            filteredTemplates.sort((a, b) => b.rating - a.rating)
            break
          case 'newest':
            filteredTemplates.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            break
          case 'name':
            filteredTemplates.sort((a, b) => a.name.localeCompare(b.name))
            break
        }

        // Paginación
        const startIndex = (page - 1) * limit
        const endIndex = startIndex + limit
        const paginatedTemplates = filteredTemplates.slice(startIndex, endIndex)

        return NextResponse.json({
          templates: paginatedTemplates,
          pagination: {
            page,
            limit,
            total: filteredTemplates.length,
            totalPages: Math.ceil(filteredTemplates.length / limit),
            hasMore: endIndex < filteredTemplates.length
          }
        })

      case 'template':
        const templateId = searchParams.get('templateId')
        if (!templateId) {
          return NextResponse.json(
            { error: 'templateId es requerido' },
            { status: 400 }
          )
        }

        const template = mockTemplates.find(t => t.id === templateId)
        if (!template) {
          return NextResponse.json(
            { error: 'Plantilla no encontrada' },
            { status: 404 }
          )
        }

        return NextResponse.json(template)

      case 'categories':
        return NextResponse.json(categories)

      case 'user_templates':
        // Plantillas del usuario
        let userTemplates: any[]

        if (useDatabase && prisma) {
          userTemplates = await prisma.template.findMany({
            where: { userId: session.user.id },
            orderBy: { createdAt: 'desc' }
          })
        } else {
          // Simulación - no hay plantillas del usuario por ahora
          userTemplates = []
        }

        return NextResponse.json(userTemplates)

      default:
        return NextResponse.json({ error: 'Tipo no válido' }, { status: 400 })
    }
  } catch (error) {
    console.error('Error en templates API:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { action, templateId, workspaceId, name, description, category, components } = await request.json()

    if (!action) {
      return NextResponse.json(
        { error: 'Acción es requerida' },
        { status: 400 }
      )
    }

    switch (action) {
      case 'install':
        if (!templateId || !workspaceId) {
          return NextResponse.json(
            { error: 'templateId y workspaceId son requeridos' },
            { status: 400 }
          )
        }

        const template = mockTemplates.find(t => t.id === templateId)
        if (!template) {
          return NextResponse.json(
            { error: 'Plantilla no encontrada' },
            { status: 404 }
          )
        }

        // Simular instalación de plantilla
        const installationResult = {
          success: true,
          message: `Plantilla "${template.name}" instalada exitosamente`,
          installedComponents: template.components.length,
          workspaceId
        }

        // Registrar en analytics
        if (useDatabase && prisma) {
          await prisma.analytics.create({
            data: {
              userId: session.user.id,
              workspaceId,
              event: 'template_installed',
              data: {
                templateId,
                templateName: template.name,
                componentsCount: template.components.length
              },
              timestamp: new Date()
            }
          })
        } else {
          console.log(`📦 Template Installed: ${template.name}`, {
            userId: session.user.id,
            workspaceId,
            templateId
          })
        }

        return NextResponse.json(installationResult)

      case 'create':
        if (!name || !description || !category || !components) {
          return NextResponse.json(
            { error: 'Nombre, descripción, categoría y componentes son requeridos' },
            { status: 400 }
          )
        }

        let newTemplate: any

        if (useDatabase && prisma) {
          newTemplate = await prisma.template.create({
            data: {
              name,
              description,
              category,
              components: JSON.stringify(components),
              userId: session.user.id,
              isPublic: false,
              isOfficial: false
            }
          })
        } else {
          // Simulación
          newTemplate = {
            id: `template_${Date.now()}`,
            name,
            description,
            category,
            components,
            userId: session.user.id,
            isPublic: false,
            isOfficial: false,
            downloads: 0,
            rating: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        }

        return NextResponse.json(newTemplate)

      case 'favorite':
        if (!templateId) {
          return NextResponse.json(
            { error: 'templateId es requerido' },
            { status: 400 }
          )
        }

        // Simular agregar/quitar de favoritos
        return NextResponse.json({
          success: true,
          message: 'Plantilla agregada a favoritos'
        })

      default:
        return NextResponse.json(
          { error: 'Acción no válida' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Error en templates API:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
