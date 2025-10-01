// Sistema de Facturación y Suscripciones para Stack21

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  interval: 'month' | 'year';
  features: string[];
  limits: {
    workflows: number;
    integrations: number;
    teamMembers: number;
    apiCalls: number;
    storage: number; // GB
  };
  popular: boolean;
  trial: boolean;
  trialDays?: number;
}

export interface UserSubscription {
  id: string;
  userId: string;
  planId: string;
  status: 'active' | 'cancelled' | 'past_due' | 'trialing';
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  trialEnd?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Invoice {
  id: string;
  subscriptionId: string;
  userId: string;
  amount: number;
  currency: string;
  status: 'paid' | 'pending' | 'failed';
  dueDate: Date;
  paidAt?: Date;
  createdAt: Date;
  items: InvoiceItem[];
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface PaymentMethod {
  id: string;
  userId: string;
  type: 'card' | 'paypal' | 'bank_transfer';
  last4?: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault: boolean;
  createdAt: Date;
}

export interface UsageMetrics {
  userId: string;
  period: string; // YYYY-MM
  workflows: number;
  integrations: number;
  apiCalls: number;
  storage: number;
  teamMembers: number;
}

class BillingManager {
  private plans: Map<string, SubscriptionPlan> = new Map();
  private subscriptions: Map<string, UserSubscription> = new Map();
  private invoices: Map<string, Invoice> = new Map();
  private paymentMethods: Map<string, PaymentMethod> = new Map();
  private usage: Map<string, UsageMetrics> = new Map();

  constructor() {
    this.initializePlans();
  }

  // Obtener planes disponibles
  getPlans(): SubscriptionPlan[] {
    return Array.from(this.plans.values()).sort((a, b) => a.price - b.price);
  }

  // Obtener plan por ID
  getPlan(id: string): SubscriptionPlan | undefined {
    return this.plans.get(id);
  }

  // Crear suscripción
  createSubscription(userId: string, planId: string, paymentMethodId?: string): UserSubscription {
    const plan = this.plans.get(planId);
    if (!plan) {
      throw new Error('Plan no encontrado');
    }

    const now = new Date();
    const periodEnd = new Date(now);
    periodEnd.setMonth(periodEnd.getMonth() + (plan.interval === 'year' ? 12 : 1));

    const subscription: UserSubscription = {
      id: `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      planId,
      status: plan.trial ? 'trialing' : 'active',
      currentPeriodStart: now,
      currentPeriodEnd: periodEnd,
      cancelAtPeriodEnd: false,
      trialEnd: plan.trial ? new Date(now.getTime() + (plan.trialDays || 14) * 24 * 60 * 60 * 1000) : undefined,
      createdAt: now,
      updatedAt: now
    };

    this.subscriptions.set(subscription.id, subscription);

    // Crear primera factura si no es trial
    if (!plan.trial) {
      this.createInvoice(subscription.id, plan.price, plan.currency);
    }

    return subscription;
  }

  // Obtener suscripción del usuario
  getUserSubscription(userId: string): UserSubscription | undefined {
    return Array.from(this.subscriptions.values())
      .find(sub => sub.userId === userId && sub.status !== 'cancelled');
  }

  // Cambiar plan
  changePlan(subscriptionId: string, newPlanId: string): UserSubscription {
    const subscription = this.subscriptions.get(subscriptionId);
    const newPlan = this.plans.get(newPlanId);
    
    if (!subscription || !newPlan) {
      throw new Error('Suscripción o plan no encontrado');
    }

    const oldPlan = this.plans.get(subscription.planId);
    if (!oldPlan) {
      throw new Error('Plan actual no encontrado');
    }

    subscription.planId = newPlanId;
    subscription.updatedAt = new Date();

    // Calcular prorrateado si es upgrade/downgrade
    const priceDifference = newPlan.price - oldPlan.price;
    if (priceDifference !== 0) {
      const remainingDays = Math.ceil(
        (subscription.currentPeriodEnd.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
      );
      const totalDays = newPlan.interval === 'year' ? 365 : 30;
      const proratedAmount = (priceDifference * remainingDays) / totalDays;
      
      if (proratedAmount > 0) {
        this.createInvoice(subscriptionId, proratedAmount, newPlan.currency);
      }
    }

    return subscription;
  }

  // Cancelar suscripción
  cancelSubscription(subscriptionId: string, immediate: boolean = false): UserSubscription {
    const subscription = this.subscriptions.get(subscriptionId);
    if (!subscription) {
      throw new Error('Suscripción no encontrada');
    }

    if (immediate) {
      subscription.status = 'cancelled';
      subscription.currentPeriodEnd = new Date();
    } else {
      subscription.cancelAtPeriodEnd = true;
    }

    subscription.updatedAt = new Date();
    return subscription;
  }

  // Reactivar suscripción
  reactivateSubscription(subscriptionId: string): UserSubscription {
    const subscription = this.subscriptions.get(subscriptionId);
    if (!subscription) {
      throw new Error('Suscripción no encontrada');
    }

    subscription.cancelAtPeriodEnd = false;
    subscription.status = 'active';
    subscription.updatedAt = new Date();

    return subscription;
  }

  // Crear factura
  private createInvoice(subscriptionId: string, amount: number, currency: string): Invoice {
    const subscription = this.subscriptions.get(subscriptionId);
    if (!subscription) {
      throw new Error('Suscripción no encontrada');
    }

    const invoice: Invoice = {
      id: `inv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      subscriptionId,
      userId: subscription.userId,
      amount,
      currency,
      status: 'pending',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 días
      createdAt: new Date(),
      items: [{
        id: `item_${Date.now()}`,
        description: 'Suscripción Stack21',
        quantity: 1,
        unitPrice: amount,
        total: amount
      }]
    };

    this.invoices.set(invoice.id, invoice);
    return invoice;
  }

  // Pagar factura
  payInvoice(invoiceId: string, paymentMethodId: string): Invoice {
    const invoice = this.invoices.get(invoiceId);
    if (!invoice) {
      throw new Error('Factura no encontrada');
    }

    const paymentMethod = this.paymentMethods.get(paymentMethodId);
    if (!paymentMethod) {
      throw new Error('Método de pago no encontrado');
    }

    // Simular procesamiento de pago
    const paymentSuccess = Math.random() > 0.1; // 90% de éxito

    if (paymentSuccess) {
      invoice.status = 'paid';
      invoice.paidAt = new Date();
    } else {
      invoice.status = 'failed';
      throw new Error('Error procesando el pago');
    }

    return invoice;
  }

  // Obtener facturas del usuario
  getUserInvoices(userId: string): Invoice[] {
    return Array.from(this.invoices.values())
      .filter(invoice => invoice.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  // Agregar método de pago
  addPaymentMethod(userId: string, type: 'card' | 'paypal', details: any): PaymentMethod {
    // Marcar otros métodos como no default si este será default
    if (details.isDefault) {
      Array.from(this.paymentMethods.values())
        .filter(pm => pm.userId === userId)
        .forEach(pm => pm.isDefault = false);
    }

    const paymentMethod: PaymentMethod = {
      id: `pm_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      type,
      last4: details.last4,
      brand: details.brand,
      expiryMonth: details.expiryMonth,
      expiryYear: details.expiryYear,
      isDefault: details.isDefault || false,
      createdAt: new Date()
    };

    this.paymentMethods.set(paymentMethod.id, paymentMethod);
    return paymentMethod;
  }

  // Obtener métodos de pago del usuario
  getUserPaymentMethods(userId: string): PaymentMethod[] {
    return Array.from(this.paymentMethods.values())
      .filter(pm => pm.userId === userId)
      .sort((a, b) => {
        if (a.isDefault && !b.isDefault) return -1;
        if (!a.isDefault && b.isDefault) return 1;
        return b.createdAt.getTime() - a.createdAt.getTime();
      });
  }

  // Verificar límites del plan
  checkPlanLimits(userId: string, resource: keyof SubscriptionPlan['limits']): { allowed: boolean; limit: number; current: number } {
    const subscription = this.getUserSubscription(userId);
    if (!subscription) {
      return { allowed: false, limit: 0, current: 0 };
    }

    const plan = this.plans.get(subscription.planId);
    if (!plan) {
      return { allowed: false, limit: 0, current: 0 };
    }

    const currentUsage = this.getCurrentUsage(userId);
    const limit = plan.limits[resource];
    const current = currentUsage[resource] || 0;

    return {
      allowed: current < limit,
      limit,
      current
    };
  }

  // Obtener uso actual
  private getCurrentUsage(userId: string): any {
    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
    const usage = this.usage.get(`${userId}_${currentMonth}`);
    
    return {
      workflows: usage?.workflows || 0,
      integrations: usage?.integrations || 0,
      apiCalls: usage?.apiCalls || 0,
      storage: usage?.storage || 0,
      teamMembers: usage?.teamMembers || 1
    };
  }

  // Registrar uso
  recordUsage(userId: string, resource: keyof UsageMetrics, amount: number = 1): void {
    const currentMonth = new Date().toISOString().slice(0, 7);
    const key = `${userId}_${currentMonth}`;
    
    let usage = this.usage.get(key);
    if (!usage) {
      usage = {
        userId,
        period: currentMonth,
        workflows: 0,
        integrations: 0,
        apiCalls: 0,
        storage: 0,
        teamMembers: 1
      };
    }

    if (resource !== 'userId' && resource !== 'period') {
      usage[resource] = (usage[resource] || 0) + amount;
    }
    
    this.usage.set(key, usage);
  }

  // Obtener estadísticas de facturación
  getBillingStats(): {
    totalRevenue: number;
    activeSubscriptions: number;
    trialUsers: number;
    churnRate: number;
    averageRevenuePerUser: number;
  } {
    const subscriptions = Array.from(this.subscriptions.values());
    const activeSubscriptions = subscriptions.filter(sub => sub.status === 'active').length;
    const trialUsers = subscriptions.filter(sub => sub.status === 'trialing').length;
    
    const paidInvoices = Array.from(this.invoices.values()).filter(inv => inv.status === 'paid');
    const totalRevenue = paidInvoices.reduce((sum, inv) => sum + inv.amount, 0);
    
    const averageRevenuePerUser = activeSubscriptions > 0 ? totalRevenue / activeSubscriptions : 0;
    
    // Churn rate simplificado (cancelaciones del último mes)
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    const cancelledLastMonth = subscriptions.filter(sub => 
      sub.status === 'cancelled' && sub.updatedAt >= lastMonth
    ).length;
    const churnRate = activeSubscriptions > 0 ? (cancelledLastMonth / activeSubscriptions) * 100 : 0;

    return {
      totalRevenue,
      activeSubscriptions,
      trialUsers,
      churnRate,
      averageRevenuePerUser
    };
  }

  // Inicializar planes
  private initializePlans(): void {
    const plans: SubscriptionPlan[] = [
      {
        id: 'free',
        name: 'Gratuito',
        description: 'Perfecto para empezar',
        price: 0,
        currency: 'USD',
        interval: 'month',
        features: [
          '3 workflows activos',
          '5 integraciones',
          '1,000 ejecuciones/mes',
          'Soporte por email',
          '1 GB de almacenamiento'
        ],
        limits: {
          workflows: 3,
          integrations: 5,
          teamMembers: 1,
          apiCalls: 1000,
          storage: 1
        },
        popular: false,
        trial: false
      },
      {
        id: 'pro',
        name: 'Profesional',
        description: 'Para equipos en crecimiento',
        price: 29,
        currency: 'USD',
        interval: 'month',
        features: [
          'Workflows ilimitados',
          '25 integraciones',
          '10,000 ejecuciones/mes',
          'Soporte prioritario',
          '10 GB de almacenamiento',
          'Análisis avanzados',
          'Hasta 5 miembros del equipo'
        ],
        limits: {
          workflows: -1, // ilimitado
          integrations: 25,
          teamMembers: 5,
          apiCalls: 10000,
          storage: 10
        },
        popular: true,
        trial: true,
        trialDays: 14
      },
      {
        id: 'enterprise',
        name: 'Empresa',
        description: 'Para organizaciones grandes',
        price: 99,
        currency: 'USD',
        interval: 'month',
        features: [
          'Todo ilimitado',
          'Integraciones personalizadas',
          'Soporte 24/7',
          '100 GB de almacenamiento',
          'SLA garantizado',
          'Miembros ilimitados',
          'SSO y seguridad avanzada'
        ],
        limits: {
          workflows: -1,
          integrations: -1,
          teamMembers: -1,
          apiCalls: -1,
          storage: 100
        },
        popular: false,
        trial: true,
        trialDays: 30
      }
    ];

    plans.forEach(plan => {
      this.plans.set(plan.id, plan);
    });
  }
}

export const billingManager = new BillingManager();
