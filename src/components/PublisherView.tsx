import React, { useState } from 'react';
import { RefreshCw, Sparkles, Check, Globe, Trash2, Image as ImageIcon, Wand2, FolderHeart, ArrowLeft } from 'lucide-react';
import { SocialPost, ArsenalMediaAsset } from '../types';

interface PublisherViewProps {
  fetchIgRecentMedia: () => void;
  loadingIgMedia: boolean;
  igRecentMedia: any[];
  selectedMediaId: string | null;
  setSelectedMediaId: (val: string | null) => void;
  setReferenceImageUrl: (val: string | null) => void;
  creatorPlatform: string;
  setCreatorPlatform: (val: any) => void;
  creatorFormat: string;
  setCreatorFormat: (val: any) => void;
  creatorTitle: string;
  setCreatorTitle: (val: string) => void;
  creatorCustomPrompt: string;
  setCreatorCustomPrompt: (val: string) => void;
  brandName: string;
  creatorVisualPrompt: string;
  setCreatorVisualPrompt: (val: string) => void;
  handleGenerateAIImage: () => void;
  generatingAIImage: boolean;
  scheduledDraftTime: string;
  setScheduledDraftTime: (val: string) => void;
  handleGeneratePostCapAndScore: () => void;
  loadingPosts: boolean;
  activeCreatedPost: SocialPost | null;
  referenceImageUrl: string | null;
  imagePreview: string | null;
  aiGeneratedUrl: string | null;
  captionDraft: string;
  setCaptionDraft: (val: string) => void;
  handlePublishPostNow: (id: string) => void;
  publishingPostId: string | null;
  handleSchedulePost: (id: string, time: string) => void;
  handleDeletePost: (id: string) => void;
  arsenalMedia?: ArsenalMediaAsset[];
}

