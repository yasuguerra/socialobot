# Pioneer Cohort Audit: Launch Readiness for the First 10 Customers

## 1. Objective of the Pioneer Cohort Audit
Unlike scaling to 1,000 clients (which focuses on connection limit capacities, Redis clustering, and rate limits), the **First 10 Customers (Pioneer Cohort)** require **flawless functional reliability, flawless onboarding, and zero high-friction bugs**. 

For these 10 businesses, any failure in conversational flow, catalog parsing, or the dashboard acts as a direct roadblock. This audit defines the exact readiness checks and guarantees for their launch.

---

## 2. Onboarding & Catalog Ingestion Validation (Onboarding UX)

### 2.1. The Onboarding Wizard
- **Verified**: The 3-step registration flow in [platform-dashboard/src/pages/Onboarding.tsx](platform-dashboard/src/pages/Onboarding.tsx) is fully integrated.
- **Pioneer Polish**:
  - The Business ID (slug) is automatically normalized to lowercase, alphanumeric, and hyphens (e.g., `distribuidora-demo`).
  - There is an interactive availability check to prevent slug duplication *before* the customer hits "Submit".
  - Confetti and immediate sessionStorage flags are set up to guide the user into their fresh dashboard.

### 2.2. Automated Catalog Extraction (`/api/products/extract-doc`)
- **Status**: Pioneer clients often have product lists in chaotic formats (rough PDFs, complex Excel spreadsheets, or photos of printed catalogs).
- **Verified**: The `/api/products/extract-doc` endpoint in [platform-api/src/api/routes/products.ts](platform-api/src/api/routes/products.ts) is a state-of-the-art onboarding tool.
  - If they upload Excel/CSV, Seliabot uses a **local structured parser** to convert sheets into Markdown tables, avoiding token bloating.
  - If they upload PDF/Images, Seliabot invokes the **Google Document AI Layout Parser** to extract clean semantic tables.
  - Seliabot then feeds the markdown to **Gemini Pro** (`gemini-2.5-pro` / `gemini-1.5-pro` / `gemini-2.0-flash` depending on setting) to structure them into the exact database schema, parsing `price`, `wholesale_price`, `sku`, `category`, and `description`.
- **Mitigation for Pioneers**: Ensure the Google Document AI Service Account is pre-authorized with `roles/documentai.viewer` and the processor IDs (`DOC_AI_LAYOUT_PROCESSOR_ID`) are configured correctly in the GCP Console to prevent 500 errors on first upload.

---

## 3. Real-Time Conversational Flow & Tool Calling

For our first 10 customers, the AI Agent must execute multi-step tools flawlessly. We audit the following critical flows:

### 3.1. Automatic Returning Customer Identification
- **Mechanics**: When an incoming message arrives via WhatsApp, Seliabot reads `fromFormatted` in [platform-api/src/api/routes/whatsapp.ts](platform-api/src/api/routes/whatsapp.ts) and runs `customerRepo.findByPhone`.
- **Validation**:
  - The customer is identified, and their profile (company, payment terms, credit limits, order count) is injected into the agent's system prompt context.
  - If B2B Mode is active, the agent immediately knows whether to present `wholesale_price` instead of standard `price`.

### 3.2. Proforma PDF Generation & WhatsApp Dispatch
- **Flow**: User adds items to Cart $\to$ Tool `generateQuote` creates a Quote and calls `proformaService.ts` to generate a branded PDF Kit document $\to$ Tool `sendProforma` sends the PDF via Meta Cloud API or Evolution API.
- **Validation**:
  - Confirm `pdfkit` is writing files to a persistent volume or Google Cloud Storage (`GCS_BUCKET`) rather than ephemeral Cloud Run disk space.
  - Ensure the fallback to raw URL sharing is triggered gracefully if Meta WhatsApp rejects the file template format.

---

## 4. Zero-Crash UI/UX Safeguards

We audited known front-end unmounting vulnerabilities (white screens) that could affect pioneers:

### 4.1. PostgreSQL Decimal Cast Bug
- **Status**: The Node Postgres (`pg`) driver delivers SQL DECIMAL/NUMERIC types as strings (e.g. `"120.00"`). 
- **Risk**: Directly invoking `.toFixed()` on strings throws `TypeError` and crashes React components.
- **Verified Fix**:
  - In [platform-dashboard/src/pages/CRM.tsx](platform-dashboard/src/pages/CRM.tsx), all representations of `total_revenue` are safely wrapped with `Number(lead.total_revenue ?? 0).toFixed(2)`, preventing silent crashes when viewing leads or opening cards.

### 4.2. Analytics Page KPI Stub Fallback
- **Status**: The dashboard Analytics page was crashing/showing blank screens because the `getWholesaleKPIs` API was a stub returning `{}`.
- **Verified Fix**:
  - In [platform-dashboard/src/services/api.ts](platform-dashboard/src/services/api.ts#L1622), the endpoint is successfully mapped to `/reports/wholesale-kpis`. 
  - To secure this, ensure the backend reporting route has an active empty fallback handler returning default empty arrays `{ summary: {}, top_accounts: [] }` rather than throwing 500 when database tables are freshly seeded.

---

## 5. Catalog Quality & Health Checks

We leverage Seliabot's built-in self-auditing endpoint `/api/products/health-summary` to check pioneer data:
* When a pioneer customer imports their catalog, the Dashboard immediately executes this query.
* It calculates a **Data Quality Score (0-100)**:
  * For **Wholesale** clients: Identifies missing `wholesale_price` or `min_order_qty`.
  * For **E-Commerce** clients: Identifies missing `sku`, `price`, or `image_url`.
  * For **Travel/Charters**: Identifies missing capacities or load weights.
* **Pioneer Action**: Guides the client with a clear UI banner: *"Your catalog is 85% ready. 3 products are missing wholesale pricing. Click here to auto-fix with AI."*

---

## 6. Pioneer Cohort Launch Checklist

Before launching each of the first 10 customers, the following checklist MUST be run and signed off:

1. [ ] **Evolution API Instance Initialized**: WhatsApp QR scanned and connection verified as `connected` in [platform-api/src/api/routes/whatsapp.ts](platform-api/src/api/routes/whatsapp.ts).
2. [ ] **Catalog Health Score $\ge$ 90%**: Running the `/api/products/health-summary` check with zero missing critical fields.
3. [ ] **Document AI Ingestion Test**: Upload a sample catalog image/spreadsheet to verify parse pipeline is alive.
4. [ ] **E2E Cart Checkout Test**: Trigger a mock conversation via WhatsApp: search $\to$ add to cart $\to$ calculate shipping $\to$ generate proforma.
5. [ ] **Payment Gateway Sandbox Verification**: Process a mock Wompi or Stripe payment and verify the order is marked `paid` automatically.
