
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateCampusAssistantResponse = async (prompt: string): Promise<string> => {
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: "You are a helpful AIT Smart Campus Assistant. You provide information about campus life, academic schedules, library resources, and administrative procedures. Keep your tone professional, encouraging, and informative. If asked about specific grades or private data, explain that you are an AI and cannot access individual private student records directly for security reasons.",
        temperature: 0.7,
      },
    });
    return response.text || "I'm sorry, I couldn't process that request right now.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "The assistant is currently taking a break. Please try again in a moment.";
  }
};
