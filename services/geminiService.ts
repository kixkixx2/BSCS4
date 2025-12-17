import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { SYSTEM_INSTRUCTION } from '../constants';

// We initialize this lazily to allow for checking if the key exists
let genAI: GoogleGenAI | null = null;
let chatSession: Chat | null = null;

const initializeAI = () => {
  const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
  
  if (!apiKey || apiKey === 'PLACEHOLDER_API_KEY') {
    console.warn("Gemini API Key is missing or placeholder. AI features will be disabled.");
    return null;
  }
  if (!genAI) {
    genAI = new GoogleGenAI({ apiKey });
  }
  return genAI;
};

export const startChatSession = async () => {
  const ai = initializeAI();
  if (!ai) throw new Error("API Key missing");

  chatSession = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      temperature: 0.7,
    }
  });
  
  return chatSession;
};

export const sendMessageToGemini = async (message: string): Promise<string> => {
  try {
    if (!chatSession) {
      await startChatSession();
    }
    
    if (!chatSession) {
        throw new Error("Failed to initialize chat session");
    }

    const response: GenerateContentResponse = await chatSession.sendMessage({ message });
    return response.text || "System Error: Empty response from core.";
  } catch (error: any) {
    console.error("Gemini Error:", error);
    
    // Check if it's an API key issue
    if (error?.message?.includes("API Key") || !process.env.API_KEY || process.env.API_KEY === 'PLACEHOLDER_API_KEY') {
      return "⚠️ AI CORE OFFLINE: Please set your Gemini API key in .env.local file.\n\nTo enable AI features:\n1. Get a key from https://aistudio.google.com/app/apikey\n2. Add to .env.local: GEMINI_API_KEY=your_key_here\n3. Rebuild and redeploy";
    }
    
    return `System Alert: Connection error - ${error?.message || 'Unknown error'}`;
  }
};