# Socialobot — Core Features & Capabilities

This document catalogs the core modules of the Socialobot platform, mapped to our pricing tiers.

## 1. Omnichannel AI Agents
- **WhatsApp Agent:** Natively integrates via Meta Cloud API / Evolution API. Handles text, voice notes (STT), and PDFs.
- **Web Widget:** Embeddable React-based widget for customer websites.

## 2. Authentication & Identity
- **Passwordless B2B Auth (OTP):** Secure authentication via WhatsApp. No passwords required. Grants access to private wholesale catalogs.
- **Tenant Isolation:** Multi-tenant architecture ensuring complete data privacy between businesses.

## 3. Commerce & Transactions
- **Automated Quoting:** Calculates shipping, applies volume discounts, and generates PDF proforma invoices instantly.
- **Payment Gateway Integration:** Native generation of payment links via Wompi, Stripe, and PayPal for immediate closing.

## 4. Knowledge Base & RAG Engine
- **Semantic Search:** Powered by `pgvector` in PostgreSQL. Allows the agent to query product catalogs, PDFs, and URLs semantically.
- **Automated Scraper:** Ingests the customer's existing website to train the AI instantly.

## 5. Operations & CRM
- **Lead Capture:** Automatically extracts Name, Phone, Company, and Email from natural conversation.
- **CRM Sync:** Hooks to push qualified leads to external CRMs like HubSpot or Salesforce.
