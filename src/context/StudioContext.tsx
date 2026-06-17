import React, { createContext, useContext, useState } from 'react';

interface StudioContextType {
  studioPrompt: string;
  setStudioPrompt: (val: string) => void;
  studioFormat: 'image' | 'video';
  setStudioFormat: (val: 'image' | 'video') => void;
  studioAspectRatio: string;
  setStudioAspectRatio: (val: string) => void;
  studioSize: string;
  setStudioSize: (val: string) => void;
  studioVideoResolution: string;
  setStudioVideoResolution: (val: string) => void;
  studioVideoModel: string;
  setStudioVideoModel: (val: string) => void;
  studioVideoDuration: number;
  setStudioVideoDuration: (val: number) => void;
  studioEnableGrounding: boolean;
  setStudioEnableGrounding: (val: boolean) => void;
  studioStarterImage: string | null;
  setStudioStarterImage: (val: string | null) => void;
  studioStarterImageMime: string;
  setStudioStarterImageMime: (val: string) => void;
  studioGenerating: boolean;
  setStudioGenerating: (val: boolean) => void;
  studioStatusText: string;
  setStudioStatusText: (val: string) => void;
  studioGeneratedUrl: string | null;
  setStudioGeneratedUrl: (val: string | null) => void;
  studioLastOperationName: string | null;
  setStudioLastOperationName: (val: string | null) => void;
  studioExtensionPrompt: string;
  setStudioExtensionPrompt: (val: string) => void;
  studioSavedMedia: any[];
  setStudioSavedMedia: React.Dispatch<React.SetStateAction<any[]>>;
  creatorVisualPrompt: string;
  setCreatorVisualPrompt: (val: string) => void;
  creatorCustomPrompt: string;
  setCreatorCustomPrompt: (val: string) => void;
  generatingAIImage: boolean;
  setGeneratingAIImage: (val: boolean) => void;
  aiImagePrompt: string;
  setAiImagePrompt: (val: string) => void;
  aiGeneratedUrl: string | null;
  setAiGeneratedUrl: (val: string | null) => void;
}

const StudioContext = createContext<StudioContextType | undefined>(undefined);

export function StudioProvider({ children }: { children: React.ReactNode }) {
  const [studioPrompt, setStudioPrompt] = useState('Premium commercial photography of raw ecological linen textile garments layered neatly on white ocean sand, warm studio lighting rays, 8k professional editorial look');
  const [studioFormat, setStudioFormat] = useState<'image' | 'video'>('image');
  const [studioAspectRatio, setStudioAspectRatio] = useState('1:1');
  const [studioSize, setStudioSize] = useState('1K');
  const [studioVideoResolution, setStudioVideoResolution] = useState('720p');
  const [studioVideoModel, setStudioVideoModel] = useState('veo-3.1-generate-preview');
  const [studioVideoDuration, setStudioVideoDuration] = useState<number>(5);
  const [studioEnableGrounding, setStudioEnableGrounding] = useState(false);
  const [studioStarterImage, setStudioStarterImage] = useState<string | null>(null);
  const [studioStarterImageMime, setStudioStarterImageMime] = useState<string>('image/png');
  const [studioGenerating, setStudioGenerating] = useState(false);
  const [studioStatusText, setStudioStatusText] = useState('');
  const [studioGeneratedUrl, setStudioGeneratedUrl] = useState<string | null>(null);
  const [studioLastOperationName, setStudioLastOperationName] = useState<string | null>(null);
  const [studioExtensionPrompt, setStudioExtensionPrompt] = useState<string>('');
  
  const [studioSavedMedia, setStudioSavedMedia] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('social_flow_studio_media');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [creatorVisualPrompt, setCreatorVisualPrompt] = useState('Clean flat lay commercial shot with warm studio lighting');
  const [creatorCustomPrompt, setCreatorCustomPrompt] = useState('');
  const [generatingAIImage, setGeneratingAIImage] = useState(false);
  const [aiImagePrompt, setAiImagePrompt] = useState('');
  const [aiGeneratedUrl, setAiGeneratedUrl] = useState<string | null>(null);

  return (
    <StudioContext.Provider value={{
      studioPrompt, setStudioPrompt,
      studioFormat, setStudioFormat,
      studioAspectRatio, setStudioAspectRatio,
      studioSize, setStudioSize,
      studioVideoResolution, setStudioVideoResolution,
      studioVideoModel, setStudioVideoModel,
      studioVideoDuration, setStudioVideoDuration,
      studioEnableGrounding, setStudioEnableGrounding,
      studioStarterImage, setStudioStarterImage,
      studioStarterImageMime, setStudioStarterImageMime,
      studioGenerating, setStudioGenerating,
      studioStatusText, setStudioStatusText,
      studioGeneratedUrl, setStudioGeneratedUrl,
      studioLastOperationName, setStudioLastOperationName,
      studioExtensionPrompt, setStudioExtensionPrompt,
      studioSavedMedia, setStudioSavedMedia,
      creatorVisualPrompt, setCreatorVisualPrompt,
      creatorCustomPrompt, setCreatorCustomPrompt,
      generatingAIImage, setGeneratingAIImage,
      aiImagePrompt, setAiImagePrompt,
      aiGeneratedUrl, setAiGeneratedUrl
    }}>
      {children}
    </StudioContext.Provider>
  );
}

export function useStudio() {
  const context = useContext(StudioContext);
  if (context === undefined) {
    throw new Error('useStudio must be used within a StudioProvider');
  }
  return context;
}
