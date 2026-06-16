import React from 'react';
import { HelpCircle } from 'lucide-react';

interface BrandProfileViewProps {
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
  loadingBrand: boolean;
  handleUpdateBrand: (e: React.FormEvent) => void;
}

export default function BrandProfileView({
  websiteInput,
  setWebsiteInput,
  brandNameInput,
  setBrandNameInput,
  brandIndustryInput,
  setBrandIndustryInput,
  brandToneInput,
  setBrandToneInput,
  brandBuyersInput,
  setBrandBuyersInput,
  brandProductsInput,
  setBrandProductsInput,
  brandContextInput,
  setBrandContextInput,
  loadingBrand,
  handleUpdateBrand
}: BrandProfileViewProps) {
  return (
    <div className="space-y-6 max-w-4xl" id="brand-tab">
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="bg-slate-900 p-5 text-white flex justify-between items-center">
          <div>
            <h2 className="text-md font-bold tracking-tight">Active Brand DNA & Context</h2>
            <p className="text-slate-400 text-xs">This data coordinates with the Gemini API to write captions targeted directly to buyers.</p>
          </div>
          <span className="text-[10px] uppercase font-mono font-bold bg-indigo-500 px-2 py-0.5 rounded text-white tracking-widest animate-pulse">
            Autopilot Core
          </span>
        </div>

        <form onSubmit={handleUpdateBrand} className="p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500 uppercase">Website URL / Core Source Domain</label>
              <div className="flex gap-2">
                <input
                  type="url"
                  required
                  value={websiteInput}
                  onChange={(e) => setWebsiteInput(e.target.value)}
                  placeholder="e.g. https://myorganicbrand.com"
                  className="flex-1 text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 outline-none font-medium text-slate-800 focus:border-slate-400 transition"
                />
                <button
                  type="submit"
                  disabled={loadingBrand}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-3.5 py-2 rounded-lg transition disabled:opacity-50"
                >
                  {loadingBrand ? 'Extracting...' : 'Scan Context'}
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500 uppercase">Company Name</label>
              <input
                type="text"
                required
                value={brandNameInput}
                onChange={(e) => setBrandNameInput(e.target.value)}
                placeholder="e.g. My Brand Name"
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 outline-none font-medium text-slate-800 focus:border-slate-400 transition"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500 uppercase">Target Industry & Niche Products Category</label>
              <input
                type="text"
                value={brandIndustryInput}
                onChange={(e) => setBrandIndustryInput(e.target.value)}
                placeholder="Sustainable fashion design apparel"
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 outline-none font-medium text-slate-800 focus:border-slate-400 transition"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500 uppercase">Social Voice & Persona Tone</label>
              <input
                type="text"
                value={brandToneInput}
                onChange={(e) => setBrandToneInput(e.target.value)}
                placeholder="Witty, earthy, bright, professional with dynamic humor"
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 outline-none font-medium text-slate-800 focus:border-slate-400 transition"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-500 uppercase">Target Buyer Personas (Ages, Frustrations, Wants)</label>
            <textarea
              rows={2}
              value={brandBuyersInput}
              onChange={(e) => setBrandBuyersInput(e.target.value)}
              placeholder="Millennial and Gen Z buyers look to swap standard plastic garments for comfortable carbon-neutral linen outfits..."
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 outline-none font-medium text-slate-800 focus:border-slate-400 transition resize-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-500 uppercase">Flagship Products or Core Offerings</label>
            <input
              type="text"
              value={brandProductsInput}
              onChange={(e) => setBrandProductsInput(e.target.value)}
              placeholder="1. Organic Everyday Tee, 2. Biodegradable Sunglasses, 3. Recycled Linen Jumpsuit"
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 outline-none font-medium text-slate-800 focus:border-slate-400 transition"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-500 uppercase">Brand Environmental Mission & Ecosystem parameters</label>
            <textarea
              rows={2}
              value={brandContextInput}
              onChange={(e) => setBrandContextInput(e.target.value)}
              placeholder="We plant 2 trees for every item sold to reduce deforestation. We operate circular supply..."
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 outline-none font-medium text-slate-800 focus:border-slate-400 transition resize-none"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
            <p className="text-[10px] text-slate-400 font-mono">
              Last synced: Just now • Context engine online.
            </p>
            <button
              type="submit"
              disabled={loadingBrand}
              className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-5 py-2.5 rounded-lg transition"
            >
              {loadingBrand ? 'Saving Context...' : 'Update & Lock Brand Parameters'}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-slate-100 border border-slate-200 p-4 rounded-xl flex items-start gap-3">
        <HelpCircle className="w-5 h-5 text-slate-500 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-600 space-y-1">
          <h4 className="font-bold text-slate-900">How does Brand DNA extraction work?</h4>
          <p>
            By typing your brand website or handles, our core server utilizes Gemini models to extract appropriate themes, tonal matrices, and high-converting marketing segments. When you generate content later, it targets the exact personas highlighted in this console.
          </p>
        </div>
      </div>
    </div>
  );
}
