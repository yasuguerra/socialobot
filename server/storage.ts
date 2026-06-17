/**
 * Firebase Storage media upload helper.
 *
 * Accepts a base64 data URI (or raw base64 + mimeType), persists it to
 * `users/{uid}/media/{filename}` in Storage, and returns a long-lived
 * signed download URL suitable for handing to Meta Graph API.
 */
import { adminStorage, STORAGE_BUCKET } from "./admin";
import { v4 as uuidv4 } from "uuid";

const ALLOWED_MIME = /^(image\/(jpeg|png|webp)|video\/(mp4|quicktime))$/i;
const MAX_BYTES = 100 * 1024 * 1024; // 100 MB

export interface UploadResult {
  url: string;
  storagePath: string;
  mimeType: string;
  sizeBytes: number;
}

export async function uploadMediaForUser(
  uid: string,
  dataUriOrBase64: string,
  mimeTypeHint?: string,
  filenameHint?: string,
): Promise<UploadResult> {
  let mimeType = mimeTypeHint || "application/octet-stream";
  let base64 = dataUriOrBase64;

  const match = /^data:([^;]+);base64,(.+)$/i.exec(dataUriOrBase64);
  if (match) {
    mimeType = match[1];
    base64 = match[2];
  }

  if (!ALLOWED_MIME.test(mimeType)) {
    throw new Error(`Unsupported media type: ${mimeType}`);
  }

  const buffer = Buffer.from(base64, "base64");
  if (buffer.byteLength > MAX_BYTES) {
    throw new Error(`File too large (${buffer.byteLength} bytes, max ${MAX_BYTES})`);
  }

  const extension =
    mimeType === "image/jpeg" ? "jpg" :
    mimeType === "image/png" ? "png" :
    mimeType === "image/webp" ? "webp" :
    mimeType === "video/mp4" ? "mp4" :
    mimeType === "video/quicktime" ? "mov" :
    "bin";

  const safeName = (filenameHint || `media-${Date.now()}`).replace(/[^a-zA-Z0-9_\-]/g, "_");
  const storagePath = `users/${uid}/media/${safeName}.${extension}`;
  const bucket = adminStorage.bucket(STORAGE_BUCKET);
  const file = bucket.file(storagePath);

  let url = "";
  try {
    const token = uuidv4();
    await file.save(buffer, {
      contentType: mimeType,
      resumable: false,
      metadata: { 
        metadata: { 
          uploadedBy: uid,
          firebaseStorageDownloadTokens: token
        } 
      },
    });

    url = `https://firebasestorage.googleapis.com/v0/b/${STORAGE_BUCKET}/o/${encodeURIComponent(storagePath)}?alt=media&token=${token}`;
  } catch (storageSaveError) {
    console.error("Firebase Storage bucket save failed, falling back to local base64/dataUri embedding:", storageSaveError);
    url = dataUriOrBase64;
  }

  return { url, storagePath, mimeType, sizeBytes: buffer.byteLength };
}

export async function uploadArsenalMediaForUser(
  uid: string,
  dataUriOrBase64: string,
  mimeTypeHint?: string,
  filenameHint?: string,
): Promise<UploadResult> {
  let mimeType = mimeTypeHint || "application/octet-stream";
  let base64 = dataUriOrBase64;

  const match = /^data:([^;]+);base64,(.+)$/i.exec(dataUriOrBase64);
  if (match) {
    mimeType = match[1];
    base64 = match[2];
  }

  if (!ALLOWED_MIME.test(mimeType)) {
    throw new Error(`Unsupported media type: ${mimeType}`);
  }

  const buffer = Buffer.from(base64, "base64");
  if (buffer.byteLength > MAX_BYTES) {
    throw new Error(`File too large (${buffer.byteLength} bytes, max ${MAX_BYTES})`);
  }

  const extension =
    mimeType === "image/jpeg" ? "jpg" :
    mimeType === "image/png" ? "png" :
    mimeType === "image/webp" ? "webp" :
    mimeType === "video/mp4" ? "mp4" :
    mimeType === "video/quicktime" ? "mov" :
    "bin";

  const safeName = (filenameHint || `arsenal-${Date.now()}`).replace(/[^a-zA-Z0-9_\-]/g, "_");
  const storagePath = `users/${uid}/media_arsenal/${safeName}.${extension}`;
  const bucket = adminStorage.bucket(STORAGE_BUCKET);
  const file = bucket.file(storagePath);

  let url = "";
  try {
    const token = uuidv4();
    await file.save(buffer, {
      contentType: mimeType,
      resumable: false,
      metadata: { 
        metadata: { 
          uploadedBy: uid,
          firebaseStorageDownloadTokens: token
        } 
      },
    });

    url = `https://firebasestorage.googleapis.com/v0/b/${STORAGE_BUCKET}/o/${encodeURIComponent(storagePath)}?alt=media&token=${token}`;
  } catch (storageSaveError) {
    console.error("Firebase Storage bucket save failed in Arsenal, falling back to local base64/dataUri embedding:", storageSaveError);
    url = dataUriOrBase64;
  }

  return { url, storagePath, mimeType, sizeBytes: buffer.byteLength };
}
