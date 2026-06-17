import React, { useState, useEffect } from 'react';
import { Palette, ImageIcon, Video as VideoIcon, Search, Upload, RefreshCw, ArrowRight, Download, History, Trash2, Settings2, Sparkles, Wand2 } from 'lucide-react';

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
  
  // Local state for the simplified UX
  const [userConcept, setUserConcept] = useState('');
  const [visualStyle, setVisualStyle] = useState('Cinemático Comercial');
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Sync back to studioPrompt magically
  useEffect(() => {
    if (!userConcept.trim()) {
      setStudioPrompt('');
      return;
    }
    const qualityModifiers = "8k resolution, premium quality, masterpiece, highly detailed";
    const finalPrompt = `${userConcept}. Estilo visual: ${visualStyle}. ${qualityModifiers}`;
    setStudioPrompt(finalPrompt);
  }, [userConcept, visualStyle, setStudioPrompt]);

  return (
    <div className="space-y-6 animate-fadeIn" id="ai-studio-tab">
      {/* Premium Top Bar announcement */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-8 relative overflow-hidden border border-indigo-900/50 shadow-xl">
        <div className="absolute top-0 right-0 p-8 opacity-20 pointer-events-none transform translate-x-12 -translate-y-6">
          <Wand2 className="w-64 h-64 text-indigo-400" />
        </div>
        <div className="max-w-2xl relative z-10 space-y-3">
          <span className="text-xs uppercase font-black tracking-widest text-emerald-400 bg-emerald-950/60 px-3 py-1.5 rounded-full border border-emerald-900/60 inline-flex items-center gap-1.5">
            <Sparkles className="w-3 h-3" />
            Creación Mágica
          </span>
          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">Creative Studio</h1>
          <p className="text-slate-300 text-sm leading-relaxed max-w-xl">
            Describe lo que imaginas y nuestra IA generará el contenido visual perfecto para tus redes sociales. Nosotros nos encargamos de las configuraciones técnicas.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Controls column */}
        <div className="lg:col-span-5 space-y-8">
          
          {/* 1. Objective / Format */}
          <div className="space-y-3">
            <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <span className="bg-indigo-100 text-indigo-700 w-6 h-6 rounded-full flex items-center justify-center text-xs">1</span>
              ¿Qué formato necesitas?
            </h2>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setStudioFormat('image')}
                className={`p-4 rounded-2xl text-left transition flex items-center gap-4 cursor-pointer ${
                  studioFormat === 'image'
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
                    : 'bg-white border border-slate-200 hover:border-indigo-300 text-slate-700'
                }`}
              >
                <div className={`p-2.5 rounded-xl ${studioFormat === 'image' ? 'bg-white/20' : 'bg-slate-100'}`}>
                  <ImageIcon className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-bold leading-tight">Post Estático</div>
                  <div className={`text-xs ${studioFormat === 'image' ? 'text-indigo-100' : 'text-slate-600'}`}>Imagen publicitaria</div>
                </div>
              </button>

              <button
                onClick={() => setStudioFormat('video')}
                className={`p-4 rounded-2xl text-left transition flex items-center gap-4 cursor-pointer ${
                  studioFormat === 'video'
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
                    : 'bg-white border border-slate-200 hover:border-indigo-300 text-slate-700'
                }`}
              >
                <div className={`p-2.5 rounded-xl ${studioFormat === 'video' ? 'bg-white/20' : 'bg-slate-100'}`}>
                  <VideoIcon className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-bold leading-tight">Video Corto</div>
                  <div className={`text-xs ${studioFormat === 'video' ? 'text-indigo-100' : 'text-slate-600'}`}>Reels, TikTok, Shorts</div>
                </div>
              </button>
            </div>
          </div>

          {/* 2. Platform / Aspect Ratio */}
          <div className="space-y-3">
            <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <span className="bg-indigo-100 text-indigo-700 w-6 h-6 rounded-full flex items-center justify-center text-xs">2</span>
              Destino principal
            </h2>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: '1:1', name: 'Feed / Cuadrado', icon: '■' },
                { id: '9:16', name: 'Reel / Story', icon: '▯' },
                { id: '16:9', name: 'YouTube / Web', icon: '▭' }
              ].map(ratio => (
                <button
                  key={ratio.id}
                  onClick={() => setStudioAspectRatio(ratio.id)}
                  className={`py-3 px-2 rounded-xl text-center transition flex flex-col items-center gap-1.5 cursor-pointer ${
                    studioAspectRatio === ratio.id
                      ? 'bg-slate-900 text-white shadow-md'
                      : 'bg-white border border-slate-200 hover:border-slate-400 text-slate-600'
                  }`}
                >
                  <span className="text-lg font-mono leading-none opacity-80">{ratio.icon}</span>
                  <span className="text-xs font-bold">{ratio.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 3. Concept / Prompt */}
          <div className="space-y-3 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-2">
              <span className="bg-indigo-100 text-indigo-700 w-6 h-6 rounded-full flex items-center justify-center text-xs">3</span>
              ¿Qué imaginaste hoy?
            </h2>
            <textarea
              rows={3}
              value={userConcept}
              onChange={(e) => setUserConcept(e.target.value)}
              placeholder="Ej. Un zapato deportivo levitando sobre agua cristalina en una playa tropical..."
              className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl p-4 outline-none font-medium text-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition resize-none"
            />
            
            <div className="pt-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Estilo Visual Mágico</label>
              <div className="flex flex-wrap gap-2">
                {['Cinemático Comercial', 'Realista / Fotográfico', 'Minimalista Moderno', 'Animación 3D'].map(style => (
                  <button
                    key={style}
                    onClick={() => setVisualStyle(style)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                      visualStyle === style 
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                        : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSynthesizeCreative}
            disabled={studioGenerating || !userConcept.trim()}
            className="w-full bg-gradient-to-r from-indigo-600 to-indigo-800 hover:from-indigo-700 hover:to-indigo-900 text-white font-bold py-4 rounded-2xl text-sm shadow-xl shadow-indigo-200 transition disabled:opacity-50 disabled:shadow-none flex items-center justify-center gap-2 cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
          >
            {studioGenerating ? (
              <>
                <RefreshCw className="animate-spin w-5 h-5 text-indigo-200" />
                <span>{studioStatusText || 'Creando magia visual...'}</span>
              </>
            ) : (
              <>
                <Wand2 className="w-5 h-5 text-indigo-200 animate-pulse" />
                <span>Generar {studioFormat === 'image' ? 'Imagen' : 'Video'} Mágico</span>
              </>
            )}
          </button>

          {/* Expert Mode Toggle */}
          <div className="pt-4 flex justify-center">
            <button 
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-xs font-bold text-slate-500 hover:text-slate-600 flex items-center gap-1 cursor-pointer transition"
            >
              <Settings2 className="w-3.5 h-3.5" />
              {showAdvanced ? 'Ocultar Modo Experto' : 'Mostrar Modo Experto'}
            </button>
          </div>

          {/* Advanced Settings (Hidden by default) */}
          {showAdvanced && (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4 animate-fadeIn">
              <h3 className="text-sm font-black text-slate-600 uppercase tracking-widest border-b border-slate-200 pb-2 mb-4">Parámetros Técnicos (Modo Experto)</h3>
              
              {studioFormat === 'image' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block">Resolución de Salida</label>
                    <select
                      value={studioSize}
                      onChange={(e) => setStudioSize(e.target.value)}
                      className="w-full text-xs bg-white border border-slate-200 rounded-lg p-2 outline-none font-semibold text-slate-700"
                    >
                      <option value="512px">512px (Borrador)</option>
                      <option value="1K">1K (Estándar)</option>
                      <option value="2K">2K (Profesional)</option>
                      <option value="4K">4K (Ultra HD)</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block">Búsqueda Web (Grounding)</label>
                    <div className="flex items-center gap-2 pt-1.5">
                      <input
                        type="checkbox"
                        checked={studioEnableGrounding}
                        onChange={(e) => setStudioEnableGrounding(e.target.checked)}
                        className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
                      />
                      <span className="text-xs text-slate-600 font-semibold">Incrustar contexto en vivo</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block">Modelo de Motor Veo</label>
                    <select
                      value={studioVideoModel}
                      onChange={(e) => setStudioVideoModel(e.target.value)}
                      className="w-full text-xs bg-white border border-slate-200 rounded-lg p-2 outline-none font-semibold text-slate-700"
                    >
                      <option value="veo-3.1-lite-generate-preview">Veo 3.1 Lite (Rápido)</option>
                      <option value="veo-3.1-generate-preview">Veo 3.1 Pro (Cinemático)</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block">Duración</label>
                    <select
                      value={studioVideoDuration}
                      onChange={(e) => setStudioVideoDuration(Number(e.target.value))}
                      className="w-full text-xs bg-white border border-slate-200 rounded-lg p-2 outline-none font-semibold text-slate-700"
                    >
                      <option value="5">5 Segundos</option>
                      <option value="10">10 Segundos</option>
                      <option value="30">30 Segundos</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Right Interactive Player / Viewer column */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Generated asset preview container */}
          <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm flex flex-col justify-between h-[520px]">
            <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-xs font-bold text-slate-800 uppercase tracking-widest font-mono">Lienzo en Vivo</span>
              </div>
              {studioGeneratedUrl && (
                <span className="text-[9px] font-bold text-slate-600 font-mono bg-white border border-slate-200 px-2 py-1 rounded-md uppercase">
                  {studioFormat === 'image' ? 'Imagen HD' : 'Video MP4'}
                </span>
              )}
            </div>

            {/* Viewport block */}
            <div className="flex-1 bg-slate-100 flex items-center justify-center p-4 relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none"></div>
              
              {studioGenerating ? (
                <div className="text-center space-y-5 max-w-sm relative z-10">
                  <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-20 text-indigo-500"></span>
                    <div className="animate-spin w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full shadow-lg" />
                    <Wand2 className="w-5 h-5 text-indigo-600 absolute" />
                  </div>
                  <div className="space-y-2 bg-white/80 backdrop-blur-sm p-4 rounded-2xl shadow-sm border border-slate-100">
                    <p className="text-sm font-black text-indigo-900 animate-pulse">
                      {studioStatusText || "Sintetizando imagen..."}
                    </p>
                    <p className="text-sm text-slate-600 font-medium leading-relaxed">
                      La IA está esculpiendo los píxeles basados en tus ideas. Esto puede tomar unos segundos.
                    </p>
                  </div>
                </div>
              ) : studioGeneratedUrl ? (
                <div className="w-full h-full flex items-center justify-center rounded-xl p-2 relative z-10">
                  {studioFormat === 'image' ? (
                    <img
                      src={studioGeneratedUrl}
                      alt="Generated Masterpiece"
                      referrerPolicy="no-referrer"
                      className="max-w-full max-h-full object-contain shadow-2xl rounded-lg ring-1 ring-slate-900/10"
                    />
                  ) : (
                    <video
                      src={studioGeneratedUrl}
                      controls
                      autoPlay
                      loop
                      className="max-w-full max-h-full object-contain rounded-lg shadow-2xl ring-1 ring-slate-900/10"
                    />
                  )}
                </div>
              ) : (
                <div className="text-center space-y-3 max-w-xs relative z-10 bg-white/60 backdrop-blur-md p-8 rounded-3xl border border-white/50 shadow-sm">
                  <div className="bg-indigo-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Palette className="w-8 h-8 text-indigo-400 stroke-1" />
                  </div>
                  <p className="text-sm font-bold text-slate-700">El lienzo está vacío</p>
                  <p className="text-xs text-slate-600 text-center leading-relaxed">
                    Describe tu visión a la izquierda y presiona Generar para ver la magia suceder.
                  </p>
                </div>
              )}
            </div>

            {/* Asset actions footer */}
            {studioGeneratedUrl && !studioGenerating && (
              <div className="p-5 border-t border-slate-100 bg-white flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => {
                    setAiGeneratedUrl(studioGeneratedUrl);
                    setCreatorFormat(studioFormat === 'image' ? 'Image' : 'Video');
                    if (userConcept) {
                      setCreatorVisualPrompt(userConcept);
                    }
                    setActiveTab('publisher');
                  }}
                  className="flex-1 bg-slate-900 hover:bg-black text-white font-bold py-3 px-5 rounded-xl text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <ArrowRight className="w-4 h-4 text-emerald-400" />
                  <span>Usar en Publicación</span>
                </button>

                <div className="flex gap-2">
                  <a
                    href={studioGeneratedUrl}
                    download={`socialflow-${studioFormat === 'image' ? 'image.png' : 'video.mp4'}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 p-3 rounded-xl text-xs transition flex items-center justify-center font-bold gap-2 cursor-pointer border border-indigo-100"
                  >
                    <Download className="w-4 h-4" />
                    <span className="sm:inline hidden">Descargar HD</span>
                  </a>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>

      {/* SAVED MASTERPIECES SHOWCASE */}
      {studioSavedMedia.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-5">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
            <History className="w-5 h-5 text-indigo-500" />
            <h3 className="text-sm font-black text-slate-800 tracking-wide">Historial de Creaciones</h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {studioSavedMedia.map((media) => (
              <div key={media.id} className="group relative border border-slate-200/60 rounded-2xl overflow-hidden bg-slate-50 flex flex-col justify-between h-48 shadow-sm hover:shadow-md transition duration-300">
                
                {/* Header badge */}
                <div className="absolute top-2 left-2 z-20">
                  <span className={`text-[9px] font-bold px-2 py-1 rounded-md text-white shadow-sm ${
                    media.type === 'image' ? 'bg-indigo-500/90' : 'bg-emerald-500/90'
                  }`}>
                    {media.type === 'image' ? 'Imagen' : 'Video'}
                  </span>
                </div>

                {/* Preview */}
                <div className="flex-1 overflow-hidden flex items-center justify-center relative bg-slate-200">
                  {media.type === 'image' ? (
                    <img
                      src={media.url}
                      alt="Thumbnail"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white relative">
                      <video src={media.url} muted className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                        <VideoIcon className="w-6 h-6 text-white drop-shadow-md" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Overlay text detail or action bar */}
                <div className="p-3 bg-white flex items-center justify-between z-10">
                  <div className="truncate pr-3 cursor-pointer flex-1" onClick={() => {
                    setStudioGeneratedUrl(media.url);
                    setStudioFormat(media.type);
                    setStudioPrompt(media.prompt);
                    setStudioAspectRatio(media.aspectRatio || '1:1');
                    setStudioLastOperationName(media.operationName || null);
                  }} title="Cargar en Lienzo">
                    <span className="text-xs font-bold text-slate-800 block truncate">
                      {media.prompt}
                    </span>
                  </div>
                  
                  <button
                    onClick={() => {
                      setAiGeneratedUrl(media.url);
                      setCreatorFormat(media.type === 'image' ? 'Image' : 'Video');
                      setCreatorVisualPrompt(media.prompt);
                      setActiveTab('publisher');
                    }}
                    className="bg-indigo-50 hover:bg-indigo-100 p-1.5 rounded-lg text-indigo-700 transition cursor-pointer"
                    title="Usar en publicación"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Delete button */}
                <button
                  onClick={() => {
                    if (confirm("¿Eliminar este asset visual del historial?")) {
                      const updated = studioSavedMedia.filter(m => m.id !== media.id);
                      setStudioSavedMedia(updated);
                      localStorage.setItem('social_flow_studio_media', JSON.stringify(updated));
                    }
                  }}
                  className="absolute top-2 right-2 p-1.5 bg-white/90 hover:bg-red-50 hover:text-red-600 text-slate-600 rounded-lg shadow-sm transition duration-200 opacity-0 group-hover:opacity-100 z-30 cursor-pointer"
                  title="Eliminar"
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
