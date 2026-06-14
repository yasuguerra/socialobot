import React from 'react';
import { 
  Building2, 
  CalendarRange, 
  LineChart, 
  Sparkles, 
  FileText, 
  Layers, 
  Globe,
  X,
  Palette,
  FolderHeart,
  Paintbrush
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  brandName: string;
  apiActive: boolean;
  isOpen?: boolean;
  onClose?: () => void;
  userEmail?: string | null;
  userDisplayName?: string | null;
}

export default function Sidebar({ 
  activeTab, 
  setActiveTab, 
  brandName, 
  apiActive,
  isOpen = false,
  onClose,
  userEmail,
  userDisplayName
}: SidebarProps) {
  const getInitials = () => {
    if (userDisplayName) {
      const parts = userDisplayName.trim().split(/\s+/);
      if (parts.length >= 2) {
        return (parts[0][0] + parts[1][0]).toUpperCase();
      }
      return userDisplayName.substring(0, 2).toUpperCase();
    }
    if (userEmail) {
      return userEmail.substring(0, 2).toUpperCase();
    }
    return "US";
  };

  const menuGroup1 = [
    { id: 'copilot', label: 'Mi Copiloto de IA', icon: Sparkles },
    { id: 'arsenal', label: 'Biblioteca de Medios', icon: FolderHeart },
    { id: 'scheduler', label: 'Agenda de Contenido', icon: CalendarRange },
  ];

  const menuGroup2 = [
    { id: 'remodeler', label: 'El Rincón de Mamá', icon: Paintbrush },
  ];

  const renderItem = (item: { id: string; label: string; icon: any }) => {
    const Icon = item.icon;
    const isActive = activeTab === item.id;
    return (
      <button
        id={`nav-tab-${item.id}`}
        key={item.id}
        onClick={() => {
          setActiveTab(item.id);
          if (onClose) onClose();
        }}
        className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all duration-150 ${
          isActive 
            ? 'bg-indigo-600 text-white font-semibold shadow-md shadow-indigo-600/20' 
            : 'text-slate-400 hover:bg-slate-800 hover:text-white'
        }`}
      >
        <Icon className={`w-4 h-4 shrink-0 transition-colors ${isActive ? 'text-white' : 'text-slate-400'}`} />
        <span className="truncate">{item.label}</span>
      </button>
    );
  };

  return (
    <>
      {/* Mobile Sidebar backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40 lg:hidden" 
          onClick={onClose}
          id="sidebar-backdrop"
        />
      )}

      <aside 
        className={`fixed inset-y-0 left-0 z-50 lg:relative lg:flex w-64 bg-slate-900 text-white flex flex-col font-sans select-none shrink-0 border-r border-slate-800 transition-transform duration-300 transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`} 
        id="app-sidebar"
      >
        {/* Brand Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-black text-white text-md shadow-sm shadow-indigo-500/20">
              S
            </div>
            <div>
              <span className="font-bold text-md tracking-tight block text-white leading-tight">SOCIAL.FLOW</span>
              <span className="text-[9px] text-slate-500 font-mono tracking-wider uppercase block">Autopilot Engine</span>
            </div>
          </div>

          {onClose && (
            <button 
              onClick={onClose}
              className="lg:hidden p-1 rounded-md text-slate-450 hover:text-white hover:bg-slate-800 transition"
              aria-label="Close sidebar"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Navigation Groups with High Density styles */}
        <nav className="flex-1 p-4 space-y-4 overflow-y-auto">
          <div>
            <div className="px-3 py-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              Mi Compañero de IA
            </div>
            <div className="space-y-1">
              {menuGroup1.map(renderItem)}
            </div>
          </div>

          <div>
            <div className="px-3 py-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              El Rincón de Mamá
            </div>
            <div className="space-y-1">
              {menuGroup2.map(renderItem)}
            </div>
          </div>
        </nav>

        {/* Autopilot bottom status container */}
        <div className="p-4 bg-slate-800/40 m-4 rounded-xl border border-slate-800/60">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] text-indigo-400 font-bold font-mono tracking-widest uppercase">AUTOPILOT ACTIVE</span>
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-indigo-500"></span>
            </span>
          </div>
          <div className="text-[10px] text-slate-400 truncate font-medium">Brand: {brandName || 'Not Configured'}</div>
          <div className="text-[9px] text-slate-500 mt-1 flex items-center justify-between">
            <span>Gemini Core:</span>
            <span className={`font-mono px-1 rounded ${apiActive ? 'text-emerald-400 bg-emerald-950/40' : 'text-amber-400 bg-amber-950/40'}`}>
              {apiActive ? 'AI Enabled' : 'Simulated'}
            </span>
          </div>
          <div className="text-[9px] text-slate-500 mt-1 flex items-center justify-between">
            <span>Firestore DB:</span>
            <span className="font-mono px-1 rounded text-emerald-400 bg-emerald-950/40">
              Connected
            </span>
          </div>
        </div>

        {/* Connected Tenant Card */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/40 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 flex items-center justify-center font-extrabold text-sm shrink-0 shadow-inner">
            {getInitials()}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-semibold text-slate-200 truncate" title={userDisplayName || userEmail || "Tenant"}>
              {userDisplayName || userEmail || "yasuguerra@gmail.com"}
            </div>
            <div className="text-[10px] text-emerald-400 font-medium flex items-center gap-1 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Connected
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
