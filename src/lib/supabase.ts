import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Tipos para TypeScript
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          name: string | null
          email: string
          emailVerified: string | null
          image: string | null
          createdAt: string
          updatedAt: string
          twoFactorBackupCodes: any | null
          twoFactorEnabled: boolean
          twoFactorSecret: string | null
        }
        Insert: {
          id: string
          name?: string | null
          email: string
          emailVerified?: string | null
          image?: string | null
          createdAt?: string
          updatedAt: string
          twoFactorBackupCodes?: any | null
          twoFactorEnabled?: boolean
          twoFactorSecret?: string | null
        }
        Update: {
          id?: string
          name?: string | null
          email?: string
          emailVerified?: string | null
          image?: string | null
          createdAt?: string
          updatedAt?: string
          twoFactorBackupCodes?: any | null
          twoFactorEnabled?: boolean
          twoFactorSecret?: string | null
        }
      }
      workspaces: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          logo: string | null
          settings: any | null
          createdAt: string
          updatedAt: string
          ownerId: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          logo?: string | null
          settings?: any | null
          createdAt?: string
          updatedAt?: string
          ownerId: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          logo?: string | null
          settings?: any | null
          createdAt?: string
          updatedAt?: string
          ownerId?: string
        }
      }
      workflows: {
        Row: {
          id: string
          name: string
          description: string | null
          status: 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'ARCHIVED'
          config: any | null
          createdAt: string
          updatedAt: string
          workspaceId: string
          createdById: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          status?: 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'ARCHIVED'
          config?: any | null
          createdAt?: string
          updatedAt?: string
          workspaceId: string
          createdById: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          status?: 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'ARCHIVED'
          config?: any | null
          createdAt?: string
          updatedAt?: string
          workspaceId?: string
          createdById?: string
        }
      }
      workflow_runs: {
        Row: {
          id: string
          status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'CANCELLED'
          startedAt: string | null
          completedAt: string | null
          error: string | null
          logs: any | null
          createdAt: string
          workflowId: string
        }
        Insert: {
          id?: string
          status?: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'CANCELLED'
          startedAt?: string | null
          completedAt?: string | null
          error?: string | null
          logs?: any | null
          createdAt?: string
          workflowId: string
        }
        Update: {
          id?: string
          status?: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'CANCELLED'
          startedAt?: string | null
          completedAt?: string | null
          error?: string | null
          logs?: any | null
          createdAt?: string
          workflowId?: string
        }
      }
      notifications: {
        Row: {
          id: string
          type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR' | 'BILLING' | 'SYSTEM'
          title: string
          message: string
          read: boolean
          data: any | null
          createdAt: string
          userId: string
        }
        Insert: {
          id?: string
          type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR' | 'BILLING' | 'SYSTEM'
          title: string
          message: string
          read?: boolean
          data?: any | null
          createdAt?: string
          userId: string
        }
        Update: {
          id?: string
          type?: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR' | 'BILLING' | 'SYSTEM'
          title?: string
          message?: string
          read?: boolean
          data?: any | null
          createdAt?: string
          userId?: string
        }
      }
    }
  }
}

// Funciones helper para Supabase
export const supabaseHelpers = {
  // Obtener usuario actual
  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser()
    return user
  },

  // Obtener workspace del usuario
  async getUserWorkspace(userId: string) {
    const { data, error } = await supabase
      .from('workspaces')
      .select('*')
      .eq('ownerId', userId)
      .single()
    
    if (error) {
      console.error('Error getting workspace:', error)
      return null
    }
    
    return data
  },

  // Crear workspace
  async createWorkspace(workspaceData: Database['public']['Tables']['workspaces']['Insert']) {
    const { data, error } = await supabase
      .from('workspaces')
      .insert(workspaceData)
      .select()
      .single()
    
    if (error) {
      console.error('Error creating workspace:', error)
      return null
    }
    
    return data
  },

  // Obtener workflows
  async getWorkflows(workspaceId: string) {
    const { data, error } = await supabase
      .from('workflows')
      .select('*')
      .eq('workspaceId', workspaceId)
      .order('createdAt', { ascending: false })
    
    if (error) {
      console.error('Error getting workflows:', error)
      return []
    }
    
    return data
  },

  // Crear workflow
  async createWorkflow(workflowData: Database['public']['Tables']['workflows']['Insert']) {
    const { data, error } = await supabase
      .from('workflows')
      .insert(workflowData)
      .select()
      .single()
    
    if (error) {
      console.error('Error creating workflow:', error)
      return null
    }
    
    return data
  },

  // Actualizar workflow
  async updateWorkflow(id: string, updates: Database['public']['Tables']['workflows']['Update']) {
    const { data, error } = await supabase
      .from('workflows')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) {
      console.error('Error updating workflow:', error)
      return null
    }
    
    return data
  },

  // Obtener notificaciones
  async getNotifications(userId: string) {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('userId', userId)
      .order('createdAt', { ascending: false })
      .limit(50)
    
    if (error) {
      console.error('Error getting notifications:', error)
      return []
    }
    
    return data
  },

  // Crear notificación
  async createNotification(notificationData: Database['public']['Tables']['notifications']['Insert']) {
    const { data, error } = await supabase
      .from('notifications')
      .insert(notificationData)
      .select()
      .single()
    
    if (error) {
      console.error('Error creating notification:', error)
      return null
    }
    
    return data
  },

  // Marcar notificación como leída
  async markNotificationAsRead(id: string) {
    const { data, error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', id)
      .select()
      .single()
    
    if (error) {
      console.error('Error marking notification as read:', error)
      return null
    }
    
    return data
  }
}