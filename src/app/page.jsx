import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-linear-to-br from-primary-bg via-gray-900 to-black flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-200 h-150 bg-accent/20 rounded-full blur-[100px] opacity-50 pointer-events-none" />

      <div className="w-full max-w-5xl relative z-10 px-2 sm:px-0">
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-linear-to-r from-white to-gray-400 tracking-tight">
            Smart-Response HQ
          </h1>
          <p className="text-text-secondary text-sm sm:text-base md:text-lg mt-2 sm:mt-3 font-medium">
            AI-powered customer feedback analysis &amp; response drafting
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8">
          {/* Customer Card */}
          <Link
            href="/customer"
            className="group bg-secondary-bg/80 backdrop-blur-xl border border-white/5 rounded-2xl p-6 sm:p-8 md:p-10 flex flex-col items-center gap-4 sm:gap-5 hover:border-accent/50 transition-all duration-300 shadow-xl hover:shadow-accent/10"
          >
            <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
              💬
            </div>
            <h2 className="text-2xl font-bold text-text-primary">Customer</h2>
            <p className="text-text-secondary text-center text-sm">
              Submit your feedback and let our AI-powered system handle the rest.
            </p>
            <span className="mt-2 text-accent font-semibold text-sm group-hover:underline">
              Submit Feedback →
            </span>
          </Link>

          {/* Admin Card */}
          <Link
            href="/admin"
            className="group bg-secondary-bg/80 backdrop-blur-xl border border-white/5 rounded-2xl p-6 sm:p-8 md:p-10 flex flex-col items-center gap-4 sm:gap-5 hover:border-accent/50 transition-all duration-300 shadow-xl hover:shadow-accent/10"
          >
            <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
              🛡️
            </div>
            <h2 className="text-2xl font-bold text-text-primary">Admin</h2>
            <p className="text-text-secondary text-center text-sm">
              Access the dashboard to review, analyze, and respond to customer feedback.
            </p>
            <span className="mt-2 text-accent font-semibold text-sm group-hover:underline">
              Go to Dashboard →
            </span>
          </Link>
        </div>
      </div>
    </main>
  );
}
