import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

// Mapeo de price IDs a planes (configurar según tus productos en Stripe)
const PRICE_TO_PLAN_MAP = {
  'price_free': { plan: 'free', voice: false },
  'price_pro': { plan: 'pro', voice: false },
  'price_premium': { plan: 'premium', voice: true },
  // Add-ons
  'price_addon_chats': { plan: 'addon', type: 'chats' },
  'price_addon_voice': { plan: 'addon', type: 'voice_minutes' },
} as const;

export async function POST(request: NextRequest) {
  try {
    const token = await getToken({ req: request });
    if (!token || !token.sub) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const { organizationId, priceId, successUrl, cancelUrl } = await request.json();

    if (!organizationId || !priceId) {
      return NextResponse.json(
        { error: 'organizationId y priceId son requeridos' },
        { status: 400 }
      );
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Verificar que el usuario es el propietario de la organización
    const { data: org, error: orgError } = await supabase
      .from('workspaces')
      .select('id, name, stripe_customer_id, owner_id')
      .eq('id', organizationId)
      .eq('owner_id', token.sub)
      .single();

    if (orgError || !org) {
      return NextResponse.json(
        { error: 'Organización no encontrada o sin permisos' },
        { status: 404 }
      );
    }

    let customerId = org.stripe_customer_id;

    // Crear cliente en Stripe si no existe
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: 'demo@stack21.com',
        name: 'Usuario Demo',
        metadata: {
          organization_id: organizationId,
          user_id: token.sub,
        },
      });

      customerId = customer.id;

      // Actualizar la organización con el customer ID
      await supabase
        .from('workspaces')
        .update({ stripe_customer_id: customerId })
        .eq('id', organizationId);
    }

    // Verificar si es un add-on o una suscripción
    const planInfo = PRICE_TO_PLAN_MAP[priceId as keyof typeof PRICE_TO_PLAN_MAP];
    
    if (planInfo?.plan === 'addon') {
      // Crear invoice item para add-on
      await stripe.invoiceItems.create({
        customer: customerId,
        price: priceId,
        metadata: {
          organization_id: organizationId,
          addon_type: planInfo.type,
        },
      });

      // Crear invoice y enviar
      const invoice = await stripe.invoices.create({
        customer: customerId,
        auto_advance: true,
        collection_method: 'charge_automatically',
      });

      await stripe.invoices.finalizeInvoice(invoice.id);

      return NextResponse.json({
        type: 'addon',
        invoice_url: invoice.hosted_invoice_url,
        status: 'success',
      });
    }

    // Crear checkout session para suscripción
    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: successUrl || `${process.env.NEXT_PUBLIC_APP_URL}/settings/billing?success=true`,
      cancel_url: cancelUrl || `${process.env.NEXT_PUBLIC_APP_URL}/settings/billing?canceled=true`,
      metadata: {
        organization_id: organizationId,
        user_id: token.sub,
      },
      subscription_data: {
        metadata: {
          organization_id: organizationId,
          user_id: token.sub,
        },
      },
    };

    const checkoutSession = await stripe.checkout.sessions.create(sessionParams);

    return NextResponse.json({
      sessionId: checkoutSession.id,
      url: checkoutSession.url,
    });

  } catch (error) {
    console.error('Error creating subscription:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
