import React from 'react';
import { Target, SplitSquareHorizontal, Sparkles, TrendingUp, ChevronRight, Activity, PlusCircle, FlaskConical } from 'lucide-react';

interface ABTestsViewProps {
  newAbName: string;
  setNewAbName: (val: string) => void;
  newAbProduct: string;
  setNewAbProduct: (val: string) => void;
  newAbSegment: string;
  setNewAbSegment: (val: string) => void;
  newAbStrategyA: string;
  setNewAbStrategyA: (val: string) => void;
  newAbToneA: string;
  setNewAbToneA: (val: string) => void;
  newAbStrategyB: string;
  setNewAbStrategyB: (val: string) => void;
  newAbToneB: string;
  setNewAbToneB: (val: string) => void;
  loadingCampaigns: boolean;
  handleCreateAbCampaign: (e: React.FormEvent) => void;
  campaigns: any[];
}

export default function ABTestsView({
  newAbName,
  setNewAbName,
  newAbProduct,
  setNewAbProduct,
  newAbSegment,
  setNewAbSegment,
  newAbStrategyA,
  setNewAbStrategyA,
  newAbToneA,
  setNewAbToneA,
  newAbStrategyB,
  setNewAbStrategyB,
  newAbToneB,
  setNewAbToneB,
  loadingCampaigns,
  handleCreateAbCampaign,
  campaigns
}: ABTestsViewProps) {
  return (
    <div className="space-y-6 animate-fadeIn" id="abtests-tab">
      
      {/* Premium Header */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center shadow-sm">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wider">
            <FlaskConical className="w-3.5 h-3.5" /> Laboratorio de Conversión
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Experimentos A/B</h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            Descubre qué mensaje resuena mejor con tu audiencia. Lanza dos variaciones del mismo contenido y deja que los datos decidan al ganador.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Panel de Creación */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm h-fit">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-4 mb-5">
            <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Nuevo Experimento</h2>
              <p className="text-xs text-slate-500">Configura tu prueba de rendimiento</p>
            </div>
          </div>

          <form onSubmit={handleCreateAbCampaign} className="space-y-5">
            
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                Nombre de la Campaña
              </label>
              <input
                type="text"
                required
                value={newAbName}
                onChange={(e) => setNewAbName(e.target.value)}
                placeholder="Ej. Lanzamiento Camiseta Eco"
                className="w-full text-sm bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl p-3 outline-none font-medium text-slate-800 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                  <Target className="w-3 h-3" /> Producto
                </label>
                <input
                  type="text"
                  required
                  value={newAbProduct}
                  onChange={(e) => setNewAbProduct(e.target.value)}
                  placeholder="Ej. Zapatillas running"
                  className="w-full text-sm bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl p-3 outline-none font-medium text-slate-800 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                  <SplitSquareHorizontal className="w-3 h-3" /> Audiencia
                </label>
                <input
                  type="text"
                  required
                  value={newAbSegment}
                  onChange={(e) => setNewAbSegment(e.target.value)}
                  placeholder="Ej. Atletas casuales"
                  className="w-full text-sm bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl p-3 outline-none font-medium text-slate-800 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all"
                />
              </div>
            </div>

            {/* Variante A */}
            <div className="bg-indigo-50/50 border border-indigo-100/60 rounded-xl p-4 space-y-3 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-black text-indigo-700 uppercase tracking-widest flex items-center gap-1.5">
                  <span className="bg-indigo-200 text-indigo-800 w-5 h-5 rounded flex items-center justify-center">A</span> Variante Principal
                </span>
              </div>
              <input
                type="text"
                required
                value={newAbStrategyA}
                onChange={(e) => setNewAbStrategyA(e.target.value)}
                placeholder="Ej. Ángulo de humor: Deja de sudar en nylon"
                className="w-full text-sm bg-white border border-indigo-100 rounded-lg p-2.5 outline-none font-medium text-slate-800 focus:border-indigo-400"
              />
              <div className="flex justify-between items-center bg-white border border-indigo-50 rounded-lg px-3 py-2">
                <span className="text-xs font-semibold text-slate-500">Tono:</span>
                <input 
                  type="text" 
                  className="text-xs text-right text-indigo-700 font-bold outline-none w-32 bg-transparent" 
                  value={newAbToneA} 
                  onChange={(e) => setNewAbToneA(e.target.value)}
                  placeholder="Ej. Divertido"
                />
              </div>
            </div>

            {/* Variante B */}
            <div className="bg-emerald-50/50 border border-emerald-100/60 rounded-xl p-4 space-y-3 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-black text-emerald-700 uppercase tracking-widest flex items-center gap-1.5">
                  <span className="bg-emerald-200 text-emerald-800 w-5 h-5 rounded flex items-center justify-center">B</span> Variante Desafiante
                </span>
              </div>
              <input
                type="text"
                required
                value={newAbStrategyB}
                onChange={(e) => setNewAbStrategyB(e.target.value)}
                placeholder="Ej. Ángulo ecológico: Materiales 100% orgánicos"
                className="w-full text-sm bg-white border border-emerald-100 rounded-lg p-2.5 outline-none font-medium text-slate-800 focus:border-emerald-400"
              />
              <div className="flex justify-between items-center bg-white border border-emerald-50 rounded-lg px-3 py-2">
                <span className="text-xs font-semibold text-slate-500">Tono:</span>
                <input 
                  type="text" 
                  className="text-xs text-right text-emerald-700 font-bold outline-none w-32 bg-transparent" 
                  value={newAbToneB} 
                  onChange={(e) => setNewAbToneB(e.target.value)}
                  placeholder="Ej. Serio / Informativo"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loadingCampaigns}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl text-sm shadow-md shadow-slate-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2 flex items-center justify-center gap-2"
            >
              {loadingCampaigns ? (
                <span className="flex items-center gap-2"><Sparkles className="animate-spin w-4 h-4" /> Lanzando Experimento...</span>
              ) : (
                <span className="flex items-center gap-2"><Sparkles className="w-4 h-4" /> Lanzar Prueba A/B</span>
              )}
            </button>
          </form>
        </div>

        {/* Panel de Resultados */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm min-h-full">
            <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
              <div className="bg-sky-100 p-2 rounded-lg text-sky-600">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Rendimiento en Vivo</h3>
                <p className="text-xs text-slate-500">Analíticas en tiempo real de tus experimentos</p>
              </div>
            </div>

            {campaigns.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center py-16 px-4 space-y-4">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center shadow-inner mb-2 border border-slate-100">
                  <SplitSquareHorizontal className="w-10 h-10 text-slate-300" />
                </div>
                <h4 className="text-lg font-bold text-slate-800">Aún no hay experimentos activos</h4>
                <p className="text-sm text-slate-500 max-w-sm leading-relaxed">
                  Crea tu primera prueba A/B a la izquierda para comparar dos estrategias de contenido y descubrir qué le gusta más a tu audiencia.
                </p>
              </div>
            ) : (
              <div className="space-y-5">
                {campaigns.map((camp) => (
                  <div key={camp.id} className={`border border-slate-200 p-5 rounded-2xl space-y-4 bg-white hover:border-indigo-200 transition-colors shadow-sm`} id={`ab-campaign-card-${camp.id}`}>
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap mb-1.5">
                          <span className="text-sm font-black text-slate-900">{camp.name}</span>
                          <span className={`px-2 py-0.5 rounded-md text-[9px] font-mono font-bold uppercase tracking-wider ${
                            camp.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-50 text-slate-600 border border-slate-200'
                          }`}>
                            {camp.status === 'Active' ? 'Activo' : camp.status}
                          </span>
                        </div>
                        <span className="text-xs text-slate-500 flex items-center gap-1.5">
                          <Target className="w-3.5 h-3.5" /> <strong className="text-slate-700">{camp.targetProduct}</strong>
                          <span className="text-slate-300">•</span>
                          <span className="text-indigo-600 font-medium">{camp.segment}</span>
                        </span>
                      </div>

                      {camp.metricCaptured && camp.metricCaptured.winner !== 'Pending' && (
                        <div className="bg-amber-100 text-amber-800 text-xs font-black px-3 py-1.5 rounded-lg border border-amber-200 flex items-center gap-1.5 shadow-sm">
                          <TrendingUp className="w-3.5 h-3.5" /> Variante {camp.metricCaptured.winner} Ganadora
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                      {/* Tarjeta Variante A */}
                      <div className={`border rounded-xl p-4 transition-colors ${camp.metricCaptured?.winner === 'A' ? 'bg-amber-50/50 border-amber-200 shadow-sm' : 'bg-slate-50 border-slate-100'}`}>
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-xs font-black text-indigo-700 bg-indigo-100/50 px-2 py-0.5 rounded uppercase tracking-widest">Variante A</span>
                          <span className="text-[10px] bg-white border border-slate-200 text-slate-600 font-mono px-1.5 py-0.5 rounded uppercase font-bold shadow-xs">
                            {camp.strategyA.tone}
                          </span>
                        </div>
                        <p className="text-xs font-medium text-slate-600 leading-relaxed h-10 line-clamp-2" title={camp.strategyA.name}>
                          "{camp.strategyA.name}"
                        </p>
                        {camp.metricCaptured && (
                          <div className="mt-3 pt-3 border-t border-slate-200/60 flex justify-between items-center">
                            <span className="text-xs text-slate-500 font-semibold">Engagement</span>
                            <span className={`text-lg font-black ${camp.metricCaptured.winner === 'A' ? 'text-amber-600' : 'text-slate-700'}`}>
                              {camp.metricCaptured.engagementA}%
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Tarjeta Variante B */}
                      <div className={`border rounded-xl p-4 transition-colors ${camp.metricCaptured?.winner === 'B' ? 'bg-amber-50/50 border-amber-200 shadow-sm' : 'bg-slate-50 border-slate-100'}`}>
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-xs font-black text-emerald-700 bg-emerald-100/50 px-2 py-0.5 rounded uppercase tracking-widest">Variante B</span>
                          <span className="text-[10px] bg-white border border-slate-200 text-slate-600 font-mono px-1.5 py-0.5 rounded uppercase font-bold shadow-xs">
                            {camp.strategyB.tone}
                          </span>
                        </div>
                        <p className="text-xs font-medium text-slate-600 leading-relaxed h-10 line-clamp-2" title={camp.strategyB.name}>
                          "{camp.strategyB.name}"
                        </p>
                        {camp.metricCaptured && (
                          <div className="mt-3 pt-3 border-t border-slate-200/60 flex justify-between items-center">
                            <span className="text-xs text-slate-500 font-semibold">Engagement</span>
                            <span className={`text-lg font-black ${camp.metricCaptured.winner === 'B' ? 'text-amber-600' : 'text-slate-700'}`}>
                              {camp.metricCaptured.engagementB}%
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
