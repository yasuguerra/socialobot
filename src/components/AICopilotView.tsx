import React from 'react';
import { Sparkles, RefreshCw, Send, Sparkle, Globe, Trash2, Image as ImageIcon } from 'lucide-react';
import { SocialPost } from '../types';

interface AICopilotViewProps {
  agentMessages: any[];
  agentInput: string;
  setAgentInput: (val: string) => void;
  loadingAgent: boolean;
  handleSendSuggestedMsg: (msg: string) => void;
  handleSendAgentMsg: () => void;
  captionDraft: string;
  setCaptionDraft: (val: string) => void;
  activeCreatedPost: SocialPost | null;
  setActiveCreatedPost: React.Dispatch<React.SetStateAction<SocialPost | null>>;
  referenceImageUrl: string | null;
  setReferenceImageUrl: (val: string | null) => void;
  imagePreview: string | null;
  setImagePreview: (val: string | null) => void;
  creatorFormat: 'Image' | 'Video' | 'Text' | 'Carousel';
  creatorPlatform: 'Instagram' | 'Facebook' | 'TikTok' | 'LinkedIn';
  setCreatorPlatform: (val: 'Instagram' | 'Facebook' | 'TikTok' | 'LinkedIn') => void;
  scheduledDraftTime: string;
  setScheduledDraftTime: (val: string) => void;
  publishingPostId: string | null;
  handlePublishPostNow: (postId: string) => Promise<void>;
  handleSchedulePost: (postId: string, timeStr: string) => Promise<void>;
  handleDeletePost: (postId: string) => void;
  setActiveTab: (tab: string) => void;
  creatorTitle: string;
  setPosts: React.Dispatch<React.SetStateAction<SocialPost[]>>;
  apiFetch: (url: string, options?: any) => Promise<any>;
}

