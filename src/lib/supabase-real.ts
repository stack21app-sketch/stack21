// Configuración real de Supabase para Stack21
import { createClient } from '@supabase/supabase-js'

// Configuración de Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Tipos para la base de datos
export interface EmailLead {
  id?: string
  email: string
  source: string
  created_at?: string
  ip_address?: string
  user_agent?: string
  status: 'pending' | 'verified' | 'subscribed'
}

export interface User {
  id: string
  email: string
  name?: string
  avatar_url?: string
  created_at?: string
  updated_at?: string
  subscription_status: 'free' | 'pro' | 'enterprise'
}

export interface Workflow {
  id: string
  name: string
  description?: string
  user_id: string
  definition: any
  is_active: boolean
  created_at?: string
  updated_at?: string
}

// Funciones para manejar emails
export async function insertEmailLead(emailData: Omit<EmailLead, 'id' | 'created_at'>) {
  try {
    const { data, error } = await supabase
      .from('email_leads')
      .insert([emailData])
      .select()

    if (error) throw error

    return { success: true, data: data?.[0] }
  } catch (error) {
    console.error('Error inserting email lead:', error)
    return { success: false, error: error.message }
  }
}

export async function getEmailLeads() {
  try {
    const { data, error } = await supabase
      .from('email_leads')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

    return { success: true, data }
  } catch (error) {
    console.error('Error getting email leads:', error)
    return { success: false, error: error.message }
  }
}

export async function getEmailLeadCount() {
  try {
    const { count, error } = await supabase
      .from('email_leads')
      .select('*', { count: 'exact', head: true })

    if (error) throw error

    return { success: true, count: count || 0 }
  } catch (error) {
    console.error('Error getting email lead count:', error)
    return { success: false, error: error.message }
  }
}

// Funciones para manejar usuarios
export async function createUser(userData: Omit<User, 'id' | 'created_at' | 'updated_at'>) {
  try {
    const { data, error } = await supabase
      .from('users')
      .insert([userData])
      .select()

    if (error) throw error

    return { success: true, data: data?.[0] }
  } catch (error) {
    console.error('Error creating user:', error)
    return { success: false, error: error.message }
  }
}

export async function getUserById(id: string) {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error

    return { success: true, data }
  } catch (error) {
    console.error('Error getting user:', error)
    return { success: false, error: error.message }
  }
}

// Funciones para manejar workflows
export async function createWorkflow(workflowData: Omit<Workflow, 'id' | 'created_at' | 'updated_at'>) {
  try {
    const { data, error } = await supabase
      .from('workflows')
      .insert([workflowData])
      .select()

    if (error) throw error

    return { success: true, data: data?.[0] }
  } catch (error) {
    console.error('Error creating workflow:', error)
    return { success: false, error: error.message }
  }
}

export async function getWorkflowsByUserId(userId: string) {
  try {
    const { data, error } = await supabase
      .from('workflows')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error

    return { success: true, data }
  } catch (error) {
    console.error('Error getting workflows:', error)
    return { success: false, error: error.message }
  }
}

// Función para verificar conexión
export async function testSupabaseConnection() {
  try {
    const { data, error } = await supabase
      .from('email_leads')
      .select('count')
      .limit(1)

    if (error) throw error

    return { success: true, message: 'Conexión exitosa a Supabase' }
  } catch (error) {
    console.error('Error testing Supabase connection:', error)
    return { success: false, error: error.message }
  }
}
