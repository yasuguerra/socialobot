import { SocialPost, ArsenalMediaAsset } from '../types';

export const EMPTY_ANALYTICS_DATA = {
  summary: {
    totalImpressions: 0,
    totalReach: 0,
    totalClicks: 0,
    totalShares: 0,
    avgEngagement: 0,
    totalPostsCount: 0
  },
  chartData: [],
  platformStats: [],
  demographics: [],
  widgets: [
    { title: "Total Impressions", metric: "0", change: "Awaiting data", isPositive: false, type: "impressions" },
    { title: "Average Engagement", metric: "0%", change: "Awaiting data", isPositive: false, type: "engagement" },
    { title: "Click-Through Actions", metric: "0", change: "Awaiting data", isPositive: false, type: "growth" },
    { title: "Total Shares", metric: "0", change: "Awaiting data", isPositive: false, type: "shares" }
  ]
};

export const MOCK_INSTAGRAM_FEED = [
  {
    id: "ig-mock-1",
    media_url: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=600&q=80",
    media_type: "IMAGE",
    caption: "Loving our carbon-neutral linen outfits! Sustainable everyday choices."
  },
  {
    id: "ig-mock-2",
    media_url: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=600&q=80",
    media_type: "IMAGE",
    caption: "Aesthetic look styled with sustainable accessories."
  },
  {
    id: "ig-mock-3",
    media_url: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=600&q=80",
    media_type: "VIDEO",
    caption: "Eco-friendly wardrobe walkthrough. Fresh look drop!"
  }
];

export const generateMockSocialPost = (
  title: string,
  platform: any,
  format: string,
  customPrompt?: string,
  mediaUrl?: string
): SocialPost => {
  const isVideo = format === "Video";
  const finalMediaUrl = mediaUrl || (isVideo 
    ? "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=600&q=80" 
    : "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=600&q=80");
    
  return {
    id: `mock-post-${Date.now()}`,
    platform: platform,
    title: title,
    caption: `🌿 Discover the sustainable revolution with our new ${title}! Crafted with certified carbon-neutral materials, we plant 2 real trees for every single item sold. Swap standard synthetic blends for breathable organic comfort. Shop yours today and join the movement!\n\n#sustainablefashion #ecofriendly #organic #circularity #greenchoice`,
    mediaType: isVideo ? "video" : "image",
    mediaUrl: finalMediaUrl,
    scheduledTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'Scheduled',
    viralScore: 89,
    viralMetrics: {
      hook: 92,
      trend: 85,
      shareability: 87,
      visualImpact: 88,
      callToAction: 86
    },
    viralFeedback: "Exceptional hooks referencing the certified carbon-neutral details. Perfect synergy with organic fashion hashtags.",
    audienceSegment: "Conscious Fashion Buyers"
  };
};

export const MOCK_ARSENAL_ASSETS: ArsenalMediaAsset[] = [
  {
    id: "seed-1",
    url: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=600&q=80",
    storagePath: "users/oF5XhOnCinhfFy5c8xYm4PbPzbI3/media_arsenal/organic-linen-jumpsuit.jpg",
    fileName: "organic-linen-jumpsuit.jpg",
    mimeType: "image/jpeg",
    sizeBytes: 1245000,
    createdAt: new Date().toISOString(),
    aiDescription: "Cinematic flat lay of ecological sand-toned linen garments on neutral organic paper background.",
    visualPrompt: "Premium commercial photography of raw ecological linen textile garments neatly laid on white ocean sand, warm daylight rays, 8k resolution editorial.",
    isInspired: false,
    usageCount: 2
  },
  {
    id: "seed-2",
    url: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=600&q=80",
    storagePath: "users/oF5XhOnCinhfFy5c8xYm4PbPzbI3/media_arsenal/sustainable-accessories.jpg",
    fileName: "sustainable-accessories.jpg",
    mimeType: "image/jpeg",
    sizeBytes: 984000,
    createdAt: new Date().toISOString(),
    aiDescription: "Close-up of handmade biodegradeable sunglasses with bamboo frames on ecological canvas.",
    visualPrompt: "Close-up macro shot of organic bamboo frame sunglasses, soft daylight, cream studio backdrop, sustainable design concept.",
    isInspired: true,
    usageCount: 0
  },
  {
    id: "seed-3",
    url: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=600&q=80",
    storagePath: "users/oF5XhOnCinhfFy5c8xYm4PbPzbI3/media_arsenal/eco-wardrobe.jpg",
    fileName: "eco-wardrobe.jpg",
    mimeType: "image/jpeg",
    sizeBytes: 1540000,
    createdAt: new Date().toISOString(),
    aiDescription: "Aesthetic wooden hanger holding an organic cotton everyday tee, soft minimal shadows.",
    visualPrompt: "Minimal hanger with cream white organic cotton tee, soft shadows, warm beige background, clean eco aesthetic commercial.",
    isInspired: false,
    usageCount: 1
  }
];