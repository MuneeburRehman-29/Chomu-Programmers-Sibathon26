'use client'
import { useState } from 'react';
import { analyzeTicket, saveTicket } from './actions';
import InputSection from './components/InputSection';
import ResultsDisplay from './components/ResultsDisplay';

export default function Home() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [originalText, setOriginalText] = useState("");

async function handleAnalyze(text) {
  setLoading(true);
  setOriginalText(text);
  try {
    const result = await analyzeTicket(text);
    console.log("analyzeTicket result:", result);
    if (result.success && result.data?.drafts) {
      setData(result.data);
    } else {
      alert(result.error || "AI returned invalid data. Try again.");
    }
  } catch (err) {
    console.error("Client-side error:", err);
    alert("Something went wrong: " + err.message);
  }
  setLoading(false);
}

  async function handleSave(selectedText) {
    await saveTicket({
      originalText: originalText,
      urgency: data.urgency,
      sentiment: data.sentiment,
      drafts: data.drafts,
      finalSelection: selectedText
    });
    alert("Saved to Database!");
    setData(null); // Reset
  }

  return (
    <main className="p-10 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Smart-Response HQ (Backend Integration)</h1>
      
      <InputSection onAnalyze={handleAnalyze} loading={loading} />
      
      {data && (
        <ResultsDisplay data={data} onSave={handleSave} />
      )}
    </main>
  );
}