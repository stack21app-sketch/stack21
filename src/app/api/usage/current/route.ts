import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { createClient } from '@supabase/supabase-js';
import { getCurrentUsage, getUsageStats, getUsageHistory } from '../../../../lib/usage';
import { getLimitsInfo } from '../../../../lib/agent-guard';

export async function GET(request: NextRequest) {
  try {
    const token = await getToken({ req: request });
    if (!token || !token.sub) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const organizationId = searchParams.get('organizationId');

    if (!organizationId) {
      return NextResponse.json(
        { error: 'organizationId es requerido' },
        { status: 400 }
      );
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Verificar permisos
    const { data: org, error: orgError } = await supabase
      .from('workspaces')
      .select('id, plan, ai_voice_enabled, owner_id, members')
      .eq('id', organizationId)
      .single();

    if (orgError || !org) {
      return NextResponse.json(
        { error: 'Organización no encontrada' },
        { status: 404 }
      );
    }

    const isOwner = org.owner_id === token.sub;
    const isMember = org.members?.includes(token.sub);
    
    if (!isOwner && !isMember) {
      return NextResponse.json(
        { error: 'Sin permisos para acceder a esta organización' },
        { status: 403 }
      );
    }

    // Obtener uso actual
    const currentUsage = await getCurrentUsage(organizationId);

    // Obtener estadísticas
    const stats = await getUsageStats(organizationId);

    // Obtener historial (últimos 6 meses)
    const history = await getUsageHistory(organizationId, 6);

    // Obtener información de límites del plan
    const limitsInfo = getLimitsInfo(org.plan);

    // Calcular porcentajes de uso
    const chatUsagePercentage = Math.round((currentUsage.chats_used / limitsInfo.chats.soft) * 100);
    const voiceUsagePercentage = org.ai_voice_enabled && limitsInfo.voiceMinutes.soft > 0 
      ? Math.round((currentUsage.voice_minutes / limitsInfo.voiceMinutes.soft) * 100)
      : 0;

    // Determinar estado de uso
    const getUsageStatus = (percentage: number) => {
      if (percentage >= 100) return 'over_limit';
      if (percentage >= 80) return 'near_limit';
      if (percentage >= 60) return 'moderate';
      return 'low';
    };

    const chatStatus = getUsageStatus(chatUsagePercentage);
    const voiceStatus = getUsageStatus(voiceUsagePercentage);

    return NextResponse.json({
      organization: {
        id: org.id,
        plan: org.plan,
        ai_voice_enabled: org.ai_voice_enabled,
      },
      current_usage: {
        chats: {
          used: currentUsage.chats_used,
          limit: limitsInfo.chats.soft,
          hard_limit: limitsInfo.chats.hard,
          percentage: chatUsagePercentage,
          status: chatStatus,
        },
        voice_minutes: {
          used: currentUsage.voice_minutes,
          limit: limitsInfo.voiceMinutes.soft,
          hard_limit: limitsInfo.voiceMinutes.hard,
          percentage: voiceUsagePercentage,
          status: voiceStatus,
          available: org.ai_voice_enabled,
        },
        tokens: {
          in: currentUsage.tokens_in,
          out: currentUsage.tokens_out,
          total: currentUsage.tokens_in + currentUsage.tokens_out,
        },
        daily_tokens_limit: limitsInfo.dailyTokens,
      },
      stats: {
        total_chats: stats.totalChats,
        total_tokens: stats.totalTokens,
        total_voice_minutes: stats.totalVoiceMinutes,
        average_tokens_per_chat: Math.round(stats.averageTokensPerChat),
      },
      history: history.map(record => ({
        year: record.year,
        month: record.month,
        chats_used: record.chats_used,
        tokens_in: record.tokens_in,
        tokens_out: record.tokens_out,
        voice_minutes: record.voice_minutes,
      })),
      plan_info: {
        features: limitsInfo.features,
        limits: limitsInfo,
      },
      period: {
        year: currentUsage.year,
        month: currentUsage.month,
        days_remaining: getDaysRemainingInMonth(),
      },
    });

  } catch (error) {
    console.error('Error in usage endpoint:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

/**
 * Calcula los días restantes en el mes actual
 */
function getDaysRemainingInMonth(): number {
  const now = new Date();
  const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const currentDay = now.getDate();
  return lastDayOfMonth - currentDay;
}
