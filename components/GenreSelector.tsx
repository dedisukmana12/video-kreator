import React from 'react';
import { ComicGenre, COMIC_GENRES } from '../data/comicPresets';
import { 
  Shield, 
  Cpu, 
  Eye, 
  Sparkles, 
  Flame, 
  Skull, 
  Laugh, 
  Rocket, 
  Check, 
  Shuffle, 
  Lightbulb 
} from 'lucide-react';

interface GenreSelectorProps {
  selectedGenre: ComicGenre;
  onSelectGenre: (genre: ComicGenre) => void;
  onSelectSamplePrompt: (prompt: string) => void;
}

const getGenreIcon = (iconName: string) => {
  switch (iconName) {
    case 'Shield': return <Shield className="w-5 h-5" />;
    case 'Cpu': return <Cpu className="w-5 h-5" />;
    case 'Eye': return <Eye className="w-5 h-5" />;
    case 'Sparkles': return <Sparkles className="w-5 h-5" />;
    case 'Flame': return <Flame className="w-5 h-5" />;
    case 'Skull': return <Skull className="w-5 h-5" />;
    case 'Laugh': return <Laugh className="w-5 h-5" />;
    case 'Rocket': return <Rocket className="w-5 h-5" />;
    default: return <Sparkles className="w-5 h-5" />;
  }
};

const GenreSelector: React.FC<GenreSelectorProps> = ({
  selectedGenre,
  onSelectGenre,
  onSelectSamplePrompt
}) => {
  const handleRandomGenre = () => {
    const available = COMIC_GENRES.filter(g => g.id !== selectedGenre.id);
    const random = available[Math.floor(Math.random() * available.length)];
    onSelectGenre(random);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-black uppercase tracking-wider text-yellow-400 flex items-center gap-2">
            <span>1. Select Comic Genre & Style</span>
          </h3>
          <p className="text-xs text-slate-400">
            Dictates visual art aesthetics, pacing, and classic narrative tropes.
          </p>
        </div>

        <button
          type="button"
          onClick={handleRandomGenre}
          className="text-xs text-slate-400 hover:text-yellow-400 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700 hover:border-yellow-500/50 transition-all"
        >
          <Shuffle className="w-3.5 h-3.5" />
          Random Genre
        </button>
      </div>

      {/* Genre Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {COMIC_GENRES.map((genre) => {
          const isSelected = selectedGenre.id === genre.id;
          return (
            <button
              key={genre.id}
              type="button"
              onClick={() => onSelectGenre(genre)}
              className={`p-3.5 rounded-2xl text-left border transition-all relative flex flex-col justify-between group ${
                isSelected
                  ? `bg-slate-800/90 border-yellow-400 shadow-lg shadow-yellow-500/10 ring-1 ring-yellow-400/50`
                  : `bg-slate-950/70 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60`
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 ${
                    isSelected
                      ? `bg-gradient-to-br ${genre.accentColor} text-white shadow-md`
                      : `bg-slate-800 text-slate-400 group-hover:text-white`
                  }`}
                >
                  {getGenreIcon(genre.icon)}
                </div>

                {isSelected && (
                  <span className="w-5 h-5 bg-yellow-400 text-slate-950 rounded-full flex items-center justify-center shadow">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </span>
                )}
              </div>

              <div>
                <h4 className={`text-sm font-bold tracking-tight ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                  {genre.name}
                </h4>
                <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                  {genre.tagline}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Genre Details & Sample Prompts */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 text-xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-200">Selected Tropes:</span>
            <div className="flex flex-wrap gap-1.5">
              {selectedGenre.narrativeTropes.map((trope, i) => (
                <span
                  key={i}
                  className="bg-slate-800 border border-slate-700 text-slate-300 px-2 py-0.5 rounded-md text-[11px]"
                >
                  ✦ {trope}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Sample Story Seeds */}
        <div className="pt-2 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center gap-2">
          <div className="flex items-center gap-1.5 text-yellow-400 font-bold shrink-0">
            <Lightbulb className="w-3.5 h-3.5" />
            <span>Story Starters:</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {selectedGenre.samplePrompts.map((sample, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => onSelectSamplePrompt(sample)}
                className="text-left bg-slate-950 hover:bg-yellow-500/10 hover:border-yellow-500/40 text-slate-400 hover:text-yellow-300 border border-slate-800 px-2.5 py-1 rounded-lg text-[11px] transition-all truncate max-w-xs"
                title={sample}
              >
                "{sample}"
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenreSelector;
