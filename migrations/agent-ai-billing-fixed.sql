-- Migración para Agente AI con planes, límites y facturación (CORREGIDA)
-- Ejecutar este script en Supabase SQL Editor después del esquema base

-- 1. Crear tipos enum para planes
CREATE TYPE plan_t AS ENUM ('free', 'pro', 'premium');

-- 2. Actualizar tabla de organizaciones/workspaces con planes y configuración AI
ALTER TABLE public.workspaces 
  ADD COLUMN IF NOT EXISTS plan plan_t NOT NULL DEFAULT 'free',
  ADD COLUMN IF NOT EXISTS ai_voice_enabled BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT,
  ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT,
  ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'active';

-- 3. Tabla de contadores de uso del agente por organización (resetea cada mes)
CREATE TABLE IF NOT EXISTS public.usage_counters (
  org_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE,
  year INTEGER NOT NULL,  -- ej. 2025
  month INTEGER NOT NULL, -- 1..12
  chats_used INTEGER DEFAULT 0,
  tokens_in INTEGER DEFAULT 0,
  tokens_out INTEGER DEFAULT 0,
  voice_minutes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (org_id, year, month)
);

-- 4. Logs de acciones del agente (auditoría y debug)
CREATE TABLE IF NOT EXISTS public.agent_action_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id),
  tool TEXT NOT NULL,                 -- get_products, create_checkout_session, etc.
  args_sanitized JSONB,
  tokens_in INTEGER DEFAULT 0,
  tokens_out INTEGER DEFAULT 0,
  duration_ms INTEGER DEFAULT 0,
  model_used TEXT,
  cached BOOLEAN DEFAULT false,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Tabla de FAQs por organización (para cache semántico y hard cache)
CREATE TABLE IF NOT EXISTS public.org_faqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  keywords TEXT[], -- para búsqueda por similitud
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Tabla de cache de respuestas frecuentes
CREATE TABLE IF NOT EXISTS public.agent_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE,
  question_hash TEXT NOT NULL, -- hash de la pregunta para lookup rápido
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  tokens_saved INTEGER DEFAULT 0,
  hit_count INTEGER DEFAULT 0,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Tabla de add-ons y extras de facturación
CREATE TABLE IF NOT EXISTS public.billing_addons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE,
  addon_type TEXT NOT NULL CHECK (addon_type IN ('chats', 'voice_minutes')),
  quantity INTEGER NOT NULL,
  price_per_unit INTEGER NOT NULL, -- en centavos
  stripe_price_id TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'used', 'expired')),
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Índices para mejorar rendimiento
CREATE INDEX IF NOT EXISTS idx_usage_counters_org_ym ON public.usage_counters(org_id, year, month);
CREATE INDEX IF NOT EXISTS idx_agent_logs_org_created ON public.agent_action_logs(org_id, created_at);
CREATE INDEX IF NOT EXISTS idx_agent_logs_tool ON public.agent_action_logs(tool);
CREATE INDEX IF NOT EXISTS idx_org_faqs_org ON public.org_faqs(org_id);
CREATE INDEX IF NOT EXISTS idx_org_faqs_keywords ON public.org_faqs USING GIN(keywords);
CREATE INDEX IF NOT EXISTS idx_agent_cache_org_hash ON public.agent_cache(org_id, question_hash);
CREATE INDEX IF NOT EXISTS idx_agent_cache_expires ON public.agent_cache(expires_at);
CREATE INDEX IF NOT EXISTS idx_billing_addons_org ON public.billing_addons(org_id, status);
CREATE INDEX IF NOT EXISTS idx_workspaces_stripe_customer ON public.workspaces(stripe_customer_id);

-- 9. Triggers para actualizar updated_at (CORREGIDO - sin IF NOT EXISTS)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_usage_counters_updated_at') THEN
        CREATE TRIGGER update_usage_counters_updated_at 
        BEFORE UPDATE ON public.usage_counters
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_org_faqs_updated_at') THEN
        CREATE TRIGGER update_org_faqs_updated_at 
        BEFORE UPDATE ON public.org_faqs
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

-- 10. Función para obtener o crear contador de uso mensual
CREATE OR REPLACE FUNCTION get_or_create_usage_counter(
  p_org_id UUID,
  p_year INTEGER,
  p_month INTEGER
) RETURNS public.usage_counters AS $$
DECLARE
  result public.usage_counters;
BEGIN
  -- Intentar obtener el contador existente
  SELECT * INTO result 
  FROM public.usage_counters 
  WHERE org_id = p_org_id AND year = p_year AND month = p_month;
  
  -- Si no existe, crearlo
  IF NOT FOUND THEN
    INSERT INTO public.usage_counters (org_id, year, month)
    VALUES (p_org_id, p_year, p_month)
    RETURNING * INTO result;
  END IF;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 11. Función para incrementar uso del agente
