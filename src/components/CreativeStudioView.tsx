import React from 'react';
import { Palette, ImageIcon, Video as VideoIcon, Search, Upload, RefreshCw, ArrowRight, Download, History, Trash2 } from 'lucide-react';

interface CreativeStudioViewProps {
  studioFormat: 'image' | 'video';
  setStudioFormat: (val: 'image' | 'video') => void;
  studioAspectRatio: string;
  setStudioAspectRatio: (val: string) => void;
  studioPrompt: string;
  setStudioPrompt: (val: string) => void;
  studioSize: string;
  setStudioSize: (val: string) => void;
  studioEnableGrounding: boolean;
  setStudioEnableGrounding: (val: boolean) => void;
  studioVideoModel: string;
  setStudioVideoModel: (val: string) => void;
  studioVideoResolution: string;
  setStudioVideoResolution: (val: string) => void;
  studioVideoDuration: number;
  setStudioVideoDuration: (val: number) => void;
  studioStarterImage: File | null;
  setStudioStarterImage: (val: File | null) => void;
  handleStudioStarterImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSynthesizeCreative: () => void;
  studioGenerating: boolean;
  studioStatusText: string;
  studioGeneratedUrl: string | null;
  setStudioGeneratedUrl: (val: string | null) => void;
  studioLastOperationName: string | null;
  setStudioLastOperationName: (val: string | null) => void;
  studioExtensionPrompt: string;
  setStudioExtensionPrompt: (val: string) => void;
  handleExtendCreative: () => void;
  studioSavedMedia: any[];
  setStudioSavedMedia: (val: any[]) => void;
  setAiGeneratedUrl: (val: string | null) => void;
  setCreatorFormat: (val: any) => void;
  setCreatorVisualPrompt: (val: string) => void;
  setActiveTab: (val: string) => void;
}

