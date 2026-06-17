# Security, Threat Model, & Compliance Audit Report

## 1. Scope of Audit
This audit assesses the security posture, threat vectors, and compliance requirements of the proposed GCP 10/10 Enterprise Upgrade, specifically examining Firebase App Check, Cloud Armor policies, Google Sign-In OAuth consent verification, and Meta WhatsApp Business Manager verification.

---

## 2. Threat Vector Analysis & Mitigations

### 2.1. API Abuse and Bot Attacks
- **Vector**: Unauthorized scraping or spamming of the client-facing chat endpoint `/api/chat`.
- **Audit Findings & Mitigations**:
  - **Mitigation**: Deploy Firebase App Check inside [platform-widget/src](platform-widget/src) to sign all outgoing client-side requests with a reCAPTCHA Enterprise token.
  - **Mitigation**: Implement a custom Express middleware inside [platform-api/src/app.ts](platform-api/src/app.ts) to intercept App Check tokens and validate them using the Firebase Admin SDK. Operate in log-only mode (`APP_CHECK_LOG_ONLY = true`) initially to ensure token coverage before hard-enforcing.

### 2.2. DDoS & Application Vulnerabilities
- **Vector**: Distributed Denial of Service (DDoS) or SQL Injection targeting the API Gateway.
- **Audit Findings & Mitigations**:
  - **Mitigation**: Enforce Cloud Armor Enterprise rate-limiting and WAF protection directly on the Global Load Balancer to drop traffic exceeding safe volume limits (e.g. $> 100$ requests/minute per IP) and block OWASP Top 10 exploits.

### 2.3. Production Authentication Credential Exposure
- **Vector**: Leakage of production Meta API tokens or Google Service Account keys.
- **Audit Findings & Mitigations**:
  - **Mitigation**: Standardize on Google Application Default Credentials (ADC) for all Vertex AI and Document AI SDK calls.
  - **Mitigation**: Encrypt all Meta WhatsApp tokens stored inside database tables (such as `whatsapp_configs` or `whatsapp_connections`) using Google Cloud KMS envelope encryption, rather than relying on static environment variables.

---

## 3. Compliance and Verification Roadmaps

### 3.1. Google Publisher & OAuth Consent
- Verification status on Google API Console must be completed to prevent "unverified app" security screens for users.
- Privacy policies in [landing-page/privacy.html](landing-page/privacy.html) and terms in [landing-page/terms.html](landing-page/terms.html) are fully compliant and ready to be audited by Google verification teams.

### 3.2. Meta WhatsApp Business Verification
- Legal verification requires proof of incorporation and physical address matching the exact Meta Business Suite Profile.
- Pre-approved WhatsApp templates must be reviewed for opt-out compliance (by checking database tables like `contact_opt_outs` and `leads`) to guarantee compliance with regional telecommunications laws.

---

## 4. Security Status Verdict
🟢 **APPROVED WITH MITIGATIONS**: The proposed enterprise architecture significantly enhances Socialobot's security perimeter. Rollout must proceed in log-only phases for App Check and canary routing weights for DNS cutovers.


