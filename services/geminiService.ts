import { GoogleGenAI, Type, Modality } from "@google/genai";
import { ComicScript, Panel } from "../types";
import { ComicGenre, CharacterArchetype } from "../data/comicPresets";

// Note: process.env.API_KEY is pre-configured
const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export interface GenerateComicOptions {
  prompt: string;
  genre: ComicGenre;
  characters: Array<{
    name: string;
    archetype: CharacterArchetype;
    customTrait?: string;
  }>;
}

export const generateComicScript = async (options: GenerateComicOptions): Promise<ComicScript> => {
  const { prompt, genre, characters } = options;
  const ai = getAI();

  const characterDescriptions = characters.map((c, i) => {
    return `Character ${i + 1}: "${c.name}"
- Archetype: ${c.archetype.name} (${c.archetype.category})
- Personality & Behavior: ${c.archetype.behaviorPrompt} ${c.customTrait ? `Additional trait: ${c.customTrait}` : ''}
- Dialogue Voice & Style: ${c.archetype.dialogueStyle}
- Suggested Voice: ${c.archetype.suggestedVoice}
- Iconic Quote Style: ${c.archetype.signatureQuote}`;
  }).join("\n\n");

  const promptContent = `You are a master comic book writer and visual director. Create a high-impact, gripping 4-panel comic script.

GENRE & ATMOSPHERE:
- Genre: ${genre.name} (${genre.tagline})
- Key Narrative Tropes to weave in: ${genre.narrativeTropes.join(', ')}
- Visual Art Style: ${genre.artStylePrompt}

CAST OF CHARACTERS & ARCHETYPES:
${characterDescriptions}

USER STORY CONCEPT / THEME:
"${prompt}"

CRITICAL INSTRUCTIONS:
1. Adhere strictly to the conventions, dramatic pacing, and tropes of the chosen ${genre.name} genre.
2. Character Archetype Alignment: Every action, reaction, and line of dialogue MUST authentically match the character's assigned archetype and dialogue style. A cynical anti-hero must be deadpan and sardonic, a mastermind villain must be chillingly articulate, a comic relief must have manic humor and panic, and a wise mentor must speak with measured gravitas.
3. Panels: Exactly 4 sequential panels forming a punchy arc (Setup -> Complication -> Climax -> Resolution/Cliffhanger).
4. For each panel:
   - Provide "speakerName" (the name of the character speaking, or "Narrator" / sound cue).
   - Provide "speakerArchetype" (the archetype title of the speaker).
   - Provide "actionDescription" (brief summary of character actions and physical confrontation).
   - Provide "dialogue" (concise, memorable, comic-strip punchy dialogue adhering strictly to their archetype voice).
   - Provide "soundEffect" (a classic comic book sound effect like "KAPOW!", "FWSSSH!", "CLICK-CLACK!", "BZZZT!", "BOOM!", or empty if none).
   - Provide "voiceName" (pick best matching voice from: Kore, Xylia, Neo, Waven, Puck, Charon, Fenrir, Zephyr).
   - Provide "description" (a visually rich, detailed panel scene description for an image generator including character positioning, camera angle, facial expressions, and lighting matching the ${genre.name} style).`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: promptContent,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          synopsis: { type: Type.STRING },
          genre: { type: Type.STRING },
          genreName: { type: Type.STRING },
          genreArtStyle: { type: Type.STRING },
          characters: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                archetypeId: { type: Type.STRING },
                archetypeName: { type: Type.STRING },
                dialogueStyle: { type: Type.STRING },
                suggestedVoice: { type: Type.STRING }
              },
              required: ["name", "archetypeId", "archetypeName"]
            }
          },
          panels: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                speakerName: { type: Type.STRING },
                speakerArchetype: { type: Type.STRING },
                actionDescription: { type: Type.STRING },
                description: { type: Type.STRING },
                dialogue: { type: Type.STRING },
                soundEffect: { type: Type.STRING },
                voiceName: { type: Type.STRING }
              },
              required: ["id", "description", "dialogue"]
            }
          }
        },
        required: ["title", "panels"]
      }
    }
  });

  const parsed = JSON.parse(response.text || '{}');

  // Fill in guarantees in case the model omitted defaults
  return {
    title: parsed.title || "Untitled Comic",
    synopsis: parsed.synopsis || prompt,
    genre: parsed.genre || genre.id,
    genreName: parsed.genreName || genre.name,
    genreArtStyle: parsed.genreArtStyle || genre.artStylePrompt,
    characters: parsed.characters && parsed.characters.length > 0 ? parsed.characters : characters.map(c => ({
      name: c.name,
      archetypeId: c.archetype.id,
      archetypeName: c.archetype.name,
      dialogueStyle: c.archetype.dialogueStyle,
      suggestedVoice: c.archetype.suggestedVoice
    })),
    panels: (parsed.panels || []).map((p: any, idx: number) => ({
      id: p.id || `panel-${idx + 1}`,
      speakerName: p.speakerName || characters[idx % characters.length]?.name || "Character",
      speakerArchetype: p.speakerArchetype || characters[idx % characters.length]?.archetype.name || "",
      actionDescription: p.actionDescription || "",
      description: p.description || "",
      dialogue: p.dialogue || "",
      soundEffect: p.soundEffect || "",
      voiceName: p.voiceName || characters[idx % characters.length]?.archetype.suggestedVoice || "Kore",
      isGeneratingImage: false,
      isGeneratingVideo: false
    }))
  };
};

