"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useFeedback } from "@/context/FeedbackContext";
import { analyzeTicket, updateTicketAnalysis } from "@/app/actions";
import ResultsDisplay from "@/components/ResultsDisplay";

export default function FeedbackDetailPage({ params }) {
  const { id } = use(params);
  const { getFeedbackById, updateFeedbackAnalysis } = useFeedback();
  const [feedback, setFeedback] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState("");
  const [dbTicket, setDbTicket] = useState(null);
  const [analysisData, setAnalysisData] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const router = useRouter();

  // Auth guard — check localStorage with expiry
  useEffect(() => {
    try {
      const raw = localStorage.getItem("adminAuth");
      if (!raw) { router.replace("/admin"); return; }
      const { expiresAt } = JSON.parse(raw);
      if (Date.now() >= expiresAt) {
        localStorage.removeItem("adminAuth");
        router.replace("/admin");
      }
    } catch {
      router.replace("/admin");
    }
  }, [router]);

  // Attempt to load from context first, then DB
  useEffect(() => {
    const ctxFeedback = getFeedbackById(id);
    if (ctxFeedback) {
      setFeedback(ctxFeedback);
      return;
    }

    async function loadFromDb() {
      try {
        const res = await fetch("/api/feedbacks");
        const json = await res.json();
        if (json.success) {
          const found = json.data?.find((t) => String(t.id) === id);
          if (found) {
            setDbTicket(found);
            if (found.drafts && Object.keys(found.drafts).length > 0) {
              setAnalysisData({
                urgency: found.urgency,
                sentiment: found.sentiment,
                drafts: found.drafts,
              });
            }
          } else {
            setNotFound(true);
          }
        } else {
          setNotFound(true);
        }
      } catch (err) {
        console.error("Failed to load ticket:", err);
        setNotFound(true);
      }
    }
    loadFromDb();
  }, [id, getFeedbackById]);

  // Trigger AI analysis for context feedbacks that don't have analysis yet
  useEffect(() => {
    if (!feedback) return;
    if (feedback.analysis) return;

    let cancelled = false;
    async function runAnalysis() {
      setAnalyzing(true);
      try {
        const result = await analyzeTicket(feedback.text);
        if (!cancelled && result.success) {
          // Update local state FIRST, then context — avoids race where
          // context change triggers effect cleanup before setAnalyzing(false)
          setFeedback((prev) => ({ ...prev, analysis: result.data, urgency: result.data.urgency }));
          setAnalyzing(false);
          updateFeedbackAnalysis(feedback.id, result.data);
          sessionStorage.setItem("analysisResult", JSON.stringify(result.data));
          sessionStorage.setItem("originalText", feedback.text);
          sessionStorage.setItem("feedbackEmail", feedback.email);
        } else if (!cancelled) {
          setError(result.error || "Analysis failed");
          setAnalyzing(false);
        }
      } catch (err) {
        if (!cancelled) {
          setError("Analysis error: " + err.message);
          setAnalyzing(false);
        }
      }
    }

    runAnalysis();
    return () => { cancelled = true; };
  }, [feedback?.id, feedback?.analysis, feedback?.text, updateFeedbackAnalysis]);

  // Trigger AI analysis for DB tickets that have no analysis yet (pending tickets)
  useEffect(() => {
    if (!dbTicket) return;
    if (analysisData) return; // already have analysis

    let cancelled = false;
    async function runDbAnalysis() {
      setAnalyzing(true);
      try {
        const result = await analyzeTicket(dbTicket.customer_text);
        if (!cancelled && result.success) {
          setAnalysisData(result.data);
          setAnalyzing(false);
          // Persist analysis back to DB
          try { await updateTicketAnalysis(dbTicket.id, result.data); } catch {}
          sessionStorage.setItem("analysisResult", JSON.stringify(result.data));
          sessionStorage.setItem("originalText", dbTicket.customer_text || "");
          sessionStorage.setItem("feedbackEmail", dbTicket.email || "");
        } else if (!cancelled) {
          setError(result.error || "Analysis failed");
          setAnalyzing(false);
        }
      } catch (err) {
        if (!cancelled) {
          setError("Analysis error: " + err.message);
          setAnalyzing(false);
        }
      }
    }

    runDbAnalysis();
    return () => { cancelled = true; };
  }, [dbTicket, analysisData]);

  // Write to sessionStorage when DB ticket already has analysis (no AI trigger needed)
  useEffect(() => {
    if (!dbTicket || !analysisData) return;
    sessionStorage.setItem("analysisResult", JSON.stringify(analysisData));
    sessionStorage.setItem("originalText", dbTicket.customer_text || "");
    sessionStorage.setItem("feedbackEmail", dbTicket.email || "");
  }, [dbTicket, analysisData]);

  // Write to sessionStorage when context feedback already has analysis
  useEffect(() => {
    if (!feedback?.analysis) return;
    sessionStorage.setItem("analysisResult", JSON.stringify(feedback.analysis));
    sessionStorage.setItem("originalText", feedback.text || "");
    sessionStorage.setItem("feedbackEmail", feedback.email || "");
  }, [feedback?.analysis, feedback?.text, feedback?.email]);

  // Display for DB-sourced ticket
  if (dbTicket) {
    return (
      <main className="min-h-screen bg-primary-bg flex flex-col items-center justify-start p-6 md:p-10">
        <div className="w-full max-w-3xl">
          <div className="flex items-center justify-between mb-6">
            <Link
              href="/admin/dashboard"
              className="text-text-muted hover:text-accent text-sm transition-colors"
            >
              ← Back to Dashboard
            </Link>
            <span className="text-text-muted text-xs">
              {new Date(dbTicket.created_at).toLocaleString()}
            </span>
          </div>

          <div className="bg-secondary-bg border border-white/5 rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 flex flex-col gap-4 sm:gap-6">
            <div className="space-y-2">
              <span className="text-accent font-semibold text-sm break-all">
                {dbTicket.email || "N/A"}
              </span>
              <p className="text-text-secondary text-sm leading-relaxed border-l-2 border-accent/30 pl-4">
                {dbTicket.customer_text}
              </p>
            </div>

            <div className="border-t border-elevated pt-6">
              {analyzing && !analysisData && (
                <div className="flex flex-col items-center gap-3 py-10">
                  <span className="text-3xl animate-spin">⏳</span>
                  <p className="text-text-secondary font-medium">
                    Running AI analysis...
                  </p>
                </div>
              )}

              {error && !analysisData && (
                <div className="bg-red-900/20 border border-red-800 rounded-xl p-4 text-red-400 text-sm">
                  {error}
                </div>
              )}

              {analysisData && (
                <ResultsDisplay data={analysisData} />
              )}
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Loading state
  if (!feedback && !notFound) {
    return (
      <main className="min-h-screen bg-primary-bg flex flex-col items-center justify-center p-6">
        <p className="text-text-secondary">Loading feedback...</p>
      </main>
    );
  }

  // Not found state
  if (notFound) {
    return (
      <main className="min-h-screen bg-primary-bg flex flex-col items-center justify-center p-6">
        <div className="bg-secondary-bg border border-white/5 rounded-2xl shadow-lg p-8 max-w-md text-center flex flex-col gap-4">
          <div className="text-5xl">🔍</div>
          <h2 className="text-xl font-bold text-text-primary">Ticket Not Found</h2>
          <p className="text-text-secondary text-sm">This feedback item could not be found.</p>
          <Link
            href="/admin/dashboard"
            className="mt-2 text-accent hover:text-accent-hover font-semibold text-sm transition-colors"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-primary-bg flex flex-col items-center justify-start p-6 md:p-10">
      <div className="w-full max-w-3xl">
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/admin/dashboard"
            className="text-text-muted hover:text-accent text-sm transition-colors"
          >
            ← Back to Dashboard
          </Link>
          <span className="text-text-muted text-xs">
            {new Date(feedback.timestamp).toLocaleString()}
          </span>
        </div>

        <div className="bg-secondary-bg border border-white/5 rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 flex flex-col gap-4 sm:gap-6">
          {/* Customer Info */}
          <div className="space-y-2">
            <span className="text-accent font-semibold text-sm break-all">
              {feedback.email}
            </span>
            <p className="text-text-secondary text-sm leading-relaxed border-l-2 border-accent/30 pl-4">
              {feedback.text}
            </p>
          </div>

          {/* Analysis Section */}
          <div className="border-t border-elevated pt-6">
            {analyzing && !feedback.analysis && (
              <div className="flex flex-col items-center gap-3 py-10">
                <span className="text-3xl animate-spin">⏳</span>
                <p className="text-text-secondary font-medium">
                  Running AI analysis...
                </p>
              </div>
            )}

            {error && !feedback.analysis && (
              <div className="bg-red-900/20 border border-red-800 rounded-xl p-4 text-red-400 text-sm">
                {error}
              </div>
            )}

            {feedback.analysis && (
              <ResultsDisplay data={feedback.analysis} />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
