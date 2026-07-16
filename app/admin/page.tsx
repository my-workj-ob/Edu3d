'use client';

import React, { useState, useEffect } from "react";
import {
  Users,
  MessageSquare,
  Trash2,
  Lock,
  ArrowLeft,
  RefreshCw,
  Search,
  Download,
  Calendar,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";

interface WaitlistRecord {
  id: string;
  email: string;
  suggestion?: string;
  created_at: string;
}

export default function AdminDashboard() {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [records, setRecords] = useState<WaitlistRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Stats
  const totalCount = records.length;
  const countWithSuggestions = records.filter(r => r.suggestion && r.suggestion.trim()).length;

  const fetchRecords = async (pass: string) => {
    setLoading(true);
    setErrorMsg("");
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!supabaseUrl) {
      setErrorMsg("Supabase URL not configured in environment.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${supabaseUrl}/rest/v1/waitlist?select=*&order=created_at.desc`, {
        headers: {
          "apikey": pass.trim(),
          "Authorization": `Bearer ${pass.trim()}`,
        },
      });
      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          throw new Error("Invalid key. Please enter a valid Supabase service_role key.");
        }
        throw new Error("Failed to fetch records. Make sure the database schema is correct.");
      }
      const data = await response.json();
      if (!Array.isArray(data)) {
        throw new Error("Invalid response format received from Supabase.");
      }
      setRecords(data);
      setIsAuthenticated(true);
      setErrorMsg("");
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to load admin data.");
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) return;
    fetchRecords(password);
  };

  const handleDeleteRecord = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this waitlist entry?")) return;
    setActionLoading(id);
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    try {
      const response = await fetch(`${supabaseUrl}/rest/v1/waitlist?id=eq.${id}`, {
        method: "DELETE",
        headers: {
          "apikey": password.trim(),
          "Authorization": `Bearer ${password.trim()}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to delete record.");
      }
      setSuccessMsg("Entry deleted successfully!");
      // Filter out deleted entry from state
      setRecords(prev => prev.filter(rec => rec.id !== id));
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err: any) {
      alert(err.message || "Error deleting record.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPassword("");
    setRecords([]);
  };

  // Filtered records
  const filteredRecords = records.filter((rec) => {
    const q = searchQuery.toLowerCase();
    return (
      rec.email.toLowerCase().includes(q) ||
      (rec.suggestion && rec.suggestion.toLowerCase().includes(q))
    );
  });

  // Export to CSV
  const handleExportCSV = () => {
    if (records.length === 0) return;
    const headers = ["ID", "Email", "Suggestion", "Signed Up At"];
    const rows = records.map((rec) => [
      rec.id,
      rec.email,
      rec.suggestion || "",
      rec.created_at,
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.map(val => `"${val.replace(/"/g, '""')}"`).join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `waitlist_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--ink)] font-sans pb-16 relative">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        :root {
          --bg: #FFFCF6;
          --surface: #FFFFFF;
          --ink: #241F2E;
          --muted: #6E6B7A;
          --coral: #FF6B4A;
          --coral-dark: #E8532F;
          --teal: #14B8A6;
          --violet: #8B7CF6;
          --yellow: #FFC94A;
          --blob-pink: #FFE4D9;
          --blob-mint: #D9F5EE;
          --blob-lav: #EAE5FF;
          --ring: rgba(255,107,74,0.35);
        }
        .font-display { font-family: 'Baloo 2', sans-serif; }
        body { font-family: 'Plus Jakarta Sans', sans-serif; }
        .btn-primary {
          background: linear-gradient(135deg, var(--coral), #FF8A65);
          box-shadow: 0 10px 24px -8px rgba(255,107,74,0.55);
        }
        .btn-primary:hover { box-shadow: 0 14px 30px -8px rgba(255,107,74,0.65); }
      `}</style>

      {/* Soft background blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -left-24 w-[420px] h-[420px] rounded-full blur-3xl opacity-70" style={{ background: "var(--blob-pink)" }} />
        <div className="absolute top-40 -right-32 w-[460px] h-[460px] rounded-full blur-3xl opacity-70" style={{ background: "var(--blob-mint)" }} />
        <div className="absolute bottom-0 left-1/3 w-[380px] h-[380px] rounded-full blur-3xl opacity-60" style={{ background: "var(--blob-lav)" }} />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-30 backdrop-blur-md bg-[var(--bg)]/85 border-b border-black/[0.04] px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[var(--coral)] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-base font-display font-bold shadow-sm" style={{ background: "linear-gradient(135deg, var(--coral), var(--yellow))" }}>
              3D
            </div>
            <span className="text-base font-display font-bold text-[var(--ink)]">
              Edu3D <span style={{ color: "var(--coral)" }}>Admin</span>
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 mt-10 relative z-10">
        {!isAuthenticated ? (
          /* Login Card */
          <div className="max-w-md mx-auto mt-20 bg-white rounded-3xl p-8 border border-black/[0.04] shadow-[0_20px_50px_-20px_rgba(255,107,74,0.22)]">
            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-2xl bg-orange-50 text-[var(--coral)] flex items-center justify-center mx-auto mb-4">
                <Lock className="w-6 h-6" />
              </div>
              <h1 className="font-display font-extrabold text-2xl text-[var(--ink)]">
                Admin Verification
              </h1>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Please enter your **Supabase service_role API Key** as the password to safely authenticate client-side.
              </p>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                  Supabase Service Role Key
                </label>
                <input
                  type="password"
                  placeholder="Enter service_role key..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-black/10 px-4 py-3 text-sm focus:border-[var(--coral)] focus:ring-4 focus:ring-[var(--ring)] transition-all outline-none font-medium"
                  required
                />
              </div>

              {errorMsg && (
                <div className="flex items-center gap-2 text-xs font-semibold text-rose-600 bg-rose-50 px-4 py-2.5 rounded-xl border border-rose-100">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary text-white font-bold text-sm py-3 rounded-xl transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center gap-1.5"
              >
                {loading ? "Authenticating..." : "Unlock Dashboard"}
              </button>
            </form>
          </div>
        ) : (
          /* Dashboard Content */
          <div className="space-y-6">
            {/* Header Title & Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="font-display font-extrabold text-3xl text-[var(--ink)]">
                  Waitlist & Suggestions (Supabase)
                </h1>
                <p className="text-sm text-[var(--muted)] mt-0.5">
                  Manage registered waitlist signups and review user-submitted topic requests directly in Supabase.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => fetchRecords(password)}
                  disabled={loading}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-black/10 text-slate-600 font-semibold text-xs rounded-xl hover:bg-slate-50 cursor-pointer disabled:opacity-60 transition-all shadow-sm"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh
                </button>
                <button
                  onClick={handleExportCSV}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-black/10 text-slate-600 font-semibold text-xs rounded-xl hover:bg-slate-50 cursor-pointer transition-all shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" /> Export CSV
                </button>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-rose-50 border border-rose-100 text-rose-600 font-bold text-xs rounded-xl hover:bg-rose-100 cursor-pointer transition-all shadow-sm"
                >
                  Lock Panel
                </button>
              </div>
            </div>

            {/* Notification messages */}
            {successMsg && (
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 px-4 py-2.5 rounded-xl border border-emerald-100 shadow-sm">
                <CheckCircle className="w-4 h-4 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Card 1 */}
              <div className="bg-white rounded-2xl p-6 border border-black/[0.04] shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-orange-50 text-[var(--coral)] flex items-center justify-center shrink-0">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Total Signups
                  </span>
                  <span className="font-display font-extrabold text-2xl text-[var(--ink)]">
                    {totalCount}
                  </span>
                </div>
              </div>

              {/* Card 2 */}
              <div className="bg-white rounded-2xl p-6 border border-black/[0.04] shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <div>
                  <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                    With Suggestions
                  </span>
                  <span className="font-display font-extrabold text-2xl text-[var(--ink)]">
                    {countWithSuggestions}
                  </span>
                </div>
              </div>

              {/* Card 3 */}
              <div className="bg-white rounded-2xl p-6 border border-black/[0.04] shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                  <Calendar className="w-6 h-6" />
                </div>
                <div>
                  <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Active Session
                  </span>
                  <span className="font-body font-semibold text-sm text-slate-600 block">
                    Bypassing RLS (via Key)
                  </span>
                </div>
              </div>
            </div>

            {/* Filter Search */}
            <div className="bg-white border border-black/[0.04] rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div className="relative flex-grow max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <input
                  type="text"
                  placeholder="Search emails or suggestions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl bg-slate-50 border border-black/5 px-9 py-2.5 text-sm focus:bg-white focus:border-[var(--coral)] focus:ring-4 focus:ring-[var(--ring)] transition-all outline-none font-medium"
                />
              </div>
              <div className="text-xs font-bold text-slate-400 text-right">
                Showing {filteredRecords.length} of {totalCount} records
              </div>
            </div>

            {/* Records Table */}
            <div className="bg-white border border-black/[0.04] rounded-2xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-b border-black/[0.04]">
                      <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-wider text-xs w-[250px]">
                        Email
                      </th>
                      <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-wider text-xs">
                        Topic Suggestion
                      </th>
                      <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-wider text-xs w-[180px]">
                        Signed Up At
                      </th>
                      <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-wider text-xs w-[80px] text-center">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/[0.03]">
                    {filteredRecords.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-12 text-center text-slate-400">
                          {records.length === 0 ? "No signups yet." : "No matching records found."}
                        </td>
                      </tr>
                    ) : (
                      filteredRecords.map((rec) => (
                        <tr key={rec.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4 font-semibold text-[var(--ink)] whitespace-nowrap overflow-hidden text-ellipsis max-w-[250px]">
                            {rec.email}
                          </td>
                          <td className="px-6 py-4 text-slate-600">
                            {rec.suggestion && rec.suggestion.trim() ? (
                              <div className="bg-orange-50/20 border border-orange-100/30 rounded-xl p-3 text-xs leading-relaxed text-[#5F2B1D] font-medium max-w-lg">
                                {rec.suggestion}
                              </div>
                            ) : (
                              <span className="text-slate-300 italic text-xs">No suggestion provided</span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-xs font-semibold text-slate-400">
                            {new Date(rec.created_at).toLocaleString()}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <button
                              onClick={() => handleDeleteRecord(rec.id)}
                              disabled={actionLoading === rec.id}
                              className="p-2 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 transition-all cursor-pointer inline-flex items-center justify-center disabled:opacity-50"
                              title="Delete entry"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
