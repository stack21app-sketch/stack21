import { checkLimits, getLimitsInfo } from '@/lib/agent-guard';

// Mock de las funciones de uso
jest.mock('@/lib/usage', () => ({
  getCurrentUsage: jest.fn(),
  getDailyTokenUsage: jest.fn(),
}));

import { getDailyTokenUsage } from '@/lib/usage';

describe('Agent Guard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('checkLimits', () => {
    it('should allow free plan within daily token limit', async () => {
      (getDailyTokenUsage as jest.Mock).mockResolvedValue(500);

      const result = await checkLimits({
        org: {
          id: 'test-org',
          plan: 'free',
          ai_voice_enabled: false,
        },
        usage: {
          chats_used: 10,
          tokens_in: 0,
          tokens_out: 0,
          voice_minutes: 0,
        },
        mode: 'text',
        estimatedTokens: 200,
      });

      expect(result.ok).toBe(true);
      expect(result.reason).toBeUndefined();
    });

    it('should block free plan when exceeding daily token limit', async () => {
      (getDailyTokenUsage as jest.Mock).mockResolvedValue(900);

      const result = await checkLimits({
        org: {
          id: 'test-org',
          plan: 'free',
          ai_voice_enabled: false,
        },
        usage: {
          chats_used: 10,
          tokens_in: 0,
          tokens_out: 0,
          voice_minutes: 0,
        },
        mode: 'text',
        estimatedTokens: 200,
      });

      expect(result.ok).toBe(false);
      expect(result.reason).toContain('Límite diario de tokens alcanzado');
      expect(result.upsell?.plan).toBe('pro');
    });

    it('should warn when approaching soft cap in pro plan', async () => {
      const result = await checkLimits({
        org: {
          id: 'test-org',
          plan: 'pro',
          ai_voice_enabled: false,
        },
        usage: {
          chats_used: 1000, // Exactamente en el soft cap
          tokens_in: 0,
          tokens_out: 0,
          voice_minutes: 0,
        },
        mode: 'text',
      });

      expect(result.ok).toBe(true);
      expect(result.warning).toContain('límite recomendado');
      expect(result.upsell?.plan).toBe('premium');
    });

    it('should block when exceeding hard cap in pro plan', async () => {
      const result = await checkLimits({
        org: {
          id: 'test-org',
          plan: 'pro',
          ai_voice_enabled: false,
        },
        usage: {
          chats_used: 1100, // Excediendo el hard cap (1100)
          tokens_in: 0,
          tokens_out: 0,
          voice_minutes: 0,
        },
        mode: 'text',
      });

      expect(result.ok).toBe(false);
      expect(result.reason).toContain('Límite de chats alcanzado');
      expect(result.upsell?.plan).toBe('premium');
    });

    it('should allow voice in premium plan', async () => {
      const result = await checkLimits({
        org: {
          id: 'test-org',
          plan: 'premium',
          ai_voice_enabled: true,
        },
        usage: {
          chats_used: 1000,
          tokens_in: 0,
          tokens_out: 0,
          voice_minutes: 100,
        },
        mode: 'voice',
      });

      expect(result.ok).toBe(true);
      expect(result.reason).toBeUndefined();
    });

    it('should block voice when not enabled', async () => {
      const result = await checkLimits({
        org: {
          id: 'test-org',
          plan: 'pro',
          ai_voice_enabled: false,
        },
        usage: {
          chats_used: 100,
          tokens_in: 0,
          tokens_out: 0,
          voice_minutes: 0,
        },
        mode: 'voice',
      });

      expect(result.ok).toBe(false);
      expect(result.reason).toContain('función de voz no está disponible');
      expect(result.upsell?.plan).toBe('premium');
    });

    it('should block voice when exceeding limit in premium', async () => {
      const result = await checkLimits({
        org: {
          id: 'test-org',
          plan: 'premium',
          ai_voice_enabled: true,
        },
        usage: {
          chats_used: 1000,
          tokens_in: 0,
          tokens_out: 0,
          voice_minutes: 220, // Excediendo el límite (200 + 10% tolerancia)
        },
        mode: 'voice',
      });

      expect(result.ok).toBe(false);
      expect(result.reason).toContain('Límite de minutos de voz alcanzado');
      expect(result.upsell?.addon?.type).toBe('voice_minutes');
    });
  });

  describe('getLimitsInfo', () => {
    it('should return correct limits for free plan', () => {
      const limits = getLimitsInfo('free');

      expect(limits.chats.soft).toBe(20);
      expect(limits.chats.hard).toBe(20);
      expect(limits.voiceMinutes.soft).toBe(0);
      expect(limits.dailyTokens).toBe(1000);
      expect(limits.features).toContain('20 chats/mes');
    });

    it('should return correct limits for pro plan', () => {
      const limits = getLimitsInfo('pro');

      expect(limits.chats.soft).toBe(1000);
      expect(limits.chats.hard).toBe(1100); // 10% tolerancia
      expect(limits.voiceMinutes.soft).toBe(0);
      expect(limits.dailyTokens).toBe(50000);
      expect(limits.features).toContain('1,000 chats/mes');
    });

    it('should return correct limits for premium plan', () => {
      const limits = getLimitsInfo('premium');

      expect(limits.chats.soft).toBe(5000);
      expect(limits.chats.hard).toBe(5500);
      expect(limits.voiceMinutes.soft).toBe(200);
      expect(limits.dailyTokens).toBe(100000);
      expect(limits.features).toContain('200 min/mes de voz');
    });
  });
});
