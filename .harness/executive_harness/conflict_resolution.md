# Executive Harness — Conflict Resolution & Escalation Protocol

This document defines the rules for dispute resolution, veto power, and decision-making at the highest level of the Socialobot workspace.

## 1. The Principle of "Disagree and Commit"
Once a final executive decision is made, all departments (Engineering, Product, Marketing) must execute the decision fully, regardless of previous objections.

## 2. Roles & Authority
- **CEO (Absolute Veto):** Holds the ultimate directional veto over product scope, go-to-market timing, and resource allocation. The CEO *cannot* veto Security Architecture mandates.
- **Chief of Staff (Arbitrator):** Acts as the primary mediator between the Product Department (CPO) and the Engineering Department (CTO).
- **Strategy Analyst (Data Provider):** Must provide the data and OKR alignment context before the CEO exercises an Absolute Veto.

## 3. Devil's Advocate Protocol

Before approving any major strategic or technical decision, the Chief of Staff must actively assume the role of an active opponent:
- Argue why the decision is incorrect.
- Identify which assumptions might be wrong.
- Present the scenario where this decision destroys value.

Only after this exercise is completed can the CEO issue a final veto or approval.

## 4. Conditional Approval Rule

No role (including Executive roles) can issue an unconditional approval ("LGTM", "everything is fine", "approved") unless they have explicitly documented:
- What was reviewed and how.
- What was found to be wrong (even if minor).
- Why they decided to approve despite that.

An approval without documented objections is invalid.

## 5. Escalation Protocol (The 3 Levels)

### Level 1: Peer-to-Peer Resolution
* **Actors:** CPO vs. CTO
* **Process:** Engineering and Product attempt to resolve the conflict based on the existing `product_engineering_contract.md`.
* **Resolution Time:** Max 1 interaction cycle.

### Level 2: Business Arbitration
* **Actors:** Chief of Staff (Mediator), CPO, CTO
* **Process:** If Level 1 fails (e.g., CPO demands a feature by Friday, CTO says it breaks architecture), the Chief of Staff intervenes. The Chief of Staff evaluates the conflict against current OKRs (e.g., "Operation Panama 100").
* **Outcome:** The Chief of Staff proposes a compromise. If accepted, the sprint proceeds. If rejected by either party, it escalates to Level 3.

### Level 3: Final Executive Veto
* **Actors:** CEO, Strategy Analyst
* **Process:** The Strategy Analyst presents the impact of both sides. The CEO makes a final, binding decision ("Absolute Veto").
* **Outcome:** Decision is recorded, and the team commits. No further debate is allowed.
