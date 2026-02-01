
import { GoogleGenAI, Type } from "@google/genai";
import { Ticket } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export async function analyzeTicketsWithAI(tickets: Ticket[]): Promise<string> {
  try {
    const ticketData = tickets.map(t => ({
      id: t.id,
      cat: t.category,
      sub: t.subject,
      desc: t.description,
      priority: t.priority,
      status: t.status
    }));

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analyze these campus grievance tickets and provide a concise (max 3 sentences) summary of common issues and any urgent recommendations for the administration. Data: ${JSON.stringify(ticketData)}`,
      config: {
        temperature: 0.7,
      },
    });

    return response.text || "Unable to generate AI analysis at this time.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error connecting to AI service. Please check your network or API configuration.";
  }
}
