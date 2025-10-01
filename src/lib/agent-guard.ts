import { getCurrentUsage, getDailyTokenUsage } from './usage';

export type PlanType = 'free' | 'pro' | 'premium';
export type AgentMode = 'text' | 'voice';

export interface Organization {
  id: string;
  plan: PlanType;
  ai_voice_enabled: boolean;
}

export interface UsageLimits {
  chats_used: number;
  tokens_in: number;
  tokens_out: number;
  voice_minutes: number;
}

export interface GuardResult {
  ok: boolean;
  reason?: string;
  upsell?: {
    plan: PlanType;
    addon?: {
      type: 'chats' | 'voice_minutes';
      quantity: number;
      price: number;
    };
  };
  warning?: string;
}

export interface GuardOptions {
  org: Organization;
  usage: UsageLimits;
  mode: AgentMode;
  estimatedTokens?: number;
}

/**
 * Configuración de límites por plan (desde variables de entorno)
 */
function getPlanLimits(): Record<PlanType, {
  softCap: {
    chats: number;
    voiceMinutes: number;
  };
  hardCap: {
    dailyTokens: number;
    chats: number;
  };
  tolerance: number; // porcentaje de tolerancia después del soft cap
}> {
  return {
    free: {
      softCap: {
        chats: parseInt(process.env.AGENT_SOFTCAP_CHATS_FREE || '20'),
        voiceMinutes: 0,
      },
      hardCap: {
        dailyTokens: parseInt(process.env.AGENT_HARDCAP_TOKENS_DAILY_FREE || '1000'),
        chats: parseInt(process.env.AGENT_SOFTCAP_CHATS_FREE || '20'),
      },
      tolerance: 0, // Sin tolerancia en plan free
    },
    pro: {
      softCap: {
        chats: parseInt(process.env.AGENT_SOFTCAP_CHATS_PRO || '1000'),
        voiceMinutes: 0,
      },
      hardCap: {
        dailyTokens: 50000, // Límite alto para Pro
        chats: parseInt(process.env.AGENT_SOFTCAP_CHATS_PRO || '1000') * 1.1, // 10% tolerancia
      },
      tolerance: 10,
    },
    premium: {
      softCap: {
        chats: 5000, // Límite alto para Premium
        voiceMinutes: parseInt(process.env.AGENT_SOFTCAP_MINUTES_PREMIUM || '200'),
      },
      hardCap: {
        dailyTokens: 100000, // Límite muy alto para Premium
        chats: 5500, // 10% tolerancia
      },
      tolerance: 10,
    },
  };
}

/**
 * Verifica los límites del agente AI para una organización
 */
export async function checkLimits(options: GuardOptions): Promise<GuardResult> {
  const { org, usage, mode, estimatedTokens = 0 } = options;
  const limits = getPlanLimits()[org.plan];

  // Verificar límite duro de tokens diarios (solo para plan Free)
  if (org.plan === 'free') {
    const dailyTokens = await getDailyTokenUsage(org.id);
    if (dailyTokens + estimatedTokens > limits.hardCap.dailyTokens) {
      return {
        ok: false,
        reason: `Límite diario de tokens alcanzado (${limits.hardCap.dailyTokens}). Upgrade a Pro para mayor capacidad.`,
        upsell: {
          plan: 'pro',
        },
      };
    }
  }

  // Verificar límites de chats
  const chatLimit = limits.hardCap.chats;
  if (usage.chats_used >= chatLimit) {
    const softCap = limits.softCap.chats;
    const toleranceLimit = Math.floor(softCap * (1 + limits.tolerance / 100));
    
    if (usage.chats_used >= toleranceLimit) {
      return {
        ok: false,
        reason: `Límite de chats alcanzado (${toleranceLimit}). Upgrade a un plan superior o compra add-ons.`,
        upsell: {
          plan: org.plan === 'free' ? 'pro' : 'premium',
          addon: {
            type: 'chats',
            quantity: 1000,
            price: 500, // 5€ en centavos
          },
        },
      };
    } else if (usage.chats_used >= softCap) {
      return {
        ok: true,
        warning: `Has alcanzado el límite recomendado de chats (${softCap}). Considera upgrade o compra add-ons.`,
        upsell: {
          plan: org.plan === 'free' ? 'pro' : 'premium',
          addon: {
            type: 'chats',
            quantity: 1000,
            price: 500,
          },
        },
      };
    }
  }

  // Verificar límites de voz (solo Premium)
  if (mode === 'voice') {
    if (!org.ai_voice_enabled) {
      return {
        ok: false,
        reason: 'La función de voz no está disponible en tu plan actual. Upgrade a Premium para acceder.',
        upsell: {
          plan: 'premium',
        },
      };
    }

    if (usage.voice_minutes >= limits.softCap.voiceMinutes) {
      const toleranceLimit = Math.floor(limits.softCap.voiceMinutes * (1 + limits.tolerance / 100));
      
      if (usage.voice_minutes >= toleranceLimit) {
        return {
          ok: false,
          reason: `Límite de minutos de voz alcanzado (${toleranceLimit}). Compra add-ons para continuar.`,
          upsell: {
            plan: 'premium',
            addon: {
              type: 'voice_minutes',
              quantity: 60,
              price: 500, // 5€ en centavos
            },
          },
        };
      } else {
        return {
          ok: true,
          warning: `Has alcanzado el límite recomendado de minutos de voz (${limits.softCap.voiceMinutes}).`,
          upsell: {
            plan: 'premium',
            addon: {
              type: 'voice_minutes',
              quantity: 60,
              price: 500,
            },
          },
        };
      }
    }
  }

  return { ok: true };
}

