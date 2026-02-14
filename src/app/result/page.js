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
      <main className="min-h-screen bg-primary-bg flex flex-col items-center justify-center p-6">
        <p className="text-text-secondary">Loading results...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-primary-bg flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-xl bg-secondary-bg rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 flex flex-col gap-4 sm:gap-6 relative">
        {/* Back to Dashboard icon */}
        <Link
          href="/admin/dashboard"
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-elevated transition-colors group"
          title="Back to Dashboard"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-text-muted group-hover:text-accent transition-colors"
          >
            <path d="M19 12H5" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
        </Link>

        <h1 className="text-3xl font-bold text-accent mb-2 text-center">Results</h1>
        <ResultsDisplay data={data} />
        <Link href="/customer" className="mt-6 text-accent hover:text-accent-hover hover:underline text-center transition-colors">
          Back to Input
        </Link>
      </div>
    </main>
  );
}
