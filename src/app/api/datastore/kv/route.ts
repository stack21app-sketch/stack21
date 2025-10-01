import { NextRequest, NextResponse } from 'next/server';

// GET /api/datastore/kv - Obtener valor KV
export async function GET(request: NextRequest) {
  return NextResponse.json({ error: 'DataStore no implementado' }, { status: 501 });
}

export async function POST(request: NextRequest) {
  return NextResponse.json({ error: 'DataStore no implementado' }, { status: 501 });
}

export async function PUT(request: NextRequest) {
  return NextResponse.json({ error: 'DataStore no implementado' }, { status: 501 });
}

export async function DELETE(request: NextRequest) {
  return NextResponse.json({ error: 'DataStore no implementado' }, { status: 501 });
}