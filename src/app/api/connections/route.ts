import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// VERSIÓN SIMPLIFICADA - SIN AUTH EN DEV, SIN CIFRADO

function getConnectionsFilePath() {
  return path.join(process.cwd(), 'src', 'data', 'connections.json');
}

function readConnections(): any[] {
  const filePath = getConnectionsFilePath();
  if (!fs.existsSync(filePath)) {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(filePath, '[]');
    return [];
  }
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return [];
  }
}

function writeConnections(connections: any[]) {
  const filePath = getConnectionsFilePath();
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(connections, null, 2));
}

// GET - Listar conexiones
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const appSlug = searchParams.get('appSlug');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    const all = readConnections();
    const filtered = appSlug ? all.filter(c => c.appSlug === appSlug) : all;
    const total = filtered.length;
    const start = (page - 1) * limit;
    const items = filtered.slice(start, start + limit);

    return NextResponse.json({
      connections: items,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) }
    });
  } catch (error) {
    console.error('Error GET /api/connections:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

// POST - Crear conexión
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, appSlug, authType, credentials } = body;

    if (!name || !appSlug || !authType) {
      return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 });
    }

    const all = readConnections();
    const newConnection = {
      id: `conn_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      userId: 'dev-user',
      name,
      appSlug,
      authType,
      credentials: credentials || {},
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    all.push(newConnection);
    writeConnections(all);

    console.log('✅ Conexión creada:', newConnection.id);
    return NextResponse.json(newConnection);
  } catch (error) {
    console.error('Error POST /api/connections:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

// DELETE - Eliminar conexión
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Falta id' }, { status: 400 });
    }

    let all = readConnections();
    const before = all.length;
    all = all.filter(c => c.id !== id);

    if (all.length === before) {
      return NextResponse.json({ error: 'Conexión no encontrada' }, { status: 404 });
    }

    writeConnections(all);
    console.log('🗑️ Conexión eliminada:', id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Error DELETE /api/connections:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
