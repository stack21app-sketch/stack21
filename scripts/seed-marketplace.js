const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const sampleWorkflows = [
  {
    name: "Automatización de Ventas",
    description: "Workflow completo para automatizar el proceso de ventas desde lead hasta cierre",
    category: "sales",
    price: 29.99,
    featured: true,
    public: true,
    template: true,
    tags: ["ventas", "crm", "automatización"],
    industry: "SaaS",
    nodes: JSON.stringify([
      {
        id: "1",
        type: "webhook",
        position: { x: 100, y: 100 },
        config: { url: "https://api.example.com/leads" }
      },
      {
        id: "2", 
        type: "ai",
        position: { x: 300, y: 100 },
        config: { 
          model: "gpt-4",
          prompt: "Analiza el lead y determina su score de calidad",
          temperature: 0.7
        }
      },
      {
        id: "3",
        type: "email",
        position: { x: 500, y: 100 },
        config: {
          to: "{{lead.email}}",
          subject: "¡Gracias por tu interés!",
          template: "welcome"
        }
      }
    ]),
    connections: JSON.stringify([
      { from: "1", to: "2" },
      { from: "2", to: "3" }
    ]),
    downloads: 156,
    rating: 4.8
  },
  {
    name: "Procesamiento de Documentos IA",
    description: "Extrae y procesa información de documentos PDF usando IA",
    category: "ai",
    price: 19.99,
    featured: true,
    public: true,
    template: true,
    tags: ["ia", "documentos", "pdf", "extracción"],
    industry: "Legal",
    nodes: JSON.stringify([
      {
        id: "1",
        type: "file_upload",
        position: { x: 100, y: 100 },
        config: { acceptedTypes: ["pdf", "docx"] }
      },
      {
        id: "2",
        type: "ai",
        position: { x: 300, y: 100 },
        config: {
          model: "gpt-4",
          prompt: "Extrae la información clave del documento: fechas, nombres, montos, cláusulas importantes",
          temperature: 0.3
        }
      },
      {
        id: "3",
        type: "database",
        position: { x: 500, y: 100 },
        config: {
          table: "extracted_documents",
          operation: "insert"
        }
      }
    ]),
    connections: JSON.stringify([
      { from: "1", to: "2" },
      { from: "2", to: "3" }
    ]),
    downloads: 89,
    rating: 4.6
  },
  {
    name: "Notificaciones Slack Inteligentes",
    description: "Envía notificaciones contextuales a Slack basadas en eventos del sistema",
    category: "communication",
    price: 9.99,
    featured: false,
    public: true,
    template: true,
    tags: ["slack", "notificaciones", "monitoreo"],
    industry: "Tecnología",
    nodes: JSON.stringify([
      {
        id: "1",
        type: "webhook",
        position: { x: 100, y: 100 },
        config: { url: "https://api.example.com/events" }
      },
      {
        id: "2",
        type: "ai",
        position: { x: 300, y: 100 },
        config: {
          model: "gpt-3.5-turbo",
          prompt: "Genera un mensaje de notificación apropiado para este evento",
          temperature: 0.5
        }
      },
      {
        id: "3",
        type: "slack",
        position: { x: 500, y: 100 },
        config: {
          channel: "#alerts",
          webhook: "{{SLACK_WEBHOOK_URL}}"
        }
      }
    ]),
    connections: JSON.stringify([
      { from: "1", to: "2" },
      { from: "2", to: "3" }
    ]),
    downloads: 234,
    rating: 4.7
  },
  {
    name: "Análisis de Sentimientos en Redes Sociales",
    description: "Monitorea menciones de tu marca y analiza el sentimiento usando IA",
    category: "social",
    price: 39.99,
    featured: true,
    public: true,
    template: true,
    tags: ["redes-sociales", "sentimientos", "monitoreo", "ia"],
    industry: "Marketing",
    nodes: JSON.stringify([
      {
        id: "1",
        type: "twitter",
        position: { x: 100, y: 100 },
        config: {
          searchTerm: "{{brand_name}}",
          count: 100
        }
      },
      {
        id: "2",
        type: "ai",
        position: { x: 300, y: 100 },
        config: {
          model: "gpt-4",
          prompt: "Analiza el sentimiento de estos tweets sobre la marca. Clasifica como: positivo, negativo, neutral",
          temperature: 0.2
        }
      },
      {
        id: "3",
        type: "dashboard",
        position: { x: 500, y: 100 },
        config: {
          widget: "sentiment_chart",
          updateInterval: "1h"
        }
      }
    ]),
    connections: JSON.stringify([
      { from: "1", to: "2" },
      { from: "2", to: "3" }
    ]),
    downloads: 67,
    rating: 4.9
  },
  {
    name: "Automatización de Soporte al Cliente",
    description: "Sistema completo de tickets de soporte con clasificación automática por IA",
    category: "support",
    price: 49.99,
    featured: false,
    public: true,
    template: true,
    tags: ["soporte", "tickets", "clasificación", "ia"],
    industry: "Servicios",
    nodes: JSON.stringify([
      {
        id: "1",
        type: "email",
        position: { x: 100, y: 100 },
        config: {
          address: "support@company.com",
          filter: "unread"
        }
      },
      {
        id: "2",
        type: "ai",
        position: { x: 300, y: 100 },
        config: {
          model: "gpt-4",
          prompt: "Clasifica este ticket de soporte por: urgencia (alta/media/baja), categoría (técnico/facturación/general), y asigna un agente apropiado",
          temperature: 0.3
        }
      },
      {
        id: "3",
        type: "database",
        position: { x: 500, y: 100 },
        config: {
          table: "support_tickets",
          operation: "create"
        }
      },
      {
        id: "4",
        type: "slack",
        position: { x: 500, y: 200 },
        config: {
          channel: "#support-alerts",
          message: "Nuevo ticket: {{ticket.id}} - {{ticket.urgency}}"
        }
      }
    ]),
    connections: JSON.stringify([
      { from: "1", to: "2" },
      { from: "2", to: "3" },
      { from: "2", to: "4" }
    ]),
    downloads: 123,
    rating: 4.5
  }
]

