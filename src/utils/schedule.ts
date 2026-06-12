/**
 * Schedule-time utilities.
 *
 * Canonical format for `SocialPost.scheduledTime` and
 * `ContentIdea.recommendedTime` is ISO 8601.
 *
 * Legacy human-readable strings ("Wednesday, 4:00 PM", "Next Thursday")
 * still appear in older docs; `parseScheduleTime` tolerates them by
 * resolving against a configurable "now".
 */

const WEEKDAYS = [
  'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday',
];

const MONTHS = [
  'january', 'february', 'march', 'april', 'may', 'june',
  'july', 'august', 'september', 'october', 'november', 'december',
];

export interface ParsedSchedule {
  date: Date;
  /** True if the source string was already a valid ISO timestamp. */
  isIso: boolean;
}

function parseClockTime(input: string): { hours: number; minutes: number } | null {
  const m = input.match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/i);
  if (!m) return null;
  let hours = parseInt(m[1], 10);
  const minutes = m[2] ? parseInt(m[2], 10) : 0;
  const meridiem = m[3]?.toLowerCase();
  if (meridiem === 'pm' && hours < 12) hours += 12;
  if (meridiem === 'am' && hours === 12) hours = 0;
  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) return null;
  return { hours, minutes };
}

/**
 * Parse a schedule string. Accepts:
 *  - ISO 8601 ("2026-05-26T16:00:00.000Z")
 *  - "May 26, 2026 4:00 PM" / "June 1, 2026"
 *  - "Next Thursday, 4:00 PM" / "Wednesday 9:00 AM"
 *  - "Yesterday", "2 days ago", "Just now"
 *
 * Returns null on unparseable input.
 */
export function parseScheduleTime(
  raw: string | null | undefined,
  now: Date = new Date(),
): ParsedSchedule | null {
  if (!raw) return null;
  const value = raw.trim();
  if (!value) return null;

  // 1. ISO 8601 fast path
  const isoCandidate = new Date(value);
  if (!Number.isNaN(isoCandidate.getTime()) && /^\d{4}-\d{2}-\d{2}T/.test(value)) {
    return { date: isoCandidate, isIso: true };
  }

  const lower = value.toLowerCase();
  const time = parseClockTime(value) ?? { hours: 12, minutes: 0 };

  // 2. "Just now", "Published just now"
  if (lower.includes('just now')) {
    return { date: new Date(now.getTime()), isIso: false };
  }

  // 3. "Yesterday" / "N days ago" / "N hours ago"
  if (lower.includes('yesterday')) {
    const d = new Date(now);
    d.setDate(d.getDate() - 1);
    d.setHours(time.hours, time.minutes, 0, 0);
    return { date: d, isIso: false };
  }
  const daysAgo = lower.match(/(\d+)\s+days?\s+ago/);
  if (daysAgo) {
    const d = new Date(now);
    d.setDate(d.getDate() - parseInt(daysAgo[1], 10));
    d.setHours(time.hours, time.minutes, 0, 0);
    return { date: d, isIso: false };
  }
  const hoursAgo = lower.match(/(\d+)\s+hours?\s+ago/);
  if (hoursAgo) {
    return {
      date: new Date(now.getTime() - parseInt(hoursAgo[1], 10) * 3600_000),
      isIso: false,
    };
  }

  // 4. "Month DD, YYYY" (e.g. "May 26, 2026")
  const monthMatch = lower.match(/([a-z]+)\s+(\d{1,2}),?\s+(\d{4})/);
  if (monthMatch) {
    const monthIdx = MONTHS.indexOf(monthMatch[1]);
    if (monthIdx >= 0) {
      const d = new Date(parseInt(monthMatch[3], 10), monthIdx, parseInt(monthMatch[2], 10));
      d.setHours(time.hours, time.minutes, 0, 0);
      return { date: d, isIso: false };
    }
  }

  // 5. Weekday with optional "Next"
  const isNext = /\bnext\b/.test(lower);
  for (let i = 0; i < WEEKDAYS.length; i++) {
    if (new RegExp(`\\b${WEEKDAYS[i]}\\b`).test(lower)) {
      const d = new Date(now);
      const currentDay = d.getDay();
      let delta = i - currentDay;
      if (delta < 0 || (delta === 0 && isNext) || isNext) {
        if (delta <= 0) delta += 7;
      }
      d.setDate(d.getDate() + delta);
      d.setHours(time.hours, time.minutes, 0, 0);
      return { date: d, isIso: false };
    }
  }

  // 6. Last resort: native Date parser
  const fallback = new Date(value);
  if (!Number.isNaN(fallback.getTime())) {
    return { date: fallback, isIso: false };
  }
  return null;
}

/** Convenience: return a Date or null. */
export function toDate(raw: string | null | undefined, now: Date = new Date()): Date | null {
  return parseScheduleTime(raw, now)?.date ?? null;
}

/** Format a Date for compact UI display ("Wed May 27, 4:00 PM"). */
export function formatDisplay(date: Date): string {
  return date.toLocaleString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

/** Returns the ISO string for `Date` in UTC. */
export function toIso(date: Date): string {
  return date.toISOString();
}
