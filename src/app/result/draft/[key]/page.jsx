"use client";

import { use, useEffect, useState, useRef } from "react";
import Link from "next/link";
import { dummyResponse } from "@/app/fakeData";
import { saveTicket } from "@/app/actions";

export default function DraftPage({ params }) {
  const { key } = use(params);
  const [data, setData] = useState(null);
  const [originalText, setOriginalText] = useState("");
  const [feedbackEmail, setFeedbackEmail] = useState("");
  const [saving, setSaving] = useState(false);
  const [emailMenuOpen, setEmailMenuOpen] = useState(false);
  const emailMenuRef = useRef(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("analysisResult");
    const storedText = sessionStorage.getItem("originalText");
    const storedEmail = sessionStorage.getItem("feedbackEmail");
    if (stored) {
      setData(JSON.parse(stored));
      setOriginalText(storedText || "");
      setFeedbackEmail(storedEmail || "");
    } else {
      setData(dummyResponse);
    }
  }, []);

  // Close email menu on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (emailMenuRef.current && !emailMenuRef.current.contains(e.target)) {
        setEmailMenuOpen(false);
      }
    }
    if (emailMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [emailMenuOpen]);

  if (!data) {
    return (
      <main className="min-h-screen bg-linear-to-br from-primary-bg via-gray-900 to-black flex flex-col items-center justify-center p-6 relative overflow-hidden">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </main>
    );
  }

  const draft = data.drafts[key];

  if (!draft) {
    return (
      <main className="min-h-screen bg-linear-to-br from-primary-bg via-gray-900 to-black flex flex-col items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-200 h-150 bg-accent/20 rounded-full blur-[100px] opacity-50 pointer-events-none" />
        <div className="w-full max-w-xl relative z-10 bg-secondary-bg/80 backdrop-blur-xl border border-white/5 rounded-2xl shadow-2xl p-8 text-center">
          <h1 className="text-2xl font-bold text-text-primary mb-4">Draft not found</h1>
          <Link href="/result" className="text-accent hover:text-accent-hover hover:underline transition-colors">
            ← Back to Results
          </Link>
        </div>
      </main>
    );
  }

  const handleSave = async () => {
    setSaving(true);
    try {
      const result = await saveTicket({
        originalText,
        email: feedbackEmail,
        urgency: data.urgency,
        sentiment: data.sentiment,
        drafts: data.drafts,
        finalSelection: draft.full,
        summary: data.summary,
      });
      if (result.success) {
        alert("Saved to database!");
      } else {
        alert("Save failed: " + (result.error || "Unknown error"));
      }
    } catch (err) {
      console.error("Save error:", err);
      alert("Failed to save: " + err.message);
    }
    setSaving(false);
  };

  const handleSendEmail = (provider) => {
    const to = feedbackEmail || "";
    const subject = "Re: Your Feedback";
    const body = draft.full;

    let url = "";
    switch (provider) {
      case "gmail":
        url = `https://mail.google.com/mail/?view=cm&to=${encodeURIComponent(to)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        break;
      case "outlook":
        url = `https://outlook.live.com/mail/0/deeplink/compose?to=${encodeURIComponent(to)}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        break;
      case "yahoo":
        url = `https://compose.mail.yahoo.com/?to=${encodeURIComponent(to)}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        break;
      default:
        url = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    }
    window.open(url, "_blank");
    setEmailMenuOpen(false);
  };

  return (
    <main className="min-h-screen bg-linear-to-br from-primary-bg via-gray-900 to-black flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-200 h-150 bg-accent/20 rounded-full blur-[100px] opacity-50 pointer-events-none" />
      <div className="w-full max-w-2xl relative z-10 bg-secondary-bg/80 backdrop-blur-xl border border-white/5 rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8 flex flex-col gap-4 sm:gap-6">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-accent">
            {key} draft
          </span>
          <Link href="/result" className="text-text-muted hover:text-accent text-sm transition-colors">
            ← Back to Results
          </Link>
        </div>
        <div className="border-t border-elevated pt-6">
          <p className="text-text-primary text-base leading-relaxed whitespace-pre-line">
            {draft.full}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row sm:flex-wrap sm:justify-end gap-2 sm:gap-3">
          <button
            onClick={() => navigator.clipboard.writeText(draft.full)}
            className="w-full sm:w-auto bg-elevated hover:bg-elevated/80 text-text-primary font-bold py-2.5 sm:py-2 px-5 rounded-xl transition-all duration-200 shadow-md border border-elevated text-sm sm:text-base"
          >
            Copy to Clipboard
          </button>
          <div className="relative w-full sm:w-auto" ref={emailMenuRef}>
            <button
              onClick={() => setEmailMenuOpen((prev) => !prev)}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 sm:py-2 px-5 rounded-xl transition-all duration-200 shadow-md text-sm sm:text-base flex items-center justify-center gap-2"
            >
              Send via Email
              <svg className={`w-4 h-4 transition-transform ${emailMenuOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>
            {emailMenuOpen && (
              <div className="absolute bottom-full mb-2 left-0 right-0 sm:left-auto sm:right-0 sm:w-48 bg-elevated border border-white/10 rounded-xl shadow-xl overflow-hidden z-50">
                <button onClick={() => handleSendEmail("gmail")} className="w-full text-left px-4 py-2.5 text-sm text-text-primary hover:bg-white/5 transition-colors">
                  📧 Gmail
                </button>
                <button onClick={() => handleSendEmail("outlook")} className="w-full text-left px-4 py-2.5 text-sm text-text-primary hover:bg-white/5 transition-colors">
                  📨 Outlook
                </button>
                <button onClick={() => handleSendEmail("yahoo")} className="w-full text-left px-4 py-2.5 text-sm text-text-primary hover:bg-white/5 transition-colors">
                  📩 Yahoo Mail
                </button>
              </div>
            )}
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full sm:w-auto bg-accent hover:bg-accent-hover active:bg-accent-active text-text-on-accent font-bold py-2.5 sm:py-2 px-5 rounded-xl transition-all duration-200 shadow-md disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
          >
            {saving ? "Saving..." : "Select & Save"}
          </button>
        </div>
      </div>
    </main>
  );
}