async function seedMarketplace() {
  try {
    console.log('🌱 Iniciando seed del marketplace...')

    // Crear un usuario de ejemplo si no existe
    let demoUser = await prisma.user.findFirst({
      where: { email: 'demo@stack21.com' }
    })

    if (!demoUser) {
      demoUser = await prisma.user.create({
        data: {
          email: 'demo@stack21.com',
          name: 'Demo User',
          image: 'https://avatars.githubusercontent.com/u/1?v=4'
        }
      })
      console.log('✅ Usuario demo creado')
    }

    // Crear un workspace de ejemplo
    let demoWorkspace = await prisma.workspace.findFirst({
      where: { slug: 'demo-workspace' }
    })

    if (!demoWorkspace) {
      demoWorkspace = await prisma.workspace.create({
        data: {
          name: 'Demo Workspace',
          slug: 'demo-workspace',
          description: 'Workspace de demostración para el marketplace',
          creatorId: demoUser.id
        }
      })
      console.log('✅ Workspace demo creado')
    }

    // Crear workflows de ejemplo
    for (const workflowData of sampleWorkflows) {
      const existingWorkflow = await prisma.workflow.findFirst({
        where: { 
          name: workflowData.name,
          userId: demoUser.id
        }
      })

      if (!existingWorkflow) {
        await prisma.workflow.create({
          data: {
            ...workflowData,
            userId: demoUser.id,
            workspaceId: demoWorkspace.id,
            status: 'ACTIVE',
            isActive: true,
            triggerType: 'WEBHOOK'
          }
        })
        console.log(`✅ Workflow creado: ${workflowData.name}`)
      }
    }

    // Crear algunas reviews de ejemplo
    const workflows = await prisma.workflow.findMany({
      where: { public: true }
    })

    for (const workflow of workflows.slice(0, 3)) {
      const existingReview = await prisma.workflowReview.findFirst({
        where: {
          workflowId: workflow.id,
          userId: demoUser.id
        }
      })

      if (!existingReview) {
        await prisma.workflowReview.create({
          data: {
            workflowId: workflow.id,
            userId: demoUser.id,
            rating: Math.floor(Math.random() * 2) + 4, // 4 o 5 estrellas
            comment: 'Excelente workflow, muy fácil de usar y configurar. Lo recomiendo totalmente.'
          }
        })
      }
    }

    console.log('🎉 Marketplace seed completado exitosamente!')
    console.log(`📊 Creados: ${sampleWorkflows.length} workflows, 1 usuario, 1 workspace`)

  } catch (error) {
    console.error('❌ Error en seed del marketplace:', error)
  } finally {
    await prisma.$disconnect()
  }
}

seedMarketplace()
