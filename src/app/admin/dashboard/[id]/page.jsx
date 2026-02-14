"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ResultsDisplay from "@/components/ResultsDisplay";

export default function FeedbackDetailPage({ params }) {
  const { id } = use(params);
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const router = useRouter();

  // Auth guard — check localStorage with expiry
  useEffect(() => {
    try {
      const raw = localStorage.getItem("adminAuth");
      if (!raw) {
        router.replace("/admin");
        return;
      }
      const { expiresAt } = JSON.parse(raw);
      if (Date.now() >= expiresAt) {
        localStorage.removeItem("adminAuth");
        router.replace("/admin");
      }
    } catch {
      router.replace("/admin");
    }
  }, [router]);

  // Load ticket from DB
  useEffect(() => {
    async function loadTicket() {
      try {
        const res = await fetch("/api/feedbacks");
        const json = await res.json();
        if (json.success) {
          const found = json.data?.find((t) => String(t.id) === id);
          if (found) {
            setTicket(found);
            // Store in sessionStorage for draft viewer page
            if (found.drafts) {
              sessionStorage.setItem(
                "analysisResult",
                JSON.stringify({
                  urgency: found.urgency,
                  sentiment: found.sentiment,
                  summary: found.summary,
                  drafts: found.drafts,
                }),
              );
              sessionStorage.setItem("originalText", found.customer_text || "");
              sessionStorage.setItem("feedbackEmail", found.email || "");
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
      setLoading(false);
    }
    loadTicket();
  }, [id]);

  const analysisData = ticket?.drafts
    ? {
        urgency: ticket.urgency,
        sentiment: ticket.sentiment,
        summary: ticket.summary,
        drafts: ticket.drafts,
      }
    : null;

  // Loading state
  if (loading) {
    return (
      <main className="min-h-screen bg-primary-bg flex flex-col items-center justify-center p-6">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </main>
    );
  }

  // Not found state
  if (notFound || !ticket) {
    return (
      <main className="min-h-screen bg-primary-bg flex flex-col items-center justify-center p-6">
        <div className="bg-secondary-bg border border-white/5 rounded-2xl shadow-lg p-8 max-w-md text-center flex flex-col gap-4">
          <div className="text-5xl">🔍</div>
          <h2 className="text-xl font-bold text-text-primary">
            Ticket Not Found
          </h2>
          <p className="text-text-secondary text-sm">
            This feedback item could not be found.
          </p>
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
            {new Date(ticket.created_at).toLocaleString()}
          </span>
        </div>

        <div className="bg-secondary-bg border border-white/5 rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 flex flex-col gap-4 sm:gap-6">
          <div className="space-y-2">
            <span className="text-accent font-semibold text-sm break-all">
              {ticket.email || "N/A"}
            </span>
            <p className="text-text-secondary text-sm leading-relaxed border-l-2 border-accent/30 pl-4">
              {ticket.customer_text.length > 200
                ? ticket.customer_text.substring(0, 200) + "..."
                : ticket.customer_text}
            </p>
            {ticket.customer_text.length > 200 && (
              <details className="text-xs text-text-muted cursor-pointer">
                <summary className="hover:text-accent transition-colors">
                  Show full message
                </summary>
                <p className="text-text-secondary text-sm leading-relaxed mt-2 border-l-2 border-elevated pl-4">
                  {ticket.customer_text}
                </p>
              </details>
            )}
          </div>

          <div className="border-t border-elevated pt-6">
            {analysisData ? (
              <ResultsDisplay data={analysisData} />
            ) : (
              <p className="text-text-muted text-sm text-center py-6">
                Analysis not available for this ticket.
              </p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
