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
  handleSendAgentMsg: (retryText?: string) => Promise<void>;
}

const CopilotContext = createContext<CopilotContextType | undefined>(undefined);

export function CopilotProvider({ children }: { children: React.ReactNode }) {
  const [chatHistory, setChatHistory] = useState<any[]>([{ id: 'welcome', sender: 'agent', text: 'Â¡Hola! Soy tu Copiloto de IA de SOCIALOBOT. Â¿QuÃ© tipo de publicaciÃ³n te gustarÃ­a crear hoy para tu marca?' }]);
  const [loadingAgent, setLoadingAgent] = useState(false);
  const [agentInput, setAgentInput] = useState('');
  const [agentMessages, setAgentMessages] = useState<any[]>([]);
  const [agentSessionId, setAgentSessionId] = useState<string | null>(null);

  const handleSendAgentMsg = async (retryText?: string) => {
    const userMsg = retryText || agentInput.trim();
    if (!userMsg || loadingAgent) return;
    
    if (!retryText) setAgentInput('');
    setAgentMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setLoadingAgent(true);

    try {
      const response = await fetch('/api/agent/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg, sessionId: agentSessionId })
      });
      const data = await response.json();
      if (data.text) {
        setAgentMessages(prev => [...prev, { sender: 'agent', text: data.text }]);
      }
      if (data.sessionId) {
        setAgentSessionId(data.sessionId);
      }
    } catch (err) {
      console.error("Agent chat failed:", err);
      setAgentMessages(prev => [...prev, { 
        sender: 'agent', 
        text: "La conexiÃ³n con el Agente fallÃ³. Por favor, revisa tu conexiÃ³n o intenta de nuevo.", 
        isError: true,
        failedPrompt: userMsg
      }]);
    } finally {
      setLoadingAgent(false);
    }
  };

  return (
    <CopilotContext.Provider value={{
      chatHistory, setChatHistory,
      loadingAgent, setLoadingAgent,
      agentInput, setAgentInput,
      agentMessages, setAgentMessages,
      agentSessionId, setAgentSessionId,
      handleSendAgentMsg
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

