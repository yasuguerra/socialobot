import React from 'react';

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
    <div className="space-y-6" id="abtests-tab">
      
      {/* Grid with testing targets */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Contrast creation form */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-5 shadow-sm h-fit">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Initiate A/B Testing Matrix</h2>
            <p className="text-slate-600 text-xs">Deploy segment-targeted comparison matrices to see which hook secures superior conversions.</p>
          </div>

          <form onSubmit={handleCreateAbCampaign} className="space-y-4 mt-4">
            
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-600 uppercase block">Campaign Variant Name</label>
              <input
                type="text"
                required
                value={newAbName}
                onChange={(e) => setNewAbName(e.target.value)}
                placeholder="e.g. Recycled Linen Jumpsuit Launch"
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 outline-none font-medium text-slate-800"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600 uppercase block">Target Product Item</label>
                <input
                  type="text"
                  required
                  value={newAbProduct}
                  onChange={(e) => setNewAbProduct(e.target.value)}
                  placeholder="Everyday Linen tee"
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 outline-none font-medium text-slate-800"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600 uppercase block">Audience Segment</label>
                <input
                  type="text"
                  required
                  value={newAbSegment}
                  onChange={(e) => setNewAbSegment(e.target.value)}
                  placeholder="Conscious Fashion Buyers"
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 outline-none font-medium text-slate-800"
                />
              </div>
            </div>

            <div className="space-y-1 pt-2 border-t border-slate-100">
              <span className="text-xs font-bold text-indigo-600 uppercase block tracking-wider">Strategy A Variant Setup</span>
              <div className="grid grid-cols-1 gap-2">
                <input
                  type="text"
                  required
                  value={newAbStrategyA}
                  onChange={(e) => setNewAbStrategyA(e.target.value)}
                  placeholder="e.g. Humor Angle: Stop wearing nylon sweating bags"
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 outline-none font-medium text-slate-800"
                />
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500">Tone preset:</span>
                  <input 
                    type="text" 
                    className="text-right text-slate-600 outline-none w-28 bg-transparent" 
                    value={newAbToneA} 
                    onChange={(e) => setNewAbToneA(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1 pt-2 border-t border-slate-100">
              <span className="text-xs font-bold text-indigo-600 uppercase block tracking-wider">Strategy B Variant Setup</span>
              <div className="grid grid-cols-1 gap-2">
                <input
                  type="text"
                  required
                  value={newAbStrategyB}
                  onChange={(e) => setNewAbStrategyB(e.target.value)}
                  placeholder="e.g. Eco Fact Angle: 1 Shirt = plants 2 real trees"
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 outline-none font-medium text-slate-800"
                />
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500">Tone preset:</span>
                  <input 
                    type="text" 
                    className="text-right text-slate-600 outline-none w-28 bg-transparent" 
                    value={newAbToneB} 
                    onChange={(e) => setNewAbToneB(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loadingCampaigns}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2 rounded-lg text-xs shadow-sm transition disabled:opacity-50 mt-2 cursor-pointer"
            >
              {loadingCampaigns ? 'Spinning active channels...' : 'Deploy Split-Variant Test Campaign'}
            </button>
          </form>
        </div>

        {/* Campaigns testing list status */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-slate-500">Live Headline Performance Diagnostics</h3>

          <div className="space-y-4">
            {campaigns.map((camp) => (
              <div key={camp.id} className="border border-slate-100 p-4 rounded-xl space-y-3.5 bg-slate-50/50" id={`ab-campaign-card-${camp.id}`}>
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-slate-900 block leading-none">{camp.name}</span>
                      <span className={`px-1.5 py-0.5 rounded text-[8px] font-mono font-bold uppercase ${
                        camp.status === 'Active' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'bg-slate-50 text-slate-600 border border-slate-200'
                      }`}>
                        {camp.status}
                      </span>
                      <span className="px-1.5 py-0.5 rounded text-[8px] font-mono font-medium uppercase bg-amber-50 text-amber-700 border border-amber-200">
                        Simulated Campaign (Demo Mode)
                      </span>
                    </div>
                    <span className="text-xs text-slate-500 mt-1 block">
                      Target Product: <strong className="text-slate-600">{camp.targetProduct}</strong> • Segment: <strong className="text-indigo-600">{camp.segment}</strong>
                    </span>
                  </div>

                  {camp.metricCaptured && camp.metricCaptured.winner !== 'Pending' && (
                    <span className="bg-emerald-50 text-emerald-800 text-xs font-black px-2 py-1 rounded border border-emerald-100">
                      🏆 Variet {camp.metricCaptured.winner} Winner
                    </span>
                  )}
                </div>

                {/* Side by side stats comparison */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Variant A card */}
                  <div className="bg-white border border-slate-100 rounded-lg p-3 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-black text-slate-800">Variant A</span>
                      <span className="text-[9px] bg-slate-100 text-slate-600 font-mono px-1 rounded uppercase tracking-wider font-semibold">
                        {camp.strategyA.tone}
                      </span>
                    </div>
                    <p className="text-xs font-medium text-slate-550 leading-relaxed truncate group hover:text-indigo-900" title={camp.strategyA.name}>
                      "{camp.strategyA.name}"
                    </p>
                    {camp.metricCaptured && (
                      <div className="flex justify-between pt-1 border-t border-slate-50 text-sm">
                        <span className="text-slate-500">Engagement:</span>
                        <span className={`font-bold ${camp.metricCaptured.winner === 'A' ? 'text-emerald-600' : 'text-slate-700'}`}>
                          {camp.metricCaptured.engagementA}%
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Variant B card */}
                  <div className="bg-white border border-slate-100 rounded-lg p-3 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-black text-slate-800">Variant B</span>
                      <span className="text-[9px] bg-slate-100 text-slate-600 font-mono px-1 rounded uppercase tracking-wider font-semibold">
                        {camp.strategyB.tone}
                      </span>
                    </div>
                    <p className="text-xs font-medium text-slate-550 leading-relaxed truncate" title={camp.strategyB.name}>
                      "{camp.strategyB.name}"
                    </p>
                    {camp.metricCaptured && (
                      <div className="flex justify-between pt-1 border-t border-slate-50 text-sm">
                        <span className="text-slate-500">Engagement:</span>
                        <span className={`font-bold ${camp.metricCaptured.winner === 'B' ? 'text-emerald-600' : 'text-slate-700'}`}>
                          {camp.metricCaptured.engagementB}%
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {camp.metricCaptured && (
                  <div className="text-[10.5px] italic text-slate-600 pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span>Statistical confidence level verified. Strategy has updated corresponding automated queues.</span>
                    <span className="font-mono font-bold text-slate-700">98.2% Confidence</span>
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>

      </div>

    </div>
  );
}
