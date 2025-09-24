import { NextRequest, NextResponse } from 'next/server';
import { 
  getWebhookById, 
  updateWebhook, 
  deleteWebhook,
  testWebhook,
  triggerWebhook,
  webhookConfigSchema 
} from '@/lib/webhooks';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const webhook = await getWebhookById(params.id);
    
    if (!webhook) {
      return NextResponse.json(
        { error: 'Webhook no encontrado' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(webhook);
  } catch (error) {
    console.error('Error fetching webhook:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    
    // Validar datos de entrada
    const validatedData = webhookConfigSchema.partial().parse(body);
    
    const webhook = await updateWebhook(params.id, validatedData);
    
    if (!webhook) {
      return NextResponse.json(
        { error: 'Webhook no encontrado' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(webhook);
  } catch (error) {
    console.error('Error updating webhook:', error);
    
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const success = await deleteWebhook(params.id);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Webhook no encontrado' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ message: 'Webhook eliminado exitosamente' });
  } catch (error) {
    console.error('Error deleting webhook:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
