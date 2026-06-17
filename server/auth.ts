import type { Request, Response, NextFunction } from "express";
import { adminAuth } from "./admin";

export interface AuthedRequest extends Request {
  userId?: string;
  userEmail?: string | null;
}

/**
 * Express middleware: verifies a Firebase ID token from the `Authorization`
 * header and attaches `req.userId` / `req.userEmail`.
 *
 * Returns 401 if the header is missing or the token is invalid/expired.
 */
export async function requireAuth(
  req: AuthedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const header = req.header("authorization") || req.header("Authorization");
  if (!header || !header.toLowerCase().startsWith("bearer ")) {
    res.status(401).json({ error: "Missing Bearer token" });
    return;
  }
  const token = header.slice(7).trim();
  if (!token) {
    res.status(401).json({ error: "Empty Bearer token" });
    return;
  }

  try {
    if (
      process.env.NODE_ENV !== "production" &&
      process.env.ENABLE_DEV_BYPASS === "true" &&
      token === "dev-bypass-token"
    ) {
      req.userId = "oF5XhOnCinhfFy5c8xYm4PbPzbI3";
      req.userEmail = "dev@socialobot.com";
      next();
      return;
    }
    const decoded = await adminAuth.verifyIdToken(token);
    req.userId = decoded.uid;
    req.userEmail = decoded.email ?? null;
    next();
  } catch (err: any) {
    res.status(401).json({ error: "Invalid or expired token", detail: err?.message });
  }
}

/**
 * Resolve the authenticated user's UID from a request. Throws if missing —
 * always pair this with `requireAuth` upstream.
 */
export function requireUserId(req: AuthedRequest): string {
  if (!req.userId) {
    throw new Error("requireUserId called without requireAuth middleware");
  }
  return req.userId;
}
