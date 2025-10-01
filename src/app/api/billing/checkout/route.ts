import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { stripe, createCheckoutSession } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const token = await getToken({ req: request });
    if (!token || !token.sub) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { priceId, plan } = await request.json();

    if (!priceId || !plan) {
      return NextResponse.json({ error: 'Price ID y plan son requeridos' }, { status: 400 });
    }

    // Obtener o crear customer de Stripe
    let customer;
    const user = await prisma.user.findUnique({
      where: { id: token.sub },
      include: { workspaces: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    if ((user as any).stripeCustomerId) {
      customer = await stripe.customers.retrieve((user as any).stripeCustomerId);
    } else {
      customer = await stripe.customers.create({
        email: user.email,
        name: user.name || user.email,
        metadata: {
          userId: user.id,
          organizationId: user.workspaces?.[0]?.id,
        },
      });

      // Crear o actualizar registro de billing
      await prisma.billing.upsert({
        where: { 
          stripeCustomerId: customer.id 
        },
        update: {
          userId: user.id,
          updatedAt: new Date()
        },
        create: {
          userId: user.id,
          stripeCustomerId: customer.id,
          status: 'ACTIVE'
        }
      });
    }

    // Crear sesión de checkout
    const session = await createCheckoutSession(
      customer.id,
      priceId,
      `${process.env.NEXTAUTH_URL}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
      `${process.env.NEXTAUTH_URL}/billing/cancel`
    );

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error('Error creando checkout session:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}