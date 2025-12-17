import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { SYSTEM_INSTRUCTION } from '../constants';

// We initialize this lazily to allow for checking if the key exists
let genAI: GoogleGenAI | null = null;
let chatSession: Chat | null = null;

const initializeAI = () => {
  if (!process.env.API_KEY) {
    console.warn("Gemini API Key is missing. AI features will be disabled.");
    return null;
  }
  if (!genAI) {
    genAI = new GoogleGenAI({ apiKey: process.env.API_KEY });
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
  } catch (error) {
    console.error("Gemini Error:", error);
    return "System Alert: Connection to AI Core unstable. Please check API credentials.";
  }
};