import React, { createContext, useContext, useState } from 'react';

interface CopilotContextType {
  chatHistory: any[];
  setChatHistory: React.Dispatch<React.SetStateAction<any[]>>;
  loadingAgent: boolean;
  setLoadingAgent: (val: boolean) => void;
  agentInput: string;
  setAgentInput: (val: string) => void;
  agentMessages: any[];
  setAgentMessages: React.Dispatch<React.SetStateAction<any[]>>;
  agentSessionId: string | null;
  setAgentSessionId: (val: string | null) => void;
}

const CopilotContext = createContext<CopilotContextType | undefined>(undefined);

export function CopilotProvider({ children }: { children: React.ReactNode }) {
  const [chatHistory, setChatHistory] = useState<any[]>([{ id: 'welcome', sender: 'agent', text: '¡Hola! Soy tu Copiloto de IA de Social.Flow. ¿Qué tipo de publicación te gustaría crear hoy para tu marca?' }]);
  const [loadingAgent, setLoadingAgent] = useState(false);
  const [agentInput, setAgentInput] = useState('');
  const [agentMessages, setAgentMessages] = useState<any[]>([]);
  const [agentSessionId, setAgentSessionId] = useState<string | null>(null);

  return (
    <CopilotContext.Provider value={{
      chatHistory, setChatHistory,
      loadingAgent, setLoadingAgent,
      agentInput, setAgentInput,
      agentMessages, setAgentMessages,
      agentSessionId, setAgentSessionId
    }}>
      {children}
    </CopilotContext.Provider>
  );
}

export function useCopilot() {
  const context = useContext(CopilotContext);
  if (context === undefined) {
    throw new Error('useCopilot must be used within a CopilotProvider');
  }
  return context;
}
