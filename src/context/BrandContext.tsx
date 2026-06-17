import React, { createContext, useContext, useState } from 'react';
import { BrandProfile } from '../types';

interface BrandContextType {
  brandProfile: BrandProfile | null;
  setBrandProfile: React.Dispatch<React.SetStateAction<BrandProfile | null>>;
  loadingBrand: boolean;
  setLoadingBrand: (val: boolean) => void;
  websiteInput: string;
  setWebsiteInput: (val: string) => void;
  brandNameInput: string;
  setBrandNameInput: (val: string) => void;
  brandIndustryInput: string;
  setBrandIndustryInput: (val: string) => void;
  brandToneInput: string;
  setBrandToneInput: (val: string) => void;
  brandBuyersInput: string;
  setBrandBuyersInput: (val: string) => void;
  brandProductsInput: string;
  setBrandProductsInput: (val: string) => void;
  brandContextInput: string;
  setBrandContextInput: (val: string) => void;
  scanStatus: string | null;
  setScanStatus: (val: string | null) => void;
}

const BrandContext = createContext<BrandContextType | undefined>(undefined);

export function BrandProvider({ children }: { children: React.ReactNode }) {
  const [brandProfile, setBrandProfile] = useState<BrandProfile | null>(null);
  const [loadingBrand, setLoadingBrand] = useState(false);
  const [websiteInput, setWebsiteInput] = useState('');
  const [brandNameInput, setBrandNameInput] = useState('');
  const [brandIndustryInput, setBrandIndustryInput] = useState('');
  const [brandToneInput, setBrandToneInput] = useState('');
  const [brandBuyersInput, setBrandBuyersInput] = useState('');
  const [brandProductsInput, setBrandProductsInput] = useState('');
  const [brandContextInput, setBrandContextInput] = useState('');
  const [scanStatus, setScanStatus] = useState<string | null>(null);

  return (
    <BrandContext.Provider value={{
      brandProfile, setBrandProfile,
      loadingBrand, setLoadingBrand,
      websiteInput, setWebsiteInput,
      brandNameInput, setBrandNameInput,
      brandIndustryInput, setBrandIndustryInput,
      brandToneInput, setBrandToneInput,
      brandBuyersInput, setBrandBuyersInput,
      brandProductsInput, setBrandProductsInput,
      brandContextInput, setBrandContextInput,
      scanStatus, setScanStatus
    }}>
      {children}
    </BrandContext.Provider>
  );
}

export function useBrand() {
  const context = useContext(BrandContext);
  if (context === undefined) {
    throw new Error('useBrand must be used within a BrandProvider');
  }
  return context;
}
