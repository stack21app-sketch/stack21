import { NextResponse } from 'next/server'
import { getSystemStatus } from '@/lib/config-validator'

export async function GET() {
  try {
    const status = await getSystemStatus()
    
    return NextResponse.json(status)
  } catch (error) {
    console.error('Error getting system status:', error)
    
    return NextResponse.json({
      config: false,
      database: false,
      ready: false,
      details: {
        configErrors: ['Error interno del servidor'],
        configWarnings: [],
        databaseError: 'Error de conexión'
      }
    })
  }
}
