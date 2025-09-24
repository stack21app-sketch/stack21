import { NextRequest, NextResponse } from 'next/server';
import { 
  getBackupById, 
  updateBackup, 
  deleteBackup,
  executeBackup,
  backupSchema 
} from '@/lib/backup-restore';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const backup = await getBackupById(params.id);
    
    if (!backup) {
      return NextResponse.json(
        { error: 'Backup no encontrado' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(backup);
  } catch (error) {
    console.error('Error fetching backup:', error);
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
    const validatedData = backupSchema.partial().parse(body);
    
    const backup = await updateBackup(params.id, validatedData);
    
    if (!backup) {
      return NextResponse.json(
        { error: 'Backup no encontrado' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(backup);
  } catch (error) {
    console.error('Error updating backup:', error);
    
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
    const success = await deleteBackup(params.id);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Backup no encontrado' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ message: 'Backup eliminado exitosamente' });
  } catch (error) {
    console.error('Error deleting backup:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
