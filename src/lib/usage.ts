import { supabase } from './supabase/server';

export interface UsageCounters {
  org_id: string;
  year: number;
  month: number;
  chats_used: number;
  tokens_in: number;
  tokens_out: number;
  voice_minutes: number;
  created_at: string;
  updated_at: string;
}

export interface UsageDeltas {
  chats?: number;
  tokensIn?: number;
  tokensOut?: number;
  voiceMinutes?: number;
}

export interface CurrentUsage {
  chats_used: number;
  tokens_in: number;
  tokens_out: number;
  voice_minutes: number;
  year: number;
  month: number;
}

/**
 * Obtiene o crea el contador de uso para una organización en el mes actual
 */
export async function getOrCreateUsage(
  orgId: string,
  year?: number,
  month?: number
): Promise<UsageCounters> {
  // Usar el cliente de Supabase importado
  
  const currentDate = new Date();
  const targetYear = year || currentDate.getFullYear();
  const targetMonth = month || currentDate.getMonth() + 1;

  // Intentar obtener el contador existente
  const { data: existing, error: fetchError } = await supabase
    .from('usage_counters')
    .select('*')
    .eq('org_id', orgId)
    .eq('year', targetYear)
    .eq('month', targetMonth)
    .single();

  if (existing && !fetchError) {
    return existing;
  }

  // Si no existe, crearlo
  const { data: newCounter, error: createError } = await supabase
    .from('usage_counters')
    .insert({
      org_id: orgId,
      year: targetYear,
      month: targetMonth,
      chats_used: 0,
      tokens_in: 0,
      tokens_out: 0,
      voice_minutes: 0,
    })
    .select()
    .single();

  if (createError) {
    throw new Error(`Error creating usage counter: ${createError.message}`);
  }

  return newCounter;
}

/**
 * Obtiene el uso actual de una organización para el mes actual
 */
export async function getCurrentUsage(orgId: string): Promise<CurrentUsage> {
  const counter = await getOrCreateUsage(orgId);
  
  return {
    chats_used: counter.chats_used,
    tokens_in: counter.tokens_in,
    tokens_out: counter.tokens_out,
    voice_minutes: counter.voice_minutes,
    year: counter.year,
    month: counter.month,
  };
}

/**
 * Incrementa los contadores de uso de una organización
 */
export async function incrementUsage(
  orgId: string,
  deltas: UsageDeltas
): Promise<void> {
  // Usar el cliente de Supabase importado
  
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;

  // Asegurar que existe el contador del mes actual
  await getOrCreateUsage(orgId, year, month);

  // Preparar los campos a actualizar
  const updates: Partial<UsageCounters> = {
    updated_at: new Date().toISOString(),
  };

  if (deltas.chats) updates.chats_used = deltas.chats;
  if (deltas.tokensIn) updates.tokens_in = deltas.tokensIn;
  if (deltas.tokensOut) updates.tokens_out = deltas.tokensOut;
  if (deltas.voiceMinutes) updates.voice_minutes = deltas.voiceMinutes;

  const { error } = await supabase
    .from('usage_counters')
    .update(updates)
    .eq('org_id', orgId)
    .eq('year', year)
    .eq('month', month);

  if (error) {
    throw new Error(`Error incrementing usage: ${error.message}`);
  }
}

/**
 * Obtiene el uso histórico de una organización
 */
export async function getUsageHistory(
  orgId: string,
  months: number = 12
): Promise<UsageCounters[]> {
  // Usar el cliente de Supabase importado
  
  const currentDate = new Date();
  const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - months + 1, 1);

  const { data, error } = await supabase
    .from('usage_counters')
    .select('*')
    .eq('org_id', orgId)
    .gte('created_at', startDate.toISOString())
    .order('year', { ascending: false })
    .order('month', { ascending: false });

  if (error) {
    throw new Error(`Error fetching usage history: ${error.message}`);
  }

  return data || [];
}

/**
 * Obtiene estadísticas de uso agregadas
 */
export async function getUsageStats(orgId: string): Promise<{
  totalChats: number;
  totalTokens: number;
  totalVoiceMinutes: number;
  averageTokensPerChat: number;
  currentMonthUsage: CurrentUsage;
}> {
  const history = await getUsageHistory(orgId, 12);
  const currentUsage = await getCurrentUsage(orgId);

  const totalChats = history.reduce((sum, record) => sum + record.chats_used, 0);
  const totalTokens = history.reduce((sum, record) => sum + record.tokens_in + record.tokens_out, 0);
  const totalVoiceMinutes = history.reduce((sum, record) => sum + record.voice_minutes, 0);
  
  const averageTokensPerChat = totalChats > 0 ? totalTokens / totalChats : 0;

  return {
    totalChats,
    totalTokens,
    totalVoiceMinutes,
    averageTokensPerChat,
    currentMonthUsage: currentUsage,
  };
}

/**
 * Resetea los contadores de uso (función administrativa)
 */
export async function resetUsageCounters(orgId: string, year: number, month: number): Promise<void> {
  // Usar el cliente de Supabase importado

  const { error } = await supabase
    .from('usage_counters')
    .update({
      chats_used: 0,
      tokens_in: 0,
      tokens_out: 0,
      voice_minutes: 0,
      updated_at: new Date().toISOString(),
    })
    .eq('org_id', orgId)
    .eq('year', year)
    .eq('month', month);

  if (error) {
    throw new Error(`Error resetting usage counters: ${error.message}`);
  }
}

/**
 * Obtiene el uso de tokens diario para el plan Free (límite duro)
 */
export async function getDailyTokenUsage(orgId: string): Promise<number> {
  // Usar el cliente de Supabase importado
  
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

  const { data, error } = await supabase
    .from('agent_action_logs')
    .select('tokens_in')
    .eq('org_id', orgId)
    .gte('created_at', `${today}T00:00:00`)
    .lt('created_at', `${today}T23:59:59`);

  if (error) {
    throw new Error(`Error fetching daily token usage: ${error.message}`);
  }

  return data?.reduce((sum, log) => sum + (log.tokens_in || 0), 0) || 0;
}
