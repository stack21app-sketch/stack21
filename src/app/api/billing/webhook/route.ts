import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

// Mapeo de price IDs a planes
const PRICE_TO_PLAN_MAP = {
  'price_free': { plan: 'free', voice: false },
  'price_pro': { plan: 'pro', voice: false },
  'price_premium': { plan: 'premium', voice: true },
} as const;

function mapPriceToPlan(priceId: string): { plan: 'free' | 'pro' | 'premium', voice: boolean } {
  const planInfo = PRICE_TO_PLAN_MAP[priceId as keyof typeof PRICE_TO_PLAN_MAP];
  return planInfo || { plan: 'free', voice: false };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature')!;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!
      );
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message);
      return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await handleSubscriptionChange(event.data.object as Stripe.Subscription, supabase);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription, supabase);
        break;

      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object as Stripe.Invoice, supabase);
        break;

      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object as Stripe.Invoice, supabase);
        break;

      case 'customer.subscription.trial_will_end':
        await handleTrialWillEnd(event.data.object as Stripe.Subscription, supabase);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('Webhook error:', error);
    return new NextResponse('Webhook Error', { status: 500 });
  }
}

async function handleSubscriptionChange(subscription: Stripe.Subscription, supabase: any) {
  try {
    const orgId = subscription.metadata?.organization_id;
    if (!orgId) {
      console.error('No organization_id in subscription metadata');
      return;
    }

    const priceId = subscription.items.data[0]?.price?.id;
    if (!priceId) {
      console.error('No price_id in subscription');
      return;
    }

    const { plan, voice } = mapPriceToPlan(priceId);

    // Actualizar la organización
    const { error: updateError } = await supabase
      .from('workspaces')
      .update({
        plan,
        ai_voice_enabled: voice,
        stripe_subscription_id: subscription.id,
        subscription_status: subscription.status,
      })
      .eq('id', orgId);

    if (updateError) {
      console.error('Error updating organization:', updateError);
      return;
    }

    // Si es un upgrade, resetear contadores de uso (opcional)
    if (plan !== 'free') {
      await supabase.rpc('reset_monthly_usage_counters');
    }

    console.log(`Updated organization ${orgId} to plan ${plan}`);

  } catch (error) {
    console.error('Error handling subscription change:', error);
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription, supabase: any) {
  try {
    const orgId = subscription.metadata?.organization_id;
    if (!orgId) {
      console.error('No organization_id in subscription metadata');
      return;
    }

    // Downgrade a plan free
    const { error: updateError } = await supabase
      .from('workspaces')
      .update({
        plan: 'free',
        ai_voice_enabled: false,
        stripe_subscription_id: null,
        subscription_status: 'canceled',
      })
      .eq('id', orgId);

    if (updateError) {
      console.error('Error downgrading organization:', updateError);
      return;
    }

    console.log(`Downgraded organization ${orgId} to free plan`);

  } catch (error) {
    console.error('Error handling subscription deletion:', error);
  }
}

async function handlePaymentSucceeded(invoice: Stripe.Invoice, supabase: any) {
  try {
    const orgId = invoice.subscription_details?.metadata?.organization_id;
    if (!orgId) {
      console.error('No organization_id in invoice metadata');
      return;
    }

    // Actualizar estado de suscripción
    const { error: updateError } = await supabase
      .from('workspaces')
      .update({
        subscription_status: 'active',
      })
      .eq('id', orgId);

    if (updateError) {
      console.error('Error updating subscription status:', updateError);
      return;
    }

    console.log(`Payment succeeded for organization ${orgId}`);

  } catch (error) {
    console.error('Error handling payment success:', error);
  }
}

async function handlePaymentFailed(invoice: Stripe.Invoice, supabase: any) {
  try {
    const orgId = invoice.subscription_details?.metadata?.organization_id;
    if (!orgId) {
      console.error('No organization_id in invoice metadata');
      return;
    }

    // Actualizar estado de suscripción
    const { error: updateError } = await supabase
      .from('workspaces')
      .update({
        subscription_status: 'past_due',
      })
      .eq('id', orgId);

    if (updateError) {
      console.error('Error updating subscription status:', updateError);
      return;
    }

    // Opcional: enviar notificación al usuario
    await supabase
      .from('notifications')
      .insert({
        user_id: invoice.subscription_details?.metadata?.user_id,
        title: 'Pago fallido',
        message: 'Tu suscripción no pudo ser renovada. Por favor, actualiza tu método de pago.',
        type: 'warning',
      });

    console.log(`Payment failed for organization ${orgId}`);

  } catch (error) {
    console.error('Error handling payment failure:', error);
  }
}

async function handleTrialWillEnd(subscription: Stripe.Subscription, supabase: any) {
  try {
    const orgId = subscription.metadata?.organization_id;
    const userId = subscription.metadata?.user_id;
    
    if (!orgId || !userId) {
      console.error('Missing metadata in subscription');
      return;
    }

    // Enviar notificación sobre el fin del trial
    await supabase
      .from('notifications')
      .insert({
        user_id: userId,
        title: 'Tu trial está por terminar',
        message: 'Tu período de prueba termina pronto. Actualiza tu plan para continuar disfrutando de todas las funcionalidades.',
        type: 'info',
      });

    console.log(`Trial will end notification sent for organization ${orgId}`);

  } catch (error) {
    console.error('Error handling trial will end:', error);
  }
}
