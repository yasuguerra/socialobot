# CONFLICT RESOLUTION
# Veto hierarchy and conflict resolution between roles.
# This file must be loaded alongside any active role.

---

## VETO HIERARCHY

When two roles are in conflict, this hierarchy applies from highest to lowest authority:

```
1. Security Architect     → absolute veto on security matters
2. CTO                    → veto on business and strategic alignment
3. Chief Architect        → veto on architectural decisions
4. Entropy Auditor        → veto on unacceptable complexity
5. QA Engineer            → block if tests do not pass
6. Release Governor       → block if deployment is not ready
7. Principal Engineer     → executes, does not veto
```

---

## CONFLICT RULES

### Rule 1 — Security is non-negotiable
A veto from the Security Architect **blocks even the approval of the CTO**.
There is no security override for business urgency.
If there is pressure to bypass security, the CTO must document it in `decision_log.md`
as an explicitly accepted risk.

### Rule 2 — Architecture requires re-planning, not an override
A rejection from the Chief Architect cannot be ignored by the CTO.
It must trigger a new iteration of `plan.md`.
The CTO can set priorities but cannot force incorrect architecture.

### Rule 3 — Failed QA blocks release
If `qa_report.md` has failures, the Release Governor cannot approve.
There is no "release with test debt" except for a documented hotfix.

### Rule 4 — Entropy Auditor can reject, cannot block indefinitely
A rejection from the Entropy Auditor triggers a simplification iteration.
If the Principal Engineer can prove that the complexity is necessary,
the Chief Architect arbitrates the final decision.

### Rule 5 — The CTO arbitrates conflicts not covered by the above rules
Any conflict between roles that is not resolved by this hierarchy
escapes to the CTO, who decides and documents it in `decision_log.md`.

---

## CROSS-HARNESS GOVERNANCE (PRODUCT ↔ ENGINEERING)

When conflicts arise between the Product Harness (led by the CPO) and the Engineering Harness (led by the CTO), the following rules apply:

1. **Scope vs. Capacity**: The CPO cannot force a feature start if the CTO provides documented capacity constraints. Conversely, the CTO cannot select features; they must negotiate scope reduction with the PM/CPO based on prioritization and metrics.
2. **Usability & Quality Blockers**: If Product QA issues a RED (🔴) severity finding on a build, the CPO holds absolute veto over deployment. The CTO cannot override this veto to launch.
3. **Security Veto**: If the Security Architect flags a high/critical vulnerability, the CTO has an absolute veto on the feature start or deploy. The CPO cannot override security for business urgency.

---

## ESCALATION PROTOCOL

```
Conflict detected
       ↓
Is it covered by veto hierarchy?
       ↓ Yes                    ↓ No
  Apply rule              Escalate to CTO
       ↓                        ↓
  Document in            CTO decides and documents
  decision_log.md        in decision_log.md
```

---

## SPECIAL CASES

### Production Hotfix
In a hotfix, the flow is accelerated, but the Security Architect
remains mandatory. There is no hotfix without a security review.

### Accepted Technical Debt
If technical debt is accepted due to time pressure, it must:
1. Be documented in `decision_log.md` with a date
2. Have a follow-up ticket created
3. Have a committed resolution date

### Disagreement with the User
If the user requests something that violates the core principles of the harness,
the CTO communicates it respectfully, explains the risk, and documents
the user's final decision in `decision_log.md`.
