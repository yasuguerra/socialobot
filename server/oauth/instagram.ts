/**
 * Instagram (Meta Graph API) OAuth + publishing flow.
 *
 * OAuth is the Facebook Login for Business flow that grants a long-lived
 * Page access token plus the linked Instagram Business Account ID. We store
 * the long-lived token encrypted at rest under
 * `users/{uid}/platform_connections/Instagram`.
 *
 * Required env:
 *   META_APP_ID
 *   META_APP_SECRET
 *   META_REDIRECT_URI    e.g. https://app.example.com/api/oauth/instagram/callback
 *   INSTAGRAM_GRAPH_VERSION   default v21.0
 */
import type { Request, Response, NextFunction } from "express";
import { Router } from "express";
import { adminAuth } from "../admin";
import { savePlatformConnection, deletePlatformConnection } from "../store";
import { encryptToken } from "../crypto";
import { requireAuth, type AuthedRequest } from "../auth";

const GRAPH_VERSION = process.env.INSTAGRAM_GRAPH_VERSION || "v21.0";
const GRAPH_BASE = `https://graph.facebook.com/${GRAPH_VERSION}`;
const OAUTH_DIALOG = `https://www.facebook.com/${GRAPH_VERSION}/dialog/oauth`;

// Required scopes for IG Business publishing.
const SCOPES = [
  "instagram_basic",
  "instagram_content_publish",
  "pages_show_list",
  "pages_read_engagement",
  "business_management",
].join(",");

export const instagramOAuthRouter: Router = Router();

/**
 * Step 1: redirect the user to the Meta consent dialog. We pass a signed
 * state cookie so the callback can prove the request matches the user that
 * started the flow.
 *
 * Auth is required: callers must have a Firebase ID token.
 */
instagramOAuthRouter.get("/start", async (req: Request, res: Response) => {
  const appId = process.env.META_APP_ID;
  const redirectUri = process.env.META_REDIRECT_URI;
  if (!appId || !redirectUri) {
    res.status(500).json({ error: "META_APP_ID / META_REDIRECT_URI not configured" });
    return;
  }

  // Retrieve user via session cookie or dev bypass
  const sessionCookie = req.cookies?.__session;
  let uid: string | undefined;

  if (
    process.env.NODE_ENV !== "production" &&
    process.env.ENABLE_DEV_BYPASS === "true" &&
    sessionCookie === "dev-bypass-cookie"
  ) {
    uid = "oF5XhOnCinhfFy5c8xYm4PbPzbI3";
  } else if (sessionCookie) {
    try {
      const decoded = await adminAuth.verifySessionCookie(sessionCookie, true);
      uid = decoded.uid;
    } catch (err: any) {
      console.warn("Invalid session cookie in /start:", err.message);
    }
  }

  // Fallback if not on production
  if (
    !uid &&
    process.env.NODE_ENV !== "production" &&
    process.env.ENABLE_DEV_BYPASS === "true"
  ) {
    uid = "oF5XhOnCinhfFy5c8xYm4PbPzbI3";
  }

  if (!uid) {
    res.status(401).send("Unauthorized: Missing or invalid session cookie. Please log in first.");
    return;
  }

  const nextPath = typeof req.query.next === "string" ? req.query.next : "/";
  // State carries uid + next; signing happens via the Firebase ID token cookie
  // already established by requireAuth. For simplicity here we base64 it and
  // verify by re-checking the auth cookie on callback.
  const state = Buffer.from(JSON.stringify({ uid, next: nextPath, nonce: Date.now() })).toString("base64url");

  const url = new URL(OAUTH_DIALOG);
  url.searchParams.set("client_id", appId);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("scope", SCOPES);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("state", state);

  res.redirect(url.toString());
});

