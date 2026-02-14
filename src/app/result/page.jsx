"use client";

import ResultsDisplay from "@/components/ResultsDisplay";
import { dummyResponse } from "@/app/fakeData";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function ResultPage() {
  const [data, setData] = useState(null);
  const [originalText, setOriginalText] = useState("");

  useEffect(() => {
    // Load real analysis results from sessionStorage, fall back to dummy data
    const stored = sessionStorage.getItem("analysisResult");
    const storedText = sessionStorage.getItem("originalText");
    if (stored) {
      setData(JSON.parse(stored));
      setOriginalText(storedText || "");
    } else {
      setData(dummyResponse);
    }
  }, []);

  if (!data) {
    return (
      <main className="min-h-screen bg-linear-to-br from-primary-bg via-gray-900 to-black flex flex-col items-center justify-center p-6 relative overflow-hidden">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-linear-to-br from-primary-bg via-gray-900 to-black flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-200 h-150 bg-accent/20 rounded-full blur-[100px] opacity-50 pointer-events-none" />
      <div className="w-full max-w-xl relative z-10 bg-secondary-bg/80 backdrop-blur-xl border border-white/5 rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8 flex flex-col gap-4 sm:gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl sm:text-3xl font-bold text-accent">Results</h1>
          <Link
            href="/admin/dashboard"
            className="text-text-muted hover:text-accent text-sm transition-colors"
          >
            ← Dashboard
          </Link>
        </div>
        <ResultsDisplay data={data} />
        <Link href="/customer" className="text-accent hover:text-accent-hover hover:underline text-center text-sm transition-colors">
          ← Back to Feedback
        </Link>
      </div>
    </main>
  );
}
