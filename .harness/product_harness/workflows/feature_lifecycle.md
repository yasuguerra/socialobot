# 🔄 WORKFLOW — Feature Lifecycle

From concept to deployment. This is the flow that every feature must follow without exception.

---

## Overview

```
CONCEPT → BRIEF → DESIGN → VALIDATION → HANDOFF → BUILD → AUDIT → DEPLOY
  CPO      PM     UI/UX    Product QA    PM→CTO   Eng.  Product QA   CTO
```

---

## Phase 1 — CONCEPT (Owner: CPO)

**Trigger:** Feature idea arrives from any source (CPO, user feedback, competition, Engineering).

**Activities:**
- CPO evaluates the idea using the 6 questions of the role (see [CPO.md](.harness/product_harness/CPO.md))
- Preliminary ICE Score is calculated (see [ice_scoring.md](.harness/product_harness/ice_scoring.md))
- Decision: Proceed / Discard / Backlog

**Exit Gate:** CPO says "proceed". Without this, the feature does not move forward.

**Output:** Approved feature for definition, with context on why it matters.

---

## Phase 2 — BRIEF / PRD (Owner: PM)

**Trigger:** CPO approves the concept.

**Activities:**
- PM drafts the complete PRD (see [PRD_template.md](.harness/product_harness/PRD_template.md))
- Defines target user, user story, acceptance criteria, and success metric
- Defines the scope boundary (what is NOT included)
- CPO reviews and approves the PRD

**Exit Gate:** CPO signs off on the PRD. Without this, UI/UX does not begin.

**Output:** PRD_venture_feature_date.md — approved document.

---

## Phase 3 — FLOW DESIGN (Owner: UI/UX Specialist)

**Trigger:** PRD approved by CPO.

**Activities:**
- UI/UX designs the complete user flow
- Defines UX Writing (exact text for buttons, messages, errors)
- Documents visual consistency rules
- PM reviews that the flow meets the acceptance criteria of the PRD

**Exit Gate:** PM confirms that the flow covers all PRD criteria.

**Output:** Flow specification (see [UIUX.md](.harness/product_harness/UIUX.md) — Standard output).

---

## Phase 4 — CONCEPTUAL VALIDATION (Owner: Product QA)

**Trigger:** Flow designed and approved by PM.

**Activities:**
- Product QA audits the flow BEFORE Engineering builds it
- Uses the standard checklist (see [usability_audit.md](.harness/product_harness/usability_audit.md))
- Reports conceptual friction points with severity levels
- If there are blockers → returns to UI/UX for correction

**Exit Gate:** Product QA issues a ✅ Approved or ⚠️ Approved with observations result.

**Output:** Signed conceptual audit report.

---

## Phase 5 — HANDOFF TO ENGINEERING (Owner: PM)

**Trigger:** Conceptual validation approved.

**Activities:**
- PM completes the Product Brief (see [product_brief_template.md](.harness/product_harness/product_brief_template.md))
- The brief includes: PRD, approved flow, acceptance criteria, QA observations
- PM delivers it to the Chief Architect of the Engineering Harness
- The expected delivery cycle is agreed upon

**Exit Gate:** Chief Architect confirms receipt and understanding of the brief.

**Output:** PRODUCT_BRIEF_venture_feature_date.md — delivered to the Engineering Harness.

⚠️ **Critical Rule:** Engineering does NOT start without this brief. If Engineering starts without a brief, the Product Harness failed.

---

## Phase 6 — BUILD (Owner: Engineering Harness)

**This harness does not control this phase.** Engineering operates according to its own protocols ([AGENTS.md](AGENTS.md)).

**What the Product Harness monitors:**
- Is the scope maintained? If Engineering proposes scope changes, the PM must be notified
- Are there functional questions? The PM answers them; Engineering does not answer them on their own

---

## Phase 7 — POST-BUILD AUDIT (Owner: Product QA)

**Trigger:** Engineering delivers the build for review.

**Activities:**
- Product QA audits the complete build using the standard checklist
- Tests under adverse conditions (at least 2 scenarios)
- Compares against the acceptance criteria of the original PRD
- Reports with severity levels

**Exit Gate:** Product QA issues ✅ Approved. Without this, the CPO cannot approve.

**Output:** Signed post-build audit report.

---

## Phase 8 — FINAL APPROVAL & DEPLOY

**Owner:** CPO → CTO

**Activities:**
- CPO reviews the Product QA report
- If ✅ Approved: CPO issues product approval
- CPO notifies the CTO that the feature is ready for deployment
- CTO signs off in the Engineering Harness (cto_approval.md) and deploys

**Exit Gate:** CTO confirms successful deployment.

**Output:** Feature in production. PM activates monitoring for the success metric defined in the PRD.

---

## Expected Times per Phase

| Phase | Typical Time | Who can accelerate |
|---|---|---|
| Concept | 15–30 min | CPO (quick decision) |
| PRD | 1–2 hours | PM (clarity from the start) |
| Flow Design | 1–3 hours | UI/UX (reusable templates) |
| Conceptual Validation | 30–60 min | Product QA (structured checklist) |
| Handoff | 30 min | PM (pre-assembled brief) |
| Build | Variable | Engineering Harness |
| Post-Build Audit | 1–2 hours | Product QA |
| Approval & Deploy | 15–30 min | CPO + CTO |

---

## Special Cases

### Product Hotfix (Urgent)
If there is a critical UX issue in production:
1. Product QA documents the issue with severity 🔴
2. PM creates a micro-PRD (can be a single page)
3. Conceptual validation is skipped (the real problem already exists)
4. Engineering fixes it → Product QA re-audits the specific fix
5. CPO approves → CTO deploys

### Experiment / A-B Test
1. PM defines the hypothesis and a clear success metric
2. UI/UX designs both variants
3. Product QA validates that both variants have no blocking friction
4. Engineering implements → CPO defines experiment duration
5. PM analyzes results → CPO decides which variant stays

