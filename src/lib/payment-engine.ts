// Sistema de Pagos con Stripe para Stack21
export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number; // en centavos
  currency: string;
  interval: 'month' | 'year';
  features: string[];
  limits: {
    workflows: number;
    emails: number;
    chatbots: number;
    users: number;
    apiCalls: number;
  };
  stripePriceId?: string;
  stripeProductId?: string;
  isPopular?: boolean;
  createdAt: Date;
}

export interface UserSubscription {
  id: string;
  userId: string;
  planId: string;
  status: 'active' | 'inactive' | 'cancelled' | 'past_due' | 'trialing';
  stripeSubscriptionId?: string;
  stripeCustomerId?: string;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  trialEnd?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaymentMethod {
  id: string;
  userId: string;
  stripePaymentMethodId: string;
  type: 'card';
  card: {
    brand: string;
    last4: string;
    expMonth: number;
    expYear: number;
  };
  isDefault: boolean;
  createdAt: Date;
}

export interface Invoice {
  id: string;
  userId: string;
  subscriptionId: string;
  stripeInvoiceId?: string;
  amount: number;
  currency: string;
  status: 'draft' | 'open' | 'paid' | 'void' | 'uncollectible';
  description: string;
  dueDate: Date;
  paidAt?: Date;
  createdAt: Date;
}

export interface BillingUsage {
  userId: string;
  period: string; // YYYY-MM
  workflows: number;
  emails: number;
  chatbots: number;
  apiCalls: number;
  storage: number; // en MB
  updatedAt: Date;
}

class PaymentEngine {
  private plans: Map<string, SubscriptionPlan> = new Map();
  private subscriptions: Map<string, UserSubscription> = new Map();
  private paymentMethods: Map<string, PaymentMethod[]> = new Map();
  private invoices: Map<string, Invoice[]> = new Map();
  private usage: Map<string, BillingUsage> = new Map();

  constructor() {
    this.initializeDefaultPlans();
  }

  // Inicializar planes por defecto
  private initializeDefaultPlans(): void {
    const freePlan: SubscriptionPlan = {
      id: 'free',
      name: 'Plan Gratuito',
      description: 'Perfecto para empezar',
      price: 0,
      currency: 'usd',
      interval: 'month',
      features: [
        'Hasta 3 workflows',
        'Hasta 100 emails/mes',
        '1 chatbot básico',
        'Soporte por email',
        'Dashboard básico'
      ],
      limits: {
        workflows: 3,
        emails: 100,
        chatbots: 1,
        users: 1,
        apiCalls: 1000
      },
      createdAt: new Date()
    };

    const proPlan: SubscriptionPlan = {
      id: 'pro',
      name: 'Plan Pro',
      description: 'Para equipos en crecimiento',
      price: 2900, // $29
      currency: 'usd',
      interval: 'month',
      features: [
        'Workflows ilimitados',
        'Hasta 10,000 emails/mes',
        'Hasta 5 chatbots',
        'Soporte prioritario',
        'Analytics avanzados',
        'Integraciones premium',
        'API completa'
      ],
      limits: {
        workflows: -1, // ilimitado
        emails: 10000,
        chatbots: 5,
        users: 5,
        apiCalls: 100000
      },
      isPopular: true,
      createdAt: new Date()
    };

    const enterprisePlan: SubscriptionPlan = {
      id: 'enterprise',
      name: 'Plan Enterprise',
      description: 'Para grandes organizaciones',
      price: 9900, // $99
      currency: 'usd',
      interval: 'month',
      features: [
        'Todo ilimitado',
        'Emails ilimitados',
        'Chatbots ilimitados',
        'Soporte 24/7',
        'Analytics personalizados',
        'Integraciones personalizadas',
        'API sin límites',
        'Gestión de usuarios avanzada',
        'SLA garantizado'
      ],
      limits: {
        workflows: -1,
        emails: -1,
        chatbots: -1,
        users: -1,
        apiCalls: -1
      },
      createdAt: new Date()
    };

    this.plans.set(freePlan.id, freePlan);
    this.plans.set(proPlan.id, proPlan);
    this.plans.set(enterprisePlan.id, enterprisePlan);
  }

  // Obtener todos los planes
  getAllPlans(): SubscriptionPlan[] {
    return Array.from(this.plans.values());
  }

  // Obtener plan por ID
  getPlan(planId: string): SubscriptionPlan | undefined {
    return this.plans.get(planId);
  }

