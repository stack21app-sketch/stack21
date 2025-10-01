import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function POST(request: NextRequest) {
  try {
    const token = await getToken({ req: request })
    
    if (!token || !token.sub) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { planId } = await request.json()

    if (!planId) {
      return NextResponse.json(
        { error: 'Plan ID es requerido' },
        { status: 400 }
      )
    }

    // Simulación de downgrade (reemplazar con Stripe real)
    const plans = {
      'free': { price: 0, name: 'Gratis' },
      'pro': { price: 29, name: 'Pro' },
      'enterprise': { price: 99, name: 'Enterprise' }
    }

    const selectedPlan = plans[planId as keyof typeof plans]
    
    if (!selectedPlan) {
      return NextResponse.json(
        { error: 'Plan no válido' },
        { status: 400 }
      )
    }

    // En producción, aquí cancelarías la suscripción actual y crearías una nueva:
    /*
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
    
    // Cancelar suscripción actual
    await stripe.subscriptions.update(currentSubscriptionId, {
      cancel_at_period_end: true
    })

    // Crear nueva suscripción con el plan seleccionado
    const newSubscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [
        {
          price: selectedPlan.stripePriceId,
        },
      ],
      metadata: {
        userId: token.sub,
        workspaceId: workspaceId,
        planId: planId
      }
    })

    return NextResponse.json({ 
      message: 'Downgrade procesado exitosamente',
      newSubscriptionId: newSubscription.id,
      planId,
      planName: selectedPlan.name
    })
    */

    // Simulación de respuesta
    return NextResponse.json({ 
      message: 'Downgrade procesado exitosamente',
      planId,
      planName: selectedPlan.name,
      price: selectedPlan.price,
      effectiveDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // Próximo ciclo de facturación
    })
  } catch (error) {
    console.error('Error al hacer downgrade:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
