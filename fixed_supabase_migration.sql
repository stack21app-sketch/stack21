-- SQL corregido para Supabase
-- Eliminar tablas existentes si existen
DROP SCHEMA IF EXISTS public CASCADE;
CREATE SCHEMA public;

-- Dar permisos
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;

-- Crear tipos ENUM
CREATE TYPE "WorkspaceRole" AS ENUM ('OWNER', 'ADMIN', 'MEMBER', 'VIEWER');
CREATE TYPE "ModuleType" AS ENUM ('AI_CHAT', 'DATA_PROCESSOR', 'API_INTEGRATION', 'WORKFLOW_TRIGGER', 'CUSTOM');
CREATE TYPE "WorkflowStatus" AS ENUM ('DRAFT', 'ACTIVE', 'PAUSED', 'ARCHIVED');
CREATE TYPE "TriggerType" AS ENUM ('WEBHOOK', 'SCHEDULE', 'MANUAL', 'EMAIL', 'FORM_SUBMIT', 'API_CALL', 'FILE_UPLOAD', 'DATABASE_CHANGE');
CREATE TYPE "RunStatus" AS ENUM ('PENDING', 'RUNNING', 'COMPLETED', 'FAILED', 'CANCELLED');
CREATE TYPE "NotificationType" AS ENUM ('INFO', 'SUCCESS', 'WARNING', 'ERROR', 'BILLING', 'SYSTEM');
CREATE TYPE "BillingStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'CANCELLED', 'PAST_DUE', 'UNPAID', 'TRIALING');
CREATE TYPE "WaitlistTier" AS ENUM ('BASIC', 'PREMIUM', 'VIP', 'ENTERPRISE');
CREATE TYPE "DeletionStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED');
CREATE TYPE "ExportStatus" AS ENUM ('PROCESSING', 'COMPLETED', 'FAILED');

-- Crear tablas
CREATE TABLE public.users (
    id text NOT NULL,
    name text,
    email text NOT NULL,
    "emailVerified" timestamp(3) without time zone,
    image text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "twoFactorBackupCodes" jsonb,
    "twoFactorEnabled" boolean DEFAULT false NOT NULL,
    "twoFactorSecret" text
);

CREATE TABLE public.accounts (
    id text NOT NULL,
    "userId" text NOT NULL,
    type text NOT NULL,
    provider text NOT NULL,
    "providerAccountId" text NOT NULL,
    refresh_token text,
    access_token text,
    expires_at integer,
    token_type text,
    scope text,
    id_token text,
    session_state text
);

CREATE TABLE public.sessions (
    id text NOT NULL,
    "sessionToken" text NOT NULL,
    "userId" text NOT NULL,
    expires timestamp(3) without time zone NOT NULL
);

CREATE TABLE public.verification_tokens (
    identifier text NOT NULL,
    token text NOT NULL,
    expires timestamp(3) without time zone NOT NULL
);

CREATE TABLE public.workspaces (
    id text NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    description text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "creatorId" text NOT NULL,
    "stripeCustomerId" text
);

