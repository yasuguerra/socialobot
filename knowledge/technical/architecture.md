# Socialobot — Platform Architecture & Repository Structure

---

## 1. Repository Structure

```
socialobot/
├── README.md
├── docker-compose.yml
├── cloudbuild.yaml            # Cloud Build CI/CD pipeline
├── .gitignore
│
├── platform-api/              # Node.js + TypeScript backend (Cloud Run)
│   ├── package.json
│   ├── tsconfig.json
│   ├── Dockerfile
│   ├── env.example
│   └── src/
│       ├── index.ts               # Entry point, graceful shutdown
│       ├── app.ts                 # Express factory, Socket.IO, Redis adapter
│       ├── config/
│       │   ├── env.ts             # Zod-validated environment variables
│       │   └── constants.ts       # Tiers, industry templates, enums
│       ├── types/index.ts         # All TypeScript interfaces
│       ├── db/
│       │   ├── schema.sql         # Full database schema
│       │   ├── pool.ts            # pg pool + helpers (TCP + Cloud SQL Unix socket)
│       │   └── repositories/
│       │       ├── tenantRepo.ts
│       │       ├── userRepo.ts
│       │       ├── productRepo.ts
│       │       ├── sessionRepo.ts
│       │       ├── messageRepo.ts
│       │       ├── orderRepo.ts
│       │       ├── customerRepo.ts
│       │       ├── customerThreadRepo.ts
│       │       ├── leadRepo.ts
│       │       ├── knowledgeRepo.ts
│       │       ├── embeddingRepo.ts      # pgvector semantic search
│       │       ├── agentConfigRepo.ts
│       │       ├── analyticsRepo.ts
│       │       ├── internalAnalyticsRepo.ts
│       │       ├── calendarConfigRepo.ts
│       │       ├── calendarResourceRepo.ts
│       │       ├── quoteRepo.ts
│       │       ├── shippingRepo.ts
│       │       ├── paymentConfigRepo.ts
│       │       ├── whatsappConnectionRepo.ts
│       │       ├── sequenceRepo.ts
│       │       ├── templateRepo.ts
│       │       ├── competitorRepo.ts
│       │       ├── kbGapRepo.ts
│       │       └── usageRepo.ts
│       ├── middleware/
│       │   ├── logger.ts          # Winston + requestLogger
│       │   ├── errorHandler.ts    # AppError + global handler
│       │   ├── tenantResolver.ts  # X-Tenant-Slug → req.tenant
│       │   ├── requireBookingProfile.ts # Booking capability check guard
│       │   └── appCheck.ts        # Firebase App Check — anti-abuse on POST /api/chat
│       ├── agent/
│       │   ├── llm/
│       │   │   ├── llmProvider.ts         # LLMProvider interface
│       │   │   ├── vertexAiProvider.ts    # Vertex AI — Gemini 3.5 Pro
│       │   │   ├── googleAiProvider.ts    # Google AI Studio (dev/fallback)
│       │   │   └── mockLlmProvider.ts     # Deterministic mock for tests
│       │   ├── tools/
│       │   │   ├── searchProductsTool.ts
│       │   │   ├── searchKnowledgeTool.ts
│       │   │   ├── semanticSearchTool.ts  # pgvector cosine search
│       │   │   ├── createOrderTool.ts     # customer_type-aware pricing
│       │   │   ├── createPaymentLinkTool.ts
│       │   │   ├── lookupOrderTool.ts
│       │   │   ├── manageCartTool.ts      # customer_type-aware pricing
│       │   │   ├── generateQuoteTool.ts
│       │   │   ├── sendProformaTool.ts
│       │   │   ├── calculateShippingTool.ts
│       │   │   ├── checkAvailabilityTool.ts
│       │   │   ├── compareProductsTool.ts
│       │   │   ├── getCustomerHistoryTool.ts
│       │   │   ├── sendProductImageTool.ts
│       │   │   ├── requestHandoffTool.ts
│       │   │   └── helpTools.ts
│       │   ├── systemPrompt.ts    # Dynamic prompt builder (per tenant + profile)
│       │   └── agentController.ts # Main AI loop (max 6 tool rounds)
│       ├── api/routes/
│       │   ├── auth.ts            # Login, register, verify email, reset password
│       │   ├── tenants.ts         # Tenant CRUD (admin)
│       │   ├── agentConfig.ts     # Agent + widget settings
│       │   ├── products.ts        # Catalog CRUD + CSV bulk import
│       │   ├── orders.ts          # Order management + state transitions
│       │   ├── customers.ts       # B2B customer CRM
│       │   ├── leads.ts           # CRM pipeline
│       │   ├── quotes.ts          # Quote management
│       │   ├── shipping.ts        # Shipping zones + rates
│       │   ├── knowledge.ts       # Knowledge base import/crawl
│       │   ├── calendar.ts        # Google Calendar OAuth2 + bookings
│       │   ├── analytics.ts       # Funnel + KPI endpoints
│       │   ├── reports.ts         # Weekly reports + Excel export
│       │   ├── conversations.ts   # Live conversation view (human takeover)
│       │   ├── sequences.ts       # Outbound follow-up sequences
│       │   ├── templates.ts       # Meta message templates
│       │   ├── competitors.ts     # Competitive intelligence
│       │   ├── billing.ts         # Stripe subscription management
│       │   ├── paymentConfig.ts   # Per-tenant payment gateway config
│       │   ├── publicPayment.ts   # Public payment confirmation page
│       │   ├── catalog.ts         # Public product catalog (/catalog/:slug)
│       │   ├── team.ts            # Team member management
│       │   ├── whatsapp.ts        # WhatsApp Embedded Signup + status
│       │   ├── helpChat.ts        # Internal help channel
│       │   ├── internal.ts        # Internal scheduler endpoints (Cloud Scheduler)
│       │   ├── chat.ts            # Widget chat
│       │   └── webhooks.ts        # Stripe + Meta/Twilio webhooks
│       ├── services/
│       │   ├── authService.ts
│       │   ├── voiceService.ts        # STT (Speech v2/Chirp 2) + TTS (Chirp 3 HD)
│       │   ├── embeddingService.ts    # Vertex AI text-embedding-005
│       │   ├── embeddingPipeline.ts   # Orchestrates chunk → embed → store
│       │   ├── chunkingService.ts     # Text chunking (500 words, 75 overlap)
│       │   ├── emailService.ts        # Nodemailer SMTP
│       │   ├── orderNotificationService.ts  # Order status → WhatsApp + email
│       │   ├── bookingNotificationService.ts # Booking events → WhatsApp + email
│       │   ├── googleCalendarService.ts  # Calendar API integration
│       │   ├── metaWhatsAppService.ts    # Meta Cloud API messaging
│       │   ├── twilioService.ts          # Twilio WhatsApp fallback
│       │   ├── stripeService.ts          # Platform Stripe billing
│       │   ├── paymentGatewayService.ts  # Multi-gateway abstraction
│       │   ├── proformaService.ts        # Proforma PDF generation (PDFKit)
│       │   ├── pdfService.ts             # PDF text extraction
│       │   ├── docAiService.ts           # Cloud Document AI
│       │   ├── bigqueryService.ts        # BigQuery streaming analytics (dual-write, fire-and-forget)
│       │   ├── scraperService.ts         # Single-URL content scrape
│       │   ├── crawlerService.ts         # BFS website crawler
│       │   ├── storageService.ts         # Cloud Storage (GCS)
│       │   ├── encryptionService.ts      # AES-256-GCM credential encryption
│       │   ├── subscriptionService.ts    # Stripe subscription lifecycle
│       │   ├── numberPricingService.ts   # Twilio number provisioning pricing
│       │   ├── numberPurchaseService.ts  # Twilio number purchase flow
│       │   ├── twilioProvisioningService.ts
│       │   ├── agentEvalService.ts       # Agent QA/evaluation harness
│       │   ├── leadIntelligenceService.ts # AI lead profile generation & scoring
│       │   ├── groundedSearchService.ts  # Grounded search validation service
│       │   ├── vertexSearchService.ts    # Vertex AI search & grounding wrapper
│       │   ├── multitargetNotificationService.ts # Advanced notifications dispatcher
│       │   └── wompiService.ts           # Wompi payment gateway (LATAM)
│       └── workers/
│           ├── followUpWorker.ts      # Outbound follow-up sequence executor
│           ├── triggerDetectorWorker.ts # Auto-trigger sequence detector (every 5 min)
│           ├── tokenRefreshWorker.ts  # Google OAuth token refresh (every 6h)
│           └── weeklyReportWorker.ts  # Weekly report email (Monday 9am UTC)
│
├── platform-dashboard/    # React + Vite admin UI
│   ├── package.json
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── index.html
│   ├── Dockerfile
│   ├── nginx.conf
│   └── src/
│       ├── main.tsx
│       ├── App.tsx               # Router + ProtectedRoute
│       ├── context/AuthContext.tsx
│       ├── services/api.ts       # Axios + all API calls
│       ├── components/Layout.tsx # Sidebar nav
│       └── pages/
│           ├── Login.tsx / ForgotPassword.tsx / ResetPassword.tsx / VerifyEmail.tsx
│           ├── Onboarding.tsx    # 2-step signup
│           ├── Dashboard.tsx     # Stats + quick actions
│           ├── Products.tsx      # Catalog + CSV upload
│           ├── AgentConfig.tsx   # Agent + widget settings
│           ├── Orders.tsx        # Order table + filter
│           ├── Customers.tsx     # B2B CRM customer list
│           ├── CRM.tsx / ClientPipeline.tsx  # Leads pipeline
│           ├── Conversations.tsx # Live conversations + human takeover
│           ├── Quotes.tsx        # Quote management
│           ├── Shipping.tsx      # Shipping zones + rates
│           ├── KnowledgeBase.tsx / KnowledgeHub.tsx
│           ├── Analytics.tsx     # Funnel + KPI charts
│           ├── Competitors.tsx   # Competitive intelligence
│           ├── Catalog.tsx       # Public catalog preview
│           ├── Fleet.tsx         # Calendar resources (booking profile)
│           ├── Settings.tsx      # Embed code + billing + integrations
│           ├── HelpCenter.tsx    # In-app help
│           ├── LiveTest.tsx      # Agent test console
│           └── InternalDashboard.tsx  # Super-admin
│
├── platform-widget/       # Embeddable chat widget (IIFE bundle)
│   ├── package.json
│   ├── vite.config.ts     # lib mode → IIFE
│   ├── src/
│   │   ├── embed.tsx      # Bootstrap: read data-tenant, mount into Shadow DOM
│   │   └── Widget.tsx     # Chat UI (inline styles, zero host-page deps)
│   └── demo.html
```

