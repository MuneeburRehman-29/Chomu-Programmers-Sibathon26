"use client";
export default function ResultsDisplay({ data, onSave }) {
  return (
    <div className="border p-4 bg-gray-50">
      <h2 className="font-bold">Urgency: {data.urgency}</h2>
      <div className="grid grid-cols-3 gap-2 my-2">
        {Object.entries(data.drafts).map(([key, text]) => (
          <button
            key={key}
            onClick={() => onSave(text)}
            className="border p-2 bg-white"
          >
            {key}
          </button>
        ))}
      </div>
    </div>
  );
}
