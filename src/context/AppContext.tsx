import React, { createContext, useContext, useState, useEffect } from 'react';
import { SocialPost, BrandProfile, ABCampaign, ContentIdea } from '../types';

interface AppContextType {
  // Global App State
  activeTab: string;
  setActiveTab: (tab: string) => void;
  posts: SocialPost[];
  setPosts: React.Dispatch<React.SetStateAction<SocialPost[]>>;
  brandProfile: BrandProfile | null;
  setBrandProfile: React.Dispatch<React.SetStateAction<BrandProfile | null>>;
  
  // Copilot State
  chatHistory: any[];
  setChatHistory: React.Dispatch<React.SetStateAction<any[]>>;
  loadingAgent: boolean;
  setLoadingAgent: (val: boolean) => void;
  agentInput: string;
  setAgentInput: (val: string) => void;
  
  // Active Draft State (Shared)
  activeCreatedPost: SocialPost | null;
  setActiveCreatedPost: React.Dispatch<React.SetStateAction<SocialPost | null>>;
  captionDraft: string;
  setCaptionDraft: (val: string) => void;
  referenceImageUrl: string | null;
  setReferenceImageUrl: (val: string | null) => void;
  imagePreview: string | null;
  setImagePreview: (val: string | null) => void;
  
  // Studio / Creator State
  creatorFormat: string;
  setCreatorFormat: (val: string) => void;
  creatorPlatform: string;
  setCreatorPlatform: (val: string) => void;
  creatorTitle: string;
  setCreatorTitle: (val: string) => void;
  
  // API Config
  apiConfig: any;
  setApiConfig: React.Dispatch<React.SetStateAction<any>>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [activeTab, setActiveTab] = useState('copilot');
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [brandProfile, setBrandProfile] = useState<BrandProfile | null>(null);
  const [chatHistory, setChatHistory] = useState<any[]>([{ id: 'welcome', sender: 'agent', text: '¡Hola! Soy tu Copiloto de IA de Social.Flow. ¿Qué tipo de publicación te gustaría crear hoy para tu marca?' }]);
  const [loadingAgent, setLoadingAgent] = useState(false);
  const [agentInput, setAgentInput] = useState('');
  
  const [activeCreatedPost, setActiveCreatedPost] = useState<SocialPost | null>(null);
  const [captionDraft, setCaptionDraft] = useState('');
  const [referenceImageUrl, setReferenceImageUrl] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const [creatorFormat, setCreatorFormat] = useState('Image');
  const [creatorPlatform, setCreatorPlatform] = useState('Instagram');
  const [creatorTitle, setCreatorTitle] = useState('');
  
  const [apiConfig, setApiConfig] = useState({ 
    geminiApiKey: '', 
    firebaseConfig: '', 
    gcpProjectId: '', 
    provider: 'vertex' 
  });

  return (
    <AppContext.Provider value={{
      activeTab, setActiveTab,
      posts, setPosts,
      brandProfile, setBrandProfile,
      chatHistory, setChatHistory,
      loadingAgent, setLoadingAgent,
      agentInput, setAgentInput,
      activeCreatedPost, setActiveCreatedPost,
      captionDraft, setCaptionDraft,
      referenceImageUrl, setReferenceImageUrl,
      imagePreview, setImagePreview,
      creatorFormat, setCreatorFormat,
      creatorPlatform, setCreatorPlatform,
      creatorTitle, setCreatorTitle,
      apiConfig, setApiConfig
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
