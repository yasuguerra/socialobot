import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Check, 
  Globe, 
  Trash2, 
  Sparkles, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  HelpCircle,
  Eye,
  Layers,
  ArrowRight
} from 'lucide-react';
import { SocialPost, SocialPlatform } from '../types';
import { parseScheduleTime, toIso, formatDisplay } from '../utils/schedule';

interface CalendarViewProps {
  posts: SocialPost[];
  onReschedule: (postId: string, newTime: string) => Promise<void> | void;
  onPublish: (postId: string) => Promise<void> | void;
  onDelete: (postId: string) => Promise<void> | void;
  onPlanCampaignClick?: () => void;
}

export default function CalendarView({ 
  posts = [], 
  onReschedule, 
  onPublish, 
  onDelete,
  onPlanCampaignClick 
}: CalendarViewProps) {
  // Default to the current real-world month.
  const today = new Date();
  const [viewYear, setViewYear] = useState<number>(today.getFullYear());
  // 1-based month (1 = January) for compatibility with existing code paths.
  const [viewMonth, setViewMonth] = useState<number>(today.getMonth() + 1);
  const [hoveredDay, setHoveredDay] = useState<number | null>(null);
  const [draggedPostId, setDraggedPostId] = useState<string | null>(null);
  const [dragOverDay, setDragOverDay] = useState<number | null>(null);
  const [activePreviewPost, setActivePreviewPost] = useState<SocialPost | null>(null);

  // Resolve a post's schedule to a calendar day using the shared parser.
  // Returns null for unparseable schedules (those posts won't render on a day).
  const getPostDateInfo = (post: SocialPost): { year: number; month: number; day: number } | null => {
    const parsed = parseScheduleTime(post.scheduledTime);
    if (!parsed) return null;
    const d = parsed.date;
    return { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() };
  };

  const getPostsForDay = (day: number) => {
    return posts.filter(post => {
      const info = getPostDateInfo(post);
      return info?.year === viewYear && info?.month === viewMonth && info?.day === day;
    });
  };

  // Dynamic month characteristics computed from viewYear / viewMonth.
  const monthName = new Date(viewYear, viewMonth - 1, 1).toLocaleString(undefined, {
    month: 'long',
    year: 'numeric',
  });
  // Last day of month: day 0 of next month.
  const totalDays = new Date(viewYear, viewMonth, 0).getDate();
  // Day-of-week (0=Sun) of the 1st of this month.
  const startBlankDays = new Date(viewYear, viewMonth - 1, 1).getDay();

  const calendarCells: (number | null)[] = [
    ...Array(startBlankDays).fill(null),
    ...Array.from({ length: totalDays }, (_, i) => i + 1),
  ];

  // Map platform to its branding color scheme and peak performance hours
  const getPlatformPeakHour = (platform: SocialPlatform) => {
    switch (platform) {
      case 'Instagram': return '11:00 AM';
      case 'TikTok': return '6:30 PM';
      case 'LinkedIn': return '8:45 AM';
      case 'Facebook': return '3:00 PM';
      default: return '10:00 AM';
    }
  };

  const getPlatformColors = (platform: SocialPlatform) => {
    switch (platform) {
      case 'Instagram':
        return {
          bg: 'bg-rose-50 border-rose-200 text-rose-700',
          indicator: 'bg-rose-500',
          text: 'text-rose-600'
        };
      case 'TikTok':
        return {
          bg: 'bg-teal-50 border-teal-200 text-teal-700',
          indicator: 'bg-teal-500',
          text: 'text-teal-600'
        };
      case 'LinkedIn':
        return {
          bg: 'bg-sky-50 border-sky-200 text-sky-700',
          indicator: 'bg-sky-500',
          text: 'text-sky-600'
        };
      case 'Facebook':
        return {
          bg: 'bg-blue-50 border-blue-200 text-blue-700',
          indicator: 'bg-blue-600',
          text: 'text-blue-600'
        };
    }
  };

  // Drag and Drop Event Handlers
  const handleDragStart = (e: React.DragEvent, postId: string) => {
    setDraggedPostId(postId);
    e.dataTransfer.setData("text/plain", postId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, dayNum: number) => {
    e.preventDefault();
    setDragOverDay(dayNum);
  };

  const handleDragLeave = () => {
    setDragOverDay(null);
  };

  const handleDrop = async (e: React.DragEvent, targetDay: number) => {
    e.preventDefault();
    setDragOverDay(null);
    const postId = e.dataTransfer.getData("text/plain") || draggedPostId;
    if (!postId) return;

    const post = posts.find(p => p.id === postId);
    if (!post) return;

    // Compose ISO timestamp at the platform's peak local hour.
    const peakHour = getPlatformPeakHour(post.platform);
    const peakMatch = peakHour.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
    let hours = 12;
    let minutes = 0;
    if (peakMatch) {
      hours = parseInt(peakMatch[1], 10);
      minutes = parseInt(peakMatch[2], 10);
      if (peakMatch[3].toUpperCase() === 'PM' && hours < 12) hours += 12;
      if (peakMatch[3].toUpperCase() === 'AM' && hours === 12) hours = 0;
    }
    const scheduled = new Date(viewYear, viewMonth - 1, targetDay, hours, minutes, 0, 0);
    await onReschedule(postId, toIso(scheduled));
    setDraggedPostId(null);
  };

  const shiftMonth = (delta: number) => {
    const next = new Date(viewYear, viewMonth - 1 + delta, 1);
    setViewYear(next.getFullYear());
    setViewMonth(next.getMonth() + 1);
  };

  // Status pills
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'Posted':
        return <span className="px-1.5 py-0.5 bg-emerald-500 text-white rounded text-[8px] font-bold uppercase tracking-wider font-mono">POSTED</span>;
      default:
        return <span className="px-1.5 py-0.5 bg-indigo-500 text-white rounded text-[8px] font-bold uppercase tracking-wider font-mono">QUEUED</span>;
    }
  };

  return (
    <div className="space-y-6" id="visual-content-calendar-main">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-sm font-bold text-slate-900">Autopilot Social Content Calendar</h2>
          <p className="text-slate-500 text-xs">Visualize, queue, and coordinate split-seconds engagement. Drag card panels directly across grid cells to reschedule slots.</p>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Month selector navigation controls */}
          <div className="flex items-center bg-slate-100 border border-slate-200 rounded-lg p-0.5">
            <button 
              onClick={() => shiftMonth(-1)}
              className="p-1 px-2.5 rounded-md text-xs font-semibold hover:bg-white text-slate-700 hover:shadow-xs transition duration-150 flex items-center gap-1"
              title="Previous month"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span className="text-[10px]">Prev</span>
            </button>
            <div className="px-3.5 text-xs text-slate-800 font-bold min-w-[110px] text-center font-sans tracking-wide">
              {monthName}
            </div>
            <button 
              onClick={() => shiftMonth(1)}
              className="p-1 px-2.5 rounded-md text-xs font-semibold hover:bg-white text-slate-700 hover:shadow-xs transition duration-150 flex items-center gap-1"
              title="Next month"
            >
              <span className="text-[10px]">Next</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <button 
            onClick={onPlanCampaignClick}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition duration-200 shadow-sm flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Campaign</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: 4 SPOTS / THE POST QUEUE pool of items */}
        <div className="xl:col-span-3 bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-indigo-500" />
              <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Posts Library Queue</h3>
            </div>
            <span className="px-2 py-0.5 bg-slate-100 border border-slate-200 text-slate-500 font-mono text-[9px] rounded font-bold">
              {posts.length} Total
            </span>
          </div>

          <p className="text-[11px] text-slate-400 font-sans leading-normal">
            Drag any card here onto a calendar grid checkmark slot to schedule it. Or grab from scheduled dates and drop elsewhere to shift.
          </p>

          <div className="space-y-3.5 max-h-[580px] overflow-y-auto pr-1">
            {posts.map((post) => {
              const dateInfo = getPostDateInfo(post);
              const pillColors = getPlatformColors(post.platform);
              const isScheduledInCurrentMonth =
                dateInfo?.year === viewYear && dateInfo?.month === viewMonth;

              return (
                <div 
                  key={post.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, post.id)}
                  onClick={() => setActivePreviewPost(post)}
                  className={`bg-slate-50 hover:bg-white border rounded-xl p-3 transition-all cursor-grab active:cursor-grabbing hover:border-slate-300 hover:shadow-sm relative group`}
                  id={`draggable-sidebar-post-${post.id}`}
                >
                  <div className="flex items-start justify-between gap-2.5 mb-1.5">
                    <span className={`px-2 py-0.5 rounded text-[9px] uppercase font-bold border ${pillColors.bg}`}>
                      {post.platform} {post.platform !== 'Instagram' && <span className="text-[7.5px] lowercase font-semibold opacity-75">(simulated)</span>}
                    </span>
                    {renderStatusBadge(post.status)}
                  </div>

                  <h4 className="font-bold text-slate-800 text-xs truncate max-w-full leading-snug group-hover:text-indigo-600 transition">
                    {post.title}
                  </h4>

                  <p className="text-[10px] text-slate-500 line-clamp-2 italic mb-2 pt-0.5">
                    "{post.caption || 'No caption'}"
                  </p>

                  <div className="flex items-center justify-between text-[9px] text-slate-400 font-mono border-t border-slate-100/60 pt-2">
                    <span className="flex items-center gap-1 truncate max-w-[120px]">
                      <Clock className="w-3" />
                      <span className="truncate">
                        {(() => {
                          const parsed = parseScheduleTime(post.scheduledTime);
                          return parsed ? formatDisplay(parsed.date) : post.scheduledTime;
                        })()}
                      </span>
                    </span>
                    {post.viralScore && (
                      <span className="font-bold text-indigo-600 leading-none">
                        Forecast: {post.viralScore}/100
                      </span>
                    )}
                  </div>

                  {/* Aesthetic visual image thumbnail indicators */}
                  {post.mediaUrl && (
                    <div className="mt-2 w-full h-11 rounded overflow-hidden border border-slate-100/80 relative">
                      <img 
                        src={post.mediaUrl} 
                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition" 
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = "https://images.unsplash.com/photo-1540962351504-03099e0a754b?auto=format&fit=crop&w=800&q=80";
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 text-white flex items-center justify-end px-2 p-1">
                        <Eye className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition" />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {posts.length === 0 && (
              <div className="text-center py-10 border border-dashed border-slate-200 rounded-xl bg-slate-50 text-slate-400">
                <p className="text-xs">Posts stack is empty.</p>
                <p className="text-[10px] text-slate-400 mt-1">Please configure active campaigns.</p>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: CALENDAR GRID */}
        <div className="xl:col-span-9 bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
          {/* Days of the week header block */}
          <div className="grid grid-cols-7 gap-1.5 text-center">
            {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day) => (
              <div key={day} className="py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono bg-slate-50 border border-slate-100 rounded-md">
                <span className="hidden sm:inline">{day}</span>
                <span className="sm:hidden">{day.slice(0, 3)}</span>
              </div>
            ))}
          </div>

          {/* Core calendar cellular grid */}
          <div className="grid grid-cols-7 gap-1.5" id="calendar-grid-cells">
            {calendarCells.map((day, idx) => {
              if (day === null) {
                return (
                  <div 
                    key={`blank-${idx}`}
                    className="min-h-[110px] bg-slate-50/30 rounded-lg border border-dashed border-slate-100 opacity-30 select-none pointer-events-none"
                  />
                );
              }

              const isToday =
                viewYear === today.getFullYear() &&
                viewMonth === today.getMonth() + 1 &&
                day === today.getDate();
              const postsForThisDay = getPostsForDay(day);
              const isDragOver = dragOverDay === day;

              return (
                <div
                  key={`day-${day}`}
                  onDragOver={(e) => handleDragOver(e, day)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, day)}
                  onMouseEnter={() => setHoveredDay(day)}
                  onMouseLeave={() => setHoveredDay(null)}
                  className={`min-h-[115px] rounded-lg border p-1.5 flex flex-col justify-between transition-all relative ${
                    isToday 
                      ? 'bg-slate-50 border-indigo-500 shadow-sm ring-1 ring-indigo-200 shadow-indigo-100' 
                      : isDragOver
                      ? 'bg-indigo-50 border-dashed border-indigo-600 scale-[1.01] ring-2 ring-indigo-100 z-10'
                      : 'bg-white border-slate-200 hover:border-slate-350'
                  }`}
                >
                  {/* Top cell details indicator */}
                  <div className="flex justify-between items-center mb-1">
                    <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                      isToday 
                        ? 'bg-indigo-600 text-white font-serif' 
                        : 'text-slate-500 bg-slate-100'
                    }`}>
                      {day}
                    </span>
                    
                    {isToday && (
                      <span className="text-[8px] tracking-widest text-indigo-700 font-bold uppercase font-mono">Today</span>
                    )}

                    {postsForThisDay.length > 0 && (
                      <span className="text-[9px] bg-slate-100 text-slate-600 px-1 py-0.5 rounded-full font-bold">
                        {postsForThisDay.length}p
                      </span>
                    )}
                  </div>

                  {/* Render post items in cellular space */}
                  <div className="flex-1 space-y-1 overflow-y-auto max-h-[85px] no-scrollbar">
                    {postsForThisDay.map((post) => {
                      const colors = getPlatformColors(post.platform);
                      const isPosted = post.status === 'Posted';

                      return (
                        <div
                          key={post.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, post.id)}
                          onClick={(e) => {
                            e.stopPropagation();
                            setActivePreviewPost(post);
                          }}
                          className={`p-1 rounded text-[9.5px] cursor-grab active:cursor-grabbing border ${colors.bg} ${
                            isPosted ? 'line-through opacity-70' : 'font-medium'
                          } hover:shadow-xs truncate transition relative group/item flex items-center gap-1`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${colors.indicator}`} />
                          <span className="truncate flex-1" title={post.title}>
                            {post.title}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Drop indication target text on hover empty cells to highlight utility */}
                  {hoveredDay === day && postsForThisDay.length === 0 && (
                    <div className="absolute inset-x-0 bottom-1 flex justify-center text-[8px] text-slate-300 font-mono tracking-wide pointer-events-none uppercase">
                      Drop here
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Quick interactive parameters guide legend */}
          <div className="bg-slate-50 border border-slate-200/80 p-4 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-3 text-xs pt-3 text-slate-600">
            <div className="flex items-center gap-4 flex-wrap">
              <span className="font-bold text-slate-700 uppercase font-mono text-[10px]">Platforms:</span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                <span>Instagram (11:00 AM)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-teal-500" />
                <span>TikTok (6:30 PM - Simulated)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-sky-500" />
                <span>LinkedIn (8:45 AM - Simulated)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-600" />
                <span>Facebook (3:00 PM - Simulated)</span>
              </span>
            </div>
            
            <div className="font-mono text-[10px] text-indigo-600 flex items-center gap-1 animate-pulse">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              <span>Smart Hour optimizer applied</span>
            </div>
          </div>
        </div>
      </div>

      {/* POPUP: Preview of clicked element sandbox details */}
      {activePreviewPost && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4" id="calendar-post-modal">
          <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden border border-slate-200 shadow-xl flex flex-col">
            <div className={`p-4 text-white flex items-center justify-between ${
              activePreviewPost.platform === 'Instagram' ? 'bg-gradient-to-r from-rose-500 to-pink-600' :
              activePreviewPost.platform === 'TikTok' ? 'bg-slate-900' :
              activePreviewPost.platform === 'LinkedIn' ? 'bg-indigo-800' : 'bg-blue-600'
            }`}>
              <div className="flex items-center gap-2">
                <span className="text-[10px] bg-white/20 border border-white/20 px-2 py-0.5 rounded-full font-bold uppercase font-mono tracking-widest text-white">
                  {activePreviewPost.platform} {activePreviewPost.platform !== 'Instagram' && '(Simulated)'}
                </span>
                <span className="text-xs text-white/80 font-mono">
                  {activePreviewPost.status} • Score: {activePreviewPost.viralScore}/100
                </span>
              </div>
              <button 
                onClick={() => setActivePreviewPost(null)}
                className="text-white hover:text-slate-200 text-lg font-bold leading-none"
              >&times;</button>
            </div>

            <div className="p-6 space-y-4 overflow-y-auto max-h-[500px]">
              <div>
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block font-mono">Post Title</h4>
                <div className="font-bold text-slate-800 text-sm">{activePreviewPost.title}</div>
              </div>

              <div>
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block font-mono">Scheduled Time</h4>
                <div className="text-xs text-indigo-600 font-bold flex items-center gap-1 mt-0.5 font-mono">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{activePreviewPost.scheduledTime}</span>
                </div>
              </div>

              {activePreviewPost.mediaUrl && (
                <div>
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block font-mono mb-1">Visual Asset Preview</h4>
                  <div className="w-full h-44 rounded-xl overflow-hidden border border-slate-200">
                    <img 
                      src={activePreviewPost.mediaUrl} 
                      className="w-full h-full object-cover" 
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = "https://images.unsplash.com/photo-1540962351504-03099e0a754b?auto=format&fit=crop&w=800&q=80";
                      }}
                    />
                  </div>
                </div>
              )}

              <div>
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block font-mono mb-1">Interactive Caption Output</h4>
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-xs leading-relaxed text-slate-700 font-sans whitespace-pre-wrap select-text">
                  {activePreviewPost.caption || 'No caption text.'}
                </div>
              </div>

              {activePreviewPost.viralFeedback && (
                <div className="bg-indigo-50 border border-indigo-150 rounded-xl p-3 text-[11px] text-indigo-900 italic">
                  <strong>AI Audit Insight:</strong> {activePreviewPost.viralFeedback}
                </div>
              )}
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center gap-2 justify-between">
              <button
                onClick={() => {
                  onDelete(activePreviewPost.id);
                  setActivePreviewPost(null);
                }}
                className="flex items-center gap-1.5 text-xs text-red-600 hover:text-red-700 font-bold px-3 py-1.5 rounded-lg transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Post</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActivePreviewPost(null)}
                  className="bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold px-4 py-2 rounded-lg transition"
                >
                  Close
                </button>

                {activePreviewPost.status !== 'Posted' && (
                  <button
                    onClick={() => {
                      onPublish(activePreviewPost.id);
                      setActivePreviewPost(null);
                    }}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2 rounded-lg shadow-sm transition flex items-center gap-1"
                  >
                    <Globe className="w-3.5 h-3.5 text-indigo-200" />
                    <span>Publish Instantly</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
