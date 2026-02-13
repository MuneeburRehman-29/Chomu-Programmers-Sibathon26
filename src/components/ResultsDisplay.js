export default function ResultsDisplay({ data }) {
  // Color logic for the badge
  const getBadgeColor = (score) => {
    if (score >= 80) return "bg-red-100 text-red-800 border-red-200";
    if (score >= 50) return "bg-yellow-100 text-yellow-800 border-yellow-200";
    return "bg-green-100 text-green-800 border-green-200";
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Header with Urgency Badge */}
      <div className="flex flex-col md:flex-row justify-between items-center border-b pb-6 gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-blue-700 mb-1">Analysis Results</h2>
          <p className="text-base text-gray-600">Detected Sentiment: <span className="font-semibold text-gray-800">{data.sentiment}</span></p>
        </div>
        <div className={`px-6 py-2 rounded-full border-2 font-bold text-lg shadow-sm ${getBadgeColor(data.urgency)}`}>
          Urgency: {data.urgency}/100
        </div>
      </div>

      {/* Response Cards */}
      <div className="space-y-4">
        <h3 className="font-semibold text-blue-700 text-lg">Recommended Drafts:</h3>
        <div className="grid gap-4">
          {Object.entries(data.drafts).map(([key, text]) => (
            <div key={key} className="p-5 border-2 border-blue-100 rounded-xl hover:border-blue-400 cursor-pointer transition-colors bg-blue-50 shadow-sm">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-1 block">
                {key}
              </span>
              <p className="text-gray-800 text-base leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}