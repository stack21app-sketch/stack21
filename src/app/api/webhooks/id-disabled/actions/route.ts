import { NextRequest, NextResponse } from 'next/server';
import { 
  testWebhook,
  triggerWebhook 
} from '@/lib/webhooks';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { action, event, data } = body;
    
    switch (action) {
      case 'test':
        const testResult = await testWebhook(params.id);
        return NextResponse.json(testResult);
        
      case 'trigger':
        if (!event) {
          return NextResponse.json(
            { error: 'Evento requerido para trigger' },
            { status: 400 }
          );
        }
        
        const triggerResult = await triggerWebhook(params.id, event, data || {});
        return NextResponse.json(triggerResult);
        
      default:
        return NextResponse.json(
          { error: 'Acción no válida' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Error executing webhook action:', error);
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
