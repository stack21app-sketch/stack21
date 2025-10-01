/**
 * Tests de integración para los endpoints del agente AI
 * 
 * Estos tests requieren:
 * - Base de datos de test configurada
 * - Variables de entorno de test
 * - Mock de OpenAI API
 */

import { NextRequest } from 'next/server';

// Mock de OpenAI
jest.mock('openai', () => {
  return {
    __esModule: true,
    default: jest.fn().mockImplementation(() => ({
      chat: {
        completions: {
          create: jest.fn().mockResolvedValue({
            choices: [{
              message: {
                content: 'Esta es una respuesta de prueba del agente AI.'
              }
            }],
            usage: {
              prompt_tokens: 50,
              completion_tokens: 25
            }
          })
        }
      }
    }))
  };
});

// Mock de Supabase
const mockSupabase = {
  from: jest.fn(() => ({
    select: jest.fn(() => ({
      eq: jest.fn(() => ({
        single: jest.fn(() => ({
          data: {
            id: 'test-org-id',
            plan: 'pro',
            ai_voice_enabled: false,
            name: 'Test Organization'
          },
          error: null
        }))
      }))
    })),
    insert: jest.fn(() => ({
      data: { id: 'test-log-id' },
      error: null
    }))
  }))
};

jest.mock('@/lib/supabase/server', () => ({
  createClient: jest.fn(() => mockSupabase)
}));

// Mock de las funciones de uso
jest.mock('@/lib/usage', () => ({
  getCurrentUsage: jest.fn().mockResolvedValue({
    chats_used: 100,
    tokens_in: 5000,
    tokens_out: 2500,
    voice_minutes: 0,
    year: 2025,
    month: 1
  }),
  incrementUsage: jest.fn().mockResolvedValue(undefined)
}));

// Mock de cache
jest.mock('@/lib/faq-cache', () => ({
  findCachedAnswer: jest.fn().mockResolvedValue(null),
  saveCacheAnswer: jest.fn().mockResolvedValue(undefined),
  shouldCache: jest.fn().mockReturnValue(true)
}));

describe('Agent API Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/agent/public', () => {
    it('should handle valid request successfully', async () => {
      const { POST } = await import('@/app/api/agent/public/route');
      
      const request = new NextRequest('http://localhost:3000/api/agent/public', {
        method: 'POST',
        body: JSON.stringify({
          handle: 'test-org',
          message: '¿Cuáles son sus horarios de atención?'
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.answer).toBe('Esta es una respuesta de prueba del agente AI.');
      expect(data.cached).toBe(false);
      expect(data.tokens_in).toBe(50);
      expect(data.tokens_out).toBe(25);
    });

    it('should return 400 for missing required fields', async () => {
      const { POST } = await import('@/app/api/agent/public/route');
      
      const request = new NextRequest('http://localhost:3000/api/agent/public', {
        method: 'POST',
        body: JSON.stringify({
          message: '¿Cuáles son sus horarios?'
          // handle missing
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain('Handle y mensaje son requeridos');
    });

    it('should return 404 for non-existent organization', async () => {
      // Mock para organización no encontrada
      (mockSupabase.from as jest.Mock).mockReturnValue({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            single: jest.fn(() => ({
              data: null,
              error: { message: 'Organization not found' }
            }))
          }))
        }))
      });

      const { POST } = await import('@/app/api/agent/public/route');
      
      const request = new NextRequest('http://localhost:3000/api/agent/public', {
        method: 'POST',
        body: JSON.stringify({
          handle: 'non-existent-org',
          message: '¿Cuáles son sus horarios?'
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toContain('Organización no encontrada');
    });

    it('should handle cached responses', async () => {
      const { findCachedAnswer } = await import('@/lib/faq-cache');
      (findCachedAnswer as jest.Mock).mockResolvedValue({
        id: 'cache-id',
        org_id: 'test-org-id',
        question_hash: 'hash',
        question: '¿Cuáles son sus horarios?',
        answer: 'Nuestros horarios son de 9:00 a 18:00',
        tokens_saved: 75,
        hit_count: 1,
        expires_at: new Date(Date.now() + 86400000).toISOString(),
        created_at: new Date().toISOString()
      });

      const { POST } = await import('@/app/api/agent/public/route');
      
      const request = new NextRequest('http://localhost:3000/api/agent/public', {
        method: 'POST',
        body: JSON.stringify({
          handle: 'test-org',
          message: '¿Cuáles son sus horarios?'
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.answer).toBe('Nuestros horarios son de 9:00 a 18:00');
      expect(data.cached).toBe(true);
      expect(data.tokens_saved).toBe(75);
    });
  });

  describe('GET /api/agent/public', () => {
    it('should return organization info and usage', async () => {
      const { GET } = await import('@/app/api/agent/public/route');
      
      const request = new NextRequest('http://localhost:3000/api/agent/public?handle=test-org');

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.organization.name).toBe('Test Organization');
      expect(data.organization.plan).toBe('pro');
      expect(data.usage.chats_used).toBe(100);
      expect(data.usage.tokens_in).toBe(5000);
    });

    it('should return 400 for missing handle', async () => {
      const { GET } = await import('@/app/api/agent/public/route');
      
      const request = new NextRequest('http://localhost:3000/api/agent/public');

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain('Handle es requerido');
    });
  });

  describe('POST /api/usage/increment', () => {
    it('should increment usage successfully', async () => {
      const { POST } = await import('@/app/api/usage/increment/route');
      
      const request = new NextRequest('http://localhost:3000/api/usage/increment', {
        method: 'POST',
        body: JSON.stringify({
          organizationId: 'test-org-id',
          deltas: {
            chats: 1,
            tokensIn: 50,
            tokensOut: 25
          }
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.organizationId).toBe('test-org-id');
      expect(data.deltas.chats).toBe(1);
      expect(data.deltas.tokensIn).toBe(50);
      expect(data.deltas.tokensOut).toBe(25);
    });

    it('should return 400 for invalid deltas', async () => {
      const { POST } = await import('@/app/api/usage/increment/route');
      
      const request = new NextRequest('http://localhost:3000/api/usage/increment', {
        method: 'POST',
        body: JSON.stringify({
          organizationId: 'test-org-id',
          deltas: {
            chats: 0,
            tokensIn: 0,
            tokensOut: 0
          }
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain('Al menos un delta debe ser mayor que 0');
    });
  });
});