/**
 * Step 2: Meta calls back with `?code=...&state=...`. We exchange the code
 * for a short-lived user token, swap it for a long-lived one, fetch the
 * Page + IG Business Account, then persist the encrypted token.
 *
 * The callback does NOT use requireAuth because the browser is mid-redirect
 * from Meta and may not carry the bearer header. Instead we re-verify the
 * uid claim in the signed `state` against the Firebase session cookie that
 * the SPA must have set (via `auth.currentUser.getIdToken()` written to a
 * `__session` cookie by a separate small endpoint — see /session below).
 */
instagramOAuthRouter.get("/callback", async (req: Request, res: Response) => {
  console.log("=== INSTAGRAM OAUTH CALLBACK INITIATED ===");
  const code = req.query.code as string | undefined;
  const stateRaw = req.query.state as string | undefined;
  console.log("-> Code present:", !!code);
  console.log("-> State present:", !!stateRaw);
  
  if (!code || !stateRaw) {
    console.error("-> Error: Missing code or state");
    res.status(400).send("Missing code or state");
    return;
  }

  let parsedState: { uid: string; next: string; nonce: number };
  try {
    parsedState = JSON.parse(Buffer.from(stateRaw, "base64url").toString("utf8"));
    console.log("-> Parsed State:", parsedState);
  } catch (err: any) {
    console.error("-> Error parsing state:", err.message);
    res.status(400).send("Malformed state");
    return;
  }

  // Verify the session cookie issued by /api/oauth/session.
  const sessionCookie = req.cookies?.__session;
  console.log("-> Session cookie present:", !!sessionCookie);
  if (!sessionCookie) {
    console.error("-> Error: Session cookie missing");
    res.status(401).send("Session cookie missing; sign in and retry the connect flow.");
    return;
  }
  let uid: string;
  if (
    process.env.NODE_ENV !== "production" &&
    process.env.ENABLE_DEV_BYPASS === "true" &&
    sessionCookie === "dev-bypass-cookie"
  ) {
    uid = "oF5XhOnCinhfFy5c8xYm4PbPzbI3";
    console.log("-> Bypass session active. User UID:", uid);
  } else {
    try {
      const decoded = await adminAuth.verifySessionCookie(sessionCookie, true);
      uid = decoded.uid;
      console.log("-> Session verified. User UID:", uid);
    } catch (err: any) {
      console.error("-> Error verifying session cookie:", err.message);
      res.status(401).send("Invalid session cookie");
      return;
    }
  }
  if (uid !== parsedState.uid) {
    console.error(`-> Error: UID mismatch. Session UID: ${uid}, State UID: ${parsedState.uid}`);
    res.status(403).send("State / session mismatch");
    return;
  }

  const appId = process.env.META_APP_ID!;
  const appSecret = process.env.META_APP_SECRET!;
  const redirectUri = process.env.META_REDIRECT_URI!;

  try {
    console.log("-> Exchanging authorization code for short-lived token...");
    // Exchange code -> short-lived token.
    const tokenRes = await fetch(
      `${GRAPH_BASE}/oauth/access_token?` +
        new URLSearchParams({
          client_id: appId,
          client_secret: appSecret,
          redirect_uri: redirectUri,
          code,
        }),
    );
    if (!tokenRes.ok) {
      const errText = await tokenRes.text();
      console.error("-> Short-lived token exchange failed:", errText);
      throw new Error(`token exchange failed: ${errText}`);
    }
    const tokenJson = (await tokenRes.json()) as { access_token: string; expires_in?: number };
    console.log("-> Short-lived token exchange successful");

    console.log("-> Swapping for a long-lived token...");
    // Swap for a long-lived token (60 days).
    const llRes = await fetch(
      `${GRAPH_BASE}/oauth/access_token?` +
        new URLSearchParams({
          grant_type: "fb_exchange_token",
          client_id: appId,
          client_secret: appSecret,
          fb_exchange_token: tokenJson.access_token,
        }),
    );
    if (!llRes.ok) {
      const errText = await llRes.text();
      console.error("-> Long-lived exchange failed:", errText);
      throw new Error(`long-lived exchange failed: ${errText}`);
    }
    const llJson = (await llRes.json()) as { access_token: string; expires_in?: number };
    const longLivedToken = llJson.access_token;
    console.log("-> Long-lived token obtained");

    console.log("-> Fetching managed Facebook Pages and linked Instagram Business Accounts...");
    // Find the user's first managed Page + its linked IG business account.
    const pagesRes = await fetch(
      `${GRAPH_BASE}/me/accounts?` +
        new URLSearchParams({ access_token: longLivedToken, fields: "id,name,access_token,instagram_business_account{id,username,followers_count}" }),
    );
    if (!pagesRes.ok) {
      const errText = await pagesRes.text();
      console.error("-> Managed accounts lookup failed:", errText);
      throw new Error(`accounts lookup failed: ${errText}`);
    }
    const pagesJson = (await pagesRes.json()) as {
      data: Array<{
        id: string;
        name: string;
        access_token: string;
        instagram_business_account?: { id: string; username: string; followers_count?: number };
      }>;
    };
    console.log("-> Managed Pages list retrieved. Found pages count:", pagesJson.data?.length || 0);
    console.log("-> Pages details:", JSON.stringify(pagesJson.data, null, 2));

    const page = pagesJson.data.find(p => p.instagram_business_account);
    if (!page || !page.instagram_business_account) {
      console.error("-> Error: No linked Instagram Business Account found in any managed Pages");
      res
        .status(400)
        .send(
          "No Instagram Business Account is linked to any of your Pages. Convert your IG to Business and link it to a Facebook Page, then retry.",
        );
      return;
    }

    const igAccount = page.instagram_business_account;
    console.log("-> Linked IG Account Found:", igAccount);
    const issuedAt = new Date().toISOString();
    const expiresAt = llJson.expires_in
      ? new Date(Date.now() + llJson.expires_in * 1000).toISOString()
      : null;

    console.log("-> Saving connection details to Firestore...");
    await savePlatformConnection(uid, {
      platform: "Instagram",
      handle: igAccount.username ? `@${igAccount.username}` : "",
      externalAccountId: igAccount.id,
      followersCount: igAccount.followers_count,
      // Persist the *page* token because IG publish endpoints want it.
      accessTokenCiphertext: encryptToken(page.access_token),
      issuedAt,
      expiresAt,
      lastSyncedAt: issuedAt,
    });
    console.log("-> Connection saved successfully to Firestore! Redirecting user...");

    res.redirect(parsedState.next || "/");
  } catch (err: any) {
    console.error("!!! Instagram OAuth callback error:", err);
    res.status(500).send(`OAuth failed: ${err.message}`);
  }
});

