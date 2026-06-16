import React from 'react';
import { 
  Building2, 
  Sparkles, 
  Palette,
  LineChart,
  LogOut
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface SidebarProps {
  apiActive: boolean;
  onSignOut: () => void;
}

export default function Sidebar({ apiActive, onSignOut }: SidebarProps) {
  const { activeTab, setActiveTab, brandProfile } = useApp();
  const brandName = brandProfile?.companyName || "Mi Empresa";

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col justify-between shrink-0 h-screen sticky top-0 z-10 border-r border-slate-800">
      <div>
        {/* LOGO */}
        <div className="p-6">
          <div className="flex items-center space-x-2">
            <div className="bg-blue-600 p-1.5 rounded-lg flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/20">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold text-white tracking-tight leading-none block">Social.Flow</span>
              <span className="text-xs text-blue-400 font-medium tracking-wider">AI AGENT STRATEGIST</span>
            </div>
          </div>
        </div>

        {/* TENANT BADGE */}
        <div className="px-4 mb-6">
          <div className="bg-slate-800/80 rounded-xl p-3 border border-slate-700/50 flex items-center shadow-inner">
            <div className="bg-slate-700 h-8 w-8 rounded-lg flex items-center justify-center mr-3 shrink-0">
              <Building2 className="h-4 w-4 text-slate-300" />
            </div>
            <div className="overflow-hidden">
              <p className="text-xs text-slate-400 font-medium mb-0.5">Operando como</p>
              <p className="text-sm font-semibold text-slate-100 truncate">{brandName}</p>
            </div>
          </div>
        </div>

        <nav className="px-3 space-y-1">
          <p className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 mt-4">Workspace Central</p>
          
          <button
            onClick={() => setActiveTab('copilot')}
            className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors duration-150 group ${activeTab === 'copilot' ? 'bg-blue-600/10 text-blue-400' : 'hover:bg-slate-800 hover:text-slate-100'}`}
          >
            <Sparkles className={`mr-3 h-5 w-5 ${activeTab === 'copilot' ? 'text-blue-500' : 'text-slate-400 group-hover:text-slate-300'}`} />
            Copiloto IA
          </button>

          <button
            onClick={() => setActiveTab('brand')}
            className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors duration-150 group ${activeTab === 'brand' ? 'bg-blue-600/10 text-blue-400' : 'hover:bg-slate-800 hover:text-slate-100'}`}
          >
            <Building2 className={`mr-3 h-5 w-5 ${activeTab === 'brand' ? 'text-blue-500' : 'text-slate-400 group-hover:text-slate-300'}`} />
            Identidad de Marca
          </button>

          <button
            onClick={() => setActiveTab('studio')}
            className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors duration-150 group ${activeTab === 'studio' ? 'bg-blue-600/10 text-blue-400' : 'hover:bg-slate-800 hover:text-slate-100'}`}
          >
            <Palette className={`mr-3 h-5 w-5 ${activeTab === 'studio' ? 'text-blue-500' : 'text-slate-400 group-hover:text-slate-300'}`} />
            Creative Studio
          </button>

          <button
            onClick={() => setActiveTab('campaigns')}
            className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors duration-150 group ${activeTab === 'campaigns' ? 'bg-blue-600/10 text-blue-400' : 'hover:bg-slate-800 hover:text-slate-100'}`}
          >
            <LineChart className={`mr-3 h-5 w-5 ${activeTab === 'campaigns' ? 'text-blue-500' : 'text-slate-400 group-hover:text-slate-300'}`} />
            Campañas & Analítica
          </button>

        </nav>
      </div>

      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center justify-between mb-4 px-2">
          <div className="flex items-center">
            <div className={`h-2 w-2 rounded-full mr-2 shadow-[0_0_8px_rgba(0,0,0,0.5)] ${apiActive ? 'bg-emerald-500 shadow-emerald-500/50' : 'bg-rose-500 shadow-rose-500/50'}`}></div>
            <span className="text-xs font-medium text-slate-400">
              {apiActive ? 'Vertex AI Conectado' : 'AI Offline'}
            </span>
          </div>
        </div>
        <button
          onClick={onSignOut}
          className="w-full flex items-center justify-center px-4 py-2 border border-slate-700 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors group"
        >
          <LogOut className="h-4 w-4 mr-2 text-slate-400 group-hover:text-slate-300" />
          Cerrar Sesión
        </button>
      </div>
    </aside>
  );
}
