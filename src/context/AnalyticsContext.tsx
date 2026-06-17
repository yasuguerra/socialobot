import React, { createContext, useContext, useState } from 'react';

interface AnalyticsContextType {
  analytics: any;
  setAnalytics: React.Dispatch<React.SetStateAction<any>>;
  loadingAnalytics: boolean;
  setLoadingAnalytics: (val: boolean) => void;
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined);

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);

  return (
    <AnalyticsContext.Provider value={{
      analytics, setAnalytics,
      loadingAnalytics, setLoadingAnalytics
    }}>
      {children}
    </AnalyticsContext.Provider>
  );
}

export function useAnalytics() {
  const context = useContext(AnalyticsContext);
  if (context === undefined) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider');
  }
  return context;
}
