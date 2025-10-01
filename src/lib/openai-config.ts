// Configuración de OpenAI
export const openaiConfig = {
  apiKey: process.env.OPENAI_API_KEY,
  modelPrimary: process.env.OPENAI_MODEL_PRIMARY || 'gpt-4o-mini',
  modelFallback: process.env.OPENAI_MODEL_FALLBACK || 'gpt-4',
  enabled: !!process.env.OPENAI_API_KEY,
};

// Verificar si OpenAI está configurado
export const isOpenAIConfigured = () => {
  return openaiConfig.enabled && openaiConfig.apiKey !== 'sk-...';
};

// Configuración de límites
export const aiLimits = {
  softcapChatsPro: parseInt(process.env.AGENT_SOFTCAP_CHATS_PRO || '1000'),
  softcapChatsFree: parseInt(process.env.AGENT_SOFTCAP_CHATS_FREE || '20'),
  hardcapTokensDailyFree: parseInt(process.env.AGENT_HARDCAP_TOKENS_DAILY_FREE || '1000'),
  softcapMinutesPremium: parseInt(process.env.AGENT_SOFTCAP_MINUTES_PREMIUM || '200'),
};

// Función para verificar límites
export const checkAILimits = (usage: { chats: number; tokens: number; minutes: number }, plan: 'free' | 'pro' | 'premium') => {
  const limits = {
    free: {
      chats: aiLimits.softcapChatsFree,
      tokens: aiLimits.hardcapTokensDailyFree,
      minutes: 0,
    },
    pro: {
      chats: aiLimits.softcapChatsPro,
      tokens: Infinity,
      minutes: 0,
    },
    premium: {
      chats: Infinity,
      tokens: Infinity,
      minutes: aiLimits.softcapMinutesPremium,
    },
  };

  const userLimits = limits[plan];
  
  return {
    withinLimits: usage.chats <= userLimits.chats && 
                  usage.tokens <= userLimits.tokens && 
                  usage.minutes <= userLimits.minutes,
    remaining: {
      chats: Math.max(0, userLimits.chats - usage.chats),
      tokens: Math.max(0, userLimits.tokens - usage.tokens),
      minutes: Math.max(0, userLimits.minutes - usage.minutes),
    },
  };
};
