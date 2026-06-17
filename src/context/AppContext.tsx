import React, { createContext, useContext, useState } from 'react';
import { SocialPost, ContentIdea, ArsenalMediaAsset } from '../types';

interface AppContextType {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  posts: SocialPost[];
  setPosts: React.Dispatch<React.SetStateAction<SocialPost[]>>;
  ideas: ContentIdea[];
  setIdeas: React.Dispatch<React.SetStateAction<ContentIdea[]>>;
  arsenalMedia: ArsenalMediaAsset[];
  setArsenalMedia: React.Dispatch<React.SetStateAction<ArsenalMediaAsset[]>>;
  loadingPosts: boolean;
  setLoadingPosts: (val: boolean) => void;
  loadingIdeas: boolean;
  setLoadingIdeas: (val: boolean) => void;
  loadingArsenal: boolean;
  setLoadingArsenal: (val: boolean) => void;
  apiConfig: any;
  setApiConfig: React.Dispatch<React.SetStateAction<any>>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [activeTab, setActiveTab] = useState('copilot');
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [ideas, setIdeas] = useState<ContentIdea[]>([]);
  const [arsenalMedia, setArsenalMedia] = useState<ArsenalMediaAsset[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [loadingIdeas, setLoadingIdeas] = useState(false);
  const [loadingArsenal, setLoadingArsenal] = useState(false);
  
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
      ideas, setIdeas,
      arsenalMedia, setArsenalMedia,
      loadingPosts, setLoadingPosts,
      loadingIdeas, setLoadingIdeas,
      loadingArsenal, setLoadingArsenal,
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
