-- Crear tablas para el SaaS multi-tenant

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT,
  email TEXT UNIQUE NOT NULL,
  email_verified TIMESTAMP,
  image TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de cuentas (para NextAuth)
CREATE TABLE IF NOT EXISTS accounts (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  provider TEXT NOT NULL,
  provider_account_id TEXT NOT NULL,
  refresh_token TEXT,
  access_token TEXT,
  expires_at INTEGER,
  token_type TEXT,
  scope TEXT,
  id_token TEXT,
  session_state TEXT,
  UNIQUE(provider, provider_account_id)
);

-- Tabla de sesiones (para NextAuth)
CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  session_token TEXT UNIQUE NOT NULL,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires TIMESTAMP NOT NULL
);

-- Tabla de tokens de verificación (para NextAuth)
CREATE TABLE IF NOT EXISTS verification_tokens (
  identifier TEXT NOT NULL,
  token TEXT UNIQUE NOT NULL,
  expires TIMESTAMP NOT NULL,
  PRIMARY KEY (identifier, token)
);

-- Tabla de workspaces
CREATE TABLE IF NOT EXISTS workspaces (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  creator_id TEXT NOT NULL REFERENCES users(id),
  stripe_customer_id TEXT UNIQUE
);

-- Tabla de miembros de workspace
CREATE TABLE IF NOT EXISTS workspace_members (
  id TEXT PRIMARY KEY,
  workspace_id TEXT NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'MEMBER',
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(workspace_id, user_id)
);

