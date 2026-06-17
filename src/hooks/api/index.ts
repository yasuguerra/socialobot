import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '../../firebase';
import { BrandProfile, ContentIdea, SocialPost, ABCampaign, ArsenalMediaAsset } from '../../types';
import { MOCK_INSTAGRAM_FEED, MOCK_ARSENAL_ASSETS, EMPTY_ANALYTICS_DATA } from '../../mocks/seedData';

// --- Brand Profile ---
export const useBrandProfile = () => {
  return useQuery({
    queryKey: ['brandProfile'],
    queryFn: async () => {
      const res = await apiFetch('/api/brand-profile');
      if (!res.ok) throw new Error('Failed to fetch brand profile');
      return res.json() as Promise<BrandProfile>;
    }
  });
};

export const useUpdateBrandProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (profileData: Partial<BrandProfile>) => {
      const res = await apiFetch('/api/brand-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData)
      });
      if (!res.ok) throw new Error('Failed to update brand profile');
      return res.json() as Promise<BrandProfile>;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['brandProfile'], data);
    }
  });
};

// --- Ideas ---
export const useContentIdeas = () => {
  return useQuery({
    queryKey: ['ideas'],
    queryFn: async () => {
      const res = await apiFetch('/api/ideas');
      if (!res.ok) throw new Error('Failed to fetch ideas');
      return res.json() as Promise<ContentIdea[]>;
    }
  });
};

export const useGenerateIdeas = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { referencePostText?: string; mediaBase64?: string; mediaMimeType?: string }) => {
      const res = await apiFetch('/api/ideas/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Failed to generate ideas');
      return res.json() as Promise<ContentIdea[]>;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['ideas'], data);
    }
  });
};

// --- Posts ---
export const usePosts = () => {
  return useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      const res = await apiFetch('/api/posts');
      if (!res.ok) throw new Error('Failed to fetch posts');
      return res.json() as Promise<SocialPost[]>;
    }
  });
};

