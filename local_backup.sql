--
-- PostgreSQL database dump
--

\restrict cL4VpCc69JwEheAxO3bgLfI3pElktHsk0SweDStk17eOqLM9vG38RXq1Kif38PS

-- Dumped from database version 15.14 (Homebrew)
-- Dumped by pg_dump version 16.10 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: stack21
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO stack21;

--
-- Name: BillingStatus; Type: TYPE; Schema: public; Owner: santivilla
--

CREATE TYPE public."BillingStatus" AS ENUM (
    'ACTIVE',
    'INACTIVE',
    'CANCELLED',
    'PAST_DUE',
    'UNPAID',
    'TRIALING'
);


ALTER TYPE public."BillingStatus" OWNER TO santivilla;

--
-- Name: DeletionStatus; Type: TYPE; Schema: public; Owner: stack21
--

CREATE TYPE public."DeletionStatus" AS ENUM (
    'PENDING',
    'PROCESSING',
    'COMPLETED',
    'FAILED'
);


ALTER TYPE public."DeletionStatus" OWNER TO stack21;

--
-- Name: ExportStatus; Type: TYPE; Schema: public; Owner: stack21
--

CREATE TYPE public."ExportStatus" AS ENUM (
    'PROCESSING',
    'COMPLETED',
    'FAILED'
);


ALTER TYPE public."ExportStatus" OWNER TO stack21;

--
-- Name: ModuleType; Type: TYPE; Schema: public; Owner: santivilla
--

CREATE TYPE public."ModuleType" AS ENUM (
    'AI_CHAT',
    'DATA_PROCESSOR',
    'API_INTEGRATION',
    'WORKFLOW_TRIGGER',
    'CUSTOM'
);


ALTER TYPE public."ModuleType" OWNER TO santivilla;

--
-- Name: NotificationType; Type: TYPE; Schema: public; Owner: santivilla
--

CREATE TYPE public."NotificationType" AS ENUM (
    'INFO',
    'SUCCESS',
    'WARNING',
    'ERROR',
    'BILLING',
    'SYSTEM'
);


ALTER TYPE public."NotificationType" OWNER TO santivilla;

--
-- Name: RunStatus; Type: TYPE; Schema: public; Owner: santivilla
--

CREATE TYPE public."RunStatus" AS ENUM (
    'PENDING',
    'RUNNING',
    'COMPLETED',
    'FAILED',
    'CANCELLED'
);


ALTER TYPE public."RunStatus" OWNER TO santivilla;

--
-- Name: TriggerType; Type: TYPE; Schema: public; Owner: santivilla
--

CREATE TYPE public."TriggerType" AS ENUM (
    'WEBHOOK',
    'SCHEDULE',
    'MANUAL',
    'EMAIL',
    'FORM_SUBMIT',
    'API_CALL',
    'FILE_UPLOAD',
    'DATABASE_CHANGE'
);


ALTER TYPE public."TriggerType" OWNER TO santivilla;

--
-- Name: WaitlistTier; Type: TYPE; Schema: public; Owner: santivilla
--

CREATE TYPE public."WaitlistTier" AS ENUM (
    'BASIC',
    'PREMIUM',
    'VIP',
    'ENTERPRISE'
);


ALTER TYPE public."WaitlistTier" OWNER TO santivilla;

--
-- Name: WorkflowStatus; Type: TYPE; Schema: public; Owner: santivilla
--

CREATE TYPE public."WorkflowStatus" AS ENUM (
    'DRAFT',
    'ACTIVE',
    'PAUSED',
    'ARCHIVED'
);


ALTER TYPE public."WorkflowStatus" OWNER TO santivilla;

--
-- Name: WorkspaceRole; Type: TYPE; Schema: public; Owner: santivilla
--

CREATE TYPE public."WorkspaceRole" AS ENUM (
    'OWNER',
    'ADMIN',
    'MEMBER',
    'VIEWER'
);


ALTER TYPE public."WorkspaceRole" OWNER TO santivilla;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: accounts; Type: TABLE; Schema: public; Owner: stack21
--

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


ALTER TABLE public.accounts OWNER TO stack21;

--
-- Name: analytics; Type: TABLE; Schema: public; Owner: stack21
--

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


ALTER TABLE public.analytics OWNER TO stack21;

--
-- Name: api_keys; Type: TABLE; Schema: public; Owner: stack21
--

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


