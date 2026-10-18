export interface ComicGenre {
  id: string;
  name: string;
  tagline: string;
  icon: string;
  accentColor: string;
  borderHover: string;
  bgLight: string;
  artStylePrompt: string;
  narrativeTropes: string[];
  samplePrompts: string[];
}

export interface CharacterArchetype {
  id: string;
  name: string;
  category: 'protagonist' | 'antagonist' | 'supporting';
  tagline: string;
  behaviorPrompt: string;
  dialogueStyle: string;
  suggestedVoice: string;
  icon: string;
  signatureQuote: string;
}

export const COMIC_GENRES: ComicGenre[] = [
  {
    id: 'superhero',
    name: 'Superhero',
    tagline: 'Costumed vigilantes, cosmic threats & epic clashes',
    icon: 'Shield',
    accentColor: 'from-amber-500 to-red-600',
    borderHover: 'hover:border-amber-500',
    bgLight: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    artStylePrompt: 'Bold American superhero comic book style, dynamic heroic foreshortening, dramatic cape and musculature, vibrant saturated primary colors, crisp comic ink linework, high-contrast action lighting with halftone dots',
    narrativeTropes: [
      'High-stakes rooftop duel',
      'The villain unveils their doomsday device',
      'Heroic comeback against all odds',
      'Iconic battle catchphrase'
    ],
    samplePrompts: [
      'A magnetic super-soldier defends Neo-Haven from a mechanical dragon created by their former mentor.',
      'A rookie speedster accidentally travels 10 minutes into the future during a bank robbery.',
      'A vigilante detective discovers the city mayor is secretly an alien symbiote lord.'
    ]
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk',
    tagline: 'High-tech dystopia, neon alleyways & rogue cyborgs',
    icon: 'Cpu',
    accentColor: 'from-cyan-500 to-fuchsia-600',
    borderHover: 'hover:border-cyan-400',
    bgLight: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
    artStylePrompt: 'Cyberpunk graphic novel aesthetic, rain-slicked neon asphalt, glowing holographic interfaces, dark chrome reflections, heavy ink shadows, neon blues and magenta highlights, retro-futuristic urban grit',
    narrativeTropes: [
      'Corporate AI firewall breach',
      'Black market cyberware glitch at the worst moment',
      'Smoky underground noodle bar rendezvous',
      'Chased across flying vehicle highways'
    ],
    samplePrompts: [
      'A freelance memory-courier wakes up with a classified mega-corporation secret encrypted in their ocular implant.',
      'A cybernetic ronin takes one final contract to assassinate an rogue android syndicate boss.',
      'A street-smart hacker and their hijacked combat drone pull off an impossible server heist.'
    ]
  },
  {
    id: 'noir',
    name: 'Noir Mystery',
    tagline: 'Hardboiled detectives, shadowy alleys & dangerous dames',
    icon: 'Eye',
    accentColor: 'from-slate-500 to-zinc-800',
    borderHover: 'hover:border-slate-400',
    bgLight: 'bg-slate-500/10 text-slate-300 border-slate-500/30',
    artStylePrompt: 'Classic hardboiled crime noir comic art, extreme chiaroscuro black and white with subtle sepia tones, venetian blind light slices, foggy streetlamps, heavy shadows, gritty ink crosshatching',
    narrativeTropes: [
      'Cynical inner voice-over narration',
      'A mysterious client reveals a counterfeit heirloom',
      'Rain pouring on a trench coat in a deserted alley',
      'The double-cross at the abandoned docks'
    ],
    samplePrompts: [
      'A weary 1940s private eye investigates the sudden disappearance of a jazz singer, only to find occult mobsters.',
      'A cynical detective receives a case that reopens the unsolved murder of his old partner.',
      'A midnight stakeout at the old lighthouse turns deadly when the fog rolls in with uninvited guests.'
    ]
  },
  {
    id: 'fantasy',
    name: 'Epic Fantasy',
    tagline: 'Ancient spells, mythical beasts & legendary quests',
    icon: 'Sparkles',
    accentColor: 'from-emerald-500 to-teal-700',
    borderHover: 'hover:border-emerald-400',
    bgLight: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    artStylePrompt: 'High fantasy comic illustration, glowing arcane runes, ornate knight armor, enchanted mystical forests, majestic beast silhouettes, painterly comic inks with rich gemstone color palette',
    narrativeTropes: [
      'An ancient sealed relic begins to pulse with power',
      'The tavern brawl that sparks an expedition',
      'Confronting the slumbering dragon or titan',
      'A forbidden spell unleashed with catastrophic consequences'
    ],
    samplePrompts: [
      'A novice spellblade must deliver the last embers of the Sun Tree across the Frozen Waste.',
      'A mischievous goblin rogue and an honorable paladin are magically handcuffed together inside a cursed dungeon.',
      'A royal alchemist accidentally brews a potion that breathes life into castle gargoyles.'
    ]
  },
  {
    id: 'manga-shonen',
    name: 'Shonen Manga',
    tagline: 'Explosive energy, power awakenings & unbreakable bonds',
    icon: 'Flame',
    accentColor: 'from-orange-500 to-amber-600',
    borderHover: 'hover:border-orange-400',
    bgLight: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
    artStylePrompt: 'High-octane Shonen manga art style, dramatic radial speed lines, bold energetic black ink brushwork, intense expressive facial reactions, aura flares, screentone shading, dynamic foreshortened punch impact',
    narrativeTropes: [
      'Unleashing a hidden second form / limit break',
      'Shouting the ultimate technique name at the climax',
      'The rival acknowledges the protagonist\'s growth',
      'The dramatic flashback mid-combat giving renewed resolve'
    ],
    samplePrompts: [
      'A culinary brawler enters the Grand Spirit Kitchen Tournament where dishes summon elemental beasts.',
      'A young martial artist who cannot use spiritual energy unlocks the ancient art of kinetic redirection.',
      'Two rival academy students unite their secret techniques to stop an invading shadow clan.'
    ]
  },
  {
    id: 'horror',
    name: 'Gothic Horror',
    tagline: 'Creeping dread, occult curses & eerie monstrosities',
    icon: 'Skull',
    accentColor: 'from-purple-900 to-rose-950',
    borderHover: 'hover:border-purple-500',
    bgLight: 'bg-purple-900/20 text-purple-300 border-purple-500/30',
    artStylePrompt: 'Vintage EC Comics and modern gothic horror comic art, grotesque textures, eerie moonlight, deep pitch-black inks, desaturated eerie color wash, terrifying creature silhouettes, claustrophobic framing',
    narrativeTropes: [
      'The flickering light reveals something standing in the corner',
      'The cursed book that warns the reader to turn back',
      'The realization that the sanctuary was a trap all along',
      'A desperate scramble in pitch black darkness'
    ],
    samplePrompts: [
      'Lighthouse keepers on an isolated rock discover something knocking on the glass from the outside at 200 feet high.',
      'An antique restorer accidentally polishes a mirror that reflects a room 100 years into a cursed past.',
      'A late-night subway train takes an unexpected switch onto tracks abandoned in 1912.'
    ]
  },
  {
    id: 'comedy',
    name: 'Comedy / Satire',
    tagline: 'Witty banter, absurd situations & slapstick mishaps',
    icon: 'Laugh',
    accentColor: 'from-yellow-400 to-lime-500',
    borderHover: 'hover:border-yellow-400',
    bgLight: 'bg-yellow-400/10 text-yellow-300 border-yellow-400/30',
    artStylePrompt: 'Playful vibrant cartoon comic style, exaggerated expressive character poses, comical sweat drops and spiral eyes, pop-art bright palette, bold outlines, fun slapstick visual gags',
    narrativeTropes: [
      'An absurdly petty dispute escalates into total chaos',
      'The elaborate master plan fails due to a mundane oversight',
      'Deadpan reaction to an insane situation',
      'A catastrophic misunderstanding between two characters'
    ],
    samplePrompts: [
      'Supervillains holding an annual corporate performance review for their failing henchmen.',
      'A dragon who just wants to file their taxes peacefully while annoying adventurers keep invading the cave.',
      'Two time travelers who keep arriving at the same diner five minutes apart to steal the last slice of pie.'
    ]
  },
  {
    id: 'space-opera',
    name: 'Space Opera',
    tagline: 'Intergalactic armada, alien cantinas & cosmic relics',
    icon: 'Rocket',
    accentColor: 'from-indigo-600 to-violet-800',
    borderHover: 'hover:border-indigo-400',
    bgLight: 'bg-indigo-600/10 text-indigo-300 border-indigo-500/30',
    artStylePrompt: 'Cinematic cosmic sci-fi comic art, glowing warp engines, sprawling alien starbases, nebulae starfields, retro-futuristic pressure suits, laser fire streaks, grand scale cinematic panels',
    narrativeTropes: [
      'Engaging hyperdrive right as the missile locks on',
      'An alien smuggler offers a dubious trade in an asteroid cantina',
      'Discovering a derelict generation ship with one remaining transmission',
      'Fleet standoff above a newly discovered mineral planet'
    ],
    samplePrompts: [
      'A crew of galactic junk scavengers salvage an imperial flagship and accidentally trigger its doomsday AI.',
      'An interstellar diplomat must survive a crash-landing on a planet where sound is physically weaponized.',
      'Bounty hunters pursuing a shapeshifting alien aboard a luxury cruise liner crossing Saturn\'s rings.'
    ]
  }
];

