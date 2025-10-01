import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

export const STRIPE_PLANS = {
  FREE: {
    name: 'Free',
    price: 0,
    priceId: null,
    features: [
      '100 ejecuciones/mes',
      '5 workflows activos',
      '3 conexiones',
      'Soporte por email',
    ],
    limits: {
      runsPerMonth: 100,
      activeWorkflows: 5,
      connections: 3,
      storageGB: 1,
    },
  },
  PRO: {
    name: 'Pro',
    price: 29,
    priceId: process.env.STRIPE_PRO_PRICE_ID,
    features: [
      '2,000 ejecuciones/mes',
      '50 workflows activos',
      '20 conexiones',
      '10GB almacenamiento',
      'Soporte prioritario',
      'Webhooks avanzados',
    ],
    limits: {
      runsPerMonth: 2000,
      activeWorkflows: 50,
      connections: 20,
      storageGB: 10,
    },
  },
  ENTERPRISE: {
    name: 'Enterprise',
    price: 99,
    priceId: process.env.STRIPE_ENTERPRISE_PRICE_ID,
    features: [
      'Ejecuciones ilimitadas',
      'Workflows ilimitados',
      'Conexiones ilimitadas',
      '100GB almacenamiento',
      'Soporte 24/7',
      'API dedicada',
      'SSO',
    ],
    limits: {
      runsPerMonth: -1, // Unlimited
      activeWorkflows: -1,
      connections: -1,
      storageGB: 100,
    },
  },
};

export const USAGE_TIERS = {
  RUNS: {
    FREE: { price: 0, runs: 100 },
    PRO: { price: 0.01, runs: 2000 },
    ENTERPRISE: { price: 0.005, runs: -1 },
  },
  STORAGE: {
    FREE: { price: 0, gb: 1 },
    PRO: { price: 0.1, gb: 10 },
    ENTERPRISE: { price: 0.05, gb: 100 },
  },
  AI_TOKENS: {
    FREE: { price: 0, tokens: 1000 },
    PRO: { price: 0.0001, tokens: 100000 },
    ENTERPRISE: { price: 0.00005, tokens: -1 },
  },
};

export async function createCustomer(email: string, name: string) {
  return await stripe.customers.create({
    email,
    name,
    metadata: {
      source: 'stack21',
    },
  });
}

export async function createSubscription(
  customerId: string,
  priceId: string,
  trialDays?: number
) {
  return await stripe.subscriptions.create({
    customer: customerId,
    items: [{ price: priceId }],
    trial_period_days: trialDays,
    payment_behavior: 'default_incomplete',
    payment_settings: { save_default_payment_method: 'on_subscription' },
    expand: ['latest_invoice.payment_intent'],
  });
}

export async function createUsageRecord(
  subscriptionItemId: string,
  quantity: number,
  timestamp?: number
) {
  return await stripe.subscriptionItems.createUsageRecord(
    subscriptionItemId,
    {
      quantity,
      timestamp: timestamp || Math.floor(Date.now() / 1000),
    }
  );
}

export async function getSubscription(subscriptionId: string) {
  return await stripe.subscriptions.retrieve(subscriptionId);
}

export async function cancelSubscription(subscriptionId: string) {
  return await stripe.subscriptions.cancel(subscriptionId);
}

export async function createCheckoutSession(
  customerId: string,
  priceId: string,
  successUrl: string,
  cancelUrl: string
) {
  return await stripe.checkout.sessions.create({
    customer: customerId,
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: successUrl,
    cancel_url: cancelUrl,
    allow_promotion_codes: true,
  });
}

export async function createPortalSession(customerId: string, returnUrl: string) {
  return await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  });
}

export function calculateUsageCost(
  plan: keyof typeof STRIPE_PLANS,
  usage: {
    runs: number;
    storageGB: number;
    aiTokens: number;
  }
): number {
  const planConfig = STRIPE_PLANS[plan];
  const runTier = USAGE_TIERS.RUNS[plan];
  const storageTier = USAGE_TIERS.STORAGE[plan];
  const aiTier = USAGE_TIERS.AI_TOKENS[plan];

  let cost = planConfig.price;

  // Calcular costo de ejecuciones
  if (runTier.runs !== -1 && usage.runs > runTier.runs) {
    cost += (usage.runs - runTier.runs) * runTier.price;
  } else if (runTier.runs === -1) {
    cost += usage.runs * runTier.price;
  }

  // Calcular costo de almacenamiento
  if (storageTier.gb !== -1 && usage.storageGB > storageTier.gb) {
    cost += (usage.storageGB - storageTier.gb) * storageTier.price;
  } else if (storageTier.gb === -1) {
    cost += usage.storageGB * storageTier.price;
  }

  // Calcular costo de tokens de IA
  if (aiTier.tokens !== -1 && usage.aiTokens > aiTier.tokens) {
    cost += (usage.aiTokens - aiTier.tokens) * aiTier.price;
  } else if (aiTier.tokens === -1) {
    cost += usage.aiTokens * aiTier.price;
  }

  return Math.round(cost * 100) / 100; // Redondear a 2 decimales
}

// Alias para compatibilidad
export const PLANS = STRIPE_PLANS;