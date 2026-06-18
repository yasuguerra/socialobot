import React from 'react';
import { 
  Building2, 
  Sparkles, 
  Palette,
  LineChart,
  LogOut,
  X
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface SidebarProps {
  apiActive: boolean;
  onSignOut: () => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ apiActive, onSignOut, isOpen = false, onClose }: SidebarProps) {
  const { activeTab, setActiveTab, brandProfile } = useApp();
  const brandName = brandProfile?.companyName || "Mi Empresa";

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Panel */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 lg:w-64 bg-slate-900 text-slate-300 flex flex-col justify-between shrink-0 h-screen border-r border-slate-800 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} lg:static`}>
        
        {/* Mobile Close Button */}
        <button 
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white lg:hidden bg-slate-800 rounded-lg"
          onClick={onClose}
        >
          <X className="w-5 h-5" />
        </button>

        <div className="overflow-y-auto">
          {/* LOGO */}
          <div className="p-6">
            <div className="flex items-center space-x-3">
              <div className="bg-indigo-600 p-2 rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-indigo-500/30">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-black text-white tracking-tight leading-none block">Socialobot</span>
                <span className="text-[11px] text-indigo-400 font-bold tracking-widest uppercase">Agent Studio</span>
              </div>
            </div>
          </div>

          {/* TENANT BADGE */}
          <div className="px-5 mb-6">
            <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700/50 flex items-center shadow-inner">
              <div className="bg-slate-700 h-10 w-10 rounded-xl flex items-center justify-center mr-3 shrink-0">
                <Building2 className="h-5 w-5 text-indigo-300" />
              </div>
              <div className="overflow-hidden">
                <p className="text-[11px] text-slate-400 font-bold mb-0.5 uppercase tracking-wider">Espacio Activo</p>
                <p className="text-sm font-black text-white truncate">{brandName}</p>
              </div>
            </div>
          </div>

          <nav className="px-4 space-y-1.5">
            <p className="px-3 text-[11px] font-black text-slate-500 uppercase tracking-widest mb-3 mt-6">Herramientas</p>
            
            <button
              onClick={() => { setActiveTab('copilot'); onClose?.(); }}
              className={`w-full flex items-center px-4 py-3.5 text-sm font-bold rounded-xl transition-all duration-200 group ${activeTab === 'copilot' ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/20' : 'border border-transparent hover:bg-slate-800/50 hover:text-slate-100'}`}
            >
              <Sparkles className={`mr-3 h-5 w-5 ${activeTab === 'copilot' ? 'text-indigo-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
              Copiloto IA
            </button>

            <button
              onClick={() => { setActiveTab('brand'); onClose?.(); }}
              className={`w-full flex items-center px-4 py-3.5 text-sm font-bold rounded-xl transition-all duration-200 group ${activeTab === 'brand' ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/20' : 'border border-transparent hover:bg-slate-800/50 hover:text-slate-100'}`}
            >
              <Building2 className={`mr-3 h-5 w-5 ${activeTab === 'brand' ? 'text-indigo-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
              Identidad de Marca
            </button>

            <button
              onClick={() => { setActiveTab('studio'); onClose?.(); }}
              className={`w-full flex items-center px-4 py-3.5 text-sm font-bold rounded-xl transition-all duration-200 group ${activeTab === 'studio' ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/20' : 'border border-transparent hover:bg-slate-800/50 hover:text-slate-100'}`}
            >
              <Palette className={`mr-3 h-5 w-5 ${activeTab === 'studio' ? 'text-indigo-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
              Creative Studio
            </button>

            <button
              onClick={() => { setActiveTab('campaigns'); onClose?.(); }}
              className={`w-full flex items-center px-4 py-3.5 text-sm font-bold rounded-xl transition-all duration-200 group ${activeTab === 'campaigns' ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/20' : 'border border-transparent hover:bg-slate-800/50 hover:text-slate-100'}`}
            >
              <LineChart className={`mr-3 h-5 w-5 ${activeTab === 'campaigns' ? 'text-indigo-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
              Dashboard Analítico
            </button>

            <p className="px-3 text-[11px] font-black text-slate-500 uppercase tracking-widest mb-3 mt-6">
              Laboratorios Experimentales
            </p>

            <button
              onClick={() => { setActiveTab('remodeler'); onClose?.(); }}
              className={`w-full flex items-center px-4 py-3.5 text-sm font-bold rounded-xl transition-all duration-200 group ${activeTab === 'remodeler' ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/20' : 'border border-transparent hover:bg-slate-800/50 hover:text-slate-100'}`}
            >
              <Palette className={`mr-3 h-5 w-5 ${activeTab === 'remodeler' ? 'text-indigo-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
              Space Remodeler (El Rincón de Mamá)
            </button>

          </nav>
        </div>

        <div className="p-5 border-t border-slate-800/80 bg-slate-900/50">
          <div className="flex items-center justify-between mb-4 px-2">
            <div className="flex items-center">
              <div className={`h-2.5 w-2.5 rounded-full mr-2.5 shadow-[0_0_8px_rgba(0,0,0,0.5)] ${apiActive ? 'bg-emerald-500 shadow-emerald-500/50' : 'bg-rose-500 shadow-rose-500/50'}`}></div>
              <span className="text-xs font-bold tracking-wide text-slate-400">
                {apiActive ? 'Google IA Conectada' : 'AI Offline'}
              </span>
            </div>
          </div>
          <button
            onClick={onSignOut}
            className="w-full flex items-center justify-center px-4 py-3 border border-slate-700/80 rounded-xl text-sm font-bold text-slate-400 hover:bg-slate-800 hover:text-white transition-all group"
          >
            <LogOut className="h-4 w-4 mr-2 text-slate-500 group-hover:text-slate-300" />
            Cerrar Sesión
          </button>
        </div>
      </aside>
    </>
  );
}
