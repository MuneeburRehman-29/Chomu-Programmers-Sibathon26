import { useState } from 'react';

export default function InputSection({ onAnalyze, loading }) {
  const [email, setEmail] = useState('');

  const handleAnalyze = () => {
    if (onAnalyze && email.trim()) {
      onAnalyze(email);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="mb-6">
        <label 
          htmlFor="customerEmail" 
          className="block text-lg font-semibold text-gray-700 mb-2"
        >
          Customer Email
        </label>
        <textarea
          id="customerEmail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
          className="w-full h-64 p-4 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all resize-none disabled:bg-gray-100 disabled:cursor-not-allowed text-gray-800"
          placeholder="Paste the customer email content here..."
        />
      </div>
      
      <button
        onClick={handleAnalyze}
        disabled={loading || !email.trim()}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <span className="inline-block animate-spin">⏳</span>
            <span>Analyzing...</span>
          </>
        ) : (
          'Analyze Email'
        )}
      </button>
    </div>
  );
}
