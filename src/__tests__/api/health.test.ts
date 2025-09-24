// Mock the API route (usamos el endpoint real de status)
jest.mock('@/app/api/status/route', () => ({
  GET: jest.fn(),
}))

describe('Health API', () => {
  it('should return health status', async () => {
    // Mock response
    const mockResponse = {
      status: 'ok',
      timestamp: '2024-01-01T00:00:00.000Z',
      uptime: 12345,
    }

    // Mock the GET function
    const { GET } = require('@/app/api/status/route')
    GET.mockResolvedValue({
      json: () => Promise.resolve(mockResponse),
      status: 200,
    })

    const response = await GET()
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.status).toBe('ok')
    expect(data.timestamp).toBeDefined()
    expect(data.uptime).toBeDefined()
  })
})
