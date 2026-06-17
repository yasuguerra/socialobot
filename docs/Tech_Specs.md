# TECHNICAL SPECIFICATIONS (TECH SPECS)

**Project Name**: SOCIALOBOT (socialobot)  
**Document Version**: 2.1.0  
**Author**: Chief Architect (Fowler/Booch) & Principal Engineer (Karpathy)  
**Status**: APPROVED & IMPLEMENTED  
**Date**: June 12, 2026  

---

## 1. System Topology & Component Architecture

SOCIALOBOT operates on a decoupled Client-Server architecture designed to run on containerized cloud infrastructure, integrated with Google Cloud Platform (GCP) resources and Firebase Backend-as-a-Service (BaaS).

```mermaid
graph TD
    Client[React 19 Frontend + Vite + Tailwind v4] <-->|HTTPS + JSON + Firebase ID Token| Server[Node/Express Backend]
    Server <-->|gcloud SDK / Admin Auth| Firebase[Firebase Auth / Firestore / Storage]
    Server <-->|@google/genai / Vertex AI SDK| GoogleAI[Google Vertex AI: Gemini 3.5, Imagen, Veo 3.1]
    Server <-->|OAuth / Graph API Handshake| Instagram[Instagram Graph API / Meta Platforms]
    Server -.->|GoogleADK + SearchTool| Web[Public Internet]
```

The server acts as a secure middleware proxy. Clients authenticate directly with Firebase Authentication to obtain a JWT ID token, which is attached to all subsequent request headers as `Authorization: Bearer <ID_TOKEN>`. The server validates this token using `firebase-admin`, establishing tenant isolation.

---

## 2. Technology Stack & Key Dependencies

### 2.1 Frontend Core
- **Framework**: React 19 (TypeScript, functional hooks)
- **Build Tool**: Vite 6 (providing fast Hot Module Replacement)
- **Styling**: Tailwind CSS v4 (using the `@tailwindcss/vite` compiler)
- **State Management**: React state hooks coupled with direct REST client handlers.
- **Visuals & Charts**: Lucide React for icon libraries; Framer Motion (`motion`) for interface animations; Recharts for metrics dashboards.

### 2.2 Backend Core
- **Runtime**: Node.js (V8) running Express 4.21.
- **Language**: TypeScript (`tsconfig.json` compiles with strict type configurations).
- **Bundler**: Esbuild 0.25 (compiles TypeScript server code to clean CommonJS `dist/server.cjs`).
- **Dev-Runner**: `tsx` (TypeScript Execute) for real-time local execution.

### 2.3 Storage & Cloud Database
- **Auth**: Firebase Auth (user records and session tokens).
- **Database**: Google Cloud Firestore (structured, document-based NoSQL database).
- **File Storage**: Google Cloud Storage (via Firebase Storage) for video and image assets.
- **Platform hosting**: Google Cloud Run (containerized stateless backend) & Firebase Hosting (static frontend build).

### 2.4 Generative AI & Automation (Google AI Stack)
- **Text & Multimodal Agent**: `@google/genai` (Google Gen AI SDK) using stable **`gemini-3.5-flash`** for copy generation, profiling, and virality analysis.
- **Image Generation**: **Imagen 3** through stable model mapping of `gemini-3.1-flash-image` (standard) and `gemini-3-pro-image` (pro-tier).
- **Video Generation**: **Veo 3.1** via **`veo-3.1-generate-preview`** (allowing video preview synthesis, polling, and duration extensions).
- **Agent Framework**: `@google/adk` (Google Agent Development Kit) implementing a multi-tool `LlmAgent` and in-memory session runner.

---

## 3. Database Schema & Data Models (Firestore)

All client documents reside under a strict multi-tenant namespace model:  
`/users/{uid}/{collection}/{document_id}`

### 3.1 Brand Profile Document
Path: `/users/{uid}/brand_profile/profile`
```typescript
interface BrandProfile {
  userId?: string;
  name: string;
  website: string;
  socialHandles: {
    instagram?: string;
    facebook?: string;
    tiktok?: string;
    linkedin?: string;
  };
  industry: string;
  tone: string;
  targetBuyers: string;
  keyProducts: string;
  additionalContext: string;
  analyzedFromSources: boolean;
}
```

