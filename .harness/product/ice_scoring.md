# ⚖️ KPIs — ICE Scoring System

Prioritization system for the backlog. Owner: CPO + PM.

---

## What is ICE?

A simple framework to compare features objectively and reduce "whoever screams loudest" bias.

**ICE = Impact × Confidence × Ease / 10**

---

## The Three Dimensions

### Impact — 1 to 10
How much does this feature move a business metric that matters?

| Score | Description |
|---|---|
| 9–10 | Direct and significant impact on revenue, conversion, or churn |
| 7–8 | Important impact on user retention or activation |
| 5–6 | Improves the experience of a relevant segment of users |
| 3–4 | Real benefit but difficult to measure directly |
| 1–2 | Marginal or cosmetic improvement |

**Key question:** *If this feature did not exist, what business metric would be affected?*

---

### Confidence — 1 to 10
How sure are we that the estimated impact is real?

| Score | Description |
|---|---|
| 9–10 | Explicit feedback from multiple customers + supporting data |
| 7–8 | Feedback from at least one real customer + clear business logic |
| 5–6 | Indirect observation (benchmark, user behavior) |
| 3–4 | Team intuition with some anecdotal evidence |
| 1–2 | Assumption without evidence |

**Key question:** *Do we have real evidence that this problem exists?*

---

### Ease — 1 to 10
How easy is it to implement?

| Score | Description |
|---|---|
| 9–10 | A few hours. No dependencies. One developer. |
| 7–8 | 1–2 days. Minor dependencies. |
| 5–6 | 1 week. Requires some architecture or integration. |
| 3–4 | 2–3 weeks. Relevant technical complexity. |
| 1–2 | Months. High complexity, multiple dependencies. |

**Key question:** *How much Engineering time does this consume?*

---

## How to Calculate the Score

```text
ICE Score = (Impact × Confidence × Ease) / 10
```

**Example:**
- Feature: Simplified onboarding for new customers
- Impact: 8 (directly affects activation)
- Confidence: 7 (2 customers mentioned it in feedback)
- Ease: 6 (requires flow redesign + 3 days of Engineering)
- ICE Score = (8 × 7 × 6) / 10 = **33.6**

---

## Scoring Table for the Backlog

```text
| Feature | Impact | Confidence | Ease | ICE Score | Priority |
|---------|--------|------------|------|-----------|----------|
| [A]     |        |            |      |           |          |
| [B]     |        |            |      |           |          |
| [C]     |        |            |      |           |          |
```

Sort by ICE Score from highest to lowest. The Top 3 enter the sprint.

---

## Score Interpretation

| Range | Interpretation |
|---|---|
| 50–100 | Maximum priority. Do now. |
| 30–49 | High priority. Next sprint. |
| 15–29 | Medium priority. Plan. |
| 5–14 | Low priority. Backlog. |
| < 5 | Discard or freeze. |

---

## Limitations of the ICE Score

- The ICE Score is a supporting tool, not an oracle. The CPO can adjust priority using strategic judgment that the number does not capture.
- Confidence is subjective — always seek to raise it with real data before scoring high.
- Ease is an estimate. Always consult with Engineering if there is doubt.

---

## When NOT to Use ICE

- **Emergencies:** A critical bug or an active churn problem does not go through ICE. It is addressed immediately.
- **Contractual commitments:** If it was promised to a customer, it is fulfilled. ICE documents, it does not block.
- **Strategic CPO features:** If the CPO has a strong conviction based on market vision, they can override the score with documented reasoning.
