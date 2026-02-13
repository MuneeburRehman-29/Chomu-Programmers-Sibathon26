"use client";
export default function ResultsDisplay({ data, onSave }) {
  return (
    <div className="border p-4 bg-gray-50">
      <h2 className="font-bold text-lg">Urgency: {data.urgency}/100</h2>
      <p className="text-sm text-gray-600 mb-4">Sentiment: {data.sentiment}</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-2">
        {Object.entries(data.drafts).map(([key, text]) => (
          <div key={key} className="border rounded p-4 bg-white flex flex-col">
            <h3 className="font-semibold capitalize mb-2">{key}</h3>
            <p className="text-sm text-gray-700 flex-1 mb-3">{text}</p>
            <button
              onClick={() => onSave(text)}
              className="bg-blue-500 text-white px-3 py-1.5 rounded text-sm mt-auto"
            >
              Select & Save
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
