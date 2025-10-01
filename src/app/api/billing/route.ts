import { NextRequest, NextResponse } from 'next/server'
import { paymentEngine, createSampleSubscription } from '@/lib/payment-engine'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const userId = searchParams.get('userId');

    if (type === 'plans') {
      const plans = paymentEngine.getAllPlans();
      return NextResponse.json({ plans });
    } else if (type === 'subscription' && userId) {
      const subscription = paymentEngine.getActiveSubscription(userId);
      return NextResponse.json({ subscription });
    } else if (type === 'usage' && userId) {
      const usage = paymentEngine.getUsage(userId);
      return NextResponse.json({ usage });
    } else if (type === 'invoices' && userId) {
      const invoices = paymentEngine.getUserInvoices(userId);
      return NextResponse.json({ invoices });
    } else if (type === 'stats') {
      const stats = paymentEngine.getBillingStats();
      return NextResponse.json({ stats });
    }

    // Por defecto, retornar planes disponibles
    const plans = paymentEngine.getAllPlans();
    return NextResponse.json({ plans });
  } catch (error) {
    console.error('Error in billing API:', error);
    return NextResponse.json({ error: 'Failed to fetch billing data' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, ...data } = body;

    if (type === 'subscribe') {
      const { userId, planId, paymentMethodId, trialDays } = data;
      const subscription = await paymentEngine.createSubscription(
        userId,
        planId,
        paymentMethodId,
        trialDays
      );
      return NextResponse.json({ subscription }, { status: 201 });
    } else if (type === 'update-subscription') {
      const { subscriptionId, newPlanId } = data;
      const subscription = await paymentEngine.updateSubscription(subscriptionId, newPlanId);
      return NextResponse.json({ subscription });
    } else if (type === 'cancel-subscription') {
      const { subscriptionId, atPeriodEnd } = data;
      const success = await paymentEngine.cancelSubscription(subscriptionId, atPeriodEnd);
      return NextResponse.json({ success });
    } else if (type === 'record-usage') {
      const { userId, resource, amount } = data;
      paymentEngine.recordUsage(userId, resource, amount);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
  } catch (error) {
    console.error('Error in billing POST:', error);
    return NextResponse.json({ error: 'Failed to process billing request' }, { status: 500 });
  }
}