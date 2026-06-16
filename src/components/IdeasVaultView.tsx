import React from 'react';
import { Upload, RefreshCw, Sparkles, Clock, ArrowRight } from 'lucide-react';
import { ContentIdea } from '../types';

interface IdeasVaultViewProps {
  referenceText: string;
  setReferenceText: (val: string) => void;
  imageFile: File | null;
  imagePreview: string | null;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  loadingIdeas: boolean;
  handleGenerateIdeas: () => void;
  ideas: ContentIdea[];
  handleSelectIdeaToCreate: (idea: ContentIdea) => void;
}

export default function IdeasVaultView({
  referenceText,
  setReferenceText,
  imageFile,
  imagePreview,
  handleImageChange,
  loadingIdeas,
  handleGenerateIdeas,
  ideas,
  handleSelectIdeaToCreate
}: IdeasVaultViewProps) {
  return (
    <div className="space-y-6" id="ideas-tab">
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
        <div>
          <h2 className="text-sm font-bold text-slate-900">AI Social Auto-Scanner</h2>
          <p className="text-slate-500 text-xs">Upload sample social media screenshots or paste existing posts text to let the AI learn your style and target buyers.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase block">Reference Caption or Competitor Content Style</label>
            <textarea
              rows={3}
              value={referenceText}
              onChange={(e) => setReferenceText(e.target.value)}
              placeholder="Paste text of a post you liked so the AI can mimic its flow, structure, and hashtag count..."
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-3 outline-none font-medium text-slate-800 focus:border-slate-400 transition resize-none"
            />
          </div>

          <div className="space-y-1.5 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Upload Reference Image asset</span>
              <div className="border-2 border-dashed border-slate-200 hover:border-slate-350 rounded-lg p-4 transition text-center relative cursor-pointer group bg-slate-50">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                {imagePreview ? (
                  <div className="flex items-center justify-center gap-3">
                    <img src={imagePreview} className="w-12 h-12 object-cover rounded-md border border-slate-300" alt="uploaded reference" />
                    <div className="text-left">
                      <p className="text-xs font-bold text-slate-700 truncate max-w-xs">{imageFile?.name}</p>
                      <p className="text-[10px] text-slate-400 font-mono">Reference Locked. Style analyser active.</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <Upload className="w-4 h-4 text-slate-400 mx-auto group-hover:text-slate-600 transition" />
                    <p className="text-xs font-semibold text-slate-600">Drag & drop photo / video or browse files</p>
                    <p className="text-[9px] text-slate-400">Supports JPG, PNG (AI matches the visual tone of the content)</p>
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={handleGenerateIdeas}
              disabled={loadingIdeas}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 rounded-lg text-xs shadow-sm transition disabled:opacity-50 mt-2 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              {loadingIdeas ? (
                <>
                  <RefreshCw className="animate-spin w-3.5 h-3.5" />
                  <span>Extracting social style & context parameters...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Generate Tailored Campaign Content Ideas with AI</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-bold text-slate-900 text-sm">Targeted Concept Library</h3>
          <span className="text-[11px] text-slate-400 font-mono">
            {ideas.length} custom directions available
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ideas.map((idea) => {
            const isTikTok = idea.recommendedPlatform === 'TikTok';
            const isInstagram = idea.recommendedPlatform === 'Instagram';
            const isLinkedIn = idea.recommendedPlatform === 'LinkedIn';
            const isFacebook = idea.recommendedPlatform === 'Facebook';

            let platBg = 'bg-blue-50 text-blue-700 border-blue-200';
            if (isTikTok) platBg = 'bg-emerald-50 text-emerald-700 border-emerald-200';
            else if (isInstagram) platBg = 'bg-rose-50 text-rose-700 border-rose-200';
            else if (isLinkedIn) platBg = 'bg-sky-50 text-sky-700 border-sky-300';

            return (
              <div 
                key={idea.id} 
                id={`content-idea-card-${idea.id}`}
                className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col justify-between hover:shadow-md transition duration-200"
              >
                <div>
                  <div className="flex justify-between items-center mb-2.5">
                    <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold border ${platBg}`}>
                      {idea.recommendedPlatform}
                    </span>
                    <div className="flex items-center gap-1 text-[10px] text-slate-400 font-mono font-semibold">
                      <Clock className="w-3" />
                      <span>{idea.recommendedTime}</span>
                    </div>
                  </div>

                  <h4 className="font-bold text-slate-900 text-sm mb-1 leading-snug">{idea.title}</h4>
                  
                  <div className="bg-slate-50 border-l-2 border-indigo-500 p-2 my-2 rounded-r-lg font-mono text-[10.5px]">
                    <span className="text-slate-400 text-[9px] uppercase font-bold tracking-wider block leading-none mb-0.5">Viral Hook Target</span>
                    <span className="text-slate-700 font-medium italic">"{idea.hook}"</span>
                  </div>

                  <p className="text-slate-600 text-xs line-clamp-3 mb-3 leading-relaxed">
                    {idea.description}
                  </p>

                  <div className="border-t border-slate-100 pt-2.5 mt-3 space-y-1">
                    <div className="flex justify-between text-[10px]">
                      <span className="text-slate-400 font-medium">Format:</span>
                      <span className="font-bold text-slate-700">{idea.format}</span>
                    </div>
                    <div className="flex justify-between text-[10px]">
                      <span className="text-slate-400 font-medium">Target Segment:</span>
                      <span className="font-bold text-slate-700 truncate max-w-[120px]">{idea.audienceSegment}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 mt-2">
                  <button
                    onClick={() => handleSelectIdeaToCreate(idea)}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-1.5 rounded-lg transition flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <span>Push and Generate Post Draft</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
