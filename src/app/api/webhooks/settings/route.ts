import { NextRequest, NextResponse } from 'next/server';
import { 
  getSettings, 
  updateSettings,
  webhookSettingsSchema 
} from '@/lib/webhooks';

export async function GET() {
  try {
    const settings = await getSettings();
    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error fetching webhook settings:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validar datos de entrada
    const validatedData = webhookSettingsSchema.partial().parse(body);
    
    const settings = await updateSettings(validatedData);
    
    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error updating webhook settings:', error);
    
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
