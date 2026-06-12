/**
 * Tenant-scoped Firestore data layer using the firebase-admin SDK.
 *
 * All collections live under `users/{uid}/...` so Firestore Security Rules
 * can enforce per-user isolation with `request.auth.uid == userId`.
 */
import { adminDb } from "./admin";
import type { BrandProfile, ContentIdea, SocialPost, ABCampaign, ArsenalMediaAsset } from "../src/types";

const INITIAL_BRAND_PROFILE: BrandProfile = {
  name: "",
  website: "",
  socialHandles: { instagram: "", tiktok: "", linkedin: "", facebook: "" },
  industry: "",
  tone: "Professional, Creative, and engaging",
  targetBuyers: "",
  keyProducts: "",
  additionalContext: "",
  analyzedFromSources: false,
};

function userRoot(uid: string) {
  return adminDb.collection("users").doc(uid);
}

// ---- Brand profile -----------------------------------------------------

export async function getBrandProfile(uid: string): Promise<BrandProfile> {
  const ref = userRoot(uid).collection("brand_profile").doc("profile");
  const snap = await ref.get();
  if (snap.exists) {
    return { ...INITIAL_BRAND_PROFILE, ...(snap.data() as BrandProfile), userId: uid };
  }
  const seeded = { ...INITIAL_BRAND_PROFILE, userId: uid };
  await ref.set(seeded);
  return seeded;
}

export async function saveBrandProfile(uid: string, profile: BrandProfile): Promise<void> {
  const ref = userRoot(uid).collection("brand_profile").doc("profile");
  await ref.set({ ...profile, userId: uid }, { merge: true });
}

// ---- Content ideas -----------------------------------------------------

export async function getContentIdeas(uid: string): Promise<ContentIdea[]> {
  const snap = await userRoot(uid).collection("content_ideas").get();
  const list: ContentIdea[] = [];
  snap.forEach(d => list.push(d.data() as ContentIdea));
  return list.sort((a, b) => b.id.localeCompare(a.id));
}

export async function saveContentIdea(uid: string, idea: ContentIdea): Promise<void> {
  await userRoot(uid).collection("content_ideas").doc(idea.id).set({ ...idea, userId: uid });
}

// ---- Social posts ------------------------------------------------------

export async function getSocialPosts(uid: string): Promise<SocialPost[]> {
  const snap = await userRoot(uid).collection("social_posts").get();
  const list: SocialPost[] = [];
  snap.forEach(d => list.push(d.data() as SocialPost));
  return list.sort((a, b) => b.id.localeCompare(a.id));
}

export async function saveSocialPost(uid: string, post: SocialPost): Promise<void> {
  await userRoot(uid).collection("social_posts").doc(post.id).set({ ...post, userId: uid });
}

export async function deleteSocialPost(uid: string, id: string): Promise<void> {
  await userRoot(uid).collection("social_posts").doc(id).delete();
}

// ---- A/B campaigns -----------------------------------------------------

export async function getAbCampaigns(uid: string): Promise<ABCampaign[]> {
  const snap = await userRoot(uid).collection("ab_campaigns").get();
  const list: ABCampaign[] = [];
  snap.forEach(d => list.push(d.data() as ABCampaign));
  return list.sort((a, b) => b.id.localeCompare(a.id));
}

export async function saveAbCampaign(uid: string, campaign: ABCampaign): Promise<void> {
  await userRoot(uid).collection("ab_campaigns").doc(campaign.id).set({ ...campaign, userId: uid });
}

// ---- Platform connections (encrypted OAuth tokens) ---------------------

import type { PlatformConnection } from "../src/types";

export async function getPlatformConnection(
  uid: string,
  platform: string,
): Promise<PlatformConnection | null> {
  const snap = await userRoot(uid).collection("platform_connections").doc(platform).get();
  return snap.exists ? (snap.data() as PlatformConnection) : null;
}

export async function savePlatformConnection(
  uid: string,
  connection: PlatformConnection,
): Promise<void> {
  await userRoot(uid)
    .collection("platform_connections")
    .doc(connection.platform)
    .set({ ...connection, userId: uid }, { merge: true });
}

export async function deletePlatformConnection(uid: string, platform: string): Promise<void> {
  await userRoot(uid).collection("platform_connections").doc(platform).delete();
}

// ---- Content Arsenal (Media Assets Library) ----------------------------

export async function getArsenalMedia(uid: string): Promise<ArsenalMediaAsset[]> {
  const snap = await userRoot(uid).collection("media_arsenal").get();
  const list: ArsenalMediaAsset[] = [];
  snap.forEach(d => list.push(d.data() as ArsenalMediaAsset));
  return list.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function saveArsenalMedia(uid: string, asset: ArsenalMediaAsset): Promise<void> {
  await userRoot(uid).collection("media_arsenal").doc(asset.id).set({ ...asset, userId: uid });
}

export async function deleteArsenalMedia(uid: string, id: string): Promise<void> {
  await userRoot(uid).collection("media_arsenal").doc(id).delete();
}
