import React, { useState, useEffect } from 'react';
import { 
  Camera, 
  Sparkles, 
  Upload, 
  CheckCircle2, 
  Heart, 
  Paintbrush, 
  Download, 
  Trash2, 
  ArrowLeft, 
  RefreshCw,
  Home,
  Sun,
  Palette,
  Compass
} from 'lucide-react';
import { apiFetch } from '../firebase';

interface SavedSpace {
  id: string;
  originalUrl: string;
  resultUrl: string;
  instruction: string;
  description: string;
  timestamp: string;
}

export default function SpaceRemodeler() {
  const [step, setStep] = useState<number>(1);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [originalMime, setOriginalMime] = useState<string>('image/jpeg');
  const [filename, setFilename] = useState<string>('habitacion.jpg');
  
  const [selectedPreset, setSelectedPreset] = useState<number | null>(null);
  const [customInstruction, setCustomInstruction] = useState<string>('');
  
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingText] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [resultDescription, setResultDescription] = useState<string>('');
  const [resultPrompt, setResultPrompt] = useState<string>('');

  const [savedSpaces, setSavedSpaces] = useState<SavedSpace[]>([]);

  // Predefined desires/presets designed specifically for Mom
  const presets = [
    { 
      title: "¡Que se vea más iluminada y moderna! ✨", 
      prompt: "Haz que la habitación sea extremadamente luminosa, pintando de blanco roto, agregando lámparas modernas de luz cálida y quitando el desorden." 
    },
    { 
      title: "Añadir plantas y madera acogedora 🪴", 
      prompt: "Agrega plantas de interior verdes y hermosas, macetas de cerámica y detalles de madera natural o roble claro para crear un ambiente acogedor y orgánico." 
    },
    { 
      title: "Cambiar paredes y poner cuadros lindos 🎨", 
      prompt: "Pinta las paredes de un color beige o verde salvia muy suave y decora con cuadros de arte minimalistas y elegantes enmarcados." 
    },
    { 
      title: "Diseño de revista de lujo elegante 🛋️", 
      prompt: "Transforma este espacio en una sala de revista de diseño interior de gama alta, con muebles elegantes, sofás modulares hermosos y alfombra de lujo." 
    }
  ];

  // Loading messages to entertain and comfort her
  const loadingTexts = [
    "Analizando el espacio original con inteligencia artificial... 🧐",
    "Limpiando el cuarto y reordenando el espacio para ti... 🧹",
    "Pintando las paredes con tus colores ideales... 🎨",
    "Acomodando los nuevos muebles de diseño... 🛋️",
    "Encendiendo las luces mágicas y abriendo las ventanas... ☀️",
    "Añadiendo detalles botánicos y plantas frescas... 🪴",
    "¡Casi listo! El fotógrafo de interiores está tomando la foto final... 📸"
  ];

  useEffect(() => {
    const cached = localStorage.getItem('social_flow_remodeler_media');
    if (cached) {
      try {
        setSavedSpaces(JSON.parse(cached));
      } catch (e) {
        console.error("Failed to parse saved spaces", e);
      }
    }
  }, []);

  // Interval for shifting loading text
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (loading) {
      setLoadingText(loadingTexts[0]);
      let index = 1;
      interval = setInterval(() => {
        setLoadingText(loadingTexts[index % loadingTexts.length]);
        index++;
      }, 3500);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFilename(file.name);
    setOriginalMime(file.type);

    const reader = new FileReader();
    reader.onload = () => {
      setOriginalImage(reader.result as string);
      setError(null);
      setStep(2); // Auto advance to next step to keep it super simple!
    };
    reader.readAsDataURL(file);
  };

  const triggerRemodel = async () => {
    // Get actual instruction text
    let activeInstruction = '';
    if (selectedPreset !== null) {
      activeInstruction = presets[selectedPreset].title;
    } else if (customInstruction.trim()) {
      activeInstruction = customInstruction.trim();
    } else {
      setError("Por favor, selecciona una de las opciones mágicas de abajo o escribe un deseo.");
      return;
    }

    setLoading(true);
    setError(null);
    setStep(3); // Go to loading transition

    try {
      const res = await apiFetch('/api/remodel-space', {
        method: 'POST',
        body: JSON.stringify({
          dataUri: originalImage,
          mimeType: originalMime,
          filename: filename,
          instruction: activeInstruction
        })
      });

      if (!res.ok) {
        throw new Error(`Servidor respondió con código ${res.status}`);
      }

      const data = await res.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      setResultImage(data.imageUrl);
      setResultDescription(data.originalDescription);
      setResultPrompt(data.visualPrompt);
      setStep(4); // Show results!

      // Cache this beautiful result locally
      const newSpace: SavedSpace = {
        id: `space-${Date.now()}`,
        originalUrl: originalImage!,
        resultUrl: data.imageUrl,
        instruction: activeInstruction,
        description: data.originalDescription,
        timestamp: new Date().toLocaleDateString('es-ES', { 
          day: '2-digit', 
          month: 'short', 
          hour: '2-digit', 
          minute: '2-digit' 
        })
      };

      const updated = [newSpace, ...savedSpaces];
      setSavedSpaces(updated);
      localStorage.setItem('social_flow_remodeler_media', JSON.stringify(updated));

    } catch (err: any) {
      console.error("Error remodeling space:", err);
      setError("¡Ups! Hubo un pequeño problema al conectar con el diseñador de Google. Por favor, inténtalo de nuevo.");
      setStep(2); // Go back to customization so she can try again
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setOriginalImage(null);
    setSelectedPreset(null);
    setCustomInstruction('');
    setResultImage(null);
    setResultDescription('');
    setResultPrompt('');
    setError(null);
    setStep(1);
  };

  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const handleDeleteSaved = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setConfirmDeleteId(id);
  };

  const handleConfirmDelete = () => {
    if (confirmDeleteId) {
      const updated = savedSpaces.filter(item => item.id !== confirmDeleteId);
      setSavedSpaces(updated);
      localStorage.setItem('social_flow_remodeler_media', JSON.stringify(updated));
      setConfirmDeleteId(null);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12 font-sans select-none animate-fadeIn" id="space-remodeler-workspace">
      
      {/* Top Welcome Title Banner */}
      <div className="bg-gradient-to-r from-indigo-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 relative overflow-hidden border border-indigo-800 shadow-lg">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none transform translate-x-12 -translate-y-6">
          <Home className="w-64 h-64 text-indigo-50" />
        </div>
        <div className="relative z-10 space-y-3">
          <span className="text-xs uppercase font-black tracking-widest text-emerald-400 bg-emerald-950/60 px-3 py-1.5 rounded-full border border-emerald-900/60 inline-flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            El Rincón de Diseño de Mamá
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Remodelar mi espacio</h1>
          <p className="text-indigo-200 text-xs sm:text-sm max-w-2xl leading-relaxed">
            ¡Hola, mamá! Sube una foto de cualquier parte de tu casa (la sala, cocina, comedor o patio) y dinos cómo te gustaría transformarla. Nuestra inteligencia artificial de Google la rediseñará mágicamente en segundos.
          </p>
        </div>
      </div>

      {/* Elder-friendly visually descriptive step progress track */}
      {step !== 3 && (
        <div className="bg-white border border-slate-200 rounded-2xl p-4 flex justify-between items-center text-xs font-bold text-slate-500 shadow-sm overflow-x-auto gap-4">
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg shrink-0 ${step === 1 ? 'bg-indigo-100 text-indigo-800' : 'text-slate-600'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${step === 1 ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-600'}`}>1</span>
            <span>Subir Foto original</span>
          </div>
          <div className="h-0.5 bg-slate-200 flex-1 min-w-[20px] hidden sm:block" />
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg shrink-0 ${step === 2 ? 'bg-indigo-100 text-indigo-800' : 'text-slate-600'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${step === 2 ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-600'}`}>2</span>
            <span>Elegir mi deseo mágico</span>
          </div>
          <div className="h-0.5 bg-slate-200 flex-1 min-w-[20px] hidden sm:block" />
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg shrink-0 ${step === 4 ? 'bg-emerald-100 text-emerald-800' : 'text-slate-600'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${step === 4 ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'}`}>3</span>
            <span>¡Ver mi espacio nuevo!</span>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-xs font-bold text-red-700 shadow-xs flex items-center gap-2">
          <span>⚠️ {error}</span>
        </div>
      )}

      {/* STEP 1: Upload original photo */}
      {step === 1 && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-sm text-center space-y-6">
          <div className="max-w-md mx-auto space-y-4">
            <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto shadow-inner border border-indigo-100">
              <Camera className="w-10 h-10" />
            </div>
            <div className="space-y-2">
              <h2 className="text-lg sm:text-xl font-black text-slate-900">Paso 1: Sube la foto de tu cuarto</h2>
              <p className="text-slate-600 text-xs sm:text-sm">
                Puedes tomarle una foto directamente con tu celular o elegir una que ya tengas guardada de tu casa.
              </p>
            </div>
          </div>

          <label className="max-w-lg mx-auto border-4 border-dashed border-indigo-200 hover:border-indigo-400 bg-indigo-50/10 hover:bg-indigo-50/30 rounded-3xl p-8 sm:p-12 flex flex-col items-center justify-center gap-4 cursor-pointer transition-all duration-200 shadow-xs group">
            <Upload className="w-12 h-12 text-indigo-400 group-hover:scale-110 transition duration-150" />
            <span className="text-sm font-black text-indigo-700 bg-white border border-indigo-200 px-6 py-3 rounded-2xl shadow-sm block group-hover:bg-indigo-600 group-hover:text-white transition">
              Presiona aquí para elegir o tomar foto
            </span>
            <span className="text-xs text-slate-500 font-bold font-mono">Archivos aceptados: PNG, JPG, JPEG</span>
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleImageChange} 
              className="hidden" 
            />
          </label>
        </div>
      )}

      {/* STEP 2: Choose Preset or Enter Text */}
      {step === 2 && originalImage && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Left Column: Image Preview */}
          <div className="md:col-span-5 space-y-4 bg-white border border-slate-200 p-5 rounded-3xl shadow-sm">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-black text-slate-500 uppercase tracking-wider">Tu foto original</h3>
              <button 
                onClick={handleReset}
                className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold py-1.5 px-3 rounded-lg border border-slate-200 flex items-center gap-1 cursor-pointer transition"
              >
                <ArrowLeft className="w-3 h-3" />
                Cambiar foto
              </button>
            </div>
            <div className="aspect-square bg-slate-950 rounded-2xl overflow-hidden shadow-inner flex items-center justify-center border border-slate-100">
              <img 
                src={originalImage} 
                alt="Original Space" 
                className="max-w-full max-h-full object-contain"
              />
            </div>
          </div>

          {/* Right Column: Interactive Selection Card */}
          <div className="md:col-span-7 space-y-6 bg-white border border-slate-200 p-5 sm:p-6 rounded-3xl shadow-sm">
            <div className="space-y-1">
              <h2 className="text-md sm:text-lg font-black text-slate-900 flex items-center gap-1.5">
                <Paintbrush className="w-5 h-5 text-indigo-600" />
                Paso 2: ¿Qué cambio te gustaría ver?
              </h2>
              <p className="text-slate-600 text-xs">
                Toca uno de nuestros deseos recomendados o escribe tu propia idea abajo.
              </p>
            </div>

            {/* Elder-friendly giant preset grid */}
            <div className="space-y-3">
              {presets.map((p, idx) => {
                const isSelected = selectedPreset === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      setSelectedPreset(idx);
                      setCustomInstruction('');
                    }}
                    className={`w-full p-4 border-2 rounded-2xl text-left transition-all duration-150 flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/40 shadow-sm'
                        : 'border-slate-250 hover:border-slate-350 bg-slate-50/50'
                    }`}
                  >
                    <span className="text-xs sm:text-sm font-black text-slate-800 leading-snug">{p.title}</span>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ml-3 ${
                      isSelected ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-300 bg-white'
                    }`}>
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Or custom input box */}
            <div className="border-t border-slate-150 pt-5 space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block">
                ✍️ O escribe tu deseo personalizado aquí:
              </label>
              <textarea
                rows={2}
                value={customInstruction}
                onChange={(e) => {
                  setCustomInstruction(e.target.value);
                  setSelectedPreset(null); // Uncheck presets
                }}
                placeholder="Ej: pon una alfombra roja acolchada, una mesa de centro de madera rústica y cortinas blancas..."
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none font-semibold text-slate-800 focus:border-indigo-400 focus:bg-white transition resize-none"
              />
            </div>

            {/* Transform Button */}
            <button
              onClick={triggerRemodel}
              disabled={selectedPreset === null && !customInstruction.trim()}
              className="w-full bg-slate-950 hover:bg-slate-900 disabled:opacity-40 text-white font-black py-4 rounded-2xl text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer mt-4"
            >
              <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
              <span>¡Hacer Magia en mi Espacio! ✨</span>
            </button>
          </div>

        </div>
      )}

      {/* STEP 3: Loading visual state */}
      {step === 3 && (
        <div className="bg-white border border-slate-200 rounded-3xl p-12 shadow-sm text-center space-y-8 animate-pulse">
          <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-20 text-indigo-500"></span>
            <div className="animate-spin w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full" />
            <Paintbrush className="w-6 h-6 text-indigo-600 absolute animate-bounce" />
          </div>
          <div className="space-y-3 max-w-md mx-auto">
            <p className="text-base sm:text-lg font-black text-indigo-950">
              {loadingMessage || 'Tu diseñador de Google está pintando tu espacio...'}
            </p>
            <p className="text-slate-550 text-xs leading-relaxed">
              Por favor, no cierres esta ventana. Los generadores de inteligencia artificial están reorganizando tus muebles y optimizando el espacio para ti.
            </p>
          </div>
        </div>
      )}

      {/* STEP 4: Results Comparison */}
      {step === 4 && resultImage && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-emerald-700 font-bold text-xs uppercase tracking-widest font-mono">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 animate-pulse" />
                  <span>¡TU ESPACIO NUEVO ESTÁ LISTO!</span>
                </div>
                <p className="text-slate-600 text-xs italic">
                  Deseo cumplido: "{selectedPreset !== null ? presets[selectedPreset].title : customInstruction}"
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleReset}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-black py-2.5 px-5 rounded-xl text-xs border border-slate-200 transition cursor-pointer flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Remodelar otra foto
                </button>
              </div>
            </div>

            {/* Visual Comparative side-by-side or stacked grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* Left: Original photo */}
              <div className="space-y-2">
                <span className="text-xs font-black text-slate-450 uppercase tracking-widest font-mono block">📸 FOTO ANTERIOR:</span>
                <div className="aspect-square bg-slate-900 rounded-2xl overflow-hidden border border-slate-100 shadow-inner flex items-center justify-center">
                  <img 
                    src={originalImage || undefined} 
                    alt="Original room" 
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
                <p className="text-center text-slate-500 text-xs font-semibold italic">El espacio original de tu hogar.</p>
              </div>

              {/* Right: Transformed photo */}
              <div className="space-y-2">
                <span className="text-xs font-black text-emerald-600 uppercase tracking-widest font-mono block flex items-center gap-1">
                  ✨ DISEÑO MEJORADO:
                </span>
                <div className="aspect-square bg-slate-950 rounded-2xl overflow-hidden border border-slate-100 shadow-inner flex items-center justify-center relative">
                  <img 
                    src={resultImage} 
                    alt="Transformed room" 
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
                <p className="text-center text-indigo-600 text-xs font-black italic">Rediseñado exclusivamente por Google GenAI.</p>
              </div>

            </div>

            {/* AI Analysis / Description Box in beautiful callout card */}
            {resultDescription && (
              <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-4 sm:p-5 flex items-start gap-3">
                <div className="p-2 bg-emerald-100 text-emerald-800 rounded-xl shrink-0">
                  <Compass className="w-5 h-5 animate-spin" style={{ animationDuration: '6s' }} />
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block font-mono">El comentario del diseñador:</span>
                  <p className="text-slate-800 text-xs sm:text-sm font-semibold leading-relaxed">
                    {resultDescription}
                  </p>
                </div>
              </div>
            )}

            {/* Actions block */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <a
                href={resultImage}
                download={`mi-espacio-remodelado.png`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-black py-3.5 px-4 rounded-xl text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-xs text-center"
              >
                <Download className="w-4 h-4 text-indigo-200" />
                <span>Guardar esta foto nueva en mi celular 💾</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* RECENTLY REMODELED SPACE GALLERIES (SHOWCASE) */}
      {savedSpaces.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-indigo-500 fill-indigo-100 animate-pulse" />
            <h3 className="text-xs font-black text-slate-600 tracking-wider uppercase">Tus remodelaciones guardadas</h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {savedSpaces.map((space) => (
              <div 
                key={space.id} 
                className="group relative border border-slate-100 rounded-2xl overflow-hidden bg-slate-950 flex flex-col justify-between h-48 shadow-xs cursor-pointer hover:border-indigo-300 transition duration-200"
                onClick={() => {
                  setOriginalImage(space.originalUrl);
                  setResultImage(space.resultUrl);
                  setResultDescription(space.description);
                  setStep(4);
                }}
                title="Presiona para volver a ver esta remodelación"
              >
                {/* Result thumbnail */}
                <div className="flex-1 overflow-hidden flex items-center justify-center relative">
                  <img
                    src={space.resultUrl}
                    alt="Thumbnail space"
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-2.5">
                    <span className="text-xs font-black text-white leading-tight truncate w-full" title={space.instruction}>
                      {space.instruction}
                    </span>
                  </div>
                </div>

                {/* Footer bar with delete button */}
                <div className="p-2 bg-white flex items-center justify-between border-t border-slate-100 z-10">
                  <span className="text-[8px] text-slate-500 font-bold font-mono block">
                    {space.timestamp}
                  </span>
                  <button
                    onClick={(e) => handleDeleteSaved(space.id, e)}
                    className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 transition cursor-pointer"
                    title="Borrar recuerdo"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            ))}
          </div>
        </div>
      )}

      {/* Senior-friendly Warm Delete Confirmation Modal */}
      {confirmDeleteId && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4" id="confirm-delete-modal">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 border border-slate-200 shadow-xl space-y-6 text-center">
            <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto border border-rose-100">
              <Trash2 className="w-8 h-8" />
            </div>
            
            <div className="space-y-3">
              <h3 className="text-lg sm:text-xl font-black text-slate-900 leading-snug">
                ¿Quieres borrar esta remodelación?
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm font-semibold leading-relaxed">
                Esta acción quitará el diseño mejorado de tu lista de recuerdos favoritos de forma permanente.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black py-3.5 px-4 rounded-2xl text-xs sm:text-sm transition cursor-pointer border border-slate-200"
              >
                No, conservar mi recuerdo ❤️
              </button>
              <button
                onClick={handleConfirmDelete}
                className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-black py-3.5 px-4 rounded-2xl text-xs sm:text-sm transition cursor-pointer shadow-sm"
              >
                Sí, borrar foto 🗑️
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