  // Crear suscripción
  async createSubscription(
    userId: string,
    planId: string,
    paymentMethodId?: string,
    trialDays?: number
  ): Promise<UserSubscription> {
    const plan = this.plans.get(planId);
    if (!plan) {
      throw new Error(`Plan ${planId} not found`);
    }

    // Verificar si el usuario ya tiene una suscripción activa
    const existingSubscription = this.getActiveSubscription(userId);
    if (existingSubscription && existingSubscription.status === 'active') {
      throw new Error('User already has an active subscription');
    }

    const now = new Date();
    const periodStart = now;
    const periodEnd = new Date(now);
    
    if (plan.interval === 'month') {
      periodEnd.setMonth(periodEnd.getMonth() + 1);
    } else {
      periodEnd.setFullYear(periodEnd.getFullYear() + 1);
    }

    const subscription: UserSubscription = {
      id: `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      planId,
      status: trialDays ? 'trialing' : 'active',
      currentPeriodStart: periodStart,
      currentPeriodEnd: periodEnd,
      cancelAtPeriodEnd: false,
      trialEnd: trialDays ? new Date(now.getTime() + trialDays * 24 * 60 * 60 * 1000) : undefined,
      createdAt: now,
      updatedAt: now
    };

    this.subscriptions.set(subscription.id, subscription);

    // Si hay período de prueba, no cobrar inmediatamente
    if (!trialDays && plan.price > 0) {
      await this.processPayment(subscription, paymentMethodId);
    }

    return subscription;
  }

  // Procesar pago
  private async processPayment(subscription: UserSubscription, paymentMethodId?: string): Promise<boolean> {
    const plan = this.plans.get(subscription.planId);
    if (!plan || plan.price === 0) {
      return true; // Plan gratuito
    }

    try {
      // Simular procesamiento de pago con Stripe
      await this.delay(1000);
      
      // Crear factura
      const invoice = this.createInvoice(subscription);
      
      // Simular pago exitoso (en producción esto sería con Stripe)
      invoice.status = 'paid';
      invoice.paidAt = new Date();
      
      return true;
    } catch (error) {
      console.error('Payment processing failed:', error);
      subscription.status = 'past_due';
      return false;
    }
  }

  // Crear factura
  private createInvoice(subscription: UserSubscription): Invoice {
    const plan = this.plans.get(subscription.planId)!;
    const invoice: Invoice = {
      id: `inv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: subscription.userId,
      subscriptionId: subscription.id,
      amount: plan.price,
      currency: plan.currency,
      status: 'open',
      description: `Factura por ${plan.name} - ${subscription.currentPeriodStart.toLocaleDateString()} a ${subscription.currentPeriodEnd.toLocaleDateString()}`,
      dueDate: subscription.currentPeriodEnd,
      createdAt: new Date()
    };

    const userInvoices = this.invoices.get(subscription.userId) || [];
    userInvoices.push(invoice);
    this.invoices.set(subscription.userId, userInvoices);

    return invoice;
  }

  // Obtener suscripción activa del usuario
  getActiveSubscription(userId: string): UserSubscription | undefined {
    const userSubscriptions = Array.from(this.subscriptions.values())
      .filter(sub => sub.userId === userId);
    
    return userSubscriptions.find(sub => 
      sub.status === 'active' || sub.status === 'trialing'
    );
  }

