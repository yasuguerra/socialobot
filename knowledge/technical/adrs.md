# Social.Flow (socialobot) — Architectural Decision Records (ADRs)

## ADR 01: Multi-Tenant Cloud Firestore for Storage
*   **Context**: The application requires highly reliable, real-time database support for user brand profiles, scheduled social posts, media assets, and campaign details.
*   **Decision**: Adopt Google Cloud Firestore (via `firebase-admin` and `firebase`) as our primary database layer.
*   **Consequences**: Implements serverless schema-free collections. Requires strict software-enforced tenant filtering (always validating `userId` inside `server/store.ts` queries) to guarantee tenant data separation.

## ADR 02: Upgrading to Google Gemini 3.5 Flash
*   **Context**: Scrapes are occasionally large, and copywriting/ideation requires very rapid, bilingually-proficient content extraction.
*   **Decision**: Migrate all brand profile extraction, content ideation, and virality scoring to `gemini-3.5-flash` utilizing the new `@google/genai` SDK.
*   **Consequences**: Provides near-instant (~1-2 seconds) responses, reducing cold-starts and maintaining high conversational responsiveness for the AI Strategist chat.

## ADR 03: Veo 3.1 Pro Video Extension Pipeline
*   **Context**: Users need cohesive cinematic content, but standard video models only generate short, isolated clips.
*   **Decision**: Implement the `veo-3.1-generate-preview` video endpoint coupled with a custom `/api/generate-veo/extend` endpoint.
*   **Consequences**: Enables progressive storytelling by allowing creators to feed completed videos back into the generation loop with continuation prompts, extending the file duration (+8 seconds) with consistent styling.

## ADR 04: Google Agent Development Kit (ADK) for AI Strategist
*   **Context**: The chatbot strategist needs to access the user's schedule, suggest actual optimal post timings, and search live trends instead of just replying with generic copy.
*   **Decision**: Build the chat strategist using `@google/adk`'s `LlmAgent`, providing it with structured tool access (`GoogleSearchTool`, `generate_content_ideas`, `browse_content_arsenal`, `get_optimal_schedule`).
*   **Consequences**: Ground conversations in live search index data and real database states, turning the chatbot into a functional content planner.

## ADR 05: Simulated Platform Isolation and Badging
*   **Context**: B2B agency users were confused by non-Instagram platforms that appeared connected but published only simulated content.
*   **Decision**: Reorganize the sidebar navigation to move experimental features (like the Space Remodeler) to an isolated "Experimental Playgrounds" group and add prominent, warning-styled `[Simulated]` badges to all non-Instagram channels.
*   **Consequences**: Eliminates user expectations of real-world publishing on TikTok, Facebook, and LinkedIn, keeping B2B dashboards focused and transparent.
