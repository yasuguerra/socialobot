/**
 * Migration: convert legacy free-form `scheduledTime` strings on `social_posts`
 * (e.g. "Tomorrow 10am", "Friday 6pm") into ISO-8601 timestamps using
 * `src/utils/schedule.ts#parseScheduleTime`. Idempotent — already-ISO values
 * are left alone. Runs against the tenant-scoped /users/{uid}/social_posts
 * subcollections.
 *
 * Usage (Windows PowerShell):
 *   $env:FIREBASE_SERVICE_ACCOUNT_JSON = (Get-Content sa.json -Raw | ConvertTo-Base64Url)
 *   npx tsx scripts/migrate-scheduled-times.ts
 *
 * Flags:
 *   --dry         List planned updates without writing.
 *   --uid <id>    Limit migration to a single user.
 */

import "dotenv/config";
import { adminDb } from "../server/admin";
import { parseScheduleTime, toIso } from "../src/utils/schedule";

const argv = process.argv.slice(2);
const dryRun = argv.includes("--dry");
const uidIdx = argv.indexOf("--uid");
const targetUid = uidIdx >= 0 ? argv[uidIdx + 1] : null;

function isIso(value: unknown): boolean {
  if (typeof value !== "string") return false;
  // Basic ISO-8601 sniff. parseScheduleTime returns a Date for ISO inputs too,
  // so we use a regex to skip the rewrite when the string is already canonical.
  return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(value);
}

async function migrateUser(uid: string): Promise<{ scanned: number; updated: number; skipped: number; failed: number }> {
  const snap = await adminDb.collection("users").doc(uid).collection("social_posts").get();
  let updated = 0;
  let skipped = 0;
  let failed = 0;
  for (const doc of snap.docs) {
    const data = doc.data();
    const current = data.scheduledTime;
    if (current === undefined || current === null || current === "") {
      skipped++;
      continue;
    }
    if (isIso(current)) {
      skipped++;
      continue;
    }
    try {
      const parsed = parseScheduleTime(String(current));
      if (!parsed) {
        console.warn(`[${uid}/${doc.id}] could not parse: ${current}`);
        failed++;
        continue;
      }
      const iso = toIso(parsed.date);
      console.log(`[${uid}/${doc.id}] "${current}" -> ${iso}`);
      if (!dryRun) {
        await doc.ref.update({ scheduledTime: iso });
      }
      updated++;
    } catch (err: any) {
      console.error(`[${uid}/${doc.id}] error: ${err.message}`);
      failed++;
    }
  }
  return { scanned: snap.size, updated, skipped, failed };
}

async function main(): Promise<void> {
  const users = targetUid
    ? [{ id: targetUid }]
    : (await adminDb.collection("users").listDocuments()).map(r => ({ id: r.id }));

  let totalScanned = 0;
  let totalUpdated = 0;
  let totalSkipped = 0;
  let totalFailed = 0;
  for (const u of users) {
    const r = await migrateUser(u.id);
    totalScanned += r.scanned;
    totalUpdated += r.updated;
    totalSkipped += r.skipped;
    totalFailed += r.failed;
  }
  console.log(
    `Done. users=${users.length} scanned=${totalScanned} updated=${totalUpdated} skipped=${totalSkipped} failed=${totalFailed} dryRun=${dryRun}`,
  );
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