/**
 * Middleware wrapper para endpoints del agente AI
 */
export function withAgentGuard<T extends any[]>(
  handler: (org: Organization, usage: UsageLimits, ...args: T) => Promise<Response>
) {
  return async (...args: T): Promise<Response> => {
    try {
      // Extraer org_id del contexto (esto dependerá de cómo implementes la autenticación)
      const orgId = await extractOrgIdFromContext(...args);
      if (!orgId) {
        return new Response(
          JSON.stringify({ error: 'Organization not found' }),
          { status: 404, headers: { 'Content-Type': 'application/json' } }
        );
      }

      // Obtener información de la organización
      const org = await getOrganizationInfo(orgId);
      if (!org) {
        return new Response(
          JSON.stringify({ error: 'Organization not found' }),
          { status: 404, headers: { 'Content-Type': 'application/json' } }
        );
      }

      // Obtener uso actual
      const usage = await getCurrentUsage(orgId);

      // Verificar límites
      const guardResult = await checkLimits({
        org,
        usage,
        mode: 'text', // Esto se puede extraer de los args si es necesario
      });

      if (!guardResult.ok) {
        return new Response(
          JSON.stringify({
            error: guardResult.reason,
            upsell: guardResult.upsell,
          }),
          { 
            status: guardResult.reason?.includes('Límite diario') ? 429 : 402,
            headers: { 'Content-Type': 'application/json' }
          }
        );
      }

      // Ejecutar el handler original
      const response = await handler(org, usage, ...args);

      // Si hay advertencia, añadirla a la respuesta
      if (guardResult.warning) {
        const responseData = await response.json();
        responseData.warning = guardResult.warning;
        responseData.upsell = guardResult.upsell;
        
        return new Response(
          JSON.stringify(responseData),
          { 
            status: response.status,
            headers: { 'Content-Type': 'application/json' }
          }
        );
      }

      return response;

    } catch (error) {
      console.error('Agent guard error:', error);
      return new Response(
        JSON.stringify({ error: 'Internal server error' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
  };
}

/**
 * Función auxiliar para extraer org_id del contexto
 * Esta función debe ser implementada según tu sistema de autenticación
 */
async function extractOrgIdFromContext(...args: any[]): Promise<string | null> {
  // Implementar según tu sistema de autenticación
  // Por ejemplo, desde headers, JWT, o parámetros de la request
  return null; // Placeholder
}

/**
 * Función auxiliar para obtener información de la organización
 */
async function getOrganizationInfo(orgId: string): Promise<Organization | null> {
  // Implementar consulta a la base de datos
  // Por ejemplo, usando Supabase
  return null; // Placeholder
}

/**
 * Obtiene información de límites para mostrar en la UI
 */
export function getLimitsInfo(plan: PlanType): {
  chats: { soft: number; hard: number };
  voiceMinutes: { soft: number; hard: number };
  dailyTokens: number;
  features: string[];
} {
  const limits = getPlanLimits()[plan];

  const features = {
    free: ['Mini-tienda y catálogo', 'Agente AI básico (texto)', '20 chats/mes'],
    pro: ['Todo lo del Free', 'Agente AI completo', '1,000 chats/mes', 'Cache FAQ', 'Generación de marketing básica'],
    premium: ['Todo lo del Pro', 'Agente AI con voz', '200 min/mes de voz', 'Generación de marketing extendida', 'Soporte prioritario'],
  };

  return {
    chats: {
      soft: limits.softCap.chats,
      hard: limits.hardCap.chats,
    },
    voiceMinutes: {
      soft: limits.softCap.voiceMinutes,
      hard: limits.softCap.voiceMinutes * (1 + limits.tolerance / 100),
    },
    dailyTokens: limits.hardCap.dailyTokens,
    features: features[plan],
  };
}
