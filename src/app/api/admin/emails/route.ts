import { NextRequest, NextResponse } from 'next/server'

// Mock data - en producción esto vendría de tu base de datos
let mockEmails = [
  {
    id: '1',
    email: 'usuario1@ejemplo.com',
    source: 'coming_soon',
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    status: 'pending'
  },
  {
    id: '2',
    email: 'usuario2@ejemplo.com',
    source: 'footer',
    timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    status: 'verified'
  },
  {
    id: '3',
    email: 'usuario3@ejemplo.com',
    source: 'coming_soon',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    status: 'subscribed'
  }
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const status = searchParams.get('status')

    let filteredEmails = mockEmails

    // Filtrar por estado si se especifica
    if (status) {
      filteredEmails = mockEmails.filter(email => email.status === status)
    }

    // Paginación
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedEmails = filteredEmails.slice(startIndex, endIndex)

    return NextResponse.json({
      emails: paginatedEmails,
      pagination: {
        page,
        limit,
        total: filteredEmails.length,
        pages: Math.ceil(filteredEmails.length / limit)
      }
    })

  } catch (error) {
    console.error('Error fetching emails:', error)
    return NextResponse.json(
      { error: 'Failed to fetch emails' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const emailId = searchParams.get('id')

    if (!emailId) {
      return NextResponse.json(
        { error: 'Email ID is required' },
        { status: 400 }
      )
    }

    // Eliminar email (mock)
    mockEmails = mockEmails.filter(email => email.id !== emailId)

    return NextResponse.json({
      success: true,
      message: 'Email deleted successfully'
    })

  } catch (error) {
    console.error('Error deleting email:', error)
    return NextResponse.json(
      { error: 'Failed to delete email' },
      { status: 500 }
    )
  }
}