export default function PublisherView({
  selectedMediaId,
  setSelectedMediaId,
  setReferenceImageUrl,
  creatorPlatform,
  setCreatorPlatform,
  creatorFormat,
  setCreatorFormat,
  creatorTitle,
  setCreatorTitle,
  creatorCustomPrompt,
  setCreatorCustomPrompt,
  brandName,
  creatorVisualPrompt,
  setCreatorVisualPrompt,
  handleGeneratePostCapAndScore,
  loadingPosts,
  activeCreatedPost,
  referenceImageUrl,
  imagePreview,
  aiGeneratedUrl,
  captionDraft,
  setCaptionDraft,
  handlePublishPostNow,
  publishingPostId,
  handleDeletePost,
  arsenalMedia = []
}: PublisherViewProps) {
  
  const [creationMode, setCreationMode] = useState<'ai' | 'arsenal' | null>(null);

  const resetForm = () => {
    setSelectedMediaId(null);
    setReferenceImageUrl(null);
    setCreatorTitle('');
    setCreatorVisualPrompt('');
    setCreatorCustomPrompt('');
  };

  const handleSelectMode = (mode: 'ai' | 'arsenal') => {
    resetForm();
    setCreationMode(mode);
    setCreatorFormat('Image'); // Default to image
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="creator-studio-tab">
      
      {/* Left Column: Creator inputs */}
      <div className="lg:col-span-7 space-y-6">
        
        {/* Mode Selector - Shown if no mode is selected */}
        {!creationMode && (
          <div className="bg-white border border-slate-200 p-8 rounded-xl shadow-sm text-center">
            <h2 className="text-2xl font-black text-slate-900 mb-2">What do you want to create?</h2>
            <p className="text-slate-600 text-sm mb-8">Choose a path to generate your next high-converting post.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button 
                onClick={() => handleSelectMode('ai')}
                className="flex flex-col items-center justify-center p-6 border-2 border-indigo-100 hover:border-indigo-500 bg-indigo-50/30 hover:bg-indigo-50 rounded-2xl transition group"
              >
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition">
                  <Wand2 className="w-8 h-8 text-indigo-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">AI Autopilot Post</h3>
                <p className="text-xs text-slate-600 mt-2 max-w-xs">Give a topic, and AI will generate both a brand-new image and the perfect caption.</p>
              </button>

              <button 
                onClick={() => handleSelectMode('arsenal')}
                className="flex flex-col items-center justify-center p-6 border-2 border-emerald-100 hover:border-emerald-500 bg-emerald-50/30 hover:bg-emerald-50 rounded-2xl transition group"
              >
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition">
                  <FolderHeart className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Use My Arsenal</h3>
                <p className="text-xs text-slate-600 mt-2 max-w-xs">Pick a photo or video you already uploaded, and AI will write the perfect caption for it.</p>
              </button>
            </div>
          </div>
        )}

        {/* Wizard Form - Shown if a mode is selected */}
        {creationMode && (
          <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm space-y-5 animate-fade-in">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setCreationMode(null)}
                  className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 transition cursor-pointer"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  {creationMode === 'ai' ? (
                    <><Wand2 className="w-5 h-5 text-indigo-600" /> AI Autopilot Generator</>
                  ) : (
                    <><FolderHeart className="w-5 h-5 text-emerald-600" /> Organic Arsenal Publisher</>
                  )}
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600 uppercase block">Target Platform</label>
                <select
                  value={creatorPlatform}
                  onChange={(e) => setCreatorPlatform(e.target.value as any)}
                  className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none font-semibold text-slate-700 focus:border-indigo-500"
                >
                  <option value="Instagram">Instagram</option>
                  <option value="TikTok">TikTok</option>
                  <option value="LinkedIn">LinkedIn</option>
                  <option value="Facebook">Facebook</option>
                </select>
              </div>

              {creationMode === 'ai' && (
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-600 uppercase block">Format</label>
                  <select
                    value={creatorFormat}
                    onChange={(e) => setCreatorFormat(e.target.value as any)}
                    className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none font-semibold text-slate-700 focus:border-indigo-500"
                  >
                    <option value="Image">Single Image</option>
                    <option value="Video">Video Concept</option>
                  </select>
                </div>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-600 uppercase block">1. What is this post about?</label>
              <input
                type="text"
                value={creatorTitle}
                onChange={(e) => setCreatorTitle(e.target.value)}
                placeholder="e.g. Announcing our new summer collection"
                className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg p-3 outline-none font-medium text-slate-800 focus:border-indigo-500 transition-colors"
              />
            </div>

            {creationMode === 'ai' && (
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600 uppercase block">2. What should the AI image look like?</label>
                <textarea
                  rows={2}
                  value={creatorVisualPrompt}
                  onChange={(e) => setCreatorVisualPrompt(e.target.value)}
                  placeholder="e.g. Minimalist layout of green plants, soft daylight shadows, highly aesthetic"
                  className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg p-3 outline-none font-medium text-slate-800 focus:border-indigo-500 transition-colors resize-none"
                />
              </div>
            )}

            {creationMode === 'arsenal' && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-600 uppercase block">2. Select a file from your Arsenal</label>
                
                {arsenalMedia.length === 0 ? (
                  <div className="text-center p-6 bg-slate-50 border border-slate-200 border-dashed rounded-xl">
                    <p className="text-sm text-slate-600">Your Arsenal is empty. Upload media in the "Content Arsenal" tab first!</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 overflow-y-auto max-h-64 p-1">
                    {arsenalMedia.map((item) => {
                      const isSelected = selectedMediaId === item.id;
                      const isVideo = item.mimeType.startsWith('video/');
                      
                      return (
                        <div
                          key={item.id}
                          onClick={() => {
                            setSelectedMediaId(item.id);
                            setReferenceImageUrl(item.url);
                            setCreatorFormat(isVideo ? 'Video' : 'Image');
                          }}
                          className={`relative aspect-square rounded-xl overflow-hidden cursor-pointer transition-all duration-200 border-2 ${
                            isSelected 
                              ? 'border-indigo-600 shadow-md ring-4 ring-indigo-500/20' 
                              : 'border-transparent hover:border-slate-300'
                          }`}
                        >
                          {isVideo ? (
                            <video src={item.url} className="w-full h-full object-cover" />
                          ) : (
                            <img src={item.url} className="w-full h-full object-cover" alt={item.fileName} />
                          )}
                          
                          {isSelected && (
                            <div className="absolute top-2 right-2 bg-indigo-600 text-white p-1 rounded-full shadow-md z-10">
                              <Check className="w-3 h-3" />
                            </div>
                          )}
                          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                            <p className="text-[8px] text-white truncate">{item.fileName}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-600 uppercase block">3. Special Caption Instructions (Optional)</label>
              <textarea
                rows={2}
                value={creatorCustomPrompt}
                onChange={(e) => setCreatorCustomPrompt(e.target.value)}
                placeholder="e.g. Keep it short, use emojis, mention the link in bio."
                className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg p-3 outline-none font-medium text-slate-800 focus:border-indigo-500 transition-colors resize-none"
              />
            </div>

            <div className="pt-4 border-t border-slate-100">
              <button
                onClick={handleGeneratePostCapAndScore}
                disabled={loadingPosts || (creationMode === 'arsenal' && !selectedMediaId)}
                className={`w-full font-bold py-4 rounded-xl text-sm shadow-md transition disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer ${
                  creationMode === 'ai' ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                }`}
              >
                {loadingPosts ? (
                  <>
                    <RefreshCw className="animate-spin w-5 h-5" />
                    <span>Generating post...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 animate-pulse" />
                    <span>{creationMode === 'ai' ? 'Generate Complete AI Post' : 'Write Caption for Selected Media'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Right Column: Interactive Simulator Preview and scorecards */}
      <div className="lg:col-span-5 h-full space-y-6">
        
        {(activeCreatedPost || referenceImageUrl || imagePreview || aiGeneratedUrl) ? (
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm animate-fade-in">
            <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-slate-700 text-white font-bold flex items-center justify-center text-xs">
                  {brandName?.charAt(0).toUpperCase() || 'B'}
                </div>
                <div>
                  <span className="font-bold text-slate-900 text-xs block leading-none">{brandName || 'Brand'}</span>
                  <span className="text-xs text-indigo-600 font-mono font-bold">
                    {(activeCreatedPost?.platform || creatorPlatform || 'Instagram')} Mock Feed
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-slate-100 aspect-square w-full relative flex items-center justify-center overflow-hidden border-b border-slate-100">
              {aiGeneratedUrl ? (
                aiGeneratedUrl.includes('.mp4') || creatorFormat === 'Video' ? (
                  <video src={aiGeneratedUrl} controls loop autoPlay muted className="w-full h-full object-cover" />
                ) : (
                  <img src={aiGeneratedUrl} className="w-full h-full object-cover" alt="AI generated" />
                )
              ) : referenceImageUrl ? (
                referenceImageUrl.includes('.mp4') || creatorFormat === 'Video' ? (
                  <video src={referenceImageUrl} controls loop autoPlay muted className="w-full h-full object-cover" />
                ) : (
                  <img src={referenceImageUrl} className="w-full h-full object-cover" alt="Reference" />
                )
              ) : (activeCreatedPost && activeCreatedPost.mediaUrl) ? (
                activeCreatedPost.mediaUrl.includes('.mp4') || activeCreatedPost.mediaType === 'video' ? (
                  <video src={activeCreatedPost.mediaUrl} controls loop autoPlay muted className="w-full h-full object-cover" />
                ) : (
                  <img src={activeCreatedPost.mediaUrl} className="w-full h-full object-cover" alt="Generated" />
                )
              ) : (
                <div className="text-center p-4 text-slate-500">
                  <ImageIcon className="w-8 h-8 mx-auto mb-1 text-slate-300" />
                  <p className="text-xs">No media rendered yet.</p>
                </div>
              )}
            </div>

            <div className="p-5 space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">Live Caption Editor</span>
                </div>
                <textarea
                  rows={6}
                  value={captionDraft}
                  onChange={(e) => setCaptionDraft(e.target.value)}
                  placeholder="Caption will appear here..."
                  className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl p-3 font-sans outline-none leading-relaxed text-slate-800 focus:bg-white focus:border-indigo-500 transition"
                />
              </div>

              {activeCreatedPost ? (
                <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                  <button
                    onClick={() => handlePublishPostNow(activeCreatedPost.id)}
                    disabled={publishingPostId === activeCreatedPost.id}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold py-2.5 rounded-xl shadow-sm transition disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {publishingPostId === activeCreatedPost.id ? (
                      <>
                        <RefreshCw className="animate-spin w-5 h-5" />
                        <span>Deploying...</span>
                      </>
                    ) : (
                      <>
                        <Globe className="w-5 h-5" />
                        <span>Auto-Deploy Now</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleDeletePost(activeCreatedPost.id)}
                    className="text-slate-500 hover:text-red-500 bg-slate-50 hover:bg-rose-50 p-2.5 rounded-xl transition cursor-pointer"
                    title="Delete draft"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div className="pt-3 border-t border-slate-100 text-center">
                  <p className="text-xs text-slate-600">Generate the post to unlock publishing controls.</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-slate-50 border border-slate-200 border-dashed rounded-2xl p-12 text-center text-slate-500 h-full flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
              <Sparkles className="w-8 h-8 text-indigo-300" />
            </div>
            <h3 className="font-bold text-slate-700 mb-2">Live Preview Sandbox</h3>
            <p className="text-sm text-slate-600 max-w-xs">
              Complete the setup on the left and hit generate to see a live mock-up of how your post will look on social media.
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