---

## 2. Domain Architecture & Deployment Guide

We will use a **subdomain-per-service** pattern. This is the industry standard for SaaS platforms. It gives us clean separation, independent scaling, and independent SSL certificates.

```
┌──────────────────────────────────────────────────────────────────┐
│                        socialobot.com                              │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐   │
│  │  socialobot.com│  │app.socialobot  │  │  api.socialobot.com    │   │
│  │  (Landing)   │  │  .com        │  │  (Backend API)       │   │
│  │              │  │  (Dashboard) │  │                      │   │
│  │  Cloudflare  │  │  Cloud Run   │  │  Cloud Run           │   │
│  │  Pages       │  │              │  │  + Cloud SQL         │   │
│  └──────────────┘  └──────────────┘  └──────────────────────┘   │
│                                                                  │
│  ┌──────────────────────┐  ┌──────────────────────────────────┐ │
│  │widget.socialobot.com   │  │  db (internal)                   │ │
│  │  (Embeddable JS)     │  │  Cloud SQL PostgreSQL 16         │ │
│  │  Cloud Run + CDN     │  │  + pgvector extension            │ │
│  └──────────────────────┘  │  No public access                │ │
│                             └──────────────────────────────────┘ │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────────┐│
│  │  RAG / Semantic Search Layer (internal to platform-api)     ││
│  │  Vertex AI text-embedding-005  →  pgvector VECTOR(768)      ││
│  │  Hybrid: keyword ILIKE + tsvector  ──▶  semantic fallback   ││
│  └──────────────────────────────────────────────────────────────┘│
└──────────────────────────────────────────────────────────────────┘
```

