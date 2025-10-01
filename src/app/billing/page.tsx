'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Check, 
  X, 
  Zap, 
  Crown, 
  Building, 
  CreditCard, 
  ExternalLink,
  AlertCircle,
  CheckCircle,
  Clock,
  BarChart3
} from 'lucide-react';
import { STRIPE_PLANS } from '@/lib/stripe';

interface BillingInfo {
  currentPlan: 'FREE' | 'PRO' | 'ENTERPRISE';
  subscriptionId?: string;
  status: 'active' | 'canceled' | 'past_due' | 'trialing';
  currentPeriodEnd?: string;
  usage: {
    runs: number;
    storageGB: number;
    aiTokens: number;
  };
  limits: {
    runsPerMonth: number;
    storageGB: number;
    aiTokens: number;
  };
}

export default function BillingPage() {
  const [billingInfo, setBillingInfo] = useState<BillingInfo>({
    currentPlan: 'FREE',
    status: 'active',
    usage: { runs: 0, storageGB: 0, aiTokens: 0 },
    limits: { runsPerMonth: 100, storageGB: 1, aiTokens: 1000 },
  });
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState<string | null>(null);

  useEffect(() => {
    loadBillingInfo();
  }, []);

  const loadBillingInfo = async () => {
    try {
      setLoading(true);
      // TODO: Cargar información real de billing
      setBillingInfo({
        currentPlan: 'FREE',
        status: 'active',
        usage: { runs: 45, storageGB: 0.5, aiTokens: 250 },
        limits: { runsPerMonth: 100, storageGB: 1, aiTokens: 1000 },
      });
    } catch (error) {
      console.error('Error cargando información de billing:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async (plan: 'PRO' | 'ENTERPRISE') => {
    try {
      setUpgrading(plan);
      const response = await fetch('/api/billing/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceId: STRIPE_PLANS[plan].priceId,
          plan,
        }),
      });

      if (response.ok) {
        const { url } = await response.json();
        window.location.href = url;
      }
    } catch (error) {
      console.error('Error actualizando plan:', error);
    } finally {
      setUpgrading(null);
    }
  };

  const handleManageBilling = async () => {
    try {
      const response = await fetch('/api/billing/portal', {
        method: 'POST',
      });

      if (response.ok) {
        const { url } = await response.json();
        window.location.href = url;
      }
    } catch (error) {
      console.error('Error abriendo portal de billing:', error);
    }
  };

  const getUsagePercentage = (current: number, limit: number) => {
    if (limit === -1) return 0; // Unlimited
    return Math.min((current / limit) * 100, 100);
  };

  const getUsageColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const plans = Object.entries(STRIPE_PLANS).map(([key, plan]) => ({
    key: key as keyof typeof STRIPE_PLANS,
    ...plan,
  }));

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Facturación</h1>
        <p className="text-gray-600">Gestiona tu plan y uso de la plataforma</p>
      </div>

      {loading ? (
        <div className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse">
              <div className="h-6 bg-gray-200 rounded mb-4"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* Current Plan */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Plan Actual</h2>
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 text-sm rounded-full ${
                  billingInfo.status === 'active' ? 'bg-green-100 text-green-800' :
                  billingInfo.status === 'trialing' ? 'bg-blue-100 text-blue-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {billingInfo.status === 'active' ? 'Activo' :
                   billingInfo.status === 'trialing' ? 'Prueba' :
                   'Inactivo'}
                </span>
                {billingInfo.currentPlan !== 'FREE' && (
                  <button
                    onClick={handleManageBilling}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-blue-600 hover:text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-50"
                  >
                    <CreditCard className="w-4 h-4" />
                    Gestionar Facturación
                    <ExternalLink className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {STRIPE_PLANS[billingInfo.currentPlan].name}
                </h3>
                <p className="text-3xl font-bold text-gray-900">
                  ${STRIPE_PLANS[billingInfo.currentPlan].price}
                  <span className="text-lg text-gray-500">/mes</span>
                </p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-600 mb-2">Uso Actual</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Ejecuciones</span>
                    <span>{billingInfo.usage.runs} / {billingInfo.limits.runsPerMonth === -1 ? '∞' : billingInfo.limits.runsPerMonth}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${getUsageColor(getUsagePercentage(billingInfo.usage.runs, billingInfo.limits.runsPerMonth))}`}
                      style={{ width: `${getUsagePercentage(billingInfo.usage.runs, billingInfo.limits.runsPerMonth)}%` }}
                    />
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-600 mb-2">Almacenamiento</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Espacio usado</span>
                    <span>{billingInfo.usage.storageGB} / {billingInfo.limits.storageGB === -1 ? '∞' : billingInfo.limits.storageGB} GB</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${getUsageColor(getUsagePercentage(billingInfo.usage.storageGB, billingInfo.limits.storageGB))}`}
                      style={{ width: `${getUsagePercentage(billingInfo.usage.storageGB, billingInfo.limits.storageGB)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Plans */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {plans.map((plan, index) => {
              const isCurrentPlan = plan.key === billingInfo.currentPlan;
              const isPopular = plan.key === 'PRO';
              
              return (
                <motion.div
                  key={plan.key}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative bg-white rounded-lg border-2 p-6 ${
                    isCurrentPlan ? 'border-blue-500' :
                    isPopular ? 'border-purple-500' : 'border-gray-200'
                  }`}
                >
                  {isPopular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-purple-500 text-white px-3 py-1 text-xs font-medium rounded-full">
                        Más Popular
                      </span>
                    </div>
                  )}

                  <div className="text-center mb-6">
                    <div className="flex items-center justify-center mb-2">
                      {plan.key === 'FREE' && <Zap className="w-6 h-6 text-gray-500" />}
                      {plan.key === 'PRO' && <Crown className="w-6 h-6 text-purple-500" />}
                      {plan.key === 'ENTERPRISE' && <Building className="w-6 h-6 text-blue-500" />}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">{plan.name}</h3>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                      ${plan.price}
                      <span className="text-lg text-gray-500">/mes</span>
                    </p>
                  </div>

                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto">
                    {isCurrentPlan ? (
                      <div className="w-full py-2 px-4 bg-green-100 text-green-800 text-center rounded-lg font-medium">
                        Plan Actual
                      </div>
                    ) : (
                      <button
                        onClick={() => handleUpgrade(plan.key as 'PRO' | 'ENTERPRISE')}
                        disabled={upgrading === plan.key}
                        className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                          isPopular
                            ? 'bg-purple-600 text-white hover:bg-purple-700'
                            : 'bg-gray-900 text-white hover:bg-gray-800'
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        {upgrading === plan.key ? (
                          <div className="flex items-center justify-center gap-2">
                            <Clock className="w-4 h-4 animate-spin" />
                            Procesando...
                          </div>
                        ) : (
                          `Actualizar a ${plan.name}`
                        )}
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Usage Details */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Detalles de Uso</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-600">Ejecuciones este mes</h3>
                  <span className="text-sm text-gray-900">{billingInfo.usage.runs}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${getUsageColor(getUsagePercentage(billingInfo.usage.runs, billingInfo.limits.runsPerMonth))}`}
                    style={{ width: `${getUsagePercentage(billingInfo.usage.runs, billingInfo.limits.runsPerMonth)}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {billingInfo.limits.runsPerMonth === -1 ? 'Ilimitado' : `${billingInfo.limits.runsPerMonth} máximo`}
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-600">Almacenamiento usado</h3>
                  <span className="text-sm text-gray-900">{billingInfo.usage.storageGB} GB</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${getUsageColor(getUsagePercentage(billingInfo.usage.storageGB, billingInfo.limits.storageGB))}`}
                    style={{ width: `${getUsagePercentage(billingInfo.usage.storageGB, billingInfo.limits.storageGB)}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {billingInfo.limits.storageGB === -1 ? 'Ilimitado' : `${billingInfo.limits.storageGB} GB máximo`}
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-600">Tokens de IA</h3>
                  <span className="text-sm text-gray-900">{billingInfo.usage.aiTokens}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${getUsageColor(getUsagePercentage(billingInfo.usage.aiTokens, billingInfo.limits.aiTokens))}`}
                    style={{ width: `${getUsagePercentage(billingInfo.usage.aiTokens, billingInfo.limits.aiTokens)}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {billingInfo.limits.aiTokens === -1 ? 'Ilimitado' : `${billingInfo.limits.aiTokens} máximo`}
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
