# Security & Architecture Contract: B2B Catalog SSO & Gating (Phase 6)

This contract defines the strict security, performance, and API specifications required to implement the B2B Passwordless Catalog SSO for Socialobot.

---

## 1. Security Guidelines & Gating

### 1.1 Token Properties (Entropy & Expirations)
- **Token Format**: Must be a cryptographically secure UUIDv4.
- **Expiration (TTL)**: Max lifetime of 1 hour from generation.
- **Strict Single-Use**: Upon hitting the `/api/catalog/authenticate` endpoint, the token must be marked as `used = true` in the database within a transaction. Any subsequent attempts to use the same token must return `401 Unauthorized`.

### 1.2 Data Masking (Pricing & Inventory Isolation)
- **Wholesale Price**: Standard public product lists must not return the `wholesale_price` key or must return it as `null`. Only if a valid JWT representing an approved, authenticated B2B customer is present in the `Authorization: Bearer <JWT>` header can the `wholesale_price` be populated.
- **Stock Quantities**: Absolute inventory counts (`stock_quantity`) must be masked. The public and authenticated B2B catalog must only expose stock as a binary flag: `in_stock: true | false`.

### 1.3 JWT Customer Payload
The swapped customer JWT must contain:
```json
{
  "role": "customer",
  "customer_id": "UUID",
  "tenant_id": "UUID",
  "pricing_tier": "wholesale" | "retail",
  "exp": "timestamp (24 hours)"
}
```

---

## 2. Verification Metrics (Definition of Done)

- [ ] **No Token, No Wholesale Price**: Accessing `/api/catalog/distribuidora-demo/products` with no Auth header yields products with `wholesale_price` masked/null.
- [ ] **Token Exchange works**: Swapping a valid UUID token yields a JWT session and marks the token used.
- [ ] **Token Replay Blocked**: Re-submitting the same token yields `401 Unauthorized` instantly.
- [ ] **Token Expiration**: Requesting with a token older than 1 hour yields `401 Unauthorized`.
- [ ] **CORS Compliance**: Allows requests from localhost during development and `app.socialobot.com` / custom domains in production.