export default function CreativeStudioView({
  studioFormat,
  setStudioFormat,
  studioAspectRatio,
  setStudioAspectRatio,
  studioPrompt,
  setStudioPrompt,
  studioSize,
  setStudioSize,
  studioEnableGrounding,
  setStudioEnableGrounding,
  studioVideoModel,
  setStudioVideoModel,
  studioVideoResolution,
  setStudioVideoResolution,
  studioVideoDuration,
  setStudioVideoDuration,
  studioStarterImage,
  setStudioStarterImage,
  handleStudioStarterImageChange,
  handleSynthesizeCreative,
  studioGenerating,
  studioStatusText,
  studioGeneratedUrl,
  setStudioGeneratedUrl,
  studioLastOperationName,
  setStudioLastOperationName,
  studioExtensionPrompt,
  setStudioExtensionPrompt,
  handleExtendCreative,
  studioSavedMedia,
  setStudioSavedMedia,
  setAiGeneratedUrl,
  setCreatorFormat,
  setCreatorVisualPrompt,
  setActiveTab
}: CreativeStudioViewProps) {
  return (
    <div className="space-y-6 animate-fadeIn" id="ai-studio-tab">
      {/* Premium Top Bar announcement */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 relative overflow-hidden border border-slate-800 shadow-sm">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none transform translate-x-12 -translate-y-6">
          <Palette className="w-64 h-64 text-indigo-50" />
        </div>
        <div className="max-w-2xl relative z-10 space-y-2">
          <span className="text-[10px] uppercase font-black tracking-widest text-indigo-450 bg-indigo-950/60 px-2.5 py-1 rounded border border-indigo-900/60 inline-block">
            Google GenAI Visual Engine Suite
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">AI Creative Studio Workshop</h1>
          <p className="text-slate-300 text-xs leading-relaxed">
            Sculpt elite cinematic videos with <span className="text-emerald-400 font-bold">Google Veo 3.1</span>, and synthesize absolute masterpiece commercials with <span className="text-indigo-400 font-bold">Nano Banana 2</span> image generation. Perfect for manual creative drops when bypassing API scheduling approvals.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Controls column */}
        <div className="lg:col-span-6 space-y-6 bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Configure Composition Workspace</h2>
            <p className="text-slate-500 text-xs">Tune advanced neural network parameters to tailor your visual concept.</p>
          </div>

          {/* Model Choice list */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Visual Blueprint Model Type</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => {
                  setStudioFormat('image');
                  setStudioAspectRatio('1:1');
                }}
                className={`p-3.5 border rounded-xl text-left transition flex items-center gap-3 cursor-pointer ${
                  studioFormat === 'image'
                    ? 'border-indigo-600 bg-indigo-50/20 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className={`p-2 rounded-lg ${studioFormat === 'image' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                  <ImageIcon className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 leading-tight">Nano Banana 2</div>
                  <div className="text-[10px] text-slate-500 font-medium">High-Res Masterpiece (3.1 Image)</div>
                </div>
              </button>

              <button
                onClick={() => {
                  setStudioFormat('video');
                  setStudioAspectRatio('16:9');
                }}
                className={`p-3.5 border rounded-xl text-left transition flex items-center gap-3 cursor-pointer ${
                  studioFormat === 'video'
                    ? 'border-indigo-600 bg-indigo-50/20 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className={`p-2 rounded-lg ${studioFormat === 'video' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                  <VideoIcon className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 leading-tight">Google Veo 3.1</div>
                  <div className="text-[10px] text-slate-500 font-medium">Cinematic Short Length Video</div>
                </div>
              </button>
            </div>
          </div>

          {/* Prompts input */}
          <div className="space-y-1">
            <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              <span>Detailed Conceptual Prompt</span>
              <span className="text-slate-300">Minimum 5 words recommended</span>
            </div>
            <textarea
              rows={3}
              value={studioPrompt}
              onChange={(e) => setStudioPrompt(e.target.value)}
              placeholder="e.g. Cinematic flat lay product shot of sustainable bamboo water bottle next to sand ripples, soft studio lighting..."
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none font-medium text-slate-800 focus:border-indigo-400 focus:bg-white transition resize-none"
            />
          </div>

          {/* Aspect Ratio choice layout */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Target Crop Aspect Ratio</label>
            <div className="grid grid-cols-5 gap-2">
              {['1:1', '16:9', '9:16', '4:3', '3:4'].map(ratio => {
                const isSelected = studioAspectRatio === ratio;
                return (
                  <button
                    key={ratio}
                    onClick={() => setStudioAspectRatio(ratio)}
                    className={`p-2.5 border rounded-lg text-center transition flex flex-col items-center gap-1.5 cursor-pointer ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/20'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className={`border border-slate-400 rounded-sm bg-slate-100 shrink-0 ${
                      ratio === '1:1' ? 'w-4 h-4' :
                      ratio === '16:9' ? 'w-5 h-3' :
                      ratio === '9:16' ? 'w-3 h-5' :
                      ratio === '4:3' ? 'w-4.5 h-3.5' :
                      'w-3.5 h-4.5'
                    }`} />
                    <span className="text-[10px] font-bold text-slate-705 leading-none">{ratio}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Context Upload & Advanced parameters */}
          <div className="border-t border-slate-150 pt-5 space-y-4">
            
            {/* Conditional parameters */}
            {studioFormat === 'image' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Size parameter */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Production Quality Resolution</label>
                  <select
                    value={studioSize}
                    onChange={(e) => setStudioSize(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 outline-none font-semibold text-slate-700 focus:border-indigo-400 transition"
                  >
                    <option value="512px">512px Draft Preview</option>
                    <option value="1K">1K High Quality standard</option>
                    <option value="2K">2K Professional Resolution</option>
                    <option value="4K">4K Utmost Grade</option>
                  </select>
                </div>

                {/* Grounding toggle */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Web Grounding Search (Nano Banana Exclusive)</label>
                  <div className="flex items-center gap-2 pt-1.5">
                    <input
                      type="checkbox"
                      id="enableGrounding"
                      checked={studioEnableGrounding}
                      onChange={(e) => setStudioEnableGrounding(e.target.checked)}
                      className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
                    />
                    <label htmlFor="enableGrounding" className="text-xs text-slate-605 font-semibold select-none cursor-pointer flex items-center gap-1 leading-none">
                      <Search className="w-3.5 h-3.5 text-indigo-500" />
                      <span>Embed live Google Search contexts</span>
                    </label>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Video Engine Model */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Google Veo Engine Model</label>
                  <select
                    value={studioVideoModel}
                    onChange={(e) => setStudioVideoModel(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 outline-none font-semibold text-slate-700 focus:border-indigo-400 transition"
                  >
                    <option value="veo-3.1-lite-generate-preview">Veo 3.1 Lite (Fast & Efficient)</option>
                    <option value="veo-3.1-generate-preview">Veo 3.1 Pro (Cinematic High-Fidelity)</option>
                  </select>
                </div>

                {/* Video Resolution */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Video Engine Resolution</label>
                  <select
                    value={studioVideoResolution}
                    onChange={(e) => setStudioVideoResolution(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 outline-none font-semibold text-slate-700 focus:border-indigo-400 transition"
                  >
                    <option value="720p">720p Cinematic Standard</option>
                    <option value="1080p">1080p Full High Definition (HD)</option>
                  </select>
                </div>

                {/* Video Duration */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Target Video Duration</label>
                  <select
                    value={studioVideoDuration}
                    onChange={(e) => setStudioVideoDuration(Number(e.target.value))}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 outline-none font-semibold text-slate-700 focus:border-indigo-400 transition"
                  >
                    <option value="5">Short Snap (5 seconds)</option>
                    <option value="10">Ad Clip (10 seconds)</option>
                    <option value="30">Cinematic Story (30 seconds)</option>
                    <option value="60">Extended Feature (60 seconds / 1 minute)</option>
                    <option value="120">Deep Gen-AI Film (120 seconds / 2 minutes)</option>
                  </select>
                </div>

                {/* Starting image seed */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Seed / Context Starter Image (Optional)</label>
                  <div className="flex items-center gap-2">
                    <label className="flex-1 border border-dashed border-slate-300 rounded-lg p-1.5 px-3 flex items-center justify-center gap-1.5 cursor-pointer hover:border-indigo-400 hover:bg-slate-50 transition">
                      <Upload className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-[10px] font-bold text-slate-600 truncate">
                        {studioStarterImage ? "Image seed uploaded" : "Upload starting png/jpg"}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleStudioStarterImageChange}
                        className="hidden"
                      />
                    </label>
                    {studioStarterImage && (
                      <button
                        onClick={() => setStudioStarterImage(null)}
                        className="text-[9px] bg-red-50 text-red-600 font-bold px-2 py-2 rounded-lg border border-red-100 cursor-pointer"
                      >
                        Clear Seed
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Submit buttons */}
          <div className="pt-4 border-t border-slate-150">
            <button
              onClick={handleSynthesizeCreative}
              disabled={studioGenerating || !studioPrompt.trim()}
              className="w-full bg-slate-950 hover:bg-slate-900 text-white font-bold py-3.5 rounded-xl text-xs shadow-md transition disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
            >
              {studioGenerating ? (
                <>
                  <RefreshCw className="animate-spin w-4 h-4 text-emerald-400" />
                  <span>{studioStatusText || 'Structuring complex design coordinates...'}</span>
                </>
              ) : (
                <>
                  <Palette className="w-4 h-4 text-emerald-400 animate-pulse" />
                  <span>Create With Google {studioFormat === 'image' ? 'Nano Banana 2' : 'Veo 3.1 Pro'}</span>
                </>
              )}
            </button>
            <p className="text-center text-[10px] text-slate-400 mt-2 font-mono">
              Powered natively by Google Cloud Vertex GenAI backend integrations
            </p>
          </div>
        </div>

        {/* Right Interactive Player / Viewer column */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Generated asset preview container */}
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between h-[450px]">
            <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-xs font-bold text-slate-800 uppercase tracking-widest font-mono">LIVE STUDIO DRAWING BOARD</span>
              </div>
              {studioGeneratedUrl && (
                <span className="text-[9px] font-bold text-slate-500 font-mono bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded uppercase">
                  {studioFormat === 'image' ? '3.1 Image' : 'Veo 3.1 MP4'}
                </span>
              )}
            </div>

            {/* Viewport block */}
            <div className="flex-1 bg-slate-950 flex items-center justify-center p-4 relative">
              {studioGenerating ? (
                <div className="text-center space-y-4 max-w-sm">
                  <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-20 text-indigo-500"></span>
                    <div className="animate-spin w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-black text-white italic animate-pulse">
                      "{studioStatusText}"
                    </p>
                    <p className="text-[10px] text-slate-400">
                      Please remain here. The premium neural generators are assembling visual blocks.
                    </p>
                  </div>
                </div>
              ) : studioGeneratedUrl ? (
                <div className="w-full h-full flex items-center justify-center overflow-hidden rounded-lg">
                  {studioFormat === 'image' ? (
                    <img
                      src={studioGeneratedUrl}
                      alt="Generated Masterpiece"
                      referrerPolicy="no-referrer"
                      className="max-w-full max-h-full object-contain shadow-2xl rounded"
                    />
                  ) : (
                    <video
                      src={studioGeneratedUrl}
                      controls
                      className="max-w-full max-h-full object-contain rounded shadow-2xl"
                    />
                  )}
                </div>
              ) : (
                <div className="text-center space-y-2 max-w-xs">
                  <Palette className="w-10 h-10 text-slate-700 mx-auto stroke-1" />
                  <p className="text-xs font-bold text-slate-400">Viewport is currently empty</p>
                  <p className="text-[10px] text-slate-500 text-center">
                    Configure some beautiful parameters on the left and synthesize your next visual sales trigger.
                  </p>
                </div>
              )}
            </div>

            {/* Video Extension block */}
            {studioGeneratedUrl && studioFormat === 'video' && studioLastOperationName && !studioGenerating && (
              <div className="p-4 border-t border-slate-100 bg-emerald-50/40 space-y-2">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
                  <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
                    Google Veo 3.1 Video Extension (+7 seconds)
                  </span>
                </div>
                <p className="text-[10px] text-slate-500">
                  Extend this video's narrative timeline by 7 seconds. You can extend it progressively up to 148 seconds (2.5 minutes).
                </p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={studioExtensionPrompt}
                    onChange={(e) => setStudioExtensionPrompt(e.target.value)}
                    placeholder="Describe what happens next in the scene (e.g. 'A close-up shot of the designer smiling...')"
                    className="flex-1 text-xs bg-white border border-slate-200 rounded-xl px-3 outline-none focus:border-emerald-400 transition placeholder:text-slate-400"
                  />
                  <button
                    onClick={handleExtendCreative}
                    disabled={!studioExtensionPrompt.trim()}
                    className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:hover:bg-emerald-600 text-white font-bold py-2 px-4 rounded-xl text-xs transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-emerald-200" />
                    <span>Extend Video (+7s)</span>
                  </button>
                </div>
              </div>
            )}

            {/* Asset actions footer */}
            {studioGeneratedUrl && !studioGenerating && (
              <div className="p-4 border-t border-slate-100 bg-slate-50 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => {
                    // Apply to social draft inside Autopilot CreatorStudio (publisher) tab
                    setAiGeneratedUrl(studioGeneratedUrl);
                    setCreatorFormat(studioFormat === 'image' ? 'Image' : 'Video');
                    if (studioPrompt) {
                      setCreatorVisualPrompt(studioPrompt);
                    }
                    setActiveTab('publisher');
                  }}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <ArrowRight className="w-4 h-4 text-indigo-200" />
                  <span>Push Media to Post Draft</span>
                </button>

                <div className="flex gap-2">
                  <a
                    href={studioGeneratedUrl}
                    download={`socialflow-${studioFormat === 'image' ? 'image.png' : 'video.mp4'}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 p-2.5 rounded-xl text-xs transition flex items-center justify-center font-bold gap-1 cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span className="sm:inline hidden">HD Save</span>
                  </a>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>

      {/* SAVED MASTERPIECES SHOWCASE */}
      {studioSavedMedia.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-emerald-500" />
            <h3 className="text-xs font-black text-slate-1500 tracking-wider uppercase">AI Creative Asset Repository</h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {studioSavedMedia.map((media) => (
              <div key={media.id} className="group relative border border-slate-100 rounded-xl overflow-hidden bg-slate-950 flex flex-col justify-between h-44 shadow-xs">
                
                {/* Header badge */}
                <div className="absolute top-2 left-2 z-20">
                  <span className={`text-[8px] font-bold uppercase px-1.5 py-0.5 rounded text-white font-mono ${
                    media.type === 'image' ? 'bg-indigo-600/80' : 'bg-emerald-600/80'
                  }`}>
                    {media.type}
                  </span>
                </div>

                {/* Preview */}
                <div className="flex-1 overflow-hidden flex items-center justify-center relative">
                  {media.type === 'image' ? (
                    <img
                      src={media.url}
                      alt="Thumbnail"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-900 text-white relative">
                      <video src={media.url} muted className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <VideoIcon className="w-4 h-4 text-white opacity-80" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Overlay text detail or action bar */}
                <div className="p-2 bg-white flex items-center justify-between border-t border-slate-100 z-10">
                  <div className="truncate pr-2 cursor-pointer flex-1" onClick={() => {
                    setStudioGeneratedUrl(media.url);
                    setStudioFormat(media.type);
                    setStudioPrompt(media.prompt);
                    setStudioAspectRatio(media.aspectRatio || '1:1');
                    setStudioLastOperationName(media.operationName || null);
                  }} title="Reload into Creative Studio Viewport">
                    <span className="text-[9px] font-bold text-slate-700 block truncate">
                      {media.prompt}
                    </span>
                    <span className="text-[8px] text-slate-400 font-mono block">{media.timestamp}</span>
                  </div>
                  
                  <button
                    onClick={() => {
                      // Load this media instantly to draft
                      setAiGeneratedUrl(media.url);
                      setCreatorFormat(media.type === 'image' ? 'Image' : 'Video');
                      setCreatorVisualPrompt(media.prompt);
                      setActiveTab('publisher');
                    }}
                    className="bg-slate-100 hover:bg-slate-200 p-1 rounded-md text-slate-700 transition cursor-pointer"
                    title="Apply to active creative draft post layout"
                  >
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

                {/* Top corner hover delete */}
                <button
                  onClick={() => {
                    if (confirm("Delete visual asset from local repository cache?")) {
                      const updated = studioSavedMedia.filter(m => m.id !== media.id);
                      setStudioSavedMedia(updated);
                      localStorage.setItem('social_flow_studio_media', JSON.stringify(updated));
                    }
                  }}
                  className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-red-650 rounded-md text-white transition duration-150 transform scale-0 group-hover:scale-100 z-35 cursor-pointer"
                  title="Remove media"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>

              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
