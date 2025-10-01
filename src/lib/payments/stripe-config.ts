
import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
})

export const STRIPE_CONFIG = {
  success_url: `${process.env.NEXTAUTH_URL}/dashboard/billing/success`,
  cancel_url: `${process.env.NEXTAUTH_URL}/dashboard/billing`,
  webhook_secret: process.env.STRIPE_WEBHOOK_SECRET!,
}

export const PRICING_PLANS = {
  free: {
    name: 'Gratis',
    price: 0,
    features: ['5 workflows', '100 emails/mes', 'Soporte básico'],
    limits: {
      workflows: 5,
      emails: 100,
      apiCalls: 1000
    }
  },
  pro: {
    name: 'Pro',
    price: 29,
    features: ['Workflows ilimitados', '1000 emails/mes', 'Soporte prioritario', 'IA avanzada'],
    limits: {
      workflows: -1, // ilimitado
      emails: 1000,
      apiCalls: 10000
    }
  },
  enterprise: {
    name: 'Empresarial',
    price: 99,
    features: ['Todo de Pro', 'API personalizada', 'Soporte 24/7', 'SSO', 'Integraciones personalizadas'],
    limits: {
      workflows: -1,
      emails: 10000,
      apiCalls: 100000
    }
  }
}
