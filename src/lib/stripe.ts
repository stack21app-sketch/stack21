import Stripe from 'stripe'

// Configuración del servidor (backend)
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
  typescript: true,
})

// Configuración del cliente (frontend)
export const getStripe = () => {
  if (typeof window !== 'undefined') {
    return require('@stripe/stripe-js').loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)
  }
  return null
}

// Planes de facturación
export const PLANS = {
  FREE: {
    name: 'Free',
    price: 0,
    priceId: null,
    features: [
      '100 ejecuciones/mes',
      'IA básica',
      '1 workspace',
      'Soporte por email'
    ],
    limits: {
      executions: 100,
      workspaces: 1,
      teamMembers: 1,
      storage: '1GB'
    }
  },
  GROWTH: {
    name: 'Growth',
    price: 29,
    priceId: process.env.STRIPE_GROWTH_PRICE_ID,
    features: [
      '1,000 ejecuciones/mes',
      'IA avanzada',
      '3 workspaces',
      'Soporte prioritario',
      'Analytics avanzados'
    ],
    limits: {
      executions: 1000,
      workspaces: 3,
      teamMembers: 5,
      storage: '10GB'
    }
  },
  SCALE: {
    name: 'Scale',
    price: 99,
    priceId: process.env.STRIPE_SCALE_PRICE_ID,
    features: [
      '10,000 ejecuciones/mes',
      'IA personalizada',
      'Workspaces ilimitados',
      'Soporte 24/7',
      'API personalizada',
      'White-label'
    ],
    limits: {
      executions: 10000,
      workspaces: -1, // Ilimitado
      teamMembers: 25,
      storage: '100GB'
    }
  },
  ENTERPRISE: {
    name: 'Enterprise',
    price: 299,
    priceId: process.env.STRIPE_ENTERPRISE_PRICE_ID,
    features: [
      'Ejecuciones ilimitadas',
      'IA privada',
      'Workspaces ilimitados',
      'Soporte dedicado',
      'SLA garantizado',
      'On-premise'
    ],
    limits: {
      executions: -1, // Ilimitado
      workspaces: -1, // Ilimitado
      teamMembers: -1, // Ilimitado
      storage: -1 // Ilimitado
    }
  }
}

// Función para crear sesión de checkout
export async function createCheckoutSession({
  priceId,
  customerId,
  successUrl,
  cancelUrl,
  metadata = {}
}: {
  priceId: string
  customerId?: string
  successUrl: string
  cancelUrl: string
  metadata?: Record<string, string>
}) {
  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      customer: customerId,
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata,
      subscription_data: {
        metadata,
      },
    })

    return { sessionId: session.id, url: session.url }
  } catch (error) {
    console.error('Error creating checkout session:', error)
    throw new Error('Failed to create checkout session')
  }
}

// Función para crear portal de facturación
export async function createBillingPortalSession({
  customerId,
  returnUrl
}: {
  customerId: string
  returnUrl: string
}) {
  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    })

    return { url: session.url }
  } catch (error) {
    console.error('Error creating billing portal session:', error)
    throw new Error('Failed to create billing portal session')
  }
}

// Función para obtener suscripción
export async function getSubscription(subscriptionId: string) {
  try {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId)
    return subscription
  } catch (error) {
    console.error('Error retrieving subscription:', error)
    throw new Error('Failed to retrieve subscription')
  }
}

// Función para cancelar suscripción
export async function cancelSubscription(subscriptionId: string) {
  try {
    const subscription = await stripe.subscriptions.cancel(subscriptionId)
    return subscription
  } catch (error) {
    console.error('Error canceling subscription:', error)
    throw new Error('Failed to cancel subscription')
  }
}

// Función para actualizar suscripción
export async function updateSubscription({
  subscriptionId,
  priceId
}: {
  subscriptionId: string
  priceId: string
}) {
  try {
    const subscription = await stripe.subscriptions.update(subscriptionId, {
      items: [
        {
          id: subscriptionId,
          price: priceId,
        },
      ],
    })

    return subscription
  } catch (error) {
    console.error('Error updating subscription:', error)
    throw new Error('Failed to update subscription')
  }
}