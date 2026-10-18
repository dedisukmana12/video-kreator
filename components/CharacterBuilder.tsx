import React from 'react';
import { CharacterArchetype, CHARACTER_ARCHETYPES } from '../data/comicPresets';
import { 
  Crown, 
  Sword, 
  Zap, 
  Flame, 
  Sparkles, 
  Wrench, 
  Eye, 
  Shield, 
  Plus, 
  Trash2, 
  Dice5, 
  Users,
  Quote
} from 'lucide-react';

export interface CharacterItem {
  id: string;
  name: string;
  archetypeId: string;
  customTrait: string;
}

interface CharacterBuilderProps {
  characters: CharacterItem[];
  onChangeCharacters: (chars: CharacterItem[]) => void;
}

const getArchetypeIcon = (iconName: string) => {
  switch (iconName) {
    case 'Crown': return <Crown className="w-4 h-4 text-amber-400" />;
    case 'Sword': return <Sword className="w-4 h-4 text-rose-400" />;
    case 'Zap': return <Zap className="w-4 h-4 text-yellow-400" />;
    case 'Flame': return <Flame className="w-4 h-4 text-red-400" />;
    case 'Sparkles': return <Sparkles className="w-4 h-4 text-cyan-400" />;
    case 'Wrench': return <Wrench className="w-4 h-4 text-emerald-400" />;
    case 'Eye': return <Eye className="w-4 h-4 text-purple-400" />;
    case 'Shield': return <Shield className="w-4 h-4 text-blue-400" />;
    default: return <Users className="w-4 h-4 text-yellow-400" />;
  }
};

const RANDOM_NAMES = [
  'Jax Walker', 'Dr. Victor Vance', 'Sora Tanaka', 'Detective Miller',
  'Pip Quickstep', 'Lord Malakor', 'Maya Lin', 'Sgt. Brick Stone',
  'Kestrel Vane', 'Professor Albright', 'Zara Quinn', 'Master Wu',
  'Baroness Raven', 'Sparky Chen', 'Ronin Silas', 'Nova Drake'
];

const PRESET_COMBOS = [
  {
    name: 'Classic Conflict',
    description: 'Reluctant Chosen One vs Mastermind Villain',
    setup: [
      { name: 'Leo Mercer', archetypeId: 'chosen-one', customTrait: 'Haunted by visions of the relic' },
      { name: 'Dr. Obsidian', archetypeId: 'mastermind-villain', customTrait: 'Speaks in polite, terrifying whispers' }
    ]
  },
  {
    name: 'Dynamic Duo',
    description: 'Cynical Anti-Hero + Comic Relief Sidekick',
    setup: [
      { name: 'Garrison Cole', archetypeId: 'cynical-antihero', customTrait: 'Ex-bounty hunter with a heart of gold' },
      { name: 'Barnaby "Twitch"', archetypeId: 'eccentric-sidekick', customTrait: 'Carries an illegal EMP device in a lunchbox' }
    ]
  },
  {
    name: 'Master & Pupil',
    description: 'The Reluctant Chosen One + Mystical Mentor',
    setup: [
      { name: 'Elora Storm', archetypeId: 'chosen-one', customTrait: 'Unaware of her elemental lineage' },
      { name: 'Grandmaster Jin', archetypeId: 'wise-mentor', customTrait: 'Speaks only in ancient riddles' }
    ]
  },
  {
    name: 'Wildcard Trio',
    description: 'Mad Tech Prodigy + Cunning Trickster + Stoic Bruiser',
    setup: [
      { name: 'Dexter Sparks', archetypeId: 'mad-tech-genius', customTrait: 'Builds weapons out of junk' },
      { name: 'Sable Fox', archetypeId: 'rogue-trickster', customTrait: 'Smuggles counterfeit credentials' },
      { name: 'Goliath', archetypeId: 'stoic-bruiser', customTrait: 'Rarely speaks more than three words' }
    ]
  }
];

