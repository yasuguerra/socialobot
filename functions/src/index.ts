/**
 * Cloud Functions for SOCIALOBOT
 *
 * - publishDuePosts: every 5 minutes, publishes any `social_posts` that are
 *   scheduled and whose `scheduledTime` has passed. Real publishing is
 *   currently only wired for Instagram (Meta Graph API v21.0). Other platforms
 *   are marked 'Simulated' so we never report fake success.
 * - refreshAnalytics: hourly. For posts that have a real `externalPostId`,
 *   fetch insights from Meta Graph API and update `analytics.*`.
 *
 * Both functions iterate every user document under /users/{uid} and read
 * their tenant-scoped collections, mirroring the security rules layout.
 */

import { onSchedule } from "firebase-functions/v2/scheduler";
import { logger } from "firebase-functions";
import * as admin from "firebase-admin";
import { createDecipheriv } from "crypto";

const FIRESTORE_DATABASE_ID =
  process.env.FIRESTORE_DATABASE_ID || "ai-studio-b473b1ed-0f34-46b9-82bf-3bc5a87bde13";
const GRAPH_VERSION = process.env.INSTAGRAM_GRAPH_VERSION || "v21.0";

admin.initializeApp();
const db = admin.firestore();
// Use the named (non-default) Firestore database for this project.
(db as unknown as { settings: (s: Record<string, unknown>) => void }).settings({
  databaseId: FIRESTORE_DATABASE_ID,
  ignoreUndefinedProperties: true,
});

function decryptToken(envelope: string): string {
  const keyB64 = process.env.TOKEN_ENCRYPTION_KEY;
  if (!keyB64) throw new Error("TOKEN_ENCRYPTION_KEY missing");
  const key = Buffer.from(keyB64, "base64");
  if (key.length !== 32) throw new Error("TOKEN_ENCRYPTION_KEY must decode to 32 bytes");

  const [ivB64, ctB64, tagB64] = envelope.split(":");
  if (!ivB64 || !ctB64 || !tagB64) throw new Error("Malformed encrypted token");
  const iv = Buffer.from(ivB64, "base64");
  const ct = Buffer.from(ctB64, "base64");
  const tag = Buffer.from(tagB64, "base64");

  const decipher = createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(tag);
  const plain = Buffer.concat([decipher.update(ct), decipher.final()]);
  return plain.toString("utf8");
}

async function graphPost(
  endpoint: string,
  params: Record<string, string>,
): Promise<any> {
  const body = new URLSearchParams(params);
  const url = `https://graph.facebook.com/${GRAPH_VERSION}/${endpoint}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(`Graph POST ${endpoint} failed: ${JSON.stringify(json)}`);
  }
  return json;
}

async function graphGet(
  endpoint: string,
  params: Record<string, string>,
): Promise<any> {
  const qs = new URLSearchParams(params).toString();
  const url = `https://graph.facebook.com/${GRAPH_VERSION}/${endpoint}?${qs}`;
  const res = await fetch(url);
  const json = await res.json();
  if (!res.ok) {
    throw new Error(`Graph GET ${endpoint} failed: ${JSON.stringify(json)}`);
  }
  return json;
}

interface SocialPostDoc {
  id?: string;
  platform: string;
  caption?: string;
  mediaType?: "image" | "video" | "text";
  mediaUrl?: string;
  scheduledTime?: string;
  status?: string;
  externalPostId?: string;
  lastError?: string;
  lastPublishAttempt?: string;
  analytics?: Record<string, unknown>;
}

interface PlatformConnectionDoc {
  platform: string;
  externalAccountId?: string;
  accessTokenCiphertext?: string;
}

async function publishInstagramPost(
  uid: string,
  postRef: FirebaseFirestore.DocumentReference,
  post: SocialPostDoc,
): Promise<void> {
  const connSnap = await db
    .collection("users")
    .doc(uid)
    .collection("platform_connections")
    .doc("Instagram")
    .get();
  if (!connSnap.exists) {
    await postRef.update({
      status: "Failed",
      lastError: "Instagram not connected",
      lastPublishAttempt: new Date().toISOString(),
    });
    return;
  }
  const conn = connSnap.data() as PlatformConnectionDoc;
  if (!conn.accessTokenCiphertext || !conn.externalAccountId) {
    await postRef.update({
      status: "Failed",
      lastError: "Instagram connection missing token or account id",
      lastPublishAttempt: new Date().toISOString(),
    });
    return;
  }

  const accessToken = decryptToken(conn.accessTokenCiphertext);
  const igUserId = conn.externalAccountId;

  const createParams: Record<string, string> = { access_token: accessToken };
  if (post.caption) createParams.caption = post.caption;
  if (post.mediaType === "video" && post.mediaUrl) {
    createParams.media_type = "REELS";
    createParams.video_url = post.mediaUrl;
  } else if (post.mediaType === "image" && post.mediaUrl) {
    createParams.image_url = post.mediaUrl;
  } else {
    await postRef.update({
      status: "Failed",
      lastError: "Post has no valid media type or URL",
      lastPublishAttempt: new Date().toISOString(),
    });
    return;
  }

  const created = await graphPost(`${igUserId}/media`, createParams);
  const creationId = created.id as string;

  // Poll for video readiness.
  if (post.mediaType === "video") {
    for (let i = 0; i < 20; i++) {
      const status = await graphGet(creationId, {
        fields: "status_code",
        access_token: accessToken,
      });
      if (status.status_code === "FINISHED") break;
      if (status.status_code === "ERROR" || status.status_code === "EXPIRED") {
        throw new Error(`Video upload status ${status.status_code}`);
      }
      await new Promise(r => setTimeout(r, 3000));
    }
  }

  const published = await graphPost(`${igUserId}/media_publish`, {
    creation_id: creationId,
    access_token: accessToken,
  });

  await postRef.update({
    status: "Posted",
    externalPostId: published.id,
    lastPublishAttempt: new Date().toISOString(),
    lastError: admin.firestore.FieldValue.delete(),
  });
}