export default function AICopilotView({
  agentMessages,
  agentInput,
  setAgentInput,
  loadingAgent,
  handleSendSuggestedMsg,
  handleSendAgentMsg,
  captionDraft,
  setCaptionDraft,
  activeCreatedPost,
  setActiveCreatedPost,
  referenceImageUrl,
  setReferenceImageUrl,
  imagePreview,
  setImagePreview,
  creatorFormat,
  creatorPlatform,
  setCreatorPlatform,
  scheduledDraftTime,
  setScheduledDraftTime,
  publishingPostId,
  handlePublishPostNow,
  handleSchedulePost,
  handleDeletePost,
  setActiveTab,
  creatorTitle,
  setPosts,
  apiFetch
}: AICopilotViewProps) {

  const handleCreateManualDraft = () => {
    const newPost: SocialPost = {
      id: `draft-${Date.now()}`,
      platform: 'Instagram',
      title: 'Nuevo Borrador',
      caption: '',
      mediaType: 'image',
      status: 'Draft',
      viralScore: 80,
      scheduledTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    };
    setActiveCreatedPost(newPost);
  };

  const [localPublishingPostId, setLocalPublishingPostId] = React.useState<string | null>(null);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 h-[800px]" id="copilot-workspace-wrapper">
      <div className="xl:col-span-7 bg-white border border-slate-200 rounded-2xl shadow-sm p-5 flex flex-col h-full relative" id="ai-copilot-chat-panel">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center font-black text-white text-xl shadow-md shadow-indigo-600/10">
              🤖
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900">Tu Copiloto de Social Media</h3>
              <p className="text-[10px] text-slate-500 font-mono">Gemini 3.5 Flash Activo & Conectado</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
            </span>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider font-mono">En Línea</span>
          </div>
        </div>

        <div className="py-3 border-b border-slate-100 flex gap-2 overflow-x-auto shrink-0 scrollbar-none">
          <button 
            onClick={() => handleSendSuggestedMsg("Sugiéreme un hilo de 3 historias de Instagram muy dinámicas e interesantes sobre mi empresa de hoy.")}
            className="shrink-0 bg-slate-50 hover:bg-slate-100 text-slate-700 text-[11px] font-semibold px-3 py-1.5 rounded-lg border border-slate-200/60 transition cursor-pointer"
          >
            📱 Sugerir Historias
          </button>
          <button 
            onClick={() => handleSendSuggestedMsg("Dame una idea viral para un Reel de Instagram con un buen gancho, descripción y recomendación visual.")}
            className="shrink-0 bg-slate-50 hover:bg-slate-100 text-slate-700 text-[11px] font-semibold px-3 py-1.5 rounded-lg border border-slate-200/60 transition cursor-pointer"
          >
            🎥 Sugerir un Reel
          </button>
          <button 
            onClick={() => handleSendSuggestedMsg("Crea una propuesta de carrusel educativo para mi cuenta sobre nuestros productos estrella.")}
            className="shrink-0 bg-slate-50 hover:bg-slate-100 text-slate-700 text-[11px] font-semibold px-3 py-1.5 rounded-lg border border-slate-200/60 transition cursor-pointer"
          >
            📊 Sugerir Carrusel
          </button>
          <button 
            onClick={() => handleSendSuggestedMsg("Escribe un post estándar con hashtags optimizados y una llamada a la acción irresistible.")}
            className="shrink-0 bg-slate-50 hover:bg-slate-100 text-slate-700 text-[11px] font-semibold px-3 py-1.5 rounded-lg border border-slate-200/60 transition cursor-pointer"
          >
            ✍️ Sugerir Post
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1 scrollbar-thin" id="copilot-chat-history">
          {agentMessages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
              <div className="w-14 h-14 bg-indigo-50 rounded-full flex items-center justify-center shadow-inner">
                <Sparkles className="w-7 h-7 text-indigo-650 animate-pulse" />
              </div>
              <div className="space-y-1.5 max-w-sm">
                <p className="text-sm font-bold text-slate-800">¡Hola! Soy tu asistente de redes sociales</p>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Estoy aquí para facilitarte la gestión de tu cuenta de Instagram. Sube fotos y videos en la biblioteca de medios y pregúntame qué publicar en tus historias, reels o posts estándar.
                </p>
              </div>
              <div className="pt-2 w-full space-y-2 max-w-md">
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Ideas de sugerencias para empezar:</p>
                <button 
                  onClick={() => handleSendSuggestedMsg("Quiero subir algo hoy a mis historias. ¿Qué me sugieres según mi biblioteca de fotos?")}
                  className="w-full text-left p-3 bg-slate-50 hover:bg-slate-150 text-xs rounded-xl border border-slate-200/80 transition truncate block cursor-pointer text-slate-700"
                >
                  💡 "Quiero subir algo hoy a mis historias. ¿Qué me sugieres?"
                </button>
                <button 
                  onClick={() => handleSendSuggestedMsg("Dame un guion rápido para un Reel corto de 15 segundos y sus hashtags correspondientes.")}
                  className="w-full text-left p-3 bg-slate-50 hover:bg-slate-150 text-xs rounded-xl border border-slate-200/80 transition truncate block cursor-pointer text-slate-700"
                >
                  🎬 "Dame un guion rápido para un Reel corto de 15 segundos."
                </button>
              </div>
            </div>
          ) : (
            agentMessages.map((msg, idx) => (
              <div 
                key={idx} 
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <span className="text-[9px] text-slate-400 uppercase tracking-widest font-mono font-bold mb-1 px-1">
                  {msg.sender === 'user' ? 'Tú' : 'Copiloto de IA'}
                </span>
                <div className={`p-3.5 rounded-2xl text-xs leading-relaxed max-w-[90%] ${
                  msg.sender === 'user' 
                    ? 'bg-indigo-600 text-white rounded-tr-none' 
                    : 'bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200/60 shadow-xs'
                }`}>
                  <p className="whitespace-pre-line">{msg.text}</p>
                  
                  {msg.sender === 'agent' && (
                    <div className="mt-3 pt-2.5 border-t border-slate-200/50 flex gap-2 shrink-0">
                      <button
                        onClick={() => {
                          setCaptionDraft(msg.text);
                          if (!activeCreatedPost) {
                            const newPost: SocialPost = {
                              id: `draft-${Date.now()}`,
                              platform: 'Instagram',
                              title: 'Propuesta Copiloto',
                              caption: msg.text,
                              mediaType: 'image',
                              mediaUrl: referenceImageUrl || 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?auto=format&fit=crop&w=800&q=80',
                              status: 'Draft',
                              viralScore: 85,
                              scheduledTime: new Date(Date.now() + 24*60*60*1000).toISOString()
                            };
                            setActiveCreatedPost(newPost);
                          } else {
                            setActiveCreatedPost(prev => prev ? { ...prev, caption: msg.text } : null);
                          }
                        }}
                        className="bg-indigo-605 hover:bg-indigo-700 text-white text-[10px] font-bold px-2.5 py-1.5 rounded-md transition cursor-pointer"
                      >
                        ✨ Usar como Borrador
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
          {loadingAgent && (
            <div className="flex flex-col items-start">
              <span className="text-[9px] text-slate-400 uppercase tracking-widest font-mono font-bold mb-1 px-1">Copiloto</span>
              <div className="p-3 bg-slate-100 text-slate-500 rounded-2xl rounded-tl-none border border-slate-200/60 flex items-center gap-2 text-xs">
                <RefreshCw className="animate-spin w-3.5 h-3.5 text-indigo-600" />
                <span>El copiloto está pensando la mejor estrategia...</span>
              </div>
            </div>
          )}
        </div>

        <div className="pt-3 border-t border-slate-100 mt-auto shrink-0">
          <div className="flex gap-2">
            <input
              type="text"
              value={agentInput}
              onChange={(e) => setAgentInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendAgentMsg()}
              disabled={loadingAgent}
              placeholder="Pregúntale a tu copiloto de IA (ej: 'Sugiéreme algo para historias hoy')..."
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 placeholder-slate-450 outline-none focus:bg-white focus:border-indigo-500 transition-all shadow-inner"
            />
            <button
              onClick={handleSendAgentMsg}
              disabled={loadingAgent || !agentInput.trim()}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition disabled:opacity-40 flex items-center justify-center shrink-0 cursor-pointer shadow-md shadow-indigo-600/10 hover:scale-[1.02]"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="xl:col-span-5 bg-white border border-slate-200 rounded-2xl shadow-sm p-5 flex flex-col h-full relative" id="active-draft-panel">
        
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 shrink-0">
          <h3 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
            <Sparkle className="w-4 h-4 text-indigo-600" />
            Borrador de Publicación Activa
          </h3>
          {activeCreatedPost && (
            <button 
              onClick={() => {
                setActiveCreatedPost(null);
                setCaptionDraft('');
                setReferenceImageUrl(null);
                setImagePreview(null);
              }}
              className="text-[10px] text-slate-400 hover:text-red-500 font-bold transition"
            >
              Limpiar
            </button>
          )}
        </div>

        {activeCreatedPost || referenceImageUrl || imagePreview ? (
          <div className="flex-1 flex flex-col min-h-0 space-y-4 pt-4 overflow-y-auto pr-0.5 scrollbar-thin">
            
            <div className="bg-slate-50 aspect-square w-full relative flex items-center justify-center overflow-hidden border border-slate-200 rounded-xl shrink-0 shadow-sm">
              {referenceImageUrl || imagePreview ? (
                (referenceImageUrl || imagePreview)!.includes('.mp4') || creatorFormat === 'Video' ? (
                  <video 
                    src={referenceImageUrl || imagePreview || ''} 
                    controls 
                    loop 
                    autoPlay 
                    muted 
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <img 
                    src={referenceImageUrl || imagePreview || ''} 
                    className="w-full h-full object-cover" 
                    alt="Visual de borrador" 
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = "https://images.unsplash.com/photo-1540962351504-03099e0a754b?auto=format&fit=crop&w=800&q=80";
                    }}
                  />
                )
              ) : (
                <div className="text-center p-4 text-slate-400">
                  <ImageIcon className="w-8 h-8 mx-auto mb-1 text-slate-300" />
                  <p className="text-xs">Sin imagen o video cargado.</p>
                </div>
              )}
              
              <div className="absolute top-2.5 right-2.5 bg-slate-900/70 backdrop-blur-xs text-white px-2 py-0.5 rounded-full text-[9px] font-bold font-mono tracking-widest uppercase shadow-sm">
                {(activeCreatedPost?.platform || creatorPlatform).toUpperCase()}
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center mb-0.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Texto de la Publicación (Copy)</span>
                <span className="text-[9px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-md font-mono">{captionDraft.length} caracteres</span>
              </div>
              <textarea
                rows={5}
                value={captionDraft}
                onChange={(e) => {
                  setCaptionDraft(e.target.value);
                  if (activeCreatedPost) {
                    setActiveCreatedPost(prev => prev ? { ...prev, caption: e.target.value } : null);
                  }
                }}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 font-sans outline-none leading-relaxed text-slate-800 focus:bg-white focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 transition"
                placeholder="Escribe el copy de tu publicación o cópialo de las sugerencias del chat de la izquierda..."
              />
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono block">¿Dónde lo publicaremos?</span>
              <div className="grid grid-cols-4 gap-1.5">
                {(['Instagram', 'Facebook', 'TikTok', 'LinkedIn'] as const).map((plat) => {
                  const isSelected = (activeCreatedPost?.platform || creatorPlatform) === plat;
                  return (
                    <button
                      key={plat}
                      type="button"
                      onClick={() => {
                        setCreatorPlatform(plat);
                        if (activeCreatedPost) {
                          setActiveCreatedPost(prev => prev ? { ...prev, platform: plat } : null);
                        }
                      }}
                      className={`text-[10px] font-bold py-1.5 rounded-lg border transition text-center shrink-0 cursor-pointer ${
                        isSelected 
                          ? 'bg-indigo-50 border-indigo-300 text-indigo-700 shadow-sm' 
                          : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
                      }`}
                    >
                      {plat}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono block">Hora Sugerida / Programación</span>
              <input
                type="text"
                value={scheduledDraftTime}
                onChange={(e) => setScheduledDraftTime(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-sans outline-none text-slate-850 focus:bg-white focus:border-indigo-450 transition"
                placeholder="ej: Hoy, 6:00 PM o Lunes, 9:00 AM"
              />
            </div>

            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2 pb-2 shrink-0">
              
              <button
                onClick={async () => {
                  let finalPostId = activeCreatedPost?.id;
                  
                  setLocalPublishingPostId(finalPostId || 'pending');
                  try {
                    if (!finalPostId || finalPostId.startsWith('draft-')) {
                      const response = await apiFetch('/api/posts/generate', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          title: creatorTitle || "Publicación Copiloto",
                          platform: activeCreatedPost?.platform || creatorPlatform,
                          format: creatorFormat,
                          customPrompt: captionDraft,
                          themePrompt: captionDraft,
                          referenceMediaUploaded: referenceImageUrl || undefined
                        })
                      });
                      if (response.ok) {
                        const created = await response.json();
                        finalPostId = created.id;
                        setPosts(prev => [created, ...prev]);
                      }
                    }
                    
                    if (finalPostId) {
                      await handlePublishPostNow(finalPostId);
                      alert("¡Publicación enviada exitosamente a Instagram!");
                    } else {
                      alert("No se pudo iniciar el proceso de publicación.");
                    }
                  } catch (err: any) {
                    console.error(err);
                    alert("Fallo al publicar: " + err.message);
                  } finally {
                    setLocalPublishingPostId(null);
                  }
                }}
                disabled={localPublishingPostId !== null}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2.5 rounded-xl shadow-md shadow-indigo-600/10 transition flex items-center justify-center gap-1.5 cursor-pointer hover:scale-[1.01]"
              >
                {localPublishingPostId !== null ? (
                  <>
                    <RefreshCw className="animate-spin w-4 h-4" />
                    <span>Publicando en Instagram...</span>
                  </>
                ) : (
                  <>
                    <Globe className="w-4 h-4 text-emerald-300" />
                    <span>Publicar en Instagram Ahora Mismo</span>
                  </>
                )}
              </button>

              <div className="flex gap-2">
                <button
                  onClick={async () => {
                    let finalPostId = activeCreatedPost?.id;
                    try {
                      if (!finalPostId || finalPostId.startsWith('draft-')) {
                        const response = await apiFetch('/api/posts/generate', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            title: creatorTitle || "Publicación Programada",
                            platform: activeCreatedPost?.platform || creatorPlatform,
                            format: creatorFormat,
                            customPrompt: captionDraft,
                            themePrompt: captionDraft,
                            referenceMediaUploaded: referenceImageUrl || undefined
                          })
                        });
                        if (response.ok) {
                          const created = await response.json();
                          finalPostId = created.id;
                          setPosts(prev => [created, ...prev]);
                        }
                      }
                      
                      if (finalPostId) {
                        await handleSchedulePost(finalPostId, scheduledDraftTime);
                        alert("¡Publicación programada exitosamente en la agenda!");
                        setActiveTab('scheduler'); 
                      } else {
                        alert("No se pudo iniciar el borrador de programación.");
                      }
                    } catch (err: any) {
                      console.error(err);
                      alert("Fallo al programar: " + err.message);
                    }
                  }}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-bold py-2 rounded-xl border border-slate-200/80 transition cursor-pointer text-center"
                >
                  📅 Agendar en mi Calendario
                </button>
                
                <button
                  onClick={() => {
                    if (activeCreatedPost && activeCreatedPost.id) {
                      handleDeletePost(activeCreatedPost.id);
                    }
                    setActiveCreatedPost(null);
                    setCaptionDraft('');
                    setReferenceImageUrl(null);
                    setImagePreview(null);
                  }}
                  className="bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-500 p-2 rounded-xl border border-slate-200 transition cursor-pointer"
                  title="Eliminar Borrador"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-4">
            <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-slate-450 border border-slate-200/60 shadow-inner">
              <ImageIcon className="w-6 h-6 text-slate-350" />
            </div>
            <div className="space-y-1.5 max-w-xs">
              <h4 className="font-bold text-slate-800 text-xs">Sin Borrador Activo</h4>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Selecciona un recurso desde tu <strong>Biblioteca de Medios</strong> o pídele algo al <strong>Copiloto de IA</strong> para empezar a generar contenido increíble con un solo toque.
              </p>
            </div>
            <button
              onClick={handleCreateManualDraft}
              className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold px-4 py-2 rounded-xl border border-indigo-150 transition cursor-pointer shadow-xs"
            >
              + Crear Borrador Vacío
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
