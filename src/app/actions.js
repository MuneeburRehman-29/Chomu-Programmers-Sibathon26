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
3. "summary": (string, 1-2 sentence summary of the customer's core issue/feedback)
4. "drafts": (object with keys: "empathetic", "professional", "concise").
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

    // Normalize drafts: ensure each draft is an object with { preview, full }
    for (const key of Object.keys(data.drafts)) {
      const val = data.drafts[key];
      if (typeof val === "string") {
        data.drafts[key] = {
          preview: val.length > 120 ? val.substring(0, 120) + "..." : val,
          full: val,
        };
      }
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
      email: ticketData.email,
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

// Create a pending ticket (no AI analysis yet)
export async function createPendingTicket(email, text) {
  const { error } = await supabase.from("tickets").insert([
    {
      email,
      customer_text: text,
      urgency: null,
      sentiment: null,
      drafts: null,
      final_response: null,
    },
  ]);

  if (error) {
    console.error("DB Error:", error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

// Update a ticket with AI analysis results
export async function updateTicketAnalysis(ticketId, analysis) {
  const { error } = await supabase
    .from("tickets")
    .update({
      urgency: analysis.urgency,
      sentiment: analysis.sentiment,
      summary: analysis.summary,
      drafts: analysis.drafts,
    })
    .eq("id", ticketId);

  if (error) {
    console.error("DB Error:", error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

// Fetch all tickets from the database
export async function fetchAllTickets() {
  const { data, error } = await supabase
    .from("tickets")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("DB Error:", error);
    return { success: false, error: error.message };
  }

  return { success: true, data };
}
