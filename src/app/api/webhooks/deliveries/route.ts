import { NextRequest, NextResponse } from 'next/server';
import { 
  getDeliveries, 
  createDelivery,
  retryDelivery,
  webhookDeliverySchema 
} from '@/lib/webhooks';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const webhookId = searchParams.get('webhookId');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    
    const deliveries = await getDeliveries(webhookId || undefined);
    
    // Paginación
    const paginatedDeliveries = deliveries.slice(offset, offset + limit);
    
    return NextResponse.json({
      deliveries: paginatedDeliveries,
      total: deliveries.length,
      limit,
      offset
    });
  } catch (error) {
    console.error('Error fetching deliveries:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, deliveryId } = body;
    
    switch (action) {
      case 'retry':
        if (!deliveryId) {
          return NextResponse.json(
            { error: 'ID de entrega requerido para reintento' },
            { status: 400 }
          );
        }
        
        const retryResult = await retryDelivery(deliveryId);
        
        if (!retryResult) {
          return NextResponse.json(
            { error: 'Entrega no encontrada' },
            { status: 404 }
          );
        }
        
        return NextResponse.json(retryResult);
        
      default:
        return NextResponse.json(
          { error: 'Acción no válida' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Error executing delivery action:', error);
    
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
