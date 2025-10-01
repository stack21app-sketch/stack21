import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getCurrentUsage, incrementUsage } from '../../../../lib/usage';
import { openaiChat, openaiReasoning, generateMarketingContent } from '../../../../lib/agent';
import { checkLimits } from '../../../../lib/agent-guard';
import { getToken } from 'next-auth/jwt';

export async function POST(request: NextRequest) {
  try {
    // Verificar autenticación
    const token = await getToken({ req: request });
    if (!token || !token.sub) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const { 
      action, 
      message, 
      context, 
      marketingType,
      marketingContext,
      organizationId 
    } = await request.json();

    if (!action || !organizationId) {
      return NextResponse.json(
        { error: 'Acción y organizationId son requeridos' },
        { status: 400 }
      );
    }

    // Verificar que el usuario tiene acceso a la organización
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    const { data: membership, error: membershipError } = await supabase
      .from('workspaces')
      .select('id, plan, ai_voice_enabled, owner_id, members')
      .eq('id', organizationId)
      .single();

    if (membershipError || !membership) {
      return NextResponse.json(
        { error: 'Organización no encontrada' },
        { status: 404 }
      );
    }

    // Verificar permisos
    const isOwner = membership.owner_id === token.sub;
    const isMember = membership.members?.includes(token.sub);
    
    if (!isOwner && !isMember) {
      return NextResponse.json(
        { error: 'Sin permisos para acceder a esta organización' },
        { status: 403 }
      );
    }

    // Obtener uso actual
    const usage = await getCurrentUsage(organizationId);

    // Verificar límites
    const guardResult = await checkLimits({
      org: {
        id: organizationId,
        plan: membership.plan,
        ai_voice_enabled: membership.ai_voice_enabled,
      },
      usage,
      mode: 'text',
      estimatedTokens: Math.ceil((message?.length || 0) / 4),
    });

    if (!guardResult.ok) {
      return NextResponse.json(
        {
          error: guardResult.reason,
          upsell: guardResult.upsell,
        },
        { 
          status: guardResult.reason?.includes('Límite diario') ? 429 : 402 
        }
      );
    }

    let response;
    let tokensIn = 0;
    let tokensOut = 0;
    let model = 'unknown';
    let duration = 0;

    const startTime = Date.now();

    switch (action) {
      case 'chat':
        if (!message) {
          return NextResponse.json(
            { error: 'Mensaje es requerido para chat' },
            { status: 400 }
          );
        }

        response = await openaiChat({
          organizationId,
          messages: [{ role: 'user', content: message }],
          context,
          maxTokens: 500, // Más tokens para admin
        });
        
        tokensIn = response.tokensIn;
        tokensOut = response.tokensOut;
        model = response.model;
        break;

      case 'reasoning':
        if (!message) {
          return NextResponse.json(
            { error: 'Mensaje es requerido para reasoning' },
            { status: 400 }
          );
        }

        response = await openaiReasoning({
          organizationId,
          messages: [{ role: 'user', content: message }],
          context,
          maxTokens: 1000,
        });
        
        tokensIn = response.tokensIn;
        tokensOut = response.tokensOut;
        model = response.model;
        break;

      case 'marketing':
        if (!marketingType || !marketingContext) {
          return NextResponse.json(
            { error: 'Tipo de marketing y contexto son requeridos' },
            { status: 400 }
          );
        }

        response = await generateMarketingContent(
          marketingType,
          marketingContext
        );
        
        tokensIn = response.tokensIn;
        tokensOut = response.tokensOut;
        model = response.model;
        break;

      default:
        return NextResponse.json(
          { error: 'Acción no válida' },
          { status: 400 }
        );
    }

    duration = Date.now() - startTime;

    // Incrementar contadores de uso
    await incrementUsage(organizationId, {
      chats: 1,
      tokensIn,
      tokensOut,
    });

    // Log de la acción
    await supabase
      .from('agent_action_logs')
      .insert({
        org_id: organizationId,
        user_id: token.sub,
        tool: action,
        args_sanitized: {
          action,
          message_length: message?.length || 0,
          marketing_type: marketingType,
          has_context: context ? Object.keys(context).length > 0 : false,
        },
        tokens_in: tokensIn,
        tokens_out: tokensOut,
        duration_ms: duration,
        model_used: model,
        cached: false,
      });

    return NextResponse.json({
      result: response.answer,
      action,
      tokens_in: tokensIn,
      tokens_out: tokensOut,
      model,
      duration_ms: duration,
      warning: guardResult.warning,
      upsell: guardResult.upsell,
    });

  } catch (error) {
    console.error('Error in admin agent endpoint:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// Endpoint GET para obtener estadísticas del agente
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
    const { data: membership, error: membershipError } = await supabase
      .from('workspaces')
      .select('id, owner_id, members')
      .eq('id', organizationId)
      .single();

    if (membershipError || !membership) {
      return NextResponse.json(
        { error: 'Organización no encontrada' },
        { status: 404 }
      );
    }

    const isOwner = membership.owner_id === token.sub;
    const isMember = membership.members?.includes(token.sub);
    
    if (!isOwner && !isMember) {
      return NextResponse.json(
        { error: 'Sin permisos para acceder a esta organización' },
        { status: 403 }
      );
    }

    // Obtener estadísticas de uso
    const { data: usageStats, error: usageError } = await supabase
      .from('usage_counters')
      .select('*')
      .eq('org_id', organizationId)
      .order('year', { ascending: false })
      .order('month', { ascending: false })
      .limit(12);

    if (usageError) {
      throw new Error(`Error fetching usage stats: ${usageError.message}`);
    }

    // Obtener logs recientes
    const { data: recentLogs, error: logsError } = await supabase
      .from('agent_action_logs')
      .select('tool, tokens_in, tokens_out, duration_ms, model_used, cached, created_at')
      .eq('org_id', organizationId)
      .order('created_at', { ascending: false })
      .limit(50);

    if (logsError) {
      throw new Error(`Error fetching logs: ${logsError.message}`);
    }

    // Calcular estadísticas agregadas
    const totalChats = usageStats?.reduce((sum, stat) => sum + stat.chats_used, 0) || 0;
    const totalTokens = usageStats?.reduce((sum, stat) => sum + stat.tokens_in + stat.tokens_out, 0) || 0;
    const totalDuration = recentLogs?.reduce((sum, log) => sum + log.duration_ms, 0) || 0;
    const averageDuration = recentLogs?.length ? totalDuration / recentLogs.length : 0;
    const cacheHits = recentLogs?.filter(log => log.cached).length || 0;
    const cacheHitRate = recentLogs?.length ? (cacheHits / recentLogs.length) * 100 : 0;

    return NextResponse.json({
      usage: {
        total_chats: totalChats,
        total_tokens: totalTokens,
        total_duration_ms: totalDuration,
        average_duration_ms: Math.round(averageDuration),
        cache_hit_rate: Math.round(cacheHitRate * 100) / 100,
      },
      monthly_usage: usageStats || [],
      recent_activity: recentLogs || [],
    });

  } catch (error) {
    console.error('Error in GET admin agent endpoint:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