export const publishDuePosts = onSchedule(
  {
    schedule: "every 5 minutes",
    timeZone: "Etc/UTC",
    secrets: ["TOKEN_ENCRYPTION_KEY"],
  },
  async () => {
    const nowIso = new Date().toISOString();
    const users = await db.collection("users").listDocuments();
    let processed = 0;

    for (const userDoc of users) {
      const uid = userDoc.id;
      const due = await userDoc
        .collection("social_posts")
        .where("status", "==", "Scheduled")
        .where("scheduledTime", "<=", nowIso)
        .limit(20)
        .get();

      for (const snap of due.docs) {
        processed++;
        try {
          // Atomic locking transaction to prevent concurrent duplicate publishing (double-posting)
          const postToPublish = await db.runTransaction(async (transaction) => {
            const freshSnap = await transaction.get(snap.ref);
            if (!freshSnap.exists) return null;
            const data = freshSnap.data() as SocialPostDoc;
            if (data.status !== "Scheduled") return null;

            transaction.update(snap.ref, {
              status: "Publishing",
              lastPublishAttempt: new Date().toISOString(),
            });
            return { id: freshSnap.id, ...data };
          });

          if (!postToPublish) {
            continue;
          }

          if (postToPublish.platform === "Instagram") {
            await publishInstagramPost(uid, snap.ref, postToPublish);
          } else {
            // Other platforms: honest simulation.
            await snap.ref.update({
              status: "Simulated",
              lastPublishAttempt: new Date().toISOString(),
            });
          }
        } catch (err) {
          logger.error(`Publish failed for ${uid}/${snap.id}`, err);
          await snap.ref.update({
            status: "Failed",
            lastError: (err as Error).message?.slice(0, 1000) || "publish failed",
            lastPublishAttempt: new Date().toISOString(),
          });
        }
      }
    }

    logger.info(`publishDuePosts processed=${processed}`);
  },
);

async function refreshInstagramAnalytics(
  uid: string,
  postRef: FirebaseFirestore.DocumentReference,
  post: SocialPostDoc,
): Promise<void> {
  if (!post.externalPostId) return;
  const connSnap = await db
    .collection("users")
    .doc(uid)
    .collection("platform_connections")
    .doc("Instagram")
    .get();
  if (!connSnap.exists) return;
  const conn = connSnap.data() as PlatformConnectionDoc;
  if (!conn.accessTokenCiphertext) return;
  const accessToken = decryptToken(conn.accessTokenCiphertext);

  const insights = await graphGet(`${post.externalPostId}/insights`, {
    metric: "reach,likes,comments,shares,saved",
    access_token: accessToken,
  });

  const byName: Record<string, number> = {};
  for (const row of insights.data || []) {
    const val = row.values?.[0]?.value;
    if (typeof val === "number") byName[row.name] = val;
  }

  await postRef.update({
    analytics: {
      reach: byName.reach || 0,
      likes: byName.likes || 0,
      comments: byName.comments || 0,
      shares: byName.shares || 0,
      saves: byName.saved || 0,
      fetchedAt: new Date().toISOString(),
    },
  });
}

export const refreshAnalytics = onSchedule(
  {
    schedule: "every 60 minutes",
    timeZone: "Etc/UTC",
    secrets: ["TOKEN_ENCRYPTION_KEY"],
  },
  async () => {
    const users = await db.collection("users").listDocuments();
    let processed = 0;

    for (const userDoc of users) {
      const uid = userDoc.id;
      const posted = await userDoc
        .collection("social_posts")
        .where("platform", "==", "Instagram")
        .where("status", "==", "Posted")
        .limit(50)
        .get();

      for (const snap of posted.docs) {
        const post = { id: snap.id, ...(snap.data() as SocialPostDoc) };
        processed++;
        try {
          await refreshInstagramAnalytics(uid, snap.ref, post);
        } catch (err) {
          logger.warn(`Analytics refresh failed for ${uid}/${snap.id}`, err);
        }
      }
    }

    logger.info(`refreshAnalytics processed=${processed}`);
  },
);

