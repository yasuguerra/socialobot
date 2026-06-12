# 📊 KPIs — Metrics Framework

How to define and measure product success. Applicable to any venture.

---

## Guiding Principle

> A feature without a success metric is a bet, not a decision.

Every feature approved by the CPO must have, before Engineering starts, a clear answer to: **How will we know if this worked?**

---

## Metric Levels

### Level 1 — Business Metrics (CPO reviews)
The most important. They move revenue or the sustainability of the venture.

| Metric | Description | Signal of Success |
|---|---|---|
| MRR / ARR | Monthly / Annual Recurring Revenue | Grows month over month |
| Conversion Rate | % of leads that convert into paying customers | > sector benchmark |
| Churn | % of customers who cancel in a period | < 5% monthly for SaaS |
| LTV (Lifetime Value) | Average total revenue per customer | LTV > 3x CAC |
| CAC (Customer Acquisition Cost) | Cost of acquiring a new customer | Decreases over time |

### Level 2 — Product Metrics (PM reviews)
Product health indicators. They predict business metrics.

| Metric | Description | When to Use |
|---|---|---|
| Activation | % of new users completing the core action in < 48h | Always |
| Retention D7/D30 | % of active users at 7 and 30 days | Recurring-use products |
| Completion Rate | % of users who complete a specific flow | Onboarding, checkout, setup |
| Time to Value | Time from registration to first value obtained | Products with setup |
| Feature Adoption | % of active users who use a specific feature | Every new feature |

### Level 3 — UX Metrics (Product QA reviews)
Experience indicators. They point out friction before it impacts business metrics.

| Metric | Description | Signal of a Problem |
|---|---|---|
| Abandonment Rate | % of users who start a flow and do not finish it | > 30% in core flows |
| Error Rate | % of action attempts resulting in an error | > 5% |
| Support Tickets per Feature | Number of support queries related to a feature | Increasing |
| Time to Complete Task | Average time to complete the core action | Increases over time |

---

## How to Choose the Right Metric for a Feature

Questions for the PM when writing the PRD:

1. Does this feature directly affect conversion or churn? → Use Level 1 metric
2. Is this feature part of the core usage flow? → Measure completion rate and retention
3. Does this feature replace or improve something existing? → Compare with the current metric as a baseline
4. Is this feature new to users? → Measure adoption rate at 30 days

---

## Defining the Metric in the PRD — Standard Format

```text
KPI: [metric name]
Definition: [exactly what it measures]
Current baseline: [current value if it exists, or "N/A — new feature"]
Target: [expected value at X days]
Measurement method: [which tool, which event, who reviews it, and when]
Review frequency: [daily / weekly / monthly]
Evaluation timeframe: [how many days before drawing conclusions]
```

---

## When a Feature "Failed" and What to Do

| Situation | Probable Diagnosis | Action |
|---|---|---|
| Adoption rate < 20% at 30 days | Users are not discovering the feature or do not see value | Review visibility and UX Writing |
| Completion rate < 50% | There is friction in the flow | Urgent usability audit |
| Support tickets grow | The feature confuses users | Review UX Writing and error messages |
| Business metrics do not move | The feature solved the wrong problem | Review the problem defined in the PRD |

---

## The 30-Day Rule

No feature is definitively evaluated before 30 days of real data. Decisions to discard or pivot require at least this period (unless there is a technical blocker or a critical UX issue).
