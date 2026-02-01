
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

export const generateSmartNotification = async (prompt: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate a realistic campus notification based on this theme: ${prompt}. Return a JSON object representing a notification.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            content: { type: Type.STRING },
            category: { type: Type.STRING, enum: ['Academic', 'Events', 'System', 'Community'] },
            priority: { type: Type.STRING, enum: ['High', 'Normal'] },
            icon: { type: Type.STRING, description: 'A material symbol name like "school", "warning", "event", "forum", "assignment"' }
          },
          required: ["title", "content", "category", "icon"]
        }
      }
    });

    const data = JSON.parse(response.text);
    return {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: 'Just now',
      isRead: false
    };
  } catch (error) {
    console.error("Error generating notification:", error);
    return null;
  }
};
