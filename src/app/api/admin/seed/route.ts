import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
// Evitar que Next.js intente prerenderizar/recopilar datos de esta ruta en build
export const dynamic = 'force-dynamic'
export const revalidate = 0
export const fetchCache = 'force-no-store'
export const preferredRegion = 'iad1'

// Deshabilitar este endpoint por defecto en producción para evitar ejecuciones en build
const ADMIN_SEED_ENABLED = process.env.ADMIN_SEED_ENABLED === 'true'
import { prisma } from '@/lib/prisma'

function isAuthorized(req: NextRequest): boolean {
  const expected = process.env.ADMIN_KEY
  if (!expected) return false
  const keyFromHeader = req.headers.get('x-admin-key')
  const keyFromQuery = new URL(req.url).searchParams.get('key')
  return keyFromHeader === expected || keyFromQuery === expected
}

export async function POST(req: NextRequest) {
  if (!ADMIN_SEED_ENABLED) {
    return NextResponse.json({ success: false, error: 'Disabled in production' }, { status: 404 })
  }
  if (!isAuthorized(req)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { prisma } = await import('@/lib/prisma')
    const body = await req.json().catch(() => ({} as any))
    const adminEmail = body.email || 'admin@stack21.local'
    const adminName = body.name || 'Administrador'

    // Ensure admin user exists
    let user = await prisma.user.findUnique({ where: { email: adminEmail } })
    if (!user) {
      user = await prisma.user.create({ data: { email: adminEmail, name: adminName } })
    }

    // Ensure default workspace exists and membership as OWNER
    const defaultSlug = 'default'
    let workspace = await prisma.workspace.findUnique({ where: { slug: defaultSlug } })
    if (!workspace) {
      workspace = await prisma.workspace.create({
        data: {
          name: 'Default Workspace',
          slug: defaultSlug,
          description: 'Workspace inicial',
          creatorId: user.id,
        },
      })
    }

    // Ensure membership exists
    const existingMember = await prisma.workspaceMember.findFirst({
      where: { userId: user.id, workspaceId: workspace.id },
    })
    if (!existingMember) {
      await prisma.workspaceMember.create({
        data: { userId: user.id, workspaceId: workspace.id, role: 'OWNER' },
      })
    }

    return NextResponse.json({
      success: true,
      user: { id: user.id, email: user.email, name: user.name },
      workspace: { id: workspace.id, slug: workspace.slug, name: workspace.name },
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  if (!ADMIN_SEED_ENABLED) {
    return NextResponse.json({ success: false, error: 'Disabled in production' }, { status: 404 })
  }
  if (!isAuthorized(req)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  // Idempotent check
  const adminEmail = 'admin@stack21.local'
  const { prisma } = await import('@/lib/prisma')
  const user = await prisma.user.findUnique({ where: { email: adminEmail } })
  const workspace = await prisma.workspace.findUnique({ where: { slug: 'default' } })
  return NextResponse.json({
    success: true,
    exists: Boolean(user && workspace),
    user: user ? { id: user.id, email: user.email } : null,
    workspace: workspace ? { id: workspace.id, slug: workspace.slug } : null,
  })
}