  // Obtener todas las suscripciones del usuario
  getUserSubscriptions(userId: string): UserSubscription[] {
    return Array.from(this.subscriptions.values())
      .filter(sub => sub.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  // Actualizar suscripción
  async updateSubscription(
    subscriptionId: string,
    newPlanId: string
  ): Promise<UserSubscription | null> {
    const subscription = this.subscriptions.get(subscriptionId);
    if (!subscription) {
      return null;
    }

    const newPlan = this.plans.get(newPlanId);
    if (!newPlan) {
      throw new Error(`Plan ${newPlanId} not found`);
    }

    subscription.planId = newPlanId;
    subscription.updatedAt = new Date();

    // Si el nuevo plan es más caro, cobrar la diferencia
    const currentPlan = this.plans.get(subscription.planId);
    if (currentPlan && newPlan.price > currentPlan.price) {
      await this.processPayment(subscription);
    }

    return subscription;
  }

  // Cancelar suscripción
  async cancelSubscription(subscriptionId: string, atPeriodEnd: boolean = true): Promise<boolean> {
    const subscription = this.subscriptions.get(subscriptionId);
    if (!subscription) {
      return false;
    }

    if (atPeriodEnd) {
      subscription.cancelAtPeriodEnd = true;
    } else {
      subscription.status = 'cancelled';
    }

    subscription.updatedAt = new Date();
    return true;
  }

  // Verificar límites de uso
  checkUsageLimits(userId: string, resource: keyof BillingUsage, amount: number = 1): boolean {
    const subscription = this.getActiveSubscription(userId);
    if (!subscription) {
      return false;
    }

    const plan = this.plans.get(subscription.planId);
    if (!plan) {
      return false;
    }

    const usage = this.getUsage(userId);
    const limits = plan.limits as unknown as Partial<Record<keyof BillingUsage, number>> | undefined;
    const limit = limits ? (limits[resource] ?? -1) : -1;

    // -1 significa ilimitado
    if (limit === -1) {
      return true;
    }

    const currentUsage = Number(usage[resource] ?? 0);
    const numericLimit = Number(limit);
    return (currentUsage + amount) <= numericLimit;
  }

  // Registrar uso
  recordUsage(userId: string, resource: keyof BillingUsage, amount: number = 1): void {
    const currentUsage = this.getUsage(userId);
    const currentPeriod = new Date().toISOString().substring(0, 7); // YYYY-MM

    if (currentUsage.period !== currentPeriod) {
      // Nuevo período, resetear contadores
      currentUsage.period = currentPeriod;
      currentUsage.workflows = 0;
      currentUsage.emails = 0;
      currentUsage.chatbots = 0;
      currentUsage.apiCalls = 0;
      currentUsage.storage = 0;
    }

    const numericKeys = ['workflows','emails','chatbots','apiCalls','storage'] as const;
    type NumericKey = typeof numericKeys[number];
    if ((numericKeys as readonly string[]).includes(resource as string)) {
      const key = resource as NumericKey;
      currentUsage[key] = Number(currentUsage[key] ?? 0) + amount;
    }
    currentUsage.updatedAt = new Date();

    this.usage.set(userId, currentUsage);
  }

  // Obtener uso del usuario
  getUsage(userId: string): BillingUsage {
    const currentPeriod = new Date().toISOString().substring(0, 7);
    const existingUsage = this.usage.get(userId);

    if (!existingUsage || existingUsage.period !== currentPeriod) {
      const newUsage: BillingUsage = {
        userId,
        period: currentPeriod,
        workflows: 0,
        emails: 0,
        chatbots: 0,
        apiCalls: 0,
        storage: 0,
        updatedAt: new Date()
      };
      this.usage.set(userId, newUsage);
      return newUsage;
    }

    return existingUsage;
  }

  // Obtener facturas del usuario
  getUserInvoices(userId: string): Invoice[] {
    return this.invoices.get(userId) || [];
  }

  // Obtener métodos de pago del usuario
  getUserPaymentMethods(userId: string): PaymentMethod[] {
    return this.paymentMethods.get(userId) || [];
  }

  // Agregar método de pago
  async addPaymentMethod(userId: string, stripePaymentMethodId: string): Promise<PaymentMethod> {
    // Simular datos de tarjeta de Stripe
    const paymentMethod: PaymentMethod = {
      id: `pm_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      stripePaymentMethodId,
      type: 'card',
      card: {
        brand: 'visa',
        last4: '4242',
        expMonth: 12,
        expYear: 2025
      },
      isDefault: false,
      createdAt: new Date()
    };

    const userMethods = this.paymentMethods.get(userId) || [];
    
    // Si es el primer método, hacerlo por defecto
    if (userMethods.length === 0) {
      paymentMethod.isDefault = true;
    }

    userMethods.push(paymentMethod);
    this.paymentMethods.set(userId, userMethods);

    return paymentMethod;
  }

  // Procesar renovación de suscripción
  async processRenewal(subscriptionId: string): Promise<boolean> {
    const subscription = this.subscriptions.get(subscriptionId);
    if (!subscription) {
      return false;
    }

    const plan = this.plans.get(subscription.planId);
    if (!plan || plan.price === 0) {
      // Plan gratuito, solo actualizar fechas
      this.updateSubscriptionPeriod(subscription);
      return true;
    }

    // Procesar pago
    const paymentSuccess = await this.processPayment(subscription);
    
    if (paymentSuccess) {
      this.updateSubscriptionPeriod(subscription);
      subscription.status = 'active';
    } else {
      subscription.status = 'past_due';
    }

    subscription.updatedAt = new Date();
    return paymentSuccess;
  }

  private updateSubscriptionPeriod(subscription: UserSubscription): void {
    const now = new Date();
    const plan = this.plans.get(subscription.planId)!;
    
    subscription.currentPeriodStart = now;
    subscription.currentPeriodEnd = new Date(now);
    
    if (plan.interval === 'month') {
      subscription.currentPeriodEnd.setMonth(subscription.currentPeriodEnd.getMonth() + 1);
    } else {
      subscription.currentPeriodEnd.setFullYear(subscription.currentPeriodEnd.getFullYear() + 1);
    }
  }

  // Utilidades
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Obtener estadísticas de facturación
  getBillingStats(): {
    totalRevenue: number;
    activeSubscriptions: number;
    monthlyRecurringRevenue: number;
    churnRate: number;
  } {
    const activeSubscriptions = Array.from(this.subscriptions.values())
      .filter(sub => sub.status === 'active');
    
    const totalRevenue = Array.from(this.invoices.values())
      .flat()
      .filter(inv => inv.status === 'paid')
      .reduce((sum, inv) => sum + inv.amount, 0);

    const monthlyRecurringRevenue = activeSubscriptions
      .reduce((sum, sub) => {
        const plan = this.plans.get(sub.planId);
        return sum + (plan?.price || 0);
      }, 0);

    const totalSubscriptions = this.subscriptions.size;
    const churnRate = totalSubscriptions > 0 
      ? (totalSubscriptions - activeSubscriptions.length) / totalSubscriptions * 100 
      : 0;

    return {
      totalRevenue,
      activeSubscriptions: activeSubscriptions.length,
      monthlyRecurringRevenue,
      churnRate
    };
  }
}

// Instancia singleton del motor de pagos
export const paymentEngine = new PaymentEngine();

// Función para crear suscripción de ejemplo
export const createSampleSubscription = async (userId: string): Promise<UserSubscription> => {
  return await paymentEngine.createSubscription(userId, 'pro', undefined, 14); // 14 días de prueba
};