ALTER TABLE public.api_keys OWNER TO stack21;

--
-- Name: billing; Type: TABLE; Schema: public; Owner: stack21
--

CREATE TABLE public.billing (
    id text NOT NULL,
    "userId" text NOT NULL,
    "workspaceId" text,
    "stripeCustomerId" text,
    "stripeSubscriptionId" text,
    plan text DEFAULT 'free'::text NOT NULL,
    status public."BillingStatus" DEFAULT 'ACTIVE'::public."BillingStatus" NOT NULL,
    "currentPeriodStart" timestamp(3) without time zone,
    "currentPeriodEnd" timestamp(3) without time zone,
    "cancelAtPeriodEnd" boolean DEFAULT false NOT NULL,
    "trialEndsAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.billing OWNER TO stack21;

--
-- Name: data_deletion_requests; Type: TABLE; Schema: public; Owner: stack21
--

CREATE TABLE public.data_deletion_requests (
    id text NOT NULL,
    "userId" text NOT NULL,
    status public."DeletionStatus" DEFAULT 'PENDING'::public."DeletionStatus" NOT NULL,
    reason text,
    "dataCategories" text[],
    "retentionExceptions" text[],
    "requestedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "processedAt" timestamp(3) without time zone
);


ALTER TABLE public.data_deletion_requests OWNER TO stack21;

--
-- Name: data_export_jobs; Type: TABLE; Schema: public; Owner: stack21
--

CREATE TABLE public.data_export_jobs (
    id text NOT NULL,
    "userId" text NOT NULL,
    format text NOT NULL,
    "includeTechnical" boolean DEFAULT false NOT NULL,
    status public."ExportStatus" DEFAULT 'PROCESSING'::public."ExportStatus" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "estimatedCompletion" timestamp(3) without time zone,
    "completedAt" timestamp(3) without time zone
);


ALTER TABLE public.data_export_jobs OWNER TO stack21;

--
-- Name: modules; Type: TABLE; Schema: public; Owner: stack21
--

CREATE TABLE public.modules (
    id text NOT NULL,
    name text NOT NULL,
    description text,
    type public."ModuleType" NOT NULL,
    config jsonb,
    "projectId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.modules OWNER TO stack21;

--
-- Name: notifications; Type: TABLE; Schema: public; Owner: stack21
--

CREATE TABLE public.notifications (
    id text NOT NULL,
    title text NOT NULL,
    message text NOT NULL,
    type public."NotificationType" NOT NULL,
    "userId" text NOT NULL,
    "workspaceId" text,
    "isRead" boolean DEFAULT false NOT NULL,
    data jsonb,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "readAt" timestamp(3) without time zone
);


ALTER TABLE public.notifications OWNER TO stack21;

--
-- Name: privacy_settings; Type: TABLE; Schema: public; Owner: stack21
--

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


ALTER TABLE public.privacy_settings OWNER TO stack21;

--
-- Name: projects; Type: TABLE; Schema: public; Owner: stack21
--

CREATE TABLE public.projects (
    id text NOT NULL,
    name text NOT NULL,
    description text,
    "workspaceId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.projects OWNER TO stack21;

--
-- Name: run_logs; Type: TABLE; Schema: public; Owner: stack21
--

CREATE TABLE public.run_logs (
    id text NOT NULL,
    status public."RunStatus" NOT NULL,
    input jsonb,
    output jsonb,
    error text,
    duration integer,
    "workflowId" text NOT NULL,
    "startedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "completedAt" timestamp(3) without time zone
);


ALTER TABLE public.run_logs OWNER TO stack21;

--
-- Name: sessions; Type: TABLE; Schema: public; Owner: stack21
--

CREATE TABLE public.sessions (
    id text NOT NULL,
    "sessionToken" text NOT NULL,
    "userId" text NOT NULL,
    expires timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.sessions OWNER TO stack21;

--
-- Name: user_consents; Type: TABLE; Schema: public; Owner: stack21
--

CREATE TABLE public.user_consents (
    id text NOT NULL,
    "userId" text NOT NULL,
    preferences jsonb NOT NULL,
    "ipAddress" text,
    "userAgent" text,
    version text DEFAULT '1.0'::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.user_consents OWNER TO stack21;

--
-- Name: user_settings; Type: TABLE; Schema: public; Owner: stack21
--

CREATE TABLE public.user_settings (
    id text NOT NULL,
    "userId" text NOT NULL,
    preferences jsonb,
    theme text DEFAULT 'dark'::text NOT NULL,
    language text DEFAULT 'es'::text NOT NULL,
    timezone text DEFAULT 'UTC'::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.user_settings OWNER TO stack21;

--
-- Name: users; Type: TABLE; Schema: public; Owner: stack21
--

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


ALTER TABLE public.users OWNER TO stack21;

--
-- Name: verification_tokens; Type: TABLE; Schema: public; Owner: stack21
--

CREATE TABLE public.verification_tokens (
    identifier text NOT NULL,
    token text NOT NULL,
    expires timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.verification_tokens OWNER TO stack21;

--
-- Name: waitlist_users; Type: TABLE; Schema: public; Owner: stack21
--

CREATE TABLE public.waitlist_users (
    id text NOT NULL,
    email text NOT NULL,
    name text,
    company text,
    role text,
    interests text[],
    source text,
    "referredBy" text,
    tier public."WaitlistTier" DEFAULT 'BASIC'::public."WaitlistTier" NOT NULL,
    "isVerified" boolean DEFAULT false NOT NULL,
    "verificationToken" text,
    "subscribedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.waitlist_users OWNER TO stack21;

--
-- Name: workflow_reviews; Type: TABLE; Schema: public; Owner: stack21
--

CREATE TABLE public.workflow_reviews (
    id text NOT NULL,
    rating integer NOT NULL,
    comment text,
    "userId" text NOT NULL,
    "workflowId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.workflow_reviews OWNER TO stack21;

--
-- Name: workflows; Type: TABLE; Schema: public; Owner: stack21
--

CREATE TABLE public.workflows (
    id text NOT NULL,
    name text NOT NULL,
    description text,
    status public."WorkflowStatus" DEFAULT 'DRAFT'::public."WorkflowStatus" NOT NULL,
    "isActive" boolean DEFAULT false NOT NULL,
    "triggerType" public."TriggerType" NOT NULL,
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


ALTER TABLE public.workflows OWNER TO stack21;

--
-- Name: workspace_members; Type: TABLE; Schema: public; Owner: stack21
--

CREATE TABLE public.workspace_members (
    id text NOT NULL,
    "workspaceId" text NOT NULL,
    "userId" text NOT NULL,
    role public."WorkspaceRole" DEFAULT 'MEMBER'::public."WorkspaceRole" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.workspace_members OWNER TO stack21;

--
-- Name: workspaces; Type: TABLE; Schema: public; Owner: stack21
--

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


ALTER TABLE public.workspaces OWNER TO stack21;

--
-- Data for Name: accounts; Type: TABLE DATA; Schema: public; Owner: stack21
--

COPY public.accounts (id, "userId", type, provider, "providerAccountId", refresh_token, access_token, expires_at, token_type, scope, id_token, session_state) FROM stdin;
\.


--
-- Data for Name: analytics; Type: TABLE DATA; Schema: public; Owner: stack21
--

COPY public.analytics (id, "userId", "workspaceId", event, data, "timestamp", "ipAddress", "userAgent") FROM stdin;
\.


--
-- Data for Name: api_keys; Type: TABLE DATA; Schema: public; Owner: stack21
--

COPY public.api_keys (id, name, key, "userId", "workspaceId", permissions, "lastUsed", "expiresAt", "isActive", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: billing; Type: TABLE DATA; Schema: public; Owner: stack21
--

COPY public.billing (id, "userId", "workspaceId", "stripeCustomerId", "stripeSubscriptionId", plan, status, "currentPeriodStart", "currentPeriodEnd", "cancelAtPeriodEnd", "trialEndsAt", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: data_deletion_requests; Type: TABLE DATA; Schema: public; Owner: stack21
--

COPY public.data_deletion_requests (id, "userId", status, reason, "dataCategories", "retentionExceptions", "requestedAt", "processedAt") FROM stdin;
\.


--
-- Data for Name: data_export_jobs; Type: TABLE DATA; Schema: public; Owner: stack21
--

COPY public.data_export_jobs (id, "userId", format, "includeTechnical", status, "createdAt", "estimatedCompletion", "completedAt") FROM stdin;
\.


--
-- Data for Name: modules; Type: TABLE DATA; Schema: public; Owner: stack21
--

COPY public.modules (id, name, description, type, config, "projectId", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: stack21
--

COPY public.notifications (id, title, message, type, "userId", "workspaceId", "isRead", data, "createdAt", "readAt") FROM stdin;
\.


--
-- Data for Name: privacy_settings; Type: TABLE DATA; Schema: public; Owner: stack21
--

COPY public.privacy_settings (id, "userId", "dataProcessing", communications, "dataSharing", retention, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: projects; Type: TABLE DATA; Schema: public; Owner: stack21
--

COPY public.projects (id, name, description, "workspaceId", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: run_logs; Type: TABLE DATA; Schema: public; Owner: stack21
--

COPY public.run_logs (id, status, input, output, error, duration, "workflowId", "startedAt", "completedAt") FROM stdin;
\.


--
-- Data for Name: sessions; Type: TABLE DATA; Schema: public; Owner: stack21
--

COPY public.sessions (id, "sessionToken", "userId", expires) FROM stdin;
\.


--
-- Data for Name: user_consents; Type: TABLE DATA; Schema: public; Owner: stack21
--

COPY public.user_consents (id, "userId", preferences, "ipAddress", "userAgent", version, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: user_settings; Type: TABLE DATA; Schema: public; Owner: stack21
--

COPY public.user_settings (id, "userId", preferences, theme, language, timezone, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: stack21
--

COPY public.users (id, name, email, "emailVerified", image, "createdAt", "updatedAt", "twoFactorBackupCodes", "twoFactorEnabled", "twoFactorSecret") FROM stdin;
cmfwjvf2o0000yiztw69ulhff	Administrador	admin@stack21.local	\N	\N	2025-09-23 12:47:21.36	2025-09-23 12:47:21.36	\N	f	\N
\.


--
-- Data for Name: verification_tokens; Type: TABLE DATA; Schema: public; Owner: stack21
--

COPY public.verification_tokens (identifier, token, expires) FROM stdin;
\.


--
-- Data for Name: waitlist_users; Type: TABLE DATA; Schema: public; Owner: stack21
--

COPY public.waitlist_users (id, email, name, company, role, interests, source, "referredBy", tier, "isVerified", "verificationToken", "subscribedAt", "createdAt", "updatedAt") FROM stdin;
cmfmdt5800000jo2vzixs3gh3	test@example.com	Test User	Test Company	\N	{}	prelaunch-page	VIP-12345678	VIP	f	8lpq3abchv4pni45dyxwx	2025-09-16 09:59:55.825	2025-09-16 09:59:55.825	2025-09-16 09:59:55.825
cmfmdvj5d0001jo2vcg0mwsut	admin@stack21.com	Admin User	Stack21 Inc	\N	{}	prelaunch-page	ADMIN-2024	BASIC	f	2hrs7r04cw9g3bwui68r4m	2025-09-16 10:01:47.185	2025-09-16 10:01:47.185	2025-09-16 10:01:47.185
cmfmdy0050002jo2vu9ylyipf	demo@stack21.com	Demo User	Demo Company	\N	{}	prelaunch-page	DEMO-2024	BASIC	f	qbcwqz1ul2b3an27to09ts	2025-09-16 10:03:42.342	2025-09-16 10:03:42.342	2025-09-16 10:03:42.342
cmfmesi0r0000n3e55o391nxz	nuevo@example.com	Usuario Nuevo	Empresa Test	\N	{}	prelaunch-page	\N	BASIC	f	fqczg9ueknmozpfy8i7h8	2025-09-16 10:27:25.371	2025-09-16 10:27:25.371	2025-09-16 10:27:25.371
\.


--
-- Data for Name: workflow_reviews; Type: TABLE DATA; Schema: public; Owner: stack21
--

COPY public.workflow_reviews (id, rating, comment, "userId", "workflowId", "createdAt") FROM stdin;
\.


--
-- Data for Name: workflows; Type: TABLE DATA; Schema: public; Owner: stack21
--

COPY public.workflows (id, name, description, status, "isActive", "triggerType", "triggerConfig", nodes, connections, variables, tags, industry, template, public, downloads, rating, "createdAt", "updatedAt", "userId", "workspaceId", category, featured, price) FROM stdin;
\.


--
-- Data for Name: workspace_members; Type: TABLE DATA; Schema: public; Owner: stack21
--

COPY public.workspace_members (id, "workspaceId", "userId", role, "createdAt") FROM stdin;
cmfwjvf2x0004yiztz5n7x20b	cmfwjvf2s0002yizt2lbp0sw9	cmfwjvf2o0000yiztw69ulhff	OWNER	2025-09-23 12:47:21.369
\.


--
-- Data for Name: workspaces; Type: TABLE DATA; Schema: public; Owner: stack21
--

COPY public.workspaces (id, name, slug, description, "createdAt", "updatedAt", "creatorId", "stripeCustomerId") FROM stdin;
cmfwjvf2s0002yizt2lbp0sw9	Default Workspace	default	Workspace inicial	2025-09-23 12:47:21.364	2025-09-23 12:47:21.364	cmfwjvf2o0000yiztw69ulhff	\N
\.


--
-- Name: accounts accounts_pkey; Type: CONSTRAINT; Schema: public; Owner: stack21
--

ALTER TABLE ONLY public.accounts
    ADD CONSTRAINT accounts_pkey PRIMARY KEY (id);


--
-- Name: analytics analytics_pkey; Type: CONSTRAINT; Schema: public; Owner: stack21
--

ALTER TABLE ONLY public.analytics
    ADD CONSTRAINT analytics_pkey PRIMARY KEY (id);


--
-- Name: api_keys api_keys_pkey; Type: CONSTRAINT; Schema: public; Owner: stack21
--

ALTER TABLE ONLY public.api_keys
    ADD CONSTRAINT api_keys_pkey PRIMARY KEY (id);


--
-- Name: billing billing_pkey; Type: CONSTRAINT; Schema: public; Owner: stack21
--

ALTER TABLE ONLY public.billing
    ADD CONSTRAINT billing_pkey PRIMARY KEY (id);


--
-- Name: data_deletion_requests data_deletion_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: stack21
--

ALTER TABLE ONLY public.data_deletion_requests
    ADD CONSTRAINT data_deletion_requests_pkey PRIMARY KEY (id);


--
-- Name: data_export_jobs data_export_jobs_pkey; Type: CONSTRAINT; Schema: public; Owner: stack21
--

ALTER TABLE ONLY public.data_export_jobs
    ADD CONSTRAINT data_export_jobs_pkey PRIMARY KEY (id);


--
-- Name: modules modules_pkey; Type: CONSTRAINT; Schema: public; Owner: stack21
--

ALTER TABLE ONLY public.modules
    ADD CONSTRAINT modules_pkey PRIMARY KEY (id);


--
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: stack21
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);


--
-- Name: privacy_settings privacy_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: stack21
--

ALTER TABLE ONLY public.privacy_settings
    ADD CONSTRAINT privacy_settings_pkey PRIMARY KEY (id);


--
-- Name: projects projects_pkey; Type: CONSTRAINT; Schema: public; Owner: stack21
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_pkey PRIMARY KEY (id);


--
-- Name: run_logs run_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: stack21
--

ALTER TABLE ONLY public.run_logs
    ADD CONSTRAINT run_logs_pkey PRIMARY KEY (id);


--
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: stack21
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (id);


--
-- Name: user_consents user_consents_pkey; Type: CONSTRAINT; Schema: public; Owner: stack21
--

ALTER TABLE ONLY public.user_consents
    ADD CONSTRAINT user_consents_pkey PRIMARY KEY (id);


--
-- Name: user_settings user_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: stack21
--

ALTER TABLE ONLY public.user_settings
    ADD CONSTRAINT user_settings_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: stack21
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: waitlist_users waitlist_users_pkey; Type: CONSTRAINT; Schema: public; Owner: stack21
--

ALTER TABLE ONLY public.waitlist_users
    ADD CONSTRAINT waitlist_users_pkey PRIMARY KEY (id);


--
-- Name: workflow_reviews workflow_reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: stack21
--

ALTER TABLE ONLY public.workflow_reviews
    ADD CONSTRAINT workflow_reviews_pkey PRIMARY KEY (id);


--
-- Name: workflows workflows_pkey; Type: CONSTRAINT; Schema: public; Owner: stack21
--

ALTER TABLE ONLY public.workflows
    ADD CONSTRAINT workflows_pkey PRIMARY KEY (id);


--
-- Name: workspace_members workspace_members_pkey; Type: CONSTRAINT; Schema: public; Owner: stack21
--

ALTER TABLE ONLY public.workspace_members
    ADD CONSTRAINT workspace_members_pkey PRIMARY KEY (id);


--
-- Name: workspaces workspaces_pkey; Type: CONSTRAINT; Schema: public; Owner: stack21
--

ALTER TABLE ONLY public.workspaces
    ADD CONSTRAINT workspaces_pkey PRIMARY KEY (id);


--
-- Name: accounts_provider_providerAccountId_key; Type: INDEX; Schema: public; Owner: stack21
--

CREATE UNIQUE INDEX "accounts_provider_providerAccountId_key" ON public.accounts USING btree (provider, "providerAccountId");


--
-- Name: api_keys_key_key; Type: INDEX; Schema: public; Owner: stack21
--

CREATE UNIQUE INDEX api_keys_key_key ON public.api_keys USING btree (key);


--
-- Name: billing_stripeCustomerId_key; Type: INDEX; Schema: public; Owner: stack21
--

CREATE UNIQUE INDEX "billing_stripeCustomerId_key" ON public.billing USING btree ("stripeCustomerId");


--
-- Name: billing_stripeSubscriptionId_key; Type: INDEX; Schema: public; Owner: stack21
--

CREATE UNIQUE INDEX "billing_stripeSubscriptionId_key" ON public.billing USING btree ("stripeSubscriptionId");


--
-- Name: data_deletion_requests_userId_status_idx; Type: INDEX; Schema: public; Owner: stack21
--

CREATE INDEX "data_deletion_requests_userId_status_idx" ON public.data_deletion_requests USING btree ("userId", status);


--
-- Name: data_export_jobs_userId_status_idx; Type: INDEX; Schema: public; Owner: stack21
--

CREATE INDEX "data_export_jobs_userId_status_idx" ON public.data_export_jobs USING btree ("userId", status);


--
-- Name: privacy_settings_userId_key; Type: INDEX; Schema: public; Owner: stack21
--

CREATE UNIQUE INDEX "privacy_settings_userId_key" ON public.privacy_settings USING btree ("userId");


--
-- Name: sessions_sessionToken_key; Type: INDEX; Schema: public; Owner: stack21
--

CREATE UNIQUE INDEX "sessions_sessionToken_key" ON public.sessions USING btree ("sessionToken");


--
-- Name: user_consents_userId_key; Type: INDEX; Schema: public; Owner: stack21
--

CREATE UNIQUE INDEX "user_consents_userId_key" ON public.user_consents USING btree ("userId");


--
-- Name: user_settings_userId_key; Type: INDEX; Schema: public; Owner: stack21
--

CREATE UNIQUE INDEX "user_settings_userId_key" ON public.user_settings USING btree ("userId");


--
-- Name: users_email_key; Type: INDEX; Schema: public; Owner: stack21
--

CREATE UNIQUE INDEX users_email_key ON public.users USING btree (email);


--
-- Name: verification_tokens_identifier_token_key; Type: INDEX; Schema: public; Owner: stack21
--

CREATE UNIQUE INDEX verification_tokens_identifier_token_key ON public.verification_tokens USING btree (identifier, token);


--
-- Name: verification_tokens_token_key; Type: INDEX; Schema: public; Owner: stack21
--

CREATE UNIQUE INDEX verification_tokens_token_key ON public.verification_tokens USING btree (token);


--
-- Name: waitlist_users_email_key; Type: INDEX; Schema: public; Owner: stack21
--

CREATE UNIQUE INDEX waitlist_users_email_key ON public.waitlist_users USING btree (email);


--
-- Name: waitlist_users_verificationToken_key; Type: INDEX; Schema: public; Owner: stack21
--

CREATE UNIQUE INDEX "waitlist_users_verificationToken_key" ON public.waitlist_users USING btree ("verificationToken");


--
-- Name: workflow_reviews_userId_workflowId_key; Type: INDEX; Schema: public; Owner: stack21
--

CREATE UNIQUE INDEX "workflow_reviews_userId_workflowId_key" ON public.workflow_reviews USING btree ("userId", "workflowId");


--
-- Name: workspace_members_workspaceId_userId_key; Type: INDEX; Schema: public; Owner: stack21
--

CREATE UNIQUE INDEX "workspace_members_workspaceId_userId_key" ON public.workspace_members USING btree ("workspaceId", "userId");


--
-- Name: workspaces_slug_key; Type: INDEX; Schema: public; Owner: stack21
--

CREATE UNIQUE INDEX workspaces_slug_key ON public.workspaces USING btree (slug);


--
-- Name: workspaces_stripeCustomerId_key; Type: INDEX; Schema: public; Owner: stack21
--

CREATE UNIQUE INDEX "workspaces_stripeCustomerId_key" ON public.workspaces USING btree ("stripeCustomerId");


--
-- Name: accounts accounts_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: stack21
--

ALTER TABLE ONLY public.accounts
    ADD CONSTRAINT "accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: analytics analytics_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: stack21
--

ALTER TABLE ONLY public.analytics
    ADD CONSTRAINT "analytics_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: analytics analytics_workspaceId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: stack21
--

ALTER TABLE ONLY public.analytics
    ADD CONSTRAINT "analytics_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES public.workspaces(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: api_keys api_keys_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: stack21
--

ALTER TABLE ONLY public.api_keys
    ADD CONSTRAINT "api_keys_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: api_keys api_keys_workspaceId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: stack21
--

ALTER TABLE ONLY public.api_keys
    ADD CONSTRAINT "api_keys_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES public.workspaces(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: billing billing_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: stack21
--

ALTER TABLE ONLY public.billing
    ADD CONSTRAINT "billing_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: billing billing_workspaceId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: stack21
--

ALTER TABLE ONLY public.billing
    ADD CONSTRAINT "billing_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES public.workspaces(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: data_deletion_requests data_deletion_requests_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: stack21
--

ALTER TABLE ONLY public.data_deletion_requests
    ADD CONSTRAINT "data_deletion_requests_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: data_export_jobs data_export_jobs_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: stack21
--

ALTER TABLE ONLY public.data_export_jobs
    ADD CONSTRAINT "data_export_jobs_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: modules modules_projectId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: stack21
--

ALTER TABLE ONLY public.modules
    ADD CONSTRAINT "modules_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES public.projects(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: notifications notifications_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: stack21
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: notifications notifications_workspaceId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: stack21
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT "notifications_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES public.workspaces(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: privacy_settings privacy_settings_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: stack21
--

ALTER TABLE ONLY public.privacy_settings
    ADD CONSTRAINT "privacy_settings_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: projects projects_workspaceId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: stack21
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT "projects_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES public.workspaces(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: run_logs run_logs_workflowId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: stack21
--

ALTER TABLE ONLY public.run_logs
    ADD CONSTRAINT "run_logs_workflowId_fkey" FOREIGN KEY ("workflowId") REFERENCES public.workflows(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: sessions sessions_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: stack21
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: user_consents user_consents_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: stack21
--

ALTER TABLE ONLY public.user_consents
    ADD CONSTRAINT "user_consents_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: user_settings user_settings_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: stack21
--

ALTER TABLE ONLY public.user_settings
    ADD CONSTRAINT "user_settings_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: workflow_reviews workflow_reviews_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: stack21
--

ALTER TABLE ONLY public.workflow_reviews
    ADD CONSTRAINT "workflow_reviews_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: workflow_reviews workflow_reviews_workflowId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: stack21
--

ALTER TABLE ONLY public.workflow_reviews
    ADD CONSTRAINT "workflow_reviews_workflowId_fkey" FOREIGN KEY ("workflowId") REFERENCES public.workflows(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: workflows workflows_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: stack21
--

ALTER TABLE ONLY public.workflows
    ADD CONSTRAINT "workflows_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: workflows workflows_workspaceId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: stack21
--

ALTER TABLE ONLY public.workflows
    ADD CONSTRAINT "workflows_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES public.workspaces(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: workspace_members workspace_members_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: stack21
--

ALTER TABLE ONLY public.workspace_members
    ADD CONSTRAINT "workspace_members_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: workspace_members workspace_members_workspaceId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: stack21
--

ALTER TABLE ONLY public.workspace_members
    ADD CONSTRAINT "workspace_members_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES public.workspaces(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: workspaces workspaces_creatorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: stack21
--

ALTER TABLE ONLY public.workspaces
    ADD CONSTRAINT "workspaces_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: santivilla
--

ALTER DEFAULT PRIVILEGES FOR ROLE santivilla IN SCHEMA public GRANT ALL ON SEQUENCES TO stack21;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: santivilla
--

ALTER DEFAULT PRIVILEGES FOR ROLE santivilla IN SCHEMA public GRANT ALL ON TABLES TO stack21;


--
-- PostgreSQL database dump complete
--

\unrestrict cL4VpCc69JwEheAxO3bgLfI3pElktHsk0SweDStk17eOqLM9vG38RXq1Kif38PS

