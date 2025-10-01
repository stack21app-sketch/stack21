import { supabase } from './supabase/server';
import * as crypto from 'crypto';

export interface FAQ {
  id: string;
  org_id: string;
  question: string;
  answer: string;
  keywords: string[];
  usage_count: number;
  created_at: string;
  updated_at: string;
}

export interface CacheEntry {
  id: string;
  org_id: string;
  question_hash: string;
  question: string;
  answer: string;
  tokens_saved: number;
  hit_count: number;
  expires_at: string;
  created_at: string;
}

/**
 * Genera un hash de la pregunta para lookup rápido
 */
function generateQuestionHash(question: string): string {
  return crypto.createHash('sha256').update(question.toLowerCase().trim()).digest('hex');
}

/**
 * Calcula la similitud entre dos strings usando trigramas
 */
function calculateSimilarity(str1: string, str2: string): number {
  const normalize = (str: string) => str.toLowerCase().replace(/[^\w\s]/g, '').trim();
  const n1 = normalize(str1);
  const n2 = normalize(str2);

  if (n1 === n2) return 1.0;

  // Crear trigramas
  const getTrigrams = (str: string): Set<string> => {
    const trigrams = new Set<string>();
    for (let i = 0; i <= str.length - 3; i++) {
      trigrams.add(str.substring(i, i + 3));
    }
    return trigrams;
  };

  const trigrams1 = getTrigrams(n1);
  const trigrams2 = getTrigrams(n2);

  // Calcular intersección
  const intersection = new Set(Array.from(trigrams1).filter(x => trigrams2.has(x)));
  const union = new Set([...Array.from(trigrams1), ...Array.from(trigrams2)]);

  return intersection.size / union.size;
}

/**
 * Busca una respuesta en cache para una pregunta
 */
export async function findCachedAnswer(
  orgId: string,
  question: string,
  similarityThreshold: number = 0.8
): Promise<CacheEntry | null> {
  // Usar el cliente de Supabase importado
  
  // 1. Buscar en cache por hash exacto
  const questionHash = generateQuestionHash(question);
  
  const { data: exactMatch, error: exactError } = await supabase
    .from('agent_cache')
    .select('*')
    .eq('org_id', orgId)
    .eq('question_hash', questionHash)
    .gt('expires_at', new Date().toISOString())
    .single();

  if (exactMatch && !exactError) {
    // Incrementar contador de hits
    await supabase
      .from('agent_cache')
      .update({ hit_count: exactMatch.hit_count + 1 })
      .eq('id', exactMatch.id);
    
    return exactMatch;
  }

  // 2. Buscar en FAQs por similitud semántica
  const { data: faqs, error: faqError } = await supabase
    .from('org_faqs')
    .select('*')
    .eq('org_id', orgId);

  if (faqError || !faqs) {
    return null;
  }

  let bestMatch: FAQ | null = null;
  let bestSimilarity = 0;

  for (const faq of faqs) {
    const similarity = calculateSimilarity(question, faq.question);
    if (similarity > bestSimilarity && similarity >= similarityThreshold) {
      bestMatch = faq;
      bestSimilarity = similarity;
    }
  }

  if (bestMatch) {
    // Crear entrada en cache para futuras consultas
    await saveCacheAnswer(orgId, question, bestMatch.answer);
    
    // Incrementar contador de uso de la FAQ
    await supabase
      .from('org_faqs')
      .update({ usage_count: bestMatch.usage_count + 1 })
      .eq('id', bestMatch.id);

    return {
      id: bestMatch.id,
      org_id: orgId,
      question_hash: questionHash,
      question,
      answer: bestMatch.answer,
      tokens_saved: estimateTokensSaved(question, bestMatch.answer),
      hit_count: 1,
      expires_at: new Date(Date.now() + parseInt(process.env.CACHE_TTL_FAQ_SECONDS || '86400') * 1000).toISOString(),
      created_at: new Date().toISOString(),
    };
  }

  return null;
}

/**
 * Guarda una respuesta en cache
 */
export async function saveCacheAnswer(
  orgId: string,
  question: string,
  answer: string,
  ttlSeconds?: number
): Promise<void> {
  // Usar el cliente de Supabase importado
  
  const questionHash = generateQuestionHash(question);
  const ttl = ttlSeconds || parseInt(process.env.CACHE_TTL_FAQ_SECONDS || '86400');
  const expiresAt = new Date(Date.now() + ttl * 1000).toISOString();
  
  const { error } = await supabase
    .from('agent_cache')
    .upsert({
      org_id: orgId,
      question_hash: questionHash,
      question,
      answer,
      tokens_saved: estimateTokensSaved(question, answer),
      hit_count: 1,
      expires_at: expiresAt,
    }, {
      onConflict: 'org_id,question_hash',
    });

  if (error) {
    console.error('Error saving cache answer:', error);
  }
}

