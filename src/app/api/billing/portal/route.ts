import { NextRequest, NextResponse } from 'next/server'
import { createBillingPortalSession } from '@/lib/stripe'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
    
    const { url } = await createBillingPortalSession({
      customerId: session.user.email, // En producción, usar customer ID de Stripe
      returnUrl: `${baseUrl}/dashboard/billing`
    })

    return NextResponse.json({ url })
  } catch (error) {
    console.error('Error creating billing portal session:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
