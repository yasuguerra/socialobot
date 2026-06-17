import React, { createContext, useContext, useState } from 'react';
import { ABCampaign } from '../types';

interface CampaignsContextType {
  campaigns: ABCampaign[];
  setCampaigns: React.Dispatch<React.SetStateAction<ABCampaign[]>>;
  loadingCampaigns: boolean;
  setLoadingCampaigns: (val: boolean) => void;
  newAbName: string;
  setNewAbName: (val: string) => void;
  newAbProduct: string;
  setNewAbProduct: (val: string) => void;
  newAbSegment: string;
  setNewAbSegment: (val: string) => void;
  newAbStrategyA: string;
  setNewAbStrategyA: (val: string) => void;
  newAbStrategyB: string;
  setNewAbStrategyB: (val: string) => void;
  newAbToneA: string;
  setNewAbToneA: (val: string) => void;
  newAbToneB: string;
  setNewAbToneB: (val: string) => void;
}

const CampaignsContext = createContext<CampaignsContextType | undefined>(undefined);

export function CampaignsProvider({ children }: { children: React.ReactNode }) {
  const [campaigns, setCampaigns] = useState<ABCampaign[]>([]);
  const [loadingCampaigns, setLoadingCampaigns] = useState(false);
  
  const [newAbName, setNewAbName] = useState('');
  const [newAbProduct, setNewAbProduct] = useState('');
  const [newAbSegment, setNewAbSegment] = useState('');
  const [newAbStrategyA, setNewAbStrategyA] = useState('');
  const [newAbStrategyB, setNewAbStrategyB] = useState('');
  const [newAbToneA, setNewAbToneA] = useState('Relatable, Punchy');
  const [newAbToneB, setNewAbToneB] = useState('Informative, Expert');

  return (
    <CampaignsContext.Provider value={{
      campaigns, setCampaigns,
      loadingCampaigns, setLoadingCampaigns,
      newAbName, setNewAbName,
      newAbProduct, setNewAbProduct,
      newAbSegment, setNewAbSegment,
      newAbStrategyA, setNewAbStrategyA,
      newAbStrategyB, setNewAbStrategyB,
      newAbToneA, setNewAbToneA,
      newAbToneB, setNewAbToneB
    }}>
      {children}
    </CampaignsContext.Provider>
  );
}

export function useCampaigns() {
  const context = useContext(CampaignsContext);
  if (context === undefined) {
    throw new Error('useCampaigns must be used within a CampaignsProvider');
  }
  return context;
}
