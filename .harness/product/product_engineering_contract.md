# 📜 CONTRACT — Product Harness ↔ Engineering Harness

Collaboration agreement between the two harnesses. Both sides understand and respect it.

---

## Purpose

This contract eliminates friction between Product and Engineering by clearly defining who decides what, when, and how the two systems communicate.

---

## Responsibilities — Clear Separation

### Product Harness is responsible for:
- Defining WHAT to build and FOR WHOM
- Delivering complete, unambiguous, and internally approved briefs
- Answering functional questions during the build (< 4 hours)
- Auditing the build from the user's perspective (non-technical)
- Approving or rejecting the build with documented criteria

### Engineering Harness is responsible for:
- Defining HOW to build what Product specifies
- Estimating effort and communicating technical unfeasibilities before committing
- Notifying the PM if it detects that the scope is larger than estimated
- Delivering builds that meet the PRD's acceptance criteria
- Not making functional decisions without consulting Product

---

## What Product does NOT do

- Product does not dictate technical architecture
- Product does not decide which libraries, frameworks, or patterns to use
- Product does not change the scope during the build without documenting it
- Product does not contact developers directly about technical bugs (that is the job of Engineering QA)

---

## What Engineering does NOT do

- Engineering does not start a feature without an approved Product Brief
- Engineering does not make UX or copy decisions on its own
- Engineering does not reject a functional requirement out of technical preference (it can propose alternatives, not reject unilaterally)
- Engineering does not launch to production without CPO approval

---

## Conflict Protocol

If Product and Engineering have a discrepancy:

1. **Technical-functional conflict** (Engineering says "it cannot be done this way"): Engineering proposes the technical alternative → PM evaluates if it meets the acceptance criteria → If yes, it is approved; if no, the CPO is the arbiter.

2. **Scope conflict** (Product wants more than what fits in the sprint): CPO and CTO agree on what goes in and what moves to the next cycle.

3. **Priority conflict** (Engineering has urgent technical work vs a Product feature): CTO and CPO align. Neither side decides alone.

**Golden Rule:** Conflicts are resolved with data and criteria, not with hierarchy or perceived urgency.

---

## Service Level Agreements (Internal SLAs)

| Activity | Maximum Time |
|---|---|
| PM answers functional question from Engineering | 4 hours |
| CPO approves/rejects a PRD | 24 hours |
| Product QA completes post-build audit | 48 hours |
| Engineering notifies of technical unfeasibility | Before starting the build, not during |
| Engineering delivers build for audit | According to the timeline agreed at handoff |

---

## Sign-off

This contract is effective from the adoption of Product Harness v1.0.  
Every exception must be documented with reasoning and date.

---

*Product Harness v1.0 — [contracts/product_engineering_contract.md](.harness/product/product_engineering_contract.md)*