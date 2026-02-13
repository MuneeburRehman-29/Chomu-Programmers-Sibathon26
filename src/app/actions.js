"use server";

import Groq from "groq-sdk";
import { supabase } from "@/app/lib/supabase";

// Setup Groq
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// ACTION 1: Analyze the text
export async function analyzeTicket(text) {
  if (!text) return { success: false, error: "No text provided" };

  try {
    const result = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: `You are a customer support AI. 
Return a JSON object with exactly these keys:
1. "urgency": (integer 0-100)
2. "sentiment": (string, e.g., "Angry", "Frustrated", "Calm")
3. "drafts": (object with keys: "empathetic", "professional", "concise").
   - "empathetic": A very apologetic response.
   - "professional": A solution-focused response.
   - "concise": A short, direct response (max 2 sentences).
Return ONLY valid JSON, no extra text.`,
        },
        { role: "user", content: text },
      ],
      response_format: { type: "json_object" },
    });

    const data = JSON.parse(result.choices[0].message.content);

    if (!data.drafts || !data.drafts.empathetic) {
      throw new Error("AI returned incomplete data");
    }
    return { success: true, data };
  } catch (error) {
    console.error("Groq AI Error:", error);
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