### Subdomain Map

| Subdomain               | Service                | Hosting                | Purpose                                         |
|--------------------------|------------------------|------------------------|-------------------------------------------------|
| `socialobot.com`          | Landing Page           | **Cloudflare Pages**   | Marketing site. SEO, pricing, live AI demo chat |
| `www.socialobot.com`      | Redirect → socialobot.com| Cloudflare redirect    | SEO canonical redirect                          |
| `app.socialobot.com`      | Tenant Dashboard       | **Google Cloud Run**   | Where paying clients log in, configure agents   |
| `api.socialobot.com`      | Platform API           | **Google Cloud Run**   | REST + WebSocket backend for all services       |
| `widget.socialobot.com`   | Embeddable Chat Widget | **Google Cloud Run**   | JS bundle that tenants embed on their sites     |

### Why This Structure?

1. **`socialobot.com` on Cloudflare Pages (FREE):** The landing page is pure static HTML/CSS/JS. Cloudflare Pages gives us a global CDN with <50ms latency worldwide, automatic SSL, and zero cost. We save our Google Cloud credits for the heavy backend work.

2. **`api.socialobot.com` on Cloud Run:** The AI engine, database connections, WhatsApp webhooks, Stripe/Wompi webhooks — all run here. Cloud Run scales to zero when idle (saves credits) and auto-scales under load.

