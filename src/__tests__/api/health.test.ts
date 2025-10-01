// Test directo del handler de /api/health
import { GET as healthGET } from '@/app/api/health/route'

describe('Health API', () => {
  it('debe devolver estado ok con campos básicos', async () => {
    const res = await healthGET()
    // NextResponse tiene método json() asíncrono en dev
    // @ts-ignore
    const data = await res.json()

    expect(data.status).toBe('ok')
    expect(typeof data.timestamp).toBe('string')
    expect(typeof data.uptime).toBe('number')
  })
})
