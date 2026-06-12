/**
 * Firebase Admin SDK initialization.
 *
 * Uses `FIREBASE_SERVICE_ACCOUNT_JSON` (base64-encoded service account JSON)
 * when set. On Google Cloud Run with Workload Identity, leave it unset to
 * use Application Default Credentials.
 */
import { initializeApp, cert, getApps, applicationDefault, ServiceAccount } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";
import firebaseConfig from "../firebase-applet-config.json";

function loadCredential() {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (raw && raw.trim().length > 0) {
    try {
      const json = JSON.parse(Buffer.from(raw, "base64").toString("utf8")) as ServiceAccount;
      return cert(json);
    } catch (err) {
      console.error("Failed to parse FIREBASE_SERVICE_ACCOUNT_JSON (expected base64 JSON):", err);
    }
  }
  // Fall back to ADC (Workload Identity on Cloud Run, gcloud login locally).
  try {
    return applicationDefault();
  } catch {
    return undefined;
  }
}

if (getApps().length === 0) {
  const credential = loadCredential();
  initializeApp({
    credential,
    projectId: firebaseConfig.projectId,
    storageBucket: firebaseConfig.storageBucket,
  });
}

export const adminAuth = getAuth();
// Firestore named-database support: ai-studio created the DB with a non-default ID.
export const adminDb = getFirestore(firebaseConfig.firestoreDatabaseId);
export const adminStorage = getStorage();
export const STORAGE_BUCKET = firebaseConfig.storageBucket;
