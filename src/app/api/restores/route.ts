import { NextRequest, NextResponse } from 'next/server';
import { 
  getRestores, 
  createRestore,
  restoreSchema 
} from '@/lib/backup-restore';

export async function GET() {
  try {
    const restores = await getRestores();
    return NextResponse.json(restores);
  } catch (error) {
    console.error('Error fetching restores:', error);
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
    const validatedData = restoreSchema.omit({
      id: true,
      createdAt: true,
      status: true
    }).parse(body);

    const restore = await createRestore(validatedData);
    
    return NextResponse.json(restore, { status: 201 });
  } catch (error) {
    console.error('Error creating restore:', error);
    
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
