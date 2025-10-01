'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Bot, 
  MessageSquare, 
  Mic, 
  Zap, 
  AlertTriangle, 
  Crown,
  ExternalLink 
} from 'lucide-react';
import { toast } from 'sonner';

interface AgentStatusProps {
  organizationId: string;
  onUpgrade?: () => void;
}

interface UsageData {
  organization: {
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
  };
}

export function AgentStatus({ organizationId, onUpgrade }: AgentStatusProps) {
  const [usageData, setUsageData] = useState<UsageData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsageData();
    // Refrescar cada 30 segundos
    const interval = setInterval(fetchUsageData, 30000);
    return () => clearInterval(interval);
  }, [organizationId]);

  const fetchUsageData = async () => {
    try {
      const response = await fetch(`/api/usage/current?organizationId=${organizationId}`);
      if (!response.ok) throw new Error('Error fetching usage data');
      
      const data = await response.json();
      setUsageData(data);
    } catch (error) {
      console.error('Error fetching usage data:', error);
    } finally {
      setLoading(false);
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

  const getPlanIcon = (plan: string) => {
    switch (plan) {
      case 'premium': return Crown;
      case 'pro': return Zap;
      default: return Bot;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!usageData) {
    return (
      <Card>
        <CardContent className="p-6">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              No se pudo cargar el estado del agente AI.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  const { organization, current_usage } = usageData;
  const PlanIcon = getPlanIcon(organization.plan);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5" />
          Estado del Agente AI
        </CardTitle>
        <CardDescription>
          Monitorea el uso y límites de tu agente AI
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Plan actual */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PlanIcon className="h-4 w-4" />
            <span className="font-medium capitalize">{organization.plan}</span>
          </div>
          {organization.plan !== 'premium' && (
            <Button 
              size="sm" 
              variant="outline"
              onClick={onUpgrade}
            >
              <Crown className="h-3 w-3 mr-1" />
              Upgrade
            </Button>
          )}
        </div>

        {/* Alertas de límites */}
        {(current_usage.chats.status === 'near_limit' || 
          current_usage.chats.status === 'over_limit') && (
          <Alert className="border-orange-200 bg-orange-50">
            <AlertTriangle className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-800">
              {current_usage.chats.status === 'over_limit' 
                ? 'Límite de chats excedido. Upgrade para continuar.'
                : 'Te estás acercando al límite de chats.'
              }
            </AlertDescription>
          </Alert>
        )}

        {/* Uso de chats */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              <span className="text-sm font-medium">Chats usados</span>
            </div>
            <Badge variant={getStatusColor(current_usage.chats.status)}>
              {getStatusText(current_usage.chats.status)}
            </Badge>
          </div>
          <Progress 
            value={Math.min(current_usage.chats.percentage, 100)} 
            className="h-2"
          />
          <div className="flex justify-between text-sm text-muted-foreground mt-1">
            <span>{current_usage.chats.used}</span>
            <span>{current_usage.chats.limit}</span>
          </div>
        </div>

        {/* Uso de voz */}
        {organization.ai_voice_enabled && (
          <div>
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                <Mic className="h-4 w-4" />
                <span className="text-sm font-medium">Minutos de voz</span>
              </div>
              <Badge variant={getStatusColor(current_usage.voice_minutes.status)}>
                {getStatusText(current_usage.voice_minutes.status)}
              </Badge>
            </div>
            <Progress 
              value={Math.min(current_usage.voice_minutes.percentage, 100)} 
              className="h-2"
            />
            <div className="flex justify-between text-sm text-muted-foreground mt-1">
              <span>{current_usage.voice_minutes.used}</span>
              <span>{current_usage.voice_minutes.limit}</span>
            </div>
          </div>
        )}

        {/* Funcionalidades disponibles */}
        <div className="pt-4 border-t">
          <h4 className="text-sm font-medium mb-2">Funcionalidades disponibles:</h4>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              Agente AI (texto)
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className={`w-2 h-2 rounded-full ${
                organization.ai_voice_enabled ? 'bg-green-500' : 'bg-gray-300'
              }`}></div>
              Agente AI (voz) {!organization.ai_voice_enabled && '(Premium)'}
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              Cache de FAQs
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className={`w-2 h-2 rounded-full ${
                organization.plan !== 'free' ? 'bg-green-500' : 'bg-gray-300'
              }`}></div>
              Marketing AI {organization.plan === 'free' && '(Pro+)'}
            </div>
          </div>
        </div>

        {/* Acciones rápidas */}
        <div className="pt-4 border-t space-y-2">
          {organization.plan === 'free' && (
            <Button 
              className="w-full" 
              onClick={onUpgrade}
            >
              <Crown className="h-4 w-4 mr-2" />
              Upgrade a Pro - €15/mes
            </Button>
          )}
          
          {organization.plan === 'pro' && !organization.ai_voice_enabled && (
            <Button 
              className="w-full" 
              variant="outline"
              onClick={onUpgrade}
            >
              <Mic className="h-4 w-4 mr-2" />
              Upgrade a Premium - €29/mes
            </Button>
          )}

          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full"
            onClick={() => window.open('/settings/billing', '_blank')}
          >
            <ExternalLink className="h-3 w-3 mr-1" />
            Ver detalles de facturación
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
