export type SocialPlatform = 'Instagram' | 'Facebook' | 'TikTok' | 'LinkedIn';

export interface BrandProfile {
  userId?: string; // Firebase auth UID owning this profile (server-set)
  name: string;
  website: string;
  socialHandles: {
    instagram?: string;
    facebook?: string;
    tiktok?: string;
    linkedin?: string;
  };
  industry: string;
  tone: string;
  targetBuyers: string;
  keyProducts: string;
  additionalContext: string;
  analyzedFromSources: boolean;
}

export interface ContentIdea {
  id: string;
  userId?: string;
  title: string;
  description: string;
  hook: string;
  recommendedPlatform: SocialPlatform;
  /** ISO 8601 timestamp (e.g. "2026-05-26T16:00:00.000Z"). */
  recommendedTime: string;
  format: 'Image' | 'Video' | 'Text' | 'Carousel';
  visualPrompt: string;
  audienceSegment: string;
  optimalTimeReasoning: string;
}

export interface ViralMetrics {
  hook: number; // 0-100
  trend: number; // 0-100
  shareability: number; // 0-100
  visualImpact: number; // 0-100
  callToAction: number; // 0-100
}

export interface SocialPost {
  id: string;
  userId?: string;
  ideaId?: string;
  platform: SocialPlatform;
  title: string;
  caption: string;
  mediaType: 'image' | 'video' | 'text';
  mediaUrl: string; // signed Firebase Storage URL or external URL
  promptUsed?: string;
  /** ISO 8601 timestamp. */
  scheduledTime: string;
  /** 'Simulated' is used for platforms without real OAuth/publish integration. */
  status: 'Draft' | 'Scheduled' | 'Posting' | 'Posted' | 'Simulated' | 'Failed';
  viralScore: number; // 1-100
  viralMetrics: ViralMetrics;
  viralFeedback: string;
  audienceSegment: string;
  abGroup?: 'A' | 'B';
  /** Platform-side post identifier returned after a successful publish. */
  externalPostId?: string;
  /** Last failure reason if status === 'Failed'. */
  lastError?: string;
  /** ISO 8601 timestamp of the most recent publish attempt. */
  lastPublishAttempt?: string;
  analytics?: {
    impressions: number;
    engagementRate: number; // e.g. 4.8 (%)
    clicks: number;
    shares: number;
    reach: number;
    /** ISO 8601 timestamp of the last analytics refresh. */
    fetchedAt?: string;
  };
}

export interface ABCampaign {
  id: string;
  userId?: string;
  name: string;
  targetProduct: string;
  segment: string;
  status: 'Active' | 'Completed' | 'Draft';
  strategyA: {
    name: string;
    tone: string;
    postId?: string;
  };
  strategyB: {
    name: string;
    tone: string;
    postId?: string;
  };
  metricCaptured?: {
    impressionsA: number;
    impressionsB: number;
    engagementA: number;
    engagementB: number;
    winner: 'A' | 'B' | 'Tie' | 'Pending';
  };
}

export interface AnalyticsWidget {
  title: string;
  metric: string;
  change: string;
  isPositive: boolean;
  type: 'impressions' | 'engagement' | 'shares' | 'growth';
}

/** OAuth connection persisted at users/{uid}/connections/{platform}. */
export interface PlatformConnection {
  platform: SocialPlatform;
  handle: string;
  externalAccountId: string;
  followersCount?: number;
  /** AES-256-GCM ciphertext of the long-lived access token. */
  accessTokenCiphertext: string;
  /** ISO 8601 timestamp when the token was issued. */
  issuedAt: string;
  /** ISO 8601 timestamp when the token expires (if known). */
  expiresAt?: string;
  /** ISO 8601 timestamp of the most recent successful sync. */
  lastSyncedAt?: string;
}

export interface ArsenalMediaAsset {
  id: string;
  userId?: string;
  url: string;
  storagePath: string;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  createdAt: string;
  aiDescription: string;
  visualPrompt: string;
  isInspired: boolean;
  usageCount: number;
}
