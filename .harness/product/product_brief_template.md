# 📦 TEMPLATE — Product Brief (Handoff to Engineering)

Consolidated document that the PM delivers to the Chief Architect. It contains everything Engineering needs to get started.

---

## METADATA

```text
Feature: ___________________________
Venture: ___________________________
Handoff Date: ______________________
PM: ________________________________
Recipient (Engineering): _________
Target Sprint / Cycle: ____________
```

---

## 1. EXECUTIVE SUMMARY

[3–5 sentences. What it is, for whom, and why it matters now. Sufficient for anyone on the team to understand the context without reading the rest.]

---

## 2. ATTACHED DOCUMENTS

| Document | File | Status |
|---|---|---|
| Complete PRD | PRD_venture_feature_date.md | ✅ Approved by CPO |
| UI/UX Flow Specification | [filename] | ✅ Approved by PM |
| Conceptual Audit Report | [filename] | ✅ / ⚠️ [result] |

---

## 3. USER STORY (Summary)

```text
As a [profile],
I want [action],
so that [benefit].
```

---

## 4. FUNCTIONAL ACCEPTANCE CRITERIA

[Copy exactly from the PRD. These are the criteria against which Engineering QA will verify.]

- [ ] [Criterion 1]
- [ ] [Criterion 2]
- [ ] [Criterion 3]
- [ ] [Criterion N]

---

## 5. SCOPE — What is included and what is NOT

**Includes:**
- [...]
- [...]

**DOES NOT include (scope boundary):**
- [...]
- [...]

---

## 6. USER FLOW (Visual Summary)

[Step-by-step description of the approved flow. If there is a diagram or UI/UX specification, reference it here.]

---

## 7. UX WRITING — Exact Required Copies

[Copy from the UI/UX flow. Engineering implements these exact copies, does not write them.]

| Element | Exact Copy |
|---|---|
| Main CTA | [...] |
| Confirmation message | [...] |
| Generic error message | [...] |
| Specific error message [type] | [...] |

---

## 8. PRODUCT QA OBSERVATIONS (Pre-Build)

[Copy from the conceptual audit report. Engineering must be aware of findings to avoid reproducing them.]

| ID | Severity | Description | Expected Action |
|---|---|---|---|
| [#] | 🟠 / 🟡 | [description] | [what Engineering must do] |

---

## 9. DEPENDENCIES

| Dependency | Status | Owner |
|---|---|---|
| [feature / system / API] | [ready / in development / pending] | [Engineering / external] |

---

## 10. OPEN QUESTIONS

[If there is anything Product could not resolve before handoff, document it here with the resolution plan.]

| Question | Resolution Plan | Owner | Deadline |
|---|---|---|---|
| | | | |

---

## 11. COMMUNICATION CHANNEL DURING THE BUILD

**For functional questions:** [channel: WhatsApp / Slack / email] → PM responds in < 4 hours  
**For UX questions:** [channel] → UI/UX responds in < 4 hours  
**For scope changes:** Notify PM before implementing any variation

---

## 12. HANDOFF SIGN-OFF

```text
PM (delivery): ______________________ Date: _________
Chief Architect (reception): _________ Date: _________

Chief Architect confirms:
[ ] The brief is sufficiently clear to start
[ ] Technical dependencies are identified
[ ] The scope is feasible within the agreed timeline
[ ] Open questions have a resolution plan
```

---

*Save as: PRODUCT_BRIEF_venture_feature_YYYY-MM-DD.md*  
*Archive in: Product↔Engineering shared folder*