CREATE OR REPLACE FUNCTION increment_agent_usage(
  p_org_id UUID,
  p_chats INTEGER DEFAULT 0,
  p_tokens_in INTEGER DEFAULT 0,
  p_tokens_out INTEGER DEFAULT 0,
  p_voice_minutes INTEGER DEFAULT 0
) RETURNS VOID AS $$
DECLARE
  current_year INTEGER := EXTRACT(YEAR FROM NOW());
  current_month INTEGER := EXTRACT(MONTH FROM NOW());
  usage_record public.usage_counters;
BEGIN
  -- Obtener o crear el contador del mes actual
  usage_record := get_or_create_usage_counter(p_org_id, current_year, current_month);
  
  -- Actualizar contadores
  UPDATE public.usage_counters 
  SET 
    chats_used = chats_used + p_chats,
    tokens_in = tokens_in + p_tokens_in,
    tokens_out = tokens_out + p_tokens_out,
    voice_minutes = voice_minutes + p_voice_minutes,
    updated_at = NOW()
  WHERE org_id = p_org_id AND year = current_year AND month = current_month;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 12. Función para limpiar cache expirado
CREATE OR REPLACE FUNCTION cleanup_expired_cache() RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM public.agent_cache WHERE expires_at < NOW();
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 13. Función para resetear contadores mensuales (ejecutar el día 1 de cada mes)
CREATE OR REPLACE FUNCTION reset_monthly_usage_counters() RETURNS VOID AS $$
BEGIN
  -- Los contadores se crean automáticamente cuando se necesita
  -- Esta función se puede usar para limpiar datos históricos si es necesario
  DELETE FROM public.agent_cache WHERE expires_at < NOW() - INTERVAL '30 days';
  DELETE FROM public.agent_action_logs WHERE created_at < NOW() - INTERVAL '90 days';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 14. Políticas RLS para las nuevas tablas
ALTER TABLE public.usage_counters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_action_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.org_faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.billing_addons ENABLE ROW LEVEL SECURITY;

-- Políticas para usage_counters
CREATE POLICY "Users can view own org usage" ON public.usage_counters
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.workspaces 
      WHERE id = org_id AND (owner_id = auth.uid() OR auth.uid() = ANY(members))
    )
  );

-- Políticas para agent_action_logs
CREATE POLICY "Users can view own org agent logs" ON public.agent_action_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.workspaces 
      WHERE id = org_id AND (owner_id = auth.uid() OR auth.uid() = ANY(members))
    )
  );

-- Políticas para org_faqs
CREATE POLICY "Users can view own org faqs" ON public.org_faqs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.workspaces 
      WHERE id = org_id AND (owner_id = auth.uid() OR auth.uid() = ANY(members))
    )
  );

CREATE POLICY "Users can manage own org faqs" ON public.org_faqs
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.workspaces 
      WHERE id = org_id AND owner_id = auth.uid()
    )
  );

-- Políticas para agent_cache (solo lectura para usuarios)
CREATE POLICY "Users can view own org cache" ON public.agent_cache
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.workspaces 
      WHERE id = org_id AND (owner_id = auth.uid() OR auth.uid() = ANY(members))
    )
  );

-- Políticas para billing_addons
CREATE POLICY "Users can view own org addons" ON public.billing_addons
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.workspaces 
      WHERE id = org_id AND owner_id = auth.uid()
    )
  );

-- 15. Insertar FAQs de ejemplo para organizaciones
INSERT INTO public.org_faqs (org_id, question, answer, keywords) 
SELECT 
  w.id,
  '¿Cuáles son sus horarios de atención?',
  'Nuestro horario de atención es de lunes a viernes de 9:00 a 18:00 horas.',
  ARRAY['horarios', 'atención', 'contacto', 'horario']
FROM public.workspaces w
WHERE NOT EXISTS (
  SELECT 1 FROM public.org_faqs f WHERE f.org_id = w.id
);

INSERT INTO public.org_faqs (org_id, question, answer, keywords) 
SELECT 
  w.id,
  '¿Cómo puedo hacer un pedido?',
  'Puedes hacer tu pedido directamente desde nuestro catálogo online, seleccionando los productos y completando el proceso de checkout.',
  ARRAY['pedido', 'comprar', 'orden', 'checkout']
FROM public.workspaces w
WHERE NOT EXISTS (
  SELECT 1 FROM public.org_faqs f WHERE f.org_id = w.id AND f.question LIKE '%pedido%'
);

-- 16. Comentarios para documentación
COMMENT ON TABLE public.usage_counters IS 'Contadores de uso del agente AI por organización y mes';
COMMENT ON TABLE public.agent_action_logs IS 'Logs detallados de todas las acciones del agente AI';
COMMENT ON TABLE public.org_faqs IS 'FAQs específicas de cada organización para cache inteligente';
COMMENT ON TABLE public.agent_cache IS 'Cache temporal de respuestas del agente para ahorrar tokens';
COMMENT ON TABLE public.billing_addons IS 'Add-ons y extras de facturación por organización';
