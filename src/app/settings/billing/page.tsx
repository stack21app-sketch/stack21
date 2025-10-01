'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Crown, Zap, Star, ExternalLink, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

interface UsageData {
  organization: {
    id: string;
    plan: 'free' | 'pro' | 'premium';
    ai_voice_enabled: boolean;
  };
  current_usage: {
    chats: {
      used: number;
      limit: number;
      percentage: number;
      status: 'low' | 'moderate' | 'near_limit' | 'over_limit';
    };
    voice_minutes: {
      used: number;
      limit: number;
      percentage: number;
      status: 'low' | 'moderate' | 'near_limit' | 'over_limit';
      available: boolean;
    };
    tokens: {
      in: number;
      out: number;
      total: number;
    };
  };
  stats: {
    total_chats: number;
    total_tokens: number;
    average_tokens_per_chat: number;
  };
  plan_info: {
    features: string[];
    limits: any;
  };
}

const PLANS = {
  free: {
    name: 'Free',
    price: '€0',
    description: 'Perfecto para empezar',
    icon: Star,
    features: [
      'Mini-tienda y catálogo',
      'Agente AI básico (texto)',
      '20 chats/mes',
      '1,000 tokens/día',
    ],
    limitations: ['Sin voz', 'Sin soporte prioritario'],
  },
  pro: {
    name: 'Pro',
    price: '€15',
    description: 'Para crecer tu negocio',
    icon: Zap,
    features: [
      'Todo lo del Free',
      'Agente AI completo',
      '1,000 chats/mes',
      'Cache FAQ',
      'Generación de marketing básica',
      'Soporte email',
    ],
    limitations: ['Sin voz'],
  },
  premium: {
    name: 'Premium',
    price: '€29',
    description: 'Para empresas en crecimiento',
    icon: Crown,
    features: [
      'Todo lo del Pro',
      'Agente AI con voz',
      '200 min/mes de voz',
      'Generación de marketing extendida',
      'Soporte prioritario',
    ],
    limitations: [],
  },
};

