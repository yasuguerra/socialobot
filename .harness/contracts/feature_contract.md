# CODE INTERFACE CONTRACT: HIGH-FIDELITY SIMULATOR HARNESS

**Role: Chief Architect (Fowler)**  
**Target Project: Social.Flow (socialobot)**  
**Focus: Client-side robust Fallback & Simulation interfaces**

---

## 1. Unified Interceptor & Fallback Specifications

To ensure the application compiles flawlessly and runs smoothly in bypass/demo states, we will introduce client-side fallback layers inside [src/App.tsx](src/App.tsx) and component files.

### A. Dashboard Fallback Contract
If `apiFetch('/api/analytics')` throws or fails:
- The system must catch the error and invoke a simulated `setAnalytics` populate call.
- The structure must match the `AnalyticsProps` interface precisely:
  ```typescript
  {
    summary: { impressions: number; engagement: number; growth: number; shares: number };
    chartData: Array<{ name: string; Impressions: number; Engagement: number }>;
    platformStats: Array<{ name: string; value: number }>;
    demographics: Array<{ name: string; percentage: number }>;
    widgets: Array<{ type: string; label: string; value: string; change: string; isPositive: boolean }>;
  }
  ```

### B. Creator & Studio Generative Fallback
If generation calls for images or videos fail or are blocked under bypass:
- The interface must trigger a mock rendering state: `setLoadingIdeas(true)` or equivalent loading variables.
- After a simulated delay (e.g. 1500ms), the system will:
  - Populate the sandbox / viewport with a relevant mock asset URL.
  - Return a highly-detailed simulated marketing caption and viral scorecard object.

---

## 2. Content Arsenal Seeding Contract

If `apiFetch('/api/media-arsenal')` returns empty or fails under the bypass account, the UI must fallback to a client-side seed list:
```typescript
const SEED_ARSENAL_ASSETS: ArsenalMediaAsset[] = [
  {
    id: "seed-1",
    url: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=600&q=80",
    storagePath: "seeds/linen-jumpsuit.jpg",
    fileName: "organic-linen-jumpsuit.jpg",
    mimeType: "image/jpeg",
    sizeBytes: 1245000,
    createdAt: new Date().toISOString(),
    aiDescription: "Cinematic flat lay of ecological sand-toned linen garments on neutral beige paper background.",
    visualPrompt: "Flat lay sustainable fashion, organic raw linen texture, studio lighting",
    isInspired: false,
    usageCount: 2
  }
];
```

---

## 3. Implementation Guardrails

1. **Zero Impact on Production Secrets**: No actual private keys or server configurations may be altered.
2. **TypeScript Integrity**: No use of raw typecasting `any` to bypass interface properties. All fallback objects must strictly validate against definitions in [src/types.ts](src/types.ts).

---

## 4. Google GenAI stable model upgrades & Video Extension Contract

To integrate the best of Google's APIs, we have upgraded text, image, and video generation models to stable, top-of-the-line endpoints and added an interactive video extension mechanism.

### A. Model Upgrade Specifications
- **Agent Intelligence**: Upgraded text-agent models from `gemini-2.5-flash` to the highly-optimized stable `gemini-3.5-flash` in [server/agents.ts](server/agents.ts#L35) and [server/agents.ts](server/agents.ts#L215).
- **Image Synthesis**: Upgraded image generation models from `gemini-3.1-flash-image-preview` to the production stable `gemini-3.1-flash-image` (Nano Banana 2) in [server.ts](server.ts#L921) and [server.ts](server.ts#L1003). Added optional `model` validation to `NanoBananaSchema` to allow studio-tier `gemini-3-pro-image` (Nano Banana Pro).
- **Video Synthesis**: Upgraded default video generation model from `veo-3.1-lite-generate-preview` to the flagship cinematic **`veo-3.1-generate-preview`** (Veo 3.1 Pro) in [server.ts](server.ts#L1042).

### B. Video Extension API & Frontend Contract
- **Extension Endpoint**: Added `app.post("/api/generate-veo/extend")` validating with `VeoExtendSchema` in [server.ts](server.ts).
  - Takes `operationName` and `prompt`.
  - Resolves parent video GCS URI from completed operation.
  - Submits video extension request using `veo-3.1-generate-preview` with parent URI and `durationSeconds: 8` (restricted to `resolution: '720p'`).
  - Returns the new `operationName` for polling.
- **Frontend Video Extension UI**:
  - Automatically captures the latest `operationName` on video creation.
  - Displays a premium, themed Google Veo 3.1 Extension box in [src/App.tsx](src/App.tsx) when viewing a generated video in the Creative Studio viewport.
  - Allows entering custom continuation prompts and clicking "Extend Video (+7s)".
  - On complete, chains the prompts (e.g., `Prompt -> [Ext: New Prompt]`), updates the viewport, and logs the extended item into the repository showcase.
- **Asset Repository Reload**: Clicking on any historical asset's prompt text in the Showcase reloads the full state (URL, format, prompt, aspectRatio, and original `operationName`) back into the Studio viewport, allowing on-demand narrative extensions of previous video renders.

---

## 5. Space Remodeler Contract (El Rincón de Mamá)

To deliver an ultra-accessible room design experience for the "Silver Generation", we establish the following API and Frontend contract:

### A. API Endpoints
- **Endpoint**: `POST /api/remodel-space`
- **Validation Schema**: `RemodelSpaceSchema` (checks `dataUri`, `mimeType`, and `instruction`).
- **Internal Logic**:
  - Checks if `ai` (GoogleGenAI instance) is active.
  - If active, sends the base64 image along with `instruction` to `gemini-3.5-flash` with a system instruction to analyze the room and craft a highly descriptive English prompt optimized for room design.
  - Passes the resulting prompt to `gemini-3.1-flash-image` with `aspectRatio: "1:1"` to synthesize a redesigned version of that room.
  - If `ai` is disabled/mocked, uses an instruction-aware Unsplash keyword search fallback (e.g. `https://images.unsplash.com/featured/?kitchen,modern,bright`).
  - Returns: `{ imageUrl: string, originalDescription: string, visualPrompt: string, isMock: boolean }`.

### B. Frontend Accessibility Interface
- **Navigation**: Sidebar item "Remodelar mi espacio" under Main Console, switching state to `activeTab = "remodeler"`.
- **Step-by-step Structure**:
  - **Step 1: Upload**: Phone-friendly camera/gallery upload zone with a high-contrast preview.
  - **Step 2: Desires Presets**: Big buttons for direct tap instruction presets:
    - `"¡Que se vea más iluminada y moderna!" ✨`
    - `"Añade plantas y un toque de madera acogedor" 🪴`
    - `"Cambia el color de las paredes y pon cuadros lindos" 🎨`
    - `"Haz que parezca una sala de revista elegante" 🛋️`
    - And a custom text input for manual instructions.
  - **Step 3: Magic Render**: A large golden-button triggering `/api/remodel-space` with a reassuring Spanish progress text ("Tu diseñador de Google está pintando tu espacio...").
  - **Step 4: Interactive Viewport**: Split comparison or side-by-side layout showing Original Space vs Redesigned Space with saving capabilities.



