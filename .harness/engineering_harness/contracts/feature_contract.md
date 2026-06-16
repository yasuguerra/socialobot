# Feature Contract: Mobile Conversations Usability & Date Display Enhancements

This contract defines the specifications, deliverables, and verification metrics required to implement mobile-responsive styling for the Conversations page and precise chronological date formatting across the platform.

---

## 1. Scope & Deliverables

The deliverables for this feature are:

### 1.1. Contextual Message Timestamp Helper (Dashboard)
- Create and integrate `formatMessageTimestamp(dateStr: string): string` in [platform-dashboard/src/pages/Conversations.tsx](platform-dashboard/src/pages/Conversations.tsx) to provide clear chronological details for messages. It must handle today, yesterday, days of the week, this year, and older years.
- Replace the hours-only formatter with the new helper.

### 1.2. Responsive Edge-to-Edge Layout & Header Autohide
- Configure [platform-dashboard/src/components/Layout.css](platform-dashboard/src/components/Layout.css) to:
  - Slide/stretch the entire `.conversations-root` layout edge-to-edge on screens smaller than `768px` using negative margins (`margin: -16px`).
  - Automatically hide the main page header (`.conv-header`) and stats cards when a specific conversation is active (`.conv-has-selection`), yielding 100% viewport space to actual chatting.

### 1.3. Inline Reply Bar on Mobile
- Adjust the `.conv-input-row` inside [platform-dashboard/src/components/Layout.css](platform-dashboard/src/components/Layout.css) to keep input elements (attachment, emoji, textarea, and send button) nicely aligned in a single horizontal row on mobile (removing the `width: 100%` wrap override).

### 1.4. Contextual Message Timestamp Helper (Web Widget)
- Update the `fmtTime(d: Date)` helper in [platform-widget/src/Widget.tsx](platform-widget/src/Widget.tsx) to dynamically render dates for prior days, keeping behavior and terminology consistent with the admin dashboard.

---

## 2. Verification Metrics (Definition of Done)

- **Verification of Dates**: Messages older than 24 hours must show explicit dates/days of the week instead of just hours in both the Widget and Dashboard.
- **Verification of Mobile Responsiveness**: On viewport screens smaller than `768px`, selecting a conversation must make the chat panel occupy 100% of the viewport under the top bar, with no side margins, hidden title header, and an inline reply bar.
- **Verification of Build Stability**: Executing Vite builds or type check checks completes with zero failures.








