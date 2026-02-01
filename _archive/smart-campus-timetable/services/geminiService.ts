
import { GoogleGenAI, Type } from "@google/genai";
import { ScheduleEvent } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getScheduleSummary = async (events: ScheduleEvent[]): Promise<string> => {
  const prompt = `Analyze this student weekly schedule and provide a high-level summary. 
  Highlight the busiest day and any potential bottlenecks or advice for the student.
  
  Schedule Data:
  ${JSON.stringify(events, null, 2)}
  
  Please provide a concise, friendly summary in 3-4 sentences.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 0 }
      }
    });
    return response.text || "Could not generate summary.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error communicating with AI assistant.";
  }
};