3. **`app.socialobot.com` on Cloud Run:** The React dashboard (tenant portal). Served by nginx inside a container. Separate subdomain so tenants see a clean, professional URL when they log in.

4. **`widget.socialobot.com` on Cloud Run:** The embeddable chat widget JS file. Tenants add `<script src="https://widget.socialobot.com/salesagent.js"></script>` to their sites. Separate subdomain for caching and CDN optimization.

---

## 3. Environment Variables (Production)

After deployment, these are the production environment variables for the API:

```env
# ── Server ──
NODE_ENV=production
PORT=8080

# ── Database (Cloud SQL) ──
CLOUD_SQL_CONNECTION_NAME=socialobot:us-central1:socialobot-db
DB_USER=salesagent
DB_PASSWORD=<from Secret Manager>
DB_NAME=salesagent_db

# ── AI ──
LLM_PROVIDER=vertex_ai
GEMINI_MODEL=gemini-3.1-pro
GEMINI_FAST_MODEL=gemini-3.5-flash
VERTEX_AI_PROJECT_ID=YOUR_PROJECT
VERTEX_AI_LOCATION=us-central1

# ── RAG / Semantic Search ──
VERTEX_EMBEDDING_MODEL=text-embedding-005
RAG_CHUNK_SIZE=500
RAG_CHUNK_OVERLAP=75
RAG_SIMILARITY_THRESHOLD=0.3
RAG_TOP_K=5

# ── URLs (Production — socialobot.com) ──
ALLOWED_ORIGINS=https://socialobot.com,https://app.socialobot.com,https://widget.socialobot.com
DASHBOARD_URL=https://app.socialobot.com
WIDGET_CDN_URL=https://widget.socialobot.com

# ── Secrets (from Secret Manager) ──
API_SECRET=<from Secret Manager>
JWT_SECRET=<from Secret Manager>
ENCRYPTION_KEY=<from Secret Manager>
```

---

## 4. Deployment Order (Step by Step)

### Phase 1: Landing Page
1. Push `landing-page/` to GitHub
2. Connect to Cloudflare Pages
3. Map `socialobot.com` in Cloudflare
4. Update GoDaddy nameservers to Cloudflare
5. **Result:** `https://socialobot.com` is live with the marketing site