export const CHARACTER_ARCHETYPES: CharacterArchetype[] = [
  {
    id: 'chosen-one',
    name: 'The Reluctant Chosen One',
    category: 'protagonist',
    tagline: 'Destined for greatness, but haunted by self-doubt and burdened by duty',
    behaviorPrompt: 'Acts with reluctant courage. Hesitates at first but stands firm when innocent lives are in danger. Shows vulnerability, heart, and sudden bursts of hidden power.',
    dialogueStyle: 'Earnest, grounded, sometimes overwhelmed, punctuated by fierce determination when pushed to the limit.',
    suggestedVoice: 'Kore',
    icon: 'Crown',
    signatureQuote: '"I never asked for this prophecy, but I\'m the only one standing between them and the dark."'
  },
  {
    id: 'cynical-antihero',
    name: 'The Cynical Anti-Hero',
    category: 'protagonist',
    tagline: 'A world-weary rogue with a strict personal code and dry wit',
    behaviorPrompt: 'Pragmatic, cynical, moves through the shadows. Pretends not to care while quietly taking the biggest risks to protect others. Never plays by official rules.',
    dialogueStyle: 'Biting sarcasm, gravelly deadpan one-liners, concise, refuses to indulge in sentimental speeches.',
    suggestedVoice: 'Fenrir',
    icon: 'Sword',
    signatureQuote: '"Play by the rules and you die like a hero. I prefer staying alive."'
  },
  {
    id: 'eccentric-sidekick',
    name: 'The Comic Relief / Sidekick',
    category: 'supporting',
    tagline: 'Wildly expressive, panic-prone, yet unexpectedly clutch with bizarre luck',
    behaviorPrompt: 'Fidgety, speaks before thinking, overreacts comically to danger. Often saves the day through sheer accident or an unorthodox flash of inspiration.',
    dialogueStyle: 'Fast-paced, high energy, filled with humorous analogies, nervous chatter, and accidental epiphanies.',
    suggestedVoice: 'Puck',
    icon: 'Zap',
    signatureQuote: '"On a scale from 1 to \'we are completely doomed\', where does pressing this red button land?!"'
  },
  {
    id: 'mastermind-villain',
    name: 'The Mastermind Villain',
    category: 'antagonist',
    tagline: 'Calculated, articulate, viewing the world as an intellectual chessboard',
    behaviorPrompt: 'Unflappable, elegant, always three moves ahead. Disdains brute force when psychological dominance and grand theatrical strategy can break the hero\'s spirit.',
    dialogueStyle: 'Sophisticated, chillingly calm, polite condescension, dramatic philosophical speeches about destiny and power.',
    suggestedVoice: 'Charon',
    icon: 'Flame',
    signatureQuote: '"You thought this was a battle of strength? How quaint. You walked into checkmate forty moves ago."'
  },
  {
    id: 'wise-mentor',
    name: 'The Mystical Mentor',
    category: 'supporting',
    tagline: 'A veteran of past wars who speaks in riddles and unleashes jaw-dropping power',
    behaviorPrompt: 'Serene, observant, rarely speaks without purpose. Guides the pupil to find their own answers rather than spoon-feeding solutions. Can shatter mountains when provoked.',
    dialogueStyle: 'Measured, poetic, enigmatic proverbs, quiet gravitas with an undercurrent of dry, gentle amusement.',
    suggestedVoice: 'Zephyr',
    icon: 'Sparkles',
    signatureQuote: '"The sword strikes what the eye sees; the spirit strikes what the shadow hides."'
  },
  {
    id: 'mad-tech-genius',
    name: 'The Mad Tech Prodigy',
    category: 'supporting',
    tagline: 'Fast-talking inventor whose contraptions are 50% genius and 50% imminent explosion',
    behaviorPrompt: 'Manic curiosity, constantly tweaking gadgets, distracted by shiny mechanics. Ignores safety protocols in pursuit of breakthrough science.',
    dialogueStyle: 'Rapid-fire technobabble, passionate bursts of insight, interrupts themselves to recalibrate gadgets.',
    suggestedVoice: 'Neo',
    icon: 'Wrench',
    signatureQuote: '"Theoretical safety margins are merely suggestions for people who lack vision!"'
  },
  {
    id: 'rogue-trickster',
    name: 'The Cunning Trickster',
    category: 'supporting',
    tagline: 'A slippery specialist in illusions, heists, and unpredictable double-plays',
    behaviorPrompt: 'Charming, elusive, changes sides to keep things interesting. Always has a smoke bomb, lockpick, or secret clause tucked in their sleeve.',
    dialogueStyle: 'Playful, seductive, teasing questions, smooth confidence with a wry knowing smirk.',
    suggestedVoice: 'Xylia',
    icon: 'Eye',
    signatureQuote: '"Trust is such an expensive luxury, darling. Why don\'t we barter in results instead?"'
  },
  {
    id: 'stoic-bruiser',
    name: 'The Stoic Bruiser',
    category: 'supporting',
    tagline: 'An immovable mountain of few words, unstoppable strength, and fierce loyalty',
    behaviorPrompt: 'Stands as an impenetrable shield. Speaks very rarely, but every action is decisive and devastating. Has a surprisingly gentle heart for fragile things.',
    dialogueStyle: 'Short, blunt, monosyllabic declarations, profound weight behind every few words.',
    suggestedVoice: 'Waven',
    icon: 'Shield',
    signatureQuote: '"I am the wall. Nothing passes."'
  }
];
