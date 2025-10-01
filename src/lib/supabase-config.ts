import { createClient } from '@supabase/supabase-js';

// Configuración de Supabase con validación
export const supabaseConfig = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL,
  anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
};

// Validar configuración
export const isSupabaseConfigured = () => {
  return !!(supabaseConfig.url && supabaseConfig.anonKey && 
           supabaseConfig.url !== 'your-supabase-url' && 
           supabaseConfig.anonKey !== 'your-supabase-anon-key');
};

// Cliente de Supabase
export const supabase = createClient(
  supabaseConfig.url && supabaseConfig.url !== 'your-supabase-url' 
    ? supabaseConfig.url 
    : 'https://placeholder.supabase.co',
  supabaseConfig.anonKey && supabaseConfig.anonKey !== 'your-supabase-anon-key'
    ? supabaseConfig.anonKey 
    : 'placeholder_anon_key'
);

// Función para verificar conexión
export const testSupabaseConnection = async () => {
  if (!isSupabaseConfigured()) {
    return { success: false, error: 'Supabase no configurado' };
  }

  try {
    const { data, error } = await supabase.from('users').select('count').limit(1);
    if (error) throw error;
    return { success: true, data };
  } catch (error: unknown) {
    const err = error as { message?: string };
    return { success: false, error: err?.message || 'Error de Supabase' };
  }
};