### 3.2 Content Idea Document
Path: `/users/{uid}/content_ideas/{id}`
```typescript
interface ContentIdea {
  id: string;
  userId?: string;
  title: string;
  description: string;
  hook: string;
  recommendedPlatform: 'Instagram' | 'Facebook' | 'TikTok' | 'LinkedIn';
  recommendedTime: string; // ISO 8601
  format: 'Image' | 'Video' | 'Text' | 'Carousel';
  visualPrompt: string;
  audienceSegment: string;
  optimalTimeReasoning: string;
}
```

### 3.3 Social Post Document
Path: `/users/{uid}/social_posts/{id}`
```typescript
interface SocialPost {
  id: string;
  userId?: string;
  ideaId?: string;
  platform: 'Instagram' | 'Facebook' | 'TikTok' | 'LinkedIn';
  title: string;
  caption: string;
  mediaType: 'image' | 'video' | 'text';
  mediaUrl: string;
  promptUsed?: string;
  scheduledTime: string; // ISO 8601
  status: 'Draft' | 'Scheduled' | 'Posting' | 'Posted' | 'Simulated' | 'Failed';
  viralScore: number;
  viralMetrics: {
    hook: number;
    trend: number;
    shareability: number;
    visualImpact: number;
    callToAction: number;
  };
  viralFeedback: string;
  audienceSegment: string;
  abGroup?: 'A' | 'B';
  externalPostId?: string;
  lastError?: string;
  lastPublishAttempt?: string;
  analytics?: {
    impressions: number;
    engagementRate: number;
    clicks: number;
    shares: number;
    reach: number;
    fetchedAt?: string;
  };
}
```

### 3.4 Platform Connection Document (OAuth Metadata)
Path: `/users/{uid}/platform_connections/{platform}`
```typescript
interface PlatformConnection {
  platform: 'Instagram' | 'Facebook' | 'TikTok' | 'LinkedIn';
  handle: string;
  externalAccountId: string;
  followersCount?: number;
  accessTokenCiphertext: string; // AES-256-GCM Envelope (iv:ciphertext:tag)
  issuedAt: string; // ISO 8601
  expiresAt?: string; // ISO 8601
  lastSyncedAt?: string; // ISO 8601
}
```

### 3.5 Content Arsenal Document
Path: `/users/{uid}/media_arsenal/{id}`
```typescript
interface ArsenalMediaAsset {
  id: string;
  userId?: string;
  url: string;
  storagePath: string;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  createdAt: string; // ISO 8601
  aiDescription: string;
  visualPrompt: string;
  isInspired: boolean;
  usageCount: number;
}
```

---

## 4. API Endpoints Specification (REST Blueprint)

### 4.1 Global Middleware
- **Auth Guard**: Rejects requests lacking a valid, unexpired Firebase ID Token (`requireAuth`). Injecting `userId` directly into requests as `(req as AuthedRequest).userId`.
- **Rate Limiting**: Enforces max 120 API calls per rolling minute per IP.
- **Request Validation**: Intercepts requests using `validateBody(Schema)` utilizing Zod validations.

### 4.2 Endpoint Specifications

| Method | Endpoint | Description | Payload Schema | Response |
|---|---|---|---|---|
| **GET** | `/api/brand-profile` | Fetch brand profile context. | None | `BrandProfile` |
| **POST** | `/api/brand-profile` | Synthesize & save Brand Profile. | `BrandProfileInputSchema` | `BrandProfile` (scraped/AI enriched) |
| **GET** | `/api/media-arsenal` | List media in Content Arsenal. | None | `ArsenalMediaAsset[]` |
| **POST** | `/api/media-arsenal/upload` | Upload & run multimodal analysis on asset. | `MediaUploadSchema` | `ArsenalMediaAsset` (with AI prompts/descriptions) |
| **DELETE** | `/api/media-arsenal/:id` | Delete media metadata and storage asset. | None | `{ success: true }` |
| **GET** | `/api/ideas` | Get all recommended content ideas. | None | `ContentIdea[]` |
| **POST** | `/api/ideas/generate` | Trigger Gemini to output new ideas. | `IdeasGenerateSchema` | `{ success: true, count: number }` |
| **GET** | `/api/posts` | Get list of all social posts. | None | `SocialPost[]` |
| **POST** | `/api/posts/generate` | Generate draft post based on an idea. | `PostsGenerateSchema` | `SocialPost` (fully analyzed for virality) |
| **POST** | `/api/generate-nanobanana` | Run Imagen 3 AI Image Generation. | `NanoBananaSchema` | `{ success: true, url: string }` |
| **POST** | `/api/generate-veo` | Trigger Google Veo 3.1 video generation. | `VeoGenerateSchema` | `{ success: true, operationName: string }` |
| **POST** | `/api/generate-veo/status` | Check Veo 3.1 operation completion status. | `VeoStatusSchema` | `{ status: "running"\|"done", url?: string }` |
| **POST** | `/api/generate-veo/extend` | Synthesize continuous narrative video clip. | `VeoExtendSchema` | `{ success: true, operationName: string }` |
| **POST** | `/api/posts/publish` | Deploy a scheduled/draft post immediately. | `PostsPublishSchema` | `SocialPost` (Status: Posted/Failed) |
| **POST** | `/api/agent/run` | Run a single conversation turn with ADK agent. | `{ message: string }` | `{ success: true, response: string }` |

