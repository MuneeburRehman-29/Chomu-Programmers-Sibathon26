"use client";
import InputSection from "../../components/InputSection";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function InputPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAnalyze = async (text) => {
    setLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setLoading(false);
    router.push("/result");
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-primary-bg via-gray-900 to-black flex flex-col items-center justify-center p-6 relative overflow-hidden">
      
      {/* Decorative background glow extended for the wider card */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-accent/20 rounded-full blur-[100px] opacity-50 pointer-events-none" />

      {/* Card Container - Changed max-w-xl to max-w-4xl for a wider layout */}
      <div className="w-full max-w-4xl relative z-10">
        <div className="bg-secondary-bg/80 backdrop-blur-xl border border-white/5 rounded-[2.5rem] shadow-2xl p-12 flex flex-col gap-10">
          
          <div className="space-y-3">
            <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 text-center tracking-tight">
              Smart-Response HQ
            </h1>
            <p className="text-text-secondary text-lg text-center font-medium max-w-2xl mx-auto">
              Enter your prompt below to get started.
            </p>
          </div>

          <InputSection onAnalyze={handleAnalyze} loading={loading} />
          
        </div>
      </div>
    </main>
  );
}
