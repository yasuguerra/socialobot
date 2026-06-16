# 🔍 AUDIT — Usability Audit

Complete checklist for Product QA. Use in conceptual audits (pre-build) and post-build audits.

---

## Instructions for Use

1. Complete one audit per feature, not one for the entire product
2. Document each finding with: description, severity, and screen/step affected
3. Issue a final result before passing to the CPO for approval

---

## AUDIT REPORT

```text
Feature: ___________________________
Venture: ___________________________
Date: ______________________________
Type: [ ] Conceptual (pre-build)   [ ] Post-build
Auditor: ___________________________
```

---

## SECTION 1 — CLARITY (Does the user understand what is happening?)

| # | Criterion | ✅ / ❌ / N/A | Severity | Note |
|---|---|---|---|---|
| 1.1 | The user understands what this feature does in < 3 seconds | | | |
| 1.2 | The main CTA is visually obvious (position, contrast, text) | | | |
| 1.3 | There are no interface elements without a clear purpose | | | |
| 1.4 | The title or header of each screen describes what the user can do | | | |
| 1.5 | The visual hierarchy guides the user to the next step without thinking | | | |

---

## SECTION 2 — FLOW (Is the path to the goal direct?)

| # | Criterion | ✅ / ❌ / N/A | Severity | Note |
|---|---|---|---|---|
| 2.1 | The flow has no unnecessary steps that can be eliminated | | | |
| 2.2 | The user is never "stuck" without knowing what to do | | | |
| 2.3 | Loading/wait states are visually communicated | | | |
| 2.4 | The final state of the flow confirms that the action was completed | | | |
| 2.5 | The user can go back without losing progress | | | |
| 2.6 | The number of steps to the goal does not exceed what is reasonable for the task | | | |

---

## SECTION 3 — ERRORS & EDGE CASES

| # | Criterion | ✅ / ❌ / N/A | Severity | Note |
|---|---|---|---|---|
| 3.1 | Error messages are understandable for a non-technical user | | | |
| 3.2 | Errors say WHAT went wrong AND HOW to fix it | | | |
| 3.3 | The error flow allows recovery without restarting from scratch | | | |
| 3.4 | Form fields validate in real-time (not just upon submission) | | | |
| 3.5 | The empty state (zero state) has clear instructions | | | |

---

## SECTION 4 — CONSISTENCY

| # | Criterion | ✅ / ❌ / N/A | Severity | Note |
|---|---|---|---|---|
| 4.1 | The tone of the copy is consistent with the brand voice | | | |
| 4.2 | Visual patterns are consistent with the rest of the product | | | |
| 4.3 | Behavior is the same across all relevant channels | | | |
| 4.4 | The terminology used in the UI is consistent (does not mix synonyms) | | | |

---

## SECTION 5 — EXPERIENCE (How does it feel to use?)

| # | Criterion | ✅ / ❌ / N/A | Severity | Note |
|---|---|---|---|---|
| 5.1 | The flow works as well on mobile as on desktop | | | |
| 5.2 | There is immediate feedback after each user action | | | |
| 5.3 | Is there a moment of delight? Or is it just functional? | | | |
| 5.4 | A non-technical user can complete the flow without external help | | | |
| 5.5 | A rushed user can complete the flow without reading all the text | | | |

---

## DETAILED FINDINGS

```text
ID: [#]
Section: [1-5]
Affected Criterion: [number]
Severity: 🔴 Blocking / 🟠 Important / 🟡 Minor
Screen/Step: [description of where it occurs]
Description: [what is wrong]
User Impact: [what the user experiences]
Proposed Solution: [optional — if obvious]
```

---

## FINAL RESULT

```text
Total criteria evaluated: ___
Blocking 🔴: ___
Important 🟠: ___
Minor 🟡: ___

RESULT:
[ ] ✅ Approved — Ready for CPO approval
[ ] ⚠️ Approved with observations — Mandatory fix in next cycle
[ ] ❌ Rejected — Returns to [Engineering / UI/UX / PM]

Product QA Sign-off: _________________ Date: ___________
```

---

## Severity Scale — Quick Reference

| Level | Criterion | Action |
|---|---|---|
| 🔴 Blocking | The user cannot complete the core task | Not approved. Returns to Engineering with exact description |
| 🟠 Important | The user completes the task with evident confusion | Approved. Mandatory fix in next sprint |
| 🟡 Minor | Detail of copy, color, or micro-interaction | Logged. Does not block launch |