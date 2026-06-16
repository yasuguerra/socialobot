# Social.Flow (socialobot) — Product Feature Specifications

## Core Features

### 1. Brand Scraper & Profiler
*   **Purpose**: Automatically ingest raw brand context to establish a marketing baseline.
*   **Flow**: Scraping input URL -> cheerio extracts text tags -> `gemini-3.5-flash` analyzes tone, voice, and products -> returns structured **Brand Profile** (Buyer Persona, Brand Voice, Product List).

### 2. Creative Studio Sandbox (Generative AI)
*   **Imagen 3 Integration**: Generate high-fidelity marketing images with custom aspect ratios, utilizing `gemini-3.1-flash-image` and `gemini-3-pro-image`.
*   **Veo 3.1 Integration**: Generate cinematic preview clips.
*   **Video Continuation**: Select a generated video, append an extension prompt, and extend the timeline (+8 seconds) while preserving narrative and visual continuity.
*   **Generative History**: Historical prompts and parameters are stored in Firestore, enabling one-click reloading back into the canvas workspace.

### 3. Multimodal Content Arsenal
*   **Purpose**: Catalog and inspect user-uploaded media.
*   **Flow**: Firebase Storage uploads -> `gemini-3.5-flash` analyzes layout and content -> outputs Spanish descriptions for B2B logs and English style prompts for recreating assets.

### 4. Smart Social Calendar
*   **Purpose**: Centralized scheduling grid showing post states (`Draft`, `Scheduled`, `Posted`, `Failed`).
*   **Features**: Editable cells, rescheduling, visual drag-and-drop cues, and queue views.

### 5. Instagram Graph Direct-Publisher
*   **Purpose**: Multi-step direct release container flow for Instagram Business Profiles.
*   **Flow**: Facebook OAuth login -> token encrypted at rest -> create container via Graph API -> poll container ingest -> trigger release container.

### 6. Simulated Platforms Transparency
*   **Purpose**: Transparent mock states for TikTok, LinkedIn, and Facebook.
*   **Implementation**: Cards and schedules display clear amber `[Simulated]` warning badges and synthetic performance metrics to prevent B2B user confusion.

### 7. Virality Auditor & Optimization
*   **Purpose**: Pre-publish grading of captions and graphic concepts.
*   **Flow**: Scans copy for Hook Strength, Trend Alignment, Shareability, and CTA -> returns a numeric Virality Score (0-100) and optimization advice.

### 8. A/B Campaign split-testing
*   **Purpose**: Create an `ABCampaign` comparing two strategy variations.
*   **Features**: Track simulated engagements (impressions, clicks, conversions) and declare a clear Winner.

### 9. Agentic AI Strategist (Google ADK)
*   **Purpose**: An on-demand CMO chatbot.
*   **Tools**: Search engine (`GoogleSearchTool`), `generate_content_ideas`, `analyze_viral_score`, `get_optimal_schedule`, `research_hashtags`, and `browse_content_arsenal`.

### 10. Space Remodeler (Mamá's Corner)
*   **Purpose**: Isolated household design sandbox.
*   **UX**: Positioned under a separate "Experimental Playgrounds" sidebar section. Elder-friendly residential presets using Imagen 3.
