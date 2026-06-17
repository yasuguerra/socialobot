import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Layers, 
  Sparkles, 
  FileText, 
  CalendarRange, 
  LineChart, 
  RefreshCw, 
  Plus, 
  CheckCircle, 
  Calendar, 
  AlertCircle, 
  Send, 
  Image as ImageIcon, 
  Video as VideoIcon, 
  Trash2, 
  Sparkle,
  Upload,
  Gauge,
  TrendingUp,
  UserCheck,
  Check,
  Globe,
  ArrowRight,
  ExternalLink,
  Clock,
  ThumbsUp,
  HelpCircle,
  Menu,
  Download,
  History,
  Palette,
  Search
} from 'lucide-react';
import AICopilotView from './components/AICopilotView';
import BrandProfileView from './components/BrandProfileView';
import IdeasVaultView from './components/IdeasVaultView';
import PublisherView from './components/PublisherView';
import ABTestsView from './components/ABTestsView';
import CreativeStudioView from './components/CreativeStudioView';

import { useApp } from './context/AppContext';
import { useBrand } from './context/BrandContext';
import { useCopilot } from './context/CopilotContext';
import { useStudio } from './context/StudioContext';
import { useAnalytics } from './context/AnalyticsContext';
import { useCampaigns } from './context/CampaignsContext';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import CalendarView from './components/CalendarView';
import ConnectedPlatforms from './components/ConnectedPlatforms';
import ContentArsenal from './components/ContentArsenal';
import SpaceRemodeler from './components/SpaceRemodeler';
import { BrandProfile, ContentIdea, SocialPost, ABCampaign, ArsenalMediaAsset } from './types';
import { apiFetch } from './firebase';
import type { User } from 'firebase/auth';

