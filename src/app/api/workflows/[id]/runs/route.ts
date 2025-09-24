import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

interface Params {
  params: { id: string }
}

export async function GET(_: Request, { params }: Params) {
  try {
    const runs = await prisma.runLog.findMany({
      where: { workflowId: params.id },
      orderBy: { startedAt: 'desc' },
    })
    return NextResponse.json({ runs })
  } catch (error) {
    console.error('GET /api/workflows/[id]/runs error', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