---

## 5. Security Threat Boundary & Token Encryption

```
                    TRUST BOUNDARY
 [Client Node] ---------> [Express Middleware (Token Validated)]
                              |
                              +----> AES-256-GCM Decryption (Keys in memory only)
                              |
                              +----> Direct API Execution (Google Vertex AI / Meta SDKs)
```

### 5.1 AES-256-GCM Symmetrical Token Encryption
OAuth tokens (specifically Facebook and Instagram Graph tokens) must not remain open to database-read exploits. 
- **Encryption Algorithm**: Symmetrical `aes-256-gcm`.
- **Key Configuration**: Enforced at server boot using a base64-encoded 32-byte string from environment variable `TOKEN_ENCRYPTION_KEY`.
- **Storage Envelope**: Decrypted token properties are stored inside Firestore in a formatted base64 string joined by colons: `iv:ciphertext:authTag`.

### 5.2 Content Isolation & Regex Sanitation
- Firestore rules strictly block document accesses that do not equal the authorized Firebase ID (`request.auth.uid == userId`).
- Asset paths are checked, preventing path-traversal injection.

---

## 6. Integrations & External Protocols

### 6.1 Meta/Instagram Graph API (2-Step Publishing Flow)
Due to API mechanics, publishing image/video assets directly to Instagram business channels involves an asynchronous two-step container orchestration:

1.  **Container Generation**: Post media assets to `/{ig-user-id}/media`.
    - If **Video** (REEL): Set `media_type: "REELS"`, `video_url: post.mediaUrl`.
    - If **Image**: Set `image_url: post.mediaUrl`.
2.  **Ingestion & Status Polling**: Instagram asynchronously ingests media assets from our signed Google Cloud Storage URLs. For Video/Reel files, our server triggers a polling loop contacting `/${GRAPH_BASE}/${creationId}?fields=status_code` every 3000ms until `status_code === "FINISHED"`.
3.  **Media Publishing Release**: Issue a POST request to `/{ig-user-id}/media_publish` containing the confirmed `creation_id`. On completion, Instagram returns a unique post identifier (`externalPostId`).

### 6.2 Google Agent Development Kit (ADK) Core Tools
The AI Strategist chatbot executes inside a stateless environment, calling registered tools when prompt contexts request operational tasks:
- **`GoogleSearchTool`**: Fetches active internet trend queries.
- **`browse_content_arsenal`**: Queries Firestore `/media_arsenal` collections of the specific caller and injects style keywords directly into the agent context memory.
- **`generate_content_ideas`**: Standardizes ideation schemas, returning templates for subsequent copywriting.

---

## 7. Packaging, Bundling & Hosting Pipeline

- **Production Build Process (Frontend)**: Runs `vite build`, which compiles assets, treeshakes redundant node libraries, and outputs static pages into `/dist` for CDN deployment on Firebase Hosting.
- **Production Bundling (Backend)**: Compiles `server.ts` into a lightweight Node file via Esbuild:
  `esbuild server.ts --bundle --platform=node --format=cjs --packages=external --outfile=dist/server.cjs`
- **Containerization**: Handled by custom multi-stage `Dockerfile`. 
- **Cloud Delivery**: Cloud Build triggers automatically via `cloudbuild.yaml`, building the server image and deploying to **Google Cloud Run** in `us-central1` under the host domain.