export const generatePanelImage = async (description: string, genreArtStyle?: string): Promise<string> => {
  const ai = getAI();
  const artPrompt = genreArtStyle 
    ? `${genreArtStyle}. Scene: ${description}. Clean lines, vibrant comic art, expressive characters, no speech bubbles or text on the illustration.`
    : `Comic book style illustration of: ${description}. Vibrant colors, clean lines, high quality graphic novel art, no text on image.`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        { text: artPrompt }
      ]
    },
    config: {
      imageConfig: { aspectRatio: "1:1" }
    }
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  throw new Error("No image generated");
};

export const animateWithVeo = async (
  prompt: string, 
  base64Image?: string,
  onStatusChange?: (msg: string) => void
): Promise<{ url: string, ref: any }> => {
  const ai = getAI();
  onStatusChange?.("Initializing cinematic engine...");
  
  try {
    let operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: prompt,
      ...(base64Image ? {
        image: {
          imageBytes: base64Image.split(',')[1],
          mimeType: 'image/png'
        }
      } : {}),
      config: {
        numberOfVideos: 1,
        resolution: '720p',
        aspectRatio: '16:9'
      }
    });

    onStatusChange?.("Drawing temporal frames...");
    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 8000));
      operation = await ai.operations.getVideosOperation({ operation: operation });
      onStatusChange?.("Rendering cinematic sequence... This may take a moment.");
    }

    const videoRef = operation.response?.generatedVideos?.[0]?.video;
    const downloadLink = videoRef?.uri;
    const res = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
    const blob = await res.blob();
    return {
      url: URL.createObjectURL(blob),
      ref: videoRef
    };
  } catch (err: any) {
    if (err?.message?.includes("Requested entity was not found") && window.aistudio) {
      await window.aistudio.openSelectKey();
    }
    throw err;
  }
};

/**
 * Stitches multiple panel videos into one using the Veo extension feature.
 * It takes the first video and sequentially extends it with the content of subsequent panels.
 */
export const stitchVideos = async (
  panels: Panel[],
  onStatusChange?: (msg: string) => void
): Promise<string> => {
  const ai = getAI();
  let currentVideoRef = panels[0].videoRef;

  if (!currentVideoRef) throw new Error("Panel 1 must be animated first.");

  // Chain extensions for Panels 2, 3, 4...
  for (let i = 1; i < panels.length; i++) {
    const panel = panels[i];
    onStatusChange?.(`Stitching Scene ${i + 1}: ${panel.dialogue}...`);
    
    let operation = await ai.models.generateVideos({
      model: 'veo-3.1-generate-preview',
      prompt: `Continuity transition: ${panel.description}. Dialogue: ${panel.dialogue}`,
      video: currentVideoRef,
      config: {
        numberOfVideos: 1,
        resolution: '720p',
        aspectRatio: '16:9'
      }
    });

    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 10000));
      operation = await ai.operations.getVideosOperation({ operation: operation });
      onStatusChange?.(`Rendering Scene ${i + 1} integration...`);
    }

    currentVideoRef = operation.response?.generatedVideos?.[0]?.video;
  }

  onStatusChange?.("Finalizing full comic movie...");
  const downloadLink = currentVideoRef?.uri;
  const res = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
  const blob = await res.blob();
  return URL.createObjectURL(blob);
};

export const speakDialogue = async (text: string, voice: string = 'Kore'): Promise<string> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text: text }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: voice },
        },
      },
    },
  });

  const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  if (!base64Audio) throw new Error("Audio generation failed");
  return base64Audio;
};
