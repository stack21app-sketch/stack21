import { NextRequest, NextResponse } from 'next/server'
import { verifyStripeWebhook, handleStripeWebhook } from '@/lib/stripe-webhooks'

export async function POST(request: NextRequest) {
  try {
    // Verify webhook signature
    const event = await verifyStripeWebhook(request)
    
    if (!event) {
      return NextResponse.json(
        { error: 'Invalid webhook signature' },
        { status: 400 }
      )
    }

    // Handle the webhook event
    await handleStripeWebhook(event)

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}

// Handle preflight requests
export async function OPTIONS() {
  return new NextResponse(null, { status: 200 })
}