/**
 * Estima los tokens ahorrados por usar cache
 */
function estimateTokensSaved(question: string, answer: string): number {
  // Estimación aproximada: 1 token ≈ 4 caracteres
  const questionTokens = Math.ceil(question.length / 4);
  const answerTokens = Math.ceil(answer.length / 4);
  const promptTokens = 50; // Tokens del prompt del sistema
  
  return questionTokens + answerTokens + promptTokens;
}

/**
 * Determina si una respuesta debe ser cacheada
 */
export function shouldCache(answer: string): boolean {
  // No cachear respuestas muy cortas o que contengan errores
  if (answer.length < 20) return false;
  if (answer.toLowerCase().includes('error') || answer.toLowerCase().includes('no puedo')) return false;
  if (answer.toLowerCase().includes('no tengo acceso')) return false;
  
  return true;
}

/**
 * Obtiene FAQs de una organización
 */
export async function getOrgFAQs(orgId: string): Promise<FAQ[]> {
  // Usar el cliente de Supabase importado
  
  const { data, error } = await supabase
    .from('org_faqs')
    .select('*')
    .eq('org_id', orgId)
    .order('usage_count', { ascending: false });

  if (error) {
    throw new Error(`Error fetching FAQs: ${error.message}`);
  }

  return data || [];
}

/**
 * Crea o actualiza una FAQ
 */
export async function upsertFAQ(
  orgId: string,
  question: string,
  answer: string,
  keywords: string[] = []
): Promise<FAQ> {
  // Usar el cliente de Supabase importado
  
  // Generar keywords automáticamente si no se proporcionan
  const autoKeywords = keywords.length === 0 ? generateKeywords(question) : keywords;
  
  const { data, error } = await supabase
    .from('org_faqs')
    .upsert({
      org_id: orgId,
      question,
      answer,
      keywords: autoKeywords,
      usage_count: 0,
    }, {
      onConflict: 'org_id,question',
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Error upserting FAQ: ${error.message}`);
  }

  return data;
}

/**
 * Genera keywords automáticamente de una pregunta
 */
function generateKeywords(question: string): string[] {
  const stopWords = new Set([
    'que', 'como', 'donde', 'cuando', 'porque', 'para', 'con', 'sin', 'de', 'la', 'el', 'en', 'un', 'una', 'es', 'son', 'las', 'los', 'del', 'al', 'le', 'se', 'te', 'me', 'nos', 'lo', 'los', 'las', 'su', 'sus', 'mi', 'mis', 'tu', 'tus', 'nuestro', 'nuestra', 'nuestros', 'nuestras'
  ]);

  return question
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 2 && !stopWords.has(word))
    .slice(0, 10); // Máximo 10 keywords
}

/**
 * Elimina FAQs obsoletas
 */
export async function deleteFAQ(faqId: string): Promise<void> {
  // Usar el cliente de Supabase importado
  
  const { error } = await supabase
    .from('org_faqs')
    .delete()
    .eq('id', faqId);

  if (error) {
    throw new Error(`Error deleting FAQ: ${error.message}`);
  }
}

/**
 * Limpia cache expirado
 */
export async function cleanupExpiredCache(): Promise<number> {
  // Usar el cliente de Supabase importado
  
  const { data, error } = await supabase
    .from('agent_cache')
    .delete()
    .lt('expires_at', new Date().toISOString())
    .select('id');

  if (error) {
    throw new Error(`Error cleaning up cache: ${error.message}`);
  }

  return data?.length || 0;
}

/**
 * Obtiene estadísticas de cache para una organización
 */
export async function getCacheStats(orgId: string): Promise<{
  totalEntries: number;
  totalHits: number;
  totalTokensSaved: number;
  averageSimilarity: number;
}> {
  // Usar el cliente de Supabase importado
  
  const { data: cacheEntries, error: cacheError } = await supabase
    .from('agent_cache')
    .select('hit_count, tokens_saved')
    .eq('org_id', orgId)
    .gt('expires_at', new Date().toISOString());

  if (cacheError) {
    throw new Error(`Error fetching cache stats: ${cacheError.message}`);
  }

  const totalEntries = cacheEntries?.length || 0;
  const totalHits = cacheEntries?.reduce((sum, entry) => sum + entry.hit_count, 0) || 0;
  const totalTokensSaved = cacheEntries?.reduce((sum, entry) => sum + entry.tokens_saved, 0) || 0;

  return {
    totalEntries,
    totalHits,
    totalTokensSaved,
    averageSimilarity: 0.85, // Placeholder - se puede calcular si se guarda en cache
  };
}
