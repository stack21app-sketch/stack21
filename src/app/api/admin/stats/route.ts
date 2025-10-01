import { NextRequest, NextResponse } from 'next/server'

// Mock data - en producción esto vendría de tu base de datos
export async function GET(request: NextRequest) {
  try {
    // Simular datos de estadísticas
    const stats = {
      totalUsers: 1247,
      totalEmails: 8934,
      totalRevenue: 45678,
      conversionRate: 3.2,
      growth: {
        users: 12.5,
        emails: 8.3,
        revenue: 20.1
      },
      recentActivity: [
        { type: 'signup', count: 23, period: 'last_24h' },
        { type: 'email_capture', count: 156, period: 'last_24h' },
        { type: 'subscription', count: 8, period: 'last_24h' }
      ]
    }

    return NextResponse.json(stats)

  } catch (error) {
    console.error('Error fetching admin stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    )
  }
}
