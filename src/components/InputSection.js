import { useState } from 'react';

export default function InputSection({ onAnalyze, loading }) {
  const [email, setEmail] = useState("");

  const handleAnalyze = () => {
    if (onAnalyze && email.trim()) {
      onAnalyze(email);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <label
          htmlFor="customerEmail"
          className="block text-lg font-semibold text-accent mb-2"
        >
          Customer Email
        </label>
        <textarea
          id="customerEmail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
          className="w-full h-48 p-4 border-2 border-elevated rounded-xl bg-elevated focus:border-accent focus:ring-2 focus:ring-accent/30 focus:outline-none transition-all resize-none disabled:opacity-50 disabled:cursor-not-allowed text-text-primary placeholder:text-text-muted shadow-sm"
          placeholder="Paste the customer email content here..."
        />
      </div>
      <button
        onClick={handleAnalyze}
        disabled={loading || !email.trim()}
        className="w-full bg-accent hover:bg-accent-hover active:bg-accent-active text-text-on-accent font-bold py-3 px-6 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md"
      >
        {loading ? (
          <>
            <span className="inline-block animate-spin">⏳</span>
            <span>Analyzing...</span>
          </>
        ) : (
          "Analyze Email"
        )}
      </button>
    </div>
  );
}
