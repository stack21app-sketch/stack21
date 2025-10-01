import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || '7d'
    const type = searchParams.get('type') || 'overview'

    let startDate: Date
    const endDate = new Date()

    switch (period) {
      case '1d':
        startDate = new Date(endDate.getTime() - 24 * 60 * 60 * 1000)
        break
      case '7d':
        startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      case '30d':
        startDate = new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000)
        break
      case '90d':
        startDate = new Date(endDate.getTime() - 90 * 24 * 60 * 60 * 1000)
        break
      default:
        startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000)
    }

    const analytics = await getAnalyticsData(startDate, endDate, type)

    return NextResponse.json({ analytics })
  } catch (error) {
    console.error('Error in analytics API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

async function getAnalyticsData(startDate: Date, endDate: Date, type: string) {
  const startDateISO = startDate.toISOString()
  const endDateISO = endDate.toISOString()

  switch (type) {
    case 'overview':
      return await getOverviewAnalytics(startDateISO, endDateISO)
    case 'workflows':
      return await getWorkflowAnalytics(startDateISO, endDateISO)
    case 'users':
      return await getUserAnalytics(startDateISO, endDateISO)
    case 'performance':
      return await getPerformanceAnalytics(startDateISO, endDateISO)
    default:
      return await getOverviewAnalytics(startDateISO, endDateISO)
  }
}

async function getOverviewAnalytics(startDate: string, endDate: string) {
  // Obtener estadísticas generales
  const { data: workflows } = await supabase
    .from('workflows')
    .select('id, status, created_at')
    .gte('created_at', startDate)
    .lte('created_at', endDate)

  const { data: users } = await supabase
    .from('users')
    .select('id, created_at')
    .gte('created_at', startDate)
    .lte('created_at', endDate)

  const { data: executions } = await supabase
    .from('workflow_executions')
    .select('id, status, created_at')
    .gte('created_at', startDate)
    .lte('created_at', endDate)

  return {
    totalWorkflows: workflows?.length || 0,
    activeWorkflows: workflows?.filter(w => w.status === 'active').length || 0,
    totalUsers: users?.length || 0,
    totalExecutions: executions?.length || 0,
    successfulExecutions: executions?.filter(e => e.status === 'completed').length || 0,
    failedExecutions: executions?.filter(e => e.status === 'failed').length || 0,
    successRate: executions && executions.length > 0 
      ? ((executions.filter(e => e.status === 'completed').length / executions.length) * 100).toFixed(1)
      : '0'
  }
}

async function getWorkflowAnalytics(startDate: string, endDate: string) {
  const { data: workflows } = await supabase
    .from('workflows')
    .select(`
      id,
      name,
      status,
      created_at,
      workflow_executions(id, status, created_at)
    `)
    .gte('created_at', startDate)
    .lte('created_at', endDate)

  return workflows?.map(workflow => ({
    id: workflow.id,
    name: workflow.name,
    status: workflow.status,
    executions: workflow.workflow_executions?.length || 0,
    successRate: workflow.workflow_executions && workflow.workflow_executions.length > 0
      ? ((workflow.workflow_executions.filter((e: any) => e.status === 'completed').length / workflow.workflow_executions.length) * 100).toFixed(1)
      : '0'
  })) || []
}

async function getUserAnalytics(startDate: string, endDate: string) {
  const { data: users } = await supabase
    .from('users')
    .select(`
      id,
      name,
      email,
      created_at,
      workflows(id, name, status)
    `)
    .gte('created_at', startDate)
    .lte('created_at', endDate)

  return users?.map(user => ({
    id: user.id,
    name: user.name,
    email: user.email,
    workflowsCreated: user.workflows?.length || 0,
    activeWorkflows: user.workflows?.filter((w: any) => w.status === 'active').length || 0
  })) || []
}

async function getPerformanceAnalytics(startDate: string, endDate: string) {
  const { data: executions } = await supabase
    .from('workflow_executions')
    .select('id, status, execution_time, created_at')
    .gte('created_at', startDate)
    .lte('created_at', endDate)

  const avgExecutionTime = executions && executions.length > 0
    ? executions.reduce((sum, exec) => sum + (exec.execution_time || 0), 0) / executions.length
    : 0

  return {
    averageExecutionTime: avgExecutionTime.toFixed(2),
    totalExecutions: executions?.length || 0,
    executionsByStatus: {
      completed: executions?.filter(e => e.status === 'completed').length || 0,
      failed: executions?.filter(e => e.status === 'failed').length || 0,
      running: executions?.filter(e => e.status === 'running').length || 0,
      pending: executions?.filter(e => e.status === 'pending').length || 0
    }
  }
}