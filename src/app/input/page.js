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
    <main className="min-h-screen bg-primary-bg flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-xl bg-secondary-bg rounded-2xl shadow-lg p-8 flex flex-col gap-6">
        <h1 className="text-4xl font-extrabold text-accent mb-2 text-center">Smart-Response HQ</h1>
        <p className="text-text-secondary text-center mb-4">Enter your prompt below to get started.</p>
        <InputSection onAnalyze={handleAnalyze} loading={loading} />
      </div>
    </main>
  );
}
