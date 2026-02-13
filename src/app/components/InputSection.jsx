"use client";
export default function InputSection({ onAnalyze, loading }) {
  return (
    <div className="border p-4 mb-4">
      <textarea
        id="inputText"
        className="border w-full p-2"
        placeholder="Frontend Team will style this..."
      />
      <button
        disabled={loading}
        onClick={() => onAnalyze(document.getElementById("inputText").value)}
        className="bg-blue-500 text-white p-2 mt-2"
      >
        {loading ? "Thinking..." : "Analyze (Backend Test)"}
      </button>
    </div>
  );
}
