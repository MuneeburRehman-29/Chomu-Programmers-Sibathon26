'use client' // Required for State

import { useState } from 'react';
import InputSection from '../components/InputSection';
import ResultsDisplay from '../components/ResultsDisplay';
import { dummyResponse } from './fakeData'; // Your fake data

export default function Home() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  // This FAKES the backend. 
  // Later, you will replace this with the real API call.
  const handleAnalyze = async (text) => {
    setLoading(true);
    
    // Fake a 2-second delay to simulate AI thinking
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setData(dummyResponse); // Load the fake data
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-gray-50 p-10 flex flex-col items-center gap-8">
      <h1 className="text-3xl font-bold text-gray-800">Smart-Response HQ</h1>
      
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Your Component */}
        <div className="bg-white p-6 rounded-xl shadow-md">
           <InputSection onAnalyze={handleAnalyze} loading={loading} />
        </div>

        {/* Vijay's Component */}
        <div className="bg-white p-6 rounded-xl shadow-md min-h-[300px]">
          {data ? (
            <ResultsDisplay data={data} />
          ) : (
            <div className="text-gray-400 flex items-center justify-center h-full">
              Results will appear here...
            </div>
          )}
        </div>
      </div>
    </main>
  );
}