/* @ts-nocheck */
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import Stripe from 'stripe'

// Configuración de Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
})

// Configuración de base de datos
const { PrismaClient } = require('@prisma/client')

let prisma: any = null
let useDatabase = false

try {
  prisma = new PrismaClient()
  useDatabase = true
  console.log('✅ Prisma Client inicializado para facturación')
} catch (error) {
  console.log('⚠️ Error inicializando Prisma para facturación:', error)
  useDatabase = false
}

// Simulación de planes de facturación
const mockPlans = [
  {
    id: 'free',
    name: 'Gratis',
    description: 'Perfecto para empezar',
    price: 0,
    interval: 'month',
    features: [
      '1 Workspace',
      '3 Proyectos',
      '5 Workflows',
      '10 ejecuciones de agentes IA/mes',
      'Soporte por email',
      '1GB almacenamiento'
    ],
    limits: {
      workspaces: 1,
      projects: 3,
      workflows: 5,
      storage: 1024, // MB
      members: 2,
      agentExecutions: 10 // ejecuciones de agentes por mes
    }
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'Para equipos en crecimiento',
    price: 29,
    interval: 'month',
    features: [
      '5 Workspaces',
      '20 Proyectos',
      '50 Workflows',
      '100 ejecuciones de agentes IA/mes',
      'Agentes de reservas y marketing',
      'Soporte prioritario',
      '10GB almacenamiento',
      'Analytics avanzados',
      'Integraciones API'
    ],
    limits: {
      workspaces: 5,
      projects: 20,
      workflows: 50,
      storage: 10240, // MB
      members: 10,
      agentExecutions: 100 // ejecuciones de agentes por mes
    }
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'Para organizaciones grandes',
    price: 99,
    interval: 'month',
    features: [
      'Workspaces ilimitados',
      'Proyectos ilimitados',
      'Workflows ilimitados',
      'Ejecuciones ilimitadas de agentes IA',
      'Todos los agentes especializados',
      'Agentes personalizados',
      'Soporte 24/7',
      '100GB almacenamiento',
      'Analytics personalizados',
      'SSO integrado',
      'SLA garantizado'
    ],
    limits: {
      workspaces: -1, // ilimitado
      projects: -1,
      workflows: -1,
      storage: 102400, // MB
      members: -1,
      agentExecutions: -1 // ilimitado
    }
  }
]

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'plans'

    switch (type) {
      case 'plans':
        return NextResponse.json(mockPlans)

      case 'subscription':
        // Obtener suscripción del usuario
        if (useDatabase && prisma) {
          const billing = await prisma.billing.findFirst({
            where: { userId: session.user.id },
            include: {
              workspace: true
            }
          })

          if (billing?.stripeSubscriptionId) {
            try {
              const subscription = await stripe.subscriptions.retrieve(billing.stripeSubscriptionId)
              return NextResponse.json({
                id: subscription.id,
                status: subscription.status,
                currentPeriodStart: subscription.current_period_start,
                currentPeriodEnd: subscription.current_period_end,
                cancelAtPeriodEnd: subscription.cancel_at_period_end,
                plan: mockPlans.find(p => p.id === subscription.items.data[0].price.id) || mockPlans[0]
              })
            } catch (error) {
              console.error('Error obteniendo suscripción de Stripe:', error)
            }
          }
        }

        // Retornar plan gratuito por defecto
        return NextResponse.json({
          id: 'free',
          status: 'active',
          currentPeriodStart: Date.now(),
          currentPeriodEnd: Date.now() + (30 * 24 * 60 * 60 * 1000),
          cancelAtPeriodEnd: false,
          plan: mockPlans[0]
        })

      case 'invoices':
        // Obtener facturas del usuario
        if (useDatabase && prisma) {
          const billing = await prisma.billing.findFirst({
            where: { userId: session.user.id }
          })

          if (billing?.stripeCustomerId) {
            try {
              const invoices = await stripe.invoices.list({
                customer: billing.stripeCustomerId,
                limit: 10
              })

              return NextResponse.json(invoices.data.map(invoice => ({
                id: invoice.id,
                number: invoice.number,
                amount: invoice.amount_paid,
                currency: invoice.currency,
                status: invoice.status,
                created: invoice.created,
                pdf: invoice.invoice_pdf
              })))
            } catch (error) {
              console.error('Error obteniendo facturas de Stripe:', error)
            }
          }
        }

        // Retornar facturas simuladas
        return NextResponse.json([
          {
            id: 'inv_001',
            number: 'INV-001',
            amount: 0,
            currency: 'usd',
            status: 'paid',
            created: Date.now() - (30 * 24 * 60 * 60 * 1000),
            pdf: null
          }
        ])

      default:
        return NextResponse.json({ error: 'Tipo no válido' }, { status: 400 })
    }
  } catch (error) {
    console.error('Error en billing API:', error)
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

    const { action, planId, workspaceId } = await request.json()

    if (!action) {
      return NextResponse.json(
        { error: 'Acción es requerida' },
        { status: 400 }
      )
    }

    switch (action) {
      case 'create_checkout_session':
        if (!planId) {
          return NextResponse.json(
            { error: 'planId es requerido' },
            { status: 400 }
          )
        }

        const plan = mockPlans.find(p => p.id === planId)
        if (!plan) {
          return NextResponse.json(
            { error: 'Plan no encontrado' },
            { status: 404 }
          )
        }

        if (plan.price === 0) {
          // Plan gratuito - activar directamente
          if (useDatabase && prisma) {
            await prisma.billing.upsert({
              where: { userId: session.user.id },
              update: {
                plan: planId,
                status: 'ACTIVE',
                currentPeriodStart: new Date(),
                currentPeriodEnd: new Date(Date.now() + (30 * 24 * 60 * 60 * 1000))
              },
              create: {
                userId: session.user.id,
                workspaceId: workspaceId || null,
                plan: planId,
                status: 'ACTIVE',
                currentPeriodStart: new Date(),
                currentPeriodEnd: new Date(Date.now() + (30 * 24 * 60 * 60 * 1000))
              }
            })
          }

          return NextResponse.json({
            success: true,
            message: 'Plan gratuito activado',
            plan: plan
          })
        }

        // Crear sesión de checkout de Stripe (pausado si no hay clave)
        try {
          if (!process.env.STRIPE_SECRET_KEY || !process.env.NEXT_PUBLIC_APP_URL) {
            return NextResponse.json({
              success: true,
              checkoutUrl: `/dashboard/billing?mockCheckout=true&plan=${plan.id}`
            })
          }

          const checkoutSession = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
              {
                price_data: {
                  currency: 'usd',
                  product_data: {
                    name: plan.name,
                    description: plan.description,
                  },
                  unit_amount: plan.price * 100, // Stripe usa centavos
                  recurring: {
                    interval: plan.interval as any,
                  },
                },
                quantity: 1,
              },
            ],
            mode: 'subscription',
            success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing?success=true`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing?canceled=true`,
            customer_email: session.user.email || undefined,
            metadata: {
              userId: session.user.id,
              workspaceId: workspaceId || '',
            },
          })

          return NextResponse.json({
            success: true,
            checkoutUrl: checkoutSession.url
          })
        } catch (error) {
          console.error('Error creando sesión de checkout:', error)
          return NextResponse.json(
            { error: 'Error creando sesión de pago' },
            { status: 500 }
          )
        }

      case 'cancel_subscription':
        if (useDatabase && prisma) {
          const billing = await prisma.billing.findFirst({
            where: { userId: session.user.id }
          })

          if (billing?.stripeSubscriptionId) {
            try {
              await stripe.subscriptions.update(billing.stripeSubscriptionId, {
                cancel_at_period_end: true
              })

              await prisma.billing.update({
                where: { id: billing.id },
                data: { cancelAtPeriodEnd: true }
              })

              return NextResponse.json({
                success: true,
                message: 'Suscripción cancelada al final del período'
              })
            } catch (error) {
              console.error('Error cancelando suscripción:', error)
              return NextResponse.json(
                { error: 'Error cancelando suscripción' },
                { status: 500 }
              )
            }
          }
        }

        return NextResponse.json({
          success: true,
          message: 'Suscripción cancelada'
        })

      case 'reactivate_subscription':
        if (useDatabase && prisma) {
          const billing = await prisma.billing.findFirst({
            where: { userId: session.user.id }
          })

          if (billing?.stripeSubscriptionId) {
            try {
              await stripe.subscriptions.update(billing.stripeSubscriptionId, {
                cancel_at_period_end: false
              })

              await prisma.billing.update({
                where: { id: billing.id },
                data: { cancelAtPeriodEnd: false }
              })

              return NextResponse.json({
                success: true,
                message: 'Suscripción reactivada'
              })
            } catch (error) {
              console.error('Error reactivando suscripción:', error)
              return NextResponse.json(
                { error: 'Error reactivando suscripción' },
                { status: 500 }
              )
            }
          }
        }

        return NextResponse.json({
          success: true,
          message: 'Suscripción reactivada'
        })

      default:
        return NextResponse.json(
          { error: 'Acción no válida' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Error en billing API:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
