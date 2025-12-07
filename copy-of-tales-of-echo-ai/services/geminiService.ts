import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

let client: GoogleGenAI | null = null;

export const initializeGemini = () => {
  if (!process.env.API_KEY) {
    console.error("API_KEY is missing from environment variables.");
    return;
  }
  client = new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const generateResponse = async (
  prompt: string, 
  history: { role: string; parts: { text: string }[] }[] = []
): Promise<string> => {
  if (!client) {
    initializeGemini();
  }
  if (!client) {
    return "Error: AI Service not initialized. Please check API Key.";
  }

  try {
    const model = client.models;
    
    // Using flash model for speed and efficiency as requested
    const response: GenerateContentResponse = await model.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        ...history.map(h => ({ role: h.role, parts: h.parts })),
        { role: 'user', parts: [{ text: prompt }] }
      ],
      config: {
        systemInstruction: "You are Echo, a highly advanced music production assistant and audio engineer. You are helpful, concise, and expert in music theory, production software (DAWs), and audio processing.",
      }
    });

    return response.text || "I couldn't generate a response at this time.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I encountered an error processing your request. Please try again.";
  }
};