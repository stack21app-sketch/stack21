'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Check, 
  X, 
  Zap, 
  Crown, 
  Rocket, 
  Star,
  ArrowRight,
  CreditCard
} from 'lucide-react';

interface PricingPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  period: string;
  icon: React.ReactNode;
  color: string;
  popular: boolean;
  features: string[];
  limitations: string[];
  cta: string;
  stripePriceId?: string;
}

const plans: PricingPlan[] = [
  {
    id: 'starter',
    name: 'Starter',
    description: 'Perfecto para comenzar con automatizaciones básicas',
    price: 0,
    period: 'mes',
    icon: <Zap className="w-6 h-6" />,
    color: 'blue',
    popular: false,
    features: [
      'Hasta 5 workflows activos',
      '100 ejecuciones por mes',
      'Templates básicos',
      'Soporte por email',
      'Dashboard básico'
    ],
    limitations: [
      'Sin integraciones avanzadas',
      'Sin analytics detallados',
      'Sin soporte prioritario'
    ],
    cta: 'Comenzar Gratis'
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'Para equipos que necesitan más potencia y control',
    price: 29,
    period: 'mes',
    icon: <Crown className="w-6 h-6" />,
    color: 'purple',
    popular: true,
    features: [
      'Hasta 50 workflows activos',
      '1,000 ejecuciones por mes',
      'Todos los templates',
      'Integraciones avanzadas',
      'Analytics detallados',
      'Soporte prioritario',
      'API completa',
      'Webhooks'
    ],
    limitations: [
      'Sin funciones empresariales',
      'Sin SSO'
    ],
    cta: 'Comenzar Prueba Gratis',
    stripePriceId: 'price_pro_monthly'
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'Para organizaciones que necesitan máxima escalabilidad',
    price: 99,
    period: 'mes',
    icon: <Rocket className="w-6 h-6" />,
    color: 'green',
    popular: false,
    features: [
      'Workflows ilimitados',
      'Ejecuciones ilimitadas',
      'Todas las funciones Pro',
      'SSO y LDAP',
      'Soporte 24/7',
      'SLA garantizado',
      'Dedicated support',
      'Custom integrations',
      'Advanced security'
    ],
    limitations: [],
    cta: 'Contactar Ventas',
    stripePriceId: 'price_enterprise_monthly'
  }
];

