// Configuración de Stripe
export const stripeConfig = {
  publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
  secretKey: process.env.STRIPE_SECRET_KEY,
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
  enabled: !!(process.env.STRIPE_PUBLISHABLE_KEY && process.env.STRIPE_SECRET_KEY),
};

// Verificar si Stripe está configurado
export const isStripeConfigured = () => {
  return stripeConfig.enabled && 
         stripeConfig.publishableKey !== 'pk_test_...' && 
         stripeConfig.secretKey !== 'sk_test_...';
};

// Planes de suscripción
export const subscriptionPlans = {
  free: {
    name: 'Gratuito',
    price: 0,
    features: [
      'Hasta 20 chats con IA',
      'Workflows básicos',
      'Soporte por email',
      '1GB de almacenamiento',
    ],
    limits: {
      workflows: 5,
      chatbots: 2,
      emails: 100,
      storage: '1GB',
    },
  },
  pro: {
    name: 'Pro',
    price: 29,
    features: [
      'Hasta 1000 chats con IA',
      'Workflows avanzados',
      'Soporte prioritario',
      '10GB de almacenamiento',
      'Analytics avanzados',
    ],
    limits: {
      workflows: 50,
      chatbots: 10,
      emails: 1000,
      storage: '10GB',
    },
  },
  premium: {
    name: 'Premium',
    price: 99,
    features: [
      'Chats ilimitados con IA',
      'Workflows ilimitados',
      'Soporte 24/7',
      '100GB de almacenamiento',
      'Analytics premium',
      'Integraciones personalizadas',
    ],
    limits: {
      workflows: -1, // ilimitado
      chatbots: -1,
      emails: -1,
      storage: '100GB',
    },
  },
};

// Función para obtener plan por ID
export const getPlanById = (planId: string) => {
  return subscriptionPlans[planId as keyof typeof subscriptionPlans] || subscriptionPlans.free;
};

// Función para verificar límites del plan
export const checkPlanLimits = (planId: string, usage: { workflows: number; chatbots: number; emails: number }) => {
  const plan = getPlanById(planId);
  const limits = plan.limits;
  
  return {
    withinLimits: (limits.workflows === -1 || usage.workflows <= limits.workflows) &&
                  (limits.chatbots === -1 || usage.chatbots <= limits.chatbots) &&
                  (limits.emails === -1 || usage.emails <= limits.emails),
    remaining: {
      workflows: limits.workflows === -1 ? -1 : Math.max(0, limits.workflows - usage.workflows),
      chatbots: limits.chatbots === -1 ? -1 : Math.max(0, limits.chatbots - usage.chatbots),
      emails: limits.emails === -1 ? -1 : Math.max(0, limits.emails - usage.emails),
    },
  };
};
