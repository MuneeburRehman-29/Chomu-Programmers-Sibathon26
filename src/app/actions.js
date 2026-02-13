"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { supabase } from "@/lib/supabase";

// Setup Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  generationConfig: { responseMimeType: "application/json" }, // Force JSON response
});

// ACTION 1: Analyze the text
export async function analyzeTicket(text) {
  if (!text) return { error: "No text provided" };

  try {
    const prompt = `
  SYSTEM INSTRUCTIONS:
  You are a customer support AI. 
  Return a JSON object with exactly these keys:
      1. "urgency": (integer 0-100)
      2. "sentiment": (string, e.g., "Angry", "Frustrated", "Calm")
      3. "drafts": (object with keys: "empathetic", "professional", "concise").
         - "empathetic": A very apologetic response.
         - "professional": A solution-focused response.
         - "concise": A short, direct response (max 2 sentences).

  USER INPUT TO ANALYZE:
  """${text}"""
`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const textResponse = response.text();

    // Parse the JSON string from Gemini
    const data = JSON.parse(textResponse);

    // Simple validation
    if (!data.drafts || !data.drafts.empathetic) {
      throw new Error("AI returned incomplete data");
    }
    return { success: true, data: data };
  } catch (error) {
    console.error("Gemini AI Error:", error);
    return { success: false, error: "Failed to generate response" };
  }
}

// Save to Database
export async function saveTicket(ticketData) {
  const { error } = await supabase.from("tickets").insert([
    {
      customer_text: ticketData.originalText,
      urgency: ticketData.urgency,
      sentiment: ticketData.sentiment,
      drafts: ticketData.drafts,
      final_response: ticketData.finalSelection,
    },
  ]);

  if (error) {
    console.error("DB Error:", error);
    return { success: false, error: error.message };
  }

  return { success: true };
}
