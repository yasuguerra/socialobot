"use strict";
/**
 * Cloud Functions for SOCIAL.FLOW
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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshAnalytics = exports.publishDuePosts = void 0;
const scheduler_1 = require("firebase-functions/v2/scheduler");
const firebase_functions_1 = require("firebase-functions");
const admin = __importStar(require("firebase-admin"));
const crypto_1 = require("crypto");
const FIRESTORE_DATABASE_ID = process.env.FIRESTORE_DATABASE_ID || "ai-studio-b473b1ed-0f34-46b9-82bf-3bc5a87bde13";
const GRAPH_VERSION = process.env.INSTAGRAM_GRAPH_VERSION || "v21.0";
admin.initializeApp();
const db = admin.firestore();
// Use the named (non-default) Firestore database for this project.
db.settings({
    databaseId: FIRESTORE_DATABASE_ID,
    ignoreUndefinedProperties: true,
});
function decryptToken(envelope) {
    const keyB64 = process.env.TOKEN_ENCRYPTION_KEY;
    if (!keyB64)
        throw new Error("TOKEN_ENCRYPTION_KEY missing");
    const key = Buffer.from(keyB64, "base64");
    if (key.length !== 32)
        throw new Error("TOKEN_ENCRYPTION_KEY must decode to 32 bytes");
    const [ivB64, ctB64, tagB64] = envelope.split(":");
    if (!ivB64 || !ctB64 || !tagB64)
        throw new Error("Malformed encrypted token");
    const iv = Buffer.from(ivB64, "base64");
    const ct = Buffer.from(ctB64, "base64");
    const tag = Buffer.from(tagB64, "base64");
    const decipher = (0, crypto_1.createDecipheriv)("aes-256-gcm", key, iv);
    decipher.setAuthTag(tag);
    const plain = Buffer.concat([decipher.update(ct), decipher.final()]);
    return plain.toString("utf8");
}
async function graphPost(endpoint, params) {
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
async function graphGet(endpoint, params) {
    const qs = new URLSearchParams(params).toString();
    const url = `https://graph.facebook.com/${GRAPH_VERSION}/${endpoint}?${qs}`;
    const res = await fetch(url);
    const json = await res.json();
    if (!res.ok) {
        throw new Error(`Graph GET ${endpoint} failed: ${JSON.stringify(json)}`);
    }
    return json;
}
async function publishInstagramPost(uid, postRef, post) {
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
    const conn = connSnap.data();
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
    const createParams = { access_token: accessToken };
    if (post.caption)
        createParams.caption = post.caption;
    if (post.mediaType === "video" && post.mediaUrl) {
        createParams.media_type = "REELS";
        createParams.video_url = post.mediaUrl;
    }
    else if (post.mediaType === "image" && post.mediaUrl) {
        createParams.image_url = post.mediaUrl;
    }
    else {
        await postRef.update({
            status: "Failed",
            lastError: "Post has no valid media type or URL",
            lastPublishAttempt: new Date().toISOString(),
        });
        return;
    }
    const created = await graphPost(`${igUserId}/media`, createParams);
    const creationId = created.id;
    // Poll for video readiness.
    if (post.mediaType === "video") {
        for (let i = 0; i < 20; i++) {
            const status = await graphGet(creationId, {
                fields: "status_code",
                access_token: accessToken,
            });
            if (status.status_code === "FINISHED")
                break;
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
exports.publishDuePosts = (0, scheduler_1.onSchedule)({
    schedule: "every 5 minutes",
    timeZone: "Etc/UTC",
    secrets: ["TOKEN_ENCRYPTION_KEY"],
}, async () => {
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
                    if (!freshSnap.exists)
                        return null;
                    const data = freshSnap.data();
                    if (data.status !== "Scheduled")
                        return null;
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
                }
                else {
                    // Other platforms: honest simulation.
                    await snap.ref.update({
                        status: "Simulated",
                        lastPublishAttempt: new Date().toISOString(),
                    });
                }
            }
            catch (err) {
                firebase_functions_1.logger.error(`Publish failed for ${uid}/${snap.id}`, err);
                await snap.ref.update({
                    status: "Failed",
                    lastError: err.message?.slice(0, 1000) || "publish failed",
                    lastPublishAttempt: new Date().toISOString(),
                });
            }
        }
    }
    firebase_functions_1.logger.info(`publishDuePosts processed=${processed}`);
});
async function refreshInstagramAnalytics(uid, postRef, post) {
    if (!post.externalPostId)
        return;
    const connSnap = await db
        .collection("users")
        .doc(uid)
        .collection("platform_connections")
        .doc("Instagram")
        .get();
    if (!connSnap.exists)
        return;
    const conn = connSnap.data();
    if (!conn.accessTokenCiphertext)
        return;
    const accessToken = decryptToken(conn.accessTokenCiphertext);
    const insights = await graphGet(`${post.externalPostId}/insights`, {
        metric: "reach,likes,comments,shares,saved",
        access_token: accessToken,
    });
    const byName = {};
    for (const row of insights.data || []) {
        const val = row.values?.[0]?.value;
        if (typeof val === "number")
            byName[row.name] = val;
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
exports.refreshAnalytics = (0, scheduler_1.onSchedule)({
    schedule: "every 60 minutes",
    timeZone: "Etc/UTC",
    secrets: ["TOKEN_ENCRYPTION_KEY"],
}, async () => {
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
            const post = { id: snap.id, ...snap.data() };
            processed++;
            try {
                await refreshInstagramAnalytics(uid, snap.ref, post);
            }
            catch (err) {
                firebase_functions_1.logger.warn(`Analytics refresh failed for ${uid}/${snap.id}`, err);
            }
        }
    }
    firebase_functions_1.logger.info(`refreshAnalytics processed=${processed}`);
});
//# sourceMappingURL=index.js.map