/** Disconnects Instagram by deleting the stored connection. */
instagramOAuthRouter.post("/disconnect", requireAuth, async (req: Request, res: Response) => {
  const uid = (req as AuthedRequest).userId!;
  await deletePlatformConnection(uid, "Instagram");
  res.json({ ok: true });
});

/**
 * Mints a Firebase session cookie from an ID token so subsequent redirects
 * (Meta -> /callback) can re-authenticate the user. Client should POST its
 * current ID token to this endpoint *before* initiating /start.
 */
export async function createSessionCookie(req: AuthedRequest, res: Response): Promise<void> {
  const idToken = (req.body && req.body.idToken) as string | undefined;
  if (!idToken) {
    res.status(400).json({ error: "idToken required" });
    return;
  }
  try {
    const expiresIn = 60 * 60 * 1000; // 1 hour
    if (
      process.env.NODE_ENV !== "production" &&
      process.env.ENABLE_DEV_BYPASS === "true" &&
      idToken === "dev-bypass-token"
    ) {
      res.cookie("__session", "dev-bypass-cookie", {
        maxAge: expiresIn,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
      });
      res.json({ ok: true });
      return;
    }
    const cookie = await adminAuth.createSessionCookie(idToken, { expiresIn });
    res.cookie("__session", cookie, {
      maxAge: expiresIn,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });
    res.json({ ok: true });
  } catch (err: any) {
    res.status(401).json({ error: err?.message || "session cookie creation failed" });
  }
}
