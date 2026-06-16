# 🤝 WORKFLOW — Handoff to Engineering

Formal delivery protocol from the Product Harness to the Engineering Harness.

---

## Purpose

This workflow defines exactly what must exist before Engineering starts building, and how the information is transferred. It is the bridge between the two harnesses.

---

## Fundamental Rule

> Engineering does not start without an approved Product Brief. Without exception.

If Engineering starts work without a brief, the Product Harness failed its function. If Engineering asks to start before the brief "to save time", the PM must resist — the cost of re-work outweighs any speed gains.

---

## Handoff Checklist — What must exist before delivery

```text
HANDOFF CHECKLIST — [Feature] — [Date]

REQUIRED DOCUMENTS
[ ] PRD approved by CPO (PRD_venture_feature_date.md)
[ ] UI/UX flow specification (approved by PM)
[ ] Conceptual audit report from Product QA (result ✅ or ⚠️)
[ ] Consolidated Product Brief (complete product_brief_template.md)

VERIFIED CRITERIA
[ ] Target user clearly defined (not "all users")
[ ] Functional acceptance criteria complete and unambiguous
[ ] Explicit scope boundary (what the feature does NOT include)
[ ] Post-launch success metric defined
[ ] Technical dependencies identified (even though Engineering will resolve them)

ALIGNMENT
[ ] CPO approved the PRD
[ ] PM is ready to answer any functional questions from Engineering
[ ] Communication channel agreed upon for questions during the build
[ ] Expected delivery date defined for the build to undergo audit

HANDOFF SIGN-OFF
PM: _________________________ Date: _________
Chief Architect (reception): ________ Date: _________
```

---

## Protocol for Questions During the Build

If Engineering has questions during implementation:

| Type of Question | Recipient | Expected Response Time |
|---|---|---|
| What should this do functionally? | PM | < 4 hours |
| How should the UI look / behave? | UI/UX Specialist | < 4 hours |
| Is this feature priority over X? | CPO | < 24 hours |
| How is this technically implemented? | Engineering resolves internally | — |

**Rule:** Engineering never makes functional decisions on its own. If there is ambiguity, ask. If they cannot ask, stop.

---

## What to Do If the Scope Changes During the Build

If Engineering discovers that something in the brief is technically unfeasible or requires more effort than estimated:

1. Engineering notifies the PM with the proposed alternative
2. PM evaluates whether the alternative meets the acceptance criteria
3. If yes: PM approves the alternative and updates the brief
4. If no: CPO decides whether to adjust the scope, the timeline, or both
5. All scope changes are documented in the brief (with date and reason)

---

## Post-Build — Delivery from Engineering to Product QA

When Engineering finishes the build:

1. Engineering notifies the PM that the build is ready for audit
2. PM notifies Product QA and delivers the brief + conceptual audit report
3. Product QA has a maximum of [48 hours] to complete the post-build audit
4. If there are observations 🟠 or blockers 🔴: Engineering receives the report and corrects them
5. If ✅ Approved: PM notifies the CPO for final approval
