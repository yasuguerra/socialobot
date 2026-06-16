# 🔍 AUDIT — Usability Audit: Mobile Conversations & Date/Time Display

This usability audit evaluates the mobile responsiveness and conversational UX of the Seliabot tenant dashboard and public-facing chat widget.

---

## AUDIT REPORT

```text
Feature: Mobile Conversations & Chat Date/Time Display
Venture: Seliabot Platform
Date: June 14, 2026
Type: [ ] Conceptual (pre-build)   [X] Post-build / Refactoring
Auditor: Product QA & Usability Team
```

---

## SECTION 1 — CLARITY (Does the user understand what is happening?)

| # | Criterion | ✅ / ❌ / N/A | Severity | Note |
|---|---|---|---|---|
| 1.1 | The user understands what this feature does in < 3 seconds | ✅ | N/A | Conversations interface is standard. |
| 1.2 | The main CTA is visually obvious (position, contrast, text) | ✅ | N/A | "Take Control" and "Hand back to AI" buttons are visible. |
| 1.3 | There are no interface elements without a clear purpose | ✅ | N/A | Clean icons and buttons. |
| 1.4 | The title or header of each screen describes what the user can do | ✅ | N/A | |
| 1.5 | The visual hierarchy guides the user to the next step without thinking | ❌ | 🟠 Important | **Fixed:** Missing conversation date info for messages from prior days led to confusion about message chronology. |

---

## SECTION 2 — FLOW (Is the path to the goal direct?)

| # | Criterion | ✅ / ❌ / N/A | Severity | Note |
|---|---|---|---|---|
| 2.1 | The flow has no unnecessary steps that can be eliminated | ✅ | N/A | Direct master-detail navigation. |
| 2.2 | The user is never "stuck" without knowing what to do | ✅ | N/A | |
| 2.3 | Loading/wait states are visually communicated | ✅ | N/A | spinner on detail page is good. |
| 2.4 | The final state of the flow confirms that the action was completed | ✅ | N/A | |
| 2.5 | The user can go back without losing progress | ✅ | N/A | Back button on mobile slides back to list. |
| 2.6 | The number of steps to the goal does not exceed what is reasonable for the task | ✅ | N/A | |

---

## SECTION 3 — ERRORS & EDGE CASES

| # | Criterion | ✅ / ❌ / N/A | Severity | Note |
|---|---|---|---|---|
| 3.1 | Error messages are understandable for a non-technical user | ✅ | N/A | Standard alert banners. |
| 3.2 | Errors say WHAT went wrong AND HOW to fix it | ✅ | N/A | |
| 3.3 | The error flow allows recovery without restarting from scratch | ✅ | N/A | |
| 3.4 | Form fields validate in real-time (not just upon submission) | ✅ | N/A | Textarea autosizes and send button disables if empty. |
| 3.5 | The empty state (zero state) has clear instructions | ✅ | N/A | "Select a conversation" prompt. |

---

## SECTION 4 — CONSISTENCY

| # | Criterion | ✅ / ❌ / N/A | Severity | Note |
|---|---|---|---|---|
| 4.1 | The tone of the copy is consistent with the brand voice | ✅ | N/A | |
| 4.2 | Visual patterns are consistent with the rest of the product | ✅ | N/A | |
| 4.3 | Behavior is the same across all relevant channels | ❌ | 🟠 Important | **Fixed:** Both Web Widget and Dashboard omitted dates in their message list and bubble metadata, showing only time. |
| 4.4 | The terminology used in the UI is consistent (does not mix synonyms) | ✅ | N/A | |

---

## SECTION 5 — EXPERIENCE (How does it feel to use?)

| # | Criterion | ✅ / ❌ / N/A | Severity | Note |
|---|---|---|---|---|
| 5.1 | The flow works as well on mobile as on desktop | ❌ | 🔴 Blocking | **Fixed:** Multiple severe responsive clashing bugs made mobile chatting feel highly cramped, incomplete, and non-native. |
| 5.2 | There is immediate feedback after each user action | ✅ | N/A | |
| 5.3 | Is there a moment of delight? Or is it just functional? | ✅ | N/A | Smooth panel slide/switch transitions. |
| 5.4 | A non-technical user can complete the flow without external help | ✅ | N/A | |
| 5.5 | A rushed user can complete the flow without reading all the text | ✅ | N/A | |

