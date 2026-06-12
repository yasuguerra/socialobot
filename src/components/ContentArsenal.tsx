import React, { useState, useRef } from 'react';
import { 
  FolderHeart, 
  Upload, 
  Trash2, 
  Sparkles, 
  Image as ImageIcon, 
  Video as VideoIcon, 
  ArrowUpRight, 
  FileVideo, 
  Loader2, 
  Check, 
  Copy, 
  Search,
  RefreshCw,
  FolderOpen
} from 'lucide-react';
import { ArsenalMediaAsset } from '../types';

interface ContentArsenalProps {
  mediaList: ArsenalMediaAsset[];
  loading: boolean;
  onUpload: (dataUri: string, mimeType: string, filename: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onSelectForPost: (asset: ArsenalMediaAsset) => void;
  onSelectForStudio: (asset: ArsenalMediaAsset) => void;
}

export default function ContentArsenal({
  mediaList,
  loading,
  onUpload,
  onDelete,
  onSelectForPost,
  onSelectForStudio,
}: ContentArsenalProps) {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'image' | 'video'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Formatting helpers
  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  const formatDate = (isoStr: string) => {
    try {
      const d = new Date(isoStr);
      return d.toLocaleDateString(undefined, { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return isoStr;
    }
  };

  // Drag and drop handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await processFiles(e.dataTransfer.files);
    }
  };

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      await processFiles(e.target.files);
    }
  };

  const processFiles = async (files: FileList) => {
    setUploading(true);
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Basic type verification
        const isImage = file.type.startsWith('image/');
        const isVideo = file.type.startsWith('video/');
        if (!isImage && !isVideo) {
          alert(`El archivo ${file.name} no es una imagen ni un video válido.`);
          continue;
        }

        // Limit file size to 100MB
        if (file.size > 100 * 1024 * 1024) {
          alert(`El archivo ${file.name} supera el límite de 100 MB.`);
          continue;
        }

        const dataUri = await fileToDataUri(file);
        await onUpload(dataUri, file.type, file.name);
      }
    } catch (err: any) {
      console.error("Error al procesar subida", err);
      alert("Error al subir el archivo: " + err.message);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const fileToDataUri = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  };

  const handleCopyPrompt = (id: string, prompt: string) => {
    navigator.clipboard.writeText(prompt);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Filter & Search matching
  const filteredMedia = mediaList.filter(item => {
    const matchesSearch = item.fileName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.aiDescription.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || 
                        (filterType === 'image' && item.mimeType.startsWith('image/')) ||
                        (filterType === 'video' && item.mimeType.startsWith('video/'));
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <FolderHeart className="w-6 h-6 text-indigo-500 shrink-0" />
            Multimodal Content Arsenal
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Upload photos and videos. Our AI will instantly analyze them to plan organic posts or inspire new creations.
          </p>
        </div>
      </div>

      {/* Upload Zone */}
      <div 
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-200 ${
          dragActive 
            ? 'border-indigo-500 bg-indigo-500/10' 
            : 'border-slate-800 bg-slate-900/40 hover:border-slate-700 hover:bg-slate-900/60'
        }`}
      >
        <input 
          type="file" 
          ref={fileInputRef}
          onChange={handleFileInput}
          className="hidden" 
          multiple
          accept="image/*,video/*"
        />
        
        {uploading ? (
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
            <h3 className="text-md font-semibold text-white">Analyzing and uploading file...</h3>
            <p className="text-xs text-slate-400 max-w-xs">
              Gemini is scanning your content multimodally to catalogue the scene and generate visual inspiration prompts.
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 bg-slate-800/80 text-indigo-400 rounded-lg flex items-center justify-center shadow-md">
              <Upload className="w-6 h-6" />
            </div>
            <h3 className="text-md font-semibold text-white">Drag & drop your photos or videos here</h3>
            <p className="text-xs text-slate-400 max-w-sm">
              Supports JPG, PNG, WEBP and MP4 up to 100 MB. AI labels ("AI Lens") will be generated automatically.
            </p>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-800 text-indigo-300 border border-slate-700/60 mt-1">
              <Sparkles className="w-3 h-3 animate-pulse" /> Multimodality Enabled
            </span>
          </div>
        )}
      </div>

      {/* Control bar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center bg-slate-900/55 p-4 rounded-xl border border-slate-800/80">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search by name or AI description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-indigo-500 transition-colors"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filterType === 'all' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white hover:bg-slate-900'
            }`}
          >
            All ({mediaList.length})
          </button>
          <button
            onClick={() => setFilterType('image')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
              filterType === 'image' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white hover:bg-slate-900'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            Images
          </button>
          <button
            onClick={() => setFilterType('video')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
              filterType === 'video' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white hover:bg-slate-900'
            }`}
          >
            <VideoIcon className="w-3.5 h-3.5" />
            Videos
          </button>
        </div>
      </div>

      {/* Grid gallery */}
      {loading ? (
        <div className="text-center py-20">
          <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mx-auto mb-4" />
          <p className="text-slate-400 text-sm">Loading content library...</p>
        </div>
      ) : filteredMedia.length === 0 ? (
        <div className="text-center py-20 bg-slate-900/20 border border-slate-800/60 rounded-xl">
          <FolderOpen className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <h3 className="text-md font-semibold text-white">Your arsenal is empty or has no matches</h3>
          <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
            Upload photos or videos in the upper panel to let the AI catalogue them and start structuring your visual strategy.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMedia.map((item) => {
            const isVideo = item.mimeType.startsWith('video/');
            return (
              <div 
                key={item.id} 
                className="bg-slate-900/60 rounded-xl border border-slate-800/80 overflow-hidden flex flex-col hover:border-slate-700/80 transition-all duration-200 group"
              >
                {/* Media preview box */}
                <div className="relative aspect-video bg-slate-950 flex items-center justify-center overflow-hidden border-b border-slate-800/80">
                  {isVideo ? (
                    <video 
                      src={item.url} 
                      controls 
                      className="w-full h-full object-cover" 
                      preload="metadata"
                    />
                  ) : (
                    <img 
                      src={item.url} 
                      alt={item.fileName} 
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                      loading="lazy"
                    />
                  )}
                  
                  {/* Floating media type indicator */}
                  <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider text-slate-300 border border-slate-850 flex items-center gap-1">
                    {isVideo ? <VideoIcon className="w-3 h-3 text-amber-500" /> : <ImageIcon className="w-3 h-3 text-indigo-400" />}
                    {isVideo ? 'Video' : 'Imagen'}
                  </div>

                  {/* Delete button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm('¿Estás seguro de que deseas eliminar este recurso del arsenal?')) {
                        onDelete(item.id);
                      }
                    }}
                    className="absolute top-3 right-3 bg-red-600/90 text-white p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-700 hover:scale-105 transition-all duration-150 shadow-md shadow-red-900/20"
                    title="Eliminar del Arsenal"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Body metadata */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h4 className="text-sm font-bold text-white truncate" title={item.fileName}>
                      {item.fileName}
                    </h4>
                    <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-500">
                      <span>{formatBytes(item.sizeBytes)}</span>
                      <span>•</span>
                      <span>{formatDate(item.createdAt)}</span>
                    </div>

                    {/* AI Description (AI Lens) */}
                    <div className="mt-3.5 bg-slate-950/40 p-3 rounded-lg border border-slate-800/80">
                      <span className="text-[10px] font-black uppercase tracking-wider text-indigo-400 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-indigo-400 shrink-0" />
                        AI Lens (Descripción)
                      </span>
                      <p className="text-xs text-slate-300 mt-1.5 leading-relaxed font-sans line-clamp-3" title={item.aiDescription}>
                        {item.aiDescription}
                      </p>
                    </div>

                    {/* AI Prompt Spark */}
                    <div className="mt-3 bg-slate-950/40 p-3 rounded-lg border border-slate-800/80">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 flex items-center gap-1">
                          <RefreshCw className="w-3 h-3 text-emerald-400 shrink-0 animate-spin-slow" />
                          Visual Spark (Prompt)
                        </span>
                        <button
                          onClick={() => handleCopyPrompt(item.id, item.visualPrompt)}
                          className="text-[10px] text-slate-500 hover:text-white flex items-center gap-1 transition"
                          title="Copiar prompt de generación"
                        >
                          {copiedId === item.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          {copiedId === item.id ? 'Copiado' : 'Copiar'}
                        </button>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1.5 font-mono leading-relaxed line-clamp-2 italic" title={item.visualPrompt}>
                        "{item.visualPrompt}"
                      </p>
                    </div>
                  </div>

                  {/* Actions buttons */}
                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <button
                      onClick={() => onSelectForPost(item)}
                      className="flex items-center justify-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-3 rounded-lg text-xs transition shadow-md shadow-indigo-600/10 active:scale-98"
                    >
                      Crear Post
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onSelectForStudio(item)}
                      className="flex items-center justify-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-semibold py-2 px-3 rounded-lg text-xs transition border border-slate-700/60 active:scale-98"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      Clonar Estilo
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}