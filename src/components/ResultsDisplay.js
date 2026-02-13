import Link from "next/link";

export default function ResultsDisplay({ data }) {
  const getBadgeColor = (score) => {
    if (score >= 80) return "bg-red-900/40 text-red-400 border-red-800";
    if (score >= 50) return "bg-yellow-900/40 text-yellow-400 border-yellow-800";
    return "bg-green-900/40 text-green-400 border-green-800";
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Header with Urgency Badge */}
      <div className="flex flex-col md:flex-row justify-between items-center border-b border-elevated pb-6 gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-accent mb-1">Analysis Results</h2>
          <p className="text-base text-text-secondary">Detected Sentiment: <span className="font-semibold text-text-primary">{data.sentiment}</span></p>
        </div>
        <div className={`px-6 py-2 rounded-full border-2 font-bold text-lg shadow-sm ${getBadgeColor(data.urgency)}`}>
          Urgency: {data.urgency}/100
        </div>
      </div>

      {/* Response Cards */}
      <div className="space-y-4">
        <h3 className="font-semibold text-accent text-lg">Recommended Drafts:</h3>
        <div className="grid gap-4">
          {Object.entries(data.drafts).map(([key, draft]) => (
            <Link key={key} href={`/result/draft/${key}`} className="block p-5 border-2 border-elevated rounded-xl hover:border-accent cursor-pointer transition-colors bg-elevated shadow-sm">
              <span className="text-xs font-bold uppercase tracking-wider text-accent mb-1 block">
                {key}
              </span>
              <p className="text-text-secondary text-base leading-relaxed">{draft.preview}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}