---

## DETAILED FINDINGS

### Finding 1: Lack of Historical Dates in Chat Messages
* **ID**: #1
* **Section**: Section 1 & Section 4
* **Affected Criterion**: 1.5, 4.3
* **Severity**: 🟠 Important
* **Screen/Step**: Chat bubble list (both Widget & Platform Dashboard Conversations Page)
* **Description**: Message timestamp only printed `.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })`, totally stripping any date context.
* **User Impact**: Users were completely blind to the exact day/date of previous messages, thinking a message from "Yesterday 3:00 PM" occurred "Today 3:00 PM".
* **Proposed Solution**: Created a robust, localized date/time helper `formatMessageTimestamp` to dynamically render "Today, [Time]", "Yesterday, [Time]", "[DayOfWeek], [Time]" (for past week), and "[Month Day], [Time]" or "[Year/Month/Day], [Time]" for older histories.

### Finding 2: Squished Viewport Height on Mobile (Layout vs Conversations collision)
* **ID**: #2
* **Section**: Section 5
* **Affected Criterion**: 5.1
* **Severity**: 🟠 Important
* **Screen/Step**: Conversations main page layout on mobile (max-width: 768px)
* **Description**: `.conversations-root` had `height: calc(100dvh - 120px) !important` set in `Layout.css`, causing a huge waste of vertical space on mobile viewports.
* **User Impact**: On iOS Safari and Chrome mobile, the message view area was extremely short, forcing users to scroll excessively to read only a few words.
* **Proposed Solution**: Adjusted the mobile height to occupy full vertical space (`calc(100dvh - 56px)`).

### Finding 3: Header and Stats Cards Pushing Chat Pane Down on Mobile
* **ID**: #3
* **Section**: Section 5
* **Affected Criterion**: 5.1
* **Severity**: 🔴 Blocking
* **Screen/Step**: Active mobile chat conversation pane
* **Description**: When a tenant selected a chat on mobile, the dashboard page header ("Conversations") and active/AI/human count cards remained visible, taking up more than 40% of the screen height.
* **User Impact**: The chat window was squished into the bottom 60% of the screen, making it practically unusable when the soft keyboard popped up.
* **Proposed Solution**: Hid the page header and stat cards on mobile (`.conversations-root.conv-has-selection .conv-header { display: none !important; }`) when a conversation is active, giving the conversation panel 100% of the viewport.

### Finding 4: Inset Padding & Margins on Mobile
* **ID**: #4
* **Section**: Section 5
* **Affected Criterion**: 5.1
* **Severity**: 🟡 Minor
* **Screen/Step**: Dashboard main workspace body
* **Description**: Dashboard `.main-content` padding (`0 16px 16px`) caused the mobile conversation window to appear floating with 16px margins, looking like a card rather than a native screen.
* **User Impact**: Wasted valuable screen width, causing text lines to wrap too early.
* **Proposed Solution**: Added negative margins (`margin: -16px`) to `.conversations-root` to override padding and make the chat pane go beautifully edge-to-edge on mobile.

### Finding 5: Giant Wrapped Send Button below Input Area
* **ID**: #5
* **Section**: Section 5
* **Affected Criterion**: 5.1
* **Severity**: 🟠 Important
* **Screen/Step**: Reply bar message input
* **Description**: `Layout.css` forced `.conv-input-row .btn` to be `width: 100%` on mobile screens, wrapping the send button into its own line below the textarea.
* **User Impact**: Very clunky typing experience, completely divergent from standard chat app interfaces (like WhatsApp or iMessage) where input and send buttons remain on the same line.
* **Proposed Solution**: Disabled full-width wrap on mobile, keeping the input elements neatly aligned in a single line.

---

## FINAL AUDIT RESULT: PASS WITH APPLIED FIXES

Our engineering and QA teams have **successfully corrected all identified issues**!
All adjustments are live and fully verified under unit and responsive simulation.
- Historical date details are now perfectly clear in both the **Client Web Widget** and **Tenant Conversations panel**.
- Mobile conversational experience is now fully optimized, distraction-free (full screen), and goes edge-to-edge.
