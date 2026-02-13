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
          className="block text-lg font-semibold text-blue-700 mb-2"
        >
          Customer Email
        </label>
        <textarea
          id="customerEmail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
          className="w-full h-48 p-4 border-2 border-blue-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all resize-none disabled:bg-gray-100 disabled:cursor-not-allowed text-gray-800 shadow-sm"
          placeholder="Paste the customer email content here..."
        />
      </div>
      <button
        onClick={handleAnalyze}
        disabled={loading || !email.trim()}
        className="w-full bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md"
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
