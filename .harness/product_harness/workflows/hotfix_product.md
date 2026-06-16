# PRODUCT HOTFIX WORKFLOW
# Accelerated flow for critical production UX or functional issues.

---

## OVERVIEW

In the event of a critical issue in production, the standard 8-phase feature lifecycle is suspended in favor of this accelerated hotfix workflow.

```
TRIGGER (CPO/PM) → MINIMAL SPEC (PM) → VERIFICATION (Product QA) → APPROVAL (CPO) → DEPLOY (CTO)
```

---

## TRIGGER CRITERIA

A Product Hotfix can ONLY be triggered under the following conditions:
- **Major functional failure**: Users are unable to perform core actions (e.g., login, connect platforms, schedule posts, publish content).
- **Brand reputation threat**: Severe UI distortions, misaligned copy, or leaking of sensitive mockup/internal data in production.
- **Critical regression**: A newly deployed feature breaks existing, unrelated stable functionality.

---

## HOTFIX WORKFLOW STEPS

### Step 1 — Activation (CPO or PM)
- Any team member can report a critical issue.
- The CPO or PM immediately assesses the issue. If it meets the trigger criteria, the CPO officially activates the `PRODUCT_HOTFIX` status.
- The CPO/PM notifies the Engineering Harness (CTO) of the incoming hotfix.

### Step 2 — Minimal Specification (PM)
- **Bypass**: Skip concept validation, formal PRD creation, and iterative UI/UX design.
- The PM drafts a 1-paragraph functional specification.
- This specification must clearly describe:
  1. The expected behavior (what should happen).
  2. The current broken behavior (what is actually happening).
  3. The scope boundary (what is affected and what must remain untouched).

### Step 3 — Post-Build Smoke Test (Product QA)
- Once the Engineering Harness delivers the hotfix build, Product QA conducts a targeted, 15-minute smoke test.
- The scope of testing is limited strictly to:
  1. Verifying that the hotfix resolves the specified bug.
  2. Ensuring no obvious regressions exist in adjacent critical flows.
- Product QA issues an immediate, brief verdict: ✅ Approved or 🔴 Blocked (with specific issues).

### Step 4 — Fast-Track Sign-off (CPO)
- The CPO reviews the QA verdict.
- If approved, the CPO grants immediate, fast-track strategic sign-off.
- The CPO notifies the CTO that the product side is ready for deployment.

### Step 5 — Deployment & Monitoring (PM)
- The CTO deploys the hotfix.
- The PM immediately verifies that the bug is resolved in production.
- The PM monitors production metrics/error logs for 1 hour to ensure stability.

---

## SERVICE LEVEL AGREEMENTS (SLAs)

| Phase | Target Time | Owner |
|---|---|---|
| Activation & Spec | < 30 minutes | PM / CPO |
| Smoke Test | < 15 minutes | Product QA |
| CPO Sign-off | < 10 minutes | CPO |
| Post-deploy Verification | < 15 minutes | PM |

---

*Related Engineering Workflow: [workflows/hotfix_workflow.md](.harness/engineering_harness/workflows/hotfix_workflow.md)*