const CharacterBuilder: React.FC<CharacterBuilderProps> = ({
  characters,
  onChangeCharacters
}) => {
  const handleUpdate = (id: string, updates: Partial<CharacterItem>) => {
    onChangeCharacters(
      characters.map(c => c.id === id ? { ...c, ...updates } : c)
    );
  };

  const handleAddCharacter = () => {
    if (characters.length >= 4) return;
    const unusedArchetypes = CHARACTER_ARCHETYPES.filter(
      a => !characters.some(c => c.archetypeId === a.id)
    );
    const chosenArchetype = unusedArchetypes[0] || CHARACTER_ARCHETYPES[0];
    const randomName = RANDOM_NAMES[Math.floor(Math.random() * RANDOM_NAMES.length)];

    onChangeCharacters([
      ...characters,
      {
        id: `char-${Date.now()}`,
        name: randomName,
        archetypeId: chosenArchetype.id,
        customTrait: ''
      }
    ]);
  };

  const handleRemove = (id: string) => {
    if (characters.length <= 1) return;
    onChangeCharacters(characters.filter(c => c.id !== id));
  };

  const handleRandomizeName = (id: string) => {
    const randomName = RANDOM_NAMES[Math.floor(Math.random() * RANDOM_NAMES.length)];
    handleUpdate(id, { name: randomName });
  };

  const handleApplyPreset = (preset: typeof PRESET_COMBOS[0]) => {
    onChangeCharacters(
      preset.setup.map((p, idx) => ({
        id: `char-${Date.now()}-${idx}`,
        name: p.name,
        archetypeId: p.archetypeId,
        customTrait: p.customTrait
      }))
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-black uppercase tracking-wider text-yellow-400 flex items-center gap-2">
            <span>2. Character Archetypes & Roles</span>
          </h3>
          <p className="text-xs text-slate-400">
            Defines character personalities, actions, dialogue tone, and interactions.
          </p>
        </div>

        {/* Preset synergy shortcuts */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[10px] uppercase font-bold text-slate-500">Presets:</span>
          {PRESET_COMBOS.map((combo, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleApplyPreset(combo)}
              className="text-[10px] font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-2 py-1 rounded-md border border-slate-700 transition-colors"
              title={combo.description}
            >
              {combo.name}
            </button>
          ))}
        </div>
      </div>

      {/* Character Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {characters.map((char, index) => {
          const archetype = CHARACTER_ARCHETYPES.find(a => a.id === char.archetypeId) || CHARACTER_ARCHETYPES[0];

          return (
            <div
              key={char.id}
              className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3 relative group hover:border-slate-700 transition-all shadow-md"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-yellow-500/20 text-yellow-400 text-xs font-black flex items-center justify-center border border-yellow-500/30">
                    {index + 1}
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    {index === 0 ? "Protagonist / Lead" : index === 1 ? "Co-Star / Foil" : "Supporting Role"}
                  </span>
                </div>

                {characters.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemove(char.id)}
                    className="text-slate-500 hover:text-red-400 p-1 rounded-lg hover:bg-red-500/10 transition-colors"
                    title="Remove Character"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Name & Archetype Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Character Name
                  </label>
                  <div className="flex gap-1.5">
                    <input
                      type="text"
                      value={char.name}
                      onChange={(e) => handleUpdate(char.id, { name: e.target.value })}
                      placeholder="e.g. Jax Walker"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-100 font-semibold focus:outline-none focus:border-yellow-400"
                    />
                    <button
                      type="button"
                      onClick={() => handleRandomizeName(char.id)}
                      className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-yellow-400 rounded-xl border border-slate-700 transition-colors"
                      title="Generate Name"
                    >
                      <Dice5 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Archetype Role
                  </label>
                  <select
                    value={char.archetypeId}
                    onChange={(e) => handleUpdate(char.id, { archetypeId: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-yellow-400 font-bold focus:outline-none focus:border-yellow-400"
                  >
                    {CHARACTER_ARCHETYPES.map((arch) => (
                      <option key={arch.id} value={arch.id}>
                        {arch.name} ({arch.category})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Archetype Details Box */}
              <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800/80 space-y-1.5 text-xs">
                <div className="flex items-center gap-1.5 font-bold text-slate-200">
                  {getArchetypeIcon(archetype.icon)}
                  <span>{archetype.name}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded font-semibold uppercase tracking-wider ${
                    archetype.category === 'protagonist'
                      ? 'bg-blue-500/20 text-blue-300'
                      : archetype.category === 'antagonist'
                      ? 'bg-red-500/20 text-red-300'
                      : 'bg-emerald-500/20 text-emerald-300'
                  }`}>
                    {archetype.category}
                  </span>
                </div>

                <p className="text-[11px] text-slate-400 leading-snug">
                  {archetype.behaviorPrompt}
                </p>

                <div className="pt-1.5 flex items-start gap-1.5 text-[11px] text-yellow-300/90 italic border-t border-slate-900">
                  <Quote className="w-3 h-3 shrink-0 mt-0.5 opacity-60" />
                  <span>{archetype.signatureQuote}</span>
                </div>
              </div>

              {/* Optional Custom Twist / Trait */}
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Custom Trait or Twist <span className="text-slate-600 font-normal">(optional)</span>
                </label>
                <input
                  type="text"
                  value={char.customTrait}
                  onChange={(e) => handleUpdate(char.id, { customTrait: e.target.value })}
                  placeholder="e.g. Constantly drinks boba; holds a secret grudge against the king"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-yellow-400"
                />
              </div>
            </div>
          );
        })}
      </div>

      {characters.length < 4 && (
        <button
          type="button"
          onClick={handleAddCharacter}
          className="w-full py-2.5 border-2 border-dashed border-slate-800 hover:border-yellow-500/50 rounded-2xl text-xs font-bold text-slate-400 hover:text-yellow-400 flex items-center justify-center gap-2 transition-all bg-slate-950/40"
        >
          <Plus className="w-4 h-4" />
          Add Another Character Archetype ({characters.length}/4)
        </button>
      )}
    </div>
  );
};

export default CharacterBuilder;
