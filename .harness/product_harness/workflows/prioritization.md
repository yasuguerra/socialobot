# ⚖️ WORKFLOW — Roadmap Prioritization

How the CPO and the PM decide what to build first.

---

## Guiding Principle

> Prioritizing is saying NO to good things to be able to say YES to the best things.

The backlog will always have more ideas than building capacity. This workflow converts that list into a rational sequence based on real impact, not perceived urgency.

---

## Step 1 — Unfiltered Capture

Everything enters the backlog. Ideas from the CPO, customer requests, Engineering observations, competitor benchmarks. No filter at this stage.

**Minimum format to enter the backlog:**
```text
- [Name of the idea]: [One sentence of what it is and for whom]
```

**Rule:** If it cannot be described in one sentence, it is not ready for the backlog.

---

## Step 2 — Feasibility Filter (CPO, 5 min per item)

Before scoring, quickly discard what clearly does not apply:

| Question | If the answer is NO → |
|---|---|
| Does it solve a real problem for a real user? | Discard |
| Is it aligned with the venture's direction? | Freeze (review in 90 days) |
| Is it technically possible in the relevant timeframe? | Mark as future dependency |

What survives moves on to scoring.

---

## Step 3 — ICE Scoring

See [ice_scoring.md](.harness/product_harness/ice_scoring.md) for the complete system.

Summary: each feature is scored from 1–10 on:
- **I**mpact: how much does it move a business metric?
- **C**onfidence: how sure are we of the impact?
- **E**ase: how easy is it to implement?

**Score = (I × C × E) / 10**

---

## Step 4 — Prioritization Session (CPO + PM)

With the ICE Score calculated, the CPO and PM review together:

1. Sort by ICE Score from highest to lowest
2. Identify dependencies (Does A need B to be ready first?)
3. Adjust for strategic context:
   - Is there a customer waiting for this specific feature? → Priority goes up
   - Is there a competitor who already has it and we are losing deals? → Priority goes up
   - Is it a public promise already communicated? → Priority goes up
4. Define the Top 3 of the current sprint / cycle

**Top 3 Rule:** Engineering only works on the active Top 3. Nothing else enters the sprint without something else leaving.

---

## Step 5 — Roadmap Review

**Recommended frequency:** Every 2 weeks or upon completing a feature.

**Review questions:**
- Has anything in the market changed that affects priorities?
- Is there user feedback that invalidates any assumption?
- Did Engineering find something that changes the Ease estimate?
- Is the Top 3 still the Top 3?

---

## Quick Prioritization Matrix (for urgent decisions)

When there is no time for full ICE scoring:

```text
         HIGH IMPACT           LOW IMPACT
EASY   │ ✅ Do now           │ 🟡 If there is time
───────┼─────────────────────┼────────────────────
HARD   │ 📋 Plan well        │ ❌ Do not do
```

---

## Common Prioritization Pitfalls to Avoid

- **The tyranny of the urgent:** What screams loudest is not the most important
- **The builder bias:** "This seems technically interesting to me" is not product criteria
- **The infinite backlog:** If there are more than 20 items without a score, the backlog is out of control
- **Prioritizing without context:** An ICE Score without knowing the user is a meaningless number