export function PricingPlans() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue':
        return {
          bg: 'bg-blue-500',
          text: 'text-blue-500',
          border: 'border-blue-500',
          light: 'bg-blue-50',
          textLight: 'text-blue-700'
        };
      case 'purple':
        return {
          bg: 'bg-purple-500',
          text: 'text-purple-500',
          border: 'border-purple-500',
          light: 'bg-purple-50',
          textLight: 'text-purple-700'
        };
      case 'green':
        return {
          bg: 'bg-green-500',
          text: 'text-green-500',
          border: 'border-green-500',
          light: 'bg-green-50',
          textLight: 'text-green-700'
        };
      default:
        return {
          bg: 'bg-gray-500',
          text: 'text-gray-500',
          border: 'border-gray-500',
          light: 'bg-gray-50',
          textLight: 'text-gray-700'
        };
    }
  };

  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId);
    // Aquí iría la lógica para procesar el pago
    console.log('Plan seleccionado:', planId);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-4xl font-bold text-[var(--text)] mb-4">
          💳 Planes de Precios
        </h2>
        <p className="text-xl text-[var(--muted)] max-w-2xl mx-auto mb-8">
          Elige el plan que mejor se adapte a tus necesidades. Puedes cambiar o cancelar en cualquier momento.
        </p>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <span className={`text-sm font-medium ${billingPeriod === 'monthly' ? 'text-[var(--text)]' : 'text-[var(--muted)]'}`}>
            Mensual
          </span>
          <button
            onClick={() => setBillingPeriod(billingPeriod === 'monthly' ? 'yearly' : 'monthly')}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              billingPeriod === 'yearly' ? 'bg-[var(--brand)]' : 'bg-gray-200'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                billingPeriod === 'yearly' ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
          <span className={`text-sm font-medium ${billingPeriod === 'yearly' ? 'text-[var(--text)]' : 'text-[var(--muted)]'}`}>
            Anual
            <span className="ml-1 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
              -20%
            </span>
          </span>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan, index) => {
          const colors = getColorClasses(plan.color);
          const isPopular = plan.popular;
          const isSelected = selectedPlan === plan.id;
          const yearlyDiscount = billingPeriod === 'yearly' ? 0.8 : 1;
          const displayPrice = Math.round(plan.price * yearlyDiscount);

          return (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative card p-8 transition-all duration-300 ${
                isPopular 
                  ? 'ring-2 ring-[var(--brand)] shadow-xl scale-105' 
                  : 'hover:shadow-xl hover:scale-105'
              } ${isSelected ? 'ring-2 ring-[var(--brand)]' : ''}`}
            >
              {/* Popular Badge */}
              {isPopular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-[var(--brand)] text-white px-4 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                    <Star className="w-4 h-4 fill-current" />
                    Más Popular
                  </div>
                </div>
              )}

              {/* Plan Header */}
              <div className="text-center mb-6">
                <div className={`inline-flex p-3 rounded-full ${colors.light} ${colors.text} mb-4`}>
                  {plan.icon}
                </div>
                <h3 className="text-2xl font-bold text-[var(--text)] mb-2">
                  {plan.name}
                </h3>
                <p className="text-[var(--muted)] mb-4">
                  {plan.description}
                </p>
                <div className="flex items-baseline justify-center">
                  <span className="text-4xl font-bold text-[var(--text)]">
                    ${displayPrice}
                  </span>
                  <span className="text-[var(--muted)] ml-1">
                    /{plan.period}
                  </span>
                  {billingPeriod === 'yearly' && plan.price > 0 && (
                    <span className="ml-2 text-sm text-green-600 font-medium">
                      (Ahorra ${Math.round(plan.price * 0.2)}/mes)
                    </span>
                  )}
                </div>
              </div>

              {/* Features */}
              <div className="space-y-4 mb-8">
                <h4 className="font-semibold text-[var(--text)] mb-3">Incluye:</h4>
                {plan.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-[var(--muted)] text-sm">{feature}</span>
                  </div>
                ))}
                
                {plan.limitations.length > 0 && (
                  <>
                    <h4 className="font-semibold text-[var(--text)] mb-3 mt-6">Limitaciones:</h4>
                    {plan.limitations.map((limitation, limitationIndex) => (
                      <div key={limitationIndex} className="flex items-start gap-3">
                        <X className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                        <span className="text-[var(--muted)] text-sm">{limitation}</span>
                      </div>
                    ))}
                  </>
                )}
              </div>

              {/* CTA Button */}
              <button
                onClick={() => handleSelectPlan(plan.id)}
                className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
                  isPopular
                    ? 'bg-[var(--brand)] text-white hover:bg-[var(--brand-hover)]'
                    : `${colors.bg} text-white hover:opacity-90`
                }`}
              >
                <CreditCard className="w-4 h-4" />
                {plan.cta}
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Additional Info */}
              {plan.id === 'starter' && (
                <p className="text-center text-xs text-[var(--muted)] mt-4">
                  No se requiere tarjeta de crédito
                </p>
              )}
              {plan.id === 'pro' && (
                <p className="text-center text-xs text-[var(--muted)] mt-4">
                  14 días de prueba gratuita
                </p>
              )}
              {plan.id === 'enterprise' && (
                <p className="text-center text-xs text-[var(--muted)] mt-4">
                  Precio personalizado disponible
                </p>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* FAQ Section */}
      <div className="mt-16">
        <h3 className="text-2xl font-bold text-[var(--text)] text-center mb-8">
          Preguntas Frecuentes
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card p-6">
            <h4 className="font-semibold text-[var(--text)] mb-2">
              ¿Puedo cambiar de plan en cualquier momento?
            </h4>
            <p className="text-[var(--muted)] text-sm">
              Sí, puedes actualizar o degradar tu plan en cualquier momento. Los cambios se reflejan en tu próxima facturación.
            </p>
          </div>
          <div className="card p-6">
            <h4 className="font-semibold text-[var(--text)] mb-2">
              ¿Qué métodos de pago aceptan?
            </h4>
            <p className="text-[var(--muted)] text-sm">
              Aceptamos todas las tarjetas de crédito principales, PayPal y transferencias bancarias para planes Enterprise.
            </p>
          </div>
          <div className="card p-6">
            <h4 className="font-semibold text-[var(--text)] mb-2">
              ¿Hay descuentos por pago anual?
            </h4>
            <p className="text-[var(--muted)] text-sm">
              Sí, obtienes un 20% de descuento en todos los planes cuando pagas anualmente.
            </p>
          </div>
          <div className="card p-6">
            <h4 className="font-semibold text-[var(--text)] mb-2">
              ¿Puedo cancelar mi suscripción?
            </h4>
            <p className="text-[var(--muted)] text-sm">
              Sí, puedes cancelar en cualquier momento desde tu dashboard. No hay penalizaciones ni cargos ocultos.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
