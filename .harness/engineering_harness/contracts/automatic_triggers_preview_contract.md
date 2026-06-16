# Feature Contract: Vista Previa de Secuencias desde Automatic Triggers

This contract defines the specifications, deliverables, and verification metrics required to integrate the sequence preview button within the Automatic Triggers interface in the platform dashboard.

---

## 1. Scope & Deliverables

The deliverables for this feature are:

### 1.1. Automatic Triggers Table Preview Integration
- Add an `👁 Preview` button inside the actions cell of the Automatic Triggers list in [platform-dashboard/src/pages/Settings.tsx](platform-dashboard/src/pages/Settings.tsx).
- When clicked, this button must call `openPreview(t.sequence_id)` to invoke the existing, robust preview modal for the trigger's selected sequence.
- Display styling should follow existing visual patterns (`btn btn-sm` with a light border, font-size 11, and proper margins/gap).

### 1.2. Safeguards for Missing/Orphan Sequences
- Ensure the preview button is safely disabled (or displays with reduced opacity and has a safety check) if the sequence associated with the trigger cannot be found in the current tenant's active list.
- Keep the `openPreview` call safe: `seq && openPreview(seq.id)`.

---

## 2. Verification Metrics (Definition of Done)

- **Verification of Button Rendering**: The `👁 Preview` button must render properly alongside the delete button for every entry in the Automatic Triggers table.
- **Verification of Modal Activation**: Clicking the button must successfully open the standard "Preview Follow-Up" modal with the correct sequence preselected.
- **Verification of Build Stability**: Running type checking and building the dashboard must complete with zero errors.
- **Verification of Robustness**: If a trigger does not have an active matching sequence, the preview action is safely inactive.
