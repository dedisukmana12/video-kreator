export interface ComicCharacter {
  name: string;
  archetypeId: string;
  archetypeName: string;
  dialogueStyle?: string;
  suggestedVoice?: string;
}

export interface Panel {
  id: string;
  description: string;
  dialogue: string;
  speakerName?: string;
  speakerArchetype?: string;
  actionDescription?: string;
  soundEffect?: string;
  voiceName?: string;
  imageUrl?: string;
  videoUrl?: string;
  videoRef?: any; // Internal reference for Veo stitching
  isGeneratingImage: boolean;
  isGeneratingVideo: boolean;
}

export interface ComicScript {
  title: string;
  synopsis?: string;
  genre: string;
  genreName: string;
  genreArtStyle: string;
  characters: ComicCharacter[];
  panels: Panel[];
}

export enum AppState {
  HOME = 'HOME',
  CREATING = 'CREATING',
  ANIMATING_PHOTO = 'ANIMATING_PHOTO'
}