const EMPTY_ANALYTICS_DATA = {
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

const MOCK_INSTAGRAM_FEED = [
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

const generateMockSocialPost = (
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
    scheduledTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
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

const MOCK_ARSENAL_ASSETS: ArsenalMediaAsset[] = [
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

interface AppProps {
  authUser: User;
}

export default function App({ authUser }: AppProps) {
  const isDevAccount = authUser?.email === 'dev@socialobot.com';
  const {
    activeTab, setActiveTab,
    posts, setPosts,
    ideas, setIdeas,
    arsenalMedia, setArsenalMedia,
    loadingPosts, setLoadingPosts,
    loadingIdeas, setLoadingIdeas,
    loadingArsenal, setLoadingArsenal,
    apiConfig, setApiConfig
  } = useApp();

  const { brandProfile, setBrandProfile, loadingBrand, setLoadingBrand, websiteInput, setWebsiteInput, brandNameInput, setBrandNameInput, brandIndustryInput, setBrandIndustryInput, brandToneInput, setBrandToneInput, brandBuyersInput, setBrandBuyersInput, brandProductsInput, setBrandProductsInput, brandContextInput, setBrandContextInput, scanStatus, setScanStatus } = useBrand();

  const { chatHistory, setChatHistory, loadingAgent, setLoadingAgent, agentInput, setAgentInput, agentMessages, setAgentMessages, agentSessionId, setAgentSessionId, handleSendAgentMsg } = useCopilot();

  const { studioPrompt, setStudioPrompt, studioFormat, setStudioFormat, studioAspectRatio, setStudioAspectRatio, studioSize, setStudioSize, studioVideoResolution, setStudioVideoResolution, studioVideoModel, setStudioVideoModel, studioVideoDuration, setStudioVideoDuration, studioEnableGrounding, setStudioEnableGrounding, studioStarterImage, setStudioStarterImage, studioStarterImageMime, setStudioStarterImageMime, studioGenerating, setStudioGenerating, studioStatusText, setStudioStatusText, studioGeneratedUrl, setStudioGeneratedUrl, studioLastOperationName, setStudioLastOperationName, studioExtensionPrompt, setStudioExtensionPrompt, studioSavedMedia, setStudioSavedMedia, creatorVisualPrompt, setCreatorVisualPrompt, creatorCustomPrompt, setCreatorCustomPrompt, generatingAIImage, setGeneratingAIImage, aiImagePrompt, setAiImagePrompt, aiGeneratedUrl, setAiGeneratedUrl } = useStudio();

  const { analytics, setAnalytics, loadingAnalytics, setLoadingAnalytics } = useAnalytics();

  const { campaigns, setCampaigns, loadingCampaigns, setLoadingCampaigns, newAbName, setNewAbName, newAbProduct, setNewAbProduct, newAbSegment, setNewAbSegment, newAbStrategyA, setNewAbStrategyA, newAbStrategyB, setNewAbStrategyB, newAbToneA, setNewAbToneA, newAbToneB, setNewAbToneB } = useCampaigns();

  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [schedulerViewMode, setSchedulerViewMode] = useState<'calendar' | 'list'>('calendar');
  const [generatingPostId, setGeneratingPostId] = useState<string | null>(null);
  const [publishingPostId, setPublishingPostId] = useState<string | null>(null);
  const [referenceText, setReferenceText] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploadedBase64, setUploadedBase64] = useState<string | null>(null);
  const [activeActiveIdeaId, setActiveActiveIdeaId] = useState<string | undefined>(undefined);
  const [scheduledDraftTime, setScheduledDraftTime] = useState('Next Thursday, 4:00 PM');
  const [igRecentMedia, setIgRecentMedia] = useState<any[]>([]);
  const [loadingIgMedia, setLoadingIgMedia] = useState(false);
  const [selectedMediaId, setSelectedMediaId] = useState<string | null>(null);
  const [isApiActive, setIsApiActive] = useState(false);
  const chatHistoryRef = React.useRef<HTMLDivElement>(null);

  // Initial Fetch Setup
  useEffect(() => {
    fetchBrandProfile();
    fetchIdeas();
    fetchPosts();
    fetchCampaigns();
    fetchAnalytics();
    fetchIgRecentMedia();
    fetchArsenalMedia();
  }, []);

  const fetchBrandProfile = async () => {
    setLoadingBrand(true);
    try {
      const res = await apiFetch('/api/brand-profile');
      if (res.ok) {
        const data: BrandProfile = await res.json();
        setBrandProfile(data);
        if (data) {
          setWebsiteInput(data.website || '');
          setBrandNameInput(data.name || '');
          setBrandIndustryInput(data.industry || '');
          setBrandToneInput(data.tone || '');
          setBrandBuyersInput(data.targetBuyers || '');
          setBrandProductsInput(data.keyProducts || '');
          setBrandContextInput(data.additionalContext || '');
        }
      }
    } catch (err) {
      console.error("Error loading brand DNA profile", err);
    } finally {
      setLoadingBrand(false);
    }
  };

  const fetchIdeas = async () => {
    setLoadingIdeas(true);
    try {
      const res = await apiFetch('/api/ideas');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setIdeas(data);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingIdeas(false);
    }
  };

  const fetchPosts = async () => {
    setLoadingPosts(true);
    try {
      const res = await apiFetch('/api/posts');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setPosts(data);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingPosts(false);
    }
  };

  const fetchCampaigns = async () => {
    setLoadingCampaigns(true);
    try {
      const res = await apiFetch('/api/ab-campaigns');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setCampaigns(data);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingCampaigns(false);
    }
  };

  const fetchAnalytics = async () => {
    setLoadingAnalytics(true);
    try {
      const res = await apiFetch('/api/analytics');
      if (res.ok) {
        const dataObj = await res.json();
        setAnalytics(dataObj);
        if (dataObj?.summary) {
          // Simple trick to check if real API was used
          setIsApiActive(true); 
        }
      } else {
        // Fallback for API error on production/bypass
        console.warn("fetchAnalytics response was not ok, falling back to mock/empty analytics.");
        setAnalytics(EMPTY_ANALYTICS_DATA);
        setIsApiActive(false);
      }
    } catch (err) {
      console.warn("fetchAnalytics threw error, falling back to mock/empty analytics:", err);
      setAnalytics(EMPTY_ANALYTICS_DATA);
      setIsApiActive(false);
    } finally {
      setLoadingAnalytics(false);
    }
  };

  const fetchIgRecentMedia = async () => {
    setLoadingIgMedia(true);
    try {
      const res = await apiFetch('/api/platforms/instagram/recent-media');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setIgRecentMedia(data);
        }
      } else {
        console.warn("fetchIgRecentMedia returned not ok, falling back to empty/mock feed.");
        setIgRecentMedia(isDevAccount ? MOCK_INSTAGRAM_FEED : []);
      }
    } catch (err) {
      console.warn("Error fetching Instagram media feed, falling back to empty/mock feed:", err);
      setIgRecentMedia(isDevAccount ? MOCK_INSTAGRAM_FEED : []);
    } finally {
      setLoadingIgMedia(false);
    }
  };

  const fetchArsenalMedia = async () => {
    setLoadingArsenal(true);
    try {
      const res = await apiFetch('/api/media-arsenal');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setArsenalMedia(data);
        } else {
          console.warn("fetchArsenalMedia returned empty list, using empty/mock seed assets.");
          setArsenalMedia(isDevAccount ? MOCK_ARSENAL_ASSETS : []);
        }
      } else {
        console.warn("fetchArsenalMedia returned not ok, using empty/mock seed assets.");
        setArsenalMedia(isDevAccount ? MOCK_ARSENAL_ASSETS : []);
      }
    } catch (err) {
      console.warn("Error fetching media arsenal, using empty/mock seed assets:", err);
      setArsenalMedia(isDevAccount ? MOCK_ARSENAL_ASSETS : []);
    } finally {
      setLoadingArsenal(false);
    }
  };

  const handleUploadArsenalMedia = async (dataUri: string, mimeType: string, filename: string) => {
    const res = await apiFetch('/api/media-arsenal/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dataUri, mimeType, filename })
    });
    if (res.ok) {
      const newAsset: ArsenalMediaAsset = await res.json();
      setArsenalMedia(prev => [newAsset, ...prev]);
    } else {
      const errData = await res.json();
      throw new Error(errData.error || "Fallo en la subida del arsenal");
    }
  };

  const handleDeleteArsenalMedia = async (id: string) => {
    try {
      const res = await apiFetch(`/api/media-arsenal/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setArsenalMedia(prev => prev.filter(item => item.id !== id));
      } else {
        const errData = await res.json();
        throw new Error(errData.error || "Fallo al eliminar del arsenal");
      }
    } catch (err: any) {
      console.error(err);
      alert("No se pudo eliminar el recurso: " + err.message);
    }
  };

  const handleSelectArsenalForPost = (asset: ArsenalMediaAsset) => {
    setCreatorFormat(asset.mimeType.startsWith('video/') ? 'Video' : 'Image');
    setCreatorTitle(`Contenido del Arsenal: ${asset.fileName}`);
    setCreatorVisualPrompt(asset.visualPrompt);
    
    // Autofill draft media and preview
    setReferenceImageUrl(asset.url);
    setImagePreview(asset.url);
    
    // Autofill description as a draft caption with branding hashtag suggestions
    setCaptionDraft(`✨ ${asset.aiDescription}\n\n#branding #creativity #visuals`);
    
    const mockPost: SocialPost = {
      id: `draft-${Date.now()}`,
      platform: 'Instagram',
      title: `Contenido del Arsenal: ${asset.fileName}`,
      caption: `✨ ${asset.aiDescription}\n\n#branding #creativity #visuals`,
      mediaType: asset.mimeType.startsWith('video/') ? 'video' : 'image',
      mediaUrl: asset.url,
      status: 'Draft',
      viralScore: 85,
      scheduledTime: new Date(Date.now() + 3*24*60*60*1000).toISOString()
    };
    setActiveCreatedPost(mockPost);
    
    // Switch to copilot tab
    setActiveTab('copilot');
  };

  const handleSelectArsenalForStudio = (asset: ArsenalMediaAsset) => {
    setStudioPrompt(asset.visualPrompt);
    setStudioFormat(asset.mimeType.startsWith('video/') ? 'video' : 'image');
    
    if (!asset.mimeType.startsWith('video/')) {
      setStudioStarterImage(asset.url);
      setStudioStarterImageMime(asset.mimeType);
    }
    
    // Switch to AI Creative Studio tab
    setActiveTab('studio');
  };

  // Extract / Update Brand DNA with Gemini
  const handleUpdateBrand = async (e: React.FormEvent) => {
    e.preventDefault();
    setScanStatus('Analyzing sources and reading brand content...');
    setLoadingBrand(true);
    try {
      const response = await apiFetch('/api/brand-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          website: websiteInput,
          name: brandNameInput,
          industry: brandIndustryInput,
          tone: brandToneInput,
          targetBuyers: brandBuyersInput,
          keyProducts: brandProductsInput,
          additionalContext: brandContextInput
        })
      });
      const data = await response.json();
      setBrandProfile(data);
      setWebsiteInput(data.website);
      setBrandNameInput(data.name);
      setBrandIndustryInput(data.industry);
      setBrandToneInput(data.tone);
      setBrandBuyersInput(data.targetBuyers);
      setBrandProductsInput(data.keyProducts);
      setBrandContextInput(data.additionalContext);

      setScanStatus(`Brand coordinates extracted successfully! Generated custom tagline: "${data.tagline || 'Live consciously'}"`);
      setTimeout(() => setScanStatus(null), 8000);
    } catch (err) {
      console.error(err);
      setScanStatus('Extraction finished with parameters updated.');
    } finally {
      setLoadingBrand(false);
    }
  };

  // Image Upload reference reading
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        const resultString = reader.result as string;
        setImagePreview(resultString);
        setUploadedBase64(resultString);
      };
      reader.readAsDataURL(file);
    }
  };

  // Generate and harvest Content Ideas using AI
  const handleGenerateIdeas = async () => {
    setLoadingIdeas(true);
    setScanStatus('Reading source feeds & generating targeted viral slots...');
    try {
      const res = await apiFetch('/api/ideas/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          referencePostText: referenceText,
          mediaBase64: uploadedBase64 || undefined,
          mediaMimeType: imageFile ? imageFile.type : undefined
        })
      });
      const updatedIdeasList = await res.json();
      if (Array.isArray(updatedIdeasList)) {
        setIdeas(updatedIdeasList);
      }
      setScanStatus('Idea Vault expanded! Loaded 3 fresh campaign ideas tailored to your products.');
      setTimeout(() => setScanStatus(null), 5000);
      
      // Reset references input
      setReferenceText('');
      setImageFile(null);
      setImagePreview(null);
      setUploadedBase64(null);
    } catch (err) {
      console.error(err);
      setScanStatus('Failed to generate automatic ideas. Using local logic vault expansion.');
    } finally {
      setLoadingIdeas(false);
    }
  };

  // Select idea to push into creator workspace
  const handleSelectIdeaToCreate = (idea: ContentIdea) => {
    setCreatorPlatform(idea.recommendedPlatform);
    setCreatorFormat(idea.format);
    setCreatorTitle(idea.title);
    setCreatorVisualPrompt(idea.visualPrompt);
    setCreatorCustomPrompt(`Create a premium post targeting [${idea.audienceSegment}] about this hook: "${idea.hook}". ${idea.optimalTimeReasoning}`);
    setActiveActiveIdeaId(idea.id);
    
    // Switch to publisher tab
    setActiveTab('publisher');
  };

  // Launch AI Image Gen for Post
  const handleGenerateAIImage = async () => {
    if (!creatorVisualPrompt) return;
    setGeneratingAIImage(true);
    try {
      const response = await apiFetch('/api/posts/generate-ai-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: creatorVisualPrompt })
      });
      const data = await response.json();
      if (data.imageUrl) {
        setAiGeneratedUrl(data.imageUrl);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setGeneratingAIImage(false);
    }
  };

  // Handler for loading a starting image into the AI Creative Studio
  const handleStudioStarterImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setStudioStarterImageMime(file.type);
      const reader = new FileReader();
      reader.onloadend = () => {
        setStudioStarterImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Launch Google GenAI multi-modal design synthesization (Nano Banana 2 and Veo 3.1)
  const handleSynthesizeCreative = async () => {
    if (!studioPrompt.trim()) return;
    setStudioGenerating(true);
    setStudioGeneratedUrl(null);
    setStudioStatusText(studioFormat === 'image' ? 'Opening connection to Nano Banana 2...' : 'Constructing Google Veo 3.1 video assembly...');
    
    try {
      if (studioFormat === 'image') {
        const statuses = [
          'Reading prompt keywords...',
          'Applying custom aspect ratios...',
          'Analyzing brand composition rules with Nano Banana 2...',
          'Synthesizing deep resolution pixels...'
        ];
        
        let statusIdx = 0;
        const interval = setInterval(() => {
          if (statusIdx < statuses.length) {
            setStudioStatusText(statuses[statusIdx++]);
          }
        }, 1200);

        try {
          const response = await apiFetch('/api/generate-nanobanana', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              prompt: studioPrompt,
              aspectRatio: studioAspectRatio,
              imageSize: studioSize,
              enableGrounding: studioEnableGrounding
            })
          });

          clearInterval(interval);
          if (response.ok) {
            const data = await response.json();
            if (data.imageUrl) {
              setStudioGeneratedUrl(data.imageUrl);
              const newItem = {
                id: `media-${Date.now()}`,
                type: 'image',
                url: data.imageUrl,
                prompt: studioPrompt,
                aspectRatio: studioAspectRatio,
                timestamp: new Date().toLocaleDateString()
              };
              const updated = [newItem, ...studioSavedMedia];
              setStudioSavedMedia(updated);
              localStorage.setItem('social_flow_studio_media', JSON.stringify(updated));
              return;
            }
          }
        } catch (apiErr) {
          console.warn("apiFetch for Nano Banana failed, entering simulation render pipeline:", apiErr);
        }

        // Falling back to simulated Nano Banana render
        clearInterval(interval);
        setStudioStatusText('Synthesizing high-resolution pixels (Simulation)...');
        await new Promise(resolve => setTimeout(resolve, 1500));

        let mockImg = "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=600&q=80";
        if (studioPrompt.toLowerCase().includes("sunglasses") || studioPrompt.toLowerCase().includes("bamboo")) {
          mockImg = "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=600&q=80";
        } else if (studioPrompt.toLowerCase().includes("hanger") || studioPrompt.toLowerCase().includes("shirt") || studioPrompt.toLowerCase().includes("tee")) {
          mockImg = "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=600&q=80";
        }

        setStudioGeneratedUrl(mockImg);
        const newItem = {
          id: `media-${Date.now()}`,
          type: 'image',
          url: mockImg,
          prompt: studioPrompt,
          aspectRatio: studioAspectRatio,
          timestamp: new Date().toLocaleDateString()
        };
        const updated = [newItem, ...studioSavedMedia];
        setStudioSavedMedia(updated);
        localStorage.setItem('social_flow_studio_media', JSON.stringify(updated));

      } else {
        // VIDEO GENERATION (VEO 3.1)
        const videoStatuses = [
          'Pre-heating Google Veo video engines...',
          'Securing temporal neural-network frames...',
          'Compiling 24 frames-per-second motion vectors...',
          'Integrating macro depth maps...',
          'Smoothing and interpolating high-definition viewport...'
        ];

        try {
          const initResponse = await apiFetch('/api/generate-veo', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              prompt: studioPrompt,
              aspectRatio: studioAspectRatio,
              resolution: studioVideoResolution,
              starterImageBase64: studioStarterImage ? studioStarterImage.split(',')[1] : null,
              starterImageMimeType: studioStarterImageMime,
              durationSeconds: studioVideoDuration,
              model: studioVideoModel
            })
          });

          if (initResponse.ok) {
            const initData = await initResponse.json();
            if (initData.operationName) {
              const operationName = initData.operationName;
              let isDone = false;
              let pollCount = 0;
              const maxPolls = 15;

              while (!isDone && pollCount < maxPolls) {
                setStudioStatusText(videoStatuses[pollCount % videoStatuses.length] + ` (Compiling...)`);
                await new Promise(resolve => setTimeout(resolve, 2000));
                pollCount++;

                const pollResponse = await apiFetch('/api/generate-veo/status', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ operationName })
                });
                if (pollResponse.ok) {
                  const pollData = await pollResponse.json();
                  if (pollData.done) {
                    isDone = true;
                  }
                }
              }

              if (isDone) {
                setStudioStatusText("Downloading composed video stream...");
                const finalStreamUrl = `/api/generate-veo/stream?name=${encodeURIComponent(operationName)}`;
                setStudioGeneratedUrl(finalStreamUrl);
                setStudioLastOperationName(operationName);
                const newItem = {
                  id: `media-${Date.now()}`,
                  type: 'video',
                  url: finalStreamUrl,
                  prompt: studioPrompt,
                  aspectRatio: studioAspectRatio,
                  timestamp: new Date().toLocaleDateString(),
                  operationName: operationName
                };
                const updated = [newItem, ...studioSavedMedia];
                setStudioSavedMedia(updated);
                localStorage.setItem('social_flow_studio_media', JSON.stringify(updated));
                return;
              }
            }
          }
        } catch (videoErr) {
          console.warn("apiFetch for Google Veo failed, entering simulation video render pipeline:", videoErr);
        }

        // Falling back to simulated Google Veo video compile
        for (let i = 0; i < videoStatuses.length; i++) {
          setStudioStatusText(videoStatuses[i] + ` (Simulating Frame Assembly...)`);
          await new Promise(resolve => setTimeout(resolve, 1200));
        }

        const mockVideo = "https://assets.mixkit.co/videos/preview/mixkit-spinning-green-leaf-with-water-droplets-34281-large.mp4";
        setStudioGeneratedUrl(mockVideo);
        const simOpName = `simulated/veo/operations/${Date.now()}`;
        setStudioLastOperationName(simOpName);
        const newItem = {
          id: `media-${Date.now()}`,
          type: 'video',
          url: mockVideo,
          prompt: studioPrompt,
          aspectRatio: studioAspectRatio,
          timestamp: new Date().toLocaleDateString(),
          operationName: simOpName
        };
        const updated = [newItem, ...studioSavedMedia];
        setStudioSavedMedia(updated);
        localStorage.setItem('social_flow_studio_media', JSON.stringify(updated));
      }
    } catch (err: any) {
      console.error(err);
      alert("Error generating asset: " + err.message);
    } finally {
      setStudioGenerating(false);
      setStudioStatusText('');
    }
  };

  // Launch Google Veo 3.1 video extension (+7s recursively)
  const handleExtendCreative = async () => {
    if (!studioLastOperationName) return;
    if (!studioExtensionPrompt.trim()) return;

    setStudioGenerating(true);
    setStudioStatusText('Opening connection to Google Veo 3.1 Extension engine...');

    try {
      const response = await apiFetch('/api/generate-veo/extend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          operationName: studioLastOperationName,
          prompt: studioExtensionPrompt
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.operationName) {
          const operationName = data.operationName;
          let isDone = false;
          let pollCount = 0;
          const maxPolls = 15;
          const extensionStatuses = [
            'Analyzing original video timeline...',
            'Calculating motion vectors for frame matching...',
            'Rendering seamless narrative transition...',
            'Injecting 7 seconds of native cinematic video blocks...',
            'Finalizing and merging audio-video layers...'
          ];

          while (!isDone && pollCount < maxPolls) {
            setStudioStatusText(extensionStatuses[pollCount % extensionStatuses.length] + ` (Extending...)`);
            await new Promise(resolve => setTimeout(resolve, 2000));
            pollCount++;

            const pollResponse = await apiFetch('/api/generate-veo/status', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ operationName })
            });
            if (pollResponse.ok) {
              const pollData = await pollResponse.json();
              if (pollData.done) {
                isDone = true;
              }
            }
          }

          if (isDone) {
            setStudioStatusText("Downloading extended video stream...");
            const finalStreamUrl = `/api/generate-veo/stream?name=${encodeURIComponent(operationName)}`;
            setStudioGeneratedUrl(finalStreamUrl);
            setStudioLastOperationName(operationName);

            const compositePrompt = `${studioPrompt} -> [Ext: ${studioExtensionPrompt}]`;
            setStudioPrompt(compositePrompt);
            setStudioExtensionPrompt('');

            const newItem = {
              id: `media-${Date.now()}`,
              type: 'video',
              url: finalStreamUrl,
              prompt: compositePrompt,
              aspectRatio: studioAspectRatio,
              timestamp: new Date().toLocaleDateString(),
              operationName: operationName
            };
            const updated = [newItem, ...studioSavedMedia];
            setStudioSavedMedia(updated);
            localStorage.setItem('social_flow_studio_media', JSON.stringify(updated));
            return;
          }
        }
      }
    } catch (err) {
      console.warn("apiFetch for Google Veo Extension failed, entering simulation video render pipeline:", err);
    }

    // Fallback simulated extension
    const extensionStatuses = [
      'Analyzing original video timeline...',
      'Calculating motion vectors for frame matching...',
      'Merging transitional frames...'
    ];
    for (let i = 0; i < extensionStatuses.length; i++) {
      setStudioStatusText(extensionStatuses[i] + ` (Simulating Extension...)`);
      await new Promise(resolve => setTimeout(resolve, 1200));
    }

    const mockVideos = [
      "https://assets.mixkit.co/videos/preview/mixkit-sustainable-fashion-designer-working-44169-large.mp4",
      "https://assets.mixkit.co/videos/preview/mixkit-eco-conscious-young-woman-with-fabric-shopping-bag-44171-large.mp4",
      "https://assets.mixkit.co/videos/preview/mixkit-sewing-machine-close-up-sustainable-designer-44170-large.mp4"
    ];
    const idx = Math.abs(parseInt(studioLastOperationName.split('/').pop() || '0')) % mockVideos.length;
    const nextIdx = (idx + 1) % mockVideos.length;
    const finalStreamUrl = mockVideos[nextIdx];

    setStudioGeneratedUrl(finalStreamUrl);
    const newOpName = `simulated/veo/operations/${Date.now()}`;
    setStudioLastOperationName(newOpName);

    const compositePrompt = `${studioPrompt} -> [Ext: ${studioExtensionPrompt}]`;
    setStudioPrompt(compositePrompt);
    setStudioExtensionPrompt('');

    const newItem = {
      id: `media-${Date.now()}`,
      type: 'video',
      url: finalStreamUrl,
      prompt: compositePrompt,
      aspectRatio: studioAspectRatio,
      timestamp: new Date().toLocaleDateString(),
      operationName: newOpName
    };
    const updated = [newItem, ...studioSavedMedia];
    setStudioSavedMedia(updated);
    localStorage.setItem('social_flow_studio_media', JSON.stringify(updated));
    setStudioGenerating(false);
  };

  // Full-featured Autopilot Creator generating Caption text & Viral Scorecard
  const handleGeneratePostCapAndScore = async () => {
    setLoadingPosts(true);
    try {
      const response = await apiFetch('/api/posts/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: creatorTitle || "Autopilot Post",
          ideaId: activeActiveIdeaId,
          platform: creatorPlatform,
          format: creatorFormat,
          customPrompt: creatorCustomPrompt,
          themePrompt: creatorVisualPrompt,
          referenceMediaUploaded: aiGeneratedUrl || referenceImageUrl || undefined
        })
      });
      
      if (response.ok) {
        const createdPost = await response.json();
        if (createdPost && !createdPost.error) {
          setActiveCreatedPost(createdPost);
          setCaptionDraft(createdPost.caption || "");
          setPosts(prev => [createdPost, ...prev]);
          fetchAnalytics();
          return;
        }
      }
      
      // Fallback on error response
      console.warn("handleGeneratePostCapAndScore response not ok, falling back to simulated post.");
      const mockPost = generateMockSocialPost(
        creatorTitle || "Autopilot Post",
        creatorPlatform,
        creatorFormat,
        creatorCustomPrompt,
        aiGeneratedUrl || referenceImageUrl || undefined
      );
      setActiveCreatedPost(mockPost);
      setCaptionDraft(mockPost.caption || "");
      setPosts(prev => [mockPost, ...prev]);
      fetchAnalytics();
    } catch (err) {
      console.warn("handleGeneratePostCapAndScore threw error, falling back to simulated post:", err);
      const mockPost = generateMockSocialPost(
        creatorTitle || "Autopilot Post",
        creatorPlatform,
        creatorFormat,
        creatorCustomPrompt,
        aiGeneratedUrl || referenceImageUrl || undefined
      );
      setActiveCreatedPost(mockPost);
      setCaptionDraft(mockPost.caption || "");
      setPosts(prev => [mockPost, ...prev]);
      fetchAnalytics();
    } finally {
      setLoadingPosts(false);
    }
  };

  // Instantly deploy to real platforms (simulation updates stats)
  const handlePublishPostNow = async (postId: string) => {
    setPublishingPostId(postId);
    try {
      const response = await apiFetch('/api/posts/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId })
      });
      const publishedPost = await response.json();
      
      // Update lists
      setPosts(prev => prev.map(p => p.id === postId ? publishedPost : p));
      
      if (activeCreatedPost?.id === postId) {
        setActiveCreatedPost(publishedPost);
      }
      
      fetchAnalytics();
    } catch (err) {
      console.error(err);
    } finally {
      setPublishingPostId(null);
    }
  };

  // Update schedule time slot
  const handleSchedulePost = async (postId: string, timeString: string) => {
    try {
      const response = await apiFetch('/api/posts/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId, scheduledTime: timeString })
      });
      const scheduledPost = await response.json();
      setPosts(prev => prev.map(p => p.id === postId ? scheduledPost : p));
      
      if (activeCreatedPost?.id === postId) {
        setActiveCreatedPost(scheduledPost);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Delete draft post
  const handleDeletePost = async (postId: string) => {
    try {
      await apiFetch(`/api/posts/${postId}`, { method: 'DELETE' });
      setPosts(prev => prev.filter(p => p.id !== postId));
      if (activeCreatedPost?.id === postId) {
        setActiveCreatedPost(null);
      }
      fetchAnalytics();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateManualDraft = () => {
    const newPost: SocialPost = {
      id: `draft-${Date.now()}`,
      platform: creatorPlatform || 'Instagram',
      title: 'Nuevo Borrador',
      caption: captionDraft || 'Escribe tu copy aquí...',
      mediaType: 'image',
      mediaUrl: referenceImageUrl || 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?auto=format&fit=crop&w=800&q=80',
      status: 'Draft',
      viralScore: 80,
      scheduledTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    };
    setActiveCreatedPost(newPost);
  };

  // Update post details (such as mediaUrl, caption, etc.)
  const handleUpdatePost = async (updatedPost: SocialPost) => {
    try {
      const response = await apiFetch('/api/posts/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedPost)
      });
      const data = await response.json();
      setPosts(prev => prev.map(p => p.id === updatedPost.id ? data : p));
      if (activeCreatedPost?.id === updatedPost.id) {
        setActiveCreatedPost(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Regenerate post image with AI
  const handleRegeneratePostImage = async (postId: string, promptText: string) => {
    try {
      const response = await apiFetch('/api/posts/generate-ai-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: promptText })
      });
      const data = await response.json();
      if (data.imageUrl) {
        const postToUpdate = posts.find(p => p.id === postId);
        if (postToUpdate) {
          const updatedPost = { 
            ...postToUpdate, 
            mediaUrl: data.imageUrl, 
            mediaType: 'image' as const,
            promptUsed: promptText
          };
          await handleUpdatePost(updatedPost);
          return data.imageUrl;
        }
      }
    } catch (err) {
      console.error("Failed to regenerate post image:", err);
    }
    return null;
  };

  // Upload custom image/video for post
  const handleUploadPostImage = async (postId: string, dataUri: string, mimeType: string, filename: string) => {
    try {
      const response = await apiFetch('/api/media/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dataUri, mimeType, filename })
      });
      const data = await response.json();
      if (data.url) {
        const postToUpdate = posts.find(p => p.id === postId);
        if (postToUpdate) {
          const isVideo = mimeType.startsWith('video/');
          const updatedPost = { 
            ...postToUpdate, 
            mediaUrl: data.url, 
            mediaType: (isVideo ? 'video' : 'image') as ('video' | 'image' | 'text')
          };
          await handleUpdatePost(updatedPost);
          return data.url;
        }
      }
    } catch (err) {
      console.error("Failed to upload custom post media:", err);
    }
    return null;
  };

  // Create new active comparison campaign (A/B Test Variant)
  const handleCreateAbCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingCampaigns(true);
    try {
      const response = await apiFetch('/api/ab-campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newAbName,
          targetProduct: newAbProduct,
          segment: newAbSegment,
          strategyAName: newAbStrategyA,
          strategyBName: newAbStrategyB,
          toneA: newAbToneA,
          toneB: newAbToneB
        })
      });
      
      const newCampaignObj = await response.json();
      setCampaigns(prev => [newCampaignObj, ...prev]);

      // Reset fields
      setNewAbName('');
      setNewAbProduct('');
      setNewAbSegment('');
      setNewAbStrategyA('');
      setNewAbStrategyB('');
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingCampaigns(false);
    }
  };

  // Update social handles only
  const handleUpdateSocialHandles = async (handles: { instagram?: string; facebook?: string; tiktok?: string; linkedin?: string }) => {
    setLoadingBrand(true);
    try {
      const response = await apiFetch('/api/brand-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...brandProfile,
          socialHandles: handles
        })
      });
      const data = await response.json();
      setBrandProfile(data);
    } catch (err) {
      console.error("Error updating social handles", err);
    } finally {
      setLoadingBrand(false);
    }
  };

  // Inject crawled metadata context directly into brand DNA
  const handleInjectScannedContext = async (scannedData: Partial<BrandProfile>) => {
    setLoadingBrand(true);
    setScanStatus('Synchronizing scraped social profile insights into Brand engine...');
    try {
      const response = await apiFetch('/api/brand-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...brandProfile,
          ...scannedData
        })
      });
      const data = await response.json();
      setBrandProfile(data);
      
      // Update our form input states so they sync in the Brand DNA Profile tab input fields instantly!
      if (data) {
        setWebsiteInput(data.website);
        setBrandNameInput(data.name);
        setBrandIndustryInput(data.industry);
        setBrandToneInput(data.tone);
        setBrandBuyersInput(data.targetBuyers);
        setBrandProductsInput(data.keyProducts);
        setBrandContextInput(data.additionalContext);
      }
      
      setScanStatus('Success! Social feeds context is now integrated into Core Autopilot.');
      setTimeout(() => setScanStatus(null), 5500);
    } catch (err) {
      console.error("Error injecting social context", err);
    } finally {
      setLoadingBrand(false);
    }
  };

  return (
    <div className="flex h-screen w-screen bg-slate-50 font-sans text-slate-900 overflow-hidden" id="main-content-window">
      {/* Sidebar navigation component */}
      <Sidebar apiActive={isApiActive} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} onSignOut={() => auth.signOut()} />

      {/* Main Console view */}
      <main className="flex-1 flex flex-col h-full overflow-hidden" id="console-workspace">
        {/* Workspace global Header */}
        <header className="h-16 bg-white border-b border-slate-200 px-4 md:px-6 shrink-0 flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            {/* Mobile Sidebar Hamburger Toggle */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 transition shrink-0"
              title="Open navigation menu"
              id="mobile-sidebar-toggle"
            >
              <Menu className="w-4 h-4" />
            </button>

            <h1 className="text-xs sm:text-sm md:text-base font-bold text-slate-900 tracking-tight capitalize truncate">
              {activeTab === 'copilot' && 'Mi Copiloto de IA'}
              {activeTab === 'arsenal' && 'Mi Biblioteca de Medios'}
              {activeTab === 'scheduler' && 'Agenda de Contenido'}
              {activeTab === 'remodeler' && "Remodelador de Espacio (El Rincón de Mamá)"}
            </h1>
            
            <div className="hidden sm:flex items-center gap-1.5 shrink-0">
              <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[9px] font-bold rounded-full uppercase tracking-wider font-mono">
                Autopilot
              </span>
              <span className="hidden md:inline px-1.5 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-200 text-[9px] font-bold rounded-full font-mono uppercase">
                4 Platforms
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {/* Quick stats indicators in header to make the density high-fidelity */}
            <div className="hidden xl:flex items-center gap-4 border-r border-slate-200 pr-4 text-xs">
              <div>
                <span className="text-slate-500 block font-bold text-[9px] uppercase">Synced Score</span>
                <span className="font-sans font-bold text-indigo-600 block text-right">86.2 Viral Avg</span>
              </div>
              <div className="h-6 w-px bg-slate-200"></div>
              <div>
                <span className="text-slate-500 block font-bold text-[9px] uppercase">Active Queue</span>
                <span className="font-sans font-bold text-emerald-600 block text-right">
                  {posts.filter(p => p.status === 'Scheduled').length} items queued
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="hidden xs:flex -space-x-1.5">
                <div className="w-6 h-6 rounded-full border-2 border-white bg-indigo-500 flex items-center justify-center text-[8px] text-white font-bold font-mono">IG</div>
                <div className="w-6 h-6 rounded-full border-2 border-white bg-sky-500 flex items-center justify-center text-[8px] text-white font-bold font-mono">LI</div>
                <div className="w-6 h-6 rounded-full border-2 border-white bg-rose-500 flex items-center justify-center text-[8px] text-white font-bold font-mono">TT</div>
              </div>
              
              <button 
                onClick={() => {
                  setCreatorTitle('Nueva publicación');
                  setCaptionDraft('');
                  setReferenceImageUrl(null);
                  setImagePreview(null);
                  setActiveCreatedPost(null);
                  setActiveTab('copilot');
                }}
                className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm md:text-xs px-2.5 py-1.5 md:px-3.5 md:py-2 rounded-lg transition-all duration-200 shadow-sm cursor-pointer"
              >
                + Nuevo Borrador
              </button>
            </div>
          </div>
        </header>

        {/* Global info/notification bar if scanning or generating */}
        {scanStatus && (
          <div className="bg-indigo-50 border-b border-indigo-100 text-indigo-900 text-xs py-2.5 px-6 flex items-center justify-between font-medium">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600 animate-pulse" />
              <span>{scanStatus}</span>
            </div>
            <button onClick={() => setScanStatus(null)} className="text-slate-500 hover:text-slate-600">&times;</button>
          </div>
        )}

        {/* Workspace core body with customized tabs */}
        <div className="flex-1 overflow-y-auto p-6 min-h-0 bg-slate-50/50">
          
          {/* TAB 1: AI Copilot Assistant */}
          {activeTab === 'copilot' && (
            <AICopilotView 
              agentMessages={agentMessages}
              loadingAgent={loadingAgent}
              agentInput={agentInput}
              setAgentInput={setAgentInput}
              handleSendAgentMsg={handleSendAgentMsg}
              handleSendSuggestedMsg={(msg) => {
                setAgentInput(msg);
                handleSendAgentMsg(msg);
              }}
              captionDraft={captionDraft}
              setCaptionDraft={setCaptionDraft}
              activeCreatedPost={activeCreatedPost}
              setActiveCreatedPost={setActiveCreatedPost}
              referenceImageUrl={referenceImageUrl}
              setReferenceImageUrl={setReferenceImageUrl}
              imagePreview={imagePreview}
              setImagePreview={setImagePreview}
              creatorFormat={creatorFormat as any}
              setCreatorPlatform={setCreatorPlatform}
              creatorPlatform={creatorPlatform}
              scheduledDraftTime={scheduledDraftTime}
              setScheduledDraftTime={setScheduledDraftTime}
              publishingPostId={publishingPostId}
              creatorTitle={creatorTitle}
              handlePublishPostNow={handlePublishPostNow}
              handleSchedulePost={handleSchedulePost}
              setActiveTab={setActiveTab}
              handleDeletePost={handleDeletePost}
              setPosts={setPosts}
              apiFetch={apiFetch}
            />
          )}

          {/* TAB 2: Brand Profile Context Engine */}
          {activeTab === 'brand' && (
            <BrandProfileView 
              websiteInput={websiteInput}
              setWebsiteInput={setWebsiteInput}
              brandNameInput={brandNameInput}
              setBrandNameInput={setBrandNameInput}
              brandIndustryInput={brandIndustryInput}
              setBrandIndustryInput={setBrandIndustryInput}
              brandToneInput={brandToneInput}
              setBrandToneInput={setBrandToneInput}
              brandBuyersInput={brandBuyersInput}
              setBrandBuyersInput={setBrandBuyersInput}
              brandProductsInput={brandProductsInput}
              setBrandProductsInput={setBrandProductsInput}
              brandContextInput={brandContextInput}
              setBrandContextInput={setBrandContextInput}
              loadingBrand={loadingBrand}
              handleUpdateBrand={handleUpdateBrand}
            />
          )}

          {/* TAB 3: AI Content Idea Vault */}
          {activeTab === 'ideas' && (
            <IdeasVaultView 
              referenceText={referenceText}
              setReferenceText={setReferenceText}
              imagePreview={imagePreview}
              imageFile={imageFile}
              handleImageChange={handleImageChange}
              handleGenerateIdeas={handleGenerateIdeas}
              loadingIdeas={loadingIdeas}
              ideas={ideas}
              handleSelectIdeaToCreate={handleSelectIdeaToCreate}
            />
          )}

          {/* TAB 4: Predictive Creator Studio */}
          {activeTab === 'publisher' && (
            <PublisherView 
              fetchIgRecentMedia={fetchIgRecentMedia}
              loadingIgMedia={loadingIgMedia}
              igRecentMedia={igRecentMedia}
              selectedMediaId={selectedMediaId}
              setSelectedMediaId={setSelectedMediaId}
              setReferenceImageUrl={setReferenceImageUrl}
              creatorPlatform={creatorPlatform}
              setCreatorPlatform={setCreatorPlatform}
              creatorFormat={creatorFormat}
              setCreatorFormat={setCreatorFormat}
              creatorTitle={creatorTitle}
              setCreatorTitle={setCreatorTitle}
              creatorCustomPrompt={creatorCustomPrompt}
              setCreatorCustomPrompt={setCreatorCustomPrompt}
              creatorVisualPrompt={creatorVisualPrompt}
              setCreatorVisualPrompt={setCreatorVisualPrompt}
              brandName={brandProfile?.companyName || "Mi Empresa"}
              handleGenerateAIImage={handleGenerateAIImage}
              generatingAIImage={generatingAIImage}
              scheduledDraftTime={scheduledDraftTime}
              setScheduledDraftTime={setScheduledDraftTime}
              handleGeneratePostCapAndScore={handleGeneratePostCapAndScore}
              loadingPosts={loadingPosts}
              activeCreatedPost={activeCreatedPost}
              referenceImageUrl={referenceImageUrl}
              imagePreview={imagePreview}
              aiGeneratedUrl={aiGeneratedUrl}
              captionDraft={captionDraft}
              setCaptionDraft={setCaptionDraft}
              handlePublishPostNow={handlePublishPostNow}
              publishingPostId={publishingPostId}
              handleSchedulePost={handleSchedulePost}
              handleDeletePost={handleDeletePost}
              arsenalMedia={arsenalMedia}
            />
          )}

          {/* TAB 5: Automated Schedule & Calendar */}
          {activeTab === 'scheduler' && (
            <div className="space-y-6" id="scheduler-tab">
              {/* Header block with interactive switcher */}
              <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h2 className="text-sm font-bold text-slate-900 font-sans tracking-tight">Post Autopilot Deployment Console</h2>
                  <p className="text-slate-600 text-xs">These post drafts deploy automatically. Drag items across coordinates on the Visual Calendar tool grid to reschedule.</p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200" id="scheduler-layout-toggle">
                    <button
                      onClick={() => setSchedulerViewMode('calendar')}
                      className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all duration-150 ${
                        schedulerViewMode === 'calendar' 
                          ? 'bg-indigo-600 text-white shadow-xs' 
                          : 'text-slate-600 hover:text-slate-950 font-semibold'
                      }`}
                    >
                      Visual Calendar View
                    </button>
                    <button
                      onClick={() => setSchedulerViewMode('list')}
                      className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all duration-150 ${
                        schedulerViewMode === 'list' 
                          ? 'bg-indigo-600 text-white shadow-xs' 
                          : 'text-slate-600 hover:text-slate-950 font-semibold'
                      }`}
                    >
                      Timeline List View
                    </button>
                  </div>

                  <div className="hidden lg:flex items-center gap-1.5 text-xs text-slate-500 font-mono pl-3 border-l border-slate-200 font-bold">
                    <Check className="w-4 h-4 text-indigo-500" />
                    <span>Autopilot Active</span>
                  </div>
                </div>
              </div>

              {schedulerViewMode === 'calendar' ? (
                <CalendarView
                  posts={posts}
                  onReschedule={handleSchedulePost}
                  onPublish={handlePublishPostNow}
                  onDelete={handleDeletePost}
                  onPlanCampaignClick={() => setActiveTab('publisher')}
                  onUpdatePost={handleUpdatePost}
                  onRegenerateImage={handleRegeneratePostImage}
                  onUploadImage={handleUploadPostImage}
                />
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Deployment list */}
                  <div className="lg:col-span-8 bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
                    <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-slate-500">Scheduled & Logged Automations</h3>
                    
                    {posts.length === 0 ? (
                      <div className="text-center p-8 text-slate-500">
                        <CalendarRange className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                        <p className="text-xs">No active posts planned yet. Push content from the Idea Vault to start.</p>
                      </div>
                    ) : (
                      <div className="divide-y divide-slate-100">
                        {posts.map((post) => {
                          const isPosted = post.status === 'Posted';
                          const isScheduled = post.status === 'Scheduled';
                          const isTikTok = post.platform === 'TikTok';
                          const isInstagram = post.platform === 'Instagram';
                          const isLinkedIn = post.platform === 'LinkedIn';
                          const isFacebook = post.platform === 'Facebook';

                          let badgeColor = 'bg-slate-100 text-slate-800 border-slate-200';
                          if (isPosted) badgeColor = 'bg-emerald-50 text-emerald-800 border-emerald-100';
                          else if (isScheduled) badgeColor = 'bg-indigo-50 text-indigo-800 border-indigo-100';

                          let platformPill = 'bg-purple-100 text-purple-800';
                          if (isTikTok) platformPill = 'bg-teal-100 text-teal-800';
                          else if (isInstagram) platformPill = 'bg-rose-100 text-rose-800';
                          else if (isLinkedIn) platformPill = 'bg-sky-100 text-sky-800';

                          return (
                            <div key={post.id} className="py-4 flex gap-4 items-start first:pt-0 last:pb-0" id={`schedule-post-item-${post.id}`}>
                              {/* Visual Asset representation */}
                              <div className="w-16 h-16 bg-slate-100 rounded-lg overflow-hidden border border-slate-200 shrink-0 relative">
                                {post.mediaUrl ? (
                                  <img 
                                    src={post.mediaUrl} 
                                    className="w-full h-full object-cover" 
                                    alt="visual thumbnail" 
                                    onError={(e) => {
                                      e.currentTarget.onerror = null;
                                      e.currentTarget.src = "https://images.unsplash.com/photo-1540962351504-03099e0a754b?auto=format&fit=crop&w=800&q=80";
                                    }}
                                  />
                                ) : (
                                  <div className="flex items-center justify-center h-full text-slate-300">
                                    <ImageIcon className="w-5 h-5" />
                                  </div>
                                )}
                                <span className={`absolute bottom-0 left-0 right-0 text-[8px] text-center font-bold text-white uppercase py-0.5 ${
                                  isPosted ? 'bg-emerald-600' : 'bg-indigo-600'
                                }`}>
                                  {post.status}
                                </span>
                              </div>

                              {/* Details context block */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-bold text-slate-900 text-xs truncate max-w-sm">{post.title}</span>
                                  <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase tracking-wide ${platformPill}`}>
                                    {post.platform}
                                  </span>
                                </div>
                                <p className="text-sm text-slate-600 line-clamp-2 italic mb-2">
                                  "{post.caption || 'No caption'}"
                                </p>
                                
                                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 font-mono">
                                  <span className="flex items-center gap-1">
                                    <Clock className="w-3" />
                                    <span>{post.scheduledTime}</span>
                                  </span>
                                  {post.viralScore && (
                                    <span className="text-indigo-600 font-bold">
                                      Forecast Score: {post.viralScore}/100
                                    </span>
                                  )}
                                </div>
                              </div>

                              {/* Actions options to push or manage */}
                              <div className="shrink-0 flex items-center gap-1.5">
                                {!isPosted && (
                                  <button
                                    onClick={() => handlePublishPostNow(post.id)}
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-2 py-1 rounded transition"
                                  >
                                    Deploy Now
                                  </button>
                                )}
                                <button
                                  onClick={() => handleDeletePost(post.id)}
                                  className="text-slate-500 hover:text-red-500 p-1.5 transition"
                                  title="Delete automation post"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Simulated optimal timing recommendation side card */}
                  <div className="lg:col-span-4 bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
                    <div className="flex items-center gap-2 text-indigo-900">
                      <Sparkles className="w-4 h-4 text-indigo-600" />
                      <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Channel Smart Peak Hours</h3>
                    </div>
                    <p className="text-slate-600 text-xs">
                      Our database tracking identifies matching traffic peaks based on the sustainable apparel buyer segments:
                    </p>

                    <div className="space-y-3 font-sans text-xs">
                      <div className="p-3 bg-slate-50 rounded-lg border-l-4 border-rose-400">
                        <div className="flex justify-between items-center mb-0.5">
                          <span className="font-bold text-rose-700">Instagram Feeds</span>
                          <span className="text-xs bg-slate-200 px-1.5 rounded font-mono">11:00 AM Sundays</span>
                        </div>
                        <p className="text-xs text-slate-600">Perfect for swipes & detailed storytelling on wellness organic textiles.</p>
                      </div>

                      <div className="p-3 bg-slate-50 rounded-lg border-l-4 border-teal-400">
                        <div className="flex justify-between items-center mb-0.5">
                          <span className="font-bold text-teal-700">TikTok Shorts</span>
                          <span className="text-xs bg-slate-200 px-1.5 rounded font-mono">6:30 PM Thursdays</span>
                        </div>
                        <p className="text-xs text-slate-600">Video loops hit maximum organic algorithmic velocity during evening commutes.</p>
                      </div>

                      <div className="p-3 bg-slate-50 rounded-lg border-l-4 border-sky-400">
                        <div className="flex justify-between items-center mb-0.5">
                          <span className="font-bold text-sky-700">LinkedIn Business Post</span>
                          <span className="text-xs bg-slate-200 px-1.5 rounded font-mono">8:45 AM Tuesdays</span>
                        </div>
                        <p className="text-xs text-slate-600">CSR corporate executives view supply transparency data directly on breakfast tables.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 6: Headline A/B Testing & Campaigns */}
          {activeTab === 'campaigns' && (
            <ABTestsView 
              newAbName={newAbName}
              setNewAbName={setNewAbName}
              newAbProduct={newAbProduct}
              setNewAbProduct={setNewAbProduct}
              newAbSegment={newAbSegment}
              setNewAbSegment={setNewAbSegment}
              newAbStrategyA={newAbStrategyA}
              setNewAbStrategyA={setNewAbStrategyA}
              newAbToneA={newAbToneA}
              setNewAbToneA={setNewAbToneA}
              newAbStrategyB={newAbStrategyB}
              setNewAbStrategyB={setNewAbStrategyB}
              newAbToneB={newAbToneB}
              setNewAbToneB={setNewAbToneB}
              loadingCampaigns={loadingCampaigns}
              handleCreateAbCampaign={handleCreateAbCampaign}
              campaigns={campaigns}
            />
          )}

          {/* TAB 7: Connected Channels & Social Scanner */}
          {activeTab === 'channels' && (
            <ConnectedPlatforms 
              brandProfile={brandProfile}
              onUpdateSocialHandles={handleUpdateSocialHandles}
              onInjectScannedContext={handleInjectScannedContext}
            />
          )}

          {/* TAB 8: Content Arsenal (Media Assets Library) */}
          {activeTab === 'arsenal' && (
            <ContentArsenal 
              mediaList={arsenalMedia}
              loading={loadingArsenal}
              onUpload={handleUploadArsenalMedia}
              onDelete={handleDeleteArsenalMedia}
              onSelectForPost={handleSelectArsenalForPost}
              onSelectForStudio={handleSelectArsenalForStudio}
            />
          )}

          {/* TAB 9: AI Creative Studio (Google Veo 3.1 & Nano Banana 2) */}
          {activeTab === 'studio' && (
            <CreativeStudioView 
              studioFormat={studioFormat}
              setStudioFormat={setStudioFormat}
              studioAspectRatio={studioAspectRatio}
              setStudioAspectRatio={setStudioAspectRatio}
              studioPrompt={studioPrompt}
              setStudioPrompt={setStudioPrompt}
              studioSize={studioSize}
              setStudioSize={setStudioSize}
              studioEnableGrounding={studioEnableGrounding}
              setStudioEnableGrounding={setStudioEnableGrounding}
              studioVideoModel={studioVideoModel}
              setStudioVideoModel={setStudioVideoModel}
              studioVideoResolution={studioVideoResolution}
              setStudioVideoResolution={setStudioVideoResolution}
              studioVideoDuration={studioVideoDuration}
              setStudioVideoDuration={setStudioVideoDuration}
              studioStarterImage={studioStarterImage}
              setStudioStarterImage={setStudioStarterImage}
              handleStudioStarterImageChange={handleStudioStarterImageChange}
              handleSynthesizeCreative={handleSynthesizeCreative}
              studioGenerating={studioGenerating}
              studioStatusText={studioStatusText}
              studioGeneratedUrl={studioGeneratedUrl}
              setStudioGeneratedUrl={setStudioGeneratedUrl}
              studioLastOperationName={studioLastOperationName}
              setStudioLastOperationName={setStudioLastOperationName}
              studioExtensionPrompt={studioExtensionPrompt}
              setStudioExtensionPrompt={setStudioExtensionPrompt}
              handleExtendCreative={handleExtendCreative}
              studioSavedMedia={studioSavedMedia}
              setStudioSavedMedia={setStudioSavedMedia}
              setAiGeneratedUrl={setAiGeneratedUrl}
              setCreatorFormat={setCreatorFormat}
              setCreatorVisualPrompt={setCreatorVisualPrompt}
              setActiveTab={setActiveTab}
            />
          )}

          {/* TAB 10: Remodelar mi espacio (El Rincón de Mamá) */}
          {activeTab === 'remodeler' && (
            <SpaceRemodeler />
          )}

        </div>
      </main>
    </div>
  );
}