export const usePostsMutations = () => {
  const queryClient = useQueryClient();

  const publishPost = useMutation({
    mutationFn: async (postId: string) => {
      const res = await apiFetch('/api/posts/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId })
      });
      if (!res.ok) throw new Error('Failed to publish post');
      return res.json() as Promise<SocialPost>;
    },
    onSuccess: (updatedPost) => {
      queryClient.setQueryData(['posts'], (old: SocialPost[] = []) => 
        old.map(p => p.id === updatedPost.id ? updatedPost : p)
      );
    }
  });

  const schedulePost = useMutation({
    mutationFn: async ({ postId, timeString }: { postId: string, timeString: string }) => {
      const res = await apiFetch('/api/posts/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId, scheduledTime: timeString })
      });
      if (!res.ok) throw new Error('Failed to schedule post');
      return res.json() as Promise<SocialPost>;
    },
    onSuccess: (updatedPost) => {
      queryClient.setQueryData(['posts'], (old: SocialPost[] = []) => 
        old.map(p => p.id === updatedPost.id ? updatedPost : p)
      );
    }
  });

  const deletePost = useMutation({
    mutationFn: async (postId: string) => {
      const res = await apiFetch(`/api/posts/${postId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete post');
      return postId;
    },
    onSuccess: (postId) => {
      queryClient.setQueryData(['posts'], (old: SocialPost[] = []) => 
        old.filter(p => p.id !== postId)
      );
    }
  });

  const generatePost = useMutation({
    mutationFn: async (payload: any) => {
      const res = await apiFetch('/api/posts/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Failed to generate post');
      return res.json() as Promise<SocialPost>;
    },
    onSuccess: (newPost: any) => {
      if (newPost && !newPost.error) {
        queryClient.setQueryData(['posts'], (old: SocialPost[] = []) => [newPost, ...old]);
      }
    }
  });

  const updatePost = useMutation({
    mutationFn: async (updatedPost: SocialPost) => {
      const res = await apiFetch('/api/posts/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedPost)
      });
      if (!res.ok) throw new Error('Failed to update post');
      return res.json() as Promise<SocialPost>;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['posts'], (old: SocialPost[] = []) => 
        old.map(p => p.id === data.id ? data : p)
      );
    }
  });

  const regeneratePostImage = useMutation({
    mutationFn: async ({ postId, promptText }: { postId: string, promptText: string }) => {
      const res = await apiFetch('/api/posts/generate-ai-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: promptText })
      });
      if (!res.ok) throw new Error('Failed to generate AI image');
      return res.json() as Promise<{ imageUrl: string }>;
    }
  });

  const uploadPostImage = useMutation({
    mutationFn: async ({ postId, dataUri, mimeType, filename }: { postId: string, dataUri: string, mimeType: string, filename: string }) => {
      const res = await apiFetch('/api/media/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dataUri, mimeType, filename })
      });
      if (!res.ok) throw new Error('Failed to upload custom media');
      return res.json() as Promise<{ url: string }>;
    }
  });

  return { publishPost, schedulePost, deletePost, generatePost, updatePost, regeneratePostImage, uploadPostImage };
};

// --- Campaigns ---
export const useAbCampaigns = () => {
  return useQuery({
    queryKey: ['campaigns'],
    queryFn: async () => {
      const res = await apiFetch('/api/ab-campaigns');
      if (!res.ok) throw new Error('Failed to fetch campaigns');
      return res.json() as Promise<ABCampaign[]>;
    }
  });
};

export const useCreateAbCampaign = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: any) => {
      const res = await apiFetch('/api/ab-campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Failed to create AB campaign');
      return res.json() as Promise<ABCampaign>;
    },
    onSuccess: (newCampaign) => {
      queryClient.setQueryData(['campaigns'], (old: ABCampaign[] = []) => [newCampaign, ...old]);
    }
  });
};

// --- Analytics ---
export const useAnalyticsData = () => {
  return useQuery({
    queryKey: ['analytics'],
    queryFn: async () => {
      try {
        const res = await apiFetch('/api/analytics');
        if (res.ok) {
          const data = await res.json();
          return data;
        }
      } catch (err) {
        console.warn("Error fetching analytics, using empty mock", err);
      }
      return EMPTY_ANALYTICS_DATA;
    }
  });
};

// --- Instagram Media ---
export const useIgRecentMedia = (isDevAccount: boolean) => {
  return useQuery({
    queryKey: ['igRecentMedia'],
    queryFn: async () => {
      try {
        const res = await apiFetch('/api/platforms/instagram/recent-media');
        if (res.ok) {
          return res.json() as Promise<any[]>;
        }
      } catch (err) {
        console.warn("Error fetching IG media, falling back to mock", err);
      }
      return isDevAccount ? MOCK_INSTAGRAM_FEED : [];
    }
  });
};

// --- Arsenal Media ---
export const useArsenalMedia = (isDevAccount: boolean) => {
  return useQuery({
    queryKey: ['arsenalMedia'],
    queryFn: async () => {
      try {
        const res = await apiFetch('/api/media-arsenal');
        if (res.ok) {
          const data = await res.json();
          if (data && data.length > 0) return data as ArsenalMediaAsset[];
        }
      } catch (err) {
        console.warn("Error fetching arsenal, falling back to mock", err);
      }
      return isDevAccount ? MOCK_ARSENAL_ASSETS : [];
    }
  });
};

export const useUploadArsenalMedia = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { dataUri: string; mimeType: string; filename: string }) => {
      const res = await apiFetch('/api/media-arsenal/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to upload asset');
      }
      return res.json() as Promise<ArsenalMediaAsset>;
    },
    onSuccess: (newAsset) => {
      queryClient.setQueryData(['arsenalMedia'], (old: ArsenalMediaAsset[] = []) => [newAsset, ...old]);
    }
  });
};

export const useDeleteArsenalMedia = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await apiFetch(`/api/media-arsenal/${id}`, {
        method: 'DELETE'
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to delete asset');
      }
      return id;
    },
    onSuccess: (id) => {
      queryClient.setQueryData(['arsenalMedia'], (old: ArsenalMediaAsset[] = []) => old.filter(item => item.id !== id));
    }
  });
};