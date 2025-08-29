import { GoogleGenAI } from "@google/genai";

// API key is automatically available as process.env.API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export const generateSecurityTip = async (): Promise<string> => {
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
    // Return a reliable default tip on error
    return "Enable two-factor authentication (2FA) on your account for an extra layer of security.";
  }
};
