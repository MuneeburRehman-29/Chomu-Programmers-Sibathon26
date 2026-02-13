"use client";

import { use } from "react";
import Link from "next/link";
import { dummyResponse } from "../../../fakeData";

export default function DraftPage({ params }) {
  const { key } = use(params);
  const draft = dummyResponse.drafts[key];

  if (!draft) {
    return (
      <main className="min-h-screen bg-primary-bg flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-xl bg-secondary-bg rounded-2xl shadow-lg p-8 text-center">
          <h1 className="text-2xl font-bold text-text-primary mb-4">Draft not found</h1>
          <Link href="/result" className="text-accent hover:text-accent-hover hover:underline transition-colors">
            Back to Results
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-primary-bg flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-secondary-bg rounded-2xl shadow-lg p-8 flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-accent">
            {key} draft
          </span>
          <Link href="/result" className="text-text-muted hover:text-accent text-sm transition-colors">
            &larr; Back to Results
          </Link>
        </div>
        <div className="border-t border-elevated pt-6">
          <p className="text-text-primary text-base leading-relaxed whitespace-pre-line">
            {draft.full}
          </p>
        </div>
        <button
          onClick={() => navigator.clipboard.writeText(draft.full)}
          className="self-end bg-accent hover:bg-accent-hover active:bg-accent-active text-text-on-accent font-bold py-2 px-5 rounded-xl transition-all duration-200 shadow-md"
        >
          Copy to Clipboard
        </button>
      </div>
    </main>
  );
}
