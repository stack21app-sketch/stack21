import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

interface Params {
  params: { id: string }
}

// Obtener workflow por ID
export async function GET(_: Request, { params }: Params) {
  try {
    const workflow = await prisma.workflow.findUnique({
      where: { id: params.id },
    })
    if (!workflow) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json({ workflow })
  } catch (error) {
    console.error('GET /api/workflows/[id] error', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

// Actualizar workflow
export async function PUT(request: Request, { params }: Params) {
  try {
    const body = await request.json()
    const workflow = await prisma.workflow.update({
      where: { id: params.id },
      data: body,
    })
    return NextResponse.json({ workflow })
  } catch (error) {
    console.error('PUT /api/workflows/[id] error', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

// Eliminar workflow
export async function DELETE(_: Request, { params }: Params) {
  try {
    await prisma.workflow.delete({ where: { id: params.id } })
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('DELETE /api/workflows/[id] error', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
