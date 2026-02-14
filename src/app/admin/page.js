"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "admin123";
const AUTH_DURATION_MS = 3 * 60 * 60 * 1000; // 3 hours

function isAdminAuthenticated() {
  if (typeof window === "undefined") return false;
  try {
    const raw = localStorage.getItem("adminAuth");
    if (!raw) return false;
    const { expiresAt } = JSON.parse(raw);
    return Date.now() < expiresAt;
  } catch {
    return false;
  }
}

function setAdminAuthenticated() {
  localStorage.setItem(
    "adminAuth",
    JSON.stringify({ authenticated: true, expiresAt: Date.now() + AUTH_DURATION_MS })
  );
}

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(true);
  const router = useRouter();

  // If already authenticated, skip straight to dashboard
  useEffect(() => {
    if (isAdminAuthenticated()) {
      router.replace("/admin/dashboard");
    } else {
      setChecking(false);
    }
  }, [router]);

  // Don't render the login form while checking auth
  if (checking) {
    return (
      <main className="min-h-screen bg-linear-to-br from-primary-bg via-gray-900 to-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </main>
    );
  }

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setAdminAuthenticated();
      router.push("/admin/dashboard");
    } else {
      setError("Invalid password. Please try again.");
    }
  };

  return (
    <main className="min-h-screen bg-linear-to-br from-primary-bg via-gray-900 to-black flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-200 h-150 bg-accent/20 rounded-full blur-[100px] opacity-50 pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <div className="bg-secondary-bg/80 backdrop-blur-xl border border-white/5 rounded-2xl shadow-2xl p-6 sm:p-8 md:p-10 flex flex-col gap-6 sm:gap-8">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 mx-auto rounded-full bg-accent/20 flex items-center justify-center text-3xl mb-3">
              🔒
            </div>
            <h1 className="text-3xl font-bold text-text-primary">
              Admin Login
            </h1>
            <p className="text-text-secondary text-sm">
              Enter your password to access the dashboard.
            </p>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            <div>
              <label
                htmlFor="adminPassword"
                className="block text-sm font-semibold text-accent mb-2"
              >
                Password
              </label>
              <input
                id="adminPassword"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                className="w-full p-4 border-2 border-elevated rounded-xl bg-elevated focus:border-accent focus:ring-2 focus:ring-accent/30 focus:outline-none transition-all text-text-primary placeholder:text-text-muted shadow-sm"
                placeholder="Enter admin password"
                autoFocus
              />
              {error && (
                <p className="mt-2 text-red-400 text-sm font-medium">
                  {error}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={!password.trim()}
              className="w-full bg-accent hover:bg-accent-hover active:bg-accent-active text-text-on-accent font-bold py-3 px-6 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
            >
              Sign In
            </button>
          </form>

          <div className="flex items-center justify-center gap-4">
            <Link
              href="/"
              className="text-text-muted hover:text-accent text-sm transition-colors"
            >
              ← Home
            </Link>
            <span className="text-text-muted">·</span>
            <Link
              href="/customer"
              className="text-text-muted hover:text-accent text-sm transition-colors"
            >
              Customer Page →
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
