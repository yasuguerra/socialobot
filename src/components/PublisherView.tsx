import React from 'react';
import { RefreshCw, Sparkle, Sparkles, Check, Globe, Trash2, Image as ImageIcon } from 'lucide-react';
import { SocialPost } from '../types';

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
}

export default function PublisherView({
  fetchIgRecentMedia,
  loadingIgMedia,
  igRecentMedia,
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
  handleGenerateAIImage,
  generatingAIImage,
  scheduledDraftTime,
  setScheduledDraftTime,
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
  handleSchedulePost,
  handleDeletePost
}: PublisherViewProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="creator-studio-tab">
      
      {/* Left Column: Creator inputs */}
      <div className="lg:col-span-7 space-y-5 bg-white border border-slate-200 p-5 rounded-xl shadow-sm h-fit">
        <div>
          <h2 className="text-sm font-bold text-slate-900">Configure Auto-Posting Settings</h2>
          <p className="text-slate-500 text-xs">The predictive engine writes and schedules similar high-converting social layouts with one key click.</p>
        </div>

        {/* ✨ NEW FEATURE: Clone & Recreate Live Instagram Posts */}
        <div className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black tracking-wider uppercase text-indigo-700 flex items-center gap-1.5 font-mono">
              <Sparkle className="w-3.5 h-3.5 text-indigo-600 animate-pulse" />
              <span>Clone & Recreate from Live Instagram Feed</span>
            </span>
            <button
              onClick={fetchIgRecentMedia}
              className="text-[9px] font-bold text-indigo-600 hover:underline flex items-center gap-1 cursor-pointer"
              disabled={loadingIgMedia}
            >
              <RefreshCw className={`w-3 ${loadingIgMedia ? 'animate-spin' : ''}`} />
              <span>Sync Feed</span>
            </button>
          </div>

          {loadingIgMedia ? (
            <div className="text-center py-4 text-xs text-indigo-600 font-medium">
              <RefreshCw className="animate-spin w-4 h-4 mx-auto mb-1" />
              <span>Retrieving live timeline items...</span>
            </div>
          ) : igRecentMedia.length > 0 ? (
            <div className="space-y-2">
              <p className="text-[11px] text-slate-500 leading-snug">Select one of your recent Instagram posts. Seliabot's AI model will read the image, analyze the caption DNA, and rewrite a similar, optimized copy for you:</p>
              
              <div className="grid grid-cols-3 gap-2 overflow-x-auto pb-1">
                {igRecentMedia.map((item) => {
                  const isSelected = selectedMediaId === item.id;
                  const displayUrl = item.thumbnail_url || item.media_url;
                  const isVideo = item.media_type === 'VIDEO' || item.media_url?.includes('.mp4');

                  return (
                    <div
                      key={item.id}
                      onClick={() => {
                        setSelectedMediaId(item.id);
                        setReferenceImageUrl(item.media_url);
                        setCreatorPlatform('Instagram');
                        setCreatorFormat('Image');
                        setCreatorTitle(`Variant upgrade of post #${item.id.slice(-4)}`);
                        setCreatorCustomPrompt(
                          `Analyze and recreate a highly engaging, fresh alternative to this previous Instagram caption:\n\n"${item.caption}"\n\nEnsure it aligns perfectly with the brand DNA of ${brandName}. Maintain the style and structure but write it completely fresh and add relevant hashtags.`
                        );
                      }}
                      className={`group relative aspect-square rounded-lg overflow-hidden border cursor-pointer transition duration-150 ${
                        isSelected 
                          ? 'border-indigo-600 ring-2 ring-indigo-500/30 shadow-md' 
                          : 'border-slate-200 hover:border-indigo-400'
                      }`}
                    >
                      <img 
                        src={displayUrl} 
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-200" 
                        alt="instagram media" 
                      />
                      {isVideo && (
                        <div className="absolute top-1 left-1 bg-slate-900/70 text-white p-1 rounded text-[8px] font-black tracking-wider uppercase font-mono leading-none">
                          REEL 🎥
                        </div>
                      )}
                      <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition duration-150 flex items-end p-1">
                        <span className="text-[8px] text-white font-bold truncate block w-full bg-slate-900/65 px-1 py-0.5 rounded leading-none">
                          {item.caption ? item.caption.slice(0, 15) + '...' : 'Photo'}
                        </span>
                      </div>
                      {isSelected && (
                        <div className="absolute top-1 right-1 bg-indigo-600 text-white p-0.5 rounded-full shadow-md">
                          <Check className="w-3 h-3" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {selectedMediaId && (
                <div className="bg-white border border-indigo-100 p-2 rounded-lg text-[10px] text-slate-600 flex justify-between items-center animate-fade-in">
                  <span className="font-semibold text-indigo-700">✓ Reference selected. Ready to recreate similar variants.</span>
                  <button
                    onClick={() => {
                      setSelectedMediaId(null);
                      setReferenceImageUrl(null);
                      setCreatorTitle('');
                      setCreatorCustomPrompt('');
                    }}
                    className="text-rose-500 hover:underline font-bold cursor-pointer"
                  >
                    Clear Selection
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-slate-400 text-xs py-3 border border-dashed border-slate-200 rounded-lg text-center bg-slate-50/50">
              Connect your Instagram business profile under the <strong>Connected Platforms</strong> tab to pull your live timeline feed here and use AI to create similar content!
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase block">Target Social Channel</label>
            <select
              value={creatorPlatform}
              onChange={(e) => setCreatorPlatform(e.target.value as any)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 outline-none font-semibold text-slate-700"
            >
              <option value="Instagram">Instagram (Visual Feed / Stories)</option>
              <option value="TikTok">TikTok (Viral Video Script)</option>
              <option value="LinkedIn">LinkedIn (Executive Post)</option>
              <option value="Facebook">Facebook (Organic Social)</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase block">Format Style</label>
            <select
              value={creatorFormat}
              onChange={(e) => setCreatorFormat(e.target.value as any)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 outline-none font-semibold text-slate-700"
            >
              <option value="Image">Single Image with Caption</option>
              <option value="Video">Video Concept & Script</option>
              <option value="Carousel">Swipable Carousel Album</option>
            </select>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-500 uppercase block">Campaign Topic or Title</label>
          <input
            type="text"
            value={creatorTitle}
            onChange={(e) => setCreatorTitle(e.target.value)}
            placeholder="e.g. Summer organic cotton drop"
            className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 outline-none font-medium text-slate-800"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-500 uppercase block">Visual Conceptual Prompt for AI Graphic Asset</label>
          <div className="flex gap-2">
            <textarea
              rows={2}
              value={creatorVisualPrompt}
              onChange={(e) => setCreatorVisualPrompt(e.target.value)}
              placeholder="e.g. Minimalist layout of green plants, sustainable glass bottle, soft daylight shadows, cream paper background"
              className="flex-1 text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 outline-none font-medium text-slate-800 focus:border-indigo-400 transition resize-none"
            />
            <button
              onClick={handleGenerateAIImage}
              disabled={generatingAIImage || !creatorVisualPrompt}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-fit my-auto text-xs px-3.5 py-3 rounded-lg transition disabled:opacity-50 inline-flex items-center gap-1.5 cursor-pointer"
            >
              {generatingAIImage ? (
                <>
                  <RefreshCw className="animate-spin w-3.5 h-3.5" />
                  <span>Drawing...</span>
                </>
              ) : (
                <>
                  <Sparkle className="w-3.5 h-3.5 text-yellow-300" />
                  <span>Render AI Image</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-500 uppercase block">Target Segment & Sales Copy Adjustments</label>
          <textarea
            rows={2}
            value={creatorCustomPrompt}
            onChange={(e) => setCreatorCustomPrompt(e.target.value)}
            placeholder="e.g. Keep style casual and humor-centric. Urge the reader to buy today and mention our tree plantation program."
            className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 outline-none font-medium text-slate-800 resize-none"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-500 uppercase">Optimal posting time preset</label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={scheduledDraftTime}
              onChange={(e) => setScheduledDraftTime(e.target.value)}
              className="flex-1 text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 outline-none font-medium text-slate-800"
            />
            <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-1 rounded border border-emerald-100">
              Top Engagement Spot
            </span>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100">
          <button
            onClick={handleGeneratePostCapAndScore}
            disabled={loadingPosts}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-lg text-xs shadow-sm transition disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
          >
            {loadingPosts ? (
              <>
                <RefreshCw className="animate-spin w-4 h-4" />
                <span>Applying Social DNA & formatting targeted caption words...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-teal-300 animate-pulse" />
                <span>Generate Autopilot Caption & Viral Scorecard with AI</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Right Column: Interactive Simulator Preview and scorecards */}
      <div className="lg:col-span-5 h-full space-y-6">
        
        {(activeCreatedPost || referenceImageUrl || imagePreview) ? (
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-slate-700 text-white font-bold flex items-center justify-center text-xs">
                  E
                </div>
                <div>
                  <span className="font-bold text-slate-900 text-xs block leading-none">{brandName || 'Brand'}</span>
                  <span className="text-[10px] text-indigo-600 font-mono font-bold">
                    {(activeCreatedPost?.platform || creatorPlatform || 'Instagram')} Mock Sandbox Feed
                  </span>
                </div>
              </div>
              
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.5 rounded uppercase">
                  {(activeCreatedPost?.status || 'DRAFT')}
                </span>
              </div>
            </div>

            <div className="bg-slate-100 aspect-square w-full relative flex items-center justify-center overflow-hidden border-b border-slate-100">
              {aiGeneratedUrl ? (
                aiGeneratedUrl.includes('.mp4') || aiGeneratedUrl.includes('/veo/') || creatorFormat === 'Video' ? (
                  <video src={aiGeneratedUrl} controls loop autoPlay muted className="w-full h-full object-cover" />
                ) : (
                  <img src={aiGeneratedUrl} className="w-full h-full object-cover" alt="AI generated" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = "https://images.unsplash.com/photo-1540962351504-03099e0a754b?auto=format&fit=crop&w=800&q=80"; }} />
                )
              ) : (referenceImageUrl || imagePreview) ? (
                (referenceImageUrl || imagePreview)!.includes('.mp4') || creatorFormat === 'Video' ? (
                  <video src={referenceImageUrl || imagePreview || ''} controls loop autoPlay muted className="w-full h-full object-cover" />
                ) : (
                  <img src={referenceImageUrl || imagePreview || ''} className="w-full h-full object-cover" alt="Reference" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = "https://images.unsplash.com/photo-1540962351504-03099e0a754b?auto=format&fit=crop&w=800&q=80"; }} />
                )
              ) : (activeCreatedPost && activeCreatedPost.mediaUrl) ? (
                activeCreatedPost.mediaUrl.includes('.mp4') || activeCreatedPost.mediaUrl.includes('/veo/') || activeCreatedPost.mediaType === 'video' ? (
                  <video src={activeCreatedPost.mediaUrl} controls loop autoPlay muted className="w-full h-full object-cover" />
                ) : (
                  <img src={activeCreatedPost.mediaUrl} className="w-full h-full object-cover" alt="Theme reference visual" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = "https://images.unsplash.com/photo-1540962351504-03099e0a754b?auto=format&fit=crop&w=800&q=80"; }} />
                )
              ) : (
                <div className="text-center p-4 text-slate-400">
                  <ImageIcon className="w-8 h-8 mx-auto mb-1 text-slate-300" />
                  <p className="text-xs">No media rendered yet. Click "Render AI Image" or "Update reference" to load.</p>
                </div>
              )}
            </div>

            <div className="p-4 space-y-3">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Live Caption Draft editor</span>
                  <span className="text-[10px] text-slate-400">Word count: {captionDraft.length}</span>
                </div>
                <textarea
                  rows={6}
                  value={captionDraft}
                  onChange={(e) => setCaptionDraft(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-sans outline-none leading-relaxed text-slate-800 focus:bg-white focus:border-slate-400 transition"
                />
              </div>

              {activeCreatedPost ? (
                <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
                  <button
                    onClick={() => handlePublishPostNow(activeCreatedPost.id)}
                    disabled={publishingPostId === activeCreatedPost.id}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2 rounded-lg shadow-sm transition disabled:opacity-50 flex items-center justify-center gap-1.5 cursor-pointer hover:scale-[1.01]"
                  >
                    {publishingPostId === activeCreatedPost.id ? (
                      <>
                        <RefreshCw className="animate-spin w-4.5 h-4.5" />
                        <span>Deploying...</span>
                      </>
                    ) : (
                      <>
                        <Globe className="w-4 h-4 text-emerald-300" />
                        <span>Auto-Deploy & Post Now</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleSchedulePost(activeCreatedPost.id, scheduledDraftTime)}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold py-2 px-3 rounded-lg border border-slate-200 transition cursor-pointer"
                  >
                    Lock Schedule Slot
                  </button>

                  <button
                    onClick={() => handleDeletePost(activeCreatedPost.id)}
                    className="text-slate-400 hover:text-red-500 p-2 rounded transition cursor-pointer"
                    title="Delete draft"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="pt-2 border-t border-slate-100 text-center py-2 bg-slate-50 rounded-lg text-[10px] text-slate-500 font-medium">
                  <span>Click the "Generate Autopilot Caption" button on the left to activate instant publication controls.</span>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-400 shadow-sm">
            <Sparkles className="w-8 h-8 mx-auto mb-2 text-indigo-500 animate-pulse" />
            <h3 className="font-bold text-slate-800 mb-1 text-sm">Visual Live Sandbox</h3>
            <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto">
              Configure your campaign and click "Generate Autopilot Caption" to build optimized captions alongside your custom A/B target segments.
            </p>
          </div>
        )}

        {activeCreatedPost && activeCreatedPost.viralMetrics && (
          <div className="bg-indigo-950 text-white rounded-xl p-4 shadow-md space-y-4 font-sans">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest block font-mono">AUTOPILOT FORECAST</span>
                <h3 className="text-sm font-bold text-white mt-0.5">Composite Viral Score</h3>
              </div>
              <div className="text-right">
                <span className="text-3xl font-black italic block leading-none text-indigo-300">
                  {activeCreatedPost.viralScore}<span className="text-sm font-light uppercase tracking-normal">/100</span>
                </span>
                <span className="text-[9px] bg-indigo-500/30 text-indigo-200 px-1.5 py-0.5 rounded font-mono mt-1 inline-block">
                  High Probability
                </span>
              </div>
            </div>

            <div className="space-y-2.5">
              <div className="space-y-1">
                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-slate-300 font-medium">Headline / Hook Rating</span>
                  <span className="font-bold text-indigo-300">{activeCreatedPost.viralMetrics.hook}%</span>
                </div>
                <div className="w-full bg-indigo-900/40 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-indigo-400 h-full rounded-full" style={{ width: `${activeCreatedPost.viralMetrics.hook}%` }}></div>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-slate-300 font-medium">Viral Trend Alignment</span>
                  <span className="font-bold text-indigo-300">{activeCreatedPost.viralMetrics.trend}%</span>
                </div>
                <div className="w-full bg-indigo-900/40 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-indigo-400 h-full rounded-full" style={{ width: `${activeCreatedPost.viralMetrics.trend}%` }}></div>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-slate-300 font-medium">Viral Shareability Score</span>
                  <span className="font-bold text-indigo-300">{activeCreatedPost.viralMetrics.shareability}%</span>
                </div>
                <div className="w-full bg-indigo-900/40 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-indigo-400 h-full rounded-full" style={{ width: `${activeCreatedPost.viralMetrics.shareability}%` }}></div>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-slate-300 font-medium">Visual Impact Potential</span>
                  <span className="font-bold text-indigo-300">{activeCreatedPost.viralMetrics.visualImpact}%</span>
                </div>
                <div className="w-full bg-indigo-900/40 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-indigo-400 h-full rounded-full" style={{ width: `${activeCreatedPost.viralMetrics.visualImpact}%` }}></div>
                </div>
              </div>
            </div>

            <div className="bg-indigo-900/40 border border-indigo-800/60 rounded-lg p-3 text-[11px] text-indigo-200 italic leading-relaxed">
              💡 <strong>AI Recommendations:</strong> {activeCreatedPost.viralFeedback}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
