import React from 'react';
import { AppProvider } from './AppContext';
import { BrandProvider } from './BrandContext';
import { CopilotProvider } from './CopilotContext';
import { StudioProvider } from './StudioContext';
import { AnalyticsProvider } from './AnalyticsContext';
import { CampaignsProvider } from './CampaignsContext';

export function GlobalProviders({ children }: { children: React.ReactNode }) {
  return (
    <AppProvider>
      <BrandProvider>
        <CopilotProvider>
          <StudioProvider>
            <AnalyticsProvider>
              <CampaignsProvider>
                {children}
              </CampaignsProvider>
            </AnalyticsProvider>
          </StudioProvider>
        </CopilotProvider>
      </BrandProvider>
    </AppProvider>
  );
}
