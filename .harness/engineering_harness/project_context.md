# PROJECT CONTEXT
# Update this file when starting each new project.
# All roles inherit this context automatically.

---

## Project Identification

```
Name:           Seliabot
Domain:         Multi-tenant AI Sales Agent SaaS for Latin America
Repository:     https://github.com/seliabot/seliabot
Current env:    development / production
```

---

## Technical Stack

```
Primary language:       TypeScript 5.x, Python
Runtime:                Node.js 20 LTS, Python 3.11+
Backend framework:      Express.js (platform-api)
Frontend framework:     React 18 + Vite (platform-dashboard & platform-widget), Nginx
Database:               PostgreSQL 16 (with multi-tenant schema)
ORM / Query builder:    node-postgres (pg / pg-pool)
Authentication:         JWT (with tenant_id payload), bcrypt, encrypted Meta API tokens
Cache:                  In-memory Node caching (No Redis)
Queue:                  Cron / Google Cloud Scheduler, background followUpWorker
Storage:                Google Cloud Storage (GCS) for product images & generated PDFs
```

---

## Development Tools

```
Package manager:        npm (per sub-project: platform-api, platform-dashboard, platform-widget)
Test framework:         Vitest (vitest.config.ts)
Linter:                 ESLint + Prettier
CI/CD:                  Google Cloud Build (cloudbuild.yaml, cloudbuild-migrate.yaml)
Deploy target:          Google Cloud Run + Cloud SQL (Private IP 10.68.0.3)
Containerization:       Docker (Multi-stage Dockerfiles in subprojects)
Monitoring:             Google Cloud Monitoring, Cloud Logging, Cloud Scheduler
```

---

## Project Conventions

```
Code language:          English
Commit language:        English, Conventional Commits format
Comment language:       English
User language:          Spanish (primary), English (supported)
Main branch:            main
Branching strategy:     feature/*, hotfix/*, release/*
```

---

## Business Context

```
Brief description:      Seliabot is a multi-tenant AI-driven sales agent that automates B2B wholesale ordering, catalog recommendation, customer greeting, proforma generation, and automated follow-ups via WhatsApp for Latin American SMBs.
Target user:            SMB wholesale distributors, real estate companies, retail, e-commerce, and service companies in LATAM.
Key metrics:            MRR ($1500 target), Conversion Rate (8% target), Conversation Volume, Tenant Retention.
Critical constraints:   Strict multi-tenant security isolation, WhatsApp API rate limits, low-latency AI responses, private-IP DB connection, secure billing/payment processing.
```

---

## Critical External Dependencies

```
- Google Vertex AI API (Gemini 2.5 Pro / @google-cloud/vertexai SDK using ADC)
- Meta WhatsApp Cloud API / Graph API (for document delivery and customer chat)
- Evolution API (alternative WhatsApp gateway)
- Wompi / Stripe / PayPal (LATAM & international payment gateways via Factory pattern)
- PDFKit (for branded proforma PDF generation)
```

---

## Architecture Notes

```
1. Multi-Tenant Database Isolation:
   - Explicit tenant_id constraints on all queries (products, orders, customers, etc.).
   - All REST controllers must validate and extract tenant_id from authorized request payloads.

2. AI Agent Reasoning Loop:
   - Employs a multi-round tool-calling loop (Max 6 rounds) with 14 customized B2B/B2C tools (searchProducts, manageCart, createOrder, generateQuote, sendProforma, calculateShipping, etc.).
   - Employs a Provider Selection chain: Vertex AI -> Google AI (Gemini SDK) -> Mock Provider.

3. Full-Text Search (FTS):
   - Uses PostgreSQL GIN indexes and ts_vector / plainto_tsquery for Knowledge Base search.
   - No vector databases or embeddings configured; relies entirely on PostgreSQL FTS.

4. Embeddable Widget Security:
   - Uses Shadow DOM isolation in platform-widget to prevent styles bleeding and JavaScript collisions on host tenant websites.

5. Decimal Database Types:
   - PostgreSQL Numeric/Decimal types are returned by 'pg' as strings. Always wrap numeric fields (e.g. total_revenue) in Number() before applying .toFixed() or arithmetic operations to prevent runtime crashes.
```

---

## Current State

```
Active development sprint: Phase 6 catalog & SSO integration
In production:             Core multi-tenant AI Sales Agent with WhatsApp (Meta API & Evolution API), Stripe/Wompi payments, and embeddable widget
In progress:               Fixing tenant welcome email delivery, resolving database migrations warnings, and polishing marketing/engineering harness alignments
Blocked:                   None
```

