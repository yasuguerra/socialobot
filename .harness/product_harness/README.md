# 🧭 PRODUCT HARNESS — v1.0

**Core philosophy:** "Build the right things, for the right people, at the right time."

---

## What is this harness?

The Product Harness is the product decision-making system that operates **in parallel and prior** to the Engineering Harness. It defines *what to build and for whom*. Engineering defines *how*.

No feature enters the Engineering Harness without an approved brief from this system.

---

## Structure

All files are located in the [.harness/product_harness/](.harness/product_harness/) directory:

- [README.md](.harness/product_harness/README.md) ← You are here. Entry point.
- **Roles:** Definition of each team role
  - [CPO.md](.harness/product_harness/roles/CPO.md) ← Chief Product Officer
  - [PM.md](.harness/product_harness/roles/PM.md) ← Product Manager
  - [UIUX.md](.harness/product_harness/roles/UIUX.md) ← UI/UX Specialist
  - [PRODUCT_QA.md](.harness/product_harness/roles/PRODUCT_QA.md) ← Product QA & Usability Auditor
- **Workflows:** Processes and workflows
  - [feature_lifecycle.md](.harness/product_harness/workflows/feature_lifecycle.md) ← From concept to deployment
  - [hotfix_product.md](.harness/product_harness/workflows/hotfix_product.md) ← Accelerated flow for critical production issues
  - [prioritization.md](.harness/product_harness/workflows/prioritization.md) ← How to decide what to build first
  - [handoff_to_engineering.md](.harness/product_harness/workflows/handoff_to_engineering.md) ← Delivery protocol to the CTO Harness
- **Contracts:** Agreements between roles and harnesses
  - [product_engineering_contract.md](.harness/product_harness/contracts/product_engineering_contract.md) ← Product↔Engineering collaboration rules
  - [conflict_resolution.md](.harness/product_harness/contracts/conflict_resolution.md) ← Internal product veto and alignment rules
  - [definition_of_ready.md](.harness/product_harness/contracts/definition_of_ready.md) ← When a feature is ready for Engineering
- **Templates:** Reusable templates
  - [PRD_template.md](.harness/product_harness/templates/PRD_template.md) ← Product Requirements Document
  - [user_story_template.md](.harness/product_harness/templates/user_story_template.md) ← Standard User Story
  - [product_brief_template.md](.harness/product_harness/templates/product_brief_template.md) ← Handoff brief to Engineering
  - [usability_audit.md](.harness/product_harness/templates/usability_audit.md) ← Product QA Checklist
  - [product_review.md](.harness/product_harness/templates/product_review.md) ← Periodic product review template
- **KPIs:** Success criteria and metrics
  - [metrics_framework.md](.harness/product_harness/kpis/metrics_framework.md) ← KPI Framework by product type
  - [ice_scoring.md](.harness/product_harness/kpis/ice_scoring.md) ← ICE Prioritization System

- **History (Archive):** Completed product documents
  - [history/briefs/](.harness/product_harness/history/briefs/) ← Completed Product Briefs
  - [history/prds/](.harness/product_harness/history/prds/) ← Completed Product Requirement Documents
  - [history/audits/](.harness/product_harness/history/audits/) ← Completed Usability Audits

---

## Harness Principles

1. **User first, architecture second.** A technically perfect feature that nobody uses is a failure.
2. **Decision over perfection.** Prioritize moving forward with clarity over waiting for the ideal solution.
3. **Lightweight by design.** Minimum viable processes, not corporate bureaucracy.
4. **Layer separation.** Product Harness defines *what*. Engineering Harness defines *how*.
5. **Anchored in revenue.** Every decision is evaluated against its impact on conversion, retention, or expansion.

---

## How to Activate the Harness with an LLM

### Full Product Session:
```text
"Act as the Product Harness team. Feature to work on: [description].
Follow the flow defined in workflows/feature_lifecycle.md."
```

### Specific Role:
```text
"Act as [CPO / PM / UI/UX Specialist / Product QA].
Venture context: [brief description].
Task: [what you need]."
```

---

## Relationship with the Engineering Harness

```
Product Harness → approves brief → Engineering Harness → builds → Product QA → validates → CPO → approves → CTO deploys
```

See formal contract in: [product_engineering_contract.md](.harness/product_harness/product_engineering_contract.md)

