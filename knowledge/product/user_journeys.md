# Social.Flow (socialobot) — Core User Journeys

## B2B Marketing & Creative Journeys

### 1. The Instant Brand Launch (SMB / Sofia's Flow)
*   **Step 1 (Scraping)**: User registers, opens the Brand Profiler, and enters their business website URL.
*   **Step 2 (Profiling)**: Cheerio scrapes site headers and text -> `gemini-3.5-flash` analyzes content and returns a structured Brand Profile containing voice, buyer persona, and industry category.
*   **Step 3 (Ideation)**: User clicks "Generate Ideas" -> system creates 3 post ideas containing recommended times, visual prompts, and hooks.
*   **Step 4 (Asset Creation)**: User clicks "Create Graphic" -> Creative Studio Sandbox opens with preloaded prompts -> Imagen 3 synthesizes custom images.
*   **Step 5 (Scheduling & Publishing)**: User reviews the copy, runs a Virality Audit, and adds the post to the Social Calendar. At the scheduled time, the system uses the Facebook Graph API to publish directly to their Instagram Business account.

### 2. Cohesive Cinematic Video Campaign (Creator / Carlos's Flow)
*   **Step 1 (Studio)**: Creator opens Creative Studio and enters a cinematic prompt (e.g., *"Cinematic shot of coffee brewing, steam rising, warm sunlight, 4k"*).
*   **Step 2 (Generation)**: Clicks "Generate Video" -> Veo 3.1 Pro synthesizes a high-fidelity video preview file.
*   **Step 3 (Continuation)**: Selects the generated video file in the studio, inputs a continuation prompt (e.g., *"Pouring the brewed coffee into a glass cup, slow motion"*), and clicks "Extend".
*   **Step 4 (Chaining)**: System synthesizes an extended clip (+8 seconds) maintaining character, styling, and visual continuity, merging the clips into a single Reel asset.

### 3. Multi-Channel Scheduling & Simulated Testing (Agency / Lucas's Flow)
*   **Step 1 (Connections)**: Agency operator connects client's Instagram using OAuth.
*   **Step 2 (Simulated Setup)**: Connects TikTok, Facebook, and LinkedIn in "Demo Mode". These cards display clear `[Simulated]` warning badges.
*   **Step 3 (Campaigning)**: Schedules posts across all channels on the social calendar. Simulated slots render with a distinct amber label.
*   **Step 4 (Publishing)**: Instagram publishes live content. Non-Instagram platforms execute simulated completions, showing mock metrics (engagement rates, likes) for client previews.

### 4. Residential Generative Playground (Consumer / Mamá's Corner)
*   **Step 1 (Isolation)**: B2B user clicks "Space Remodeler (Mamá's Corner)" under the isolated "Experimental Playgrounds" sidebar section.
*   **Step 2 (Upload)**: Uploads a photo of their living room or bedroom.
*   **Step 3 (Remodeling)**: Selects a design preset (e.g., *"Bohemian Style"*, *"Modern Minimalist"*) -> Gemini 3.5 Flash analyzes room boundaries -> Imagen 3 generates a beautifully remodeled design output.
