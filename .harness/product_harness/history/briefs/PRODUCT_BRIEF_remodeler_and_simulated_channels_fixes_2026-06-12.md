# PRODUCT BRIEF: REMODELER REPOSITIONING & SIMULATED CHANNELS CLARITY

**Venture**: SOCIALOBOT (socialobot)  
**Handoff Date**: June 12, 2026  
**PM**: Senior Product Manager (Product Harness Team)  
**Recipient (Engineering)**: Chief Architect & CTO (Engineering Harness Team)  
**Target Sprint**: Quick UX Polish & Consistency Sprint  

---

## 1. Executive Summary

Based on our recent comprehensive Product and Usability Audit, we identified two critical consistency and alignment gaps that create user friction:
1.  **Product Drift / Alignment**: "El RincÃ³n de MamÃ¡" (Space Remodeler) is currently treated as a primary business tab in the sidebar. This confuses B2B agency users (Lucas) who expect pure social marketing utilities.
2.  **User Expectations**: Non-Instagram platforms (Facebook, TikTok, LinkedIn) use simulated metrics and publishing endpoints, but are styled identically to the real Instagram connection. This can lead users to mistakenly believe they are publishing real-world content on those channels.

This brief outlines clear, precise, and easily achievable instructions for the Engineering team to plan, implement, and verify the necessary UI changes.

---

## 2. Attached Documents

| Document | File | Status |
|---|---|---|
| Complete PRD | [docs/PRD.md](docs/PRD.md) | âœ… Approved by CPO |
| Product Usability Audit | [.harness/engineering_harness/audits/product_audit_report.md](.harness/engineering_harness/audits/product_audit_report.md) | âœ… Completed |

---

## 3. User Stories

### Story A: Sidebar Restructuring
```text
As a B2B Social Media Agency Operator (Lucas),
I want the main navigation sidebar to list only professional marketing tools,
so that I can manage client workflows with a clean, focused, and professional business layout.
```

### Story B: Creative Lab Isolation
```text
As Sofia's Mother (senior consumer / custom guest),
I want a clear, friendly, and distinct section to access the "Space Remodeler",
so that I can play with AI house designs without interfering with B2B analytics dashboards.
```

### Story C: Simulated Platforms Transparency
```text
As an E-commerce Founder (Sofia),
I want to clearly see which social publishing channels are fully active and which are simulated demonstrations,
so that I don't accidentally schedule important campaigns on non-connected platforms expecting actual live posts.
```

---

## 4. Functional & UI Acceptance Criteria

### Requirement 1: Sidebar Group Restructuring
- **Action**: In `src/components/Sidebar.tsx`, move the "Remodelar mi espacio" (Space Remodeler) nav item out of the "Main Console" navigation group.
- **Action**: Create a new navigation group in the Sidebar called **"Experimental Labs"** or **"Creative Playgrounds"**.
- **Action**: Rename the tab display label from `"Remodelar mi espacio"` to `"Space Remodeler (MamÃ¡'s Corner)"` (with the `Paintbrush` icon) to preserve bilingual friendliness and state explicitly that it is a dedicated creative space.
- **Action**: Adjust the app rendering in `src/App.tsx` so that when the active tab is `'remodeler'`, the main header title reads `"Space Remodeler (El RincÃ³n de MamÃ¡)"` or `"Remodelar mi espacio"`.

### Requirement 2: Simulated Platform Indicators
- **Action**: In `src/components/ConnectedPlatforms.tsx`, update the channel card rendering. For any platform that is *not* `Instagram` (i.e. `TikTok`, `LinkedIn`, `Facebook`), add a clear, prominent, and stylized badge next to the platform name showing `[Simulated]` or `[Demo Channel]` (using warning/amber theme or slate-gray).
- **Action**: In `src/components/CalendarView.tsx`, update the platform peak hours legend at the bottom. Display `TikTok (6:30 PM - Simulated)`, `LinkedIn (8:45 AM - Simulated)`, and `Facebook (3:00 PM - Simulated)`.
- **Action**: In `src/components/CalendarView.tsx`, update the post card preview inside the queue and calendar cells. For non-Instagram items, render a lightweight indicator or label signifying `Simulated`.
- **Action**: In `src/App.tsx`, update the Headline A/B Testing Workspace (`abtests` tab). Add a clear warning badge on the target campaign variant cards indicating that results for simulated platforms (TikTok, LinkedIn, Facebook) are synthetic demonstrations.

---

## 5. Scope Boundary

**Includes:**
- Simple, high-impact, component-level UI modifications to restructure the sidebar.
- Visual badge decorations across affected views (`Sidebar.tsx`, `ConnectedPlatforms.tsx`, `CalendarView.tsx`, `App.tsx`).
- Preservation of all original functional APIs (no changes to `/api/remodel-space` or real Instagram direct publishing).

**Does NOT include:**
- Creating a heavy multi-language translation (i18n) framework. Simple billingual/dual labeling is sufficient for this cycle.
- Building actual API publishing adapters for TikTok, LinkedIn, or Facebook (which remains on the long-term Phase 2 roadmap).

---

## 6. UX Writing â€” Exact Required Copies

| Element / View | Target Component | Exact Required Copy |
|---|---|---|
| Sidebar Group Header | `Sidebar.tsx` | `"Experimental Playgrounds"` |
| Sidebar Tab Label | `Sidebar.tsx` | `"Space Remodeler (MamÃ¡'s Corner)"` |
| Connected Platform Badge | `ConnectedPlatforms.tsx` | `"Simulated"` (styled inside an amber badge: `text-amber-600 bg-amber-50 border border-amber-200`) |
| Calendar View Legend | `CalendarView.tsx` | `"TikTok (6:30 PM - Simulated)"`, `"LinkedIn (8:45 AM - Simulated)"`, `"Facebook (3:00 PM - Simulated)"` |
| A/B Testing Card | `App.tsx` | `"Simulated Campaign (Demo Mode)"` |

---

## 7. Product QA Handoff Acceptance Criteria

Product QA will verify:
1.  **Visual Segmentation**: Space Remodeler is separated under "Experimental Playgrounds" section in Sidebar.
2.  **No Core Broken Flow**: Clicking "Space Remodeler (MamÃ¡'s Corner)" still loads the same fully functional, senior-friendly photo upload and Imagen 3 generation flow.
3.  **Simulation Warning**: Any mock platform (TikTok, Facebook, LinkedIn) shows a visible label so B2B users are not misled.

---

*Handoff approved and authorized by the Product Harness.*  
**PM Sign-off**: Senior Product Manager (June 12, 2026)  
**CPO Validation**: Approved for technical planning & immediate execution (June 12, 2026)  

