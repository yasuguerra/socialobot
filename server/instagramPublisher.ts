/**
 * Instagram Graph API publisher.
 *
 * Two-step publish:
 *   1. POST /{ig-user-id}/media           -> returns creation_id (container).
 *   2. POST /{ig-user-id}/media_publish   -> publishes the container.
 *
 * For carousels, create child containers first, then a parent container with
 * `media_type=CAROUSEL` and `children=ID1,ID2,...`.
 */
import { getPlatformConnection } from "./store";
import { decryptToken } from "./crypto";
import type { SocialPost } from "../src/types";

const GRAPH_VERSION = process.env.INSTAGRAM_GRAPH_VERSION || "v21.0";
const GRAPH_BASE = `https://graph.facebook.com/${GRAPH_VERSION}`;

interface PublishResult {
  externalPostId: string;
  publishedAt: string;
}

async function loadIgCredentials(uid: string): Promise<{ token: string; igUserId: string }> {
  const conn = await getPlatformConnection(uid, "Instagram");
  if (!conn || !conn.accessTokenCiphertext || !conn.externalAccountId) {
    throw new Error("Instagram is not connected for this user");
  }
  return { token: decryptToken(conn.accessTokenCiphertext), igUserId: conn.externalAccountId };
}

async function graphPost(path: string, params: Record<string, string>): Promise<any> {
  const url = new URL(`${GRAPH_BASE}${path}`);
  const body = new URLSearchParams(params);
  const res = await fetch(url.toString(), { method: "POST", body });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(`Instagram Graph ${path} failed: ${JSON.stringify(json)}`);
  }
  return json;
}

/**
 * Publish a `SocialPost` to Instagram. The caller is responsible for ensuring
 * `post.mediaUrl` is a publicly fetchable HTTPS URL (e.g. a signed Firebase
 * Storage download URL). Returns the resulting IG media id.
 */
export async function publishToInstagram(uid: string, post: SocialPost): Promise<PublishResult> {
  if (post.platform !== "Instagram") {
    throw new Error(`publishToInstagram called with platform=${post.platform}`);
  }
  if (!post.mediaUrl) {
    throw new Error("Instagram publish requires post.mediaUrl");
  }
  const { token, igUserId } = await loadIgCredentials(uid);

  // Build container.
  const containerParams: Record<string, string> = {
    access_token: token,
    caption: post.caption || "",
  };
  if (post.mediaType === "video") {
    containerParams.media_type = "REELS";
    containerParams.video_url = post.mediaUrl;
  } else {
    containerParams.image_url = post.mediaUrl;
  }

  const container = await graphPost(`/${igUserId}/media`, containerParams);
  const creationId = container.id as string;

  // For videos, IG needs a moment to ingest. Poll status_code until FINISHED.
  if (post.mediaType === "video") {
    await waitForContainerReady(creationId, token);
  }

  // Publish the container.
  const publishRes = await graphPost(`/${igUserId}/media_publish`, {
    access_token: token,
    creation_id: creationId,
  });

  return {
    externalPostId: publishRes.id,
    publishedAt: new Date().toISOString(),
  };
}

async function waitForContainerReady(creationId: string, token: string): Promise<void> {
  const maxAttempts = 20;
  const delayMs = 3000;
  for (let i = 0; i < maxAttempts; i++) {
    const res = await fetch(
      `${GRAPH_BASE}/${creationId}?` +
        new URLSearchParams({ access_token: token, fields: "status_code" }),
    );
    const json = (await res.json()) as { status_code?: string };
    if (json.status_code === "FINISHED") return;
    if (json.status_code === "ERROR" || json.status_code === "EXPIRED") {
      throw new Error(`Instagram container ${creationId} status=${json.status_code}`);
    }
    await new Promise(r => setTimeout(r, delayMs));
  }
  throw new Error(`Instagram container ${creationId} did not finish in time`);
}