### Phase 2: Backend API
1. Create GCP project (if not already done)
2. Run `deploy/deploy-gcp.sh` to provision Cloud SQL + deploy API
3. Create secrets in Secret Manager (JWT, API key, etc.)
4. Apply database schema via Cloud SQL Proxy
5. Map `api.socialobot.com` in Cloud Run
6. Add DNS record in Cloudflare for `api` subdomain
7. **Result:** `https://api.socialobot.com` is live

### Phase 3: Dashboard
1. Build dashboard with `VITE_API_URL=https://api.socialobot.com`
2. Deploy to Cloud Run
3. Map `app.socialobot.com`
4. Add DNS record for `app` subdomain
5. **Result:** `https://app.socialobot.com` is live (tenant login)

### Phase 4: Widget
1. Build widget
2. Deploy to Cloud Run
3. Map `widget.socialobot.com`
4. Add DNS record for `widget` subdomain
5. **Result:** Tenants can embed `<script src="https://widget.socialobot.com/salesagent.js"></script>`

### Phase 5: Connect Landing Page AI Demo
1. Update the landing page chat to connect to `https://api.socialobot.com`
2. Configure a "Socialobot Demo" tenant in the database
3. The live AI demo on `socialobot.com` is now powered by the real engine
4. **Result:** "Agent Selling Agent" is live — our AI sells our product 24/7

---

## 5. Cost Estimate (Using Google Cloud Credits)

| Service              | Monthly Est. | Notes                                        |
|----------------------|-------------|----------------------------------------------|
| Cloudflare Pages     | **$0**      | Free tier (unlimited bandwidth)              |
| Cloud Run (API)      | ~$15-40     | Scale-to-zero; 512Mi RAM; pay per request    |
| Cloud Run (Dashboard)| ~$5-10      | Static nginx; minimal traffic initially      |
| Cloud Run (Widget)   | ~$5-10      | Static JS serve; cacheable                   |
| Cloud SQL (Postgres) | ~$10-25     | db-f1-micro; 10GB SSD; pgvector enabled      |
| Vertex AI Embeddings | ~$1-5       | text-embedding-005; ~$0.00002/1K tokens      |
| **Total**            | **~$36-90** | All covered by Google Cloud credits          |

> **Note:** Cloud Run's "scale to zero" feature means when no one is using the system (e.g., at 3 AM with no active chats), the cost is near $0. You only pay for actual compute time.

---

## 6. Architecture Diagram

```
                    ┌─────────────────────────┐
                    │     socialobot.com         │
                    │   (Cloudflare Pages)     │
    Visitors ──────▶│   Landing + AI Demo      │
                    │   EN: /  |  ES: /es/     │
                    └──────────┬──────────────┘
                               │ Chat connects via WebSocket
                               ▼
                    ┌─────────────────────────┐         ┌──────────────┐
                    │   api.socialobot.com      │────────▶│  Cloud SQL   │
                    │   (Cloud Run — API)     │         │  PostgreSQL  │
    Tenants' ──────▶│   REST + WebSocket      │         │  + pgvector  │
    WhatsApp        │   AI Agent Engine       │────┐    └──────────────┘
                    │   + RAG Embedding Layer  │    │
                    └──────────┬──────────────┘    │   ┌──────────────┐
                               │                   └──▶│ Vertex AI    │
              ┌────────────────┼────────────────┐      │ Embeddings   │
              ▼                                 ▼      │ (text-embed- │
   ┌─────────────────────┐           ┌──────────────┐  │  ding-005)   │
   │ app.socialobot.com    │           │widget.socialobot│  └──────────────┘
   │ (Cloud Run)         │           │.com           │
   │ Tenant Dashboard    │           │(Cloud Run)    │
   │ React SPA + nginx   │           │Embeddable     │
   └─────────────────────┘           │Widget         │
                                     └──────────────┘
```
