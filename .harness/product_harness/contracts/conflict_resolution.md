# PRODUCT HARNESS CONFLICT RESOLUTION
# Veto hierarchy and alignment protocol within the Product Team.

---

## PRODUCT VETO HIERARCHY

When roles within the Product Harness are in conflict, this hierarchy applies from highest to lowest authority:

```
1. Chief Product Officer (CPO)    → absolute veto on roadmap, scope, and strategic alignment
2. Product QA                      → veto on usability and conceptual quality (RED 🔴 findings)
3. Product Manager (PM)            → veto on tactical prioritization and functional specs
4. UI/UX Specialist                → veto on design system consistency and UX copy
```

---

## ALIGNMENT RULES

### Rule 1 — CPO is the ultimate strategic arbiter
If there is an unresolvable disagreement between the PM and UI/UX regarding a feature flow, or between PM and QA regarding success metrics, the CPO makes the final decision.

### Rule 2 — Product QA Usability Blockers are absolute
If Product QA flags a flow or build with a RED (🔴) usability or functional blocker finding, the PM and UI/UX cannot bypass it. The issue must be returned to the design/development phase. The PM can only request an override from the CPO with a documented justification.

### Rule 3 — UI/UX owns the Design System and Copy
The PM cannot unilaterally change user flow interactions, branding, or UI copy without approval from the UI/UX Specialist. If the PM has a copy adjustment, it must be submitted to the UI/UX Specialist for validation.

### Rule 4 — PM owns the Functional Scope and Metrics
The UI/UX Specialist and Product QA cannot unilaterally add functional requirements or redefine success metrics. Any changes to the scope must be processed through the PM and approved in the PRD.

---

## ESCALATION PROTOCOL

```
Internal Product Conflict detected
               ↓
Is it covered by veto hierarchy?
               ↓ Yes                      ↓ No
          Apply rule                Escalate to CPO
               ↓                          ↓
          Document in               CPO decides and documents
          product_review.md         in product_review.md
```

---

## ALIGNMENT WITH ENGINEERING HARNESS

In case of cross-harness conflicts (Product Harness vs. Engineering Harness), refer to the global [conflict_resolution.md](.harness/engineering_harness/conflict_resolution.md) in the Engineering Harness.
