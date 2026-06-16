# 📄 TEMPLATE — Product Requirements Document (PRD)

**Instructions:** Complete every section. Do not leave blank fields. If something does not apply, write "N/A" with a reason.  
**Owner:** PM  
**Approval Required:** CPO before moving to UI/UX

---

```text
## METADATA
Feature: ___________________________
Venture: ___________________________
Date Created: ______________________
PM Owner: __________________________
ICE Score: _________________________  [see ice_scoring.md](.harness/product_harness/ice_scoring.md)
Status: [ ] Draft  [ ] Under Review  [ ] Approved by CPO
```

---

## 1. CONTEXT — Why does this matter now?

[2–4 sentences maximum. What is happening in the market, with users, or in the product that makes this feature relevant now. Include any data or feedback that justifies the priority.]

---

## 2. PROBLEM

**The problem in user terms:**  
[Not in system terms. "The user cannot X" not "The system does not support Y".]

**Evidence of the problem:**  
[Real feedback, metric, customer conversation. If it is only an assumption, state so explicitly.]

**Who does it affect?**  
[Specific profile. Approximately how many users.]

---

## 3. TARGET USER

**Profile:**  
[Profile Name + 2-line description. Not "all users".]

**Context of Use:**  
[When they use this, on what device, in what emotional/situational state.]

**What they want to achieve:**  
[The user's actual goal, not the feature itself.]

---

## 4. USER STORY

```text
As a [specific profile],
I want to [concrete action the user can do],
so that [real and measurable benefit they obtain].
```

---

## 5. FUNCTIONAL ACCEPTANCE CRITERIA

[Each criterion must be verifiable. If it cannot be tested, it is not a criterion.]

- [ ] [Criterion 1: The user can do X in fewer than N steps]
- [ ] [Criterion 2: The system confirms the action with Y]
- [ ] [Criterion 3: If it fails, the error message says Z]
- [ ] [Criterion 4: The flow works on channels: ...]
- [ ] [Criterion 5: ...]

---

## 6. SCOPE BOUNDARY — What this feature does NOT include

[Explicit and unambiguous. This prevents scope creep during the build.]

- DOES NOT include: [...]
- DOES NOT include: [...]
- To be considered for a future feature: [...]

---

## 7. PROPOSED FLOW (High Level)

[Textual description of the flow. The UI/UX Specialist will convert this into a detailed flow.]

1. [Step 1: Trigger]
2. [Step 2: What the user sees/does]
3. [...]
N. [Final State: Confirmation to the user]

---

## 8. DEPENDENCIES

| Dependency | Type | Status |
|---|---|---|
| [Feature or system] | [technical / business] | [exists / in development / pending] |

---

## 9. SUCCESS METRIC

**Primary KPI:**  
[Concrete and measurable metric. E.g.: "70% of users complete the flow in < 3 minutes"]

**How it is measured:**  
[Which event, which tool, who reviews it, and when]

**Evaluation Timeframe:**  
[When the feature is considered to have had enough time to show results]

---

## 10. APPROVALS

```text
PM: _________________________ Date: _________
CPO: ________________________ Date: _________
```

---

*Save as: PRD_venture_feature_YYYY-MM-DD.md*

