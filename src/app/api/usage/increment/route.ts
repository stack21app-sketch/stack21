import { NextRequest, NextResponse } from 'next/server';
import { incrementUsage } from '@/lib/usage';
import { createClient } from '@/lib/supabase/server';

/**
 * Endpoint interno para incrementar contadores de uso
 * Solo debe ser llamado desde otros endpoints del servidor
 */
export async function POST(request: NextRequest) {
  try {
    const { organizationId, deltas } = await request.json();

    if (!organizationId || !deltas) {
      return NextResponse.json(
        { error: 'organizationId y deltas son requeridos' },
        { status: 400 }
      );
    }

    // Verificar que la organización existe
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    const { data: org, error: orgError } = await supabase
      .from('workspaces')
      .select('id')
      .eq('id', organizationId)
      .single();

    if (orgError || !org) {
      return NextResponse.json(
        { error: 'Organización no encontrada' },
        { status: 404 }
      );
    }

    // Validar deltas
    const validDeltas = {
      chats: Math.max(0, Math.floor(deltas.chats || 0)),
      tokensIn: Math.max(0, Math.floor(deltas.tokensIn || 0)),
      tokensOut: Math.max(0, Math.floor(deltas.tokensOut || 0)),
      voiceMinutes: Math.max(0, Math.floor(deltas.voiceMinutes || 0)),
    };

    // Verificar que hay al menos un delta válido
    const hasValidDelta = Object.values(validDeltas).some(value => value > 0);
    if (!hasValidDelta) {
      return NextResponse.json(
        { error: 'Al menos un delta debe ser mayor que 0' },
        { status: 400 }
      );
    }

    // Incrementar uso
    await incrementUsage(organizationId, validDeltas);

    return NextResponse.json({
      success: true,
      organizationId,
      deltas: validDeltas,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Error incrementing usage:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
