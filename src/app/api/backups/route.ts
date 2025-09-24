import { NextRequest, NextResponse } from 'next/server';
import { 
  getBackups, 
  createBackup, 
  getBackupStats,
  backupSchema 
} from '@/lib/backup-restore';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    switch (action) {
      case 'stats':
        const stats = await getBackupStats();
        return NextResponse.json(stats);

      default:
        const backups = await getBackups();
        return NextResponse.json(backups);
    }
  } catch (error) {
    console.error('Error fetching backups:', error);
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
    const validatedData = backupSchema.omit({
      id: true,
      createdAt: true,
      status: true
    }).parse(body);

    const backup = await createBackup(validatedData);
    
    return NextResponse.json(backup, { status: 201 });
  } catch (error) {
    console.error('Error creating backup:', error);
    
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
