"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useFeedback } from "@/context/FeedbackContext";

export default function AdminDashboardPage() {
  const { feedbacks } = useFeedback();
  const [sortBy, setSortBy] = useState("newest");
  const [dbTickets, setDbTickets] = useState([]);
  const [loadingDb, setLoadingDb] = useState(true);
  const router = useRouter();

  // Auth guard — check localStorage with expiry
  useEffect(() => {
    try {
      const raw = localStorage.getItem("adminAuth");
      if (!raw) { router.replace("/admin"); return; }
      const { expiresAt } = JSON.parse(raw);
      if (Date.now() >= expiresAt) {
        localStorage.removeItem("adminAuth");
        router.replace("/admin");
      }
    } catch {
      router.replace("/admin");
    }
  }, [router]);

  // Fetch persisted tickets from Supabase
  useEffect(() => {
    async function fetchTickets() {
      try {
        const res = await fetch("/api/feedbacks");
        const json = await res.json();
        if (json.success) {
          setDbTickets(json.data || []);
        }
      } catch (err) {
        console.error("Failed to fetch tickets:", err);
      }
      setLoadingDb(false);
    }
    fetchTickets();
  }, []);

  // Merge context feedbacks + DB tickets into a unified list (deduplicated)
  const allItems = useMemo(() => {
    // DB tickets
    const dbItems = dbTickets.map((t) => ({
      id: String(t.id),
      email: t.email || "N/A",
      text: t.customer_text || "",
      created_at: t.created_at,
      urgency: t.urgency,
      source: "db",
    }));

    // Context feedbacks (in-memory) — skip if a matching DB ticket exists
    // to avoid showing the same submission twice
    const contextItems = feedbacks
      .filter((fb) => {
        return !dbItems.some(
          (db) =>
            db.email === fb.email &&
            db.text === fb.text
        );
      })
      .map((fb) => ({
        id: fb.id,
        email: fb.email,
        text: fb.text,
        created_at: fb.timestamp,
        urgency: fb.urgency,
        source: "context",
      }));

    return [...contextItems, ...dbItems];
  }, [feedbacks, dbTickets]);

  // Sorted list
  const sortedItems = useMemo(() => {
    const items = [...allItems];
    if (sortBy === "newest") {
      items.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    } else if (sortBy === "oldest") {
      items.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    } else if (sortBy === "urgency") {
      items.sort((a, b) => (b.urgency ?? -1) - (a.urgency ?? -1));
    }
    return items;
  }, [allItems, sortBy]);

  return (
    <main className="min-h-screen bg-primary-bg p-6 md:p-10">
      {/* Header */}
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-text-primary">
              Admin Dashboard
            </h1>
            <p className="text-text-secondary text-sm mt-1">
              {sortedItems.length} ticket{sortedItems.length !== 1 ? "s" : ""}{" "}
              total
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-elevated border border-elevated rounded-xl px-4 py-2 text-text-primary text-sm focus:outline-none focus:border-accent transition-colors cursor-pointer"
            >
              <option value="newest">Sort: Newest</option>
              <option value="oldest">Sort: Oldest</option>
              <option value="urgency">Sort: Urgency</option>
            </select>

            <Link
              href="/customer"
              className="text-text-muted hover:text-accent text-sm transition-colors"
            >
              Customer Page
            </Link>
            <Link
              href="/"
              className="text-text-muted hover:text-accent text-sm transition-colors"
            >
              ← Home
            </Link>
          </div>
        </div>

        {/* Loading State */}
        {loadingDb && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Empty State */}
        {!loadingDb && sortedItems.length === 0 && (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">📭</div>
            <h2 className="text-xl font-semibold text-text-primary mb-2">
              No feedback yet
            </h2>
            <p className="text-text-secondary">
              Customer submissions will appear here.
            </p>
          </div>
        )}

        {/* Ticket Grid */}
        {!loadingDb && sortedItems.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {sortedItems.map((item) => (
              <Link
                key={item.id}
                href={`/admin/dashboard/${item.id}`}
                className="group bg-secondary-bg border border-white/5 rounded-xl p-6 hover:border-accent/50 transition-all duration-200 shadow-md hover:shadow-accent/10 flex flex-col gap-3"
              >
                {/* Email + Date */}
                <div className="flex items-start justify-between gap-2">
                  <span className="text-accent font-semibold text-sm truncate max-w-[60%]">
                    {item.email}
                  </span>
                  <span className="text-text-muted text-xs whitespace-nowrap">
                    {new Date(item.created_at).toLocaleDateString()}
                  </span>
                </div>

                {/* Text Snippet */}
                <p className="text-text-secondary text-sm leading-relaxed line-clamp-3">
                  {item.text.length > 120
                    ? item.text.substring(0, 120) + "..."
                    : item.text}
                </p>

                {/* Badges */}
                <div className="flex items-center gap-2 mt-auto pt-2">
                  {item.text.length < 100 && (
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-green-900/40 text-green-400 border border-green-800">
                      Quick Read
                    </span>
                  )}
                  {item.urgency !== null && item.urgency !== undefined && (
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full border ${
                        item.urgency >= 80
                          ? "bg-red-900/40 text-red-400 border-red-800"
                          : item.urgency >= 50
                          ? "bg-yellow-900/40 text-yellow-400 border-yellow-800"
                          : "bg-green-900/40 text-green-400 border-green-800"
                      }`}
                    >
                      Urgency: {item.urgency}
                    </span>
                  )}
                  {item.urgency === null && (
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-gray-800/60 text-text-muted border border-gray-700">
                      Pending
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
