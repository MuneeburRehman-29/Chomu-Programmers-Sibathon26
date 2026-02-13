export default function ResultsDisplay({ data }) {
  // Color logic for the badge
  const getBadgeColor = (score) => {
    if (score >= 80) return "bg-red-100 text-red-800 border-red-200";
    if (score >= 50) return "bg-yellow-100 text-yellow-800 border-yellow-200";
    return "bg-green-100 text-green-800 border-green-200";
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header with Urgency Badge */}
      <div className="flex justify-between items-center border-b pb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Analysis Results</h2>
          <p className="text-sm text-gray-500">Detected Sentiment: <span className="font-medium text-gray-800">{data.sentiment}</span></p>
        </div>
        <div className={`px-4 py-2 rounded-full border font-bold ${getBadgeColor(data.urgency)}`}>
          Urgency: {data.urgency}/100
        </div>
      </div>

      {/* Response Cards */}
      <div className="space-y-4">
        <h3 className="font-semibold text-gray-700">Recommended Drafts:</h3>
        
        <div className="grid gap-4">
          {Object.entries(data.drafts).map(([key, text]) => (
            <div key={key} className="p-4 border rounded-lg hover:border-blue-400 cursor-pointer transition-colors bg-gray-50">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1 block">
                {key}
              </span>
              <p className="text-gray-800 text-sm leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}