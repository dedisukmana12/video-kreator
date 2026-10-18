import React, { useState } from 'react';
import { Panel } from '../types';
import { generatePanelImage, animateWithVeo, speakDialogue } from '../services/geminiService';
import { decode, decodeAudioData } from '../services/audioService';
import { Sparkles, Video, Volume2, User, Zap, Info } from 'lucide-react';

interface PanelCardProps {
  panel: Panel;
  genreArtStyle?: string;
  onUpdate: (updatedPanel: Partial<Panel>) => void;
  setError: (msg: string) => void;
}

const VOICE_OPTIONS = [
  { id: 'Kore', name: 'Kore (Hero / Earnest)' },
  { id: 'Fenrir', name: 'Fenrir (Deep / Anti-Hero)' },
  { id: 'Charon', name: 'Charon (Chilling / Villain)' },
  { id: 'Puck', name: 'Puck (Quirky / Sidekick)' },
  { id: 'Zephyr', name: 'Zephyr (Sage / Mentor)' },
  { id: 'Neo', name: 'Neo (Energetic / Tech)' },
  { id: 'Xylia', name: 'Xylia (Sharp / Trickster)' },
  { id: 'Waven', name: 'Waven (Resonant / Bruiser)' }
];

const PanelCard: React.FC<PanelCardProps> = ({ panel, genreArtStyle, onUpdate, setError }) => {
  const [status, setStatus] = useState('');
  const [selectedVoice, setSelectedVoice] = useState(panel.voiceName || 'Kore');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const handleGenerateImage = async () => {
    onUpdate({ isGeneratingImage: true });
    try {
      const url = await generatePanelImage(panel.description, genreArtStyle);
      onUpdate({ imageUrl: url, isGeneratingImage: false });
    } catch (err: any) {
      setError(err?.message || "Failed to generate image. Try again.");
      onUpdate({ isGeneratingImage: false });
    }
  };

  const handleAnimate = async () => {
    if (!panel.imageUrl) return;
    onUpdate({ isGeneratingVideo: true });
    try {
      const result = await animateWithVeo(
        `Cinematic comic movement: ${panel.description}. Dramatic camera motion matching comic action.`,
        panel.imageUrl,
        (msg) => setStatus(msg)
      );
      onUpdate({ 
        videoUrl: result.url, 
        videoRef: result.ref, 
        isGeneratingVideo: false 
      });
    } catch (err: any) {
      setError(err?.message || "Failed to animate panel. Veo models may be busy.");
      onUpdate({ isGeneratingVideo: false });
    }
  };

  const handleSpeak = async () => {
    setIsSpeaking(true);
    try {
      const base64 = await speakDialogue(panel.dialogue, selectedVoice);
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      const decodedData = decode(base64);
      const audioBuffer = await decodeAudioData(decodedData, audioCtx, 24000, 1);
      
      const source = audioCtx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioCtx.destination);
      source.onended = () => setIsSpeaking(false);
      source.start();
    } catch (err) {
      setError("Voice synthesis failed. The selected voice might not be supported in this session.");
      setIsSpeaking(false);
    }
  };

  return (
    <div className="bg-slate-900/90 rounded-2xl overflow-hidden border border-slate-800 hover:border-yellow-500/50 transition-all flex flex-col shadow-xl group">
      {/* Visual Area */}
      <div className="relative aspect-square bg-slate-950 overflow-hidden">
        {panel.videoUrl ? (
          <video src={panel.videoUrl} controls autoPlay loop className="w-full h-full object-cover" />
        ) : panel.imageUrl ? (
          <img src={panel.imageUrl} alt="Panel Scene" className="w-full h-full object-cover" />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-slate-500 p-6 text-center space-y-2">
            {panel.isGeneratingImage ? (
              <>
                <div className="w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-xs font-semibold text-yellow-400">Illustrating scene...</p>
              </>
            ) : (
              <>
                <Sparkles className="w-8 h-8 text-slate-700 group-hover:text-yellow-500/60 transition-colors" />
                <p className="text-xs italic text-slate-400">Ready to illustrate in genre style</p>
              </>
            )}
          </div>
        )}

        {/* Top Badges Overlay */}
        <div className="absolute top-2 left-2 right-2 flex items-center justify-between pointer-events-none z-10">
          <span className="bg-slate-950/80 backdrop-blur-md text-[10px] font-black uppercase tracking-wider text-slate-300 px-2 py-0.5 rounded border border-slate-700">
            {panel.id.toUpperCase()}
          </span>

          {panel.soundEffect && (
            <span className="bg-yellow-400 text-slate-950 font-black text-xs px-2 py-0.5 rounded-sm transform rotate-2 shadow-md animate-pulse">
              💥 {panel.soundEffect}
            </span>
          )}
        </div>

        {panel.isGeneratingVideo && (
          <div className="absolute inset-0 bg-black/85 flex flex-col items-center justify-center p-4 z-20">
            <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mb-3"></div>
            <p className="text-xs text-center text-cyan-300 font-bold uppercase tracking-widest">{status || "Rendering Video..."}</p>
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="p-4 flex-grow flex flex-col gap-3">
        {/* Character & Archetype Indicator */}
        <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <User className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
            <span className="text-xs font-bold text-slate-200 truncate">{panel.speakerName || 'Character'}</span>
          </div>
          {panel.speakerArchetype && (
            <span className="text-[10px] font-medium bg-slate-800 text-yellow-400/90 border border-slate-700 px-2 py-0.5 rounded-full shrink-0">
              {panel.speakerArchetype}
            </span>
          )}
        </div>

        {/* Dialogue Bubble */}
        <div className="relative bg-white text-slate-950 p-3.5 rounded-xl border-2 border-slate-950 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
          <div className="text-xs font-bold italic leading-relaxed text-center">
            "{panel.dialogue}"
          </div>
          {/* Comic speech bubble tail */}
          <div className="absolute -bottom-2 left-6 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-slate-950"></div>
          <div className="absolute -bottom-1 left-6.5 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-white"></div>
        </div>

        {/* Action description / Scene Details */}
        <div className="mt-2 text-[11px] text-slate-400 leading-relaxed">
          {panel.actionDescription && (
            <p className="text-slate-300 font-medium mb-1">
              <span className="text-slate-500 uppercase font-bold text-[9px] mr-1">Action:</span>
              {panel.actionDescription}
            </p>
          )}
          
          <button 
            type="button"
            onClick={() => setShowDetails(!showDetails)}
            className="flex items-center gap-1 text-[10px] text-yellow-500 hover:text-yellow-400 font-semibold"
          >
            <Info className="w-3 h-3" />
            {showDetails ? "Hide Prompt Details" : "View Visual Prompt"}
          </button>

          {showDetails && (
            <div className="mt-2 p-2 bg-slate-950/70 border border-slate-800 rounded text-[10px] text-slate-400">
              {panel.description}
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="mt-auto pt-3 border-t border-slate-800/80 space-y-2.5">
          <div className="flex items-center justify-between gap-2">
            <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider flex items-center gap-1">
              <Volume2 className="w-3 h-3 text-slate-400" /> Voice:
            </label>
            <select
              value={selectedVoice}
              onChange={(e) => {
                setSelectedVoice(e.target.value);
                onUpdate({ voiceName: e.target.value });
              }}
              className="bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded-lg px-2 py-1 outline-none focus:border-yellow-500 max-w-[170px]"
            >
              {VOICE_OPTIONS.map(v => (
                <option key={v.id} value={v.id}>{v.name}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            {!panel.imageUrl ? (
              <button
                type="button"
                onClick={handleGenerateImage}
                disabled={panel.isGeneratingImage}
                className="flex-1 py-2 px-3 bg-yellow-500 hover:bg-yellow-400 active:scale-98 text-slate-950 font-black text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                <Sparkles className="w-3.5 h-3.5" />
                GENERATE ART
              </button>
            ) : !panel.videoUrl ? (
              <button
                type="button"
                onClick={handleAnimate}
                disabled={panel.isGeneratingVideo}
                className="flex-1 py-2 px-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 active:scale-98 text-white font-bold text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                <Video className="w-3.5 h-3.5" />
                VEO ANIMATE
              </button>
            ) : (
              <div className="flex-1 py-1.5 px-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold text-xs rounded-xl flex items-center justify-center gap-1">
                <Video className="w-3.5 h-3.5" />
                ANIMATED
              </div>
            )}

            <button
              type="button"
              onClick={handleSpeak}
              disabled={isSpeaking}
              className={`py-2 px-3 bg-slate-800 hover:bg-slate-700 active:scale-98 text-slate-200 font-bold text-xs rounded-xl transition-all border border-slate-700 flex items-center justify-center gap-1.5 ${isSpeaking ? 'animate-pulse ring-2 ring-yellow-400' : ''}`}
            >
              <Volume2 className="w-3.5 h-3.5 text-yellow-400" />
              {isSpeaking ? "VOICING..." : "SPEAK"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PanelCard;
