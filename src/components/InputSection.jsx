import { useState } from "react";

export default function InputSection({ onAnalyze, loading }) {
  const [feedbackText, setFeedbackText] = useState("");
  const [email, setEmail] = useState("");

  const handleAnalyze = () => {
    if (onAnalyze && feedbackText.trim() && email.trim()) {
      onAnalyze(feedbackText, email);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Email Field */}
      <div>
        <label
          htmlFor="customerEmailAddr"
          className="block text-base sm:text-lg font-semibold text-accent mb-1.5 sm:mb-2"
        >
          Your Email
        </label>
        <input
          id="customerEmailAddr"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
          className="w-full p-4 border-2 border-elevated rounded-xl bg-elevated focus:border-accent focus:ring-2 focus:ring-accent/30 focus:outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed text-text-primary placeholder:text-text-muted shadow-sm"
          placeholder="you@example.com"
        />
      </div>

      {/* Feedback Text Field */}
      <div>
        <label
          htmlFor="customerFeedback"
          className="block text-base sm:text-lg font-semibold text-accent mb-1.5 sm:mb-2"
        >
          Your Feedback
        </label>
        <textarea
          id="customerFeedback"
          value={feedbackText}
          onChange={(e) => setFeedbackText(e.target.value)}
          disabled={loading}
          className="w-full h-28 sm:h-36 md:h-44 p-3 sm:p-4 border-2 border-elevated rounded-xl bg-elevated focus:border-accent focus:ring-2 focus:ring-accent/30 focus:outline-none transition-all resize-none disabled:opacity-50 disabled:cursor-not-allowed text-text-primary placeholder:text-text-muted shadow-sm"
          placeholder="Describe your issue or feedback in detail..."
        />
      </div>

      <button
        onClick={handleAnalyze}
        disabled={loading || !feedbackText.trim() || !email.trim()}
        className="w-full bg-accent hover:bg-accent-hover active:bg-accent-active text-text-on-accent font-bold py-3 px-6 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md"
      >
        {loading ? (
          <>
            <span className="inline-block animate-spin">⏳</span>
            <span>Submitting...</span>
          </>
        ) : (
          "Submit Feedback"
        )}
      </button>
    </div>
  );
}
