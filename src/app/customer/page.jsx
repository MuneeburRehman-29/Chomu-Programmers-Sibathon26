"use client";

import InputSection from "@/components/InputSection";
import { useState } from "react";
import { useFeedback } from "@/context/FeedbackContext";
import { analyzeTicket, submitAnalyzedTicket } from "@/app/actions";
import Link from "next/link";

export default function CustomerPage() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const { addFeedback } = useFeedback();

  const handleSubmit = async (text, email) => {
    setLoading(true);
    setError("");

    try {
      // Step 1: Run AI analysis
      const analysis = await analyzeTicket(text);
      if (!analysis.success) {
        setError(analysis.error || "Analysis failed. Please try again.");
        setLoading(false);
        return;
      }

      // Step 2: Save fully analyzed ticket to database
      const saved = await submitAnalyzedTicket(email, text, analysis.data);
      if (!saved.success) {
        setError(saved.error || "Failed to save. Please try again.");
        setLoading(false);
        return;
      }

      // Step 3: Add to in-memory context
      addFeedback(email, text);

      setLoading(false);
      setSubmitted(true);
    } catch (err) {
      console.error("Submission error:", err);
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <main className="min-h-screen bg-linear-to-br from-primary-bg via-gray-900 to-black flex flex-col items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-200 h-150 bg-accent/20 rounded-full blur-[100px] opacity-50 pointer-events-none" />
        <div className="w-full max-w-lg relative z-10 bg-secondary-bg/80 backdrop-blur-xl border border-white/5 rounded-2xl shadow-2xl p-6 sm:p-8 md:p-12 flex flex-col items-center gap-5 sm:gap-6 text-center">
          <div className="w-20 h-20 rounded-full bg-accent/20 flex items-center justify-center text-5xl">
            ✅
          </div>
          <h1 className="text-3xl font-bold text-text-primary">Thank You!</h1>
          <p className="text-text-secondary text-lg">
            Your feedback has been submitted successfully. Our team will review
            it shortly.
          </p>
          <Link
            href="/"
            className="mt-4 bg-accent hover:bg-accent-hover text-text-on-accent font-bold py-3 px-8 rounded-xl transition-all duration-200 shadow-md"
          >
            Back to Home
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-linear-to-br from-primary-bg via-gray-900 to-black flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-200 h-150 bg-accent/20 rounded-full blur-[100px] opacity-50 pointer-events-none" />

      <div className="w-full max-w-4xl relative z-10 max-h-full">
        <div className="bg-secondary-bg/80 backdrop-blur-xl border border-white/5 rounded-2xl shadow-2xl p-5 sm:p-8 md:p-10 flex flex-col gap-4 sm:gap-6 md:gap-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1 sm:space-y-2">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-linear-to-r from-white to-gray-400 tracking-tight">
                Submit Feedback
              </h1>
              <p className="text-text-secondary text-sm sm:text-base font-medium">
                Tell us about your experience — we&apos;re listening.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/admin"
                className="text-text-muted hover:text-accent text-sm transition-colors"
              >
                Admin
              </Link>
              <span className="text-text-muted">·</span>
              <Link
                href="/"
                className="text-text-muted hover:text-accent text-sm transition-colors"
              >
                Home
              </Link>
            </div>
          </div>

          <InputSection onAnalyze={handleSubmit} loading={loading} />

          {error && (
            <div className="bg-red-900/20 border border-red-800 rounded-xl p-4 text-red-400 text-sm">
              {error}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
