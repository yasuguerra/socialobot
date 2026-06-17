# Socialobot — Architecture Decision Records (ADRs)

Historical record of key architecture decisions for the platform.

## ADR-001: Cloud Run vs. Kubernetes
- **Decision:** Use Google Cloud Run.
- **Reason:** Socialobot experiences peak loads of asynchronous messaging. Cloud Run allows scaling to zero instances during idle hours, maximizing credits and drastically reducing operational costs compared to a dedicated GKE cluster.

## ADR-002: Vector DB (pgvector vs. Vertex RAG Engine/Spanner)
- **Decision:** Use `pgvector` on PostgreSQL 16.
- **Reason:** Avoids a huge base cost (~$65/mo for Spanner). It allows us to isolate tenant data (`tenant_id`) in the same transactional database using hybrid queries (ILIKE + vectors), extremely simplifying infrastructure.

## ADR-003: LLM Models (Gemini Flash vs. Pro)
- **Decision:** Use Gemini 3.5 Flash as the default conversational model.
- **Reason:** Flash offers sub-second latency for agile agent responses, vital on WhatsApp. We reserve Gemini 3.5 Pro only for deep reasoning operations like complex quote orchestration and the aviation flow.

## ADR-004: Wholesale Authentication (Passwordless SSO)
- **Decision:** Send UUIDv4 Tokens via WhatsApp instead of email/password accounts.
- **Reason:** Wholesale distributors have high friction with remembering passwords. Anchoring identity to the secure WhatsApp session increases catalog adoption by over 80%.
