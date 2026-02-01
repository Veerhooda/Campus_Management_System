
import { GoogleGenAI, Type } from "@google/genai";
import { EventData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const smartFillEvent = async (prompt: string): Promise<Partial<EventData>> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Extract event details from this description and return it as JSON: "${prompt}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            startDate: { type: Type.STRING, description: "ISO 8601 format" },
            endDate: { type: Type.STRING, description: "ISO 8601 format" },
            isAllDay: { type: Type.BOOLEAN },
            building: { type: Type.STRING },
            room: { type: Type.STRING },
            audience: { 
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          }
        }
      }
    });

    const text = response.text;
    if (!text) return {};
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini AI Smart Fill Error:", error);
    return {};
  }
};
