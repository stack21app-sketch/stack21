import { NextRequest, NextResponse } from 'next/server';
import { 
  getWebhooks, 
  createWebhook, 
  getWebhookStats,
  webhookConfigSchema 
} from '@/lib/webhooks';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    switch (action) {
      case 'stats':
        const stats = await getWebhookStats();
        return NextResponse.json(stats);

      default:
        const webhooks = await getWebhooks();
        return NextResponse.json(webhooks);
    }
  } catch (error) {
    console.error('Error fetching webhooks:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validar datos de entrada
    const validatedData = webhookConfigSchema.omit({
      id: true,
      createdAt: true,
      successCount: true,
      failureCount: true
    }).parse(body);

    const webhook = await createWebhook(validatedData);
    
    return NextResponse.json(webhook, { status: 201 });
  } catch (error) {
    console.error('Error creating webhook:', error);
    
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Datos de entrada inválidos', details: error.message },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}