CREATE TABLE public.workspace_members (
    id text NOT NULL,
    "workspaceId" text NOT NULL,
    "userId" text NOT NULL,
    role "WorkspaceRole" DEFAULT 'MEMBER' NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE public.projects (
    id text NOT NULL,
    name text NOT NULL,
    description text,
    "workspaceId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);

CREATE TABLE public.modules (
    id text NOT NULL,
    name text NOT NULL,
    description text,
    type "ModuleType" NOT NULL,
    config jsonb,
    "projectId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);

CREATE TABLE public.workflows (
    id text NOT NULL,
    name text NOT NULL,
    description text,
    status "WorkflowStatus" DEFAULT 'DRAFT' NOT NULL,
    "isActive" boolean DEFAULT false NOT NULL,
    "triggerType" "TriggerType" NOT NULL,
    "triggerConfig" jsonb,
    nodes jsonb NOT NULL,
    connections jsonb NOT NULL,
    variables jsonb,
    tags text[] DEFAULT ARRAY[]::text[],
    industry text,
    template boolean DEFAULT false NOT NULL,
    public boolean DEFAULT false NOT NULL,
    downloads integer DEFAULT 0 NOT NULL,
    rating double precision,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "userId" text NOT NULL,
    "workspaceId" text NOT NULL,
    category text,
    featured boolean DEFAULT false NOT NULL,
    price double precision
);

CREATE TABLE public.workflow_reviews (
    id text NOT NULL,
    rating integer NOT NULL,
    comment text,
    "userId" text NOT NULL,
    "workflowId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE public.run_logs (
    id text NOT NULL,
    status "RunStatus" NOT NULL,
    input jsonb,
    output jsonb,
    error text,
    duration integer,
    "workflowId" text NOT NULL,
    "startedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "completedAt" timestamp(3) without time zone
);

CREATE TABLE public.api_keys (
    id text NOT NULL,
    name text NOT NULL,
    key text NOT NULL,
    "userId" text NOT NULL,
    "workspaceId" text,
    permissions jsonb,
    "lastUsed" timestamp(3) without time zone,
    "expiresAt" timestamp(3) without time zone,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);

CREATE TABLE public.notifications (
    id text NOT NULL,
    title text NOT NULL,
    message text NOT NULL,
    type "NotificationType" NOT NULL,
    "userId" text NOT NULL,
    "workspaceId" text,
    "isRead" boolean DEFAULT false NOT NULL,
    data jsonb,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "readAt" timestamp(3) without time zone
);

CREATE TABLE public.billing (
    id text NOT NULL,
    "userId" text NOT NULL,
    "workspaceId" text,
    "stripeCustomerId" text,
    "stripeSubscriptionId" text,
    plan text DEFAULT 'free' NOT NULL,
    status "BillingStatus" DEFAULT 'ACTIVE' NOT NULL,
    "currentPeriodStart" timestamp(3) without time zone,
    "currentPeriodEnd" timestamp(3) without time zone,
    "cancelAtPeriodEnd" boolean DEFAULT false NOT NULL,
    "trialEndsAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);

CREATE TABLE public.analytics (
    id text NOT NULL,
    "userId" text NOT NULL,
    "workspaceId" text,
    event text NOT NULL,
    data jsonb,
    "timestamp" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "ipAddress" text,
    "userAgent" text
);

CREATE TABLE public.user_settings (
    id text NOT NULL,
    "userId" text NOT NULL,
    preferences jsonb,
    theme text DEFAULT 'dark' NOT NULL,
    language text DEFAULT 'es' NOT NULL,
    timezone text DEFAULT 'UTC' NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);

CREATE TABLE public.waitlist_users (
    id text NOT NULL,
    email text NOT NULL,
    name text,
    company text,
    role text,
    interests text[],
    source text,
    "referredBy" text,
    tier "WaitlistTier" DEFAULT 'BASIC' NOT NULL,
    "isVerified" boolean DEFAULT false NOT NULL,
    "verificationToken" text,
    "subscribedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);

-- Tablas de conformidad legal
CREATE TABLE public.user_consents (
    id text NOT NULL,
    "userId" text NOT NULL,
    preferences jsonb NOT NULL,
    "ipAddress" text,
    "userAgent" text,
    version text DEFAULT '1.0' NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);

CREATE TABLE public.privacy_settings (
    id text NOT NULL,
    "userId" text NOT NULL,
    "dataProcessing" jsonb NOT NULL,
    communications jsonb NOT NULL,
    "dataSharing" jsonb NOT NULL,
    retention jsonb NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);

CREATE TABLE public.data_deletion_requests (
    id text NOT NULL,
    "userId" text NOT NULL,
    status "DeletionStatus" DEFAULT 'PENDING' NOT NULL,
    reason text,
    "dataCategories" text[],
    "retentionExceptions" text[],
    "requestedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "processedAt" timestamp(3) without time zone
);

CREATE TABLE public.data_export_jobs (
    id text NOT NULL,
    "userId" text NOT NULL,
    format text NOT NULL,
    "includeTechnical" boolean DEFAULT false NOT NULL,
    status "ExportStatus" DEFAULT 'PROCESSING' NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "estimatedCompletion" timestamp(3) without time zone,
    "completedAt" timestamp(3) without time zone
);

-- Añadir claves primarias
ALTER TABLE ONLY public.users ADD CONSTRAINT users_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.accounts ADD CONSTRAINT accounts_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.sessions ADD CONSTRAINT sessions_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.verification_tokens ADD CONSTRAINT verification_tokens_pkey PRIMARY KEY (identifier, token);
ALTER TABLE ONLY public.workspaces ADD CONSTRAINT workspaces_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.workspace_members ADD CONSTRAINT workspace_members_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.projects ADD CONSTRAINT projects_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.modules ADD CONSTRAINT modules_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.workflows ADD CONSTRAINT workflows_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.workflow_reviews ADD CONSTRAINT workflow_reviews_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.run_logs ADD CONSTRAINT run_logs_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.api_keys ADD CONSTRAINT api_keys_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.notifications ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.billing ADD CONSTRAINT billing_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.analytics ADD CONSTRAINT analytics_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.user_settings ADD CONSTRAINT user_settings_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.waitlist_users ADD CONSTRAINT waitlist_users_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.user_consents ADD CONSTRAINT user_consents_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.privacy_settings ADD CONSTRAINT privacy_settings_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.data_deletion_requests ADD CONSTRAINT data_deletion_requests_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.data_export_jobs ADD CONSTRAINT data_export_jobs_pkey PRIMARY KEY (id);

-- Añadir índices únicos
CREATE UNIQUE INDEX users_email_key ON public.users USING btree (email);
CREATE UNIQUE INDEX "accounts_provider_providerAccountId_key" ON public.accounts USING btree (provider, "providerAccountId");
CREATE UNIQUE INDEX "sessions_sessionToken_key" ON public.sessions USING btree ("sessionToken");
CREATE UNIQUE INDEX "verification_tokens_token_key" ON public.verification_tokens USING btree (token);
CREATE UNIQUE INDEX workspaces_slug_key ON public.workspaces USING btree (slug);
CREATE UNIQUE INDEX "workspace_members_workspaceId_userId_key" ON public.workspace_members USING btree ("workspaceId", "userId");
CREATE UNIQUE INDEX api_keys_key_key ON public.api_keys USING btree (key);
CREATE UNIQUE INDEX "billing_stripeCustomerId_key" ON public.billing USING btree ("stripeCustomerId");
CREATE UNIQUE INDEX "billing_stripeSubscriptionId_key" ON public.billing USING btree ("stripeSubscriptionId");
CREATE UNIQUE INDEX "user_settings_userId_key" ON public.user_settings USING btree ("userId");
CREATE UNIQUE INDEX waitlist_users_email_key ON public.waitlist_users USING btree (email);
CREATE UNIQUE INDEX "waitlist_users_verificationToken_key" ON public.waitlist_users USING btree ("verificationToken");
CREATE UNIQUE INDEX "user_consents_userId_key" ON public.user_consents USING btree ("userId");
CREATE UNIQUE INDEX "privacy_settings_userId_key" ON public.privacy_settings USING btree ("userId");
CREATE UNIQUE INDEX "workflow_reviews_userId_workflowId_key" ON public.workflow_reviews USING btree ("userId", "workflowId");

-- Añadir claves foráneas
ALTER TABLE ONLY public.accounts ADD CONSTRAINT "accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.sessions ADD CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.workspaces ADD CONSTRAINT "workspaces_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE ONLY public.workspace_members ADD CONSTRAINT "workspace_members_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.workspace_members ADD CONSTRAINT "workspace_members_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES public.workspaces(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.projects ADD CONSTRAINT "projects_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES public.workspaces(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.modules ADD CONSTRAINT "modules_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES public.projects(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.workflows ADD CONSTRAINT "workflows_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.workflows ADD CONSTRAINT "workflows_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES public.workspaces(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.workflow_reviews ADD CONSTRAINT "workflow_reviews_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.workflow_reviews ADD CONSTRAINT "workflow_reviews_workflowId_fkey" FOREIGN KEY ("workflowId") REFERENCES public.workflows(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.run_logs ADD CONSTRAINT "run_logs_workflowId_fkey" FOREIGN KEY ("workflowId") REFERENCES public.workflows(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.api_keys ADD CONSTRAINT "api_keys_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.api_keys ADD CONSTRAINT "api_keys_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES public.workspaces(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.notifications ADD CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.notifications ADD CONSTRAINT "notifications_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES public.workspaces(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.billing ADD CONSTRAINT "billing_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.billing ADD CONSTRAINT "billing_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES public.workspaces(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.analytics ADD CONSTRAINT "analytics_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.analytics ADD CONSTRAINT "analytics_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES public.workspaces(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.user_settings ADD CONSTRAINT "user_settings_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.user_consents ADD CONSTRAINT "user_consents_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.privacy_settings ADD CONSTRAINT "privacy_settings_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.data_deletion_requests ADD CONSTRAINT "data_deletion_requests_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.data_export_jobs ADD CONSTRAINT "data_export_jobs_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;

-- Insertar datos de ejemplo
INSERT INTO public.users (id, name, email, "createdAt", "updatedAt") VALUES 
('cmfwjvf2o0000yiztw69ulhff', 'Administrador', 'admin@stack21.local', '2025-09-23 12:47:21.36', '2025-09-23 12:47:21.36');

INSERT INTO public.workspaces (id, name, slug, description, "createdAt", "updatedAt", "creatorId") VALUES 
('cmfwjvf2s0002yizt2lbp0sw9', 'Default Workspace', 'default', 'Workspace inicial', '2025-09-23 12:47:21.364', '2025-09-23 12:47:21.364', 'cmfwjvf2o0000yiztw69ulhff');

INSERT INTO public.workspace_members (id, "workspaceId", "userId", role, "createdAt") VALUES 
('cmfwjvf2x0004yiztz5n7x20b', 'cmfwjvf2s0002yizt2lbp0sw9', 'cmfwjvf2o0000yiztw69ulhff', 'OWNER', '2025-09-23 12:47:21.369');

INSERT INTO public.waitlist_users (id, email, name, company, interests, source, "referredBy", tier, "isVerified", "verificationToken", "subscribedAt", "createdAt", "updatedAt") VALUES 
('cmfmdt5800000jo2vzixs3gh3', 'test@example.com', 'Test User', 'Test Company', '{}', 'prelaunch-page', 'VIP-12345678', 'VIP', false, 'f8lpq3abchv4pni45dyxwx', '2025-09-16 09:59:55.825', '2025-09-16 09:59:55.825', '2025-09-16 09:59:55.825'),
('cmfmdvj5d0001jo2vcg0mwsut', 'admin@stack21.com', 'Admin User', 'Stack21 Inc', '{}', 'prelaunch-page', 'ADMIN-2024', 'BASIC', false, 'f2hrs7r04cw9g3bwui68r4m', '2025-09-16 10:01:47.185', '2025-09-16 10:01:47.185', '2025-09-16 10:01:47.185'),
('cmfmdy0050002jo2vu9ylyipf', 'demo@stack21.com', 'Demo User', 'Demo Company', '{}', 'prelaunch-page', 'DEMO-2024', 'BASIC', false, 'fqbcwqz1ul2b3an27to09ts', '2025-09-16 10:03:42.342', '2025-09-16 10:03:42.342', '2025-09-16 10:03:42.342'),
('cmfmesi0r0000n3e55o391nxz', 'nuevo@example.com', 'Usuario Nuevo', 'Empresa Test', '{}', 'prelaunch-page', NULL, 'BASIC', false, 'fqczg9ueknmozpfy8i7h8', '2025-09-16 10:27:25.371', '2025-09-16 10:27:25.371', '2025-09-16 10:27:25.371');