export default function BillingPage() {
  const { data: session } = useSession();
  const [usageData, setUsageData] = useState<UsageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState<string | null>(null);
  const [selectedOrgId, setSelectedOrgId] = useState<string>('');

  useEffect(() => {
    // En un caso real, aquí obtendrías la lista de organizaciones del usuario
    // Por ahora usamos un ID hardcodeado para el ejemplo
    setSelectedOrgId('example-org-id');
    fetchUsageData('example-org-id');
  }, []);

  const fetchUsageData = async (orgId: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/usage/current?organizationId=${orgId}`);
      if (!response.ok) throw new Error('Error fetching usage data');
      
      const data = await response.json();
      setUsageData(data);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al cargar los datos de uso');
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (plan: 'pro' | 'premium') => {
    if (!selectedOrgId) return;

    try {
      setSubscribing(plan);
      const response = await fetch('/api/billing/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          organizationId: selectedOrgId,
          priceId: `price_${plan}`, // Esto debe coincidir con tus price IDs de Stripe
        }),
      });

      if (!response.ok) throw new Error('Error creating subscription');

      const { url } = await response.json();
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al procesar la suscripción');
    } finally {
      setSubscribing(null);
    }
  };

  const handleManageBilling = async () => {
    if (!selectedOrgId) return;

    try {
      const response = await fetch('/api/billing/create-portal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          organizationId: selectedOrgId,
          returnUrl: window.location.href,
        }),
      });

      if (!response.ok) throw new Error('Error creating portal session');

      const { url } = await response.json();
      if (url) {
        window.open(url, '_blank');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al abrir el portal de facturación');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'over_limit': return 'destructive';
      case 'near_limit': return 'destructive';
      case 'moderate': return 'default';
      default: return 'secondary';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'over_limit': return 'Límite excedido';
      case 'near_limit': return 'Cerca del límite';
      case 'moderate': return 'Uso moderado';
      default: return 'Uso bajo';
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  if (!usageData) {
    return (
      <div className="container mx-auto p-6">
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            No se pudieron cargar los datos de facturación.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const currentPlan = usageData.organization.plan;
  const currentPlanInfo = PLANS[currentPlan];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Facturación y Planes</h1>
        <p className="text-muted-foreground mt-2">
          Gestiona tu suscripción y controla el uso del Agente AI
        </p>
      </div>

      {/* Plan actual y uso */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <currentPlanInfo.icon className="h-5 w-5" />
              Plan Actual: {currentPlanInfo.name}
            </CardTitle>
            <CardDescription>
              {currentPlanInfo.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Chats usados</span>
                <Badge variant={getStatusColor(usageData.current_usage.chats.status)}>
                  {getStatusText(usageData.current_usage.chats.status)}
                </Badge>
              </div>
              <Progress 
                value={usageData.current_usage.chats.percentage} 
                className="h-2"
              />
              <div className="flex justify-between text-sm text-muted-foreground mt-1">
                <span>{usageData.current_usage.chats.used}</span>
                <span>{usageData.current_usage.chats.limit}</span>
              </div>
            </div>

            {usageData.organization.ai_voice_enabled && (
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Minutos de voz</span>
                  <Badge variant={getStatusColor(usageData.current_usage.voice_minutes.status)}>
                    {getStatusText(usageData.current_usage.voice_minutes.status)}
                  </Badge>
                </div>
                <Progress 
                  value={usageData.current_usage.voice_minutes.percentage} 
                  className="h-2"
                />
                <div className="flex justify-between text-sm text-muted-foreground mt-1">
                  <span>{usageData.current_usage.voice_minutes.used}</span>
                  <span>{usageData.current_usage.voice_minutes.limit}</span>
                </div>
              </div>
            )}

            <div className="pt-4 border-t">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold">{usageData.stats.total_chats}</div>
                  <div className="text-sm text-muted-foreground">Total chats</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{usageData.stats.total_tokens.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">Total tokens</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{usageData.stats.average_tokens_per_chat}</div>
                  <div className="text-sm text-muted-foreground">Promedio/chat</div>
                </div>
              </div>
            </div>

            {currentPlan !== 'free' && (
              <Button 
                onClick={handleManageBilling} 
                variant="outline" 
                className="w-full"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Gestionar facturación
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Alertas de límites */}
        <Card>
          <CardHeader>
            <CardTitle>Estado del Agente AI</CardTitle>
          </CardHeader>
          <CardContent>
            {(usageData.current_usage.chats.status === 'near_limit' || 
              usageData.current_usage.chats.status === 'over_limit') && (
              <Alert className="mb-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  {usageData.current_usage.chats.status === 'over_limit' 
                    ? 'Has excedido el límite de chats. Considera upgrade o compra add-ons.'
                    : 'Te estás acercando al límite de chats. Considera upgrade tu plan.'
                  }
                </AlertDescription>
              </Alert>
            )}

            {usageData.organization.ai_voice_enabled && 
             (usageData.current_usage.voice_minutes.status === 'near_limit' || 
              usageData.current_usage.voice_minutes.status === 'over_limit') && (
              <Alert className="mb-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  {usageData.current_usage.voice_minutes.status === 'over_limit' 
                    ? 'Has excedido el límite de minutos de voz. Compra add-ons para continuar.'
                    : 'Te estás acercando al límite de minutos de voz.'
                  }
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <h4 className="font-medium">Funcionalidades disponibles:</h4>
              <ul className="space-y-1 text-sm">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Agente AI (texto)
                </li>
                <li className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                    usageData.organization.ai_voice_enabled ? 'bg-green-500' : 'bg-gray-300'
                  }`}></div>
                  Agente AI (voz)
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Cache de FAQs
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Planes disponibles */}
      {currentPlan !== 'premium' && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Planes Disponibles</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {Object.entries(PLANS).map(([planKey, plan]) => {
              if (planKey === currentPlan || planKey === 'free') return null;
              
              const isCurrentPlan = planKey === currentPlan;
              const Icon = plan.icon;
              
              return (
                <Card key={planKey} className={isCurrentPlan ? 'border-primary' : ''}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Icon className="h-5 w-5" />
                      {plan.name}
                    </CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                    <div className="text-3xl font-bold">{plan.price}<span className="text-lg text-muted-foreground">/mes</span></div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ul className="space-y-2">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                          {feature}
                        </li>
                      ))}
                      {plan.limitations.map((limitation, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <div className="w-1.5 h-1.5 bg-gray-300 rounded-full"></div>
                          {limitation}
                        </li>
                      ))}
                    </ul>
                    
                    <Button 
                      className="w-full" 
                      onClick={() => handleSubscribe(planKey as 'pro' | 'premium')}
                      disabled={subscribing === planKey}
                    >
                      {subscribing === planKey ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : null}
                      {isCurrentPlan ? 'Plan Actual' : `Cambiar a ${plan.name}`}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
