import React, { useState, useEffect, useRef } from 'react';
import { AppState, ComicScript, Panel } from './types';
import { 
  generateComicScript, 
  generatePanelImage,
  animateWithVeo, 
  stitchVideos 
} from './services/geminiService';
import { 
  COMIC_GENRES, 
  CHARACTER_ARCHETYPES, 
  ComicGenre 
} from './data/comicPresets';
import GenreSelector from './components/GenreSelector';
import CharacterBuilder, { CharacterItem } from './components/CharacterBuilder';
import PanelCard from './components/PanelCard';
import LoadingOverlay from './components/LoadingOverlay';
import { 
  Wand2, 
  Sparkles, 
  Film, 
  Download, 
  ArrowLeft, 
  Shuffle, 
  Users, 
  Palette, 
  Image as ImageIcon,
  CheckCircle,
  Play
} from 'lucide-react';

declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }

  interface Window {
    aistudio?: AIStudio;
  }
}

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(AppState.HOME);
  const [selectedGenre, setSelectedGenre] = useState<ComicGenre>(COMIC_GENRES[0]);
  const [characters, setCharacters] = useState<CharacterItem[]>([
    {
      id: 'char-1',
      name: 'Jax Walker',
      archetypeId: 'chosen-one',
      customTrait: 'Doubtful of his awakening powers'
    },
    {
      id: 'char-2',
      name: 'Dr. Victor Vance',
      archetypeId: 'mastermind-villain',
      customTrait: 'Believes order requires total subjugation'
    }
  ]);
  const [prompt, setPrompt] = useState('A rogue scientist activates an ancient particle accelerator beneath the city, forcing a former apprentice to make an impossible choice.');
  const [script, setScript] = useState<ComicScript | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [hasApiKey, setHasApiKey] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isBatchGeneratingImages, setIsBatchGeneratingImages] = useState(false);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    checkApiKey();
  }, []);

  const checkApiKey = async () => {
    if (window.aistudio) {
      const hasKey = await window.aistudio.hasSelectedApiKey();
      setHasApiKey(hasKey);
    }
  };

  const handleSelectKey = async () => {
    if (window.aistudio) {
      await window.aistudio.openSelectKey();
      setHasApiKey(true);
    }
  };

  const handleSurpriseMe = () => {
    // Pick random genre
    const randomGenre = COMIC_GENRES[Math.floor(Math.random() * COMIC_GENRES.length)];
    setSelectedGenre(randomGenre);

    // Pick random prompt from that genre
    const randomPrompt = randomGenre.samplePrompts[Math.floor(Math.random() * randomGenre.samplePrompts.length)];
    setPrompt(randomPrompt);

    // Pick 2 complementary archetypes
    const protagonists = CHARACTER_ARCHETYPES.filter(a => a.category === 'protagonist');
    const others = CHARACTER_ARCHETYPES.filter(a => a.category !== 'protagonist');

    const randomProtagonist = protagonists[Math.floor(Math.random() * protagonists.length)];
    const randomOther = others[Math.floor(Math.random() * others.length)];

    setCharacters([
      {
        id: `char-${Date.now()}-1`,
        name: randomProtagonist.id === 'cynical-antihero' ? 'Garrison Cole' : 'Elora Storm',
        archetypeId: randomProtagonist.id,
        customTrait: ''
      },
      {
        id: `char-${Date.now()}-2`,
        name: randomOther.category === 'antagonist' ? 'Lord Malakor' : 'Pip Quickstep',
        archetypeId: randomOther.id,
        customTrait: ''
      }
    ]);
  };

  const handleStartComic = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    if (characters.length === 0) {
      setError("Please configure at least one character archetype for your comic.");
      return;
    }
    
    setIsLoading(true);
    setLoadingMsg(`Directing ${selectedGenre.name} comic script with chosen archetypes...`);
    try {
      const mappedCharacters = characters.map(c => {
        const found = CHARACTER_ARCHETYPES.find(a => a.id === c.archetypeId) || CHARACTER_ARCHETYPES[0];
        return {
          name: c.name.trim() || found.name,
          archetype: found,
          customTrait: c.customTrait
        };
      });

      const newScript = await generateComicScript({
        prompt,
        genre: selectedGenre,
        characters: mappedCharacters
      });

      setScript(newScript);
      setState(AppState.CREATING);
    } catch (err: any) {
      setError(err?.message || "Failed to generate comic script. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const updatePanel = (panelId: string, updates: Partial<Panel>) => {
    if (!script) return;
    setScript({
      ...script,
      panels: script.panels.map(p => p.id === panelId ? { ...p, ...updates } : p)
    });
  };

  const handleGenerateAllImages = async () => {
    if (!script) return;
    setIsBatchGeneratingImages(true);
    setError(null);

    try {
      for (let i = 0; i < script.panels.length; i++) {
        const panel = script.panels[i];
        if (!panel.imageUrl) {
          updatePanel(panel.id, { isGeneratingImage: true });
          try {
            const url = await generatePanelImage(panel.description, script.genreArtStyle);
            updatePanel(panel.id, { imageUrl: url, isGeneratingImage: false });
          } catch (err) {
            updatePanel(panel.id, { isGeneratingImage: false });
          }
        }
      }
    } catch (err: any) {
      setError("Some images could not be generated. You can retry them individually.");
    } finally {
      setIsBatchGeneratingImages(false);
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!hasApiKey) {
      await handleSelectKey();
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result as string;
      setIsLoading(true);
      setLoadingMsg("Animating your photo with cinematic movement using Veo...");
      try {
        const result = await animateWithVeo(
          "Animate this photo with cinematic movement and vivid atmospheric effects", 
          base64, 
          (msg) => setLoadingMsg(msg)
        );
        const win = window.open(result.url, '_blank');
        if (!win) alert("Video generated! Please check your downloads or browser popup permissions.");
      } catch (err) {
        setError("Animation failed. Check your Veo API key or try again.");
      } finally {
        setIsLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleGenerateMovie = async () => {
    if (!script) return;
    const readyPanels = script.panels.filter(p => p.videoRef);
    if (readyPanels.length < script.panels.length) {
      setError("Please animate ALL 4 panels individually first to provide continuity references for full movie stitching.");
      return;
    }

    if (!hasApiKey) {
      await handleSelectKey();
    }

    setIsLoading(true);
    setLoadingMsg("Directing your full-length comic movie with Veo...");
    try {
      const movieUrl = await stitchVideos(script.panels, (msg) => setLoadingMsg(msg));
      const link = document.createElement('a');
      link.href = movieUrl;
      link.download = `${script.title.replace(/\s+/g, '_')}_Movie.mp4`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      setError("Movie stitching failed. Ensure all panel videos are ready.");
    } finally {
      setIsLoading(false);
    }
  };

  const wrapText = (ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) => {
    const words = text.split(' ');
    let line = '';
    let currentY = y;

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        ctx.fillText(line, x, currentY);
        line = words[n] + ' ';
        currentY += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, x, currentY);
    return currentY;
  };

  const exportAsComicStrip = async () => {
    if (!script || !canvasRef.current) return;
    setIsExporting(true);
    setLoadingMsg("Composing your high-res comic strip...");

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const panelSize = 1024;
    const padding = 40;
    const headerHeight = 200;
    const totalHeight = headerHeight + (script.panels.length * (panelSize + padding)) + padding;
    
    canvas.width = panelSize + (padding * 2);
    canvas.height = totalHeight;

    // Background
    ctx.fillStyle = '#090d16';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Comic Header
    ctx.fillStyle = '#f59e0b';
    ctx.font = 'bold 70px Bangers, cursive';
    ctx.textAlign = 'center';
    ctx.fillText(script.title.toUpperCase(), canvas.width / 2, 90);

    // Genre & Subtitle
    ctx.fillStyle = '#94a3b8';
    ctx.font = 'bold 24px Inter, sans-serif';
    ctx.fillText(`GENRE: ${script.genreName.toUpperCase()}  •  COMICFLOW AI`, canvas.width / 2, 135);

    // Character Cast line
    if (script.characters && script.characters.length > 0) {
      const castText = script.characters.map(c => `${c.name} (${c.archetypeName})`).join('  |  ');
      ctx.fillStyle = '#64748b';
      ctx.font = 'italic 18px Inter, sans-serif';
      ctx.fillText(castText, canvas.width / 2, 168);
    }

    for (let i = 0; i < script.panels.length; i++) {
      const panel = script.panels[i];
      const y = headerHeight + i * (panelSize + padding);

      // Panel Frame border
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(padding - 8, y - 8, panelSize + 16, panelSize + 16);

      if (panel.imageUrl) {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = panel.imageUrl;
        
        await new Promise((resolve) => {
          img.onload = () => {
            ctx.drawImage(img, padding, y, panelSize, panelSize);
            resolve(true);
          };
          img.onerror = () => resolve(true);
        });
      } else {
        // Placeholder background if no image
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(padding, y, panelSize, panelSize);
      }

      // Panel Number Badge (top-left)
      ctx.fillStyle = '#000000';
      ctx.fillRect(padding + 20, y + 20, 110, 36);
      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 18px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`PANEL ${i + 1}`, padding + 75, y + 45);

      // Sound Effect (if present, top-right)
      if (panel.soundEffect) {
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(padding + panelSize - 180, y + 20, 160, 44);
        ctx.strokeStyle = '#fef08a';
        ctx.lineWidth = 3;
        ctx.strokeRect(padding + panelSize - 180, y + 20, 160, 44);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 22px Bangers, cursive';
        ctx.fillText(panel.soundEffect.toUpperCase(), padding + panelSize - 100, y + 50);
      }

      // Dialogue Box (bottom of panel)
      const boxPadding = 40;
      const boxWidth = panelSize - (boxPadding * 2);
      const boxHeight = 150;
      const boxY = y + panelSize - boxHeight - 25;

      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 6;
      ctx.fillRect(padding + boxPadding, boxY, boxWidth, boxHeight);
      ctx.strokeRect(padding + boxPadding, boxY, boxWidth, boxHeight);
      
      // Speaker Tag
      if (panel.speakerName) {
        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 20px Inter, sans-serif';
        ctx.textAlign = 'left';
        const speakerLabel = panel.speakerArchetype 
          ? `${panel.speakerName.toUpperCase()} [${panel.speakerArchetype}]`
          : panel.speakerName.toUpperCase();
        ctx.fillText(speakerLabel, padding + boxPadding + 20, boxY + 35);
      }

      // Dialogue Text
      ctx.fillStyle = '#111827';
      ctx.font = 'italic bold 26px Inter, sans-serif';
      ctx.textAlign = 'center';
      
      const textX = canvas.width / 2;
      const textY = boxY + 75;
      const maxWidth = boxWidth - 40;
      const lineHeight = 34;
      
      wrapText(ctx, `"${panel.dialogue}"`, textX, textY, maxWidth, lineHeight);
    }

    const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
    const link = document.createElement('a');
    link.download = `${script.title.replace(/\s+/g, '_')}_ComicStrip.jpg`;
    link.href = dataUrl;
    link.click();
    
    setIsExporting(false);
  };

  if (isLoading || isExporting) return <LoadingOverlay message={loadingMsg} />;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <canvas ref={canvasRef} className="hidden" />
      
      {/* Navigation Header */}
      <header className="border-b border-slate-800 bg-slate-900/70 backdrop-blur-md sticky top-0 z-40 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setState(AppState.HOME)}
            className="flex items-center gap-3 text-left focus:outline-none group"
          >
            <div className="w-10 h-10 bg-yellow-500 rounded-xl flex items-center justify-center transform -rotate-6 shadow-lg group-hover:rotate-0 transition-transform">
              <span className="text-2xl font-black text-slate-950 font-mono">C</span>
            </div>
            <div>
              <h1 className="comic-font text-2xl tracking-tighter text-yellow-400 group-hover:text-yellow-300">
                COMICFLOW <span className="text-white">AI</span>
              </h1>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest hidden sm:block">
                Genre & Archetype Comic Studio
              </p>
            </div>
          </button>
        </div>
        
        <div className="flex items-center gap-3">
          {state === AppState.CREATING && (
            <button
              onClick={() => setState(AppState.HOME)}
              className="text-xs flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold border border-slate-700 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              New Story
            </button>
          )}

          {!hasApiKey && (
            <button 
              onClick={handleSelectKey}
              className="text-xs bg-amber-500/10 text-amber-400 border border-amber-500/40 px-3 py-1.5 rounded-lg hover:bg-amber-500/20 transition-all font-semibold"
            >
              Configure Veo Key
            </button>
          )}
        </div>
      </header>

      {/* Main Workspace */}
      <main className="flex-grow container mx-auto px-4 sm:px-6 py-8 max-w-6xl">
        {error && (
          <div className="mb-8 p-4 bg-red-500/20 border border-red-500/50 rounded-2xl text-red-200 flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-2">
              <span className="font-bold">Notice:</span>
              <p className="text-sm">{error}</p>
            </div>
            <button onClick={() => setError(null)} className="text-xl px-2 font-bold hover:text-white">&times;</button>
          </div>
        )}

        {/* HOME STATE: Generator Form */}
        {state === AppState.HOME && (
          <div className="space-y-12">
            {/* Hero Banner */}
            <div className="text-center space-y-4 max-w-3xl mx-auto pt-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-xs font-bold uppercase tracking-widest">
                <Sparkles className="w-3.5 h-3.5" /> Next-Gen Comic Generation
              </div>
              <h2 className="comic-font text-5xl md:text-7xl text-white tracking-tight leading-none uppercase">
                Craft Your Comic With <span className="text-yellow-400">Genre Tropes</span> & <span className="text-yellow-400">Archetypes</span>
              </h2>
              <p className="text-base sm:text-lg text-slate-400">
                Choose a classic comic genre and populate it with distinct character archetypes. Gemini crafts the narrative tension while authentic dialogue and matching comic art bring your vision to life.
              </p>
            </div>

            {/* Generator Card */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-8">
              {/* Step 1: Genre Selection */}
              <GenreSelector
                selectedGenre={selectedGenre}
                onSelectGenre={setSelectedGenre}
                onSelectSamplePrompt={(sample) => setPrompt(sample)}
              />

              {/* Step 2: Character Archetype Builder */}
              <CharacterBuilder
                characters={characters}
                onChangeCharacters={setCharacters}
              />

              {/* Step 3: Prompt & Plot Hook */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black uppercase tracking-wider text-yellow-400 flex items-center gap-2">
                    <span>3. Story Concept / Conflict</span>
                  </h3>

                  <button
                    type="button"
                    onClick={handleSurpriseMe}
                    className="text-xs text-yellow-400 hover:text-yellow-300 flex items-center gap-1.5 font-bold hover:underline"
                  >
                    <Shuffle className="w-3.5 h-3.5" />
                    Surprise Me (Random Combo)
                  </button>
                </div>

                <form onSubmit={handleStartComic} className="space-y-4">
                  <textarea 
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Describe the inciting incident, high-stakes duel, or comic misunderstanding..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-2xl p-4 text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none transition-all h-28 text-sm leading-relaxed"
                  />

                  {/* Summary of Configuration before submit */}
                  <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
                    <div className="flex items-center gap-4 flex-wrap">
                      <div>
                        <span className="text-slate-500 uppercase font-bold text-[10px] block">Genre Style</span>
                        <span className="text-slate-200 font-semibold">{selectedGenre.name}</span>
                      </div>
                      <div className="h-6 w-px bg-slate-800 hidden sm:block"></div>
                      <div>
                        <span className="text-slate-500 uppercase font-bold text-[10px] block">Cast ({characters.length})</span>
                        <span className="text-slate-200 font-semibold truncate max-w-xs block">
                          {characters.map(c => c.name || 'Hero').join(', ')}
                        </span>
                      </div>
                    </div>

                    <button 
                      type="submit"
                      className="w-full sm:w-auto px-8 py-3.5 bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-black rounded-xl shadow-lg transition-all transform hover:-translate-y-0.5 active:scale-95 text-sm uppercase tracking-wider flex items-center justify-center gap-2"
                    >
                      <Wand2 className="w-4 h-4" />
                      Generate Comic Script
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Bonus Feature: Quick Veo Photo Animation */}
            <div className="bg-slate-900/50 border border-slate-800/80 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 text-cyan-400 text-xs font-bold uppercase tracking-wider">
                  <Film className="w-4 h-4" />
                  Veo Photo Animation
                </div>
                <h3 className="text-xl font-bold text-slate-100">
                  Have an existing comic still or photo?
                </h3>
                <p className="text-xs text-slate-400 max-w-xl">
                  Upload any standalone artwork or photo to bring it to life using Veo's video diffusion technology.
                </p>
              </div>

              <div className="relative cursor-pointer shrink-0">
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer z-10"
                />
                <button
                  type="button"
                  className="px-5 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 flex items-center gap-2 transition-all shadow"
                >
                  <ImageIcon className="w-4 h-4 text-cyan-400" />
                  Upload Photo for Veo Animation
                </button>
              </div>
            </div>
          </div>
        )}

        {/* CREATING STATE: Script & Panels Studio */}
        {state === AppState.CREATING && script && (
          <div className="space-y-8">
            {/* Header / Production Details */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                      Genre: {script.genreName}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      4-Panel Story Arc
                    </span>
                  </div>

                  <h2 className="comic-font text-4xl sm:text-6xl text-white leading-none">
                    {script.title}
                  </h2>

                  {script.synopsis && (
                    <p className="text-xs text-slate-400 italic max-w-2xl">
                      "{script.synopsis}"
                    </p>
                  )}
                </div>

                {/* Main Action Buttons */}
                <div className="flex flex-wrap items-center gap-2.5">
                  <button 
                    onClick={handleGenerateAllImages}
                    disabled={isBatchGeneratingImages}
                    className="flex items-center gap-2 px-4 py-2.5 bg-yellow-500 hover:bg-yellow-400 text-slate-950 rounded-xl font-bold text-xs transition-all shadow-md active:scale-95 disabled:opacity-50"
                  >
                    <Palette className="w-4 h-4" />
                    {isBatchGeneratingImages ? "ILLUSTRATING..." : "ILLUSTRATE ALL PANELS"}
                  </button>

                  <button 
                    onClick={handleGenerateMovie}
                    className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-xl font-bold text-xs transition-all shadow-xl active:scale-95 border border-white/20"
                  >
                    <Film className="w-4 h-4" />
                    RENDER FULL MOVIE
                  </button>

                  <button 
                    onClick={exportAsComicStrip}
                    className="flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-slate-200 text-slate-900 rounded-xl font-bold text-xs transition-all shadow active:scale-95"
                  >
                    <Download className="w-4 h-4" />
                    EXPORT STRIP (JPG)
                  </button>
                </div>
              </div>

              {/* Cast & Archetype Badges Bar */}
              {script.characters && script.characters.length > 0 && (
                <div className="pt-4 border-t border-slate-800/80 flex flex-wrap items-center gap-2 text-xs">
                  <span className="text-slate-500 font-bold uppercase text-[10px] flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" /> Cast & Archetypes:
                  </span>
                  {script.characters.map((c, i) => (
                    <div
                      key={i}
                      className="bg-slate-950 border border-slate-800 px-3 py-1 rounded-xl flex items-center gap-1.5"
                    >
                      <span className="font-bold text-slate-200">{c.name}</span>
                      <span className="text-slate-500">•</span>
                      <span className="text-yellow-400/90 text-[11px]">{c.archetypeName}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 4 Comic Panels Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {script.panels.map((panel) => (
                <PanelCard 
                  key={panel.id} 
                  panel={panel} 
                  genreArtStyle={script.genreArtStyle}
                  onUpdate={(updates) => updatePanel(panel.id, updates)}
                  setError={setError}
                />
              ))}
            </div>

            {/* Helpful Studio Footer Tips */}
            <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-yellow-500/10 text-yellow-400 flex items-center justify-center shrink-0">
                  <Play className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-200">Panel Animation & Stitching Workflow</h4>
                  <p>Click "Illustrate All Panels" to paint scenes in your chosen {script.genreName} art style. Once illustrated, use "Veo Animate" to generate 720p motion clips for each scene, then render the full movie.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="p-6 border-t border-slate-900 text-center text-slate-500 text-xs">
        <p>© 2026 ComicFlow AI • Driven by Gemini 2.5 Flash, Veo 3.1 & Character Archetype Dynamics</p>
      </footer>
    </div>
  );
};

export default App;
