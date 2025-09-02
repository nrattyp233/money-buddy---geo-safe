import { GoogleGenAI } from "@google/genai";

// Lazily create the client only if an API key is available to avoid crashing at import time
const getAiClient = () => {
  const key = (process.env.API_KEY || process.env.GEMINI_API_KEY) as string | undefined;
  if (!key) return undefined;
  try {
    return new GoogleGenAI({ apiKey: key });
  } catch (e) {
    console.error("Failed to initialize GoogleGenAI:", e);
    return undefined;
  }
};

export const generateSecurityTip = async (): Promise<string> => {
  const ai = getAiClient();
  if (!ai) {
    // No key available; skip generating any content to avoid mock data
    return "";
  }
  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: 'Generate a security tip.',
        config: {
            systemInstruction: "You are a cybersecurity expert providing a single, concise security tip for a user of a modern financial/payment app. The tip must be a single sentence, easy to understand, and actionable. Do not add any conversational filler or introductory text. Just provide the tip.",
            maxOutputTokens: 60,
            thinkingConfig: { thinkingBudget: 30 },
            temperature: 0.9,
        }
    });
    
    let tip = response.text.trim();
    // Remove potential leading/trailing quotes
    if ((tip.startsWith('"') && tip.endsWith('"')) || (tip.startsWith("'") && tip.endsWith("'"))) {
      tip = tip.substring(1, tip.length - 1);
    }
    
    return tip;
  } catch (error) {
    console.error("Error generating security tip from Gemini:", error);
    // On error, return empty to avoid mock data
    return "";
  }
};
