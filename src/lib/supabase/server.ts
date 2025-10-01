import { createClient as createSupabaseClient } from '@supabase/supabase-js'

// Exportar createClient para compatibilidad
export const createClient = createSupabaseClient

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Cliente de Supabase para uso en el servidor
export const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Función helper para obtener el cliente de Supabase en el servidor
export function createServerClient() {
  return supabase
}
