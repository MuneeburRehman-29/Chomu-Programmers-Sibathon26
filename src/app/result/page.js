"use client";

import ResultsDisplay from "../../components/ResultsDisplay";
import { dummyResponse } from "../fakeData";
import Link from "next/link";

export default function ResultPage() {
  const data = dummyResponse;

  return (
    <main className="min-h-screen bg-primary-bg flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-xl bg-secondary-bg rounded-2xl shadow-lg p-8 flex flex-col gap-6">
        <h1 className="text-3xl font-bold text-accent mb-2 text-center">Results</h1>
        <ResultsDisplay data={data} />
        <Link href="/input" className="mt-6 text-accent hover:text-accent-hover hover:underline text-center transition-colors">Back to Input</Link>
      </div>
    </main>
  );
}
