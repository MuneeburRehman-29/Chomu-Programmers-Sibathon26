import ResultsDisplay from "../../components/ResultsDisplay";
import { dummyResponse } from "../fakeData";

export default function ResultPage() {
  // In a real app, fetch or receive data via context, params, or API
  const data = dummyResponse;

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-100 to-gray-50 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-lg p-8 flex flex-col gap-6">
        <h1 className="text-3xl font-bold text-blue-700 mb-2 text-center">Results</h1>
        <ResultsDisplay data={data} />
        <a href="/input" className="mt-6 text-blue-600 hover:underline text-center">Back to Input</a>
      </div>
    </main>
  );
}