-- Tabla de proyectos
CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  workspace_id TEXT NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de módulos
CREATE TABLE IF NOT EXISTS modules (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL,
  config JSONB,
  project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de workflows
CREATE TABLE IF NOT EXISTS workflows (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'DRAFT',
  config JSONB NOT NULL,
  module_id TEXT NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de logs de ejecución
CREATE TABLE IF NOT EXISTS run_logs (
  id TEXT PRIMARY KEY,
  status TEXT NOT NULL,
  input JSONB,
  output JSONB,
  error TEXT,
  duration INTEGER,
  workflow_id TEXT NOT NULL REFERENCES workflows(id) ON DELETE CASCADE,
  started_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP
);

-- Habilitar Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspace_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE run_logs ENABLE ROW LEVEL SECURITY;

-- Políticas RLS básicas
CREATE POLICY "Users can view their own data" ON users
  FOR SELECT USING (auth.uid()::text = id);

CREATE POLICY "Users can update their own data" ON users
  FOR UPDATE USING (auth.uid()::text = id);

CREATE POLICY "Users can view workspaces they belong to" ON workspaces
  FOR SELECT USING (
    id IN (
      SELECT workspace_id FROM workspace_members 
      WHERE user_id = auth.uid()::text
    )
  );

CREATE POLICY "Workspace members can manage workspace" ON workspaces
  FOR ALL USING (
    id IN (
      SELECT workspace_id FROM workspace_members 
      WHERE user_id = auth.uid()::text AND role IN ('OWNER', 'ADMIN')
    )
  );

-- Función para crear workspace automáticamente
CREATE OR REPLACE FUNCTION create_user_workspace()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO workspaces (id, name, slug, creator_id)
  VALUES (
    NEW.id || '_workspace',
    COALESCE(NEW.name, 'Mi Workspace'),
    LOWER(COALESCE(NEW.name, 'mi-workspace')),
    NEW.id
  );
  
  INSERT INTO workspace_members (workspace_id, user_id, role)
  VALUES (
    NEW.id || '_workspace',
    NEW.id,
    'OWNER'
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para crear workspace automáticamente
CREATE TRIGGER create_user_workspace_trigger
  AFTER INSERT ON users
  FOR EACH ROW
  EXECUTE FUNCTION create_user_workspace();

-- ===== MARKETPLACE DE MÓDULOS =====

-- Crear tabla de categorías de módulos
CREATE TABLE IF NOT EXISTS module_categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  color TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Crear tabla de módulos del marketplace
CREATE TABLE IF NOT EXISTS marketplace_modules (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  short_description TEXT,
  category_id TEXT REFERENCES module_categories(id),
  developer_id TEXT NOT NULL REFERENCES users(id),
  version TEXT NOT NULL DEFAULT '1.0.0',
  price DECIMAL(10,2) DEFAULT 0.00,
  currency TEXT DEFAULT 'USD',
  is_premium BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  is_approved BOOLEAN DEFAULT false,
  download_count INTEGER DEFAULT 0,
  rating DECIMAL(3,2) DEFAULT 0.00,
  review_count INTEGER DEFAULT 0,
  module_data JSONB NOT NULL,
  screenshots TEXT[],
  tags TEXT[],
  requirements JSONB,
  changelog TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Crear tabla de instalaciones de módulos
CREATE TABLE IF NOT EXISTS module_installations (
  id TEXT PRIMARY KEY,
  module_id TEXT NOT NULL REFERENCES marketplace_modules(id) ON DELETE CASCADE,
  workspace_id TEXT NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  installed_by TEXT NOT NULL REFERENCES users(id),
  version TEXT NOT NULL,
  config JSONB,
  is_active BOOLEAN DEFAULT true,
  installed_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(module_id, workspace_id)
);

-- Crear tabla de compras de módulos
CREATE TABLE IF NOT EXISTS module_purchases (
  id TEXT PRIMARY KEY,
  module_id TEXT NOT NULL REFERENCES marketplace_modules(id),
  buyer_id TEXT NOT NULL REFERENCES users(id),
  workspace_id TEXT NOT NULL REFERENCES workspaces(id),
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT NOT NULL,
  payment_method TEXT,
  stripe_payment_intent_id TEXT,
  status TEXT DEFAULT 'pending',
  purchased_at TIMESTAMP DEFAULT NOW()
);

-- Crear tabla de reviews de módulos
CREATE TABLE IF NOT EXISTS module_reviews (
  id TEXT PRIMARY KEY,
  module_id TEXT NOT NULL REFERENCES marketplace_modules(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES users(id),
  workspace_id TEXT NOT NULL REFERENCES workspaces(id),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  comment TEXT,
  is_verified_purchase BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(module_id, user_id, workspace_id)
);

-- Insertar categorías por defecto
INSERT INTO module_categories (id, name, description, icon, color) VALUES
('cat_auto', 'Automatización', 'Módulos para automatizar procesos de negocio', 'zap', 'blue'),
('cat_integ', 'Integraciones', 'Conectores con servicios externos', 'plug', 'green'),
('cat_analytics', 'Analytics', 'Herramientas de análisis y reportes', 'bar-chart', 'purple'),
('cat_comm', 'Comunicación', 'Email, SMS, notificaciones', 'mail', 'orange'),
('cat_ecommerce', 'E-commerce', 'Funcionalidades para tiendas online', 'shopping-cart', 'pink'),
('cat_crm', 'CRM', 'Gestión de relaciones con clientes', 'users', 'indigo'),
('cat_prod', 'Productividad', 'Herramientas para mejorar eficiencia', 'trending-up', 'teal'),
('cat_sec', 'Seguridad', 'Módulos de seguridad y compliance', 'shield', 'red')
ON CONFLICT (name) DO NOTHING;

-- ===== DASHBOARD INTELIGENTE =====

-- Crear tabla de métricas del workspace
CREATE TABLE IF NOT EXISTS workspace_metrics (
  id TEXT PRIMARY KEY,
  workspace_id TEXT NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  metric_type TEXT NOT NULL, -- 'users', 'revenue', 'conversion', 'engagement', etc.
  metric_name TEXT NOT NULL,
  metric_value DECIMAL(15,4) NOT NULL,
  metric_unit TEXT, -- 'count', 'percentage', 'currency', 'time'
  period_start TIMESTAMP NOT NULL,
  period_end TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Crear tabla de insights generados por IA
CREATE TABLE IF NOT EXISTS ai_insights (
  id TEXT PRIMARY KEY,
  workspace_id TEXT NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  insight_type TEXT NOT NULL, -- 'trend', 'anomaly', 'opportunity', 'risk', 'recommendation'
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  confidence_score DECIMAL(3,2) CHECK (confidence_score >= 0 AND confidence_score <= 1),
  impact_level TEXT CHECK (impact_level IN ('low', 'medium', 'high', 'critical')),
  category TEXT NOT NULL, -- 'performance', 'revenue', 'users', 'engagement', 'security'
  data_points JSONB, -- Datos específicos que respaldan el insight
  suggested_actions JSONB, -- Acciones recomendadas
  is_actionable BOOLEAN DEFAULT true,
  is_dismissed BOOLEAN DEFAULT false,
  is_implemented BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP
);

-- Crear tabla de recomendaciones de acciones
CREATE TABLE IF NOT EXISTS action_recommendations (
  id TEXT PRIMARY KEY,
  insight_id TEXT NOT NULL REFERENCES ai_insights(id) ON DELETE CASCADE,
  workspace_id TEXT NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL, -- 'workflow', 'integration', 'optimization', 'alert', 'report'
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  estimated_impact TEXT, -- 'low', 'medium', 'high'
  estimated_effort TEXT, -- 'low', 'medium', 'high'
  action_data JSONB, -- Configuración específica de la acción
  is_implemented BOOLEAN DEFAULT false,
  implemented_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Crear tabla de alertas inteligentes
CREATE TABLE IF NOT EXISTS smart_alerts (
  id TEXT PRIMARY KEY,
  workspace_id TEXT NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  alert_type TEXT NOT NULL, -- 'threshold', 'anomaly', 'trend', 'prediction'
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  severity TEXT CHECK (severity IN ('info', 'warning', 'error', 'critical')),
  metric_name TEXT NOT NULL,
  current_value DECIMAL(15,4),
  threshold_value DECIMAL(15,4),
  trend_direction TEXT, -- 'up', 'down', 'stable'
  is_active BOOLEAN DEFAULT true,
  is_acknowledged BOOLEAN DEFAULT false,
  acknowledged_by TEXT REFERENCES users(id),
  acknowledged_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Crear tabla de predicciones de IA
CREATE TABLE IF NOT EXISTS ai_predictions (
  id TEXT PRIMARY KEY,
  workspace_id TEXT NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  prediction_type TEXT NOT NULL, -- 'revenue', 'users', 'conversion', 'churn', 'growth'
  predicted_value DECIMAL(15,4) NOT NULL,
  confidence_interval_lower DECIMAL(15,4),
  confidence_interval_upper DECIMAL(15,4),
  prediction_date TIMESTAMP NOT NULL,
  model_version TEXT,
  input_features JSONB, -- Características usadas para la predicción
  created_at TIMESTAMP DEFAULT NOW()
);

-- Crear tabla de benchmarks y comparaciones
CREATE TABLE IF NOT EXISTS benchmark_data (
  id TEXT PRIMARY KEY,
  workspace_id TEXT NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  metric_name TEXT NOT NULL,
  current_value DECIMAL(15,4) NOT NULL,
  industry_average DECIMAL(15,4),
  top_percentile_value DECIMAL(15,4),
  percentile_rank INTEGER CHECK (percentile_rank >= 0 AND percentile_rank <= 100),
  comparison_period TEXT, -- 'daily', 'weekly', 'monthly', 'yearly'
  benchmark_date TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Crear tabla de KPIs personalizados
CREATE TABLE IF NOT EXISTS custom_kpis (
  id TEXT PRIMARY KEY,
  workspace_id TEXT NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  formula TEXT NOT NULL, -- Fórmula para calcular el KPI
  target_value DECIMAL(15,4),
  unit TEXT,
  category TEXT,
  is_active BOOLEAN DEFAULT true,
  created_by TEXT NOT NULL REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Crear tabla de reportes automáticos
CREATE TABLE IF NOT EXISTS automated_reports (
  id TEXT PRIMARY KEY,
  workspace_id TEXT NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  report_name TEXT NOT NULL,
  report_type TEXT NOT NULL, -- 'daily', 'weekly', 'monthly', 'custom'
  schedule_cron TEXT, -- Expresión cron para programación
  recipients TEXT[], -- Emails de destinatarios
  report_config JSONB, -- Configuración del reporte
  is_active BOOLEAN DEFAULT true,
  last_generated TIMESTAMP,
  next_generation TIMESTAMP,
  created_by TEXT NOT NULL REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- ===== SISTEMA DE GAMIFICACIÓN =====

-- Crear tabla de usuarios con puntos y nivel
CREATE TABLE IF NOT EXISTS user_gamification (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  workspace_id TEXT NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  total_points INTEGER DEFAULT 0,
  current_level INTEGER DEFAULT 1,
  experience_points INTEGER DEFAULT 0,
  experience_to_next_level INTEGER DEFAULT 100,
  streak_days INTEGER DEFAULT 0,
  last_activity_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, workspace_id)
);

-- Crear tabla de logros
CREATE TABLE IF NOT EXISTS achievements (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  category TEXT NOT NULL, -- 'usage', 'growth', 'automation', 'collaboration', 'expertise'
  points_reward INTEGER NOT NULL,
  requirements JSONB NOT NULL, -- Condiciones para desbloquear
  is_hidden BOOLEAN DEFAULT false, -- Logros secretos
  rarity TEXT CHECK (rarity IN ('common', 'rare', 'epic', 'legendary')),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Crear tabla de logros desbloqueados por usuario
CREATE TABLE IF NOT EXISTS user_achievements (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  workspace_id TEXT NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  achievement_id TEXT NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, workspace_id, achievement_id)
);

-- Crear tabla de badges
CREATE TABLE IF NOT EXISTS badges (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  color TEXT NOT NULL,
  category TEXT NOT NULL,
  points_reward INTEGER DEFAULT 0,
  requirements JSONB NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Crear tabla de badges ganados por usuario
CREATE TABLE IF NOT EXISTS user_badges (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  workspace_id TEXT NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  badge_id TEXT NOT NULL REFERENCES badges(id) ON DELETE CASCADE,
  earned_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, workspace_id, badge_id)
);

-- Crear tabla de leaderboards
CREATE TABLE IF NOT EXISTS leaderboards (
  id TEXT PRIMARY KEY,
  workspace_id TEXT NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  leaderboard_type TEXT NOT NULL, -- 'points', 'achievements', 'streak', 'custom'
  period TEXT NOT NULL, -- 'daily', 'weekly', 'monthly', 'all_time'
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Crear tabla de posiciones en leaderboards
CREATE TABLE IF NOT EXISTS leaderboard_entries (
  id TEXT PRIMARY KEY,
  leaderboard_id TEXT NOT NULL REFERENCES leaderboards(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  workspace_id TEXT NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  position INTEGER NOT NULL,
  score INTEGER NOT NULL,
  period_start TIMESTAMP NOT NULL,
  period_end TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(leaderboard_id, user_id, period_start, period_end)
);

-- Crear tabla de misiones/quests
CREATE TABLE IF NOT EXISTS quests (
  id TEXT PRIMARY KEY,
  workspace_id TEXT NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  quest_type TEXT NOT NULL, -- 'daily', 'weekly', 'monthly', 'special'
  requirements JSONB NOT NULL,
  rewards JSONB NOT NULL, -- Puntos, badges, etc.
  is_active BOOLEAN DEFAULT true,
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Crear tabla de progreso de misiones
CREATE TABLE IF NOT EXISTS user_quest_progress (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  workspace_id TEXT NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  quest_id TEXT NOT NULL REFERENCES quests(id) ON DELETE CASCADE,
  progress_data JSONB NOT NULL, -- Progreso actual
  is_completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, workspace_id, quest_id)
);

-- Crear tabla de eventos de gamificación
CREATE TABLE IF NOT EXISTS gamification_events (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  workspace_id TEXT NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL, -- 'points_earned', 'achievement_unlocked', 'level_up', 'badge_earned'
  event_data JSONB NOT NULL,
  points_earned INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Crear tabla de recompensas
CREATE TABLE IF NOT EXISTS rewards (
  id TEXT PRIMARY KEY,
  workspace_id TEXT NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  cost_points INTEGER NOT NULL,
  reward_type TEXT NOT NULL, -- 'discount', 'feature_unlock', 'badge', 'title'
  reward_data JSONB NOT NULL, -- Datos específicos de la recompensa
  is_active BOOLEAN DEFAULT true,
  stock_quantity INTEGER, -- Cantidad limitada
  created_at TIMESTAMP DEFAULT NOW()
);

-- Crear tabla de canjes de recompensas
CREATE TABLE IF NOT EXISTS reward_redemptions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  workspace_id TEXT NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  reward_id TEXT NOT NULL REFERENCES rewards(id) ON DELETE CASCADE,
  points_spent INTEGER NOT NULL,
  status TEXT DEFAULT 'pending', -- 'pending', 'approved', 'redeemed', 'expired'
  redeemed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Insertar logros por defecto
INSERT INTO achievements (id, name, description, icon, category, points_reward, requirements, rarity) VALUES
('ach_first_workflow', 'Primer Workflow', 'Crea tu primer workflow automatizado', 'zap', 'automation', 50, '{"workflows_created": 1}', 'common'),
('ach_power_user', 'Usuario Poderoso', 'Crea 10 workflows en un mes', 'crown', 'automation', 200, '{"workflows_created": 10, "timeframe": "month"}', 'rare'),
('ach_team_player', 'Jugador de Equipo', 'Invita 5 miembros a tu workspace', 'users', 'collaboration', 150, '{"members_invited": 5}', 'common'),
('ach_ai_master', 'Maestro de IA', 'Usa la IA 100 veces', 'brain', 'usage', 300, '{"ai_requests": 100}', 'epic'),
('ach_early_adopter', 'Adoptador Temprano', 'Instala 5 módulos del marketplace', 'shopping-cart', 'usage', 100, '{"modules_installed": 5}', 'common'),
('ach_insight_hunter', 'Cazador de Insights', 'Genera 50 insights de IA', 'lightbulb', 'expertise', 250, '{"insights_generated": 50}', 'rare'),
('ach_streak_master', 'Maestro de Racha', 'Mantén una racha de 30 días', 'flame', 'growth', 500, '{"streak_days": 30}', 'legendary'),
('ach_revenue_generator', 'Generador de Ingresos', 'Genera $10,000 en ingresos', 'dollar-sign', 'growth', 1000, '{"revenue_generated": 10000}', 'legendary')
ON CONFLICT (id) DO NOTHING;

-- Insertar badges por defecto
INSERT INTO badges (id, name, description, icon, color, category, points_reward, requirements) VALUES
('badge_newbie', 'Novato', 'Tu primer día en la plataforma', 'star', 'gray', 'milestone', 10, '{"days_active": 1}'),
('badge_automator', 'Automatizador', 'Crea workflows regularmente', 'zap', 'blue', 'automation', 25, '{"workflows_per_week": 3}'),
('badge_collaborator', 'Colaborador', 'Trabaja en equipo efectivamente', 'users', 'green', 'collaboration', 30, '{"team_activities": 20}'),
('badge_innovator', 'Innovador', 'Usa funciones avanzadas de IA', 'lightbulb', 'purple', 'innovation', 50, '{"ai_features_used": 10}'),
('badge_mentor', 'Mentor', 'Ayuda a otros usuarios', 'help-circle', 'orange', 'community', 75, '{"help_provided": 15}'),
('badge_champion', 'Campeón', 'Líder en el leaderboard', 'trophy', 'gold', 'competition', 100, '{"leaderboard_position": 1}')
ON CONFLICT (id) DO NOTHING;
