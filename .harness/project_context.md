# PROJECT CONTEXT
# Update this file when starting each new project.
# All roles inherit this context automatically.

---

## Project Identification

```
Name:           Social.Flow (socialobot)
Domain:         SaaS / Autonomous Social Media & Content Automation
Repository:     https://github.com (Private Workspace)
Current env:    development / production (GCP Cloud Run + Firebase Hosting)
```

---

## Technical Stack

```
Primary language:       TypeScript 5.x
Runtime:                Node.js 20 LTS
Backend framework:      Express (server.ts) + Firebase Functions (functions/src/index.ts)
Frontend framework:     React 18 (Vite, App.tsx) + Tailwind CSS
Database:               Firestore (NoSQL, firebase.json, firestore.rules)
ORM / Query builder:    Firebase Admin SDK (server/admin.ts)
Authentication:         Firebase Auth (Client SDK + Server Validation via OAuth / JWT)
Cache:                  None (Direct Firestore queries)
Queue:                  Firestore Scheduler / Cron Trigger (Firebase Scheduled Functions)
Storage:                Firebase Storage / Google Cloud Storage (for media assets)
```

---

## Development Tools

```
Package manager:        npm
Test framework:         Jest / Vitest
Linter:                 ESLint
CI/CD:                  Google Cloud Build (cloudbuild.yaml)
Deploy target:          GCP Cloud Run (Express server) + Firebase Hosting (Frontend)
Containerization:       Docker (Dockerfile)
Monitoring:             Sentry / Google Cloud Logging
```

---

## Project Conventions

```
Code language:          English / Spanish (Frontend handles bilingual Spanish components)
Commit language:        Spanish / English
Comment language:       English / Spanish
User language:          Adaptive (Communicate with the user in the same language they write in)
Main branch:            main
Branching strategy:     feature/*, hotfix/*, release/*
```

---

## Business Context

```
Brief description:      An AI-driven autonomous content partner that scrapes brands, schedules content, generates assets via Imagen 3 / Veo 3.1, and publishes to Instagram.
Target user:            Lucas (Agency Operator), Sofia (D2C E-commerce Founder), Carlos (Content Creator)
Key metrics:            Time-to-publish reduction (>=90%), AI-generation success rate (>=98%), Instagram publishing reliability (error <=1.5%)
Critical constraints:   GDPR, OAuth privacy, rate limits for Meta/Instagram Graph API, safe secrets storage
```

---

## Critical External Dependencies

```
- Google GenAI SDK (Gemini 3.5 Flash for strategy, Gemini 3.1 Flash Image / Imagen 3 for imagery, Veo 3.1 for video)
- Instagram Graph API / Meta Developer Graph SDK (for publishing Reels/images)
- Firebase Admin SDK & Firebase Client SDK
- Puppeteer / Scraping engines (for brand website scraping)
```

---

## Architecture Notes

```
- Dual Harness Structure: Engineering Harness (CTO, Chief Architect, Security Architect, Principal Engineer, QA Engineer, Entropy Auditor, Release Governor) for code, and Product Harness (CPO, PM, UI/UX, Product QA) for functional design.
- Serverless Firebase architecture paired with a containerized Cloud Run Express server.
- Strictly clean type safety in TypeScript on both frontend and backend.
```
