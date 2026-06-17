# Socialobot — Engineering Coding Standards

This document defines the strict engineering standards required for the Socialobot platform.

## 1. Type Safety & Validation
- **Strict TypeScript:** All code must be written in TypeScript with `strict: true`. No `any` types allowed.
- **Runtime Validation:** All external inputs (API payloads, webhooks, database results) MUST be validated using **Zod** schemas.

## 2. Database & SQL Security
- **Anti-Injection:** Raw SQL concatenation is strictly forbidden. All queries must use parameterized queries via `pg` (node-postgres).
- **pgvector Safety:** When executing vector similarity searches, embeddings must be securely parsed and passed as parameters.
- **Tenant Isolation:** EVERY query involving user or product data MUST explicitly include the `tenant_id` in the `WHERE` clause.

## 3. LLM & AI Integrations
- **Prompt Injection Defense:** User inputs must be sanitized before being injected into the system prompt context.
- **Graceful Degradation:** If the primary LLM provider (Vertex AI / Gemini) fails or rate-limits, the system must automatically fallback to a secondary provider or queue the message.
- **Stateless Tools:** All tool-calling functions (e.g., `searchProducts`, `createOrder`) must be pure, stateless, and idempotent where possible.

## 4. Error Handling
- **No Silent Failures:** Uncaught exceptions must be logged to Cloud Logging.
- **Consistent API Responses:** All REST APIs must return a standardized JSON structure: `{ success: boolean, data?: any, error?: string }`.
