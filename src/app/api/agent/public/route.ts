import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getCurrentUsage, incrementUsage } from '../../../../lib/usage';
import { findCachedAnswer, saveCacheAnswer, shouldCache } from '../../../../lib/faq-cache';
import { openaiChat } from '../../../../lib/agent';
import { checkLimits } from '../../../../lib/agent-guard';

export async function POST(request: NextRequest) {
  try {
    const { handle, message, context } = await request.json();

    if (!handle || !message) {
      return NextResponse.json(
        { error: 'Handle y mensaje son requeridos' },
        { status: 400 }
      );
    }

    // Obtener información de la organización por handle
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    const { data: org, error: orgError } = await supabase
      .from('workspaces')
      .select('id, plan, ai_voice_enabled, name')
      .eq('handle', handle) // Asumiendo que hay un campo handle en workspaces
      .single();

    if (orgError || !org) {
      return NextResponse.json(
        { error: 'Organización no encontrada' },
        { status: 404 }
      );
    }

    // Obtener uso actual
    const usage = await getCurrentUsage(org.id);

    // Verificar límites antes de procesar
    const guardResult = await checkLimits({
      org: {
        id: org.id,
        plan: org.plan,
        ai_voice_enabled: org.ai_voice_enabled,
      },
      usage,
      mode: 'text',
      estimatedTokens: Math.ceil(message.length / 4), // Estimación aproximada
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

    // Buscar respuesta en cache
    const cached = await findCachedAnswer(org.id, message);
    if (cached) {
      // Log de cache hit
      await supabase
        .from('agent_action_logs')
        .insert({
          org_id: org.id,
          tool: 'cache_hit',
          args_sanitized: { question_length: message.length },
          tokens_in: 0,
          tokens_out: 0,
          duration_ms: 0,
          model_used: 'cache',
          cached: true,
        });

      return NextResponse.json({
        answer: cached.answer,
        cached: true,
        tokens_saved: cached.tokens_saved,
        warning: guardResult.warning,
        upsell: guardResult.upsell,
      });
    }

    // Obtener contexto adicional si está disponible
    let agentContext = {};
    if (context?.includeProducts) {
      const { data: products } = await supabase
        .from('products') // Asumiendo que existe esta tabla
        .select('name, description, price')
        .eq('workspace_id', org.id)
        .limit(10);
      agentContext = { ...agentContext, products };
    }

    if (context?.includeFAQs) {
      const { data: faqs } = await supabase
        .from('org_faqs')
        .select('question, answer')
        .eq('org_id', org.id)
        .limit(5);
      agentContext = { ...agentContext, faqs };
    }

    // Ejecutar chat con OpenAI
    const startTime = Date.now();
    const chatResponse = await openaiChat({
      organizationId: org.id,
      messages: [
        { role: 'user', content: message },
      ],
      context: agentContext,
      maxTokens: 300, // Límite conservador para controlar costos
    });

    const duration = Date.now() - startTime;

    // Incrementar contadores de uso
    await incrementUsage(org.id, {
      chats: 1,
      tokensIn: chatResponse.tokensIn,
      tokensOut: chatResponse.tokensOut,
    });

    // Log de la acción
    await supabase
      .from('agent_action_logs')
      .insert({
        org_id: org.id,
        tool: 'chat',
        args_sanitized: { 
          question_length: message.length,
          has_context: Object.keys(agentContext).length > 0,
        },
        tokens_in: chatResponse.tokensIn,
        tokens_out: chatResponse.tokensOut,
        duration_ms: duration,
        model_used: chatResponse.model,
        cached: false,
      });

    // Guardar en cache si es apropiado
    if (shouldCache(chatResponse.answer)) {
      await saveCacheAnswer(org.id, message, chatResponse.answer);
    }

    return NextResponse.json({
      answer: chatResponse.answer,
      cached: false,
      tokens_in: chatResponse.tokensIn,
      tokens_out: chatResponse.tokensOut,
      model: chatResponse.model,
      duration_ms: duration,
      warning: guardResult.warning,
      upsell: guardResult.upsell,
    });

  } catch (error) {
    console.error('Error in public agent endpoint:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// Endpoint GET para obtener información de la organización
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const handle = searchParams.get('handle');

    if (!handle) {
      return NextResponse.json(
        { error: 'Handle es requerido' },
        { status: 400 }
      );
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    const { data: org, error } = await supabase
      .from('workspaces')
      .select('id, name, plan, ai_voice_enabled, description')
      .eq('handle', handle)
      .single();

    if (error || !org) {
      return NextResponse.json(
        { error: 'Organización no encontrada' },
        { status: 404 }
      );
    }

    // Obtener uso actual
    const usage = await getCurrentUsage(org.id);

    return NextResponse.json({
      organization: {
        name: org.name,
        plan: org.plan,
        ai_voice_enabled: org.ai_voice_enabled,
        description: org.description,
      },
      usage: {
        chats_used: usage.chats_used,
        tokens_in: usage.tokens_in,
        tokens_out: usage.tokens_out,
        voice_minutes: usage.voice_minutes,
      },
    });

  } catch (error) {
    console.error('Error in GET public agent endpoint:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
