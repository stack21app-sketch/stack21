// Mock de Web API Response
global.Response = class Response {
  constructor(body, init = {}) {
    this.body = body
    this.status = init.status || 200
    this.statusText = init.statusText || 'OK'
    this.headers = new Headers(init.headers)
    this.ok = this.status >= 200 && this.status < 300
  }

  async json() {
    let parsed
    try {
      parsed = typeof this.body === 'string' ? JSON.parse(this.body) : this.body
    } catch {
      parsed = this.body
    }
    return Promise.resolve(parsed)
  }

  async text() {
    return Promise.resolve(this.body)
  }

  static json(data, init = {}) {
    return new Response(JSON.stringify(data), {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        ...init.headers
      }
    })
  }
}

// Mock de Headers
global.Headers = class Headers {
  constructor(init = {}) {
    this.map = new Map()
    if (init) {
      Object.entries(init).forEach(([key, value]) => {
        this.map.set(key.toLowerCase(), value)
      })
    }
  }

  get(name) {
    return this.map.get(name.toLowerCase())
  }

  set(name, value) {
    this.map.set(name.toLowerCase(), value)
  }

  has(name) {
    return this.map.has(name.toLowerCase())
  }

  delete(name) {
    this.map.delete(name.toLowerCase())
  }

  entries() {
    return this.map.entries()
  }

  keys() {
    return this.map.keys()
  }

  values() {
    return this.map.values()
  }
}

// Mock de NextRequest
global.NextRequest = class NextRequest {
  constructor(url, init = {}) {
    this.url = url
    this.headers = new Headers(init.headers || {})
    this.method = init.method || 'GET'
    this._json = init.json
    this._text = init.text
  }

  async json() {
    if (this._json) return Promise.resolve(this._json)
    return Promise.resolve({})
  }

  async text() {
    if (this._text) return Promise.resolve(this._text)
    return Promise.resolve('')
  }
}

// Mock de NextResponse
global.NextResponse = {
  json: (data, init = {}) => new Response(JSON.stringify(data), init),
  status: (code) => ({
    json: (data) => new Response(JSON.stringify(data), { status: code })
  })
}

// Mock de getServerSession
jest.mock('next-auth', () => ({
  getServerSession: jest.fn()
}))

// Mock de next/server
jest.mock('next/server', () => ({
  NextResponse: global.NextResponse,
  NextRequest: global.NextRequest
}))

// Mock de @auth/prisma-adapter usado por src/lib/auth
jest.mock('@auth/prisma-adapter', () => ({
  PrismaAdapter: () => ({}),
}))

// Mock de Prisma Client
jest.mock('@prisma/client', () => {
  const mockPrismaClient = {
    userConsent: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    privacySettings: {
      findUnique: jest.fn(),
      upsert: jest.fn(),
      delete: jest.fn(),
    },
    dataDeletionRequest: {
      findFirst: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    dataExportJob: {
      create: jest.fn(),
      findMany: jest.fn(),
    },
    user: {
      findUnique: jest.fn(),
    },
    $transaction: jest.fn((cb) => cb(mockPrismaClient)),
  }
  return {
    PrismaClient: jest.fn(() => mockPrismaClient),
  }
})

// Helper para parsear la respuesta de Next.js API
global.parseResponse = async (response) => {
  if (!response) {
    return { status: 500, data: { error: 'No response' }, headers: {} }
  }

  const headers = response.headers ? Object.fromEntries(response.headers.entries()) : {}
  const contentType = headers['content-type']

  let data = null
  try {
    if (contentType && contentType.includes('application/json')) {
      data = await response.json()
    } else if (contentType && contentType.includes('text/plain')) {
      data = await response.text()
    } else {
      data = await response.text() // Fallback
    }
  } catch (error) {
    data = { error: 'Failed to parse response' }
  }

  return {
    status: response.status || 500,
    data: data,
    headers: headers,
  }
}
